
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const message = document.getElementById("message");

// Convert weather codes into descriptions and icons
function getWeatherInfo(code) {
    const weatherTypes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Rime Fog", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Moderate Drizzle", "🌦️"],
        55: ["Dense Drizzle", "🌧️"],
        61: ["Slight Rain", "🌧️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Slight Snow", "🌨️"],
        73: ["Moderate Snow", "🌨️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Moderate Showers", "🌧️"],
        82: ["Heavy Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Severe Thunderstorm", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown Weather", "🌡️"];
}

async function searchWeather() {
    const city = cityInput.value.trim();

    message.textContent = "";
    weatherCard.hidden = true;

    if (!city) {
        message.textContent = "Please enter a city name!";
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        // Step 1: Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Please enter a valid city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch current weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Get weather description and icon
        const weatherInfo = getWeatherInfo(current.weather_code);

        // Step 4: Display weather information
        document.getElementById("cityName").textContent =
            location.name;

        document.getElementById("countryName").textContent =
            location.country || "";

        document.getElementById("weatherIcon").textContent =
            weatherInfo[1];

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("condition").textContent =
            weatherInfo[0];

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("feelsLike").textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        document.getElementById("windSpeed").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("weatherTime").textContent =
            `Local time: ${current.time.replace("T", " ")}`;

        weatherCard.hidden = false;

    } catch (error) {
        console.error("Weather App Error:", error);
        message.textContent = error.message ||
            "Something went wrong. Please try again.";
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// Search button
searchBtn.addEventListener("click", searchWeather);

// Search using Enter key
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});
