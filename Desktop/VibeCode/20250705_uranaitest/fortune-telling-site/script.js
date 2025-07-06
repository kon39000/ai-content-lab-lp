// 占い鑑定書のJavaScript

// 今日の日付を表示
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formatDate = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('today-date').textContent = formatDate;
    
    // スクロールアニメーション
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// 星座判定機能
function analyzeZodiac() {
    const birthdate = document.getElementById('birthdate').value;
    const resultDiv = document.getElementById('zodiac-result');
    
    if (!birthdate) {
        alert('生年月日を入力してください。');
        return;
    }
    
    const date = new Date(birthdate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const zodiacSign = getZodiacSign(month, day);
    const personality = getPersonalityAnalysis(zodiacSign);
    
    resultDiv.innerHTML = `
        <div class="zodiac-info">
            <h3>🌟 ${zodiacSign.name} (${zodiacSign.period})</h3>
            <div class="personality-analysis">
                <h4>✨ パーソナリティ分析</h4>
                <p><strong>基本的な性格：</strong>${personality.basic}</p>
                <p><strong>強み：</strong>${personality.strengths}</p>
                <p><strong>課題：</strong>${personality.challenges}</p>
                <p><strong>AIビジネスでの適性：</strong>${personality.aiBusinessFit}</p>
                <p><strong>成功へのアドバイス：</strong>${personality.advice}</p>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 星座判定
function getZodiacSign(month, day) {
    const zodiacSigns = [
        { name: '水瓶座', period: '1/20 - 2/18', start: [1, 20], end: [2, 18] },
        { name: '魚座', period: '2/19 - 3/20', start: [2, 19], end: [3, 20] },
        { name: '牡羊座', period: '3/21 - 4/19', start: [3, 21], end: [4, 19] },
        { name: '牡牛座', period: '4/20 - 5/20', start: [4, 20], end: [5, 20] },
        { name: '双子座', period: '5/21 - 6/21', start: [5, 21], end: [6, 21] },
        { name: '蟹座', period: '6/22 - 7/22', start: [6, 22], end: [7, 22] },
        { name: '獅子座', period: '7/23 - 8/22', start: [7, 23], end: [8, 22] },
        { name: '乙女座', period: '8/23 - 9/22', start: [8, 23], end: [9, 22] },
        { name: '天秤座', period: '9/23 - 10/23', start: [9, 23], end: [10, 23] },
        { name: '蠍座', period: '10/24 - 11/22', start: [10, 24], end: [11, 22] },
        { name: '射手座', period: '11/23 - 12/21', start: [11, 23], end: [12, 21] },
        { name: '山羊座', period: '12/22 - 1/19', start: [12, 22], end: [1, 19] }
    ];
    
    for (let sign of zodiacSigns) {
        if (sign.name === '山羊座') {
            // 山羊座は年をまたぐため特別処理
            if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
                return sign;
            }
        } else {
            const startMonth = sign.start[0];
            const startDay = sign.start[1];
            const endMonth = sign.end[0];
            const endDay = sign.end[1];
            
            if ((month === startMonth && day >= startDay) || 
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        }
    }
    
    return { name: '不明', period: '' };
}

// パーソナリティ分析
function getPersonalityAnalysis(zodiacSign) {
    const personalities = {
        '水瓶座': {
            basic: '独創的で革新的な発想力を持つ自由人。新しい技術や変化を恐れず、むしろ積極的に取り入れる傾向があります。',
            strengths: '先見の明、独立心、テクノロジーへの適応力、人道的な視点',
            challenges: '飽きっぽさ、型にはまることへの抵抗、感情表現の苦手さ',
            aiBusinessFit: 'AIという新しい分野への適応力が高く、独創的なアプローチで成功する可能性が高いです。',
            advice: '好奇心を大切にし、AIの最新動向を常にチェックしながら、自分らしいサービスを開発しましょう。'
        },
        '魚座': {
            basic: '直感力に優れ、共感力が高い感性豊かな人。想像力が豊富で、人の気持ちを理解するのが得意です。',
            strengths: '直感力、共感力、創造性、適応力、人への理解力',
            challenges: '現実逃避しがち、決断力不足、自信のなさ',
            aiBusinessFit: 'AIを使った創造的なコンテンツ制作や、人の心に響くサービス開発で力を発揮できます。',
            advice: '直感を信じて行動し、AIを使って人の心を動かすコンテンツを作ることで成功できるでしょう。'
        },
        '牡羊座': {
            basic: 'エネルギッシュで行動力があり、新しいことに挑戦するのが得意。リーダーシップを発揮しやすい性格です。',
            strengths: '行動力、リーダーシップ、チャレンジ精神、決断力',
            challenges: '短気、飽きっぽさ、細かい作業への集中力不足',
            aiBusinessFit: 'AIビジネスの立ち上げや新しい分野への参入で、その行動力を活かせます。',
            advice: '思い立ったらすぐ行動する強みを活かし、AIツールを使った効率化で成果を上げましょう。'
        },
        '牡牛座': {
            basic: '安定志向で忍耐強く、一度始めたことは最後までやり遂げる粘り強さがあります。',
            strengths: '忍耐力、安定性、実用性重視、信頼性',
            challenges: '変化への抵抗、頑固さ、新しいことへの躊躇',
            aiBusinessFit: 'AIを使った堅実なビジネスモデル構築や、継続的な収益化で成功できます。',
            advice: '慎重に学習を重ね、確実に収益に結びつくAIツールの活用法を身につけましょう。'
        },
        '双子座': {
            basic: '好奇心旺盛で学習能力が高く、コミュニケーション能力に優れています。',
            strengths: '学習能力、コミュニケーション力、適応力、情報収集力',
            challenges: '集中力不足、継続性の欠如、優柔不断',
            aiBusinessFit: 'AIを使った情報発信や、複数の分野での活用で多面的な成功を収められます。',
            advice: '豊富な知識とコミュニケーション力を活かし、AIを使った情報発信で収益化を図りましょう。'
        },
        '蟹座': {
            basic: '家族思いで温かく、人を大切にする気持ちが強い。安心できる環境を作るのが得意です。',
            strengths: '家族愛、共感力、保護本能、環境作り',
            challenges: '感情的になりやすい、変化への不安、内向的',
            aiBusinessFit: '家族や子育て分野でのAI活用や、人に寄り添うサービス開発で成功できます。',
            advice: '家族との時間を大切にしながら、AIを使って同じ境遇の人を支援するサービスを作りましょう。'
        },
        '獅子座': {
            basic: '自信があり、人を引きつける魅力を持つ。創造性が豊かで、注目されることを好みます。',
            strengths: '自信、創造性、リーダーシップ、表現力',
            challenges: 'プライドの高さ、承認欲求、批判への過敏さ',
            aiBusinessFit: 'AIを使った創造的なコンテンツ制作や、パーソナルブランディングで成功できます。',
            advice: '自分の個性を活かし、AIで作った作品やサービスを堂々と発信していきましょう。'
        },
        '乙女座': {
            basic: '完璧主義で分析力に優れ、細かい作業を丁寧にこなすのが得意です。',
            strengths: '分析力、完璧主義、細かい作業への集中力、実用性',
            challenges: '完璧主義による行動の遅れ、批判的思考、心配性',
            aiBusinessFit: 'AIの詳細な分析や、精密な作業の効率化で高い成果を上げられます。',
            advice: '完璧を求めすぎず、AIを使った効率化で品質と速度のバランスを取りましょう。'
        },
        '天秤座': {
            basic: 'バランス感覚に優れ、美的センスがあり、調和を重視します。',
            strengths: 'バランス感覚、美的センス、調和性、公平性',
            challenges: '優柔不断、決断力不足、対立回避',
            aiBusinessFit: 'AIを使ったデザインや、バランスの取れたサービス設計で成功できます。',
            advice: '美的センスを活かし、AIで美しく使いやすいサービスを作ることで差別化を図りましょう。'
        },
        '蠍座': {
            basic: '集中力が高く、一つのことを深く追求する情熱を持っています。',
            strengths: '集中力、深い洞察力、情熱、探究心',
            challenges: '疑い深さ、秘密主義、執着心',
            aiBusinessFit: 'AIの深い理解と専門性を活かし、ニッチな分野で成功できます。',
            advice: '一つの分野に集中し、AIの専門家として深い価値を提供しましょう。'
        },
        '射手座': {
            basic: '冒険心があり、自由を愛し、新しい知識や経験を求めます。',
            strengths: '冒険心、楽観性、学習意欲、国際性',
            challenges: '飽きっぽさ、責任感の欠如、計画性不足',
            aiBusinessFit: 'AIを使った新しい分野への挑戦や、国際的な展開で成功できます。',
            advice: '好奇心を大切にし、AIで世界を広げる新しいサービスを開発しましょう。'
        },
        '山羊座': {
            basic: '目標達成への意志が強く、責任感があり、計画的に物事を進めます。',
            strengths: '目標達成力、責任感、計画性、忍耐力',
            challenges: '融通の利かなさ、悲観的思考、完璧主義',
            aiBusinessFit: '長期的な視点でAIビジネスを構築し、確実な成果を上げられます。',
            advice: '長期計画を立て、AIスキルを段階的に積み上げて着実に成功を手にしましょう。'
        }
    };
    
    return personalities[zodiacSign.name] || {
        basic: '個性的で特別な才能を持っています。',
        strengths: '独自の視点と能力',
        challenges: '自分らしさを見つけること',
        aiBusinessFit: 'AIを使って新しい可能性を切り開けます。',
        advice: '自分の個性を活かしてAIと共に成長しましょう。'
    };
}