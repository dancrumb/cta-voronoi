/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
require(['lodash', 'amd/d3',
    "dojo/_base/window", "dojo/_base/lang",
    'dojo/json',
    "dojo/parser", "dojo/ready",
    'app/symbols',
    'dojo/text!app/data/cookCounty.json', 'dojo/text!app/data/cta-data.json',
    'dijit/registry',
        'app/Lines', 'app/GMaps', 'app/widgets/LineSelector'],
    function (_, d3,
              window, lang,
              JSON,
              parser, ready,
              getMarkers,
              cookCountyJSON, ctaDataJSON,
              registry) {

        ready(function(){

            var cookCountyData = JSON.parse(cookCountyJSON);
            var cookCounty = d3.geom.polygon(cookCountyData.outline);
            var cookCountyBB = {
                sw: {
                    latitude: 90,
                    longitude: 180
                },
                ne: {
                    latitude: 0,
                    longitude: -180
                }
            };
            _.forEach(cookCountyData.outline,function(point) {
                if(point[0] < cookCountyBB.sw.longitude) {
                    cookCountyBB.sw.longitude = point[0];
                }
                if(point[0] > cookCountyBB.ne.longitude) {
                    cookCountyBB.ne.longitude = point[0];
                }
                if(point[1] < cookCountyBB.sw.latitude) {
                    cookCountyBB.sw.latitude = point[1];
                }
                if(point[1] > cookCountyBB.ne.latitude) {
                    cookCountyBB.ne.latitude = point[1];
                }
            });

            registry.byId('finder').set('boundingBox', cookCountyBB);

            var getLocation = (function () {
                if (navigator.geolocation) {
                    return function (callback, errback) {
                        navigator.geolocation.getCurrentPosition(callback, errback);
                    };
                } else {
                    return function (callback) {
                        callback(
                            {
                                coords:{
                                    latitude:41.876862,
                                    longitude:-87.628196,
                                    altitude:null,
                                    accuracy:1,
                                    altitudeAccuracy:null,
                                    heading:null,
                                    speed:null
                                },
                                timestamp:(new Date()).getTime()
                            }
                        );
                    };
                }
            })();


            /*
             * Build map
             */


            var getStations = function(callback) {
                var data = JSON.parse(ctaDataJSON);
                    var stations = {};
                    _.forEach(data.stations, function(value, key){
                        this[key] = _.pick(value, ['name','lines']);
                        this[key].coords = [
                            parseFloat(value.location.longitude),
                            parseFloat(value.location.latitude)
                        ];
                    }, stations);
                    callback(stations);
            };

            var removeDuplicatePoints = function(pointSet) {
                var pointCache = {};

                return _.compact(_.map(pointSet, function (point) {
                    var cacheKey = point.join(",");
                    if (pointCache[cacheKey]) {
                        return undefined;
                    } else {
                        pointCache[cacheKey] = true;
                        return point;
                    }
                }));
            };

            var addStationsToMap = function(stations, map) {
                var stationPoints = [];
                _.forEach(stations, function (station) {
                    var markerIcons = getMarkers(station.lines);
                    map.addMarkers(station.coords, markerIcons, station.name);
                    stationPoints.push(station.coords);
                });

                return removeDuplicatePoints(stationPoints);
            };


            var map = registry.byId("map");
            if(!map) {
                throw new Error("Couldn't find 'map'");
            }

            getLocation(function(position) {
                map.panTo(position.coords);
                map.addPolygon(cookCounty);
                map.addMarkers([position.coords.longitude, position.coords.latitude], ['http://maps.google.com/mapfiles/ms/icons/red-dot.png']);

                getStations(function(stations) {
                    addStationsToMap(stations,map);

                    var stationsByLine = {};
                    _.forEach(stations, function(station, stationId) {
                        _.forEach(station.lines, function(line) {
                            if(!_.isArray(stationsByLine[line])) {
                                stationsByLine[line] = [];
                            }
                            stationsByLine[line].push(stationId);
                        });
                    });

                    var getStationIdsForLines = function() {
                        var lines = _.flatten([].slice.call(arguments));

                        return _(stationsByLine)
                            .pick(lines)
                            .values()
                            .flatten()
                            .uniq()
                            .value();
                    };

                    var boundingRegion = d3.geom.polygon(d3.geom.hull(cookCounty).reverse());
                    if (boundingRegion.area() < 0) {
                        console.error("Bounding area is not counterclockwise!");
                    }
                    map.addPolygon(boundingRegion,{
                        strokeColor:"#0000FF",
                        strokeOpacity:0.8,
                        strokeWeight:3,
                        fillColor:"#FF0000",
                        fillOpacity:0.01
                    });


                    var buildVoronoi = function(stationPoints) {
                        var voronoi = d3.geom.voronoi(stationPoints).map(function (cell) {
                            return boundingRegion.clip(cell);
                        });

                        return _.map(voronoi, function (vPoly) {
                            return map.addPolygon(vPoly, {
                                strokeColor:"#000000",
                                strokeOpacity:0.8,
                                strokeWeight:1,
                                fillColor:"#000000",
                                fillOpacity:0.1
                            });
                        });
                    };


                    var voronois = {};
                    var getSelectedLines = lang.hitch(window.global.lineModel, 'get', 'selectedLines');
                    var addVoronoiForLines = function(lines) {
                        var voronoiKey = lines.join(":");
                        if(!voronois[voronoiKey]) {
                            var stationGrid = _(stations)
                                .pick(getStationIdsForLines.apply(null,lines))
                                .values()
                                .pluck('coords')
                                .value();

                            voronois[voronoiKey] = buildVoronoi(stationGrid);
                        }
                        _.forEach(voronois[voronoiKey], function(cell) {
                            map.addPolygon(cell);
                        });
                    };


                    var currVoronoiKey = getSelectedLines().join(":");

                    window.global.lineModel.watch(function() {
                        _.forEach(voronois[currVoronoiKey], function(cell) {
                            map.removePolygon(cell);
                        });
                        addVoronoiForLines(getSelectedLines());
                        currVoronoiKey = getSelectedLines().join(":");
                    });


                    addVoronoiForLines(getSelectedLines());

                });
            });
        });
    }
);