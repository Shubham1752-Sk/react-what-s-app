import React, { useEffect, useState, useRef } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { IoIosSend } from 'react-icons/io';
import { FaMicrophone } from 'react-icons/fa';
import { sendMediaMessage } from '../../../services/operations/ChatAPI';
import WaveSurfer from 'wavesurfer.js';
import { useDispatch } from 'react-redux';

const RecordAudio = ({ setrecordAudio, userId, chatUserId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedAudio, setRecordedAudio] = useState();
    const [renderedAudio, setRenderedAudio] = useState();
    const [waveform, setWaveForm] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const chunks = []
    const audioChunks = []
    const dispatch = useDispatch()


    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const waveFormRef = useRef(null);
    const chunksRef = useRef(chunks);
    const audioChunksRef = useRef(audioChunks);

    let seconds = 0;
    let minutes = 0;

    const startTimer = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            // audioRef.current.src = audioBlob;

            //   const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                // console.log('chunks before: ', chunksRef.current);
                chunksRef.current.push(e.data);
                // console.log('chunks after: ', chunksRef.current);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
                const audioUrl = URL.createObjectURL(blob);
                console.log(audioUrl)
                const audio = new Audio(audioUrl);
                console.log(audio)
                setRecordedAudio(audio);
                waveform.load(audioUrl);
            };
            mediaRecorder.start();
            setIsRecording(true);
            setRecordedAudio(null)
        });
    };

    const pauseTimer = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            waveform.stop();

            //   const audioChunks = [];
            mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                console.log('audio chunks before: ', audioChunksRef.current);
                audioChunksRef.current.push(event.data);
                console.log('audio chunks after: ', audioChunksRef.current);
            });

            mediaRecorderRef.current.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                console.log(audioBlob)
                const audioFile = new File([audioBlob], 'recording.mp3');
                setRenderedAudio(audioFile);
            });
        }
    };

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveform.stop();
            waveform.play();
            recordedAudio.play()
            setIsPlaying(true);
        }
    };

    const handlePauseRecording = () => {
        if (recordedAudio) {
            waveform.stop();
            recordedAudio.pause()
            setIsPlaying(false);
        }
    };

    const sendMessage = () => {
        if(isRecording){
            setIsRecording(false)
            pauseTimer()
        }
        if (renderedAudio) {
            // console.log(media)
            resetStates()
            const blobURL = URL.createObjectURL(renderedAudio);
            console.log(blobURL)
            dispatch(sendMediaMessage({
                senderId: userId,
                receiverId: chatUserId,
                // url: blobURL,
                audiofile: renderedAudio
            }))

        }
    }

    const deleteRecording = () => {
        resetStates()
        handlePauseRecording();
        chunksRef.current.pop();
        audioChunksRef.current.pop();
    }

    const resetStates = () =>{
        setDuration(0);
        setIsPlaying(false);
        setIsRecording(false);
        setRecordedAudio(null)
        setRenderedAudio(null);
        setrecordAudio(false);
    }

    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: '#ccc',
            progressColor: '#3B87F5',
            cursorColor: '#7ae3c3',
            barWidth: 2,
            height: 30,
            responsive: true,
        });

        setWaveForm(waveSurfer);

        waveSurfer.on('finish', () => {
            setIsPlaying(false);
        });

        return () => {
            waveSurfer.destroy();
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration((duration) => duration + 1);
                // calculateDurationInMins(duration);
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        if (waveform) startTimer();
    }, [waveform]);

    function calculateDurationInMins(duration) {
        seconds = Math.floor(duration % 60);
        minutes = Math.floor(duration / 60);
        console.log('seconds: ', seconds);
        console.log('minutes: ', minutes);
    }

    return (
        <div className='w-full h-fit flex box-border justify-end items-center gap-4 px-1 bg-white bg-opacity-15 '>
            <div className='w-fit flex items-center py-1'>
                <button
                    className='w-2/12 text-4xl p-1 py-2 rounded-full cursor-pointer'
                    onClick={deleteRecording}
                >
                    <MdDelete className='cursor-pointer' />
                </button>

                <div className={`bg-red w-5 h-5 rounded-full bg-red-800 ${isRecording ? "block animate-pulse" : "hidden"}`} />

                <div className='w-fit ml-2 flex items-center bg-black bg-opacity-25 rounded-full box-border p-2 gap-2'>
                    <div className='flex '>
                        {isRecording ? (
                            <div className='flex gap-2 p-1 text-white'>Recording <span>{calculateDurationInMins(duration)}{minutes}:{seconds}</span></div>
                        ) : (
                            <div className='flex'>
                                {recordedAudio && (
                                    <>
                                        {!isPlaying ? (
                                            <FaPlay onClick={handlePlayRecording} />
                                        ) : (
                                            <FaPause onClick={handlePauseRecording} />
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div ref={waveFormRef} hidden={isRecording} className='w-32 overflow-x-auto' />
                    <audio ref={audioRef} hidden />
                    <button
                        className='w-2/12 text-3xl text-green-500 ml-2  '
                        onClick={isRecording ? pauseTimer : startTimer}
                    >
                        {isRecording ? <FaPause /> : <FaMicrophone className='text-red-600 border-red-400 border p-1 text-3xl' />}
                    </button>
                </div>
                <button className='w-fit z-40 p-2 bg-transparent bg-opacity-15 hover:bg-white hover:bg-opacity-15 rounded-sm hover:p-3 hover:text-xl duration-75 ease-in text-white text-3xl'>
                    <IoIosSend onClick={sendMessage} />
                </button>
            </div>
        </div>
    );
};

export default RecordAudio;
