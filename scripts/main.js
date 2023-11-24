document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    document.querySelector("#player-btn-playpause").addEventListener("click", () => {
        player.playVideo();
    });
});

function get_videoIDs() {

    const videoIDs = [
        "TxidFkYHDfI",
        "RfjPHmgBPF0",
        "1ZrZeA8j15w",
        "NVLpJBGVfSw",
        "Tl4bQBfOtbg",
        "Jv8KRwF1zQs",
        "uv9Dv6fzg9w",
        "ejunflwgquc",
        "bD5msFH9gpU",
        "EatzcaVJRMs"
    ];

    for (let i = videoIDs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [videoIDs[i], videoIDs[j]] = [videoIDs[j], videoIDs[i]];
    }

    return videoIDs;
}

let videoIDs = get_videoIDs();

let player;
let playerLoaded = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player-iframe", {
        height: '390',
        width: '640',
        videoId: videoIDs[0],
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // player.playVideo();
}

function onPlayerStateChange(event) {
    console.log(`Player state changed : ${event}`);
}