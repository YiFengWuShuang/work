var $body = $(document.body);
var sendUrl = 'http://54.222.203.245:7000/supplyCenter/services/invokeRestfulSrv/supplyCloudService?param='
// 操作提示
var fnTip = {
	success: function(time){
		var tip = '<span class="successTip"><b>操作成功</b></span>';
		$body.append(tip);
		setTimeout(function(){
			$('.successTip').remove();
		},time);
	},
	error: function(time){
		var tip = '<span class="errorTip"><b>操作失败</b></span>';
		$body.append(tip);
		setTimeout(function(){
			$('.errorTip').remove();
		},time);
	},
	loading: function(){
		var loading = '<div class="loader-inner ball-clip-rotate"><div></div></div>';
		$body.append(loading);
	}
}

//操作cookie
var cookie = {
	setCookie: function(c_name, value, expiredays){
	　　var exdate=new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+"; path=/;");
	},
	getCookie: function(c_name){
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++){
			var aCrumb = aCookie[i].split("=");
			if (c_name == aCrumb[0]){
				return unescape(aCrumb[1]);
			}
		}
		return null;
	}
}

//获取URL参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//checkbox自定义样式
(function resetCheckbox(){
	$('.checkbox input').live('change',function(){
		var _this = $(this), label = _this.parent();
		if(_this.prop('checked')){
			label.addClass('on');
		}else{
			label.removeClass('on');
		}
		if(_this.prop('disabled')){
			label.css('color','#999');
		}
	})
	$('.checkbox input').trigger('change');
})();