/**
 * 采购变更转销售变更
 */
var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var privateDefultUser;
var $scope = {};
var $platformCurrencyList;
var $currencySymbol = '';//币种符号
var $priceDecimalNum = '';//单价小数位
var $amountDecimalNum = '';//金额小数位
var $fileListData1;
var $logisticsType = {};
var $change = {};

//本方附件信息-来源于销售订单接口
$scope.sc_files = [];

var returnSale = function(){
	this.init();
}
returnSale.prototype = {
	init: function(){
		var that = this;
		that.changeReason = [];
		that.load = false;
        setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);
		//查询枚举值
		//变更类型名称
		requestFn("B03_POCType",function(data){
			if(data.errorCode=='0'){
				that.changeTypeList = data.dataSet.data.detail;
			}
		});
		//枚举，变更原因
		requestFn("B03_POCReasonType",function(data){
			if(data.errorCode=='0'){
				that.reasonType = data.dataSet.data.detail, L = that.reasonType.length;
				that.reasonType.forEach(function(item){
					that.changeReason.push(item.Value)
				})
			}
		});
		requestFn("B02_LogisticsType",function(data){
			if(data.errorCode=='0'){
				that.logisticsType = data.dataSet.data.detail;
				$scope.logisticsType = [];
				that.logisticsType.forEach(function(val){
					$scope.logisticsType.push(val.Value);
				})
			}
		});
		//发票信息
		requestFn("B02_Invoice",function(data){
			if(data.errorCode=='0'){
				that.invoiceInfoName = data.dataSet.data.detail;
			}
		});
		requestFn("B02_InvoiceType",function(data){
			if(data.errorCode=='0'){
				that.invoiceType = data.dataSet.data.detail;
			}
		});

		// 获取用户信息
		GetUserInfo("POST",{"token":_vParams.token,"secretNumber":_vParams.secretNumber},function(response){
			if(response.retCode == '01230'){
				privateDefultUser = response;
			}
		})
		that.start();
	},
	start: function(){
		var that = this, success = true;

		//客户变更单头
		var param1 = {"serviceId":"B03_getPocNoticeInfo", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"id":_vParams.id,"companyId":_vParams.companyId};
		GetAJAXData('POST',param1,function(data){
			if(data.success){
				success = true;
				$scope.pocNoticeInfo = data.pocNoticeInfo;
				$currencySymbol = $scope.pocNoticeInfo.currencySymbol;
				$priceDecimalNum = $scope.pocNoticeInfo.priceDecimalNum;
				$amountDecimalNum = $scope.pocNoticeInfo.amountDecimalNum;				
				var html = '';
        		html +='<h2 class="m-title">变更信息</h2><div class="item-wrap">'
					 +'	<ul>'
					 +'		<li><span>所属公司：</span><p>'+ $scope.pocNoticeInfo.vendorName +'</p></li>'
					 +'		<li><span>客户：</span><p>'+ $scope.pocNoticeInfo.companyName +'</p></li>'
					 +'		<li><span>销售单号：</span>'+ $scope.pocNoticeInfo.soFormNo +'</li>'
					 +'		<li><span>内部销售单号：</span>'+ $scope.pocNoticeInfo.soInsideNo +'</li>'
					 +'		<li><span>变更类型：</span>'+ enumFn(that.changeTypeList,$scope.pocNoticeInfo.changeType) +'</li>'
					 +'		<li><span>变更日期：</span>'+ transDate($scope.pocNoticeInfo.pocFormDate) +'</li>'
					 +'	</ul>'
					 +'</div>'
				$('#orderChangeInfo').html(html);

				//物流方式 默认值
		        $logisticsType.currValue = enumFn(that.logisticsType,$scope.pocNoticeInfo.logisticsType)
		        $logisticsType.logisticsType = $scope.pocNoticeInfo.logisticsType;

		        //变更原因及说明 默认值
		        $change.changeReason = $scope.pocNoticeInfo.changeReason;
		        $change.changeRemark = $scope.pocNoticeInfo.remark;
		        $change.changeReasonVal = enumFn(that.reasonType,$change.changeReason);
			}else{
				container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
				success = false;
			}
		});
		
		if(!success)return;

		//销售单单头信息
		var param2 = {"serviceId":"B03_getSalesOrderInfo", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"id":$scope.pocNoticeInfo.soId,"companyId":_vParams.companyId};
		GetAJAXData('POST',param2,function(data){
			if(data.success){
				$scope.orderInfo = data.salesOrderInfo;
				var html = '';
        		html +='<h2 class="m-title">基础信息</h2><div class="item-wrap">'
					 +'	<ul>'
					 +'		<li><span>销售日期：</span><p>'+ transDate($scope.orderInfo.soFormDate) +'</p></li>'
					 +'		<li><span>交易币别：</span><p>'+ $scope.orderInfo.currencyName +'</p></li>'
					 +'		<li><pan>交易税别：</span>'+ $scope.orderInfo.taxName +'<label class="checkbox'+ (($scope.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ $scope.orderInfo.taxRate*100 +'%</label></li>'
					 +'		<li><span>交易条件：</span>'+ $scope.orderInfo.conditionName +'</li>'
					 +'		<li><span>收款条件：</span>'+ $scope.orderInfo.payWayName +'</li>'
					 +'		<li><span>业务员：</span>'+ $scope.orderInfo.soManName +'</li>'
					 +'	</ul>'
					 +'</div>'
				$('#orderHeadInfo').html(html);
			}
		});

		//客户变更单身
		var param3 = {"serviceId":"B03_findPocNoticeLineList", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"pocId":$scope.pocNoticeInfo.id.toString(),"companyId":_vParams.companyId,"commonParam":commonParam()};
		GetAJAXData('POST',param3,function(data){
			if(data.success){
				$scope.lineList = data.pocNoticeLineList;
				var html = '';
        		html +='<h2 class="m-title">产品明细</h2>'
        		$scope.lineList.forEach(function(val){
        			val.unitName = true;
					if(val.purchaseUnitName==val.valuationUnitName){
						val.unitName = false;
					}         			
        			html+='<div class="item-wrap"><ul>'
        			+'<li><span>产品编号：</span>'+val.prodCode+'</li>'
        			+'<li><span>产品名称：</span>'+val.prodName+' '+ val.prodScale +'</li>'
        			+'<li><section><span>采购数量：</span><em>'+ val.purchaseQty +'</em>'+ val.purchaseUnitName + (val.unitName?('/<em>'+ val.valuationQty +'</em>'+ val.valuationUnitName):'') +'</section><section><span>预交期：</span><em>'+ transDate(val.expectedDelivery) +'</em></section></li>'
        			+'<li class="changeItem"><section><span>变更后：</span><em>'+ val.changeQty +'</em>'+ val.purchaseUnitName + (val.unitName?('/<em>'+ val.changeValuationQty +'</em>'+ val.valuationUnitName):'') +'</section><section><span>预交期：</span><em>'+ transDate(val.changeExpectedDelivery) +'</em></section></li>'
        			+'<li><span>单价：</span>'+ $currencySymbol + (($scope.orderInfo.isContainTax==1) ? formatMoney(val.taxPrice,$priceDecimalNum) : formatMoney(val.price,$priceDecimalNum)) +'/'+ val.valuationUnitName +'</li>'
        			+'<li class="changeItem"><span>变更单价：</span>'+ $currencySymbol + (($scope.orderInfo.isContainTax==1) ? formatMoney(val.changeTaxPrice,$priceDecimalNum) : formatMoney(val.changePrice,$priceDecimalNum)) +'/'+ val.valuationUnitName +'</li>'
        			+'<li><span>小计：</span>'+ $currencySymbol + formatMoney(val.taxLineTotal,$amountDecimalNum)+'</li>'
        			+'<li class="changeItem"><span>变更小计：</span>'+ $currencySymbol + formatMoney(val.changeTaxLineTotal,$amountDecimalNum)+'</li>'
        			+'</ul></div>'

        			f_init_l_file(val);
        		})
				html +='</div>'
				$('#prodBodyInfo').html(html);
			}
		},false);


		//其他费用
		var param4 = {"serviceId":"B03_findPocNoticeOtherCostList", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"pocId":$scope.pocNoticeInfo.id.toString(),"companyId":_vParams.companyId,"commonParam":commonParam()};
		GetAJAXData('POST',param4,function(data){
			if(data.success){
				$scope.costList = data.costList;
				var html = '';
        		html +='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>'
        		$scope.costList.forEach(function(val){
        			html+='<li><span>'+ val.costName +'：</span><b>'+ $currencySymbol + formatMoney(val.costAmount,$amountDecimalNum) +'</b><b class="dj"><em class="money">'+ formatMoney(val.changeCostAmount,$amountDecimalNum) +'</em></b></li>'
        		})
        		html+='<li id="othersCostSubtotal" class="subtotal"><span>变更前：</span><b>'+ $currencySymbol + formatMoney($scope.pocNoticeInfo.poOtherCostTotal,$amountDecimalNum) +'</b></li>'
        			+'<li id="changeCost" class="response changeLineTotal"><span>变更后：</span>'+ $currencySymbol + formatMoney($scope.pocNoticeInfo.otherCostTotal,$amountDecimalNum) +'</li>'
					+'</ul></div></div>'
				$('#othersCost').html(html);
			}
		});

		$('.item-total').html('变更前订单总金额：'+$currencySymbol+formatMoney($scope.pocNoticeInfo.poTotalAmount,$amountDecimalNum)).show();
		$('.item-total-dj').html('变更后订单总金额：'+$currencySymbol+formatMoney($scope.pocNoticeInfo.totalAmount,$amountDecimalNum)).show();



		function initSelect3(el,options,currValue){
			$(el).select3({
			    allowClear: true,
			    items: options,
			    placeholder: '请选择',
			    showSearchInputInDropdown: false,
			    value: currValue
			});
		}

		function changeCause(scrollTop){
			return '<div class="m-item m-item-select">'
					+'	<h2 class="m-title">变更原因：</h2>'
					+'	<div id="changeCause" class="select3-input"></div>'
					+'</div>'
					+'<div class="m-item">'
					+'	<h2 class="m-title">变更说明：</h2>'
					+'	<div class="item-wrap int-remarks">'
					+'		<textarea name="" id="intRemarks" placeholder="变更说明"></textarea>'
					+'	</div>'
					+'</div>'
					+'<div class="btn-wrap">'
					+'	<a href="javascript:;" id="saveChangeCause" class="btnB">完成</a>'	
					+'</div>'
		}

		function payInfo(scrollTop){
			var html='<div id="rePayInfoList" class="m-item">'
					+'	<div class="item-wrap">'
					+'		<section class="clearfix">'
					+'			<span class="c-label">物流方式：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ enumFn(that.logisticsType,$scope.pocNoticeInfo.logisticsType) +'</p>'
					+'			</div>'
					+'		</section>'
					+'		<section id="address" class="clearfix">'
					+'			<span class="c-label">'+ (($logisticsType.logisticsType==3) ? '自提点' : '收货地址') +'：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ $scope.pocNoticeInfo.provinceName + $scope.pocNoticeInfo.cityName + $scope.pocNoticeInfo.districtName + $scope.pocNoticeInfo.address + '<br>收货人：'+ $scope.pocNoticeInfo.contactPerson +'，电话：'+ $scope.pocNoticeInfo.mobile +'</p>'
					+'			</div>'
					+'		</section>'
			if($scope.pocNoticeInfo.invoice==1){
				html+='		<section class="clearfix">'
					+'			<span class="c-label">发票信息：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ enumFn(that.invoiceInfoName,$scope.pocNoticeInfo.invoice) +'</p>'
					+'			</div>'					
					+'		</section>'
			}else{
				html+='		<section class="clearfix">'
					+'			<span class="c-label">发票类型：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ enumFn(that.invoiceType,$scope.pocNoticeInfo.invoiceType) +'</p>'
					+'			</div>'
					+'		</section>'
					+'		<section class="clearfix">'
					+'			<span class="c-label">开票抬头：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ $scope.pocNoticeInfo.invoiceHeader +'</p>'
					+'			</div>'					
					+'		</section>'
					+'		<section class="clearfix">'
					+'			<span class="c-label">发票内容：</span>'
					+'			<div class="c-cont">'
					+'				<p class="c-txt">'+ $scope.pocNoticeInfo.invoiceContent +'</p>'
					+'			</div>'					
					+'		</section>'			
			}
			html+='</div></div><div class="btn-wrap"><a href="javascript:;" id="savePayInfo" class="btnB" data-scrollTop="'+scrollTop+'">返回</a></div>'
			return html;
		}

		function remark(scrollTop){
			var html = '<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">'
					 +'	<h2>补充条款：</h2>'
					 +'	<p>'+ $scope.pocNoticeInfo.agreeMent +'</p>'
					 +'</div>'
					 +'<div id="taRemarks" class="item-wrap taRemarks">'
					 +'	<h2>客户备注：</h2>'
					 +'	<p>'+ $change.changeRemark +'</p>'
					 +'</div>'
					 +'<div class="item-wrap">'
					 +'	<h2>本方备注：</h2>'
					 +'	<p>'+ $change.changeRemark +'</p>'
					 +'</div>'				 
					 +'</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
			return html;
		}

		//订单信息查看&修改
		container.on('click','span.edit, a.item-link',function(){
			var _this = $(this), name = _this.attr('name'), scrollTop = $body.scrollTop();
			switch(name){
				case 'changeCause':
					orderReviseInfoCon.html(changeCause());
					initSelect3('#changeCause',that.changeReason,$change.changeReasonVal);
					$('#intRemarks').val($change.changeRemark);
					break;
				case 'payInfo':
					orderReviseInfoCon.html(payInfo(scrollTop));
					initSelect3('#logisticsType',$scope.logisticsType,$logisticsType.currValue);
					break;
				case 'remark':
					orderReviseInfoCon.html(remark(scrollTop));
					break;
			}
			$body.scrollTop(0);
			container.addClass('contarinEdit');
			$('#jBottom').addClass('m-bottom-hide');
		}).on('click','.btn-wrap .btnB',function(){
			var _this = $(this), scrollTop = _this.attr('data-scrollTop');

			if(_this.is('#saveChangeCause')){
				var changeCauseSelect3 = $('#changeCause').select3('value') || '';
				if(changeCauseSelect3){
					$change.changeReason = reEnumFn(that.reasonType,changeCauseSelect3);
					$change.changeReasonVal = changeCauseSelect3;
				}
				$change.changeRemark = $('#intRemarks').val();
			}

			if(_this.is('#savePayInfo')){
				var logisticsTypeSelect3 = $('#logisticsType').select3('value') || '';
				if(logisticsTypeSelect3){
					$logisticsType.currValue = logisticsTypeSelect3;
		        	$logisticsType.logisticsType = Number(reEnumFn(that.logisticsType,logisticsTypeSelect3));
				}
			}

			if(_this.is('#saveRemark')){
				
			}

			container.removeClass('contarinEdit');
			$('#jBottom').removeClass('m-bottom-hide');
			setTimeout(function(){$body.scrollTop(scrollTop)},200);
		})

		bottomBar(['share'],$scope.pocNoticeInfo.pocManId,'','确定转销售变更');

		//销售单单头附件信息
        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":12, "companyId":$scope.pocNoticeInfo.vendorId, "searchType":1, "id":$scope.pocNoticeInfo.soId, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
			if(data.success){
				data.fileList.forEach(function(v){
                    $scope.sc_files.push({
                        "id": v.id,
                        "fileName":v.fileName,
                        "fileSize":v.fileSize,
                        "fileUrl": v.fileUrl,
                        "lineNo": v.lineNo
                    });
                });
			}
		});			

	    //客户采购订单变更单转销售变更单
	    function f_return_sale(){

	        var param_return_sale = {"soChangeInfo":{}};
	        //公司信息
	        param_return_sale.soChangeInfo.companyId = $scope.pocNoticeInfo.companyId;
	        param_return_sale.soChangeInfo.companyCode = $scope.pocNoticeInfo.companyCode;
	        param_return_sale.soChangeInfo.companyName = $scope.pocNoticeInfo.companyName;
	        param_return_sale.soChangeInfo.companyAbbr = $scope.pocNoticeInfo.companyAbbr;

	        //vendor 信息
	        param_return_sale.soChangeInfo.vendorId = $scope.pocNoticeInfo.vendorId;
	        param_return_sale.soChangeInfo.vendorCode = $scope.pocNoticeInfo.vendorCode;
	        param_return_sale.soChangeInfo.vendorName = $scope.pocNoticeInfo.vendorName;
	        param_return_sale.soChangeInfo.vendorAbbr = $scope.pocNoticeInfo.vendorAbbr;

	        //业务员信息
	        param_return_sale.soChangeInfo.soManId = $scope.pocNoticeInfo.poManId;
	        param_return_sale.soChangeInfo.soManCode = $scope.pocNoticeInfo.poManCode;
	        param_return_sale.soChangeInfo.soManName = $scope.pocNoticeInfo.poManName;
	        param_return_sale.soChangeInfo.soManPid = $scope.pocNoticeInfo.poManPid;

	        param_return_sale.soChangeInfo.socManId = $scope.pocNoticeInfo.pocManId;
	        param_return_sale.soChangeInfo.socManCode = $scope.pocNoticeInfo.pocManCode;
	        param_return_sale.soChangeInfo.socManName = $scope.pocNoticeInfo.pocManName;
	        param_return_sale.soChangeInfo.socManPid = $scope.pocNoticeInfo.pocManPid;

	        //币种信息
	        param_return_sale.soChangeInfo.pCurrencyCode = $scope.pocNoticeInfo.pCurrencyCode;
	        param_return_sale.soChangeInfo.pCurrencyName = $scope.pocNoticeInfo.pCurrencyName;
	        param_return_sale.soChangeInfo.currencyId = $scope.pocNoticeInfo.currencyId;
	        param_return_sale.soChangeInfo.currencyCode = $scope.pocNoticeInfo.currencyCode;
	        param_return_sale.soChangeInfo.currencyName = $scope.pocNoticeInfo.currencyName;
	        param_return_sale.soChangeInfo.localCurrencyId = $scope.pocNoticeInfo.localCurrencyId;
	        param_return_sale.soChangeInfo.localCurrencyCode = $scope.pocNoticeInfo.localCurrencyCode;
	        param_return_sale.soChangeInfo.localCurrencyName = $scope.pocNoticeInfo.localCurrencyName;

	        //税种信息
	        param_return_sale.soChangeInfo.exchangeRate = $scope.pocNoticeInfo.exchangeRate;
	        param_return_sale.soChangeInfo.taxId = $scope.pocNoticeInfo.taxId;
	        param_return_sale.soChangeInfo.taxCode = $scope.pocNoticeInfo.taxCode;
	        param_return_sale.soChangeInfo.taxName = $scope.pocNoticeInfo.taxName;
	        param_return_sale.soChangeInfo.isContainTax = $scope.pocNoticeInfo.isContainTax;
	        param_return_sale.soChangeInfo.taxRate = $scope.pocNoticeInfo.taxRate;

	        //交易条件信息
	        param_return_sale.soChangeInfo.conditionId = $scope.pocNoticeInfo.conditionId;
	        param_return_sale.soChangeInfo.conditionCode = $scope.pocNoticeInfo.conditionCode;
	        param_return_sale.soChangeInfo.conditionName = $scope.pocNoticeInfo.conditionName;

	        //付款条件信息
	        param_return_sale.soChangeInfo.payWayId = $scope.pocNoticeInfo.payWayId;
	        param_return_sale.soChangeInfo.payWayCode = $scope.pocNoticeInfo.payWayCode;
	        param_return_sale.soChangeInfo.payWayName = $scope.pocNoticeInfo.payWayName;
	        param_return_sale.soChangeInfo.payMentType = $scope.pocNoticeInfo.payMentType;

	        //物流信息
	        param_return_sale.soChangeInfo.logisticsType = $logisticsType.logisticsType;
	        param_return_sale.soChangeInfo.logisticsCode = $scope.pocNoticeInfo.logisticsCode;
	        param_return_sale.soChangeInfo.logisticsName = $scope.pocNoticeInfo.logisticsName;

	        //费用信息
	        param_return_sale.soChangeInfo.poTotalAmount = $scope.pocNoticeInfo.poTotalAmount;
	        param_return_sale.soChangeInfo.poTotal = $scope.pocNoticeInfo.poTotal;
	        param_return_sale.soChangeInfo.poTaxTotal = $scope.pocNoticeInfo.poTaxTotal;
	        param_return_sale.soChangeInfo.poOtherCostTotal = $scope.pocNoticeInfo.poOtherCostTotal;
	        param_return_sale.soChangeInfo.total = $scope.pocNoticeInfo.total;
	        param_return_sale.soChangeInfo.taxTotal = $scope.pocNoticeInfo.taxTotal;
	        param_return_sale.soChangeInfo.totalAmount = $scope.pocNoticeInfo.totalAmount;
	        param_return_sale.soChangeInfo.otherCostTotal = $scope.pocNoticeInfo.otherCostTotal;

	        //地址信息
	        param_return_sale.soChangeInfo.addressId = $scope.pocNoticeInfo.addressId;
	        param_return_sale.soChangeInfo.countryCode = $scope.pocNoticeInfo.countryCode;
	        param_return_sale.soChangeInfo.countryName = $scope.pocNoticeInfo.countryName;
	        param_return_sale.soChangeInfo.provinceCode = $scope.pocNoticeInfo.provinceCode;
	        param_return_sale.soChangeInfo.provinceName = $scope.pocNoticeInfo.provinceName;
	        param_return_sale.soChangeInfo.cityCode = $scope.pocNoticeInfo.cityCode;
	        param_return_sale.soChangeInfo.cityName = $scope.pocNoticeInfo.cityName;
	        param_return_sale.soChangeInfo.districtCode = $scope.pocNoticeInfo.districtCode;
	        param_return_sale.soChangeInfo.districtName = $scope.pocNoticeInfo.districtName;
	        param_return_sale.soChangeInfo.address = $scope.pocNoticeInfo.address;
	        param_return_sale.soChangeInfo.contactPerson = $scope.pocNoticeInfo.contactPerson;
	        param_return_sale.soChangeInfo.mobile = $scope.pocNoticeInfo.mobile;
	        param_return_sale.soChangeInfo.insideAddressCode = $scope.pocNoticeInfo.insideAddressCode;
	        param_return_sale.soChangeInfo.invId = $scope.pocNoticeInfo.invId;
	        param_return_sale.soChangeInfo.invCode = $scope.pocNoticeInfo.invCode;
	        param_return_sale.soChangeInfo.invName = $scope.pocNoticeInfo.invName;

	        //发票信息
	        param_return_sale.soChangeInfo.invoiceType = $scope.pocNoticeInfo.invoiceType;
	        param_return_sale.soChangeInfo.invoiceHeader = $scope.pocNoticeInfo.invoiceHeader;
	        param_return_sale.soChangeInfo.invoicePayMark = $scope.pocNoticeInfo.invoicePayMark;
	        param_return_sale.soChangeInfo.invoiceContent = $scope.pocNoticeInfo.invoiceContent;
	        param_return_sale.soChangeInfo.invoice = $scope.pocNoticeInfo.invoice;
	        param_return_sale.soChangeInfo.invoiceName = $scope.pocNoticeInfo.invoiceName;
	        param_return_sale.soChangeInfo.invoiceTel = $scope.pocNoticeInfo.invoiceTel;
	        param_return_sale.soChangeInfo.invoiceAddress = $scope.pocNoticeInfo.invoiceAddress;
	        param_return_sale.soChangeInfo.invoiceBank = $scope.pocNoticeInfo.invoiceBank;
	        param_return_sale.soChangeInfo.invoiceAccount = $scope.pocNoticeInfo.invoiceAccount;

	        //单号信息
	        param_return_sale.soChangeInfo.soId = $scope.orderInfo.id;//销售订单主键
	        param_return_sale.soChangeInfo.soFormNo = $scope.orderInfo.soFormNo;//销售订单单号
	        param_return_sale.soChangeInfo.soInsideNo = $scope.orderInfo.soInsideNo;//销售订单内部单号
	        param_return_sale.soChangeInfo.soFormDateStr = $scope.orderInfo.soFormDate;//销售日期

	        param_return_sale.soChangeInfo.socInsideNo = $scope.orderInfo.soInsideNo;//销售变更单内部单号
	        param_return_sale.soChangeInfo.socFormDateStr = $scope.pocNoticeInfo.pocFormDate;//销售变更日期

	        param_return_sale.soChangeInfo.pocId = $scope.pocNoticeInfo.id.toString();//采购变更单主键
	        param_return_sale.soChangeInfo.pocFormNo = $scope.pocNoticeInfo.pocFormNo;//采购变更单单号（已完成）
	        param_return_sale.soChangeInfo.pocInsideNo = $scope.pocNoticeInfo.pocInsideNo;//*采购变更单内部单号

	        param_return_sale.soChangeInfo.changeReason = $change.changeReason || 5;
	        param_return_sale.soChangeInfo.agreeMent = $scope.pocNoticeInfo.agreeMent;
	        param_return_sale.soChangeInfo.status = 2;
	        param_return_sale.soChangeInfo.billStatus = 1;

	        param_return_sale.soChangeInfo.cRemark = $scope.pocNoticeInfo.poRemark;//客户备注
	        param_return_sale.soChangeInfo.vRemark = $scope.pocNoticeInfo.remark;//本方备注
	        param_return_sale.soChangeInfo.remark = $change.changeRemark;

	        //新增
	        param_return_sale.soChangeInfo.currencySymbol = $scope.pocNoticeInfo.currencySymbol;
	        param_return_sale.soChangeInfo.priceDecimalNum = $scope.pocNoticeInfo.priceDecimalNum;
	        param_return_sale.soChangeInfo.amountDecimalNum = $scope.pocNoticeInfo.amountDecimalNum;

	        //变更类型
	        param_return_sale.soChangeInfo.changeType = $scope.pocNoticeInfo.changeType;

	        //单身列表
	        param_return_sale.soChangeInfo.scLineList = f_g_getLineList();
	        //附件列表
	        param_return_sale.soChangeInfo.scFileList = f_g_getFileList();
	        //花费列表
	        param_return_sale.soChangeInfo.scOtherCostList = f_g_getCostList();

	        param_return_sale.secretNumber = _vParams.secretNumber;
	        param_return_sale.token = _vParams.token;
	        param_return_sale.serviceId = "B03_poChangeToSoChange";
	        param_return_sale.commonParam = commonParam();


	        return param_return_sale;
	    };

		$body.on('click','.bottom-btn-confirm',function(){
	        popup('confirm','','您确定要转销售变更么？',function(){

	        },function(){
	        	console.log(JSON.stringify(f_return_sale()))
		        $.ajax({
					type:"POST",
		            url:config.serviceUrl,
		            data: {
				        "param": JSON.stringify(f_return_sale())
				    },
		            success:function(data){
		            	if(data.success){
		            		popup('alert','','转销售变更成功！返回上一级',function(){},function(){
		            			goBack();
		            		});
		            	}else{
	            			popup('alert','','转销售变更单错误提示信息：'+data.errorMsg);
		            	}
		            }
				})
	        })
		})	    

	    //获取花费列表
	    function f_g_getCostList(){
	        var scOtherCostList = [];
	        $scope.costList.forEach(function (v, idx) {
	            scOtherCostList.push({
	                "lineNo":(idx+1),
	                "soOtherCostId": v.id,
	                "poChangeOtherCostId": v.id,
	                "costSource": v.costSource,
	                "costName": v.costName,
	                "costAmount": v.costAmount,
	                "changeCostAmount": v.changeCostAmount,
	                "changeType": v.changeType,
	                "remark": v.remark
	            });
	        });
	        return scOtherCostList;
	    }

	    //分析单头附件信息
	    function f_g_getFileList(){
	        var scFileList = [];
	        $scope.sc_files.forEach(function (file, idx) {
	            if(!file.isDeleted){
	                scFileList.push({
	                    "fileName": file.fileName,
	                    "fileSize": file.fileSize,
	                    "fileUrl": file.fileUrl,
	                    "lineNo": (idx + 1),
	                    "fileSource":2
	                });
	            }
	        });
	        return scFileList;
	    }

	    function f_g_getLineList(){
	        var scLineList=[];
	        $scope.lineList.forEach(function (v, idx) {
	            //TODO 单身的附件列表 查询接口中没有返回！
	            scLineList.push({
	                "lineNo":(idx+1),
	                "soId":$scope.pocNoticeInfo.soId,
	                "soFormNo":$scope.orderInfo.soFormNo,
	                "soLineId":v.soLineId,//销售订单单身主键(Rap已给给出)
	                "soLineNo":v.soLineNo,//销售订单单行项次(Rap已给给出)
	                "pocId":$scope.pocNoticeInfo.id.toString(),
	                "pocFormNo":$scope.pocNoticeInfo.pocFormNo,
	                "pocLineId": v.id,
	                "pocLineNo": v.lineNo,//TODO 采购变更单单行项次?
	                "prodId":($scope.pocNoticeInfo.changeType ==3) ? v.vProdId : v.prodId,
	                "prodCode":($scope.pocNoticeInfo.changeType ==3) ? v.vProdCode : v.prodCode,
	                "prodName":($scope.pocNoticeInfo.changeType ==3) ? v.vProdName : v.prodName,
	                "prodScale":($scope.pocNoticeInfo.changeType ==3) ? v.vProdScale : v.prodScale,
	                "prodDesc":v.prodDesc,
	                "cProdId": v.cProdId,//客户产品Id （已完成）
	                "cProdCode":v.cProdCode,//客户产品编码（已完成）
	                "cProdName":v.cProdName,//客户产品名称（已完成）
	                "cProdScale":v.cProdScale,//客户产品规格（已完成）
	                "cProdDesc":v.cProdDesc,//客户产品描述（已完成）
	                "invId":v.invId,
	                "invCode":v.invCode,
	                "invName":v.invName,
	                "locationId":v.locationId,
	                "locationCode":v.locationCode,
	                "locationName":v.locationName,
	                "salesQty":v.purchaseQty,//TODO 销售数量
	                "changeQty": v.changeQty,//TODO 不要混淆
	                "valuationQty": v.valuationQty,
	                "changeValuationQty": v.changeValuationQty,
	                "salesUnitId": v.valuationUnitId,//TODO 销售单位主键 不要混淆
	                "salesUnitCode": v.valuationUnitCode,//TODO 销售单位编码 不要混淆
	                "salesUnitName": v.valuationUnitName,//TODO 销售单位名称 不要混淆
	                "valuationUnitId": v.valuationUnitId,
	                "valuationUnitCode": v.valuationUnitCode,
	                "valuationUnitName": v.valuationUnitName,
	                "price": v.price,
	                "changePrice": v.changePrice,
	                "taxPrice": v.taxPrice,
	                "changeTaxPrice": v.changeTaxPrice,
	                "lineAmount": v.lineAmount,
	                "changeLineAmount": v.changeLineAmount,
	                "taxLineTotal": v.taxLineTotal,
	                "changeTaxLineTotal": v.changeTaxLineTotal,
	                "expectedDeliveryStr": v.expectedDelivery,
	                "changeExpectedDeliveryStr": v.changeExpectedDelivery,
	                "batchDelivery": v.batchDelivery,
	                "changeType": v.changeType,
	                "fileCount": v.fileCount,
	                "status": v.status,
	                "remark": v.remark
	            });
				scLineList[idx].scLineFileList = v.up_file;
				scLineList[idx].fileCount = v.up_file.length;
	            // var line = scLineList[scLineList.length - 1];
            	// a_p_line_file(line);
	        });
	        return scLineList;
	    }

	    //加载单身附件
	    function f_init_l_file(line){
	        line.up_file = [];

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":25, "companyId":$scope.pocNoticeInfo.vendorId, "searchType":2, "id":line.id, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
				if(data.success){
					data.fileList.forEach(function(v){
	                    line.up_file.push({
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


	    //单身附件信息提交
	    function a_p_line_file(line){

	        line.scLineFileList = [];
	        line.fileCount = 0;

	        line.up_file.forEach(function(file, idx) {
	            if(!file.isDeleted){
	                line.scLineFileList.push({
	                    "fileName": file.fileName,
	                    "fileSize": file.fileSize,
	                    "fileUrl": file.fileUrl,
	                    "lineNo": (idx + 1)
	                });
	            }
	        });

	        //单身附件数量
	        line.fileCount = line.scLineFileList.length;
	    }

	    function popup(type, title, content, closeCallBack, okCallBack){
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
}



	
