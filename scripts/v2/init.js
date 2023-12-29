function initMainFeed() {
    document.querySelector("#player-btn-close").addEventListener("click", () => {
        if (history.state === null) {
            hideMusicPlayer();
        }
        else {
            history.back();
        }
    });

    const loadITV = setInterval(() => {
        if (fetchStatus === 1) {
            loadMainFeedItems();
            clearInterval(loadITV);
        }
        else if (fetchStatus === -1) {
            clearInterval(loadITV);
        }
    }, 100);
}

function initFooter() {
    document.querySelectorAll("#main-footer button").forEach((btn) => {
        btn.addEventListener("click", (e) => { e.stopPropagation(); });
    });
}

function loadMainFeedItems() {
    const mainfeed = document.querySelector("#mainfeed");
    const template = document.querySelector("#mainfeed-item-template").content.querySelector(".feeditem");

    mainfeed.innerHTML = "";

    for (const music of musicData) {
        const item = template.cloneNode(true);
        item.dataset.id = music.id;
        item.querySelector(".feeditem-thumbnail-img").src = `https://img.youtube.com/vi/${music.id}/default.jpg`;
        item.querySelector(".feeditem-title").innerHTML = music.title;

        item.addEventListener("click", () => {
            if (!item.classList.contains("playing")) {
                playMusic(item.dataset.id, 0);
            }
        });

        mainfeed.append(item);
    }
}

function showMusicPlayer() {
    const playerpage = document.querySelector("#playerpage");
    playerpage.classList.remove("hide");
    playerpage.classList.add("show");

    document.body.classList.add("disable-scroll");
}

function hideMusicPlayer() {
    const playerpage = document.querySelector("#playerpage");
    playerpage.classList.remove("show");
    playerpage.classList.add("hide");

    document.body.classList.remove("disable-scroll");
}