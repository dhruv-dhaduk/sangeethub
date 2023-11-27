let player;
let currentVideoIndex;
let timeUpdateITV;

let progressBar;
let currentTimePara;

let iframe;

document.addEventListener("DOMContentLoaded", () => {
    progressBar = document.querySelector("#player-progress-bar");
    currentTimePara = document.querySelector("#player-current-time");

    progressBar.value = 0;

    iframe = document.querySelector(".player-iframe-container");
});

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player-iframe", {
        height: '390',
        width: '640',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'fs': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(100);

    currentVideoIndex = Math.floor(Math.random() * (videoIDs.length));
    player.cueVideoById(videoIDs[currentVideoIndex], 0);

    updateMetaData();
}

function onPlayerStateChange(event) {
    const stat = player.getPlayerState();
    
    if (stat === YT.PlayerState.ENDED)
        playNextMusic();

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

    const playpause = document.querySelector("#player-btn-playpause");
    if (stat === YT.PlayerState.BUFFERING)
        playpause.classList.add("infinite-blink-animation");
    else
        playpause.classList.remove("infinite-blink-animation");

}

function updateCurrentTime() {
    document.querySelector("#player-progress-bar").value = Math.floor(player.getCurrentTime());
    const currentTime = convertTime(player.getCurrentTime());
    if (currentTime) {
        document.querySelector("#player-current-time").innerHTML = currentTime;
    }
}

function updateMetaData() {
    const videoDataUpdateITV = setInterval(() => {
        if (player.getDuration() <= 0)
            return;

        document.querySelector("#player-title").innerHTML = player.videoTitle;

        const currentTime = convertTime(player.getCurrentTime());
        const duration = convertTime(player.getDuration());
        if (duration)
            document.querySelector("#player-duration").innerHTML = duration;
        if (currentTime)
            document.querySelector("#player-current-time").innerHTML = currentTime;
        const progressBar = document.querySelector("#player-progress-bar");
        progressBar.max = Math.floor(player.getDuration());
        progressBar.value = Math.floor(player.getCurrentTime());

        clearInterval(videoDataUpdateITV);
    }, 100);


    const currentVideoID = videoIDs[currentVideoIndex];

    const thumbnail = `https://img.youtube.com/vi/${currentVideoID}/maxresdefault.jpg`
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
}

function playPreviousMusic() {
    if (currentVideoIndex <= 0)
        currentVideoIndex = videoIDs.length - 1;
    else
        currentVideoIndex--;

    player.loadVideoById(videoIDs[currentVideoIndex], 0);
    updateMetaData();
}
function playNextMusic() {
    if (currentVideoIndex >= videoIDs.length - 1)
        currentVideoIndex = 0;
    else
        currentVideoIndex++;
    
    player.loadVideoById(videoIDs[currentVideoIndex], 0);
    updateMetaData();
}

let videoVisible = false;
function toggleThumbnail(hideVideo) {
    if (hideVideo === undefined || (hideVideo !== true && hideVideo !== false))
        hideVideo = false;

    const thumbnailContent = document.querySelector(".player-thumbnail-content");
    thumbnailContent.classList.remove("blink-animation");
    
    setTimeout(() => {
        thumbnailContent.classList.add("blink-animation");

        const iframe = document.querySelector(".player-iframe-container");
        const img = document.querySelector(".player-thumbnail-img-container");

        if (hideVideo) {
            iframe.style.display = "none";
            img.style.display = "block";
            videoVisible = false;
        }
        else  {
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