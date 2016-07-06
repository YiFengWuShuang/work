/*
 *订单答交 未使用
 */
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

		                val.defaultvPurchaseQty = val.vPurchaseQty;//采购数量
		                val.defaultvValuationQty = val.vValuationQty;//计价数量
		                val.defaultvExpectedDelivery = val.vExpectedDelivery;
						
						//初始化
                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li><span>物料编码：</span><b>'+ val.prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ val.prodName +' '+ val.prodScale +'</p></li>'
							+		(($scope.orderInfo.vStatus!=4)?'<li><section><span>客户数量：</span><em>'+ val.purchaseQty +'</em>'+ val.purchaseUnitName +'/<em>'+ val.valuationQty +'</em>'+ val.valuationUnitName +'</section><section><span>交期：</span><em>'+ val.expectedDelivery +'</em></section></li>':'')
							+		(($scope.orderInfo.vStatus==1)? '' : ((val.poSubLineList.length==0) ? '<li class="bfline"><section><span>本方数量：</span><em>'+ val.vPurchaseQty +'</em>'+ val.vAnswerUnitName +'/<em>'+ val.valuationQty +'</em>'+ val.vValuationUnitName +'</section><section><span>交期：</span><em>'+ val.vExpectedDelivery +'</em></section></li>' : ''))
						for(var j=0; j<val.poSubLineList.length; j++){
							html+='<li class="response"><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>分批答交：</span><em>'+ val.poSubLineList[j].purchaseQty +'</em>'+ val.purchaseUnitName +'/<em>'+ val.poSubLineList[j].valuationQty +'</em>'+ val.valuationUnitName +'</section><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>交期：</span><em class="expectedDelivery">'+ val.poSubLineList[j].expectedDelivery +'</em></section></li>'
						}
						html+='		<li class="price"><span>单价：</span>'+ $currencySymbol + (($scope.orderInfo.isContainTax===1) ? formatMoney(val.taxPrice) : formatMoney(val.price)) +'/'+ val.valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ val.remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal"><span>含税小计：</span><b>'+ $currencySymbol + formatMoney(val.taxLineTotal) +'</b></li>'
							+		(($scope.orderInfo.vStatus!=1 && $scope.orderInfo.vStatus!=4)?'<li class="response responseTotal"><span>答交小计：</span>'+ $currencySymbol + formatMoney(val.vTaxLineTotal) +'</li>':'')
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
		
	    //计算分批答交总采购数量
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

	    /*附件start*/
	    //单头--订单附件列表
	    function getfileList(parentid) {
	        $scope.orderFileList = [];
	        var param = {
	        	"token":_vParams.token,
	        	"secretNumber":_vParams.secretNumber,
	        	"serviceId":"B01_findFileList",
	            "docType": 24,//客户订单
	            "searchType": 1,//查询类型1单头2单身
	            "fileSource": 2,//附件类型（1-客户，2-供应商）
	            "companyId": $scope.orderInfo.vendorId,
	            "id": parentid
	        };
	        GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.orderFileList = [];
					data.fileList.forEach(function(v){
		                $scope.orderFileList.push({
		                    "id": v.id,
		                    "fileName": v.fileName,
		                    "fileSize": v.fileSize,
		                    "fileUrl": v.fileUrl,
		                    "lineNo": v.lineNo
		                });
					})
				}
			});
	    };
	    //单头--客户上传的附件
	    function getCustomerfileList(parentid) {
	        $scope.orderCustomerFileList = [];
	        var param = {
	        	"token":_vParams.token,
	        	"secretNumber":_vParams.secretNumber,
	        	"serviceId":"B01_findFileList",
	            "docType": 24,//客户订单
	            "searchType": 1,//查询类型1单头2单身
	            "fileSource": 2,//附件类型（1-客户，2-供应商）
	            "companyId": $scope.orderInfo.vendorId,
	            "id": parentid
	        };
	        GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.orderCustomerFileList = [];
					data.fileList.forEach(function(v){
		                $scope.orderCustomerFileList.push({
		                    "id": v.id,
		                    "fileName": v.fileName,
		                    "fileSize": v.fileSize,
		                    "fileUrl": v.fileUrl,
		                    "lineNo": v.lineNo
		                });
					})
				}
			});
	    };
	    //单身---供应商--附件列表
	    function getDanShenfileVendorList(product, parentid) {
	        product.danShenfileList = [];
	        var param = {
	        	"token":_vParams.token,
	        	"secretNumber":_vParams.secretNumber,
	        	"serviceId":"B01_findFileList",
	            "docType": 24,//客户订单
	            "searchType": 2,//查询类型1单头2单身
	            "fileSource": 2,//附件类型（1-客户，2-供应商）
	            "companyId": $scope.orderInfo.vendorId,
	            "id": parentid
	        };	        
	         GetAJAXData('POST',param,function(response) {
	            if (!response.success) {
	                return;
	            }
	            product.danShenfileList = [];
	            response.fileList.forEach(function (v) {
	                product.danShenfileList.push({
	                    "id": v.id,
	                    "fileName": v.fileName,
	                    "fileSize": v.fileSize,
	                    "fileUrl": v.fileUrl,
	                    "lineNo": v.lineNo
	                });
	            });
	        });
	    };

	    /*保存答交,
	     * vStatus:2-保存 3-提交
	     */

	    //提交答交
	    function submitDaJiao(){
	        $scope.isSubmitData = true;
	        submitForm();
	    };
	    //提交
	    var isSubmiting = false;
	    function submitForm(){
	        // if (!$scope.orderForm.$valid) {
	        //     return;
	        // }
	        if (isSubmiting) {
	            return;
	        }
	        isSubmiting = true;

	        var param = getParam();
	        for (var j = 0; j < param.modiPoLineList.length; j++) {
	            //如果有任意一个产品的分批答交不符合条件，则提示
	            if (param.modiPoLineList[j].isErrorFenPi) {
	                isSubmiting = false;
	                zhlModalTip('分批答交信息不能和初始值一样，不允许此种情况的答交');
	                return;
	            }
	        }
	        //2-保存 3-提交
	        //提交答交
	        if ($scope.isSubmitData) {
	            param.vStatus = 3;
	        } else {
	            //保存答交
	            param.vStatus = 2;
	        }

	        popup('confirm', '', '您确定提交答交吗？', function(){
				//取消
			},function(){
				//答交提交
		        GetAJAXData('POST',param,function (json) {
		            isSubmiting = false;
		            if (!json.success) {
		                popup('alert','',json.errorMsg);
		                return;
		            }
		            $scope.docNo = json.poFormNo;
		            if ($scope.isSubmitData) {
		                $scope.submitSuccess = true;//提交成功
						fnTip.success(2000);
		            	setTimeout(function(){window.location.reload(true)},2000);		             
		            } else {
		                //保存答交
		                $scope.saveSuccess = true;//保存成功
		            }
		        });

			})
	    };

	    //拒绝接单
	    function refuse(){
			popup('confirm', '', '您确定要拒绝接单么？<br/>拒绝后的订单，将不能恢复。', function(){
				//取消
			},function(){
				var vendorRefuseReceiveParam = { "token": _vParams.token, "secretNumber":_vParams.secretNumber, "serviceId":"B03_vendorRefuseReceivePoAnswer", "poAnswerId":_vParams.poAnswerId, "vendorId":_vParams.vendorId, "commonParam":commonParam()}
				that.vendorPoAnswer(vendorRefuseReceiveParam,function(){
					popup('alert','','拒绝订单成功','',function(){
						goBack();
					})
				},true);
			})
	    };

	    //分批答交
	    function fenPiDaJiao(product) {
	        product.vBatchAnswer = 1;
	        $scope.addFenPi(product);
	    };
	    //新增分批答交
	    function addFenPi(product) {
	        product.poSubLineList = product.poSubLineList || [];
	        product.poSubLineList.sort(function (a1, a2) {
	            return a1.lineNo - a2.lineNo;
	        });
	        //客户计价数量/采购数量
	        var rate = product.valuationQty / product.purchaseQty,
	            useQty = 0,//其他分批答交已用采购数量
	            defaultCaiGouQty = 0,//分批答交默认采购数量
	            defaultJiJiaQty = 0;//分批答交默认计价数量
	        //分批答交列表
	        angular.forEach(product.poSubLineList, function (val, key) {
	            useQty += parseFloat(val.purchaseQty);
	        });
	        defaultCaiGouQty = product.purchaseQty - useQty;
	        defaultJiJiaQty = defaultCaiGouQty * rate;
	        //异常值处理
	        defaultCaiGouQty = (!defaultCaiGouQty || defaultCaiGouQty < 0) ? '' : defaultCaiGouQty;
	        defaultJiJiaQty = (!defaultJiJiaQty || defaultJiJiaQty < 0) ? '' : parseFloat(defaultJiJiaQty);
	        //格式化采购数量和计价数量
	        if (defaultCaiGouQty) {
	            defaultCaiGouQty = $filter('fmnumber')(defaultCaiGouQty, product.purchaseUnitCode);
	            defaultJiJiaQty = $filter('fmnumber')(defaultJiJiaQty, product.valuationUnitCode);
	        }

	        //分批答交后总的采购数量
	        product.vPurchaseQty = $filter('fmnumber')(product.defaultvPurchaseQty, product.purchaseUnitCode);
	        product.vValuationQty = $filter('fmnumber')(product.defaultvValuationQty, product.valuationUnitCode);

	        //设置默认值
	        var len = product.poSubLineList.length;
	        var maxLineNo = 0;
	        if (len > 0) {
	            maxLineNo = product.poSubLineList[len - 1].lineNo;
	        }
	        if (!maxLineNo) {
	            maxLineNo = 0;
	        }
	        product.poSubLineList.push({
	            "lineNo": maxLineNo + 1,
	            "isNewAdd": true,//是否页面上新增加的
	            "purchaseQty": defaultCaiGouQty,//采购数量
	            "purchaseUnit": product.vAnswerUnitName,//采购单位
	            "valuationQty": defaultJiJiaQty,//计价数量
	            "valuationUnit": product.vValuationUnitName,//计价单位
	            "expectedDelivery": product.vExpectedDelivery//默认使用本方的交期(本方交期的默认值已经在加载表头时设置过了)
	        });
	        oneProductPriceCulcalate(product);
	        calculateCost();
	    };
	    //删除一个分批答交
	    function delOneFenPiJiaoQi(product, subProduct) {
	        product.poSubLineList = product.poSubLineList || [];
	        product.delPoSubLineList = product.delPoSubLineList || [];
	        zhlModalTip('您确定要删除此条答交？', function () {
	            //计价数量/采购数量=比率
	            var useQty = 0,
	                rate = product.valuationQty / product.purchaseQty;

	            if (subProduct.subId) {
	                //添加到删除列表
	                product.delPoSubLineList.push(subProduct.subId);
	            }
	            var idx = product.poSubLineList.indexOf(subProduct);
	            product.poSubLineList.splice(idx, 1);

	            if (product.poSubLineList.length == 0) {
	                product.vBatchAnswer = 0;
	                product.poSubLineList = [];//清空分批答交数组
	                product.vPurchaseQty = product.defaultvPurchaseQty;
	                product.vValuationQty = product.defaultvValuationQty;
	                product.vExpectedDelivery = product.defaultvExpectedDelivery;
	            } else {
	                //计算，分批答交列表
	                angular.forEach(product.poSubLineList, function (val, key) {
	                    useQty += parseFloat(val.purchaseQty);
	                });
	                //分批答交后总的采购数量
	                product.vPurchaseQty = useQty;
	                product.vValuationQty = useQty * rate;
	            }
	            //计算单身
	            oneProductPriceCulcalate(product);
	            //计算所有
	            calculateCost();
	            $scope.$apply();
	        }, function () {
	        });

	    };


	    //重置查询参数
	    function getParam() {
	        $scope.orderInfo = $scope.orderInfo || [];//订单单头信息
	        $scope.addPoOtherCostList = [];//新增的其他费用
	        $scope.modiPoOthreCostList = [];//修改的其他费用
	        $scope.otherCost = $scope.otherCost || [];
	        $scope.products = $scope.products || [];
	        $scope.fileList = $scope.fileList || [];

	        //其他费用
	        for (var i = 0, len = $scope.otherCost.length; i < len; i++) {
	            //新增的其他费用
	            if ($scope.otherCost[i].isNewAdd) {
	                $scope.addPoOtherCostList.push($scope.otherCost[i]);
	            } else if ($scope.otherCost[i].costId) {
	                $scope.modiPoOthreCostList.push($scope.otherCost[i]);
	            }
	        }
	        //产品单身明细列表
	        var modiPoLineList = [];
	        var productObj;
	        //遍历产品单身明细列表
	        for (var j = 0, jLen = $scope.products.length; j < jLen; j++) {
	            var danshen = {};
	            productObj = $scope.products[j];
	            productObj.addPoLineFileList = [];//新增的单身附件列表
	            productObj.addPoSubLineList = [];//新增的分批答交
	            productObj.modiPoSubLineList = [];//修改的分批答交
	            danshen.isErrorFenPi = true;  //本产品的分批答交是否 不符合条件

	            //遍历子单身
	            for (var n = 0, fLen = productObj.poSubLineList.length; n < fLen; n++) {
	                var sub = productObj.poSubLineList[n];
	                var newObj = {};

	                if (danshen.isErrorFenPi) {
	                    //设置了分批答交
	                    if (productObj.vBatchAnswer == 1) {
	                        //答交页，如果分批答交交期不变，数量总数与变更前一样，前端需要判断提示错误信息
	                        if (sub.expectedDelivery != productObj.defaultvExpectedDelivery) {
	                            danshen.isErrorFenPi = false;
	                        }
	                        if ((productObj.defaultvPurchaseQty * 1) != (productObj.vPurchaseQty * 1)) {
	                            danshen.isErrorFenPi = false;
	                        }
	                    } else {
	                        danshen.isErrorFenPi = false;
	                    }
	                }

	                newObj.expectedDelivery = new Date(sub.expectedDelivery).getTime();
	                newObj.purchaseQty = sub.purchaseQty;
	                newObj.purchaseUnit = sub.purchaseUnit;
	                newObj.valuationQty = sub.valuationQty;
	                newObj.valuationUnit = sub.valuationUnit;
	                newObj.lineNo = sub.lineNo;
	                newObj.answerSubLineId = sub.subId;

	                //新增的分批答交子单身
	                if (sub.isNewAdd) {
	                    productObj.addPoSubLineList.push(newObj);
	                } else if (sub.subId) {
	                    //修改的分批答交子单身
	                    productObj.modiPoSubLineList.push(newObj);
	                }
	            }
	            //无分批答交
	            if (productObj.poSubLineList.length == 0) {
	                danshen.isErrorFenPi = false;
	            }
	            //单身附件
	            if (productObj.danShenfileList) {
	                for (var m = 0, dsLen = productObj.danShenfileList.length; m < dsLen; m++) {
	                    var fileDanShen = productObj.danShenfileList[m];
	                    if (fileDanShen.isDeleted) {
	                        productObj.delPoLineFileList.push(fileDanShen.id);
	                    } else if (!fileDanShen.id) {
	                        productObj.addPoLineFileList.push({
	                            lineNo: fileDanShen.lineNo,
	                            fileUrl: fileDanShen.fileUrl,
	                            fileSize: fileDanShen.fileSize,
	                            fileName: fileDanShen.fileName
	                        });
	                    }
	                }
	            }
	            //遍历单身
	            danshen.poAnswerLineId = productObj.id;
	            danshen.vProdId = productObj.vProdId;
	            danshen.vProdCode = $.trim(productObj.vProdCode);
	            danshen.vProdDesc = $.trim(productObj.vProdDesc);
	            danshen.vProdScale = $.trim(productObj.vProdScale);
	            danshen.vProdName = $.trim(productObj.vProdName);
	            danshen.isBatchAnswer = productObj.vBatchAnswer;//批次答交
	            danshen.vPurchaseQty = productObj.vPurchaseQty;//采购数量
	            danshen.vValuationQty = productObj.vValuationQty;//计价数量
	            danshen.vExpectedDelivery = new Date(productObj.vExpectedDelivery).getTime();
	            danshen.vPrice = productObj.vPrice;
	            danshen.vTaxPrice = productObj.vTaxPrice;
	            danshen.vRemark = productObj.vRemark;
	            danshen.vLineAmount = productObj.vLineAmount;
	            danshen.vTaxLineTotal = productObj.vTaxLineTotal;
	            danshen.vAnswerUnitId = productObj.vAnswerUnitId;
	            danshen.vAnswerUnitCode = productObj.vAnswerUnitCode;
	            danshen.vAnswerUnitName = productObj.vAnswerUnitName;
	            danshen.vValuationUnitId = productObj.vValuationUnitId;
	            danshen.vValuationUnitCode = productObj.vValuationUnitCode;
	            danshen.vValuationUnitName = productObj.vValuationUnitName;
	            //子单身相关数据的几个列表
	            danshen.addPoSubLineList = productObj.addPoSubLineList ? productObj.addPoSubLineList : [];
	            danshen.modiPoSubLineList = productObj.modiPoSubLineList ? productObj.modiPoSubLineList : [];
	            danshen.delPoSubLineList = productObj.delPoSubLineList ? productObj.delPoSubLineList : [];
	            //供应商产品单身上传的附件的相关数据
	            //danshen.fileCount=;
	            danshen.vFileCount = productObj.addPoLineFileList.length;
	            danshen.addPoLineFileList = productObj.addPoLineFileList ? productObj.addPoLineFileList : [];
	            danshen.delPoLineFileList = productObj.delPoLineFileList ? productObj.delPoLineFileList : [];
	            modiPoLineList.push(danshen);
	        }
	        //单头---订单上传的附件
	        for (var f = 0, fiLen = $scope.orderFileList.length; f < fiLen; f++) {
	            var fileOut = $scope.orderFileList[f];
	            if (fileOut.isDeleted) {
	                $scope.delPoFileList.push(fileOut.id);
	            } else if (!fileOut.id) {
	                $scope.addPoFileList.push({
	                    lineNo: fileOut.lineNo,
	                    fileUrl: fileOut.fileUrl,
	                    fileSize: fileOut.fileSize,
	                    fileName: fileOut.fileName
	                });
	            }
	        }
	        return {
	            "vStatus": "3",//2-保存 3-提交
	            "poAnswerId": $scope.poAnswerId,
	            "vendorId": $scope.vendorId,
	            "serviceId": "B03_saveAnswerPo",
	            "modiPoLineList": modiPoLineList,
	            "addPoOtherCostList": $scope.addPoOtherCostList,//添加其他费用列表
	            "modiPoOthreCostList": $scope.modiPoOthreCostList,//修改其他花费列表
	            "delPoOthreCostList": $scope.delPoOthreCostList, //删除其他费用主键列表
	            "vFeeInfo": {
	                "vTotal": $scope.orderInfo.vTotal,//供应商品无税总计
	                "vOtherCostTotal": $scope.orderInfo.vOtherCostTotal,//供应商其他费用总计
	                "vTaxTotal": $scope.orderInfo.vTaxTotal,//供应商品含税总计
	                "vTotalAmount": $scope.orderInfo.vTotalAmount//供应商合计
	            },
	            "addPoFileList": $scope.addPoFileList,//附件列表
	            "delPoFileList": $scope.delPoFileList,//删除文件主键
	            "vRemark": $scope.vRemark,
	            "lockVersion": that.orderInfo.lockVersion//锁版本
	        };
	    }


		function vendorPoAnswer(addparams,callBack,noReload){
			var that = this;
			$.ajax({
				type:"POST",
	            url:config.serviceUrl,
	            data: {
			        "param": JSON.stringify(addparams)
			    },
	            success:function(data){
	            	if(data.success){
	                	callBack&&callBack();
	                	if(noReload)return;
	                	setTimeout(function(){window.location.reload(true)},2000);
	            	}else{
	            		popup('alert','','提交失败：'+data.errorMsg)
	            	}
	            }
			})
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


    	//调用
		getOrderInfo();
		getProductDetails();
		getOtherCost();
		getfileList($scope.orderInfo.id);
		getCustomerfileList($scope.orderInfo.id);
	}
}