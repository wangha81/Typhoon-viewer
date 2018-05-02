var viewer;
var currentTime;

function prepareData(url) {
    return new Promise((res, rej) => {
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'text/json'
            })
        }).then(function (response) {
            //處理 response
            return response.json();
        }).then(function (j) {
            // `j`會是一個JavaScript物件
            //console.log(j);
            res(j);
        });
    });
}

function showTyphoon() {
    console.log(this.value);

    function render(source) {
        return new Promise((res, rej) => {
            //Set bounds of our simulation time
            var start = Cesium.JulianDate.fromDate(new Date(source.Route[0].Time));
            var stop = Cesium.JulianDate.fromDate(new Date(source.Route[source.Route.length - 1].Time));

            //Make sure viewer is at the desired time.
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
            viewer.clock.multiplier = 40000;

            //Set timeline to simulation bounds
            viewer.timeline.zoomTo(start, stop);


            for (let i = 1; i < parseInt(source.Data_lines); i++) {
                let startPoint = source.Route[i - 1];
                let stopPoint = source.Route[i];
                let property = new Cesium.SampledPositionProperty();

                let startTime = Cesium.JulianDate.fromDate(new Date(startPoint.Time));
                let startPosition = Cesium.Cartesian3.fromDegrees(startPoint.Longitude, startPoint.Latitude, 100000);
                property.addSample(startTime, startPosition);

                let stopTime = Cesium.JulianDate.fromDate(new Date(stopPoint.Time));
                let stotPosition = Cesium.Cartesian3.fromDegrees(stopPoint.Longitude, stopPoint.Latitude, 100000);
                property.addSample(stopTime, stotPosition);

                //Center
                viewer.entities.add({
                    //Use our computed positions
                    position: property,
                    point: {
                        pixelSize: 8,
                        color: Cesium.Color.TRANSPARENT,
                        outlineColor: Cesium.Color.DEEPSKYBLUE,
                        outlineWidth: 3
                    },
                    path: {
                        resolution: 1,
                    }
                });
                //Longest_radius_of_30kt
                viewer.entities.add({
                    //Use our computed positions
                    position: property,
                    ellipse: {
                        semiMinorAxis: startPoint.Longest_radius_of_30kt * 1.852 * 1000 || 0.0,
                        semiMajorAxis: startPoint.Longest_radius_of_30kt * 1.852 * 1000 || 0.0,
                        height: 1000.0,
                        material: Cesium.Color.fromBytes(107, 160, 254, 80),
                        outline: true // height must be set for outline to display
                    },
                    path: {
                        resolution: 1,
                    }
                });

                //Shortest_radius_of_30kt
                viewer.entities.add({
                    //Use our computed positions
                    position: property,
                    ellipse: {
                        semiMinorAxis: startPoint.Shortest_radius_of_30kt * 1.852 * 1000 || 0.0,
                        semiMajorAxis: startPoint.Shortest_radius_of_30kt * 1.852 * 1000 || 0.0,
                        height: 10000.0,
                        material: Cesium.Color.fromBytes(137, 255, 229, 120),
                        outline: true // height must be set for outline to display
                    },
                    path: {
                        resolution: 1,
                    }
                });
            }
            res(true);
        });
    }
    async function step(fn) {
        let source = await prepareData('./data/dataSource/' + fn);
        await render(source);
    }
    step(this.value);
}

function createSearchEvent(typhoon_list) {
    let btn = document.getElementById('select');
    let list = document.getElementById('selectList');
    let searchInput = document.getElementById('searchInput');
    btn.open = false;
    btn.style.left = '0vw';
    list.style.left = '-20vw';

    function showList() {
        if (btn.open) {
            btn.style.left = "0vw";
            list.style.left = '-20vw';
            btn.open = false;
        } else {
            btn.style.left = "20vw";
            list.style.left = '0vw';
            btn.open = true;
        }
    }

    btn.addEventListener('click', showList, false);
    typhoon_list.forEach(t => {
        let d = document.createElement("DIV");
        let s = document.createTextNode(t.split('.')[0]);
        d.appendChild(s);
        d.value = t;
        d.style.display = "block";
        d.addEventListener('click', showTyphoon, false);
        d.className = "searchBtn";
        list.appendChild(d);
        return t;
    });

    function filterEvent() {
        let list = document.getElementsByClassName("searchBtn");
        [].forEach.call(list, t => {
            if (t.innerText.indexOf(this.value) == -1 && this.value.trim() != "" && this.value.length > 3) {
                t.style.display = "none";
            } else {
                t.style.display = "block";
            }
        });
    }
    searchInput.addEventListener('keyup', filterEvent, false);
}
async function init() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        //"imageryProvider": new Cesium.createOpenStreetMapImageryProvider(),
        "homeButton": false,
        "infoBox": false,
        "geocoder": false,
        "navigationHelpButton": false,
    });
    let typhoon_list = await prepareData('./data/file_list.json');
    createSearchEvent(typhoon_list.sort());
    /*
    viewer.clock.onTick.addEventListener((clock)=>{
        currentTime = clock.currentTime;
    });
    */

}
window.addEventListener('load', init, false);

/**
 * 
 * var greenCircle = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-111.0, 40.0, 150000.0),
    name : 'Green circle at height with outline',
    ellipse : {
        semiMinorAxis : 300000.0,
        semiMajorAxis : 300000.0,
        height: 200000.0,
        material : Cesium.Color.GREEN,
        outline : true // height must be set for outline to display
    }
});
 */