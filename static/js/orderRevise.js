/*
转销售订单
*/
var formTip = '<div id="formTip" class="formTip"></div>';
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var orderAnswerCon = $('#orderAnswerInfo');
var prodAnswerCon = $('#prodAnswerInfo');
var othersCostCon = $('#othersCost');
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var $scope = {};
var $currencyData = {};
var $taxData = {};
var $taxListData = {};
var $ExchangeRateData = {};
var $conditionData = {};
var $conditionJson = {};
var $payWayTypeData = {};
var $payWayData = {};
var $logisticsType = {};
var $AddrData = {};
var $fileData = {};
var $currencySymbol = '';
var $priceDecimalNum = '';
var $amountDecimalNum = '';
var addval_taxInfo = false;
var addval_conditionInfo = false;
var addval_paywayInfo = false;
var $myRemarkVal = '';
var privateDefultUser;
var orderRevise = function(){
	this.init();
}
orderRevise.prototype = {
	init: function(){
		var that = this;
		that.orderInfo;
		that._othersCost = [];
		that.totals = 0;
		that.load = false;
		that.memberId = '';
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);

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
		// 获取用户信息
		GetUserInfo("POST",{"token":_vParams.token,"secretNumber":_vParams.secretNumber},function(response){
			if(response.retCode == '01230'){
				privateDefultUser = response;
			}
		})
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
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data: {
		        "param": '{"poAnswerId":'+ _vParams.poAnswerId +',"vendorId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_getPurchaseOrderAnswerInfo", "commonParam":'+ that.commonParam +'}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.poAnswerOrderInfo;
            		that.memberId = that.orderInfo.poManId;
            		html += '<h2 class="m-title">基础信息</h2>'
            			 +'<div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>采购单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>客户单号：</span><b>'+ that.orderInfo.poInsideNo +'</b></li>'
						 +'		<li><span>所属公司：</span>'+ that.orderInfo.vendorName +'</li>'
						 +'		<li><span>客户：</span>'+ that.orderInfo.companyAbbr +'</li>'
						 +'		<li class="currencyName"><span>交易币别：</span>'+ that.orderInfo.currencyName +'</li>'
						 +'		<li id="taxName"><span>交易税别：</span><em>'+ that.orderInfo.taxName +'</em><label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
						 +'		<li><span>销售日期：</span>'+ transDate(new Date().getTime()) +'</li>'
						 +'	</ul>'
						 +' <span name="headInfos" class="edit"></span>'
						 +'</div>'
					
					// $('#j-dealType').val(that.orderInfo.conditionName);
					// $('#j-checkoutType').val(that.orderInfo.payWayName);
            	}
            }
		})
		return html;
	},
	//产品信息
	prodAnswerInfo: function(){
		var that = this, html = '';

	    //加载单身附件
	    function f_init_l_file(line){
	        line.vFileList = [];

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":24, "companyId":_vParams.companyId, "searchType":2, "id":line.id, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
				if(data.success){
					data.fileList.forEach(function(v){
	                    line.vFileList.push({
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
			async: false,
            url:config.serviceUrl,
		    data: {
		        "param": '{"poAnswerId":'+ _vParams.poAnswerId +',"vendorId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_findPoAnswerLineList", "commonParam":'+ that.commonParam +'}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var lineList = data.poLineList;
            		html = '<h2 class="m-title">产品明细</h2>';
            		for(var i=0, len=lineList.length; i<len; i++){
            			var unitName = true;
						if(lineList[i].vAnswerUnitName==lineList[i].vValuationUnitName){
							unitName = false;
						}

		                //提取供应商数据
		                var vPoInfo = {};
						//客户和产品关系中根据客户产品获取本方关联产品
						GetAJAXData('POST',{"serviceId":"B01_getProdByCustomerProd", "customerId": that.orderInfo.companyId,"cProdCode": lineList[i].prodCode, "vendorId": that.orderInfo.vendorId, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(jsonProduct){
							if (jsonProduct.prodMap) {
		                        vPoInfo.id = jsonProduct.prodMap.prodId;
		                        vPoInfo.prodCode = jsonProduct.prodMap.prodCode;//编码
		                        vPoInfo.prodName = jsonProduct.prodMap.prodName;
		                        vPoInfo.prodScale = jsonProduct.prodMap.prodScale;//规格
		                        vPoInfo.prodDesc = jsonProduct.prodMap.prodDesc;//描述
		                    } else {
		                        //无v的ProdName、ProdScale、ProdDesc，ID和CODE为空
		                        vPoInfo.id = '';
		                        vPoInfo.prodCode = '';
		                        vPoInfo.prodName = lineList[i].prodName;
		                        vPoInfo.prodScale = lineList[i].prodScale;
		                        vPoInfo.prodDesc = lineList[i].prodDesc;
		                    }
		                    lineList[i].vPoInfo = vPoInfo;
						});

                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li class="prodCode"><span>物料编码：</span><b>'+ lineList[i].vPoInfo.prodCode +'</b></li>'
							+'		<li class="prodDetail"><span>物料详细：</span><p>'+ lineList[i].vPoInfo.prodName +' '+ lineList[i].vPoInfo.prodScale +'</p></li>'
							+'		<li><section><span>数量：</span><em>'+ lineList[i].vPurchaseQty +'</em>'+ lineList[i].vAnswerUnitName + ((unitName) ? ('/<em>'+ lineList[i].vValuationQty +'</em>'+ lineList[i].vValuationUnitName) : '') +'</section><section><span>交期：</span><em>'+ lineList[i].expectedDelivery +'</em></section></li>'
							+'		<li class="price"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(lineList[i].vTaxPrice) : formatMoney(lineList[i].vPrice)) +'/'+ lineList[i].vValuationUnitName +'</li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal"><span>含税小计：</span><b>'+ $currencySymbol + formatMoney(lineList[i].vTaxLineTotal) +'</b></li>'
							+'	</ul>'
							+'  <span name="bodyInfos" class="edit"></span>'
							+'</div>'
						f_init_l_file(lineList[i]);
            		}
            		prodAnswerCon.html(html);
            		$scope.poLineList = lineList;
            		that.load = true;

            		lineList.forEach(function(line,idx){
						var fileHTML = '<p>'
						line.vFileList.forEach(function(val){
							fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
						})
						fileHTML += '</p>'
						$('.receivOrderOrderDetail .files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
					})
            	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
            }
		})
	},
	//其他费用
	othersCost: function(){
		var that=this, html='', subtotal=0, resubtotal=0, _responseCost=false;
		if(!that.load)return;
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
		    data: {
		        "param": '{"poAnswerId":'+ _vParams.poAnswerId +',"vendorId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_findPoAnswerOtherCostList", "commonParam":'+ that.commonParam +'}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var otherCostList = data.poOthreCostList;
            		that._othersCost = otherCostList;
            		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';
            		for(var i=0, len=otherCostList.length; i<len; i++){
            			html+='<li class="costName" data-costName="'+ otherCostList[i].costName +'"><span>'+ otherCostList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(otherCostList[i].vCostAmount) +'</b></li>';
            		}
            		html+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+ $currencySymbol + formatMoney(that.orderInfo.vOtherCostTotal) +'</b></li>'
            		html+='</ul>'
            		html+=((otherCostList.length==0)? '' : '<span name="otherCostInfos" class="edit editOther"></span>')
            		html+='</div>';
            		othersCostCon.html(html);
            	}
            }
		})
	},
	//答交计价数量
	reQtys: function(parents,index){
		var vals = 0;
		parents.find('.int02').each(function(){
			var _this = $(this);
			vals += Number(_this.val());
		})
		return vals;			
	},
	//答交总金额计算
	reCostTotalFn: function(){
		var that = this,
			totals = 0;
		$('.contarin').find('.subtotal').each(function(){
			totals += Number($(this).attr('data-vtotal'));
		})
		return totals;
	},
	start: function(){
		var that = this;
		orderAnswerCon.html(that.orderBaseInfo());

		//获取所有平台币种及小数位
		var CurrencyParam = {"serviceId":"B01_queryAllPlatformCurrency", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()};
		GetAJAXData('POST',CurrencyParam,function(unitdata){
			if(unitdata.success){
				if( !isEmpty(unitdata.platformCurrencyList[0]) ){
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
			}
		});
		that.prodAnswerInfo();
		that.othersCost();

		$('.item-total').html('订单总金额：'+$currencySymbol+formatMoney(that.orderInfo.vTotalAmount)).show();

		//单身附件
    //     function getObFileList(){
    //     	var list;
    //     	$scope.poLineList.forEach(function(val,i){
    //     		list = '';
    //     		val.vFileList = [];
				// var param = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":that.orderInfo.companyId, "id":val.id, "commonParam":commonParam(), "docType":"24","fileSource":1,"searchType":2};//searchType查询类型1单头2单身
				// GetAJAXData('POST',param,function(fileListData){
				// 	if(fileListData.success){
				// 		for(var j=0; j<fileListData.fileList.length; j++){
				// 			list += '<a href="'+ fileListData.fileList[j].fileUrl +'"><i class=i-'+ (_reg.test(fileListData.fileList[j].fileName) ? "image" : "word") +'></i>'+ fileListData.fileList[j].fileName +'</a>';
				// 		}
				// 		if(fileListData.fileList.length>0){
				// 			prodAnswerCon.find('.files').eq(i).html('<span>附件：</span><p>' + list +'</p>').show();
				// 		}
				// 		val.vFileList = fileListData.fileList;
				// 	}
				// },true)
    //     	})
    //     	$scope.poLineList = $scope.poLineList;
    //     	//console.log(JSON.stringify($scope.poLineList))
    //     }
        //getObFileList();

        //物流方式 默认值
        $logisticsType.currValue = enumFn(that.logisticsType,that.orderInfo.logisticsType)
        $logisticsType.logisticsType = that.orderInfo.logisticsType;

		
		//交易币别 默认值
		$currencyData.currencyInfo = {
			"id":that.orderInfo.currencyId,
			"currencyCode":that.orderInfo.currencyCode,
			"currencyName":that.orderInfo.currencyName
		}
		//根据平台币种获取企业币种
		var currencyParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getCompCurrencyByPCurrency", "companyId":_vParams.companyId,"currencyCodeP":that.orderInfo.pCurrencyCode,"commonParam":commonParam()};
		GetAJAXData('POST',currencyParam,function(currencyData){
			if(currencyData.success){
				if(!isEmpty(currencyData.currencyInfo.currencyName)){
					$currencyData.currencyInfo = currencyData.currencyInfo;
					orderAnswerCon.find('.currencyName').html('<span>交易币别：</span>'+ currencyData.currencyInfo.currencyName);					
				}
			}
			var _currencyInfo = currencyData.currencyInfo;
			//判断是否需要显示本位币和汇率
            that.isDisplayRate = false;
            if( _currencyInfo.isBase == 0 || isEmpty(_currencyInfo.currencyName) ){
                that.isDisplayRate = true;
            }
            //获取本位币以及汇率
			if(_currencyInfo.isBase==1){
                that.addval_localCurrencyId = _currencyInfo.id;
                that.addval_localCurrencyCode = _currencyInfo.currencyCode;
                that.addval_localCurrencyName = _currencyInfo.currencyName;
                that.addval_exchangeRate = "1";
			}else{
				//ExchangeRate
				var ExchangeRateParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getExchangeRateByCurrency", "companyId":that.orderInfo.vendorId.toString(),"commonParam":commonParam(),"currencyId":$currencyData.currencyInfo.id.toString()};//如不填币种ID, 则查公司的本位币
				GetAJAXData('POST',ExchangeRateParam,function(ExchangeRateData){
					if(ExchangeRateData.success){
						$ExchangeRateData = ExchangeRateData;
		                that.addval_localCurrencyId = ExchangeRateData.baseCurrencyId;
		                that.addval_localCurrencyCode = ExchangeRateData.baseCurrencyCode;
		                that.addval_localCurrencyName = ExchangeRateData.baseCurrencyName;
		                that.addval_exchangeRate = ExchangeRateData.exchangeRate;
					}
				})					
			}
		})

		//默认交易税别
		$taxData.taxInfo = {
            "taxName":that.orderInfo.taxName,
            "taxCode":that.orderInfo.taxCode,
            "taxId":that.orderInfo.taxId,
            "taxRate":that.orderInfo.taxRate,
            "isContainTax":that.orderInfo.isContainTax
		}
		//根据客户税种获取本方关联税别
		var taxParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getTaxByCustomerTax", "companyId":that.orderInfo.vendorId,"cTaxId":that.orderInfo.taxId,"customerId":that.orderInfo.companyId,"commonParam":commonParam()};
		GetAJAXData('POST',taxParam,function(taxData){
			if(taxData.success){
				if(!isEmpty(taxData.taxName)){
					$('#taxName').find('em').html(taxData.taxName);
					$taxData.taxInfo = taxData;					
				}
			}
		},true)

		//本方所有税别
		var taxListParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findTaxList", "companyId":that.orderInfo.vendorId,"taxStyle":2,"commonParam":commonParam()};
		GetAJAXData('POST',taxListParam,function(taxListData){
			if(taxListData.success){
				if(!isEmpty(taxListData.taxList[0])){
					$taxListData = taxListData;
				}
			}
		},true)

		//默认交易条件
		$conditionJson.conditionName = that.orderInfo.conditionName;
        $conditionJson.id = that.orderInfo.conditionId;
        $conditionJson.conditionCode = that.orderInfo.conditionCode;
		//本方所有交易条件
		var conditionParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findCompanyConditionList", "companyId":_vParams.companyId,"conditionType":"2"};//交易条件类型（1-采购；2-销售）
		GetAJAXData('POST',conditionParam,function(conditionData){
			if(conditionData.success){
				if( !isEmpty(conditionData.conditionList[0]) ){
					$conditionData = conditionData;
				}
			}
		},true)

		//根据客户交易条件获取本方默认交易条件
		var conditionParam2 = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getConditionByCustomerCondition", "companyId":that.orderInfo.vendorId, "customerId":that.orderInfo.companyId, "cConditionId":that.orderInfo.conditionId};
		GetAJAXData('POST',conditionParam2,function(conditionJson){
			if(conditionJson.success){
				if( !isEmpty(conditionJson.conditionName) ){
					$conditionJson = conditionJson;
				}
			}
		},true)

		//收货地址 默认值
        that.privateDefultAddrName = that.orderInfo.logisticsAddrName;
        that.privateDefultAddrId = "";

        that.addval_contactPerson = that.orderInfo.contactPerson;
        that.addval_cityName = that.orderInfo.cityName;
        that.addval_cityCode = that.orderInfo.cityCode;
        that.addval_provinceCode = that.orderInfo.provinceCode;  
        that.addval_provinceName = that.orderInfo.provinceName;  
        that.addval_countryName = that.orderInfo.countryName;   
        that.addval_countryCode = that.orderInfo.countryCode;   
        that.addval_districtCode = that.orderInfo.districtCode; 	
        that.addval_districtName = that.orderInfo.districtName;  
        that.addval_invId = that.orderInfo.invId;         
        that.addval_invCode = that.orderInfo.invCode;       
        that.addval_invName = that.orderInfo.invName; 
        that.addval_address = that.orderInfo.address;       
        that.addval_mobile = that.orderInfo.mobile; 

        that.addval_isDefault = "";     
        that.addval_addressCompName = "";    
        that.addval_addressCode = "";    
        that.addval_addressType = "";    
        that.addval_addressId = "";
        that.addval_zipCode = ""; 
        that.addval_tel = "";    
        that.addval_status = "";     
        that.addval_remark = "";
	    //本方地址信息
		var AddrParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getAddrInfoByCustomerAddrId", "companyId":that.orderInfo.vendorId, "cAddressId":that.orderInfo.addressId, "customerId":that.orderInfo.companyId, "type":"2"};
		GetAJAXData('POST',AddrParam,function(AddrData){
			if(AddrData.success){
				$AddrData = AddrData;

	            if( !isEmpty(AddrData.customerAddress) ){
	                var data_adddr = AddrData.customerAddress;
	                that.privateDefultAddrName = data_adddr.provinceName +
	                               data_adddr.cityName +
	                               data_adddr.districtName +
	                               data_adddr.address +
	                               "（收货人：" + data_adddr.contactPerson +
	                               "，电话：" + data_adddr.mobile +
	                               "，商家仓库：" + data_adddr.invName +
	                               "）";
	                that.privateDefultAddrId = data_adddr.addressId;

	                that.addval_contactPerson = data_adddr.contactPerson;
	                that.addval_cityName = data_adddr.cityName;
	                that.addval_cityCode = data_adddr.cityCode;
	                that.addval_provinceCode = data_adddr.provinceCode;  
	                that.addval_provinceName = data_adddr.provinceName;  
	                that.addval_countryName = data_adddr.countryName;   
	                that.addval_countryCode = data_adddr.countryCode;   
	                that.addval_districtCode = data_adddr.districtCode; 	
	                that.addval_districtName = data_adddr.districtName;  
	                that.addval_invId = data_adddr.invId;         
	                that.addval_invCode = data_adddr.invCode;       
	                that.addval_invName = data_adddr.invName;         
	                that.addval_address = data_adddr.address;       
	                that.addval_mobile = data_adddr.mobile;

	                that.addval_isDefault = data_adddr.isDefault;   
	                that.addval_addressCompName = data_adddr.addressCompName;    
	                that.addval_addressCode = data_adddr.addressCode;    
	                that.addval_addressType = data_adddr.addressType;    
	                that.addval_addressId = data_adddr.addressId;
	                that.addval_zipCode = data_adddr.zipCode; 
	                that.addval_tel = data_adddr.tel;    
	                that.addval_status = data_adddr.status;     
	                that.addval_remark = data_adddr.remark;
	            }
			}
		})

		//默认收款条件
		$payWayTypeData.payWayName = that.orderInfo.payWayName;
        $payWayTypeData.payWayId = that.orderInfo.payWayId;
        $payWayTypeData.payWayCode = that.orderInfo.payWayCode;
		//本方收款条件
		var payWayTypeParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_getPayWayByCustomerPayWay", "companyId":that.orderInfo.vendorId, "customerId":that.orderInfo.companyId,"cPayWayId":that.orderInfo.payWayId};
		GetAJAXData('POST',payWayTypeParam,function(payWayTypeData){
			if(payWayTypeData.success){
				if(!isEmpty(payWayTypeData.payWapName)){
					$payWayTypeData = payWayTypeData;
				}
			}
		},true)

		//本方所有收款条件
		var payWayParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findCompanyPayWayList", "companyId":that.orderInfo.vendorId, "payWayType":"1"};//类型(1-收款，2-付款)
		GetAJAXData('POST',payWayParam,function(payWayData){
			if(payWayData.success){
				if(!isEmpty(payWayData.payWayList[0])){
					$payWayData = payWayData;
				}
			}
		},true)

		//单头附件
		var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":that.orderInfo.companyId, "id":that.orderInfo.id, "commonParam":commonParam(), "docType":"24","fileSource":1,"searchType":1};//searchType查询类型1单头2单身
		GetAJAXData('POST',fileParam,function(fileData){
			if(fileData.success){
				$fileData = fileData;
			}
		},true)
		

		//通用底部
		if(that.load){
			bottomBar(['share'],that.memberId,'','确定转销售');
		}

		//订单维护
		container.on('click','span.edit, a.item-link',function(){
			var _this = $(this), parent = _this.parents('.item-wrap'), name = _this.attr('name'), scrollTop = $body.scrollTop();
			switch(name){
				case 'headInfos':
					orderReviseInfoCon.html(that.editHeadInfo(scrollTop));
					$('.curSelect').html('本位币：' + $ExchangeRateData.baseCurrencyName + '&nbsp;&nbsp;&nbsp;&nbsp;汇率：').show();
					setTimeout(function(){
						that.taxTypeSelect3();
					},300)
					break;
				case 'bodyInfos':
					var index = _this.parent('.item-wrap').attr('data-index');
					orderReviseInfoCon.html(that.editBodyInfo(index,scrollTop));
					setTimeout(function(){
						that.units(index);
						that.editProdCode();
					},300)
					break;
				case 'otherCostInfos':
					orderReviseInfoCon.html(that.editOthersCost(scrollTop));
					break;
				case 'payInfo':
					orderReviseInfoCon.html(that.editPayInfo(scrollTop));
					setTimeout(function(){
						that.conditionSelect();
						that.LogisticalSelect();
						that.payWaySelect();
					},300)
					break;
				case 'remark':
					orderReviseInfoCon.html(that.editRemark(scrollTop));
					$('#intRemarks').val($myRemarkVal)
					break;
			}
			$body.scrollTop(0);
			container.addClass('contarinEdit');
			$('#jBottom').addClass('m-bottom-hide');
		}).on('click','.btn-wrap .btnB',function(){
			var _this = $(this);
			if(_this.is('#saveHeadInfo')){
				//维护单头信息
				//$('#taxName em').html($('#taxType').select3('value'));
				if($taxData.taxInfo.taxName != $('#taxType').select3('value')){
            		$taxData.taxInfo.taxName = $('#taxType').select3('value')
            		if($taxListData.success){
						//接口"找不到记录"  			
            		}
            		addval_taxInfo = true;
            	}
			}
			if(_this.is('#saveBodyInfo')){
				//维护单身信息
				// var idx = _this.attr('data-index'),
				// 	wfItem = $('.hideItemCon').find('.wfItem'),
				// 	itemWrap = $('#prodAnswerInfo').find('.item-wrap').eq(idx);

				// itemWrap.find('.prodCode').find('b').html(wfItem.find('p').eq(0).html())
				// itemWrap.find('.prodDetail').find('p').html(wfItem.find('p').eq(1).html())
				// $('.hideItemCon').find('.select3-input').forEach(function(val,item){
				// 	itemWrap.find('em.unit').eq(item).html($(val).select3('value'))
				// })
			}
			if(_this.is('#saveOthersCost')){
				//维护其他费用
				var costNameH = $('.hideItemCon').find('.costName');
				var costNameS = $('.showItemCon').find('.costName');

				costNameH.forEach(function(val,item){
					//过滤冒号
					var value = val.value.replace(new RegExp(/(:)/g),"");
					value = value.replace(new RegExp(/(：)/g),"");

					costNameS.eq(item).find('span').eq(0).html(value+'：');
					costNameS.eq(item).attr('data-costname',value);
				})
			}
			if(_this.is('#savePayInfo')){
				//维护支付信息
            	if($conditionJson.conditionName != $('#dealType').select3('value')){
            		$conditionJson.conditionName = $('#dealType').select3('value')
            		if($conditionData.success){
	            		$conditionData.conditionList.forEach(function(val){
	            			if(val.conditionName==$conditionJson.conditionName){
	            				$conditionJson.id=val.id;
	            				$conditionJson.conditionCode=val.conditionCode;
	            			}
	            		})            			
            		}
            		addval_conditionInfo = true;
            	}
            	if($payWayTypeData.payWayName!=$('#checkoutType').select3('value')){
            		$payWayTypeData.payWayName = $('#checkoutType').select3('value')
            		if($payWayData.success){
	            		$payWayData.payWayList.forEach(function(val){
	            			if(val.payWayName==$payWayTypeData.payWayName){
	            				$payWayTypeData.payWayId=val.payWayId;
	            				$payWayTypeData.payWayCode=val.payWayCode;
	            			}
	            		})            			
            		}
            		addval_paywayInfo = true;
            	}
            	if($logisticsType.currValue!=$('#logisticsType').select3('value')){
            		$logisticsType.currValue=$('#logisticsType').select3('value')
            		$logisticsType.logisticsType = reEnumFn(that.logisticsType,$logisticsType.currValue)
            	}
			}
			if(_this.is('#saveRemark')){
				//备注信息
				$myRemarkVal = $('#intRemarks').val();
			}
			var scrollTop = _this.attr('data-scrollTop');
			container.removeClass('contarinEdit');
			$('#jBottom').removeClass('m-bottom-hide');
			setTimeout(function(){$body.scrollTop(scrollTop)},200);
		})

		$body.on('click','.bottom-btn-confirm',function(){
			that.popup('confirm', '', '您确定要转销售订单吗？', function(){

			},function(){
				that.returnSale();
			})
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
	// 维护订单单头
	editHeadInfo: function(scrollTop){
		var that = this, html = '';
		html+= '<div id="reviseBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2>'
			+'<div class="item-wrap">'
			+'	<ul>'
			+'		<li><span>客户单号：</span><b>'+ that.orderInfo.poInsideNo +'</b></li>'
			+'		<li><span>客户：</span>'+ that.orderInfo.companyAbbr +'</li>'
			+'		<li><span>交易币种：</span><em id="currencyId">'+ $currencyData.currencyInfo.currencyName +'</em></li>'
			+'		<li><span>交易税种：</span><em id="currTax" class="currTax">'+ $taxData.taxInfo.taxName +'</em><label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
			+'		<li><span>销售日期：</span><em id="poFormDate">'+ transDate(new Date().getTime()) +'</li>'
			+'	</ul>'
			+'</div>'
			+'</div>'
			+'<div class="m-item">'
			+'	<h2 class="m-title">销售订单信息维护</h2>'
			+'	<div class="item-wrap">'
			+'		<section class="clearfix">'
			+'			<span class="c-label">交易币种：</span>'
			+'			<div id="currency" class="c-cont">'
			+'				<p class="c-txt">'+ $currencyData.currencyInfo.currencyName +'</p>'
			+'				<div class="curSelect"></div>'
			+'			</div>'
			+'		</section>'
			+'		<section class="m-select clearfix">'
			+'			<span class="c-label">交易税种：</span>'
			+'			<div class="c-cont">'
			+'				<div id="taxType" class="select3-input"></div>'
			+'				<p><label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></p>'	
			+'			</div>'
			+'		</section>'
			+'	</div>'
			+'</div>'
			+'<div class="btn-wrap">'
			+'	<a href="javascript:;" id="saveHeadInfo" class="btnB" data-scrollTop="'+scrollTop+'">完成</a>'
			+'</div>'
		return html;
	},
	taxTypeSelect3: function(){
		var that = this, options = [];
		//本方所有税别
    	if($taxListData.success){
    		for(var i=0, len=$taxListData.taxList.length; i<len; i++){
    			if(that.orderInfo.isContainTax=='1'){
					if($taxListData.taxList[i].isContainTax == that.orderInfo.isContainTax && $taxListData.taxList[i].taxRate == that.orderInfo.taxRate){
    					options.push($taxListData.taxList[i].taxName);
    				}
    			}else{
    				if($taxListData.taxList[i].isContainTax == that.orderInfo.isContainTax){
    					options.push($taxListData.taxList[i].taxName);
    				}
    			}
    		}
    	}else{
    		options.push($taxData.taxInfo.taxName);
    	}
		that.initSelect3('#taxType',options,$taxData.taxInfo.taxName);

	},
	editBodyInfo: function(idx,scrollTop){
		var that = this, html = '', list = $scope.poLineList[idx], itemLen = list.poSubLineList.length;
		var unitName = true;
		if(list.vAnswerUnitName==list.vValuationUnitName){
			unitName = false;
		}
		html+='<div class="m-item">'
			+'	<h2 class="m-title">产品明细</h2>'
			+'	<div class="item-wrap">'
			+'		<ul>'
			+'			<li><span>物料编码：</span>'+ list.vPoInfo.prodCode +'</li>'
			+'			<li><span>物料详细：</span><p>'+ list.vPoInfo.prodName +' '+ list.vPoInfo.prodScale +'</p></li>'
			+'			<li><section><span>数量：</span>'+ list.vPurchaseQty + list.vAnswerUnitName + ((unitName) ? ('/'+ list.vValuationQty + list.vValuationUnitName):'') +'</section><section><span>交期：</span>'+ list.vExpectedDelivery +'</section></li>'
			+'			<li><span class="price">单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney(list.vTaxPrice) : formatMoney(list.vPrice)) +'/'+ list.vValuationUnitName +'</li>'
			+'		</ul>'
			+'	</div>'
			+'</div>'
			+'<div class="m-item m-item-units">'
			+'	<h2 class="m-title">销售订单信息维护</h2>'
			+'	<div class="item-wrap">'
			+'		<section class="clearfix">'
			+'			<span class="c-label"><b>我方编码：</b></span>'
			+'			<div class="wfItem">'
			+'				<p class="wfItem-int"><input type="text" class="s-int" value="'+ list.vPoInfo.prodCode +'" /><i></i></p>'
			+'				<p>'+ list.vPoInfo.prodName +' '+ list.vPoInfo.prodScale + '</p>'
			+'			</div>'
			+'		</section>'
			+'		<section class="m-select clearfix">'
			+'			<span class="c-label"><b>数量：</b></span>'
			+'			<div class="c-cont">'
			+'				<div class="c-cont-item">'
			+'					<span>'+ list.purchaseQty +'</span>'
			+'					<div id="purchaseQty_'+ idx +'" class="select3-input select3-unit" data-index="0"></div>'
			+'				</div>'
		if(unitName){
		html+='				<div class="c-cont-item">'
			+'					<span>'+ list.valuationQty +'</span>'
			+'					<div id="valuationQty_'+ idx +'" class="select3-input select3-unit" data-index="1"></div>'
			+'				</div>'			
		}
		html+='			</div>'
			+'		</section>'
			+'</div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+scrollTop+'" data-index="'+idx+'">完成</a></div>'
		// html+='<span class="edit poBodyEdit"></span></div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+scrollTop+'" data-index="'+idx+'">完成</a></div>'
		return html;
	},
	units: function(idx){
		var that = this, prodUnitNames = [], basicUnitNames = [];
		$.ajax({
			type:"POST",
            async:false,
            url:config.serviceUrl,
            data: {
		        "param": '{"serviceId":"B01_findProdUnitListByProd","companyId":["'+ _vParams.companyId +'"],"prodId":"'+ $scope.poLineList[idx].prodId +'",'+ that.tokens +',"commonParam":'+ that.commonParam +'}'
		    },
            success:function(data){
            	if(data.success && !isEmpty(data.prodUnitList[0])){
            		var prodUnitLists = data.prodUnitList;
            		for(var i=0, len=prodUnitLists.length; i<len; i++){
            			prodUnitNames.push(prodUnitLists[i].prodUnitName);
            			basicUnitNames.push(prodUnitLists[i].basicUnitName);
            		}
            	}else{
            		prodUnitNames.push($scope.poLineList[idx].purchaseUnitName);
            		basicUnitNames.push($scope.poLineList[idx].valuationUnitName);
            	}
            }
		})

		that.initSelect3('#purchaseQty_'+idx,prodUnitNames,$scope.poLineList[idx].purchaseUnitName);
		that.initSelect3('#valuationQty_'+idx,basicUnitNames,$scope.poLineList[idx].valuationUnitName);				

		var selectBox = $('.m-item-units').find('.m-select');
		selectBox.find('.select3-input').change(function(){
			var _this = $(this);
			var idx = _this.attr('data-index');
			var thisVal = _this.select3('value');
			_this.parents('.m-item-units').find('.select3-input').forEach(function(item){
				if($(item).attr('data-index')==idx){
					$(item).find('.select3-single-selected-item').attr('data-item-id',thisVal).text(thisVal);
				}
			})
		})
	},
	editProdCode: function(){
		var that = this;
		container.on('click','.poBodyEdit',function(){
			var _this = $(this),
				parent = _this.parent('.item-wrap');
			_this.hide();
			parent.find('.wfItem').hide();
			parent.find('.itemEdit').show();
			$body.append(formTip);
		}).on('click','.btn-save',function(){
			var _this = $(this);
			var code = _this.parents('.itemEdit').find('.int-search').val();
			$.ajax({
				type:"POST",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId": "B01_getProdInfoByCode","companyId":"'+ _vParams.companyId +'","prodCode":"'+ code +'","commonParam":'+ that.commonParam +','+ that.tokens +'}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var prodInfos = data.prodInfo;
                		if(prodInfos==undefined){
                			$('#formTip').html('产品编码错误，请重新输入').addClass('formTipShow');
                			return false;
                		}
                		if(code==prodInfos.prodCode){
                			_this.parents('.item-wrap').find('.wfItem').html(prodInfos.prodCode + '<p>'+ prodInfos.prodName + ' ' + prodInfos.prodScale +'</p>');
                			resumed(_this);
                		}
                	}
                }
			})

		}).on('click','.btn-cancel',function(){
			var _this = $(this);
			resumed(_this);
		})

		function resumed(self){
			var parent = self.parents('.item-wrap');
			parent.find('.wfItem').show();
			parent.find('.itemEdit').hide();
			parent.find('.edit').show();
			$('#formTip').remove();
		}
	},
	editOthersCost: function(scrollTop){
		var that = this, list = that._othersCost, len=list.length, costName = $('.showItemCon').find('.costName');
		var html = '<div class="m-item"><h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';

		for(var i=0; i<len; i++){
			html+='<li><span>'+ costName.eq(i).attr('data-costName') +'：</span><b>'+ $currencySymbol+formatMoney(list[i].vCostAmount) +'</b></li>'
		}			

		html+='</ul></div></div>';
		html+='<div class="m-item"><h2 class="m-title">订单其他费用维护</h2><div class="item-wrap">'

		for(var j=0; j<len; j++){
			html+='<section class="m-select clearfix">'
					+'	<div class="c-cont c-cont2">'
					+'		<input type="text" class="costName" value="'+ costName.eq(j).attr('data-costName') +'">'
					+'		<p class="fy">'+ $currencySymbol+formatMoney(list[j].vCostAmount) +'</p>'
					+'	</div>'
					+'</section>'
		}

		html+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveOthersCost" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>';
		return html;
	},
	editPayInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;

		html='<div id="payInfoList" class="m-item">'
			+'	<div class="item-wrap">'
			+'		<ul>'
			+'			<li><span>交易条件：</span><p id="jyCurrVal">'+ $conditionJson.conditionName +'</p></li>'
			+'			<li><span>物流方式：</span><p><em id="logisticsVal">'+ $logisticsType.currValue +'</em></p></li>'
			+'			<li><span>'+ (($logisticsType.logisticsType==3) ? '自提点' : '收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +'</p></li>'
			+'			<li><span>收款条件：</span><p id="payWayName">'+ $payWayTypeData.payWayName +'</p></li>'
			if(infos.invoice==1){
				html+='<li><span>发票信息：</span><p>'+ enumFn(that.invoiceInfoName,infos.invoice) +'</p></li>'
			}else{
				html+='<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
					+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
					+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'			
			}
		html+='		</ul>'
			+'	</div>'
			+'</div>'
			+'<div id="rePayInfoList" class="m-item">'
			+'	<div class="item-wrap">'
			+'		<section class="m-select clearfix">'
			+'			<span class="c-label">交易条件：</span>'
			+'			<div class="c-cont">'
			+'				<div id="dealType" class="select3-input"></div>'
			+'			</div>'				
			+'		</section>'
			+'		<section class="m-select clearfix">'
			+'			<span class="c-label">物流方式：</span>'
			+'			<div class="c-cont">'
			+'				<div id="logisticsType" class="select3-input"></div>'
			+'			</div>'
			+'		</section>'
			+'		<section id="address" class="clearfix">'
			+'			<span class="c-label">'+ (($logisticsType.logisticsType==3) ? '自提点' : '收货地址') +'：</span>'
			+'			<div class="c-cont">'
			+'				<p class="c-txt">'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +'</p>'
			+'			</div>'
			+'		</section>'
			+'		<section class="m-select clearfix">'
			+'			<span class="c-label">收款条件：</span>'
			+'			<div class="c-cont">'
			+'				<div id="checkoutType" class="select3-input"></div>'
			+'			</div>'
			+'		</section>'
		// if(infos.invoice==1){
		// html+='		<section class="clearfix">'
		// 	+'			<span class="c-label">发票信息：</span>'
		// 	+'			<div class="c-cont">'
		// 	+'				<p class="c-txt">'+ enumFn(that.invoiceInfoName,infos.invoice) +'</p>'
		// 	+'			</div>'
		// 	+'		</section>'
		// }else{
		// html+='		<section class="clearfix">'
		// 	+'			<span class="c-label">发票类型：</span>'
		// 	+'			<div class="c-cont">'
		// 	+'				<p class="c-txt">'+ enumFn(that.invoiceType,infos.invoiceType) +'</p>'
		// 	+'			</div>'
		// 	+'		</section>'
		// 	+'		<section class="clearfix">'
		// 	+'			<span class="c-label">开票抬头：</span>'
		// 	+'			<div class="c-cont">'
		// 	+'				<p class="c-txt">'+ infos.invoiceHeader +'</p>'
		// 	+'			</div>'					
		// 	+'		</section>'
		// 	+'		<section class="clearfix">'
		// 	+'			<span class="c-label">发票内容：</span>'
		// 	+'			<div class="c-cont">'
		// 	+'				<p class="c-txt">'+ infos.invoiceContent +'</p>'
		// 	+'			</div>'					
		// 	+'		</section>'			
		// }
			+'	</div>'
			+'</div>'
			+'<div class="btn-wrap"><a href="javascript:;" id="savePayInfo" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
		return html;
	},
	conditionSelect: function(){
		var that = this, options = [];

        //本方所有交易条件
    	if($conditionData.success){
    		if($conditionData.conditionList.length==0){
    			options.push($conditionJson.conditionName);
    			that.initSelect3('#dealType',options,$conditionJson.conditionName);
    			return false;
    		}
    		var len = $conditionData.conditionList.length;
    		for(var i=0; i<len; i++){
    			options.push($conditionData.conditionList[i].conditionName);
    		}
    		that.initSelect3('#dealType',options,$conditionJson.conditionName);
    	}else{
    		options.push($conditionJson.conditionName);
    		that.initSelect3('#dealType',options,$conditionJson.conditionName);
    	}
	},
	//物流方式
	LogisticalSelect: function(){
		var that = this, options = [];
		that.logisticsType.forEach(function(val){
			options.push(val.Value);
		})

		that.initSelect3('#logisticsType',options,$logisticsType.currValue);
	},
	payWaySelect: function(){
		var that = this, options = [];

        //本方所有收款条件
    	if($payWayData.success){
    		var payWays = $payWayData.payWayList, len = payWays.length;
    		for(var i=0; i<len; i++){
    			options.push(payWays[i].payWayName);
    		}
    	}else{
    		options.push(that.orderInfo.payWayName);
    		that.initSelect3('#checkoutType',options,that.orderInfo.payWayName);
    		return false;
    	}
    	that.initSelect3('#checkoutType',options,$payWayTypeData.payWayName);
	},
	editRemark: function(scrollTop){
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
		if($fileData.fileList.length==0){
			html+='<p><b>0个附件</b></p>'
		}
		for(var i=0; i<$fileData.fileList.length;i++){
			html+='<p><a href="'+ $fileData.fileList[i].fileUrl +'"><i class=i-'+ (_reg.test($fileData.fileList[i].fileName) ? "image" : "word") +'></i>'+ $fileData.fileList[i].fileName +'</a></p>'
		}
			html +='</div>'
				 +'<div id="remarks" class="item-wrap int-remarks">'
				 +'	<textarea name="" id="intRemarks" placeholder="填写备注信息"></textarea>'
				 +'</div>'
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
	returnSale: function(){
		var that = this, inParams, prodDetailList = [], otherCostList = [], baseInfo;

        //交易税别
   		var addval_taxName = $taxData.taxInfo.taxName;
        var addval_taxCode = $taxData.taxInfo.taxCode;
        var addval_taxId = $taxData.taxInfo.taxId;
        var addval_taxRate = $taxData.taxInfo.taxRate;
        var addval_isContainTax = $taxData.taxInfo.isContainTax;

        //业务员
        var addval_soManCode = privateDefultUser.employeeCode;
        var addval_soManId = privateDefultUser.employeeId;
        var addval_soManName = privateDefultUser.employeeName;
        var addval_soManPid = privateDefultUser.memberId;

        //交易条件
        if(addval_conditionInfo){
	        var addval_conditionName = $conditionJson.conditionName;
	        var addval_conditionId = $conditionJson.id;
	        var addval_conditionCode = $conditionJson.conditionCode;
        }else{
	        var addval_conditionName = $conditionJson.conditionName;
	        var addval_conditionId = "";
	        var addval_conditionCode = "";
        }


        //收款条件
	    var addval_payWayName = $payWayTypeData.payWayName;
	    var addval_payWayId = $payWayTypeData.payWayId;
	    var addval_payWayCode = $payWayTypeData.payWayCode;


        //物流商 添加值(H5暂无显示物流商,传默认值)
        if( true ){
            var addval_logisticsName = that.orderInfo.logisticsName;
            var addval_logisticsCode= that.orderInfo.logisticsCode;
        }else{
            // var addval_logisticsCode = $scope.addval_logisticsInfo.logisticsCode;
            // var addval_logisticsName = $scope.addval_logisticsInfo.logisticsName;
        }
        //收货地址、自提点 添加值(收货地址暂时使用客户地址)
        // if(){
        //     $scope.addval_contactPerson = $scope.addval_addrInfo.contactPerson;
        //     $scope.addval_cityName = $scope.addval_addrInfo.cityName;
        //     $scope.addval_cityCode = $scope.addval_addrInfo.cityCode;
        //     $scope.addval_provinceCode = $scope.addval_addrInfo.provinceCode;  
        //     $scope.addval_provinceName = $scope.addval_addrInfo.provinceName;  
        //     $scope.addval_countryName = $scope.addval_addrInfo.countryName;   
        //     $scope.addval_countryCode = $scope.addval_addrInfo.countryCode;   
        //     $scope.addval_districtCode = $scope.addval_addrInfo.districtCode; 	
        //     $scope.addval_districtName = $scope.addval_addrInfo.districtName;  
        //     $scope.addval_invId = $scope.addval_addrInfo.invId;         
        //     $scope.addval_invCode = $scope.addval_addrInfo.invCode;       
        //     $scope.addval_invName = $scope.addval_addrInfo.invName;         
        //     $scope.addval_address = $scope.addval_addrInfo.address;       
        //     $scope.addval_mobile = $scope.addval_addrInfo.mobile; 

        //     $scope.addval_isDefault = $scope.addval_addrInfo.isDefault;   
        //     $scope.addval_addressCompName = $scope.addval_addrInfo.addressCompName;    
        //     $scope.addval_addressCode = $scope.addval_addrInfo.addressCode;    
        //     $scope.addval_addressType = $scope.addval_addrInfo.addressType;    
        //     $scope.addval_addressId = $scope.addval_addrInfo.addressId;
        //     $scope.addval_zipCode = $scope.addval_addrInfo.zipCode; 
        //     $scope.addval_tel = $scope.addval_addrInfo.tel;    
        //     $scope.addval_status = $scope.addval_addrInfo.status;     
        //     $scope.addval_remark = $scope.addval_addrInfo.remark;
        // }   
        //单头附件
        var addval_saleOrderFile = [];
        $fileData.fileList.forEach(function(val){

            var item_file = {};
            item_file.lineNo = val.lineNo; 
            item_file.fileSource = val.fileSource; 
            item_file.fileUrl = val.fileUrl; 
            item_file.fileName = val.fileName; 
            item_file.fileSize = val.fileSize; 
            item_file.fileKey = val.fileKey; 
            item_file.remark = val.remark; 

            addval_saleOrderFile.push(item_file);
            
        });
        //费用
        var addval_orderTotalAmount = {
            "vOtherCostTotal": that.orderInfo.vOtherCostTotal,   
            "vTotalAmount": that.orderInfo.vTotalAmount,   
            "vTaxTotal": that.orderInfo.vTaxTotal,   
            "vTotal": that.orderInfo.vTotal   
        }; 
        //基本信息
        var addval_baseInfo = {
            "vendorId": that.orderInfo.vendorId.toString(),	            
            "vendorName": that.orderInfo.vendorName,	         
            "vendorCode": that.orderInfo.vendorCode,
            "vendorAbbr": that.orderInfo.vendorAbbr,
            "poAnswerId": _vParams.poAnswerId,
                
            "poId": that.orderInfo.id,
            "poFormNo":that.orderInfo.poFormNo,	   	         
            "poInsideNo":that.orderInfo.poInsideNo,

            "currencyId": $currencyData.currencyInfo.id,
            "currencyCode": $currencyData.currencyInfo.currencyCode,	    
            "currencyName": $currencyData.currencyInfo.currencyName,
            //企业
            "localCurrencyCode":that.addval_localCurrencyCode,
            "localCurrencyId":that.addval_localCurrencyId,	
            "localCurrencyName":that.addval_localCurrencyName,
            //平台
            "pCurrencyCode":that.orderInfo.pCurrencyCode,
            "pCurrencyName":that.orderInfo.pCurrencyName,
			"exchangeRate":that.addval_exchangeRate,

            "taxId":addval_taxId,
            "taxName":addval_taxName,	
            "taxCode":addval_taxCode,
            "isContainTax":addval_isContainTax,
		    "taxRate":addval_taxRate,

            "provinceCode":that.orderInfo.provinceCode,	  
            "provinceName":that.orderInfo.provinceName,
            
            "customerCode":that.orderInfo.companyCode,	     
            "customerId":that.orderInfo.companyId,	         
            "customerAbbr":that.orderInfo.companyAbbr,	     
            "customerName":that.orderInfo.companyName,
            
            "soFormDate":new Date().getTime(),
            "soInsideNo":"",
            "soManCode":addval_soManCode,	         
            "soManId":addval_soManId,	             
            "soManName":addval_soManName,	         
            "soManPid":addval_soManPid
        }; 
        //支付信息
        var addval_payInfo = {
            "logisticsCode":addval_logisticsCode,
            "logisticsName":addval_logisticsName,	     
            "logisticsType":$logisticsType.logisticsType,
			
			"contactPerson":that.addval_contactPerson,     
            "cityName":that.addval_cityName,
            "cityCode":that.addval_cityCode,
            "provinceCode":that.addval_provinceCode,	   
            "provinceName":that.addval_provinceName,	
            "countryName":that.addval_countryName,
            "countryCode":that.addval_countryCode,	
            "districtCode":that.addval_districtCode,	 
            "districtName":that.addval_districtName,
            "invId":that.addval_invId,	             
            "invCode":that.addval_invCode,	             
            "invName":that.addval_invName,	
            "addressId":that.addval_addressId,
            "address":that.addval_address,
            "mobile":that.addval_mobile,  
            
            "payWayId":addval_payWayId,	         
            "payWayName":addval_payWayName,
            "payWayCode":addval_payWayCode,	

            "conditionCode":addval_conditionCode,	
            "conditionName":addval_conditionName,
            "conditionId":addval_conditionId,

            "invoice":that.orderInfo.invoice,	
            "invoiceType":that.orderInfo.invoiceType,	  
            "invoiceContent":that.orderInfo.invoiceContent,	 
            "invoiceHeader":that.orderInfo.invoiceHeader,
            "invoiceName":that.orderInfo.invoiceName,	         
            "invoiceAccount":that.orderInfo.invoiceAccount,	     
            "invoiceTel":that.orderInfo.invoiceTel,	         
            "invoiceBank":that.orderInfo.invoiceBank,	         
            "invoiceAddress":that.orderInfo.invoiceAddress,	     
            "invoicePayMark":that.orderInfo.invoicePayMark
        };  
        var addval_appendContact = {
            "agreement": that.orderInfo.agreement,
            "vRemark":$myRemarkVal,
            "remark": that.orderInfo.remark
        };
        var addval_otherCostList = that._othersCost;

        var addval_prodDetailList = [];
        $scope.poLineList.forEach(function(val){
			if( isEmpty(val.purchaseUnitInfo) ){
				var addval_purchaseUnitCode = ""; 
				var addval_purchaseUnitId = "";
				var addval_purchaseUnitName = val.purchaseUnitName;
			}else{
				var addval_purchaseUnitCode = val.purchaseUnitInfo.prodUnitCode;
				var addval_purchaseUnitId = val.purchaseUnitInfo.id;
				var addval_purchaseUnitName = val.purchaseUnitInfo.prodUnitName;
			}
			if( isEmpty(val.valuationUnitInfo) ){
				var addval_valuationUnitCode = "";
				var addval_valuationUnitId = "";
				var addval_valuationUnitName = val.valuationUnitName; 
			}else{
				var addval_valuationUnitCode = val.valuationUnitInfo.prodUnitCode;
				var addval_valuationUnitId = val.valuationUnitInfo.id;
				var addval_valuationUnitName = val.valuationUnitInfo.prodUnitName;
			}
			if( val.purchaseUnitId == val.valuationUnitId ){
				addval_valuationUnitId = addval_purchaseUnitId;
				addval_valuationUnitCode = addval_purchaseUnitCode;	
				addval_valuationUnitName = addval_purchaseUnitName;
			}
            var addval_prodDetailList_obj = {
                "fileList":[],
				"expectedDelivery":new Date(val.expectedDelivery).getTime(),
				
                "vProdId":val.vPoInfo.id,	 
				"vProdName":val.vPoInfo.prodName,	  
				"vProdDesc":val.vPoInfo.prodDesc,	            
                "vProdCode":val.vPoInfo.prodCode,	
				"vProdScale":val.vPoInfo.prodScale,
				"vFileCount":val.vFileList.length,
				"vRemark":val.vRemark,	      
				
                "cProdId":val.prodId,	                
                "cProdName":val.prodName,	 
                "cProdCode":val.prodCode,	
				"cProdScale":val.prodScale,	    
				"cProdDesc":val.prodDesc,	     
				"fileCount":val.fileCount,
				"remark":val.remark,	
				
				"invName":val.invName,	 
                "invCode":val.invCode,	                
                "invId":val.invId,	 
				
                "taxPrice":val.taxPrice,		
                "taxLineTotal":val.taxLineTotal,		        
                        
                "salesQty":val.purchaseQty,	
				"salesUnitId":addval_purchaseUnitId,	
                "salesUnitCode":addval_purchaseUnitCode,	        
                "salesUnitName":addval_purchaseUnitName,	  
				
				"valuationQty":val.valuationQty,	
				"valuationUnitId":addval_valuationUnitId,	     
                "valuationUnitCode":addval_valuationUnitCode,	    
                "valuationUnitName":addval_valuationUnitName,
					   				
                "poLineId":val.id,	            
                "poLineNo":val.lineNo,	            
                "lineNo":val.lineNo,	
				
				"price":val.price,	
				"lineAmount":val.lineAmount,	     
				
                "locationId":val.localtionId,	            
                "locationCode":val.localtionCode,	        
                "locationName":val.localtionName,	
				
				"deliveryValuationQty":0,
				"deliveryQty":0,
				
				"receiveValuationQty":0,	    
                "receiveQty":0,	
				
                "returnQty":0,	            
                "returnValuationQty":0,	 
				
                "exchangeQty":0,	            
                "exchangeValuationQty":0
            };
            val.vFileList.forEach(function(i){

                    var item_file = {};
                    item_file.lineNo = i.lineNo; 
                    item_file.fileSource = i.fileSource; 
                    item_file.fileUrl = i.fileUrl; 
                    item_file.fileName = i.fileName; 
                    item_file.fileSize = i.fileSize; 
                    item_file.fileKey = i.fileKey; 
                    item_file.remark = i.remark; 

                    addval_prodDetailList_obj.fileList.push(item_file);

            });
            addval_prodDetailList.push(addval_prodDetailList_obj);
        });

        //判空功能
        if( addval_baseInfo.vendorId == "" ){
            that.popup('alert','','企业ID 为空！');
            return;
        }
        if( addval_baseInfo.currencyName == "" ){
            that.popup('alert','','交易币种名称 为空！');
            return;
        }
        if( addval_baseInfo.localCurrencyCode == "" ){
            that.popup('alert','','企业本币编码 为空！');
            return;
        }
        if( addval_baseInfo.localCurrencyId == "" ){
            that.popup('alert','','企业本币ID 为空！');
            return;
        }
        if( addval_baseInfo.localCurrencyName == "" ){
            that.popup('alert','','企业本币名称 为空！');
            return;
        }
        if( addval_baseInfo.pCurrencyCode == "" ){
            that.popup('alert','','平台币种编码 为空！');
            return;
        }
        if( addval_baseInfo.pCurrencyName == "" ){
            that.popup('alert','','平台币种名称 为空！');
            return;
        }
        if( addval_baseInfo.isContainTax != 0 && addval_baseInfo.isContainTax != 1 ){
            that.popup('alert','','是否含税 不正确！');
            return;
        }
        if( addval_payInfo.invoice != 1 && addval_payInfo.invoiceType  == "" ){
            that.popup('alert','','发票类型 为空！');
            return;
        }
        if( addval_payInfo.invoice != 1 && addval_payInfo.invoiceType == 1 ){
            if( addval_payInfo.invoiceHeader=="" || addval_payInfo.invoiceContent=="" ){
                that.popup('alert','','发票抬头或发票内容 为空！');
                return;
            }
        }
        if( addval_payInfo.invoice != 1 && addval_payInfo.invoiceType != 1 ){
            if( addval_payInfo.invoiceAccount == "" ){
                that.popup('alert','','发票账号 为空！');
                return;
            }
        }
        if( addval_payInfo.logisticsType == "" ){
            that.popup('alert','','物流方式 为空！');
            return;
        }
        if( addval_payInfo.logisticsType != 3 && addval_payInfo.logisticsName == "" ){
            that.popup('alert','','物流商 为空！');
            return;
        } 
        if( addval_payInfo.conditionName == "" ){
            that.popup('alert','','交易条件名称 为空！');
            return;
        }
		//判断汇率格式
        if( addval_baseInfo.exchangeRate!=undefined && isNaN(addval_baseInfo.exchangeRate*1) ){
            that.popup('alert','','汇率应为整数或小数！');
            return;
        }


		var param_info = {
            "saleOrderFile" : addval_saleOrderFile, 
            "orderTotalAmount" : addval_orderTotalAmount, 
            "baseInfo" : addval_baseInfo, 
            "prodDetailList" : addval_prodDetailList, 
            "payInfo" : addval_payInfo, 
            "appendContact" : addval_appendContact, 
            "otherCostList" : addval_otherCostList,
            "serviceId":"B03_poAnswerToSalesOrder",
            "commonParam":commonParam(),
            "token":_vParams.token,
            "secretNumber":_vParams.secretNumber
        }

		//console.log(JSON.stringify(param_info));
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
		        "param": JSON.stringify(param_info)
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		$scope.pageState = "success";
	                $scope.success_soFormNo = data.soFormNo;
	                $scope.success_soFormId = data.id;
                	fnTip.success(2000);
                	setTimeout(function(){
                		//window.location.href=config.htmlUrl+'salesDetail.html?param={"id":'+ $scope.success_soFormId +',"companyId":"'+ that.orderInfo.vendorId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
                		goBack();
                	},2000);
            	}else{
            		that.popup('alert','','操作失败：'+data.errorMsg); 
            	}
            }
		})
	}
}