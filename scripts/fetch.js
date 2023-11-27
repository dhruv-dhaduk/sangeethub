async function fetchVideoIDs() {
    const sheetId = '1HyoSoJHb2ol1HVEvSvF5e1jl-KnTx-7NFScFoNM7sus';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = 'sangeethub';
    const query = encodeURIComponent("Select *");
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    const response = await fetch(url);
    const text = await response.text();

    const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));

    const ids = [];

    for (const row of json.table.rows) {
        if (row.c[0].v && row.c[0].v != "links") {
            ids.push(row.c[0].v);
        }
    }

    return ids;
}

let fetchStatus = 0;
let videoIDs;

fetchVideoIDs()
.then((ids) => {
    videoIDs = ids;
    fetchStatus = 1;
})
.catch((err) => {
    console.log(`COULDN'T FETCH DATA : ${err}`);
    alert("Couldn't fetch data");
    fetchStatus = -1;
});

// const videoIDs = [
//     "TxidFkYHDfI",
//     "RfjPHmgBPF0",
//     "1ZrZeA8j15w",
//     "NVLpJBGVfSw",
//     "Tl4bQBfOtbg",
//     "Jv8KRwF1zQs",
//     "uv9Dv6fzg9w",
//     "ejunflwgquc",
//     "bD5msFH9gpU",
//     "EatzcaVJRMs"
// ];