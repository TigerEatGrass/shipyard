/**
 * @file dialog
 */
define(function (require) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        contentView = require('text!./main.html'),
        style       = require('./main.css'),
        navbarView  = require('../navbar/navbarView.js'),
        dialogView  = require('../dialog/dialogView.js'),
        conclusionView = require('../conclusion/conclusionView.js'),
        tracelogView = require('../tracelog/tracelogView.js'),
        getUid      = require('./getBaiduIdModel.js');

    var navbar, dialog, conclusion, tracelog;

    return Backbone.View.extend({
        el: '#right_content',
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
            this.initialComponents();
            this.entrance();
            return this;
        },

        entrance: function () {
            var logid = window.location.href.match(/logid=(.*)/),
                getId = new getUid(),
                params = '',
                cookie = document.cookie;

            // 暴露按照logid查询的接口
            if (logid != null && logid[1] != null) {
                navbar.runLogidSearch(logid[1]);
            } else {
                // 自动按照baiduid查询
                params = 'BDUSS=' + cookie;
                getId.request(params, function (model, res) {
                    console.log(res);
                });
                navbar.runBdidSearch('1729513582', '8444991');
            }
        },

        initialComponents: function () {
            var navbarid    = '#dl-nav-bar',
                dialogboxid = '#dialog',
                conclusionid= '#conclusion',
                tracelogid  = '#tracelog';
            tracelog        = new tracelogView().render();
            conclusion      = new conclusionView().render();
            dialog          = new dialogView().render(tracelog, conclusion);
            navbar          = new navbarView().render(dialog);
        }
    });
});
