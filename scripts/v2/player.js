function onYouTubeIframeAPIReady() {
    console.log("API READY");

    const ITV = setInterval(() => {
        if (isMarkupsLoaded && fetchStatus === 1) {
            loadMusicPlayer();
            clearInterval(ITV);
        }
    }, 500);
}

function loadMusicPlayer() {
    console.log(musicData);
}