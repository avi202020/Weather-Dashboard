// Populate history list from local storage when page loads
const history = JSON.parse(localStorage.getItem("cities")); 
const historySection = document.querySelector("#history"); 

//Open Weather APIKey
const apiKey = "eb3830ea8fe570d0925ea3bbdaaf6253"; 

// //Set variable to access search form in HTML
const userInput = document.querySelector("#search-input"); 
const searchBtn = document.querySelector("#search-button");
let cities = history||[];

historySection.addEventListener("click", function(event){
  console.log(event.target.innerHTML)
  userInput.value=event.target.innerHTML
  searchBtn.dispatchEvent(new Event("click"));
});

// Add the history to local storage
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  const cityName = userInput.value;

   if(cities.indexOf(cityName) === -1)  {
       cities.push(cityName); 
      localStorage.setItem("cities", JSON.stringify(cities)); 
      var button = document.createElement("button");
      button.className = "history-button";
      button.innerHTML = cityName ;
      historySection.appendChild(button);
   }

  const queryURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    apiKey;

  // Call Geocoding API when search form is submitted to find city lat and long value
  axios.get(queryURL).then(function (georesponse) {
    const lat = georesponse.data[0].lat;
    const lon = georesponse.data[0].lon;


    const weatherQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    axios.get(weatherQueryURL).then(function (response) {
      const cityData = response.data;

      //Call 5 day weather forecast API after we have city lat and lon value
     document.querySelector("#fiveDayForecast").innerHTML = "";

      //Set variable called weatherList to search through the entire list:Array (40 items)
      const weatherList = cityData.list;
      var j = 0;

      // Each object in the above array is every 3 hours so pick out one in very 8 to have 1 per day for 5 days
      for (let i = 0; i < weatherList.length; i += 8) {
        const weather = weatherList[i];

        // Get todays date
        const today = weatherList[0];
        const todayTimestamp = today.today;

        // getting the data only (without time) using moment.js to convert unix
        const timestamp = weatherList[i].dt;
        const dateConverted = moment.unix(timestamp).format("dddd DD/MM/YYYY");

        //adding the location information, with city and country
        const locationDate =
          response.data.city.Name +
          ", " +
          response.data.city.country +
          " on " +
          dateConverted +
          " is:";

        // the icon for the current weather

        const icon =
          "https://openweathermap.org/img/wn/" +
          weatherList[i].weather[0].icon +
          "@2x.png";

        // the temperature
        const temp = " Temp: " + weatherList[i].main.temp.toFixed(1) + " °C";
        // windspeed
        const wind = " Wind: " + weatherList[i].wind.speed + " KPH";

        // the humidity
        const humidity = " Humidity: " + weatherList[i].main.humidity + "%";

        if (j == 0) {
          document.querySelector(".location").innerHTML =
            "The weather in " + cityName + " on " + dateConverted + " is ";
          document.querySelector(".temp").innerHTML = temp;
          document.querySelector(".wind").innerHTML = wind;
          document.querySelector(".humidity").innerHTML = humidity;
          document.querySelector(".icon").src = icon;
        } else {
          const forecast = document.createElement("div");
          forecast.classList.add("card", "col-md-2", "mb-3");
          forecast.innerHTML =
            "<h5>" +
            dateConverted +
            "</h5>" +
            "<img class='icon' src='" +
            icon +
            "'>" +
            "<p class='card-text temp'>" +
            temp +
            "</p>" +
            "<p class='card-text wind'>" +
            wind +
            "</p>" +
            "<p class='card-text humidity'>" +
            humidity +
            "</p>";
          document.querySelector("#fiveDayForecast").appendChild(forecast);
        }
        j++;
        if (j > 5) break;
      }

    });
  });
});

btnClearSearchHistory.addEventListener("click", function(event){
    historySection.textContent="";
    localStorage.removeItem("cities"); 
});



window.addEventListener("load", function (event) {
  if (cities !== null) {
   btnClearSearchHistory.classList.remove("invisible")
  for (let i = 0; i < cities.length; i++) {

    var button = document.createElement("button");
    button.className = "history-button";
    button.innerHTML = history[i];
    historySection.appendChild(button);
  }
}
});

