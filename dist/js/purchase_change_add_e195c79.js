var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),changeCauseVal1=$("#changeCauseVal1"),changeCauseVal2=$("#changeCauseVal2"),$changeCauseVal="",_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,privateDefultUser,$PoLineList,$scope={},$platformCurrencyList,$currencySymbol,$fileListData1,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._lineLists=[],e._othersCost=[],e.changeReason=[],e.totals=0,e.load=!1,setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B03_POCType",function(a){"0"==a.errorCode&&(e.changeTypeList=a.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)}),GetUserInfo("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber},function(e){"01230"==e.retCode&&(privateDefultUser=e)}),e.start()},orderBaseInfo:function(){var e=this,a="",o={serviceId:"B03_getPurchaseOrderInfo",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){o=o||{},o.success&&(e.orderInfo=o.purchaseOrderInfo,3==o.purchaseOrderInfo.status||4==o.purchaseOrderInfo.status?e.changeType="1":8==o.purchaseOrderInfo.status&&(e.changeType="2"),a+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>所属公司：</span><b>'+e.orderInfo.companyName+"</b></li>		<li><span>采购单号：</span><b>"+e.orderInfo.poFormNo+"</b></li>		<li><span>内部采购单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>交易税别：</span>"+e.orderInfo.taxName+'<label class="checkbox'+(1==e.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*e.orderInfo.taxRate+"%</label></li>		<li><span>变更类型：</span>"+enumFn(e.changeTypeList,e.changeType)+"</li>		<li><span>变更人：</span>"+e.orderInfo.auditname+"</li>		<li><span>变更日期：</span>"+transDate((new Date).getTime())+"</li>	</ul></div>")}}),a},prodBodyInfo:function(){var e=this,a="",o={serviceId:"B03_findPoLineList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var n=o.poLineList;if(e._lineLists=n,a='<h2 class="m-title">采购明细</h2>',2!=e.changeType)for(var r=0,t=n.length;t>r;r++){if(a+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+n[r].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+n[r].prodName+" "+n[r].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+n[r].purchaseQty+"</em>"+n[r].purchaseUnitName+"/<em>"+n[r].valuationQty+"</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+"</em></section></li>",n[r].poSubLineInfo.length)for(var i=0;i<n[r].poSubLineInfo.length;i++)a+='<li class="changeItem"><section><span'+(0==i?' class="nth0"':"")+">变更：</span><em>"+n[r].poSubLineInfo[i].purchaseQty+"</em>"+n[r].vAnswerUnitName+"/<em>"+n[r].poSubLineInfo[i].valuationQty+"</em>"+n[r].vValuationUnitName+"</section><section><span"+(0==i?' class="nth0"':"")+">预交期：</span><em>"+n[r].poSubLineInfo[i].expectedDelivery+"</em></section></li>";else a+='<li class=""><section><span>供应方：</span><em>'+n[r].vPurchaseQty+"</em>"+n[r].vAnswerUnitName+"/<em>"+n[r].vValuationQty+"</em>"+n[r].vValuationUnitName+"</section><section><span>预交期：</span><em>"+n[r].vExpectedDelivery+"</em></section></li>";a+='		<li class="price"><span>单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?n[r].taxPrice:n[r].price)+"/"+n[r].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(n[r].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>答交小计：</span>'+$currencySymbol+formatMoney(n[r].vTaxLineTotal)+"</li>	</ul></div>"}else for(var r=0,t=n.length;t>r;r++)a+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+n[r].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+n[r].prodName+" "+n[r].prodScale+"</p></li>		<li><section><span>变更前：</span><em>"+n[r].purchaseQty+"</em>"+n[r].purchaseUnitName+"/<em>"+n[r].valuationQty+"</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+'</em></section></li>		<li class="changeItem"><section><span>变更后：</span><em>0</em>'+n[r].purchaseUnitName+"/<em>0</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+'</em></section></li>		<li class="price"><span>单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?n[r].taxPrice:n[r].price)+"/"+n[r].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(n[r].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>答交小计：</span>'+$currencySymbol+formatMoney(0)+"</li>	</ul></div>";e.load=!0}else container.show().html('<p style="text-align:center;">'+o.errorMsg+"</p>"),fnTip.hideLoading()}}),a},othersCost:function(){var e=this,a="",o=0;if(e.load){var n={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoOtherCostList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam()};$.ajax({type:"POST",url:config.serviceUrl,async:!1,data:"param="+JSON.stringify(n),success:function(n){if(n=n||{},n.success){var r=n.poOtherCostList;e._othersCost=r,a='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var t=0,i=r.length;i>t;t++)a+="<li><span>"+r[t].costName+"：</span><b>"+$currencySymbol+formatMoney(r[t].costAmount)+'</b><b class="dj"><em class="money">'+(2==e.changeType?"0.00":formatMoney(""==r[t].vCostAmount?r[t].costAmount:r[t].vCostAmount))+"</em></b></li>",o+=r[t].vCostAmount;a+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(e.orderInfo.cOtherCostTotal)+'</b></li><li id="changeCost" class="response changeLineTotal"><span>答交小计：</span>'+$currencySymbol+formatMoney(2==e.changeType?0:o)+"</li></ul></div>",$("#othersCost").html(a)}}})}},initSelect3:function(e,a,o){$(e).select3({allowClear:!0,items:a,placeholder:"请选择",showSearchInputInDropdown:!1,value:o})},start:function(){var e=this,a=document.getElementById("orderHeadInfo"),o=document.getElementById("prodBodyInfo");a.innerHTML=e.orderBaseInfo();var n={serviceId:"B01_queryAllPlatformCurrency",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",n,function(a){if(a.success){$platformCurrencyList=a;for(var o=0,n=a.platformCurrencyList.length;n>o;o++)if(a.platformCurrencyList[o].currencyCode==e.orderInfo.pCurrencyCode)return $currencySymbol=a.platformCurrencyList[o].currencySymbol,!1}}),o.innerHTML=e.prodBodyInfo(),e.othersCost();var r={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:_vParams.companyId,id:_vParams.poId,fileSource:1,searchType:1,docType:10,commonParam:commonParam()};GetAJAXData("POST",r,function(a){a.success&&($fileListData1=a,$scope.change_FileList=[],1==e.changeType&&a.fileList.forEach(function(e){2==e.fileSource&&(e.fileSource=1,$scope.change_FileList.push(e))}))}),requestFn("B03_POCReasonType",function(a){"0"==a.errorCode&&(e.reasonType=a.dataSet.data.detail,L=e.reasonType.length,e.reasonType.forEach(function(a){e.changeReason.push(a.Value)}))}),$(".item-total").html("本方采购总计："+$currencySymbol+formatMoney(e.orderInfo.cTotalAmount)).show(),$(".item-total-dj").html("供应商答交总计："+$currencySymbol+formatMoney(2==e.changeType?0:e.orderInfo.vTotalAmount)).show(),bottomBar(["share"],e.orderInfo.vAuditid,"","提交变更"),container.on("click","a.item-link",function(){var a=$(this),o=a.attr("name"),n=$body.scrollTop();switch(o){case"payInfo":orderReviseInfoCon.html(e.payInfo(n));break;case"remark":orderReviseInfoCon.html(e.remark(n));break;case"changeCause":orderReviseInfoCon.html(e.changeCause(n)),e.POCReasonType()}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),o=a.attr("data-scrollTop");if(a.is("#saveChangeCause")){var n=$("#changeCause").select3("value")||"";if(n){var r=reEnumFn(e.reasonType,n);changeCauseVal1.val(r),$changeCauseVal=n}else changeCauseVal1.val(""),$changeCauseVal="";changeCauseVal2.val($("#intRemarks").val())}container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(o)},200)}),e.submitFn()},changeCause:function(){var e='<div class="m-item m-item-select">	<h2 class="m-title">变更类型：</h2>	<div id="changeCause" class="select3-input"></div></div><div class="m-item">	<h2 class="m-title">变更原因：</h2>	<div class="item-wrap int-remarks">		<textarea name="" id="intRemarks" placeholder="在此处录入变更的备注和说明"></textarea>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveChangeCause" class="btnB">保存说明</a></div>';return e},POCReasonType:function(){var e=this;""==changeCauseVal1.val()?e.initSelect3("#changeCause",e.changeReason,""):e.initSelect3("#changeCause",e.changeReason,$changeCauseVal)},payInfo:function(e){var a=this,o=a.orderInfo,n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+o.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(a.logisticsType,o.logisticsType)+"</p></li><li><span>"+("3"==o.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>(收货人："+o.contactPerson+"，电话："+o.mobile+")</p></li><li><span>付款条件：</span><p>"+o.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(a.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return n},remark:function(e){for(var a=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+a.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+a.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<a._files.length;n++)o+='<p><a href="'+a._files[n].fileUrl+'"><i class=i-'+(_reg.test(a._files[n].fileName)?"image":"word")+"></i>"+a._files[n].fileName+"</a></p>";return o+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,a,o,n,r){new Popup({type:e,title:a,content:o,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:r})},submitBt:function(e){var a=this;if(2!=a.changeType?(a.addval_total=""==a.orderInfo.vTotal?a.orderInfo.cTotal:a.orderInfo.vTotal,a.addval_taxTotal=""==a.orderInfo.vTaxTotal?a.orderInfo.cTaxTotal:a.orderInfo.vTaxTotal,a.addval_totalAmount=""==a.orderInfo.vTotalAmount?a.orderInfo.cTotalAmount:a.orderInfo.vTotalAmount,a.addval_otherCostTotal=""==a.orderInfo.vOtherCostTotal?a.orderInfo.cOtherCostTotal:a.orderInfo.vOtherCostTotal):(a.addval_total=0,a.addval_taxTotal=0,a.addval_totalAmount=0,a.addval_otherCostTotal=0),$PoLineList=a._lineLists,$PoLineList.sort(function(e,a){return e.lineNo-a.lineNo}),$PoLineList.isChecked=!1,$PoLineList.forEach(function(e){e.changeLineNo=e.lineNo,e.changeType=1,e.changeFileList=[],e.changeRemark="",e.isChecked=!1}),3==a.changeType)$PoLineList.forEach(function(e){e.changeQty=e.purchaseQty,e.changeValuationQty=e.valuationQty,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=e.lineAmount,e.changeTaxLineTotal=e.taxLineTotal,e.changeExpectedDeliveryStr=e.expectedDelivery});else if(1==a.changeType){var o=[];$PoLineList.forEach(function(e){if(e.changeQty=e.vPurchaseQty,e.changeValuationQty=e.vValuationQty,e.changePrice=e.vPrice,e.changeTaxPrice=e.vTaxPrice,e.changeLineAmount=e.vLineAmount,e.changeTaxLineTotal=e.vTaxLineTotal,e.changeExpectedDeliveryStr=e.vExpectedDelivery,1==e.vBatchAnswer)for(var a=0;a<e.poSubLineInfo.length;a++)if(0==a)e.changeQty=e.poSubLineInfo[a].purchaseQty,e.changeValuationQty=e.poSubLineInfo[a].valuationQty,e.changeExpectedDeliveryStr=e.poSubLineInfo[a].expectedDelivery,e.changeLineAmount=e.changePrice*e.changeValuationQty,e.changeTaxLineTotal=e.changeTaxPrice*e.changeValuationQty,e.changeType=2;else{var n={};n.prodId=e.prodId,n.prodCode=e.prodCode,n.prodName=e.prodName,n.prodScale=e.prodScale,n.prodDesc=e.prodDesc,n.valuationUnitId=e.valuationUnitId,n.valuationUnitCode=e.valuationUnitCode,n.valuationUnitName=e.valuationUnitName,n.purchaseUnitId=e.purchaseUnitId,n.purchaseUnitName=e.purchaseUnitName,n.purchaseUnitCode=e.purchaseUnitCode,n.changePrice=e.vPrice,n.changeTaxPrice=e.vTaxPrice,n.changeFileList=[];var r=0==o.length?$PoLineList[$PoLineList.length-1].changeLineNo:o[o.length-1].changeLineNo;n.changeLineNo=r+1,n.changeType=3,n.changeQty=e.poSubLineInfo[a].purchaseQty,n.changeValuationQty=e.poSubLineInfo[a].valuationQty,n.changeExpectedDeliveryStr=e.poSubLineInfo[a].expectedDelivery,n.changeLineAmount=e.changePrice*e.changeValuationQty,n.changeTaxLineTotal=e.changeTaxPrice*e.changeValuationQty,o.push(n)}(e.price!=e.changePrice||e.purchaseQty!=e.changeQty||e.expectedDelivery!=e.changeExpectedDeliveryStr||e.lineAmount!=e.changeLineAmount)&&(e.changeType=2)}),$PoLineList=$PoLineList.concat(o)}else 4==$scope.changeType?$PoLineList.forEach(function(e){e.changeQty=e.purchaseQty,e.changeValuationQty=e.valuationQty,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=e.lineAmount,e.changeTaxLineTotal=e.taxLineTotal,e.changeExpectedDeliveryStr=e.expectedDelivery}):2==$scope.changeType&&$PoLineList.forEach(function(e){e.changeType=2,e.changeQty=0,e.changeValuationQty=0,e.changePrice=e.price,e.changeTaxPrice=e.taxPrice,e.changeLineAmount=0,e.changeTaxLineTotal=0,e.changeExpectedDeliveryStr=e.expectedDelivery});if($scope.poLineList=$PoLineList,a._othersCost.isChecked=!1,a._othersCost.forEach(function(e){e.changeType=1,e.isChecked=!1,4==a.changeType?e.vCostAmount=e.costAmount:2==a.changeType&&(e.vCostAmount=0)}),a._othersCost.sort(function(e,a){return e.lineNo-a.lineNo}),$scope.poOtherCostList=a._othersCost,1!=e&&2!=e)return void fnTip.error(2e3,"单据状态有问题");for(var n=privateDefultUser.employeeCode,r=privateDefultUser.employeeId,t=privateDefultUser.employeeName,i=privateDefultUser.memberId,c=[],s=0;s<$scope.poLineList.length;s++){var l=$scope.poLineList[s];if(void 0==l.prodName||void 0==l.changeQty||void 0==l.changeValuationQty||void 0==l.changePrice||void 0==l.changeTaxPrice||void 0==l.changeLineAmount||void 0==l.changeTaxLineTotal||void 0==l.changeExpectedDeliveryStr)return fnTip.error(2e3,"单据内容有问题"),!1;1==l.changeType&&(l.price!=l.changePrice||l.purchaseQty!=l.changeQty||l.expectedDelivery!=l.changeExpectedDeliveryStr||l.lineAmount!=l.changeLineAmount)&&(l.changeType=2);var d={lineNo:l.changeLineNo,poId:_vParams.poId,poFormNo:a.orderInfo.poFormNo,poLineId:l.id,poLineNo:l.lineNo,doId:"",doFormNo:"",doLineId:"",doLineNo:"",prodId:l.prodId,prodCode:l.prodCode,prodName:l.prodName,prodScale:l.prodScale,prodDesc:l.prodDesc,invId:l.invId,invCode:l.invCode,invName:l.invName,locationId:l.locationId,locationCode:l.locationCode,locationName:l.locationName,purchaseQty:l.purchaseQty,valuationQty:l.valuationQty,changeQty:l.changeQty,changeValuationQty:l.changeValuationQty,purchaseUnitId:l.purchaseUnitId,purchaseUnitCode:l.purchaseUnitCode,purchaseUnitName:l.purchaseUnitName,valuationUnitId:l.valuationUnitId,valuationUnitCode:l.valuationUnitCode,valuationUnitName:l.valuationUnitName,price:l.price,taxPrice:l.taxPrice,lineAmount:l.lineAmount,taxLineTotal:l.taxLineTotal,changePrice:l.changePrice,changeTaxPrice:l.changeTaxPrice,changeLineAmount:l.changeLineAmount,changeTaxLineTotal:l.changeTaxLineTotal,expectedDeliveryStr:new Date(l.expectedDelivery).getTime(),changeExpectedDeliveryStr:new Date(l.changeExpectedDeliveryStr).getTime(),batchDelivery:0,changeType:l.changeType,fileCount:l.changeFileList.length,remark:l.changeRemark,pcLineFileList:[]};l.expectedDelivery||delete d.expectedDeliveryStr,c.push(d)}var p=[];$scope.poOtherCostList.forEach(function(e){if(""!=e.costName){1==e.changeType&&e.vCostAmount!=e.costAmount&&(e.changeType=2);var a={lineNo:e.lineNo,poOtherCostId:e.poOtherCostId,costSource:e.costSource,costName:e.costName,costAmount:e.costAmount,changeCostAmount:e.vCostAmount,changeType:e.changeType,remark:e.changeRemark};p.push(a)}});var m=[];return 3!=a.changeType&&$scope.change_FileList.forEach(function(e){if(!s.isDeleted){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,m.push(a)}}),{companyId:a.orderInfo.companyId,companyCode:a.orderInfo.companyCode,companyName:a.orderInfo.companyName,companyAbbr:a.orderInfo.companyAbbr,vendorId:a.orderInfo.vendorId,vendorCode:a.orderInfo.vendorCode,vendorName:a.orderInfo.vendorName,vendorAbbr:a.orderInfo.vendorAbbr,pCurrencyCode:a.orderInfo.pCurrencyCode,pCurrencyName:a.orderInfo.pCurrencyName,currencyId:a.orderInfo.currencyId,currencyCode:a.orderInfo.currencyCode,currencyName:a.orderInfo.currencyName,localCurrencyId:a.orderInfo.localCurrencyId,localCurrencyCode:a.orderInfo.localCurrencyCode,localCurrencyName:a.orderInfo.localCurrencyName,exchangeRate:a.orderInfo.exchangeRate,taxId:a.orderInfo.taxId,taxCode:a.orderInfo.taxCode,taxName:a.orderInfo.taxName,isContainTax:a.orderInfo.isContainTax,taxRate:a.orderInfo.taxRate,conditionId:a.orderInfo.conditionId,conditionCode:a.orderInfo.conditionCode,conditionName:a.orderInfo.conditionName,payWayId:a.orderInfo.payWayId,payWayCode:a.orderInfo.payWayCode,payWayName:a.orderInfo.payWayName,payMentType:a.orderInfo.paymentType,poId:_vParams.poId,poFormNo:a.orderInfo.poFormNo,poInsideNo:a.orderInfo.poInsideNo,pocInsideNo:"",pocFormDateStr:(new Date).getTime(),poFormDateStr:a.orderInfo.poFormDate,changeType:a.changeType,changeReason:2==a.changeType?"3":changeCauseVal1.val()||"1",poManId:a.orderInfo.poManId,poManCode:a.orderInfo.poManCode,poManName:a.orderInfo.poManName,poManPid:a.orderInfo.poManPid,pocManId:r,pocManCode:n,pocManName:t,pocManPid:i,logisticsType:a.orderInfo.logisticsType,logisticsCode:a.orderInfo.logisticsCode,logisticsName:a.orderInfo.logisticsName,addressId:a.orderInfo.addressId,countryCode:a.orderInfo.countryCode,countryName:a.orderInfo.countryName,provinceCode:a.orderInfo.provinceCode,provinceName:a.orderInfo.provinceName,cityCode:a.orderInfo.cityCode,cityName:a.orderInfo.cityName,districtCode:a.orderInfo.districtCode,districtName:a.orderInfo.districtName,address:a.orderInfo.address,contactPerson:a.orderInfo.contactPerson,mobile:a.orderInfo.mobile,insideAddressCode:a.orderInfo.insideAddressCode,invId:a.orderInfo.invId,invCode:a.orderInfo.invCode,invName:a.orderInfo.invName,invoice:a.orderInfo.invoice,invoiceType:a.orderInfo.invoiceType,invoiceHeader:a.orderInfo.invoiceHeader,invoiceContent:a.orderInfo.invoiceContent,invoicePayMark:a.orderInfo.invoicePayMark,invoiceName:a.orderInfo.invoiceName,invoiceTel:a.orderInfo.invoiceTel,invoiceAddress:a.orderInfo.invoiceAddress,invoiceBank:a.orderInfo.invoiceBank,invoiceAccount:a.orderInfo.invoiceAccount,poTotalAmount:a.orderInfo.cTotalAmount,poTotal:a.orderInfo.cTotal,poTaxTotal:a.orderInfo.cTaxTotal,poOtherCostTotal:a.orderInfo.cOtherCostTotal,total:a.addval_total,taxTotal:a.addval_taxTotal,totalAmount:a.addval_totalAmount,otherCostTotal:a.addval_otherCostTotal,agreeMent:a.orderInfo.agreement,poRemark:a.orderInfo.remark,status:e,remark:$("#changeCauseVal2").val(),version:a.orderInfo.version,pcOtherCostList:p,pcLineList:c,pcFileList:m}},submitFn:function(){function e(e,o){$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"poChangeInfo":'+JSON.stringify(a.submitBt(o))+', "token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'","serviceId":"B03_addSavePoChange", "commonParam":'+JSON.stringify(commonParam())+"}"},success:function(o){return o=o||{},o.success?void(e&&e(o)):(a.popup("alert","",o.errorMsg),!1)}})}var a=this;$body.on("click",".bottom-btn-confirm",function(){1==a.changeType?a.popup("confirm","","确定提交变更吗？",function(){},function(){console.log('{"poChangeInfo":'+JSON.stringify(a.submitBt(2))+', "token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'","serviceId":"B03_addSavePoChange", "commonParam":'+JSON.stringify(commonParam())+"}"),e(function(){fnTip.success(2e3,"提交成功"),setTimeout(function(){window.location.href=config.htmlUrl+'orderHandedOut.html?param={"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}'},2e3)},2)}):2==a.changeType&&a.popup("confirm","","确定取消变更吗？",function(){},function(){e(function(e){fnTip.success(2e3,"取消成功"),setTimeout(function(){window.location.href=config.htmlUrl+'purchase_change.html?param={"id":"'+e.id+'","companyId":"'+_vParams.companyId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}'},2e3)})})})}};