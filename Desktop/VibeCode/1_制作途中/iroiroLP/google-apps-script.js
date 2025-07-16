// Google Apps Script コード
// このコードをGoogle Apps Scriptエディタに貼り付けてください

// スプレッドシートのIDを設定
const SPREADSHEET_ID = '10-hEVmHu0b4YWXhd2MZsr4z5GgBBgQfWCvp7AObGqdQ';

// 管理者のメールアドレス
const ADMIN_EMAIL = 'kanadajuku@gmail.com';

// 各公演の座席数設定
const SEAT_CONFIG = {
  '8月1日(金) 18:00〜': 100,
  '8月2日(土) 13:00〜': 100,
  '8月2日(土) 15:30〜': 100
};

// 振込先情報
const BANK_INFO = `
【振込先情報】
銀行名：○○銀行
支店名：○○支店
口座種別：普通
口座番号：1234567
口座名義：○○○○

※振込期限：本日より3日以内
※振込名義はお申込み時のお名前でお願いします
`;

function doPost(e) {
  try {
    // リクエストデータを取得
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートに記録
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('予約リスト');
    
    // 予約番号を生成
    const reservationId = generateReservationId();
    
    // 現在の日時
    const timestamp = new Date().toLocaleString('ja-JP');
    
    // データを追加（シンプル版）
    sheet.appendRow([
      reservationId,
      timestamp,
      data.name,
      data.email,
      data.showtime,
      data.tickets,
      '予約完了',
      '', // 備考
    ]);
    
    // 確認メールを送信
    sendSimpleConfirmationEmail(data, reservationId);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        reservationId: reservationId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function generateReservationId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `KO${year}${month}${day}-${random}`;
}

function sendSimpleConfirmationEmail(data, reservationId) {
  const subject = `【金田塾OMET】予約完了（予約番号：${reservationId}）`;
  
  const body = `
${data.name} 様

この度は、金田塾・OMET合同発表会「いろ・いろ・いろいろ語り」に
ご予約いただきまして、誠にありがとうございます！

【予約内容】
予約番号：${reservationId}
お名前：${data.name}
メールアドレス：${data.email}
希望日時：${data.showtime}
チケット枚数：${data.tickets}枚

【お支払いについて】
当日会場にて現金でお支払いください。
一般：2,000円
小中学生：1,000円
幼児（座席必要）：500円
幼児（座席不要）：無料

【会場情報】
としま区民センター 6F 小ホール
JR他各線「池袋駅」(東口)より徒歩7分
※開場は開演30分前からです

何かご不明な点がございましたら、お気軽にお問い合わせください。
電話：090-3315-9222
メール：${ADMIN_EMAIL}

当日お会いできることを楽しみにしております！

金田塾・OMET
`;
  
  try {
    // お客様にメール送信
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: body
    });
  } catch (error) {
    console.error('お客様へのメール送信エラー:', error);
  }
  
  // 管理者に通知
  const adminSubject = `【新規予約】${data.name}様 (${reservationId})`;
  const adminBody = `
新しい予約が入りました。

予約番号：${reservationId}
お名前：${data.name}
メールアドレス：${data.email}
希望日時：${data.showtime}
チケット枚数：${data.tickets}枚
予約日時：${new Date().toLocaleString('ja-JP')}

スプレッドシートで詳細を確認してください。
${BANK_INFO}
`;
  
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    body: adminBody
  });
}

// 座席状況を取得する関数
function getSeatStatus() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('予約リスト');
    const data = sheet.getDataRange().getValues();
    
    // 初期化
    const status = {};
    Object.keys(SEAT_CONFIG).forEach(showtime => {
      status[showtime] = { 
        total: SEAT_CONFIG[showtime], 
        reserved: 0,
        available: SEAT_CONFIG[showtime]
      };
    });
    
    // データが存在しない場合は初期値を返す
    if (data.length <= 1) {
      return status;
    }
    
    // ヘッダー行をスキップして集計
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 12) continue;
      
      const showtime = row[4]; // 希望日時
      const generalTickets = parseInt(row[5]) || 0; // 一般チケット
      const studentTickets = parseInt(row[6]) || 0; // 学生チケット
      const infantTickets = parseInt(row[7]) || 0; // 幼児チケット
      const reservationStatus = row[11]; // ステータス
      
      // 確定済みの予約のみカウント（仮予約も含める場合は条件を変更）
      if ((reservationStatus === '予約確定' || reservationStatus === '仮予約') && status[showtime]) {
        const totalTickets = generalTickets + studentTickets + infantTickets;
        status[showtime].reserved += totalTickets;
      }
    }
    
    // available を計算
    Object.keys(status).forEach(showtime => {
      status[showtime].available = status[showtime].total - status[showtime].reserved;
      if (status[showtime].available < 0) {
        status[showtime].available = 0;
      }
    });
    
    return status;
  } catch (error) {
    console.error('座席状況取得エラー:', error);
    // エラー時はデフォルト値を返す
    const defaultStatus = {};
    Object.keys(SEAT_CONFIG).forEach(showtime => {
      defaultStatus[showtime] = { 
        total: SEAT_CONFIG[showtime], 
        reserved: 0,
        available: SEAT_CONFIG[showtime]
      };
    });
    return defaultStatus;
  }
}

// Web APIとして座席状況を返す
function doGet(e) {
  try {
    const seatStatus = getSeatStatus();
    
    return ContentService
      .createTextOutput(JSON.stringify(seatStatus))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  } catch (error) {
    console.error('API エラー:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'データの取得に失敗しました',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// スプレッドシートの初期化（初回実行時）
function initializeSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('予約リスト');
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = spreadsheet.insertSheet('予約リスト');
    }
    
    // ヘッダー行を設定（シンプル版）
    const headers = [
      '予約番号',
      '予約日時', 
      'お名前',
      'メールアドレス',
      '希望日時',
      'チケット枚数',
      'ステータス',
      '備考'
    ];
    
    // A1セルから開始してヘッダーを設定
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    console.log('スプレッドシートの初期化が完了しました');
  } catch (error) {
    console.error('スプレッドシート初期化エラー:', error);
  }
}