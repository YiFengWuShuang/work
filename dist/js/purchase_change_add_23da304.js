var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,privateDefultUser,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._lineLists=[],e._othersCost=[],e.totals=0,e.load=!1,setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B03_POCType",function(o){"0"==o.errorCode&&(e.changeType=o.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(o){"0"==o.errorCode&&(e.logisticsType=o.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(o){"0"==o.errorCode&&(e.invoiceType=o.dataSet.data.detail)}),GetUserInfo("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber},function(e){"01230"==e.retCode&&(privateDefultUser=e)}),e.start()},orderBaseInfo:function(){var e=this,o="",a={serviceId:"B03_getPurchaseOrderInfo",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success&&(e.orderInfo=a.purchaseOrderInfo,o+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>所属公司：</span><b>'+e.orderInfo.companyName+"</b></li>		<li><span>采购单号：</span><b>"+e.orderInfo.poFormNo+"</b></li>		<li><span>内部采购单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>变更类型：</span>"+enumFn(e.changeType,_vParams.changeType)+"</li>		<li><span>变更人：</span>"+e.orderInfo.auditname+"</li>		<li><span>变更日期：</span>"+transDate((new Date).getTime())+"</li>	</ul></div>")}}),o},fileList:function(){var e=this;if(e.load){var o={secretNumber:_vParams.secretNumber,token:_vParams.token,serviceId:"B01_findFileList",companyId:_vParams.companyId,commonParam:commonParam(),fileSource:"1",searchType:"2",id:_vParams.poId,docType:10};$.ajax({type:"POST",url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){for(var a=o.fileList,n=0,r=a.length;r>n;n++)""!=a[n].fileName&&$(".files").eq(n).html('<span>附件：</span><a href="'+a[n].fileUrl+'"><i class=i-'+(_reg.test(a[n].fileName)?"image":"word")+"></i>"+a[n].fileName+"</a>").show();e._files=a}}})}},prodBodyInfo:function(){var e=this,o="",a={serviceId:"B03_findPoLineList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var n=a.poLineList;if(e._lineLists=n,o='<h2 class="m-title">采购明细</h2>',2!=_vParams.changeType)for(var r=0,t=n.length;t>r;r++){if(o+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+n[r].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+n[r].prodName+" "+n[r].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+n[r].purchaseQty+"</em>"+n[r].purchaseUnitName+"/<em>"+n[r].valuationQty+"</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+"</em></section></li>",n[r].poSubLineInfo.length)for(var i=0;i<n[r].poSubLineInfo.length;i++)o+='<li class="changeItem"><section><span>变更：</span><em>'+n[r].poSubLineInfo[i].purchaseQty+"</em>"+n[r].vAnswerUnitName+"/<em>"+n[r].poSubLineInfo[i].valuationQty+"</em>"+n[r].vValuationUnitName+"</section><section><span>预交期：</span><em>"+n[r].poSubLineInfo[i].expectedDelivery+"</em></section></li>";else o+='<li class="changeItem"><section><span>变更：</span><em>'+n[r].vPurchaseQty+"</em>"+n[r].vAnswerUnitName+"/<em>"+n[r].vValuationQty+"</em>"+n[r].vValuationUnitName+"</section><section><span>预交期：</span><em>"+n[r].vExpectedDelivery+"</em></section></li>";o+='		<li class="price"><span>单价：</span>&yen; '+formatMoney(1===e.orderInfo.isContainTax?n[r].taxPrice:n[r].price)+"/"+n[r].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(n[r].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>变更金额：</span>&yen; '+formatMoney(n[r].vTaxLineTotal)+"</li>	</ul></div>"}else for(var r=0,t=n.length;t>r;r++)o+='<div class="item-wrap">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+n[r].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+n[r].prodName+" "+n[r].prodScale+"</p></li>		<li><section><span>变更前：</span><em>"+n[r].purchaseQty+"</em>"+n[r].purchaseUnitName+"/<em>"+n[r].valuationQty+"</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+'</em></section></li>		<li class="changeItem"><section><span>变更后：</span><em>0</em>'+n[r].purchaseUnitName+"/<em>0</em>"+n[r].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(n[r].expectedDelivery)+'</em></section></li>		<li class="price"><span>单价：</span>&yen; '+formatMoney(1===e.orderInfo.isContainTax?n[r].taxPrice:n[r].price)+"/"+n[r].valuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(n[r].taxLineTotal)+'</b></li>		<li class="changeItem changeLineTotal"><span>变更小计：</span>&yen; '+formatMoney(0)+"</li>	</ul></div>";e.load=!0}else container.show().html('<p style="text-align:center;">'+a.errorMsg+"</p>"),fnTip.hideLoading()}}),o},othersCost:function(){var e=this,o="";if(e.load){var a={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoOtherCostList",companyId:_vParams.companyId,poId:_vParams.poId,commonParam:commonParam()};$.ajax({type:"POST",url:config.serviceUrl,async:!1,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var n=a.poOtherCostList;e._othersCost=n,o='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var r=0,t=n.length;t>r;r++)o+="<li><span>"+n[r].costName+"：</span><b>&yen; "+formatMoney(n[r].costAmount)+'</b><b class="dj"><em class="money">'+(2==_vParams.changeType?"0.00":formatMoney(""==n[r].vCostAmount?n[r].costAmount:n[r].vCostAmount))+"</em></b></li>";o+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(e.orderInfo.cOtherCostTotal)+'</b></li><li id="changeCost" class="response changeLineTotal"><span>变更费用：</span>&yen; '+formatMoney(0)+"</li></ul></div>",$("#othersCost").html(o)}}})}},initSelect3:function(e,o,a){$(e).select3({allowClear:!0,items:o,placeholder:"请选择",showSearchInputInDropdown:!1,value:a})},start:function(){var e=this,o=document.getElementById("orderHeadInfo"),a=document.getElementById("prodBodyInfo");o.innerHTML=e.orderBaseInfo(),a.innerHTML=e.prodBodyInfo(),e.fileList(),e.othersCost(),$(".item-total").html("变更前总金额：&yen;"+formatMoney(e.orderInfo.cTotalAmount)).show(),$(".item-total-dj").html("变更后总金额：&yen;"+formatMoney(2==_vParams.changeType?0:e.orderInfo.vTotalAmount)).show(),bottomBar(["share"],e.orderInfo.auditid,"","提交变更"),container.on("click","a.item-link",function(){var o=$(this),a=o.attr("name"),n=$body.scrollTop();switch(a){case"payInfo":orderReviseInfoCon.html(e.payInfo(n));break;case"remark":orderReviseInfoCon.html(e.remark(n));break;case"changeCause":orderReviseInfoCon.html(e.changeCause(n)),e.POCReasonType()}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var o=$(this),a=o.attr("data-scrollTop");if(o.is("#saveChangeCause")){var n=reEnumFn(e.pocReasonType,$("#changeCause").select3("value"));$("#changeCauseVal1").val(n),$("#changeCauseVal2").val($("#intRemarks").val())}container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(a)},200)}),e.submitFn()},changeCause:function(){var e='<div class="m-item m-item-select">	<h2 class="m-title">变更类型：</h2>	<div id="changeCause" class="select3-input"></div></div><div class="m-item">	<h2 class="m-title">变更原因：</h2>	<div class="item-wrap int-remarks">		<textarea name="" id="intRemarks" placeholder="在此处录入变更的备注和说明"></textarea>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveChangeCause" class="btnB">保存说明</a></div>';return e},POCReasonType:function(){var e=this,o=[];requestFn("B03_POCReasonType",function(a){if("0"==a.errorCode){{var n=a.dataSet.data.detail;n.length}e.pocReasonType=n,n.forEach(function(e){o.push(e.Value)})}}),e.initSelect3("#changeCause",o,"")},payInfo:function(e){var o=this,a=o.orderInfo,n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+a.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(o.logisticsType,a.logisticsType)+("3"==a.logisticsType?"（自提点："+a.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+a.address+"；"+(""==a.mobile?"":"<br>电话："+a.mobile)+"</p></li><li><span>付款条件：</span><p>"+a.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(o.invoiceType,a.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+a.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+a.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return n},remark:function(e){for(var o=this,a='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+o.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+o.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<o._files.length;n++)a+='<p><a href="'+o._files[n].fileUrl+'"><i class=i-'+(_reg.test(o._files[n].fileName)?"image":"word")+"></i>"+o._files[n].fileName+"</a></p>";return a+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,o,a,n,r){new Popup({type:e,title:o,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:r})},submitBt:function(e){var o=this;if(1!=e&&2!=e)return void fnTip.error(2e3,"单据状态有问题");for(var a,n=privateDefultUser.employeeCode,r=privateDefultUser.employeeId,t=privateDefultUser.employeeName,i=privateDefultUser.memberId,s=[],c=0;c<o._lineLists.length;c++){var d=o._lineLists[c];a=d.price!=d.vPrice||d.purchaseQty!=d.vPurchaseQty||d.expectedDelivery!=d.vExpectedDelivery||d.lineAmount!=d.vLineAmount?"2":"1";var l={lineNo:c+1,poId:_vParams.poId,poFormNo:o.orderInfo.poFormNo,poLineId:d.id,poLineNo:d.lineNo,doId:"",doFormNo:"",doLineId:"",doLineNo:"",prodId:d.prodId,prodCode:d.prodCode,prodName:d.prodName,prodScale:d.prodScale,prodDesc:d.prodDesc,invId:d.invId,invCode:d.invCode,invName:d.invName,locationId:d.locationId,locationCode:d.locationCode,locationName:d.locationName,purchaseQty:d.purchaseQty,valuationQty:d.valuationQty,changeQty:2==e?0:d.vPurchaseQty,changeValuationQty:2==e?0:d.vValuationQty,purchaseUnitId:d.purchaseUnitId,purchaseUnitCode:d.purchaseUnitCode,purchaseUnitName:d.purchaseUnitName,valuationUnitId:d.valuationUnitId,valuationUnitCode:d.valuationUnitCode,valuationUnitName:d.valuationUnitName,price:d.price,taxPrice:d.taxPrice,lineAmount:d.lineAmount,taxLineTotal:d.taxLineTotal,changePrice:d.vPrice,changeTaxPrice:d.vTaxPrice,changeLineAmount:2==e?0:d.vLineAmount,changeTaxLineTotal:2==e?0:d.vTaxLineTotal,expectedDeliveryStr:new Date(d.expectedDelivery).getTime(),changeExpectedDeliveryStr:new Date(d.vExpectedDelivery).getTime(),batchDelivery:0,changeType:a,fileCount:"",remark:d.vRemark,pcLineFileList:[]};s.push(l)}var p,m=[];o._othersCost.forEach(function(o){if(""!=o.costName){p=o.vCostAmount!=o.costAmount?"2":"1";var a={lineNo:o.lineNo,poOtherCostId:o.poOtherCostId,costSource:o.costSource,costName:o.costName,costAmount:o.costAmount,changeCostAmount:2==e?0:o.vCostAmount,changeType:p,remark:o.vRemark};m.push(a)}});var f=[];return{companyId:o.orderInfo.companyId,companyCode:o.orderInfo.companyCode,companyName:o.orderInfo.companyName,companyAbbr:o.orderInfo.companyAbbr,vendorId:o.orderInfo.vendorId,vendorCode:o.orderInfo.vendorCode,vendorName:o.orderInfo.vendorName,vendorAbbr:o.orderInfo.vendorAbbr,pCurrencyCode:o.orderInfo.pCurrencyCode,pCurrencyName:o.orderInfo.pCurrencyName,currencyId:o.orderInfo.currencyId,currencyCode:o.orderInfo.currencyCode,currencyName:o.orderInfo.currencyName,localCurrencyId:o.orderInfo.localCurrencyId,localCurrencyCode:o.orderInfo.localCurrencyCode,localCurrencyName:o.orderInfo.localCurrencyName,exchangeRate:o.orderInfo.exchangeRate,taxId:o.orderInfo.taxId,taxCode:o.orderInfo.taxCode,taxName:o.orderInfo.taxName,isContainTax:o.orderInfo.isContainTax,taxRate:o.orderInfo.taxRate,conditionId:o.orderInfo.conditionId,conditionCode:o.orderInfo.conditionCode,conditionName:o.orderInfo.conditionName,payWayId:o.orderInfo.payWayId,payWayCode:o.orderInfo.payWayCode,payWayName:o.orderInfo.payWayName,payMentType:o.orderInfo.paymentType,poId:_vParams.poId,poFormNo:o.orderInfo.poFormNo,poInsideNo:o.orderInfo.poInsideNo,pocInsideNo:"",pocFormDateStr:(new Date).getTime(),poFormDateStr:o.orderInfo.poFormDate,changeType:e.toString(),changeReason:2==e?3:$("#changeCauseVal1").val()||"1",poManId:o.orderInfo.poManId,poManCode:o.orderInfo.poManCode,poManName:o.orderInfo.poManName,poManPid:o.orderInfo.poManPid,pocManId:r,pocManCode:n,pocManName:t,pocManPid:i,logisticsType:o.orderInfo.logisticsType,logisticsCode:o.orderInfo.logisticsCode,logisticsName:o.orderInfo.logisticsName,addressId:o.orderInfo.addressId,countryCode:o.orderInfo.countryCode,countryName:o.orderInfo.countryName,provinceCode:o.orderInfo.provinceCode,provinceName:o.orderInfo.provinceName,cityCode:o.orderInfo.cityCode,cityName:o.orderInfo.cityName,districtCode:o.orderInfo.districtCode,districtName:o.orderInfo.districtName,address:o.orderInfo.address,contactPerson:o.orderInfo.contactPerson,mobile:o.orderInfo.mobile,insideAddressCode:o.orderInfo.insideAddressCode,invId:o.orderInfo.invId,invCode:o.orderInfo.invCode,invName:o.orderInfo.invName,invoice:o.orderInfo.invoice,invoiceType:o.orderInfo.invoiceType,invoiceHeader:o.orderInfo.invoiceHeader,invoiceContent:o.orderInfo.invoiceContent,invoicePayMark:o.orderInfo.invoicePayMark,invoiceName:o.orderInfo.invoiceName,invoiceTel:o.orderInfo.invoiceTel,invoiceAddress:o.orderInfo.invoiceAddress,invoiceBank:o.orderInfo.invoiceBank,invoiceAccount:o.orderInfo.invoiceAccount,poTotalAmount:o.orderInfo.cTotalAmount,poTotal:o.orderInfo.cTotal,poTaxTotal:o.orderInfo.cTaxTotal,poOtherCostTotal:o.orderInfo.cOtherCostTotal,total:2==e?0:o.orderInfo.vTotal,taxTotal:2==e?0:o.orderInfo.vTaxTotal,totalAmount:2==e?0:o.orderInfo.vTotalAmount,otherCostTotal:2==e?0:o.orderInfo.vOtherCostTotal,agreeMent:o.orderInfo.agreement,poRemark:o.orderInfo.remark,status:e,remark:$("#changeCauseVal2").val(),version:o.orderInfo.version,pcOtherCostList:m,pcLineList:s,pcFileList:f}},submitFn:function(){function e(e,a){$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"poChangeInfo":'+JSON.stringify(o.submitBt(a))+', "token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'","serviceId":"B03_addSavePoChange", "commonParam":'+JSON.stringify(commonParam())+"}"},success:function(a){return a=a||{},a.success?void(e&&e(a)):(o.popup("alert","",a.errorMsg),!1)}})}var o=this;$body.on("click",".bottom-btn-confirm",function(){1==_vParams.changeType?o.popup("confirm","","确定提交变更吗？",function(){},function(){e(function(){fnTip.success(2e3,"提交成功"),setTimeout(function(){window.location.href=config.htmlUrl+'orderHandedOut.html?param={"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}'},2e3)},1)}):2==_vParams.changeType&&o.popup("confirm","","确定取消变更吗？",function(){},function(){e(function(e){fnTip.success(2e3,"取消成功"),setTimeout(function(){window.location.href=config.htmlUrl+'purchase_change.html?param={"id":"'+e.id+'","companyId":"'+_vParams.companyId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}'},2e3)},2)})})}};