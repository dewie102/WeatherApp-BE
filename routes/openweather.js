const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("Routing on /api/weatherapp/openweather/");
    res.send("Routing on /api/weatherapp/openweather/");
});

module.exports = router;
