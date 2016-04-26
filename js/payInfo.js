define(function(require, exports, module){
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var lists = {
		init: function(){
			this.start();
		},
		//支付信息
		payInfo: function(){
			var that = this, html = '';
			var params = { 
				"token":"081b2b97ea13e0300ef60d77f720c262", 
				"serviceId":"B03_getPurchaseOrderInfo", 
				"secretNumber":"92db0bad3b1e25096b32b969aae3ee9f",
				"poId":"100001000000110",
				"companyId":"10000001", 
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
								+'<li><span>物流方式：</span><p>'+ infos.logisticsType +((infos.logisticsType.indexOf('自提')!=-1) ? '（自提点：'+ infos.address +'）':'')+'</p></li>'
								+'<li><span>收货地址：</span><p>'+ infos.address +'；<br>电话：'+ infos.mobile +'</p></li>'
								+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
								+'<li><span>支付方式：</span><p>'+ infos.paymentType +'</p></li>'
								+'<li><span>发票类型：</span><p>'+ infos.invoiceType +'</p></li>'
								+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
								+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'
                	}else{
                		$('.contarin').html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
                	}
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                	console.log('XMLHttpRequest.readyState: ' + XMLHttpRequest.readyState);
                	console.log('errorThrown: ' + errorThrown);
                	console.log('textStatus: ' + textStatus);
                }
			})
			return html;
		},
		start: function(){
			var that = this;
			document.getElementById('payInfoList').innerHTML = that.payInfo();
		}
	};

	module.exports = lists
	
});