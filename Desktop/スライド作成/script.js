let currentSlide = 1;
const totalSlides = 9;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlide);
    updateSlideIndicator();
    
    // キーボードナビゲーション
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
    
    // タッチスワイプ対応
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            changeSlide(1); // 左スワイプで次へ
        }
        if (touchEndX > touchStartX + 50) {
            changeSlide(-1); // 右スワイプで前へ
        }
    }
});

function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    
    if (n > totalSlides) {
        currentSlide = 1;
    }
    if (n < 1) {
        currentSlide = totalSlides;
    }
    
    // すべてのスライドを非表示
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    // 現在のスライドを表示
    slides[currentSlide - 1].classList.add('active');
    
    // スライド番号を更新
    updateSlideIndicator();
}

function changeSlide(n) {
    currentSlide += n;
    showSlide(currentSlide);
}

function updateSlideIndicator() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('total-slides').textContent = totalSlides;
    
    // ナビゲーションボタンの状態更新
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
}

// フルスクリーン対応
document.addEventListener('keydown', function(e) {
    if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
    }
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}