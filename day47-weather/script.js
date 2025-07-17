const apiKey = "39a7d4f92404177ee48c4c98e8c2aba7";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
  const response = await fetch(apiURL + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();

    document.querySelector(".city").innerHTML = `Weather in ${data.name}`;
    document.querySelector(".temp").innerHTML = `Temperature: ${Math.round(data.main.temp)}°C`;
    document.querySelector(".condition").innerHTML = `Condition: ${data.weather[0].main}`;
    document.querySelector(".humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".wind").innerHTML = `Wind Speed: ${data.wind.speed} km/h`;

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city !== "") {
    checkWeather(city);
  }
});
