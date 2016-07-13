var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",Lists=function(){this.init()};Lists.prototype={init:function(){var a=this;a._files=[],a._lineLists=[],a._othersCost=[],a.load=!1,setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B03_POCType",function(e){"0"==e.errorCode&&(a.changeType=e.dataSet.data.detail)}),requestFn("B03_POCReasonType",function(e){"0"==e.errorCode&&(a.changeReasons=e.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(a.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(a.invoiceType=e.dataSet.data.detail)}),requestFn("B03_POCNStatus",function(e){"0"==e.errorCode&&(a.POCNStatus=e.dataSet.data.detail)}),requestFn("B02_Invoice",function(e){"0"==e.errorCode&&(a.invoiceInfoName=e.dataSet.data.detail)}),a.start()},orderBaseInfo:function(){var a=this,e="",o={serviceId:"B03_getPocNoticeInfo",companyId:_vParams.companyId,id:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){o=o||{},o.success&&(a.orderInfo=o.pocNoticeInfo,$currencySymbol=a.orderInfo.currencySymbol,$priceDecimalNum=a.orderInfo.priceDecimalNum,$amountDecimalNum=a.orderInfo.amountDecimalNum,e+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>客户采购单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部销售单号：</span><b>"+a.orderInfo.soInsideNo+"</b></li>		<li><span>变更单状态：</span><strong>"+enumFn(a.POCNStatus,a.orderInfo.vStatus)+"</strong></li>		<li><span>变更类型：</span>"+enumFn(a.changeType,a.orderInfo.changeType)+"</li>		<li><span>变更日期：</span>"+transDate(a.orderInfo.pocFormDate)+"</li>		<li><span>变更人：</span>"+a.orderInfo.pocManName+"</li>		<li><span>变更原因：</span>"+enumFn(a.changeReasons,a.orderInfo.changeReason)+"</li>		<li><span>变更备注：</span>"+a.orderInfo.remark+"</li>	</ul></div>")}}),e},prodBodyInfo:function(){var a=this,e="",o={serviceId:"B03_findPocNoticeLineList",companyId:_vParams.companyId,pocId:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var n=o.pocNoticeLineList;a._lineLists=n,e='<h2 class="m-title">采购明细</h2>';for(var t=0,r=n.length;r>t;t++)n[t].unitName=!0,n[t].purchaseUnitName==n[t].valuationUnitName&&(n[t].unitName=!1),e+='<div class="item-wrap" data-index="'+t+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+n[t].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+n[t].prodName+" "+n[t].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+n[t].purchaseQty+n[t].purchaseUnitName+"</em>"+(n[t].unitName?"/<em>"+n[t].valuationQty+n[t].valuationUnitName+"</em>":"")+"</section><section><span>交期：</span><em>"+transDate(n[t].expectedDelivery)+"</em></section></li>		<li><section><span>变更：</span><em"+(n[t].changeQty!=n[t].purchaseQty||n[t].changeValuationQty!=n[t].valuationQty?' class="red"':"")+">"+n[t].changeQty+n[t].purchaseUnitName+"</em>"+(n[t].unitName?"/<em>"+n[t].changeValuationQty+n[t].valuationUnitName+"</em>":"")+"</section><section><span>交期：</span><em"+(n[t].changeExpectedDelivery!=n[t].expectedDelivery?' class="red"':"")+">"+transDate(n[t].changeExpectedDelivery)+'</em></section></li>		<li class="price'+(n[t].changePrice!=n[t].price||n[t].changeTaxPrice!=n[t].taxPrice?" red":"")+'"><span>单价：</span>'+$currencySymbol+(1==a.orderInfo.isContainTax?formatMoney(n[t].changeTaxPrice,$priceDecimalNum):formatMoney(n[t].changePrice,$priceDecimalNum))+"/"+n[t].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[t].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(n[t].taxLineTotal,$amountDecimalNum)+"</b></li>		<li"+(n[t].changeTaxLineTotal!=n[t].taxLineTotal||n[t].changeLineAmount!=n[t].lineAmount?' class="red"':"")+"><span>变更金额：</span><b>"+$currencySymbol+formatMoney(n[t].changeTaxLineTotal,$amountDecimalNum)+"</b></li>	</ul></div>";a.load=!0,$("#prodBodyInfo").html(e)}else container.show().html('<p style="text-align:center;">'+o.errorMsg+"</p>"),fnTip.hideLoading()}})},othersCost:function(){var a=this,e="";if(a.load){var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPocNoticeOtherCostList",companyId:_vParams.companyId,pocId:_vParams.id,commonParam:commonParam()};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var n=o.costList;a._othersCost=n,e='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var t=0,r=n.length;r>t;t++)e+="<li><span>"+n[t].costName+"：</span><b>"+$currencySymbol+formatMoney(n[t].costAmount,$amountDecimalNum)+'</b><b class=""><em class="money">'+formatMoney(n[t].changeCostAmount,$amountDecimalNum)+"</em></b></li>";e+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(a.orderInfo.poOtherCostTotal,$amountDecimalNum)+'</b></li><li id="changeCost"'+(a.orderInfo.otherCostTotal!=a.orderInfo.poOtherCostTotal?' class="red"':"")+"><span>变更费用：</span><b>"+$currencySymbol+formatMoney(a.orderInfo.otherCostTotal,$amountDecimalNum)+"</b></li></ul></div>",$("#othersCost").html(e)}}})}},start:function(){var a=this,e=document.getElementById("orderHeadInfo");e.innerHTML=a.orderBaseInfo(),a.prodBodyInfo(),a.othersCost(),$(".item-total").html("变更前总金额："+$currencySymbol+formatMoney(a.orderInfo.poTotalAmount,$amountDecimalNum)).show(),$(".item-total-dj").html("变更后总金额："+$currencySymbol+formatMoney(a.orderInfo.totalAmount,$amountDecimalNum)).show(),1==a.orderInfo.vStatus?bottomBar(["share"],a.orderInfo.poManId,"","接受变更","拒绝变更"):2==a.orderInfo.vStatus?bottomBar(["share"],a.orderInfo.poManId,"","转销售变更"):bottomBar(["share"],a.orderInfo.poManId,!0),container.on("click","a.item-link",function(){var e=$(this),o=e.attr("name"),n=$body.scrollTop();switch(o){case"baseInfo":orderReviseInfoCon.html(a.baseInfo(n));break;case"payInfo":orderReviseInfoCon.html(a.payInfo(n));break;case"remark":orderReviseInfoCon.html(a.remark(n))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn-confirm",function(){return 1==a.orderInfo.vStatus?void a.receive():2==a.orderInfo.vStatus?void(window.location.href=config.htmlUrl+'customerChange_returnSale.html?param={"id":"'+_vParams.id+'","companyId":"'+_vParams.companyId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}'):void 0}),$body.on("click",".bottom-btn-cancel",function(){a.refuse()})},baseInfo:function(a){var e=this,o=e.orderInfo,n='<div class="item-wrap"><ul>		<li><span>采购日期：</span>'+o.poFormDate+"</li>		<li><span>交易币别：</span>"+o.currencyName+"</li>		<li><span>交易税别：</span>"+o.taxName+'<label class="checkbox'+(1==o.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*o.taxRate+"%</label></li>		<li><span>交易条件：</span>"+o.conditionName+"</li>		<li><span>付款条件：</span>"+o.payWayName+"</li>		<li><span>采购员：</span>"+o.poManName+'</li></ul></div><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">返回</a></div>';return n},payInfo:function(a){var e=this,o=e.orderInfo,n='<div class="item-wrap"><ul><li><span>物流方式：</span><p>'+enumFn(e.logisticsType,o.logisticsType)+"</p></li><li><span>"+(3==o.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+"</p></li>";return n+=1==o.invoice?"<li><span>发票信息：</span><p>"+enumFn(e.invoiceInfoName,o.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(e.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+"</p></li>",n+='</ul></div><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">返回</a></div>'},remark:function(a){var e=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreeMent+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.poRemark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">返回</a></div>';return o},popup:function(a,e,o,n,t){new Popup({type:a,title:e,content:o,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:t})},refuse:function(){var a=this;a.popup("confirm","","您确定要拒绝变更么？<br>拒绝后的变更，将不能恢复。",function(){},function(){var e={serviceId:"B03_refusePocNotice",pocId:_vParams.id,companyId:a.orderInfo.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};GetAJAXData("POST",e,function(a){return a.success?void popup("alert","","拒绝变更成功！返回上一级",function(){},function(){goBack()}):(popup("alert","",a.errorMsg),!1)})})},receive:function(){var a=this;a.popup("confirm","","接受客户订单变更后，请即时更新本方的销售订单信息，并通知相关人员，以免发生交期延误哦！",function(){},function(){var e={serviceId:"B03_acceptPocNotice",pocId:_vParams.id,companyId:a.orderInfo.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};GetAJAXData("POST",e,function(a){return a.success?void popup("alert","","接受变更成功！返回上一级",function(){},function(){goBack()}):(popup("alert","",a.errorMsg),!1)})})}};