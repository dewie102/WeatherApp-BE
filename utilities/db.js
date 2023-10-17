const mongoose = require("mongoose");

const url =
    `mongodb+srv://` +
    `${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}` +
    `@cluster0.q7ehjkn.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
    connectDB: async () => {
        try {
            await mongoose.connect(url);
            console.log("Connected to DB");
        } catch (error) {
            console.log(error);
        }
    },
};
