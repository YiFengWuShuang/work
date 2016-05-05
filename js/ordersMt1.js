var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var OrdersMt = function(){
	this.init();
}
OrdersMt.prototype = {
	init: function(){
		var that = this;
		that.commonParam = JSON.stringify(commonParam());
		that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
		that.start();
	},
	orderBaseInfo: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
            async:false,
            url:config.serviceUrl,
            data: {
		        "param": '{ "serviceId":"B03_getPurchaseOrderAnswerInfo", '+ that.tokens +', "poAnswerId":"'+ _vParams.poAnswerId +'", "vendorId":"'+ _vParams.vendorId +'", "commonParam":'+ that.commonParam +' }'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var orderInfo = data.poAnswerOrderInfo;
            		html+= '<div id="orderBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2>'
            			+'<div class="item-wrap">'
						+'	<ul>'
						+'		<li><span>客户单号：</span><b>'+ orderInfo.poInsideNo +'</b></li>'
						+'		<li><span>客户：</span>'+ orderInfo.companyName +'</li>'
						+'		<li><span>交易币种：</span><em id="currencyId">'+ orderInfo.currencyName +'</em></li>'
						+'		<li><span>交易税种：</span><em id="currTax" class="currTax" data-taxId="'+ orderInfo.taxId +'">'+ orderInfo.taxName +'</em>' + ( orderInfo.isContainTax=='1' ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo.taxRate +'%</label>' : '')+'</li>'
						+'		<li><span>采购日期：</span><em id="poFormDate">'+ orderInfo.poFormDate +'</li>'
						+'	</ul>'
						+'</div>'
						+'</div>'
						+'<div class="m-item">'
						+'	<h2 class="m-title">销售订单信息维护</h2>'
						+'	<div class="item-wrap">'
						+'		<section class="clearfix">'
						+'			<span class="c-label">交易币种：</span>'
						+'			<div id="currency" class="c-cont" data-pCurrencyCode="'+ orderInfo.pCurrencyCode +'">'
						+'				<p class="c-txt">--</p>'
						+'				<div class="curSelect"></div>'
						+'			</div>'			
						+'		</section>'
						+'		<section class="m-select clearfix">'
						+'			<span class="c-label">交易税种：</span>'
						+'			<div class="c-cont">'
						+'				<div id="taxType" class="select3-input" data-isContainTax="'+ orderInfo.isContainTax +'" data-taxRate="'+ orderInfo.taxRate +'"></div>'
						+'				<p>' + ( orderInfo.isContainTax=='1' ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo.taxRate +'%</label>' : '') + '</p>'	
						+'			</div>	'				
						+'		</section>'
						+'		<section class="clearfix">'
						+'			<span class="c-label">订单日期：</span>'
						+'			<div class="c-cont">'
						+'				<p class="c-txt">'+ orderInfo.poFormDate +'</p>'
						+'			</div>'					
						+'		</section>'
						+'	</div>'
						+'</div>'
					setTimeout(function(){fnTip.hideLoading()},0);
            	}
            }
		})
		return html;
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
	//本方交易币种
	currencyType: function(){
		var that = this, $currency = $('#currency'), currencyCodeP = $currency.attr('data-pCurrencyCode');
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
		        "param": '{"companyId":"'+ _vParams.companyId +'","currencyCodeP":"'+ currencyCodeP +'",'+ that.tokens +',"serviceId":"B01_getCompCurrencyByPCurrency"}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var info = data.currencyInfo;
            		if(info.currencyName==''){
            			$currency.find('.c-txt').html('<p class="c-txt">'+ info.currencyNameP +'</p>');
            		}else{
            			$currency.find('.c-txt').html('<p class="c-txt">'+ info.currencyName +'</p>');
            		}
            		if(!info.isBase || info.isBase==''){
            			$currency.find('.curSelect').html('<span>本位币：'+ that.benweibi(info.id).baseCurrencyName +'</span><span>汇率：'+ that.benweibi(info.id).exchangeRate +'</span>').show();
            		}
            	}
            }
        })
	},
	taxTypeSelect3: function(){
		var that = this, options = [], currValue = '', cTaxId = $('#currTax').attr('data-taxId');
		//客户税别对应本方税别
		$.ajax({
			type:"POST",
			async:false,
            url:config.serviceUrl,
            data: {
		        "param": '{"serviceId":"B01_getTaxByCustomerTax",'+ that.tokens +',"commonParam":'+ that.commonParam +',"companyId":"'+ _vParams.companyId +'","customerId":"'+ _vParams.customerId +'","cTaxId":"'+cTaxId+'"}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		currValue = data.taxName;
            	}
            }
        })

		//本方所有税别
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
		        "param": '{ "serviceId":"B01_findTaxList", '+ that.tokens +', "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		var taxs = data.taxList, len = taxs.length, _isContainTax = $('#taxType').attr('data-isContainTax'), _taxRate = $('#taxType').attr('data-taxRate');
            		for(var i=0; i<len; i++){
            			if(_isContainTax=='1'){
							if(taxs[i].isContainTax == _isContainTax && taxs[i].taxRate == _taxRate){
            					options.push(taxs[i].taxName);
            				}
            			}else{
            				if(taxs[i].isContainTax == _isContainTax){
            					options.push(taxs[i].taxName);
            				}
            			}
            			
            		}
            		that.initSelect3('#taxType',options,currValue);
            	}
            }
        })
	},
	benweibi: function(currencyId){
		var that = this, result='', _formDate = $('#poFormDate').html();
		$.ajax({
			type:"POST",
            async:false,
            url:config.serviceUrl,
            data: {
		        "param": '{"serviceId":"B01_getExchangeRateByCurrency","companyId":"'+ _vParams.companyId +'",'+ that.tokens +',"commonParam":'+ that.commonParam +',"currencyId":'+ currencyId +',"rateDate":'+ new Date().getTime(_formDate) +'}'
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		result = data;
            	}
            }
        })
        return result;
	},
	start: function(){
		var that = this;
		$('#btnSaveOrder').before(that.orderBaseInfo());
		that.currencyType();
		that.taxTypeSelect3();

		$('#btnSaveOrder a').on('click',function(){
			that.submitFn();
		})
	},
	submitFn: function(){
		var that = this, value = $('#taxType').select3('value'), poAnswerOrderInfo = [];
		poAnswerOrderInfo[0] = {"taxName":value}
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
            	"param": '{"poAnswerOrderInfo":' + JSON.stringify(poAnswerOrderInfo) + ',"serviceId":"B03_poAnswerToSalesOrder"}'
            },
            success:function(data){
            	data = data || {};
            	if(data.success){
                	fnTip.success(2000);
                	//setTimeout(window.location.reload(),2000);                		
            	}
            }
		})
	}	
}