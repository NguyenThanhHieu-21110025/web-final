const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.Model');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:8080/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//     const existingUser = await User.findOne({ email: profile.emails[0].value });
//     if (existingUser) {
//         return done(null, existingUser);
//     }
//
//     const newUser = new User({
//         username: profile.displayName,
//         email: profile.emails[0].value,
//         password: null // Không cần mật khẩu khi đăng nhập qua Google
//     });
//
//     await newUser.save();
//     done(null, newUser);
// }));

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: "http://localhost:8080/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'emails']
// }, async (accessToken, refreshToken, profile, done) => {
//     const existingUser = await User.findOne({ email: profile.emails[0].value });
//     if (existingUser) {
//         return done(null, existingUser);
//     }
//
//     const newUser = new User({
//         username: profile.displayName,
//         email: profile.emails[0].value,
//         password: null
//     });
//
//     await newUser.save();
//     done(null, newUser);
// }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;