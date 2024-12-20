const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }, // Refresh token 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ID của user sở hữu token
    expiresAt: { type: Date, required: true }, // Ngày hết hạn của refresh token
    createdAt: { type: Date, default: Date.now }, // Ngày tạo token
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
