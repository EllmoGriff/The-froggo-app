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

function degreeC() {
  let C = Math.round(celsiusTemp);
  document.querySelector("#current-temp").innerHTML = `${C}°`;
}
let tempC = document.querySelector(".tempC");
tempC.addEventListener("click", degreeC);

function degreeF() {
  let fahrenTemp = Math.round((celsiusTemp * 9) / 5 + 32);
  let F = document.querySelector("#current-temp");
  F.innerHTML = `${fahrenTemp}°`;
  if (celsiusTemp === null) {
    F.innerHTML = `0°`;
  }
}
let tempF = document.querySelector(".tempF");
tempF.addEventListener("click", degreeF);

let celsiusTemp = null;

function showTemp(response) {
  console.log(response.data);
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
  celsiusTemp = response.data.main.temp;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
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
  // console.log("ran function cityInput");
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  let displayCityTemp = document.querySelector("#current-temp");
  displayCityTemp.innerHTML = `${searchInput.value}°`;
  if (searchInput.value) {
    displayCityTemp.innerHTML = `${searchInput.value}°`;
  } else {
    originalState();
    return;
  }
  searchApi(searchInput.value);
}

function searchApi(city) {
  // console.log("ran function searchApi");
  let unit = "metric";
  let apiKey = "0916f8b81b55a49e9ed662fd3289212a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=${unit}`;
  axios.get(apiUrl).then(showTemp);
}

let searchedCity = document.querySelector("#search-city");
searchedCity.addEventListener("submit", cityInput);

//////////////

function findLocation(position) {
  let unit = "metric";
  let apiKey = "0916f8b81b55a49e9ed662fd3289212a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${apiKey}`;
  // console.log(apiUrl);
  axios.get(apiUrl).then(showTemp);
}

function yourCity(event) {
  event.preventDefault();
  // document.querySelector("h1").innerHTML = "Your City";
  navigator.geolocation.getCurrentPosition(findLocation);
}

let button = document.querySelector(".btn2");
button.addEventListener("click", yourCity);
