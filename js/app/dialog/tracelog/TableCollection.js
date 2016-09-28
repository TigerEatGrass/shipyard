/**
 * @file tracelog
 */
define(function (require) {
    var _ 			= require('underscore');
    var Backbone 	= require('backbone');

    var Row = Backbone.Model.extend({
     	defaults: {
     		logId: '',
     		time: '',
     		module: '',
     		node: '',
     		tree: ''
     	},

     	initialize: function() {
     		this.cid = this.get('logId') + this.get('module');
     	}
    });

    var Table = Backbone.Collection.extend({
    	model: Row,
    });

    return Table;
});