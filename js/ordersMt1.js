define(function(require, exports, module){

	var ordersMt = {
		init: function(){
			var that = this;

			that.start();
		},
		orderBaseInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"9b14aff650e129870793d4eabd944cb5", "serviceId":"B03_getPurchaseOrderAnswerInfo", "secretNumber":"f07e773c7c66c684f5c11a26225fa88e", "poAnswerId":"", "vendorId":"", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } }'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var orderInfo = data.poAnswerOrderInfo;
                		html = '<div id="orderBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2>';
                		for(var i=0, len = orderInfo.length; i<len; i++){
	                		html+='<div class="item-wrap">'
								+'	<ul>'
								+'		<li><span>客户单号：</span><b>'+ orderInfo[i].poInsideNo +'</b></li>'
								+'		<li><span>客户：</span>'+ orderInfo[i].companyName +'</li>'
								+'		<li><span>交易币别：</span><em id="currencyCode">'+ orderInfo[i].currencyCode +'</em></li>'
								+'		<li><span>交易税种：</span><em id="currTax" class="currTax">'+ orderInfo[i].taxName +'</em>' + ( orderInfo[i].isContainTax=='1' ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo[i].taxRate +'</label>' : '')+'</li>'
								+'		<li><span>采购日期：</span><em id="poFormDate">'+ orderInfo[i].poFormDate +'</li>'
								+'	</ul>'
								+'</div>'
								+'</div>'
								+'<div class="m-item">'
								+'	<h2 class="m-title">销售订单信息维护</h2>'
								+'	<div class="item-wrap">'
								+'		<section class="clearfix">'
								+'			<span class="c-label">交易币别：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ orderInfo[i].currencyCode +'</p>'
								+'				<div id="benweibi" class="curSelect"><span>本位币：'+ that.benweibi().baseCurrencyCode +'</span><span>汇率：'+ that.benweibi().exchangeRate +'</span></div>'				
								+'			</div>'			
								+'		</section>'
								+'		<section class="m-select clearfix">'
								+'			<span class="c-label">交易税种：</span>'
								+'			<div class="c-cont">'
								+'				<div id="taxType" class="select3-input" data-isContainTax="'+ orderInfo[i].isContainTax +'" data-taxRate="'+ orderInfo[i].taxRate +'"></div>'
								+'				<p>' + ( orderInfo[i].isContainTax=='1' ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo[i].taxRate +'</label>' : '') + '</p>'	
								+'			</div>	'				
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">订单日期：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ orderInfo[i].poFormDate +'</p>'
								+'			</div>'					
								+'		</section>'
								+'	</div>'
								+'</div>'
                		}
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
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
		taxTypeSelect3: function(){
			var that = this, options = [];
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_findTaxList","companyIdList":["10000008"],"token":"12222"}'
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
                		//默认税种
                		var currValue = $('#currTax').html();
                		that.initSelect3('#taxType',options,currValue);
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
            })
		},
		benweibi: function(){
			var that = this, result, _formDate = $('#poFormDate').html();
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_getExchangeRateByCurrency","companyId":"10000002","token":"42bf012fb54b7eb3faaddcbc57e54cc0","secretNumber":"4ffcaa9492a61b7de667464b545deca5","commonParam":{"mobileModel":"1","sourcePage":"1","dataSource":"1","mobileSysVersion":"1","interfaceVersion":"1"},"currencyId":"1","rateDate":'+ new Date().getTime(_formDate) +'}'
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
			that.taxTypeSelect3();

			$('#btnSaveOrder a').on('click',function(){
				that.submitFn();
			})
		},
		submitFn: function(){
			var that = this, inParams, value = $('#taxType').select3('value'), poAnswerOrderInfo = [];
			poAnswerOrderInfo[0] = {"taxName":value}
			inParams = '"poAnswerOrderInfo":' + JSON.stringify(poAnswerOrderInfo) + ',"serviceId":"B03_poAnswerToSalesOrder"';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data:{param:inParams},
                success:function(data){
                	data = data || {};
                	if(data.success){
	                	fnTip.success(2000);
	                	setTimeout(window.location.reload(),2000);                		
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
		}
	};

	module.exports = ordersMt;
	
});