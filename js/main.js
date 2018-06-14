import Movement from "./operationConpoment.js";
import Page from "./page.js";
import CesiumApi from "./earth.js";
var move;
var viewer;
var page;
function bindEvent(move) {
    document.getElementById("op-btn-main").addEventListener('click', move.click, false);
    document.getElementById('closeBtn').addEventListener('click', move.click, false);

    function SwitchEvent() {
        move.SwitchPage(this.value);
    }
    move.btn.forEach(b => {
        b.addEventListener('click', SwitchEvent, false);
    });

    function listBtn_trigger() {
        let file = this.getAttribute("value");
        let name = this.getAttribute("name");
        if (name == "classified_1" || name == "classified_2") {
            viewer.createRoute(file);
        }else if(name == "classified_3"){
            page.fileList.forEach(e=>{
                if(e.fileName.indexOf(file) != -1){
                    //console.log(e.fileName);
                    viewer.createRoute(e.fileName);
                }
            });
        }
    }
    let listBtns = [].map.call(document.getElementsByClassName("listBtn"), (e) => {
        return e;
    });
    listBtns.forEach(b => {
        b.addEventListener('click', listBtn_trigger, false);
    });

    function filterEvent1() {
        let list = document.getElementsByName("classified_1");
        [].forEach.call(list, t => {
            if (t.innerText.indexOf(this.value) == -1 && this.value.trim() != "" && this.value.length > 3) {
                t.style.display = "none";
            } else {
                t.style.display = "block";
            }
        });
    }
    let searchBar1 = document.getElementById("searchInput_1");
    searchBar1.addEventListener('keyup', filterEvent1, false);

    function filterEvent2() {
        let list = document.getElementsByName("classified_2");
        [].forEach.call(list, t => {
            if (t.innerText.indexOf(this.value) == -1 && this.value.trim() != "" && this.value.length > 3) {
                t.style.display = "none";
            } else {
                t.style.display = "block";
            }
        });
    }
    let searchBar2 = document.getElementById("searchInput_2");
    searchBar2.addEventListener('keyup', filterEvent2, false)
}
async function init() {

    let _viewer = new Cesium.Viewer('cesiumContainer', {
        //"imageryProvider": new Cesium.createOpenStreetMapImageryProvider(),
        "homeButton": false,
        "infoBox": false,
        "geocoder": false,
        "navigationHelpButton": false,
    });

    viewer = await new CesiumApi(_viewer);
    move = await new Movement("operationContainer", "vBtn", "optionCard", "btn");
    page = await new Page("optionCard");
    await page.create('../data/file_list_tagged.json', 1);
    await page.create('../data/file_list_tagged.json', 2);
    await page.create('../data/file_list_tagged.json', 3);
    bindEvent(move);
}
window.addEventListener('load', init, false);