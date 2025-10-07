import { getLocation , fetchingFunction} from "./utils.mjs";

const baseUrl = import.meta.env.VITE_WEATHER_URL;

export default class WeatherData {
  constructor() {}
  async getWeather() {
    try{

        const {lat,lon} = await getLocation();
        const query = `${lat},${lon}`;
        const response = await fetchingFunction("weather",baseUrl, query);
        console.log("response de getWeather", response);
        return response;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}


