var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),orderAnswerCon=$("#orderAnswerInfo"),prodAnswerCon=$("#prodAnswerInfo"),othersCostCon=$("#othersCost"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._othersCost=[],e.status,e.vStatus,e.totals=0,e.load=!1,e.memberId="",e.start(),container.on("click","span.edit",function(){var t=$(this),a=t.parent(".item-wrap"),n=a.attr("data-index");return t.is(".editOther")?(e.editResponseCost(a,n),e.addNewCost(),!1):(e.editResponse(a,n),void e.addNewResponse(n))}),e.dateFn(),e.hideTip(),e.delResponse()},orderBaseInfo:function(){var e=this,t="",a={serviceId:"B03_getPurchaseOrderAnswerInfo",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success&&(e.orderInfo=a.poAnswerOrderInfo,e.memberId=e.orderInfo.auditid,e.status=e.orderInfo.status,e.vStatus=e.orderInfo.vStatus,t+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+e.orderInfo.companyName+"</li>		<li><span>交易货币：</span>"+e.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+e.orderInfo.taxName+(1===e.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+e.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购日期：</span>"+e.orderInfo.poFormDate+"</li>	</ul></div>")}}),t},prodAnswerInfo:function(){var e=this,t="",a={serviceId:"B03_findPoAnswerLineList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var n=a.poLineList;e._lineLists=n,t='<h2 class="m-title">产品信息</h2>';for(var o=0,s=n.length;s>o;o++){t+='<div class="item-wrap" data-index="'+o+'">	<ul>		<li class="prodCode" data-prodCode="'+n[o].prodCode+'" data-prodId="'+n[o].prodId+'"><span>物料编码：</span><b>'+n[o].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[o].prodName+" "+n[o].prodScale+"</p></li>		<li><section><span>客户数量：</span><em>"+n[o].purchaseQty+"</em>"+n[o].purchaseUnitName+"/<em>"+n[o].valuationQty+"</em>"+n[o].valuationUnitName+"</section><section><span>交期：</span><em>"+n[o].expectedDelivery+"</em></section></li>"+(1==e.vStatus?"":'<li class="bfline"><section><span>本方数量：</span><em class="vPurchaseQty">'+n[o].purchaseQty+"</em>"+n[o].purchaseUnitName+'/<em class="vValuationQty">'+n[o].valuationQty+"</em>"+n[o].valuationUnitName+'</section><section><span>交期：</span><em class="vExpectedDelivery">'+n[o].expectedDelivery+"</em></section></li>");for(var i=0;i<n[o].poSubLineList.length;i++)t+='<li class="response"><section><span>分批答交：</span><em class="purchaseQty">'+n[o].poSubLineList[i].purchaseQty+"</em>"+n[o].purchaseUnitName+'/<em class="valuationQty">'+n[o].poSubLineList[i].valuationQty+"</em>"+n[o].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+n[o].poSubLineList[i].expectedDelivery+"</em></section></li>";t+='		<li class="price" data-taxPrice="'+n[o].taxPrice+'" data-price="'+n[o].price+'"><span>单价：</span>&yen; '+formatMoney(1===e.orderInfo.isContainTax?n[o].taxPrice:n[o].price)+"/"+n[o].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[o].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal" data-total="'+n[o].taxLineTotal+'" data-vTotal="'+(""!=n[o].vTaxLineTotal||0!=n[o].vTaxLineTotal?n[o].vTaxLineTotal:n[o].taxLineTotal)+'"><span>小计：</span><b>&yen; '+formatMoney(n[o].taxLineTotal)+"</b></li>"+(1!=e.vStatus?'<li class="response responseTotal" data-vLineAmount="'+n[o].vLineAmount+'" data-vTaxLineTotal="'+n[o].vTaxLineTotal+'"><span>答交金额：</span>&yen; '+formatMoney(""==n[o].vTaxLineTotal?n[o].taxLineTotal:n[o].vTaxLineTotal)+"</li>":"")+"	</ul>"+(2==e.vStatus?'<span class="edit"></span>':"")+"</div>",e.totals+=parseInt(n[o].taxLineTotal,10)}e.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+a.errorMsg+"</p>")}}),t},editResponse:function(e,t){function a(t){var a=e.find(".bfline");return a.find("em").eq(t).html()}function n(){var t=e.find(".response").not(".responseTotal"),a=t.length,n="";if(0!=a)for(var o=0;a>o;o++){var s=t.eq(o).find("em");n+='<li class="myResponse"><span'+(0==o?' class="nth0"':"")+'>分批：</span><input type="text" class="int01" name="int01" value="'+s.eq(0).html()+'"><input type="text" class="int02" name="int02" value="'+s.eq(1).html()+'"><div class="timeBox">'+s.eq(2).html()+'</div><input type="hidden" value="'+s.eq(2).html()+'"><i class="btn-del"></i></li>'}return n}var o,s,i,r=this,l=r._lineLists,d=l[t].prodCode,c=r.orderInfo.companyId,p={serviceId:"B01_getProdByCustomerProd",token:_vParams.token,secretNumber:_vParams.secretNumber,vendorId:_vParams.vendorId,cProdCode:d,commonParam:commonParam(),customerId:c};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(p),success:function(e){$(".ball-clip-rotate").remove(),e=e||{},e.success&&(o=e.prodMap.prodCode,s=e.prodMap.prodName,i=e.prodMap.prodScale)}});var m='<div class="responseBox" data-index="'+t+'"><ul class="responseBox1">	<li>		<span>对方：</span>		<p>物料编码：'+l[t].prodCode+"<br>"+l[t].prodName+" "+l[t].prodScale+'</p>	</li>	<li class="myProductInfo">		<span>我方：</span>		<p>物料编码：'+o+"<br>"+s+" "+i+"</p>	</li>	<li><span>数量：</span><em>"+l[t].purchaseQty+l[t].purchaseUnitName+" /</em><em>"+l[t].valuationQty+l[t].valuationUnitName+'</em><span>交期：</span><em class="em03">'+l[t].expectedDelivery+'</em></li>	<li class="bfline"><span>我方：</span><input type="text" class="int01_all" value="'+a(0)+'"><input type="text" class="int02_all" value="'+a(1)+'"><div class="timeBox">'+a(2)+'</div><input type="hidden" value="'+a(2)+'"></li>'+n()+'</ul><div class="btnBox"><a href="javascript:;" class="addResponse">新增答交栏</a></div><ul class="responseBox2">	<li><span>单价：</span>¥'+formatMoney(1===r.orderInfo.isContainTax?l[t].taxPrice:l[t].price)+"/"+l[t].valuationUnitName+"</li>	<li><span>备注：</span><p>"+l[t].remark+'</p></li>	<li class="subtotal"><span>小记：</span><b>&yen; '+formatMoney(l[t].taxLineTotal)+'</b></li></ul><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>';e.hide(),e.after(m),$body.append(formTip),$body.on("input","input.int01,input.int02",function(){r.reQtysAll($(this))}),prodAnswerCon.on("click",".btn-cancel",function(e){r.cancel($(this),prodAnswerCon),e.preventDefault()}),prodAnswerCon.on("click",".btn-save",function(e){e.preventDefault(),r.save($(this),prodAnswerCon),r.modiResponse($(this),t)})},itemshow:function(e,t){var a=e.parents(".responseBox").attr("data-index");e.parents(".responseBox").remove(),t.find(".item-wrap").eq(a).show(),$("#formTip").remove()},addNewResponse:function(e){var t=this,a=!0,n=(t._lineLists[e].valuationQty,'<li class="myResponse"><span>分批：</span><input type="text" class="int01" name="int01" /><input type="text" class="int02" name="int02" /><div class="timeBox"></div><input type="hidden" /><i class="btn-del"></i></li>');$body.on("click",".addResponse",function(){var e=$(this),t=e.parents(".responseBox"),o=t.find(".responseBox1"),s=o.find("li.myResponse").find("input");a=!0,s.length>1&&s.forEach(function(e){return""==e.value?($("#formTip").html("新增答交内容为空不能继续新增！").addClass("formTipShow"),void(a=!1)):void 0}),a&&o.append(n)})},othersCost:function(){var e=this,t="",a=0,n=0,o=!1;if(e.load){var s={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoAnswerOtherCostList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam()};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(s),success:function(s){if(s=s||{},s.success){var i=s.poOthreCostList;e._othersCost=i,t='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,l=i.length;l>r;r++)t+='<li class="mobiCostItem costItem" data-costName="'+i[r].costName+'" data-costAmount="'+i[r].costAmount+'" data-vCostAmount="'+i[r].vCostAmount+'"><span>'+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+'</b><b class="dj"><em class="money" data-money="'+(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount)+'">'+formatMoney(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount)+"</em></b></li>",a+=Number(""==i[r].costAmount?0:i[r].costAmount),n+=Number(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount),""!=i[r].vCostAmount&&(o=!0);t+='<li id="othersCostSubtotal" class="subtotal" data-total="'+a+'" data-vTotal="'+(o?n:a)+'"><span>客户小计：</span><b>&yen; '+formatMoney(a)+"</b></li>",t+='<li id="changeCost" class="response" data-otherMoney="'+n+'"><span>本方小计：</span>&yen; '+formatMoney(n)+"</li>",t+="</ul>",t+=2==e.vStatus?'<span class="edit editOther"></span>':"",t+="</div>",e.totals+=Number(a)}}}),t}},editResponseCost:function(e){function t(){var t=$(e).find(".response").not("#changeCost"),a=t.length,n="";if(0!=a)for(var o=0;a>o;o++)n+='<li class="addNewCost"><input type="text" value="'+t.eq(o).attr("data-costname")+'"><input type="text" value="'+t.eq(o).attr("data-vcostamount")+'"><i class="btn-del"></i></li>';return n}for(var a=this,n=a._othersCost,o=n.length,s='<div class="responseBox" data-index="0"><ul class="responseCost">',i=0;o>i;i++){var r=""==$("#othersCost .dj").eq(i).find("em").html()?"":$("#othersCost .dj").eq(i).find("em").attr("data-money");s+="<li><span>"+n[i].costName+"：</span><b>&yen; "+formatMoney(n[i].costAmount)+'</b><input type="text" class="original" id="dj_'+i+'" value="'+r+'" /></li>'}s+=t(),s+='</ul><div class="btnBox"><a href="javascript:;" class="addCost">新增费用</a></div><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>',e.hide(),e.after(s),$body.append(formTip),othersCostCon.on("click",".btn-cancel",function(e){a.cancel($(this),othersCostCon),e.preventDefault()}),othersCostCon.on("click",".btn-save",function(e){a.save($(this),othersCostCon),e.preventDefault()})},addNewCost:function(){var e=!0,t='<li class="addNewCost"><input type="text" /><input type="text" /><i class="btn-del"></i></li>';$body.on("click",".addCost",function(){var a=$(this),n=a.parents(".responseBox").find(".responseCost"),o=n.find("li:last-child").find("input");e=!0,o.length>1&&o.forEach(function(t){return""==t.value?($("#formTip").html("新增费用内容为空不能继续新增！").addClass("formTipShow"),void(e=!1)):void 0}),e&&n.append(t)})},cancel:function(e,t){var a=this;a.itemshow(e,t)},save:function(e,t){var a=this,n=e.parents(".m-item");if(n.is("#prodAnswerInfo")){{var o=e.parents(".responseBox").find("li.myResponse");o.length}a.createResponse($(".myResponse"),3,e,t,"isProdAnswer")}else if(n.is("#othersCost")){for(var s=$(".original").length,i=0;s>i;i++){var r=$(".original").eq(i).val();""!=r&&(othersCostCon.find(".dj").eq(i).html('&yen; <em class="money" data-money="'+r+'">'+formatMoney(r)+"</em>"),othersCostCon.find(".mobiCostItem").attr("data-vcostamount",r))}a.createResponse($(".addNewCost"),2,e,t,"isOtherCost")}},createResponse:function(e,t,a,n,o){for(var s=this,i=e.length,r="",l=new Array,d=s._lineLists,c=a.parents(".responseBox").attr("data-index"),p=0;i>p;p++){l[p]=new Array;for(var m=0;t>m;m++){var v=e.eq(p).find("input").eq(m),u=v.val();if(""==u)return v.focus(),!1;l[p][m]=u}}for(var f=0;i>f;f++)r+="isProdAnswer"==o?'<li class="response responseBatch"><section><span'+(0==f?' class="nth0"':"")+'>分批答交：</span><em class="purchaseQty">'+l[f][0]+"</em>"+d[c].purchaseUnitName+'/<em class="valuationQty">'+l[f][1]+"</em>"+d[c].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+l[f][2]+"</em></section></li>":'<li class="costItem response" data-costName="'+l[f][0]+'" data-costAmount="0" data-vCostAmount="'+l[f][1]+'"><span><em>'+l[f][0]+'</em>：</span><b>&yen; 0.00</b><b class="dj">&yen; <em class="money" data-money="'+l[f][1]+'">'+formatMoney(l[f][1])+"</em></b></li>";if(s.itemshow(a,n),n.find(".item-wrap").eq(c).find(".response").remove(),"isProdAnswer"==o){n.find(".item-wrap").eq(c).find(".price").before(r);var h=s.reQtys(a.parents(".responseBox"),c);if(""!=h||void 0!=h){var y=n.find(".item-wrap").eq(c).find(".subtotal"),b=y.attr("data-total"),P=n.find(".item-wrap").eq(c).find(".price"),C=P.attr("data-taxPrice"),I=P.attr("data-price");0==h?y.attr("data-vtotal",b):y.attr("data-vtotal",h*C),n.find(".item-wrap").eq(c).find("ul").append('<li class="response responseTotal" data-vLineAmount="'+h*I+'" data-vTaxLineTotal="'+h*C+'"><span>答交金额：</span>&yen; '+formatMoney(h*C)+"</li>")}}else{$("#othersCostSubtotal").before(r);var L=0;othersCostCon.find(".costItem").forEach(function(e){L+=Number($(e).attr("data-vcostamount"))}),$("#othersCostSubtotal").attr("data-vtotal",L),$("#othersCostSubtotal").after('<li id="changeCost" class="response" data-otherMoney="'+L+'"><span>本方小计：</span>&yen; '+formatMoney(L)+"</li>")}$(".item-total-dj").attr("data-vTotalAmount",s.reCostTotalFn()).html("答交总金额：&yen;"+formatMoney(s.reCostTotalFn())).show()},modiResponse:function(e,t){var a=prodAnswerCon.find(".item-wrap").eq(t).find(".bfline"),n=e.parents(".responseBox").eq(t).find(".bfline").eq(0);a.find("em").eq(0).html(n.find("input").eq(0).val()),a.find("em").eq(1).html(n.find("input").eq(1).val()),a.find("em").eq(2).html(n.find("input").eq(2).val())},popup:function(e,t,a,n,o){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:o})},delResponse:function(){var e=this,t="<p>您确定要删除此条答交？</p>";container.on("click",".btn-del",function(){var a=$(this),n=a.parent("li");e.popup("confirm","",t,"",function(){n.remove()})})},dateFn:function(){$(".timeBox").mdater({minDate:new Date})},hideTip:function(){$body.on("focus",'input[type="text"]',function(){$("#formTip").removeClass("formTipShow")})},reQtys:function(e){var t=0;return 0==e.find(".myResponse").length?t=e.find(".int02_all").val():e.find(".int02").each(function(){var e=$(this);t+=Number(e.val())}),t},reQtysAll:function(e){var t=e.attr("name"),a=e.parents(".responseBox"),n=0;a.find("."+t).forEach(function(e){n+=parseInt($(e).val(),10)}),a.find("."+t+"_all").val(n)},reCostTotalFn:function(){var e=0;return container.find(".subtotal").each(function(){e+=parseInt($(this).attr("data-vtotal"),10)}),e},start:function(){function e(){var e;t._lineLists.forEach(function(a){e="",a.vFileList=[];var n={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:t.orderInfo.companyId,id:a.id,commonParam:commonParam(),docType:"24",fileSource:1,searchType:2};GetAJAXData("POST",n,function(t){if(t.success){for(var n=0;n<t.fileList.length;n++)e+='<a href="'+t.fileList[n].fileUrl+'"><i class=i-'+(_reg.test(t.fileList[n].fileName)?"image":"word")+"></i>"+t.fileList[n].fileName+"</a>";prodAnswerCon.find(".files").eq(i).html("<span>附件：</span><p>"+e+"</p>").show(),a.vFileList=t.fileList}},!0)})}var t=this;orderAnswerCon.html(t.orderBaseInfo()),prodAnswerCon.html(t.prodAnswerInfo()),othersCostCon.html(t.othersCost()),$(".item-total").html("总金额：&yen;"+formatMoney(t.totals)).show(),$(".item-total-dj").attr("data-vTotalAmount",t.reCostTotalFn()).html("答交总金额：&yen;"+formatMoney(t.reCostTotalFn())).show(),e();var a={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:t.orderInfo.companyId,id:t.orderInfo.id,commonParam:commonParam(),docType:"24",fileSource:1,searchType:1};GetAJAXData("POST",a,function(e){e.success&&($fileData=e)},!0),t.load&&(1==t.vStatus?bottomBar(["share"],t.memberId,"","接收订单","拒绝订单"):2==t.vStatus?bottomBar(["share"],t.memberId,"","答交订单"):3==t.vStatus?bottomBar(["share"],t.memberId,"","提醒确认"):4==t.vStatus&&bottomBar(["share"],t.memberId,"","转销售订单")),container.on("click","a.item-link",function(){var e=$(this),a=e.attr("name"),n=$body.scrollTop();switch(a){case"payInfo":orderReviseInfoCon.html(t.payInfo(n));break;case"remark":orderReviseInfoCon.html(t.remark(n)),$("#intRemarks").val($("#vRemark").val())}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this),t=e.attr("data-scrollTop");e.is("#saveRemark")&&$("#vRemark").val($("#intRemarks").val()),container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn-confirm",function(){if(1==t.vStatus&&t.vendorPoAnswer("B03_vendorReceivePoAnswer"),2==t.vStatus&&t.popup("confirm","","确定提交答交吗？",function(){},function(){t.submitFn(function(){fnTip.success(2e3),setTimeout(function(){window.location.reload(!0)},2e3)})}),3==t.vStatus){var e=',"poId":'+_vParams.poAnswerId;t.vendorPoAnswer("B03_poRemindAnswer",e,!0)}4==t.vStatus&&(window.location.href=config.htmlUrl+'orderRevise.html?param={"poAnswerId":"'+_vParams.poAnswerId+'","companyId":"'+_vParams.vendorId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}')}),$body.on("click",".bottom-btn-cancel",function(){1==t.vStatus&&t.vendorPoAnswer("B03_vendorRefuseReceivePoAnswer")})},payInfo:function(e){var t=this,a=t.orderInfo;requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(t.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(t.invoiceType=e.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+a.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(t.logisticsType,a.logisticsType)+("3"==a.logisticsType?"（自提点："+a.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+a.address+"；"+(""==a.mobile?"":"<br>电话："+a.mobile)+"</p></li><li><span>付款条件：</span><p>"+a.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(t.invoiceType,a.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+a.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+a.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return n},remark:function(e){var t=this,a='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+t.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+t.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>';0==$fileData.fileList.length&&(a+="<p><b>0个附件</b></p>");for(var n=0;n<$fileData.fileList.length;n++)a+='<p><a href="'+$fileData.fileList[n].fileUrl+'"><i class=i-'+(_reg.test($fileData.fileList[n].fileName)?"image":"word")+"></i>"+$fileData.fileList[n].fileName+"</a></p>";return a+="</div>",2==t.vStatus&&(a+='<div class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写我方备注"></textarea></div>'),1!=t.vStatus&&(a+='<div class="item-wrap">	<h2>我方备注：</h2>	<p>'+t.orderInfo.vRemark+"</p></div>"),a+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,t,a,n,o){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:o})},vTotal:function(){for(var e=this,t=e._lineLists,a=prodAnswerCon.find(".item-wrap"),n=0,o=0,s=t.length;s>o;o++)n+=Number(a.eq(o).find(".bfline").find("em").eq(1).html())*t[o].price;return n},getJson:function(e,t){$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(e),success:function(e){e=e||{},e.success&&t&&t(e)}})},getParam:function(){for(var e=this,t=(e.orderInfo||[],[]),a=[],n=e._othersCost||[],o=e._lineLists||[],s=e._files||[],i=[],r=[],l=[],d=0,c=n.length;c>d;d++)n[d].vCostAmount=othersCostCon.find(".mobiCostItem").eq(d).find(".dj .money").attr("data-money"),a.push(n[d]);for(var p,m=othersCostCon.find(".costItem.response"),v=0,u=m.length;u>v;v++)p={vCostAmount:Number(m.eq(v).attr("data-vcostamount")),costName:m.eq(v).attr("data-costname"),vRemark:"",lineNo:v+1},t.push(p);for(var f,h=[],y=0,b=o.length;b>y;y++){var P=prodAnswerCon.find(".item-wrap").eq(y),C=(P.find(".responseTotal").eq(0),P.find(".response").not(".responseTotal")),I=P.find(".bfline"),L={},w=!1;f=o[y],f.addPoLineFileList=[],f.addPoSubLineList=[],f.modiPoSubLineList=[];for(var T=[],N=0,x=f.poSubLineList.length;x>N;N++){var A=f.poSubLineList[N];T.push(A.subId)}if(C.forEach(function(e,t){var a={};a.expectedDelivery=new Date($(e).find(".expectedDelivery").html()).getTime(),a.purchaseQty=$(e).find(".purchaseQty").html(),a.purchaseUnit=f.purchaseUnitName,a.valuationQty=$(e).find(".valuationQty").html(),a.valuationUnit=f.valuationUnitName,a.lineNo=t+1,f.addPoSubLineList.push(a),w=!0}),f.danShenfileList)for(var S=0,g=f.danShenfileList.length;g>S;S++){var _=f.danShenfileList[S];_.isDeleted?f.delPoLineFileList.push(_.id):_.id||f.addPoLineFileList.push({lineNo:_.lineNo,fileUrl:_.fileUrl,fileSize:_.fileSize,fileName:_.fileName})}if(L.poAnswerLineId=f.id,f.vProdName)L.vProdId=f.vProdId,L.vProdCode=$.trim(f.vProdCode),L.vProdDesc=$.trim(f.vProdDesc),L.vProdScale=$.trim(f.vProdScale),L.vProdName=$.trim(f.vProdName),L.vPurchaseQty=f.vPurchaseQty,L.vValuationQty=f.vValuationQty,L.vExpectedDelivery=new Date(f.vExpectedDelivery).getTime(),L.vPrice=f.vPrice,L.vTaxPrice=f.vTaxPrice,L.vLineAmount=f.vLineAmount,L.vTaxLineTotal=f.vTaxLineTotal,L.vAnswerUnitId=f.vAnswerUnitId,L.vAnswerUnitCode=f.vAnswerUnitCode,L.vAnswerUnitName=f.vAnswerUnitName,L.vValuationUnitId=f.vValuationUnitId,L.vValuationUnitCode=f.vValuationUnitCode,L.vValuationUnitName=f.vValuationUnitName;else{var k={token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam(),serviceId:"B01_getProdByCustomerProd",customerId:e.orderInfo.companyId,cProdCode:f.prodCode.toString(),vendorId:_vParams.vendorId};e.getJson(k,function(e){e.prodMap?(L.vProdId=e.prodMap.prodId,L.vProdCode=e.prodMap.prodCode,L.vProdDesc=e.prodMap.prodDesc,L.vProdScale=e.prodMap.prodScale,L.vProdName=e.prodMap.prodName):(L.vProdDesc=f.prodDesc,L.vProdScale=f.prodScale,L.vProdName=f.prodName)}),L.vPurchaseQty=I.find(".vPurchaseQty").html(),L.vValuationQty=I.find(".vValuationQty").html(),L.vExpectedDelivery=new Date(I.find(".vExpectedDelivery").html()).getTime(),L.vPrice=f.price.toString(),L.vTaxPrice=f.taxPrice.toString(),L.vLineAmount=(I.find(".vValuationQty").html()*f.price).toString(),L.vTaxLineTotal=(I.find(".vValuationQty").html()*f.taxPrice).toString(),L.vAnswerUnitId=f.purchaseUnitId,L.vAnswerUnitCode=f.purchaseUnitCode,L.vAnswerUnitName=f.purchaseUnitName,L.vValuationUnitId=f.valuationUnitId,L.vValuationUnitCode=f.valuationUnitCode,L.vValuationUnitName=f.valuationUnitName}L.isBatchAnswer=w?1:f.vBatchAnswer,L.vRemark=f.vRemark,L.addPoSubLineList=f.addPoSubLineList?f.addPoSubLineList:[],L.modiPoSubLineList=f.modiPoSubLineList?f.modiPoSubLineList:[],L.delPoSubLineList=T?T:[],L.vFileCount=f.addPoLineFileList.length,L.addPoLineFileList=f.addPoLineFileList?f.addPoLineFileList:[],L.delPoLineFileList=f.delPoLineFileList?f.delPoLineFileList:[],h.push(L)}for(var U=0,B=s.length;B>U;U++){var R=s[U];R.isDeleted?i.push(R.id):R.id||r.push({lineNo:R.lineNo,fileUrl:R.fileUrl,fileSize:R.fileSize,fileName:R.fileName})}var q=Number($("#changeCost").attr("data-othermoney")),D=Number($(".item-total-dj").eq(0).attr("data-vtotalamount")),F=D-q;return{vStatus:3,poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,serviceId:"B03_saveAnswerPo",commonParam:commonParam(),modiPoLineList:h,addPoOtherCostList:t,modiPoOthreCostList:a,delPoOthreCostList:l,vFeeInfo:{vTotal:e.vTotal().toString(),vOtherCostTotal:q,vTaxTotal:F.toString(),vTotalAmount:D},addPoFileList:r,delPoFileList:i,vRemark:$("#vRemark").val()}},submitFn:function(e){var t=this,a=t.getParam();a.token=_vParams.token,a.secretNumber=_vParams.secretNumber,console.log(JSON.stringify(a)),$.ajax({type:"POST",url:config.serviceUrl,data:{param:JSON.stringify(a)},success:function(t){t=t||{},t.success?e&&e():fnTip.error(2e3)}})},vendorPoAnswer:function(e,t,a){var n=this,t=t||"";$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{ "token":"'+_vParams.token+'", "secretNumber":"'+_vParams.secretNumber+'", "serviceId":"'+e+'", "poAnswerId":"'+_vParams.poAnswerId+'", "companyId":"'+_vParams.vendorId+'", "vendorId":"'+_vParams.vendorId+'", "commonParam":'+JSON.stringify(commonParam())+t+" }"},success:function(e){if(e=e||{},e.success){if(fnTip.success(2e3),a)return;setTimeout(function(){window.location.reload(!0)},2e3)}else n.popup("alert","","提交失败："+e.errorMsg)}})}};