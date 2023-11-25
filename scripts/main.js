const playLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/play_white.png";
const pauseLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/pause_white.png";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    document.querySelector("#player-btn-playpause").addEventListener("click", () => {
        const stat = player.getPlayerState();
        if (stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING)
            player.pauseVideo();
        else
            player.playVideo();
    });

    document.querySelector("#player-thumbnail").addEventListener("click", toggleThumbnail);

    addProgressbarEventListeners();
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