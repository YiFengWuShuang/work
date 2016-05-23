var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),OrderHandedOut=function(){this.init()};OrderHandedOut.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",a.start(),$(".item-total").html("总金额：&yen; "+formatMoney(a.totals)).show(),a.totals!=a.reCostTotalFn()&&$(".item-total-dj").html("答交总金额：&yen; "+formatMoney(a.reCostTotalFn())).show()},orderBaseInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(n){n=n||{},n.success&&(a.orderInfo=n.purchaseOrderInfo,a.memberId=a.orderInfo.auditid,e+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.poInsideNo+"</b></li>		<li><span>供应商：</span>"+a.orderInfo.vendorName+"</li>		<li><span>交易货币：</span>"+a.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+a.orderInfo.taxName+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购日期：</span>"+transDate(a.orderInfo.poFormDate)+"</li>	</ul></div>")}}),e},fileList:function(){var a=this,e=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":1,"searchType":2,"id":"'+_vParams.id+'","docType":'+_vParams.docType+', "commonParam":'+a.commonParam+"}"},success:function(a){if(a=a||{},a.success)for(var n=a.fileList,o=n.length,t=0;o>t;t++)""!=n[t].fileName&&$(".files").eq(t).html('<span>附件：</span><a href="'+n[t].fileUrl+'"><i class=i-'+(e.test(n[t].fileName)?"image":"word")+"></i>"+n[t].fileName+"</a>").show()}})},prodsInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findPoLineList", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(n){if(n=n||{},n.success){var o=n.poLineList;e='<h2 class="m-title">产品信息</h2>';for(var t=0,s=o.length;s>t;t++){e+='<div class="item-wrap">	<ul>		<li><span>物料编码：</span><b>'+o[t].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+o[t].prodDesc+"</p></li>		<li><section><span>数量：</span>"+o[t].valuationQty+o[t].purchaseUnitName+"/"+o[t].purchaseQty+o[t].valuationUnitName+"</section><section><span>交期：</span>"+o[t].expectedDelivery+"</section></li>";for(var i=0;i<o[t].poSubLineInfo.length;i++)e+='<li class="response"><section><span>数量：</span><em>'+o[t].poSubLineInfo[i].vPurchaseQty+"</em>"+o[t].poSubLineInfo[i].purchaseUnit+"/<em>"+o[t].poSubLineInfo[i].vValuationQty+"</em>"+o[t].poSubLineInfo[i].valuationUnit+"</section><section><span>交期：</span><em>"+o[t].poSubLineInfo[i].vExpectedDelivery+"</em></section></li>";e+='		<li><span class="price">单价：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?o[t].taxPrice:o[t].price)+"/"+o[t].valuationUnitName+"</li>		<li><span>备注：</span><p>"+o[t].remark+'</p></li>		<li class="files"><span>附件：</span></li>'+(1===a.orderInfo.isContainTax?'<li class="subtotal" data-total="'+o[t].taxLineTotal+'" data-vTotal="'+(""!=o[t].vTaxLineTotal?o[t].vTaxLineTotal:o[t].taxLineTotal)+'"><span>含税小计：</span><b>&yen; '+formatMoney(o[t].taxLineTotal)+"</b></li>":'<li class="subtotal" data-total="'+o[t].lineAmount+'" data-vTotal="'+(""!=o[t].vLineAmount?o[t].vLineAmount:o[t].lineAmount)+'"><span>无税小计：</span><b>&yen; '+formatMoney(o[t].lineAmount)+"</b></li>")+"	</ul></div>",a.totals+=parseInt(o[t].taxLineTotal,10)}a.load=!0,setTimeout(function(){$(".contarin").show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+n.errorMsg+"</p>")}}),e},otherCostList:function(){var a=this,e="",n=0,o=0,t=!1;return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","commonParam":'+a.commonParam+',"serviceId":"B03_findPoOtherCostList",'+a.tokens+"}"},success:function(s){if(s=s||{},s.success){var i=s.poOtherCostList;e='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var r=0,l=i.length;l>r;r++)e+="<li><span>"+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+"</b></li>",n+=parseInt(i[r].costAmount,10),o+=parseInt(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount,10),""!=i[r].vCostAmount&&(t=!0);e+='<li id="othersCostSubtotal" class="subtotal" data-total="'+n+'" data-vTotal="'+(t?o:n)+'"><span>小计：</span><b>&yen; '+formatMoney(n)+"</b></li>",e+="</ul></div>",a.totals+=parseInt(n,10)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+s.errorMsg+"</p>")}}),e},reCostTotalFn:function(){var a=0;return $(".contarin").find(".subtotal").each(function(){a+=parseInt($(this).attr("data-vtotal"),10)}),a},start:function(){var a=this,e=document.getElementById("otherCost");orderBaseInfo&&(orderBaseInfo.innerHTML=a.orderBaseInfo()),prodListsInfo&&(prodListsInfo.innerHTML=a.prodsInfo()),e&&a.load&&(e.innerHTML=a.otherCostList()),a.load&&a.fileList(),a.load&&bottomBar(["share"],a.memberId),container.on("click","a.item-link",function(){var e=$(this),n=e.attr("name"),o=$body.scrollTop();switch(n){case"payInfo":orderReviseInfoCon.html(a.payInfo(o));break;case"remark":orderReviseInfoCon.html(a.remark(o))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn",function(){a.submitFn()})},payInfo:function(a){var e=this,n=e.orderInfo;requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)});var o='<ul class="payInfoList"><li><span>交易条件：</span><p>'+n.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,n.logisticsType)+("3"==n.logisticsType?"（自提点："+n.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+n.address+"；"+(""==n.mobile?"":"<br>电话："+n.mobile)+"</p></li><li><span>付款条件：</span><p>"+n.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(e.invoiceType,n.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+n.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+n.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return o},remark:function(a){var e=this,n='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return n},submitFn:function(){var a=this;$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_submitPurchaseOrder", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(a){a=a||{},a.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):fnTip.error(2e3)}})}};