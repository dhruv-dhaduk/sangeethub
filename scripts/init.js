function isMobileDevice() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    return regexp.test(details);
}

document.addEventListener("DOMContentLoaded", () => {
    const markupMainURL = isMobileDevice() ? "templates/mobileMain.html" : "templates/desktopMain.html";

    loadElement(markupMainURL, "main")
    .catch((err) => {
        console.log(`Error : ${err}`);
        alert(`Error : ${err}`);
    });
    
});

async function loadElement(markupURL, selector) {
    const response = await fetch(markupURL);

    if (!response.ok) {
        throw new Error("Couldn't get the markup.");
    }

    const text = await response.text();
    document.querySelector(selector).innerHTML = text;
}