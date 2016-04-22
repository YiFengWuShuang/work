define(function(require, exports, module){

	var order = {
		init: function(opts){
			this._files = [];

			//
			this.start();
		},
		//基本信息
		orderBaseInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"9b14aff650e129870793d4eabd944cb5", "serviceId":"B03_getPurchaseOrderInfo", "secretNumber":"f07e773c7c66c684f5c11a26225fa88e", "poId":"100001000000001", "companyId":"10000001", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } }'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var orderInfo = data.purchaseOrderInfo;
                		html += '<h2 class="m-title">基本信息</h2>'
							 +'<div class="item-wrap">'
							 +'	<ul>'
							 +'		<li><span>平台单号：</span><b>'+ orderInfo.poFormNo +'</b></li>'
							 +'		<li><span>内部单号：</span><b>'+ orderInfo.poInsideNo +'</b></li>'
							 +'		<li><span>供应商：</span>'+ orderInfo.vendorName +'</li>'
							 +'		<li><span>交易货币：</span>'+ orderInfo.currencyCode +'</li>'
							 +'		<li><span>交易税种：</span>'+ orderInfo.taxName + (orderInfo.isContainTax=='true' ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo.taxRate +'</label>' : '') + '</li>'
							 +'		<li><span>采购日期：</span>'+ orderInfo.poFormDate +'</li>'
							 +'	</ul>'
							 +'</div>'
                	}else{

                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
			return html;
		},
		//附件
		fileList: function(){
			var that = this;
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
                	"param": '{"secretNumber":"","token":"","serviceId":"B01_findFileList","companyId":"10000001","fileSource":"1","searchType":"1","id":"100001000000001","docType":"10"}'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var file = data.fileList;
                		for(var i=0, len=file.length; i<len; i++){
                			that._files.push(file[i]);
                		}
                	}else{

                	}
                }
			})
		},
		//产品信息
		prodsInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
                	"param": ' { "token":"97dd3f9c87b5b8b937392cb1f6048630", "secretNumber":"0b7619a54e80f9b5b8f96134b2ba9f6a", "serviceId":"B03_findPoLineList", "poId":"1014594958242712", "companyId":"10000001", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "sourceSystem":"1", "mobileModel":"1", "interfaceVersion":"1", "dataSource":"1" } }'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var prodInfos = data.poLineList;
                		html = '<h2 class="m-title">产品信息</h2>';
                		for(var i=0, len=prodInfos.length; i<len; i++){
                			html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li><span>物料编码：</span><b>'+ prodInfos[i].vProdCode +'</b></li>'
								+'		<li><span>物料详细：</span><p>'+ prodInfos[i].prodDesc +'</p></li>'
								+'		<li><section><span>数量：</span>'+ prodInfos[i].vValuationQty +'盒/'+ prodInfos[i].vPurchaseQty +'个</section><section><span>交期：</span>'+ prodInfos[i].vExpectedDelivery +'</section></li>'
								+'		<li><span class="price">单价：</span>&yen; '+ prodInfos[i].price +'/个</li>'
								+'		<li><span>备注：</span><p>'+ prodInfos[i].remark +'</p></li>'
								+		(!!that._files[i].fileUrl ? '<li><span>附件：</span><a href="'+ that._files[i].fileUrl +'"><i class="i-word"></i>'+ that._files[i].fileName +'</a></li>' : '')
								+'		<li><span>小计：</span><b>&yen; '+ prodInfos[i].taxLineTotal +'</b></li>'
								+'	</ul>'
								+'</div>'
                		}
                	}else{
                		document.getElementById('prodListsInfo').innerHTML = '<p style="text-align:center;">'+ data.errorMsg +'</p>'
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
			return html;
		},
		//其他费用
		otherCostList: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
				data: {
                	"param": '{"serviceId":"B03_findPoOtherCostList","companyId":"10000001","poId":"100001000000001","token":"123"}'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var otherCostList = data.poOtherCostList;
                		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
                		for(var i=0, len=otherCostList.length; i<len; i++){
                			html+='<li><span>'+ otherCostList[i].costName +'：</span><b>&yen; '+ otherCostList[i].costAmount +'.00</b></li>'
                		}
                		html+='</ul></div>';
                	}else{

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
			document.getElementById('orderBaseInfo').innerHTML = that.orderBaseInfo();
			that.fileList();
			document.getElementById('prodListsInfo').innerHTML = that.prodsInfo();
			document.getElementById('otherCost').innerHTML = that.otherCostList();
			$('.btn-wrap a').on('click',function(){
				that.submitFn();
			})
		},
		submitFn: function(){
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
				data: {
                	"param": '{ "secretNumber":"73ebfae88c1a85f61823ee1bf113d517", "token":"c65e091c8e7fc9a5c5e9dad31dbfdd9d", "serviceId":"B03_submitPurchaseOrder", "poId":"100001000000001", "companyId":"10000001", "commonParam":{ "mobileSysVersion":"", "sourcePage":"", "mobileModel":"", "sourceSystem":"", "interfaceVersion":"", "dataSource":"" } }'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
	                	fnTip.success(2000);
	                	//发放成功后跳转到某个页面
	                	setTimeout(window.location.href='#',2000);                		
                	}else{
                		fnTip.error(2000);
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
		}
	};

	module.exports = order
	
});