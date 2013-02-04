/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
define([
    'lodash',
    'dojo/_base/declare', "dojo/_base/window", 'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin',
    'dojo/text!./templates/LineSelector.html',
    'amd/gmaps!'

], function(
    _,
    declare, win, lang,
    domConstruct,
    _WidgetBase, _TemplatedMixin,
    template,
    gmaps

    ) {

    /**
     * @class app/widgets/AddressFinder
     * @extends dijit/_WidgetBase
     * @mixes dijit/_TemplatedMixin
     */
    return declare("app/widgets/AddressFinder", [_WidgetBase, _TemplatedMixin],
        /**
         * @lends app/widgets/AddressFinder
         */
        {
            _geocoder: null,

            _boundingBox: null,

            constructor: function() {
                this._geocoder = new gmaps.Geocoder();
            },

            /**
             * @ignore
             */
            postMixInProperties: function() {
                this.inherited(arguments);
            },

            /**
             * @ignore
             */
            postCreate: function() {
                this.inherited(arguments);
            }

        }
    );

});
