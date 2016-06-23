var $body = $(document.body);

var config = {
    serviceUrl:"",
    ossConfigUrl:"",
    ossNotifyUrl:"",
    ussUrl:"",
    htmlUrl:"",
    userInfo:""
};

config.serviceUrl = 'http://54.222.203.245:7000/supplyCenter/services/invokeRestfulSrv/supplyCloudService';
//config.serviceUrl = 'http://prod-supplycenter-789909153.cn-north-1.elb.amazonaws.com.cn/supplyCenter/services/invokeRestfulSrv/supplyCloudService';
config.ossConfigUrl = "http://172.31.10.168:19790/oss/config/api";
config.ossNotifyUrl = "http://172.31.10.155:19890/oss/notify/api";
config.ussUrl = "http://172.31.10.168/usersystem";
config.htmlUrl = 'http://172.31.10.164/dist/html/';
config.userInfo = 'http://54.222.203.245:7200/usersystem/login/getTokenList/v1';

//公共参数
function commonParam() {
    return {
        dataSource:dataSource(),
        interfaceVersion:"",
        mobileModel:"",
        mobileSysVersion:"",
        sourcePage:window.location.pathname,
        sourceSystem:"1"
    };
};

var PARAM = {
    "content": {
        "header": {
            "key": "",
            "module": "",
            "operator": ""
        },
        "body": {
            "method": "",
            "commonParam": {},
            "data": {}
        }
    }
};

// 获取用户信息
function GetUserInfo(type,param,callback){
	$.ajax({
		type:type,
		async:false,
        url:config.userInfo,
        data:JSON.stringify(param),
        success:function(data){
        	callback&&callback(data);
        }
	})
}

// 获取接口信息
// 参数async为空或false,ajax请求为同步,或则异步
function GetAJAXData(type,param,callback,async){
	async = !!async;
	$.ajax({
		type:type,
		async:async?true:false,
        url:config.serviceUrl,
        data:'param='+JSON.stringify(param),
        success:function(data){
        	callback&&callback(data);
        }
	})
}

// 操作提示
var fnTip = {
	success: function(time,txt){
		txt = txt || '操作成功';
		var tip = '<span class="successTip"><b>操作成功</b></span>';
		$body.append(tip);
		setTimeout(function(){
			$('.successTip').remove();
		},time);
	},
	error: function(time,txt){
		txt = txt || '操作失败';
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

//时间戳转换日期
function transDate(tm){
	if(!tm)return '';
    var d = new Date(tm);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return year + '-' + (month<10 ? '0' + month : month) + '-' + (day<10 ? '0' + day : day);
}

//格式化金额
function formatMoney(s) {
	s=((s=='') ? 0 : s)
	s = s.toString();
	if(/[^0-9\.]/.test(s)) return '';
	s = s.replace(/^(\d*)$/, '$1.');
	s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1');
	s = s.replace('.', ',');
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, '$1,$2');
	s = s.replace(/,(\d\d)$/, '.$1');
	return s.replace(/^\./, '0.')
}

//loadScript
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function () {
        callback&&callback();
    };
    script.src = url;
    document.body.appendChild(script);
}

//checkbox自定义样式
// function resetCheckbox(){
// 	$('.checkbox input').live('change',function(){
// 		var _this = $(this), label = _this.parent();
// 		if(_this.prop('checked')){
// 			label.addClass('on');
// 		}else{
// 			label.removeClass('on');
// 		}
// 		if(_this.prop('disabled')){
// 			label.css('color','#999');
// 		}
// 	})
// };


//数据来源
function dataSource(){
	var UA = window.navigator.userAgent.toLowerCase();
	if(/iphone|ipod|ipad|Macintosh/i.test(UA)) return 4;
	if(/android/i.test(UA)) return 3;
	if(!(/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(UA))) return 1;
	if(/micromessenger/i.test(UA)) return 2;
}

//查询枚举信息
function requestFn(mainKey,callback){
	PARAM.content.body.commonParam = commonParam();
    PARAM.content.body.method = 'enumInfoMgr';
    PARAM.content.body.data = {"action":"query", "MainKey":mainKey};
	$.ajax({
		type:"POST",
		dataType:"json",
        async: false,
        url:config.ossConfigUrl,
        data:JSON.stringify({"params":PARAM}),
        success:callback
	})
}

function enumFn(list, key){
	var ret = '';
	list.forEach(function(val){
        if(key == val.Key) {
            ret = val.Value;
        }
    });
    return ret;
}
//反向查找
function reEnumFn(list, value){
	var ret = '';
	list.forEach(function(val){
        if(value == val.Value) {
            ret = val.Key;
        }
    });
    return ret;
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

function popup(type, title, content, closeCallBack, okCallBack){
	new Popup({
		type:type,
		title:title,
		content:content,
		ok:'确定',
		cancel:'取消',
		closeCallBack:closeCallBack,
		okCallBack:okCallBack
	});
}

function isUndefined(value){
	return typeof value === 'undefined';
}

function isEmpty(value){
	return isUndefined(value) || value === '' || value === null || value !== value;
}


function isMobileUserAgent(){
	return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
}
function isAppleMobileDevice(){
	return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
}
function isAndroidMobileDevice(){
	return (/android/i.test(navigator.userAgent.toLowerCase()));
}


//IOS JS调用Native
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

//Android JS调用Native
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

//传递title给Native
function webViewTitle(title){
	if(window.WebViewJavascriptBridge){
		window.WebViewJavascriptBridge.callHandler( "title", {"param":title}, function(responseData) {});
	}	
}

//调用Native返回上一级
function goBack(){
	if(isAndroidMobileDevice() && window.WebViewJavascriptBridge){
		window.WebViewJavascriptBridge.callHandler( "back", {"param":""}, function(responseData) {});
	}else{
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler( "back", {"param":""}, function responseCallback(responseData) {})
		})
	}
}
