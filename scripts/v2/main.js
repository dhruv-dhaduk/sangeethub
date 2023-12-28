loadStylesheets();

document.addEventListener("DOMContentLoaded", () => {
    loadMarkups(); 

    const bodyClass = isMobileDevice() ? "mobile": "desktop";
    document.body.classList.add(bodyClass);

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });

    const playerpage = document.querySelector("#playerpage")

    document.querySelector("#main-footer").addEventListener("click", () => {
        playerpage.classList.remove("hide");
        playerpage.classList.add("show");

        document.body.classList.add("disable-scroll");
    });
});

let fetchStatus = 0;
let musicData;

let fetchWorker = new Worker("./scripts/v2/fetchWorker.js");
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