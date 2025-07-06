// Daily Fortune Service - JavaScript

// データベースとユーザー管理
class FortuneService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.checkUserLogin();
    }

    // イベントリスナーの設定
    setupEventListeners() {
        // ユーザー登録フォーム
        document.getElementById('user-registration').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });

        // 今日の日付を表示
        this.updateTodayDate();
    }

    // ユーザーデータの読み込み
    loadUserData() {
        const userData = localStorage.getItem('fortune_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // ユーザーデータの保存
    saveUserData() {
        localStorage.setItem('fortune_user', JSON.stringify(this.currentUser));
    }

    // ログイン状態の確認
    checkUserLogin() {
        if (this.currentUser) {
            this.showMainScreen();
        } else {
            this.showRegistrationScreen();
        }
    }

    // ユーザー登録
    registerUser() {
        const nickname = document.getElementById('nickname').value.trim();
        const birthdate = document.getElementById('birthdate').value;
        const terms = document.getElementById('terms').checked;

        if (!nickname || !birthdate || !terms) {
            alert('すべての項目を入力し、利用規約に同意してください。');
            return;
        }

        // 星座の計算
        const zodiacSign = this.calculateZodiacSign(birthdate);
        
        // ユーザーデータの作成
        this.currentUser = {
            nickname: nickname,
            birthdate: birthdate,
            zodiacSign: zodiacSign,
            plan: 'free',
            joinDate: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            usageCount: 0,
            settings: {
                notifications: true
            }
        };

        this.saveUserData();
        this.showMainScreen();
    }

    // 星座計算
    calculateZodiacSign(birthdate) {
        const date = new Date(birthdate);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const zodiacSigns = [
            { name: '山羊座', start: [12, 22], end: [1, 19], element: '土', traits: ['責任感', '目標達成力', '忍耐力'] },
            { name: '水瓶座', start: [1, 20], end: [2, 18], element: '風', traits: ['独創性', '自由精神', '革新性'] },
            { name: '魚座', start: [2, 19], end: [3, 20], element: '水', traits: ['直感力', '共感力', '創造性'] },
            { name: '牡羊座', start: [3, 21], end: [4, 19], element: '火', traits: ['行動力', 'リーダーシップ', 'エネルギー'] },
            { name: '牡牛座', start: [4, 20], end: [5, 20], element: '土', traits: ['安定性', '忍耐力', '実用性'] },
            { name: '双子座', start: [5, 21], end: [6, 21], element: '風', traits: ['知識欲', 'コミュニケーション', '適応力'] },
            { name: '蟹座', start: [6, 22], end: [7, 22], element: '水', traits: ['家族愛', '保護本能', '感受性'] },
            { name: '獅子座', start: [7, 23], end: [8, 22], element: '火', traits: ['自信', '創造性', '表現力'] },
            { name: '乙女座', start: [8, 23], end: [9, 22], element: '土', traits: ['分析力', '完璧主義', '実用性'] },
            { name: '天秤座', start: [9, 23], end: [10, 23], element: '風', traits: ['バランス感覚', '美意識', '調和'] },
            { name: '蠍座', start: [10, 24], end: [11, 22], element: '水', traits: ['集中力', '洞察力', '情熱'] },
            { name: '射手座', start: [11, 23], end: [12, 21], element: '火', traits: ['冒険心', '楽観性', '学習意欲'] }
        ];

        for (let sign of zodiacSigns) {
            if (sign.name === '山羊座') {
                if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
                    return sign;
                }
            } else {
                const [startMonth, startDay] = sign.start;
                const [endMonth, endDay] = sign.end;
                
                if ((month === startMonth && day >= startDay) || 
                    (month === endMonth && day <= endDay)) {
                    return sign;
                }
            }
        }

        return zodiacSigns[0]; // デフォルトで山羊座
    }

    // 画面表示管理
    showRegistrationScreen() {
        document.getElementById('registration-screen').style.display = 'block';
        document.getElementById('main-screen').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'none';
    }

    showMainScreen() {
        document.getElementById('registration-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'block';
        document.getElementById('settings-screen').style.display = 'none';
        
        this.updateMainScreen();
        this.loadDailyFortune();
    }

    showSettingsScreen() {
        document.getElementById('registration-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'block';
        
        this.updateSettingsScreen();
    }

    // メイン画面の更新
    updateMainScreen() {
        if (!this.currentUser) return;

        // ユーザー情報の表示
        document.getElementById('user-greeting').textContent = `こんにちは、${this.currentUser.nickname}さん！`;
        document.getElementById('user-zodiac').textContent = `あなたの星座: ${this.currentUser.zodiacSign.name}`;
        
        // 利用状況の更新
        this.updateSubscriptionStatus();
        
        // 最終訪問日の更新
        this.currentUser.lastVisit = new Date().toISOString();
        this.saveUserData();
    }

    // 日付の更新
    updateTodayDate() {
        const today = new Date();
        const dateString = today.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        const todayElement = document.getElementById('today-date');
        if (todayElement) {
            todayElement.textContent = dateString;
        }
    }

    // 毎日の占い生成
    loadDailyFortune() {
        if (!this.currentUser) return;

        const today = new Date().toDateString();
        const lastFortuneDate = localStorage.getItem('last_fortune_date');
        
        // 今日の占いがまだ生成されていない場合
        if (lastFortuneDate !== today) {
            this.generateDailyFortune();
            localStorage.setItem('last_fortune_date', today);
            
            // 利用回数の更新
            this.currentUser.usageCount++;
            this.saveUserData();
        } else {
            // 既存の占いを表示
            this.displayStoredFortune();
        }
    }

    // 占い生成
    generateDailyFortune() {
        const zodiac = this.currentUser.zodiacSign;
        const seed = this.generateDailySeed();
        const fortune = this.createFortuneMessage(zodiac, seed);
        
        // 占いデータの保存
        localStorage.setItem('daily_fortune', JSON.stringify(fortune));
        
        // 占いの表示
        this.displayFortune(fortune);
    }

    // 保存された占いの表示
    displayStoredFortune() {
        const storedFortune = localStorage.getItem('daily_fortune');
        if (storedFortune) {
            const fortune = JSON.parse(storedFortune);
            this.displayFortune(fortune);
        }
    }

    // 日次シードの生成（同じ日なら同じ結果）
    generateDailySeed() {
        const today = new Date();
        const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const userString = this.currentUser.nickname + this.currentUser.birthdate;
        
        // 簡単なハッシュ関数でシードを生成
        let hash = 0;
        const fullString = dateString + userString;
        for (let i = 0; i < fullString.length; i++) {
            const char = fullString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bitに変換
        }
        return Math.abs(hash);
    }

    // 占いメッセージの作成
    createFortuneMessage(zodiac, seed) {
        const random = this.seededRandom(seed);
        
        // 運勢レベル (1-5)
        const fortuneLevel = Math.floor(random() * 5) + 1;
        
        // メインメッセージのテンプレート
        const mainMessages = {
            1: [
                `今日は少し慎重に過ごしましょう。${zodiac.name}のあなたには、静かな時間を大切にすることで新しい発見があるはずです。`,
                `今日は内省の日です。${zodiac.name}の特徴である${zodiac.traits[0]}を活かして、自分自身と向き合う時間を作りましょう。`,
                `今日はゆっくりと歩みを進める日です。${zodiac.name}のあなたの${zodiac.traits[1]}が、困難を乗り越える力となるでしょう。`
            ],
            2: [
                `今日は普通の一日となりそうです。${zodiac.name}のあなたの${zodiac.traits[0]}を活かして、日常を丁寧に過ごしましょう。`,
                `今日は安定した運気です。${zodiac.name}らしい${zodiac.traits[1]}で、着実に前進していきましょう。`,
                `今日は平穏な一日です。${zodiac.name}のあなたの${zodiac.traits[2]}を大切に、周りの人との調和を保ちましょう。`
            ],
            3: [
                `今日は良い運気に恵まれています。${zodiac.name}のあなたの${zodiac.traits[0]}が、素晴らしい結果をもたらすでしょう。`,
                `今日は幸運な日です。${zodiac.name}の特徴である${zodiac.traits[1]}を活かして、新しいチャンスを掴みましょう。`,
                `今日は順調な一日となるでしょう。${zodiac.name}のあなたの${zodiac.traits[2]}が、周りの人にも良い影響を与えます。`
            ],
            4: [
                `今日は非常に良い運気です！${zodiac.name}のあなたの${zodiac.traits[0]}が最大限に発揮される日です。`,
                `今日は素晴らしい一日となるでしょう。${zodiac.name}らしい${zodiac.traits[1]}で、大きな成果を得られそうです。`,
                `今日は幸運に満ちた日です。${zodiac.name}のあなたの${zodiac.traits[2]}が、予想以上の結果をもたらします。`
            ],
            5: [
                `今日は最高の運気です！${zodiac.name}のあなたにとって、人生を変えるような出来事が起こるかもしれません。`,
                `今日は奇跡的な一日となるでしょう。${zodiac.name}の全ての良い特徴が輝く、特別な日です。`,
                `今日は運命の日です。${zodiac.name}のあなたの持つ${zodiac.traits[0]}、${zodiac.traits[1]}、${zodiac.traits[2]}すべてが調和して、素晴らしい結果をもたらします。`
            ]
        };

        // 分野別運勢のテンプレート
        const loveMessages = [
            '新しい出会いに期待', '恋人との絆が深まる', '家族との時間を大切に',
            '過去の恋愛を振り返る', '自分磨きに最適', '思いやりが通じる'
        ];

        const workMessages = [
            '新しいプロジェクトにチャンス', '同僚との協力がうまくいく', '集中力が高まる',
            '創造性が発揮される', 'リーダーシップを発揮', '学習に最適な時期'
        ];

        const healthMessages = [
            '体調管理に注意', '運動を始めるのに良い日', '質の良い睡眠を',
            'ストレス発散を', '栄養バランスを意識', '心の健康も大切に'
        ];

        const moneyMessages = [
            '投資のチャンス', '節約を心がけて', '副収入の可能性',
            '家計の見直しを', '貯蓄のタイミング', '賢い買い物ができる'
        ];

        // ラッキーアイテムとカラー
        const luckyItems = [
            'ペン', '手帳', '香水', '指輪', 'スマートフォン', '本',
            '花', '音楽', '写真', 'お守り', '時計', '鍵'
        ];

        const luckyColors = [
            { name: 'ゴールド', hex: '#FFD700' },
            { name: 'シルバー', hex: '#C0C0C0' },
            { name: 'ブルー', hex: '#4169E1' },
            { name: 'グリーン', hex: '#32CD32' },
            { name: 'ピンク', hex: '#FF69B4' },
            { name: 'パープル', hex: '#9370DB' },
            { name: 'オレンジ', hex: '#FF8C00' },
            { name: 'レッド', hex: '#DC143C' }
        ];

        // ランダム選択
        const mainMessage = mainMessages[fortuneLevel][Math.floor(random() * mainMessages[fortuneLevel].length)];
        const loveMessage = loveMessages[Math.floor(random() * loveMessages.length)];
        const workMessage = workMessages[Math.floor(random() * workMessages.length)];
        const healthMessage = healthMessages[Math.floor(random() * healthMessages.length)];
        const moneyMessage = moneyMessages[Math.floor(random() * moneyMessages.length)];
        const luckyItem = luckyItems[Math.floor(random() * luckyItems.length)];
        const luckyColor = luckyColors[Math.floor(random() * luckyColors.length)];

        return {
            level: fortuneLevel,
            mainMessage: mainMessage,
            love: loveMessage,
            work: workMessage,
            health: healthMessage,
            money: moneyMessage,
            luckyItem: luckyItem,
            luckyColor: luckyColor,
            rating: '⭐'.repeat(fortuneLevel)
        };
    }

    // シード付きランダム関数
    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    // 占いの表示
    displayFortune(fortune) {
        document.getElementById('fortune-rating').textContent = fortune.rating;
        document.getElementById('main-message').textContent = fortune.mainMessage;
        document.getElementById('love-fortune').textContent = fortune.love;
        document.getElementById('work-fortune').textContent = fortune.work;
        document.getElementById('health-fortune').textContent = fortune.health;
        document.getElementById('money-fortune').textContent = fortune.money;
        document.getElementById('lucky-item').textContent = fortune.luckyItem;
        
        const colorElement = document.getElementById('lucky-color');
        colorElement.textContent = fortune.luckyColor.name;
        colorElement.style.backgroundColor = fortune.luckyColor.hex;
        colorElement.style.color = this.getContrastColor(fortune.luckyColor.hex);
    }

    // コントラスト色の計算
    getContrastColor(hex) {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? '#000000' : '#FFFFFF';
    }

    // サブスクリプション状態の更新
    updateSubscriptionStatus() {
        const planElement = document.getElementById('plan-status');
        const usageElement = document.getElementById('usage-count');
        const upgradeElement = document.getElementById('upgrade-prompt');

        if (this.currentUser.plan === 'free') {
            planElement.textContent = '無料プラン';
            usageElement.textContent = `今月の利用回数: ${this.currentUser.usageCount}/12`;
            upgradeElement.style.display = 'block';
        } else {
            planElement.textContent = 'プレミアムプラン';
            usageElement.textContent = '無制限利用';
            upgradeElement.style.display = 'none';
        }
    }

    // 設定画面の更新
    updateSettingsScreen() {
        document.getElementById('settings-nickname').value = this.currentUser.nickname;
        document.getElementById('settings-birthdate').value = this.currentUser.birthdate;
        document.getElementById('daily-notifications').checked = this.currentUser.settings.notifications;
        document.getElementById('current-plan').textContent = `現在のプラン: ${this.currentUser.plan === 'free' ? '無料プラン' : 'プレミアムプラン'}`;
    }

    // 日数カウンターの更新
    updateDayCounter() {
        const joinDate = new Date(this.currentUser.joinDate);
        const today = new Date();
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        document.getElementById('day-counter').textContent = `利用開始から${diffDays}日目`;
    }
}

// グローバル関数
let fortuneService;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    fortuneService = new FortuneService();
});

