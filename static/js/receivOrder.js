/*
收货
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
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
	        		var orderInfo = data.receiveOrder;
	        		if(data.errorCode=='receive_err_033'){
	        			html = data.errorMsg;
	        			return html;
	        		}
	        		html+='<div class="m-item">'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>供应商：</span>'+ orderInfo.vendorName +'</li>'
						+'			<li><span>收货单单号：</span><b>'+ orderInfo.roFormNo +'</b></li>'
						+'			<li><span>收货日期：</span>'+ orderInfo.roFormDate +'</li>'
						+'			<li><span>收货人：</span>'+ orderInfo.receiveManName +'</li>'
						+'		</ul>'
						+'	</div>'
						+'</div>'
						+'<div class="m-item receivOrderOrderDetail"></div>'
						// +'<a href="javascript:;" class="item-wrap item-link">物流单号：'+ orderInfo.roFormNo +'</a>'
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
		        "param": '{"roId":'+ _vParams.roId +',"companyId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_findRoLineList", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		var roLineList = data.roLineList, L = roLineList.length;
	        		html+='<h2 class="m-title">出货明细</h2>'
					for(var i=0; i<L; i++){
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>采购单号：</span><b>'+ roLineList[i].sourcePoNo +'</b></li>'
							+'		<li><span>物料编码：</span><b>'+ roLineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>' + roLineList[i].prodDesc + ' ' + roLineList[i].prodScale +'</p></li>'
							+'		<li><span>待收货数量：</span>'+ roLineList[i].receiveQty + roLineList[i].receiveUnitName +'/'+ roLineList[i].receiveValuationQty + roLineList[i].valuationUnitName +'</li>'
							+'		<li><span>收货数量：</span>'+ roLineList[i].receiveQty + roLineList[i].receiveUnitName +'/'+ roLineList[i].receiveValuationQty + roLineList[i].valuationUnitName +'</li>'
							+'		<li><span>收货批号：</span>'+ roLineList[i].batchNo +'</li>'
							+'		<li><span>收货备注：</span><p>'+ roLineList[i].remark +'</p></li>'
							+'	</ul>'
							+'</div>'
					}
	        	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
	        }
		})
		return html;
	},
	start: function(){
		var that = this;
		$('.receivOrder').html(that.orderHead());
		$('.receivOrderOrderDetail').html(that.orderBody());
		setTimeout(function(){
			fnTip.hideLoading();
		},0);
		//通用底部
		bottomBar(['share'],'','','我要收货');
		$body.on('click','.bottom-btn-confirm',function(){
			//跳转至原生收货作业
		})
	}
}