/**
 * @file uid模块
 */
define(function (require) {
    var _           = require('underscore');
    var Backbone    = require('backbone');

    var Model = Backbone.Model.extend({
        url: function () {
            return '/uid/get-user-info';
        },

        parse: function (res) {
            return res;
        },

        request: function (params, success, error) {
            var params = params || {};
            this.fetch({
                data: params,
                type: 'GET',
                async: true,
                timeout: 3000,
                success: success,
                error: error
            });
        }
    });

    return Model;
});
