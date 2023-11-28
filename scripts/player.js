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

    const fetchWaitITV = setInterval(() => {
        if (fetchStatus === -1) {
            clearInterval(fetchWaitITV);
        }
        else if (fetchStatus === 1) {
            let currentTimeSTORED = Math.floor(Number(localStorage.getItem("currentTime")));
            if (!currentTimeSTORED || currentTimeSTORED < 0)
                currentTimeSTORED = 0;

            let currentDurationSTORED = Math.floor(Number(localStorage.getItem("currentDuration")));
            if (!currentDurationSTORED || currentDurationSTORED < 0)
                currentDurationSTORED = 0;

            progressBar.value =  currentTimeSTORED;
            progressBar.max = currentDurationSTORED;

            const currentVideoIDSTORED = localStorage.getItem("currentVideoID");

            currentVideoIndex = Math.floor(Math.random() * (musicData.length));

            if (currentVideoIDSTORED) {
                const i = musicData.findIndex(x => x.id === currentVideoIDSTORED);
                if (i !== -1) {
                    currentVideoIndex = i;
                }
                else {
                    currentTimeSTORED = 0;
                }
            }

            playMusic(musicData[currentVideoIndex].id, currentTimeSTORED);

            const highlightIntervalCt = 0;
            const highlightITV = setInterval(() => {
                if (highlightMusicQueueItemInPlay(musicData[currentVideoIndex].id)) {
                    clearInterval(highlightITV);
                    return;
                }
                highlightIntervalCt++;
                if (highlightIntervalCt > 10)
                    clearInterval(highlightITV);
            }, 500);

            clearInterval(fetchWaitITV);
        }
    }, 100);
}

function onPlayerReady(event) {
    player.setVolume(100);

    updateMetaData();
    toggleThumbnail(true);

    player.playVideo();

    let intervalCount = 0;
    const firstTimeToggleITV = setInterval(() => {
        if (intervalCount > 20) {
            clearInterval(firstTimeToggleITV);
            return;
        }
        const stat = player.getPlayerState();
        if ((stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING) && player.getCurrentTime() > 2.5) {
            toggleThumbnail();
            clearInterval(firstTimeToggleITV);  
        }
    }, 500);
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
    if (!player)
        return;

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

        localStorage.setItem("currentDuration", player.getDuration());

        clearInterval(videoDataUpdateITV);
    }, 100);


    const currentVideoID = musicData[currentVideoIndex].id;

    const thumbnail = `https://img.youtube.com/vi/${currentVideoID}/maxresdefault.jpg`
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
}

function playMusic(id, startTime) {
    if (player)
        player.destroy();

    const iframeContainer = document.querySelector(".player-iframe-container");
    iframeContainer.innerHTML = "";
    const iframeElement = document.createElement("div");
    iframeElement.id = "player-iframe";

    iframeContainer.appendChild(iframeElement);

    highlightMusicQueueItemInPlay(id);

    currentVideoIndex = musicData.findIndex(x => x.id === id);
    
    setTimeout(() => {
        localStorage.setItem("currentVideoID", id);

        player = new YT.Player("player-iframe", {
            height: '390',
            width: '640',
            videoId: id,
    
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'start': startTime
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
        currentVideoIndex = musicData.length - 1;
    else
        currentVideoIndex--;

    playMusic(musicData[currentVideoIndex].id, 0);
}
function playNextMusic() {
    if (currentVideoIndex >= musicData.length - 1)
        currentVideoIndex = 0;
    else
        currentVideoIndex++;

    playMusic(musicData[currentVideoIndex].id, 0);
}

let videoVisible = false;
function toggleThumbnail(hideVideo) {
    
    if (hideVideo === undefined || (hideVideo !== true && hideVideo !== false))
        hideVideo = false;

    const thumbnailImg = document.querySelector("#player-thumbnail-img");

    if (hideVideo) {
        thumbnailImg.style.opacity = 1;
        videoVisible = false;
        return;
    }

    const thumbnailContent = document.querySelector(".player-thumbnail-content");
    thumbnailContent.classList.remove("blink-animation");
    
    setTimeout(() => {
        thumbnailContent.classList.add("blink-animation");

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