import { format, max, min } from "date-fns";
import cloudImage from "./images/cloud.svg";
import mistImage from "./images/mist.svg";
import nightImage from "./images/night.svg";
import partlyCloudyDayImage from "./images/partly_cloudy_day.svg";
import partlyCloudyNightImage from "./images/partly_cloudy_night.svg";
import rainyImage from "./images/rainy.svg";
import dayImage from "./images/sunny.svg";
let currentHour;

async function getWeatherData(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,wind_direction_80m,wind_speed_80m&timezone=auto`
    );
    const data = await response.json();
    return data;
}

async function getCurrentWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto`
    );
    const data = await response.json();
    currentHour = new Date(data.current.time).getHours();

    return data;
}
async function getDailyWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&timezone=auto`
    );
    const data = await response.json();
    return data;
}

function windDirectionCalc(windDirection, windSpeed) {
    let wind = "Wind: ";

    if (
        (windDirection >= 337.5 && windDirection <= 360) ||
        (windDirection >= 0 && windDirection < 22.5)
    ) {
        wind += "N";
    } else if (windDirection >= 22.5 && windDirection < 67.5) {
        wind += "NE";
    } else if (windDirection >= 67.5 && windDirection < 112.5) {
        wind += "E";
    } else if (windDirection >= 112.5 && windDirection < 157.5) {
        wind += "SE";
    } else if (windDirection >= 157.5 && windDirection < 202.5) {
        wind += "S";
    } else if (windDirection >= 202.5 && windDirection < 247.5) {
        wind += "SW";
    } else if (windDirection >= 247.5 && windDirection < 292.5) {
        wind += "W";
    } else if (windDirection >= 292.5 && windDirection < 337.5) {
        wind += "NW";
    }

    wind += ` ${windSpeed} m/s`;

    return wind;
}
function cloudSymbolCurrent(precipitation, cloud_cover, time) {
    if (cloud_cover > 80) {
        if (precipitation > 0) {
            return rainyImage;
        }
        return cloudImage;
    }
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour <= 18) {
        if (cloud_cover <= 30) {
            return dayImage;
        } else if (cloud_cover > 30 && cloud_cover <= 80) {
            return partlyCloudyDayImage;
        }
    } else {
        if (cloud_cover <= 30) {
            return nightImage;
        } else if (cloud_cover > 30 && cloud_cover <= 80) {
            return partlyCloudyNightImage;
        }
    }
}
async function currentWeatherModule(data) {
    const box = document.createElement("div");
    box.className = "current-weather";

    const leftInfo = document.createElement("div");
    leftInfo.className = "leftInfo-current";
    const imageAndPrecipatation = document.createElement("div");
    const cloudCover = document.createElement("img");
    cloudCover.className = "cloud-cover-current";
    cloudCover.src = cloudSymbolCurrent(
        data.current.precipitation,
        data.current.cloud_cover,
        data.current.time
    );
    const precipitation = document.createElement("p");
    precipitation.className = "precipitation-current";
    precipitation.textContent = `Precipation:${data.current.precipitation}`;

    const temp = document.createElement("p");
    const degreeCelcius = document.createElement("span");
    degreeCelcius.innerHTML = `&#8451;`;
    temp.className = "temperature-current";
    temp.textContent = `${data.current.temperature_2m}`;
    temp.appendChild(degreeCelcius);

    const rightInfo = document.createElement("div");
    rightInfo.className = "rightInfo-current";
    const humidity = document.createElement("p");
    humidity.className = "humidity-current";
    const wind = document.createElement("p");
    wind.className = "wind-current";

    humidity.textContent = `Humidity ${data.current.relative_humidity_2m}%`;
    wind.textContent = windDirectionCalc(
        data.current.wind_direction_10m,
        data.current.wind_speed_10m
    );
    imageAndPrecipatation.appendChild(cloudCover);
    imageAndPrecipatation.appendChild(precipitation);
    leftInfo.appendChild(imageAndPrecipatation);
    leftInfo.appendChild(temp);
    rightInfo.appendChild(humidity);
    rightInfo.appendChild(wind);

    box.appendChild(leftInfo);
    box.appendChild(rightInfo);
    return box;
}

