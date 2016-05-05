var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var OrderHandedOut = function(){
	this.init();
}
OrderHandedOut.prototype = {
	init: function(opts){
		var that = this;
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		that.totals = 0;
		that.load = false;

		that.start();

		$('.item-total').html('总金额：&yen; '+formatMoney(that.totals)).show();
		if(that.totals!=that.reCostTotalFn()){
			$('.item-total-dj').html('答交总金额：&yen; '+formatMoney(that.reCostTotalFn())).show();
		}
		
	},
	//基本信息
	orderBaseInfo: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data: {
		        "param": '{ '+ that.tokens +', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
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
            	}
            }
		})
		return html;
	},
	//附件
	fileList: function(){
		var that = this, reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
            	"param": '{'+ that.tokens +',"serviceId":"B01_findFileList","companyId":"'+ _vParams.companyId +'","fileSource":"1","searchType":"1","id":"'+ _vParams.id +'","docType":'+ _vParams.docType +'}'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var file = data.fileList, len=file.length;
            		for(var i=0; i<len; i++){
            			if(file[i].fileName!=''){
            				$('.files').eq(i).html('<span>附件：</span><a href="'+ file[i].fileUrl +'"><i class=i-'+ (reg.test(file[i].fileName) ? "image" : "word") +'></i>'+ file[i].fileName +'</a>').show();
            			}
            		}
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
            	"param": '{ '+ that.tokens +', "serviceId":"B03_findPoLineList", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
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
						html+='		<li><span class="price">单价：</span>&yen; '+ formatMoney(prodInfos[i].price) +'/个</li>'
							+'		<li><span>备注：</span><p>'+ prodInfos[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal" data-total="'+ prodInfos[i].taxLineTotal +'" data-vTotal="'+ ((prodInfos[i].vTaxLineTotal!='') ? prodInfos[i].vTaxLineTotal : prodInfos[i].taxLineTotal) +'"><span>小计：</span><b>&yen; '+ formatMoney(prodInfos[i].taxLineTotal) +'</b></li>'
							+		((prodInfos[i].vTaxLineTotal!='')?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+ formatMoney(poSubLineList[i].vTaxLineTotal) +'</li>':'')
							+'	</ul>'
							+'</div>'
						that.totals+=parseInt(prodInfos[i].taxLineTotal,10);
            		}
            		that.load = true;
            		setTimeout(function(){
	            		$('.contarin').show();
						fnTip.hideLoading();
					},0);
            	}else{
            		document.getElementById('prodListsInfo').innerHTML = '<p style="text-align:center;">'+ data.errorMsg +'</p>'
            	}
            }
		})
		return html;
	},
	//其他费用
	otherCostList: function(){
		var that = this, html = '', subtotal = 0, resubtotal=0, _responseCost=false;
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
			data: {
            	"param": '{"poId":"'+ _vParams.poId +'","companyId":"'+ _vParams.companyId +'","commonParam":'+ that.commonParam +',"serviceId":"B03_findPoOtherCostList",'+ that.tokens +'}'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var otherCostList = data.poOtherCostList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
            		for(var i=0, len=otherCostList.length; i<len; i++){
            			html+='<li><span>'+ otherCostList[i].costName +'：</span><b>&yen; '+ formatMoney(otherCostList[i].costAmount) +'</b></li>'
            			subtotal += parseInt(otherCostList[i].costAmount,10);
            			resubtotal += parseInt((otherCostList[i].vCostAmount=='' ? otherCostList[i].costAmount : otherCostList[i].vCostAmount),10);
            			if(otherCostList[i].vCostAmount!=''){
            				_responseCost = true;
            			}
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal" data-total="'+ subtotal +'" data-vTotal="'+ (_responseCost ? resubtotal : subtotal) +'"><span>小计：</span><b>&yen; '+ formatMoney(subtotal) +'</b></li>'
            		if(_responseCost){
            			html+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+ formatMoney(resubtotal) +'</li>'
            		}
            		html+='</ul></div>';
            		that.totals+=parseInt(subtotal,10);
            	}else{
            		console.log(data.errorMsg);
            	}
            }
		})
		return html;
	},
	reCostTotalFn: function(){
		var that = this,
			totals = 0;
		$('.contarin').find('.subtotal').each(function(){
			totals += parseInt($(this).attr('data-vtotal'),10);
		})
		return totals;
	},
	start: function(){
		var that = this;
		;
		var otherCost = document.getElementById('otherCost');
		if(orderBaseInfo){
			orderBaseInfo.innerHTML = that.orderBaseInfo();
		}
		if(prodListsInfo){
			prodListsInfo.innerHTML = that.prodsInfo();
		}
		if(otherCost&&that.load){
			otherCost.innerHTML = that.otherCostList();
		}
		if(that.load){
			that.fileList();
		}

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
            	"param": '{ '+ that.tokens +', "serviceId":"B03_submitPurchaseOrder", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
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
}