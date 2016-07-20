var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,$fileData={},$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",Lists=function(){this.init()};Lists.prototype={init:function(){var a=this;a._lineLists=[],a._othersCost=[],a.totals=0,a.load=!1,requestFn("B03_POCStatus",function(e){"0"==e.errorCode&&(a.POCStatus=e.dataSet.data.detail)}),requestFn("B03_POCType",function(e){"0"==e.errorCode&&(a.changeType=e.dataSet.data.detail)}),requestFn("B03_POCReasonType",function(e){"0"==e.errorCode&&(a.changeReasons=e.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(a.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(a.invoiceType=e.dataSet.data.detail)}),requestFn("B02_Invoice",function(e){"0"==e.errorCode&&(a.invoiceInfoName=e.dataSet.data.detail)}),a.start()},orderBaseInfo:function(){var a=this,e="",n={serviceId:"B03_getPoChangeInfo",companyId:_vParams.companyId,id:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(n),success:function(n){n=n||{},n.success&&(a.orderInfo=n.poChange,$currencySymbol=a.orderInfo.currencySymbol,$priceDecimalNum=a.orderInfo.priceDecimalNum,$amountDecimalNum=a.orderInfo.amountDecimalNum,e+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>内部采购单号：</span><b>'+a.orderInfo.poInsideNo+"</b></li>		<li><span>供应商：</span><b>"+a.orderInfo.vendorName+"</b></li>		<li><span>变更单状态：</span><strong>"+enumFn(a.POCStatus,a.orderInfo.status)+"</strong></li>		<li><span>变更类型：</span>"+enumFn(a.changeType,a.orderInfo.changeType)+"</li>		<li><span>变更日期：</span>"+transDate(a.orderInfo.pocFormDate)+"</li>		<li><span>变更原因：</span>"+enumFn(a.changeReasons,a.orderInfo.changeReason)+"</li>		<li><span>变更备注：</span>"+a.orderInfo.remark+"</li>	</ul></div>")}}),e},prodBodyInfo:function(){var a=this,e="",n={serviceId:"B03_findPoChangeLineList",companyId:_vParams.companyId,id:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(n),success:function(n){if(n=n||{},n.success){var o=n.changeList;a._lineLists=o,e='<h2 class="m-title">采购明细</h2>';for(var t=0,i=o.length;i>t;t++)e+='<div class="item-wrap" data-index="'+t+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+o[t].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+o[t].prodName+" "+o[t].prodScale+"</p></li>		<li><section><span>变更前：</span><em>"+o[t].purchaseQty+"</em>"+o[t].purchaseUnitName+"/<em>"+o[t].valuationQty+"</em>"+o[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(o[t].expectedDelivery)+'</em></section></li>		<li class="changeItem"><section><span>变更后：</span><em>'+o[t].changeQty+"</em>"+o[t].purchaseUnitName+"/<em>"+o[t].changeValuationQty+"</em>"+o[t].valuationUnitName+"</section><section><span>预交期：</span><em>"+transDate(o[t].changeExpectedDelivery)+'</em></section></li>		<li class="price"><span>单价：</span>'+$currencySymbol+(1===a.orderInfo.isContainTax?formatMoney(o[t].taxPrice,$priceDecimalNum):formatMoney(o[t].price,$priceDecimalNum))+"/"+o[t].valuationUnitName+"</li>		<li><span>备注：</span><p>"+o[t].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span>'+$currencySymbol+formatMoney(o[t].taxLineTotal,$amountDecimalNum)+'</li>		<li class="changeItem"><span>变更小计：</span>'+$currencySymbol+formatMoney(o[t].changeTaxLineTotal,$amountDecimalNum)+"</li>	</ul></div>",a.totals+=parseInt(o[t].taxLineTotal,10);a.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else container.show().html('<p style="text-align:center;">'+n.errorMsg+"</p>"),fnTip.hideLoading()}}),e},othersCost:function(){var a=this,e="",n=0;if(a.load){var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoChangeOtherCostList",companyId:_vParams.companyId,pocId:_vParams.id,commonParam:commonParam()};$.ajax({type:"POST",url:config.serviceUrl,async:!1,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var t=o.poChangeOtherCostList;a._othersCost=t,e='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var i=0,s=t.length;s>i;i++)e+="<li><span>"+t[i].costName+"：</span><b>"+$currencySymbol+formatMoney(t[i].costAmount,$amountDecimalNum)+'</b><b class="dj"><em class="money"></em></b></li>',n+=Number(""==t[i].costAmount?0:t[i].costAmount);e+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(n,$amountDecimalNum)+"</b></li></ul></div>",$("#othersCost").html(e)}}})}},start:function(){var a=this,e=document.getElementById("orderHeadInfo"),n=document.getElementById("prodBodyInfo");e.innerHTML=a.orderBaseInfo(),n.innerHTML=a.prodBodyInfo(),a.othersCost(),$(".item-total").html("变更前总金额："+$currencySymbol+formatMoney(a.orderInfo.poTotalAmount,$amountDecimalNum)).show(),$(".item-total-dj").html("变更后总金额："+$currencySymbol+formatMoney(a.orderInfo.totalAmount,$amountDecimalNum)).show();var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:a.orderInfo.companyId,id:a.orderInfo.id,commonParam:commonParam(),docType:"11",fileSource:1,searchType:1};GetAJAXData("POST",o,function(a){a.success&&($fileData=a)},!0),bottomBar(["share"],a.orderInfo.poManId,!0),container.on("click","a.item-link",function(){var e=$(this),n=e.attr("name"),o=$body.scrollTop();switch(n){case"payInfo":orderReviseInfoCon.html(a.payInfo(o));break;case"remark":orderReviseInfoCon.html(a.remark(o))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)})},payInfo:function(a){var e=this,n=e.orderInfo,o='<ul class="payInfoList"><li><span>交易条件：</span><p>'+n.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,n.logisticsType)+("3"==n.logisticsType?"（自提点："+n.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+n.address+"；"+(""==n.mobile?"":"<br>电话："+n.mobile)+"</p></li><li><span>付款条件：</span><p>"+n.payWayName+"</p></li>";return o+=1==n.invoice?"<li><span>发票信息：</span><p>"+enumFn(e.invoiceInfoName,n.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(e.invoiceType,n.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+n.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+n.invoiceContent+"</p></li>",o+='</ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">返回</a></div>'},remark:function(a){var e=this,n='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.poRemark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>';0==$fileData.fileList.length&&(n+="<p><b>0个附件</b></p>");for(var o=0;o<$fileData.fileList.length;o++)n+='<p><a href="'+$fileData.fileList[o].fileUrl+'"><i class=i-'+(_reg.test($fileData.fileList[o].fileName)?"image":"word")+"></i>"+$fileData.fileList[o].fileName+"</a></p>";return n+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">返回</a></div>'}};