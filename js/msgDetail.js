define(function(require, exports, module){
	var msg = {
		init: function(){
			var that = this;
			$('.msgDetail').html(that.createHTML());
		},
		createHTML: function(){
			var result='', userId = getQueryString('userId'), id = getQueryString('id'), time = getQueryString('time') || '';
			$.ajax({
				type:"POST",
                dataType: "json",
                url:'http://172.31.10.155:19890/oss/notify/api',
                data:{
                	"param":'{"token":"951d9ae454857c59239ecd1ccb15d62c","secretNumber":"b45392c40b9ec2e4a3d5134a66013769","userId":123, "Id":456}'
                },
                success:function(data){
                	data = data || {};
                	if(data){
                		var _msg = data.dataSet.data;
                		result	+='<div class="itemHead">'
								+'	<h2>'+ _msg.detail[0].UserName +'</h2>'
								+'	<time>'+ time +'</time>'
								+'</div>'
								+'<div class="itemBody">'
								+'	<h3>'+ _msg.detail[0].Title +'</h3>'
								+'	<section>'+ _msg.detail[0].Content +'</section>'
								+'</div>'
                	}
                },
                error:function(){
                	//alert('数据请求发生错误，请刷新页面!');
                }
			})
			return result;
		}
	};

	module.exports = msg
	
});