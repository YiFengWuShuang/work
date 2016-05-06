/*
offItems  不显示的项，类型是数组类型
*/

function bottomBar(offItems,mobile,memberId){
	var items = ['mobile','share','im'], sOffItems = offItems.join(',');
	var bottomDom = '<div id="jBottom" class="m-bottom-wrap clearfix"><div class="bottom-side">';
	items.forEach(function(val){
		if(sOffItems.indexOf(val)=='-1'){
			bottomDom+='<a href="javascript:;" id="btn-'+val+'" class="'+ val +'"></a>'
		}
	})
	bottomDom+='</div><a href="javascript:;" class="bottom-btn">完成</a></div>'
	$body.append(bottomDom);
	btnEvens(mobile,memberId);
}

function btnEvens(mobile,memberId){
	$body.on('click','.bottom-side a', function(){
		var _this = $(this);
		if(_this.is('#btn-mobile')){
			btmBtnMobile(mobile)
		}
		if(_this.is('#btn-share')){
			btmBtnShare()
		}
		if(_this.is('#btn-im')){
			btmBtnIm(memberId)
		}
	})
}

function btmBtnMobile(mobile){
	window.WebViewJavascriptBridge.callHandler( "call", {"param":mobile}, function(responseData) {});
}

function btmBtnShare(){

}

function btmBtnIm(memberId){

}
