## 準備

vscodeを最新バージョンにしておく（cursorはうまくいかないかも）

## 拡張機能開発に取り掛かるための手順

`/r7-devtool-project`配下で⬇︎を実行

```
yo code
```

※エラーが出る場合は⬇︎を実行
```
npm install -g yo generator-code
```

※それもエラーが出る場合はNode.jsをインストール

以下の設問に答える（選択肢は十字キー＋Enter）

? What type of extension do you want to create?
❯ New Extension (TypeScript)

? What's the name of your extension?
> 開発する拡張機能の名前 (技術調査なら接頭辞に `demo-` をつける)

? What's the identifier of your extension?
> Enter

? What's the description of your extension?
> Enter

? Initialize a git repository?
> n

? Which bundler to use?
> unbundled

? Which package manager to use?
> npm

? Do you want to open the new folder with Visual Studio Code?
> Open

## デバッグ方法

- デバッグしたい拡張機能をvscodeで開く
- 左のサイドバーから「実行とデバッグ」押下
- 緑色の三角ボタンを押す
- 別ウィンドウで開かれるvscodeで確認する
  - コマンド実行は ctrl + shift + P からコマンドパレットを開いて実行

https://github.com/user-attachments/assets/87f16fa6-d68b-4cba-b252-8b555f64e581

