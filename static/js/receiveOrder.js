/*
收货签收
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var receiveOrder = function(){
	this.init();
}
receiveOrder.prototype = {
	init: function(){
		var that = this;
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		that.memberId = '';
		that.orderBaseInfo();
		//that.prodBodyInfo();
		setTimeout(function(){
			fnTip.hideLoading();
			container.show();
		},0)
		
		//通用底部
		bottomBar(['share'],that.memberId,'','确认签收','取消签收');

		that.submitFn();
	},
	orderBaseInfo: function(){
		//roId 收货单单头主键ID
		var that = this, html = '';
		var params = {"serviceId": "B03_mobileReceiveInfoByNo", "companyIdList": _vParams.companyIdList, "formNo": _vParams.formNo, "commonParam": commonParam(),"token":_vParams.token, "secretNumber":_vParams.secretNumber}
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		html+='<div id="orderHeadInfo" class="m-item"><div class="item-wrap">'
						+'	<ul>'
						+'		<li><span>供应商：</span><b>'+ data.vendorName +'</b></li>'
						+'		<li><span>物流单号：</span><b>'+ data.doFormNo +'</b></li>'
						+'		<li><span>出货人：</span>'+ data.deliveryManName +'</li>'
						+'		<li><span>出货日期：</span>'+ transDate(data.doFormDate) +'</li>'
						+'	</ul>'
						+'</div></div>'
						+'<div id="prodBodyInfo" class="m-item m-item2"><h2 class="m-title">出货明细</h2>'

					for(var i=0, len=data.lineList.length; i<len; i++){
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>采购单号：</span><b>'+ data.lineList[i].poFormNo +'</b></li>'
							+'		<li><span>物料编码：</span><b>'+ data.lineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ data.lineList[i].prodDesc +'</p></li>'
							+'		<li><span>待收货数量：</span>'+ data.lineList[i].waitReceiveQty + data.lineList[i].purchaseUnitName + ' / ' + data.lineList[i].waitVaReceiveQty+ data.lineList[i].valuationUnitName +'</li>'
							// +'		<li><span>收货数量：</span></li>'
							+'		<li><span>批号：</span>'+ data.lineList[i].batchNo +'</li>'
							+'		<li><span>出货备注：</span>'+ data.lineList[i].remark +'</li>'
							+'	</ul>'
							+'  <a href="#" class="edit"></a>'
							+'</div>'						
					}
					html+='</div>'
					container.html(html);
            	}
            }
		})
	},
	prodBodyInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_mobileRoLineList","companyId":_vParams.companyId,"roId": _vParams.roId,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var lineList = data.roLineList;
            		html = '<h2 class="m-title">出货明细</h2>';
            		for(var i=0, len=lineList.length; i<len; i++){
                		html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>采购单号：</span><b>'+ lineList[i].sourcePoNo +'</b></li>'
							+'		<li><span>物料编码：</span><b>'+ lineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ lineList[i].prodDesc +'</p></li>'
							+'		<li><span>待收货数量：</span></li>'
							+'		<li><span>收货数量：</span>'+ lineList[i].receiveValuationQty + ' ' + lineList[i].valuationUnitName +'</li>'
							+'		<li><span>批号：</span>'+ lineList[i].batchNo +'</li>'
							+'		<li><span>出货备注：</span>'+ lineList[i].remark +'</li>'
							+'	</ul>'
							+'  <a href="#" class="edit"></a>'
							+'</div>'
            		}
            		$('#prodBodyInfo').html(html);
            	}else{
            		container.show().html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					fnTip.hideLoading();
            	}
            }
		})
		return html;
	},
	popup: function(type, title, content, closeCallBack, okCallBack){
		new Popup({
			type:type,
			title:title,
			content:content,
			ok:'确定',
			cancel:'取消',
			closeCallBack:closeCallBack,
			okCallBack:okCallBack
		});
	},
	submitFn: function(){
		var that = this, content = '您确定要取消签收吗？';
		
		$body.on('click','.bottom-btn-confirm',function(){
			
		})

		$body.on('click','.bottom-btn-cancel',function(){
			that.popup('confirm', '', content, function(){
				//取消
			},function(){
				//确定
			})			
		})

	}
}