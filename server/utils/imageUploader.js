const cloudinary = require("cloudinary")

exports.uploadToCloudinary = async(file, folder, height, quality)=>{
    console.log("in the controller")
    try {
        const options = {folder}
    // if(height){
    //     options.height = height;
    // }
    // if(quality){
    //     options.quality = quality;
    // }
    // options.resource_type = "auto";
    console.log("OPTIONS: ",options)

    return await cloudinary.uploader.upload(file, options)
    } catch (error) {
        console.log("error while uploading photo to cloudinary...",error)
        throw new Error(error);
    }
}