import * as vscode from "vscode";

// 拡張機能が 有効になった時に に呼び出される関数
export function activate(context: vscode.ExtensionContext) {
  console.log("=== 拡張機能が有効化されました ===");

  // ステータスバーアイテムを作成
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, // 左寄せで表示
    100 // 優先度（数字が大きいほど左に表示）
  );

  // ボタンのテキストとコマンドを設定
  statusBarItem.text = "$(bell) Hello"; // $(bell)はVS Codeのアイコン
  statusBarItem.tooltip = "クリックするとメッ セージを表示します"; // マウスホバー時のツールチップ
  statusBarItem.command = "sample-vscode-extension.helloWorld"; // クリック時に実行するコマンド

  // ステータスバーアイテムを表示
  statusBarItem.show();

  // コマンドの登録（既存のコード）
  const disposable = vscode.commands.registerCommand(
    "sample-vscode-extension.helloWorld", // コマンド名を指定
    () => {
      // 処理を記述
      vscode.window.showInformationMessage(
        // メッセージ表示
        "これは私が開発した拡張機能です"
      );
    }
  );

  // 登録したアイテムを破棄リストに追加
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(disposable); // コマンドを登録
}

export function deactivate() {}
