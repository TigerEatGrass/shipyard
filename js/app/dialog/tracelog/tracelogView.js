/**
 * @file tracelog
 */
define(function (require) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        contentView = require('text!./tracelog.html'),
        style       = require('./tracelog.css'),
        tracelogModel   = require('./accquireTracelogModel.js'),
        TableCollection = require('./TableCollection.js'),
        tableCollection = new TableCollection();

    return Backbone.View.extend({
        el: '#tracelog',
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
            this.initialPlugin();
            this.initialDatatable();
            return this;
        },

        initialPlugin: function () {
            var str = '<div id="dl-json-view" style="display: none">'
                        + '<h4>TRACE日志详情</h4>'
                        + '<div class="dl-json-inner"></div>'
                    + '</div>'
                    + '<div id="lean_overlay"></div>',
                height = 0,
                width = 0;
            $('body').append(str);
            $(window).resize(function(){
                height = $(window).height();
                width  = $(window).width();
                $('#dl-json-view').css('width', width * 0.6);
                $('#dl-json-view').css('left', width * 0.4 / 2);
                $('#dl-json-view').css('height', height - 240);
            });
            height = $(window).height();
            width = $(window).width();
            $('#dl-json-view').css('width', width * 0.6);
            $('#dl-json-view').css('left', width * 0.4 / 2);
            $('#dl-json-view').css('height', height - 240);
        },

        initialDatatable: function () {
            $('#dl-table').DataTable({
                columns:   [{
                                title: '时间',
                                width: '30%'
                            },
                            {
                                title: '模块',
                                width: '40%'
                            },
                            {
                                title: '节点',
                                width: '30%'
                            }],
                bInfo: false,
                bLengthChange: false,
                bFilter: false,
                iDisplayLength: 10,
                bAutoWidth: false,
                paginate: {
                    previous: '上一页',
                    next: '下一页',
                    first: '第一页',
                    last: '最后'
                },
                aoColumnDefs: [
                    { 'bSortable': false, 'aTargets': [ 0 ] },
                    { 'bSortable': false, 'aTargets': [ 1 ] },
                    { 'bSortable': false, 'aTargets': [ 2 ] },
                ],       
                createdRow: function (row, data, index) {
                    $(row).attr('id', data[1]);

                    $(row).click(function () {
                        var id = $(this).attr('id');
                        var model = tableCollection.get(id);
                        var contentJsonTree = model.get('log');
                        $('#dl-json-view .dl-json-inner').JSONView(contentJsonTree);
                        $('#dl-json-view').css('display', 'block');
                    });

                    $('td', row).css({
                        'word-wrap':'break-word',
                        'word-break':'break-all'
                    });

                    $('td', row).css({
                        'text-align': 'center',
                        'vertical-align': 'middle',
                        'line-height': '30px',
                        'cursor': 'pointer'
                    });

                    $('td', row).mouseenter(function () {
                        $(this).closest('tr').css({
                            'background-color': '#74f4ff'
                        })
                    });

                    $('td', row).mouseleave(function () {
                        $(this).closest('tr').css({
                            'background-color': '#f9f9f9'
                        })
                    });
                }
            });

            $('#dl-table').leanModal();
            $('#lean_overlay').click(function () {
                $('#dl-json-view').css('display', 'none');
            });
        },

        renderDatatable: function (logid, time) {
            var params      = 'logid=' + logid + '&time=' +time,
                tracelog    = new tracelogModel(),
                that        = this;

            tracelog.request(params, function (model, res) {
                that.renderDataOnTable(res);
            });
        },

        renderDataOnTable: function (res) {
            var index = 0,
                data  = res['data'],
                table = $('#dl-table').DataTable()
            for (index = 0; index < data.length; index ++) {
                tableCollection.push(data[index]);
            }

            table.rows().remove().draw();
            for (var index in data) {
                ret = [
                    data[index]['time'],
                    data[index]['module'],
                    data[index]['host'],
                ];
                ret[2] = ret[2].replace('.baidu.com', '');
                table.row.add(ret).draw(true);
                tableCollection.push(data[index]);
            }
        }
    });
});
