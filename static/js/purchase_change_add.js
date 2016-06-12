var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var changeCauseVal1 = $('#changeCauseVal1');
var changeCauseVal2 = $('#changeCauseVal2');
var $changeCauseVal = '';
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var privateDefultUser;
var $PoLineList;
var $scope = {};
var $platformCurrencyList;
var $currencySymbol;
var $fileListData1;
//that.changeType 1同意差异，变更原始订单   2取消订单
var Lists = function(){
	this.init();
}
Lists.prototype = {
	init: function(){
		var that = this;
		that._files = [];
		that._lineLists = [];
		that._othersCost = [];
		that.changeReason = [];
		that.totals = 0;
		that.load = false;
        setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);
		//查询枚举值
		requestFn("B03_POCType",function(data){
			if(data.errorCode=='0'){
				that.changeTypeList = data.dataSet.data.detail;
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

		// 获取用户信息
		GetUserInfo("POST",{"token":_vParams.token,"secretNumber":_vParams.secretNumber},function(response){
			if(response.retCode == '01230'){
				privateDefultUser = response;
			}
		})
		that.start();

	},
	orderBaseInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_getPurchaseOrderInfo", "companyId": _vParams.companyId, "poId": _vParams.poId, "commonParam": commonParam(),"token":_vParams.token, "secretNumber":_vParams.secretNumber}
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.purchaseOrderInfo;
            		if(data.purchaseOrderInfo.status==3||data.purchaseOrderInfo.status==4){
            			that.changeType = '1'
            		}else if(data.purchaseOrderInfo.status==8){
            			that.changeType = '2'
            		}
            		html +='<h2 class="m-title">变更信息</h2><div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>所属公司：</span><b>'+ that.orderInfo.companyName +'</b></li>'
						 +'		<li><span>采购单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>内部采购单号：</span><b>'+ that.orderInfo.poInsideNo +'</b></li>'
						 +'		<li><span>交易税别：</span>'+ that.orderInfo.taxName + '<label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
						 +'		<li><span>变更类型：</span>'+ enumFn(that.changeTypeList,that.changeType) +'</li>'
						 +'		<li><span>变更人：</span>'+ that.orderInfo.auditname +'</li>'
						 +'		<li><span>变更日期：</span>'+ transDate(new Date().getTime()) +'</li>'
						 +'	</ul>'
						 +'</div>'
            	}
            }
		})
		return html;
	},
	prodBodyInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_findPoLineList","companyId":_vParams.companyId,"poId": _vParams.poId,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var lineList = data.poLineList;
            		that._lineLists = lineList;
            		html = '<h2 class="m-title">采购明细</h2>';
            		if(that.changeType!=2){
	            		for(var i=0, len=lineList.length; i<len; i++){
	                		html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li class="prodCode"><span>物料编码：</span><b>'+ lineList[i].prodCode +'</b></li>'
								+'		<li><span>物料名称：</span><p>'+ lineList[i].prodName + ' ' + lineList[i].prodScale +'</p></li>'
								+'		<li><section><span>数量：</span><em>'+ lineList[i].purchaseQty +'</em>'+ lineList[i].purchaseUnitName +'/<em>'+ lineList[i].valuationQty +'</em>'+ lineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate(lineList[i].expectedDelivery) +'</em></section></li>'
							if(lineList[i].poSubLineInfo.length){
								for(var j=0; j<lineList[i].poSubLineInfo.length; j++){
									html+='<li class="changeItem"><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>变更：</span><em>'+ lineList[i].poSubLineInfo[j].purchaseQty +'</em>'+ lineList[i].vAnswerUnitName +'/<em>'+ lineList[i].poSubLineInfo[j].valuationQty +'</em>'+ lineList[i].vValuationUnitName +'</section><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>预交期：</span><em>'+ lineList[i].poSubLineInfo[j].expectedDelivery +'</em></section></li>'
								}
							}else{
								html+='<li class=""><section><span>供应方：</span><em>'+ lineList[i].vPurchaseQty +'</em>'+ lineList[i].vAnswerUnitName +'/<em>'+ lineList[i].vValuationQty +'</em>'+ lineList[i].vValuationUnitName +'</section><section><span>预交期：</span><em>'+ lineList[i].vExpectedDelivery +'</em></section></li>'
							}	
							html+='		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(lineList[i].taxPrice) : formatMoney(lineList[i].price)) +'/'+ lineList[i].valuationUnitName +'</li>'
								+'		<li class="files"><span>附件：</span></li>'
								+'		<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].taxLineTotal) +'</b></li>'
								+'		<li class="changeItem changeLineTotal"><span>答交小计：</span>'+ $currencySymbol + formatMoney(lineList[i].vTaxLineTotal) +'</li>'			
								+'	</ul>'
								+'</div>'
	            		}            			
            		}else{
	            		for(var i=0, len=lineList.length; i<len; i++){
	                		html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li class="prodCode"><span>物料编码：</span><b>'+ lineList[i].prodCode +'</b></li>'
								+'		<li><span>物料名称：</span><p>'+ lineList[i].prodName + ' ' + lineList[i].prodScale +'</p></li>'
								+'		<li><section><span>变更前：</span><em>'+ lineList[i].purchaseQty +'</em>'+ lineList[i].purchaseUnitName +'/<em>'+ lineList[i].valuationQty +'</em>'+ lineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate(lineList[i].expectedDelivery) +'</em></section></li>'
								+'		<li class="changeItem"><section><span>变更后：</span><em>0</em>'+ lineList[i].purchaseUnitName +'/<em>0</em>'+ lineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate(lineList[i].expectedDelivery) +'</em></section></li>'	
								+'		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(lineList[i].taxPrice) : formatMoney(lineList[i].price)) +'/'+ lineList[i].valuationUnitName +'</li>'
								+'		<li class="files"><span>附件：</span></li>'
								+'		<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].taxLineTotal) +'</b></li>'
								+'		<li class="changeItem changeLineTotal"><span>答交小计：</span>'+ $currencySymbol + formatMoney(0) +'</li>'			
								+'	</ul>'
								+'</div>'
	            		}
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
		var that=this, html='', subtotal=0, resubtotal=0;
		if(!that.load)return;
		var params = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B03_findPoOtherCostList", "companyId":_vParams.companyId,"poId":_vParams.poId, "commonParam":commonParam()};
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            async: false,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var costList = data.poOtherCostList;
            		that._othersCost = costList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
            		for(var i=0, len=costList.length; i<len; i++){
            			html+='<li><span>'+ costList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(costList[i].costAmount) +'</b><b class="dj"><em class="money">'+ ((that.changeType==2)?'0.00':(formatMoney((costList[i].vCostAmount=='') ? costList[i].costAmount : costList[i].vCostAmount))) +'</em></b></li>';
            			resubtotal += costList[i].vCostAmount;
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.cOtherCostTotal) +'</b></li>'
            			+'<li id="changeCost" class="response changeLineTotal"><span>答交小计：</span>'+ $currencySymbol + ((that.changeType==2) ? formatMoney(0) : formatMoney(resubtotal)) +'</li>'
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

		prodBodyInfo.innerHTML = that.prodBodyInfo();
		that.othersCost();


		// 单头附件//fileSource附件类型（1-客户，2-供应商)  searchType查询类型1单头2单身
		var fileListParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":_vParams.companyId,"id":_vParams.poId,"fileSource":1,"searchType":1,"docType":10,"commonParam":commonParam()};
		GetAJAXData('POST',fileListParam,function(fileListData1){
			if(fileListData1.success){
				$fileListData1 = fileListData1;

				//变更附件
		        $scope.change_FileList = [];
		        //答交差异变更
		        if( that.changeType == 1 ){
		            fileListData1.fileList.forEach( function( val ){
		                if( val.fileSource == 2 ){
		                    val.fileSource = 1;
		                    $scope.change_FileList.push(val);   
		                }
		            });
		        }
			}
		})

		// 单身附件
		// function fileListOB(){
		// 	for(var i=0, l=that._lineLists.length; i<l; i++){
		// 		var param = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":_vParams.companyId,"id":that._lineLists[i].id,"fileSource":1,"searchType":2,"docType":10,"commonParam":commonParam()};
		// 		GetAJAXData('POST',param,function(fileListData2){
		// 			if(fileListData2.success){
		// 				$fileListData2 = fileListData2;
		// 				//
		// 			}
		// 		})
		// 	}
		// }

		//枚举，变更原因
		requestFn("B03_POCReasonType",function(data){
			if(data.errorCode=='0'){
				that.reasonType = data.dataSet.data.detail, L = that.reasonType.length;
				that.reasonType.forEach(function(item){
					that.changeReason.push(item.Value)
				})
			}
		});


		$('.item-total').html('本方采购总计：'+$currencySymbol+formatMoney(that.orderInfo.cTotalAmount)).show();
		$('.item-total-dj').html('供应商答交总计：'+$currencySymbol+formatMoney(((that.changeType==2)?0:that.orderInfo.vTotalAmount))).show();

		//通用底部
		bottomBar(['share'],that.orderInfo.vAuditid,'','提交变更');

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
				case 'changeCause':
					orderReviseInfoCon.html(that.changeCause(scrollTop));
					that.POCReasonType()
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
					var changeCauseType = reEnumFn(that.reasonType,changeCauseSelect3);
					changeCauseVal1.val(changeCauseType);
					$changeCauseVal = changeCauseSelect3;
				}else{
					changeCauseVal1.val('');
					$changeCauseVal = '';
				}
				changeCauseVal2.val($('#intRemarks').val());
			}

			container.removeClass('contarinEdit');
			$('#jBottom').removeClass('m-bottom-hide');
			setTimeout(function(){$body.scrollTop(scrollTop)},200);
		})

		that.submitFn();
	},
	changeCause: function(scrollTop){
		var that = this;
		var html = '<div class="m-item m-item-select">'
					+'	<h2 class="m-title">变更类型：</h2>'
					+'	<div id="changeCause" class="select3-input"></div>'
					+'</div>'
					+'<div class="m-item">'
					+'	<h2 class="m-title">变更原因：</h2>'
					+'	<div class="item-wrap int-remarks">'
					+'		<textarea name="" id="intRemarks" placeholder="在此处录入变更的备注和说明"></textarea>'
					+'	</div>'
					+'</div>'
					+'<div class="btn-wrap">'
					+'	<a href="javascript:;" id="saveChangeCause" class="btnB">保存说明</a>'	
					+'</div>'
		return html
	},
	POCReasonType: function(){
		var that = this;
		//枚举，变更原因
		if(changeCauseVal1.val()==''){
			that.initSelect3('#changeCause',that.changeReason,'');
		}else{
			that.initSelect3('#changeCause',that.changeReason,$changeCauseVal);
		}
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

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
		for(var i=0; i<that._files.length;i++){
			html+='<p><a href="'+ that._files[i].fileUrl +'"><i class=i-'+ (_reg.test(that._files[i].fileName) ? "image" : "word") +'></i>'+ that._files[i].fileName +'</a></p>'
		}
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
	submitBt: function(operationState){
		var that = this;

        //变更后价格总计
        if( that.changeType != 2 ){
            that.addval_total = (that.orderInfo.vTotal=="")?that.orderInfo.cTotal:that.orderInfo.vTotal;   
            that.addval_taxTotal = (that.orderInfo.vTaxTotal=="")?that.orderInfo.cTaxTotal:that.orderInfo.vTaxTotal;   
            that.addval_totalAmount = (that.orderInfo.vTotalAmount=="")?that.orderInfo.cTotalAmount:that.orderInfo.vTotalAmount;   
            that.addval_otherCostTotal = (that.orderInfo.vOtherCostTotal=="")?that.orderInfo.cOtherCostTotal:that.orderInfo.vOtherCostTotal;  
        }else{
            that.addval_total = 0;
            that.addval_taxTotal = 0;
            that.addval_totalAmount = 0;
            that.addval_otherCostTotal = 0;
        }

    	//采购明细-----------------------------------------------------------------------
    	$PoLineList = that._lineLists
        $PoLineList.sort(function(a1,a2){
            return a1.lineNo-a2.lineNo;
        });
        //初始化异动类型、变更附件、变更备注 
        $PoLineList.isChecked = false;   
        $PoLineList.forEach(function(val) {
            val.changeLineNo = val.lineNo;
            val.changeType = 1;  //异动类型（1-未变化、2-修改、3-新增）
            val.changeFileList = [];
            val.changeRemark = "";	
            val.isChecked = false;   
		});
        /**
         * @采购明细 备注和附件
         * 取消订单和强制结案状态 下只需要取出 订单附件和备注并且显示 
         * 答交差异变更和调整采购信息状态下 需要上传附件 添加备注  并保存
         */
        if( that.changeType == 3 ){
            $PoLineList.forEach(function(val) {
                //变更后采购明细 与 订单信息一样 
                val.changeQty = val.purchaseQty;		                 
                val.changeValuationQty = val.valuationQty;	 
                val.changePrice = val.price;		     	             
                val.changeTaxPrice = val.taxPrice;		     	             
                val.changeLineAmount = val.lineAmount;		     	             
                val.changeTaxLineTotal = val.taxLineTotal;		     	     
                val.changeExpectedDeliveryStr = val.expectedDelivery;	
            });
        }else if( that.changeType == 1){
            var batchArr = [];//分批答交 临时数组

            //答交差异变更 分批答交拆开
            $PoLineList.forEach(function(val) {
                //变更后采购明细 与 答交信息一样 
                val.changeQty = val.vPurchaseQty;		                 
                val.changeValuationQty = val.vValuationQty;
                val.changePrice = val.vPrice;	
                val.changeTaxPrice = val.vTaxPrice;		     	             
                val.changeLineAmount = val.vLineAmount;		     	             
                val.changeTaxLineTotal = val.vTaxLineTotal;		     	     
                val.changeExpectedDeliveryStr = val.vExpectedDelivery;	

                //分批答交 拆分操作
                if( val.vBatchAnswer == 1 ){                        
                    for( var i=0;i<val.poSubLineInfo.length;i++ ){
                        if( i==0 ){
                            val.changeQty = val.poSubLineInfo[i].purchaseQty;
                            val.changeValuationQty = val.poSubLineInfo[i].valuationQty;	
                            val.changeExpectedDeliveryStr = val.poSubLineInfo[i].expectedDelivery;
                            val.changeLineAmount = (val.changePrice*val.changeValuationQty);
                            val.changeTaxLineTotal = (val.changeTaxPrice*val.changeValuationQty);
                            val.changeType = 2;
                        }else{
                            var batchItem = {};
                            batchItem.prodId = val.prodId;		                 
                            batchItem.prodCode = val.prodCode;		                 
                            batchItem.prodName = val.prodName;		                 
                            batchItem.prodScale = val.prodScale;		                 
                            batchItem.prodDesc = val.prodDesc;		                 
                            batchItem.valuationUnitId = val.valuationUnitId;		                 
                            batchItem.valuationUnitCode = val.valuationUnitCode;		                 
                            batchItem.valuationUnitName = val.valuationUnitName;	
                            batchItem.purchaseUnitId = val.purchaseUnitId;	
                            batchItem.purchaseUnitName = val.purchaseUnitName;	
                            batchItem.purchaseUnitCode = val.purchaseUnitCode;	
                            batchItem.changePrice = val.vPrice;	
                            batchItem.changeTaxPrice = val.vTaxPrice;	
                            batchItem.changeFileList = [];	
                            
                            var maxLineNo=(batchArr.length==0)?$PoLineList[$PoLineList.length-1].changeLineNo:batchArr[batchArr.length-1].changeLineNo;
                            batchItem.changeLineNo = maxLineNo+1;		                 
                            batchItem.changeType = 3;		                 
                            batchItem.changeQty = val.poSubLineInfo[i].purchaseQty;		                 
                            batchItem.changeValuationQty = val.poSubLineInfo[i].valuationQty;	
                            batchItem.changeExpectedDeliveryStr = val.poSubLineInfo[i].expectedDelivery;	     	             
                            batchItem.changeLineAmount = (val.changePrice*val.changeValuationQty);
                            batchItem.changeTaxLineTotal = (val.changeTaxPrice*val.changeValuationQty);
                            batchArr.push(batchItem);
                        }
                    }
                }
                //异动类型
                if( val.price != val.changePrice || 
                    val.purchaseQty != val.changeQty || 
                    val.expectedDelivery != val.changeExpectedDeliveryStr || 
                    val.lineAmount != val.changeLineAmount ){

                    val.changeType = 2;
                }
            });
            $PoLineList = $PoLineList.concat( batchArr );
        }else if( $scope.changeType == 4 ){
            $PoLineList.forEach(function(val) {
                //初始化 变更后与变更前一样 
                val.changeQty = val.purchaseQty;		                 
                val.changeValuationQty = val.valuationQty;	 
                val.changePrice = val.price;		     	             
                val.changeTaxPrice = val.taxPrice;		     	             
                val.changeLineAmount = val.lineAmount;		     	             
                val.changeTaxLineTotal = val.taxLineTotal;		     	     
                val.changeExpectedDeliveryStr = val.expectedDelivery;	                
            });
        }else if( $scope.changeType == 2 ){
            $PoLineList.forEach(function(val) {
                val.changeType = 2;
                //变更后的单价、交期等于原单价、交期，变更后的数量默认为0（都不允许修改）
                //变更后的费用等于0（不允许修改）
                //总价、小计均为0
                val.changeQty = 0;		                 
                val.changeValuationQty = 0;	 
                val.changePrice = val.price;		     	             
                val.changeTaxPrice = val.taxPrice;		     	             
                val.changeLineAmount = 0;		     	             
                val.changeTaxLineTotal = 0;		     	     
                val.changeExpectedDeliveryStr = val.expectedDelivery;	                
            });
        }
        $scope.poLineList = $PoLineList;

        //其他费用--------------------------------------------------------------------------------------
        that._othersCost.isChecked = false;   
        that._othersCost.forEach( function( val ){
            val.changeType = 1;    
            val.isChecked = false;  
            if( that.changeType == 4 ){
                val.vCostAmount = val.costAmount;
            }else if(that.changeType == 2){
                val.vCostAmount = 0;
            }
        });
        that._othersCost.sort(function(a1,a2){
            return a1.lineNo-a2.lineNo;
        });
        $scope.poOtherCostList = that._othersCost;



        //提交变更  保存:operationState=1;提交:operationState=2;----------------------------------------
	    //that.changeType 1答交差异变更，3结案订单，2取消订单，4采购信息调整
        if( operationState != 1 && operationState != 2 ){
            fnTip.error(2000,'单据状态有问题');
            return;
        }
        //业务员
        var addval_pocManCode = privateDefultUser.employeeCode;
        var addval_pocManId = privateDefultUser.employeeId;
        var addval_pocManName = privateDefultUser.employeeName;
        var addval_pocManPid = privateDefultUser.memberId;

        //采购明细
        var addval_pcLineList = [];
        var pcLineList_changeType;
        for( var i=0;i<$scope.poLineList.length;i++ ){
            var val = $scope.poLineList[i];

            if( (val.prodName==undefined) || 
                (val.changeQty==undefined) || 
                (val.changeValuationQty==undefined) || 
                (val.changePrice==undefined) || 
                (val.changeTaxPrice==undefined) || 
                (val.changeLineAmount==undefined) || 
                (val.changeTaxLineTotal==undefined) || 
                (val.changeExpectedDeliveryStr==undefined) ){

                //that.popup("alert","","请检查变更项次为"+val.changeLineNo+"的填写内容！");
            	fnTip.error(2000,'单据内容有问题');
                return false; 
            }

            //异动类型
            if( val.changeType == 1 ){
                if( val.price != val.changePrice || 
                    val.purchaseQty != val.changeQty || 
                    val.expectedDelivery != val.changeExpectedDeliveryStr || 
                    val.lineAmount != val.changeLineAmount ){

                    val.changeType = 2;
                }
            }
                   
            var item_poLine = {
                "lineNo":val.changeLineNo, 
                "poId":_vParams.poId,	                       
                "poFormNo":that.orderInfo.poFormNo,                
                "poLineId":val.id,	                 
                "poLineNo":val.lineNo,
                    
                "doId":"",	                     
                "doFormNo":"",	                 
                "doLineId":"",	                 
                "doLineNo":"",
                
                "prodId":val.prodId,	                     
                "prodCode":val.prodCode,	                 
                "prodName":val.prodName,	                 
                "prodScale":val.prodScale,	                 
                "prodDesc":val.prodDesc,
                    
                "invId":val.invId,	                     
                "invCode":val.invCode,	                 
                "invName":val.invName,	                 
                "locationId":val.locationId,	                 
                "locationCode":val.locationCode,	             
                "locationName":val.locationName,	
                    
                "purchaseQty":val.purchaseQty,                   
                "valuationQty":val.valuationQty,                      
                "changeQty":val.changeQty,                       
                "changeValuationQty":val.changeValuationQty,                 
                "purchaseUnitId":val.purchaseUnitId,                     
                "purchaseUnitCode":val.purchaseUnitCode,                 
                "purchaseUnitName":val.purchaseUnitName,                 
                "valuationUnitId":val.valuationUnitId,               
                "valuationUnitCode":val.valuationUnitCode,               
                "valuationUnitName":val.valuationUnitName,
                    
                "price":val.price,                                   
                "taxPrice":val.taxPrice,                                 
                "lineAmount":val.lineAmount,                                 
                "taxLineTotal":val.taxLineTotal,                             
                "changePrice":val.changePrice,                           
                "changeTaxPrice":val.changeTaxPrice,                             
                "changeLineAmount":val.changeLineAmount,                         
                "changeTaxLineTotal":val.changeTaxLineTotal,	
                    
                "expectedDeliveryStr":new Date(val.expectedDelivery).getTime(),
                "changeExpectedDeliveryStr":new Date(val.changeExpectedDeliveryStr).getTime(),
                "batchDelivery":0,		     	             
                "changeType":val.changeType,
                //强制变更状态下 不需要传附件和备注；
                "fileCount":val.changeFileList.length,       
                "remark":val.changeRemark,	                     
                "pcLineFileList":[],		 
            };
            if(!val.expectedDelivery){
	            delete item_poLine.expectedDeliveryStr;
            }

            // _.forEach(val.changeFileList,function(i){
            //     if(!i.isDeleted){
            //         var item_file = {};
            //         item_file.lineNo = i.lineNo; 
            //         item_file.fileSource = i.fileSource; 
            //         item_file.fileUrl = i.fileUrl; 
            //         item_file.fileName = i.fileName; 
            //         item_file.fileSize = i.fileSize; 
            //         item_file.fileKey = i.fileKey; 
            //         item_file.remark = i.remark; 

            //         item_poLine.pcLineFileList.push(item_file);
            //     }
            // });
            addval_pcLineList.push(item_poLine);
        }


        //其他费用
        var addval_pcOtherCostList = [];
        var othersCost_changeType;
        $scope.poOtherCostList.forEach(function(val){
            if( val.costName!='' ){
                //异动类型
                if( val.changeType == 1 ){
                    if( val.vCostAmount != val.costAmount  ){
                        val.changeType = 2;
                    }
                }   
                var item_poLine = {
                    "lineNo":val.lineNo, 
                    "poOtherCostId":val.poOtherCostId,                         
                    "costSource":val.costSource,                     
                    "costName":val.costName,                     
                    "costAmount":val.costAmount,
                    "changeCostAmount":val.vCostAmount,                      
                    "changeType":val.changeType,
                    //强制变更状态下 备注为空；
                    //其余状态下状态下 备注为变更说明；
                    "remark":val.changeRemark
                };
                addval_pcOtherCostList.push(item_poLine);
            }
        });

        var addval_fileList = [];
        //答交差异变更
        if( that.changeType != 3 ){
            $scope.change_FileList.forEach(function(val){
                if(!i.isDeleted){
                    var item_file = {};
                    item_file.lineNo = val.lineNo; 
                    item_file.fileSource = val.fileSource; 
                    item_file.fileUrl = val.fileUrl; 
                    item_file.fileName = val.fileName; 
                    item_file.fileSize = val.fileSize; 
                    item_file.fileKey = val.fileKey; 
                    item_file.remark = val.remark; 

                    addval_fileList.push(item_file);
                }
            });
        }


		return {
            "companyId":that.orderInfo.companyId,	          
	        "companyCode":that.orderInfo.companyCode,	     	          
	        "companyName":that.orderInfo.companyName,	     	          
	        "companyAbbr":that.orderInfo.companyAbbr,	     	          
	        "vendorId":that.orderInfo.vendorId,	     	              
	        "vendorCode":that.orderInfo.vendorCode,	     	              
	        "vendorName":that.orderInfo.vendorName,	     	              
	        "vendorAbbr":that.orderInfo.vendorAbbr,	     
                
	        "pCurrencyCode":that.orderInfo.pCurrencyCode,	     	          
	        "pCurrencyName":that.orderInfo.pCurrencyName,	     	          
	        "currencyId":that.orderInfo.currencyId,	     	              
	        "currencyCode":that.orderInfo.currencyCode,	     	          
	        "currencyName":that.orderInfo.currencyName,	     	          
	        "localCurrencyId":that.orderInfo.localCurrencyId,	     	      
	        "localCurrencyCode":that.orderInfo.localCurrencyCode,	     	      
	        "localCurrencyName":that.orderInfo.localCurrencyName,	     	      
	        "exchangeRate":that.orderInfo.exchangeRate,	     	          
	        "taxId":that.orderInfo.taxId,	     	                  
	        "taxCode":that.orderInfo.taxCode,	                   	
	        "taxName":that.orderInfo.taxName,	     	              
	        "isContainTax":that.orderInfo.isContainTax,	     	          
	        "taxRate":that.orderInfo.taxRate,		              
	        "conditionId":that.orderInfo.conditionId,		          
	        "conditionCode":that.orderInfo.conditionCode,		          
	        "conditionName":that.orderInfo.conditionName,		          
	        "payWayId":that.orderInfo.payWayId,
	        "payWayCode":that.orderInfo.payWayCode,
	        "payWayName":that.orderInfo.payWayName,
	        "payMentType":that.orderInfo.paymentType,

            "poId":_vParams.poId,
	        "poFormNo":that.orderInfo.poFormNo,
	        "poInsideNo":that.orderInfo.poInsideNo,	                    
	        "pocInsideNo":"",		          
	        "pocFormDateStr":new Date().getTime(),	  	          
	        "poFormDateStr":that.orderInfo.poFormDate,	     	          
	        "changeType":that.changeType,//1答交差异变更，2取消订单
	        "changeReason":((that.changeType==2)?'3':(changeCauseVal1.val() || '1')),	
                
	        "poManId":that.orderInfo.poManId,	     	              
	        "poManCode":that.orderInfo.poManCode,	     	              
	        "poManName":that.orderInfo.poManName,	     	              
	        "poManPid":that.orderInfo.poManPid,	     	              
	        "pocManId":addval_pocManId,	     	              
	        "pocManCode":addval_pocManCode,	     	              
	        "pocManName":addval_pocManName,	     	              
	        "pocManPid":addval_pocManPid,	
                      
            "logisticsType":that.orderInfo.logisticsType,//物流方式
            "logisticsCode":that.orderInfo.logisticsCode,	    
            "logisticsName":that.orderInfo.logisticsName,	    
            "addressId":that.orderInfo.addressId,    
            "countryCode":that.orderInfo.countryCode,	    
            "countryName":that.orderInfo.countryName,	    
            "provinceCode":that.orderInfo.provinceCode,	    
            "provinceName":that.orderInfo.provinceName,	    
            "cityCode":that.orderInfo.cityCode,	        
            "cityName":that.orderInfo.cityName,	        
            "districtCode":that.orderInfo.districtCode,	    
            "districtName":that.orderInfo.districtName,	    
            "address":that.orderInfo.address,	        
            "contactPerson":that.orderInfo.contactPerson,	    
            "mobile":that.orderInfo.mobile,	            
            "insideAddressCode":that.orderInfo.insideAddressCode,
            "invId":that.orderInfo.invId,	                  
	        "invCode":that.orderInfo.invCode,	              
	        "invName":that.orderInfo.invName,

            "invoice":that.orderInfo.invoice,	        
            "invoiceType":that.orderInfo.invoiceType,	    
            "invoiceHeader":that.orderInfo.invoiceHeader,	
            "invoiceContent":that.orderInfo.invoiceContent,
            "invoicePayMark":that.orderInfo.invoicePayMark,
            "invoiceName":that.orderInfo.invoiceName,	    
            "invoiceTel":that.orderInfo.invoiceTel,	        
            "invoiceAddress":that.orderInfo.invoiceAddress,	    
            "invoiceBank":that.orderInfo.invoiceBank,        
            "invoiceAccount":that.orderInfo.invoiceAccount,
            
	        "poTotalAmount":that.orderInfo.cTotalAmount,            
	        "poTotal":that.orderInfo.cTotal,	              
	        "poTaxTotal":that.orderInfo.cTaxTotal,               
	        "poOtherCostTotal":that.orderInfo.cOtherCostTotal,
	        "total":that.addval_total,	                  
	        "taxTotal":that.addval_taxTotal,	              
	        "totalAmount":that.addval_totalAmount,	          
	        "otherCostTotal":that.addval_otherCostTotal,
                
	        "agreeMent":that.orderInfo.agreement,
            "poRemark":that.orderInfo.remark,	
	        "status":operationState,
	        "remark":$('#changeCauseVal2').val(),
	        "version":that.orderInfo.version,

            "pcOtherCostList":addval_pcOtherCostList,
            "pcLineList":addval_pcLineList,
            "pcFileList":addval_fileList
            
        };
	},
	submitFn: function(){
		var that = this;
		function ajaxLoad(callBack,changeType){
			$.ajax({
				type:"POST",
	            url:config.serviceUrl,
	            data: {
			        "param": '{"poChangeInfo":'+ JSON.stringify(that.submitBt(changeType)) +', "token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","serviceId":"B03_addSavePoChange", "commonParam":'+ JSON.stringify(commonParam()) +'}'
			    },
	            success:function(data){
	            	data = data || {};
	            	if(data.success){
	            		callBack&&callBack(data);
	            	}else{
            			that.popup('alert','',data.errorMsg);
            			return false;
	            	}
	            }
			})			
		}
		$body.on('click','.bottom-btn-confirm',function(){
			if(that.changeType==1){
				//同意差异，变更原采购单
				that.popup('confirm', '', '确定提交变更吗？', function(){
					//取消
				},function(){
					//确定
					console.log('{"poChangeInfo":'+ JSON.stringify(that.submitBt(2)) +', "token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","serviceId":"B03_addSavePoChange", "commonParam":'+ JSON.stringify(commonParam()) +'}')
					ajaxLoad(function(){
						fnTip.success(2000,'提交成功');
		                setTimeout(function(){
		                	window.location.href=config.htmlUrl+'orderHandedOut.html?param={"poId":"'+ _vParams.poId +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
		                },2000);
					},2);	
				})
			}else if(that.changeType==2){
				//取消订单
				that.popup('confirm', '', '确定取消变更吗？', function(){
					//取消
				},function(){
					//确定
					ajaxLoad(function(returnData){
						fnTip.success(2000,'取消成功');
						setTimeout(function(){
		                	window.location.href=config.htmlUrl+'purchase_change.html?param={"id":"'+ returnData.id +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
		                },2000);
					});
				})
			}
		})
	}
}



	
