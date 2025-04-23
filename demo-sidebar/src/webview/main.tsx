import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  VSCodeButton,
  VSCodeTextField,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import { WeatherResult } from "../lib/weather";

interface VSCodeMessage {
  command: string;
  location?: string;
  unit?: string;
  payload?: WeatherResult;
  message?: string;
}

// VS CodeのAPIにアクセス
declare const acquireVsCodeApi: () => {
  postMessage: (message: VSCodeMessage) => void;
};
const vscode = acquireVsCodeApi();

// 🌤 メインコンポーネント
const main: React.FC = () => {
  const [location, setLocation] = useState("USA");
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [iconText, setIconText] = useState("");
  const [summary, setSummary] = useState("");

  const checkWeather = () => {
    if (location && unit) {
      setLoading(true);
      setIconVisible(false);
      setSummary("天気情報を取得中...");

      vscode.postMessage({
        command: "weather",
        location: location,
        unit: unit,
      });
    }
  };

  const handleMessage = (event: MessageEvent) => {
    const { command, payload, message } = event.data as VSCodeMessage;

    switch (command) {
      case "weather": {
        setLoading(false);
        setIconVisible(true);
        setIconText(getWeatherIcon(payload!));
        setSummary(getWeatherSummary(payload!));
        break;
      }
      case "error": {
        setLoading(false);
        setIconVisible(false);
        setSummary(message || "エラーが発生しました");
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <VSCodeTextField
        value={location}
        onchange={(e: any) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <VSCodeDropdown value={unit} onchange={(e: any) => setUnit(e.target.value)}>
        <VSCodeOption value="metric">Celsius</VSCodeOption>
        <VSCodeOption value="imperial">Fahrenheit</VSCodeOption>
      </VSCodeDropdown>
      <VSCodeButton onClick={checkWeather}>Check Weather</VSCodeButton>

      {loading && <VSCodeProgressRing />}
      {iconVisible && <div style={{ fontSize: "2rem" }}>{iconText}</div>}
      <div style={{ marginTop: "1rem" }}>{summary}</div>
    </div>
  );
};

const getWeatherSummary = (weatherData: WeatherResult) => {
  const { skytext, temperature } = weatherData.current;
  const degreeType = weatherData.location.degreetype;
  return `${skytext}, ${temperature}°${degreeType}`;
};

const getWeatherIcon = (weatherData: WeatherResult) => {
  const skyText = weatherData.current.skytext.toLowerCase();

  switch (skyText) {
    case "sunny":
    case "clear":
      return "☀️";
    case "mostly sunny":
      return "🌤";
    case "partly sunny":
      return "🌥";
    case "mostly cloudy":
    case "cloudy":
      return "☁️";
    case "rain showers":
    case "rain":
      return "🌧";
    case "fair":
      return "🌥";
    default:
      return "✨";
  }
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));
