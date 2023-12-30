function onYouTubeIframeAPIReady() {
    console.log("API READY");

    const fetchWaitITV = setInterval(() => {
        if (markupsLoadStatus === 1 && fetchStatus === 1) {
            loadMusicPlayer();
            clearInterval(fetchWaitITV);
        }
        else if (markupsLoadStatus === -1 || fetchStatus === -1) {
            clearInterval(fetchWaitITV);
        }
    }, 500);
}

let player;
let currentVideoIndex;
let timeUpdateITV;

let progressBar;
let footerProgressBar;
let currentTimePara;

const playLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/play_white.png";
const pauseLogoURL = "https://dhruv-dhaduk.github.io/assets/logos/white/pause_white.png";

function loadMusicPlayer() {

    const playpauseBtn = function() {
        const stat = player.getPlayerState();
        if (stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING)
            player.pauseVideo();
        else
            player.playVideo();
    }

    document.querySelector("#player-btn-playpause").addEventListener("click", playpauseBtn);
    document.querySelector("#footer-btn-playpause").addEventListener("click", playpauseBtn);

    document.querySelector("#player-btn-previous").addEventListener("click", playPreviousMusic);
    document.querySelector("#player-btn-next").addEventListener("click", playNextMusic);

    if (!isMobileDevice()) {
        document.querySelector("#footer-btn-previous").addEventListener("click", playPreviousMusic);
        document.querySelector("#footer-btn-next").addEventListener("click", playNextMusic);
    }

    const playVideoToggle = document.querySelector("#player-playvideo-toggle");

    playVideoToggle.addEventListener("click", () => {
        const thumbnailImg = document.querySelector("#player-thumbnail-img");

        if (playVideoToggle.classList.contains("off")) {
            thumbnailImg.style.opacity = 0;
            playVideoToggle.classList.remove("off");
            playVideoToggle.classList.add("on");
        }
        else if (playVideoToggle.classList.contains("on")) {
            thumbnailImg.style.opacity = 1;
            playVideoToggle.classList.remove("on");
            playVideoToggle.classList.add("off");
        }
        else {
            thumbnailImg.style.opacity = 0;
            playVideoToggle.classList.remove("off");
            playVideoToggle.classList.add("on");
        }
    });

    addProgressbarEventListeners();

    document.querySelector("#player-btn-share").addEventListener("click", () => {
        navigator.share({
            title: player.videoTitle,
            url: `https://youtu.be/${musicData[currentVideoIndex].id}`
        });
    });

    document.querySelector("#player-btn-youtube").addEventListener("click", () => {
        window.open(player.getVideoUrl(), "_blank");
    });

    progressBar = document.querySelector("#player-progressbar");
    currentTimePara = document.querySelector("#player-current-time");
    footerProgressBar = document.querySelector("#footer-progressbar");

    progressBar.value = 0;
    footerProgressBar.value = 0;

    let currentTimeSTORED = Math.floor(Number(localStorage.getItem("currentTime")));
    if (!currentTimeSTORED || currentTimeSTORED < 0)
        currentTimeSTORED = 0;

    let currentDurationSTORED = Math.floor(Number(localStorage.getItem("currentDuration")));
    if (!currentDurationSTORED || currentDurationSTORED < 0)
        currentDurationSTORED = 0;

    progressBar.max = currentDurationSTORED;
    progressBar.value = currentTimeSTORED;
    footerProgressBar.max = currentDurationSTORED
    footerProgressBar.value = currentTimeSTORED;

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
}

function onPlayerReady(event) {
    player.setVolume(100);

    updateMetaData();

    player.playVideo();
}

function onPlayerStateChange(event) {
    const stat = player.getPlayerState();

    if (stat === YT.PlayerState.ENDED)
        playNextMusic();

    const actualPlaying = stat === YT.PlayerState.PLAYING || stat === YT.PlayerState.BUFFERING;

    const playpauseIcon = document.querySelector("#player-btn-playpause-img");
    const playpauseIconFooter = document.querySelector("#footer-btn-playpause-img");
    
    if (actualPlaying) {
        playpauseIcon.src = pauseLogoURL;
        playpauseIconFooter.src = pauseLogoURL;

        clearInterval(timeUpdateITV);
        timeUpdateITV = setInterval(updateCurrentTime, 500);
    }
    else {
        playpauseIcon.src = playLogoURL;
        playpauseIconFooter.src = playLogoURL;

        clearInterval(timeUpdateITV);
    }

    const playpause = document.querySelector("#player-btn-playpause");
    const playpauseFooter = document.querySelector("#footer-btn-playpause");
    if (stat === YT.PlayerState.BUFFERING) {
        playpause.classList.add("infinite-blink-animation");
        playpauseFooter.classList.add("infinite-blink-animation");
    }
    else {
        playpause.classList.remove("infinite-blink-animation");
        playpauseFooter.classList.remove("infinite-blink-animation");
    } 
}

function updateCurrentTime() {
    if (!player)
        return;

    progressBar.value = Math.floor(player.getCurrentTime());
    footerProgressBar.value = Math.floor(player.getCurrentTime());
    const currentTime = convertTime(player.getCurrentTime());
    if (currentTime) {
        currentTimePara.innerHTML = currentTime;
    }
    localStorage.setItem("currentTime", player.getCurrentTime());
}

function updateMetaData() {
    const videoDataUpdateITV = setInterval(() => {
        if (player.getDuration() <= 0)
            return;

        document.querySelector("#player-title").innerHTML = player.videoTitle;
        document.querySelector("#footer-music-title").innerHTML = player.videoTitle;

        const currentTime = convertTime(player.getCurrentTime());
        const duration = convertTime(player.getDuration());
        if (duration)
            document.querySelector("#player-duration").innerHTML = duration;
        if (currentTime)
            currentTimePara.innerHTML = currentTime;
        progressBar.max = Math.floor(player.getDuration());
        progressBar.value = Math.floor(player.getCurrentTime());
        footerProgressBar.max = Math.floor(player.getDuration());
        footerProgressBar.value = Math.floor(player.getCurrentTime());

        localStorage.setItem("currentDuration", player.getDuration());

        clearInterval(videoDataUpdateITV);
    }, 100);

    const currentVideoID = musicData[currentVideoIndex].id;

    const thumbnail = `https://img.youtube.com/vi/${currentVideoID}/maxresdefault.jpg`;
    const thumbnailLowRes = `https://img.youtube.com/vi/${currentVideoID}/default.jpg`;
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
    document.querySelector("#footer-thumbnail-img").src = thumbnailLowRes;
    document.querySelector("#footer-background-img").src = thumbnail;
}

function playMusic(id, startTime) {
    if (player)
        player.destroy();

    const iframeContainer = document.querySelector(".player-iframe-container");
    iframeContainer.innerHTML = "";
    const iframeElement = document.createElement("div");
    iframeElement.id = "player-iframe";

    iframeContainer.appendChild(iframeElement);

    highlightMainFeedItem(id);

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

function addProgressbarEventListeners() {
    const progress = document.querySelector("#player-progressbar");

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