require(['fs', 'lodash'],
    function(fs, _) {
        var processedData = {
            stations: {}
        };
        fs.readFile('../data/cta-raw-data.json', function(err, jsonString) {
            if(err) {
                console.error('Some error occurred as we were trying to read a file: %s',err);
            } else {
                var ctaInfo = JSON.parse(jsonString);
                var rawData  = ctaInfo.data;
                var columnData = ctaInfo.meta.view.columns;
                var dataConverter = function(rawDatum) {
                    var convertedDatum = {};
                    columnData.forEach(function(metaDatum, index) {
                        if(metaDatum.fieldName === 'location') {
                            convertedDatum.location = {
                                latitude: rawDatum[index][1],
                                longitude: rawDatum[index][2]
                            };
                        } else {
                            convertedDatum[metaDatum.fieldName] = rawDatum[index];
                        }

                    });

                    return convertedDatum;
                };

                rawData.forEach(function(datum) {
                    var convertedDatum = dataConverter(datum);
                    //console.log(convertedDatum);
                    var lines = _.compact([].concat(
                        convertedDatum.red  ? "Red"     : undefined,
                        convertedDatum.blue ? "Blue"    : undefined,
                        convertedDatum.g    ? "Green"   : undefined,
                        convertedDatum.brn  ? "Brown"   : undefined,
                        convertedDatum.p    ? "Purple"  : undefined,
                        convertedDatum.pexp ? "Purple"  : undefined,
                        convertedDatum.y    ? "Yellow"  : undefined,
                        convertedDatum.pnk  ? "Pink"    : undefined,
                        convertedDatum.o    ? "Orange"  : undefined
                    ));
                    var stationData = {
                        id: convertedDatum.map_id,
                        name: convertedDatum.station_name,
                        lines: lines,
                        location: convertedDatum.location
                    };

                    if(processedData.stations[stationData.id]) {
                        var previousLines = processedData.stations[stationData.id].lines || [];
                        stationData.lines = _.union(stationData.lines, previousLines);

                    }

                    processedData.stations[stationData.id] = stationData;
                });

                fs.writeFile('../data/cta-data.json',JSON.stringify(processedData,null,4), function(err) {
                    if(err){
                        console.err("Problem writing JSON data: %s", err);
                    } else {
                        console.info("Wrote processed CTA data");
                    }
                })
            }
        });

    }
);