// プラン選択
function selectPlan(planType) {
    if (planType === 'premium') {
        alert('プレミアムプラン機能は開発中です。しばらくお待ちください。');
    }
    // 無料プランは現在のフローで続行
}

// 利用規約表示
function showTerms() {
    alert('利用規約:\n\n1. 本サービスは娯楽目的で提供されます\n2. 占い結果は参考程度にお考えください\n3. 個人情報は適切に管理されます\n4. サービスの改善のためデータを活用する場合があります');
}

// プライバシーポリシー表示
function showPrivacy() {
    alert('プライバシーポリシー:\n\n1. 収集する情報: ニックネーム、生年月日、利用状況\n2. 利用目的: サービス提供、占い結果の個人化\n3. 第三者への提供: 行いません\n4. データの保存: ローカルストレージに保存されます');
}

// 設定表示
function showSettings() {
    fortuneService.showSettingsScreen();
}

// メイン画面に戻る
function backToMain() {
    fortuneService.showMainScreen();
}

// プロフィール更新
function updateProfile() {
    const newNickname = document.getElementById('settings-nickname').value.trim();
    const newBirthdate = document.getElementById('settings-birthdate').value;
    const notifications = document.getElementById('daily-notifications').checked;

    if (newNickname && newBirthdate) {
        fortuneService.currentUser.nickname = newNickname;
        fortuneService.currentUser.birthdate = newBirthdate;
        fortuneService.currentUser.zodiacSign = fortuneService.calculateZodiacSign(newBirthdate);
        fortuneService.currentUser.settings.notifications = notifications;
        
        fortuneService.saveUserData();
        alert('プロフィールが更新されました！');
        fortuneService.showMainScreen();
    } else {
        alert('ニックネームと生年月日を入力してください。');
    }
}

// 料金プラン表示
function showPricing() {
    alert('料金プラン:\n\n無料プラン: 月12回まで利用可能\nプレミアムプラン: 月額980円で無制限利用\n\n現在プレミアムプランは開発中です。');
}

// 占いシェア
function shareFortune() {
    const today = new Date().toLocaleDateString('ja-JP');
    const message = `${today}の私の運勢をチェック！\n\nDaily Fortune で毎日の占いを楽しんでいます✨`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Daily Fortune',
            text: message,
            url: window.location.href
        });
    } else {
        // フォールバック
        navigator.clipboard.writeText(message + '\n' + window.location.href).then(() => {
            alert('メッセージがクリップボードにコピーされました！');
        });
    }
}

// 履歴表示
function showHistory() {
    alert('履歴機能は開発中です。プレミアムプランで利用予定です。');
}

// ログアウト
function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.removeItem('fortune_user');
        localStorage.removeItem('daily_fortune');
        localStorage.removeItem('last_fortune_date');
        fortuneService.currentUser = null;
        fortuneService.showRegistrationScreen();
    }
}