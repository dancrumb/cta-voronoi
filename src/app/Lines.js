/**
 * Created with JetBrains WebStorm.
 * User: dancrumb
 * Date: 1/19/13
 * Time: 9:50 PM
 * To change this template use File | Settings | File Templates.
 */

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
        }
    };

    return declare([Stateful], Lines);
});