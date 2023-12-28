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