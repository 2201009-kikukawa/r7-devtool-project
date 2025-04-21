import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import * as weather from "weather-js";

export class WeatherViewProvider implements WebviewViewProvider {
  public static readonly viewType = "weather.weatherView";

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    // webviewでスクリプトを許可する
    webviewView.webview.options = {
      // webviewでJavaScriptを有効にする
      enableScripts: true,
      // webviewが`out`ディレクトリからのみリソースを読み込むように制限する
      localResourceRoots: [Uri.joinPath(this._extensionUri, "out")],
    };

    // webviewビューを埋めるHTMLコンテンツを設定する
    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

    // webviewビューコンテキストから渡されたメッセージをリッスンするイベントリスナーを設定し、
    // 受信したメッセージに基づいてコードを実行する
    this._setWebviewMessageListener(webviewView);
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    // ヒント: 以下のコードのハイライトを有効にするには、es6-string-html VS Code拡張機能をインストールしてください
    return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
					<link rel="stylesheet" href="${stylesUri}">
					<title>Weather Checker</title>
				</head>
				<body>
          <h1>Weather Checker</h1>
          <section id="search-container">
            <vscode-text-field
              id="location"
              placeholder="Location"
              value="Seattle, WA">
            </vscode-text-field>
            <vscode-dropdown id="unit">
              <vscode-option value="F">Fahrenheit</vscode-option>
              <vscode-option value="C">Celsius</vscode-option>
            </vscode-dropdown>
          </section>
          <vscode-button id="check-weather-button">Check</vscode-button>
          <h2>Current Weather</h2>
          <section id="results-container">
            <vscode-progress-ring id="loading" class="hidden"></vscode-progress-ring>
            <p id="icon"></p>
            <p id="summary"></p>
          </section>
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
				</body>
			</html>
		`;
  }

  private _setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      const command = message.command;
      const location = message.location;
      const unit = message.unit;

      switch (command) {
        case "weather":
          weather.find({ search: location, degreeType: unit }, (err: any, result: any) => {
            if (err) {
              webviewView.webview.postMessage({
                command: "error",
                message: "申し訳ありませんが、現在天気情報を取得できません...",
              });
              return;
            }
            // 天気予報の結果を取得する
            const weatherForecast = result[0];
            // 天気予報オブジェクトをwebviewに渡す
            webviewView.webview.postMessage({
              command: "weather",
              payload: JSON.stringify(weatherForecast),
            });
          });
          break;
      }
    });
  }
}
