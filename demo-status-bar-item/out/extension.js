"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
// 拡張機能が 有効になった時に に呼び出される関数
function activate(context) {
    console.log("=== 拡張機能が有効化されました ===");
    // ステータスバーアイテムを作成
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, // 左寄せで表示
    100 // 優先度（数字が大きいほど左に表示）
    );
    // ボタンのテキストとコマンドを設定
    statusBarItem.text = "$(bell) Hello"; // $(bell)はVS Codeのアイコン
    statusBarItem.tooltip = "クリックするとメッ セージを表示します"; // マウスホバー時のツールチップ
    statusBarItem.command = "sample-vscode-extension.helloWorld"; // クリック時に実行するコマンド
    // ステータスバーアイテムを表示
    statusBarItem.show();
    // コマンドの登録（既存のコード）
    const disposable = vscode.commands.registerCommand("sample-vscode-extension.helloWorld", // コマンド名を指定
    () => {
        // 処理を記述
        vscode.window.showInformationMessage(
        // メッセージ表示
        "これは私が開発した拡張機能です");
    });
    // 登録したアイテムを破棄リストに追加
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(disposable); // コマンドを登録
}
function deactivate() { }
//# sourceMappingURL=extension.js.map