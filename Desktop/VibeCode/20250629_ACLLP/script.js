// カウントダウン機能
function initCountdown() {
    // 募集終了日時: 2025年7月7日 23:59 (JST)
    const endDate = new Date('2025-07-07T23:59:59+09:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            // 募集終了
            document.getElementById('countdown').innerHTML = '<div class="countdown-message">募集終了いたしました</div>';
            return;
        }
        
        // 時間計算
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 表示更新
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // 初回実行
    updateCountdown();
    
    // 1秒ごとに更新
    setInterval(updateCountdown, 1000);
}

// スムーズスクロール機能
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// アニメーション機能
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.problem-item, .feature-item, .benefit-item, .event-item, .faq-item, .proof-item, .testimonial-item');
    animateElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // パララックス効果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const bgElements = document.querySelectorAll('.features-bg-image');
        
        bgElements.forEach(element => {
            if (element) {
                const speed = 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// CTAボタンのクリック追跡
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Google Analytics などのトラッキングコードをここに追加
            console.log('CTA clicked:', this.textContent);
            
            // 実際のトラッキング例（Google Analytics 4）
            // gtag('event', 'click', {
            //     event_category: 'CTA',
            //     event_label: this.textContent,
            //     value: 1
            // });
        });
    });
}

// フォーム送信時の処理
function initFormHandling() {
    // 待機リスト登録フォームがある場合の処理
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // フォーム送信前の処理
            console.log('Form submitted');
            
            // バリデーションや追加処理をここに追加
        });
    });
}

// 固定ヘッダーCTA
function initFixedCTA() {
    const fixedCTA = document.getElementById('fixed-cta');
    const heroSection = document.getElementById('hero');
    
    if (!fixedCTA || !heroSection) return;
    
    let isVisible = false;
    
    function toggleFixedCTA() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > heroBottom && !isVisible) {
            fixedCTA.classList.remove('hidden');
            isVisible = true;
        } else if (scrollPosition <= heroBottom && isVisible) {
            fixedCTA.classList.add('hidden');
            isVisible = false;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestAnimationFrame(toggleFixedCTA);
    });
}

// レスポンシブ対応
function initResponsive() {
    // モバイルでのタッチイベント最適化
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // ウィンドウサイズ変更時の処理
    window.addEventListener('resize', function() {
        // 必要に応じてレイアウト調整
    });
}

// ページ読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initSmoothScroll();
    initAnimations();
    initCTATracking();
    initFormHandling();
    initResponsive();
    initFixedCTA();
    
    console.log('AIコンテンツラボ LP initialized');
});

// パフォーマンス最適化
window.addEventListener('load', function() {
    // 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});