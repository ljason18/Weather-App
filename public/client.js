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

function displayDropdown(cities) {
    dropdown.innerHTML = '';
    if (cities.length > 0) {
        cities.forEach(city => {
            const item = document.createElement('div');
            item.classList.add('dropdown-item');
            item.textContent = `${city.name}, ${city.state || ''}, ${city.country}`;
            item.addEventListener('click', function () {
                cityInput.value = `${city.name}, ${city.state || ''}, ${city.country}`;
                coordinates = `${city.lat},${city.lon}`;
                dropdown.innerHTML = '';
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

document.addEventListener('click', function (e) {
    if (!cityInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
})

// Fetching weather data and updating UI
getWeather.addEventListener('click', async () => {
    const currentUrl = `http://localhost:${PORT}/weather/report?city=${encodeURIComponent(cityInput.value)}&coordinates=${encodeURIComponent(coordinates)}`;
    const futureUrl = `http://localhost:${PORT}/weather/forecast?city=${encodeURIComponent(cityInput.value)}&coordinates=${encodeURIComponent(coordinates)}`;

    try {
        const response = await fetch(currentUrl)

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();

        const fiveDay = await fetch(futureUrl)
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const forecast = await response;

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
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>Error: ${error.message}</p>`
    }
});
