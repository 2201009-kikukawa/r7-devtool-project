import * as vscode from "vscode";

// 拡張機能が有効になった時に呼び出される関数
export function activate(context: vscode.ExtensionContext) {
  console.log("=== 拡張機能が有効化されました ===");

  // ステータスバーアイテムを作成
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, // 左寄せで表示
    100 // 優先度（数字が大きいほど左に表示）
  );

  // ステータスバーアイテムの設定
  statusBarItem.text = "$(bell) Hello";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "demo-status-bar-item.helloWorld";

  // 起動時からステータスバーアイテムを表示
  statusBarItem.show();

  // コマンドを登録
  const disposable = vscode.commands.registerCommand(
    "demo-status-bar-item.helloWorld",
    () => {
      vscode.window.showInformationMessage("これは私が開発した拡張機能です");
    }
  );

  // 登録したアイテムを破棄リストに追加
  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
