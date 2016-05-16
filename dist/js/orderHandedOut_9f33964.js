var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),OrderHandedOut=function(){this.init()};OrderHandedOut.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",a.start(),$(".item-total").html("总金额：&yen; "+formatMoney(a.totals)).show(),a.totals!=a.reCostTotalFn()&&$(".item-total-dj").html("答交总金额：&yen; "+formatMoney(a.reCostTotalFn())).show()},orderBaseInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(o){o=o||{},o.success&&(a.orderInfo=o.purchaseOrderInfo,a.memberId=a.orderInfo.auditid,e+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.poInsideNo+"</b></li>		<li><span>供应商：</span>"+a.orderInfo.vendorName+"</li>		<li><span>交易货币：</span>"+a.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+a.orderInfo.taxName+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+a.orderInfo.taxRate+"</label>":"")+"</li>		<li><span>采购日期：</span>"+transDate(a.orderInfo.poFormDate)+"</li>	</ul></div>")}}),e},fileList:function(){var a=this,e=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":"1","searchType":"1","id":"'+_vParams.id+'","docType":'+_vParams.docType+"}"},success:function(a){if(a=a||{},a.success)for(var o=a.fileList,n=o.length,s=0;n>s;s++)""!=o[s].fileName&&$(".files").eq(s).html('<span>附件：</span><a href="'+o[s].fileUrl+'"><i class=i-'+(e.test(o[s].fileName)?"image":"word")+"></i>"+o[s].fileName+"</a>").show()}})},prodsInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findPoLineList", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(o){if(o=o||{},o.success){var n=o.poLineList;e='<h2 class="m-title">产品信息</h2>';for(var s=0,t=n.length;t>s;s++){e+='<div class="item-wrap">	<ul>		<li><span>物料编码：</span><b>'+n[s].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[s].prodDesc+"</p></li>		<li><section><span>数量：</span>"+n[s].valuationQty+"盒/"+n[s].purchaseQty+"个</section><section><span>交期：</span>"+n[s].expectedDelivery+"</section></li>";for(var i=0;i<n[s].poSubLineInfo.length;i++)e+='<li class="response"><section><span>数量：</span><em>'+n[s].poSubLineInfo[i].vPurchaseQty+"</em>"+n[s].poSubLineInfo[i].purchaseUnit+"/<em>"+n[s].poSubLineInfo[i].vValuationQty+"</em>"+n[s].poSubLineInfo[i].valuationUnit+"</section><section><span>交期：</span><em>"+n[s].poSubLineInfo[i].vExpectedDelivery+"</em></section></li>";e+='		<li><span class="price">单价：</span>&yen; '+formatMoney(n[s].price)+"/个</li>		<li><span>备注：</span><p>"+n[s].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal" data-total="'+n[s].taxLineTotal+'" data-vTotal="'+(""!=n[s].vTaxLineTotal?n[s].vTaxLineTotal:n[s].taxLineTotal)+'"><span>小计：</span><b>&yen; '+formatMoney(n[s].taxLineTotal)+"</b></li>	</ul></div>",a.totals+=parseInt(n[s].taxLineTotal,10)}a.load=!0,setTimeout(function(){$(".contarin").show(),fnTip.hideLoading()},0)}else document.getElementById("prodListsInfo").innerHTML='<p style="text-align:center;">'+o.errorMsg+"</p>"}}),e},otherCostList:function(){var a=this,e="",o=0,n=0,s=!1;return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","commonParam":'+a.commonParam+',"serviceId":"B03_findPoOtherCostList",'+a.tokens+"}"},success:function(t){if(t=t||{},t.success){var i=t.poOtherCostList;e='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var r=0,c=i.length;c>r;r++)e+="<li><span>"+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+"</b></li>",o+=parseInt(i[r].costAmount,10),n+=parseInt(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount,10),""!=i[r].vCostAmount&&(s=!0);e+='<li id="othersCostSubtotal" class="subtotal" data-total="'+o+'" data-vTotal="'+(s?n:o)+'"><span>小计：</span><b>&yen; '+formatMoney(o)+"</b></li>",e+="</ul></div>",a.totals+=parseInt(o,10)}else console.log(t.errorMsg)}}),e},reCostTotalFn:function(){var a=0;return $(".contarin").find(".subtotal").each(function(){a+=parseInt($(this).attr("data-vtotal"),10)}),a},start:function(){var a=this;webViewTitle("采购订单发放");var e=document.getElementById("otherCost");orderBaseInfo&&(orderBaseInfo.innerHTML=a.orderBaseInfo()),prodListsInfo&&(prodListsInfo.innerHTML=a.prodsInfo()),e&&a.load&&(e.innerHTML=a.otherCostList()),a.load&&a.fileList(),bottomBar(["share"],a.memberId),container.on("click","a.item-link",function(){var e=$(this),o=e.attr("name"),n=$body.scrollTop();switch(o){case"payInfo":orderReviseInfoCon.html(a.payInfo(n));break;case"remark":orderReviseInfoCon.html(a.remark(n))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn",function(){a.submitFn()})},payInfo:function(a){var e=this,o=e.orderInfo;requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+o.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,o.logisticsType)+("3"==o.logisticsType?"（自提点："+o.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+o.address+"；"+(""==o.mobile?"":"<br>电话："+o.mobile)+"</p></li><li><span>付款条件：</span><p>"+o.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(e.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return n},remark:function(a){var e=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return o},submitFn:function(){var a=this;$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_submitPurchaseOrder", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(a){a=a||{},a.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):fnTip.error(2e3)}})}};