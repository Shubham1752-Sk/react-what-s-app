const express = require("express")
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
const UserRoutes = require("./routes/UserRoutes")
const database = require("./config/database");


dotenv.config()

database.connectToTB();

const PORT = process.env.PORT || 4000;
console.log(PORT)

app.use(express.json());
app.use(cors({
    origin:"*",
    
}))

app.use("/api/v1/auth",UserRoutes)

app.get('/',(req,res)=>{
    res.send(`<h1>Welcome to our my Backend Server</h1>`)
})

app.listen(PORT,()=>{
    console.log(`Server is running `)
})