var formTip='<div id="formTip" class="formTip"></div>',_vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),orderAnswerCon=$("#orderAnswerInfo"),prodAnswerCon=$("#prodAnswerInfo"),othersCostCon=$("#othersCost"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,$scope={},$currencyData={},$taxData={},$taxListData={},$ExchangeRateData={},$conditionData={},$conditionJson={},$payWayTypeData={},$payWayData={},$logisticsType={},$AddrData={},$fileData={},$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",addval_taxInfo=!1,addval_conditionInfo=!1,addval_paywayInfo=!1,$myRemarkVal="",privateDefultUser,orderRevise=function(){this.init()};orderRevise.prototype={init:function(){var e=this;e.orderInfo,e._othersCost=[],e.totals=0,e.load=!1,e.memberId="",e.commonParam=JSON.stringify(commonParam()),e.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)}),GetUserInfo("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber},function(e){"01230"==e.retCode&&(privateDefultUser=e)}),requestFn("B02_Invoice",function(a){"0"==a.errorCode&&(e.invoiceInfoName=a.dataSet.data.detail)}),e.start()},orderBaseInfo:function(){var e=this,a="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_getPurchaseOrderAnswerInfo", "commonParam":'+e.commonParam+"}"},success:function(o){o=o||{},o.success&&(e.orderInfo=o.poAnswerOrderInfo,e.memberId=e.orderInfo.poManId,a+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>采购单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>客户单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>所属公司：</span>"+e.orderInfo.vendorName+"</li>		<li><span>客户：</span>"+e.orderInfo.companyAbbr+'</li>		<li class="currencyName"><span>交易币别：</span>'+e.orderInfo.currencyName+'</li>		<li id="taxName"><span>交易税别：</span><em>'+e.orderInfo.taxName+'</em><label class="checkbox'+(1==e.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*e.orderInfo.taxRate+"%</label></li>		<li><span>销售日期：</span>"+transDate((new Date).getTime())+'</li>	</ul> <span name="headInfos" class="edit"></span></div>')}}),a},prodAnswerInfo:function(){function e(e){e.vFileList=[],GetAJAXData("POST",{serviceId:"B01_findFileList",docType:24,companyId:_vParams.companyId,searchType:2,id:e.id,token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()},function(a){a.success&&a.fileList.forEach(function(a){e.vFileList.push({id:a.id,fileName:a.fileName,fileSize:a.fileSize,fileUrl:a.fileUrl,lineNo:a.lineNo})})})}var a=this,o="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+a.tokens+',"serviceId":"B03_findPoAnswerLineList", "commonParam":'+a.commonParam+"}"},success:function(n){if(n=n||{},n.success){var t=n.poLineList;o='<h2 class="m-title">产品明细</h2>';for(var i=0,r=t.length;r>i;i++){var s=!0;t[i].vAnswerUnitName==t[i].vValuationUnitName&&(s=!1);var d={};GetAJAXData("POST",{serviceId:"B01_getProdByCustomerProd",customerId:a.orderInfo.companyId,cProdCode:t[i].prodCode,vendorId:a.orderInfo.vendorId,token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()},function(e){e.prodMap?(d.id=e.prodMap.prodId,d.prodCode=e.prodMap.prodCode,d.prodName=e.prodMap.prodName,d.prodScale=e.prodMap.prodScale,d.prodDesc=e.prodMap.prodDesc):(d.id="",d.prodCode="",d.prodName=t[i].prodName,d.prodScale=t[i].prodScale,d.prodDesc=t[i].prodDesc),t[i].vPoInfo=d}),o+='<div class="item-wrap" data-index="'+i+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+t[i].vPoInfo.prodCode+'</b></li>		<li class="prodDetail"><span>物料详细：</span><p>'+t[i].vPoInfo.prodName+" "+t[i].vPoInfo.prodScale+"</p></li>		<li><section><span>数量：</span><em>"+t[i].vPurchaseQty+"</em>"+t[i].vAnswerUnitName+(s?"/<em>"+t[i].vValuationQty+"</em>"+t[i].vValuationUnitName:"")+"</section><section><span>交期：</span><em>"+t[i].expectedDelivery+'</em></section></li>		<li class="price"><span>单价：</span>'+$currencySymbol+formatMoney(1===a.orderInfo.isContainTax?t[i].vTaxPrice:t[i].vPrice)+"/"+t[i].vValuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>含税小计：</span><b>'+$currencySymbol+formatMoney(t[i].vTaxLineTotal)+'</b></li>	</ul>  <span name="bodyInfos" class="edit"></span></div>',e(t[i])}prodAnswerCon.html(o),$scope.poLineList=t,a.load=!0,t.forEach(function(e,a){var o="<p>";e.vFileList.forEach(function(e){o+='<a href="'+e.fileUrl+'"><i class=i-'+(_reg.test(e.fileName)?"image":"word")+"></i>"+e.fileName+"</a>"}),o+="</p>",$(".receivOrderOrderDetail .files").eq(a).html("<span>附件：</span>"+o).show()})}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+n.errorMsg+"</p>")}})},othersCost:function(){var e=this,a="";e.load&&$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_findPoAnswerOtherCostList", "commonParam":'+e.commonParam+"}"},success:function(o){if(o=o||{},o.success){var n=o.poOthreCostList;e._othersCost=n,a='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var t=0,i=n.length;i>t;t++)a+='<li class="costName" data-costName="'+n[t].costName+'"><span>'+n[t].costName+"：</span><b>"+$currencySymbol+formatMoney(n[t].vCostAmount)+"</b></li>";a+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(e.orderInfo.vOtherCostTotal)+"</b></li>",a+="</ul>",a+=0==n.length?"":'<span name="otherCostInfos" class="edit editOther"></span>',a+="</div>",othersCostCon.html(a)}}})},reQtys:function(e){var a=0;return e.find(".int02").each(function(){var e=$(this);a+=Number(e.val())}),a},reCostTotalFn:function(){var e=0;return $(".contarin").find(".subtotal").each(function(){e+=Number($(this).attr("data-vtotal"))}),e},start:function(){var e=this;orderAnswerCon.html(e.orderBaseInfo());var a={serviceId:"B01_queryAllPlatformCurrency",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",a,function(a){if(a.success&&!isEmpty(a.platformCurrencyList[0])){$platformCurrencyList=a;for(var o=0,n=a.platformCurrencyList.length;n>o;o++)if(a.platformCurrencyList[o].currencyCode==e.orderInfo.pCurrencyCode)return $currencySymbol=a.platformCurrencyList[o].currencySymbol,$priceDecimalNum=a.platformCurrencyList[o].priceDecimalNum,$amountDecimalNum=a.platformCurrencyList[o].amountDecimalNum,!1}}),e.prodAnswerInfo(),e.othersCost(),$(".item-total").html("订单总金额："+$currencySymbol+formatMoney(e.orderInfo.vTotalAmount)).show(),$logisticsType.currValue=enumFn(e.logisticsType,e.orderInfo.logisticsType),$logisticsType.logisticsType=e.orderInfo.logisticsType,$currencyData.currencyInfo={id:e.orderInfo.currencyId,currencyCode:e.orderInfo.currencyCode,currencyName:e.orderInfo.currencyName};var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getCompCurrencyByPCurrency",companyId:_vParams.companyId,currencyCodeP:e.orderInfo.pCurrencyCode,commonParam:commonParam()};GetAJAXData("POST",o,function(a){a.success&&(isEmpty(a.currencyInfo.currencyName)||($currencyData.currencyInfo=a.currencyInfo,orderAnswerCon.find(".currencyName").html("<span>交易币别：</span>"+a.currencyInfo.currencyName)));var o=a.currencyInfo;if(e.isDisplayRate=!1,(0==o.isBase||isEmpty(o.currencyName))&&(e.isDisplayRate=!0),1==o.isBase)e.addval_localCurrencyId=o.id,e.addval_localCurrencyCode=o.currencyCode,e.addval_localCurrencyName=o.currencyName,e.addval_exchangeRate="1";else{var n={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getExchangeRateByCurrency",companyId:e.orderInfo.vendorId.toString(),commonParam:commonParam(),currencyId:$currencyData.currencyInfo.id.toString()};GetAJAXData("POST",n,function(a){a.success&&($ExchangeRateData=a,e.addval_localCurrencyId=a.baseCurrencyId,e.addval_localCurrencyCode=a.baseCurrencyCode,e.addval_localCurrencyName=a.baseCurrencyName,e.addval_exchangeRate=a.exchangeRate)})}}),$taxData.taxInfo={taxName:e.orderInfo.taxName,taxCode:e.orderInfo.taxCode,taxId:e.orderInfo.taxId,taxRate:e.orderInfo.taxRate,isContainTax:e.orderInfo.isContainTax};var n={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getTaxByCustomerTax",companyId:e.orderInfo.vendorId,cTaxId:e.orderInfo.taxId,customerId:e.orderInfo.companyId,commonParam:commonParam()};GetAJAXData("POST",n,function(e){e.success&&(isEmpty(e.taxName)||($("#taxName").find("em").html(e.taxName),$taxData.taxInfo=e))},!0);var t={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findTaxList",companyId:e.orderInfo.vendorId,taxStyle:2,commonParam:commonParam()};GetAJAXData("POST",t,function(e){e.success&&(isEmpty(e.taxList[0])||($taxListData=e))},!0),$conditionJson.conditionName=e.orderInfo.conditionName,$conditionJson.id=e.orderInfo.conditionId,$conditionJson.conditionCode=e.orderInfo.conditionCode;var i={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findCompanyConditionList",companyId:_vParams.companyId,conditionType:"2"};GetAJAXData("POST",i,function(e){e.success&&(isEmpty(e.conditionList[0])||($conditionData=e))},!0);var r={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getConditionByCustomerCondition",companyId:e.orderInfo.vendorId,customerId:e.orderInfo.companyId,cConditionId:e.orderInfo.conditionId};GetAJAXData("POST",r,function(e){e.success&&(isEmpty(e.conditionName)||($conditionJson=e))},!0),e.privateDefultAddrName=e.orderInfo.logisticsAddrName,e.privateDefultAddrId="",e.addval_contactPerson=e.orderInfo.contactPerson,e.addval_cityName=e.orderInfo.cityName,e.addval_cityCode=e.orderInfo.cityCode,e.addval_provinceCode=e.orderInfo.provinceCode,e.addval_provinceName=e.orderInfo.provinceName,e.addval_countryName=e.orderInfo.countryName,e.addval_countryCode=e.orderInfo.countryCode,e.addval_districtCode=e.orderInfo.districtCode,e.addval_districtName=e.orderInfo.districtName,e.addval_invId=e.orderInfo.invId,e.addval_invCode=e.orderInfo.invCode,e.addval_invName=e.orderInfo.invName,e.addval_address=e.orderInfo.address,e.addval_mobile=e.orderInfo.mobile,e.addval_isDefault="",e.addval_addressCompName="",e.addval_addressCode="",e.addval_addressType="",e.addval_addressId="",e.addval_zipCode="",e.addval_tel="",e.addval_status="",e.addval_remark="";var s={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getAddrInfoByCustomerAddrId",companyId:e.orderInfo.vendorId,cAddressId:e.orderInfo.addressId,customerId:e.orderInfo.companyId,type:"2"};GetAJAXData("POST",s,function(a){if(a.success&&($AddrData=a,!isEmpty(a.customerAddress))){var o=a.customerAddress;e.privateDefultAddrName=o.provinceName+o.cityName+o.districtName+o.address+"（收货人："+o.contactPerson+"，电话："+o.mobile+"，商家仓库："+o.invName+"）",e.privateDefultAddrId=o.addressId,e.addval_contactPerson=o.contactPerson,e.addval_cityName=o.cityName,e.addval_cityCode=o.cityCode,e.addval_provinceCode=o.provinceCode,e.addval_provinceName=o.provinceName,e.addval_countryName=o.countryName,e.addval_countryCode=o.countryCode,e.addval_districtCode=o.districtCode,e.addval_districtName=o.districtName,e.addval_invId=o.invId,e.addval_invCode=o.invCode,e.addval_invName=o.invName,e.addval_address=o.address,e.addval_mobile=o.mobile,e.addval_isDefault=o.isDefault,e.addval_addressCompName=o.addressCompName,e.addval_addressCode=o.addressCode,e.addval_addressType=o.addressType,e.addval_addressId=o.addressId,e.addval_zipCode=o.zipCode,e.addval_tel=o.tel,e.addval_status=o.status,e.addval_remark=o.remark}}),$payWayTypeData.payWayName=e.orderInfo.payWayName,$payWayTypeData.payWayId=e.orderInfo.payWayId,$payWayTypeData.payWayCode=e.orderInfo.payWayCode;var d={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getPayWayByCustomerPayWay",companyId:e.orderInfo.vendorId,customerId:e.orderInfo.companyId,cPayWayId:e.orderInfo.payWayId};GetAJAXData("POST",d,function(e){e.success&&(isEmpty(e.payWapName)||($payWayTypeData=e))},!0);var c={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findCompanyPayWayList",companyId:e.orderInfo.vendorId,payWayType:"1"};GetAJAXData("POST",c,function(e){e.success&&(isEmpty(e.payWayList[0])||($payWayData=e))},!0);var l={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:e.orderInfo.companyId,id:e.orderInfo.id,commonParam:commonParam(),docType:"24",fileSource:1,searchType:1};GetAJAXData("POST",l,function(e){e.success&&($fileData=e)},!0),e.load&&bottomBar(["share"],e.memberId,"","确定转销售"),container.on("click","span.edit, a.item-link",function(){var a=$(this),o=(a.parents(".item-wrap"),a.attr("name")),n=$body.scrollTop();switch(o){case"headInfos":orderReviseInfoCon.html(e.editHeadInfo(n)),e.isDisplayRate&&$(".curSelect").html("本位币："+e.addval_localCurrencyName+"&nbsp;&nbsp;&nbsp;&nbsp;汇率：").show(),setTimeout(function(){e.taxTypeSelect3()},300);break;case"bodyInfos":var t=a.parent(".item-wrap").attr("data-index");orderReviseInfoCon.html(e.editBodyInfo(t,n)),$(".i-search").eq(0).on("click",function(){e.findCompanyProdList(t)}),setTimeout(function(){e.units(t)},0);var i=$(".wfItem-int").eq(0).find("input").val();$(".wfItem-int").eq(0).find("input").blur(function(){var a=$(this),o=a.val();""!=o&&i!=o&&e.editProdCode(o,function(e){$scope.poLineList[t].vPoInfo.id=e.prodInfo.id,$scope.poLineList[t].vPoInfo.prodCode=e.prodInfo.prodCode,$scope.poLineList[t].vPoInfo.prodName=e.prodInfo.prodName,$scope.poLineList[t].vPoInfo.prodScale=e.prodInfo.prodScale,$scope.poLineList[t].vPoInfo.prodDesc=e.prodInfo.remark,$(".wfItem-int").eq(0).find("input").val($scope.poLineList[t].vPoInfo.prodCode),$(".wfItem-int").eq(0).siblings("p").html($scope.poLineList[t].vPoInfo.prodName+" "+$scope.poLineList[t].vPoInfo.prodScale),prodAnswerCon.find(".prodCode").eq(t).find("b").html($scope.poLineList[t].vPoInfo.prodCode),prodAnswerCon.find(".prodDetail").eq(t).find("p").html($scope.poLineList[t].vPoInfo.prodName+" "+$scope.poLineList[t].vPoInfo.prodScale)})});break;case"otherCostInfos":orderReviseInfoCon.html(e.editOthersCost(n));break;case"payInfo":orderReviseInfoCon.html(e.editPayInfo(n)),setTimeout(function(){e.conditionSelect(),e.LogisticalSelect(),e.payWaySelect()},300);break;case"remark":orderReviseInfoCon.html(e.editRemark(n)),$("#intRemarks").val($myRemarkVal)}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this);if(a.is("#saveHeadInfo")&&$taxData.taxInfo.taxName!=$("#taxType").select3("value")&&($taxData.taxInfo.taxName=$("#taxType").select3("value"),$taxListData.success,addval_taxInfo=!0),a.is("#saveBodyInfo"),a.is("#saveOthersCost")){var o=$(".hideItemCon").find(".costName"),n=$(".showItemCon").find(".costName");o.forEach(function(e,a){var o=e.value.replace(new RegExp(/(:)/g),"");o=o.replace(new RegExp(/(：)/g),""),n.eq(a).find("span").eq(0).html(o+"："),n.eq(a).attr("data-costname",o)})}a.is("#savePayInfo")&&($conditionJson.conditionName!=$("#dealType").select3("value")&&($conditionJson.conditionName=$("#dealType").select3("value"),$conditionData.success&&$conditionData.conditionList.forEach(function(e){e.conditionName==$conditionJson.conditionName&&($conditionJson.id=e.id,$conditionJson.conditionCode=e.conditionCode)}),addval_conditionInfo=!0),$payWayTypeData.payWayName!=$("#checkoutType").select3("value")&&($payWayTypeData.payWayName=$("#checkoutType").select3("value"),$payWayData.success&&$payWayData.payWayList.forEach(function(e){e.payWayName==$payWayTypeData.payWayName&&($payWayTypeData.payWayId=e.payWayId,$payWayTypeData.payWayCode=e.payWayCode)}),addval_paywayInfo=!0),$logisticsType.currValue!=$("#logisticsType").select3("value")&&($logisticsType.currValue=$("#logisticsType").select3("value"),$logisticsType.logisticsType=reEnumFn(e.logisticsType,$logisticsType.currValue))),a.is("#saveRemark")&&($myRemarkVal=$("#intRemarks").val());var t=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn-confirm",function(){e.popup("confirm","","您确定要转销售订单吗？",function(){},function(){e.returnSale()})})},initSelect3:function(e,a,o){$(e).select3({allowClear:!0,items:a,placeholder:"请选择",showSearchInputInDropdown:!1,value:o})},findCompanyProdList:function(e){var a=this,o="",n=0,t={companyId:_vParams.companyId,serviceId:"B01_findCompanyProdList",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",t,function(e){e.success&&($scope.prodList=e.prodList,$scope.prodList.forEach(function(e,a){o+='<tr data-index="'+a+'"><td><div>'+e.prodCode+"</div></td><td><div>"+e.prodName+"</div></td><td><div>"+e.prodScale+"</div></td><td><div>"+e.remark+"</div></td><td><span>选择</span></td></tr>",n++}))}),10>n?a.popup("alert","",MProdList(o),"","","取消"):a.popup("alert","",MProdList(o,"overflow"),"","","取消"),$(".MProdList tbody tr").on("click",function(){var a=$(this),o=a.attr("data-index");$scope.poLineList[e].vPoInfo.id=$scope.prodList[o].id,$scope.poLineList[e].vPoInfo.prodCode=$scope.prodList[o].prodCode,$scope.poLineList[e].vPoInfo.prodName=$scope.prodList[o].prodName,$scope.poLineList[e].vPoInfo.prodScale=$scope.prodList[o].prodScale,$scope.poLineList[e].vPoInfo.prodDesc=$scope.prodList[o].remark,$(".wfItem-int").eq(0).find("input").val($scope.poLineList[e].vPoInfo.prodCode),$(".wfItem-int").eq(0).siblings("p").html($scope.poLineList[e].vPoInfo.prodName+" "+$scope.poLineList[e].vPoInfo.prodScale),prodAnswerCon.find(".prodCode").eq(e).find("b").html($scope.poLineList[e].vPoInfo.prodCode),prodAnswerCon.find(".prodDetail").eq(e).find("p").html($scope.poLineList[e].vPoInfo.prodName+" "+$scope.poLineList[e].vPoInfo.prodScale),$("#popup_btn_container").trigger("click")})},editHeadInfo:function(e){var a=this,o="";return o+='<div id="reviseBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>客户单号：</span><b>'+a.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+a.orderInfo.companyAbbr+'</li>		<li><span>交易币种：</span><em id="currencyId">'+$currencyData.currencyInfo.currencyName+'</em></li>		<li><span>交易税种：</span><em id="currTax" class="currTax">'+$taxData.taxInfo.taxName+'</em><label class="checkbox'+(1==a.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+'%</label></li>		<li><span>销售日期：</span><em id="poFormDate">'+transDate((new Date).getTime())+'</li>	</ul></div></div><div class="m-item">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label">交易币种：</span>			<div id="currency" class="c-cont">				<p class="c-txt">'+$currencyData.currencyInfo.currencyName+'</p>				<div class="curSelect"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">交易税种：</span>			<div class="c-cont">				<div id="taxType" class="select3-input"></div>				<p><label class="checkbox'+(1==a.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+'%</label></p>			</div>		</section>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveHeadInfo" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},taxTypeSelect3:function(){var e=this,a=[];if($taxListData.success)for(var o=0,n=$taxListData.taxList.length;n>o;o++)"1"==e.orderInfo.isContainTax?$taxListData.taxList[o].isContainTax==e.orderInfo.isContainTax&&$taxListData.taxList[o].taxRate==e.orderInfo.taxRate&&a.push($taxListData.taxList[o].taxName):$taxListData.taxList[o].isContainTax==e.orderInfo.isContainTax&&a.push($taxListData.taxList[o].taxName);else a.push($taxData.taxInfo.taxName);e.initSelect3("#taxType",a,$taxData.taxInfo.taxName)},editBodyInfo:function(e,a){var o=this,n="",t=$scope.poLineList[e],i=(t.poSubLineList.length,!0);return t.vAnswerUnitName==t.vValuationUnitName&&(i=!1),n+='<div class="m-item">	<h2 class="m-title">产品明细</h2>	<div class="item-wrap">		<ul>			<li><span>物料编码：</span>'+t.vPoInfo.prodCode+"</li>			<li><span>物料详细：</span><p>"+t.vPoInfo.prodName+" "+t.vPoInfo.prodScale+"</p></li>			<li><section><span>数量：</span>"+t.vPurchaseQty+t.vAnswerUnitName+(i?"/"+t.vValuationQty+t.vValuationUnitName:"")+"</section><section><span>交期：</span>"+t.vExpectedDelivery+'</section></li>			<li><span class="price">单价：</span>'+$currencySymbol+formatMoney(1===o.orderInfo.isContainTax?t.vTaxPrice:t.vPrice)+"/"+t.vValuationUnitName+'</li>		</ul>	</div></div><div class="m-item m-item-units">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label"><b>我方编码：</b></span>			<div class="wfItem">				<p class="wfItem-int"><input type="text" class="s-int" value="'+t.vPoInfo.prodCode+'" /><i class="i-search"></i></p>				<p>'+t.vPoInfo.prodName+" "+t.vPoInfo.prodScale+'</p>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label"><b>数量：</b></span>			<div class="c-cont">				<div class="c-cont-item">					<span>'+t.purchaseQty+'</span>					<div id="purchaseQty_'+e+'" class="select3-input select3-unit" data-index="0"></div>				</div>',i&&(n+='				<div class="c-cont-item">					<span>'+t.valuationQty+'</span>					<div id="valuationQty_'+e+'" class="select3-input select3-unit" data-index="1"></div>				</div>'),n+='			</div>		</section></div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+a+'" data-index="'+e+'">完成</a></div>'},units:function(e){var a=this,o=[],n=[];$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_findProdUnitListByProd","companyId":["'+_vParams.companyId+'"],"prodId":"'+$scope.poLineList[e].prodId+'",'+a.tokens+',"commonParam":'+a.commonParam+"}"},success:function(a){if(a.success&&!isEmpty(a.prodUnitList[0]))for(var t=a.prodUnitList,i=0,r=t.length;r>i;i++)o.push(t[i].prodUnitName),n.push(t[i].basicUnitName);else o.push($scope.poLineList[e].purchaseUnitName),n.push($scope.poLineList[e].valuationUnitName)}}),a.initSelect3("#purchaseQty_"+e,o,$scope.poLineList[e].purchaseUnitName),a.initSelect3("#valuationQty_"+e,n,$scope.poLineList[e].valuationUnitName);var t=$(".m-item-units").find(".m-select");t.find(".select3-input").change(function(){var e=$(this),a=e.attr("data-index"),o=e.select3("value");e.parents(".m-item-units").find(".select3-input").forEach(function(e){$(e).attr("data-index")==a&&$(e).find(".select3-single-selected-item").attr("data-item-id",o).text(o)})})},editProdCode:function(e,a){var o=this,n={prodCode:e,companyId:_vParams.companyId,serviceId:"B01_getProdInfoByCode",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",n,function(e){return e.success?void(isEmpty(e.prodInfo)?o.popup("alert","","无对应商品！"):a&&a(e)):(o.popup("alert","",e.errorMsg),!1)})},editOthersCost:function(e){for(var a=this,o=a._othersCost,n=o.length,t=$(".showItemCon").find(".costName"),i='<div class="m-item"><h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>',r=0;n>r;r++)i+="<li><span>"+t.eq(r).attr("data-costName")+"：</span><b>"+$currencySymbol+formatMoney(o[r].vCostAmount)+"</b></li>";i+="</ul></div></div>",i+='<div class="m-item"><h2 class="m-title">订单其他费用维护</h2><div class="item-wrap">';for(var s=0;n>s;s++)i+='<section class="m-select clearfix">	<div class="c-cont c-cont2">		<input type="text" class="costName" value="'+t.eq(s).attr("data-costName")+'">		<p class="fy">'+$currencySymbol+formatMoney(o[s].vCostAmount)+"</p>	</div></section>";return i+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveOthersCost" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},editPayInfo:function(e){var a=this,o=a.orderInfo;return html='<div id="payInfoList" class="m-item">	<div class="item-wrap">		<ul>			<li><span>交易条件：</span><p id="jyCurrVal">'+$conditionJson.conditionName+'</p></li>			<li><span>物流方式：</span><p><em id="logisticsVal">'+$logisticsType.currValue+"</em></p></li>			<li><span>"+(3==$logisticsType.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+'</p></li>			<li><span>收款条件：</span><p id="payWayName">'+$payWayTypeData.payWayName+"</p></li>",html+=1==o.invoice?"<li><span>发票信息：</span><p>"+enumFn(a.invoiceInfoName,o.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(a.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+"</p></li>",html+='		</ul>	</div></div><div id="rePayInfoList" class="m-item">	<div class="item-wrap">		<section class="m-select clearfix">			<span class="c-label">交易条件：</span>			<div class="c-cont">				<div id="dealType" class="select3-input"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">物流方式：</span>			<div class="c-cont">				<div id="logisticsType" class="select3-input"></div>			</div>		</section>		<section id="address" class="clearfix">			<span class="c-label">'+(3==$logisticsType.logisticsType?"自提点":"收货地址")+'：</span>			<div class="c-cont">				<p class="c-txt">'+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+'</p>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">收款条件：</span>			<div class="c-cont">				<div id="checkoutType" class="select3-input"></div>			</div>		</section>	</div></div><div class="btn-wrap"><a href="javascript:;" id="savePayInfo" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},conditionSelect:function(){var e=this,a=[];if($conditionData.success){if(0==$conditionData.conditionList.length)return a.push($conditionJson.conditionName),e.initSelect3("#dealType",a,$conditionJson.conditionName),!1;for(var o=$conditionData.conditionList.length,n=0;o>n;n++)a.push($conditionData.conditionList[n].conditionName);e.initSelect3("#dealType",a,$conditionJson.conditionName)}else a.push($conditionJson.conditionName),e.initSelect3("#dealType",a,$conditionJson.conditionName)},LogisticalSelect:function(){var e=this,a=[];e.logisticsType.forEach(function(e){a.push(e.Value)}),e.initSelect3("#logisticsType",a,$logisticsType.currValue)},payWaySelect:function(){var e=this,a=[];if(!$payWayData.success)return a.push(e.orderInfo.payWayName),e.initSelect3("#checkoutType",a,e.orderInfo.payWayName),!1;for(var o=$payWayData.payWayList,n=o.length,t=0;n>t;t++)a.push(o[t].payWayName);e.initSelect3("#checkoutType",a,$payWayTypeData.payWayName)},editRemark:function(e){var a=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+a.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+a.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>';0==$fileData.fileList.length&&(o+="<p><b>0个附件</b></p>");for(var n=0;n<$fileData.fileList.length;n++)o+='<p><a href="'+$fileData.fileList[n].fileUrl+'"><i class=i-'+(_reg.test($fileData.fileList[n].fileName)?"image":"word")+"></i>"+$fileData.fileList[n].fileName+"</a></p>";return o+='</div><div id="remarks" class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写备注信息"></textarea></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,a,o,n,t,i){new Popup({type:e,title:a,content:o,ok:i?i:"确定",cancel:"取消",closeCallBack:n,okCallBack:t})},returnSale:function(){var e=this,a=$taxData.taxInfo.taxName,o=$taxData.taxInfo.taxCode,n=$taxData.taxInfo.taxId,t=$taxData.taxInfo.taxRate,i=$taxData.taxInfo.isContainTax,r=privateDefultUser.employeeCode,s=privateDefultUser.employeeId,d=privateDefultUser.employeeName,c=privateDefultUser.memberId;if(addval_conditionInfo)var l=$conditionJson.conditionName,p=$conditionJson.id,m=$conditionJson.conditionCode;else var l=$conditionJson.conditionName,p="",m="";var v=$payWayTypeData.payWayName,u=$payWayTypeData.payWayId,f=$payWayTypeData.payWayCode,y=e.orderInfo.logisticsName,I=e.orderInfo.logisticsCode,N=[];$fileData.fileList.forEach(function(e){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,N.push(a)});var C={vOtherCostTotal:e.orderInfo.vOtherCostTotal,vTotalAmount:e.orderInfo.vTotalAmount,vTaxTotal:e.orderInfo.vTaxTotal,vTotal:e.orderInfo.vTotal},h={vendorId:e.orderInfo.vendorId.toString(),vendorName:e.orderInfo.vendorName,vendorCode:e.orderInfo.vendorCode,vendorAbbr:e.orderInfo.vendorAbbr,poAnswerId:_vParams.poAnswerId,poId:e.orderInfo.id,poFormNo:e.orderInfo.poFormNo,poInsideNo:e.orderInfo.poInsideNo,currencyId:$currencyData.currencyInfo.id,currencyCode:$currencyData.currencyInfo.currencyCode,currencyName:$currencyData.currencyInfo.currencyName,localCurrencyCode:e.addval_localCurrencyCode,localCurrencyId:e.addval_localCurrencyId,localCurrencyName:e.addval_localCurrencyName,pCurrencyCode:e.orderInfo.pCurrencyCode,pCurrencyName:e.orderInfo.pCurrencyName,exchangeRate:e.addval_exchangeRate,taxId:n,taxName:a,taxCode:o,isContainTax:i,taxRate:t,provinceCode:e.orderInfo.provinceCode,provinceName:e.orderInfo.provinceName,customerCode:e.orderInfo.companyCode,customerId:e.orderInfo.companyId,customerAbbr:e.orderInfo.companyAbbr,customerName:e.orderInfo.companyName,soFormDate:(new Date).getTime(),soInsideNo:"",soManCode:r,soManId:s,soManName:d,soManPid:c},P={logisticsCode:I,logisticsName:y,logisticsType:$logisticsType.logisticsType,contactPerson:e.addval_contactPerson,cityName:e.addval_cityName,cityCode:e.addval_cityCode,provinceCode:e.addval_provinceCode,provinceName:e.addval_provinceName,countryName:e.addval_countryName,countryCode:e.addval_countryCode,districtCode:e.addval_districtCode,districtName:e.addval_districtName,invId:e.addval_invId,invCode:e.addval_invCode,invName:e.addval_invName,addressId:e.addval_addressId,address:e.addval_address,mobile:e.addval_mobile,payWayId:u,payWayName:v,payWayCode:f,conditionCode:m,conditionName:l,conditionId:p,invoice:e.orderInfo.invoice,invoiceType:e.orderInfo.invoiceType,invoiceContent:e.orderInfo.invoiceContent,invoiceHeader:e.orderInfo.invoiceHeader,invoiceName:e.orderInfo.invoiceName,invoiceAccount:e.orderInfo.invoiceAccount,invoiceTel:e.orderInfo.invoiceTel,invoiceBank:e.orderInfo.invoiceBank,invoiceAddress:e.orderInfo.invoiceAddress,invoicePayMark:e.orderInfo.invoicePayMark},x={agreement:e.orderInfo.agreement,vRemark:$myRemarkVal,remark:e.orderInfo.remark},T=e._othersCost,b=[];if($scope.poLineList.forEach(function(e){if(isEmpty(e.purchaseUnitInfo))var a="",o="",n=e.purchaseUnitName;else var a=e.purchaseUnitInfo.prodUnitCode,o=e.purchaseUnitInfo.id,n=e.purchaseUnitInfo.prodUnitName;if(isEmpty(e.valuationUnitInfo))var t="",i="",r=e.valuationUnitName;else var t=e.valuationUnitInfo.prodUnitCode,i=e.valuationUnitInfo.id,r=e.valuationUnitInfo.prodUnitName;e.purchaseUnitId==e.valuationUnitId&&(i=o,t=a,r=n);var s={fileList:[],expectedDelivery:new Date(e.expectedDelivery).getTime(),vProdId:e.vPoInfo.id,vProdName:e.vPoInfo.prodName,vProdDesc:e.vPoInfo.prodDesc,vProdCode:e.vPoInfo.prodCode,vProdScale:e.vPoInfo.prodScale,vFileCount:e.vFileList.length,vRemark:e.vRemark,cProdId:e.prodId,cProdName:e.prodName,cProdCode:e.prodCode,cProdScale:e.prodScale,cProdDesc:e.prodDesc,fileCount:e.fileCount,remark:e.remark,invName:e.invName,invCode:e.invCode,invId:e.invId,taxPrice:e.taxPrice,taxLineTotal:e.taxLineTotal,salesQty:e.purchaseQty,salesUnitId:o,salesUnitCode:a,salesUnitName:n,valuationQty:e.valuationQty,valuationUnitId:i,valuationUnitCode:t,valuationUnitName:r,poLineId:e.id,poLineNo:e.lineNo,lineNo:e.lineNo,price:e.price,lineAmount:e.lineAmount,locationId:e.localtionId,locationCode:e.localtionCode,locationName:e.localtionName,deliveryValuationQty:0,deliveryQty:0,receiveValuationQty:0,receiveQty:0,returnQty:0,returnValuationQty:0,exchangeQty:0,exchangeValuationQty:0};
e.vFileList.forEach(function(e){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,s.fileList.push(a)}),b.push(s)}),""==h.vendorId)return void e.popup("alert","","企业ID 为空！");if(""==h.currencyName)return void e.popup("alert","","交易币种名称 为空！");if(""==h.localCurrencyCode)return void e.popup("alert","","企业本币编码 为空！");if(""==h.localCurrencyId)return void e.popup("alert","","企业本币ID 为空！");if(""==h.localCurrencyName)return void e.popup("alert","","企业本币名称 为空！");if(""==h.pCurrencyCode)return void e.popup("alert","","平台币种编码 为空！");if(""==h.pCurrencyName)return void e.popup("alert","","平台币种名称 为空！");if(0!=h.isContainTax&&1!=h.isContainTax)return void e.popup("alert","","是否含税 不正确！");if(1!=P.invoice&&""==P.invoiceType)return void e.popup("alert","","发票类型 为空！");if(1!=P.invoice&&1==P.invoiceType&&(""==P.invoiceHeader||""==P.invoiceContent))return void e.popup("alert","","发票抬头或发票内容 为空！");if(1!=P.invoice&&1!=P.invoiceType&&""==P.invoiceAccount)return void e.popup("alert","","发票账号 为空！");if(""==P.logisticsType)return void e.popup("alert","","物流方式 为空！");if(3!=P.logisticsType&&""==P.logisticsName)return void e.popup("alert","","物流商 为空！");if(""==P.conditionName)return void e.popup("alert","","交易条件名称 为空！");if(void 0!=h.exchangeRate&&isNaN(1*h.exchangeRate))return void e.popup("alert","","汇率应为整数或小数！");var _={saleOrderFile:N,orderTotalAmount:C,baseInfo:h,prodDetailList:b,payInfo:P,appendContact:x,otherCostList:T,serviceId:"B03_poAnswerToSalesOrder",commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};$.ajax({type:"POST",url:config.serviceUrl,data:{param:JSON.stringify(_)},success:function(a){a=a||{},a.success?($scope.pageState="success",$scope.success_soFormNo=a.soFormNo,$scope.success_soFormId=a.id,fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):e.popup("alert","","操作失败："+a.errorMsg)}})}};