const mongoose = require("mongoose");
const Article = require("./models/articleModel");
const faker = require("@faker-js/faker").faker;
const Category = require("./models/categoryModel");

const generateCKEditorContent = () => {
    const title = faker.lorem.sentence();
    const paragraph1 = faker.lorem.paragraph(6);
    const paragraph2 = faker.lorem.paragraph(6);
    const paragraph3 = faker.lorem.paragraph(8);

    return `
        <h2>${title}</h2>
        <p>${paragraph1}</p>
        <p>${paragraph2}</p>
        <p>${paragraph3}</p>
    `;
};

const generateFakeArticles = (count, cats) => {
    const articles = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * cats.length);
        articles.push({
            title: faker.lorem.sentence(6), // Generate a title
            content: generateCKEditorContent(), // Generate content
            author: faker.database.mongodbObjectId(), // Fake author ID
            category: mongoose.Types.ObjectId(cats[randomIndex]), // Fake category ID
            tags: faker.helpers.arrayElements(
                ["JavaScript", "MongoDB", "Node.js", "Backend", "Frontend", "Database"],
                faker.number.int({min: 1, max: 3})
            ), // Random tags
            views: faker.number.int({min: 0, max: 100000}), // Random views
            summary: faker.lorem.sentences(3), // Generate a summary
            isPublished: faker.datatype.boolean(), // Random publication status
            publishBy: faker.database.mongodbObjectId(), // Fake publisher ID
            publishedAt: faker.datatype.boolean() ? faker.date.past() : faker.date.soon(), // Random publish date
            status: faker.helpers.arrayElement(["draft", "pending", "published", "denied"]), // Random status
            thumbnail: faker.image.url({width: 150}), // Fake image URL
            isPremium: faker.datatype.boolean(), // Random premium status
            note: faker.datatype.boolean() ? faker.lorem.sentence() : null, // Optional note
        });
    }
    return articles;
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
                // get all category first
                const cat = await Category.find({parentId: {$ne: null}});
                const fCat = cat.map(c => c._id);
                // Generate and insert fake articles
                const fakeArticles = generateFakeArticles(250, fCat); // Generate 10 fake articles
                const result = await Article.insertMany(fakeArticles);
                console.log("Fake Articles inserted:", result);

                // Close the connection
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