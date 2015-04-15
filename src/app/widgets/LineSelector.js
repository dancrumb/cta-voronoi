define([
    'lodash',
    'dojo/_base/declare', "dojo/_base/window", 'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin',
    'dijit/form/ToggleButton',
    'dojo/text!./templates/LineSelector.html'

], function(
    _,
    declare, win, lang,
    domConstruct,
    _WidgetBase, _TemplatedMixin,
    ToggleButton,
    template
    ) {

    /**
     * @class app/widgets/LineSelector
     * @extends dijit/_WidgetBase
     * @mixes dijit/_TemplatedMixin
     */
    return declare("app/widgets/LineSelector", [_WidgetBase, _TemplatedMixin],
        /**
         * @lends app/widgets/LineSelector
         */
        {
            /**
             * @ignore
             */
            templateString: template,

            /**
             * @type {Array.<string>}
             * @private
             */
            _lines: [],

            /**
             * @type {Object} The model representing the various lines
             */
            model: null,

            /**
             * @ignore
             */
            buttons:null,

            /**
             * @ignore
             */
            postMixInProperties: function() {
                this.inherited(arguments);
                if (this.model) {
                    if(_.isString(this.model)) {
                        this.model = win.global[this.model];
                    }

                    this._lines = this.model.get('allLines');
                }
            },

            /**
             * @ignore
             */
            postCreate: function() {
                this.inherited(arguments);
                _.forEach(this._lines, function(line) {
                    var button = new ToggleButton({
                        showLabel: true,
                        checked: this.model.get(line),
                        label: line,
                        onChange: lang.hitch(this, function(val) {
                            //noinspection JSPotentiallyInvalidUsageOfThis
                            this.model.set(line,val);
                        })
                    });
                    domConstruct.place(button.domNode, this.buttons);
                }, this);
            }

        }
    );

});
