const cloudinary = require('cloudinary');

async function connectToCloduinary(){
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET

        })
        console.log("Connected to cloudinary")
    } catch (error) {
        console.log(`Error connecting to database: ${error}`);
    }
}

module.exports = {connectToCloduinary}