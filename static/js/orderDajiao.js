var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var orderAnswerCon = $('#orderAnswerInfo');
var prodAnswerCon = $('#prodAnswerInfo');
var othersCostCon = $('#othersCost');
var $scope = {};
var $platformCurrencyList;
var $currencySymbol;
var $prodMapList = [];
var $fileData;
var $btnTxet = '分批答交';
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;

var orderDajiao = function(){
	this.init();
}

returnSale.prototype = {
	init:function(){
	    $scope.delPoOthreCostList = [];//删除其他费用主键列表
	    $scope.addPoFileList = [];//供应商新上传的答交附件列表
	    $scope.delPoFileList = [];//供应商新删除的答交附件主键ID列表
		this.start();
	},
	start:function(){
		var that = this, success = true;

		//订单信息
		function getOrderInfo(){
			var param = {"serviceId":"B03_getPurchaseOrderAnswerInfo", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam": commonParam()};
			GetAJAXData('POST',param,function(data){
				if(data.success){
					success = true;

				}else{
					container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					success = false;
				}
			});			
		}

		
		if(!success)return;
	}
}