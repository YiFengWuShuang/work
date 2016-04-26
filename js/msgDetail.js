define(function(require, exports, module){
	var msg = {
		init: function(){
			var that = this;
			$('#msgDetail').html(that.createHTML())
		},
		createHTML: function(){
			var result='', userId = getQueryString('userId'), id = getQueryString('id'), time = getQueryString('time') || '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:'http://172.31.10.155:19890/oss/notify/api',
                //processData:false,
                data:JSON.stringify({"content":{"header":{"module":"","key":"","operator":""},"body":{"method":"queryMessage","data":{"UserId":89,"Id":10,"pageInfo":{}}}}}),
                success:function(data){
                	data = data || {};
                	console.log(1 + ' ' + data);
                	if(data.errorCode=='0'){
                		var _msg = data.dataSet.data;
                		result	+='<div class="itemHead">'
								+'	<h2>'+ _msg.detail[0].UserName +'</h2>'
								+'	<time>'+ time +'</time>'
								+'</div>'
								+'<div class="itemBody">'
								+'	<h3>'+ _msg.detail[0].Title +'</h3>'
								+'	<section>'+ _msg.detail[0].Content +'</section>'
								+'</div>'
                	}else{
                		console.log(2 + ' ' + data.errorMsg);
                	}
                },
                error:function(jqXHR, textStatus, errorThrown){
                	console.log(3 + ' ' + jqXHR.readyState);
                	console.log(4 + ' ' + textStatus);
                	console.log(5 + ' ' + errorThrown);
                }
			})
			return result;
		}
	};

	module.exports = msg
	
});