define(function(require, exports, module){
	var msg = {
		init: function(){
			this.evens();
		},
		createHTML: function(){
			var result='', userId = parseInt(getQueryString('userId'),10), id = parseInt(getQueryString('id'),10);
			var params = {"params":{"content":{"header":{"module":"","key":"","operator":""},"body":{"method":"queryMessage","data":{"UserId":userId,"Id":id,"pageInfo":{}}}}}};
			$.ajax({
				type:"POST",
                dataType: "json",
                async: false,
                url:'http://172.31.10.155:19890/oss/notify/api',
                data:JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.errorCode=='0'){
                		var _msg = data.dataSet.data.detail[0];
                		result	+='<div class="itemHead">'
								+'	<h2>'+ _msg.UserName +'</h2>'
								+'	<time>'+ _msg.DateTime +'</time>'
								+'</div>'
								+'<div class="itemBody">'
								+'	<h3>'+ _msg.Title +'</h3>'
								+'	<section>'+ _msg.Content +'</section>'
								+'</div>'
                	}else{
                		console.log(data.errorMsg);
                	}
                }
			})
			return result;
		},
		evens: function(){
			var that = this;
			$('.msgDetail').html(that.createHTML())
		}
	};

	module.exports = msg
	
});