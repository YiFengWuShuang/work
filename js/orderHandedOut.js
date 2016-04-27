define(function(require, exports, module){
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
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
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"'+ _vParams.token +'", "serviceId":"B03_getPurchaseOrderInfo", "secretNumber":"'+ _vParams.secretNumber +'", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } }'
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
							 +'		<li><span>交易货币：</span>'+ orderInfo.currencyName +'</li>'
							 +'		<li><span>交易税种：</span>'+ orderInfo.taxName + (orderInfo.isContainTax===1 ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo.taxRate +'</label>' : '') + '</li>'
							 +'		<li><span>采购日期：</span>'+ transDate(orderInfo.poFormDate) +'</li>'
							 +'	</ul>'
							 +'</div>'
                	}else{

                	}
                }
			})
			return html;
		},
		//附件
		fileList: function(){
			var that = this;
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
                	"param": '{"secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'","serviceId":"B01_findFileList","companyId":"'+ _vParams.companyId +'","fileSource":"1","searchType":"1","id":"'+ _vParams.id +'","docType":'+ _vParams.docType +'}'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var file = data.fileList, len=file.length;
                		for(var i=0; i<len; i++){
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
                async: false,
                url:config.serviceUrl,
                data: {
                	"param": '{ "token":"'+ _vParams.token +'", "secretNumber":"'+ _vParams.secretNumber +'", "serviceId":"B03_findPoLineList", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "sourceSystem":"1", "mobileModel":"1", "interfaceVersion":"1", "dataSource":"1" } }'
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
							for(var j=0; j<prodInfos[i].poSubLineInfo.length; j++){
								html+='<li class="response"><section><span>数量：</span><em>'+ prodInfos[i].poSubLineInfo[j].purchaseQty +'</em>'+ prodInfos[i].poSubLineInfo[j].purchaseUnit +'/<em>'+ prodInfos[i].poSubLineInfo[j].valuationQty +'</em>'+ prodInfos[i].poSubLineInfo[j].valuationUnit +'</section><section><span>交期：</span><em>'+ prodInfos[i].poSubLineInfo[j].expectedDelivery +'</em></section></li>'
							}
							html+='		<li><span class="price">单价：</span>&yen; '+ formatMoney(prodInfos[i].price.toString()) +'/个</li>'
								+'		<li><span>备注：</span><p>'+ prodInfos[i].remark +'</p></li>'
								+		((that._files.length>0) ? '<li><span>附件：</span><a href="'+ that._files[i].fileUrl +'"><i class="i-word"></i>'+ that._files[i].fileName +'</a></li>' : '')
								+'		<li><span>小计：</span><b>&yen; '+ formatMoney(prodInfos[i].taxLineTotal.toString()) +'</b></li>'
								+		((prodInfos[i].vTaxLineTotal!='')?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+ formatMoney(poSubLineList[i].vTaxLineTotal.toString()) +'</li>':'')
								+'	</ul>'
								+'</div>'
                		}
                	}else{
                		document.getElementById('prodListsInfo').innerHTML = '<p style="text-align:center;">'+ data.errorMsg +'</p>'
                	}
                }
			})
			return html;
		},
		//其他费用
		otherCostList: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
				data: {
                	"param": '{"serviceId":"B03_findPoOtherCostList","companyId":"'+ _vParams.companyId +'","poId":"'+ _vParams.poId +'","token":"'+ _vParams.token +'"}'
                },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var otherCostList = data.poOtherCostList;
                		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
                		for(var i=0, len=otherCostList.length; i<len; i++){
                			html+='<li><span>'+ otherCostList[i].costName +'：</span><b>&yen; '+ formatMoney(otherCostList[i].costAmount) +'</b></li>'
                		}
                		html+='</ul></div>';
                	}else{

                	}
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
                async: false,
                url:config.serviceUrl,
				data: {
                	"param": '{ "secretNumber":"'+ _vParams.secretNumber +'", "token":"'+ _vParams.token +'", "serviceId":"B03_submitPurchaseOrder", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":{ "mobileSysVersion":"", "sourcePage":"", "mobileModel":"", "sourceSystem":"", "interfaceVersion":"", "dataSource":"" } }'
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
                }
			})
		}
	};

	module.exports = order
	
});