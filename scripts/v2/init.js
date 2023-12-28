function initMainFeed() {
    document.querySelector("#player-btn-close").addEventListener("click", () => {
        const playerpage = document.querySelector("#playerpage");
        playerpage.classList.remove("show");
        playerpage.classList.add("hide");

        document.body.classList.remove("disable-scroll");
    });
}

function initFooter() {
    document.querySelectorAll("#main-footer button").forEach((btn) => {
        btn.addEventListener("click", (e) => { e.stopPropagation(); });
    });
}