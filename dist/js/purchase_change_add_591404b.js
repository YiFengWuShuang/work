var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),changeCauseVal1=$("#changeCauseVal1"),changeCauseVal2=$("#changeCauseVal2"),$changeCauseVal="",_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,privateDefultUser,$PoLineList,$scope={},$platformCurrencyList,$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",$fileListData1,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e.changeReason=[],e.totals=0,e.load=!1,setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B03_POCType",function(a){"0"==a.errorCode&&(e.changeTypeList=a.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_Invoice",function(a){"0"==a.errorCode&&(e.invoiceInfoName=a.dataSet.data.detail)}),GetUserInfo("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber},function(e){"01230"==e.retCode&&(privateDefultUser=e)}),e.start()},orderBaseInfo:function(){var e=this,a="",o={serviceId:"B03_getPurchaseOrderInfo",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){o=o||{},o.success&&(e.orderInfo=o.purchaseOrderInfo,3==o.purchaseOrderInfo.status?e.changeType="1":8==o.purchaseOrderInfo.status?e.changeType="2":(3!=o.purchaseOrderInfo.status||8!=o.purchaseOrderInfo.status)&&(e.changeType="4"),a+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>所属公司：</span><b>'+e.orderInfo.companyName+"</b></li>		<li><span>采购单号：</span><b>"+e.orderInfo.poFormNo+"</b></li>		<li><span>内部采购单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>交易税别：</span>"+e.orderInfo.taxName+'<label class="checkbox'+(1==e.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*e.orderInfo.taxRate+"%</label></li>		<li><span>变更类型：</span>"+enumFn(e.changeTypeList,e.changeType)+"</li>		<li><span>变更人：</span>"+e.orderInfo.auditname+"</li>		<li><span>变更日期：</span>"+transDate((new Date).getTime())+"</li>	</ul></div>",$("#orderHeadInfo").html(a),1!=e.orderInfo.invoice&&requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)}),2!=e.changeType?(e.addval_total=""==e.orderInfo.vTotal?e.orderInfo.cTotal:e.orderInfo.vTotal,e.addval_taxTotal=""==e.orderInfo.vTaxTotal?e.orderInfo.cTaxTotal:e.orderInfo.vTaxTotal,e.addval_totalAmount=""==e.orderInfo.vTotalAmount?e.orderInfo.cTotalAmount:e.orderInfo.vTotalAmount,e.addval_otherCostTotal=""==e.orderInfo.vOtherCostTotal?e.orderInfo.cOtherCostTotal:e.orderInfo.vOtherCostTotal):(e.addval_total=0,e.addval_taxTotal=0,e.addval_totalAmount=0,e.addval_otherCostTotal=0))}})},prodBodyInfo:function(){var e=this,a="",o={serviceId:"B03_findPoLineList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){if($PoLineList=o.poLineList,$PoLineList.sort(function(e,a){return e.lineNo-a.lineNo}),$PoLineList.isChecked=!1,$PoLineList.forEach(function(e){e.changeLineNo=e.lineNo,e.changeType=1,e.changeFileList=[],e.changeRemark="",e.isChecked=!1}),3==e.changeType)$PoLineList.forEach(function(e){e.changeQty=e.purchaseQty,e.changeValuationQty=e.valuationQty,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=e.lineAmount,e.changeTaxLineTotal=e.taxLineTotal,e.changeExpectedDeliveryStr=e.expectedDelivery});else if(1==e.changeType){var n=[];$PoLineList.forEach(function(e){if(e.changeQty=e.vPurchaseQty,e.changeValuationQty=e.vValuationQty,e.changePrice=e.vPrice,e.changeTaxPrice=e.vTaxPrice,e.changeLineAmount=e.vLineAmount,e.changeTaxLineTotal=e.vTaxLineTotal,e.changeExpectedDeliveryStr=e.vExpectedDelivery,1==e.vBatchAnswer)for(var a=0;a<e.poSubLineInfo.length;a++)if(0==a)e.changeQty=e.poSubLineInfo[a].purchaseQty,e.changeValuationQty=e.poSubLineInfo[a].valuationQty,e.changeExpectedDeliveryStr=e.poSubLineInfo[a].expectedDelivery,e.changeLineAmount=e.changePrice*e.changeValuationQty,e.changeTaxLineTotal=e.changeTaxPrice*e.changeValuationQty,e.changeType=2;else{var o={};o.prodId=e.prodId,o.prodCode=e.prodCode,o.prodName=e.prodName,o.prodScale=e.prodScale,o.prodDesc=e.prodDesc,o.valuationUnitId=e.valuationUnitId,o.valuationUnitCode=e.valuationUnitCode,o.valuationUnitName=e.valuationUnitName,o.purchaseUnitId=e.purchaseUnitId,o.purchaseUnitName=e.purchaseUnitName,o.purchaseUnitCode=e.purchaseUnitCode,o.changePrice=e.vPrice,o.changeTaxPrice=e.vTaxPrice,o.changeFileList=[];var t=0==n.length?$PoLineList[$PoLineList.length-1].changeLineNo:n[n.length-1].changeLineNo;o.changeLineNo=t+1,o.changeType=3,o.changeQty=e.poSubLineInfo[a].purchaseQty,o.changeValuationQty=e.poSubLineInfo[a].valuationQty,o.changeExpectedDeliveryStr=e.poSubLineInfo[a].expectedDelivery,o.changeLineAmount=e.changePrice*e.changeValuationQty,o.changeTaxLineTotal=e.changeTaxPrice*e.changeValuationQty,n.push(o)}(e.price!=e.changePrice||e.purchaseQty!=e.changeQty||e.expectedDelivery!=e.changeExpectedDeliveryStr||e.lineAmount!=e.changeLineAmount)&&(e.changeType=2)}),$PoLineList=$PoLineList.concat(n)}else 4==e.changeType?$PoLineList.forEach(function(e){e.changeQty=e.purchaseQty,e.changeValuationQty=e.valuationQty,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=e.lineAmount,e.changeTaxLineTotal=e.taxLineTotal,e.changeExpectedDeliveryStr=e.expectedDelivery}):2==e.changeType&&$PoLineList.forEach(function(e){e.changeType=2,e.changeQty=0,e.changeValuationQty=0,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=0,e.changeTaxLineTotal=0,e.changeExpectedDeliveryStr=e.expectedDelivery});if($scope.poLineList=$PoLineList,a='<h2 class="m-title">采购明细</h2>',1==e.changeType)for(var t=0,i=o.poLineList.length;i>t;t++){if(a+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+o.poLineList[t].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+o.poLineList[t].prodName+" "+o.poLineList[t].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+o.poLineList[t].purchaseQty+"</em>"+o.poLineList[t].purchaseUnitName+"/<em>"+o.poLineList[t].valuationQty+"</em>"+o.poLineList[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(o.poLineList[t].expectedDelivery)+"</em></section></li>",1==o.poLineList[t].vBatchAnswer)for(var r=0;r<o.poLineList[t].poSubLineInfo.length;r++)a+='<li class="changeItem"><section><span'+(0==r?' class="nth0"':"")+">变更：</span><em>"+o.poLineList[t].poSubLineInfo[r].purchaseQty+"</em>"+o.poLineList[t].vAnswerUnitName+"/<em>"+o.poLineList[t].poSubLineInfo[r].valuationQty+"</em>"+o.poLineList[t].vValuationUnitName+"</section><section><span"+(0==r?' class="nth0"':"")+">预交期：</span><em>"+o.poLineList[t].poSubLineInfo[r].expectedDelivery+"</em></section></li>";else a+='<li class=""><section><span>变更：</span><em>'+o.poLineList[t].vPurchaseQty+"</em>"+o.poLineList[t].vAnswerUnitName+"/<em>"+o.poLineList[t].vValuationQty+"</em>"+o.poLineList[t].vValuationUnitName+"</section><section><span>预交期：</span><em>"+o.poLineList[t].vExpectedDelivery+"</em></section></li>";a+='		<li class="price"><span>变更前单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?o.poLineList[t].taxPrice:o.poLineList[t].price)+"/"+o.poLineList[t].valuationUnitName+"</li>		<li><span>变更后单价：</span>"+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?o.poLineList[t].vTaxPrice:o.poLineList[t].vPrice)+"/"+o.poLineList[t].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>变更前小计：</span><b>'+$currencySymbol+formatMoney(o.poLineList[t].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>变更后小计：</span>'+$currencySymbol+formatMoney(o.poLineList[t].vTaxLineTotal)+"</li>	</ul></div>"}else if(2==e.changeType)for(var t=0,i=$scope.poLineList.length;i>t;t++)a+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+$scope.poLineList[t].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+$scope.poLineList[t].prodName+" "+$scope.poLineList[t].prodScale+"</p></li>		<li><section><span>变更前：</span><em>"+$scope.poLineList[t].purchaseQty+"</em>"+$scope.poLineList[t].purchaseUnitName+"/<em>"+$scope.poLineList[t].valuationQty+"</em>"+$scope.poLineList[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate($scope.poLineList[t].expectedDelivery)+'</em></section></li>		<li class="changeItem"><section><span>变更后：</span><em>0</em>'+$scope.poLineList[t].purchaseUnitName+"/<em>0</em>"+$scope.poLineList[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate($scope.poLineList[t].expectedDelivery)+'</em></section></li>		<li class="price"><span>单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?$scope.poLineList[t].taxPrice:$scope.poLineList[t].price)+"/"+$scope.poLineList[t].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>变更前小计：</span><b>'+$currencySymbol+formatMoney($scope.poLineList[t].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>变更后小计：</span>'+$currencySymbol+formatMoney(0)+"</li>	</ul></div>";else if(4==e.changeType)for(var t=0,i=$scope.poLineList.length;i>t;t++)a+='<div class="item-wrap" data-index="'+t+'">	<ul>		<li class="prodCode"><span>物料编码：</span>'+$scope.poLineList[t].prodCode+"</li>		<li><span>物料名称：</span><p>"+$scope.poLineList[t].prodName+" "+$scope.poLineList[t].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+$scope.poLineList[t].purchaseQty+"</em>"+$scope.poLineList[t].purchaseUnitName+"/<em>"+$scope.poLineList[t].valuationQty+"</em>"+$scope.poLineList[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate($scope.poLineList[t].expectedDelivery)+'</em></section></li>		<li class="changeQty_'+t+'"><section><span>变更：</span><em>'+$scope.poLineList[t].changeQty+"</em>"+$scope.poLineList[t].purchaseUnitName+"/<em>"+$scope.poLineList[t].changeValuationQty+"</em>"+$scope.poLineList[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+$scope.poLineList[t].changeExpectedDeliveryStr+'</em></section></li>		<li class="price"><span>变更前单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?$scope.poLineList[t].taxPrice:$scope.poLineList[t].price)+"/"+$scope.poLineList[t].valuationUnitName+'</li>		<li class="changePrice_'+t+'"><span>变更后单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?$scope.poLineList[t].changeTaxPrice:$scope.poLineList[t].changePrice)+"/"+$scope.poLineList[t].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>变更前小计：</span><b>'+$currencySymbol+formatMoney($scope.poLineList[t].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal changeLineTotal_'+t+'"><span>变更后小计：</span>'+$currencySymbol+formatMoney($scope.poLineList[t].changeTaxLineTotal)+'</li>	</ul>	<span name="bodyInfos" class="edit"></span></div>';$("#prodBodyInfo").html(a),e.load=!0}else container.show().html('<p style="text-align:center;">'+o.errorMsg+"</p>"),fnTip.hideLoading()}})},othersCost:function(){var e=this,a="",o=0;if(e.load){var n={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoOtherCostList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam()};$.ajax({type:"POST",url:config.serviceUrl,async:!1,data:"param="+JSON.stringify(n),success:function(n){if(n=n||{},n.success){var t=n.poOtherCostList;t.isChecked=!1,t.forEach(function(a){a.changeType=1,a.isChecked=!1,""==a.vCostAmount?a.costAmount:a.vCostAmount,4==e.changeType?a.vCostAmount=a.costAmount:2==e.changeType&&(a.vCostAmount=0)}),t.sort(function(e,a){return e.lineNo-a.lineNo}),$scope.poOtherCostList=t,a='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var i=0,r=$scope.poOtherCostList.length;r>i;i++)a+="<li><span>"+$scope.poOtherCostList[i].costName+"：</span><b>"+$currencySymbol+formatMoney($scope.poOtherCostList[i].costAmount)+'</b><b class="dj"><em class="money">'+formatMoney($scope.poOtherCostList[i].vCostAmount)+"</em></b></li>",o+=$scope.poOtherCostList[i].vCostAmount;a+='<li id="othersCostSubtotal" class="subtotal"><span>变更前：</span><b>'+$currencySymbol+formatMoney(e.orderInfo.cOtherCostTotal)+'</b></li><li id="changeCost" class="response changeLineTotal"><span>变更后：</span>'+$currencySymbol+formatMoney(o)+"</li></ul>"+(4==e.changeType?'<span name="otherCostInfos" class="edit editOther"></span>':"")+"</div>",$("#othersCost").html(a)}}})}},initSelect3:function(e,a,o){$(e).select3({allowClear:!0,items:a,placeholder:"请选择",showSearchInputInDropdown:!1,value:o})},dateFn:function(){$(".timeBox").mdater({minDate:new Date})},start:function(){function e(e){isEmpty(e)||(e.changeValuationQty=parseFloat(e.valuationQty)/parseFloat(e.purchaseQty)*parseFloat(e.changeQty),e.changeValuationQty=e.changeValuationQty?e.changeValuationQty:"",n(e))}function a(e){e.changePrice=parseFloat(e.changeTaxPrice)/(1+parseFloat(r.orderInfo.taxRate)),e.changePrice=parseFloat(e.changePrice.toFixed($priceDecimalNum)),n(e)}function o(e){isEmpty(e)||(e.changeTaxPrice=parseFloat(e.changePrice)*(1+parseFloat(r.orderInfo.taxRate)),e.changeTaxPrice=parseFloat(e.changeTaxPrice.toFixed($priceDecimalNum)),n(e))}function n(e){isEmpty(e)||(e.changeLineAmount=parseFloat(e.changePrice)*parseFloat(e.changeValuationQty),e.changeLineAmount=parseFloat(e.changeLineAmount.toFixed($amountDecimalNum)),e.changeTaxLineTotal=parseFloat(e.changeTaxPrice)*parseFloat(e.changeValuationQty),e.changeTaxLineTotal=parseFloat(e.changeTaxLineTotal.toFixed($amountDecimalNum)));for(var a=0,o=0,n=0;n<$scope.poLineList.length;n++)isNaN($scope.poLineList[n].changeLineAmount)||isNaN($scope.poLineList[n].changeTaxLineTotal)||(a+=parseFloat($scope.poLineList[n].changeLineAmount),o+=parseFloat($scope.poLineList[n].changeTaxLineTotal));r.addval_total=a,r.addval_taxTotal=o,r.addval_totalAmount=parseFloat(r.addval_taxTotal)+parseFloat(r.addval_otherCostTotal),$(".item-total-dj").html("变更后商品总金额："+$currencySymbol+formatMoney(r.addval_totalAmount))}function t(e){$(".changeQty_"+e).html("<section><span>变更后：</span><em>"+$scope.poLineList[e].changeQty+"</em>"+$scope.poLineList[e].purchaseUnitName+"/<em>"+$scope.poLineList[e].changeValuationQty+"</em>"+$scope.poLineList[e].valuationUnitName+"</section><section><span>预交期：</span><em>"+$scope.poLineList[e].changeExpectedDeliveryStr+"</em></section>"),$(".changePrice_"+e).html("<span>变更后单价：</span>"+$currencySymbol+formatMoney(1===r.orderInfo.isContainTax?$scope.poLineList[e].changeTaxPrice:$scope.poLineList[e].changePrice)+"/"+$scope.poLineList[e].valuationUnitName),$(".changeLineTotal_"+e).html("<span>变更后小计：</span>"+$currencySymbol+formatMoney($scope.poLineList[e].changeTaxLineTotal))}function i(e){var a=/^(-?\d+)(\.\d+)?$/,o=0;$scope.poOtherCostList.forEach(function(n,t){n.vCostAmount=parseFloat(e[t]),a.test(n.vCostAmount)||(n.vCostAmount=""),o+=parseFloat(n.vCostAmount),$("#othersCost").find(".dj .money").eq(t).html(formatMoney(n.vCostAmount))}),r.addval_otherCostTotal=o,r.addval_totalAmount=parseFloat(r.addval_taxTotal)+parseFloat(r.addval_otherCostTotal),$("#changeCost").html("<span>变更后：</span>"+$currencySymbol+formatMoney(r.addval_otherCostTotal)),$(".item-total-dj").html("变更后商品总金额："+$currencySymbol+formatMoney(r.addval_totalAmount))}var r=this;r.orderBaseInfo(),r.dateFn();var s={serviceId:"B01_queryAllPlatformCurrency",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",s,function(e){if(e.success){$platformCurrencyList=e;for(var a=0,o=e.platformCurrencyList.length;o>a;a++)if(e.platformCurrencyList[a].currencyCode==r.orderInfo.pCurrencyCode)return $currencySymbol=e.platformCurrencyList[a].currencySymbol,$priceDecimalNum=e.platformCurrencyList[a].priceDecimalNum,$amountDecimalNum=e.platformCurrencyList[a].amountDecimalNum,!1}}),r.prodBodyInfo(),r.othersCost();var c={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:_vParams.companyId,id:_vParams.poId,fileSource:1,searchType:1,docType:10,commonParam:commonParam()};GetAJAXData("POST",c,function(e){e.success&&($fileListData1=e,$scope.change_FileList=[],1==r.changeType&&e.fileList.forEach(function(e){2==e.fileSource&&(e.fileSource=1,$scope.change_FileList.push(e))}))}),requestFn("B03_POCReasonType",function(e){"0"==e.errorCode&&(r.reasonType=e.dataSet.data.detail,L=r.reasonType.length,r.reasonType.forEach(function(e){r.changeReason.push(e.Value)}))}),$(".item-total").html("变更前商品总金额："+$currencySymbol+formatMoney(r.orderInfo.cTotalAmount)).show(),$(".item-total-dj").html("变更后商品总金额："+$currencySymbol+formatMoney(r.addval_totalAmount)).show(),bottomBar(["share"],r.orderInfo.vAuditid,"","提交变更"),container.on("click","span.edit, a.item-link",function(){var e=$(this),a=e.attr("name"),o=$body.scrollTop(),n=e.parent(".item-wrap").attr("data-index");switch(a){case"bodyInfos":orderReviseInfoCon.html(r.editBodyInfo(n,o));break;case"otherCostInfos":orderReviseInfoCon.html(r.editOtherCost(o));break;case"payInfo":orderReviseInfoCon.html(r.payInfo(o));break;case"remark":orderReviseInfoCon.html(r.remark(o));break;case"changeCause":orderReviseInfoCon.html(r.changeCause(o)),r.POCReasonType()}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var n=$(this),s=n.attr("data-scrollTop"),c=n.attr("data-index");if(n.is("#saveBodyInfo")&&($scope.poLineList[c].changeQty=parseFloat($(".changeQty").val()),$scope.poLineList[c].changeExpectedDeliveryStr=$(".timeBox").html(),e($scope.poLineList[c]),1==r.orderInfo.isContainTax?($scope.poLineList[c].changeTaxPrice=parseFloat($(".changePrice").val()),a($scope.poLineList[c])):($scope.poLineList[c].changePrice=parseFloat($(".changePrice").val()),o($scope.poLineList[c])),t(c)),n.is("#changeCostInfo")){var p=[];n.parents("#orderReviseInfoCon").find("input").forEach(function(e){p.push(e.value)}),i(p)}if(n.is("#saveChangeCause")){var l=$("#changeCause").select3("value")||"";if(l){var d=reEnumFn(r.reasonType,l);changeCauseVal1.val(d),$changeCauseVal=l}else changeCauseVal1.val(""),$changeCauseVal="";changeCauseVal2.val($("#intRemarks").val())}container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(s)},200)}),r.submitFn()},changeCause:function(){var e='<div class="m-item m-item-select">	<h2 class="m-title">变更原因：</h2>	<div id="changeCause" class="select3-input"></div></div><div class="m-item">	<h2 class="m-title">变更说明：</h2>	<div class="item-wrap int-remarks">		<textarea name="" id="intRemarks" placeholder="在此处录入变更的备注和说明"></textarea>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveChangeCause" class="btnB">保存说明</a></div>';return e},POCReasonType:function(){var e=this;""==changeCauseVal1.val()?e.initSelect3("#changeCause",e.changeReason,""):e.initSelect3("#changeCause",e.changeReason,$changeCauseVal)},editBodyInfo:function(e,a){var o=this,n="",t=$scope.poLineList[e];return n+='<div class="m-item">	<h2 class="m-title">产品明细变更</h2>	<div class="item-wrap item-wrap-change" data-index="'+e+'">		<ul>			<li class="prodCode"><span>物料编码：</span>'+t.prodCode+"</li>			<li><span>物料名称：</span><p>"+t.prodName+" "+t.prodScale+'</p></li>			<li><span>采购数量：</span><input class="changeQty" type="text" value="'+t.changeQty+'"> '+t.purchaseUnitName+'</li>			<li><span>预交期：</span><div class="timeBox">'+t.changeExpectedDeliveryStr+'</div><input type="hidden" value="'+t.changeExpectedDeliveryStr+'"></li>			<li><span class="price">单价：</span><input class="changePrice" type="text" value="'+(1===o.orderInfo.isContainTax?t.changeTaxPrice:t.changePrice)+'"> /'+t.valuationUnitName+'</li>		</ul>	</div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+a+'" data-index="'+e+'">完成</a></div>'},editOtherCost:function(e){var a="";return a+='<div class="m-item"><h2 class="m-title">其他费用变更</h2><div class="item-wrap item-wrap-change"><ul>',$scope.poOtherCostList.forEach(function(e){a+="<li><span>"+e.costName+"：</span>"+$currencySymbol+formatMoney(e.costAmount)+'<i class="gap"></i>'+$currencySymbol+'<input type="text" value="'+e.vCostAmount+'" /></b></li>'}),a+='</ul></div></div><div class="btn-wrap"><a href="javascript:;" id="changeCostInfo" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},payInfo:function(e){var a=this,o=a.orderInfo,n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+o.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(a.logisticsType,o.logisticsType)+"</p></li><li><span>"+("3"==o.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>(收货人："+o.contactPerson+"，电话："+o.mobile+")</p></li><li><span>付款条件：</span><p>"+o.payWayName+"</p></li>";return n+=1==o.invoice?"<li><span>发票信息：</span><p>"+enumFn(a.invoiceInfoName,o.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(a.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+"</p></li>",n+='</ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},remark:function(e){for(var a=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+a.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+a.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<$fileListData1.fileList.length;n++)o+='<p><a href="'+$fileListData1.fileList[n].fileUrl+'"><i class=i-'+(_reg.test($fileListData1.fileList[n].fileName)?"image":"word")+"></i>"+$fileListData1.fileList[n].fileName+"</a></p>";return o+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,a,o,n,t){new Popup({type:e,title:a,content:o,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:t})},submitBt:function(e){var a=this;if(1!=e&&2!=e)return void fnTip.error(2e3,"单据状态有问题");if(isEmpty(privateDefultUser))var o=a.orderInfo.poManCode,n=a.orderInfo.poManId,t=a.orderInfo.poManName,i=a.orderInfo.poManPid;else var o=privateDefultUser.employeeCode,n=privateDefultUser.employeeId,t=privateDefultUser.employeeName,i=privateDefultUser.memberId;for(var r=[],s=0;s<$scope.poLineList.length;s++){var c=$scope.poLineList[s];if(void 0==c.prodName||void 0==c.changeQty||void 0==c.changeValuationQty||void 0==c.changePrice||void 0==c.changeTaxPrice||void 0==c.changeLineAmount||void 0==c.changeTaxLineTotal||void 0==c.changeExpectedDeliveryStr)return fnTip.error(2e3,"单据内容有问题"),!1;1==c.changeType&&(c.price!=c.changePrice||c.purchaseQty!=c.changeQty||c.expectedDelivery!=c.changeExpectedDeliveryStr||c.lineAmount!=c.changeLineAmount)&&(c.changeType=2);var p={lineNo:c.changeLineNo,poId:_vParams.poId,poFormNo:a.orderInfo.poFormNo,poLineId:c.id,poLineNo:c.lineNo,doId:"",doFormNo:"",doLineId:"",doLineNo:"",prodId:c.prodId,prodCode:c.prodCode,prodName:c.prodName,prodScale:c.prodScale,prodDesc:c.prodDesc,invId:c.invId,invCode:c.invCode,invName:c.invName,locationId:c.locationId,locationCode:c.locationCode,locationName:c.locationName,purchaseQty:c.purchaseQty,valuationQty:c.valuationQty,changeQty:c.changeQty,changeValuationQty:c.changeValuationQty,purchaseUnitId:c.purchaseUnitId,purchaseUnitCode:c.purchaseUnitCode,purchaseUnitName:c.purchaseUnitName,valuationUnitId:c.valuationUnitId,valuationUnitCode:c.valuationUnitCode,valuationUnitName:c.valuationUnitName,price:c.price,taxPrice:c.taxPrice,lineAmount:c.lineAmount,taxLineTotal:c.taxLineTotal,changePrice:c.changePrice,changeTaxPrice:c.changeTaxPrice,changeLineAmount:c.changeLineAmount,changeTaxLineTotal:c.changeTaxLineTotal,expectedDeliveryStr:new Date(c.expectedDelivery).getTime(),changeExpectedDeliveryStr:new Date(c.changeExpectedDeliveryStr).getTime(),batchDelivery:0,changeType:c.changeType,fileCount:c.changeFileList.length,remark:c.changeRemark,pcLineFileList:[]};c.expectedDelivery||delete p.expectedDeliveryStr,r.push(p)}var l=[];$scope.poOtherCostList.forEach(function(e){if(""!=e.costName){1==e.changeType&&e.vCostAmount!=e.costAmount&&(e.changeType=2);var a={lineNo:e.lineNo,poOtherCostId:e.poOtherCostId,costSource:e.costSource,costName:e.costName,costAmount:e.costAmount,changeCostAmount:e.vCostAmount,changeType:e.changeType,remark:e.changeRemark};l.push(a)}});var d=[];return 3!=a.changeType&&$scope.change_FileList.forEach(function(e){if(!s.isDeleted){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,d.push(a)}}),{companyId:a.orderInfo.companyId,companyCode:a.orderInfo.companyCode,companyName:a.orderInfo.companyName,companyAbbr:a.orderInfo.companyAbbr,vendorId:a.orderInfo.vendorId,vendorCode:a.orderInfo.vendorCode,vendorName:a.orderInfo.vendorName,vendorAbbr:a.orderInfo.vendorAbbr,pCurrencyCode:a.orderInfo.pCurrencyCode,pCurrencyName:a.orderInfo.pCurrencyName,currencyId:a.orderInfo.currencyId,currencyCode:a.orderInfo.currencyCode,currencyName:a.orderInfo.currencyName,localCurrencyId:a.orderInfo.localCurrencyId,localCurrencyCode:a.orderInfo.localCurrencyCode,localCurrencyName:a.orderInfo.localCurrencyName,exchangeRate:a.orderInfo.exchangeRate,taxId:a.orderInfo.taxId,taxCode:a.orderInfo.taxCode,taxName:a.orderInfo.taxName,isContainTax:a.orderInfo.isContainTax,taxRate:a.orderInfo.taxRate,conditionId:a.orderInfo.conditionId,conditionCode:a.orderInfo.conditionCode,conditionName:a.orderInfo.conditionName,payWayId:a.orderInfo.payWayId,payWayCode:a.orderInfo.payWayCode,payWayName:a.orderInfo.payWayName,payMentType:a.orderInfo.paymentType,poId:_vParams.poId,poFormNo:a.orderInfo.poFormNo,poInsideNo:a.orderInfo.poInsideNo,pocInsideNo:"",pocFormDateStr:(new Date).getTime(),poFormDateStr:a.orderInfo.poFormDate,changeType:a.changeType,changeReason:2==a.changeType?"3":changeCauseVal1.val()||"1",poManId:a.orderInfo.poManId,poManCode:a.orderInfo.poManCode,poManName:a.orderInfo.poManName,poManPid:a.orderInfo.poManPid,pocManId:n,pocManCode:o,pocManName:t,pocManPid:i,logisticsType:a.orderInfo.logisticsType,logisticsCode:a.orderInfo.logisticsCode,logisticsName:a.orderInfo.logisticsName,addressId:a.orderInfo.addressId,countryCode:a.orderInfo.countryCode,countryName:a.orderInfo.countryName,provinceCode:a.orderInfo.provinceCode,provinceName:a.orderInfo.provinceName,cityCode:a.orderInfo.cityCode,cityName:a.orderInfo.cityName,districtCode:a.orderInfo.districtCode,districtName:a.orderInfo.districtName,address:a.orderInfo.address,contactPerson:a.orderInfo.contactPerson,mobile:a.orderInfo.mobile,insideAddressCode:a.orderInfo.insideAddressCode,invId:a.orderInfo.invId,invCode:a.orderInfo.invCode,invName:a.orderInfo.invName,invoice:a.orderInfo.invoice,invoiceType:a.orderInfo.invoiceType,invoiceHeader:a.orderInfo.invoiceHeader,invoiceContent:a.orderInfo.invoiceContent,invoicePayMark:a.orderInfo.invoicePayMark,invoiceName:a.orderInfo.invoiceName,invoiceTel:a.orderInfo.invoiceTel,invoiceAddress:a.orderInfo.invoiceAddress,invoiceBank:a.orderInfo.invoiceBank,invoiceAccount:a.orderInfo.invoiceAccount,poTotalAmount:a.orderInfo.cTotalAmount,poTotal:a.orderInfo.cTotal,poTaxTotal:a.orderInfo.cTaxTotal,poOtherCostTotal:a.orderInfo.cOtherCostTotal,total:a.addval_total,taxTotal:a.addval_taxTotal,totalAmount:a.addval_totalAmount,otherCostTotal:a.addval_otherCostTotal,agreeMent:a.orderInfo.agreement,poRemark:a.orderInfo.remark,status:e,remark:$("#changeCauseVal2").val(),version:a.orderInfo.version,pcOtherCostList:l,pcLineList:r,pcFileList:d}},submitFn:function(){function e(e,o){$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"poChangeInfo":'+JSON.stringify(a.submitBt(o))+', "token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'","serviceId":"B03_addSavePoChange", "commonParam":'+JSON.stringify(commonParam())+"}"},success:function(o){return o=o||{},o.success?void(e&&e(o)):(a.popup("alert","",o.errorMsg),!1)}})}var a=this;$body.on("click",".bottom-btn-confirm",function(){2!=a.changeType?a.popup("confirm","","确定提交变更吗？",function(){},function(){console.log('{"poChangeInfo":'+JSON.stringify(a.submitBt(2))+', "token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'","serviceId":"B03_addSavePoChange", "commonParam":'+JSON.stringify(commonParam())+"}"),e(function(){fnTip.success(2e3,"提交成功"),setTimeout(function(){goBack()},2e3)},2)}):a.popup("confirm","","确定取消变更吗？",function(){},function(){e(function(){fnTip.success(2e3,"取消成功"),setTimeout(function(){goBack()},2e3)})})})}};