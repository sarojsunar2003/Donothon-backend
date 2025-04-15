const cloudanry = require("cloudinary").v2

const uploadFileToCloudanry = async (file) => {

    cloudanry.config({
        cloud_name: "dfoed6bvj",
        api_key: "136625917665994",
        api_secret: "fmL1oODG6p7RhZRCbzoxSQKs5L4"
    });
    console.log(file)
    const res = await cloudanry.uploader.upload(file);
    return res;
}

module.exports = { uploadFileToCloudanry }