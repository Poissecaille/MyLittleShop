const mongoose = require("mongoose");

const roles = ["buyer", "seller", "admin"]

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthdate: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    isAdmin: {
        type: Boolean, default: false
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("user", userSchema);