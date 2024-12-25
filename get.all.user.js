const mongoose = require("mongoose");
const User = require("./models/user.Model");
const Article = require("./models/articleModel");

const run = async () => {
    try {
        mongoose
            .connect("mongodb+srv://honganhnguyen08102003:J2SvSRsrPqj4cu6n@cluster0.dq6e5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
            .then(async () => {
                await Article.updateMany({}, {$set: {author: mongoose.Types.ObjectId("676b5c95f7984d3550bcf2fa")}});
                console.log('updated');
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB:", err);
                process.exit(1);
            });
    } catch (error) {
        console.error("Error:", error);
        // Ensure connection is closed on error
        await mongoose.connection.close();
    }
};
run();