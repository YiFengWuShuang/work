var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),$platformCurrencyList,$currencySymbol,$fileData,orderReviseInfoCon=$("#orderReviseInfoCon"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,salesDetail=function(){this.init()};salesDetail.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(a.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(a.invoiceType=e.dataSet.data.detail)}),requestFn("B02_Invoice",function(e){"0"==e.errorCode&&(a.invoiceInfoName=e.dataSet.data.detail)}),a.orderBaseInfo(),a.prodsInfo(),a.otherCostList(),a.start()},orderBaseInfo:function(){var a=this,e="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getSalesOrderInfo", "id":"'+_vParams.id+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(o){if(o=o||{},o.success){a.orderInfo=o.salesOrderInfo,a.status=a.orderInfo.status,a.memberId=a.orderInfo.modibyid,e+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>采购单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.soInsideNo+"</b></li>		<li><span>销售日期：</span>"+transDate(a.orderInfo.soFormDate)+"</li>		<li><span>交易币种：</span>"+a.orderInfo.currencyCode+"-"+a.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+a.orderInfo.taxName+'<label class="checkbox'+(1==a.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label></li>		<li><span>交易条件：</span>"+a.orderInfo.conditionName+"</li>		<li><span>收款条件：</span>"+a.orderInfo.payWayName+"</li>		<li><span>业务员：</span>"+a.orderInfo.soManName+"</li>	</ul></div>",$("#orderBaseInfo").html(e);var r={serviceId:"B01_queryAllPlatformCurrency",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",r,function(e){if(e.success){$platformCurrencyList=e;for(var o=0,r=e.platformCurrencyList.length;r>o;o++)if(e.platformCurrencyList[o].currencyCode==a.orderInfo.pCurrencyCode)return $currencySymbol=e.platformCurrencyList[o].currencySymbol,!1}})}}})},prodsInfo:function(){var a=this,e="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findSoLineList", "soId":"'+_vParams.id+'", "companyId":['+Number(_vParams.companyId)+'], "commonParam":'+a.commonParam+" }"},success:function(o){if(o=o||{},o.success){var r=o.prodDetailList;e='<h2 class="m-title">产品明细</h2>';for(var n=0,s=r.length;s>n;n++){var i=!0;r[n].salesUnitName==r[n].valuationUnitName&&(i=!1),e+='<div class="item-wrap">	<ul>		<li><span>客户编码：</span><b>'+r[n].cProdCode+"</b></li>		<li><span>物料详细：</span><p>"+r[n].cProdName+"  "+r[n].cProdScale+"</p></li>		<li><span>本方编码：</span><b>"+r[n].vProdCode+"</b></li>		<li><span>物料详细：</span><p>"+r[n].vProdName+"  "+r[n].vProdScale+"</p></li>		<li><section><span>数量：</span>"+r[n].salesQty+r[n].salesUnitName+(i?"/"+r[n].valuationQty+r[n].valuationUnitName:"")+"</section><section><span>预交期：</span>"+transDate(r[n].expectedDelivery)+'</section></li>		<li><span class="price">单价：</span>'+$currencySymbol+formatMoney(1===a.orderInfo.isContainTax?r[n].taxPrice:r[n].price)+"/"+r[n].valuationUnitName+"</li>		<li><span>客户备注：</span><p>"+r[n].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(r[n].valuationQty*r[n].taxPrice)+"</b></li>	</ul></div>",a.totals+=Number(r[n].taxLineTotal)}a.load=!0,$("#prodListInfo").html(e)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+o.errorMsg+"</p>")}})},otherCostList:function(){var a=this,e="",o=0;$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"soId":"'+_vParams.id+'","companyId":['+Number(_vParams.companyId)+'],"commonParam":'+a.commonParam+',"serviceId":"B03_findSoOtherCostList",'+a.tokens+"}"},success:function(r){if(r=r||{},r.success){var n=r.soOtherCostList;e='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var s=0,i=n.length;i>s;s++)e+="<li><span>"+n[s].costName+"：</span><b>"+$currencySymbol+formatMoney(n[s].costAmount)+"</b></li>",o+=Number(n[s].costAmount);e+='<li class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(a.orderInfo.vOtherCostTotal)+"</b></li>",e+="</ul></div>",a.totals+=Number(o),$("#otherCost").html(e)}}})},start:function(){var a=this;$(".item-total").html("订单总金额："+$currencySymbol+formatMoney(a.orderInfo.vTotalAmount)).show();var e={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:a.orderInfo.companyId,id:a.orderInfo.id,commonParam:commonParam(),docType:"12",fileSource:1,searchType:1};GetAJAXData("POST",e,function(a){a.success&&($fileData=a)}),a.load&&(1==a.status||2==a.status?bottomBar(["share"],a.memberId,"","出货"):bottomBar(["share"],a.memberId,!0)),container.on("click","a.item-link",function(){var e=$(this),o=e.attr("name"),r=$body.scrollTop();switch(o){case"payInfo":orderReviseInfoCon.html(a.payInfo(r));break;case"remark":orderReviseInfoCon.html(a.remark(r))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn-confirm",function(){isAndroidMobileDevice()&&window.WebViewJavascriptBridge?window.WebViewJavascriptBridge.callHandler("goodsDelivery",{param:a.orderInfo.soFormNo},function(){}):setupWebViewJavascriptBridge(function(e){e.callHandler("goodsDelivery",{param:a.orderInfo.soFormNo},function(){})})})},payInfo:function(a){var e=this,o=e.orderInfo,r='<ul class="payInfoList"><li><span>交易条件：</span><p>'+o.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,o.logisticsType)+("3"==o.logisticsType?"（自提点："+o.address+"）":"")+"</p></li><li><span>"+(3==o.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+"</p></li><li><span>付款条件：</span><p>"+o.payWayName+"</p></li>";return r+=1==o.invoice?"<li><span>发票信息：</span><p>"+enumFn(e.invoiceInfoName,o.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(e.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+"</p></li>",r+='</ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},remark:function(a){var e=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return o},popup:function(a,e,o,r,n){new Popup({type:a,title:e,content:o,ok:"确定",cancel:"取消",closeCallBack:r,okCallBack:n})}};