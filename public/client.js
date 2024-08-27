const cityInput = document.getElementById('city-input')
const dropdown = document.getElementById('dropdown')
const getWeather = document.getElementById('get-weather')
let timeoutId
const PORT = 3000
let coordinates

// Fetching list of cities
cityInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim()
    if (query.length === 0) {
        dropdown.style.display = 'none'
        return
    }

    // Display loading indicator
    dropdown.innerHTML = '<div class="loading">Loading...</div>'
    dropdown.style.display = 'block'

    // Debounce the API call
    clearTimeout(timeoutId)

    timeoutId = setTimeout(async () => {
        const url = `http://localhost:${PORT}/weather/list?city=${encodeURIComponent(query)}`
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayDropdown(data)
        } catch (error) {
            console.error('Error fetching city data:', error);
            return [];
        }
    }, 300)
})

// Dropdown list of cities
function displayDropdown(cities) {
    dropdown.innerHTML = '';
    if (cities.length > 0) {
        cities.forEach(city => {
            const name = document.createElement('div');
            name.classList.add('dropdown-item');
            name.textContent = `${city.name}, ${city.state || ''}, ${city.country}`;
            name.addEventListener('click', function () {
                cityInput.value = `${city.name}, ${city.state || ''}, ${city.country}`;
                coordinates = `${city.lat},${city.lon}`;
                dropdown.innerHTML = '';
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(name);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!cityInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
})

// Fetching weather data and updating UI
getWeather.addEventListener('click', async () => {
    const currentUrl = `http://localhost:${PORT}/weather/report?city=${encodeURIComponent(cityInput.value)}&coordinates=${encodeURIComponent(coordinates)}`;

    try {
        const response = await fetch(currentUrl)

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error('City not found');
        }

        document.getElementById('weather-info').innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon" class="weather-icon">
            <div class="weather-details">
                <h2>Current Weather</h2>
                <p><strong>Updated on</strong>: ${new Date(data.date_time * 1000).toLocaleString()}</p>
                <p><strong>Temperature</strong>: ${data.temperature}°C</p>
                <p><strong>Feels like</strong>: ${data.feels_like}°C</p>
                <p><strong>Description</strong>: ${data.description}</p>
                <p><strong>Humidity</strong>: ${data.humid}%</p>
                <p><strong>Wind Speed</strong>: ${data.wind_speed} km/h</p>
                <p><strong>Wind Direction</strong>: ${data.wind_direction}°</p>
                <p><strong>Visibility</strong>: ${data.visibility / 1000} km</p>
                <p><strong>Pressure</strong>: ${data.pressure} hPa</p>
                <p><strong>Sunrise</strong>: ${new Date(data.sunrise * 1000).toLocaleTimeString()}</p>
                <p><strong>Sunset</strong>: ${new Date(data.sunset * 1000).toLocaleTimeString()}</p>
            </div>
        `
        await fiveDay(cityInput, coordinates);
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>Error: ${error.message}</p>`
    }
});

async function fiveDay(cityInput, coordinates) {
    const futureUrl = `http://localhost:${PORT}/weather/forecast?city=${encodeURIComponent(cityInput.value)}&coordinates=${encodeURIComponent(coordinates)}`;

    try {
        const response = await fetch(futureUrl)

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        const sortDates = {}
        data.forEach(threeHour => {
            const date = new Date(threeHour.dt * 1000).toLocaleDateString();
            if (!sortDates[date]) {
                sortDates[date] = [];
            }
            sortDates[date].push(threeHour);
        });

        document.getElementById('fiveDay-forecast').innerHTML = '<h2>5 Day Forecast: 3 Hour Intervals</h2>';
        Object.keys(sortDates).forEach(date => {
            const container = document.createElement('div');
            container.classList.add('forecast-day');
            const dateElement = document.createElement('h3');
            dateElement.textContent = date;
            container.appendChild(dateElement);

            sortDates[date].forEach(threeHour => {
                const { main: { temp, temp_min, temp_max }, weather } = threeHour;

                const weatherDetails = `
                <h4>${new Date(threeHour.dt * 1000).toLocaleTimeString()}</h4>
                <p>Temp: ${temp}°C</p>
                <p>Min Temp: ${temp_min}°C</p>
                <p>Max Temp: ${temp_max}°C</p>
                <p>Weather: ${weather[0].description}</p>
                `;

                container.innerHTML += weatherDetails;
            });

            document.getElementById('fiveDay-forecast').appendChild(container);
        });
    } catch (error) {
        document.getElementById('fiveDay-forecast').innerHTML = `<p>Error: ${error.message}</p>`
    }
}