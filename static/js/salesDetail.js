/*
销售订单
*/
var container = $('.contarin');
var $platformCurrencyList;
var $currencySymbol = '';
var $priceDecimalNum = '';
var $amountDecimalNum = '';
var $fileData;
var orderReviseInfoCon = $('#orderReviseInfoCon');
var salesDetail = function(){
	this.init();
}
salesDetail.prototype = 
{
	init: function()
	{
		var that = this;
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		that.totals = 0;
		that.load = false;
		that.memberId = '';
		setTimeout(function(){
			container.show();
			fnTip.hideLoading();
		},0)
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
		//发票信息
		requestFn("B02_Invoice",function(data){
			if(data.errorCode=='0'){
				that.invoiceInfoName = data.dataSet.data.detail;
			}
		});
		that.orderBaseInfo();
		that.prodsInfo();
		that.otherCostList();
		that.start();
	},
	//基础信息
	orderBaseInfo: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
			async:false,
            url:config.serviceUrl,
            data: {
		        "param": '{ '+ that.tokens +', "serviceId":"B03_getSalesOrderInfo", "id":"'+ _vParams.id +'", "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.salesOrderInfo;
					$currencySymbol = that.orderInfo.currencySymbol;
					$priceDecimalNum = that.orderInfo.priceDecimalNum;
					$amountDecimalNum = that.orderInfo.amountDecimalNum;             		
            		that.status = that.orderInfo.status;
            		that.memberId = that.orderInfo.modibyid;
            		html += '<h2 class="m-title">基础信息</h2>'
						 +'<div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>销售单号：</span><b>'+ that.orderInfo.soFormNo +'</b></li>'
						 +'		<li><span>采购单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>内部单号：</span><b>'+ that.orderInfo.soInsideNo +'</b></li>'
						 +'		<li><span>销售日期：</span>'+ transDate(that.orderInfo.soFormDate) +'</li>'
						 +'		<li><span>交易币种：</span>'+ that.orderInfo.currencyCode + '-' + that.orderInfo.currencyName +'</li>'
						 +'		<li><span>交易税种：</span>'+ that.orderInfo.taxName + '<label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
						 +'		<li><span>交易条件：</span>'+ that.orderInfo.conditionName +'</li>'
						 +'		<li><span>收款条件：</span>'+ that.orderInfo.payWayName +'</li>'
						 +'		<li><span>业务员：</span>'+ that.orderInfo.soManName +'</li>'
						 +'	</ul>'
						 +'</div>'
					$('#orderBaseInfo').html(html);
            	}
            }
		})
	},
	//产品明细
	prodsInfo: function(){
		var that = this, html = '';
	    //加载单身附件
	    function getObFileList(line){
	        line.fileList = [];

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":12, "companyId":_vParams.companyId, "searchType":2, "id":line.id, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
				if(data.success){
					data.fileList.forEach(function(v){
	                    line.fileList.push({
	                        "id": v.id,
	                        "fileName":v.fileName,
	                        "fileSize":v.fileSize,
	                        "fileUrl": v.fileUrl,
	                        "lineNo": v.lineNo
	                    });
	                });
				}
			});	
	    }
		$.ajax({
			type:"POST",
			async:false,
            url:config.serviceUrl,
            data: {
            	"param": '{ '+ that.tokens +', "serviceId":"B03_findSoLineList", "soId":"'+ _vParams.id +'", "companyId":['+ Number(_vParams.companyId) +'], "commonParam":'+ that.commonParam +' }'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var prodInfos = data.prodDetailList;
            		html = '<h2 class="m-title">产品明细</h2>';
            		for(var i=0, len=prodInfos.length; i<len; i++){
            			var unitName = true;
						if(prodInfos[i].salesUnitName==prodInfos[i].valuationUnitName){
							unitName = false;
						}
            			html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>客户编码：</span><b>'+ prodInfos[i].cProdCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ prodInfos[i].cProdName +'  '+ prodInfos[i].cProdScale +'</p></li>'
							+'		<li><span>本方编码：</span><b>'+ prodInfos[i].vProdCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ prodInfos[i].vProdName +'  '+ prodInfos[i].vProdScale +'</p></li>'
							+'		<li><section><span>数量：</span>'+ prodInfos[i].salesQty + prodInfos[i].salesUnitName + ((unitName) ? ('/'+ prodInfos[i].valuationQty + prodInfos[i].valuationUnitName) : '') +'</section><section><span>预交期：</span>'+ transDate(prodInfos[i].expectedDelivery) +'</section></li>'
							+'		<li><span class="price">单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(prodInfos[i].taxPrice,$priceDecimalNum) : formatMoney(prodInfos[i].price,$priceDecimalNum)) +'/'+ prodInfos[i].valuationUnitName +'</li>'
							+'		<li><span>客户备注：</span><p>'+ prodInfos[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney((prodInfos[i].valuationQty*prodInfos[i].taxPrice),$amountDecimalNum) +'</b></li>'//bug解决后改回prodInfos[i].taxLineTotal
							+'	</ul>'
							+'</div>'
						that.totals+=parseFloat(prodInfos[i].taxLineTotal);
						getObFileList(prodInfos[i]);
            		}
            		that.load = true;
            		$('#prodListInfo').html(html);
            		prodInfos.forEach(function(line,idx){
						var fileHTML = '<p>'
						line.fileList.forEach(function(val){
							fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
						})
						fileHTML += '</p>'
						$('#prodListInfo').find('.files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
					})        
            	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
            }
		})
	},
	//其他费用
	otherCostList: function(){
		var that = this, html = '', subtotal = 0;
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
			data: {
            	"param": '{"soId":"'+ _vParams.id +'","companyId":['+ Number(_vParams.companyId) +'],"commonParam":'+ that.commonParam +',"serviceId":"B03_findSoOtherCostList",'+ that.tokens +'}'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var otherCostList = data.soOtherCostList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
            		for(var i=0, len=otherCostList.length; i<len; i++){
            			html+='<li><span>'+ otherCostList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(otherCostList[i].costAmount,$amountDecimalNum) +'</b></li>'
            			subtotal += parseFloat(otherCostList[i].costAmount);
            		}
            		html+='<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.vOtherCostTotal,$amountDecimalNum) +'</b></li>'
            		html+='</ul></div>';
            		that.totals+=parseFloat(subtotal);
            		$('#otherCost').html(html);
            	}
            }
		})
	},
	start: function(){
		var that = this;
		$('.item-total').html('订单总金额：'+$currencySymbol+formatMoney(that.orderInfo.vTotalAmount,$amountDecimalNum)).show();


		//单头附件
		var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":_vParams.companyId, "id":that.orderInfo.id, "commonParam":commonParam(), "docType":"12","searchType":1};//searchType查询类型1单头2单身
		GetAJAXData('POST',fileParam,function(fileData){
			if(fileData.success){
				$fileData = fileData;
			}
		})


		//通用底部
		if(that.load){
			//status 1：待出货，2：部分出货
			if(that.status==1||that.status==2){
				bottomBar([''],that.memberId,'','出货');
			}else{
				bottomBar(['share'],that.memberId,true);
			}
		}

		//点击分享
		var btn = document.getElementById('btn-share');
		btn.onclick = function(h){
			h=$('#orderBaseInfoCon').html()
			console.log(h)
			return h;
		}


		// console.log(btn)
		
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
			//跳转至出货单新建
			if(isAndroidMobileDevice() && window.WebViewJavascriptBridge){
				window.WebViewJavascriptBridge.callHandler( "goodsDelivery", {"param":that.orderInfo.soFormNo}, function(responseData) {});
			}else{
				setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler( "goodsDelivery", {"param":that.orderInfo.soFormNo}, function responseCallback(responseData) {})
				})				
			}
		})
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

		var html = '<ul class="payInfoList">'
			+'<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) + ((infos.logisticsType!=3)?'（物流商名称：'+ infos.logisticsName +'）':'') +'</p></li>'
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
				 +'	<h2>客户备注：</h2>'
				 +'	<p>'+ that.orderInfo.remark +'</p>'
				 +'</div>'
				 +'<div id="vRemarks" class="item-wrap taRemarks">'
				 +'	<h2>本方备注：</h2>'
				 +'	<p>'+ that.orderInfo.vRemark +'</p>'
				 +'</div>'				 
				 +'<div id="files" class="item-wrap attachment">'
				 +'	<h2>订单附件：</h2>'
		if($fileData.fileList.length==0){
			html+='<p><b>0个附件</b></p>'
		}
		for(var i=0; i<$fileData.fileList.length;i++){
			html+='<p><a href="'+ $fileData.fileList[i].fileUrl +'"><i class=i-'+ (_reg.test($fileData.fileList[i].fileName) ? "image" : "word") +'></i>'+ $fileData.fileList[i].fileName +'</a></p>'
		}
			html +='</div>'
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
	}
}

// console.log(h);