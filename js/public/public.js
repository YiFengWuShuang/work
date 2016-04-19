var $body = $(document.body);

var config = {
    serviceUrl:""
};
config.serviceUrl = 'http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService';

//公共参数
function commonParam() {
    return {
            dataSource:"1",
            interfaceVersion:"",
            mobileModel:"",
            mobileSysVersion:"",
            sourcePage:window.location.pathname,
            sourceSystem:"1"
        };
};

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
	},
	hideLoading: function(){
		if($('.ball-clip-rotate').length){
			$('.ball-clip-rotate').remove();			
		}
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






var params = '{"account":"sunxy006","password":"123","verifyKey":"","verifyCode":""}';
$.ajax({
	type:"POST",
    url:'http://172.31.10.52/usersystem/login/memberLogin/v1',
    dataType:"jsonp",
    data: {
    	param:decodeURI(params)
    },
    success:function(data){
    	alert(111)
    }
})