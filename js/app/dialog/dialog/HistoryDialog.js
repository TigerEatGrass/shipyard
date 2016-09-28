define(function(require) {	
	return {
		templates: {
            request:'<div style="width: 100%; margin-top: 6px; margin-bottom: 6px; padding: 10px" logId="{{logid}}" class="dl-dialog-mut">'
                        + '{{req_time}}'
                        + '{{content}}'
                        + '{{req_tips}}'
                    + '</div>',
            response: '<div margin-top: 6px; margin-bottom: 6px; style="width: 100%; padding: 10px; padding-bottom: 18px;" logId="{{logid}}" class="dl-dialog-mut">'
                        + '{{res_time}}'
                        + '{{content}}'
                        + '{{res_tips}}'
                    + '</div>',
        },

		setConversation: function (data, dialogId) {
			var dialogBox = $(dialogId);
            dialogBox.empty();

            var beforeDate = moment('2000-01-01').unix();
            for (var i in data) {
                var nowstamp = moment.unix(data[i]['time']).format('YYYY-MM-DD');
                var nowDate = moment(nowstamp).unix();
                if (nowDate > beforeDate) {
                    dialogBox.append(render_tip_msg('date', {
                        date: moment.unix(nowDate).format('YYYY年MM月DD日')
                    }));
                }
                beforeDate = nowDate;
                if (data[i]['type'] == 'reVisit') {
                    dialogBox.append(render_tip_msg('center', {
                        content: data[i]['content']
                    }));
                } else if (data[i]['type'] == 'request') {
                    var node = this.templates['request'].replace('{{logid}}', data[i]['logId']);
                    var div = render_user_msg('txt', {query: data[i]['content']});
                    var tip = render_tip_msg('req_tips', {logId: data[i]['logId'], client: data[i]['client'], ctype: data[i]['ctype']});
                    var time = render_tip_msg('req_time', {logId: data[i]['logId'], time: moment.unix(data[i]['time']).format('YYYY-MM-DD HH:mm:ss')});
                    var node = node.replace('{{content}}', div).replace('{{req_tips}}', tip).replace('{{req_time}}', time);
                    dialogBox.append(node);
                } else if (data[i]['type'] == 'response') {                               
                    var node = this.templates['response'].replace('{{logid}}', data[i]['logId']);
                    var div = render_duer_msg(data[i]['ctype'], data[i]['content']);
                    var tip = render_tip_msg('res_tips', {logId: data[i]['logId'], srcType: data[i]['srcType'], client: data[i]['client']});
                    var time = render_tip_msg('res_time', {logId: data[i]['logId'], time: moment.unix(data[i]['time']).format('YYYY-MM-DD HH:mm:ss')});
                    var node = node.replace('{{content}}', div).replace('{{res_tips}}', tip).replace('{{res_time}}', time);
                    dialogBox.append(node);
                }
            }
            $('.dl-dialog-mut').mouseenter(function (e) {
                var logid = $(this).attr('logid');
                $('#se-info-logid').text(logid);
                $(this).addClass('dl-dialog-mut-active');
                $('.dl-dialog-mut').each(function () {
                    if ($(this).attr('logid') == logid) {
                        $(this).addClass('dl-dialog-mut-active');
                    }
                })
            });
            $('.dl-dialog-mut').mouseleave(function (e) {
                var logid = $(this).attr('logid');
                $(this).removeClass('dl-dialog-mut-active');
                $('.dl-dialog-mut').each(function () {
                    if ($(this).attr('logid') == logid) {
                        $(this).removeClass('dl-dialog-mut-active');
                    }
                })
            });
		}
	};
});

