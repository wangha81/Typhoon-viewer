import Link from "./fetch.js";
export default function (card = null) {
    this.card = [].map.call(document.getElementsByClassName(card), (e) => {
        return e;
    });
    this.create = async (path, index) => {
        //console.log(path, index);
        let d = await Link(path);
        this.fileList = d;
        let card = this.card[index];

        switch (index) {
            case 1:
                await page_1(card);
                break;
            case 2:
                await page_2(card);
            case 3:
                await page_3(card);
            default:
                break;
        }
    }
}

function createNode(e, class_name, tag_name, card) {
    let ne = document.createElement("DIV");
    let text = "";
    switch (tag_name) {
        case "classified_1":
            text = document.createTextNode(e.fileName.split(".")[0]);
            ne.setAttribute("value", e.fileName);
            break;
        case "classified_2":
            text = document.createTextNode(e.fileName.split(".")[0]);
            ne.setAttribute("value", e.fileName);
            break;
        case "classified_3":
            text = document.createTextNode(e);
            ne.setAttribute("value", e);
            break;
        default:
            text = "Null";
            break;
    }
    ne.appendChild(text);
    ne.setAttribute("class", class_name);
    ne.setAttribute("name", tag_name);
    card.appendChild(ne);
    return ne;
}
async function page_1(card) {
    let q = document.createElement('INPUT');
    q.setAttribute('type', 'text');
    q.setAttribute('class', 'searchBar');
    q.setAttribute('id', 'searchInput_1', );
    q.setAttribute('placeholder', 'Search...');
    card.appendChild(q);

    let d = await Link("../data/file_list_tagged.json");
    let chs = await d.map(e => createNode(e, "listBtn", "classified_1", card));
    return chs;
}
async function page_2(card) {
    let q = document.createElement('INPUT');
    q.setAttribute('type', 'text');
    q.setAttribute('class', 'searchBar');
    q.setAttribute('id', 'searchInput_2', );
    q.setAttribute('placeholder', 'Search...');
    card.appendChild(q);

    let d = await Link("../data/file_list_tagged.json");
    let chs = await d.filter(e => {
        return (e.cross_taiwan);
    }).map(e => createNode(e, "listBtn", "classified_2", card));
    return chs;
}

async function page_3(card) {
    let fns = await Link("../data/file_list_tagged.json");
    let dic = [];
    fns.forEach(e => {
        let y = e.fileName.slice(0, 4);
        if (dic.indexOf(y) == -1) {
            dic.push(y);
        }
    });
    let chs = await dic.map(e => createNode(e, "listBtn", "classified_3", card));
    
    return chs;
}