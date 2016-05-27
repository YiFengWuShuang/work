var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,salesDetail=function(){this.init()};salesDetail.prototype={init:function(){var a=this;a.commonParam=JSON.stringify(commonParam()),a.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',a.totals=0,a.load=!1,a.memberId="",setTimeout(function(){container.show(),fnTip.hideLoading()},0),a.orderBaseInfo(),a.prodsInfo(),a.otherCostList(),a.fileList(),a.start()},orderBaseInfo:function(){var a=this,e="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getSalesOrderInfo", "id":"'+_vParams.id+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(s){s=s||{},s.success&&(a.orderInfo=s.salesOrderInfo,a.status=a.orderInfo.status,a.memberId=a.orderInfo.mobile,e+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>采购单号：</span><b>'+a.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+a.orderInfo.soInsideNo+"</b></li>		<li><span>销售日期：</span>"+transDate(a.orderInfo.soFormDate)+"</li>		<li><span>交易币种：</span>"+a.orderInfo.currencyCode+"-"+a.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+a.orderInfo.taxName+(1===a.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+100*a.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>交易条件：</span>"+a.orderInfo.conditionName+"</li>		<li><span>收款条件：</span>"+a.orderInfo.payWayName+"</li>		<li><span>业务员：</span>"+a.orderInfo.soManName+"</li>	</ul></div>",$("#orderBaseInfo").html(e))}})},fileList:function(){var a=this;$.ajax({type:"POST",url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":1,"searchType":2,"id":"'+_vParams.id+'","docType":"12", "commonParam":'+a.commonParam+"}"},success:function(e){if(e=e||{},e.success){for(var s=e.fileList,o=s.length,n=0;o>n;n++)""!=s[n].fileName&&$(".files").eq(n).html('<span>附件：</span><a href="'+s[n].fileUrl+'"><i class=i-'+(_reg.test(s[n].fileName)?"image":"word")+"></i>"+s[n].fileName+"</a>").show();a._files=s}}})},prodsInfo:function(){var a=this,e="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_findSoLineList", "soId":"'+_vParams.id+'", "companyId":['+parseInt(_vParams.companyId)+'], "commonParam":'+a.commonParam+" }"},success:function(s){if(s=s||{},s.success){var o=s.prodDetailList;e='<h2 class="m-title">产品明细</h2>';for(var n=0,i=o.length;i>n;n++)e+='<div class="item-wrap">	<ul>		<li><span>客户编码：</span><b>'+o[n].cProdCode+"</b></li>		<li><span>物料详细：</span><p>"+o[n].cProdName+"  "+o[n].cProdDesc+"</p></li>		<li><span>本方编码：</span><b>"+o[n].vProdCode+"</b></li>		<li><span>物料详细：</span><p>"+o[n].vProdName+"  "+o[n].vProdDesc+"</p></li>		<li><section><span>数量：</span>"+o[n].salesQty+o[n].salesUnitName+"/"+o[n].valuationQty+o[n].valuationUnitName+"</section><section><span>预交期：</span>"+transDate(o[n].expectedDelivery)+'</section></li>		<li><span class="price">单价：</span>&yen; '+formatMoney(1===a.orderInfo.isContainTax?o[n].taxPrice:o[n].price)+"/"+o[n].valuationUnitName+"</li>		<li><span>客户备注：</span><p>"+o[n].remark+'</p></li>		<li class="files"><span>附件：</span></li>'+(1===a.orderInfo.isContainTax?'<li class="subtotal"><span>含税小计：</span><b>&yen; '+formatMoney(o[n].taxLineTotal)+"</b></li>":'<li class="subtotal"><span>未税小计：</span><b>&yen; '+formatMoney(o[n].lineAmount)+"</b></li>")+"	</ul></div>",a.totals+=parseInt(o[n].taxLineTotal,10);a.load=!0,$("#prodListInfo").html(e),console.log(e)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+s.errorMsg+"</p>")}})},otherCostList:function(){var a=this,e="",s=0;$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"soId":"'+_vParams.id+'","companyId":['+parseInt(_vParams.companyId)+'],"commonParam":'+a.commonParam+',"serviceId":"B03_findSoOtherCostList",'+a.tokens+"}"},success:function(o){if(o=o||{},o.success){var n=o.soOtherCostList;e='<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';for(var i=0,t=n.length;t>i;i++)e+="<li><span>"+n[i].costName+"：</span><b>&yen; "+formatMoney(n[i].costAmount)+"</b></li>",s+=parseInt(n[i].costAmount,10);e+='<li class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(s)+"</b></li>",e+="</ul></div>",a.totals+=parseInt(s,10),$("#otherCost").html(e)}}})},start:function(){var a=this;$(".item-total").html("总金额：&yen; "+formatMoney(a.totals)).show(),a.load&&(1==a.status?bottomBar(["share"],a.memberId,"","出货"):bottomBar(["share"],a.memberId,!0)),container.on("click","a.item-link",function(){var e=$(this),s=e.attr("name"),o=$body.scrollTop();switch(s){case"payInfo":orderReviseInfoCon.html(a.payInfo(o));break;case"remark":orderReviseInfoCon.html(a.remark(o))}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var a=$(this),e=a.attr("data-scrollTop");container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(e)},200)}),$body.on("click",".bottom-btn-confirm",function(){})},payInfo:function(a){var e=this,s=e.orderInfo;requestFn("B02_LogisticsType",function(a){"0"==a.errorCode&&(e.logisticsType=a.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(a){"0"==a.errorCode&&(e.invoiceType=a.dataSet.data.detail)});var o='<ul class="payInfoList"><li><span>交易条件：</span><p>'+s.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,s.logisticsType)+("3"==s.logisticsType?"（自提点："+s.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+s.address+"；"+(""==s.mobile?"":"<br>收货人："+s.contactPerson+"，电话："+s.mobile)+"</p></li><li><span>付款条件：</span><p>"+s.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(e.invoiceType,s.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+s.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+s.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return o},remark:function(a){for(var e=this,s='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',o=0;o<e._files.length;o++)s+='<p><a href="'+e._files[o].fileUrl+'"><i class=i-'+(_reg.test(e._files[o].fileName)?"image":"word")+"></i>"+e._files[o].fileName+"</a></p>";return s+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},popup:function(a,e,s,o,n){new Popup({type:a,title:e,content:s,ok:"确定",cancel:"取消",closeCallBack:o,okCallBack:n})}};