function bottomBar(t,n,o,i){var a=["mobile","share","im"],e=t.join(","),i=!!i||"订单确认",r='<div id="jBottom" class="m-bottom-wrap clearfix"><div class="bottom-side">';a.forEach(function(t){"-1"==e.indexOf(t)&&(r+='<a href="javascript:;" id="btn-'+t+'" class="'+t+'"></a>')}),r+="</div>"+(o?"":'<a href="javascript:;" class="bottom-btn">'+i+"</a>")+"</div>",$body.append(r),btnEvens(n)}function btnEvens(t){0==$("#jBottom .bottom-btn").length&&$("#jBottom").addClass("noBtn"),$body.on("click",".bottom-side a",function(){var n=$(this);n.is("#btn-mobile")&&btmBtnMobile(t),n.is("#btn-im")&&btmBtnIm(t)})}function btmBtnMobile(t){return""==t||void 0==t?(alert("请求错误!"),!1):void window.WebViewJavascriptBridge.callHandler("call",{param:t},function(t){0!=t.response_code&&alert("对方未预留手机号码")})}function btmBtnShare(){}function btmBtnIm(t){return""==t||void 0==t?(alert("请求错误!"),!1):void window.WebViewJavascriptBridge.callHandler("chat",{param:t},function(t){0!=t.response_code&&alert("未能呼起聊天，请稍后再试")})}