function commonParam(){return{dataSource:dataSource(),interfaceVersion:"",mobileModel:"",mobileSysVersion:"",sourcePage:window.location.pathname,sourceSystem:"1"}}function GetUserInfo(e,n,t){$.ajax({type:e,async:!1,url:config.userInfo,data:JSON.stringify(n),success:function(e){t&&t(e)}})}function GetAJAXData(e,n,t,o){o=!!o,$.ajax({type:e,async:o?!0:!1,url:config.serviceUrl,data:"param="+JSON.stringify(n),success:function(e){t&&t(e)}})}function getQueryString(e){var n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),t=window.location.search.substr(1).match(n);return null!=t?unescape(t[2]):null}function transDate(e){if(!e)return"";var n=new Date(e),t=n.getFullYear(),o=n.getMonth()+1,i=n.getDate();return t+"-"+(10>o?"0"+o:o)+"-"+(10>i?"0"+i:i)}function formatMoney(e){if(e=""==e?0:e,e=e.toString(),/[^0-9\.]/.test(e))return"";e=e.replace(/^(\d*)$/,"$1."),e=(e+"00").replace(/(\d*\.\d\d)\d*/,"$1"),e=e.replace(".",",");for(var n=/(\d)(\d{3},)/;n.test(e);)e=e.replace(n,"$1,$2");return e=e.replace(/,(\d\d)$/,".$1"),e.replace(/^\./,"0.")}function loadScript(e,n){var t=document.createElement("script");t.type="text/javascript",t.onload=function(){n&&n()},t.src=e,document.body.appendChild(t)}function dataSource(){var e=window.navigator.userAgent.toLowerCase();return/iphone|ipod|ipad|Macintosh/i.test(e)?4:/android/i.test(e)?3:/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(e)?/micromessenger/i.test(e)?2:void 0:1}function requestFn(e,n){PARAM.content.body.commonParam=commonParam(),PARAM.content.body.method="enumInfoMgr",PARAM.content.body.data={action:"query",MainKey:e},$.ajax({type:"POST",dataType:"json",async:!1,url:config.ossConfigUrl,data:JSON.stringify({params:PARAM}),success:n})}function enumFn(e,n){var t="";return e.forEach(function(e){n==e.Key&&(t=e.Value)}),t}function reEnumFn(e,n){var t="";return e.forEach(function(e){n==e.Value&&(t=e.Key)}),t}function popup(e,n,t,o,i){new Popup({type:e,title:n,content:t,ok:"确定",cancel:"取消",closeCallBack:o,okCallBack:i})}function connectWebViewJavascriptBridge(e){window.WebViewJavascriptBridge?e(WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){e(WebViewJavascriptBridge)},!1)}function webViewTitle(e){window.WebViewJavascriptBridge&&window.WebViewJavascriptBridge.callHandler("title",{param:e},function(){})}function goBack(){window.WebViewJavascriptBridge&&window.WebViewJavascriptBridge.callHandler("back","",function(){})}var $body=$(document.body),config={serviceUrl:"",ossConfigUrl:"",ossNotifyUrl:"",ussUrl:"",htmlUrl:"",userInfo:""};config.serviceUrl="http://54.222.203.245:7000/supplyCenter/services/invokeRestfulSrv/supplyCloudService",config.ossConfigUrl="http://172.31.10.168:19790/oss/config/api",config.ossNotifyUrl="http://172.31.10.155:19890/oss/notify/api",config.ussUrl="http://172.31.10.168/usersystem",config.htmlUrl="http://172.31.10.164/dist/html/",config.userInfo="http://54.222.203.245:7200/usersystem/login/getTokenList/v1";var PARAM={content:{header:{key:"",module:"",operator:""},body:{method:"",commonParam:{},data:{}}}},fnTip={success:function(e,n){n=n||"操作成功";var t='<span class="successTip"><b>操作成功</b></span>';$body.append(t),setTimeout(function(){$(".successTip").remove()},e)},error:function(e,n){n=n||"操作失败";var t='<span class="errorTip"><b>操作失败</b></span>';$body.append(t),setTimeout(function(){$(".errorTip").remove()},e)},loading:function(){var e='<div class="loader-inner ball-clip-rotate"><div></div></div>';$body.append(e)},hideLoading:function(){$(".ball-clip-rotate").length&&$(".ball-clip-rotate").remove()}},cookie={setCookie:function(e,n,t){var o=new Date;o.setDate(o.getDate()+t),document.cookie=e+"="+escape(n)+(null==t?"":";expires="+o.toGMTString()+"; path=/;")},getCookie:function(e){for(var n=document.cookie.split("; "),t=0;t<n.length;t++){var o=n[t].split("=");if(e==o[0])return unescape(o[1])}return null}};