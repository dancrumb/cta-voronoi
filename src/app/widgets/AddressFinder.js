/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
define([
    'lodash',
    'dojo/_base/declare', "dojo/_base/window", 'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./templates/AddressFinder.html',
    'amd/gmaps!',

        'dijit/form/ComboBox', 'app/widgets/GeocoderStore'

], function(
    _,
    declare, win, lang,
    domConstruct,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template,
    gmaps

    ) {

    /**
     * @class app/widgets/AddressFinder
     * @extends dijit/_WidgetBase
     * @mixes dijit/_TemplatedMixin
     * @mixes dijit/_WidgetsInTemplateMixin
     */
    return declare("app/widgets/AddressFinder", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],
        /**
         * @lends app/widgets/AddressFinder
         */
        {
            geoStore: null,
            searchBox: null,
            optionsList: null,

            _boundingBox: null,

            templateString: template,

            postCreate: function() {
                this.inherited(arguments);
                this.searchBox.set('store', this.geoStore);
            },

            _setBoundingBoxAttr: function(bb) {
                this._boundingBox = bb;
                this.geoStore.set('boundingBox', bb);
            }
        }
    );

});
