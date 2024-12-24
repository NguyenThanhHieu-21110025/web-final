const mongoose = require("mongoose");
const Category = require("./models/categoryModel");
const {ur, fa} = require("@faker-js/faker");
const faker = require("@faker-js/faker").faker;
const ids = [
    '676a2ec4af1a6b5134892792', // social
    '676a2ec4af1a6b5134892793', // it
    '676a2ec4af1a6b5134892794', // ma
    '676a2ec4af1a6b5134892795', //fin
    '676a2ec4af1a6b5134892796', // de
    '676a2ec4af1a6b5134892797', // pho
    '676a2ec4af1a6b5134892798' // education
]
const categories = [
    {
        category_name: 'Primary Education',
    }, {
        category_name: 'Secondary Education',
    }, {
        category_name: 'Higher Education',
    }, {
        category_name: 'Vocational Training',
    }, {
        category_name: 'Arts and Humanities',
    }, {
        category_name: 'Teacher Training',
    }, {
        category_name: 'Educational Policy and Reform',
    }
];
const generateCategoriesWithChildren = (categories, id) => {
    return categories.map(c => {
        return {...c, parentId: mongoose.Types.ObjectId(id)}
    })
};
const run = async () => {
    try {
        mongoose
            .connect("mongodb+srv://honganhnguyen08102003:J2SvSRsrPqj4cu6n@cluster0.dq6e5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
            .then(async () => {
                const categoriesWithChildren = generateCategoriesWithChildren(categories, ids[6]);
                const result = await Category.insertMany(categoriesWithChildren);
                console.log("Fake Articles inserted:", result);
                await mongoose.connection.close();
                console.log("Connection closed!");
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