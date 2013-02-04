/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
define([
    'dojo/_base/declare',
    'dojo/dom-construct', 'dojo/_base/lang', 'dojo/_base/window',
    'dojo/on',
    'dijit/_WidgetBase',
    'lodash',
    'amd/gmaps!'], function(
    declare,
    domConstruct, lang, win,
    on,
    _WidgetBase,
    _,
    gmaps) {
    var GMaps = {
        mapOptions: {
            zoom:14,
            mapType: "ROADMAP"//gmaps.MapTypeId.ROADMAP
        },

        _map: null,

        constructor: function() {
            this.mapOptions.mapTypeId = gmaps.MapTypeId[this.mapOptions.mapType || "ROADMAP"];
        },


        buildRendering: function() {
            this.inherited(arguments);
            this.domNode = domConstruct.create("div", {"class": "app-GMaps"});
        },

        postCreate: function() {
            this._map = new gmaps.Map(this.domNode, this.mapOptions);
            win.global.GM = gmaps;
            on(win.global, 'resize', lang.hitch(this,function(){
                console.log("Resizing");
                //noinspection JSPotentiallyInvalidUsageOfThis
                gmaps.event.trigger(this._map, 'resize');
                //noinspection JSPotentiallyInvalidUsageOfThis
                this._map.setZoom( this._map.getZoom() );
            }));
        },

        panTo: function(coords) {
            this._map.panTo(new gmaps.LatLng(coords.latitude, coords.longitude));
        },

        addMarkers: function(location, paths, title) {
            var isTitleSet = false;
            return _.map(paths, function (path) {
                if(_.isString(path)) {
                    path = new gmaps.MarkerImage(path);
                }
                var marker = new gmaps.Marker({
                    position: new gmaps.LatLng(location[1], location[0]),
                    icon:path,
                    map: this._map
                });
                if(!isTitleSet && !!title) {
                    marker.setTitle(title);
                    isTitleSet = true;
                }
                return marker;
            }, this);
        },

        addPolygon: function(polygon, options) {
            if(_.isArray(polygon)) {
                var pathObject = {
                    paths:_.map(polygon, function (vertex) {
                        return new gmaps.LatLng(vertex[1], vertex[0]);
                    })
                };
                var polygonOptions = lang.mixin(
                    pathObject,
                    {
                        strokeColor:"#00FF00",
                        strokeOpacity:0.8,
                        strokeWeight:3,
                        fillColor:"#FF0000",
                        fillOpacity:0.01
                    },
                    options || {}
                );

                polygon = new gmaps.Polygon(polygonOptions);

            }

            polygon.setMap(this._map);
            return polygon;
        },

        removePolygon: function(polygon) {
            polygon.setMap();
        }
    };

    return declare([_WidgetBase], GMaps);
});