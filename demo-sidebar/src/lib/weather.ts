import * as weather from "weather-js";

export interface WeatherResult {
  location: {
    name: string;
    lat: string;
    long: string;
    timezone: string;
    alert: string;
    degreetype: string;
    imagerelativeurl: string;
  };
  current: {
    temperature: string;
    skycode: string;
    skytext: string;
    date: string;
    observationtime: string;
    observationpoint: string;
    feelslike: string;
    humidity: string;
    winddisplay: string;
    day: string;
    shortday: string;
    windspeed: string;
    imageUrl: string;
  };
  forecast: Array<{
    low: string;
    high: string;
    skycodeday: string;
    skytextday: string;
    date: string;
    day: string;
    shortday: string;
    precip: string;
  }>;
}

export async function getWeather(location: string, unit: string): Promise<WeatherResult> {
  return new Promise((resolve, reject) => {
    weather.find({ search: location, degreeType: unit }, (err: any, result: any) => {
      if (err) {
        reject(new Error("天気情報の取得に失敗しました"));
        return;
      }
      resolve(result[0]);
    });
  });
}
