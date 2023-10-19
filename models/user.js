const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favorites: [
        {
            locationName: { type: String, unique: true, required: true },
            lat: { type: Schema.Types.Decimal128, required: true },
            lon: { type: Schema.Types.Decimal128, required: true },
        },
    ],
});

module.exports = mongoose.model("user", userSchema);
