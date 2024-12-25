const cloudinary = require('cloudinary').v2;

class CloudinaryHelper {

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDRARY_NAME, // Replace with your cloud name
            api_key: process.env.CLOUDRADY_API_KEY, // Replace with your API key
            api_secret: process.env.CLOUDRADY_SECRET // Replace with your API secret
        });
    }

    async uploadImage(imagePath) {
        try {
            const result = await cloudinary.uploader.upload(imagePath);
            return result.secure_url;
        } catch (error) {
            console.error(error);
        }
    }

}