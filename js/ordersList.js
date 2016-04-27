define(function(require, exports, module){
	require('../js/lib/zepto.mdater.js');
	var formTip = '<div id="formTip" class="formTip"></div>';
	var $itemTips = $('.item-tips');
	var btn = $('.btn-wrap a');
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var lists = {
		init: function(){
			var that = this;

			that._files = [];
			that._lineLists = [];
			that._othersCost = [];
			that.vStatus = [];
			that.totals = 0;
			// that.vTotals = 0;

			that.start();
			fnTip.hideLoading();
			//答交
			$('.contarin').on('click','span.edit',function(){
				var _this = $(this),
					item = _this.parent('.item-wrap');
				var index = item.attr('data-index');
				if( _this.is('.editOther') ){
					that.editResponseCost(item,index);
					that.addNewCost();
					return false;
				}
				that.editResponse(item,index);
				that.addNewResponse(index);
				
			})

			//限制答交数量
			$('#prodAnswerInfo').on('input','input.int02',function(){
				var _this = $(this),
					values = 0,
					parents = _this.parents('.responseBox'),
					index = parents.attr('data-index'),
					val = _this.val();
				var Qtys = that._lineLists[index].valuationQty;

				values = that.reQtys(parents,index);

				if(val>(Qtys-(values-val))){
					_this.val(Qtys-(values-val))
				}
			})

			//选择日期
			that.dateFn();

			that.hideTip();
			$('.item-total').html('总金额：&yen;'+formatMoney(that.totals)).show();
			if(that.vStatus==5){
				$('.item-total-dj').html('答交总金额：&yen;'+formatMoney(that.reCostTotalFn())).show();
				btn.hide();
			}
		},
		orderBaseInfo: function(){
			var that = this, html = '';
			var params = {"serviceId": "B03_getPurchaseOrderAnswerInfo", "poAnswerId": _vParams.poAnswerId, "vendorId": _vParams.vendorId, "commonParam": {"dataSource": "1","interfaceVersion": "","mobileModel": "","mobileSysVersion": "","sourcePage": "","sourceSystem": "1"},"token":_vParams.token, "secretNumber":_vParams.secretNumber}
			$.ajax({
				type:"POST",
                //dataType: "json",
                async: false,
                url:config.serviceUrl,
                data:'param='+JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var orderInfo = data.poAnswerOrderInfo;
                		html += '<h2 class="m-title">基本信息</h2>'
                			 +'<div class="item-wrap">'
							 +'	<ul>'
							 +'		<li><span>平台单号：</span><b>'+ orderInfo.poFormNo +'</b></li>'
							 +'		<li><span>内部单号：</span><b>'+ orderInfo.poInsideNo +'</b></li>'
							 +'		<li><span>客户：</span>'+ orderInfo.companyName +'</li>'
							 +'		<li><span>交易货币：</span>'+ orderInfo.currencyName +'</li>'
							 +'		<li><span>交易税种：</span>'+ orderInfo.taxName + (orderInfo.isContainTax===1 ? '<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+ orderInfo.taxRate +'</label>' : '')+'</li>'
							 +'		<li><span>采购日期：</span>'+ orderInfo.poFormDate +'</li>'
							 +'	</ul>'
							 +'</div>'
						that.vStatus.push(orderInfo.vStatus);

                	}
                }
			})
			return html;
		},
		//附件
		fileList: function(){
			var that = this;
			var params = {"secretNumber":_vParams.secretNumber,"token":_vParams.token,"serviceId":"B01_findFileList","companyId":_vParams.companyId,"fileSource":"1","searchType":"1","id":_vParams.id,"docType":_vParams.docType}
			$.ajax({
				type:"POST",
                //dataType: "json",
                async: false,
                url:config.serviceUrl,
                data:'param='+JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var file = data.fileList;
                		for(var i=0, len=file.length; i<len; i++){
                			that._files.push(file[i]);
                		}
                	}
                }
			})
		},
		prodAnswerInfo: function(){
			var that = this, html = '', reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
			var params = {"serviceId": "B03_findPoAnswerLineList","poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam": {"dataSource": "1","interfaceVersion": "","mobileModel": "","mobileSysVersion": "","sourcePage": "","sourceSystem": "1"},"token":_vParams.token,"secretNumber":_vParams.secretNumber};
			$.ajax({
				type:"POST",
				//dataType: "json",
				async: false,
                url:config.serviceUrl,
			    data:'param='+JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var lineList = data.poLineList;
                		that._lineLists = lineList;
                		html = '<h2 class="m-title">产品信息</h2>';
                		for(var i=0, len=lineList.length; i<len; i++){
	                		html+='<div class="item-wrap" data-index="'+ i +'">'
								+'	<ul>'
								+'		<li><span>物料编码：</span><b>'+ lineList[i].vProdCode +'</b></li>'
								+'		<li><span>物料详细：</span><p>'+ lineList[i].prodName +' '+ lineList[i].prodScale +'</p></li>'
								+'		<li><section><span>数量：</span><em>'+ lineList[i].purchaseQty +'</em>'+ lineList[i].purchaseUnitName +'/<em>'+ lineList[i].valuationQty +'</em>'+ lineList[i].valuationUnitName +'</section><section><span>交期：</span><em>'+ lineList[i].expectedDelivery +'</em></section></li>'
							for(var j=0; j<lineList[i].poSubLineList.length; j++){
								html+='<li class="response"><section><span>数量：</span><em>'+ lineList[i].poSubLineList[j].purchaseQty +'</em>'+ lineList[i].poSubLineList[j].purchaseUnit +'/<em>'+ lineList[i].poSubLineList[j].valuationQty +'</em>'+ lineList[i].poSubLineList[j].valuationUnit +'</section><section><span>交期：</span><em>'+ lineList[i].poSubLineList[j].expectedDelivery +'</em></section></li>'
							}
							html+='		<li class="price"><span>单价：</span>&yen; '+ formatMoney(lineList[i].vTaxPrice) +'/'+ lineList[i].valuationUnitName +'</li>'
								+'		<li><span>备注：</span><p>'+ lineList[i].remark +'</p></li>'
								+'		<li><span>附件：</span><a href="#"><i class=i-'+ (reg.test(that._files[i].fileName) ? "image" : "word") +'></i>'+ that._files[i].fileName +'</a></li>'
								+'		<li class="subtotal" data-total="'+ lineList[i].taxLineTotal +'" data-vTotal="'+ ((lineList[i].poSubLineList.length>0) ? lineList[i].vTaxLineTotal : lineList[i].taxLineTotal) +'"><span>小计：</span><b>&yen; '+ formatMoney(lineList[i].taxLineTotal) +'</b></li>'
								+		((lineList[i].poSubLineList.length>0)?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+ formatMoney(lineList[i].vTaxLineTotal) +'</li>':'')
								+'	</ul>'
								+( that.vStatus==5 ? '' : '<span class="edit"></span>' )
								+'</div>'
							that.totals+=parseInt(lineList[i].taxLineTotal,10);
                		}
                	}
                }
			})
			return html;
		},
		editResponse: function(item,index){
			var that = this;
			var lineLists = that._lineLists;
			var myProdCode, myProdName, myProdScale, vProdCode = lineLists[index].vProdCode;
			var params = {"serviceId":"B01_getProdByCustomerProd","token":_vParams.token,"secretNumber":_vParams.secretNumber,"vendorId":_vParams.vendorId,"cProdCode":_vParams.cProdCode,"commonParam":{"dataSource":"","interfaceVersion":"","mobileModel":"","mobileSysVersion":"","sourcePage" :"","sourceSystem":"1"},"customerId":_vParams.customerId};
			//根据对方物料编码获取我方产品
			$.ajax({
				type:"POST",
                //dataType: "json",
                async: false,
                url:config.serviceUrl,
                data:'param='+JSON.stringify(params),
                success:function(data){
                	$('.ball-clip-rotate').remove();
                	data = data || {};
                	if(data.success){
                		myProdCode = data.prodMap.prodCode;
                		myProdName = data.prodMap.prodName;
                		myProdScale = data.prodMap.prodScale;
                	}
                }
			})
			function newResponseItem(){
				var responseItem = item.find('.response').not('.responseTotal'), responseLen = responseItem.length, html = '';
				if(responseLen!=0){
					for(var i=0; i<responseLen; i++){
						var ems = responseItem.eq(i).find('em');
						html += '<li class="myResponse"><span>答交：</span><input type="text" class="int01" value="'+ ems.eq(0).html() +'"><input type="text" class="int02" value="'+ ems.eq(1).html() +'"><div class="timeBox">'+ ems.eq(2).html() +'</div><input type="hidden" value="'+ ems.eq(2).html() +'"></li>'
					}					
				}
				return html;
			}
			var editHTML = '<div class="responseBox" data-index="'+ index +'">'
							+'<ul class="responseBox1">'
							+'	<li>'
							+'		<span>对方：</span>'
							+'		<p>物料编码：'+ lineLists[index].vProdCode +'<br>'+ lineLists[index].prodName +' '+ lineLists[index].prodScale +'</p>'
							+'	</li>'
							+'	<li class="myProductInfo">'
							+'		<span>我方：</span>'
							+'		<p>物料编码：'+ myProdCode +'<br>'+ myProdName +' '+ myProdScale+'</p>'
							+'	</li>'
							+'	<li><span>数量：</span><em>'+ lineLists[index].purchaseQty + lineLists[index].purchaseUnitName +' /</em><em>'+ lineLists[index].valuationQty + lineLists[index].valuationUnitName +'</em><span>交期：</span><em class="em03">'+ lineLists[index].expectedDelivery +'</em></li>'
							+	newResponseItem()
							+'</ul>'
							+'<div class="btnBox"><a href="javascript:;" class="addResponse">新增答交栏</a></div>'
							+'<ul class="responseBox2">'
							+'	<li><span>单价：</span>¥'+ formatMoney(lineLists[index].vTaxPrice) +'/'+ lineLists[index].valuationUnitName +'</li>'
							+'	<li><span>备注：</span><p>'+ lineLists[index].remark +'</p></li>'
							+'	<li class="subtotal"><span>小记：</span><b>&yen; '+ formatMoney(lineLists[index].taxLineTotal) +'</b></li>'
							+'</ul>'
							+'<div class="btns">'
							+'	<a class="btn-cancel" href="javascript:;">取消</a>'
							+'	<a class="btn-save" href="javascript:;">确定</a>'
							+'</div>'
							+'</div>'
			item.hide();
			item.after(editHTML);
			$body.append(formTip);

			//取消
			$('#prodAnswerInfo').on('click','.btn-cancel',function(e){
				that.cancel($(this),$('#prodAnswerInfo'));
				e.preventDefault();
			})
			//确定
			$('#prodAnswerInfo').on('click','.btn-save',function(e){
				that.save($(this),$('#prodAnswerInfo'));
				e.preventDefault();
			})
		},
		itemshow: function(self,parent){
			var idx = self.parents('.responseBox').attr('data-index');
			self.parents('.responseBox').remove();
			parent.find('.item-wrap').eq(idx).show();
			$('#formTip').remove();
		},
		addNewResponse: function(index){
			var that = this;
			var isAdd = true;
			var Qtys = that._lineLists[index].valuationQty;
			var cost = '<li class="myResponse"><span>答交：</span><input type="text" class="int01" /><input type="text" class="int02" /><div class="timeBox"></div><input type="hidden" /></li>';

			$body.on('click','.addResponse',function(){
				var _this = $(this),
					parents = _this.parents('.responseBox'),
					$responseBox1 = parents.find('.responseBox1'),
					inputs = $responseBox1.find('li:last-child').find('input');
				isAdd = true;
				if(that.reQtys(parents,index)==Qtys)return;
				if(inputs.length>1){
					inputs.forEach(function(item){
						if(item.value==''){
							$('#formTip').html('新增答交内容为空不能继续新增！').addClass('formTipShow');
							isAdd=false;
							return;
						}
					})
				}
				if(isAdd){
					$responseBox1.append(cost);					
				}
			})
		},
		othersCost: function(){
			var that=this, html='', subtotal=0, resubtotal=0, _responseCost=false;
			var params = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B03_findPoAnswerOtherCostList", "poAnswerId":_vParams.poAnswerId, "vendorId":_vParams.vendorId, "commonParam":{ "dataSource":"1", "sourcePage":"1", "sourceSystem":"1", "mobileModel":"1", "interfaceVersion":"1", "mobileSysVersion":"1" }};
			$.ajax({
				type:"POST",
                //dataType: "json",
                async: false,
                url:config.serviceUrl,
			    data:'param='+JSON.stringify(params),
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var otherCostList = data.poOthreCostList;
                		that._othersCost = otherCostList;
                		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';
                		for(var i=0, len=otherCostList.length; i<len; i++){
                			html+='<li data-costName="'+ otherCostList[i].costName +'" data-costAmount="'+ otherCostList[i].costAmount +'" data-vCostAmount="'+ otherCostList[i].vCostAmount +'"><span>'+ otherCostList[i].costName +'：</span><b>&yen; '+ formatMoney(otherCostList[i].costAmount) +'</b><b class="dj"><em class="money" data-money="'+ (otherCostList[i].vCostAmount=='' ? otherCostList[i].costAmount : otherCostList[i].vCostAmount) +'">'+ (otherCostList[i].vCostAmount=='' ? '' : formatMoney(otherCostList[i].vCostAmount)) +'</em></b></li>';
                			subtotal += parseInt(otherCostList[i].costAmount,10);
                			resubtotal += parseInt((otherCostList[i].vCostAmount=='' ? otherCostList[i].costAmount : otherCostList[i].vCostAmount),10);
                			if(otherCostList[i].vCostAmount!=''){
                				_responseCost = true;
                			}
                		}
                		html+='<li id="othersCostSubtotal" class="subtotal" data-total="'+ subtotal +'" data-vTotal="'+ (_responseCost ? resubtotal : subtotal) +'"><span>小计：</span><b>&yen; '+ formatMoney(subtotal) +'</b></li>'
                		if(_responseCost){
                			html+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+ formatMoney(resubtotal) +'</li>'
                		}
                		html+='</ul>'
                		html+=( that.vStatus==5 ? '' : '<span class="edit editOther"></span>' )
                		html+='</div>';
                		that.totals+=parseInt(subtotal,10);
                	}
                }
			})
