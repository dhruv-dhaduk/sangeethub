function initMainFeed() {
    document.querySelector("#player-btn-close").addEventListener("click", () => {
        const playerpage = document.querySelector("#playerpage");
        playerpage.classList.remove("show");
        playerpage.classList.add("hide");

        document.body.classList.remove("disable-scroll");
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

        mainfeed.append(item);
    }
}