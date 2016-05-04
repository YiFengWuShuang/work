define(function(require, exports, module){
	var formTip = '<div id="formTip" class="formTip"></div>';
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var ordersMt = {
		init: function(){
			var that = this;
			that.purchaseUnit = [];
			that.valuationUnit = [];
			that.commonParam = JSON.stringify(commonParam());
			that.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
			that.load = false;
			that.start();
			fnTip.hideLoading();
			$('#btnSaveOrder a').on('click',function(){
				that.submitFn();
			})
		},
		orderInfos: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                async:false,
                url:config.serviceUrl,
                data: {
			        "param": '{'+ that.tokens +',"serviceId":"B03_findPoAnswerLineList","poAnswerId":"'+ _vParams.poAnswerId +'","venderId":"'+ _vParams.venderId +'","commonParam":'+ that.commonParam +' }'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var orderInfo = data.poLineList;
                		for(var i=0, len = orderInfo.length; i<len; i++){
                			var orderInfoItem = orderInfo[i];
                			var itemLen=orderInfoItem.poSubLineList.length;
	                		html+='<div class="m-item">'
								+'	<h2 class="m-title">基本信息</h2>'
								+'	<div class="item-wrap">'
								+'		<ul>'
								+'			<li><span>物料编码：</span>'+ orderInfoItem.prodCode +'</li>'
								+'			<li><span>物料详细：</span><p>'+ orderInfoItem.prodName + ' ' + orderInfoItem.prodScale +'</p></li>'
								+'			<li><section><span>数量：</span>'+ orderInfoItem.purchaseQty + orderInfoItem.purchaseUnitName +'/'+ orderInfoItem.valuationQty + orderInfoItem.valuationUnitName +'</section><section><span>交期：</span>'+ orderInfoItem.expectedDelivery +'</section></li>';

							for(var j=0; j<itemLen; j++){
								var subList = orderInfoItem.poSubLineList[j];
								html+='<li class="response"><section><span>数量：</span>'+ subList.purchaseQty + subList.purchaseUnit +'/'+ subList.valuationQty + subList.valuationUnit +'</section><section><span>交期：</span>'+ subList.expectedDelivery +'</section></li>'
								that.purchaseUnit.push(subList.purchaseUnit);
								that.valuationUnit.push(subList.valuationUnit);
							}

							html+='			<li><span class="price">单价：</span>&yen; '+ orderInfoItem.taxPrice +'.00/'+ orderInfoItem.valuationUnitName +'</li>'
								+'			<li><span>备注：</span><p>'+ orderInfoItem.remark +'</p></li>'
								+'		</ul>'
								+'	</div>'
								+'</div>'
								+'<div class="m-item">'
								+'	<h2 class="m-title">销售订单信息维护</h2>'
								+'	<div class="item-wrap">'
								+'		<section class="clearfix">'
								+'			<span class="c-label"><b>我方编码：</b></span>'
								+'			<div class="wfItem">'
								+				orderInfoItem.vProdCode
								+'				<p>'+ orderInfoItem.vProdName + ' ' + orderInfoItem.vProdScale +'</p>'
								+'			</div>'
								+'			<div class="itemEdit">'
								+'				<input type="text" class="int-search" placeholder="请输入我方编码" />'
								+'				<div class="btns"><a class="btn-cancel">取消</a><a class="btn-save">确定</a></div>'
								+'			</div>'
								+'		</section>';
							for(var k=0; k<itemLen; k++){
								var subList2 = orderInfoItem.poSubLineList[k];
								html+='<section class="m-select clearfix">'
									+'	<span class="c-label"><b>数量：</b></span>'
									+'	<div class="c-cont">'
									+'		<div class="c-cont-item">'
									+'			<span>'+ subList2.purchaseQty +'</span>'
									+'			<div id="purchaseQty_'+ k +'" class="select3-input"></div>'
									+'		</div>'
									+'		<div class="c-cont-item">'
									+'			<span>'+ subList2.valuationQty +'</span>'
									+'			<div id="valuationQty_'+ k +'" class="select3-input"></div>'
									+'		</div>'
									+'	</div>'
									+'</section>'
							}
							html+='<span class="edit"></span></div></div>'
                		}
                		that.load = true;
                	}
                }
			})
			return html;
		},
		units: function(){
			var that = this, prodUnitNames = [], basicUnitNames = [];
			$.ajax({
				type:"POST",
                async:false,
                url:config.serviceUrl,
                data: {
			        "param": '{"serviceId":"B01_findProdUnitListByProd","companyId":'+ _vParams.companyId +',"prodId":"'+ _vParams.prodId +'",'+ that.tokens +',"commonParam":'+ that.commonParam +'}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var prodUnitLists = data.prodUnitList;
                		for(var i=0, len=prodUnitLists.length; i<len; i++){
                			prodUnitNames.push(prodUnitLists[i].prodUnitName);
                			basicUnitNames.push(prodUnitLists[i].basicUnitName);
                		}
                	}
                }
			})
			var select3Len = $('.m-select').length;
			for(var j=0; j<select3Len; j++){
				that.initSelect3('#purchaseQty_'+j,prodUnitNames,that.purchaseUnit[j]);
				that.initSelect3('#valuationQty_'+j,basicUnitNames,that.valuationUnit[j]);
			}
		},
		start: function(){
			var that = this;
			$('#btnSaveOrder').before(that.orderInfos());
			if(that.load){
				that.units();
			}
			that.editProdCode();
			that.hideTip();
		},
		initSelect3: function(el,options,currValue){
			$(el).select3({
			    allowClear: true,
			    items:options,
			    placeholder: '请选择',
			    showSearchInputInDropdown: false,
			    value: currValue
			});
		},
		editProdCode: function(){
			$('.contarin').on('click','.edit',function(){
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
	                //dataType: "json",
	                url:config.serviceUrl,
	                data: {
				        "param": '{"serviceId": "B01_getProdInfoByCode","companyId":"'+ _vParams.companyId +'","vendorId":"'+ _vParams.vendorId +'","prodCode":'+ code +',"commonParam":'+ that.commonParam +','+ that.tokens +'}'
				    },
	                success:function(data){
	                	data = data || {};
	                	if(data.success){
	                		var prodInfos = data.prodInfo;
	                		if(code==prodInfos.prodCode){
	                			_this.parents('.item-wrap').find('.wfItem').html(prodInfos.prodCode + '<p>'+ prodInfos.prodName + ' ' + prodInfos.prodScale +'</p>');
	                			resumed(_this);
	                		}else{
	                			$('#formTip').html('产品编码错误，请重新输入').addClass('formTipShow');
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
		hideTip: function(){
			$body.on('focus','input[type="text"]',function(){
				$('#formTip').removeClass('formTipShow');
			})
		},
		submitFn: function(){
			var that = this, inParams, value = $('#taxType').select3('value'), poAnswerOrderInfo = [];
			poAnswerOrderInfo[0] = {"taxName":value}

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