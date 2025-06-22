document.addEventListener('DOMContentLoaded', function() {
    loadVideos();
});

async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        const data = await response.json();
        renderVideoGrid(data.videos);
    } catch (error) {
        console.error('動画データの読み込みに失敗しました:', error);
        showError();
    }
}

function renderVideoGrid(videos) {
    const videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';

    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoGrid.appendChild(videoCard);
    });
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = `video-card ${video.comingSoon ? 'coming-soon' : ''}`;
    
    card.innerHTML = `
        <div class="video-thumbnail">
            ${video.comingSoon ? '<div class="coming-soon-badge">Coming Soon</div>' : ''}
            <div class="play-icon">▶</div>
        </div>
        <div class="video-category">${video.category}</div>
        <h3 class="video-title">${video.title}</h3>
        <p class="video-description">${video.description}</p>
        ${video.comingSoon ? 
            '<span class="video-link disabled">準備中</span>' :
            `<a href="video.html?id=${video.id}" class="video-link">動画を見る</a>`
        }
    `;
    
    return card;
}

function showError() {
    const videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <p>動画データの読み込みに失敗しました。しばらく後でもう一度お試しください。</p>
        </div>
    `;
}