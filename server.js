require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const hbs = require('hbs'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.Route');
const authRoutes = require('./routes/auth.Route');
const guestRoutes = require('./routes/guestRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const CommentRoutes = require('./routes/comment.Route');
const tagsRoutes = require('./routes/tag.Route');
const mediaRoutes = require('./routes/media.Route');


app.use(express.json());

const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1);
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, 
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    });

const corsOptions = { origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true };

app.use(cors(corsOptions));
app.use(cookieParser());

// Set view engine
app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/guest', guestRoutes);
app.use('/subscriber', subscriberRoutes);

app.use('/api/comment', CommentRoutes);
// app.use('/api', require('./routes/Subscription.Routes'));
app.use('/api/tag', tagsRoutes);
app.use('/api/media', mediaRoutes);



app.use(express.static('public/css'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
