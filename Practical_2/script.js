const weatherData = {
    'ahmedabad': {
        temperature: 35,
        condition: 'Hot and Sunny',
        humidity: '60%',
        windSpeed: '12 km/h'
    },
    'surat': {
        temperature: 33,
        condition: 'Humid',
        humidity: '75%',
        windSpeed: '8 km/h'
    },
    'vadodara': {
        temperature: 32,
        condition: 'Partly Cloudy',
        humidity: '65%',
        windSpeed: '10 km/h'
    },
    'rajkot': {
        temperature: 34,
        condition: 'Clear Sky',
        humidity: '55%',
        windSpeed: '15 km/h'
    },
    'bhavnagar': {
        temperature: 31,
        condition: 'Breezy',
        humidity: '70%',
        windSpeed: '18 km/h'
    },
    'jamnagar': {
        temperature: 33,
        condition: 'Sunny',
        humidity: '58%',
        windSpeed: '14 km/h'
    },
    'gandhinagar': {
        temperature: 36,
        condition: 'Very Hot',
        humidity: '50%',
        windSpeed: '9 km/h'
    },
    'anand': {
        temperature: 30,
        condition: 'Pleasant',
        humidity: '68%',
        windSpeed: '11 km/h'
    }
};

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

function displayWeather(city, data) {
    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    temperature.textContent = data.temperature;
    condition.textContent = data.condition;
    humidity.textContent = data.humidity;
    windSpeed.textContent = data.windSpeed;
    
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError() {
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
}

function getWeather() {
    const city = cityInput.value.trim().toLowerCase();
    
    if (!city) {
        showError();
        return;
    }
    
    if (weatherData[city]) {
        displayWeather(city, weatherData[city]);
    } else {
        showError();
    }
    
    cityInput.value = '';
}

getWeatherBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});