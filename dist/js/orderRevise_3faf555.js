var formTip='<div id="formTip" class="formTip"></div>',container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),orderAnswerCon=$("#orderAnswerInfo"),prodAnswerCon=$("#prodAnswerInfo"),othersCostCon=$("#othersCost"),$scope={},$currencyData={},$taxData={},$taxListData={},$ExchangeRateData={},$conditionData={},$conditionJson={},$payWayTypeData={},$payWayData={},$logisticsType={},$AddrData={},$fileData={},$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",addval_taxInfo=!1,addval_conditionInfo=!1,addval_paywayInfo=!1,$myRemarkVal="",privateDefultUser,orderRevise=function(){this.init()};orderRevise.prototype={init:function(){var e=this;e.orderInfo,e._othersCost=[],e.totals=0,e.load=!1,e.memberId="",e.commonParam=JSON.stringify(commonParam()),e.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',setTimeout(function(){container.show(),fnTip.hideLoading()},0),requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)}),GetUserInfo("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber},function(e){"01230"==e.retCode&&(privateDefultUser=e)}),requestFn("B02_Invoice",function(a){"0"==a.errorCode&&(e.invoiceInfoName=a.dataSet.data.detail)}),e.start()},orderBaseInfo:function(){var e=this,a="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_getPurchaseOrderAnswerInfo", "commonParam":'+e.commonParam+"}"},success:function(o){o=o||{},o.success&&(e.orderInfo=o.poAnswerOrderInfo,$currencySymbol=e.orderInfo.currencySymbol,$priceDecimalNum=e.orderInfo.priceDecimalNum,$amountDecimalNum=e.orderInfo.amountDecimalNum,e.memberId=e.orderInfo.poManId,a+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>采购单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>客户单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>所属公司：</span>"+e.orderInfo.vendorName+"</li>		<li><span>客户：</span>"+e.orderInfo.companyAbbr+'</li>		<li class="currencyName"><span>交易币别：</span></li>		<li id="taxName"><span>交易税别：</span><em>'+e.orderInfo.taxName+'</em><label class="checkbox'+(1==e.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*e.orderInfo.taxRate+"%</label></li>		<li><span>销售日期：</span>"+transDate((new Date).getTime())+'</li>	</ul> <span name="headInfos" class="edit"></span></div>')}}),a},prodAnswerInfo:function(){function e(e){e.vFileList=[],GetAJAXData("POST",{serviceId:"B01_findFileList",docType:24,companyId:_vParams.companyId,searchType:2,id:e.id,token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()},function(a){a.success&&a.fileList.forEach(function(a){e.vFileList.push({id:a.id,fileName:a.fileName,fileSize:a.fileSize,fileUrl:a.fileUrl,lineNo:a.lineNo})})})}var a=this,o="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+a.tokens+',"serviceId":"B03_findPoAnswerLineList", "commonParam":'+a.commonParam+"}"},success:function(n){if(n=n||{},n.success){var r=n.poLineList;o='<h2 class="m-title">产品明细</h2>';for(var t=0,i=r.length;i>t;t++){var c=!0;r[t].vAnswerUnitName==r[t].vValuationUnitName&&(c=!1);var s={};GetAJAXData("POST",{serviceId:"B01_getProdByCustomerProd",customerId:a.orderInfo.companyId,cProdCode:r[t].prodCode,vendorId:a.orderInfo.vendorId,token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()},function(e){e.prodMap?(s.id=e.prodMap.prodId,s.prodCode=e.prodMap.prodCode,s.prodName=e.prodMap.prodName,s.prodScale=e.prodMap.prodScale,s.prodDesc=e.prodMap.prodDesc):(s.id="",s.prodCode="",s.prodName=r[t].prodName,s.prodScale=r[t].prodScale,s.prodDesc=r[t].prodDesc),r[t].vPoInfo=s}),o+='<div class="item-wrap" data-index="'+t+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+r[t].vPoInfo.prodCode+'</b></li>		<li class="prodDetail"><span>物料详细：</span><p>'+r[t].vPoInfo.prodName+" "+r[t].vPoInfo.prodScale+"</p></li>		<li><section><span>数量：</span><em>"+r[t].vPurchaseQty+"</em>"+r[t].vAnswerUnitName+(c?"/<em>"+r[t].vValuationQty+"</em>"+r[t].vValuationUnitName:"")+"</section><section><span>交期：</span><em>"+r[t].expectedDelivery+'</em></section></li>		<li class="price"><span>单价：</span>'+$currencySymbol+(1===a.orderInfo.isContainTax?formatMoney(r[t].vTaxPrice,$priceDecimalNum):formatMoney(r[t].vPrice,$priceDecimalNum))+"/"+r[t].vValuationUnitName+'</li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>含税小计：</span><b>'+$currencySymbol+formatMoney(r[t].vTaxLineTotal,$amountDecimalNum)+'</b></li>	</ul>  <span name="bodyInfos" class="edit"></span></div>',e(r[t])}prodAnswerCon.html(o),$scope.poLineList=r,a.load=!0,$scope.poLineList.forEach(function(e,a){var o="<p>";e.vFileList.forEach(function(e){o+='<a href="'+e.fileUrl+'"><i class=i-'+(_reg.test(e.fileName)?"image":"word")+"></i>"+e.fileName+"</a>"}),o+="</p>",prodAnswerCon.find(".files").eq(a).html("<span>附件：</span>"+o).show()})}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+n.errorMsg+"</p>")}})},othersCost:function(){var e=this,a="";e.load&&$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"poAnswerId":'+_vParams.poAnswerId+',"vendorId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_findPoAnswerOtherCostList", "commonParam":'+e.commonParam+"}"},success:function(o){if(o=o||{},o.success){var n=o.poOthreCostList;e._othersCost=n,a='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,t=n.length;t>r;r++)a+='<li class="costName" data-costName="'+n[r].costName+'"><span>'+n[r].costName+"：</span><b>"+$currencySymbol+formatMoney(n[r].vCostAmount,$amountDecimalNum)+"</b></li>";a+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>'+$currencySymbol+formatMoney(e.orderInfo.vOtherCostTotal,$amountDecimalNum)+"</b></li>",a+="</ul>",a+=0==n.length?"":'<span name="otherCostInfos" class="edit editOther"></span>',a+="</div>",othersCostCon.html(a)}}})},reQtys:function(e){var a=0;return e.find(".int02").each(function(){var e=$(this);a+=Number(e.val())}),a},reCostTotalFn:function(){var e=0;return $(".contarin").find(".subtotal").each(function(){e+=Number($(this).attr("data-vtotal"))}),e},start:function(){function e(){if(""==r.orderInfo.pCurrencyCode)return void console.log("B01_getCompCurrencyByPCurrency：获取交易币别默认值 入参为空！");var e={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getCompCurrencyByPCurrency",companyId:_vParams.companyId,currencyCodeP:r.orderInfo.pCurrencyCode,commonParam:commonParam()};GetAJAXData("POST",e,function(e){e.success&&(isEmpty(e.currencyInfoList[0])||($currencyData.currencyInfo=e.currencyInfoList[0],orderAnswerCon.find(".currencyName").html("<span>交易币别：</span>"+$currencyData.currencyInfo.currencyName)));var o=e.currencyInfoList[0];isEmpty(o)?($currencyData.currencyInfo.currencyCodeP="",$currencyData.currencyInfo.currencyNameP="",$currencyData.currencyInfo.id="",$currencyData.currencyInfo.currencyCode="",$currencyData.currencyInfo.currencyName="",a()):($currencyData.currencyInfo={currencyCodeP:o.currencyCodeP,currencyNameP:o.currencyNameP,id:o.id,currencyCode:o.currencyCode,currencyName:o.currencyName,currencySymbol:o.currencySymbol,isBase:o.isBase},$scope.privateDefultCurrencyId=o.id,a())})}function a(){if(1==$currencyData.currencyInfo.isBase)r.addval_localCurrencyId=$currencyData.currencyInfo.id,r.addval_localCurrencyCode=$currencyData.currencyInfo.currencyCode,r.addval_localCurrencyName=$currencyData.currencyInfo.currencyName,r.addval_exchangeRate="1";else{var e={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getExchangeRateByCurrency",companyId:r.orderInfo.vendorId.toString(),commonParam:commonParam(),currencyId:r.orderInfo.currencyId};GetAJAXData("POST",e,function(e){e.success&&($ExchangeRateData=e,r.addval_localCurrencyId=e.baseCurrencyId,r.addval_localCurrencyCode=e.baseCurrencyCode,r.addval_localCurrencyName=e.baseCurrencyName,r.addval_exchangeRate=e.exchangeRate)})}}function o(){GetAJAXData("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findCurrencyList",companyId:r.orderInfo.vendorId,commonParam:commonParam()},function(e){e.success&&($scope.currencyList=e.currencyList,$scope.currencyName=[],e.currencyList.forEach(function(e){$scope.currencyName.push(e.currencyName)}))})}function n(){return $scope.privateDefultConditionName=r.orderInfo.conditionName,$scope.privateDefultConditionId="",""==r.orderInfo.companyId||""==r.orderInfo.conditionId?void console.log("获取交易条件默认值 入参为空！"):void GetAJAXData("POST",{token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getConditionByCustomerCondition",companyId:r.orderInfo.vendorId,customerId:r.orderInfo.companyId,cConditionId:r.orderInfo.conditionId},function(e){e.success&&(isEmpty(e.conditionName)||($scope.privateDefultConditionName=e.conditionName),$scope.privateDefultConditionId=e.id)})}var r=this;orderAnswerCon.html(r.orderBaseInfo()),r.prodAnswerInfo(),r.othersCost(),$(".item-total").html("订单总金额："+$currencySymbol+formatMoney(r.orderInfo.vTotalAmount,$amountDecimalNum)).show(),$logisticsType.currValue=enumFn(r.logisticsType,r.orderInfo.logisticsType),$logisticsType.logisticsType=r.orderInfo.logisticsType,$currencyData.currencyInfo={currencyCodeP:"",currencyNameP:"",id:"",currencyCode:"",currencyName:"",currencySymbol:r.orderInfo.currencySymbol,defultCurrencyName:r.orderInfo.currencyName},e(),o(),$taxData.taxInfo={taxName:r.orderInfo.taxName,taxCode:r.orderInfo.taxCode,taxId:r.orderInfo.taxId,taxRate:r.orderInfo.taxRate,isContainTax:r.orderInfo.isContainTax};var t={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getTaxByCustomerTax",companyId:r.orderInfo.vendorId,cTaxId:r.orderInfo.taxId,customerId:r.orderInfo.companyId,commonParam:commonParam()};GetAJAXData("POST",t,function(e){e.success&&(isEmpty(e.taxName)||($("#taxName").find("em").html(e.taxName),$taxData.taxInfo=e))});var i={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findTaxList",companyId:r.orderInfo.vendorId,taxStyle:2,commonParam:commonParam()};GetAJAXData("POST",i,function(e){e.success&&(isEmpty(e.taxList[0])||($taxListData=e))}),n();var c={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findCompanyConditionList",companyId:_vParams.companyId,conditionType:"2"};GetAJAXData("POST",c,function(e){e.success&&(isEmpty(e.conditionList[0])||($conditionData=e))}),r.privateDefultAddrName=r.orderInfo.logisticsAddrName,r.privateDefultAddrId="",r.addval_contactPerson=r.orderInfo.contactPerson,r.addval_cityName=r.orderInfo.cityName,r.addval_cityCode=r.orderInfo.cityCode,r.addval_provinceCode=r.orderInfo.provinceCode,r.addval_provinceName=r.orderInfo.provinceName,r.addval_countryName=r.orderInfo.countryName,r.addval_countryCode=r.orderInfo.countryCode,r.addval_districtCode=r.orderInfo.districtCode,r.addval_districtName=r.orderInfo.districtName,r.addval_invId=r.orderInfo.invId,r.addval_invCode=r.orderInfo.invCode,r.addval_invName=r.orderInfo.invName,r.addval_address=r.orderInfo.address,r.addval_mobile=r.orderInfo.mobile,r.addval_isDefault="",r.addval_addressCompName="",r.addval_addressCode="",r.addval_addressType="",r.addval_addressId="",r.addval_zipCode="",r.addval_tel="",r.addval_status="",r.addval_remark="";var s={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getAddrInfoByCustomerAddrId",companyId:r.orderInfo.vendorId,cAddressId:r.orderInfo.addressId,customerId:r.orderInfo.companyId,type:"2"};GetAJAXData("POST",s,function(e){if(e.success&&($AddrData=e,!isEmpty(e.customerAddress))){var a=e.customerAddress;r.privateDefultAddrName=a.provinceName+a.cityName+a.districtName+a.address+"（收货人："+a.contactPerson+"，电话："+a.mobile+"，商家仓库："+a.invName+"）",r.privateDefultAddrId=a.addressId,r.addval_contactPerson=a.contactPerson,r.addval_cityName=a.cityName,r.addval_cityCode=a.cityCode,r.addval_provinceCode=a.provinceCode,r.addval_provinceName=a.provinceName,r.addval_countryName=a.countryName,r.addval_countryCode=a.countryCode,r.addval_districtCode=a.districtCode,r.addval_districtName=a.districtName,r.addval_invId=a.invId,r.addval_invCode=a.invCode,r.addval_invName=a.invName,r.addval_address=a.address,r.addval_mobile=a.mobile,r.addval_isDefault=a.isDefault,r.addval_addressCompName=a.addressCompName,r.addval_addressCode=a.addressCode,r.addval_addressType=a.addressType,r.addval_addressId=a.addressId,r.addval_zipCode=a.zipCode,r.addval_tel=a.tel,r.addval_status=a.status,r.addval_remark=a.remark}}),$payWayTypeData.payWayName=r.orderInfo.payWayName,$payWayTypeData.payWayId=r.orderInfo.payWayId,$payWayTypeData.payWayCode=r.orderInfo.payWayCode;var d={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_getPayWayByCustomerPayWay",companyId:r.orderInfo.vendorId,customerId:r.orderInfo.companyId,cPayWayId:r.orderInfo.payWayId};GetAJAXData("POST",d,function(e){e.success&&(isEmpty(e.payWapName)||($payWayTypeData=e))},!0);var l={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findCompanyPayWayList",companyId:r.orderInfo.vendorId,payWayType:"1"};GetAJAXData("POST",l,function(e){e.success&&(isEmpty(e.payWayList[0])||($payWayData=e))},!0);var p={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:_vParams.companyId,id:r.orderInfo.id,commonParam:commonParam(),docType:"24",searchType:1};GetAJAXData("POST",p,function(e){e.success&&($fileData=e)},!0),r.load&&bottomBar(["share"],r.memberId,"","确定转销售"),container.on("click","span.edit, a.item-link",function(){var e=$(this),a=(e.parents(".item-wrap"),e.attr("name")),o=$body.scrollTop();switch(a){case"headInfos":orderReviseInfoCon.html(r.editHeadInfo(o)),setTimeout(function(){r.currencyListSelect(),r.taxTypeSelect(),orderReviseInfoCon.on("change","#currencyName",function(){r.addval_localCurrencyName!=$(this).select3("value")?$(".curSelect").html("本位币："+r.addval_localCurrencyName+'&nbsp;&nbsp;&nbsp;&nbsp;汇率：<input type="text" id="exchangeRate" />').show():$(".curSelect").hide()}),r.addval_localCurrencyName==$("#currencyName").select3("value")||isEmpty($("#currencyName").select3("value"))||$(".curSelect").html("本位币："+r.addval_localCurrencyName+'&nbsp;&nbsp;&nbsp;&nbsp;汇率：<input type="text" id="exchangeRate" />').show()},300);break;case"bodyInfos":var n=e.parent(".item-wrap").attr("data-index");orderReviseInfoCon.html(r.editBodyInfo(n,o)),$(".i-search").eq(0).on("click",function(){r.findCompanyProdList(n)}),setTimeout(function(){r.units(n)},0);var t=$(".wfItem-int").eq(0).find("input").val();$(".wfItem-int").eq(0).find("input").blur(function(){var e=$(this),a=e.val();""!=a&&t!=a&&r.editProdCode(a,function(e){$scope.poLineList[n].vPoInfo.id=e.prodInfo.id,$scope.poLineList[n].vPoInfo.prodCode=e.prodInfo.prodCode,$scope.poLineList[n].vPoInfo.prodName=e.prodInfo.prodName,$scope.poLineList[n].vPoInfo.prodScale=e.prodInfo.prodScale,$scope.poLineList[n].vPoInfo.prodDesc=e.prodInfo.remark,$(".wfItem-int").eq(0).find("input").val($scope.poLineList[n].vPoInfo.prodCode),$(".wfItem-int").eq(0).siblings("p").html($scope.poLineList[n].vPoInfo.prodName+" "+$scope.poLineList[n].vPoInfo.prodScale),prodAnswerCon.find(".prodCode").eq(n).find("b").html($scope.poLineList[n].vPoInfo.prodCode),prodAnswerCon.find(".prodDetail").eq(n).find("p").html($scope.poLineList[n].vPoInfo.prodName+" "+$scope.poLineList[n].vPoInfo.prodScale)})});break;case"otherCostInfos":orderReviseInfoCon.html(r.editOthersCost(o));break;case"payInfo":orderReviseInfoCon.html(r.editPayInfo(o)),setTimeout(function(){r.conditionSelect(),r.LogisticalSelect(),r.payWaySelect()},300);break;case"remark":orderReviseInfoCon.html(r.editRemark(o)),$("#intRemarks").val($myRemarkVal)}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this);if(e.is("#saveHeadInfo")&&($taxData.taxInfo.taxName!=$("#taxType").select3("value")&&($taxData.taxInfo.taxName=$("#taxType").select3("value"),$taxListData.success,addval_taxInfo=!0),$currencyData.currencyInfo.currencyName=$("#currencyName").select3("value"),orderAnswerCon.find(".currencyName").html("<span>交易币别：</span>"+($currencyData.currencyInfo.currencyName||"")),r.addval_exchangeRate=$("#exchangeRate").val()||void 0,$scope.currencyList.forEach(function(e){e.currencyName==$currencyData.currencyInfo.currencyName&&($currencyData.currencyInfo={currencyCodeP:e.currencyCodeP,currencyNameP:e.currencyNameP,id:e.id,currencyCode:e.currencyCode,currencyName:e.currencyName,currencySymbol:e.currencySymbol})})),e.is("#saveBodyInfo"),e.is("#saveOthersCost")){var a=$(".hideItemCon").find(".costName"),o=$(".showItemCon").find(".costName");a.forEach(function(e,a){var n=e.value.replace(new RegExp(/(:)/g),"");n=n.replace(new RegExp(/(：)/g),""),o.eq(a).find("span").eq(0).html(n+"："),o.eq(a).attr("data-costname",n)})}e.is("#savePayInfo")&&($scope.privateDefultConditionName!=$("#dealType").select3("value")&&($scope.privateDefultConditionName=$("#dealType").select3("value"),$conditionData.success&&$conditionData.conditionList.forEach(function(e){e.conditionName==$scope.privateDefultConditionName&&($conditionJson.id=e.id,$conditionJson.conditionCode=e.conditionCode)}),addval_conditionInfo=!0),$payWayTypeData.payWayName!=$("#checkoutType").select3("value")&&($payWayTypeData.payWayName=$("#checkoutType").select3("value"),$payWayData.success&&$payWayData.payWayList.forEach(function(e){e.payWayName==$payWayTypeData.payWayName&&($payWayTypeData.payWayId=e.payWayId,$payWayTypeData.payWayCode=e.payWayCode)}),addval_paywayInfo=!0),$logisticsType.currValue!=$("#logisticsType").select3("value")&&($logisticsType.currValue=$("#logisticsType").select3("value"),$logisticsType.logisticsType=reEnumFn(r.logisticsType,$logisticsType.currValue))),e.is("#saveRemark")&&($myRemarkVal=$("#intRemarks").val());var n=e.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(n)},200)}),$body.on("click",".bottom-btn-confirm",function(){r.popup("confirm","","您确定要转销售订单吗？",function(){},function(){r.returnSale()})})},initSelect3:function(e,a,o){$(e).select3({allowClear:!0,items:a,placeholder:"请选择",showSearchInputInDropdown:!1,value:o})},findCompanyProdList:function(e){var a=this,o="",n=0,r={companyId:_vParams.companyId,serviceId:"B01_findCompanyProdList",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",r,function(e){e.success&&($scope.prodList=e.prodList,$scope.prodList.forEach(function(e,a){o+='<tr data-index="'+a+'"><td><div>'+e.prodCode+"</div></td><td><div>"+e.prodName+"</div></td><td><div>"+e.prodScale+"</div></td><td><span>选择</span></td></tr>",n++}))}),10>n?a.popup("alert","",MProdList(o),"","","取消"):a.popup("alert","",MProdList(o,"overflow"),"","","取消"),$(".MProdList tbody tr").on("click",function(){var a=$(this),o=a.attr("data-index");$scope.poLineList[e].vPoInfo.id=$scope.prodList[o].id,$scope.poLineList[e].vPoInfo.prodCode=$scope.prodList[o].prodCode,$scope.poLineList[e].vPoInfo.prodName=$scope.prodList[o].prodName,$scope.poLineList[e].vPoInfo.prodScale=$scope.prodList[o].prodScale,$scope.poLineList[e].vPoInfo.prodDesc=$scope.prodList[o].remark,$(".wfItem-int").eq(0).find("input").val($scope.poLineList[e].vPoInfo.prodCode),$(".wfItem-int").eq(0).siblings("p").html($scope.poLineList[e].vPoInfo.prodName+" "+$scope.poLineList[e].vPoInfo.prodScale),prodAnswerCon.find(".prodCode").eq(e).find("b").html($scope.poLineList[e].vPoInfo.prodCode),prodAnswerCon.find(".prodDetail").eq(e).find("p").html($scope.poLineList[e].vPoInfo.prodName+" "+$scope.poLineList[e].vPoInfo.prodScale),$("#popup_btn_container").trigger("click")})},editHeadInfo:function(e){var a=this,o="";return o+='<div id="reviseBaseInfo" class="m-item"><h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>客户单号：</span><b>'+a.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+a.orderInfo.companyAbbr+'</li>		<li><span>交易币别：</span><em id="currencyId">'+($currencyData.currencyInfo.currencyName||"")+'</em></li>		<li><span>交易税种：</span><em id="currTax" class="currTax">'+$taxData.taxInfo.taxName+'</em><label class="checkbox'+(1==a.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+'%</label></li>		<li><span>销售日期：</span><em id="poFormDate">'+transDate((new Date).getTime())+'</em></li>	</ul></div></div><div class="m-item">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="m-select clearfix">			<span class="c-label">交易币别：</span>			<div id="currency" class="c-cont">				<div id="currencyName" class="select3-input"></div>				<div class="curSelect"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">交易税种：</span>			<div class="c-cont">				<div id="taxType" class="select3-input"></div>				<p><label class="checkbox'+(1==a.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+'%</label></p>			</div>		</section>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveHeadInfo" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},taxTypeSelect:function(){var e=this,a=[];if($taxListData.success)for(var o=0,n=$taxListData.taxList.length;n>o;o++)"1"==e.orderInfo.isContainTax?$taxListData.taxList[o].isContainTax==e.orderInfo.isContainTax&&$taxListData.taxList[o].taxRate==e.orderInfo.taxRate&&a.push($taxListData.taxList[o].taxName):$taxListData.taxList[o].isContainTax==e.orderInfo.isContainTax&&a.push($taxListData.taxList[o].taxName);else a.push($taxData.taxInfo.taxName);e.initSelect3("#taxType",a,$taxData.taxInfo.taxName)},currencyListSelect:function(){var e=this,a=[];$scope.currencyName.length>0?a=$scope.currencyName:a.push($currencyData.currencyInfo.currencyName),e.initSelect3("#currencyName",a,$currencyData.currencyInfo.currencyName)},editBodyInfo:function(e,a){var o=this,n="",r=$scope.poLineList[e],t=(r.poSubLineList.length,!0);return r.vAnswerUnitName==r.vValuationUnitName&&(t=!1),n+='<div class="m-item">	<h2 class="m-title">产品明细</h2>	<div class="item-wrap">		<ul>			<li><span>物料编码：</span>'+r.vPoInfo.prodCode+"</li>			<li><span>物料详细：</span><p>"+r.vPoInfo.prodName+" "+r.vPoInfo.prodScale+"</p></li>			<li><section><span>数量：</span>"+r.vPurchaseQty+r.vAnswerUnitName+(t?"/"+r.vValuationQty+r.vValuationUnitName:"")+"</section><section><span>交期：</span>"+r.vExpectedDelivery+'</section></li>			<li><span class="price">单价：</span>'+$currencySymbol+formatMoney(1===o.orderInfo.isContainTax?r.vTaxPrice:r.vPrice)+"/"+r.vValuationUnitName+'</li>		</ul>	</div></div><div class="m-item m-item-units">	<h2 class="m-title">销售订单信息维护</h2>	<div class="item-wrap">		<section class="clearfix">			<span class="c-label"><b>我方编码：</b></span>			<div class="wfItem">				<p class="wfItem-int"><input type="text" class="s-int" value="'+r.vPoInfo.prodCode+'" /><i class="i-search"></i></p>				<p>'+r.vPoInfo.prodName+" "+r.vPoInfo.prodScale+'</p>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label"><b>数量：</b></span>			<div class="c-cont">				<div class="c-cont-item">					<span>'+r.purchaseQty+'</span>					<div id="purchaseQty_'+e+'" class="select3-input select3-unit" data-index="0"></div>				</div>',t&&(n+='				<div class="c-cont-item">					<span>'+r.valuationQty+'</span>					<div id="valuationQty_'+e+'" class="select3-input select3-unit" data-index="1"></div>				</div>'),n+='			</div>		</section></div></div><div class="btn-wrap"><a href="javascript:;" id="saveBodyInfo" class="btnB" data-scrollTop="'+a+'" data-index="'+e+'">完成</a></div>'},units:function(e){var a=this,o=[],n=[];$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"serviceId":"B01_findProdUnitListByProd","companyId":["'+_vParams.companyId+'"],"prodId":"'+$scope.poLineList[e].prodId+'",'+a.tokens+',"commonParam":'+a.commonParam+"}"},success:function(a){if(a.success&&!isEmpty(a.prodUnitList[0]))for(var r=a.prodUnitList,t=0,i=r.length;i>t;t++)o.push(r[t].prodUnitName),n.push(r[t].basicUnitName);else o.push($scope.poLineList[e].purchaseUnitName),n.push($scope.poLineList[e].valuationUnitName)}}),a.initSelect3("#purchaseQty_"+e,o,$scope.poLineList[e].purchaseUnitName),a.initSelect3("#valuationQty_"+e,n,$scope.poLineList[e].valuationUnitName);var r=$(".m-item-units").find(".m-select");r.find(".select3-input").change(function(){var e=$(this),a=e.attr("data-index"),o=e.select3("value");e.parents(".m-item-units").find(".select3-input").forEach(function(e){$(e).attr("data-index")==a&&$(e).find(".select3-single-selected-item").attr("data-item-id",o).text(o)})})},editProdCode:function(e,a){var o=this,n={prodCode:e,companyId:_vParams.companyId,serviceId:"B01_getProdInfoByCode",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",n,function(e){return e.success?void(isEmpty(e.prodInfo)?o.popup("alert","","无对应商品！"):a&&a(e)):(o.popup("alert","",e.errorMsg),!1)})},editOthersCost:function(e){for(var a=this,o=a._othersCost,n=o.length,r=$(".showItemCon").find(".costName"),t='<div class="m-item"><h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>',i=0;n>i;i++)t+="<li><span>"+r.eq(i).attr("data-costName")+"：</span><b>"+$currencySymbol+formatMoney(o[i].vCostAmount,$amountDecimalNum)+"</b></li>";t+="</ul></div></div>",t+='<div class="m-item"><h2 class="m-title">订单其他费用维护</h2><div class="item-wrap">';for(var c=0;n>c;c++)t+='<section class="m-select clearfix">	<div class="c-cont c-cont2">		<input type="text" class="costName" value="'+r.eq(c).attr("data-costName")+'">		<p class="fy">'+$currencySymbol+formatMoney(o[c].vCostAmount,$amountDecimalNum)+"</p>	</div></section>";return t+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveOthersCost" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},editPayInfo:function(e){var a=this,o=a.orderInfo;return html='<div id="payInfoList" class="m-item">	<div class="item-wrap">		<ul>			<li><span>交易条件：</span><p id="jyCurrVal">'+$scope.privateDefultConditionName+'</p></li>			<li><span>物流方式：</span><p><em id="logisticsVal">'+$logisticsType.currValue+"</em></p></li>			<li><span>物流商：</span><p>"+o.logisticsName+"</p></li>			<li><span>"+(3==$logisticsType.logisticsType?"自提点":"收货地址")+"：</span><p>"+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+'</p></li>			<li><span>收款条件：</span><p id="payWayName">'+$payWayTypeData.payWayName+"</p></li>",html+=1==o.invoice?"<li><span>发票信息：</span><p>"+enumFn(a.invoiceInfoName,o.invoice)+"</p></li>":"<li><span>发票类型：</span><p>"+enumFn(a.invoiceType,o.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+o.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+o.invoiceContent+"</p></li>",html+='		</ul>	</div></div><div id="rePayInfoList" class="m-item">	<div class="item-wrap">		<section class="m-select clearfix">			<span class="c-label">交易条件：</span>			<div class="c-cont">				<div id="dealType" class="select3-input"></div>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">物流方式：</span>			<div class="c-cont">				<div id="logisticsType" class="select3-input"></div>			</div>		</section>		<section id="address" class="clearfix">			<span class="c-label">'+(3==$logisticsType.logisticsType?"自提点":"收货地址")+'：</span>			<div class="c-cont">				<p class="c-txt">'+o.provinceName+o.cityName+o.districtName+o.address+"<br>收货人："+o.contactPerson+"，电话："+o.mobile+'</p>			</div>		</section>		<section class="m-select clearfix">			<span class="c-label">收款条件：</span>			<div class="c-cont">				<div id="checkoutType" class="select3-input"></div>			</div>		</section>	</div></div><div class="btn-wrap"><a href="javascript:;" id="savePayInfo" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},conditionSelect:function(){var e=this,a=[];if($conditionData.success){if(0==$conditionData.conditionList.length)return a.push($scope.privateDefultConditionName),e.initSelect3("#dealType",a,$scope.privateDefultConditionName),!1;for(var o=$conditionData.conditionList.length,n=0;o>n;n++)a.push($conditionData.conditionList[n].conditionName);e.initSelect3("#dealType",a,$scope.privateDefultConditionName)}else a.push($scope.privateDefultConditionName),e.initSelect3("#dealType",a,$scope.privateDefultConditionName)},LogisticalSelect:function(){var e=this,a=[];e.logisticsType.forEach(function(e){a.push(e.Value)}),e.initSelect3("#logisticsType",a,$logisticsType.currValue)},payWaySelect:function(){var e=this,a=[];if(!$payWayData.success)return a.push(e.orderInfo.payWayName),e.initSelect3("#checkoutType",a,e.orderInfo.payWayName),!1;for(var o=$payWayData.payWayList,n=o.length,r=0;n>r;r++)a.push(o[r].payWayName);e.initSelect3("#checkoutType",a,$payWayTypeData.payWayName)},editRemark:function(e){var a=this,o='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+a.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+a.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>附件：</h2>';0==$fileData.fileList.length&&(o+="<p><b>0个附件</b></p>");for(var n=0;n<$fileData.fileList.length;n++)o+='<p><a href="'+$fileData.fileList[n].fileUrl+'"><i class=i-'+(_reg.test($fileData.fileList[n].fileName)?"image":"word")+"></i>"+$fileData.fileList[n].fileName+"</a></p>";return o+='</div><div id="remarks" class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写备注信息"></textarea></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,a,o,n,r,t){new Popup({type:e,title:a,content:o,ok:t?t:"确定",cancel:"取消",closeCallBack:n,okCallBack:r})},returnSale:function(){var e=this,a=$taxData.taxInfo.taxName,o=$taxData.taxInfo.taxCode,n=$taxData.taxInfo.taxId,r=$taxData.taxInfo.taxRate,t=$taxData.taxInfo.isContainTax;if(isEmpty(privateDefultUser))var i=e.orderInfo.poManCode,c=e.orderInfo.poManId,s=e.orderInfo.poManName,d=e.orderInfo.poManPid;else var i=privateDefultUser.employeeCode,c=privateDefultUser.employeeId,s=privateDefultUser.employeeName,d=privateDefultUser.memberId;if(addval_conditionInfo)var l=$scope.privateDefultConditionName,p=$conditionJson.id,m=$conditionJson.conditionCode;else var l=$scope.privateDefultConditionName,p="",m="";var u=$payWayTypeData.payWayName,v=$payWayTypeData.payWayId,y=$payWayTypeData.payWayCode,f=e.orderInfo.logisticsName||"ＥＭＳ",I="",N=[];$fileData.fileList.forEach(function(e){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,N.push(a)});var C={vOtherCostTotal:e.orderInfo.vOtherCostTotal||0,vTotalAmount:e.orderInfo.vTotalAmount,vTaxTotal:e.orderInfo.vTaxTotal,vTotal:e.orderInfo.vTotal},h={vendorId:e.orderInfo.vendorId.toString(),vendorName:e.orderInfo.vendorName,vendorCode:e.orderInfo.vendorCode,vendorAbbr:e.orderInfo.vendorAbbr,poAnswerId:_vParams.poAnswerId,poId:e.orderInfo.id,poFormNo:e.orderInfo.poFormNo,poInsideNo:e.orderInfo.poInsideNo,currencyId:$currencyData.currencyInfo.id,currencyCode:$currencyData.currencyInfo.currencyCode,currencyName:$currencyData.currencyInfo.currencyName,pCurrencyCode:$currencyData.currencyInfo.currencyCodeP,pCurrencyName:$currencyData.currencyInfo.currencyNameP,currencySymbol:$currencyData.currencyInfo.currencySymbol,localCurrencyCode:e.addval_localCurrencyCode,localCurrencyId:e.addval_localCurrencyId,localCurrencyName:e.addval_localCurrencyName,exchangeRate:e.addval_exchangeRate,taxId:n,taxName:a,taxCode:o,isContainTax:t,taxRate:r,provinceCode:e.orderInfo.provinceCode,provinceName:e.orderInfo.provinceName,customerCode:e.orderInfo.companyCode,customerId:e.orderInfo.companyId,customerAbbr:e.orderInfo.companyAbbr,customerName:e.orderInfo.companyName,soFormDate:(new Date).getTime(),soInsideNo:"",soManCode:i,soManId:c,soManName:s,soManPid:d,priceDecimalNum:e.orderInfo.priceDecimalNum,amountDecimalNum:e.orderInfo.amountDecimalNum,lockVersion:e.orderInfo.lockVersion},P={logisticsCode:I,logisticsName:f,logisticsType:$logisticsType.logisticsType,contactPerson:e.addval_contactPerson,cityName:e.addval_cityName,cityCode:e.addval_cityCode,provinceCode:e.addval_provinceCode,provinceName:e.addval_provinceName,countryName:e.addval_countryName,countryCode:e.addval_countryCode,districtCode:e.addval_districtCode,districtName:e.addval_districtName,invId:e.addval_invId,invCode:e.addval_invCode,invName:e.addval_invName,addressId:e.addval_addressId,address:e.addval_address,mobile:e.addval_mobile,payWayId:v,payWayName:u,payWayCode:y,conditionCode:m,conditionName:l,conditionId:p,invoice:e.orderInfo.invoice,invoiceType:e.orderInfo.invoiceType,invoiceContent:e.orderInfo.invoiceContent,invoiceHeader:e.orderInfo.invoiceHeader,invoiceName:e.orderInfo.invoiceName,invoiceAccount:e.orderInfo.invoiceAccount,invoiceTel:e.orderInfo.invoiceTel,invoiceBank:e.orderInfo.invoiceBank,invoiceAddress:e.orderInfo.invoiceAddress,invoicePayMark:e.orderInfo.invoicePayMark},D={agreement:e.orderInfo.agreement,vRemark:$myRemarkVal,remark:e.orderInfo.remark},b=e._othersCost,x=[];
if($scope.poLineList.forEach(function(e){if(isEmpty(e.purchaseUnitInfo))var a="",o="",n=e.purchaseUnitName;else var a=e.purchaseUnitInfo.prodUnitCode,o=e.purchaseUnitInfo.id,n=e.purchaseUnitInfo.prodUnitName;if(isEmpty(e.valuationUnitInfo))var r="",t="",i=e.valuationUnitName;else var r=e.valuationUnitInfo.prodUnitCode,t=e.valuationUnitInfo.id,i=e.valuationUnitInfo.prodUnitName;e.purchaseUnitId==e.valuationUnitId&&(t=o,r=a,i=n);var c={fileList:[],expectedDelivery:new Date(e.expectedDelivery).getTime(),vProdId:e.vPoInfo.id,vProdName:e.vPoInfo.prodName,vProdDesc:e.vPoInfo.prodDesc,vProdCode:e.vPoInfo.prodCode,vProdScale:e.vPoInfo.prodScale,vFileCount:e.vFileList.length,vRemark:e.vRemark,cProdId:e.prodId,cProdName:e.prodName,cProdCode:e.prodCode,cProdScale:e.prodScale,cProdDesc:e.prodDesc,fileCount:e.fileCount,remark:e.remark,invName:e.invName,invCode:e.invCode,invId:e.invId,taxPrice:e.taxPrice,taxLineTotal:e.taxLineTotal,salesQty:e.purchaseQty,salesUnitId:o,salesUnitCode:a,salesUnitName:n,valuationQty:e.valuationQty,valuationUnitId:t,valuationUnitCode:r,valuationUnitName:i,poLineId:e.id,poLineNo:e.lineNo,lineNo:e.lineNo,price:e.price,lineAmount:e.lineAmount,locationId:e.localtionId,locationCode:e.localtionCode,locationName:e.localtionName,deliveryValuationQty:0,deliveryQty:0,receiveValuationQty:0,receiveQty:0,returnQty:0,returnValuationQty:0,exchangeQty:0,exchangeValuationQty:0};e.vFileList.forEach(function(e){var a={};a.lineNo=e.lineNo,a.fileSource=e.fileSource,a.fileUrl=e.fileUrl,a.fileName=e.fileName,a.fileSize=e.fileSize,a.fileKey=e.fileKey,a.remark=e.remark,c.fileList.push(a)}),x.push(c)}),""==h.vendorId)return void e.popup("alert","","企业ID 为空！");if(""==h.currencyName)return void e.popup("alert","","交易币别 为空！");if(0!=h.isContainTax&&1!=h.isContainTax)return void e.popup("alert","","是否含税 不正确！");if(1!=P.invoice&&""==P.invoiceType)return void e.popup("alert","","发票类型 为空！");if(1!=P.invoice&&1==P.invoiceType&&(""==P.invoiceHeader||""==P.invoiceContent))return void e.popup("alert","","发票抬头或发票内容 为空！");if(1!=P.invoice&&1!=P.invoiceType&&""==P.invoiceAccount)return void e.popup("alert","","发票账号 为空！");if(""==P.logisticsType)return void e.popup("alert","","物流方式 为空！");if(""==P.conditionName)return void e.popup("alert","","交易条件名称 为空！");if(void 0!=h.exchangeRate&&isNaN(1*h.exchangeRate))return void e.popup("alert","","汇率应为整数或小数！");var _={saleOrderFile:N,orderTotalAmount:C,baseInfo:h,prodDetailList:x,payInfo:P,appendContact:D,otherCostList:b,serviceId:"B03_poAnswerToSalesOrder",commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};$.ajax({type:"POST",url:config.serviceUrl,data:{param:JSON.stringify(_)},success:function(a){a=a||{},a.success?($scope.pageState="success",$scope.success_soFormNo=a.soFormNo,$scope.success_soFormId=a.id,fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):e.popup("alert","","错误提示信息："+a.errorMsg)}})}};