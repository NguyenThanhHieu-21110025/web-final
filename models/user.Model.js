const mongoose = require("mongoose");
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
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  full_name: {
    type: String,
    default: "",
  },
  pen_name: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["guest", "subscriber", "writer", "editor", "administrator"],
    default: "guest",
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
  admin: {
    type: Boolean,
    default: false,
  },
  subscription_expiry: {
    type: Date,
  },
  isVerified: {
    // Trường xác thực email
    type: Boolean,
    default: false,
  },
  verificationToken: {
    // Token xác thực email
    type: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
