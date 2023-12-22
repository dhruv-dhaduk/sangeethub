function isMobileDevice() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    return regexp.test(details);
}

document.addEventListener("DOMContentLoaded", () => {
    const markupURL = isMobileDevice() ? "templates/mobileMain.html" : "templates/desktopMain.html";

    fetch(markupURL)
    .then((response) => {
        if (response.ok) {
            return response.text();
        }
        else {
            return null;
        }
    })
    .then((text) => {
        if (text) {
            document.querySelector("main").innerHTML = text;
        }
        else {
            alert("Couldn't fetch the page.");
        }
    })
    .catch((err) => {
        console.log(`Couldn't fetch the page : ${err}`);
        alert("Couldn't fetch the page.");
    });
    
});