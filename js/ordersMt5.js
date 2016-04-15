define(function(require, exports, module){
	
	var ordersMt = {
		init: function(){
			var that = this;
			
			$('#savePayInfoList').before(that.setPayOrderInfo());
			that.conditionSelect();
			that.LogisticalSelect();
			that.payWaySelect();
			$('#savePayInfoList a').on('click',function(){
				that.submitFn();
			})
		},
		setPayOrderInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_findCompanyConditionList","token":"7a5c5403be1131c6f9a131d532c44144","companyId":"10000001"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data){
                		var infos = data.poAnswerOrderInfo, len = infos.length;
                		for(var i=0; i<len; i++){
                			html+='<div id="payInfoList" class="m-item">'
								+'	<div class="item-wrap">'
								+'		<ul>'
								+'			<li><span>交易条件：</span><p id="jyCurrVal">'+ infos[i].conditionName +'</p></li>'
								+'			<li><span>物流方式：</span><p><em id="logisticsVal">'+ infos[i].logisticsType +'</em>' +((infos[i].logisticsType.indexOf('自提')!=-1) ? '（自提点：'+ infos[i].address +'）':'')+'</p></li>'
								+'			<li><span>收货地址：</span><p>'+ infos[i].address +'；<br>电话：'+ infos[i].mobile +'</p></li>'
								+'			<li><span>收款条件：</span><p id="payWayName">'+ infos[i].payWayName +'</p></li>'
								+'			<li><span>支付方式：</span><p>'+ infos[i].paymentType +'</p></li>'
								+'			<li><span>发票类型：</span><p>'+ infos[i].invoiceType +'</p></li>'
								+'			<li><span>发票抬头：</span><p>'+ infos[i].invoiceHeader +'</p></li>'
								+'			<li><span>发票类容：</span><p>'+ infos[i].invoiceContent +'</p></li>'
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
								+'		<section class="clearfix">'
								+'			<span class="c-label">收货地址：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].address +'；<br>电话：'+ infos[i].mobile +'</p>'
								+'			</div>'
								+'		</section>'
								+'		<section class="m-select clearfix">'
								+'			<span class="c-label">收款条件：</span>'
								+'			<div class="c-cont">'
								+'				<div id="checkoutType" class="select3-input"></div>'
								+'			</div>'
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">支付方式：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].paymentType +'</p>'		
								+'			</div>'				
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">发票类型：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceType +'</p>'
								+'			</div>'
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">开票抬头：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceHeader +'</p>'
								+'			</div>'					
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">发票类容：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceContent +'</p>'
								+'			</div>'					
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">纳税人识别码：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoicePayMark +'</p>'
								+'			</div>'					
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">发票电话：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceTel +'</p>'
								+'			</div>'					
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">发票开户行：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceBank +'</p>'
								+'			</div>'					
								+'		</section>'
								+'		<section class="clearfix">'
								+'			<span class="c-label">发票账号：</span>'
								+'			<div class="c-cont">'
								+'				<p class="c-txt">'+ infos[i].invoiceAccount +'</p>'
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
		conditionSelect: function(){
			var that = this, options = [];
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_findCompanyConditionList","token":"7a5c5403be1131c6f9a131d532c44144","companyId":"10000001","conditionType":"1"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data){
                		var jytj = data.conditionList, len = jytj.length;
                		for(var i=0; i<len; i++){
                			options.push(jytj[i].conditionName);
                		}
                		var currValue = $('#jyCurrVal').html();
                		that.initSelect3('#dealType',options,currValue);
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
            })    
		},
		LogisticalSelect: function(){
			var that = this, options = ['物流','快递','自提'];
    		var currValue = $('#logisticsVal').html();
    		that.initSelect3('#logisticsType',options,currValue);
		},
		payWaySelect: function(){
			var that = this, options = [];
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId": "B01_findCompanyPayWayList","commonParam": {"sourcePage": "1","dataSource": "1","mobileModel": "1","mobileSysVersion": "1","interfaceVersion": "1" },"token": "5c04f696072504bf76d38d7ad1636d3f","secretNumber": "b317bc79e150f0472d2f256bd75a6537","companyId":"10000001","payWayType":"1"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data){
                		var payWays = data.payWayList, len = payWays.length;
                		for(var i=0; i<len; i++){
                			options.push(payWays[i].payWayName);
                		}
                		var currValue = $('#payWayName').html();
                		that.initSelect3('#checkoutType',options,currValue);
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
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
			inParams = '"poAnswerOrderInfo":' + JSON.stringify(poAnswerOrderInfo) + ',"serviceId":"B03_getPurchaseOrderInfo"';

			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data:{param:inParams},
                success:function(data){
                	fnTip.success(2000);
                	setTimeout(window.location.reload(),2000);
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
		}
	};

	module.exports = ordersMt;
	
});