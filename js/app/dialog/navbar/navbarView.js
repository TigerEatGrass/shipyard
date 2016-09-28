/**
 * @file dialog navbar
 */
define(function (require) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        contentView = require('text!./navbar.html'),
        uidModel    = require('./uidModel.js'),
        queryQuery  = require('./queryQueryModel.js'),
        useridQuery  = require('./useridQueryModel.js'),
        logidQuery  = require('./logidQueryModel.js'),
        style       = require('./navbar.css');

    return Backbone.View.extend({
        el: '#dl-nav-bar',

        events: {
            'click #dl-nav-dt-btn': 'showDateRangePicker',
            'click .nav-btn-query-group': 'pickQueryParams',
            'input #dl-nav-userid': 'activeBaiduid',
            'input #dl-nav-baiduid': 'activeUserid',
            'click #searchDialog': 'searchDialog'
        },

        initialize: function (options) {
            _.extend(this, Backbone.Events, {
                initialize: function () {
                    _.bindAll(this);
                }
            });
        },

        render: function (subscriber) {
            this.$el.html(_.template(contentView));
            this.subscriber = subscriber;
            this.setDateRangePicker();
            return this;
        },

        setDateRangePicker: function () {
            var today = moment(new Date()).format('YYYY-MM-DD');
            today = parseInt(moment(today).unix() + '000');
            var tDate = new Date();
            $('#dl-nav-daterangepicker').daterangepicker({
                'timePicker': true,
                'showDropdowns': true,
                'timePicker24Hour': true,
                'timePickerSeconds': true,
                'ranges': {
                    '5分钟': [
                        new Date((new Date()).getTime() - 5 * 60 * 1000 - 2),
                        new Date((new Date()).getTime())
                    ],
                    '10分钟': [
                        new Date((new Date()).getTime() - 10 * 60 * 1000 - 2),
                        new Date((new Date()).getTime())
                    ],
                    '15分钟': [
                        new Date((new Date()).getTime() - 15 * 60 * 1000 - 2),
                        new Date((new Date()).getTime())
                    ],
                    '30分钟': [
                        new Date((new Date()).getTime() - 30 * 60 * 1000 - 2),
                        new Date((new Date()).getTime())
                    ],
                    '1小时': [
                        new Date((new Date()).getTime() - 60 * 60 * 1000 - 2),
                        new Date((new Date()).getTime())
                    ]
                },
                'locale': {
                    'direction': 'ltr',
                    'opens': 'left',
                    'format': 'YYYY-MM-DD HH:mm:ss',
                    'separator': ' ~ ',
                    'applyLabel': 'Apply',
                    'cancelLabel': 'Cancel',
                    'fromLabel': 'From',
                    'toLabel': 'To',
                    'customRangeLabel': '自定义',
                    'daysOfWeek': ['日','一','二','三','四','五','六'],
                    'monthNames': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                },
                'maxDate': tDate.getFullYear() + '/' + (tDate.getMonth() + 1) + '/' + tDate.getDate() + ' 23:59:59',
                'startDate': new Date(today),
                'endDate': new Date(),
                'linkedCalendars': false,
            });
        },

        showDateRangePicker: function () {
            $('#dl-nav-daterangepicker').click();
        },

        pickQueryParams: function (e) {
            var clickId = e.target.id,
                otherId = '';

            $('.nav-btn-query-group').each(function () {
                otherId = $(this).attr('id');
                $(this).removeClass('btn-default');
                $(this).removeClass('btn-primary');
                otherId === clickId ? $(this).addClass('btn-primary') : $(this).addClass('btn-default');
            });

            this.exchangeQueryParams(clickId);
        },

        exchangeQueryParams: function (queryType) {
            var currentScrollPos    = $('.dl-nav-multi-content').scrollTop(),
                deltaScrollPos       = $('.' + queryType).position().top,  // relative with dl-nav-multi-content's top-border
                delta               = 0;

            if (deltaScrollPos === 0) {
                return ;
            } else {
                delta = currentScrollPos + deltaScrollPos;
            }
            $('.dl-nav-multi-content').animate({scrollTop: delta});
        },

        activeBaiduid: function () {
            if (this.findUid != null) {
                clearTimeout(this.findUid);
            }
            this.findUid = setTimeout(this.findBaiduid, 500);
        },

        activeUserid: function () {
            if (this.findUid != null) {
                clearTimeout(this.findUid);
            }
            this.findUid = setTimeout(this.findUserid, 500);
        },

        findBaiduid: function () {
            var finduid = new uidModel(),
                params = 'srchKey=user_id&srchValue=' + $('#dl-nav-userid').val();
            finduid.request(params, function (model, res) {
                if (res['errNo'] !== 0) {
                    $('#dl-nav-baiduid').val(0);
                    return ;
                }
                var data = res['data'];
                $('#dl-nav-baiduid').val(data['baidu_uid']);
            }, function() {
                console.log('服务器出错！');
            })
        },

        findUserid: function () {
            var finduid = new uidModel(),
                params = 'srchKey=baidu_uid&srchValue=' + $('#dl-nav-baiduid').val();
            finduid.request(params, function (model, res) {
                if (res['errNo'] !== 0) {
                    $('#dl-nav-userid').val(0);
                    return;
                }
                var data = res['data'];
                $('#dl-nav-userid').val(data['dumi_id']);
            }, function() {
                console.log('服务器出错！');
            })
        },

        searchDialog: function () {
            var method = $('.btn-primary.nav-btn-query-group').attr('id').split('-')[1];
            this[method + 'Query']();
        },

        useridQuery: function () {
            var params = {
                    'queryMethod': 'userId',
                    'queryParams':{
                        'beginTime': moment($('#dl-nav-daterangepicker').val().split('~')[0].trim()).unix(),
                        'endTime': moment($('#dl-nav-daterangepicker').val().split('~')[1].trim()).unix(),
                        'chatNum': $('#dl-nav-query-num').val() / 100,
                        'dumiId': $('#dl-nav-userid').val(),
                        'baiduId': $('#dl-nav-baiduid').val(),
                    }
                },
                user   = new useridQuery()
                subscriber = this.subscriber;
            user.request(JSON.stringify(params), function (model, res) {
                if (res['errNo'] !== 0) {
                    alert('对话未找到');
                    return ;
                }
                subscriber.renderDialog(res['data']);
            });
        },

        logidQuery: function () {
            var params = {
                    'queryMethod': 'logId',
                    'queryParams':{
                        'beginTime': moment($('#dl-nav-daterangepicker').val().split('~')[0].trim()).unix(),
                        'endTime': moment($('#dl-nav-daterangepicker').val().split('~')[1].trim()).unix(),
                        'pageNum': $('#dl-nav-query-num').val() / 100,
                        'logId': $('#dl-nav-input-logid').val(),
                    }
                },
                log    = new logidQuery();
            log.request(JSON.stringify(params), function (model, res) {
                if (res['errNo'] !== 0) {
                    alert('对话未找到');
                    return ;
                }
                subscriber.renderDialog(res['data']);
            });
        },

        queryQuery: function () {
            var params = {
                    'queryMethod': 'query',
                    'queryParams':{
                        'beginTime': moment($('#dl-nav-daterangepicker').val().split('~')[0].trim()).unix(),
                        'endTime': moment($('#dl-nav-daterangepicker').val().split('~')[1].trim()).unix(),
                        'pageNum': $('#dl-nav-query-num').val() / 100,
                        'query': $('#dl-nav-input-query').val(),
                    }
                },
                query  = new queryQuery();
            query.request(JSON.stringify(params), function (model, res) {
                console.log(res)
            });
        },

        runLogidSearch: function (logid) {
            $('#btn-logid').click();
            $('#dl-nav-input-logid').val(logid);
            this.searchDialog();
        },

        runBdidSearch: function (baiduid, userid) {
            $('#navUserId').text(baiduid);
            $('#btn-userid').click();
            $('#dl-nav-userid').val(userid);
            $('#dl-nav-baiduid').val(baiduid);
            this.searchDialog();
        }
    });
});
