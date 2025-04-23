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
import { WeatherViewService } from "../services/weatherViewService";

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
    WeatherViewService.setupMessageListener(webviewView);
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href="${stylesUri}" />
          <title>Weather Checker</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}
