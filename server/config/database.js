const mongoose = require('mongoose')
require('dotenv').config();

async function connectToTB(){
    mongoose.connect(process.env.MONGODB_URL,{
        // userNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then( console.log("Connected to DB"))
    .catch((error)=>{
        console.log(`Error connecting to database: ${error}`);
        process.exit(1);
    })
}

module.exports = {connectToTB}

