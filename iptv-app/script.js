async function loadPlaylist() {
    const url = document.getElementById('playlist-url').value.trim();
    if (!url) return;
    try {
        const resp = await fetch(url);
        const text = await resp.text();
        const lines = text.split(/\r?\n/);
        const channelsDiv = document.getElementById('channels');
        channelsDiv.innerHTML = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXTINF')) {
                const name = lines[i].split(',')[1] || 'Unknown';
                const streamUrl = lines[i+1];
                const div = document.createElement('div');
                div.textContent = name;
                div.className = 'channel';
                div.onclick = () => playStream(streamUrl);
                channelsDiv.appendChild(div);
            }
        }
    } catch (err) {
        alert('Failed to load playlist');
        console.error(err);
    }
}

document.getElementById('load').addEventListener('click', loadPlaylist);

function playStream(url) {
    const video = document.getElementById('video');
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    } else {
        alert('HLS not supported in this browser');
    }
    video.play();
}
