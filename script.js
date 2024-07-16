
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        let coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        appController(coords);
      });
  }

searchButton.addEventListener("click", () => {
    appController(searchInput.value)
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
        appController(searchInput.value);
    };
});


function appController(location){
    getWeatherData(location).then((data) => {
        if (data !== undefined && location !== ""){
            const processedData = processWeatherData(data);
            DOMUpdate(processedData);
        } else {
            alert("Error: Invalid Entry");
        }
    })
}


async function getWeatherData(location){ 
    try {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=LGEAAMDCUG9GJF5B3TWWMPE4A`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const weatherData = await response.json();
        return weatherData

    } catch (error) {
        console.error(error.message);
    }
}


function processWeatherData(data){
    let coordinates = true;
    addressArray = data.resolvedAddress.split("");
    addressArray.forEach((index) => {
        if (index >= "a" && index <= "z" || index >= "A" && index <= "Z"){
            coordinates = false;
        }
    });
    let location = coordinates === true ? "Current Location" : data.resolvedAddress; 

    const currentConditions = {
        currentWeather : data.currentConditions.conditions,
        feelsLike : Math.round(data.currentConditions.feelslike),
        icon : data.currentConditions.icon,
        precipProb : data.currentConditions.precipprob,
        precipType : data.currentConditions.precipType,
        temperature : Math.round(data.currentConditions.temp)
    }

    const threeDayForecast = {
        dayOne : {icon : data.days[0].icon, tempmax : Math.round(data.days[0].tempmax), tempmin : Math.round(data.days[0].tempmin)},
        dayTwo : {icon : data.days[1].icon, tempmax : Math.round(data.days[1].tempmax), tempmin : Math.round(data.days[1].tempmin)},
        dayThree : {icon : data.days[2].icon, tempmax : Math.round(data.days[2].tempmax), tempmin : Math.round(data.days[2].tempmin)}
    }

    return {location, currentConditions, threeDayForecast};
}


function getIcon(data){
    let icon;
    switch (data) {
        case "clear-day":
          icon = "sun.png";
          break;
        case "clear-night":
            icon = "moon-and-stars.png";          
            break;
        case "partly-cloudy-day":
            icon = "partly-cloudy.png";         
            break;
        case "partly-cloudy-night":
            icon = "partly-cloudy-night";            
            break;
        case "cloudy":
            icon = "cloudy.png";          
            break;
        case "rain":
            icon = "heavy-rain.png";            
            break;
        case "wind":
            icon = "wind.png";            
            break;
        case "fog":
            icon = "fog.png";            
            break;
        case "snow":
            icon = "snowy.png";            
            break;
    }
    return icon;
}

function setDay(){
    let days = [];
    switch (new Date().getDay()) {
        case 0:
          days = ["Sunday", "Monday", "Tuesday"];
          break;
        case 1:
            days = ["Monday", "Tuesday", "Wednesday"];          
            break;
        case 2:
            days = ["Tuesday", "Wednesday", "Thursday"];            
            break;
        case 3:
            days = ["Wednesday", "Thursday", "Friday"];            
            break;
        case 4:
            days = ["Thursday", "Friday", "Saturday"];          
            break;
        case 5:
            days = ["Friday", "Saturday", "Sunday"];            
            break;
        case 6:
            days = ["Saturday", "Sunday", "Monday"];            
            break;
    }
    return days;
}

function trimLocation(location){
    if (location === "Current Location"){
        return location
    } else {
        let splitLocation = location.split(",");
        splitLocation.pop();
        const updatedLocation = splitLocation.join(", ");
        return updatedLocation;
    };
}


function DOMUpdate(data){
    let location = document.querySelector(".title");
    let currentIcon = document.querySelector(".current-icon");
    let temp = document.querySelector(".temp");
    let feelsLike = document.querySelector(".feels-like-temp");
    let precipPercent = document.querySelector(".precip-percent");
    let precipType = document.querySelector(".precip-type");

    let dayOneDay = document.querySelector(".day-one.forecast-day")
    let dayOneIcon = document.querySelector(".day-one.forecast-icon");
    let dayOneMin = document.querySelector(".day-one.forecast-tempmin");
    let dayOneMax = document.querySelector(".day-one.forecast-tempmax");

    let dayTwoDay = document.querySelector(".day-two.forecast-day")
    let dayTwoIcon = document.querySelector(".day-two.forecast-icon");
    let dayTwoMin = document.querySelector(".day-two.forecast-tempmin");
    let dayTwoMax = document.querySelector(".day-two.forecast-tempmax");

    let dayThreeDay = document.querySelector(".day-three.forecast-day")
    let dayThreeIcon = document.querySelector(".day-three.forecast-icon");
    let dayThreeMin = document.querySelector(".day-three.forecast-tempmin");
    let dayThreeMax = document.querySelector(".day-three.forecast-tempmax");

    let days = setDay();

    location.textContent = trimLocation(data.location);
    let currentIconDiv = document.createElement("img");
    currentIconDiv.src = `weather-icons/${getIcon(data.currentConditions.icon)}`;
    currentIcon.textContent = ""; 
    currentIcon.appendChild(currentIconDiv);
    temp.textContent = `${data.currentConditions.temperature}°`;
    temp.style.marginLeft = "12%";
    feelsLike.textContent = `${data.currentConditions.feelsLike}°`;
    precipPercent.textContent = `${data.currentConditions.precipProb}%`;
    precipType.textContent = data.currentConditions.precipType;

    dayOneDay.textContent = days[0];
    let dayOneIconDiv = document.createElement("img");
    dayOneIconDiv.src = `weather-icons/${getIcon(data.threeDayForecast.dayOne.icon)}`;
    dayOneIcon.textContent = ""; 
    dayOneIcon.appendChild(dayOneIconDiv);
    dayOneMin.textContent = `${data.threeDayForecast.dayOne.tempmin}°`;
    dayOneMax.textContent = `${data.threeDayForecast.dayOne.tempmax}°`;

    dayTwoDay.textContent = days[1];
    let dayTwoIconDiv = document.createElement("img");
    dayTwoIconDiv.src = `weather-icons/${getIcon(data.threeDayForecast.dayTwo.icon)}`;
    dayTwoIcon.textContent = ""; 
    dayTwoIcon.appendChild(dayTwoIconDiv);
    dayTwoMin.textContent = `${data.threeDayForecast.dayTwo.tempmin}°`;
    dayTwoMax.textContent = `${data.threeDayForecast.dayTwo.tempmax}°`;

    dayThreeDay.textContent = days[2];
    let dayThreeIconDiv = document.createElement("img");
    dayThreeIconDiv.src = `weather-icons/${getIcon(data.threeDayForecast.dayThree.icon)}`;
    dayThreeIcon.textContent = ""; 
    dayThreeIcon.appendChild(dayThreeIconDiv);
    dayThreeMin.textContent = `${data.threeDayForecast.dayThree.tempmin}°`;
    dayThreeMax.textContent = `${data.threeDayForecast.dayThree.tempmax}°`;

    searchInput.value = "";

}
