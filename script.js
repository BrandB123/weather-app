
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
    const currentConditions = {
        currentWeather : data.currentConditions.conditions,
        feelsLike : data.currentConditions.feelslike,
        icon : data.currentConditions.icon,
        precipProb : data.currentConditions.precipprob,
        precipType : data.currentConditions.precipType,
        temperature : data.currentConditions.temp
    }

    const threeDayForecast = {
        dayOne : {icon : data.days[0].icon, temp : data.days[0].temp , tempmax : data.days[0].tempmax, tempmin : data.days[0].tempmin},
        dayTwo : {icon : data.days[1].icon, temp : data.days[1].temp , tempmax : data.days[1].tempmax, tempmin : data.days[1].tempmin},
        dayThree : {icon : data.days[2].icon, temp : data.days[2].temp , tempmax : data.days[2].tempmax, tempmin : data.days[2].tempmin}
    }

    return {currentConditions, threeDayForecast};
}


//let unprocessedData = getWeatherData("Columbia, MO");
// let unprocessedData = getWeatherData("38.9525, -92.3342");

getWeatherData("Columbia, MO").then((data) => {
    console.log(data);
    const processedData = processWeatherData(data);
    console.log(processedData);
})

