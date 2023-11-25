let player;

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

    const thumbnail = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
    document.querySelector("#player-thumbnail-img").src = thumbnail;
    document.querySelector("#player-background-img").src = thumbnail;
}

function onPlayerStateChange(event) {
    console.log(`Player state changed : ${event}`);
}