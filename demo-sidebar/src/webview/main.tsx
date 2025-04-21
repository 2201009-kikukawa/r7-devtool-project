import React, { useEffect, useRef, useState } from "react";
import {
    VSCodeButton,
    VSCodeTextField,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeProgressRing
} from '@vscode/webview-ui-toolkit/react';

// VS CodeのAPIにアクセス
declare const acquireVsCodeApi: () => {
    postMessage: (message: any) => void;
};
const vscode = acquireVsCodeApi();

// 🌤 メインコンポーネント
const WeatherApp: React.FC = () => {
    const locationRef = useRef<any>(null);
    const unitRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [iconVisible, setIconVisible] = useState(false);
    const [iconText, setIconText] = useState("");
    const [summary, setSummary] = useState("");

    const checkWeather = () => {
        if (locationRef.current && unitRef.current) {
            setLoading(true);
            setIconVisible(false);
            setSummary("天気情報を取得中...");

            vscode.postMessage({
                command: "weather",
                location: (locationRef.current as any)?.value,
                unit: (unitRef.current as any)?.value,
            });
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { command, payload, message } = event.data;

            switch (command) {
                case "weather": {
                    const weatherData = JSON.parse(payload);
                    setLoading(false);
                    setIconVisible(true);
                    setIconText(getWeatherIcon(weatherData));
                    setSummary(getWeatherSummary(weatherData));
                    break;
                }
                case "error": {
                    setLoading(false);
                    setIconVisible(false);
                    setSummary(message);
                    break;
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <VSCodeTextField ref={locationRef} placeholder="Location" />
            <VSCodeDropdown ref={unitRef}>
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

const getWeatherSummary = (weatherData: any) => {
    const { skyText, temperature, degreeType } = weatherData.current;
    return `${skyText}, ${temperature}°${degreeType}`;
};

const getWeatherIcon = (weatherData: any) => {
    const skyText = weatherData.current.skyText.toLowerCase();

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

export default WeatherApp;
