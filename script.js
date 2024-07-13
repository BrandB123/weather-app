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


function DOMUpdate(data){
    let location = document.querySelector(".title");
    let currentIcon = document.querySelector(".current-icon");
    let temp = document.querySelector(".temp");
    let feelsLike = document.querySelector(".feels-like");
    let precipPercent = document.querySelector(".precip-percent");
    let precipType = document.querySelector(".precip-type");

    let dayOneIcon = document.querySelector(".day-one.forecast-icon");
    let dayOneMin = document.querySelector(".day-one.forecast-tempmin");
    let dayOneMax = document.querySelector(".day-one.forecast-tempmax");

    let dayTwoIcon = document.querySelector(".day-two.forecast-icon");
    let dayTwoMin = document.querySelector(".day-two.forecast-tempmin");
    let dayTwoMax = document.querySelector(".day-two.forecast-tempmax");

    let dayThreeIcon = document.querySelector(".day-three.forecast-icon");
    let dayThreeMin = document.querySelector(".day-three.forecast-tempmin");
    let dayThreeMax = document.querySelector(".day-three.forecast-tempmax");

    location.textContent = data.location;
    currentIcon.textContent = data.currentConditions.icon;
    temp.textContent = `${data.currentConditions.temperature}°`;
    temp.style.marginLeft = "12%";
    feelsLike.textContent = `feels like ${data.currentConditions.feelsLike}°`;
    precipPercent.textContent = `${data.currentConditions.precipProb}%`;
    precipType.textContent = data.currentConditions.precipType;

    dayOneIcon.textContent = data.threeDayForecast.dayOne.icon;
    dayOneMin.textContent = `${data.threeDayForecast.dayOne.tempmin}°`;
    dayOneMax.textContent = `${data.threeDayForecast.dayOne.tempmax}°`;

    dayTwoIcon.textContent = data.threeDayForecast.dayTwo.icon;
    dayTwoMin.textContent = `${data.threeDayForecast.dayTwo.tempmin}°`;
    dayTwoMax.textContent = `${data.threeDayForecast.dayTwo.tempmax}°`;

    dayThreeIcon.textContent = data.threeDayForecast.dayThree.icon;
    dayThreeMin.textContent = `${data.threeDayForecast.dayThree.tempmin}°`;
    dayThreeMax.textContent = `${data.threeDayForecast.dayThree.tempmax}°`;

    searchInput.value = "";

}
