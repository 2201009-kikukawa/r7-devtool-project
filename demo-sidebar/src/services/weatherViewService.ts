import { WebviewView } from "vscode";
import { getWeather } from "../lib/weather";

export class WeatherViewService {
  static setupMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage(async ({ command, location, unit }) => {
      if (command !== "weather") return;

      try {
        const weatherForecast = await getWeather(location, unit);
        webviewView.webview.postMessage({
          command: "weather",
          payload: weatherForecast,
        });
      } catch (error) {
        webviewView.webview.postMessage({
          command: "error",
          message: "申し訳ありませんが、現在天気情報を取得できません...",
        });
      }
    });
  }
}
