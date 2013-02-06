/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
define([
    'lodash',
    'dojo/_base/declare', "dojo/_base/window", 'dojo/_base/lang', 'dojo/Deferred',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dojo/store/util/QueryResults',
    'amd/gmaps!'

], function(
    _,
    declare, win, lang, Deferred,
    domConstruct,
    _WidgetBase,
    QueryResults,
    gmaps

    ) {

    /**
     * @class app/widgets/GeocoderStore
     */
    return declare("app/widgets/GeocoderStore", [_WidgetBase],
        /**
         * @lends app/widgets/GeocoderStore
         */
        {
            _geocoder: null,

            _boundingBox: null,

            _results: null,

            idProperty: 'formatted_address',

            _data: {},

            _queryCache: {},

            constructor: function() {
                this._geocoder = new gmaps.Geocoder();
            },

            get: function(id) {
                console.log("Calling get: %o", arguments);
                return this._data[id];
            },

            getIdentity: function(object){
                return object[this.idProperty];
            },

            query: function(query, options) {
                console.log(query);
                if(this._results) {
                    this._results.cancel();
                }
                this._results = new Deferred();
                if(this._queryCache[query.formatted_address]) {
                    this._results.resolve(this._queryCache[query.formatted_address]);
                }
                else {
                    this._geocoder.geocode({
                        address: (query.formatted_address || '').toString().slice(0, -1),
                        bounds: this._boundingBox
                    }, lang.hitch(this,function(serverData, status) {
                        if(status === 'OK') {
                            /*
                             * The `bounds` property of the geocoder only biases the results; it doesn't guarantee that
                             * that any result is inside the bounding box.
                             * As a result, we do our own filtering.
                             */
                            var addresses =
                                _(serverData)
                                    /* Map the items to our desired format of the formatted address and location geometry */
                                    .map(function(item) {
                                                return _.pick(item, 'formatted_address', 'geometry');
                                            })
                                    /* Remove items that are not within our bounding box */
                                    .filter(function(item) {
                                        return  _.isUndefined(this._boundingBox) ||
                                                this._boundingBox.contains(item.geometry.location);
                                    },this)
                                    /* Get the resulting array */
                                    .value();

                            _.forEach(addresses, function(addressDetails, addressString) {
                                this._data[addressString] = addressDetails;
                            }, this);
                            this._results.resolve(addresses);

                            this._queryCache[query.formatted_address] = addresses;
                        }
                    }));
                }
                this._results.total = this._results.then(function(addresses) {
                    return addresses.length;
                });

                return QueryResults(this._results);
            },

            _setBoundingBoxAttr: function(bounds) {
                this._boundingBox = new gmaps.LatLngBounds(
                    new gmaps.LatLng(bounds.sw.latitude, bounds.sw.longitude),
                    new gmaps.LatLng(bounds.ne.latitude, bounds.ne.longitude)
                );
            }

        }
    );

});
