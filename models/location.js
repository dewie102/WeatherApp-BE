const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
    lat: { type: String },
    lon: { type: String },
});

module.exports = mongoose.model("Location", locationSchema);
