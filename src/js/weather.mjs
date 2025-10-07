import { getLocation , fetchingFunction} from "./utils.mjs";

const baseUrl = import.meta.env.VITE_WEATHER_URL;

export default class WeatherData {
  constructor() {}
  
  async getWeather() {
    try{
        const {lat,lon} = await getLocation();
        const query = `${lat},${lon}`;
        const response = await fetchingFunction("weather",baseUrl, query);
        return response;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  async getWeatherData() {
    try {
      const weatherResponse = await this.getWeather();
      if (weatherResponse && weatherResponse.current) {
        return {
          temperature: Math.round(weatherResponse.current.temp_c),
          location: weatherResponse.location.name,
          condition: weatherResponse.current.condition.text
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting weather data:", error);
      return null;
    }
  }
}