console.log(html)
			return html;
		},
		editResponseCost: function(item){
			var that = this, othersCost = that._othersCost, lens = othersCost.length;

			function newResponseItem(){
				var responseItem = $(item).find('.response').not('#changeCost'), responseLen = responseItem.length, html = '';
				if(responseLen!=0){
					for(var i=0; i<responseLen; i++){
						var ems = responseItem.eq(i).find('em');
						html += '<li class="addNewCost"><input type="text" value="'+ ems.eq(0).html() +'"><input type="text" value="'+ ems.eq(1).html() +'"></li>'
					}					
				}
				return html;
			}

			var editHtmlCost = '<div class="responseBox" data-index="0"><ul class="responseCost">';

			for(var i=0; i<lens; i++){
				var _val = ($('#othersCost .dj').eq(i).find('em').html()=='' ? '' : $('#othersCost .dj').eq(i).find('em').attr('data-money'));
				editHtmlCost+='<li><span>'+ othersCost[i].costName +'：</span><b>&yen; '+ formatMoney(othersCost[i].costAmount) +'</b><input type="text" class="original" id="dj_'+ i +'" value="'+ _val +'" /></li>';
			}
			editHtmlCost+=newResponseItem()
			editHtmlCost+='</ul>'
						+'<div class="btnBox"><a href="javascript:;" class="addCost">新增费用</a></div>'
						+'<div class="btns">'
						+'	<a class="btn-cancel" href="javascript:;">取消</a>'
						+'	<a class="btn-save" href="javascript:;">确定</a>'
						+'</div>'
					+'</div>'

			item.hide();
			item.after(editHtmlCost);
			$body.append(formTip);
			//取消
			$('#othersCost').on('click','.btn-cancel',function(e){
				that.cancel($(this),$('#othersCost'));
				e.preventDefault();
			})
			//确定
			$('#othersCost').on('click','.btn-save',function(e){
				that.save($(this),$('#othersCost'));
				e.preventDefault();
			})
		},
		addNewCost: function(){
			var isAdd = true;
			var cost = '<li class="addNewCost"><input type="text" /><input type="text" /></li>';
			$body.on('click','.addCost',function(){
				var _this = $(this),
					$responseCost = _this.parents('.responseBox').find('.responseCost'),
					inputs = $responseCost.find('li:last-child').find('input');
				isAdd = true;
				if(inputs.length>1){
					inputs.forEach(function(item){
						if(item.value==''){
							$('#formTip').html('新增费用内容为空不能继续新增！').addClass('formTipShow');
							isAdd=false;
							return;
						}
					})
				}
				if(isAdd){
					$responseCost.append(cost);					
				}

			})
		},
		cancel: function(self,parent){
			var that = this;
			that.itemshow(self,parent);
		},
		save: function(self,parent){

			var that = this, parents = self.parents('.m-item');
			if(parents.is('#prodAnswerInfo')){

				var myResponse = self.parents('.responseBox').find('li.myResponse'), len = myResponse.length;

				if(len==0){
					that.itemshow(self,parent);
					return false;
				}
				that.createResponse($('.myResponse'),3,self,parent,'isProdAnswer');

			}else if(parents.is('#othersCost')){

				var lens2 = $('.original').length;
				for(var l=0; l<lens2; l++){
					var originalVal = $('.original').eq(l).val();
					if(originalVal==''){
						continue;
					}
					$('#othersCost .dj').eq(l).html('&yen; <em class="money" data-money="' + originalVal + '">' + formatMoney(originalVal) + '</em>');
				}
				that.createResponse($('.addNewCost'),2,self,parent,'isOtherCost');

			}
		},
		createResponse: function(objs,sum,self,parent,type){
			var that = this, lens = objs.length, html = '', vals = new Array(),
				lineLists = that._lineLists, idx = self.parents('.responseBox').attr('data-index');
			for(var i=0; i<lens; i++){
				vals[i]=new Array();
				for(var j=0; j<sum; j++){
					var _this = objs.eq(i).find('input').eq(j),
						thisVal = _this.val();
					if(thisVal==''){
						_this.focus();
						return false;
					}
					vals[i][j] = thisVal;
				}
			}
			for(var k=0; k<lens; k++){
				if(type=='isProdAnswer'){
					html+='<li class="response"><section><span>数量：</span><em>'+ vals[k][0] +'</em>'+lineLists[idx].purchaseUnitName+'/<em>'+ vals[k][1] +'</em>'+lineLists[idx].valuationUnitName+'</section><section><span>交期：</span><em>'+ vals[k][2] +'</em></section></li>'
				}else{
					html+='<li class="response" data-costName="'+ vals[k][0] +'" data-costAmount="" data-vCostAmount="'+ vals[k][1] +'"><span><em>'+ vals[k][0] +'</em>：</span>&yen; <em class="money" data-money="'+ vals[k][1] +'">'+ formatMoney(vals[k][1]) +'</em></li>'				
				}
			}
			that.itemshow(self,parent);
			parent.find('.item-wrap').eq(idx).find('.response').remove();
			if(type=='isProdAnswer'){
				parent.find('.item-wrap').eq(idx).find('.price').before(html);
				var values = that.reQtys(self.parents('.responseBox'),idx);
				if(values!=''||values!=undefined){
					parent.find('.item-wrap').eq(idx).find('.subtotal').attr('data-vtotal',values*lineLists[idx].vTaxPrice);
					parent.find('.item-wrap').eq(idx).find('ul').append('<li class="response responseTotal"><span>答交金额：</span>&yen; '+ formatMoney((values*lineLists[idx].vTaxPrice)) +'</li>')
				}
			}else{
				$('#othersCostSubtotal').before(html);
				//变更费用
				var moneys = 0, moneyChange = false;
				parent.find('.item-wrap').eq(idx).find('em.money').each(function(){
					var moneyItem = $(this).html();
					if(moneyItem!=''){
						moneyChange = true;
					}
					moneyItem = (moneyItem=='' ? $(this).attr('data-money') : moneyItem);
					moneys+=parseInt(moneyItem,10);
				})
				if(moneyChange){
					$('#othersCostSubtotal').attr('data-vtotal',moneys);
					$('#othersCostSubtotal').after('<li id="changeCost" class="response" data-otherMoney="'+ moneys +'"><span>变更费用：</span>&yen; '+ formatMoney(moneys) +'</li>');				
				}
			}
			$('.item-total-dj').html('答交总金额：&yen;'+formatMoney(that.reCostTotalFn())).show();
		},
		dateFn: function(){
			$('.timeBox').mdater({
				minDate : new Date()
			});
		},
		hideTip: function(){
			$body.on('focus','input[type="text"]',function(){
				$('#formTip').removeClass('formTipShow');
			})
		},
		reQtys: function(parents,index){
			var vals = 0;
			parents.find('.int02').each(function(){
				var _this = $(this);
				vals += parseInt(_this.val(),10);
			})
			return vals;			
		},
		reCostTotalFn: function(){
			var that = this,
				totals = 0;
			$('.contarin').find('.subtotal').each(function(){
				totals += parseInt($(this).attr('data-vtotal'),10);
			})
			return totals;
		},
		start: function(){
			var that = this;
			that.fileList();
			var orderAnswerInfo = document.getElementById('orderAnswerInfo');
			var prodAnswerInfo = document.getElementById('prodAnswerInfo');
			var othersCost = document.getElementById('othersCost');
			if(orderAnswerInfo){
				orderAnswerInfo.innerHTML = that.orderBaseInfo();
			}
			if(prodAnswerInfo){
				prodAnswerInfo.innerHTML = that.prodAnswerInfo();
				//$itemTips.addClass('tips-error').find('span').html('答交异常');
				//$itemTips.addClass('tips-success').find('span').html('答交无误');
			}
			if(othersCost){
				othersCost.innerHTML = that.othersCost();
			}
			$('.btn-wrap a').on('click',function(){
				that.submitFn();
			})
		},
		submitFn: function(){
			//产品答交
			var that = this, inParams, responseVal = new Array();
			var poLineList = $('#prodAnswerInfo').find('.item-wrap'),
				poLineListLen = poLineList.length;
			for(var i=0; i<poLineListLen; i++){
				var response = poLineList.eq(i).find('.response').not('.responseTotal'),
					responseLen = response.length;
				responseVal[i]=new Array();
				for(var j=0; j<responseLen; j++){
					var ems = $(response[j]).find('em');
					responseVal[i][j] = {
						"purchaseQty":ems.eq(0).html(),
						"valuationQty":ems.eq(1).html(),
						"expectedDelivery":new Date().getTime(ems.eq(2).html()).toString()
					}
				}
			}

			//其他费用
			var costLists = $('#othersCost').find('li').not('#othersCostSubtotal,#changeCost'),
				costLens = costLists.length,
				modiPoOthreCostList = [];
			for(var k=0; k<costLens; k++){
				modiPoOthreCostList[k] = {
					"costName":costLists.eq(k).attr('data-costName'),
					"costAmount":costLists.eq(k).attr('data-costAmount'),
					"vCostAmount":costLists.eq(k).attr('data-vCostAmount')
				}
			}

			//入参字符串
			inParams = {"modiPoLineList":responseVal,"modiPoOthreCostList":modiPoOthreCostList,"serviceId":"B03_saveAnswerPo"};
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data:'param='+JSON.stringify(inParams),
                success:function(data){
                	data = data || {};
                	if(data.success){
	                	fnTip.success(2000);
	                	setTimeout(window.location.reload(),2000);                		
                	}else{
                		fnTip.error(2000);
                	}
                }
			})
		}
	};

	module.exports = lists
	
});