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

    document.querySelector("#player-btn-previous").addEventListener("click", () => {
        playPreviousMusic();
    });
    document.querySelector("#player-btn-next").addEventListener("click", () => {
        playNextMusic();
    });

    document.querySelector("#player-thumbnail").addEventListener("click", toggleThumbnail);

    addProgressbarEventListeners();
});

function showMusicQueue() {
    const card = document.querySelector("#music-queue-card");
    card.classList.remove("hidden");
    card.classList.add("showing");
}

function hideMusicQueue() {
    const card = document.querySelector("#music-queue-card");
    card.classList.remove("showing");
    card.classList.add("hidden");
}