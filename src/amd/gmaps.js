/**
 * Dojo AMD Google Maps Loader Plugin
 *
 * With thanks to Hamish Campbell:
 * https://gist.github.com/4133562
 */
define([
    "dojo/_base/kernel",
    "dojo/request/script"
], function(kernel, script) {

    return {
        load: function(param, req, loadCallback) {
            script.get('https://maps.googleapis.com/maps/api/js', {
                query: {
                    key: "REDACTED",
                    sensor: false
                },
                jsonp: 'callback'
            }).then(function(data) {
                    loadCallback(kernel.global.google.maps);
                },
                function(err) {
                    console.error("GMaps Error: %o", err);
                });
        }
    };

});