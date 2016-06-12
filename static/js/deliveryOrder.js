/*
出货
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var deliveryOrder = function(){
	this.init();
}
deliveryOrder.prototype = {
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
		        "param": '{"doId":"'+ _vParams.doId +'","companyId":"'+ _vParams.companyId +'",'+ that.tokens +',"serviceId":"B03_getDeliveryOrderInfo", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		that.orderInfo = data.deliveryOrder;
	        		html+='<div class="m-item">'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>客户：</span>'+ that.orderInfo.customerName +'</li>'
						+'			<li><span>出货单号：</span><b>'+ that.orderInfo.doFormNo +'</b></li>'
						+'			<li><span>出货日期：</span>'+ that.orderInfo.doFormDate +'</li>'
						+'			<li><span>出货人：</span>'+ that.orderInfo.deliveryManName +'</li>'
						+'			<li><span>预计送达：</span>'+ that.orderInfo.planDeliveryDate +'</li>'
						+'		</ul>'
						+'	</div>'
						+'</div>'
						+'<div class="m-item deliveryOrderDetail"></div>'
						+'<a href="javascript:;" class="item-wrap item-link">物流单号：'+ that.orderInfo.logisticsNo +'<span class="arrow_down"></span></a>'
	        	}
	        }
		})
		return html;
	},
	orderBody: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
	        async: false,
	        url:config.serviceUrl,
	        data: {
		        "param": '{"doId":"'+ _vParams.doId +'","companyId":"'+ _vParams.companyId +'",'+ that.tokens +',"serviceId":"B03_findDoLineList", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		var doLineList = data.doLineList, L = doLineList.length;
	        		html+='<h2 class="m-title">出货明细</h2>'
					for(var i=0; i<L; i++){
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>采购单号：</span><b>'+ doLineList[i].sourcePoNo +'</b></li>'
							+'		<li><span>物料编码：</span><b>'+ doLineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>' + doLineList[i].prodDesc + ' ' + doLineList[i].prodScale +'</p></li>'
							+'		<li><span>待出货数量：</span>'+ doLineList[i].deliveryQty + doLineList[i].deliveryUnitName +'/'+ doLineList[i].deliveryValuationQty + doLineList[i].valuationUnitName +'</li>'
							+'		<li><span>出货数量：</span>'+ doLineList[i].deliveryQty + doLineList[i].deliveryUnitName +'/'+ doLineList[i].deliveryValuationQty + doLineList[i].valuationUnitName +'</li>'
							+'		<li><span>出货批号：</span>'+ doLineList[i].batchNo +'</li>'
							+'		<li><span>出货备注：</span><p>'+ doLineList[i].remark +'</p></li>'
							+'	</ul>'
							+'</div>'
					}
	        	}
	        }
		})
		return html;
	},
	start: function(){
		var that = this;
		$('.deliveryOrder .showItemCon').html(that.orderHead());
		$('.deliveryOrderDetail').html(that.orderBody());
		setTimeout(function(){
			fnTip.hideLoading();
		},0);

		//通用底部
		if(that.orderInfo.vStatus==4){
			bottomBar(['share'],'','','出货');
		}
		//出货单提交
		$body.on('click','.bottom-btn',function(){
			that.submitFn();
		})
	},
	submitFn: function(){
		var that = this;
		var _commonParam = commonParam()
		_commonParam.secretKey = "1"
		_commonParam.joinUpCode = "1"
		$.ajax({
			type:"POST",
	        async: false,
	        url:config.serviceUrl,
	        data: {
		        "param": '{"deliveryId":"'+ _vParams.doId +'","companyId":"'+ _vParams.companyId +'",'+ that.tokens +',"serviceId":"B03_submitDeliveryOrder","commonParam":'+ JSON.stringify(_commonParam) +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		fnTip.success(2000);
	        		//返回列表
	        		
	        	}else{
	        		fnTip.error(2000);
	        	}
	        }
		})
	}
}