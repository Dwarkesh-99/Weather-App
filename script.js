"use strict";

let api =
    "https://api.weatherapi.com/v1/current.json?key=a0c21d3e2d2840a8b8062716231912&q=jalgaon";

let dataArr = [];
fetchData(api);
const time = setInterval(updateCurrentDateTime, 1000);

// Toggle dropdown
function dropDown(check) {
    let element = document.getElementById("dropdown");
    if (check === "hide") {
        element.classList.add("invisible");
    } else {
        element.classList.remove("invisible");
    }
}

//Search for different cities...
function searchTemp() {
    let cityCheck;
    const pattern = /^[a-zA-Z]+$/;
    let getCity = document.getElementById("cityName");
    if (cityCheck == getCity) {
        return;
    }
    if (getCity.value.trim().length <= 0 || !pattern.test(getCity.value.trim())) {
        getCity.focus();
        return;
    }   

    cityCheck = getCity;
    let cityApi =
        "https://api.weatherapi.com/v1/current.json?key=a0c21d3e2d2840a8b8062716231912&q=" +
        getCity.value;
    // console.log(cityApi);
    getCity.value = "";
    localStorage.setItem("api", cityApi);
    fetchData(cityApi);
}

//change data from celcius to feirenheit and vice versa...
function degree(degrees) {
    let element = document.getElementById("dropdown");
    let data = dataArr.current;
    if (degrees === "celcius") {
        document.getElementById("temp").innerHTML = data.temp_c + "&deg;";
        document.getElementById("feelsLike").innerHTML =
            "Feels like " + data.feelslike_c + "&deg;";
    } else if (degrees === "feirenheit") {
        document.getElementById("temp").innerHTML = data.temp_f + "&deg;";
        document.getElementById("feelsLike").innerHTML =
            "Feels like " + data.feelslike_f + "&deg;";
    } else {
        // console.log();
    }
    element.classList.add("invisible");
}

//fetch data from api on user request for accurate weather info...
function fetchData(api) {
    // console.log(api);
    if (localStorage.getItem("api") !== null) {
      api = localStorage.getItem("api");
    }
    fetch(api)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("error").classList.add("invisible");
        dataArr = data;
        // console.log(dataArr);
        dataRender();
      })
      .catch((error) => {
        console.log("Error:", error);
  
        document.getElementById("error").classList.remove("invisible");
      });
  }
//render data to element to get updated info...
function dataRender() {
    let dist = dataArr.location.name;
    let state = dataArr.location.region;
    let country = dataArr.location.country;
    let data = dataArr.current;
    if (data.is_day) {
        document.getElementById("days").classList.remove("hidden");
        document.getElementById("nights").classList.add("hidden");
    } else {
        document.getElementById("days").classList.add("hidden");
        document.getElementById("nights").classList.remove("hidden");
    }
    document.getElementById("location").innerText =
        dist + ", " + state + ", " + country;
    document.getElementById("wind").innerHTML = data.wind_kph + " kmph";
    document.getElementById("pressure").innerHTML = data.pressure_mb + " mb";
    document.getElementById("humidity").innerHTML = data.humidity;
    document.getElementById("cloud").innerHTML = data.cloud;
    document.getElementById("day").textContent = getCurrentDayAndTime();
    document.getElementById("temp").innerHTML = data.temp_c + "&deg;";
    document.getElementById("uv").innerHTML = "uv : " + data.uv;
    document.getElementById("feelsLike").innerHTML =
        "Feels like " + data.feelslike_c + "&deg;";
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("dataDiv").classList.remove("hidden");
}

//Update timestamp on every second...
function getCurrentDayAndTime() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    // Convert 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""
        }${minutes} ${period}`;
    const formattedDayAndTime = `${dayOfWeek}, ${formattedTime}`;

    return formattedDayAndTime;
}

function updateCurrentDateTime() {
    const currentDateTimeElement = document.getElementById("day");
    currentDateTimeElement.innerHTML = getCurrentDayAndTime();
}
