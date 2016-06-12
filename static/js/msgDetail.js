var Message = function(){
	this.init();
}
Message.prototype = {
	init: function(){
		fnTip.loading();
		this.title = '';
		this.evens();
	},
	createHTML: function(){
		var that = this, result='', userId = parseInt(getQueryString('userId'),10), id = parseInt(getQueryString('id'),10);
		var params = {"params":{"content":{"header":{"module":"","key":"","operator":""},"body":{"method":"queryMessage","data":{"UserId":userId,"Id":id,"pageInfo":{}}}}}};
		$.ajax({
			type:"POST",
            dataType: "json",
            async: false,
            url:config.ossNotifyUrl,
            data:JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.errorCode=='0'){
            		var _msg = data.dataSet.data.detail[0];
            		that.title = _msg.Title;
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
		fnTip.hideLoading();
		return result;
	},
	evens: function(){
		var that = this;
		//传递title给Native
		webViewTitle(that.title);
		$('.msgDetail').html(that.createHTML())
	}	
}