// Fetching weather data and updating UI
const submitButton = document.getElementById('submit')
submitButton.addEventListener('click', retrieve)

function retrieve() {
    const location = document.getElementById('location').value

    getWeather(location)
}

function getWeather(location) {

    fetch(apiUrl)
}