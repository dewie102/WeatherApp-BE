const express = require("express");
const router = express.Router();

const openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const geocodeBaseURL = "http://api.openweathermap.org/geo/1.0";
const openWeatherAPIKey = process.env.OPENWEATHER_API;

router.get("/", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({
            error: "You need to provide both lat and lon of location",
        });
    }

    const resp = await getCurrentWeatherByLonAndLat({ lat, lon });
    res.send(resp);
});

router.get("/zip", async (req, res) => {
    let { zipcode, countryCode } = req.query;

    if (!zipcode) {
        return res.status(400).json({
            error: "You need to provide a zipcode of the location",
        });
    }

    if (!countryCode) {
        countryCode = "US";
    }

    const { lat, lon } = await getGeocodeLocationFromZip({
        zipcode,
        countryCode,
    });
    const response = await getCurrentWeatherByLonAndLat({ lat, lon });
    res.send(response);
});

async function getCurrentWeatherByLonAndLat({ lat, lon }) {
    const response = await fetch(
        `${openWeatherBaseUrl}?` +
            `lat=${lat}&lon=${lon}&` +
            `appid=${openWeatherAPIKey}&` +
            `units=imperial`
    );

    return await response.json();
}

async function getGeocodeLocationFromZip({ zipcode, countryCode }) {
    const response = await fetch(
        `${geocodeBaseURL}/zip?` +
            `zip=${zipcode},${countryCode}&` +
            `appid=${openWeatherAPIKey}`
    );

    return await response.json();
}

function formatCurrentWeatherResponseForFrontend(weatherData) {
    let response = {};
}

module.exports = router;