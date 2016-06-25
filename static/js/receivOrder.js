/*
收货
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var $scope = {};
var receivOrder = function(){
	this.init();
}
receivOrder.prototype = {
	init: function(){
		this.commonParam = JSON.stringify(commonParam());
		this.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';

		this.start();
	},
	orderHead: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
	        async: false,
	        url:config.serviceUrl,
	        data: {
		        "param": '{"roId":'+ _vParams.roId +',"companyId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_getReceiveOrderInfo", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.orderInfo = data.receiveOrder;
	        		if(data.errorCode=='receive_err_033'){
	        			html = data.errorMsg;
	        			return html;
	        		}
	        		html+='<h2 class="m-title">基础信息</h2>'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>供应商：</span>'+ $scope.orderInfo.vendorCode + '-' + $scope.orderInfo.vendorAbbr +'</li>'
						+'			<li><span>收货单号：</span><b>'+ $scope.orderInfo.roFormNo +'</b></li>'
						+'			<li><span>内部单号：</span><b>'+ $scope.orderInfo.roInsideNo +'</b></li>'
						+'			<li><span>收货日期：</span>'+ $scope.orderInfo.roFormDate +'</li>'
						+'			<li><span>收货人：</span>'+ $scope.orderInfo.receiveManName +'</li>'
						+'			<li><span>交易币别：</span>'+ $scope.orderInfo.currencyName +'</li>'
						+'			<li><span>交易税别：</span>'+ $scope.orderInfo.taxName +'<label class="checkbox'+ (($scope.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ $scope.orderInfo.taxRate*100 +'%</label></li>'
						+'			<li><span>交易条件：</span>'+ $scope.orderInfo.conditionName +'</li>'
						+'			<li><span>付款条件：</span>'+ $scope.orderInfo.payWayName +'</li>'
						+'		</ul>'
						+'	</div>'
					$('.orderInfo').html(html);
	        	}
	        }
		})
	},
	orderBody: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
	        url:config.serviceUrl,
	        data: {
		        "param": '{"roId":'+ _vParams.roId +',"companyId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_findRoLineList", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.roLineList = data.roLineList, L = $scope.roLineList.length
	        		html+='<h2 class="m-title">收货产品</h2>'
					for(var i=0; i<L; i++){
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>收货产品：</span>' + $scope.roLineList[i].prodName + ' ' + $scope.roLineList[i].prodScale +'</li>'
							+'		<li><span>来源单据：</span><p>采购单：' + $scope.roLineList[i].sourcePoNo + '-' + $scope.roLineList[i].sourcePoLineNo +'<br>送货单：' + $scope.roLineList[i].sourceDoNo + '-' + $scope.roLineList[i].sourceDoLineNo +'</p></li>'
							+'		<li><span>收货批号：</span>'+ $scope.roLineList[i].batchNo +'</li>'
							+'		<li><span>收货数量：</span>'+ $scope.roLineList[i].receiveQty +'/'+ $scope.roLineList[i].receiveValuationQty +'</li>'
							+'		<li><span>验退数量：</span>'+ $scope.roLineList[i].prQty +'/'+ $scope.roLineList[i].prValuationQty +'</li>'
							+'		<li><span>收货仓库：</span>'+ $scope.roLineList[i].invName +'</li>'
							+'		<li><span>备注：</span><p>'+ $scope.roLineList[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'	</ul>'
							+'</div>'
					}
					$('.receivOrderOrderDetail').html(html);
	        	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
	        }
		})
	},
	remark: function(){
		var html='';
		html+='<h2 class="m-title">备注</h2>'
			+'	<div class="item-wrap">'
			+'		<ul>'
			+'			<li><span>备注信息：</span>'+ $scope.orderInfo.remark +'</li>'
			+'			<li class="files"><span>附件：</span></li>'
			+'		</ul>'
			+'	</div>'
		$('.remarks').html(html);
	},
	start: function(){
		var that = this;
		that.orderHead();
		that.orderBody();
		setTimeout(function(){
			fnTip.hideLoading();
		},0);
		that.remark();
		//通用底部
		//bottomBar(['share'],'',true);
	}
}