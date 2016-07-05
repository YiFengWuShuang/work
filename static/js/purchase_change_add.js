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
var $currencySymbol = '';
var $priceDecimalNum = '';//单价小数位数
var $amountDecimalNum = '';//金额小数位数
var $fileListData1;
//that.changeType 1答交差异变更，3结案订单，2取消订单，4采购信息调整
var Lists = function(){
	this.init();
}
Lists.prototype = {
	init: function(){
		var that = this;
		that.changeReason = [];
		that.totals = 0;
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
		requestFn("B02_LogisticsType",function(data){
			if(data.errorCode=='0'){
				that.logisticsType = data.dataSet.data.detail;
			}
		});
		//发票信息
		requestFn("B02_Invoice",function(data){
			if(data.errorCode=='0'){
				that.invoiceInfoName = data.dataSet.data.detail;
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
            		if(data.purchaseOrderInfo.status==3){
            			that.changeType = '1'
            		}else if(data.purchaseOrderInfo.status==8){
            			that.changeType = '2'
            		}else if(data.purchaseOrderInfo.status!=3 || data.purchaseOrderInfo.status!=8){
            			that.changeType = '4'
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

					$('#orderHeadInfo').html(html);

					//发票类型
					if(that.orderInfo.invoice!=1){
						requestFn("B02_InvoiceType",function(data){
							if(data.errorCode=='0'){
								that.invoiceType = data.dataSet.data.detail;
							}
						});						
					}

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

            	}
            }
		})
	},
	//采购明细-----------------------------------------------------------------------
	prodBodyInfo: function(){
		var that = this, html = '';

	    //加载单身附件
		// function f_init_l_file(line){
		//     line.vFileList = [];

		//     GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":10, "companyId":_vParams.companyId, "searchType":2, "id":line.id, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
		// 		if(data.success){
		// 			data.fileList.forEach(function(v){
		//                 line.vFileList.push({
		//                     "id": v.id,
		//                     "fileName":v.fileName,
		//                     "fileSize":v.fileSize,
		//                     "fileUrl": v.fileUrl,
		//                     "lineNo": v.lineNo
		//                 });
		//             });
		// 		}
		// 	});	
		// }

		var params = {"serviceId": "B03_findPoLineList","companyId":_vParams.companyId,"poId": _vParams.poId,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
			    	$PoLineList = data.poLineList
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
			                    for( var k=0;k<val.poSubLineInfo.length;k++ ){
			                        if( k==0 ){
			                            val.changeQty = val.poSubLineInfo[k].purchaseQty;
			                            val.changeValuationQty = val.poSubLineInfo[k].valuationQty;	
			                            val.changeExpectedDeliveryStr = val.poSubLineInfo[k].expectedDelivery;
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
			                            batchItem.changeQty = val.poSubLineInfo[k].purchaseQty;		                 
			                            batchItem.changeValuationQty = val.poSubLineInfo[k].valuationQty;	
			                            batchItem.changeExpectedDeliveryStr = val.poSubLineInfo[k].expectedDelivery;	     	             
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

			        }else if( that.changeType == 4 ){
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
			        }else if( that.changeType == 2 ){
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

            		html = '<h2 class="m-title">采购明细</h2>';
            		if(that.changeType==1){
	            		for(var i=0, len=data.poLineList.length; i<len; i++){
	                		html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li class="prodCode"><span>物料编码：</span><b>'+ data.poLineList[i].prodCode +'</b></li>'
								+'		<li><span>物料名称：</span><p>'+ data.poLineList[i].prodName + ' ' + data.poLineList[i].prodScale +'</p></li>'
								+'		<li><section><span>数量：</span><em>'+ data.poLineList[i].purchaseQty +'</em>'+ data.poLineList[i].purchaseUnitName +'/<em>'+ data.poLineList[i].valuationQty +'</em>'+ data.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate(data.poLineList[i].expectedDelivery) +'</em></section></li>'
							if(data.poLineList[i].vBatchAnswer==1){
								for(var j=0; j<data.poLineList[i].poSubLineInfo.length; j++){
									html+='<li class="changeItem"><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>变更：</span><em>'+ data.poLineList[i].poSubLineInfo[j].purchaseQty +'</em>'+ data.poLineList[i].vAnswerUnitName +'/<em>'+ data.poLineList[i].poSubLineInfo[j].valuationQty +'</em>'+ data.poLineList[i].vValuationUnitName +'</section><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>预交期：</span><em>'+ data.poLineList[i].poSubLineInfo[j].expectedDelivery +'</em></section></li>'
								}
							}else{
								html+='<li class=""><section><span>变更：</span><em>'+ data.poLineList[i].vPurchaseQty +'</em>'+ data.poLineList[i].vAnswerUnitName +'/<em>'+ data.poLineList[i].vValuationQty +'</em>'+ data.poLineList[i].vValuationUnitName +'</section><section><span>预交期：</span><em>'+ data.poLineList[i].vExpectedDelivery +'</em></section></li>'
							}	
							html+='		<li class="price"><span>变更前单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(data.poLineList[i].taxPrice) : formatMoney(data.poLineList[i].price)) +'/'+ data.poLineList[i].valuationUnitName +'</li>'
								+'		<li><span>变更后单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(data.poLineList[i].vTaxPrice) : formatMoney(data.poLineList[i].vPrice)) +'/'+ data.poLineList[i].valuationUnitName +'</li>'
								+'		<li class="files"><span>附件：</span></li>'
								+'		<li class="subtotal"><span>变更前小计：</span><b>'+ $currencySymbol + formatMoney(data.poLineList[i].taxLineTotal) +'</b></li>'
								+'		<li class="changeItem changeLineTotal"><span>变更后小计：</span>'+ $currencySymbol + formatMoney(data.poLineList[i].vTaxLineTotal) +'</li>'			
								+'	</ul>'
								+'</div>'

							//f_init_l_file($scope.poLineList[i]);
	            		}            			
            		}else if(that.changeType==2){
	            		for(var i=0, len=$scope.poLineList.length; i<len; i++){
	                		html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li class="prodCode"><span>物料编码：</span><b>'+ $scope.poLineList[i].prodCode +'</b></li>'
								+'		<li><span>物料名称：</span><p>'+ $scope.poLineList[i].prodName + ' ' + $scope.poLineList[i].prodScale +'</p></li>'
								+'		<li><section><span>变更前：</span><em>'+ $scope.poLineList[i].purchaseQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>'+ $scope.poLineList[i].valuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate($scope.poLineList[i].expectedDelivery) +'</em></section></li>'
								+'		<li class="changeItem"><section><span>变更后：</span><em>0</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>0</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate($scope.poLineList[i].expectedDelivery) +'</em></section></li>'	
								+'		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney($scope.poLineList[i].taxPrice) : formatMoney($scope.poLineList[i].price)) +'/'+ $scope.poLineList[i].valuationUnitName +'</li>'
								+'		<li class="files"><span>附件：</span></li>'
								+'		<li class="subtotal"><span>变更前小计：</span><b>'+ $currencySymbol + formatMoney($scope.poLineList[i].taxLineTotal) +'</b></li>'
								+'		<li class="changeItem changeLineTotal"><span>变更后小计：</span>'+ $currencySymbol + formatMoney(0) +'</li>'			
								+'	</ul>'
								+'</div>'

							//f_init_l_file($scope.poLineList[i]);
	            		}
            		}else if(that.changeType==4){
	            		for(var i=0, len=$scope.poLineList.length; i<len; i++){
	                		html+='<div class="item-wrap" data-index="'+ i +'">'
								+'	<ul>'
								+'		<li class="prodCode"><span>物料编码：</span>'+ $scope.poLineList[i].prodCode +'</li>'
								+'		<li><span>物料名称：</span><p>'+ $scope.poLineList[i].prodName + ' ' + $scope.poLineList[i].prodScale +'</p></li>'
								+'		<li><section><span>数量：</span><em>'+ $scope.poLineList[i].purchaseQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>'+ $scope.poLineList[i].valuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ transDate($scope.poLineList[i].expectedDelivery) +'</em></section></li>'
								+'		<li class="changeQty_'+ i +'"><section><span>变更：</span><em>'+ $scope.poLineList[i].changeQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>'+ $scope.poLineList[i].changeValuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ $scope.poLineList[i].changeExpectedDeliveryStr +'</em></section></li>'
								+'		<li class="price"><span>变更前单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney($scope.poLineList[i].taxPrice) : formatMoney($scope.poLineList[i].price)) +'/'+ $scope.poLineList[i].valuationUnitName +'</li>'
								+'		<li class="changePrice_'+ i +'"><span>变更后单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney($scope.poLineList[i].changeTaxPrice) : formatMoney($scope.poLineList[i].changePrice)) +'/'+ $scope.poLineList[i].valuationUnitName +'</li>'				
								+'		<li class="files"><span>附件：</span></li>'
								+'		<li class="subtotal"><span>变更前小计：</span><b>'+ $currencySymbol + formatMoney($scope.poLineList[i].taxLineTotal) +'</b></li>'
								+'		<li class="changeItem changeLineTotal changeLineTotal_'+ i +'"><span>变更后小计：</span>'+ $currencySymbol + formatMoney($scope.poLineList[i].changeTaxLineTotal) +'</li>'		
								+'	</ul>'
								+'	<span name="bodyInfos" class="edit"></span>'
								+'</div>'

							//f_init_l_file($scope.poLineList[i]);
	            		}             			
            		}

            		$('#prodBodyInfo').html(html);
            		that.load = true;
    				//$scope.poLineList.forEach(function(line,idx){
					// 	var fileHTML = '<p>'
					// 	line.vFileList.forEach(function(val){
					// 		fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
					// 	})
					// 	fileHTML += '</p>'
					// 	if(line.vFileList.length>0){
					// 		$('#prodBodyInfo .files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
					// 	}
					// })
            	}else{
            		container.show().html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					fnTip.hideLoading();
            	}
            }
		})
	},
	//其他费用--------------------------------------------------------------------------------------
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
					costList.isChecked = false;   
			        costList.forEach( function( val ){
			            val.changeType = 1;    
			            val.isChecked = false;
			            val.vCostAmount==''?val.costAmount:val.vCostAmount;
			            if( that.changeType == 4 ){
			                val.vCostAmount = val.costAmount;
			            }else if(that.changeType == 2){
			                val.vCostAmount = 0;
			            }
			        });
			        costList.sort(function(a1,a2){
			            return a1.lineNo-a2.lineNo;
			        });
			        $scope.poOtherCostList = costList;

            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
            		for(var i=0, len=$scope.poOtherCostList.length; i<len; i++){
            			html+='<li><span>'+ $scope.poOtherCostList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney($scope.poOtherCostList[i].costAmount) +'</b><b class="dj"><em class="money">'+ formatMoney($scope.poOtherCostList[i].vCostAmount) +'</em></b></li>';
            			resubtotal += $scope.poOtherCostList[i].vCostAmount;
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal"><span>变更前：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.cOtherCostTotal) +'</b></li>'
            			+'<li id="changeCost" class="response changeLineTotal"><span>变更后：</span>'+ $currencySymbol + (formatMoney(resubtotal)) +'</li>'
            			+'</ul>'
            			+((that.changeType==4) ? '<span name="otherCostInfos" class="edit editOther"></span>' : '')
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
	//日期控件
	dateFn: function(){
		$('.timeBox').mdater({
			minDate : new Date()
		});
	},
	start: function(){
		var that = this;
		that.orderBaseInfo();
		that.dateFn();

		//获取所有平台币种及小数位
		var CurrencyParam = {"serviceId":"B01_queryAllPlatformCurrency", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()};
		GetAJAXData('POST',CurrencyParam,function(unitdata){
			if(unitdata.success){
				$platformCurrencyList = unitdata;
				for(var i=0, l=unitdata.platformCurrencyList.length; i<l; i++){
					if(unitdata.platformCurrencyList[i].currencyCode == that.orderInfo.pCurrencyCode){
						$currencySymbol = unitdata.platformCurrencyList[i].currencySymbol;
						$priceDecimalNum = unitdata.platformCurrencyList[i].priceDecimalNum;
						$amountDecimalNum = unitdata.platformCurrencyList[i].amountDecimalNum;
						return false;
					}
				}
			}
		});

		that.prodBodyInfo();
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

		//枚举，变更原因
		requestFn("B03_POCReasonType",function(data){
			if(data.errorCode=='0'){
				that.reasonType = data.dataSet.data.detail, L = that.reasonType.length;
				that.reasonType.forEach(function(item){
					that.changeReason.push(item.Value)
				})
			}
		});


		//计算计价数量
		function countChangeValuationQty( item ){
			if ( isEmpty(item) ) {
	            return;                                             
	        }
	        item.changeValuationQty = parseFloat(item.valuationQty)/parseFloat(item.purchaseQty)*parseFloat(item.changeQty);
	        item.changeValuationQty = !item.changeValuationQty?"":item.changeValuationQty;
            countLineTotal( item );
		}
	    //计算 不含税单价=含税单价/（1+税率）
	    function countChangePrice( item ){
	        item.changePrice = parseFloat(item.changeTaxPrice)/( 1+parseFloat(that.orderInfo.taxRate) );
	        item.changePrice = parseFloat( item.changePrice.toFixed($priceDecimalNum) );
	        countLineTotal( item );
	    };
	    //计算 含税单价=不含税单价*（1+税率）
	    function countChangeTaxPrice( item ){
	        if ( isEmpty(item) ) {
	            return;                                             
	        }
	        item.changeTaxPrice = parseFloat(item.changePrice)*( 1+parseFloat(that.orderInfo.taxRate) );
	        item.changeTaxPrice = parseFloat( item.changeTaxPrice.toFixed($priceDecimalNum) )
	        countLineTotal( item );
	    };
	    //计算订单各种地方的金额
	    function countLineTotal( item ){
	        if( !isEmpty(item) ){
	            //计算每条单身的 未税金额 和 含税金额
	            //不含税金额=不含税单价*计价数量
	            item.changeLineAmount = parseFloat(item.changePrice)*parseFloat(item.changeValuationQty);
	            item.changeLineAmount = parseFloat(item.changeLineAmount.toFixed($amountDecimalNum));
	            //含税金额=含税单价*计价数量
	            item.changeTaxLineTotal = parseFloat(item.changeTaxPrice)*parseFloat(item.changeValuationQty);
	            item.changeTaxLineTotal = parseFloat(item.changeTaxLineTotal.toFixed($amountDecimalNum));
	        }
	        //计算商品未税总额、含税总额、总额
	        var orderTotal = 0;
	        var orderTaxTotal = 0;
	        for( var i=0;i<$scope.poLineList.length;i++ ){
	            if( isNaN($scope.poLineList[i].changeLineAmount) ||   
	                isNaN($scope.poLineList[i].changeTaxLineTotal)){

	                continue;
	            }
	            orderTotal += parseFloat($scope.poLineList[i].changeLineAmount);
	            orderTaxTotal += parseFloat($scope.poLineList[i].changeTaxLineTotal);
	        }
	        
	        //未税总额
	        that.addval_total = orderTotal;   
	        //含税总额
	        that.addval_taxTotal = orderTaxTotal;  
	        //订单总金额
	        that.addval_totalAmount = parseFloat(that.addval_taxTotal)+parseFloat(that.addval_otherCostTotal);
	        $('.item-total-dj').html('变更后商品总金额：'+$currencySymbol+formatMoney(that.addval_totalAmount));
	    }
	    //改变订单明细的数量，交期，单价的显示值
	    function countChangeShowVal(i){
	    	$('.changeQty_'+i).html('<section><span>变更后：</span><em>'+ $scope.poLineList[i].changeQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>'+ $scope.poLineList[i].changeValuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>预交期：</span><em>'+ $scope.poLineList[i].changeExpectedDeliveryStr +'</em></section>');
	    	$('.changePrice_'+i).html('<span>变更后单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney($scope.poLineList[i].changeTaxPrice) : formatMoney($scope.poLineList[i].changePrice)) +'/'+ $scope.poLineList[i].valuationUnitName);
	    	$('.changeLineTotal_'+i).html('<span>变更后小计：</span>'+ $currencySymbol + formatMoney($scope.poLineList[i].changeTaxLineTotal));
	    }

	    //其他费用中输入框值改变
	    function changeOtherCost( arr ) {
	        var reg = /^(-?\d+)(\.\d+)?$/; //判断数字

	        //其他费用列表
	        var otherTotal = 0;
	        $scope.poOtherCostList.forEach(function (val, key) {
	        	val.vCostAmount = parseFloat(arr[key]);
		        if( !reg.test(val.vCostAmount) ){
		            val.vCostAmount = "";
		        }	        	
	            otherTotal += parseFloat(val.vCostAmount);
	            $('#othersCost').find('.dj .money').eq(key).html(formatMoney(val.vCostAmount));
	        });
	        that.addval_otherCostTotal = otherTotal;//其他费用总金额
	        //订单总金额
	        that.addval_totalAmount = parseFloat(that.addval_taxTotal)+parseFloat(that.addval_otherCostTotal);
	        $('#changeCost').html('<span>变更后：</span>'+ $currencySymbol + formatMoney(that.addval_otherCostTotal));
	        $('.item-total-dj').html('变更后商品总金额：'+$currencySymbol+formatMoney(that.addval_totalAmount));
	    };

		$('.item-total').html('变更前商品总金额：'+$currencySymbol+formatMoney(that.orderInfo.cTotalAmount)).show();
		$('.item-total-dj').html('变更后商品总金额：'+$currencySymbol+formatMoney(that.addval_totalAmount)).show();

		//通用底部
		bottomBar(['share'],that.orderInfo.vAuditid,'','提交变更');

		//订单维护
		container.on('click','span.edit, a.item-link',function(){
			var _this = $(this), name = _this.attr('name'), scrollTop = $body.scrollTop(), index = _this.parent('.item-wrap').attr('data-index');
			switch(name){
				case 'bodyInfos':
					orderReviseInfoCon.html(that.editBodyInfo(index,scrollTop));
					break;
				case 'otherCostInfos':
					orderReviseInfoCon.html(that.editOtherCost(scrollTop));
					break;
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
			var _this = $(this), scrollTop = _this.attr('data-scrollTop'), i = _this.attr('data-index');
			if(_this.is('#saveBodyInfo')){
				$scope.poLineList[i].changeQty = parseFloat($('.changeQty').val());
				$scope.poLineList[i].changeExpectedDeliveryStr = $('.timeBox').html();
				countChangeValuationQty( $scope.poLineList[i] )
				if(that.orderInfo.isContainTax==1){
					$scope.poLineList[i].changeTaxPrice = parseFloat($('.changePrice').val());
					countChangePrice( $scope.poLineList[i] )
				}else{
					$scope.poLineList[i].changePrice = parseFloat($('.changePrice').val());
					countChangeTaxPrice( $scope.poLineList[i] )
				}
				countChangeShowVal(i);
			}
			if(_this.is('#changeCostInfo')){
				var vCostAmountArr = [];
				_this.parents('#orderReviseInfoCon').find('input').forEach(function(val){
					vCostAmountArr.push(val.value);
				})
				changeOtherCost( vCostAmountArr );
			}
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
					+'	<h2 class="m-title">变更原因：</h2>'
					+'	<div id="changeCause" class="select3-input"></div>'
					+'</div>'
					+'<div class="m-item">'
					+'	<h2 class="m-title">变更说明：</h2>'
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
	//产品明细变更
	editBodyInfo: function(idx,scrollTop){
		var that = this, html = '', list = $scope.poLineList[idx];
		html+='<div class="m-item">'
			+'	<h2 class="m-title">产品明细变更</h2>'
			+'	<div class="item-wrap item-wrap-change" data-index="'+ idx +'">'
			+'		<ul>'
			+'			<li class="prodCode"><span>物料编码：</span>'+ list.prodCode +'</li>'
			+'			<li><span>物料名称：</span><p>'+ list.prodName + ' ' + list.prodScale +'</p></li>'
			+'			<li><span>采购数量：</span><input class="changeQty" type="text" value="'+ list.changeQty +'"> '+ list.purchaseUnitName +'</li>'
			+'			<li><span>预交期：</span><div class="timeBox">'+ list.changeExpectedDeliveryStr +'</div><input type="hidden" value="'+ list.changeExpectedDeliveryStr +'"></li>'
			+'			<li><span class="price">单价：</span><input class="changePrice" type="text" value="'+ ((that.orderInfo.isContainTax===1) ? list.changeTaxPrice : list.changePrice) +'"> /'+ list.valuationUnitName +'</li>'
			+'		</ul>'
			+'	</div>'
			+'</div>'
			+'<div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+scrollTop+'" data-index="'+idx+'">完成</a></div>'
		return html;
	},
	//其他费用变更
	editOtherCost: function(scrollTop){
		var that = this, html = '';
		html+='<div class="m-item"><h2 class="m-title">其他费用变更</h2><div class="item-wrap item-wrap-change"><ul>'
		$scope.poOtherCostList.forEach(function(val){
			html+='<li><span>'+ val.costName +'：</span>'+ $currencySymbol + formatMoney(val.costAmount) +'<i class="gap"></i>'+$currencySymbol+'<input type="text" value="'+ val.vCostAmount +'" /></b></li>'
		})
		html+='</ul></div></div><div class="btn-wrap"><a href="javascript:;" id="changeCostInfo" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
		return html;
	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

		var html = '<ul class="payInfoList">'
			+'<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) +'</p></li>'
			+'<li><span>'+ ((infos.logisticsType=='3') ? '自提点':'收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>(收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +')</p></li>'
			+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
		if(infos.invoice==1){
			html+='<li><span>发票信息：</span><p>'+ enumFn(that.invoiceInfoName,infos.invoice) +'</p></li>'
		}else{
			html+='<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
				+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
				+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'			
		}
			html+='</ul>'
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
		for(var i=0; i<$fileListData1.fileList.length;i++){
			html+='<p><a href="'+ $fileListData1.fileList[i].fileUrl +'"><i class=i-'+ (_reg.test($fileListData1.fileList[i].fileName) ? "image" : "word") +'></i>'+ $fileListData1.fileList[i].fileName +'</a></p>'
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

        //提交变更  保存:operationState=1;提交:operationState=2;----------------------------------------
	    //that.changeType 1答交差异变更，3结案订单，2取消订单，4采购信息调整
        if( operationState != 1 && operationState != 2 ){
            fnTip.error(2000,'单据状态有问题');
            return;
        }
        //业务员
        if(!isEmpty(privateDefultUser)){
	        var addval_pocManCode = privateDefultUser.employeeCode;
	        var addval_pocManId = privateDefultUser.employeeId;
	        var addval_pocManName = privateDefultUser.employeeName;
	        var addval_pocManPid = privateDefultUser.memberId;
        }else{
	        var addval_pocManCode = that.orderInfo.poManCode;
	        var addval_pocManId = that.orderInfo.poManId;
	        var addval_pocManName = that.orderInfo.poManName;
	        var addval_pocManPid = that.orderInfo.poManPid;
        }


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
			if(that.changeType!=2){
				//同意差异，变更原采购单
				that.popup('confirm', '', '确定提交变更吗？', function(){
					//取消
				},function(){
					//确定
					console.log('{"poChangeInfo":'+ JSON.stringify(that.submitBt(2)) +', "token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","serviceId":"B03_addSavePoChange", "commonParam":'+ JSON.stringify(commonParam()) +'}')
					ajaxLoad(function(){
						fnTip.success(2000,'提交成功');
		                setTimeout(function(){
		                	//window.location.href=config.htmlUrl+'orderHandedOut.html?param={"poId":"'+ _vParams.poId +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
		                	goBack();
		                },2000);
					},2);
				})
			}else{
				//取消订单
				that.popup('confirm', '', '确定取消变更吗？', function(){
					//取消
				},function(){
					//确定
					ajaxLoad(function(returnData){
						fnTip.success(2000,'取消成功');
						setTimeout(function(){
		                	//window.location.href=config.htmlUrl+'purchase_change.html?param={"id":"'+ returnData.id +'","companyId":"'+ _vParams.companyId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
		                	goBack();
		                },2000);
					});
				})
			}
		})
	}
}



	
