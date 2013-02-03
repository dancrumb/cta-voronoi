/*jshint dojo:true browser:true strict:false devel:true */
/*global define:true */
define(['lodash','dojo/_base/declare','dojo/Stateful'], function(_, declare, Stateful) {

    var LINE_LIST = ["Brown", "Blue","Purple","Yellow","Orange","Red","Pink", "Green"].sort();
    var Lines = {

        selectedLines: null,

        constructor: function() {
            _.forEach(LINE_LIST, function(line) {
                if(typeof this[line] === 'undefined') {
                    this[line] = true;
                }
            }, this);
        },

        _selectedLinesGetter: function() {
            return _.filter(LINE_LIST, function(line) {
                return !!this[line];
            }, this);
        },

        _selectedLinesSetter: function() {
            throw Error("Can't set selectedLines directly at the moment");
        },

        /**
         * Flips a line on or off
         * @param line The Line who's state to flip.
         */
        toggle: function(line) {
            if(!!line) {
                this.set(line, !this.get(line));
            }
        },

        _allLinesGetter: function() {
            return _.clone(LINE_LIST);
        }
    };

    return declare([Stateful], Lines);
});