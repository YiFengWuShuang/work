var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,OrderHandedOut=function(){this.init()};OrderHandedOut.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",a.start(),$(".item-total").html("总金额：&yen; "+formatMoney(a.totals)).show(),a.totals!=a.reCostTotalFn()&&$(".item-total-dj").html("答交总金额：&yen; "+formatMoney(a.reCostTotalFn())).show()},orderBaseInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(o){o=o||{},o.success&&(a.orderInfo=o.purchaseOrderInfo,a.memberId=a.orderInfo.auditid,a.status=a.orderInfo.status,a.vStatus=a.orderInfo.vStatus,e+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.poInsideNo+"</b></li>		<li><span>供应商：</span>"+a.orderInfo.vendorName+"</li>		<li><span>交易货币：</span>"+a.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+a.orderInfo.taxName+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购日期：</span>"+transDate(a.orderInfo.poFormDate)+"</li>	</ul></div>")}}),e},fileList:function(){var a=this;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":1,"searchType":2,"id":"'+_vParams.poId+'","docType":"10", "commonParam":'+a.commonParam+"}"},success:function(e){if(e=e||{},e.success){for(var o=e.fileList,n=o.length,t=0;n>t;t++)""!=o[t].fileName&&$(".files").eq(t).html('<span>附件：</span><a href="'+o[t].fileUrl+'"><i class=i-'+(_reg.test(o[t].fileName)?"image":"word")+"></i>"+o[t].fileName+"</a>").show();a._files=o}}})},prodsInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findPoLineList", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(o){if(o=o||{},o.success){var n=o.poLineList;e='<h2 class="m-title">产品信息</h2>';for(var t=0,s=n.length;s>t;t++){e+='<div class="item-wrap">	<ul>		<li><span>物料编码：</span><b>'+n[t].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[t].prodDesc+"</p></li>		<li><section><span>数量：</span>"+n[t].valuationQty+n[t].purchaseUnitName+"/"+n[t].purchaseQty+n[t].valuationUnitName+"</section><section><span>交期：</span>"+n[t].expectedDelivery+"</section></li>";for(var i=0;i<n[t].poSubLineInfo.length;i++)e+='<li class="response"><section><span>数量：</span><em>'+n[t].poSubLineInfo[i].vPurchaseQty+"</em>"+n[t].poSubLineInfo[i].purchaseUnit+"/<em>"+n[t].poSubLineInfo[i].vValuationQty+"</em>"+n[t].poSubLineInfo[i].valuationUnit+"</section><section><span>交期：</span><em>"+n[t].poSubLineInfo[i].vExpectedDelivery+"</em></section></li>";e+='		<li><span class="price">单价：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?n[t].taxPrice:n[t].price)+"/"+n[t].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[t].remark+'</p></li>		<li class="files"><span>附件：</span></li>'+(1===a.orderInfo.isContainTax?'<li class="subtotal" data-total="'+n[t].taxLineTotal+'" data-vTotal="'+(""!=n[t].vTaxLineTotal?n[t].vTaxLineTotal:n[t].taxLineTotal)+'"><span>含税小计：</span><b>&yen; '+formatMoney(n[t].taxLineTotal)+"</b></li>":'<li class="subtotal" data-total="'+n[t].lineAmount+'" data-vTotal="'+(""!=n[t].vLineAmount?n[t].vLineAmount:n[t].lineAmount)+'"><span>无税小计：</span><b>&yen; '+formatMoney(n[t].lineAmount)+"</b></li>")+(3==a.status?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+formatMoney(n[t].vTaxLineTotal)+"</li>":"")+"	</ul></div>",a.totals+=parseInt(n[t].taxLineTotal,10)}a.load=!0,setTimeout(function(){$(".contarin").show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+o.errorMsg+"</p>")}}),e},otherCostList:function(){var a=this,e="",o=0,n=0,t=!1;return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","commonParam":'+a.commonParam+',"serviceId":"B03_findPoOtherCostList",'+a.tokens+"}"},success:function(s){if(s=s||{},s.success){var i=s.poOtherCostList;e='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var r=0,l=i.length;l>r;r++)e+="<li><span>"+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+"</b></li>",o+=parseInt(i[r].costAmount,10),n+=parseInt(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount,10),""!=i[r].vCostAmount&&(t=!0);e+='<li id="othersCostSubtotal" class="subtotal" data-total="'+o+'" data-vTotal="'+(t?n:o)+'"><span>小计：</span><b>&yen; '+formatMoney(o)+"</b></li>",t&&3==a.status&&(e+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+formatMoney(n)+"</li>"),e+="</ul></div>",a.totals+=parseInt(o,10)}}}),e},reCostTotalFn:function(){var a=0;return $(".contarin").find(".subtotal").each(function(){a+=parseInt($(this).attr("data-vtotal"),10)}),a},start:function(){var a=this,e=document.getElementById("otherCost");orderBaseInfo&&(orderBaseInfo.innerHTML=a.orderBaseInfo()),prodListsInfo&&(prodListsInfo.innerHTML=a.prodsInfo()),e&&a.load&&(e.innerHTML=a.otherCostList()),a.load&&a.fileList(),a.load&&(2==a.status?bottomBar(["share"],a.memberId,!0):3==a.status?bottomBar(["share"],a.memberId,"","确认答交","取消订单"):bottomBar(["share"],a.memberId)),container.on("click","a.item-link",function(){var e=$(this),o=e.attr("name"),n=$body.scrollTop();switch(o){case"payInfo":orderReviseInfoCon.html(a.payInfo(n));break;case"remark":orderReviseInfoCon.html(a.remark(n))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn-confirm",function(){return 3==a.status?!1:void a.submitFn()}),$body.on("click",".bottom-btn-cancel",function(){a.popup("confirm","","确定要取消订单吗？",function(){},function(){})})},payInfo:function(a){var e=this,o=e.orderInfo;requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+o.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,o.logisticsType)+("3"==o.logisticsType?"（自提点："+o.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+o.address+"；"+(""==o.mobile?"":"<br>电话："+o.mobile)+"</p></li><li><span>付款条件：</span><p>"+o.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(e.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return n},remark:function(a){for(var e=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<e._files.length;n++)o+='<p><a href="'+e._files[n].fileUrl+'"><i class=i-'+(_reg.test(e._files[n].fileName)?"image":"word")+"></i>"+e._files[n].fileName+"</a></p>";return o+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},popup:function(a,e,o,n,t){new Popup({type:a,title:e,content:o,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:t})},submitFn:function(){var a=this;$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_submitPurchaseOrder", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(a){a=a||{},a.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):fnTip.error(2e3)}})}};