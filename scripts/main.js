let videoVisible = false;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    document.querySelector("#player-btn-playpause").addEventListener("click", () => {
        player.playVideo();
    });

    const thumbnailContent = document.querySelector(".player-thumbnail-content");
    thumbnailContent.addEventListener("click", () => {
        thumbnailContent.classList.remove("blink-animation");
        setTimeout(() => {
            thumbnailContent.classList.add("blink-animation");

            const iframe = document.querySelector(".player-iframe-container");
            const img = document.querySelector(".player-thumbnail-img-container");
    
            if (videoVisible) {
                iframe.style.display = "none";
                img.style.display = "block";
            }
            else {
                iframe.style.display = "block";
                img.style.display = "none";
            }
            videoVisible = !videoVisible;
        }, 50);

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