function cloudSymbolHourly(precipitation_probability, cloud_cover, time) {
    if (cloud_cover > 80) {
        if (precipitation_probability > 90) {
            return rainyImage;
        }
        return cloudImage;
    }
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour <= 18) {
        if (cloud_cover <= 30) {
            return dayImage;
        } else if (cloud_cover > 30 && cloud_cover <= 80) {
            return partlyCloudyDayImage;
        }
    } else {
        if (cloud_cover <= 30) {
            return nightImage;
        } else if (cloud_cover > 30 && cloud_cover <= 80) {
            return partlyCloudyNightImage;
        }
    }
}
function hourlyCardArray(data) {
    const hours = [];
    for (let i = currentHour; i <= 4 + currentHour; i++) {
        const hourCard = document.createElement("div");
        hourCard.className = "hour-card-hourly";

        const cloudCover = document.createElement("img");
        cloudCover.className = "cloud-cover-hourly";
        cloudCover.src = cloudSymbolHourly(
            data.hourly.precipitation_probability[i],
            data.hourly.cloud_cover[i],
            data.hourly.time[i]
        );

        const temperature = document.createElement("p");
        temperature.className = "temperature-hourly";
        temperature.textContent = `${data.hourly.temperature_2m[i]}`;

        const degreeCelcius = document.createElement("span");
        degreeCelcius.innerHTML = `&#8451;`;
        temperature.appendChild(degreeCelcius);

        const precipitationProbability = document.createElement("p");
        precipitationProbability.className = "precipitation-probability-hourly";
        precipitationProbability.textContent = `Precipation: ${data.hourly.precipitation_probability[i]}%`;

        const wind = document.createElement("p");
        wind.className = "wind-hourly";
        wind.textContent = windDirectionCalc(
            data.hourly.wind_direction_80m[i],
            data.hourly.wind_speed_80m[i]
        );
        const timeElement = document.createElement("p");
        timeElement.className = "time-hourly";
        const time = new Date(data.hourly.time[i]).getHours();
        if (time <= 12) {
            if (time == 0) timeElement.textContent = `12 AM`;
            else timeElement.textContent = ` ${time} AM`;
        } else {
            if (time % 12 == 0) timeElement.textContent = `12 PM`;
            else timeElement.textContent = ` ${time % 12} PM`;
        }

        hourCard.appendChild(cloudCover);
        hourCard.appendChild(temperature);
        hourCard.appendChild(precipitationProbability);
        hourCard.appendChild(wind);
        hourCard.appendChild(timeElement);
        hours.push(hourCard);
    }
    return hours;
}
function hourlyForecast(data) {
    const hoursSlide = document.createElement("div");
    hoursSlide.className = "hours-Slide";
    hourlyCardArray(data).forEach((element) => {
        hoursSlide.appendChild(element);
    });
    return hoursSlide;
}

function dailyWeatherUi(data) {
    const daysWeather = document.createElement("div");
    daysWeather.className = "daily-weather";
    for (let i = 0; i < 7; i++) {
        const day = document.createElement("div");
        day.className = "day-weather";
        const date = document.createElement("p");
        const minTemp = document.createElement("p");
        const maxTemp = document.createElement("p");
        const rain = document.createElement("p");
        date.textContent = format(new Date(data.daily.time[i]), "dd-MMMM-yyyy");
        minTemp.textContent = `Min Temp:${data.daily.temperature_2m_min[i]}`;
        maxTemp.textContent = `Max Temp:${data.daily.temperature_2m_max[i]}`;
        rain.textContent = `rain:${data.daily.rain_sum[i]}`;
        day.appendChild(date);
        day.appendChild(minTemp);
        day.appendChild(maxTemp);
        day.appendChild(rain);
        daysWeather.appendChild(day);
    }
    return daysWeather;
}
async function createUi(latitude, longitude) {
    const currentTime = new Date();
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";
    mainElement.appendChild(
        await currentWeatherModule(await getCurrentWeather(latitude, longitude))
    );
    const data = await getWeatherData(latitude, longitude);
    mainElement.appendChild(hourlyForecast(data));
    const dailyWeatherData = await getDailyWeather(latitude, longitude);
    mainElement.appendChild(dailyWeatherUi(dailyWeatherData));
}
export { createUi };
