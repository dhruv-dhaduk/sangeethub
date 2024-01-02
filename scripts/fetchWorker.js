addEventListener("message", (msg) => {
    if (msg.data.command === "sheet") {
        fetchSheet()
        .then((sheet) => {
            postMessage({sheet});
        })
        .catch((error) => {
            postMessage({error});
        });
    }
});

async function fetchSheet() {
    const sheetId = '1HyoSoJHb2ol1HVEvSvF5e1jl-KnTx-7NFScFoNM7sus';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = 'sangeethub';
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    const response = await fetch(url);
    const text = await response.text();

    const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));

    const data = [];

    for (const row of json.table.rows) {
        if (row.c[0].v && row.c[0].v != "links") {
            data.push({"id": row.c[0].v, "title": row.c[1].v});
        }
    }

    return data;
}