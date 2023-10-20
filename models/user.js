const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favorites: [
        {
            locationName: { type: String, required: true },
            lat: { type: String, required: true },
            lon: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("user", userSchema);
