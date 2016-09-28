/**
 * @file dialogBox
 */
define(function (require) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        contentView = require('text!./dialog.html'),
        style       = require('./dialog.css'),
        renderDia   = require('./HistoryDialog.js');

    return Backbone.View.extend({
        el: '#dialog',
        events: {
            
        },
        initialize: function (options) {
            _.extend(this, Backbone.Events, {
                initialize: function () {
                    _.bindAll(this);
                }
            });
        },

        render: function (subscriber, subscriber1) {
            this.$el.html(_.template(contentView));
            this.subscriber = subscriber;
            this.subscriber1 = subscriber1;
            return this;
        },

        renderDialog: function (data) {
            var chatList = data['chatList'],
                subscriber = this.subscriber,
                subscriber1 = this.subscriber1;
            renderDia.setConversation(chatList, '.duer-dialog');
            $('.dl-dialog-mut').click(function () {
                var logid = $(this).attr('logid'),
                    time  = moment($(this).find('.duer-msg-time').text()).unix();
                subscriber.renderDatatable(logid, time);
                subscriber1.renderDatatable(logid);
            });
            this.selectDialog(1);
        },

        selectDialog: function (th) {
            if (th == null || th == undefined) {
                return ;
            }
            var node = $('.duer-dialog').children('.dl-dialog-mut').eq((th - 1) * 2);
            node.click();
            node.mouseenter();
        }
    });
});
