let player;
let currentVideoIndex;
let timeUpdateITV;

let progressBar;
let currentTimePara;

document.addEventListener("DOMContentLoaded", () => {
    progressBar = document.querySelector("#player-progress-bar");
    currentTimePara = document.querySelector("#player-current-time");

    progressBar.value = 0;
});

function onYouTubeIframeAPIReady() {
    let currentVideoIndexSTORED = Math.floor(Number(localStorage.getItem("currentVideoIndex")));
    if (!currentVideoIndexSTORED || currentVideoIndexSTORED < 0)
        currentVideoIndexSTORED = Math.floor(Math.random() * (videoIDs.length));

    currentVideoIndex = currentVideoIndexSTORED;

    playMusic(videoIDs[currentVideoIndex]);
}

function onPlayerReady(event) {
    player.setVolume(100);

    updateMetaData();
    toggleThumbnail(true);

    player.playVideo();
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
    localStorage.setItem("currentTime", player.getCurrentTime());
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

function playMusic(id) {
    if (player)
        player.destroy();

    const iframeContainer = document.querySelector(".player-iframe-container");
    iframeContainer.innerHTML = "";
    const iframeElement = document.createElement("div");
    iframeElement.id = "player-iframe";

    iframeContainer.appendChild(iframeElement);

    setTimeout(() => {

        localStorage.setItem("currentVideoIndex", videoIDs.indexOf(id));

        let currentTimeSTORED = Math.floor(Number(localStorage.getItem("currentTime")));
        if (!currentTimeSTORED || currentTimeSTORED < 0)    
            currentTimeSTORED = 0;

        player = new YT.Player("player-iframe", {
            height: '390',
            width: '640',
            videoId: id,
    
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'start': currentTimeSTORED
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

    }, 50);

}

function playPreviousMusic() {
    if (currentVideoIndex <= 0)
        currentVideoIndex = videoIDs.length - 1;
    else
        currentVideoIndex--;

    localStorage.removeItem("currentTime");
    playMusic(videoIDs[currentVideoIndex]);
}
function playNextMusic() {
    if (currentVideoIndex >= videoIDs.length - 1)
        currentVideoIndex = 0;
    else
        currentVideoIndex++;

    localStorage.removeItem("currentTime");
    playMusic(videoIDs[currentVideoIndex]);
}

let videoVisible = false;
function toggleThumbnail(hideVideo) {
    // return;
    if (hideVideo === undefined || (hideVideo !== true && hideVideo !== false))
        hideVideo = false;

    const thumbnailContent = document.querySelector(".player-thumbnail-content");
    thumbnailContent.classList.remove("blink-animation");
    
    setTimeout(() => {
        thumbnailContent.classList.add("blink-animation");

        const thumbnailImg = document.querySelector("#player-thumbnail-img");

        if (hideVideo) {
            thumbnailImg.style.opacity = 1;
            videoVisible = false;
        }
        else  {
            const stat = player.getPlayerState();
            if (stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING) {
                if (videoVisible) {
                    thumbnailImg.style.opacity = 1;
                }
                else {
                    thumbnailImg.style.opacity = 0;
                }
                videoVisible = !videoVisible;
            }
            else {
                thumbnailImg.style.opacity = 1;
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