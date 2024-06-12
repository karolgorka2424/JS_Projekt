document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'ed7814c1a5eee00132e8d1783181f475';
    const location = 'Krakow,pl';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;


    const translations = {
        en: {
            currentWeather: 'Current Weather',
            forecast: '5-Day Forecast',
            days: ['Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            temp: 'Temperature:',
            humidity: 'Humidity:',
            condition: 'Condition:'
        },
        pl: {
            currentWeather: 'Aktualna Pogoda',
            forecast: 'Prognoza na 5 Dni',
            days: ['Dzisiaj', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
            temp: 'Temperatura:',
            humidity: 'Wilgotność:',
            condition: 'Stan:'
        }
    };

    const weatherConditionsPL = {
        'clear sky': 'bezchmurne niebo',
        'few clouds': 'mało chmur',
        'scattered clouds': 'rozproszone chmury',
        'broken clouds': 'zachmurzenie duże',
        'shower rain': 'przelotny deszcz',
        'rain': 'deszcz',
        'thunderstorm': 'burza',
        'snow': 'śnieg',
        'mist': 'mgła'
    };

    let currentLang = 'en';

    function translateCondition(condition) {
        if (currentLang === 'pl') {
            return weatherConditionsPL[condition] || condition;
        }
        return condition;
    }

    function updateLanguage(lang) {
        currentLang = lang;
        document.getElementById('current-weather-title').innerText = translations[lang].currentWeather;
        document.getElementById('forecast-title').innerText = translations[lang].forecast;
        if (forecastList.length > 0) {
            updateForecast(forecastList);
        }
        if (currentWeatherData) {
            updateCurrentWeather(currentWeatherData);
        }
    }

    document.getElementById('en').addEventListener('click', () => updateLanguage('en'));
    document.getElementById('pl').addEventListener('click', () => updateLanguage('pl'));

    let currentWeatherData = null;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            currentWeatherData = data;
            updateCurrentWeather(data);
        })
        .catch(error => console.error('Error fetching current weather data:', error));

    function updateCurrentWeather(data) {
        document.getElementById('current-temp').innerText = `${translations[currentLang].temp} ${Math.round(data.main.temp)}°C`;
        document.getElementById('current-humidity').innerText = `${translations[currentLang].humidity} ${data.main.humidity}%`;
        document.getElementById('current-condition').innerText = `${translations[currentLang].condition} ${translateCondition(data.weather[0].description)}`;
        document.getElementById('current-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    }

    let forecastList = [];

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            forecastList = data.list.filter((_, index) => index % 8 === 0);
            updateForecast(forecastList);
        })
        .catch(error => console.error('Error fetching forecast data:', error));

    function updateForecast(forecastList) {
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';
        forecastList.forEach((day, index) => {
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            const date = new Date(day.dt_txt);
            const dayName = index === 0 ? translations[currentLang].days[0] : translations[currentLang].days[date.getDay()];
            forecastDay.innerHTML = `
                    <p>${dayName}</p>
                    <p>${Math.round(day.main.temp)}°C</p>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
                `;
            forecastContainer.appendChild(forecastDay);
        });
    }
});
