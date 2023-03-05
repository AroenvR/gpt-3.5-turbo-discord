/**
 * This is the interface for the weather data.
 * @property astro contains the sunrise and sunset times.
 * @property forecast contains the forecast data.
 */
export interface IWeatherData {
    astro: {
        sunrise: string;
        sunset: string;
    }
    forecast: IForecast[];
}

/**
 * This is the interface for the forecast data.
 */
interface IForecast {
    time: string;
    temp: number;
    condition: {
        text: string;
    };
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    windchill_c: number;
    heatindex_c: number;
    dewpoint_c: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    gust_kph: number;
    uv: number;
}