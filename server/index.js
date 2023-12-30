const express = require("express")
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
const UserRoutes = require("./routes/UserRoutes")
const profileRoutes = require("./routes/ProfileRoutes")
const chatRoutes = require("./routes/ChatRoutes")
const database = require("./config/database");
const fileUpload = require("express-fileupload")
const cloudinary = require("./config/cloudinary")

dotenv.config()

const PORT = process.env.PORT || 4000;
console.log(PORT)

app.use(express.json());
app.use(cors({
    origin:"*",
    
}))
app.use(fileUpload())

database.connectToTB();
cloudinary.connectToCloduinary()

app.use("/api/v1/auth",UserRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/chat",chatRoutes)

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to our my Backend Server</h1>`)
})

app.listen(PORT,()=>{
    console.log(`Server is running `)
})