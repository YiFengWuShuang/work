function bottomBar(t,o,n,a,i){var e=["mobile","share","im"],b=t.join(","),a=a||"订单确认",c='<div id="jBottom" class="m-bottom-wrap clearfix"><div class="bottom-side">';e.forEach(function(t){"-1"==b.indexOf(t)&&(c+='<a href="javascript:;" id="btn-'+t+'" class="'+t+'"></a>')}),c+=void 0==i||""==i?"</div>"+(n?"":'<a href="javascript:;" class="bottom-btn bottom-btn-confirm">'+a+"</a>")+"</div>":"</div>"+(n?"":'<div class="m-bottom-btn"><a href="javascript:;" class="bottom-btn bottom-btn-confirm">'+a+'</a><a href="javascript:;" class="bottom-btn bottom-btn-cancel">'+i+"</a></div>")+"</div>",$body.append(c),btnEvens(o)}function btnEvens(t){0==$("#jBottom .bottom-btn").length&&$("#jBottom").addClass("noBtn"),$body.on("click",".bottom-side a",function(){var o=$(this);o.is("#btn-mobile")&&btmBtnMobile(t),o.is("#btn-im")&&btmBtnIm(t)})}function btmBtnMobile(t){return""==t||void 0==t?(popup("alert","","用户ID有误或为空!"),!1):void window.WebViewJavascriptBridge.callHandler("call",{param:t},function(t){0!=t.response_code&&popup("alert","","用户ID有误!")})}function btmBtnShare(){}function btmBtnIm(t){return""==t||void 0==t?(popup("alert","","用户ID有误或为空!"),!1):void window.WebViewJavascriptBridge.callHandler("chat",{param:t},function(t){0!=t.response_code&&popup("alert","","用户ID有误!")})}