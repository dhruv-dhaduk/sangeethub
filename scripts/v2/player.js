function onYouTubeIframeAPIReady() {
    console.log("API READY");

    const ITV = setInterval(() => {
        if (isMarkupsLoaded) {
            loadMusicPlayer();
            clearInterval(ITV);
        }
    }, 500);
}

function loadMusicPlayer() {
    
}