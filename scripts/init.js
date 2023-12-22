function isMobileDevice() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    return regexp.test(details);
}

document.addEventListener("DOMContentLoaded", () => {
    loadMarkups();
});

function loadMarkups() {
    const dataContainer = isMobileDevice() ? document.querySelector("#mobileMarkup") : document.querySelector("#desktopMarkup");

    const datalist = dataContainer.querySelectorAll("data");

    for (const data of datalist) {
        loadElement(data.value, data.dataset.selector)
        .catch((err) => {
            console.log(`Couldn't fetch the data : ${err}`);
        });
    }
}

async function loadElement(markupURL, selector, append) {
    
    const response = await fetch(markupURL);

    if (!response.ok) {
        throw new Error("Couldn't get the markup.");
    }

    const text = await response.text();
    const e = document.querySelector(selector);

    if (append)
        e.innerHTML += text;
    else 
        e.innerHTML = text;
}