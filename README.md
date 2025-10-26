# 🌦  Weather App

A clean, modern, single-page web application to fetch and display the current weather and a short-term forecast for any city worldwide, utilizing the OpenWeatherMap API.

The application features a dark mode theme, unit switching (°C/°F), city search, and geolocation functionality. Special attention is paid to the visual appeal of the main weather icon, particularly for clear sky conditions.

## ✨ Features

* **Dynamic Weather Search:** Get current weather and 5-day (3-hour interval) forecast for any city.
* **Geolocation:** Use the browser's Geolocation API to instantly get the weather for your current location.
* **Unit Switching:** Toggle seamlessly between **Celsius (°C)** and **Fahrenheit (°F)**.
* **Theming:** Multiple aesthetically pleasing color themes (Midnight, Ocean, Sunset, Aurora) are available via the theme switch buttons.
* **Enhanced Icons:** The main weather icon for 'Clear Sky' features a subtle glow and background removal via CSS for an attractive visual effect.
* **Clean UI:** Uses a simple two-column card layout built with vanilla HTML, CSS, and JavaScript.

## 🚀 Getting Started

To run this project locally, you need to obtain an **API Key** from OpenWeatherMap.

### Prerequisites

1.  **Node.js:** (Recommended for local server setup)
2.  **OpenWeatherMap API Key:** Sign up at [OpenWeatherMap](https://openweathermap.org/api) and generate a **Current Weather Data** and **5 Day / 3 Hour Forecast** API key.

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd [YOUR_REPOSITORY_NAME]
    ```

2.  **Update the API Key:**
    Open the `server.js` file and replace the placeholder value with your actual OpenWeatherMap API key:

    ```javascript
    // In server.js
    const apiKey = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; 
    ```

3.  **Run the Application:**
    Since this is a client-side application, you can simply open the `index.html` file in your browser.

    *Alternatively, if you have Node.js and a simple server setup:*

    ```bash
    # If using 'live-server' or similar tool
    npm install -g live-server
    live-server
    ```
    The app will open automatically in your browser, usually at `http://127.0.0.1:8080`.

## ⚙️ Project Structure

The project uses a simple structure suitable for a small vanilla JavaScript application:

| File | Description |
| :--- | :--- |
| `index.html` | The main structure of the application (UI layout, links to CSS/JS). |
| `server.js` | Contains all application logic: API configuration, fetching functions, DOM manipulation, unit conversion, and event listeners. |
| `styles.css` | Defines the look, feel, themes, and responsive design of the application. |

## 🖼️ Icon Enhancement

The application uses a pure CSS technique (`filter: drop-shadow()`) on the OpenWeatherMap PNG icons to achieve the following:

* **Remove Gray Background:** The default gray circular background of the icon is removed, allowing the icon shape (sun, cloud, etc.) to float naturally on the dark background.
* **Subtle Glow:** A yellow drop-shadow is applied specifically to the 'Clear Sky' (`01d`/`01n`) icon for a premium, glowing effect without being overly bright.

## 🤝 Contribution

This project is maintained by [Your Name or Organization]. Feedback, bug reports, and contributions are welcome!
