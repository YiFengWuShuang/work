var _vParams=JSON.parse(decodeURI(getQueryString("param"))),OrdersMt=function(){this.init()};OrdersMt.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.start()},orderBaseInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{ "serviceId":"B03_getPurchaseOrderAnswerInfo", '+a.tokens+', "poAnswerId":"'+_vParams.poAnswerId+'", "vendorId":"'+_vParams.vendorId+'", "commonParam":'+a.commonParam+" }"},success:function(a){if(a=a||{},a.success){var c=a.poAnswerOrderInfo;e+='<div id="orderBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>客户单号：</span><b>'+c.poInsideNo+"</b></li>		<li><span>客户：</span>"+c.companyName+'</li>		<li><span>交易币种：</span><em id="currencyId">'+c.currencyName+'</em></li>		<li><span>交易税种：</span><em id="currTax" class="currTax" data-taxId="'+c.taxId+'">'+c.taxName+"</em>"+("1"==c.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+c.taxRate+"%</label>":"")+'</li>		<li><span>采购日期：</span><em id="poFormDate">'+c.poFormDate+'</li>	</ul></div></div><div class="m-item">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label">交易币种：</span>			<div id="currency" class="c-cont" data-pCurrencyCode="'+c.pCurrencyCode+'">				<p class="c-txt">--</p>				<div class="curSelect"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">交易税种：</span>			<div class="c-cont">				<div id="taxType" class="select3-input" data-isContainTax="'+c.isContainTax+'" data-taxRate="'+c.taxRate+'"></div>				<p>'+("1"==c.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+c.taxRate+"%</label>":"")+'</p>			</div>			</section>		<section class="clearfix">			<span class="c-label">订单日期：</span>			<div class="c-cont">				<p class="c-txt">'+c.poFormDate+"</p>			</div>		</section>	</div></div>",setTimeout(function(){fnTip.hideLoading()},0)}}}),e},initSelect3:function(a,e,c){$(a).select3({allowClear:!0,items:e,placeholder:"请选择",showSearchInputInDropdown:!1,value:c})},currencyType:function(){var a=this,e=$("#currency"),c=e.attr("data-pCurrencyCode");$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"companyId":"'+_vParams.companyId+'","currencyCodeP":"'+c+'",'+a.tokens+',"serviceId":"B01_getCompCurrencyByPCurrency"}'},success:function(c){if(c=c||{},c.success){var s=c.currencyInfo;e.find(".c-txt").html(""==s.currencyName?'<p class="c-txt">'+s.currencyNameP+"</p>":'<p class="c-txt">'+s.currencyName+"</p>"),s.isBase&&""!=s.isBase||e.find(".curSelect").html("<span>本位币："+a.benweibi(s.id).baseCurrencyName+"</span><span>汇率："+a.benweibi(s.id).exchangeRate+"</span>").show()}}})},taxTypeSelect3:function(){var a=this,e=[],c="",s=$("#currTax").attr("data-taxId");$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_getTaxByCustomerTax",'+a.tokens+',"commonParam":'+a.commonParam+',"companyId":"'+_vParams.companyId+'","customerId":"'+_vParams.customerId+'","cTaxId":"'+s+'"}'},success:function(a){a=a||{},a.success&&(c=a.taxName)}}),$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{ "serviceId":"B01_findTaxList", '+a.tokens+', "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(s){if(s=s||{},s.success){for(var t=s.taxList,n=t.length,r=$("#taxType").attr("data-isContainTax"),i=$("#taxType").attr("data-taxRate"),o=0;n>o;o++)"1"==r?t[o].isContainTax==r&&t[o].taxRate==i&&e.push(t[o].taxName):t[o].isContainTax==r&&e.push(t[o].taxName);a.initSelect3("#taxType",e,c)}}})},benweibi:function(a){var e=this,c="",s=$("#poFormDate").html();return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_getExchangeRateByCurrency","companyId":"'+_vParams.companyId+'",'+e.tokens+',"commonParam":'+e.commonParam+',"currencyId":'+a+',"rateDate":'+(new Date).getTime(s)+"}"},success:function(a){a=a||{},a.success&&(c=a)}}),c},start:function(){var a=this;$("#btnSaveOrder").before(a.orderBaseInfo()),a.currencyType(),a.taxTypeSelect3(),$("#btnSaveOrder a").on("click",function(){a.submitFn()})},submitFn:function(){var a=$("#taxType").select3("value"),e=[];e[0]={taxName:a},$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"poAnswerOrderInfo":'+JSON.stringify(e)+',"serviceId":"B03_poAnswerToSalesOrder"}'},success:function(a){a=a||{},a.success&&fnTip.success(2e3)}})}};