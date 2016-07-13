/*
offItems  不显示的项，类型是数组类型
noBtn     为true时不显示完成按钮
*/

function bottomBar(offItems, memberId, noBtn, confirmBtn, cancelBtn){
	var items = ['mobile','share','im'], sOffItems = offItems.join(','), confirmBtn = confirmBtn || '订单确认';
	var bottomDom = '<div id="jBottom" class="m-bottom-wrap clearfix"><div class="bottom-side">';
	items.forEach(function(val){
		if(sOffItems.indexOf(val)=='-1'){
			bottomDom+='<a href="javascript:;" id="btn-'+val+'" class="'+ val +'"></a>'
		}
	})
	if(cancelBtn==undefined||cancelBtn==''){
		bottomDom+='</div>' + ((!!noBtn)? '' : '<a href="javascript:;" class="bottom-btn bottom-btn-confirm">'+confirmBtn+'</a>') + '</div>'
	}else{
		bottomDom+='</div>' + ((!!noBtn)? '' : '<div class="m-bottom-btn"><a href="javascript:;" class="bottom-btn bottom-btn-confirm'+ ((confirmBtn.length>=6)?' bottom-btn-w1':'') +'">'+confirmBtn+'</a><a href="javascript:;" class="bottom-btn bottom-btn-cancel">'+cancelBtn+'</a></div>') + '</div>'
	}
	$body.append(bottomDom);
	btnEvens(memberId);
}

function btnEvens(memberId){
	if($('#jBottom .bottom-btn').length==0){
		$('#jBottom').addClass('noBtn');
	}
	$body.on('click','.bottom-side a', function(){
		var _this = $(this);
		if(_this.is('#btn-mobile')){
			btmBtnMobile(memberId);
		}
		// if(_this.is('#btn-share')){
		// 	btmBtnShare();
		// }
		if(_this.is('#btn-im')){
			btmBtnIm(memberId);
		}
	})
}

// 拨打电话
function btmBtnMobile(memberId){
	if(memberId=='' || memberId==undefined){
		popup('alert','','用户ID有误或为空!');
		return false;		
	}
	if(isAndroidMobileDevice()){
		window.WebViewJavascriptBridge.callHandler( "call", {"param":memberId}, function(responseData) {
			if(responseData.response_code!=0){
				popup('alert','','用户ID有误!');
			}
		});
	}else{
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler("call", {"param":memberId}, function responseCallback(responseData) {
				if(responseData.response_code!=0){
					popup('alert','','用户ID有误!');
				}
		    })
		})			
	}

}

// 分享
function btmBtnShare(){

}

// 调用im
function btmBtnIm(memberId){
	if(memberId=='' || memberId==undefined){
		popup('alert','','用户ID有误或为空!');
		return false;		
	}
	if(isAndroidMobileDevice()){
		window.WebViewJavascriptBridge.callHandler( "chat", {"param":memberId}, function(responseData) {
			if(responseData.response_code!=0){
				popup('alert','','用户ID有误!');
			}
		});
	}else{
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler("chat", {"param":memberId}, function responseCallback(responseData) {
				if(responseData.response_code!=0){
					popup('alert','','用户ID有误!');
				}
		    })
		})		
	}
}
