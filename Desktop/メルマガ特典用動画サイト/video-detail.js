document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    if (videoId) {
        loadVideoDetail(parseInt(videoId));
    } else {
        showError('動画IDが指定されていません。');
    }
});

async function loadVideoDetail(videoId) {
    try {
        const response = await fetch('videos.json');
        const data = await response.json();
        const video = data.videos.find(v => v.id === videoId);
        
        if (video) {
            if (video.comingSoon) {
                showComingSoon(video);
            } else {
                renderVideoDetail(video);
                loadRelatedVideos(data.videos, videoId);
            }
        } else {
            showError('指定された動画が見つかりません。');
        }
    } catch (error) {
        console.error('動画データの読み込みに失敗しました:', error);
        showError('動画データの読み込みに失敗しました。');
    }
}

function renderVideoDetail(video) {
    // タイトルとカテゴリを設定
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-category').textContent = video.category;
    
    // 動画プレーヤーを設定
    const videoPlayer = document.getElementById('video-player');
    const youtubeId = extractYouTubeId(video.url);
    
    if (youtubeId) {
        videoPlayer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${youtubeId}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        videoPlayer.innerHTML = `
            <div style="height: 450px; display: flex; align-items: center; justify-content: center; color: white;">
                <p>動画の読み込みに失敗しました。</p>
            </div>
        `;
    }
    
    // 動画情報を設定
    document.getElementById('video-description').textContent = video.description;
    document.getElementById('video-meta-category').textContent = video.category;
    
    // ページタイトルを更新
    document.title = `${video.title} - VibeCoding解説動画`;
}

function extractYouTubeId(url) {
    // YouTube URLからビデオIDを抽出
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

function loadRelatedVideos(videos, currentVideoId) {
    const relatedVideos = videos.filter(v => v.id !== currentVideoId && !v.comingSoon);
    const relatedGrid = document.getElementById('related-grid');
    
    if (relatedVideos.length === 0) {
        document.querySelector('.related-videos').style.display = 'none';
        return;
    }
    
    relatedGrid.innerHTML = '';
    
    relatedVideos.forEach(video => {
        const card = createRelatedCard(video);
        relatedGrid.appendChild(card);
    });
}

function createRelatedCard(video) {
    const card = document.createElement('a');
    card.href = `video.html?id=${video.id}`;
    card.className = 'related-card';
    
    card.innerHTML = `
        <div class="related-thumbnail">
            <div class="play-icon">▶</div>
        </div>
        <h4 class="related-title">${video.title}</h4>
        <p class="related-category">${video.category}</p>
    `;
    
    return card;
}

function showComingSoon(video) {
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-category').textContent = video.category;
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="error-message">
            <h2>準備中</h2>
            <p>この動画は現在準備中です。<br>しばらくお待ちください。</p>
            <a href="index.html">動画一覧に戻る</a>
        </div>
    `;
}

function showError(message) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="error-message">
            <h2>エラー</h2>
            <p>${message}</p>
            <a href="index.html">動画一覧に戻る</a>
        </div>
    `;
}