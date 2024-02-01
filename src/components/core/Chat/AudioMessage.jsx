import React, { useRef, useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { FaMicrophone } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';

const AudioMessage = ({message}) => {

//   console.log(message)
  const [isPlaying, setIsPlaying] = useState(false)
//   const [waveform, setWaveForm] = useState(null)
  const [recordedAudio, setRecordedAudio] = useState(null)

  const audioRef = useRef(null)
  const waveformRef = useRef(null)
  const waveform = useRef(null)

  const handlePlayRecording = () => {
    if (recordedAudio) {
        waveform.stop();
        waveform.play();
        setIsPlaying(true);
    }
};

const handlePauseRecording = () => {
    if (recordedAudio) {
        waveform.stop();
        setIsPlaying(false);
    }
};

  useEffect(() => {
    if(waveformRef.current === 'null'){
        waveform.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#ccc',
            progressColor: '#3B87F5',
            cursorColor: '#7ae3c3',
            barWidth: 2,
            height: 30,
            responsive: true,
        });
    
        waveform.current.on('finish', () => {
            setIsPlaying(false);
        });

        return () => {
            waveform.current.destroy();
        };
    }
    
}, []);

   useEffect(()=>{
        // const audioUrl = URL.createObjectURL(message.media.url);
        // const audio =  new Audio(message.media.url);
        // setRecordedAudio(audio);
        // waveform.load(message.media.url);
        const audioFile = new File([message.media.url],"recording.mp3")
        // console.log(audioFile)
        const audioURL = `http://localhost:3000/${message.media.url}`
        // console.log("audioURL is: ",audioURL)
        // const audioElement = new Audio();
        // audioElement.src = URL.createObjectURL(message.media.url);
   },[])

  return (
    <div className='w-fit flex justify-center items-center gap-2'>
        <div className='relative w-[2rem] flex'>
            <div className='w-full bg-orange-400 h-8 rounded-full flex justify-center items-center hover:cursor-pointer'>
                {!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaPause onClick={handlePauseRecording} />}
            </div>  
            <FaMicrophone className={`absolute mt-6 ml-4 ${message.status ==='seen' ? "text-blue-400" : "text-gray-500"}`} /> 
        </div>
        Audio
        <audio ref={audioRef} />
        <div ref={waveformRef} />
    </div>
  )
}

export default AudioMessage