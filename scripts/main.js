document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); });
    });
});

async function fetch_sheet() {
    const sheetId = "1HyoSoJHb2ol1HVEvSvF5e1jl-KnTx-7NFScFoNM7sus";
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = "sangeethub";
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    const response = await fetch(url);
    const text = await response.text();

    const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));
    const videoIDs = [];
    for (const row of json.table.rows) {
        if (row.c[0].v !== "links")
            videoIDs.push(row.c[0].v);
    }

    for (let i = videoIDs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [videoIDs[i], videoIDs[j]] = [videoIDs[j], videoIDs[i]];
    }

    return videoIDs;
}

function onYouTubeIframeAPIReady() {
    
}