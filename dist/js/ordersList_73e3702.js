var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),orderAnswerCon=$("#orderAnswerInfo"),prodAnswerCon=$("#prodAnswerInfo"),othersCostCon=$("#othersCost"),$scope={},$platformCurrencyList,$currencySymbol="",$priceDecimalNum="",$amountDecimalNum="",$prodMapList=[],$fileData,$btnTxet="分批答交",_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._othersCost=[],e.status,e.vStatus,e.totals=0,e.load=!1,e.memberId="",setTimeout(function(){container.show(),fnTip.hideLoading()},0),e.start(),container.on("click","span.edit",function(){if($(".responseBox").length)return popup("alert","",'请先"取消/确定"未完成操作再继续！'),!1;var t=$(this),a=t.parent(".item-wrap"),n=a.attr("data-index");return t.is(".editOther")?(e.editResponseCost(a,n),e.addNewCost(),!1):void e.editResponse(a,n)}),e.dateFn(),e.hideTip(),e.delResponse()},orderBaseInfo:function(){var e=this,t="",a={serviceId:"B03_getPurchaseOrderAnswerInfo",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success&&(e.orderInfo=a.poAnswerOrderInfo,e.memberId=e.orderInfo.poManId,e.status=e.orderInfo.status,e.vStatus=e.orderInfo.vStatus,t+='<h2 class="m-title">基础信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span><b>"+e.orderInfo.companyCode+"-"+e.orderInfo.companyAbbr+"</b></li>		<li><span>交易币别：</span>"+e.orderInfo.currencyName+"</li>		<li><span>交易税别：</span>"+e.orderInfo.taxName+'<label class="checkbox'+(1==e.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*e.orderInfo.taxRate+"%</label></li>		<li><span>交易条件：</span>"+e.orderInfo.conditionName+"</li>		<li><span>付款条件：</span>"+e.orderInfo.payWayName+"</li>		<li><span>采购日期：</span>"+e.orderInfo.poFormDate+"</li>	</ul></div>")}}),t},prodAnswerInfo:function(){var e=this,t="",a={serviceId:"B03_findPoAnswerLineList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var n=a.poLineList;e._lineLists=n,t='<h2 class="m-title">产品信息</h2>';for(var o=0,i=n.length;i>o;o++){t+='<div class="item-wrap" data-index="'+o+'">	<ul>		<li class="prodCode" data-prodCode="'+n[o].prodCode+'" data-prodId="'+n[o].prodId+'"><span>物料编码：</span><b>'+n[o].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[o].prodName+" "+n[o].prodScale+"</p></li>		<li><section><span>客户数量：</span><em>"+n[o].purchaseQty+"</em>"+n[o].purchaseUnitName+"/<em>"+n[o].valuationQty+"</em>"+n[o].valuationUnitName+"</section><section><span>交期：</span><em>"+n[o].expectedDelivery+"</em></section></li>"+(1==e.vStatus?"":0==n[o].poSubLineList.length?'<li class="bfline"><section><span>本方数量：</span><em class="vPurchaseQty">'+n[o].purchaseQty+"</em>"+n[o].purchaseUnitName+'/<em class="vValuationQty">'+n[o].valuationQty+"</em>"+n[o].valuationUnitName+'</section><section><span>交期：</span><em class="vExpectedDelivery">'+n[o].expectedDelivery+"</em></section></li>":"");for(var s=0;s<n[o].poSubLineList.length;s++)t+='<li class="response"><section><span'+(0==s?' class="nth0"':"")+'>分批答交：</span><em class="purchaseQty">'+n[o].poSubLineList[s].purchaseQty+"</em>"+n[o].purchaseUnitName+'/<em class="valuationQty">'+n[o].poSubLineList[s].valuationQty+"</em>"+n[o].valuationUnitName+"</section><section><span"+(0==s?' class="nth0"':"")+'>交期：</span><em class="expectedDelivery">'+n[o].poSubLineList[s].expectedDelivery+"</em></section></li>";t+='		<li class="price" data-taxPrice="'+n[o].taxPrice+'" data-price="'+n[o].price+'"><span>单价：</span>'+$currencySymbol+formatMoney(1===e.orderInfo.isContainTax?n[o].taxPrice:n[o].price)+"/"+n[o].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[o].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal" data-total="'+n[o].taxLineTotal+'" data-vTotal="'+(""!=n[o].vTaxLineTotal||0!=n[o].vTaxLineTotal?n[o].vTaxLineTotal:n[o].taxLineTotal)+'"><span>含税小计：</span><b>'+$currencySymbol+formatMoney(n[o].taxLineTotal)+"</b></li>"+(1!=e.vStatus?'<li class="response responseTotal" data-vLineAmount="'+n[o].vLineAmount+'" data-vTaxLineTotal="'+n[o].vTaxLineTotal+'"><span>答交金额：</span>'+$currencySymbol+formatMoney(""==n[o].vTaxLineTotal?n[o].taxLineTotal:n[o].vTaxLineTotal)+"</li>":"")+"	</ul>"+(2==e.vStatus?'<span class="edit"></span>':"")+"</div>",e.countQtyRate(n[o]),e.totals+=Number(n[o].taxLineTotal)}e.load=!0}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+a.errorMsg+"</p>")}}),t},editResponse:function(e,t){function a(t){var a=e.find(".bfline");return a.find("em").eq(t).html()}function n(){var e="";if(0!=r)for(var t=0;r>t;t++){var a=s.eq(t).find("em");e+='<li class="myResponse"><span'+(0==t?' class="nth0"':"")+'>分批：</span><input type="text" class="int01" name="int01" value="'+a.eq(0).html()+'"><input type="text" class="int02" name="int02" value="'+a.eq(1).html()+'" disabled><div class="timeBox">'+a.eq(2).html()+'</div><input type="hidden" value="'+a.eq(2).html()+'"><i class="btn-del"></i></li>'}return e}var o=this,i=o._lineLists,s=e.find(".responseBatch"),r=s.length;r>0&&($btnTxet="新增");var l='<div class="responseBox'+(r>0?" batchBox":"")+'" data-index="'+t+'"><ul class="responseBox1">	<li>		<span>对方：</span>		<p>物料编码：'+i[t].prodCode+"<br>"+i[t].prodName+" "+i[t].prodScale+'</p>	</li>	<li class="myProductInfo">		<span>本方：</span>		<p>物料编码：'+($prodMapList[t].prodCode||"")+"<br>"+($prodMapList[t].prodName||i[t].prodName)+" "+($prodMapList[t].prodScale||i[t].prodScale)+"</p>	</li>	<li><span>数量：</span><em>"+i[t].purchaseQty+i[t].purchaseUnitName+" /</em><em>"+i[t].valuationQty+i[t].valuationUnitName+'</em><span>交期：</span><em class="em03">'+i[t].expectedDelivery+'</em></li>	<li class="bfline"><span>本方：</span><input type="text" class="int01_all" value="'+a(0)+'"'+(r>0?" disabled":"")+'><input type="text" class="int02_all" value="'+a(1)+'" disabled><div class="timeBox">'+a(2)+'</div><input type="hidden" value="'+a(2)+'"></li>'+n()+'</ul><div class="btnBox"><a href="javascript:;" class="addResponse">'+$btnTxet+'</a></div><ul class="responseBox2">	<li><span>单价：</span>¥'+formatMoney(1===o.orderInfo.isContainTax?i[t].taxPrice:i[t].price)+"/"+i[t].valuationUnitName+"</li>	<li><span>备注：</span><p>"+i[t].remark+'</p></li>	<li class="subtotal"><span>小记：</span><b>'+$currencySymbol+formatMoney(i[t].taxLineTotal)+'</b></li></ul><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>';e.hide(),e.after(l),$body.append(formTip),$body.on("input","input.int01_all",function(){var e=$(this),t=e.parents(".responseBox").attr("data-index"),a=isNaN(e.val())?0:e.val();e.val(a),e.next(".int02_all").val(o._lineLists[t].countQtyRate*a)}),$body.on("input","input.int01",function(){var e=$(this),t=e.parents(".responseBox").attr("data-index"),a=isNaN(e.val())?0:e.val(),n=e.parents(".responseBox").find(".int01_all");o.reQtysAll($(this)),e.val(a),e.next(".int02").val(o._lineLists[t].countQtyRate*a),n.trigger("input")}),$(".addResponse").eq(0).on("click",function(){function e(){t=0,a=0,r.find(".int01").forEach(function(e){t+=parseFloat(e.value||0)}),r.find(".int02").forEach(function(e){a+=parseFloat(e.value||0)})}var t,a,n=$(this),s=n.parents(".responseBox"),r=s.find(".responseBox1"),l=r.find("li.myResponse").find("input"),d=s.attr("data-index"),c="",p="",m=o._lineLists[d].expectedDelivery,v=!0;l.length>1&&l.forEach(function(e){return""==e.value?($("#formTip").html("此分批答交完成后才能继续新增分批！").addClass("formTipShow"),void(v=!1)):void 0}),e(),c=parseFloat(i[d].purchaseQty)-t,p=parseFloat(i[d].valuationQty)-a,c=0>=c?"":c,p=0>=p?"":p;var u='<li class="myResponse"><span>分批：</span><input type="text" class="int01" name="int01" value="'+c+'" /><input type="text" class="int02" name="int02" value="'+p+'" disabled /><div class="timeBox">'+m+'</div><input type="hidden" value="'+m+'" /><i class="btn-del"></i></li>';v&&(r.append(u),e(),r.find(".int01_all").val(t),r.find(".int02_all").val(a),s.addClass("batchBox"),s.find(".int01_all").prop("disabled",!0),n.html("新增"))}),$(".btn-cancel").eq(0).on("click",function(e){o.cancel($(this),prodAnswerCon),e.preventDefault()}),$(".btn-save").eq(0).on("click",function(e){e.preventDefault(),o.save($(this),prodAnswerCon),o.modiResponse($(this),t)})},itemshow:function(e,t){var a=e.parents(".responseBox").attr("data-index");e.parents(".responseBox").remove(),t.find(".item-wrap").eq(a).show(),$("#formTip").remove()},othersCost:function(){var e=this,t="",a=0,n=0,o=!1;if(e.load){var i={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoAnswerOtherCostList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam()};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(i),success:function(i){if(i=i||{},i.success){var s=i.poOthreCostList;e._othersCost=s,t='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,l=s.length;l>r;r++)t+='<li class="mobiCostItem costItem" data-costName="'+s[r].costName+'" data-costAmount="'+s[r].costAmount+'" data-vCostAmount="'+s[r].vCostAmount+'"><span>'+s[r].costName+"：</span><b>"+$currencySymbol+formatMoney(s[r].costAmount)+"</b>"+(1==e.vStatus?"":'<b class="dj"><em class="money" data-money="'+(""==s[r].vCostAmount?s[r].costAmount:s[r].vCostAmount)+'">'+formatMoney(""==s[r].vCostAmount?s[r].costAmount:s[r].vCostAmount)+"</em></b>")+"</li>",a+=Number(""==s[r].costAmount?0:s[r].costAmount),n+=Number(""==s[r].vCostAmount?s[r].costAmount:s[r].vCostAmount),""!=s[r].vCostAmount&&(o=!0);t+='<li id="othersCostSubtotal" class="subtotal" data-total="'+a+'" data-vTotal="'+(o?n:a)+'"><span>客户小计：</span><b>'+$currencySymbol+formatMoney(a)+"</b></li>",1!=e.vStatus&&(t+='<li id="changeCost" class="response" data-otherMoney="'+n+'"><span>本方小计：</span>'+$currencySymbol+formatMoney(n)+"</li>"),t+="</ul>",t+=2==e.vStatus?'<span class="edit editOther"></span>':"",t+="</div>",e.totals+=Number(a)}}}),t}},editResponseCost:function(e){function t(){var t=$(e).find(".response").not("#changeCost"),a=t.length,n="";if(0!=a)for(var o=0;a>o;o++)n+='<li class="addNewCost"><input type="text" value="'+t.eq(o).attr("data-costname")+'"><input type="text" value="'+t.eq(o).attr("data-vcostamount")+'"><i class="btn-del"></i></li>';return n}for(var a=this,n=a._othersCost,o=n.length,i='<div class="responseBox" data-index="0"><ul class="responseCost">',s=0;o>s;s++){var r=""==$("#othersCost .dj").eq(s).find("em").html()?"":$("#othersCost .dj").eq(s).find("em").attr("data-money");i+="<li><span>"+n[s].costName+"：</span><b>"+$currencySymbol+formatMoney(n[s].costAmount)+'</b><input type="text" class="original" id="dj_'+s+'" value="'+r+'" /></li>'}i+=t(),i+='</ul><div class="btnBox"><a href="javascript:;" class="addCost">新增费用</a></div><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>',e.hide(),e.after(i),$body.append(formTip),$(".btn-cancel").eq(0).on("click",function(e){a.cancel($(this),othersCostCon),e.preventDefault()}),$(".btn-save").eq(0).on("click",function(e){a.save($(this),othersCostCon),e.preventDefault()})},addNewCost:function(){var e=!0,t='<li class="addNewCost"><input type="text" /><input type="text" /><i class="btn-del"></i></li>';$body.on("click",".addCost",function(){var a=$(this),n=a.parents(".responseBox").find(".responseCost"),o=n.find("li:last-child").find("input");e=!0,o.length>1&&o.forEach(function(t){return""==t.value?($("#formTip").html("此项费用完成后才能继续新增费用！").addClass("formTipShow"),void(e=!1)):void 0}),e&&n.append(t)})},cancel:function(e,t){var a=this;a.itemshow(e,t)},save:function(e,t){var a=this,n=e.parents(".m-item");if(n.is("#prodAnswerInfo")){{var o=e.parents(".responseBox").find("li.myResponse");o.length}a.createResponse($(".myResponse"),3,e,t,"isProdAnswer")}else if(n.is("#othersCost")){for(var i=$(".original").length,s=0;i>s;s++){var r=$(".original").eq(s).val();""!=r&&(othersCostCon.find(".dj").eq(s).html($currencySymbol+'<em class="money" data-money="'+r+'">'+formatMoney(r)+"</em>"),othersCostCon.find(".mobiCostItem").attr("data-vcostamount",r))}a.createResponse($(".addNewCost"),2,e,t,"isOtherCost")}},createResponse:function(e,t,a,n,o){for(var i=this,s=e.length,r="",l=new Array,d=i._lineLists,c=a.parents(".responseBox").attr("data-index"),p=0;s>p;p++){l[p]=new Array;for(var m=0;t>m;m++){var v=e.eq(p).find("input").eq(m),u=v.val();if(""==u)return v.focus(),!1;l[p][m]=u}}for(var f=0;s>f;f++)r+="isProdAnswer"==o?'<li class="response responseBatch"><section><span'+(0==f?' class="nth0"':"")+'>分批答交：</span><em class="purchaseQty">'+l[f][0]+"</em>"+d[c].purchaseUnitName+'/<em class="valuationQty">'+l[f][1]+"</em>"+d[c].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+l[f][2]+"</em></section></li>":'<li class="costItem response" data-costName="'+l[f][0]+'" data-costAmount="0" data-vCostAmount="'+l[f][1]+'"><span><em>'+l[f][0]+"</em>：</span><b>"+$currencySymbol+'0.00</b><b class="dj">'+$currencySymbol+'<em class="money" data-money="'+l[f][1]+'">'+formatMoney(l[f][1])+"</em></b></li>";if(i.itemshow(a,n),n.find(".item-wrap").eq(c).find(".response").remove(),"isProdAnswer"==o){s>0?(n.find(".item-wrap").eq(c).find(".bfline").hide(),n.find(".item-wrap").eq(c).find(".price").before(r)):n.find(".item-wrap").eq(c).find(".bfline").show();var h=i.reQtys(a.parents(".responseBox"),c);if(""!=h||void 0!=h){var y=n.find(".item-wrap").eq(c).find(".subtotal"),b=y.attr("data-total"),P=n.find(".item-wrap").eq(c).find(".price"),L=P.attr("data-taxPrice"),C=P.attr("data-price");0==h?y.attr("data-vtotal",b):y.attr("data-vtotal",h*L),n.find(".item-wrap").eq(c).find("ul").append('<li class="response responseTotal" data-vLineAmount="'+h*C+'" data-vTaxLineTotal="'+h*L+'"><span>答交金额：</span>'+$currencySymbol+formatMoney(h*L)+"</li>")}}else{$("#othersCostSubtotal").before(r);var I=0;othersCostCon.find(".costItem").forEach(function(e){I+=Number($(e).attr("data-vcostamount"))}),$("#othersCostSubtotal").attr("data-vtotal",I),$("#othersCostSubtotal").after('<li id="changeCost" class="response" data-otherMoney="'+I+'"><span>本方小计：</span>'+$currencySymbol+formatMoney(I)+"</li>")}$(".item-total-dj").attr("data-vTotalAmount",i.reCostTotalFn()).html("答交总金额："+$currencySymbol+formatMoney(i.reCostTotalFn())).show()},modiResponse:function(e,t){var a=prodAnswerCon.find(".item-wrap").eq(t).find(".bfline"),n=e.parents(".responseBox").eq(0).find(".bfline").eq(0);a.find("em").eq(0).html(n.find("input").eq(0).val()),a.find("em").eq(1).html(n.find("input").eq(1).val()),a.find("em").eq(2).html(n.find("input").eq(2).val())},popup:function(e,t,a,n,o){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:o})},delResponse:function(){var e=this,t="<p>您确定要删除此条答交？</p>";container.on("click",".btn-del",function(){var a=$(this),n=a.parent("li"),o=a.parents(".responseBox"),i=a.parents(".responseBox1"),s=o.attr("data-index");e.popup("confirm","",t,"",function(){if(n.remove(),a.parent("li").is(".myResponse")){if(0==i.find(".myResponse").length)return alert(1),o.removeClass("batchBox"),i.find(".int01_all").prop("disabled",!1),i.find(".int02_all").prop("disabled",!1),i.find(".int01_all").val(e._lineLists[s].purchaseQty),i.find(".int02_all").val(e._lineLists[s].valuationQty),!1;{var t=0,r=0;i.find(".int01_all").val(),i.find(".int02_all").val()}i.find(".int01").forEach(function(e){t+=parseFloat(e.value||0)}),i.find(".int02").forEach(function(e){r+=parseFloat(e.value||0)}),i.find(".int01_all").val(t),i.find(".int02_all").val(r)}})})},dateFn:function(){$(".timeBox").mdater({minDate:new Date})},hideTip:function(){$body.on("focus",'input[type="text"]',function(){$("#formTip").removeClass("formTipShow")})},reQtys:function(e){var t=0;return 0==e.find(".myResponse").length?t=e.find(".int02_all").val():e.find(".int02").each(function(){var e=$(this);t+=Number(e.val())}),t},reQtysAll:function(e){var t=e.attr("name"),a=e.parents(".responseBox"),n=0;a.find("."+t).forEach(function(e){n+=Number($(e).val())}),a.find("."+t+"_all").val(n)},reCostTotalFn:function(){var e=0;return container.find(".subtotal").each(function(){e+=Number($(this).attr("data-vtotal"))}),e},start:function(){function e(){var e;a._lineLists.forEach(function(t,n){e="",t.vFileList=[];var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:a.orderInfo.companyId,id:t.id,commonParam:commonParam(),docType:"24",fileSource:1,searchType:2};GetAJAXData("POST",o,function(a){if(a.success){for(var o=0;o<a.fileList.length;o++)e+='<a href="'+a.fileList[o].fileUrl+'"><i class=i-'+(_reg.test(a.fileList[o].fileName)?"image":"word")+"></i>"+a.fileList[o].fileName+"</a>";a.fileList.length>0&&prodAnswerCon.find(".files").eq(n).html("<span>附件：</span><p>"+e+"</p>").show(),t.vFileList=a.fileList}},!0)}),$scope.poLineList=a._lineLists}function t(){for(var e=a._lineLists,t=0,n=e.length;n>t;t++){var o={serviceId:"B01_getProdByCustomerProd",token:_vParams.token,secretNumber:_vParams.secretNumber,vendorId:_vParams.vendorId,cProdCode:e[t].prodCode,commonParam:commonParam(),customerId:a.orderInfo.companyId};GetAJAXData("POST",o,function(e){e.success&&$prodMapList.push(e.prodMap)})}}var a=this;orderAnswerCon.html(a.orderBaseInfo());var n={serviceId:"B01_queryAllPlatformCurrency",token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()};GetAJAXData("POST",n,function(e){if(e.success){$platformCurrencyList=e;for(var t=0,n=e.platformCurrencyList.length;n>t;t++)if(e.platformCurrencyList[t].currencyCode==a.orderInfo.pCurrencyCode)return $currencySymbol=e.platformCurrencyList[t].currencySymbol,$priceDecimalNum=e.platformCurrencyList[t].priceDecimalNum,$amountDecimalNum=e.platformCurrencyList[t].amountDecimalNum,!1}}),prodAnswerCon.html(a.prodAnswerInfo()),othersCostCon.html(a.othersCost()),$(".item-total").html("订单总金额："+$currencySymbol+formatMoney(a.orderInfo.cTotalAmount)).show(),1!=a.vStatus&&$(".item-total-dj").attr("data-vTotalAmount",a.reCostTotalFn()).html("答交总金额："+$currencySymbol+formatMoney(a.orderInfo.vTotalAmount||a.orderInfo.cTotalAmount)).show(),e();var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:_vParams.vendorId,id:a.orderInfo.id,commonParam:commonParam(),docType:"24",fileSource:2,searchType:1};GetAJAXData("POST",o,function(e){e.success&&($fileData=e)},!0),t(),a.load&&(1==a.vStatus?bottomBar(["share"],a.memberId,"","接收订单","拒绝订单"):2==a.vStatus?bottomBar(["share"],a.memberId,"","答交订单","拒绝订单"):3==a.vStatus?bottomBar(["share"],a.memberId,"","提醒确认"):4==a.vStatus&&bottomBar(["share"],a.memberId,"","转销售订单")),container.on("click","a.item-link",function(){var e=$(this),t=e.attr("name"),n=$body.scrollTop();switch(t){case"payInfo":orderReviseInfoCon.html(a.payInfo(n));break;case"remark":orderReviseInfoCon.html(a.remark(n)),$("#intRemarks").val($("#vRemark").val())}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this),t=e.attr("data-scrollTop");e.is("#saveRemark")&&$("#vRemark").val($("#intRemarks").val()),container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn-confirm",function(){if(1==a.vStatus){var e={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_vendorReceivePoAnswer",poAnswerId:_vParams.poAnswerId,companyId:a.orderInfo.companyId,vendorId:_vParams.vendorId,commonParam:commonParam()};a.vendorPoAnswer(e)}if(2==a.vStatus&&a.popup("confirm","","您确定提交答交吗？",function(){},function(){a.submitFn(function(){fnTip.success(2e3),setTimeout(function(){window.location.reload(!0)},2e3)})}),3==a.vStatus){var t={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_poRemindAnswer",poId:_vParams.poAnswerId,companyId:a.orderInfo.companyId,commonParam:commonParam()};a.vendorPoAnswer(t,function(){setTimeout(function(){goBack()},2e3)},!0)}4==a.vStatus&&(window.location.href=config.htmlUrl+'orderRevise.html?param={"poAnswerId":"'+_vParams.poAnswerId+'","companyId":"'+_vParams.vendorId+'","secretNumber":"'+_vParams.secretNumber+'","token":"'+_vParams.token+'"}')}),$body.on("click",".bottom-btn-cancel",function(){(1==a.vStatus||2==a.vStatus)&&a.popup("confirm","","您确定要拒绝订单吗？",function(){},function(){var e={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_vendorRefuseReceivePoAnswer",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam()};a.vendorPoAnswer(e,function(){setTimeout(function(){goBack()},2e3)},!0)})})},payInfo:function(e){var t=this,a=t.orderInfo;requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(t.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(t.invoiceType=e.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+a.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(t.logisticsType,a.logisticsType)+"</p></li><li><span>"+(3==a.logisticsType?"自提点":"收货地址")+"：</span><p>"+a.provinceName+a.cityName+a.districtName+a.address+"<br>收货人："+a.contactPerson+"，电话："+a.mobile+"</p></li><li><span>付款条件：</span><p>"+a.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(t.invoiceType,a.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+a.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+a.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return n},remark:function(e){var t=this,a='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+t.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+t.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>';0==$fileData.fileList.length&&(a+="<p><b>0个附件</b></p>");for(var n=0;n<$fileData.fileList.length;n++)a+='<p><a href="'+$fileData.fileList[n].fileUrl+'"><i class=i-'+(_reg.test($fileData.fileList[n].fileName)?"image":"word")+"></i>"+$fileData.fileList[n].fileName+"</a></p>";return a+="</div>",2==t.vStatus&&(a+='<div class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写本方备注"></textarea></div>'),1!=t.vStatus&&2!=t.vStatus&&(a+='<div class="item-wrap">	<h2>本方备注：</h2>	<p>'+t.orderInfo.vRemark+"</p></div>"),a+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,t,a,n,o){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:o})},countQtyRate:function(e){isEmpty(e)||(e.countQtyRate=parseFloat(e.valuationQty)/parseFloat(e.purchaseQty))},vTotal:function(){for(var e=this,t=e._lineLists,a=prodAnswerCon.find(".item-wrap"),n=0,o=0,i=t.length;i>o;o++)n+=Number(a.eq(o).find(".bfline").find("em").eq(1).html())*t[o].price;return n},getParam:function(){for(var e=this,t=(e.orderInfo||[],[]),a=[],n=e._othersCost||[],o=$scope.poLineList||[],i=e._files||[],s=[],r=[],l=[],d=0,c=n.length;c>d;d++)n[d].vCostAmount=othersCostCon.find(".mobiCostItem").eq(d).find(".dj .money").attr("data-money"),a.push(n[d]);for(var p,m=othersCostCon.find(".costItem.response"),v=0,u=m.length;u>v;v++)p={vCostAmount:Number(m.eq(v).attr("data-vcostamount")),costName:m.eq(v).attr("data-costname"),isNewAdd:!0,costSource:2,costAmount:0,remark:"",vRemark:"",lineNo:v+1},t.push(p);for(var f,h=[],y=0,b=o.length;b>y;y++){var P=prodAnswerCon.find(".item-wrap").eq(y),L=(P.find(".responseTotal").eq(0),P.find(".response").not(".responseTotal")),C=P.find(".bfline"),I={},N=!1;f=o[y],f.addPoLineFileList=[],f.addPoSubLineList=[],f.modiPoSubLineList=[];for(var w=[],T=0,x=f.poSubLineList.length;x>T;T++){var S=f.poSubLineList[T];w.push(S.subId)}if(L.forEach(function(e,t){var a={};a.expectedDelivery=new Date($(e).find(".expectedDelivery").html()).getTime(),a.purchaseQty=$(e).find(".purchaseQty").html(),a.purchaseUnit=f.purchaseUnitName,a.valuationQty=$(e).find(".valuationQty").html(),a.valuationUnit=f.valuationUnitName,a.lineNo=t+1,f.addPoSubLineList.push(a),N=!0}),f.danShenfileList)for(var A=0,_=f.danShenfileList.length;_>A;A++){var g=f.danShenfileList[A];g.isDeleted?f.delPoLineFileList.push(g.id):g.id||f.addPoLineFileList.push({lineNo:g.lineNo,fileUrl:g.fileUrl,fileSize:g.fileSize,fileName:g.fileName})}I.poAnswerLineId=f.id,f.vProdName?(I.vProdId=f.vProdId,I.vProdCode=$.trim(f.vProdCode),I.vProdDesc=$.trim(f.vProdDesc),I.vProdScale=$.trim(f.vProdScale),I.vProdName=$.trim(f.vProdName),I.vPurchaseQty=f.vPurchaseQty,I.vValuationQty=f.vValuationQty,I.vExpectedDelivery=new Date(f.vExpectedDelivery).getTime(),I.vPrice=f.vPrice,I.vTaxPrice=f.vTaxPrice,I.vLineAmount=f.vLineAmount,I.vTaxLineTotal=f.vTaxLineTotal,I.vAnswerUnitId=f.vAnswerUnitId,I.vAnswerUnitCode=f.vAnswerUnitCode,I.vAnswerUnitName=f.vAnswerUnitName,I.vValuationUnitId=f.vValuationUnitId,I.vValuationUnitCode=f.vValuationUnitCode,I.vValuationUnitName=f.vValuationUnitName):($prodMapList[y].prodCode?(I.vProdId=$prodMapList[y].prodId,I.vProdCode=$prodMapList[y].prodCode,I.vProdDesc=$prodMapList[y].prodDesc,I.vProdScale=$prodMapList[y].prodScale,I.vProdName=$prodMapList[y].prodName):(I.vProdDesc=f.prodDesc,I.vProdScale=f.prodScale,I.vProdName=f.prodName),I.vPurchaseQty=C.find(".vPurchaseQty").html(),I.vValuationQty=C.find(".vValuationQty").html(),I.vExpectedDelivery=new Date(C.find(".vExpectedDelivery").html()).getTime(),I.vPrice=f.price.toString(),I.vTaxPrice=f.taxPrice.toString(),I.vLineAmount=(C.find(".vValuationQty").html()*f.price).toString(),I.vTaxLineTotal=(C.find(".vValuationQty").html()*f.taxPrice).toString(),I.vAnswerUnitId=f.purchaseUnitId,I.vAnswerUnitCode=f.purchaseUnitCode,I.vAnswerUnitName=f.purchaseUnitName,I.vValuationUnitId=f.valuationUnitId,I.vValuationUnitCode=f.valuationUnitCode,I.vValuationUnitName=f.valuationUnitName),I.isBatchAnswer=N?1:f.vBatchAnswer,I.vRemark=f.vRemark,I.addPoSubLineList=f.addPoSubLineList?f.addPoSubLineList:[],I.modiPoSubLineList=f.modiPoSubLineList?f.modiPoSubLineList:[],I.delPoSubLineList=w?w:[],I.vFileCount=f.addPoLineFileList.length,I.addPoLineFileList=f.addPoLineFileList?f.addPoLineFileList:[],I.delPoLineFileList=f.delPoLineFileList?f.delPoLineFileList:[],h.push(I)}for(var k=0,B=i.length;B>k;k++){var U=i[k];U.isDeleted?s.push(U.id):U.id||r.push({lineNo:U.lineNo,fileUrl:U.fileUrl,fileSize:U.fileSize,fileName:U.fileName})}var R=Number($("#changeCost").attr("data-othermoney")),D=Number($(".item-total-dj").eq(0).attr("data-vtotalamount")),q=D-R;return{vStatus:3,poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,serviceId:"B03_saveAnswerPo",commonParam:commonParam(),modiPoLineList:h,addPoOtherCostList:t,modiPoOthreCostList:a,delPoOthreCostList:l,vFeeInfo:{vTotal:e.vTotal().toString(),vOtherCostTotal:R,vTaxTotal:q.toString(),vTotalAmount:D},addPoFileList:r,delPoFileList:s,vRemark:$("#vRemark").val()}},submitFn:function(e){var t=this,a=t.getParam();a.token=_vParams.token,a.secretNumber=_vParams.secretNumber,console.log(JSON.stringify(a)),$.ajax({type:"POST",url:config.serviceUrl,data:{param:JSON.stringify(a)},success:function(t){t=t||{},t.success?e&&e():fnTip.error(2e3)}})},vendorPoAnswer:function(e,t,a){var n=this;$.ajax({type:"POST",url:config.serviceUrl,data:{param:JSON.stringify(e)},success:function(e){if(e=e||{},e.success){if(fnTip.success(2e3),t&&t(),a)return;setTimeout(function(){window.location.reload(!0)},2e3)}else n.popup("alert","","提交失败："+e.errorMsg)}})}};