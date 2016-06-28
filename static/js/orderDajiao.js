var formTip = '<div id="formTip" class="formTip"></div>';
var $itemTips = $('.item-tips');
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var orderAnswerCon = $('#orderAnswerInfo');
var prodAnswerCon = $('#prodAnswerInfo');
var othersCostCon = $('#othersCost');
var $scope = {};
var $platformCurrencyList;
var $currencySymbol;
var $priceDecimalNum;
var $amountDecimalNum;
var $prodMapList = [];
var $fileData;
var $btnTxet = '分批答交';
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;

var orderDajiao = function(){
	this.init();
}

orderDajiao.prototype = {
	init:function(){
	    $scope.delPoOthreCostList = [];//删除其他费用主键列表
	    $scope.addPoFileList = [];//供应商新上传的答交附件列表
	    $scope.delPoFileList = [];//供应商新删除的答交附件主键ID列表
	    setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);
		this.start();
	},
	start:function(){
		var that = this, success = true;

		//订单信息
		function getOrderInfo(){
			var html = '';
			var param = {"serviceId":"B03_getPurchaseOrderAnswerInfo", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam": commonParam()};
			GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.orderInfo = data.poAnswerOrderInfo;
					success = true;
            		html += '<h2 class="m-title">基础信息</h2>'
            			 +'<div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>平台单号：</span><b>'+ $scope.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>内部单号：</span><b>'+ $scope.orderInfo.poInsideNo +'</b></li>'
						 +'		<li><span>客户：</span><b>'+ $scope.orderInfo.companyCode + '-' + $scope.orderInfo.companyAbbr +'</b></li>'
						 +'		<li><span>交易币别：</span>'+ $scope.orderInfo.currencyName +'</li>'
						 +'		<li><span>交易税别：</span>'+ $scope.orderInfo.taxName + '<label class="checkbox'+ (($scope.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ $scope.orderInfo.taxRate*100 +'%</label></li>'
						 +'		<li><span>交易条件：</span>'+ $scope.orderInfo.conditionName +'</li>'
						 +'		<li><span>付款条件：</span>'+ $scope.orderInfo.payWayName +'</li>'
						 +'		<li><span>采购日期：</span>'+ $scope.orderInfo.poFormDate +'</li>'
						 +'	</ul>'
						 +'</div>'
					$('#orderInfo').html(html);

					//客户其他费用合计
		            $scope.orderInfo.cOtherCostTotal = $scope.orderInfo.cOtherCostTotal ? $scope.orderInfo.cOtherCostTotal : 0;
		            //本方其他费用合计
		            $scope.orderInfo.vOtherCostTotal = $scope.orderInfo.vOtherCostTotal ? $scope.orderInfo.vOtherCostTotal : 0;

					//获取所有平台币种及小数位
					var CurrencyParam = {"serviceId":"B01_queryAllPlatformCurrency", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()};
					GetAJAXData('POST',CurrencyParam,function(unitdata){
						if(unitdata.success){
							$platformCurrencyList = unitdata;
							for(var i=0, l=unitdata.platformCurrencyList.length; i<l; i++){
								if(unitdata.platformCurrencyList[i].currencyCode == $scope.orderInfo.pCurrencyCode){
									$currencySymbol = unitdata.platformCurrencyList[i].currencySymbol;
									$priceDecimalNum = unitdata.platformCurrencyList[i].priceDecimalNum;
									$amountDecimalNum = unitdata.platformCurrencyList[i].amountDecimalNum;
									return false;
								}
							}
						}
					});

		            // //订单状态名称
		            // $scope.orderStatusName = "";
		            // var promiseOrderStatus = enumService.getValue('B03_POVStatus', $scope.orderInfo.vStatus);
		            // promiseOrderStatus.then(function (data) {
		            //     $scope.orderStatusName = data;
		            // });
		            // //物流方式名称
		            // $scope.logisticsTypeName = "";
		            // var promiseLogistics = enumService.getValue('B02_LogisticsType', $scope.orderInfo.logisticsType);
		            // promiseLogistics.then(function (data) {
		            //     $scope.logisticsTypeName = data;
		            // });
		            // //物流商名称
		            // $scope.logisticsName = "";
		            // if ($scope.orderInfo.logisticsType != 3) {
		            //     $scope.logisticsName = $scope.orderInfo.logisticsName;
		            // }
		            // //发票类型
		            // $scope.invoiceTypeName = "";
		            // var promiseInvoiceType = enumService.getValue('B02_InvoiceType', $scope.orderInfo.invoiceType);
		            // promiseInvoiceType.then(function (data) {
		            //     $scope.invoiceTypeName = data;
		            // });
		            // //发票信息(统一开票/无需发票/按单开票)
		            // $scope.invoiceInfoName = "";
		            // var promiseInvoiceInfoName = enumService.getValue('B02_Invoice', $scope.orderInfo.invoice);
		            // promiseInvoiceInfoName.then(function (data) {
		            //     $scope.invoiceInfoName = data;
		            // });

				}else{
					container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					success = false;
				}
			});			
		}


		//订单信息
		function getProductDetails(){
			var html = '';
			var param = {"serviceId":"B03_findPoAnswerLineList", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam": commonParam()};
			GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.poLineList = data.poLineList;
					success = true;
            		html += '<h2 class="m-title">产品明细</h2>'
            		$scope.poLineList.forEach(function(val,i){
            			if (!val.vProdName) {
		                    val.vPurchaseQty = val.purchaseQty;//采购数量
		                    val.vValuationQty = val.valuationQty;//计价数量
		                    val.vExpectedDelivery = val.expectedDelivery;
		                    val.vAnswerUnitName = val.purchaseUnitName;//采购单位
		                    val.vAnswerUnitId = val.purchaseUnitId;//采购单位主键
		                    val.vAnswerUnitCode = val.purchaseUnitCode;//采购单位编码
		                    val.vValuationUnitId = val.valuationUnitId;
		                    val.vValuationUnitCode = val.valuationUnitCode;
		                    val.vValuationUnitName = val.valuationUnitName;//计价单位
		                    val.vPrice = val.price;//未税单价
		                    val.vTaxPrice = val.taxPrice;//含税单价
		                    val.vLineAmount = val.lineAmount;//未税总计
		                    val.vTaxLineTotal = val.taxLineTotal;//含税总计

		                    //客户和产品关系中根据客户产品获取本方关联产品
							GetAJAXData('POST',{"serviceId":"B01_getProdByCustomerProd","token":_vParams.token,"secretNumber":_vParams.secretNumber,"vendorId":_vParams.vendorId,"cProdCode":val.prodCode,"commonParam":commonParam(),"customerId":$scope.orderInfo.companyId},function(jsonProduct){
								//如果接口返回数据则用接口数据，否则用客户的名称、规格
								if(jsonProduct.prodMap){
		                            val.vProdId = jsonProduct.prodMap.prodId;
		                            val.vProdCode = jsonProduct.prodMap.prodCode;//编码
		                            val.vProdName = jsonProduct.prodMap.prodName;
		                            val.vProdScale = jsonProduct.prodMap.prodScale;//规格
		                            val.vProdDesc = jsonProduct.prodMap.prodDesc;//描述
								}else{
		                            //无v的ProdName、ProdScale、ProdDesc，ID和CODE为空
		                            val.vProdName = val.prodName;
		                            val.vProdScale = val.prodScale;
		                            val.vProdDesc = val.prodDesc;									
								}
							})
		                } else if (!val.vPurchaseQty) {
		                    //带出默认值
		                    val.vPurchaseQty = val.purchaseQty;//采购数量
		                    val.vValuationQty = val.valuationQty;//计价数量
		                    val.vExpectedDelivery = val.expectedDelivery;
		                    val.vAnswerUnitName = val.purchaseUnitName;//采购单位
		                    val.vAnswerUnitId = val.purchaseUnitId;//采购单位主键
		                    val.vAnswerUnitCode = val.purchaseUnitCode;//采购单位编码
		                    val.vValuationUnitId = val.valuationUnitId;
		                    val.vValuationUnitCode = val.valuationUnitCode;
		                    val.vValuationUnitName = val.valuationUnitName;//计价单位
		                    val.vPrice = val.price;//未税单价
		                    val.vTaxPrice = val.taxPrice;//含税单价
		                    val.vLineAmount = val.lineAmount;//未税总计
		                    val.vTaxLineTotal = val.taxLineTotal;//含税总计
		                }
		                //本方采购数量和计价数量
		                // val.vPurchaseQty = $filter('fmnumber')(val.vPurchaseQty, val.purchaseUnitCode);
		                // val.vValuationQty = $filter('fmnumber')(val.vValuationQty, val.valuationUnitCode);
		                //本方未税单价和含税单价
		                // val.vPrice = $filter('fmcurrency')(val.vPrice, 'price', $scope.orderInfo.pCurrencyCode, true);
		                // val.vTaxPrice = $filter('fmcurrency')(val.vTaxPrice, 'price', $scope.orderInfo.pCurrencyCode, true);

		                val.defaultvPurchaseQty = val.vPurchaseQty;//采购数量
		                val.defaultvValuationQty = val.vValuationQty;//计价数量
		                val.defaultvExpectedDelivery = val.vExpectedDelivery;

		                // val.poSubLineList.forEach(function (sub, subKey) {
		                //     sub.purchaseQty = $filter('fmnumber')(sub.purchaseQty, val.purchaseUnitCode);
		                //     sub.valuationQty = $filter('fmnumber')(sub.valuationQty, val.valuationUnitCode);
		                // })
						
						//初始化
                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li><span>物料编码：</span><b>'+ val.prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ val.prodName +' '+ val.prodScale +'</p></li>'
							+'		<li><section><span>客户数量：</span><em>'+ val.purchaseQty +'</em>'+ val.purchaseUnitName +'/<em>'+ val.valuationQty +'</em>'+ val.valuationUnitName +'</section><section><span>交期：</span><em>'+ val.expectedDelivery +'</em></section></li>'
							+		(($scope.orderInfo.vStatus==1)? '' : ((val.poSubLineList.length==0) ? '<li class="bfline"><section><span>本方数量：</span><em>'+ val.vPurchaseQty +'</em>'+ val.vAnswerUnitName +'/<em>'+ val.valuationQty +'</em>'+ val.vValuationUnitName +'</section><section><span>交期：</span><em>'+ val.vExpectedDelivery +'</em></section></li>' : ''))
						for(var j=0; j<val.poSubLineList.length; j++){
							html+='<li class="response"><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>分批答交：</span><em>'+ val.poSubLineList[j].purchaseQty +'</em>'+ val.purchaseUnitName +'/<em>'+ val.poSubLineList[j].valuationQty +'</em>'+ val.valuationUnitName +'</section><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>交期：</span><em class="expectedDelivery">'+ val.poSubLineList[j].expectedDelivery +'</em></section></li>'
						}
						html+='		<li class="price"><span>单价：</span>'+ $currencySymbol + (($scope.orderInfo.isContainTax===1) ? formatMoney(val.taxPrice) : formatMoney(val.price)) +'/'+ val.valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ val.remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(val.taxLineTotal) +'</b></li>'
							+		(($scope.orderInfo.vStatus!=1)?'<li class="response responseTotal"><span>答交小计：</span>'+ $currencySymbol + formatMoney(val.vTaxLineTotal) +'</li>':'')
							+'	</ul>'
							+( $scope.orderInfo.vStatus==2 ? '<span class="edit"></span>' : '')
							+'</div>'						
            		})

					$('#linelist').html(html);
				}else{
					container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
				}
			});			
		}
		
	    //计算分批答交总采购数量(本方总数量可以大于客户采购数量)
	    function culcatFenPiCaiGouCount(product, subProduct) {
	        if (!subProduct.purchaseQty) {
	            return;
	        }
	        var useQty = 0;
	        //计价数量/采购数量=比率
	        var rate = product.valuationQty / product.purchaseQty;
	        //分批答交列表
	        angular.forEach(product.poSubLineList, function (val, key) {
	            useQty += parseFloat(val.purchaseQty ? val.purchaseQty : 0);
	        });
	        //计算当前分批答交的计价数量
	        subProduct.valuationQty = $filter('fmnumber')(subProduct.purchaseQty * rate, product.valuationUnitCode);
	        //分批答交后总的采购数量
	        product.vPurchaseQty = $filter('fmnumber')(useQty, product.purchaseUnitCode);
	        product.vValuationQty = $filter('fmnumber')(useQty * rate, product.valuationUnitCode);
	        oneProductPriceCulcalate(product);
	        calculateCost();
	    };

	    //计算(本方总数量可以大于客户采购数量)
	    function culcatCaiGouCount(product) {
	        if (!product.vPurchaseQty) {
	            return;
	        }
	        //计价数量/采购数量
	        var rate = product.valuationQty / product.purchaseQty;
	        var vValuationQty = product.vPurchaseQty * rate;
	        product.vValuationQty = $filter('fmnumber')(vValuationQty, product.valuationUnitCode);

	        oneProductPriceCulcalate(product);
	        calculateCost();
	    };

	    //计算含税单价
	    function containTaxPrice(product) {
	        if (!product.vPrice) {
	            return;
	        }
	        var rate = parseFloat($scope.orderInfo.taxRate) ? parseFloat($scope.orderInfo.taxRate) : 0,
	            price = parseFloat(product.vPrice) ? parseFloat(product.vPrice) : 0;
	        var vTaxPrice = 0;//含税单价
	        if (rate && price) {
	            vTaxPrice = ( price * (1 + rate)).toFixed(10) * 1;
	        } else {
	            if (price > 0) {
	                vTaxPrice = price;
	            } else {
	                vTaxPrice = 0;
	            }
	        }
	        product.vTaxPrice = $filter('fmcurrency')(vTaxPrice, 'price', $scope.orderInfo.pCurrencyCode, true);
	        oneProductPriceCulcalate(product);
	        calculateCost();
	    };

	    //计算 不含税单价
	    function noContainTaxPrice(product) {
	        if (!product.vTaxPrice) {
	            return;
	        }
	        var rate = parseFloat($scope.orderInfo.taxRate) ? parseFloat($scope.orderInfo.taxRate) : 0;
	        //vTaxPrice:含税单价
	        var price = parseFloat(product.vTaxPrice) ? parseFloat(product.vTaxPrice) : 0;
	        var vPrice = 0;//不含税单价
	        if (rate && price) {
	            vPrice = (price / (1 + rate)).toFixed(10) * 1
	        } else {
	            if (price > 0) {
	                vPrice = price;
	            } else {
	                vPrice = 0;
	            }
	        }
	        product.vPrice = $filter('fmcurrency')(vPrice, 'price', $scope.orderInfo.pCurrencyCode, true);
	        oneProductPriceCulcalate(product);
	        calculateCost();
	    };

	    //计算页面中各个位置的供应商的相关费用(客户的费用因为不变所以不用计算)
	    function calculateCost() {
	        var noTaxTotal = 0,//未税总额
	            hasTaxTotal = 0,//含税总额
	            otherTotal = 0,//其他费用
	            orderTotal = 0;//订单总金额
	        //产品明细列表
	        $scope.poLineList.forEach(function (val, key) {
	            noTaxTotal += parseFloat(val.vLineAmount);
	            hasTaxTotal += parseFloat(val.vTaxLineTotal);
	        });
	        //其他费用列表
	        $scope.otherCost.forEach(function (val, key) {
	            //供应商答复金额
	            otherTotal += parseFloat(val.vCostAmount);
	        });
	        orderTotal = hasTaxTotal + otherTotal;
	        noTaxTotal = noTaxTotal.toFixed(10);
	        hasTaxTotal = hasTaxTotal.toFixed(10);
	        $scope.orderInfo.vTaxTotal = hasTaxTotal;//含税总金额
	        $scope.orderInfo.vTotal = noTaxTotal;//未税总金额
	        $scope.orderInfo.vOtherCostTotal = otherTotal;//其他费用总金额
	        $scope.orderInfo.vTotalAmount = orderTotal;//订单总金额
	    }

	    //单个产品的含税金额和未税金额计算
	    function oneProductPriceCulcalate(product) {
	        //不含税金额=不含税单价*计价数量
	        //含税金额=含税单价*计价数量
	        //未税金额
	        product.vLineAmount = product.vValuationQty * product.vPrice;
	        //含税金额
	        product.vTaxLineTotal = product.vValuationQty * product.vTaxPrice;
	        //值异常判断
	        product.vLineAmount = parseFloat(product.vLineAmount) ? parseFloat(product.vLineAmount).toFixed(10) : 0;
	        product.vTaxLineTotal = parseFloat(product.vTaxLineTotal) ? parseFloat(product.vTaxLineTotal).toFixed(10) : 0;
	    }


	    //获取其他费用
	    function getOtherCost() {
	    	var html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
	        var param = {"serviceId":"B03_findPoAnswerOtherCostList", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam":commonParam()};
	        GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.otherCost = data.poOthreCostList;
					$scope.otherCost.forEach(function(val, key){
						if (!val.vCostAmount || val.vCostAmount == 0) {
		                    val.vCostAmount = val.costAmount;
		                    $scope.orderInfo.vOtherCostTotal = $scope.orderInfo.cOtherCostTotal;
		                }
		                html += '<li class="mobiCostItem costItem"><span>'+ val.costName +'：</span><b>'+ $currencySymbol + formatMoney(val.costAmount) +'</b>'+ (($scope.orderInfo.vStatus==1) ? '' : '<b class="dj"><em class="money">'+ formatMoney(val.vCostAmount) +'</em></b>') +'</li>';
					})
					html+='<li id="othersCostSubtotal" class="subtotal"><span>客户小计：</span><b>'+ $currencySymbol + formatMoney($scope.orderInfo.cOtherCostTotal) +'</b></li>'
            		if($scope.orderInfo.vStatus!=1){
            			html+='<li id="changeCost" class="response"><span>本方小计：</span>'+ $currencySymbol + formatMoney($scope.orderInfo.vOtherCostTotal) +'</li>'            			
            		}
            		html+='</ul>'
            		html+=( $scope.orderInfo.vStatus==2 ? '<span class="edit editOther"></span>' : '' )
            		html+='</div>';
            		$('#othersCost').html(html);

					$scope.otherCost.sort(function (a1, a2) {
		                return a1.lineNo - a2.lineNo;
		            });
				}
			});
	    };
	    //增加一条其他费用
	    function addOneOtherCost() {
	        $scope.otherCost = $scope.otherCost || [];
	        var len = $scope.otherCost.length;
	        var maxLineNo;
	        if (len > 0) {
	            maxLineNo = $scope.otherCost[len - 1].lineNo;
	        }
	        if (!maxLineNo) {
	            maxLineNo = 0;
	        }
	        //costSource = 1：客户(不能删除)，2：供应商
	        var cost = {
	            "lineNo": maxLineNo + 1,
	            "isNewAdd": true,//是否页面上新增加的
	            "costName": "",
	            "costSource": 2,
	            "costAmount": 0,
	            "remark": "",
	            "vCostAmount": 0,
	            "vRemark": ""
	        };
	        $scope.otherCost.push(cost);
	    };
	    //批量删除其他费用
	    function delBatchOtherCost() {
	        if (!$scope.otherCost || $scope.otherCost.length == 0) {
	            return;
	        }
	        var isCheck = false;
	        for (var j = 0, len = $scope.otherCost.length; j < len; j++) {
	            //costSource = 1：客户(不能删除)，2：供应商
	            if ($scope.otherCost[j].isChecked) {
	                isCheck = true;
	                break;
	            }
	        }
	        if (!isCheck) {
	            zhlModalTip('您没有选中任何一项费用');
	            return;
	        }
	        zhlModalTip('您确定要删除选中的费用？', function () {
	            for (var i = $scope.otherCost.length - 1; i >= 0; i--) {
	                //costSource = 1：客户(不能删除)，2：供应商
	                if ($scope.otherCost[i].isChecked && $scope.otherCost[i].costSource == 2) {
	                    if ($scope.otherCost[i].costId) {
	                        //添加到删除列表
	                        $scope.delPoOthreCostList.push($scope.otherCost[i].costId);
	                    }
	                    $scope.otherCost.splice(i, 1);
	                }
	            }
	            $scope.changeOtherCost();
	            $scope.$apply();
	        }, function () {
	        });
	    };
	    //删除一条其他费用
	    function delOneOtherCost(item) {
	        zhlModalTip('您确定要删除此条费用？', function () {
	            if (item.costId) {
	                //添加到删除列表
	                $scope.delPoOthreCostList.push(item.costId);
	            }
	            var idx = $scope.otherCost.indexOf(item);
	            $scope.otherCost.splice(idx, 1);
	            $scope.changeOtherCost();
	            $scope.$apply();
	        }, function () {
	        });
	    };
	    //其他费用中输入框值改变
	    function changeOtherCost(vCostAmount) {
	        if (!vCostAmount) {
	            return;
	        }
	        var otherTotal = 0,//其他费用
	            orderTotal = 0;//订单总金额
	        //其他费用列表
	        angular.forEach($scope.otherCost, function (val, key) {
	            //供应商答复金额
	            otherTotal += parseFloat(val.vCostAmount);
	        });
	        orderTotal = parseFloat($scope.orderInfo.vTaxTotal) + otherTotal;
	        $scope.orderInfo.vOtherCostTotal = otherTotal;//其他费用总金额
	        $scope.orderInfo.vTotalAmount = orderTotal;//订单总金额
	    };


    	//调用
		getOrderInfo();
		getProductDetails();
		getOtherCost()
	}
}