// --- OPENWEATHERMAP API CONFIGURATION ---
// IMPORTANT: REPLACE THE PLACEHOLDER BELOW WITH YOUR ACTUAL OPENWEATHERMAP API KEY
const apiKey = "1959d9017c6c151bbea69ef700c742c6"; 
const baseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather"; 
const baseForecastUrl = "https://api.openweathermap.org/data/2.5/forecast"; 

let currentCity = ""; 
let currentUnit = "metric"; // 'metric' for °C, 'imperial' for °F

// --- DOM Element References ---
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorDiv = document.getElementById("error");

// Current Weather Elements
const locationNameEl = document.getElementById("locationName");
const tempNowEl = document.getElementById("tempNow");
const feelsLikeEl = document.getElementById("feelsLike");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const sunEl = document.getElementById("sun");
const localTimeEl = document.getElementById("localTime");
const bigIconContainer = document.getElementById("bigIconContainer"); 

// Unit Buttons
const cBtn = document.getElementById("cBtn");
const fBtn = document.getElementById("fBtn");

// Forecast List 
const forecastListEl = document.getElementById("forecastList");

// --- Helper Functions ---

/** Converts a UNIX timestamp to a readable time (HH:MM) */
const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

/** Converts meters per second to a user-friendly format based on unit */
const formatWindSpeed = (speed) => {
    if (currentUnit === 'metric') {
        return `${(speed * 3.6).toFixed(1)} km/h`;
    } else {
        return `${(speed * 2.237).toFixed(1)} mph`; 
    }
}

// Helper function to clear the main display fields on load or error
const clearDisplay = () => {
    locationNameEl.textContent = "—";
    tempNowEl.textContent = "--°";
    feelsLikeEl.textContent = "Feels like --";
    descEl.textContent = "—";
    descEl.classList.remove('attractive-clear-sky'); 
    bigIconContainer.classList.remove('attractive-icon-container'); // Clear attractive icon class
    humidityEl.textContent = "--%";
    windEl.textContent = "--";
    pressureEl.textContent = "-- hPa";
    sunEl.textContent = "-- / --";
    localTimeEl.textContent = "—";
    bigIconContainer.innerHTML = ''; 
    forecastListEl.innerHTML = ''; 
    if (currentCity === "") {
        cityInput.value = ""; 
    }
};

/** Renders the current weather details */
const renderCurrentWeather = (data) => {
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    
    // Update main display
    locationNameEl.textContent = data.name;
    tempNowEl.textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    feelsLikeEl.textContent = `Feels like ${Math.round(data.main.feels_like)}${unitSymbol}`;
    
    // --- DESCRIPTION & ICON ENHANCEMENT LOGIC ---
    const weatherDescription = data.weather[0].description;
    const capitalizedDesc = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    const iconCode = data.weather[0].icon;
    
    descEl.textContent = capitalizedDesc;
    
    // Apply class for filtering/glowing the icon when clear sky
    if (iconCode === '01d' || iconCode === '01n') {
         bigIconContainer.classList.add('attractive-icon-container'); 
    } else {
        bigIconContainer.classList.remove('attractive-icon-container');
    }
    
    // Update details
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = formatWindSpeed(data.wind.speed); 
    pressureEl.textContent = `${data.main.pressure} hPa`;
    
    // Update Sunrise/Sunset and local time
    const sunrise = formatTime(data.sys.sunrise, data.timezone);
    const sunset = formatTime(data.sys.sunset, data.timezone);
    sunEl.textContent = `${sunrise} / ${sunset}`;
    localTimeEl.textContent = `Local time ${formatTime(data.dt, data.timezone)}`;

    // --- ICON UPDATE (Large Icon) ---
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    bigIconContainer.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}" class="weather-icon-lg">`;
};


/** Renders the forecast (using the 5-day / 3-hour forecast endpoint format) */
const renderForecast = (data) => {
    const list = data.list;
    forecastListEl.innerHTML = ''; 

    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    
    for (let i = 1; i <= 5 && i < list.length; i++) {
        const intervalData = list[i];
        
        const time = formatTime(intervalData.dt, data.city.timezone);
        const condition = intervalData.weather[0].description; 
        const temp = Math.round(intervalData.main.temp); 
        
        // --- ICON UPDATE (Small Icon) ---
        const iconCode = intervalData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; 

        const intervalHTML = `
            <div class="day">
                <div class="small">${time}</div>
                <img src="${iconUrl}" alt="${condition}" class="weather-icon-sm">
                <div style="font-weight:600; margin-top:4px;">${temp}${unitSymbol}</div>
                <div class="small-muted">${condition}</div>
            </div>
        `;
        forecastListEl.insertAdjacentHTML('beforeend', intervalHTML);
    }
};


