var $body = $(document.body);

var config = {
    serviceUrl:""
};
config.serviceUrl = 'http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService';

//公共参数
// function commonParam() {
//     return {
//             dataSource:"1",
//             interfaceVersion:"",
//             mobileModel:"",
//             mobileSysVersion:"",
//             sourcePage:window.location.pathname,
//             sourceSystem:"1"
//         };
// };

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
		var loading = '.loader-inner{ background: rgba(0,0,0,.7); text-align: center;}.ball-clip-rotate>div{background-color:#fff;width:2rem;height:2rem;border-radius:100%;margin-top:.6rem;-webkit-animation-fill-mode:both;animation-fill-mode:both;border:2px solid #fff;border-bottom-color:transparent;background:transparent!important;display:inline-block;-webkit-animation:rotate .75s 0s linear infinite;animation:rotate .75s 0s linear infinite}@keyframes rotate{0%{-webkit-transform:rotate(0deg) scale(1);transform:rotate(0deg) scale(1)}50%{-webkit-transform:rotate(180deg) scale(0.6);transform:rotate(180deg) scale(0.6)}100%{-webkit-transform:rotate(360deg) scale(1);transform:rotate(360deg) scale(1)}}<div class="loader-inner ball-clip-rotate"><div></div></div>';
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

//时间戳转换日期
function transDate(tm){
    var d = new Date(tm);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return year + '-' + (month<10 ? '0' + month : month) + '-' + (day<10 ? '0' + day : day);
}

//格式化金额
function formatMoney(s) {
	s = s.toString();
	if (/[^0-9\.]/.test(s)) return "";
	s = s.replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	return s.replace(/^\./, "0.")
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