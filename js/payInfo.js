define(function(require, exports, module){
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var lists = {
		init: function(){
			fnTip.loading();
			this.start();
		},
		//支付信息
		payInfo: function(){
			var that = this, html = '';
			var params = { 
				"token":_vParams.token, 
				"serviceId":"B03_getPurchaseOrderInfo", 
				"secretNumber":_vParams.secretNumber,
				"poId":_vParams.poId,
				"companyId":_vParams.companyId, 
				"commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } 
			};
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
			    data:'param='+JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var infos = data.purchaseOrderInfo;
                		html += '<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
								+'<li><span>物流方式：</span><p>'+ infos.logisticsType +((infos.logisticsType==3) ? '（自提点：'+ infos.address +'）':'')+'</p></li>'
								+'<li><span>收货地址：</span><p>'+ infos.address +'；<br>电话：'+ infos.mobile +'</p></li>'
								+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
								+'<li><span>支付方式：</span><p>'+ infos.paymentType +'</p></li>'
								+'<li><span>发票类型：</span><p>'+ infos.invoiceType +'</p></li>'
								+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
								+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'
                	}else{
                		$('.contarin').html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
                	}
                }
			})
			fnTip.hideLoading();
			return html;
		},
		start: function(){
			var that = this;
			document.getElementById('payInfoList').innerHTML = that.payInfo();
		}
	};

	module.exports = lists
	
});