/** Main function to fetch all data for a city */
const fetchWeatherAndForecast = async (city) => {
    errorDiv.style.display = 'none'; 
    
    if (!city) {
        clearDisplay();
        return; 
    }
    
    currentCity = city;

    try {
        // --- 1. Fetch Current Weather ---
        const weatherUrl = `${baseWeatherUrl}?q=${city}&appid=${apiKey}&units=${currentUnit}`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            const errData = await weatherResponse.json();
            throw new Error(errData.message || `HTTP error! Status: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        renderCurrentWeather(weatherData);

        // --- 2. Fetch Forecast ---
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;
        
        const forecastUrl = `${baseForecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
             const errData = await forecastResponse.json();
            throw new Error(errData.message || `HTTP error! Status: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        renderForecast(forecastData);

    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        
        const userErrorMsg = error.message.includes('404') 
            ? 'City not found. Please check the spelling.' 
            : `Could not fetch weather. ${error.message}`;

        errorDiv.textContent = userErrorMsg;
        errorDiv.style.display = 'block';
        
        clearDisplay();
    }
};

// --- Event Listeners ---

// 1. Search Button 
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherAndForecast(city);
    } else {
        errorDiv.textContent = "Please enter a city name.";
        errorDiv.style.display = 'block';
    }
});

// 2. Enter key in the input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 3. Unit Switch 
const updateUnitButtons = () => {
    if (currentUnit === 'metric') {
        cBtn.classList.remove('inactive');
        fBtn.classList.add('inactive');
    } else {
        cBtn.classList.add('inactive');
        fBtn.classList.remove('inactive');
    }
};

cBtn.addEventListener('click', () => {
    if (currentUnit !== 'metric') {
        currentUnit = 'metric';
        updateUnitButtons();
        if (currentCity) { 
            fetchWeatherAndForecast(currentCity); 
        } 
    }
});

fBtn.addEventListener('click', () => {
    if (currentUnit !== 'imperial') {
        currentUnit = 'imperial';
        updateUnitButtons();
        if (currentCity) {
            fetchWeatherAndForecast(currentCity); 
        }
    }
});

// 4. Theme Switch 
document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', () => {
        const themeClass = button.getAttribute('data-theme');
        document.body.className = themeClass; // Change the body class to switch themes
    });
});

// 5. Geolocation 
document.getElementById("geoBtn").addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

             try {
                errorDiv.style.display = 'none';
                
                // 1. Fetch current weather by coordinates
                const weatherUrl = `${baseWeatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
                const weatherResponse = await fetch(weatherUrl);
                const weatherData = await weatherResponse.json();
                
                if (!weatherResponse.ok) {
                    throw new Error(weatherData.message || `HTTP error! Status: ${weatherResponse.status}`);
                }
                
                currentCity = weatherData.name; 
                cityInput.value = currentCity;
                renderCurrentWeather(weatherData);

                // 2. Fetch forecast using the same lat/lon
                const forecastUrl = `${baseForecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
                const forecastResponse = await fetch(forecastUrl);
                const forecastData = await forecastResponse.json();
                
                 if (!forecastResponse.ok) {
                    throw new Error(forecastData.message || `HTTP error! Status: ${forecastResponse.status}`);
                }
                
                renderForecast(forecastData);
                
            } catch (error) {
                console.error("Geolocation Weather Error:", error.message);
                errorDiv.textContent = `Geolocation Weather Error: ${error.message}`;
                errorDiv.style.display = 'block';
            }
        }, (error) => {
            // Geolocation permission denied or failed
            console.error("Geolocation Error:", error.message);
            errorDiv.textContent = `Geolocation failed: ${error.message}. Try searching a city.`;
            errorDiv.style.display = 'block';
        });
    } else {
        errorDiv.textContent = "Geolocation is not supported by your browser.";
        errorDiv.style.display = 'block';
    }
});


// --- Initialization ---

// Set initial state of unit buttons
updateUnitButtons();

// Start with a clean slate
clearDisplay();