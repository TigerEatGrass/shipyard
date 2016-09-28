/**
 * @file dialogBox
 */
define(function (require) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        contentView = require('text!./conclusion.html'),
        style       = require('./conclusion.css'),
        conclusion  = require('./conclusionModel.js');

    return Backbone.View.extend({
        el: '#conclusion',
        events: {
            
        },
        initialize: function (options) {
            _.extend(this, Backbone.Events, {
                initialize: function () {
                    _.bindAll(this);
                }
            });
        },

        render: function () {
            this.$el.html(_.template(contentView));
            return this;
        },

        renderDatatable: function(logid){
            var getConclusion = new conclusion(),
                that          = this;
            getConclusion.request(JSON.stringify({logId: logid}), function (model, res) {
                that.renderDataOnTable(res);
            });
        },

        renderDataOnTable: function (data) {
            console.log(data);
        }
    });
});
