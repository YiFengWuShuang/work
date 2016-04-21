var $body = $(document.body);

var config = {
    serviceUrl:""
};
config.serviceUrl = 'http://123.127.244.235:8080/supplyCenter/services/invokeRestfulSrv/supplyCloudService';

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

//格式化金额
function formatMoney(s){
   if(/[^0-9\.]/.test(s)) return "";
   s=s.replace(/^(\d*)$/,"$1.");
   s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
   s=s.replace(".",",");
   var re=/(\d)(\d{3},)/;
   while(re.test(s))
           s=s.replace(re,"$1,$2");
   s=s.replace(/,(\d\d)$/,".$1");
   return s.replace(/^\./,"0.")
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