const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    full_name: {
        type: String
    },
    pen_name: {
        type: String
    },
    date_of_birth: {
        type: Date
    },
    role: {
        type: String,
        enum: ['guest', 'subscriber', 'writer', 'editor', 'administrator'],
        default: 'guest'
    },
    subscription_expiry: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
