const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    penName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    dateOfBirth: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['guest', 'subscriber', 'writer', 'editor', 'administrator'],
        default: 'guest',
    },
    subscriptionExpiry: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
