/**
 * @file logid查询历史对话的模块
 */
define(function (require) {
    var _           = require('underscore');
    var Backbone    = require('backbone');

    var Model = Backbone.Model.extend({
        url: function () {
            return '/history/get-error-result';
        },

        parse: function (res) {
            return res;
        },

        request: function (params, success, error) {
            var params = params || {};
            this.fetch({
                data: 'params=' + params,
                type: 'POST',
                async: true,
                timeout: 3000,
                success: success,
                error: error
            });
        }
    });

    return Model;
});
