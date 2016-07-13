var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var $currencySymbol = '';
var $priceDecimalNum = '';
var $amountDecimalNum = '';
var Lists = function(){
	this.init();
}
Lists.prototype = {
	init: function(){
		var that = this;
		that._files = [];
		that._lineLists = [];
		that._othersCost = [];
		that.load = false;

		setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);
		//查询枚举值
		requestFn("B03_POCType",function(data){
			if(data.errorCode=='0'){
				that.changeType = data.dataSet.data.detail;
			}
		});
		requestFn("B03_POCReasonType",function(data){
			if(data.errorCode=='0'){
				that.reasonType = data.dataSet.data.detail;
			}
		});
		requestFn("B02_LogisticsType",function(data){
			if(data.errorCode=='0'){
				that.logisticsType = data.dataSet.data.detail;
			}
		});
		requestFn("B02_InvoiceType",function(data){
			if(data.errorCode=='0'){
				that.invoiceType = data.dataSet.data.detail;
			}
		});
		//发票信息
		requestFn("B02_Invoice",function(data){
			if(data.errorCode=='0'){
				that.invoiceInfoName = data.dataSet.data.detail;
			}
		});
		that.start();

		$('.item-total').html('变更前总金额：'+$currencySymbol+formatMoney(that.orderInfo.poTotalAmount,$amountDecimalNum)).show();
		$('.item-total-dj').html('变更后总金额：'+$currencySymbol+formatMoney(that.orderInfo.totalAmount,$amountDecimalNum)).show();

	},
	orderBaseInfo: function(){
		//id:销售变更单主键
		var that = this, html = '';
		var params = {"serviceId": "B03_getSocNoticeInfo", "companyId": _vParams.companyId, "id": _vParams.id, "commonParam": commonParam(),"token":_vParams.token, "secretNumber":_vParams.secretNumber}
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.socChange;
					$currencySymbol = that.orderInfo.currencySymbol;
					$priceDecimalNum = that.orderInfo.priceDecimalNum;
					$amountDecimalNum = that.orderInfo.amountDecimalNum;             		
            		html +='<h2 class="m-title">变更信息</h2><div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>内部销售单号：</span><b>'+ that.orderInfo.soInsideNo +'</b></li>'
						 +'		<li><span>内部变更单号：</span><b>'+ that.orderInfo.socFormNo +'</b></li>'
						 +'		<li><span>客户简称：</span>'+ that.orderInfo.companyAbbr +'</li>'
						 +'		<li><span>变更类型：</span>'+ enumFn(that.changeType,that.orderInfo.changeType) +'</li>'
						 +'		<li><span>变更日期：</span>'+ transDate(that.orderInfo.socFormDate) +'</li>'
						 +'		<li><span>变更原因：</span>'+ enumFn(that.reasonType,that.orderInfo.changeReason) +'</li>'
						 +'		<li><span>变更备注：</span>'+ that.orderInfo.remark +'</li>'
						 +'	</ul>'
						 +'</div>'
            	}
            }
		})
		return html;
	},
	prodBodyInfo: function(){
		//id:销售变更单主键
		var that = this, html = '';
		var params = {"serviceId": "B03_findSocNoticeLineList","companyId":_vParams.companyId,"id": _vParams.id,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var lineList = data.socChangeLine;
            		that._lineLists = lineList;
            		html = '<h2 class="m-title">销售明细</h2>';
            		for(var i=0, len=lineList.length; i<len; i++){
            			var unitName = true;
						if(lineList[i].saleUnitName==lineList[i].valuationUnitName){
							unitName = false;
						}           			
                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li class="prodCode"><span>物料编码：</span><b>'+ lineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ lineList[i].prodName + ' ' + lineList[i].prodScale +'</p></li>'
							+'		<li><section><span>数量：</span><em>'+ lineList[i].salesQty +'</em>'+ lineList[i].saleUnitName + ((unitName)?('/<em>'+ lineList[i].valuationQty +'</em>'+ lineList[i].valuationUnitName):'') +'</section><section><span>交期：</span><em>'+ transDate(lineList[i].expectedDelivery) +'</em></section></li>'
							+'		<li><section><span>变更后：</span><em>'+ lineList[i].changeQty +'</em>'+ lineList[i].saleUnitName + ((unitName)?('/<em>'+ lineList[i].changeValuationQty +'</em>'+ lineList[i].valuationUnitName):'') +'</section><section><span>交期：</span><em>'+ transDate(lineList[i].changeExpectedDelivery) +'</em></section></li>'
							+'		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax==1) ? formatMoney(lineList[i].taxPrice,$priceDecimalNum) : formatMoney(lineList[i].price,$priceDecimalNum)) +'/'+ lineList[i].valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ lineList[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="red"><span>含税小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].taxLineTotal,$amountDecimalNum) +'</b></li>'
							+		((lineList[i].changeTaxLineTotal!='') ? '<li class="red" data-changeTotal="'+ lineList[i].changeTaxLineTotal +'"><span>变更小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].changeTaxLineTotal,$amountDecimalNum) +'</b></li>':'')
							+'	</ul>'
							+'</div>'
            		}
            		that.load = true;
            	}else{
            		container.show().html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					fnTip.hideLoading();
            	}
            }
		})
		return html;
	},
	othersCost: function(){
		//socId:单头主键
		var that=this, html='';
		if(!that.load)return;
		var params = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B03_findSocNoticeOtherCostList", "companyId":_vParams.companyId,"socId":_vParams.id, "commonParam":commonParam()};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var costList = data.costList;
            		that._othersCost = costList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';
            		for(var i=0, len=costList.length; i<len; i++){
            			html+='<li><span>'+ costList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(costList[i].costAmount,$amountDecimalNum) +'</b><b class=""><em class="money">'+ formatMoney(costList[i].changeCostAmount,$amountDecimalNum) +'</em></b></li>';
            		}
            		html+='<li id="othersCostSubtotal" class="red"><span>小计：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.otherCostTotal,$amountDecimalNum) +'</b></li>'
            			+'<li id="changeCost" class="red"><span>变更费用：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.poOtherCostTotal,$amountDecimalNum) +'<b></li>'
            			+'</ul>'
            			+'</div>';
            		$('#othersCost').html(html);
            	}
            }
		})
	},
	initSelect3: function(el,options,currValue){
		$(el).select3({
		    allowClear: true,
		    items: options,
		    placeholder: '请选择',
		    showSearchInputInDropdown: false,
		    value: currValue
		});
	},
	start: function(){
		var that = this;
		var orderHeadInfo = document.getElementById('orderHeadInfo');
		var prodBodyInfo = document.getElementById('prodBodyInfo');
		orderHeadInfo.innerHTML = that.orderBaseInfo();
		prodBodyInfo.innerHTML = that.prodBodyInfo();
		that.othersCost();

		//通用底部
		bottomBar(['share'],that.orderInfo.socManPid,true);

		//窗口滑动
		container.on('click','a.item-link',function(){
			var _this = $(this), name = _this.attr('name'), scrollTop = $body.scrollTop();
			switch(name){
				case 'payInfo':
					orderReviseInfoCon.html(that.payInfo(scrollTop));
					break;
				case 'remark':
					orderReviseInfoCon.html(that.remark(scrollTop));
					break;
			}
			$body.scrollTop(0);
			container.addClass('contarinEdit');
			$('#jBottom').addClass('m-bottom-hide');
		}).on('click','.btn-wrap .btnB',function(){
			var _this = $(this), scrollTop = _this.attr('data-scrollTop');
			container.removeClass('contarinEdit');
			$('#jBottom').removeClass('m-bottom-hide');
			setTimeout(function(){$body.scrollTop(scrollTop)},200);
		})
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

		var html = '<ul class="payInfoList">'
			+'<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) +'</p></li>'
			+'<li><span>'+ ((infos.logisticsType==3) ? '自提点' : '收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +'</p></li>'
			+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
			if(infos.invoice==1){
				html+='<li><span>发票信息：</span><p>'+ enumFn(that.invoiceInfoName,infos.invoice) +'</p></li>'
			}else{
				html+='<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
					+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
					+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'			
			}
			html+='</ul>'
			+'<div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>'
		return html;
	},
	remark: function(scrollTop){
		var that = this;
		var html = '<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">'
				 +'	<h2>补充条款：</h2>'
				 +'	<p>'+ that.orderInfo.agreement +'</p>'
				 +'</div>'
				 +'<div id="taRemarks" class="item-wrap taRemarks">'
				 +'	<h2>备注信息：</h2>'
				 +'	<p>'+ that.orderInfo.remark +'</p>'
				 +'</div>'
				 +'<div id="files" class="item-wrap attachment">'
				 +'	<h2>订单附件：</h2>'

			html +='</div>'
				 +'</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>'
		return html;
	}
}



	
