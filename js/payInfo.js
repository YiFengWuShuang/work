define(function(require, exports, module){
	var lists = {
		init: function(){
			this.start();
		},
		//支付信息
		payInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"aa8fba1ee3935545690938e3d8bcc9f8", "serviceId":"B03_getPurchaseOrderInfo", "secretNumber":"8cc2e27c71c619caa2e157baca466de9", "poId":"1014594958242712", "companyId":"10000001", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } }'
			    },
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
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
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