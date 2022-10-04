function form(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city-input");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${citySearch.value}`;
}
let citySearch = document.querySelector("#search-city");
citySearch.addEventListener("submit", form);

function currentDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let day = days[date.getDay()];
  let utc = date.getUTCDate();
  let currentDate = document.querySelector(`#current-date`);
  currentDate.innerHTML = `${day} ${utc} ${month}`;
}
let date = new Date();
currentDate(date);

function currentTime(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentTime = document.querySelector(`#current-time`);
  let ampm = hours >= 12 ? "pm" : "am";
  currentTime.innerHTML = `${hours}:${minutes}${ampm}`;
}
let time = new Date();
currentTime(time);

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".forecast");
  let forecastHTML = `<div class="container text-center">`;
  forecast.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
            <div class="row">
            <div class="col-sm-4 day">${forecastDay.dt}}</div>
            <div class="col-sm-4 icon">
              <img
                src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                alt=""
                id="iconSmall"
                width="10px"
              />
            </div>
            <div class="col-sm-4 sTemp">Math.Rough${forecastDay.temp.max}</div>
            </div>
          `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function forecastAPI(coordinates) {
  let unit = "metric";
  let apiKey = "fb17032b6c9158083b18c64aad932954";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
  console.log(apiUrl);
}

function degreeC() {
  let C = celsiusTemp;
  let temp = document.querySelector("#current-temp");
  let feelC = document.querySelector("#degree");
  document.querySelector("#current-temp").innerHTML = `${C}°`;
  document.querySelector("#degree").innerHTML = `${feelsLikeFahren}°`;
  if (C === null) {
    temp.innerHTML = `0°`;
    feelC.innerHTML = `°`;
  }
}

function degreeF() {
  let fahrenTemp = Math.round((celsiusTemp * 9) / 5 + 32);
  let feelLikeF = Math.round((feelsLikeFahren * 9) / 5 + 32);
  let F = document.querySelector("#current-temp");
  let feelF = document.querySelector("#degree");
  feelF.innerHTML = `${feelLikeF}°`;
  F.innerHTML = `${fahrenTemp}°`;
  if (feelsLikeFahren === null) {
    feelF.innerHTML = `°`;
    F.innerHTML = `0°`;
  }
}

let tempC = document.querySelector(".tempC");
tempC.addEventListener("click", degreeC);
let tempF = document.querySelector(".tempF");
tempF.addEventListener("click", degreeF);

let celsiusTemp = null;
let feelsLikeFahren = null;

function showTemp(response) {
  document.querySelector("#search-city").reset();
  let cityName = response.data.name;
  document.querySelector("#city").innerHTML = `${cityName}`;
  let temp = Math.round(response.data.main.temp);
  document.querySelector("#current-temp").innerHTML = `${temp}°`;
  let humid = response.data.main.humidity;
  document.querySelector("#percent").innerHTML = `${humid}%`;
  let wind = Math.round(response.data.wind.speed);
  document.querySelector("#mph").innerHTML = `${wind}mph`;
  let feelsLike = Math.round(response.data.main.feels_like);
  document.querySelector("#degree").innerHTML = `${feelsLike}°`;
  let mood = response.data.weather[0].description;
  document.querySelector(".mood").innerHTML = `${mood}`;
  celsiusTemp = Math.round(response.data.main.temp);
  feelsLikeFahren = Math.round(response.data.main.feels_like);
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  forecastAPI(response.data.coord);
}

function originalState() {
  document.querySelector("#search-city").reset();
  document.querySelector("#current-temp").innerHTML = `0°`;
  document.querySelector("#percent").innerHTML = `%`;
  document.querySelector("#mph").innerHTML = `mph`;
  document.querySelector("#degree").innerHTML = `°`;
  document.querySelector(".mood").innerHTML = ` `;
  document.querySelector("h1").innerHTML = `Where to?`;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734"
    );
}

function cityInput(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  let displayCityTemp = document.querySelector("#current-temp");
  displayCityTemp.innerHTML = `${searchInput.value}°`;
  if (searchInput.value) {
    displayCityTemp.innerHTML = `${searchInput.value}°`;
  } else {
    return originalState();
  }
  searchApi(searchInput.value);
}

function searchApi(city) {
  let unit = "metric";
  let apiKey = "0916f8b81b55a49e9ed662fd3289212a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=${unit}`;
  axios.get(apiUrl).then(showTemp);
}

let searchedCity = document.querySelector("#search-city");
searchedCity.addEventListener("submit", cityInput);

////////////// geo location

function findLocation(position) {
  let unit = "metric";
  let apiKey = "0916f8b81b55a49e9ed662fd3289212a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

function yourCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findLocation);
}

let button = document.querySelector(".btn2");
button.addEventListener("click", yourCity);

/////////////////
