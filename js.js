// const { default: axios } = require("axios");
// import { getFormattedDate } from "./utils";
// Joi schema - chaining the methods

const locationSchema = Joi.string().min(3).max(25);

// listen for input in location box
document.getElementById("userLocation").addEventListener("input", (e) =>
  Joi.validate(e.target.value, locationSchema, (errors, val) => {
    const errorMessage = errors;
    console.log(errorMessage, val);
    // write error back to DOM
    return (document.getElementById("locationError").innerHTML = errorMessage);
  })
);
// geolocation code which gets user's location
navigator.geolocation.getCurrentPosition(
  (location) => {
    // calling weather data function and sending coords that location API gives to it
    getWeatherData(location.coords.latitude, location.coords.longitude);
  },
  (error) => {
    console.log(error);
  },
  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);

// weather function
async function getWeatherData(latitude, longitude) {
  const result = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=b27db40c247bf67c4bfd7fee69fde16d`
  );
  console.log(result.data);
  updateInterface(result.data, latitude, longitude);
}

// this function below takes the data and writes it on the page
function updateInterface(data) {
  const htmlLocation = `<h1>Weather in
  ${data.name}</h1>`;
  const htmlTemp = `<h2> ${Math.round(data.main.temp)}°`;
  const htmlIcon = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"/>`;

  const htmlDescription = `<p id="description"> ${data.weather[0].description}</p>`;
  const htmlFeels = `<p>Feels like ${Math.round(data.main.feels_like)}°</p>`;

  // convert times
  function htmlSunConvert(time, type) {
    const sunDate = new Date((time + data.timezone) * 1000).toLocaleTimeString(
      "en-gb",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const htmlSun = `<p> ${type} at ${sunDate}</p>`;
    return htmlSun;
  }

  // get formatted date taking timezone into account
  function getFormattedDate() {
    const date = new Date((data.dt + data.timezone) * 1000);
    console.log(data.dt + data.timezone);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = days[date.getDay()];
    const todaysDate = date.getDate();
    console.log(todaysDate);
    const fullYear = date.getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const htmlFullDateString = `<p> ${dayOfWeek}, ${todaysDate} ${month} ${fullYear}</p>`;
    console.log(htmlFullDateString);
    return htmlFullDateString;
  }

  // write the data back to the DOM
  document.getElementById("content").innerHTML = `
  <div class="details">
                                                  <div>${htmlLocation}</div>
                                                  <div class = "date">${getFormattedDate()}</div>
                                                  <div>${htmlTemp}</div>
                                                  
                                                    <div>${htmlIcon}</div>
                                                    <div>${htmlDescription}</div>
                                                    <div>${htmlFeels}</div>
                                                    <div id="sunrise">${htmlSunConvert(
                                                      data.sys.sunrise,
                                                      `Sunrise`
                                                    )}</div>
                                                    <div id="sunset">${htmlSunConvert(
                                                      data.sys.sunset,
                                                      `Sunset`
                                                    )}</div>
                                                  </div>`;

  // change background image depending on conditions

  const changingBackground = document.querySelector(".background");
  const changingDateColour = document.querySelector(".date");
  if (data.weather[0].icon.endsWith("n")) {
    changingBackground.classList.add("night");
    changingDateColour.classList.add("lightDateText");
  } else if (data.weather[0].description.includes("cloud")) {
    changingBackground.classList.add("cloudy");
    changingBackground.classList.remove("sun", "cold", "night");
  } else if (data.weather[0].description.includes("rain")) {
    changingBackground.classList.add("rainy");
    changingBackground.classList.remove("sun", "cloudy", "night");
  } else if (
    data.weather[0].description.includes("clear") &&
    data.main.temp > 25
  ) {
    changingBackground.classList.add("sun");
    changingBackground.classList.remove("rainy", "cloudy", "night");
  } else if (data.main.temp < 3 && data.weather[0].icon.endsWith("d")) {
    changingBackground.classList.add("cold");
    changingBackground.classList.remove("sunny", "cloudy", "rainy", "night");
  } else {
    changingBackground.classList.add("default");
  }
}

// event listener for user typing into input box
document.getElementById("userLocation").addEventListener("input", async (e) => {
  console.log(e.target.value);
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=1&appid=b27db40c247bf67c4bfd7fee69fde16d`;
  const results = await axios.get(url);
  console.log(e.target.value, results.data[0]);
  getWeatherData(results.data[0].lat, results.data[0].lon);
});

// no longer using the below as want to make date responsive to timezone

// function getFormattedDate() {
//   const date = new Date();

//   const formattedDate = date.toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
//   return formattedDate;
// }
