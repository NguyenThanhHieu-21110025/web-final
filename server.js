require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const hbs = require('hbs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRoutes = require('./routes/user.Route');
const authRoutes = require('./routes/auth.Route');
const guestRoutes = require('./routes/guestRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const writerRouters = require("./routes/writerRoutes");
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(morgan('combined'))
const dbURI = process.env.MONGODB_ALATS_URI;

if (!dbURI) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1);
}


const corsOptions = {origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true};

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
app.use("/writer", writerRouters);

app.use(express.static('public/css'));

const port = process.env.PORT || 8080;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    });


