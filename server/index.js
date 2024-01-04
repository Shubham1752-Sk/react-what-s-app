const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const database = require("./config/database");
const fileUpload = require("express-fileupload");
const cloudinary = require("./config/cloudinary");
const http = require("http");
const socketIO = require("socket.io");


const AuhtRoutes = require("./routes/AuthRoutes")
const profileRoutes = require("./routes/ProfileRoutes")
const chatRoutes = require("./routes/ChatRoutes")
const userRoutes = require("./routes/UserRoutes")

const app = express()
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }})
dotenv.config()

const PORT = process.env.PORT || 4000;
console.log(PORT)

app.use(express.json());
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

io.on("connection", () => {
    // ...
    console.log("new connection")
  });
  
httpServer.listen(PORT,()=>{
    console.log(`Server is running `)
});