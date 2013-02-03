define(["lodash"], function(_){

    var STARTPOS = "M 0 0 ";
    var pathsets = [
        [],
        [
            STARTPOS +"v -100 a 100 100 0 1 0 0 200 z",
            STARTPOS +"v -100 a 100 100 0 1 1 0 200 z"
        ],
        [
            STARTPOS +"v -100 a 100 100 0 1 0 0 200 z",
            STARTPOS +"v -100 a 100 100 0 1 1 0 200 z"
        ],
        [
            STARTPOS +"l 0 -100 a 100 100 0 0 1 86.602540378 150 z",
            STARTPOS +"l 86.602540378 50 a 100 100 0 0 1 -173.205080757 0 z",
            STARTPOS +"l -86.602540378 50 a 100 100 0 0 1 86.602540378 -150 z"
        ],
        [
            STARTPOS +"l 0 -100 a 100 100 0 0 1 100 100 z",
            STARTPOS +"l 100 0 a 100 100 0 0 1 -100 100 z",
            STARTPOS +"l 0 100 a 100 100 0 0 1 -100 -100 z",
            STARTPOS +"l -100 0 a 100 100 0 0 1 100 -100 z"
        ],
        [
            STARTPOS +"l 0 -100 a 100 100 0 0 1 95.10565 69.09830 z",
            STARTPOS +"l 95.10565 -30.90170 a 100 100 0 0 1 -36.32713 111.80340 z",
            STARTPOS +"l 58.77853 80.90170 a 100 100 0 0 1 -117.55705 0 z",
            STARTPOS +"l -58.77853 80.90170 a 100 100 0 0 1 -36.32713 -111.80340 z",
            STARTPOS +"l -95.10565 -30.90170 a 100 100 0 0 1 95.10565 -69.09830 z"
        ],
        [
            STARTPOS +"l   0       -100 a 100 100 0 0 1  86.60254   50 z",
            STARTPOS +"l  86.60254  -50 a 100 100 0 0 1   0        100 z",
            STARTPOS +"l  86.60254   50 a 100 100 0 0 1 -86.60254   50 z",
            STARTPOS +"l   0        100 a 100 100 0 0 1 -86.60254  -50 z",
            STARTPOS +"l -86.60254   50 a 100 100 0 0 1   0       -100 z",
            STARTPOS +"l -86.60254  -50 a 100 100 0 0 1  86.60254  -50 z"
        ]
    ];

    var lineMap = {
        "Red" :     "red",
        "Yellow" :  "yellow",
        "Purple" :  "purple",
        "Pink" :    "pink",
        "Brown" :   "brown",
        "Orange" :  "orange",
        "Blue" :    "blue",
        "Green" :   "green"
    };

    /*
     * Do our own memoizing, so that we return copies of the icon as opposed to the same
     * icon over and over again.
     */
    var iconCache = {};
    return function(lines) {
        if(!_.isArray(lines)) {
            lines = _.compact([lines]);
        }
        var cacheKey = lines.join(",");
        if(!iconCache[cacheKey]) {
            var linePaths = pathsets[lines.length];
            if(!linePaths || linePaths.length === 0) {
                console.error("Cannot generate a symbol for the stations you provided");
                return undefined;
            }
            if(lines.length === 1) {
                lines = lines.concat(lines);
            }

            iconCache[cacheKey] = _.map(linePaths, function(val, index, coll) {
                return {
                    path: val,
                    fillColor: lineMap[lines[index]] || "grey",
                    fillOpacity: 1.0,
                    scale: 0.07,
                    strokeWeight: 0
                };
            });
        }

        return _.clone(iconCache[cacheKey]);
    };
});