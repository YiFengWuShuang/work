/*
 *订单答交
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
var $currencySymbol = '';
var $priceDecimalNum = '';
var $amountDecimalNum = '';
var $prodMapList = [];
var $fileData;
var $btnTxet = '分批答交';
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var Lists = function(){
	this.init();
}
Lists.prototype = {
	init: function(){
		var that = this;
		that._files = [];
		that._othersCost = [];
		that.status;
		that.vStatus;
		that.totals = 0;
		that.load = false;
		that.memberId = '';

		setTimeout(function(){
    		container.show();
			fnTip.hideLoading();
		},0);

		that.start();
		
		//答交
		container.on('click','span.edit',function(){
			if($('.responseBox').length){
				popup('alert','','请先"取消/确定"未完成操作再继续！');
				return false;
			}
			var _this = $(this),
				item = _this.parent('.item-wrap');
			var index = item.attr('data-index');
			if( _this.is('.editOther') ){
				that.editResponseCost(item,index);
				that.addNewCost();
				return false;
			}
			that.editResponse(item,index);
		})

		//选择日期
		that.dateFn();

		that.hideTip();
		that.delResponse();
	},
	orderBaseInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_getPurchaseOrderAnswerInfo", "poAnswerId": _vParams.poAnswerId, "vendorId": _vParams.vendorId, "commonParam": commonParam(),"token":_vParams.token, "secretNumber":_vParams.secretNumber}
		$.ajax({
			type:"POST",
            async: false,
            url:config.serviceUrl,
            data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		that.orderInfo = data.poAnswerOrderInfo;
            		that.memberId = that.orderInfo.poManId;
            		that.status = that.orderInfo.status;
					that.vStatus = that.orderInfo.vStatus;
            		html += '<h2 class="m-title">基础信息</h2>'
            			 +'<div class="item-wrap">'
						 +'	<ul>'
						 +'		<li><span>平台单号：</span><b>'+ that.orderInfo.poFormNo +'</b></li>'
						 +'		<li><span>内部单号：</span><b>'+ that.orderInfo.poInsideNo +'</b></li>'
						 +'		<li><span>客户：</span><b>'+ that.orderInfo.companyCode + '-' + that.orderInfo.companyAbbr +'</b></li>'
						 +'		<li><span>交易币别：</span>'+ that.orderInfo.currencyName +'</li>'
						 +'		<li><span>交易税别：</span>'+ that.orderInfo.taxName + '<label class="checkbox'+ ((that.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ that.orderInfo.taxRate*100 +'%</label></li>'
						 +'		<li><span>交易条件：</span>'+ that.orderInfo.conditionName +'</li>'
						 +'		<li><span>付款条件：</span>'+ that.orderInfo.payWayName +'</li>'
						 +'		<li><span>采购日期：</span>'+ that.orderInfo.poFormDate +'</li>'
						 +'	</ul>'
						 +'</div>'
            	}
            }
		})
		return html;
	},
	prodAnswerInfo: function(){
		var that = this, html = '';
		var params = {"serviceId": "B03_findPoAnswerLineList","poAnswerId":_vParams.poAnswerId,"vendorId":_vParams.vendorId,"commonParam": commonParam(),"token":_vParams.token,"secretNumber":_vParams.secretNumber};
		$.ajax({
			type:"POST",
			async: false,
            url:config.serviceUrl,
		    data:'param='+JSON.stringify(params),
            success:function(data){
            	data = data || {};
            	if(data.success){
            		$scope.poLineList = data.poLineList;
            		html = '<h2 class="m-title">产品信息</h2>';
            		for(var i=0, len=$scope.poLineList.length; i<len; i++){
                		html+='<div class="item-wrap" data-index="'+ i +'">'
							+'	<ul>'
							+'		<li class="prodCode" data-prodCode="'+ $scope.poLineList[i].prodCode +'" data-prodId="'+ $scope.poLineList[i].prodId +'"><span>物料编码：</span><b>'+ $scope.poLineList[i].prodCode +'</b></li>'
							+'		<li><span>物料详细：</span><p>'+ $scope.poLineList[i].prodName +' '+ $scope.poLineList[i].prodScale +'</p></li>'
							+		((that.vStatus!=4)?'<li><section><span>客户数量：</span><em>'+ $scope.poLineList[i].purchaseQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em>'+ $scope.poLineList[i].valuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>交期：</span><em>'+ $scope.poLineList[i].expectedDelivery +'</em></section></li>':'')
							+		((that.vStatus==1)? '' : (($scope.poLineList[i].poSubLineList.length==0) ? '<li class="bfline"><section><span>本方数量：</span><em class="vPurchaseQty">'+ $scope.poLineList[i].purchaseQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em class="vValuationQty">'+ $scope.poLineList[i].valuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span>交期：</span><em class="vExpectedDelivery">'+ $scope.poLineList[i].expectedDelivery +'</em></section></li>' : ''))
						for(var j=0; j<$scope.poLineList[i].poSubLineList.length; j++){
							html+='<li class="response'+ ((j==0) ? ' bfline' : '') +'"><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>分批答交：</span><em class="purchaseQty">'+ $scope.poLineList[i].poSubLineList[j].purchaseQty +'</em>'+ $scope.poLineList[i].purchaseUnitName +'/<em class="valuationQty">'+ $scope.poLineList[i].poSubLineList[j].valuationQty +'</em>'+ $scope.poLineList[i].valuationUnitName +'</section><section><span'+ ((j==0) ? ' class="nth0"' : '') +'>交期：</span><em class="expectedDelivery">'+ $scope.poLineList[i].poSubLineList[j].expectedDelivery +'</em></section></li>'
						}
						html+='		<li class="price" data-taxPrice="'+ $scope.poLineList[i].taxPrice +'" data-price="'+ $scope.poLineList[i].price +'"><span>单价：</span>'+ $currencySymbol + ((that.orderInfo.isContainTax===1) ? formatMoney($scope.poLineList[i].taxPrice) : formatMoney($scope.poLineList[i].price)) +'/'+ $scope.poLineList[i].valuationUnitName +'</li>'
							+'		<li><span>备注：</span><p>'+ $scope.poLineList[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'		<li class="subtotal" data-total="'+ $scope.poLineList[i].taxLineTotal +'" data-vTotal="'+ (($scope.poLineList[i].vTaxLineTotal!=''||$scope.poLineList[i].vTaxLineTotal!=0) ? $scope.poLineList[i].vTaxLineTotal : $scope.poLineList[i].taxLineTotal) +'"><span>含税小计：</span><b>'+ $currencySymbol + formatMoney($scope.poLineList[i].taxLineTotal) +'</b></li>'
							+		((that.vStatus!=1&&that.vStatus!=4)?'<li class="response responseTotal" data-vLineAmount="'+ $scope.poLineList[i].vLineAmount +'" data-vTaxLineTotal="'+ $scope.poLineList[i].vTaxLineTotal +'"><span>答交金额：</span>'+ $currencySymbol + formatMoney(($scope.poLineList[i].vTaxLineTotal=='')?$scope.poLineList[i].taxLineTotal:$scope.poLineList[i].vTaxLineTotal) +'</li>':'')
							+'	</ul>'
							+( that.vStatus==2 ? '<span class="edit"></span>' : '')
							+'</div>'
						that.countQtyRate($scope.poLineList[i]);
						that.totals+=parseFloat($scope.poLineList[i].taxLineTotal);
            		}
            		that.load = true;
            	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
            }
		})
		return html;
	},
	//答交产品明细
	editResponse: function(item,index){
		var that = this,
			lineLists = $scope.poLineList,
			responseItem = item.find('.responseBatch'), responseLen = responseItem.length;

		function mobiPoItem(emIdx){
			var mobiItem = item.find('.bfline');
			return mobiItem.find('em').eq(emIdx).html();
		}
		function newResponseItem(){
			var html = '';
			if(responseLen!=0){
				for(var i=0; i<responseLen; i++){
					var ems = responseItem.eq(i).find('em');
					html += '<li class="myResponse"><span'+ ((i==0)?' class="nth0"':'') +'>分批：</span><input type="text" class="int01" name="int01" value="'+ ems.eq(0).html() +'"><input type="text" class="int02" name="int02" value="'+ ems.eq(1).html() +'" disabled><div class="timeBox">'+ ems.eq(2).html() +'</div><input type="hidden" value="'+ ems.eq(2).html() +'"><i class="btn-del"></i></li>'
				}					
			}
			return html;
		}
		if(responseLen>0){
			$btnTxet = '新增';
		}
		var editHTML = '<div class="responseBox'+ ((responseLen>0)?' batchBox':'') +'" data-index="'+ index +'">'
						+'<ul class="responseBox1">'
						+'	<li>'
						+'		<span>对方：</span>'
						+'		<p>物料编码：'+ lineLists[index].prodCode +'<br>'+ lineLists[index].prodName +' '+ lineLists[index].prodScale +'</p>'
						+'	</li>'
						+'	<li class="myProductInfo">'
						+'		<span>本方：</span>'
						+'		<p>物料编码：'+ ($prodMapList[index].prodCode||'') +'<br>'+ ($prodMapList[index].prodName||lineLists[index].prodName) +' '+ ($prodMapList[index].prodScale||lineLists[index].prodScale) +'</p>'
						+'	</li>'
						+'	<li><span>数量：</span><em>'+ lineLists[index].purchaseQty + lineLists[index].purchaseUnitName +' /</em><em>'+ lineLists[index].valuationQty + lineLists[index].valuationUnitName +'</em><span>交期：</span><em class="em03">'+ lineLists[index].expectedDelivery +'</em></li>'
						+'	<li class="bfline"><span>本方：</span><input type="text" class="int01_all" value="'+ mobiPoItem(0) +'"'+ ((responseLen>0)?' disabled':'') +'><input type="text" class="int02_all" value="'+ mobiPoItem(1) +'" disabled><div class="timeBox">'+ mobiPoItem(2) +'</div><input type="hidden" value="'+ mobiPoItem(2) +'"></li>'
						+	newResponseItem()
						+'</ul>'
						+'<div class="btnBox"><a href="javascript:;" class="addResponse">'+$btnTxet+'</a></div>'
						+'<ul class="responseBox2">'
						+'	<li><span>单价：</span>¥'+((that.orderInfo.isContainTax===1) ? formatMoney(lineLists[index].taxPrice) : formatMoney(lineLists[index].price)) +'/'+ lineLists[index].valuationUnitName +'</li>'
						+'	<li><span>备注：</span><p>'+ lineLists[index].remark +'</p></li>'
						+'	<li class="subtotal"><span>小记：</span><b>'+ $currencySymbol + formatMoney(lineLists[index].taxLineTotal) +'</b></li>'
						+'</ul>'
						+'<div class="btns">'
						+'	<a class="btn-cancel" href="javascript:;">取消</a>'
						+'	<a class="btn-save" href="javascript:;">确定</a>'
						+'</div>'
						+'</div>'
		item.hide();
		item.after(editHTML);
		$body.append(formTip);

		//数量答交 输入框值改变
		$body.on('input','input.int01_all',function(){
			var _this = $(this), i = _this.parents('.responseBox').attr('data-index'), val = (isNaN(_this.val())?0:_this.val());
			_this.val(val);
			_this.next('.int02_all').val($scope.poLineList[i].countQtyRate*val);
		})
		$body.on('input','input.int01',function(){
			var _this = $(this), i = _this.parents('.responseBox').attr('data-index'), val = (isNaN(_this.val())?0:_this.val()), int_all = _this.parents('.responseBox').find('.int01_all');
			that.reQtysAll($(this));
			_this.val(val);
			_this.next('.int02').val($scope.poLineList[i].countQtyRate*val);
			int_all.trigger('input');
		})

		//批量答交
		$('.addResponse').eq(0).on('click',function(){
			var _this = $(this),
				parents = _this.parents('.responseBox'),
				$responseBox1 = parents.find('.responseBox1'),
				inputs = $responseBox1.find('li.myResponse').find('input'),
				index = parents.attr('data-index');
			var value1 = '';
			var value2 = '';
			var value3 = $scope.poLineList[index].expectedDelivery;
			var isAdd = true;
			var int01sVal;
			var int02sVal;
			if(inputs.length>1){
				inputs.forEach(function(item){
					if(item.value==''){
						$('#formTip').html('此分批答交完成后才能继续新增分批！').addClass('formTipShow');
						isAdd=false;
						return;
					}
				})
			}

			function f_QtyVal(){
				int01sVal = 0;
				int02sVal = 0;
				$responseBox1.find('.int01').forEach(function(v){
					int01sVal += parseFloat(v.value||0);
				})	
				$responseBox1.find('.int02').forEach(function(v){
					int02sVal += parseFloat(v.value||0);
				})				
			}
			f_QtyVal();

			value1 = parseFloat(lineLists[index].purchaseQty)-int01sVal;
			value2 = parseFloat(lineLists[index].valuationQty)-int02sVal;
			value1 = ((value1<=0)?'':value1);
			value2 = ((value2<=0)?'':value2);
			var cost = '<li class="myResponse"><span>分批：</span><input type="text" class="int01" name="int01" value="'+value1+'" /><input type="text" class="int02" name="int02" value="'+value2+'" disabled /><div class="timeBox">'+value3+'</div><input type="hidden" value="'+value3+'" /><i class="btn-del"></i></li>';
			if(isAdd){
				$responseBox1.append(cost);
				f_QtyVal();
				$responseBox1.find('.int01_all').val(int01sVal);
				$responseBox1.find('.int02_all').val(int02sVal);
				parents.addClass('batchBox');
				parents.find('.int01_all').prop('disabled',true);
				_this.html('新增');
			}
		})

		//取消
		$('.btn-cancel').eq(0).on('click',function(e){
			that.cancel($(this),prodAnswerCon);
			e.preventDefault();
		})
		//确定
		$('.btn-save').eq(0).on('click',function(e){
			e.preventDefault();
			that.save($(this),prodAnswerCon);
			//重置单身明细
			that.modiResponse($(this),index);
		})
	},
	//显示答交div
	itemshow: function(self,parent){
		var idx = self.parents('.responseBox').attr('data-index');
		self.parents('.responseBox').remove();
		parent.find('.item-wrap').eq(idx).show();
		$('#formTip').remove();
	},
	othersCost: function(){
		var that=this, html='', subtotal=0, resubtotal=0, _responseCost=false;
		if(!that.load)return;
		var params = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B03_findPoAnswerOtherCostList", "poAnswerId":_vParams.poAnswerId, "vendorId":_vParams.vendorId, "commonParam":commonParam()};
		$.ajax({
			type:"POST",
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
            			html+='<li class="mobiCostItem costItem" data-costName="'+ otherCostList[i].costName +'" data-costAmount="'+ otherCostList[i].costAmount +'" data-vCostAmount="'+ otherCostList[i].vCostAmount +'"><span>'+ otherCostList[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(otherCostList[i].costAmount) +'</b>'+ ((that.vStatus==1||(that.vStatus==4)) ? '' : '<b class="dj"><em class="money" data-money="'+ (otherCostList[i].vCostAmount=='' ? otherCostList[i].costAmount : otherCostList[i].vCostAmount) +'">'+ (otherCostList[i].vCostAmount=='' ? formatMoney(otherCostList[i].costAmount) : formatMoney(otherCostList[i].vCostAmount)) +'</em></b>') +'</li>';
            			subtotal += parseFloat(otherCostList[i].costAmount=='' ? 0 : otherCostList[i].costAmount);
            			resubtotal += parseFloat(otherCostList[i].vCostAmount=='' ? otherCostList[i].costAmount : otherCostList[i].vCostAmount);
            			if(otherCostList[i].vCostAmount!=''){
            				_responseCost = true;
            			}
            		}
            		html+=((that.vStatus!=4)?'<li id="othersCostSubtotal" class="subtotal" data-total="'+ subtotal +'" data-vTotal="'+ (_responseCost ? resubtotal : subtotal) +'"><span>客户小计：</span><b>'+ $currencySymbol + formatMoney(subtotal) +'</b></li>':'')
            		if(that.vStatus!=1){
            			html+='<li id="changeCost" class="response" data-otherMoney="'+ resubtotal +'"><span>本方小计：</span>'+ $currencySymbol + formatMoney(resubtotal) +'</li>'            			
            		}
            		html+='</ul>'
            		html+=( that.vStatus==2 ? '<span class="edit editOther"></span>' : '' )
            		html+='</div>';
            		that.totals+=parseFloat(subtotal);
            	}
            }
		})
		return html;
	},
	//其他费用答交
	editResponseCost: function(item){
		var that = this, othersCost = that._othersCost, lens = othersCost.length;

		function newResponseItem(){
			var responseItem = $(item).find('.response').not('#changeCost'), responseLen = responseItem.length, html = '';
			if(responseLen!=0){
				for(var i=0; i<responseLen; i++){
					html += '<li class="addNewCost"><input type="text" value="'+ responseItem.eq(i).attr('data-costname') +'"><input type="text" value="'+ responseItem.eq(i).attr('data-vcostamount') +'"><i class="btn-del"></i></li>'
				}					
			}
			return html;
		}

		var editHtmlCost = '<div class="responseBox" data-index="0"><ul class="responseCost">';

		for(var i=0; i<lens; i++){
			var _val = ($('#othersCost .dj').eq(i).find('em').html()=='' ? '' : $('#othersCost .dj').eq(i).find('em').attr('data-money'));
			editHtmlCost+='<li><span>'+ othersCost[i].costName +'：</span><b>'+ $currencySymbol + formatMoney(othersCost[i].costAmount) +'</b><input type="text" class="original" id="dj_'+ i +'" value="'+ _val +'" /></li>';
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
		$('.btn-cancel').eq(0).on('click',function(e){
			that.cancel($(this),othersCostCon);
			e.preventDefault();
		})
		//确定
		$('.btn-save').eq(0).on('click',function(e){
			that.save($(this),othersCostCon);
			e.preventDefault();
		})
	},
	//新增其他费用
	addNewCost: function(){
		var isAdd = true;
		var cost = '<li class="addNewCost"><input type="text" /><input type="text" /><i class="btn-del"></i></li>';
		$body.on('click','.addCost',function(){
			var _this = $(this),
				$responseCost = _this.parents('.responseBox').find('.responseCost'),
				inputs = $responseCost.find('li:last-child').find('input');
			isAdd = true;
			if(inputs.length>1){
				inputs.forEach(function(item){
					if(item.value==''){
						$('#formTip').html('此项费用完成后才能继续新增费用！').addClass('formTipShow');
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
			
			//新增单身明细
			that.createResponse($('.myResponse'),3,self,parent,'isProdAnswer');

		}else if(parents.is('#othersCost')){

			var lens2 = $('.original').length;
			for(var l=0; l<lens2; l++){
				var originalVal = $('.original').eq(l).val();
				if(originalVal==''){
					continue;
				}
				othersCostCon.find('.dj').eq(l).html($currencySymbol+'<em class="money" data-money="' + originalVal + '">' + formatMoney(originalVal) + '</em>');
				othersCostCon.find('.mobiCostItem').attr('data-vcostamount',originalVal);
			}
			that.createResponse($('.addNewCost'),2,self,parent,'isOtherCost');

		}
	},
	//重置展示信息（单身明细 其他费用 答交总金额等）
	createResponse: function(objs,sum,self,parent,type){
		var that = this, lens = objs.length, html = '', vals = new Array(),
			lineLists = $scope.poLineList, idx = self.parents('.responseBox').attr('data-index');
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
		//拼接答交内容
		for(var k=0; k<lens; k++){
			if(type=='isProdAnswer'){
				html+='<li class="response responseBatch"><section><span'+ ((k==0)?' class="nth0"':'') +'>分批答交：</span><em class="purchaseQty">'+ vals[k][0] +'</em>'+lineLists[idx].purchaseUnitName+'/<em class="valuationQty">'+ vals[k][1] +'</em>'+lineLists[idx].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+ vals[k][2] +'</em></section></li>'
			}else{
				html+='<li class="costItem response" data-costName="'+ vals[k][0] +'" data-costAmount="0" data-vCostAmount="'+ vals[k][1] +'"><span><em>'+ vals[k][0] +'</em>：</span><b>'+ $currencySymbol +'0.00</b><b class="dj">'+ $currencySymbol +'<em class="money" data-money="'+ vals[k][1] +'">'+ formatMoney(vals[k][1]) +'</em></b></li>'				
			}
		}
		that.itemshow(self,parent);
		parent.find('.item-wrap').eq(idx).find('.response').remove();
		if(type=='isProdAnswer'){
			if(lens>0){
				parent.find('.item-wrap').eq(idx).find('.bfline').hide();
				parent.find('.item-wrap').eq(idx).find('.price').before(html);				
			}else{
				parent.find('.item-wrap').eq(idx).find('.bfline').show();
			}
			var values = that.reQtys(self.parents('.responseBox'),idx);
			if(values!=''||values!=undefined){
				var _subtotal = parent.find('.item-wrap').eq(idx).find('.subtotal'), _subTotalPrice = _subtotal.attr('data-total'), $prices = parent.find('.item-wrap').eq(idx).find('.price'), _taxPrice = $prices.attr('data-taxPrice'), _price = $prices.attr('data-price');
				//重新计算子答交小计
				var $subtotal=0;
				if(that.orderInfo.isContainTax==1){
					$subtotal=values*_taxPrice;
				}else{
					$subtotal=values*_price*(1+that.orderInfo.taxRate);
				}
				_subtotal.attr('data-vtotal',$subtotal);
				//重新计算子答交金额
				parent.find('.item-wrap').eq(idx).find('ul').append('<li class="response responseTotal" data-vLineAmount="'+ values*_price +'" data-vTaxLineTotal="'+ values*_taxPrice +'"><span>答交金额：</span>'+ $currencySymbol + formatMoney(($subtotal)) +'</li>')
			}
		}else{
			$('#othersCostSubtotal').before(html);
			//变更费用
			var moneys = 0;
			othersCostCon.find('.costItem').forEach(function(dom){
				moneys += parseFloat($(dom).attr('data-vcostamount'))
			})

			$('#othersCostSubtotal').attr('data-vtotal',moneys);
			$('#othersCostSubtotal').after('<li id="changeCost" class="response" data-otherMoney="'+ moneys +'"><span>本方小计：</span>'+ $currencySymbol + formatMoney(moneys) +'</li>');
		}
		$('.item-total-dj').attr('data-vTotalAmount',that.reCostTotalFn()).html('答交总金额：'+$currencySymbol + formatMoney(that.reCostTotalFn())).show();
	},
	modiResponse: function(self,index){
		var that = this, $bfline = prodAnswerCon.find('.item-wrap').eq(index).find('.bfline'), $reBfline = self.parents('.responseBox').eq(0).find('.bfline').eq(0);
		$bfline.find('em').eq(0).html($reBfline.find('input').eq(0).val());
		$bfline.find('em').eq(1).html($reBfline.find('input').eq(1).val());
		$bfline.find('em').eq(2).html($reBfline.find('input').eq(2).val());
	},
	//删除答交项
	delResponse: function(){
		var that = this, content = '<p>您确定要删除此条答交？</p>';
		container.on('click','.btn-del',function(){
			var _this = $(this), parent = _this.parent('li'), $responseBox = _this.parents('.responseBox'), $responseBox1 = _this.parents('.responseBox1'), i = $responseBox.attr('data-index');
			that.popup('confirm', '', content, '', function(){
				parent.remove();
				//删除一个分批答交
				if(_this.parent('li').is('.myResponse')){
					if($responseBox1.find('.myResponse').length==0){
						$responseBox.removeClass('batchBox');
						$responseBox1.find('.int01_all').prop('disabled',false);
						$responseBox1.find('.int02_all').prop('disabled',false);
						$responseBox1.find('.int01_all').val($scope.poLineList[i].purchaseQty);
						$responseBox1.find('.int02_all').val($scope.poLineList[i].valuationQty);
						return false;
					}
					var int01sVal = 0;
					var int02sVal = 0;
					var val01 = $responseBox1.find('.int01_all').val();
					var val02 = $responseBox1.find('.int02_all').val();
					$responseBox1.find('.int01').forEach(function(v){
						int01sVal += parseFloat(v.value||0);
					})
					$responseBox1.find('.int02').forEach(function(v){
						int02sVal += parseFloat(v.value||0);
					})	
					$responseBox1.find('.int01_all').val(int01sVal);
					$responseBox1.find('.int02_all').val(int02sVal);				
				}
			})
		})
	},
	//日期控件
	dateFn: function(){
		$('.timeBox').mdater({
			//minDate : new Date(1970,0,1)
			maxDate : null,//默认为空，日期格式
			minDate : new Date()
		});
	},
	//隐藏提示
	hideTip: function(){
		$body.on('focus','input[type="text"]',function(){
			$('#formTip').removeClass('formTipShow');
		})
	},
	//答交计价数量
	reQtys: function(parents,index){
		var vals = 0;
		if(parents.find('.myResponse').length==0){
			vals = parents.find('.int02_all').val();
		}else{
			parents.find('.int02').each(function(){
				var _this = $(this);
				vals += parseFloat(_this.val());
			})			
		}

		return vals;			
	},
	//分批答交数量
	reQtysAll: function(input){
		var name = input.attr('name'), parent = input.parents('.responseBox'), val = 0;
		parent.find('.'+name).forEach(function(dom){
			val += parseFloat($(dom).val());
		})
		parent.find('.'+name+'_all').val(val);
	},
	//答交总金额计算
	reCostTotalFn: function(){
		var that = this,
			totals = 0;
		container.find('.subtotal').each(function(){
			totals += parseFloat($(this).attr('data-vtotal'));
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
		prodAnswerCon.html(that.prodAnswerInfo());
		othersCostCon.html(that.othersCost());

		$('.item-total').html('订单总金额：'+$currencySymbol + formatMoney(that.orderInfo.cTotalAmount)).show();
		if(that.vStatus!=1&&that.vStatus!=4){
			$('.item-total-dj').attr('data-vTotalAmount',that.reCostTotalFn()).html('答交总金额：'+$currencySymbol+formatMoney(that.orderInfo.vTotalAmount||that.orderInfo.cTotalAmount)).show();			
		}


		//单身附件
        function getObFileList(){
        	var list;
        	$scope.poLineList.forEach(function(val,i){
        		list = '';
        		val.vFileList = [];
				var param = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":that.orderInfo.companyId, "id":val.id, "commonParam":commonParam(), "docType":"24","fileSource":1,"searchType":2};//searchType查询类型1单头2单身
				GetAJAXData('POST',param,function(fileListData){
					if(fileListData.success){
						for(var j=0; j<fileListData.fileList.length; j++){
							list += '<a href="'+ fileListData.fileList[j].fileUrl +'"><i class=i-'+ (_reg.test(fileListData.fileList[j].fileName) ? "image" : "word") +'></i>'+ fileListData.fileList[j].fileName +'</a>';
						}
						if(fileListData.fileList.length>0){
							prodAnswerCon.find('.files').eq(i).html('<span>附件：</span><p>' + list +'</p>').show();
						}
						val.vFileList = fileListData.fileList;
					}
				},true)
        	})
        	// console.log(JSON.stringify($scope.poLineList))
        	// console.log(JSON.stringify($scope.poLineList))
        }
        getObFileList();

		//单头附件
		var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":_vParams.vendorId, "id":that.orderInfo.id, "commonParam":commonParam(), "docType":"24","fileSource":2,"searchType":1};//searchType查询类型1单头2单身
		GetAJAXData('POST',fileParam,function(fileData){
			if(fileData.success){
				$fileData = fileData;
			}
		},true)

		function getProdByCustomerProd(){
			for(var i=0, l=$scope.poLineList.length; i<l; i++){
				var params = {"serviceId":"B01_getProdByCustomerProd","token":_vParams.token,"secretNumber":_vParams.secretNumber,"vendorId":_vParams.vendorId,"cProdCode":$scope.poLineList[i].prodCode,"commonParam":commonParam(),"customerId":that.orderInfo.companyId};
				GetAJAXData('POST',params,function(vProdData){
					if(vProdData.success){
						$prodMapList.push(vProdData.prodMap);
					}
				})
			}
		}
		getProdByCustomerProd();

		//通用底部
		if(that.load){
			if(that.vStatus==1){
				bottomBar(['share'],that.memberId,'','接收订单','拒绝订单');
			}else if(that.vStatus==2){
				bottomBar(['share'],that.memberId,'','答交订单','拒绝订单');
			}else if(that.vStatus==3){
				bottomBar(['share'],that.memberId,'','提醒确认');
			}else if(that.vStatus==4){
				bottomBar(['share'],that.memberId,'','转销售订单');
			}
		}
		

		//订单维护
		container.on('click','a.item-link',function(){
			var _this = $(this), name = _this.attr('name'), scrollTop = $body.scrollTop();
			switch(name){
				case 'payInfo':
					orderReviseInfoCon.html(that.payInfo(scrollTop));
					break;
				case 'remark':
					orderReviseInfoCon.html(that.remark(scrollTop));
					$('#intRemarks').val($('#vRemark').val())
					break;
			}
			$body.scrollTop(0);
			container.addClass('contarinEdit');
			$('#jBottom').addClass('m-bottom-hide');
		}).on('click','.btn-wrap .btnB',function(){
			var _this = $(this), scrollTop = _this.attr('data-scrollTop');
			if(_this.is('#saveRemark')){
				// 本方备注
				$('#vRemark').val($('#intRemarks').val());
			}
			container.removeClass('contarinEdit');
			$('#jBottom').removeClass('m-bottom-hide');
			setTimeout(function(){$body.scrollTop(scrollTop)},200);
		})

		$body.on('click','.bottom-btn-confirm',function(){
			if(that.vStatus==1){
				//待接收
				var vendorReceiveParam = { "token": _vParams.token, "secretNumber":_vParams.secretNumber, "serviceId":"B03_vendorReceivePoAnswer", "poAnswerId":_vParams.poAnswerId, "companyId":that.orderInfo.companyId, "vendorId":_vParams.vendorId, "commonParam":commonParam()}
				that.vendorPoAnswer(vendorReceiveParam);
			}
			if(that.vStatus==2){
				that.popup('confirm', '', '您确定提交答交吗？', function(){
					//取消
				},function(){
					//答交提交
					that.submitFn(function(){
						fnTip.success(2000);
	                	setTimeout(function(){window.location.reload(true)},2000);
					});
				})
			}
			if(that.vStatus==3){
				//待客户确认
				var poRemindParam = { "token": _vParams.token, "secretNumber":_vParams.secretNumber, "serviceId":"B03_poRemindAnswer", "poId":that.orderInfo.purchaseOrderId, "companyId":that.orderInfo.companyId, "commonParam":commonParam()}
				that.vendorPoAnswer(poRemindParam,function(){
					setTimeout(function(){
						goBack();
					},2000);
				},true);
			}
			if(that.vStatus==4){
				//转销售订单
				window.location.href=config.htmlUrl+'orderRevise.html?param={"poAnswerId":"'+ _vParams.poAnswerId +'","companyId":"'+ _vParams.vendorId +'","secretNumber":"'+ _vParams.secretNumber +'","token":"'+ _vParams.token +'"}'
			}
		})
		$body.on('click','.bottom-btn-cancel',function(){
			if(that.vStatus==1||that.vStatus==2){
				//拒绝订单
				that.popup('confirm', '', '您确定要拒绝接单么？<br/>拒绝后的订单，将不能恢复。', function(){
					//取消
				},function(){
					var vendorRefuseReceiveParam = { "token": _vParams.token, "secretNumber":_vParams.secretNumber, "serviceId":"B03_vendorRefuseReceivePoAnswer", "poAnswerId":_vParams.poAnswerId, "vendorId":_vParams.vendorId, "commonParam":commonParam()}
					that.vendorPoAnswer(vendorRefuseReceiveParam,function(){
						setTimeout(function(){
							goBack();
						},2000);
					},true);					
				})
			}
		})

	},
	payInfo: function(scrollTop){
		var that = this, infos = that.orderInfo;
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

		var html = '<ul class="payInfoList">'
			+'<li><span>交易条件：</span><p>'+ infos.conditionName +'</p></li>'
			+'<li><span>物流方式：</span><p>'+ enumFn(that.logisticsType,infos.logisticsType) +'</p></li>'
			+'<li><span>'+ ((infos.logisticsType==3) ? '自提点' : '收货地址') +'：</span><p>'+ infos.provinceName + infos.cityName + infos.districtName + infos.address + '<br>收货人：'+ infos.contactPerson +'，电话：'+ infos.mobile +'</p></li>'
			+'<li><span>付款条件：</span><p>'+ infos.payWayName +'</p></li>'
			+'<li><span>发票类型：</span><p>'+ enumFn(that.invoiceType,infos.invoiceType) +'</p></li>'
			+'<li><span>发票抬头：</span><p>'+ infos.invoiceHeader +'</p></li>'
			+'<li><span>发票类容：</span><p>'+ infos.invoiceContent +'</p></li>'
			+'</ul>'
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
		if($fileData.fileList.length==0){
			html+='<p><b>0个附件</b></p>'
		}
		for(var i=0; i<$fileData.fileList.length;i++){
			html+='<p><a href="'+ $fileData.fileList[i].fileUrl +'"><i class=i-'+ (_reg.test($fileData.fileList[i].fileName) ? "image" : "word") +'></i>'+ $fileData.fileList[i].fileName +'</a></p>'
		}
			html +='</div>'
		if(that.vStatus==2){
			html +='<div class="item-wrap int-remarks">'
				 +'	<textarea name="" id="intRemarks" placeholder="填写本方备注"></textarea>'
				 +'</div>'
		}
		if(that.vStatus!=1&&that.vStatus!=2){
			html +='<div class="item-wrap">'
				 +'	<h2>本方备注：</h2>'
				 +'	<p>'+ that.orderInfo.vRemark +'</p>'
				 +'</div>'
		}
			html +='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+scrollTop+'">完成</a></div>'
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
	//计算数量比率
	countQtyRate: function( item ){
		if ( isEmpty(item) ) {
            return;                                             
        }
        item.countQtyRate = parseFloat(item.valuationQty)/parseFloat(item.purchaseQty);
	},
	//供应商品无税总计
	vTotal: function(){
		var that = this, item = prodAnswerCon.find('.item-wrap'), valuationQty = 0;
		for(var i=0, L=$scope.poLineList.length; i<L; i++){
			valuationQty += parseFloat(item.eq(i).find('.bfline').find('em').eq(1).html())*$scope.poLineList[i].price;
		}
		return valuationQty;
	},
	//获取答交参数
	getParam: function(){
		var that = this;
		var orderInfo = that.orderInfo || [];//订单单头信息
        var addPoOtherCostList = [];//新增的其他费用
        var modiPoOthreCostList = [];//修改的其他费用
        var otherCost = that._othersCost || [];
        var products = $scope.poLineList || [];
        var fileList = that._files || [];
        var delPoFileList = [];//删除其他费用主键列表
        var addPoFileList = [];//添加其他费用列表
        var delPoOthreCostList = [];//删除其他费用主键列表，未做

        //其他费用
        for (var i = 0, len = otherCost.length; i < len; i++) {
            otherCost[i].vCostAmount = othersCostCon.find('.mobiCostItem').eq(i).find('.dj .money').attr('data-money');
            modiPoOthreCostList.push(otherCost[i]);
        }
        //新增的其他费用
        var $othersCost = othersCostCon.find('.costItem.response'), addCostItem;
        for(var c = 0, cLen = $othersCost.length; c < cLen; c++){
        	addCostItem = {
        		"vCostAmount":parseFloat($othersCost.eq(c).attr('data-vcostamount')),
        		"costName":$othersCost.eq(c).attr('data-costname'),
        		"isNewAdd": true,//是否页面上新增加的
        		"costSource": 2,//costSource = 1：客户(不能删除)，2：供应商
        		"costAmount": 0,
        		"remark": "",
        		"vRemark":'',
        		"lineNo":c+1
        	}
        	addPoOtherCostList.push(addCostItem);
        }

        //产品单身明细列表
        var modiPoLineList = [];
        var productObj;
        //遍历产品单身明细列表
        for (var j = 0, jLen = products.length; j < jLen; j++) {
        	var $items = prodAnswerCon.find('.item-wrap').eq(j);
        	var $responseTotal = $items.find('.responseTotal').eq(0);
        	var $responseItem = $items.find('.response').not('.responseTotal');
        	var $mobisponseItem = $items.find('.bfline');
            var danshen = {};
            //是否分批答交后发生了改变
            var isChange=true, _isBatchAnswer=false;

            productObj = products[j];
            productObj.addPoLineFileList = [];//新增的单身附件列表
            productObj.addPoSubLineList = [];//新增的分批答交
            productObj.modiPoSubLineList = [];//修改的分批答交
            var _delPoSubLineList = [];//删除子单身

			//删除原 子单身
            for (var n = 0, fLen = productObj.poSubLineList.length; n < fLen; n++) {
                var subProduct = productObj.poSubLineList[n];
                _delPoSubLineList.push(subProduct.subId);
            }
            //新增新 子单身
            $responseItem.forEach(function(dom,idx){
            	var newObj = {};
            	newObj.expectedDelivery = new Date($(dom).find('.expectedDelivery').html()).getTime();
                newObj.purchaseQty = $(dom).find('.purchaseQty').html();
                newObj.purchaseUnit = productObj.purchaseUnitName;
                newObj.valuationQty = $(dom).find('.valuationQty').html();
                newObj.valuationUnit = productObj.valuationUnitName;
                newObj.lineNo = idx+1;
                productObj.addPoSubLineList.push(newObj);
                _isBatchAnswer=true;
            })
            //单身附件
            if (productObj.danShenfileList) {
                for (var m = 0, dsLen = productObj.danShenfileList.length; m < dsLen; m++) {
                    var fileDanShen = productObj.danShenfileList[m];
                    if (fileDanShen.isDeleted) {
                        productObj.delPoLineFileList.push(fileDanShen.id);
                    }else if (!fileDanShen.id) {
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
            if(!productObj.vProdName){

            	//根据客户产品信息获取本方产品信息
        		if($prodMapList[j].prodCode){
		            danshen.vProdId = $prodMapList[j].prodId;
		            danshen.vProdCode = $prodMapList[j].prodCode;
		            danshen.vProdDesc = $prodMapList[j].prodDesc;
		            danshen.vProdScale = $prodMapList[j].prodScale;
		            danshen.vProdName = $prodMapList[j].prodName;
        		}else{
        			danshen.vProdDesc = productObj.prodDesc;
		            danshen.vProdScale = productObj.prodScale;
		            danshen.vProdName = productObj.prodName;
        		}

	            danshen.vPurchaseQty = $mobisponseItem.find('.vPurchaseQty').html();//供应商答交数量
	            danshen.vValuationQty = $mobisponseItem.find('.vValuationQty').html();//供应商计价数量
	            danshen.vExpectedDelivery = new Date($mobisponseItem.find('.vExpectedDelivery').html()).getTime();
	            danshen.vPrice = productObj.price.toString();
	            danshen.vTaxPrice = productObj.taxPrice.toString();
	            danshen.vLineAmount = ($mobisponseItem.find('.vValuationQty').html()*productObj.price).toString();//供应商无税小计
	            danshen.vTaxLineTotal = ($mobisponseItem.find('.vValuationQty').html()*productObj.taxPrice).toString();//供应商含税小计
	            danshen.vAnswerUnitId = productObj.purchaseUnitId;
	            danshen.vAnswerUnitCode = productObj.purchaseUnitCode;
	            danshen.vAnswerUnitName = productObj.purchaseUnitName;
	            danshen.vValuationUnitId = productObj.valuationUnitId;
	            danshen.vValuationUnitCode = productObj.valuationUnitCode;
	            danshen.vValuationUnitName = productObj.valuationUnitName;
            }else{
	            danshen.vProdId = productObj.vProdId;
	            danshen.vProdCode = $.trim(productObj.vProdCode);
	            danshen.vProdDesc = $.trim(productObj.vProdDesc);
	            danshen.vProdScale = $.trim(productObj.vProdScale);
	            danshen.vProdName = $.trim(productObj.vProdName);
	            danshen.vPurchaseQty = productObj.vPurchaseQty;//采购数量
	            danshen.vValuationQty = productObj.vValuationQty;//计价数量
	            danshen.vExpectedDelivery = new Date(productObj.vExpectedDelivery).getTime();
	            danshen.vPrice = productObj.vPrice;
	            danshen.vTaxPrice = productObj.vTaxPrice;
	            danshen.vLineAmount = productObj.vLineAmount;
	            danshen.vTaxLineTotal = productObj.vTaxLineTotal;
	            danshen.vAnswerUnitId = productObj.vAnswerUnitId;
	            danshen.vAnswerUnitCode = productObj.vAnswerUnitCode;
	            danshen.vAnswerUnitName = productObj.vAnswerUnitName;
	            danshen.vValuationUnitId = productObj.vValuationUnitId;
	            danshen.vValuationUnitCode = productObj.vValuationUnitCode;
	            danshen.vValuationUnitName = productObj.vValuationUnitName;
            }
            danshen.isBatchAnswer = ((_isBatchAnswer) ? 1 : productObj.vBatchAnswer);//批次答交
            danshen.vRemark = productObj.vRemark;
            //子单身相关数据的几个列表
            danshen.addPoSubLineList = productObj.addPoSubLineList ? productObj.addPoSubLineList : [];
            danshen.modiPoSubLineList = productObj.modiPoSubLineList ? productObj.modiPoSubLineList : [];
            danshen.delPoSubLineList = _delPoSubLineList ? _delPoSubLineList : [];
            //供应商产品单身上传的附件的相关数据
            //danshen.fileCount=;
            danshen.vFileCount = productObj.addPoLineFileList.length;
            danshen.addPoLineFileList = productObj.addPoLineFileList ? productObj.addPoLineFileList : [];
            danshen.delPoLineFileList = productObj.delPoLineFileList ? productObj.delPoLineFileList : [];
            modiPoLineList.push(danshen);
        }

        //单头---订单上传的附件
        for (var f = 0, fiLen = fileList.length; f < fiLen; f++) {
            var fileOut = fileList[f];
            if (fileOut.isDeleted) {
                delPoFileList.push(fileOut.id);
            }else if (!fileOut.id) {
                addPoFileList.push({
                    lineNo: fileOut.lineNo,
                    fileUrl: fileOut.fileUrl,
                    fileSize: fileOut.fileSize,
                    fileName: fileOut.fileName
                });
            }
        }

        var vOtherCostTotal = parseFloat($('#changeCost').attr('data-othermoney')),
        	vTotalAmount = parseFloat($('.item-total-dj').eq(0).attr('data-vtotalamount')),
        	vTaxTotal = vTotalAmount - vOtherCostTotal;
        return {
            "vStatus": 3,//2-保存 3-提交
            "poAnswerId": _vParams.poAnswerId,
            "vendorId": _vParams.vendorId,
            "serviceId": "B03_saveAnswerPo",
            "commonParam": commonParam(),
            "modiPoLineList": modiPoLineList,
            "addPoOtherCostList": addPoOtherCostList,//添加其他费用列表
            "modiPoOthreCostList": modiPoOthreCostList,//修改其他花费列表
            "delPoOthreCostList": delPoOthreCostList, //删除其他费用主键列表
            "vFeeInfo": {
                "vTotal": that.vTotal().toString(),//供应商品无税总计
                "vOtherCostTotal": vOtherCostTotal,//供应商其他费用总计
                "vTaxTotal": vTaxTotal.toString(),//供应商品含税总计
                "vTotalAmount": vTotalAmount//供应商合计
            },
            "addPoFileList": addPoFileList,//附件列表
            "delPoFileList": delPoFileList,//删除文件主键
            "vRemark": $('#vRemark').val(),
            "lockVersion": that.orderInfo.lockVersion//锁版本
        };
	},
	submitFn: function(callBack){
		var that = this;

		//提交答交
		//入参字符串
		var inParams = that.getParam();
		inParams.token = _vParams.token;
		inParams.secretNumber = _vParams.secretNumber;
		//console.log(JSON.stringify(inParams))
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
		        "param": JSON.stringify(inParams)
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
            		callBack&&callBack();
            	}else{
            		fnTip.error(2000);
            	}
            }
		})
	},
	vendorPoAnswer: function(addparams,callBack,noReload){
		var that = this;
		$.ajax({
			type:"POST",
            url:config.serviceUrl,
            data: {
		        "param": JSON.stringify(addparams)
		    },
            success:function(data){
            	data = data || {};
            	if(data.success){
                	fnTip.success(2000);
                	callBack&&callBack();
                	if(noReload)return;
                	setTimeout(function(){window.location.reload(true)},2000);
            	}else{
            		that.popup('alert','','提交失败：'+data.errorMsg)
            	}
            }
		})
	}
}