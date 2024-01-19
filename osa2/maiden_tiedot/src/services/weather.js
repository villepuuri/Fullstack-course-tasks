
import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/'
const apiKey = import.meta.env.VITE_WEATHER_KEY


const getWeatherData = (coordinates) => {
    const lat = coordinates[0]
    const lon = coordinates[1]
    const request = axios.get(`${baseUrl}onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    return request.then(response => response.data)
}

const getWeatherIconURL = (code) => {
    return`https://openweathermap.org/img/wn/${code}@2x.png`
}

export default {
    getWeatherData,
    getWeatherIconURL
}