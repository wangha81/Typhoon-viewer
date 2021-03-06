import Link from "./fetch.js";
export default function (viewer = null) {
    this.viewer = viewer;
    this.dir = "../data/dataSource";
    this.startTime = null;
    this.stopTime = null;
    this.createRoute = async (file) => {
        let data = await Link(this.dir + "/" + file);
        let time = await CreatRoute(this.viewer, data.Route);
        if (this.startTime == null) {
            this.startTime = time[0];
        } else {
            this.startTime = (this.startTime > time[0]) ? time[0] : this.startTime;
        }

        if (this.stopTime == null) {
            this.stopTime = time[1];
        } else {
            this.stopTime = (this.stopTime < time[1]) ? time[1] : this.stopTime;
        }
        await setTimeBounds(this.viewer, [this.startTime, this.stopTime]);
    }
    this.clear = async () => {
        await this.viewer.entities.removeAll();
        return true;
    }
}

function CreatRoute(_viewer, _route_data) {
    return new Promise((res, rej) => {
        //console.log(_route_data, _viewer)
        let Point = _route_data[0];
        let Time = Cesium.JulianDate.fromDate(new Date(Point.Time));
        let first = Time;
        let last = Time;
        let Position = Cesium.Cartesian3.fromDegrees(Point.Longitude, Point.Latitude, 100000);
        let center_position_sample = new Cesium.SampledPositionProperty();
        center_position_sample.addSample(Time, Position);
        for (let i = 1; i < _route_data.length; i++) {
            //Center
            Point = _route_data[i]
            Time = Cesium.JulianDate.fromDate(new Date(Point.Time));
            Position = Cesium.Cartesian3.fromDegrees(Point.Longitude, Point.Latitude, 100000);
            center_position_sample.addSample(Time, Position);

            //Line segment
            let startPoint = _route_data[i - 1];
            let stopPoint = _route_data[i];
            let property = new Cesium.SampledPositionProperty();

            let startTime = Cesium.JulianDate.fromDate(new Date(startPoint.Time));
            let startPosition = Cesium.Cartesian3.fromDegrees(startPoint.Longitude, startPoint.Latitude, 100000);
            property.addSample(startTime, startPosition);

            let stopTime = Cesium.JulianDate.fromDate(new Date(stopPoint.Time));
            last = stopTime; // for Center
            let stopPosition = Cesium.Cartesian3.fromDegrees(stopPoint.Longitude, stopPoint.Latitude, 100000);
            property.addSample(stopTime, stopPosition);

            //Longest_radius_of_30kt
            _viewer.entities.add({
                //Use our computed positions
                position: property,
                ellipse: {
                    semiMinorAxis: startPoint.Longest_radius_of_30kt * 1.852 * 1000 || 0.0,
                    semiMajorAxis: startPoint.Longest_radius_of_30kt * 1.852 * 1000 || 0.0,
                    height: 1000.0,
                    material: Cesium.Color.fromBytes(107, 160, 254, 80),
                    outline: true // height must be set for outline to display
                }
            });

            //Shortest_radius_of_30kt
            _viewer.entities.add({
                //Use our computed positions
                position: property,
                ellipse: {
                    semiMinorAxis: startPoint.Shortest_radius_of_30kt * 1.852 * 1000 || 0.0,
                    semiMajorAxis: startPoint.Shortest_radius_of_30kt * 1.852 * 1000 || 0.0,
                    height: 10000.0,
                    material: Cesium.Color.fromBytes(137, 255, 229, 120),
                    outline: true // height must be set for outline to display
                }
            });
            
        }
        //Center
        let timeLen = Cesium.JulianDate.secondsDifference(last, first)
        _viewer.entities.add({
            //Set the entity availability to the same interval as the simulation time.
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: first,
                stop: last
            })]),

            //Use our computed positions
            position: center_position_sample,
            point: {
                pixelSize: 8,
                color: Cesium.Color.TRANSPARENT,
                outlineColor: Cesium.Color.DEEPSKYBLUE,
                outlineWidth: 3
            },
            path: {
                leadTime:timeLen,
                trailTime: 60 * 60 * 6,
                resolution: 60,
            }
        });
        res([new Date(_route_data[0].Time), new Date(_route_data[_route_data.length - 1].Time)]);
    });
}

function setTimeBounds(_viewer, _time) {
    return new Promise((res, rej) => {
        //Set bounds of our simulation time
        let start = Cesium.JulianDate.fromDate(_time[0]);
        let stop = Cesium.JulianDate.fromDate(_time[1]);

        //Make sure viewer is at the desired time.
        _viewer.clock.startTime = start.clone();
        _viewer.clock.stopTime = stop.clone();
        _viewer.clock.currentTime = start.clone();
        _viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        _viewer.clock.multiplier = 250000;

        //Set timeline to simulation bounds
        _viewer.timeline.zoomTo(start, stop);
        res(true);
    });
}