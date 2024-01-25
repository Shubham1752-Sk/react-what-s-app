const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const database = require("./config/database");
const fileUpload = require("express-fileupload");
const cloudinary = require("./config/cloudinary");
const http = require("http");
const { Server } = require("socket.io");

const AuhtRoutes = require("./routes/AuthRoutes")
const profileRoutes = require("./routes/ProfileRoutes")
const chatRoutes = require("./routes/ChatRoutes")
const userRoutes = require("./routes/UserRoutes")

const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origins: "*",
      methods: ["GET", "POST"]
    }
})
dotenv.config()

const PORT = process.env.PORT || 4000;
console.log(PORT)

app.use(express.json({
    limit: '150mb'
  }));
app.use(cors({
    origin:"*",
}))
app.use(fileUpload({useTempFiles: true}))
app.use(express.urlencoded({
    extended : false
}))

database.connectToTB();
cloudinary.connectToCloduinary()

// app.use("/sendchatmessage",express.static("uploads/recordings"))
app.use("/api/v1/auth",AuhtRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/user",userRoutes)

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to my Backend Server</h1>`)
})

// app.listen(PORT,()=>{
//     console.log(`Server is running `)
// })

const onlineUsers = new Map()
io.on("connection", (socket) => {
    console.log("new connection",socket.id)

    socket.on("joined",({user})=>{
        console.log(user);
        console.log(`${user._id} has joined`)
        onlineUsers.set(user._id, socket.id)
        console.log(onlineUsers)
    })
    // global.chatSocket = socket;
    
    socket.on("send-msg",async(data)=>{
        console.log("send event emited")
        console.log(data)
        console.log(onlineUsers)
        const receiverSocket = await onlineUsers.get(data.to)
        console.log(`receiver ${data.to} socket is: `,receiverSocket)
        if(receiverSocket){
            socket.to(receiverSocket).emit("msg-received",{
                from: data.from,
                message: data.message,

            })
        }
    })
    socket.on('update-msg-status',async(data)=>{
        console.log('update msg status event emitted')
        const senderSocket = await onlineUsers.get(data.to)
        console.log(senderSocket)
        socket.to(senderSocket).emit('msg-seen')

    })
  });
  
httpServer.listen(PORT,()=>{
    console.log(`Server is running `)
});