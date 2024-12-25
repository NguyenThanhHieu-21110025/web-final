class CloudinaryHelper {
    CLOUD_URL;

    constructor() {
        this.CLOUD_URL = `cloudinary://${process.env.CLOUDRADY_API_KEY}:${process.env.CLOUDRADY_SECRET}@deci5hpja`;
    }

}