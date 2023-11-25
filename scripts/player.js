let player;
let timeUpdateITV;

let progressBar;
let currentTimePara;

document.addEventListener("DOMContentLoaded", () => {
    progressBar = document.querySelector("#player-progress-bar");
    currentTimePara = document.querySelector("#player-current-time");
});

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

    const duration = convertTime(player.getDuration());
    if (duration)
        document.querySelector("#player-duration").innerHTML = duration;
    const progressBar = document.querySelector("#player-progress-bar");
    progressBar.max = Math.floor(player.getDuration());
    progressBar.value = 0;

    const thumbnail = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
}

function onPlayerStateChange(event) {
    const stat = player.getPlayerState();

    const actualPlaying = stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING;

    if (!actualPlaying && videoVisible)
        toggleThumbnail();

    const playpauseIcon = document.querySelector("#player-btn-playpause-img");

    if (actualPlaying) {
        playpauseIcon.src = pauseLogoURL;

        clearInterval(timeUpdateITV);
        timeUpdateITV = setInterval(updateCurrentTime, 500);
    }
    else {
        playpauseIcon.src = playLogoURL;

        clearInterval(timeUpdateITV);
    }
}

function updateCurrentTime() {
    document.querySelector("#player-progress-bar").value = Math.floor(player.getCurrentTime());
    const currentTime = convertTime(player.getCurrentTime());
    if (currentTime) {
        document.querySelector("#player-current-time").innerHTML = currentTime;
    }
}

let videoVisible = false;
function toggleThumbnail() {
    const thumbnailContent = document.querySelector(".player-thumbnail-content");
    thumbnailContent.classList.remove("blink-animation");
    
    setTimeout(() => {
        thumbnailContent.classList.add("blink-animation");

        const iframe = document.querySelector(".player-iframe-container");
        const img = document.querySelector(".player-thumbnail-img-container");

        const stat = player.getPlayerState();
        if (stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING) {
            if (videoVisible) {
                iframe.style.display = "none";
                img.style.display = "block";
            }
            else {
                iframe.style.display = "block";
                img.style.display = "none";
            }
            videoVisible = !videoVisible;
        }
        else {
            iframe.style.display = "none";
            img.style.display = "block";
            videoVisible = false;
        }

    }, 50);
}

function addProgressbarEventListeners() {
    const progress = document.querySelector("#player-progress-bar");

    progress.addEventListener("input", handleProgressbarChange);
    
    progress.addEventListener("mousedown", handleProgressbarDragStart);
    progress.addEventListener("touchstart", handleProgressbarDragStart);

    progress.addEventListener("mouseup", handleProgressbarDragEnd);
    progress.addEventListener("touchend", handleProgressbarDragEnd);
}

function handleProgressbarDragStart() {
    clearInterval(timeUpdateITV);
}

function handleProgressbarDragEnd() {
    player.seekTo(progressBar.value, true);
    currentTimePara.innerHTML = convertTime(progressBar.value);
    
    clearInterval(timeUpdateITV);
    timeUpdateITV = setInterval(updateCurrentTime, 500);
}

function handleProgressbarChange() {
    currentTimePara.innerHTML = convertTime(progressBar.value);
}