# セットアップ手順

## ✅ 完了済み設定

- **スプレッドシート**: https://docs.google.com/spreadsheets/d/10-hEVmHu0b4YWXhd2MZsr4z5GgBBgQfWCvp7AObGqdQ/edit?usp=sharing
- **Googleフォーム**: https://docs.google.com/forms/d/e/1FAIpQLSf1XRFB2BxyEKv_wO1g03MhSjTjmtMbkc5nBT_PJNP9ld7NmQ/viewform?usp=dialog

## 🔧 残りの設定手順

### 1. Google Apps Script の設定

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名を「金田塾予約システム」などに設定
4. `google-apps-script.js` の内容をコピーして貼り付け
5. **デプロイ手順**:
   - 画面右上の「デプロイ」→「新しいデプロイ」
   - 「種類を選択」で「ウェブアプリ」を選択
   - 説明: 「予約システムAPI」
   - 実行者: 「自分」
   - アクセスできるユーザー: 「全員」
   - **「デプロイ」をクリック**
   - 表示されるウェブアプリのURLをコピー

### 2. HTMLファイルの更新

取得したGoogle Apps ScriptのウェブアプリURLを以下の場所に設定：

```javascript
const SCRIPT_URL = 'ここに取得したURLを貼り付け';
```

### 3. スプレッドシートの初期化

Google Apps Scriptで一度だけ実行：
```javascript
initializeSpreadsheet();
```

### 4. 振込先情報の更新

`google-apps-script.js` の `BANK_INFO` を実際の振込先に変更：

```javascript
const BANK_INFO = `
【振込先情報】
銀行名：実際の銀行名
支店名：実際の支店名
口座種別：普通
口座番号：実際の口座番号
口座名義：実際の名義

※振込期限：本日より3日以内
※振込名義はお申込み時のお名前でお願いします
`;
```

## 🚀 動作確認

1. `index.html` をブラウザで開く
2. 席数表示が正しく動作することを確認
3. Googleフォームのリンクが動作することを確認
4. 電話番号のリンクが動作することを確認

## 📊 管理方法

- **予約確認**: スプレッドシートで予約状況を確認
- **席数管理**: 「ステータス」列を「予約確定」に変更すると席数に反映
- **入金確認**: 「入金確認日」列に日付を入力

## 🔄 席数の動作

- **10席以下**: 「残り○席」と緊急感のある表示
- **11席以上**: 「お席に余裕があります」と安心感のある表示
- **満席**: 「満席」と表示
- **更新間隔**: 5分ごとに自動更新

## 💡 運用のコツ

1. **毎日の確認**: スプレッドシートで新しい予約をチェック
2. **入金確認**: 振り込みがあったら「ステータス」を「予約確定」に変更
3. **座席調整**: 必要に応じて`SEAT_CONFIG`の数値を調整可能