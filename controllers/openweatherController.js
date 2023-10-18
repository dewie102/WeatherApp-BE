const openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5";
const geocodeBaseURL = "http://api.openweathermap.org/geo/1.0";
const airPollutionBaseURL =
  "http://api.openweathermap.org/data/2.5/air_pollution";
const openWeatherAPIKey = process.env.OPENWEATHER_API;

exports.openweather_current_weather_coords = async (req, res) => {
  const { lat, lon } = req.query;

  console.log("Hit openweather backend API, lon/lat");

  if (!lat || !lon) {
    return res.status(400).json({
      error: "You need to provide both lat and lon of location",
    });
  }

  const response = await getCurrentWeatherByLonAndLat({ lat, lon });
  const formatted = formatCurrentWeatherResponseForFrontend(response);
  res.send([formatted]);
};

exports.openweather_lon_lat_by_zip = async (req, res) => {
  let { zipcode, countryCode } = req.query;

  console.log("Hit openweather backend API, zip");

  if (!zipcode) {
    return res.status(400).json({
      error: "You need to provide a zipcode of the location",
    });
  }

  if (!countryCode) {
    countryCode = "US";
  }

  const response = await getGeocodeLocationFromZip({
    zipcode,
    countryCode,
  });

  if (Object.hasOwn(response, "cod")) {
    return res.status(parseInt(response.cod)).json({
      error: response.message,
    });
  }

  res.send({ lat: response.lat, lon: response.lon });
};

exports.openweather_current_airpollution = async (req, res) => {
  const { lat, lon } = req.query;

  console.log("Hit openweather air pollution backend API, lon/lat");

  if (!lat || !lon) {
    return res.status(400).json({
      error: "You need to provide both lat and lon of location",
    });
  }

  res.send({ airPollution: await getCurrentAirPollution({ lat, lon }) });
};

exports.openweather_forecast_weather_coords = async (req, res) => {
  let { lat, lon, count } = req.query;

  console.log("Hit openweather backend API, Hourly");

  if (!lat || !lon) {
    return res.status(400).json({
      error: "You need to provide both lat and lon of location",
    });
  }

  if (!count) {
    count = 4;
  }

  const response = await getForecastWeatherByLonAndLat({ lat, lon, count });

  result = [];
  response.list.forEach((dataPoint) => {
    const formatted = formatCurrentWeatherResponseForFrontend(dataPoint);
    result.push(formatted);
  });

  res.send(result);
};

async function getCurrentWeatherByLonAndLat({ lat, lon }) {
  const weatherData = await fetch(
    `${openWeatherBaseUrl}/weather?` +
      `lat=${lat}&lon=${lon}&` +
      `appid=${openWeatherAPIKey}&` +
      `units=imperial`
  );

  const response = await weatherData.json();
  return response;
}

async function getCurrentAirPollution({ lat, lon }) {
  const airPollution = await fetch(
    `${airPollutionBaseURL}?` +
      `lat=${lat}&lon=${lon}&` +
      `appid=${openWeatherAPIKey}`
  );

  const response = await airPollution.json();
  return getPollutionIndexName(response.list[0].main.aqi);
}

async function getGeocodeLocationFromZip({ zipcode, countryCode }) {
  const response = await fetch(
    `${geocodeBaseURL}/zip?` +
      `zip=${zipcode},${countryCode}&` +
      `appid=${openWeatherAPIKey}`
  );

  return await response.json();
}

async function getForecastWeatherByLonAndLat({ lat, lon, count }) {
  const weatherData = await fetch(
    `${openWeatherBaseUrl}/forecast?` +
      `lat=${lat}&lon=${lon}&` +
      `appid=${openWeatherAPIKey}&` +
      `units=imperial&` +
      `cnt=${count}`
  );

  return await weatherData.json();
}

function formatCurrentWeatherResponseForFrontend(weatherData) {
  let response = {
    temp: weatherData.main.temp,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    description: weatherData.weather[0].main,
    iconUrl: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
    datetime: weatherData.dt_txt,
  };

  return response;
}

function getPollutionIndexName(index) {
  if (index === 1) {
    return "Good";
  } else if (index === 2) {
    return "Fair";
  } else if (index === 3) {
    return "Moderate";
  } else if (index === 4) {
    return "Poor";
  } else if (index === 5) {
    return "Very Poor";
  }
}
