
const markups = {
    "desktop": [
        {
            "selector": "main",
            "path": "templates/desktopMain.html"
        },
        {
            "selector": "footer",
            "path": "templates/desktopFooter.html"
        }
    ],
    
    "mobile": [
        {
            "selector": "main",
            "path": "templates/mobileMain.html"
        },
        {
            "selector": "footer",
            "path": "templates/mobileFooter.html"
        }
    ]
};

const stylesheets = {
    "desktop": [
        "styles/desktop/desktop.css",
        "styles/desktop/footer.css"
    ],
    
    "mobile": [
        "styles/mobile/mobile.css"
    ]
};

function isMobileDevice() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    return regexp.test(details);
}

function loadMarkups() {
    const markupList = isMobileDevice() ? markups.mobile : markups.desktop;

    for (const mkp of markupList) {
        loadElement(mkp.path, mkp.selector)
        .catch((err) => {
            console.log(`Couldn't fetch the markup ${mkp.path} : ${err}`);
        });
    }
}

function loadStylesheets() {
    const stylesheetList = isMobileDevice() ? stylesheets.mobile : stylesheets.desktop;

    for (const path of stylesheetList) {
        document.head.innerHTML += `<link rel="stylesheet" href="${path}">`;
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

loadStylesheets();

document.addEventListener("DOMContentLoaded", () => {
    loadMarkups(); 

    const bodyClass = isMobileDevice() ? "mobile": "desktop";
    document.body.classList.add(bodyClass);
});