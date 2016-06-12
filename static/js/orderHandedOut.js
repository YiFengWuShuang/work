var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var $platformCurrencyList;
var $currencySymbol;
var orderReviseInfoCon = $('#orderReviseInfoCon');
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var OrderHandedOut = function(){
	this.init();
}
OrderHandedOut.prototype = {
	init: function(){
		var that = this;
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		that.totals = 0;
		that.load = false;
		that.memberId = '';

		//查询枚举值
		requestFn("B03_POStatus",function(data){
			if(data.errorCode=='0'){
				that.POStatus = data.dataSet.data.detail;
			}
		});
		requestFn("B03_POVStatus",function(data){
			if(data.errorCode=='0'){
				that.POVNStatus = data.dataSet.data.detail;
			}
		});

		that.start();
		
	},
	//基础信息
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
            		that.orderInfo = data.purchaseOrderInfo;
            		that.memberId = that.orderInfo.vAuditid;
            		that.status = that.orderInfo.status;
					that.vStatus = that.orderInfo.vStatus;
            		html+= '<h2 class="m-title">基础信息</h2>'
						+'<div class="item-wrap">'
						+'	<ul>'
						+'		<li><span>订单单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						+'		<li><span>内部单号：</span><b>'+ that.orderInfo.poInsideNo +'</b></li>'
						+'		<li><span>供应商：</span>'+ that.orderInfo.vendorName +'</li>'
						+'		<li><span>交易币别：</span>'+ that.orderInfo.currencyName +'</li>'
						+'		<li><span>交易税别：</span>'+ that.orderInfo.taxName + '<label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
						+'		<li><span>采购员：</span>'+ that.orderInfo.poManName +'</li>'
						+'		<li><span>订单状态：</span><strong>'+ enumFn(that.POStatus,that.orderInfo.status) +'</strong></li>'
						+		((that.orderInfo.status==1||that.orderInfo.status==4||that.orderInfo.status==8)? '' : '<li><span>供应商答交状态：</span>'+ ((that.orderInfo.vStatus==3||that.orderInfo.vStatus==4||that.orderInfo.vStatus==5)?'已答交':enumFn(that.POVNStatus,that.orderInfo.vStatus)) +'</li>')
						+'	</ul>'
						+'</div>'
            	}
            }
		})
		return html;
	},
	// //附件
	// fileList: function(){
	// 	var that = this;
	// 	$.ajax({
	// 		type:"POST",
 //            url:config.serviceUrl,
 //            data: {//fileSource附件类型（1-客户，2-供应商)  searchType查询类型1单头2单身
 //            	"param": '{'+ that.tokens +',"serviceId":"B01_findFileList","companyId":"'+ _vParams.companyId +'","fileSource":1,"searchType":2,"id":"'+ _vParams.poId +'","docType":"10", "commonParam":'+ that.commonParam +'}'
 //            },
 //            success:function(data){
 //            	data = data || {};
 //            	if(data.success){
 //            		var file = data.fileList, len=file.length;
 //            		for(var i=0; i<len; i++){
 //            			if(file[i].fileName!=''){
 //            				$('.files').eq(i).html('<span>附件：</span><a href="'+ file[i].fileUrl +'"><i class=i-'+ (_reg.test(file[i].fileName) ? "image" : "word") +'></i>'+ file[i].fileName +'</a>').show();
 //            			}
 //            		}
 //            		that._files = file;
 //            	}
 //            }
	// 	})
	// },
	//产品明细
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
            		html = '<h2 class="m-title">产品明细</h2>';
            		for(var i=0, len=prodInfos.length; i<len; i++){
            			html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>物料编码：</span><b>'+ prodInfos[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ prodInfos[i].prodName + ' ' + prodInfos[i].prodDesc +'</p></li>'
							+'		<li><section><span>本方数量：</span>'+ prodInfos[i].purchaseQty + prodInfos[i].purchaseUnitName +'/'+ prodInfos[i].valuationQty + prodInfos[i].valuationUnitName +'</section><section><span>交期：</span>'+ prodInfos[i].expectedDelivery +'</section></li>'
						if(that.status==3){
							if(prodInfos[i].poSubLineInfo.length>0){
								for(var j=0, L=prodInfos[i].poSubLineInfo.length; j<L; j++){
									html+='<li class="response"><section><span>分批答交：</span>'+ prodInfos[i].poSubLineInfo[j].purchaseQty + prodInfos[i].poSubLineInfo[j].purchaseUnit +'/'+ prodInfos[i].poSubLineInfo[j].valuationQty + prodInfos[i].poSubLineInfo[j].valuationUnit +'</section><section><span>交期：</span>'+ prodInfos[i].poSubLineInfo[j].expectedDelivery +'</section></li>'
								}
							}else{
								html+=' <li class="response"><section><span><span>答交数量：</span>'+ prodInfos[i].vPurchaseQty + prodInfos[i].vAnswerUnitName +'/'+ prodInfos[i].vValuationQty + prodInfos[i].vValuationUnitName +'</section><section><span>交期：</span>'+ prodInfos[i].vExpectedDelivery +'</section></li>'							
							}

						}
						if(that.status==4){
							//待收货
							html+=' <li><span>累计发货：</span><p>'+ prodInfos[i].deliveryValuationQty + ' ' + prodInfos[i].valuationUnitName +'</p></li>'
								+'  <li><span>累计签收：</span><p>'+ prodInfos[i].receiveValuationQty + ' ' + prodInfos[i].valuationUnitName +'</p></li>'
								+'  <li><span>累计退货：</span><p>'+ prodInfos[i].returnValuationQty + ' ' + prodInfos[i].valuationUnitName +'</p></li>'
						}
						html+='		<li><span class="price">单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(prodInfos[i].taxPrice) : formatMoney(prodInfos[i].price)) +'/'+ prodInfos[i].valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ prodInfos[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal" data-total="'+ prodInfos[i].taxLineTotal +'" data-vTotal="'+ ((prodInfos[i].vTaxLineTotal!='') ? prodInfos[i].vTaxLineTotal : prodInfos[i].taxLineTotal) +'"><span>小计：</span><b>'+ $currencySymbol + formatMoney(prodInfos[i].taxLineTotal) +'</b></li>'
							+		((that.status==3)?'<li class="response changeLineTotal" data-changeTotal="'+ ((prodInfos[i].vTaxLineTotal=='')?0:prodInfos[i].vTaxLineTotal) +'"><span>答交金额：</span>'+ $currencySymbol + formatMoney(prodInfos[i].vTaxLineTotal) +'</li>':'')
							+'	</ul>'
							+'</div>'
						that.totals+=Number(prodInfos[i].taxLineTotal);
            		}
            		that.load = true;
            		setTimeout(function(){
	            		container.show();
						fnTip.hideLoading();
					},0);
            	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
            }
		})
		return html;
	},
	//其他费用
	otherCostList: function(){
		var that = this, html = '', subtotal = 0, resubtotal=0;
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
            		var costList = data.poOtherCostList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';
            		for(var i=0, len=costList.length; i<len; i++){
            			html+='<li><span>'+ costList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(costList[i].costAmount) +'</b>'+ ((that.status==4)? '' : '<b class="dj"><em class="money" data-money="'+ (costList[i].vCostAmount=='' ? costList[i].costAmount : costList[i].vCostAmount) +'">'+ (costList[i].vCostAmount=='' ? '' : formatMoney(costList[i].vCostAmount)) +'</em></b>')+'</li>';
            			subtotal += Number(costList[i].costAmount=='' ? 0 : costList[i].costAmount);
            			resubtotal += Number(costList[i].vCostAmount=='' ? costList[i].costAmount : costList[i].vCostAmount);
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(subtotal) +'</b></li>'
            		if(that.status!=4 && (that.vStatus==3||that.vStatus==4||that.vStatus==5)){
            			html+='<li id="changeCost" class="response changeLineTotal" data-changeTotal="'+ resubtotal +'"><span>变更费用：</span>'+ $currencySymbol + formatMoney(resubtotal) +'</li>'
            		}
            		html+='</ul>'
            			+'</div>';
            		$('#othersCost').html(html);
            		that.totals+=Number(subtotal,10);
            	}
            }
		})
		return html;
	},
	//变更后总金额计算
	reCostTotalFn: function(){
		var that = this,
			totals = 0;
		container.find('.changeLineTotal').each(function(){
			totals += Number($(this).attr('data-changeTotal'));
		})
		return totals;
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;
		//查询枚举值
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

		var html = '<ul class="payInfoList">'
			+'<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) +'</p></li>'
			+'<li><span>'+ ((infos.logisticsType=='3') ? '自提点':'收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>(收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +')</p></li>'
			+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
			+'<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
			+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
			+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'
			+'</ul>'
			+'<div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
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
				 +'</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
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
	start: function(){
		var that = this;
		
		$('#orderBaseInfo').html(that.orderBaseInfo());
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
		$('#prodListsInfo').html(that.prodsInfo());
		$('#otherCost').html(that.otherCostList());

		$('.item-total').html('订单总金额：'+$currencySymbol + formatMoney(that.orderInfo.cTotalAmount)).show();
		if(that.status!=1&&that.status!=2){
			$('.item-total-dj').html('供应商答交总金额：'+$currencySymbol+formatMoney(that.orderInfo.vTotalAmount)).show();
		}

		function purchase_change_add(changeType){
			return 'purchase_change_add.html?param={"changeType":"'+ changeType +'","poId":"'+ _vParams.poId +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
		}

		//通用底部
		if(that.load){
			//------------------待发布
			if(that.status==1){
				bottomBar(['share'],that.memberId,'','发布订单','取消订单');
			}

			//------------------采购待答交
			if(that.status==2){
				bottomBar(['share'],that.memberId,'','提醒答交','取消订单');
			}

			//------------------采购待确认
			if(that.status==3){
				if(that.vStatus==3||that.vStatus==4||that.vStatus==5){
					bottomBar(['share'],that.memberId,'','确认答交','取消订单');
				}
				if(that.vStatus==7){
					bottomBar(['share'],that.memberId,'','取消订单');
				}
			}

			//------------------待收货
			if(that.status==4){
				bottomBar(['share'],that.memberId,'','我要收货');
			}
		}

		//订单维护
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

		$body.on('click','.bottom-btn-confirm',function(){
			//------------------采购订单发布
			if(that.status==1){
				that.popup('confirm', '', '确定要发布订单吗？', '', function(){
					that.submitFn('B03_submitPurchaseOrder',function(){
						//转到待答交
						fnTip.success(2000,'发布成功');
						setTimeout(function(){window.location.reload(true);},2000);
					});					
				})

			}
			//------------------待答交，提醒答交
			if(that.status==2){
				that.submitFn('B03_poRemindAnswer',function(){
					that.popup('alert','','提醒成功');
				});
				return false;
			}
			//------------------待确认
			if(that.status==3){
				if(that.vStatus==7){
					//取消订单
					window.location.href=config.htmlUrl+purchase_change_add(2)
					return false;
				}
				window.location.href=config.htmlUrl+purchase_change_add(1)
				return false;
			}
			//------------------待收货
			if(that.status==4){
				//---》跳转至app收货单新建
				if(window.WebViewJavascriptBridge){
					window.WebViewJavascriptBridge.callHandler( "goodsReceive", {"param":that.orderInfo.poFormNo}, function(responseData) {});
				}
				return false;
			}
		})
		$body.on('click','.bottom-btn-cancel',function(){
			that.popup('confirm', '', '确定要取消订单吗？', function(){
				//不取消
			},function(){
				//确定取消
				//------------------待发布
				if(that.status==1){
					that.submitFn('B03_cancelPurchaseOrder',function(){
						fnTip.success(2000,'取消成功');
						setTimeout(function(){window.location.reload(true);},2000)
					});
					return false;
				}
				window.location.href=config.htmlUrl+purchase_change_add(2)
			})		
		})
	},
	submitFn: function(serviceId,callback){
		var that = this;
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
			data: {
            	"param": '{ '+ that.tokens +', "serviceId":"'+serviceId+'", "poId":"'+ _vParams.poId +'", "companyId":'+ _vParams.companyId +', "commonParam":'+ that.commonParam +' }'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
                	callback&&callback();
            	}else{
            		fnTip.error(2000);
            	}
            }
		})
	}
}