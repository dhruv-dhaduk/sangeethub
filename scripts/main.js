const playLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/play_white.png";
const pauseLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/pause_white.png";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    document.querySelector("#player-btn-queue").addEventListener("click", showMusicQueue);
    document.querySelector("#music-queue-close-btn").addEventListener("click", hideMusicQueue);

    const populateMusicQueueITV = setInterval(() => {
        if (fetchStatus === -1) {
            clearInterval(populateMusicQueueITV);
        }
        else if (fetchStatus === 1) {
            populateMusicQueue(musicData);
            clearInterval(populateMusicQueueITV);
        }
    }, 500);

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

function populateMusicQueue(data) {
    const queue = document.querySelector("#music-queue-content");

    for (const music of data) {
        const item = createMusicQueueItem(music.id, music.title);
        queue.append(item);
    }

    queue.scrollTo(0, 0);
}

function createMusicQueueItem(id, title) {
    const item = document.querySelector("#music-queue-item-template").content.querySelector(".music-queue-item").cloneNode(true);
    
    item.dataset.id = id;
    item.addEventListener("click", () => {
        if (!item.classList.contains("music-queue-item-playing")) {
            playMusic(item.dataset.id, 0);
            hideMusicQueue();
        }
    });

    const thumbnail = item.querySelector(".music-queue-item-thumbnail");
    thumbnail.src = `https://img.youtube.com/vi/${id}/default.jpg`;
    thumbnail.addEventListener("contextmenu", (e) => { e.preventDefault(); });

    item.querySelector(".music-queue-item-title").innerHTML = title;

    return item;
}

function highlightMusicQueueItemInPlay(id) {
    
    const queueItems = document.querySelectorAll(".music-queue-item");

    if (queueItems.length <= 0)
        return false;
    
    for (const item of queueItems) {
        if (item.dataset.id === id) {
            item.classList.add("music-queue-item-playing");
        }
        else {
            item.classList.remove("music-queue-item-playing");
        }
    }

    return true;
}