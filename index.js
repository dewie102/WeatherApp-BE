require("dotenv").config();
const express = require("express");
const weatherAppRouter = require("./routes/weatherapp");
const openWeatherRouter = require("./routes/openweather");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/weatherapp/", weatherAppRouter);
app.use("/api/weatherapp/openweather", openWeatherRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
