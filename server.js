// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const weatherApp = express();
const PORT = 3000;

const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
const LIST_URL = "http://api.openweathermap.org/geo/1.0/direct";
const API_KEY = process.env.OPENWEATHER_API_KEY;
const FIVE_DAY_URL = "http://api.openweathermap.org/data/2.5/forecast";

weatherApp.use(express.json());
weatherApp.use(cors());
weatherApp.use(express.static("public"));

weatherApp.get("/weather/report", async (req, res) => {
  const city = req.query.city;
  const coordinates = req.query.coordinates;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    console.log(`Fetching weather data for: ${city}`);
    let coords = coordinates.split(",");
    const response = await axios.get(BASE_URL, {
      params: {
        lat: coords[0],
        lon: coords[1],
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherData = response.data;
    res.json({
      city: city,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      feels_like: weatherData.main.feels_like,
      humid: weatherData.main.humidity,
      icon: weatherData.weather[0].icon,
      wind_speed: weatherData.wind.speed,
      wind_direction: weatherData.wind.deg,
      visibility: weatherData.visibility,
      pressure: weatherData.main.pressure,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      date_time: weatherData.dt,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);

    if (error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else {
        res
          .status(error.response.status)
          .json({ error: error.response.data.message });
      }
    } else if (error.request) {
      res.status(500).json({ error: "No response from weather service" });
    } else {
      res.status(500).json({ error: "Request setup error" });
    }
  }
});

weatherApp.get("/weather/list", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    console.log(`Fetching cities with name: ${city}`);

    const response = await axios.get(LIST_URL, {
      params: {
        q: city,
        limit: 5,
        appid: API_KEY,
      },
    });

    const cityData = response.data;
    res.json(cityData);
  } catch (error) {
    console.error("Error fetching city data:", error.message);

    if (error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else {
        res
          .status(error.response.status)
          .json({ error: error.response.data.message });
      }
    } else if (error.request) {
      res.status(500).json({ error: "No response from weather service" });
    } else {
      res.status(500).json({ error: "Request setup error" });
    }
  }
});

weatherApp.get("/weather/forecast", async (req, res) => {
  const city = req.query.city;
  const coordinates = req.query.coordinates;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    console.log(`Fetching weather forecast for: ${city}`);
    let coords = coordinates.split(",");
    const response = await axios.get(FIVE_DAY_URL, {
      params: {
        lat: coords[0],
        lon: coords[1],
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherForecast = response.data;
    res.json(weatherForecast.list);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);

    if (error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else {
        res
          .status(error.response.status)
          .json({ error: error.response.data.message });
      }
    } else if (error.request) {
      res.status(500).json({ error: "No response from weather service" });
    } else {
      res.status(500).json({ error: "Request setup error" });
    }
  }
});

weatherApp.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
