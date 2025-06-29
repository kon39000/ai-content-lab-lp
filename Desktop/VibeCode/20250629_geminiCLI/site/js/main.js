// メニュートグル機能
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 動画プレイヤーの設定
const videoPlayers = document.querySelectorAll('.video-player');
const videoMapping = {
    'nodejs-install': '../GeminiCLI_movie/Node.jpインストール方法.mp4',
    'gemini-cli-install': '../GeminiCLI_movie/Gemini CLI導入方法.mp4',
    'what-is-gemini': '../GeminiCLI_movie/Gemini CLIとは.mp4'
};

videoPlayers.forEach(player => {
    const videoId = player.dataset.video;
    const placeholder = player.querySelector('.placeholder');
    
    placeholder?.addEventListener('click', () => {
        // 動画ファイルのパスを取得
        const videoPath = videoMapping[videoId];
        
        if (videoPath) {
            // video要素を作成
            const video = document.createElement('video');
            video.src = videoPath;
            video.controls = true;
            video.autoplay = true;
            video.style.width = '100%';
            video.style.height = '100%';
            
            // プレースホルダーを動画に置き換え
            player.innerHTML = '';
            player.appendChild(video);
        }
    });
});

// スクロール時のヘッダー処理
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// アニメーション（Intersection Observer）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// アニメーション対象要素を監視
document.querySelectorAll('.path-card, .video-card, .resource-card').forEach(el => {
    observer.observe(el);
});