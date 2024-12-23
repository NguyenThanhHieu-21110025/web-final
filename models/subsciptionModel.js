const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  subscription_start: {
    type: Date,
    required: true,
    default: Date.now,
  },
  subscription_end: {
    type: Date,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
