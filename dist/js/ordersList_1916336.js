var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._lineLists=[],e._othersCost=[],e.vStatus,e.totals=0,e.load=!1,e.memberId="",e.start(),$(".contarin").on("click","span.edit",function(){var t=$(this),a=t.parent(".item-wrap"),s=a.attr("data-index");return t.is(".editOther")?(e.editResponseCost(a,s),e.addNewCost(),!1):(e.editResponse(a,s),void e.addNewResponse(s))}),$("#prodAnswerInfo").on("input","input.int02",function(){var t=$(this),a=0,s=t.parents(".responseBox"),n=s.attr("data-index"),o=t.val(),i=e._lineLists[n].valuationQty;a=e.reQtys(s,n),o>i-(a-o)&&t.val(i-(a-o))}),e.dateFn(),e.hideTip(),$(".item-total").html("总金额：&yen;"+formatMoney(e.totals)).show(),5==e.vStatus&&$(".item-total-dj").html("答交总金额：&yen;"+formatMoney(e.reCostTotalFn())).show(),e.delResponse()},orderBaseInfo:function(){var e=this,t="",a={serviceId:"B03_getPurchaseOrderAnswerInfo",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success&&(e.orderInfo=a.poAnswerOrderInfo,e.memberId=e.orderInfo.auditid,t+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+e.orderInfo.companyName+"</li>		<li><span>交易货币：</span>"+e.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+e.orderInfo.taxName+(1===e.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+e.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购日期：</span>"+e.orderInfo.poFormDate+"</li>	</ul></div>",e.vStatus=e.orderInfo.vStatus)}}),t},fileList:function(){var e=this,t=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;if(e.load){var a={secretNumber:_vParams.secretNumber,token:_vParams.token,serviceId:"B01_findFileList",companyId:_vParams.companyId,fileSource:"1",searchType:"1",id:_vParams.id,docType:_vParams.docType};$.ajax({type:"POST",url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(e){if(e=e||{},e.success)for(var a=e.fileList,s=0,n=a.length;n>s;s++)""!=a[s].fileName&&$(".files").eq(s).html('<span>附件：</span><a href="'+a[s].fileUrl+'"><i class=i-'+(t.test(a[s].fileName)?"image":"word")+"></i>"+a[s].fileName+"</a>").show()}})}},prodAnswerInfo:function(){var e=this,t="",a={serviceId:"B03_findPoAnswerLineList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var s=a.poLineList;e._lineLists=s,t='<h2 class="m-title">产品信息</h2>';for(var n=0,o=s.length;o>n;n++){t+='<div class="item-wrap" data-index="'+n+'">	<ul>		<li class="prodCode" data-prodCode="'+s[n].prodCode+'" data-prodId="'+s[n].prodId+'"><span>物料编码：</span><b>'+s[n].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+s[n].prodName+" "+s[n].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+s[n].purchaseQty+"</em>"+s[n].purchaseUnitName+"/<em>"+s[n].valuationQty+"</em>"+s[n].valuationUnitName+"</section><section><span>交期：</span><em>"+s[n].expectedDelivery+"</em></section></li>";for(var i=0;i<s[n].poSubLineList.length;i++)t+='<li class="response"><section><span>数量：</span><em>'+s[n].poSubLineList[i].purchaseQty+"</em>"+s[n].purchaseUnitName+"/<em>"+s[n].poSubLineList[i].valuationQty+"</em>"+s[n].valuationUnitName+"</section><section><span>交期：</span><em>"+s[n].poSubLineList[i].expectedDelivery+"</em></section></li>";t+='		<li class="price"><span>单价：</span>&yen; '+formatMoney(s[n].vTaxPrice)+"/"+s[n].valuationUnitName+"</li>		<li><span>备注：</span><p>"+s[n].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal" data-total="'+s[n].taxLineTotal+'" data-vTotal="'+(s[n].poSubLineList.length>0?s[n].vTaxLineTotal:s[n].taxLineTotal)+'"><span>小计：</span><b>&yen; '+formatMoney(s[n].taxLineTotal)+"</b></li>"+(s[n].poSubLineList.length>0?'<li class="response responseTotal"><span>答交金额：</span>&yen; '+formatMoney(s[n].vTaxLineTotal)+"</li>":"")+"	</ul>"+(5==e.vStatus?"":'<span class="edit"></span>')+"</div>",e.totals+=parseInt(s[n].taxLineTotal,10)}e.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+a.errorMsg+"</p>")}}),t},editResponse:function(e,t){function a(){var t=e.find(".response").not(".responseTotal"),a=t.length,s="";if(0!=a)for(var n=0;a>n;n++){var o=t.eq(n).find("em");s+='<li class="myResponse"><span>答交：</span><input type="text" class="int01" value="'+o.eq(0).html()+'"><input type="text" class="int02" value="'+o.eq(1).html()+'"><div class="timeBox">'+o.eq(2).html()+'</div><input type="hidden" value="'+o.eq(2).html()+'"><i class="btn-del"></i></li>'}return s}var s,n,o,i=this,r=i._lineLists,l=(r[t].vProdCode,$(".prodCode").eq(t).attr("data-prodCode")),p=$(".prodCode").eq(t).attr("data-prodId"),d={serviceId:"B01_getProdByCustomerProd",token:_vParams.token,secretNumber:_vParams.secretNumber,vendorId:_vParams.vendorId,cProdCode:l,commonParam:commonParam(),customerId:p};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(d),success:function(e){$(".ball-clip-rotate").remove(),e=e||{},e.success&&(s=e.prodMap.prodCode,n=e.prodMap.prodName,o=e.prodMap.prodScale)}});var c='<div class="responseBox" data-index="'+t+'"><ul class="responseBox1">	<li>		<span>对方：</span>		<p>物料编码：'+r[t].vProdCode+"<br>"+r[t].prodName+" "+r[t].prodScale+'</p>	</li>	<li class="myProductInfo">		<span>我方：</span>		<p>物料编码：'+s+"<br>"+n+" "+o+"</p>	</li>	<li><span>数量：</span><em>"+r[t].purchaseQty+r[t].purchaseUnitName+" /</em><em>"+r[t].valuationQty+r[t].valuationUnitName+'</em><span>交期：</span><em class="em03">'+r[t].expectedDelivery+"</em></li>"+a()+'</ul><div class="btnBox"><a href="javascript:;" class="addResponse">新增答交栏</a></div><ul class="responseBox2">	<li><span>单价：</span>¥'+formatMoney(r[t].vTaxPrice)+"/"+r[t].valuationUnitName+"</li>	<li><span>备注：</span><p>"+r[t].remark+'</p></li>	<li class="subtotal"><span>小记：</span><b>&yen; '+formatMoney(r[t].taxLineTotal)+'</b></li></ul><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>';e.hide(),e.after(c),$body.append(formTip),$("#prodAnswerInfo").on("click",".btn-cancel",function(e){i.cancel($(this),$("#prodAnswerInfo")),e.preventDefault()}),$("#prodAnswerInfo").on("click",".btn-save",function(e){i.save($(this),$("#prodAnswerInfo")),e.preventDefault()})},itemshow:function(e,t){var a=e.parents(".responseBox").attr("data-index");e.parents(".responseBox").remove(),t.find(".item-wrap").eq(a).show(),$("#formTip").remove()},addNewResponse:function(e){var t=this,a=!0,s=t._lineLists[e].valuationQty,n='<li class="myResponse"><span>答交：</span><input type="text" class="int01" /><input type="text" class="int02" /><div class="timeBox"></div><input type="hidden" /><i class="btn-del"></i></li>';$body.on("click",".addResponse",function(){var o=$(this),i=o.parents(".responseBox"),r=i.find(".responseBox1"),l=r.find("li:last-child").find("input");a=!0,t.reQtys(i,e)!=s&&(l.length>1&&l.forEach(function(e){return""==e.value?($("#formTip").html("新增答交内容为空不能继续新增！").addClass("formTipShow"),void(a=!1)):void 0}),a&&r.append(n))})},othersCost:function(){var e=this,t="",a=0,s=0,n=!1;if(e.load){var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoAnswerOtherCostList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam()};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var i=o.poOthreCostList;e._othersCost=i,t='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,l=i.length;l>r;r++)t+='<li data-costName="'+i[r].costName+'" data-costAmount="'+i[r].costAmount+'" data-vCostAmount="'+i[r].vCostAmount+'"><span>'+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+'</b><b class="dj"><em class="money" data-money="'+(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount)+'">'+(""==i[r].vCostAmount?"":formatMoney(i[r].vCostAmount))+"</em></b></li>",a+=parseInt(i[r].costAmount,10),s+=parseInt(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount,10),""!=i[r].vCostAmount&&(n=!0);t+='<li id="othersCostSubtotal" class="subtotal" data-total="'+a+'" data-vTotal="'+(n?s:a)+'"><span>小计：</span><b>&yen; '+formatMoney(a)+"</b></li>",n&&(t+='<li id="changeCost" class="response"><span>变更费用：</span>&yen; '+formatMoney(s)+"</li>"),t+="</ul>",t+=5==e.vStatus?"":'<span class="edit editOther"></span>',t+="</div>",e.totals+=parseInt(a,10)}}}),t}},editResponseCost:function(e){function t(){var t=$(e).find(".response").not("#changeCost"),a=t.length,s="";if(0!=a)for(var n=0;a>n;n++)s+='<li class="addNewCost"><input type="text" value="'+t.eq(n).attr("data-costname")+'"><input type="text" value="'+t.eq(n).attr("data-vcostamount")+'"><i class="btn-del"></i></li>';return s}for(var a=this,s=a._othersCost,n=s.length,o='<div class="responseBox" data-index="0"><ul class="responseCost">',i=0;n>i;i++){var r=""==$("#othersCost .dj").eq(i).find("em").html()?"":$("#othersCost .dj").eq(i).find("em").attr("data-money");o+="<li><span>"+s[i].costName+"：</span><b>&yen; "+formatMoney(s[i].costAmount)+'</b><input type="text" class="original" id="dj_'+i+'" value="'+r+'" /></li>'}o+=t(),o+='</ul><div class="btnBox"><a href="javascript:;" class="addCost">新增费用</a></div><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>',e.hide(),e.after(o),$body.append(formTip),$("#othersCost").on("click",".btn-cancel",function(e){a.cancel($(this),$("#othersCost")),e.preventDefault()}),$("#othersCost").on("click",".btn-save",function(e){a.save($(this),$("#othersCost")),e.preventDefault()})},addNewCost:function(){var e=!0,t='<li class="addNewCost"><input type="text" /><input type="text" /><i class="btn-del"></i></li>';$body.on("click",".addCost",function(){var a=$(this),s=a.parents(".responseBox").find(".responseCost"),n=s.find("li:last-child").find("input");e=!0,n.length>1&&n.forEach(function(t){return""==t.value?($("#formTip").html("新增费用内容为空不能继续新增！").addClass("formTipShow"),void(e=!1)):void 0}),e&&s.append(t)})},cancel:function(e,t){var a=this;a.itemshow(e,t)},save:function(e,t){var a=this,s=e.parents(".m-item");if(s.is("#prodAnswerInfo")){{var n=e.parents(".responseBox").find("li.myResponse");n.length}a.createResponse($(".myResponse"),3,e,t,"isProdAnswer")}else if(s.is("#othersCost")){for(var o=$(".original").length,i=0;o>i;i++){var r=$(".original").eq(i).val();""!=r&&$("#othersCost .dj").eq(i).html('&yen; <em class="money" data-money="'+r+'">'+formatMoney(r)+"</em>")}a.createResponse($(".addNewCost"),2,e,t,"isOtherCost")}},createResponse:function(e,t,a,s,n){for(var o=this,i=e.length,r="",l=new Array,p=o._lineLists,d=a.parents(".responseBox").attr("data-index"),c=0;i>c;c++){l[c]=new Array;for(var m=0;t>m;m++){var v=e.eq(c).find("input").eq(m),u=v.val();if(""==u)return v.focus(),!1;l[c][m]=u}}for(var f=0;i>f;f++)r+="isProdAnswer"==n?'<li class="response"><section><span>数量：</span><em>'+l[f][0]+"</em>"+p[d].purchaseUnitName+"/<em>"+l[f][1]+"</em>"+p[d].valuationUnitName+"</section><section><span>交期：</span><em>"+l[f][2]+"</em></section></li>":'<li class="response" data-costName="'+l[f][0]+'" data-costAmount="" data-vCostAmount="'+l[f][1]+'"><span><em>'+l[f][0]+'</em>：</span><b></b><b class="dj">&yen; <em class="money" data-money="'+l[f][1]+'">'+formatMoney(l[f][1])+"</em></b></li>";if(o.itemshow(a,s),s.find(".item-wrap").eq(d).find(".response").remove(),"isProdAnswer"==n){s.find(".item-wrap").eq(d).find(".price").before(r);var h=o.reQtys(a.parents(".responseBox"),d);if(""!=h||void 0!=h){var y=s.find(".item-wrap").eq(d).find(".subtotal"),b=y.attr("data-total");0==h?y.attr("data-vtotal",b):y.attr("data-vtotal",h*p[d].vTaxPrice),""!==r&&s.find(".item-wrap").eq(d).find("ul").append('<li class="response responseTotal"><span>答交金额：</span>&yen; '+formatMoney(h*p[d].vTaxPrice)+"</li>")}}else{$("#othersCostSubtotal").before(r);var C=0,I=!1;s.find(".item-wrap").eq(d).find("em.money").each(function(){var e=$(this).html();""!=e&&(I=!0),e=""==e?$(this).attr("data-money"):e,C+=parseInt(e,10)}),I&&($("#othersCostSubtotal").attr("data-vtotal",C),$("#othersCostSubtotal").after('<li id="changeCost" class="response" data-otherMoney="'+C+'"><span>变更费用：</span>&yen; '+formatMoney(C)+"</li>"))}$(".item-total-dj").html("答交总金额：&yen;"+formatMoney(o.reCostTotalFn())).show()},popup:function(e,t,a,s,n){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:s,okCallBack:n})},delResponse:function(){var e=this,t="<p>您确定要删除此条答交？</p>";$(".contarin").on("click",".btn-del",function(){var a=$(this),s=a.parent("li");e.popup("confirm","",t,"",function(){s.remove()})})},dateFn:function(){$(".timeBox").mdater({minDate:new Date})},hideTip:function(){$body.on("focus",'input[type="text"]',function(){$("#formTip").removeClass("formTipShow")})},reQtys:function(e){var t=0;return e.find(".int02").each(function(){var e=$(this);t+=parseInt(e.val(),10)}),t},reCostTotalFn:function(){var e=0;return $(".contarin").find(".subtotal").each(function(){e+=parseInt($(this).attr("data-vtotal"),10)}),e},start:function(){var e=this,t=document.getElementById("orderAnswerInfo"),a=document.getElementById("prodAnswerInfo"),s=document.getElementById("othersCost");t&&(t.innerHTML=e.orderBaseInfo()),a&&(a.innerHTML=e.prodAnswerInfo(),e.fileList()),s&&(s.innerHTML=e.othersCost()),e.load&&bottomBar(["share"],e.memberId),container.on("click","a.item-link",function(){var t=$(this),a=t.attr("name"),s=$body.scrollTop();switch(a){case"payInfo":orderReviseInfoCon.html(e.payInfo(s));break;case"remark":orderReviseInfoCon.html(e.remark(s)),$("#intRemarks").val($("#vRemark").val())}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this),t=e.attr("data-scrollTop");e.is("#saveRemark")&&$("#vRemark").val($("#intRemarks").val()),container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn",function(){e.submitFn()})},payInfo:function(e){var t=this,a=t.orderInfo;requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(t.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(t.invoiceType=e.dataSet.data.detail)});var s='<ul class="payInfoList"><li><span>交易条件：</span><p>'+a.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(t.logisticsType,a.logisticsType)+("3"==a.logisticsType?"（自提点："+a.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+a.address+"；"+(""==a.mobile?"":"<br>电话："+a.mobile)+"</p></li><li><span>付款条件：</span><p>"+a.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(t.invoiceType,a.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+a.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+a.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return s},remark:function(e){var t=this,a='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+t.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+t.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div><div class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写我方备注"></textarea></div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return a},submitFn:function(){for(var e,t=new Array,a=$("#prodAnswerInfo").find(".item-wrap"),s=a.length,n=0;s>n;n++){var o=a.eq(n).find(".response").not(".responseTotal"),i=o.length,r=[];t[n]=new Array;for(var l=0;i>l;l++){var p=$(o[l]).find("em");t[n][l]={purchaseQty:p.eq(0).html(),valuationQty:p.eq(1).html(),expectedDelivery:(new Date).getTime(p.eq(2).html()).toString()},r.push(t[n][l])}t[n]={modiPoSubLineList:r}}for(var d=$("#othersCost").find("li").not("#othersCostSubtotal,#changeCost"),c=d.length,m=[],v=0;c>v;v++)m[v]={costName:d.eq(v).attr("data-costName"),costAmount:d.eq(v).attr("data-costAmount"),vCostAmount:d.eq(v).attr("data-vCostAmount")};e={modiPoLineList:t,modiPoOthreCostList:m,vRemark:$("#vRemark").val(),poAnswerId:_vParams.poAnswerId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber,vStatus:"2",serviceId:"B03_saveAnswerPo"},$.ajax({type:"POST",url:config.serviceUrl,data:JSON.stringify(e),success:function(e){e=e||{},e.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):fnTip.error(2e3)}})}};