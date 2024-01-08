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

database.connectToTB();
cloudinary.connectToCloduinary()

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
// io.on("connection", (socket) => {
//     console.log("new connection",socket.id)

//     socket.on("joined",(data)=>{
//         console.log(data);
//         console.log(`${data._id} has joined`)
//     })
//     // global.chatSocket = socket;
//     // socket.on("add-user", (userId) =>{
//     //     // console.log(userId)
//     //     onlineUsers.set(userId, socket.id)
//     // });
//     // console.log(onlineUsers)
//     socket.on("send-msg",async(data)=>{
//         console.log("send event emited")
//         const sendUserSocket =await onlineUsers.get(data.to._id)
//         if(sendUserSocket){
//             socket.to(sendUserSocket).emit("msg-received",{
//                 from: data.from,
//                 message: data.message
//             })
//         }
//     })
//   });
  
httpServer.listen(PORT,()=>{
    console.log(`Server is running `)
});