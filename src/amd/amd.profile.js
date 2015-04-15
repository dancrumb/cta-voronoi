var profile = (function(){

    var copyOnly = function(filename, mid){
        var list = {
            "amd/amd.profile": true,
            // we shouldn't touch our profile
            "amd/package.json": true
            // we shouldn't touch our package.json
        };
        return (mid in list);
    };

    return {

        resourceTags: {
            amd: function(filename) {
                return /\.js$/.test(filename);
            }
        },

        copyOnly: function(filename, mid){
            return copyOnly(filename, mid);
        }
    };
})();