var formTip='<div id="formTip" class="formTip"></div>',_vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,orderRevise=function(){this.init()};orderRevise.prototype={init:function(){var a=this;a.orderInfo,a._lineLists=[],a._othersCost=[],a.totals=0,a.load=!1,a.memberId="",a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(a.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(a.invoiceType=e.dataSet.data.detail)}),a.start()},orderBaseInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.vendorId+","+a.tokens+',"serviceId":"B03_getPurchaseOrderAnswerInfo", "commonParam":'+a.commonParam+"}"},success:function(s){s=s||{},s.success&&(a.orderInfo=s.poAnswerOrderInfo,a.memberId=a.orderInfo.auditid,e+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>销售单号：</span><b>"+a.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+a.orderInfo.companyName+"</li>		<li><span>交易货币：</span>"+a.orderInfo.currencyName+'</li>		<li id="taxName"><span>交易税种：</span><em>'+a.orderInfo.taxName+"</em>"+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>订单日期：</span>"+a.orderInfo.poFormDate+'</li>	</ul> <span name="headInfos" class="edit"></span></div>',$("#j-logisticsType").val(a.orderInfo.logisticsType),$("#j-dealType").val(a.orderInfo.conditionName),$("#j-checkoutType").val(a.orderInfo.payWayName))}}),e},fileList:function(){var a=this;a.load&&$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"companyId":'+_vParams.companyId+',"id":'+a.orderInfo.id+',"docType":"12",'+a.tokens+',"serviceId":"B01_findFileList", "commonParam":'+a.commonParam+',"fileSource":"1","searchType":"2"}'},success:function(e){if(e=e||{},e.success)for(var s=e.fileList,t=0,n=s.length;n>t;t++)$(".files").eq(t).html('<span>附件：</span><a href="'+s[t].fileUrl+'"><i class=i-'+(_reg.test(s[t].fileName)?"image":"word")+"></i>"+s[t].fileName+"</a>").show();a._files=s}})},prodAnswerInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.vendorId+","+a.tokens+',"serviceId":"B03_findPoAnswerLineList", "commonParam":'+a.commonParam+"}"},success:function(s){if(s=s||{},s.success){var t=s.poLineList;a._lineLists=t,e='<h2 class="m-title">产品信息</h2>';for(var n=0,i=t.length;i>n;n++){e+='<div class="item-wrap" data-index="'+n+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+t[n].prodCode+'</b></li>		<li class="prodDetail"><span>物料详细：</span><p><em>'+t[n].prodName+"</em><em>"+t[n].prodScale+"</em></p></li>		<li><section><span>数量：</span><em>"+t[n].purchaseQty+"</em>"+t[n].purchaseUnitName+"/<em>"+t[n].valuationQty+"</em>"+t[n].valuationUnitName+"</section><section><span>交期：</span><em>"+t[n].expectedDelivery+"</em></section></li>";for(var o=0;o<t[n].poSubLineList.length;o++)e+='<li class="response"><section><span>数量：</span><em>'+t[n].poSubLineList[o].purchaseQty+'</em><em class="unit">'+t[n].purchaseUnitName+"</em>/<em>"+t[n].poSubLineList[o].valuationQty+'</em><em class="unit">'+t[n].valuationUnitName+"</em></section><section><span>交期：</span><em>"+t[n].poSubLineList[o].expectedDelivery+"</em></section></li>";e+='		<li class="price"><span>单价：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?t[n].taxPrice:t[n].price)+"/"+t[n].valuationUnitName+"</li>		<li><span>备注：</span><p>"+t[n].remark+'</p></li>		<li class="files"><span>附件：</span></li>'+(1===a.orderInfo.isContainTax?'<li class="subtotal" data-total="'+t[n].taxLineTotal+'" data-vTotal="'+(t[n].poSubLineList.length>0?t[n].vTaxLineTotal:t[n].taxLineTotal)+'"><span>小计：</span><b>&yen; '+formatMoney(t[n].taxLineTotal)+"</b></li>":'<li class="subtotal" data-total="'+t[n].lineAmount+'" data-vTotal="'+(t[n].poSubLineList.length>0?t[n].vLineAmount:t[n].lineAmount)+'"><span>小计：</span><b>&yen; '+formatMoney(t[n].lineAmount)+"</b></li>")+(t[n].poSubLineList.length>0?'<li class="responseTotal"><span>答交金额：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?t[n].vTaxLineTotal:t[n].vLineAmount)+"</li>":"")+'	</ul>  <span name="bodyInfos" class="edit"></span></div>',a.totals+=parseInt(t[n].taxLineTotal,10)}a.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+s.errorMsg+"</p>")}}),e},othersCost:function(){var a=this,e="",s=0,t=0,n=!1;if(a.load)return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.vendorId+","+a.tokens+',"serviceId":"B03_findPoAnswerOtherCostList", "commonParam":'+a.commonParam+"}"},success:function(i){if(i=i||{},i.success){var o=i.poOthreCostList;a._othersCost=o,e='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var c=0,r=o.length;r>c;c++)e+='<li class="costName" data-costName="'+o[c].costName+'" data-costAmount="'+o[c].costAmount+'" data-vCostAmount="'+o[c].vCostAmount+'"><span>'+o[c].costName+"：</span><b>&yen; "+formatMoney(o[c].costAmount)+'</b><b class="dj"><em class="money" data-money="'+(""==o[c].vCostAmount?o[c].costAmount:o[c].vCostAmount)+'">'+(""==o[c].vCostAmount?"":formatMoney(o[c].vCostAmount))+"</em></b></li>",s+=parseInt(o[c].costAmount,10),t+=parseInt(""==o[c].vCostAmount?o[c].costAmount:o[c].vCostAmount,10),""!=o[c].vCostAmount&&(n=!0);e+='<li id="othersCostSubtotal" class="subtotal" data-total="'+s+'" data-vTotal="'+(n?t:s)+'"><span>小计：</span><b>&yen; '+formatMoney(s)+"</b></li>",n&&(e+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+formatMoney(t)+"</li>"),e+="</ul>",e+='<span name="otherCostInfos" class="edit editOther"></span>',e+="</div>",a.totals+=parseInt(s,10)}}}),e},reQtys:function(a){var e=0;return a.find(".int02").each(function(){var a=$(this);e+=parseInt(a.val(),10)}),e},reCostTotalFn:function(){var a=0;return $(".contarin").find(".subtotal").each(function(){a+=parseInt($(this).attr("data-vtotal"),10)}),a},start:function(){var a=this,e=document.getElementById("orderAnswerInfo"),s=document.getElementById("prodAnswerInfo"),t=document.getElementById("othersCost");e&&(e.innerHTML=a.orderBaseInfo()),s&&(s.innerHTML=a.prodAnswerInfo(),a.fileList()),t&&(t.innerHTML=a.othersCost()),$(".item-total").html("总金额：&yen;"+formatMoney(a.totals)).show(),$(".item-total-dj").html("答交总金额：&yen;"+formatMoney(a.reCostTotalFn())).show(),a.load&&bottomBar(["share"],a.memberId),container.on("click","span.edit, a.item-link",function(){var e=$(this),s=(e.parents(".item-wrap"),e.attr("name")),t=$body.scrollTop();switch(s){case"headInfos":orderReviseInfoCon.html(a.editHeadInfo(t)),setTimeout(function(){a.currencyType(),a.taxTypeSelect3()},300);break;case"bodyInfos":var n=e.parent(".item-wrap").attr("data-index");orderReviseInfoCon.html(a.editBodyInfo(n,t)),setTimeout(function(){a.units(n),a.editProdCode()},300);break;case"otherCostInfos":orderReviseInfoCon.html(a.editOthersCost(t));break;case"payInfo":orderReviseInfoCon.html(a.editPayInfo(t)),setTimeout(function(){a.conditionSelect(),a.LogisticalSelect(),a.address(),a.payWaySelect()},300);break;case"remark":orderReviseInfoCon.html(a.editRemark(t))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this);if(e.is("#saveHeadInfo")&&$("#taxName em").html($("#taxType").select3("value")),e.is("#saveBodyInfo")){var s=e.attr("data-index"),t=$(".hideItemCon").find(".wfItem"),n=$("#prodAnswerInfo").find(".item-wrap").eq(s);n.find(".prodCode").find("b").html(t.find("p").eq(0).html()),n.find(".prodDetail").find("p").html(t.find("p").eq(1).html()),$(".hideItemCon").find(".select3-input").forEach(function(a,e){n.find("em.unit").eq(e).html($(a).select3("value"))})}if(e.is("#saveOthersCost")){var i=$(".hideItemCon").find(".costName"),o=$(".showItemCon").find(".costName");i.forEach(function(a,e){var s=a.value.replace(new RegExp(/(:)/g),"");s=s.replace(new RegExp(/(：)/g),""),o.eq(e).find("span").eq(0).html(s+"："),o.eq(e).attr("data-costname",s)})}e.is("#savePayInfo")&&($("#j-logisticsType").val(reEnumFn(a.logisticsType,$("#logisticsType").select3("value"))),$("#j-dealType").val($("#dealType").select3("value")),$("#j-checkoutType").val($("#checkoutType").select3("value")));var c=e.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(c)},200)}),$body.on("click",".bottom-btn-confirm",function(){a.submitFn()})},initSelect3:function(a,e,s){$(a).select3({allowClear:!0,items:e,placeholder:"请选择",showSearchInputInDropdown:!1,value:s})},editHeadInfo:function(a){var e=this,s="";return s+='<div id="reviseBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>客户单号：</span><b>'+e.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+e.orderInfo.companyName+'</li>		<li><span>交易币种：</span><em id="currencyId">'+e.orderInfo.currencyName+'</em></li>		<li><span>交易税种：</span><em id="currTax" class="currTax" data-taxId="'+e.orderInfo.taxId+'">'+e.orderInfo.taxName+"</em>"+("1"==e.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+e.orderInfo.taxRate+"%</label>":"")+'</li>		<li><span>采购日期：</span><em id="poFormDate">'+e.orderInfo.poFormDate+'</li>	</ul></div></div><div class="m-item">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label">交易币种：</span>			<div id="currency" class="c-cont" data-pCurrencyCode="'+e.orderInfo.pCurrencyCode+'">				<p class="c-txt">--</p>				<div class="curSelect"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">交易税种：</span>			<div class="c-cont">				<div id="taxType" class="select3-input" data-taxName="'+e.orderInfo.taxName+'" data-isContainTax="'+e.orderInfo.isContainTax+'" data-taxRate="'+e.orderInfo.taxRate+'"></div>				<p>'+("1"==e.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+e.orderInfo.taxRate+"%</label>":"")+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">订单日期：</span>			<div class="c-cont">				<p class="c-txt">'+e.orderInfo.poFormDate+'</p>			</div>		</section>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveHeadInfo" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},currencyType:function(){var a=this,e=$("#currency"),s=e.attr("data-pCurrencyCode");$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"companyId":'+_vParams.companyId+',"currencyCodeP":"'+s+'",'+a.tokens+',"serviceId":"B01_getCompCurrencyByPCurrency", "commonParam":'+a.commonParam+"}"},success:function(s){if(s=s||{},s.success){var t=s.currencyInfo;e.find(".c-txt").html(""==t.currencyName?'<p class="c-txt">'+t.currencyNameP+"</p>":'<p class="c-txt">'+t.currencyName+"</p>"),t.isBase&&""!=t.isBase||e.find(".curSelect").html("<span>本位币："+a.benweibi(t.id).baseCurrencyName+"</span><span>汇率："+a.benweibi(t.id).exchangeRate+"</span>").show()}}})},taxTypeSelect3:function(){var a=this,e=[],s="",t=$("#currTax").attr("data-taxId"),n=$("#jyCurrVal").attr("data-id");$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_getTaxByCustomerTax",'+a.tokens+',"commonParam":'+a.commonParam+',"companyId":'+_vParams.companyId+',"customerId":"'+n+'","cTaxId":"'+t+'"}'},success:function(a){a=a||{},a.success&&(s=a.taxName)}}),$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{ "serviceId":"B01_findTaxList", '+a.tokens+', "companyId":'+_vParams.companyId+', "commonParam":'+a.commonParam+" }"},success:function(t){if(t=t||{},t.success){for(var n=t.taxList,i=n.length,o=$("#taxType"),c=o.attr("data-taxName"),r=o.attr("data-isContainTax"),d=o.attr("data-taxRate"),l=0;i>l;l++)"1"==r?n[l].isContainTax==r&&n[l].taxRate==d&&e.push(n[l].taxName):n[l].isContainTax==r&&e.push(n[l].taxName);(""==s||void 0==s)&&(s=c),a.initSelect3("#taxType",e,s)}}})},benweibi:function(a){var e=this,s="",t=$("#poFormDate").html();return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_getExchangeRateByCurrency","companyId":'+_vParams.companyId+","+e.tokens+',"commonParam":'+e.commonParam+',"currencyId":"'+a+'","rateDate":"'+(new Date).getTime(t)+'"}'},success:function(a){a=a||{},a.success&&(s=a)}}),s},editBodyInfo:function(a,e){var s=this,t="",n=s._lineLists[a],i=n.poSubLineList.length;t+='<div class="m-item">	<h2 class="m-title">产品信息</h2>	<div class="item-wrap">		<ul>			<li><span>物料编码：</span>'+n.prodCode+"</li>			<li><span>物料详细：</span><p><em>"+n.prodName+"</em><em>"+n.prodScale+"</em></p></li>			<li><section><span>数量：</span>"+n.purchaseQty+n.purchaseUnitName+"/"+n.valuationQty+n.valuationUnitName+"</section><section><span>交期：</span>"+n.expectedDelivery+"</section></li>";for(var o=0;i>o;o++){var c=n.poSubLineList[o];t+='<li class="response"><section><span>数量：</span>'+c.purchaseQty+n.purchaseUnitName+"/"+c.valuationQty+n.valuationUnitName+"</section><section><span>交期：</span>"+c.expectedDelivery+"</section></li>"}t+='			<li><span class="price">单价：</span>&yen; '+formatMoney(n.taxPrice)+"/"+n.valuationUnitName+"</li>			<li><span>备注：</span><p>"+n.remark+'</p></li>		</ul>	</div></div><div class="m-item m-item-units">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label"><b>我方编码：</b></span>			<div class="wfItem">				<p>'+n.vProdCode+"</p>				<p>"+n.vProdName+" "+n.vProdScale+'</p>			</div>			<div class="itemEdit">				<input type="text" class="int-search" placeholder="请输入我方编码" />				<div class="btns"><a class="btn-cancel">取消</a><a class="btn-save">确定</a></div>			</div>		</section>';for(var r=0;i>r;r++){var d=n.poSubLineList[r];t+='<section class="m-select clearfix">	<span class="c-label"><b>数量：</b></span>	<div class="c-cont">		<div class="c-cont-item">			<span>'+d.purchaseQty+'</span>			<div id="purchaseQty_'+r+'" class="select3-input" data-index="0"></div>		</div>		<div class="c-cont-item">			<span>'+d.valuationQty+'</span>			<div id="valuationQty_'+r+'" class="select3-input" data-index="1"></div>		</div>	</div></section>'}return t+='<span class="edit poBodyEdit"></span></div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+e+'" data-index="'+a+'">完成</a></div>'},units:function(a){var e=this,s=[],t=[];$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_findProdUnitListByProd","companyId":'+_vParams.companyId+',"prodId":"'+e._lineLists[a].prodId+'",'+e.tokens+',"commonParam":'+e.commonParam+"}"},success:function(n){if(n=n||{},n.success)for(var i=n.prodUnitList,o=0,c=i.length;c>o;o++)s.push(i[o].prodUnitName),t.push(i[o].basicUnitName);else s.push(e._lineLists[a].purchaseUnitName),t.push(e._lineLists[a].valuationUnitName)}});for(var n=$(".m-select").length,i=0;n>i;i++)e.initSelect3("#purchaseQty_"+i,s,e._lineLists[a].purchaseUnitName),e.initSelect3("#valuationQty_"+i,t,e._lineLists[a].valuationUnitName);var o=$(".m-item-units").find(".m-select");o.find(".select3-input").change(function(){var a=$(this),e=a.attr("data-index"),s=a.select3("value");a.parents(".m-item-units").find(".select3-input").forEach(function(a){$(a).attr("data-index")==e&&$(a).find(".select3-single-selected-item").attr("data-item-id",s).text(s)})})},editProdCode:function(){function a(a){var e=a.parents(".item-wrap");e.find(".wfItem").show(),e.find(".itemEdit").hide(),e.find(".edit").show(),$("#formTip").remove()}var e=this;container.on("click",".poBodyEdit",function(){var a=$(this),e=a.parent(".item-wrap");a.hide(),e.find(".wfItem").hide(),e.find(".itemEdit").show(),$body.append(formTip)}).on("click",".btn-save",function(){var s=$(this),t=s.parents(".itemEdit").find(".int-search").val();$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"serviceId": "B01_getProdInfoByCode","companyId":"'+_vParams.companyId+'","vendorId":"'+_vParams.vendorId+'","prodCode":"'+t+'","commonParam":'+e.commonParam+","+e.tokens+"}"},success:function(e){if(e=e||{},e.success){var n=e.prodInfo;if(void 0==n)return $("#formTip").html("产品编码错误，请重新输入").addClass("formTipShow"),!1;t==n.prodCode&&(s.parents(".item-wrap").find(".wfItem").html(n.prodCode+"<p>"+n.prodName+" "+n.prodScale+"</p>"),a(s))}}})}).on("click",".btn-cancel",function(){var e=$(this);a(e)})},editOthersCost:function(a){var e=this,s=e._othersCost,t=s.length,n=$(".showItemCon").find(".costName"),i='<div class="m-item"><h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';if(0==t)i+="<li>无其他费用</li>";else for(var o=0;t>o;o++)i+='<li data-money="'+(""!=s[o].vCostAmount?s[o].vCostAmount:s[o].costAmount)+'"><span>'+n.eq(o).attr("data-costName")+"：</span><b>&yen; "+formatMoney(s[o].costAmount)+"</b>"+(""!=s[o].vCostAmount?'<b class="dj">&yen; <em class="money">'+formatMoney(s[o].vCostAmount)+"</em></b>":"")+"</li>";if(i+="</ul></div></div>",i+='<div class="m-item"><h2 class="m-title">订单其他费用维护</h2><div class="item-wrap">',0==t)i+="<p>无其他费用</p>";else for(var c=0;t>c;c++)i+='<section class="m-select clearfix">	<div class="c-cont c-cont2">		<input type="text" class="costName" value="'+n.eq(c).attr("data-costName")+'">		<p class="fy'+(""!=s[c].vCostAmount?" djfy":"")+'">&yen;'+formatMoney(""!=s[c].vCostAmount?s[c].vCostAmount:s[c].costAmount)+"</p>	</div></section>";return i+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveOthersCost" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},editPayInfo:function(a){var e=this,s=e.orderInfo;return html='<div id="payInfoList" class="m-item">	<div class="item-wrap">		<ul>			<li><span>交易条件：</span><p id="jyCurrVal" data-conditionId="'+s.conditionId+'" data-id="'+s.id+'">'+s.conditionName+'</p></li>			<li><span>物流方式：</span><p><em id="logisticsVal">'+enumFn(e.logisticsType,s.logisticsType)+"</em>"+("3"==s.logisticsType?"（自提点："+s.address+"）":"")+"</p></li>			<li><span>收货地址：</span><p>"+s.address+(""==s.mobile?"":"<br>电话："+s.mobile)+'</p></li>			<li><span>付款条件：</span><p id="payWayName" data-payWayId="'+s.payWayId+'">'+s.payWayName+"</p></li>			<li><span>发票类型：</span><p>"+enumFn(e.invoiceType,s.invoiceType)+"</p></li>			<li><span>发票抬头：</span><p>"+s.invoiceHeader+"</p></li>			<li><span>发票类容：</span><p>"+s.invoiceContent+'</p></li>		</ul>	</div></div><div id="rePayInfoList" class="m-item">	<div class="item-wrap">		<section class="m-select clearfix">			<span class="c-label">交易条件：</span>			<div class="c-cont">				<div id="dealType" class="select3-input"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">物流方式：</span>			<div class="c-cont">				<div id="logisticsType" class="select3-input"></div>			</div>		</section>		<section id="address" class="clearfix" data-id="'+s.id+'" data-addressId="'+s.addressId+'">			<span class="c-label">收货地址：</span>			<div class="c-cont">				<p class="c-txt">'+s.address+(""==s.mobile?"":"<br>电话："+s.mobile)+'</p>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">收款条件：</span>			<div class="c-cont">				<div id="checkoutType" class="select3-input"></div>			</div>		</section>		<section class="clearfix">			<span class="c-label">发票类型：</span>			<div class="c-cont">				<p class="c-txt">'+enumFn(e.invoiceType,s.invoiceType)+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">开票抬头：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoiceHeader+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">发票内容：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoiceContent+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">纳税人识别码：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoicePayMark+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">发票电话：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoiceTel+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">发票开户行：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoiceBank+'</p>			</div>		</section>		<section class="clearfix">			<span class="c-label">发票账号：</span>			<div class="c-cont">				<p class="c-txt">'+s.invoiceAccount+'</p>			</div>		</section>	</div></div><div class="btn-wrap"><a href="javascript:;" id="savePayInfo" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},conditionSelect:function(){var a=this,e=[],s="",t=$("#jyCurrVal"),n=t.attr("data-conditionId"),i=t.attr("data-id");$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"companyId":"'+_vParams.companyId+'","serviceId":"B01_getConditionByCustomerCondition",'+a.tokens+',"commonParam":'+a.commonParam+',"customerId":"'+i+'","cConditionId":"'+n+'"}'},success:function(a){if(a=a||{},a.success){if(""==a.conditionName||void 0==a.conditionName)return s=t.html(),!1;s=a.conditionName}else s=t.html()}}),$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_findCompanyConditionList",'+a.tokens+',"companyId":'+_vParams.companyId+',"conditionType":"2"}'},success:function(t){if(t=t||{},t.success){if(0==t.conditionList.length)return e.push(s),a.initSelect3("#dealType",e,s),!1;for(var n=t.conditionList,i=n.length,o=0;i>o;o++)e.push(n[o].conditionName);a.initSelect3("#dealType",e,s)}}})},LogisticalSelect:function(){var a=this,e=[];a.logisticsType.forEach(function(a){e.push(a.Value)});var s=$("#logisticsVal").html();a.initSelect3("#logisticsType",e,s)},address:function(){var a=this,e=$("#address"),s=e.attr("data-id"),t=e.attr("data-addressId");$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"type":"1","companyId":"'+_vParams.companyId+'","customerId":"'+s+'","cAddressId":"'+t+'",'+a.tokens+',"serviceId":"B01_getAddrInfoByCustomerAddrId"}'},success:function(a){if(a=a||{},a.success){var s=a.customerAddress;""!=s&&e.html('<span class="c-label">收货地址：</span><div class="c-cont"><p class="c-txt">'+s.address+"；<br>电话："+s.mobile+"</p></div>")}}})},payWaySelect:function(){var a=this,e=[],s="",t=$("#jyCurrVal").attr("data-id"),n=$("#payWayName").attr("data-payWayId");$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_getPayWayByCustomerPayWay","commonParam":'+a.commonParam+',"companyId":"'+_vParams.companyId+'","customerId":"'+t+'","cPayWayId":"'+n+'"}'},success:function(a){a=a||{},a.success&&(s=a.payWapName)}}),$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"serviceId": "B01_findCompanyPayWayList","commonParam": '+a.commonParam+","+a.tokens+',"companyId":"'+_vParams.companyId+'","payWayType":"1"}'},success:function(t){if(t=t||{},t.success){for(var n=t.payWayList,i=n.length,o=0;i>o;o++)e.push(n[o].payWayName);a.initSelect3("#checkoutType",e,s)}}})},editRemark:function(a){for(var e=this,s='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',t=0;t<e._files.length;t++)s+='<p><a href="'+e._files[t].fileUrl+'"><i class=i-'+(_reg.test(e._files[t].fileName)?"image":"word")+"></i>"+e._files[t].fileName+"</a></p>";return s+='</div><div id="remarks" class="item-wrap taRemarks">	<h2>我方备注：</h2>	<p>'+e.orderInfo.vRemark+'</p></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},submitFn:function(){var a,e,s=this,t=[],n=[],i=$("#taxName").find("em").html();e={taxName:i,logisticsType:$("#j-logisticsType").val(),conditionName:$("#j-dealType").val(),payWayName:$("#j-checkoutType").val(),poAnswerId:s.orderInfo.id.toString(),vendorId:s.orderInfo.vendorId.toString()};for(var o=$("#prodAnswerInfo").find(".item-wrap"),c=o.length,r=0;c>r;r++){var d=o.eq(r).find(".prodCode").eq(0),l=o.eq(r).find(".prodDetail").eq(0),p=o.eq(r).find(".response").eq(0),m=p.find("em.unit");t[r]={vProdCode:d.find("b").html(),vProdName:l.find("em").eq(0).html(),vProdDesc:l.find("em").eq(1).html(),salesUnitName:m.eq(0).html(),valuationUnitName:m.eq(1).html()}}for(var v=$("#othersCost").find(".costName"),u=v.length,f=0;u>f;f++)n[f]={costName:v.eq(f).attr("data-costname")};a={serviceId:"B03_poAnswerToSalesOrder",baseInfo:e,prodDetailList:t,otherCostList:n,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber},console.log(JSON.stringify(a)),$.ajax({type:"POST",url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):fnTip.error(2e3)}})}};