const markups = {
    "desktop": [
        {
            "selector": "main",
            "path": "templates/desktopMain.html"
        },
        {
            "selector": "footer",
            "path": "templates/desktopFooter.html"
        },
        {
            "selector": "#playerpage",
            "path": "templates/desktopPlayer.html"
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
        },
        {
            "selector": "#playerpage",
            "path": "templates/mobilePlayer.html"
        }
    ]
};

const stylesheets = {
    "desktop": [
        "styles/desktop/player.css"
    ],
    "mobile": [
        "styles/mobile/player.css"
    ]
};

function loadMarkups() {
    const markupList = isMobileDevice() ? markups.mobile : markups.desktop;

    for (const mkp of markupList) {
        loadElement(mkp.path, mkp.selector)
        .then(() => {
            document.querySelectorAll(`${mkp.selector} img`).forEach((img) => {
                img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
            });

            if (mkp.selector === "#playerpage") {
                document.querySelector("#player-btn-close").addEventListener("click", () => {
                    const playerpage = document.querySelector("#playerpage");
                    playerpage.classList.remove("show");
                    playerpage.classList.add("hide");
    
                    document.body.classList.remove("disable-scroll");
                });
            }

            if (mkp.selector === "footer") {
                document.querySelectorAll("#main-footer button").forEach((btn) => {
                    btn.addEventListener("click", (e) => { e.stopPropagation(); });
                });
            }
        })
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