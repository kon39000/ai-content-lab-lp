# Gemini CLI Master - ローカル環境セットアップ

## サイト概要
**Gemini CLI Master - AIプログラミングを極める完全ガイド**

Gemini CLIの導入から実践まで、動画と記事で体系的に学べる講座サイトです。

## ローカル環境での起動方法

### 方法1: Python（推奨）
```bash
cd site
python3 -m http.server 8000
```

### 方法2: Node.js（npxを使用）
```bash
cd site
npx http-server -p 8000
```

### 方法3: VS Codeの拡張機能
VS Codeの「Live Server」拡張機能を使用して、`index.html`を右クリック→「Open with Live Server」

## アクセス方法
ブラウザで以下のURLにアクセス:
```
http://localhost:8000
```

## ディレクトリ構造
```
site/
├── index.html          # メインページ
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── main.js        # JavaScriptファイル
├── package.json       # プロジェクト設定
└── README.md          # このファイル
```

## 動画ファイルについて
ローカル動画を再生するには、以下の構造で動画ファイルを配置してください：
```
GeminiCLI_movie/
├── Node.jpインストール方法.mp4
├── Gemini CLI導入方法.mp4
└── Gemini CLIとは.mp4
```

## 機能
- レスポンシブデザイン対応
- スムーススクロール
- 動画プレイヤー（ローカル動画 + YouTube埋め込み）
- モバイルメニュー
- フェードインアニメーション

## ブラウザ対応
- Chrome（推奨）
- Firefox
- Safari
- Edge

最新2バージョンをサポートしています。