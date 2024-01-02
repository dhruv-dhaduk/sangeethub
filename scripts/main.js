loadStylesheets();

window.addEventListener("popstate", (e) => {
    if (e.state === null) {
        hideMusicPlayer();
    }
    else if (e.state.page === "player") {
        showMusicPlayer();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (history.state && history.state.page === "player") {
        showMusicPlayer();
    }

    loadMarkups(); 

    const bodyClass = isMobileDevice() ? "mobile": "desktop";
    document.body.classList.add(bodyClass);

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    const playerpage = document.querySelector("#playerpage");

    document.querySelector("#main-footer").addEventListener("click", () => {
        showMusicPlayer();
        if (history.state === null) {
            history.pushState({page: "player"}, "");
        }
    });
});

let fetchStatus = 0;
let musicData;

let fetchWorker = new Worker("./scripts/fetchWorker.js");
fetchWorker.addEventListener("message", (msg) => {
    if (msg.data.sheet) {
        musicData = msg.data.sheet;
        fetchStatus = 1;
    }
    else if (msg.data.error) {
        fetchStatus = -1;
        console.log(`Couldn't fetch data : ${error}`);
        alert(`Couldn't fetch data : ${error}`);
    }
    else {
        fetchStatus = -1;
        console.log("Error while fetching data.");
        alert("Error while fetching data.");
    }
});

fetchWorker.postMessage({command: "sheet"});

function highlightMainFeedItem(id) {
    const feedItems = document.querySelectorAll(".feeditem");

    if (feedItems.length <= 0)
        return false;

    for (const item of feedItems) {
        if (item.dataset.id === id) {
            item.classList.add("playing");
        }
        else {
            item.classList.remove("playing");
        }
    }

    return true;
}