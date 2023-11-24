document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    document.querySelector("#player-btn-playpause").addEventListener("click", () => {
        player.playVideo();
    });
});

function get_videoID() {

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

    return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

const videoID = get_videoID();

let player;
let playerLoaded = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player-iframe", {
        height: '390',
        width: '640',
        videoId: videoID,
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
    document.querySelector("#player-title").innerHTML = player.videoTitle;

    const thumbnail = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
}

function onPlayerStateChange(event) {
    console.log(`Player state changed : ${event}`);
}