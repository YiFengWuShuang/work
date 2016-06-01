var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,OrderHandedOut=function(){this.init()};OrderHandedOut.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",requestFn("B03_POVStatus",function(t){"0"==t.errorCode&&(a.POVNStatus=t.dataSet.data.detail)}),a.start()},orderBaseInfo:function(){var a=this,t="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(e){e=e||{},e.success&&(a.orderInfo=e.purchaseOrderInfo,a.memberId=a.orderInfo.auditid,a.status=a.orderInfo.status,a.vStatus=a.orderInfo.vStatus,t+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.poInsideNo+"</b></li>		<li><span>供应商：</span>"+a.orderInfo.vendorName+"</li>		<li><span>交易币别：</span>"+a.orderInfo.currencyName+"</li>		<li><span>交易税别：</span>"+a.orderInfo.taxName+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购员：</span>"+a.orderInfo.poManName+"</li>"+(1==a.status||8==a.status?"":"<li><span>供应商答交状态：</span>"+enumFn(a.POVNStatus,a.orderInfo.vStatus)+"</li>")+"	</ul></div>")}}),t},fileList:function(){var a=this;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":1,"searchType":2,"id":"'+_vParams.poId+'","docType":"10", "commonParam":'+a.commonParam+"}"},success:function(t){if(t=t||{},t.success){for(var e=t.fileList,n=e.length,o=0;n>o;o++)""!=e[o].fileName&&$(".files").eq(o).html('<span>附件：</span><a href="'+e[o].fileUrl+'"><i class=i-'+(_reg.test(e[o].fileName)?"image":"word")+"></i>"+e[o].fileName+"</a>").show();a._files=e}}})},prodsInfo:function(){var a=this,t="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findPoLineList", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(e){if(e=e||{},e.success){var n=e.poLineList;t='<h2 class="m-title">产品明细</h2>';for(var o=0,s=n.length;s>o;o++){t+='<div class="item-wrap">	<ul>		<li><span>物料编码：</span><b>'+n[o].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[o].prodDesc+"</p></li>		<li><section><span>数量：</span>"+n[o].valuationQty+n[o].purchaseUnitName+"/"+n[o].purchaseQty+n[o].valuationUnitName+"</section><section><span>交期：</span>"+n[o].expectedDelivery+"</section></li>";for(var i=0;i<n[o].poSubLineInfo.length;i++)t+=' <li class="response"><section><span>数量：</span><em>'+n[o].poSubLineInfo[i].vPurchaseQty+"</em>"+n[o].poSubLineInfo[i].purchaseUnit+"/<em>"+n[o].poSubLineInfo[i].vValuationQty+"</em>"+n[o].poSubLineInfo[i].valuationUnit+"</section><section><span>交期：</span><em>"+n[o].poSubLineInfo[i].vExpectedDelivery+"</em></section></li>";4==a.status&&(t+=" <li><span>累计发货：</span><p>"+n[o].deliveryValuationQty+" "+n[o].valuationUnitName+"</p></li>  <li><span>累计签收：</span><p>"+n[o].receiveValuationQty+" "+n[o].valuationUnitName+"</p></li>  <li><span>累计退货：</span><p>"+n[o].returnValuationQty+" "+n[o].valuationUnitName+"</p></li>"),t+='		<li><span class="price">单价：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?n[o].taxPrice:n[o].price)+"/"+n[o].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[o].remark+'</p></li>		<li class="files"><span>附件：</span></li>'+(1===a.orderInfo.isContainTax?'<li class="subtotal" data-total="'+n[o].taxLineTotal+'" data-vTotal="'+(""!=n[o].vTaxLineTotal?n[o].vTaxLineTotal:n[o].taxLineTotal)+'"><span>含税小计：</span><b>&yen; '+formatMoney(n[o].taxLineTotal)+"</b></li>":'<li class="subtotal" data-total="'+n[o].lineAmount+'" data-vTotal="'+(""!=n[o].vLineAmount?n[o].vLineAmount:n[o].lineAmount)+'"><span>无税小计：</span><b>&yen; '+formatMoney(n[o].lineAmount)+"</b></li>")+(3==a.status?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+formatMoney(n[o].vTaxLineTotal)+"</li>":"")+"	</ul></div>",a.totals+=parseInt(n[o].taxLineTotal,10)}a.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+e.errorMsg+"</p>")}}),t},otherCostList:function(){var a=this,t="",e=0,n=0,o=!1;return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poId":"'+_vParams.poId+'","companyId":"'+_vParams.companyId+'","commonParam":'+a.commonParam+',"serviceId":"B03_findPoOtherCostList",'+a.tokens+"}"},success:function(s){if(s=s||{},s.success){var i=s.poOtherCostList;t='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var r=0,l=i.length;l>r;r++)t+="<li><span>"+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+"</b></li>",e+=parseInt(i[r].costAmount,10),n+=parseInt(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount,10),""!=i[r].vCostAmount&&(o=!0);t+='<li id="othersCostSubtotal" class="subtotal" data-total="'+e+'" data-vTotal="'+(o?n:e)+'"><span>小计：</span><b>&yen; '+formatMoney(e)+"</b></li>",o&&3==a.status&&(t+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+formatMoney(n)+"</li>"),t+="</ul></div>",a.totals+=parseInt(e,10)}}}),t},reCostTotalFn:function(){var a=0;return container.find(".subtotal").each(function(){a+=parseInt($(this).attr("data-vtotal"),10)}),a},payInfo:function(a){var t=this,e=t.orderInfo;requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(t.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(t.invoiceType=a.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+e.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(t.logisticsType,e.logisticsType)+("3"==e.logisticsType?"（自提点："+e.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+e.address+"；"+(""==e.mobile?"":"<br>电话："+e.mobile)+"</p></li><li><span>付款条件：</span><p>"+e.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(t.invoiceType,e.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+e.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+e.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return n},remark:function(a){for(var t=this,e='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+t.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+t.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<t._files.length;n++)e+='<p><a href="'+t._files[n].fileUrl+'"><i class=i-'+(_reg.test(t._files[n].fileName)?"image":"word")+"></i>"+t._files[n].fileName+"</a></p>";return e+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},popup:function(a,t,e,n,o){new Popup({type:a,title:t,content:e,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:o})},start:function(){var a=this;$("#orderBaseInfo").html(a.orderBaseInfo()),$("#prodListsInfo").html(a.prodsInfo()),$("#otherCost").html(a.otherCostList()),a.fileList(),$(".item-total").html("订单总金额：&yen; "+formatMoney(a.totals)).show(),3==a.status&&$(".item-total-dj").html("供应商答交总计：&yen; "+formatMoney(a.reCostTotalFn())).show(),a.load&&(2==a.status?bottomBar(["share"],a.memberId,"","提醒答交","取消订单"):3==a.status?((3==a.vStatus||4==a.vStatus||5==a.vStatus)&&bottomBar(["share"],a.memberId,"","确认答交","取消订单"),7==a.vStatus&&bottomBar(["share"],a.memberId,"","取消订单")):4==a.status&&bottomBar(["share"],a.memberId,"","我要收货")),container.on("click","a.item-link",function(){var t=$(this),e=t.attr("name"),n=$body.scrollTop();switch(e){case"payInfo":orderReviseInfoCon.html(a.payInfo(n));break;case"remark":orderReviseInfoCon.html(a.remark(n))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),t=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn-confirm",function(){return 1==a.status&&a.submitFn("B03_submitPurchaseOrder",function(){}),2==a.status?(a.submitFn("B03_poRemindAnswer",function(){a.popup("alert","","提醒成功")}),!1):3==a.status?7==a.vStatus?!1:!1:4==a.status?!1:void 0}),$body.on("click",".bottom-btn-cancel",function(){a.popup("confirm","","确定要取消订单吗？",function(){},function(){return 1==a.status?(a.submitFn("B03_cancelPurchaseOrder",function(){a.popup("alert","","订单取消成功",function(){})}),!1):2==a.status?!1:void 0})})},submitFn:function(a,t){var e=this;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{ "+e.tokens+', "serviceId":"'+a+'", "poId":"'+_vParams.poId+'", "companyId":'+_vParams.companyId+', "commonParam":'+e.commonParam+" }"},success:function(a){a=a||{},a.success?t&&t():fnTip.error(2e3)}})}};