// server.js

const express = require('express')
const axios = require('axios')
const cors = require('cors');
require('dotenv').config()

const weatherApp = express()
const PORT = 3000;

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const API_KEY = process.env.OPENWEATHER_API_KEY


weatherApp.use(express.json())
weatherApp.use(cors());
weatherApp.use(express.static('public'))

weatherApp.get('/weather', async (req, res) => {
    const city = req.query.city
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
      }
    
      try {
        console.log(`Fetching weather data for: ${city}`);
        
        const response = await axios.get(baseUrl, {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
          },
        });
    
        const weatherData = response.data;
    
        res.json({
          city: weatherData.name,
          temperature: weatherData.main.temp,
          description: weatherData.weather[0].description,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
    
        if (error.response) {
          if (error.response.status === 404) {
            res.status(404).json({ error: 'City not found' });
          } else {
            res.status(error.response.status).json({ error: error.response.data.message });
          }
        } else if (error.request) {
          res.status(500).json({ error: 'No response from weather service' });
        } else {
          res.status(500).json({ error: 'Request setup error' });
        }
      }
})

weatherApp.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})