// Fetching weather data and updating UI
document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    const port = 3000;
    const url = `http://localhost:${port}/weather?city=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        document.getElementById('weather-info').innerHTML = `
            <h2>Weather in ${data.city}</h2>
            <p>Temperature: ${data.temperature}°C</p>
            <p>Description: ${data.description}</p>
        `;
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `<p>Error: ${error.message}</p>`;
    }
});