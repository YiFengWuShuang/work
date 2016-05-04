/*
收货地址或自提点获取未做
*/
define(function(require, exports, module){
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var ordersMt = {
		init: function(){
			var that = this;
			that.commonParam = JSON.stringify(commonParam());
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


			$('#savePayInfoList').before(that.setPayOrderInfo());
			that.conditionSelect();
			that.LogisticalSelect();
			that.address();
			that.payWaySelect();
			$('#savePayInfoList a').on('click',function(){
				that.submitFn();
			})
		},
		setPayOrderInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B03_getPurchaseOrderAnswerInfo","poAnswerId":"'+ _vParams.poAnswerId +'","vendorId":"'+ _vParams.vendorId +'","token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","commonParam":'+ that.commonParam +'}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var infos = data.poAnswerOrderInfo;
            			html+='<div id="payInfoList" class="m-item">'
							+'	<div class="item-wrap">'
							+'		<ul>'
							+'			<li><span>交易条件：</span><p id="jyCurrVal" data-conditionId="'+ infos.conditionId +'">'+ infos.conditionName +'</p></li>'
							+'			<li><span>物流方式：</span><p><em id="logisticsVal">'+ enumFn(that.logisticsType,infos.logisticsType) +'</em>' +((infos.logisticsType=='3') ? '（自提点：'+ infos.address +'）':'')+'</p></li>'
							+'			<li><span>收货地址：</span><p>'+ infos.address +'；<br>电话：'+ infos.mobile +'</p></li>'
							+'			<li><span>付款条件：</span><p id="payWayName" data-payWayId="'+ infos.payWayId +'">'+ infos.payWayName +'</p></li>'
							+'			<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
							+'			<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
							+'			<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'
							+'		</ul>'
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
							+'		<section id="address" class="clearfix" data-addressId="'+ infos.addressId +'">'
							+'			<span class="c-label">收货地址：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.address +'；<br>电话：'+ infos.mobile +'</p>'
							+'			</div>'
							+'		</section>'
							+'		<section class="m-select clearfix">'
							+'			<span class="c-label">收款条件：</span>'
							+'			<div class="c-cont">'
							+'				<div id="checkoutType" class="select3-input"></div>'
							+'			</div>'
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">发票类型：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ enumFn(that.invoiceType,infos.invoiceType) +'</p>'
							+'			</div>'
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">开票抬头：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoiceHeader +'</p>'
							+'			</div>'					
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">发票内容：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoiceContent +'</p>'
							+'			</div>'					
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">纳税人识别码：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoicePayMark +'</p>'
							+'			</div>'					
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">发票电话：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoiceTel +'</p>'
							+'			</div>'					
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">发票开户行：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoiceBank +'</p>'
							+'			</div>'					
							+'		</section>'
							+'		<section class="clearfix">'
							+'			<span class="c-label">发票账号：</span>'
							+'			<div class="c-cont">'
							+'				<p class="c-txt">'+ infos.invoiceAccount +'</p>'
							+'			</div>'				
							+'		</section>'
							+'	</div>'
							+'</div>'
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

		conditionSelect: function(){
			var that = this, options = [], currValue = '', $jyCurrVal = $('#jyCurrVal'), cConditionId = $jyCurrVal.attr('data-conditionId');

			//根据客户交易条件获取本方交易条件
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"companyId":"'+ _vParams.companyId +'","serviceId":"B01_getConditionByCustomerCondition","token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","commonParam":'+ that.commonParam +',"customerId":"'+ _vParams.customerId +'","cConditionId":"'+cConditionId+'"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		currValue = data.conditionName;
                	}else{
                		currValue = $jyCurrVal.html();
                	}
                }
            })
            
            //交易条件
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_findCompanyConditionList","token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'","companyId":"'+ _vParams.companyId +'","conditionType":"2"}'//交易条件类型（1-采购；2-销售）
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var jytj = data.conditionList, len = jytj.length;
                		for(var i=0; i<len; i++){
                			options.push(jytj[i].conditionName);
                		}
                		that.initSelect3('#dealType',options,currValue);
                	}
                }
            })
		},

		//物流方式
		LogisticalSelect: function(){
			var that = this, options = [];
			that.logisticsType.forEach(function(val){
				options.push(val.Value);
			})
    		var currValue = $('#logisticsVal').html();
    		that.initSelect3('#logisticsType',options,currValue);
		},

		//收/发货地址
		address: function(){
			var that = this, $address = $('#address'), id = $address.attr('data-addressId');
			//根据客户址码信息获取本方地址信息
			$.ajax({
				type:"POST",
                url:config.serviceUrl,
                data: {
			        "param": '{"type":"1","companyId":"'+ _vParams.companyId +'","customerId":"'+ _vParams.customerId +'","cAddressId":"'+ id +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'","serviceId":"B01_getAddrInfoByCustomerAddrId"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var address = data.customerAddress;
                		$address.html('<span class="c-label">收货地址：</span><div class="c-cont"><p class="c-txt">'+ address.address +'；<br>电话：'+ address.mobile +'</p></div>')
                	}
                }
            })
		},
		payWaySelect: function(){
			var that = this, options = [], currValue = '', cPayWayId = $('#payWayName').attr('data-payWayId');
			//根据客户付款方式获取本方收款方式
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"token":"'+ _vParams.token +'","serviceId":"B01_getPayWayByCustomerPayWay","secretNumber":"'+ _vParams.secretNumber +'","commonParam":'+ that.commonParam +',"companyId":"'+ _vParams.companyId +'","customerId":"'+ _vParams.customerId +'","cPayWayId":"'+cPayWayId+'"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		currValue = data.payWapName;
                	}
                }
            })
            //本方所有收款条件
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId": "B01_findCompanyPayWayList","commonParam": '+ that.commonParam +',"token": "'+ _vParams.token +'","secretNumber": "'+ _vParams.secretNumber +'","companyId":"'+ _vParams.companyId +'","payWayType":"1"}'//类型(1-收款，2-付款)
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var payWays = data.payWayList, len = payWays.length;
                		for(var i=0; i<len; i++){
                			options.push(payWays[i].payWayName);
                		}
                		that.initSelect3('#checkoutType',options,currValue);
                	}
                }
            })    
		},
		submitFn: function(){
			var that = this, inParams, poAnswerOrderInfo = [];
			var value1 = $('#dealType').select3('value'),
				value2 = $('#logisticsType').select3('value'),
				value3 = $('#checkoutType').select3('value');
			poAnswerOrderInfo[0] = {
				"conditionName":value1,
				"logisticsType":value2,
				"payWayName":value3
			}

			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
                	"param": '{"poAnswerOrderInfo":' + JSON.stringify(poAnswerOrderInfo) + ',"serviceId":"B03_poAnswerToSalesOrder"}'
                },
                success:function(data){
                	fnTip.success(2000);
                	setTimeout(window.location.reload(),2000);
                }
			})
		}
	};

	module.exports = ordersMt;
	
});