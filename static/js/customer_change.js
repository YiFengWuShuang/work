var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var $currencySymbol;
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
				that.changeReasons = data.dataSet.data.detail;
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
		requestFn("B03_POCNStatus",function(data){
			if(data.errorCode=='0'){
				that.POCNStatus = data.dataSet.data.detail;
			}
		});
		//发票信息
		requestFn("B02_Invoice",function(data){
			if(data.errorCode=='0'){
				that.invoiceInfoName = data.dataSet.data.detail;
			}
		});

		that.start();

	},
	orderBaseInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_getPocNoticeInfo", "companyId": _vParams.companyId, "id": _vParams.id, "commonParam": commonParam(),"token":_vParams.token, "secretNumber":_vParams.secretNumber}
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.pocNoticeInfo;
            		html +='<h2 class="m-title">变更信息</h2><div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>客户采购单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>内部销售单号：</span><b>'+ that.orderInfo.soInsideNo +'</b></li>'
						 +'		<li><span>变更单状态：</span><strong>'+ enumFn(that.POCNStatus,that.orderInfo.vStatus) +'</strong></li>'
						 +'		<li><span>变更类型：</span>'+ enumFn(that.changeType,that.orderInfo.changeType) +'</li>'
						 +'		<li><span>变更日期：</span>'+ transDate(that.orderInfo.pocFormDate) +'</li>'
						 +'		<li><span>变更人：</span>'+ that.orderInfo.pocManName +'</li>'
						 +'		<li><span>变更原因：</span>'+ enumFn(that.changeReasons,that.orderInfo.changeReason) +'</li>'
						 +'		<li><span>变更备注：</span>'+ that.orderInfo.remark +'</li>'
						 +'	</ul>'
						 +'</div>'

					//获取所有平台币种及小数位
					var CurrencyParam = {"serviceId":"B01_queryAllPlatformCurrency", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()};
					GetAJAXData('POST',CurrencyParam,function(unitdata){
						if(unitdata.success){
							$platformCurrencyList = unitdata;
							for(var i=0, l=unitdata.platformCurrencyList.length; i<l; i++){
								if(unitdata.platformCurrencyList[i].currencyCode == that.orderInfo.pCurrencyCode){
									$currencySymbol = unitdata.platformCurrencyList[i].currencySymbol;
									return false;
								}
							}
						}
					});
            	}
            }
		})
		return html;
	},
	prodBodyInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_findPocNoticeLineList","companyId":_vParams.companyId,"pocId":_vParams.id,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var lineList = data.pocNoticeLineList;
            		that._lineLists = lineList;
            		html = '<h2 class="m-title">采购明细</h2>';
            		for(var i=0, len=lineList.length; i<len; i++){
                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li class="prodCode"><span>物料编码：</span><b>'+ lineList[i].prodCode +'</b></li>'
							+'		<li><span>物料名称：</span><p>'+ lineList[i].prodName + ' ' +lineList[i].prodScale + ' ' +lineList[i].prodDesc +'</p></li>'
							+'		<li><section><span>数量：</span><em>'+ lineList[i].purchaseQty +'</em>'+ lineList[i].purchaseUnitName +'/<em>'+ lineList[i].valuationQty +'</em>'+ lineList[i].valuationUnitName +'</section><section><span>交期：</span><em>'+ transDate(lineList[i].expectedDelivery) +'</em></section></li>'
							+'		<li class="changeItem"><section><span>变更：</span><em>'+ lineList[i].changeQty +'</em>'+ lineList[i].purchaseUnitName +'/<em>'+ lineList[i].changeValuationQty +'</em>'+ lineList[i].valuationUnitName +'</section><section><span>交期：</span><em>'+ transDate(lineList[i].changeExpectedDelivery) +'</em></section></li>'
							+'		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax==1) ? formatMoney(lineList[i].taxPrice) : formatMoney(lineList[i].price)) +'/'+ lineList[i].valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ lineList[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].taxLineTotal) +'</b></li>'
							+'		<li class="changeItem changeLineTotal"><span>变更金额：</span>'+ $currencySymbol + formatMoney(lineList[i].changeTaxLineTotal) +'</li>'
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
		var that=this, html='';
		if(!that.load)return;
		var params = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B03_findPocNoticeOtherCostList", "companyId":_vParams.companyId,"pocId":_vParams.id, "commonParam":commonParam()};
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
            			html+='<li><span>'+ costList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(costList[i].costAmount) +'</b><b class="dj"><em class="money">'+ formatMoney(costList[i].changeCostAmount) +'</em></b></li>';
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.poOtherCostTotal) +'</b></li>'
            			+'<li id="changeCost" class="response changeLineTotal"><span>变更费用：</span>'+ $currencySymbol + formatMoney(that.orderInfo.otherCostTotal) +'</li>'
            			+'</ul>'
            			+'</div>';
            		$('#othersCost').html(html);
            	}
            }
		})
	},
	start: function(){
		var that = this;
		var orderHeadInfo = document.getElementById('orderHeadInfo');
		var prodBodyInfo = document.getElementById('prodBodyInfo');
		orderHeadInfo.innerHTML = that.orderBaseInfo();
		prodBodyInfo.innerHTML = that.prodBodyInfo();
		that.othersCost();
		$('.item-total').html('变更前总金额：'+$currencySymbol+formatMoney(that.orderInfo.poTotalAmount)).show();
		$('.item-total-dj').html('变更后总金额：'+$currencySymbol+formatMoney(that.orderInfo.totalAmount)).show();

		//通用底部
		//vStatus==2 待转销售变更
		if(that.orderInfo.vStatus==1){
			bottomBar(['share'],that.orderInfo.poManId,'','接受变更','拒绝变更');
		}else if(that.orderInfo.vStatus==2){
			bottomBar(['share'],that.orderInfo.poManId,'','转销售变更');
		}else{
			bottomBar(['share'],that.orderInfo.poManId,true);
		}

		//订单维护
		container.on('click','a.item-link',function(){
			var _this = $(this), name = _this.attr('name'), scrollTop = $body.scrollTop();
			switch(name){
				case 'baseInfo':
					orderReviseInfoCon.html(that.baseInfo(scrollTop));
					break;
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


		$body.on('click','.bottom-btn-confirm',function(){
			if(that.orderInfo.vStatus==1){
				that.receive();
				return;
			}
			if(that.orderInfo.vStatus==2){
				window.location.href=config.htmlUrl+'customerChange_returnSale.html?param={"id":"'+ _vParams.id +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
				return;
			}
		})
		$body.on('click','.bottom-btn-cancel',function(){
			that.refuse();	
		})
	},
	baseInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;
		var html = '<div class="item-wrap"><ul>'
				 +'		<li><span>采购日期：</span>'+ infos.poFormDate +'</li>'
				 +'		<li><span>交易币别：</span>'+ infos.currencyName +'</li>'
				 +'		<li><span>交易税别：</span>'+ infos.taxName +'<label class="checkbox'+ ((infos.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ infos.taxRate*100 +'%</label></li>'
				 +'		<li><span>交易条件：</span>'+ infos.conditionName +'</li>'
				 +'		<li><span>付款条件：</span>'+ infos.payWayName +'</li>'
				 +'		<li><span>采购员：</span>'+ infos.poManName +'</li>'
				 +'</ul></div><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>';
		return html;
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

		var html = '<div class="item-wrap"><ul>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) +'</p></li>'
			+'<li><span>'+ ((infos.logisticsType==3) ? '自提点' : '收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +'</p></li>'
		if(infos.invoice==1){
			html+='<li><span>发票信息：</span><p>'+ enumFn(that.invoiceInfoName,infos.invoice) +'</p></li>'
		}else{
			html+='<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
				+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
				+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'			
		}
		html+='</ul></div>'
			+'<div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>'
		return html;
	},
	remark: function(scrollTop){
		var that = this;
		var html = '<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">'
				 +'	<h2>补充条款：</h2>'
				 +'	<p>'+ that.orderInfo.agreeMent +'</p>'
				 +'</div>'
				 +'<div id="taRemarks" class="item-wrap taRemarks">'
				 +'	<h2>备注信息：</h2>'
				 +'	<p>'+ that.orderInfo.poRemark +'</p>'
				 +'</div>'
				 +'<div id="files" class="item-wrap attachment">'
				 +'	<h2>订单附件：</h2>'
				 +'</div>'
				 +'</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>'
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
	//拒绝变更
	refuse: function(){
		var that = this;
		that.popup('confirm', '', '您确定要拒绝变更么？<br>拒绝后的变更，将不能恢复。', function(){
			
		},function(){
			var param = {
                "serviceId": "B03_refusePocNotice",
                "pocId": _vParams.id,
                "companyId": that.orderInfo.vendorId,
                "commonParam": commonParam(),
                "token":_vParams.token,
                "secretNumber":_vParams.secretNumber
            };
            GetAJAXData('POST',param,function(data){
            	if(data.success){
            		popup('alert','','拒绝变更成功！返回上一级',function(){},function(){
            			//window.location.reload(true)
            			goBack();
            		});
            	}else{
            		popup('alert','',data.errorMsg);
            		return false;
            	}
            })		
		})
	},
	//接受变更
	receive: function(){
		var that = this;
		that.popup('confirm', '', '接受客户订单变更后，请即时更新本方的销售订单信息，并通知相关人员，以免发生交期延误哦！', function(){
			
		},function(){
			var param = {
                "serviceId": "B03_acceptPocNotice",
                "pocId": _vParams.id,
                "companyId": that.orderInfo.vendorId,
                "commonParam": commonParam(),
                "token":_vParams.token,
                "secretNumber":_vParams.secretNumber
            };
            GetAJAXData('POST',param,function(data){
            	if(data.success){
            		popup('alert','','接受变更成功！返回上一级',function(){},function(){
            			//window.location.reload(true)
            			goBack();
            		});
            	}else{
            		popup('alert','',data.errorMsg);
            		return false;
            	}
            })		
		})
	}
}



	
