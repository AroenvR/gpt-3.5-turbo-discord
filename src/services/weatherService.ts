import { logger, LogLevel } from "../util/logger";
import { httpsGet } from "./httpService";
import { IWeatherData } from "../interfaces/IWeatherData";
import { isTruthy } from "../util/isTruthy";

export const getWeatherData = async (location: string) => { // Brussels
    const url = `api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=1&aqi=no&alerts=no`;

    return await httpsGet(url)
        .then(async (data) => {
            let formattedData = await formatWeatherData(data);

            let morningData = formattedData.forecast[7];
            let afternoonData = formattedData.forecast[13];
            let eveningData = formattedData.forecast[19];
            formattedData.forecast = [morningData, afternoonData, eveningData];

            return JSON.stringify(formattedData);
        })
        .catch((err) => {
            logger('Error in getting weather data:', LogLevel.ERROR, err);
            throw new Error('Error in getting weather data.');
        });
}

export const formatWeatherData = async (data: any): Promise<IWeatherData> => {
    if (!isTruthy(data)) return Promise.reject("formatWeatherData (service): Data is falsy.");

    const weatherData: IWeatherData = {
        astro: {
            sunrise: data.forecast.forecastday[0].astro.sunrise,
            sunset: data.forecast.forecastday[0].astro.sunset,
            moonIllumination: data.forecast.forecastday[0].astro.moon_illumination,
        },
        forecast: data.forecast.forecastday[0].hour.map((hour: any) => {
            return {
                time: hour.time,
                temp: hour.temp_c,
                condition: {
                    text: hour.condition.text,
                },
                wind_kph: hour.wind_kph,
                wind_degree: hour.wind_degree,
                wind_dir: hour.wind_dir,
                humidity: hour.humidity,
                cloud: hour.cloud,
                feelslike_c: hour.feelslike_c,
                windchill_c: hour.windchill_c,
                heatindex_c: hour.heatindex_c,
                dewpoint_c: hour.dewpoint_c,
                will_it_rain: hour.will_it_rain,
                chance_of_rain: hour.chance_of_rain,
                will_it_snow: hour.will_it_snow,
                chance_of_snow: hour.chance_of_snow,
                vis_km: hour.vis_km,
                gust_kph: hour.gust_kph,
                uv: hour.uv,
            };
        }),
    };

    return weatherData;
}