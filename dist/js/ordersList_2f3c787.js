var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),othersCostCon=$("#othersCost"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,Lists=function(){this.init()};Lists.prototype={init:function(){var e=this;e._files=[],e._othersCost=[],e.status,e.vStatus,e.totals=0,e.load=!1,e.memberId="",e.start(),container.on("click","span.edit",function(){var t=$(this),a=t.parent(".item-wrap"),n=a.attr("data-index");return t.is(".editOther")?(e.editResponseCost(a,n),e.addNewCost(),!1):(e.editResponse(a,n),void e.addNewResponse(n))}),$("#prodAnswerInfo").on("input","input.int02",function(){var t=$(this),a=0,n=t.parents(".responseBox"),s=n.attr("data-index"),o=t.val(),i=e._lineLists[s].valuationQty;a=e.reQtys(n,s),o>i-(a-o)&&t.val(i-(a-o))}),e.dateFn(),e.hideTip(),e.delResponse()},orderBaseInfo:function(){var e=this,t="",a={serviceId:"B03_getPurchaseOrderAnswerInfo",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){a=a||{},a.success&&(e.orderInfo=a.poAnswerOrderInfo,e.memberId=e.orderInfo.auditid,e.status=e.orderInfo.status,e.vStatus=e.orderInfo.vStatus,t+='<h2 class="m-title">基本信息</h2><div class="item-wrap">	<ul>		<li><span>平台单号：</span><b>'+e.orderInfo.poFormNo+"</b></li>		<li><span>内部单号：</span><b>"+e.orderInfo.poInsideNo+"</b></li>		<li><span>客户：</span>"+e.orderInfo.companyName+"</li>		<li><span>交易货币：</span>"+e.orderInfo.currencyName+"</li>		<li><span>交易税种：</span>"+e.orderInfo.taxName+(1===e.orderInfo.isContainTax?'<label class="checkbox on"><input type="checkbox" checked="checked" disabled>含税'+e.orderInfo.taxRate+"%</label>":"")+"</li>		<li><span>采购日期：</span>"+e.orderInfo.poFormDate+"</li>	</ul></div>")}}),t},fileList:function(){var e=this;if(e.load){var t={secretNumber:_vParams.secretNumber,token:_vParams.token,serviceId:"B01_findFileList",companyId:_vParams.vendorId,commonParam:commonParam(),fileSource:"2",searchType:"1",id:_vParams.poAnswerId,docType:"24"};$.ajax({type:"POST",url:config.serviceUrl,data:"param="+JSON.stringify(t),success:function(t){if(t=t||{},t.success){for(var a=t.fileList,n=0,s=a.length;s>n;n++)""!=a[n].fileName&&$(".files").eq(n).html('<span>附件：</span><a href="'+a[n].fileUrl+'"><i class=i-'+(_reg.test(a[n].fileName)?"image":"word")+"></i>"+a[n].fileName+"</a>").show();e._files=a}}})}},prodAnswerInfo:function(){var e=this,t="",a={serviceId:"B03_findPoAnswerLineList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(a),success:function(a){if(a=a||{},a.success){var n=a.poLineList;e._lineLists=n,t='<h2 class="m-title">产品信息</h2>';for(var s=0,o=n.length;o>s;s++){t+='<div class="item-wrap" data-index="'+s+'">	<ul>		<li class="prodCode" data-prodCode="'+n[s].prodCode+'" data-prodId="'+n[s].prodId+'"><span>物料编码：</span><b>'+n[s].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+n[s].prodName+" "+n[s].prodScale+"</p></li>		<li><section><span>数量：</span><em>"+n[s].purchaseQty+"</em>"+n[s].purchaseUnitName+"/<em>"+n[s].valuationQty+"</em>"+n[s].valuationUnitName+"</section><section><span>交期：</span><em>"+n[s].expectedDelivery+"</em></section></li>";for(var i=0;i<n[s].poSubLineList.length;i++)t+='<li class="response"><section><span>数量：</span><em class="purchaseQty">'+n[s].poSubLineList[i].purchaseQty+"</em>"+n[s].purchaseUnitName+'/<em class="valuationQty">'+n[s].poSubLineList[i].valuationQty+"</em>"+n[s].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+n[s].poSubLineList[i].expectedDelivery+"</em></section></li>";t+='		<li class="price" data-taxPrice="'+n[s].taxPrice+'" data-price="'+n[s].price+'"><span>单价：</span>&yen; '+formatMoney(1===e.orderInfo.isContainTax?n[s].taxPrice:n[s].price)+"/"+n[s].valuationUnitName+"</li>		<li><span>备注：</span><p>"+n[s].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal" data-total="'+n[s].taxLineTotal+'" data-vTotal="'+(""!=n[s].vTaxLineTotal||0!=n[s].vTaxLineTotal?n[s].vTaxLineTotal:n[s].taxLineTotal)+'"><span>小计：</span><b>&yen; '+formatMoney(n[s].taxLineTotal)+"</b></li>"+(n[s].poSubLineList.length>0?'<li class="response responseTotal" data-vLineAmount="'+n[s].vLineAmount+'" data-vTaxLineTotal="'+n[s].vTaxLineTotal+'"><span>答交金额：</span>&yen; '+formatMoney(n[s].vTaxLineTotal)+"</li>":"")+"	</ul>"+(2==e.vStatus?'<span class="edit"></span>':"")+"</div>",e.totals+=parseInt(n[s].taxLineTotal,10)}e.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+a.errorMsg+"</p>")}}),t},editResponse:function(e,t){function a(){var t=e.find(".response").not(".responseTotal"),a=t.length,n="";if(0!=a)for(var s=0;a>s;s++){var o=t.eq(s).find("em");n+='<li class="myResponse"><span>答交：</span><input type="text" class="int01" value="'+o.eq(0).html()+'"><input type="text" class="int02" value="'+o.eq(1).html()+'"><div class="timeBox">'+o.eq(2).html()+'</div><input type="hidden" value="'+o.eq(2).html()+'"><i class="btn-del"></i></li>'}return n}var n,s,o,i=this,r=i._lineLists,l=r[t].prodCode,d=i.orderInfo.companyId,c={serviceId:"B01_getProdByCustomerProd",token:_vParams.token,secretNumber:_vParams.secretNumber,vendorId:_vParams.vendorId,cProdCode:l,commonParam:commonParam(),customerId:d};$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(c),success:function(e){$(".ball-clip-rotate").remove(),e=e||{},e.success&&(n=e.prodMap.prodCode,s=e.prodMap.prodName,o=e.prodMap.prodScale)}});var p='<div class="responseBox" data-index="'+t+'"><ul class="responseBox1">	<li>		<span>对方：</span>		<p>物料编码：'+r[t].prodCode+"<br>"+r[t].prodName+" "+r[t].prodScale+'</p>	</li>	<li class="myProductInfo">		<span>我方：</span>		<p>物料编码：'+n+"<br>"+s+" "+o+"</p>	</li>	<li><span>数量：</span><em>"+r[t].purchaseQty+r[t].purchaseUnitName+" /</em><em>"+r[t].valuationQty+r[t].valuationUnitName+'</em><span>交期：</span><em class="em03">'+r[t].expectedDelivery+"</em></li>"+a()+'</ul><div class="btnBox"><a href="javascript:;" class="addResponse">新增答交栏</a></div><ul class="responseBox2">	<li><span>单价：</span>¥'+formatMoney(1===i.orderInfo.isContainTax?r[t].taxPrice:r[t].price)+"/"+r[t].valuationUnitName+"</li>	<li><span>备注：</span><p>"+r[t].remark+'</p></li>	<li class="subtotal"><span>小记：</span><b>&yen; '+formatMoney(r[t].taxLineTotal)+'</b></li></ul><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>';e.hide(),e.after(p),$body.append(formTip),$("#prodAnswerInfo").on("click",".btn-cancel",function(e){i.cancel($(this),$("#prodAnswerInfo")),e.preventDefault()}),$("#prodAnswerInfo").on("click",".btn-save",function(e){i.save($(this),$("#prodAnswerInfo")),e.preventDefault()})},itemshow:function(e,t){var a=e.parents(".responseBox").attr("data-index");e.parents(".responseBox").remove(),t.find(".item-wrap").eq(a).show(),$("#formTip").remove()},addNewResponse:function(e){var t=this,a=!0,n=t._lineLists[e].valuationQty,s='<li class="myResponse"><span>答交：</span><input type="text" class="int01" /><input type="text" class="int02" /><div class="timeBox"></div><input type="hidden" /><i class="btn-del"></i></li>';$body.on("click",".addResponse",function(){var o=$(this),i=o.parents(".responseBox"),r=i.find(".responseBox1"),l=r.find("li:last-child").find("input");a=!0,t.reQtys(i,e)!=n&&(l.length>1&&l.forEach(function(e){return""==e.value?($("#formTip").html("新增答交内容为空不能继续新增！").addClass("formTipShow"),void(a=!1)):void 0}),a&&r.append(s))})},othersCost:function(){var e=this,t="",a=0,n=0,s=!1;if(e.load){var o={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoAnswerOtherCostList",poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,commonParam:commonParam()};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(o),success:function(o){if(o=o||{},o.success){var i=o.poOthreCostList;e._othersCost=i,t='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,l=i.length;l>r;r++)t+='<li class="mobiCostItem costItem" data-costName="'+i[r].costName+'" data-costAmount="'+i[r].costAmount+'" data-vCostAmount="'+i[r].vCostAmount+'"><span>'+i[r].costName+"：</span><b>&yen; "+formatMoney(i[r].costAmount)+'</b><b class="dj"><em class="money" data-money="'+(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount)+'">'+(""==i[r].vCostAmount?"":formatMoney(i[r].vCostAmount))+"</em></b></li>",a+=Number(""==i[r].costAmount?0:i[r].costAmount),n+=Number(""==i[r].vCostAmount?i[r].costAmount:i[r].vCostAmount),""!=i[r].vCostAmount&&(s=!0);t+='<li id="othersCostSubtotal" class="subtotal" data-total="'+a+'" data-vTotal="'+(s?n:a)+'"><span>客户小计：</span><b>&yen; '+formatMoney(a)+"</b></li>",t+='<li id="changeCost" class="response" data-otherMoney="'+n+'"><span>本方小计：</span>&yen; '+formatMoney(n)+"</li>",t+="</ul>",t+=2==e.vStatus?'<span class="edit editOther"></span>':"",t+="</div>",e.totals+=Number(a)}}}),t}},editResponseCost:function(e){function t(){var t=$(e).find(".response").not("#changeCost"),a=t.length,n="";if(0!=a)for(var s=0;a>s;s++)n+='<li class="addNewCost"><input type="text" value="'+t.eq(s).attr("data-costname")+'"><input type="text" value="'+t.eq(s).attr("data-vcostamount")+'"><i class="btn-del"></i></li>';return n}for(var a=this,n=a._othersCost,s=n.length,o='<div class="responseBox" data-index="0"><ul class="responseCost">',i=0;s>i;i++){var r=""==$("#othersCost .dj").eq(i).find("em").html()?"":$("#othersCost .dj").eq(i).find("em").attr("data-money");o+="<li><span>"+n[i].costName+"：</span><b>&yen; "+formatMoney(n[i].costAmount)+'</b><input type="text" class="original" id="dj_'+i+'" value="'+r+'" /></li>'}o+=t(),o+='</ul><div class="btnBox"><a href="javascript:;" class="addCost">新增费用</a></div><div class="btns">	<a class="btn-cancel" href="javascript:;">取消</a>	<a class="btn-save" href="javascript:;">确定</a></div></div>',e.hide(),e.after(o),$body.append(formTip),othersCostCon.on("click",".btn-cancel",function(e){a.cancel($(this),othersCostCon),e.preventDefault()}),othersCostCon.on("click",".btn-save",function(e){a.save($(this),othersCostCon),e.preventDefault()})},addNewCost:function(){var e=!0,t='<li class="addNewCost"><input type="text" /><input type="text" /><i class="btn-del"></i></li>';$body.on("click",".addCost",function(){var a=$(this),n=a.parents(".responseBox").find(".responseCost"),s=n.find("li:last-child").find("input");e=!0,s.length>1&&s.forEach(function(t){return""==t.value?($("#formTip").html("新增费用内容为空不能继续新增！").addClass("formTipShow"),void(e=!1)):void 0}),e&&n.append(t)})},cancel:function(e,t){var a=this;a.itemshow(e,t)},save:function(e,t){var a=this,n=e.parents(".m-item");if(n.is("#prodAnswerInfo")){{var s=e.parents(".responseBox").find("li.myResponse");s.length}a.createResponse($(".myResponse"),3,e,t,"isProdAnswer")}else if(n.is("#othersCost")){for(var o=$(".original").length,i=0;o>i;i++){var r=$(".original").eq(i).val();""!=r&&(othersCostCon.find(".dj").eq(i).html('&yen; <em class="money" data-money="'+r+'">'+formatMoney(r)+"</em>"),othersCostCon.find(".mobiCostItem").attr("data-vcostamount",r))}a.createResponse($(".addNewCost"),2,e,t,"isOtherCost")}},createResponse:function(e,t,a,n,s){for(var o=this,i=e.length,r="",l=new Array,d=o._lineLists,c=a.parents(".responseBox").attr("data-index"),p=0;i>p;p++){l[p]=new Array;for(var m=0;t>m;m++){var v=e.eq(p).find("input").eq(m),u=v.val();if(""==u)return v.focus(),!1;l[p][m]=u}}for(var f=0;i>f;f++)r+="isProdAnswer"==s?'<li class="response"><section><span>数量：</span><em class="purchaseQty">'+l[f][0]+"</em>"+d[c].purchaseUnitName+'/<em class="valuationQty">'+l[f][1]+"</em>"+d[c].valuationUnitName+'</section><section><span>交期：</span><em class="expectedDelivery">'+l[f][2]+"</em></section></li>":'<li class="costItem response" data-costName="'+l[f][0]+'" data-costAmount="0" data-vCostAmount="'+l[f][1]+'"><span><em>'+l[f][0]+'</em>：</span><b>&yen; 0.00</b><b class="dj">&yen; <em class="money" data-money="'+l[f][1]+'">'+formatMoney(l[f][1])+"</em></b></li>";if(o.itemshow(a,n),n.find(".item-wrap").eq(c).find(".response").remove(),"isProdAnswer"==s){n.find(".item-wrap").eq(c).find(".price").before(r);var h=o.reQtys(a.parents(".responseBox"),c);if(""!=h||void 0!=h){var y=n.find(".item-wrap").eq(c).find(".subtotal"),b=y.attr("data-total"),I=n.find(".item-wrap").eq(c).find(".price"),P=I.attr("data-taxPrice"),C=I.attr("data-price");0==h?y.attr("data-vtotal",b):y.attr("data-vtotal",h*P),""!=r&&n.find(".item-wrap").eq(c).find("ul").append('<li class="response responseTotal" data-vLineAmount="'+h*C+'" data-vTaxLineTotal="'+h*P+'"><span>答交金额：</span>&yen; '+formatMoney(h*P)+"</li>")}}else{$("#othersCostSubtotal").before(r);var L=0;othersCostCon.find(".costItem").forEach(function(e){L+=Number($(e).attr("data-vcostamount"))}),$("#othersCostSubtotal").attr("data-vtotal",L),$("#othersCostSubtotal").after('<li id="changeCost" class="response" data-otherMoney="'+L+'"><span>本方小计：</span>&yen; '+formatMoney(L)+"</li>")}$(".item-total-dj").attr("data-vTotalAmount",o.reCostTotalFn()).html("答交总金额：&yen;"+formatMoney(o.reCostTotalFn())).show()},popup:function(e,t,a,n,s){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:s})},delResponse:function(){var e=this,t="<p>您确定要删除此条答交？</p>";container.on("click",".btn-del",function(){var a=$(this),n=a.parent("li");e.popup("confirm","",t,"",function(){n.remove()})})},dateFn:function(){$(".timeBox").mdater({minDate:new Date})},hideTip:function(){$body.on("focus",'input[type="text"]',function(){$("#formTip").removeClass("formTipShow")})},reQtys:function(e){var t=0;return e.find(".int02").each(function(){var e=$(this);t+=parseInt(e.val(),10)}),t},reCostTotalFn:function(){var e=0;return container.find(".subtotal").each(function(){e+=parseInt($(this).attr("data-vtotal"),10)}),e},start:function(){var e=this,t=document.getElementById("orderAnswerInfo"),a=document.getElementById("prodAnswerInfo"),n=document.getElementById("othersCost");t&&(t.innerHTML=e.orderBaseInfo()),a&&(a.innerHTML=e.prodAnswerInfo(),e.fileList()),n&&(n.innerHTML=e.othersCost()),$(".item-total").html("总金额：&yen;"+formatMoney(e.totals)).show(),$(".item-total-dj").attr("data-vTotalAmount",e.reCostTotalFn()).html("答交总金额：&yen;"+formatMoney(e.reCostTotalFn())).show(),e.load&&(2==e.vStatus?bottomBar(["share"],e.memberId,"","答交订单"):3==e.vStatus?bottomBar(["share"],e.memberId,"","提醒确认"):bottomBar(["share"],e.memberId,!0)),container.on("click","a.item-link",function(){var t=$(this),a=t.attr("name"),n=$body.scrollTop();switch(a){case"payInfo":orderReviseInfoCon.html(e.payInfo(n));break;case"remark":orderReviseInfoCon.html(e.remark(n)),$("#intRemarks").val($("#vRemark").val())}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this),t=e.attr("data-scrollTop");e.is("#saveRemark")&&$("#vRemark").val($("#intRemarks").val()),container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(t)},200)}),$body.on("click",".bottom-btn-confirm",function(){if(2==e.vStatus&&e.submitFn(),3==e.vStatus){var t=',"poId":'+_vParams.poAnswerId;e.vendorPoAnswer("B03_poRemindAnswer",t)}}),$body.on("click",".bottom-btn-cancel",function(){})},payInfo:function(e){var t=this,a=t.orderInfo;requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(t.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(t.invoiceType=e.dataSet.data.detail)});var n='<ul class="payInfoList"><li><span>交易条件：</span><p>'+a.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(t.logisticsType,a.logisticsType)+("3"==a.logisticsType?"（自提点："+a.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+a.address+"；"+(""==a.mobile?"":"<br>电话："+a.mobile)+"</p></li><li><span>付款条件：</span><p>"+a.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(t.invoiceType,a.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+a.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+a.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+e+'">完成</a></div>';return n},remark:function(e){for(var t=this,a='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+t.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+t.orderInfo.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',n=0;n<t._files.length;n++)a+='<p><a href="'+t._files[n].fileUrl+'"><i class=i-'+(_reg.test(t._files[n].fileName)?"image":"word")+"></i>"+t._files[n].fileName+"</a></p>";return a+="</div>",a+=2==t.vStatus?'<div class="item-wrap int-remarks">	<textarea name="" id="intRemarks" placeholder="填写我方备注"></textarea></div>':'<div class="item-wrap">	<h2>我方备注：</h2>	<p>'+t.orderInfo.vRemark+"</p></div>",a+='</div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+e+'">完成</a></div>'},popup:function(e,t,a,n,s){new Popup({type:e,title:t,content:a,ok:"确定",cancel:"取消",closeCallBack:n,okCallBack:s})},vTotal:function(){for(var e=this,t=0,a=e._lineLists,n=$("#prodAnswerInfo").find(".item-wrap"),s=0,o=0,i=a.length;i>o;o++)s=0,n.eq(o).find(".valuationQty").forEach(function(e){s+=parseInt($(e).html(),10)}),t+=a[o].price*s;return t},getParam:function(){for(var e=this,t=(e.orderInfo||[],[]),a=[],n=e._othersCost||[],s=e._lineLists||[],o=e._files||[],i=[],r=[],l=[],d=0,c=n.length;c>d;d++)n[d].vCostAmount=othersCostCon.find(".mobiCostItem").eq(d).find(".dj .money").attr("data-money"),a.push(n[d]);for(var p,m=othersCostCon.find(".costItem.response"),v=0,u=m.length;u>v;v++)p={vCostAmount:Number(m.eq(v).attr("data-vcostamount")),costName:m.eq(v).attr("data-costname"),vRemark:"",lineNo:v+1},t.push(p);for(var f,h=[],y=0,b=s.length;b>y;y++){var I=$("#prodAnswerInfo").find(".item-wrap").eq(y),P=I.find(".responseTotal").eq(0),C=I.find(".response").not(".responseTotal"),L={},T=!1;f=s[y],f.addPoLineFileList=[],f.addPoSubLineList=[],f.modiPoSubLineList=[];for(var w=[],N=0,x=f.poSubLineList.length;x>N;N++){var g=f.poSubLineList[N];w.push(g.subId)}if(C.forEach(function(e,t){var a={};a.expectedDelivery=new Date($(e).find(".expectedDelivery").html()).getTime(),a.purchaseQty=$(e).find(".purchaseQty").html(),a.purchaseUnit=s[y].purchaseUnitName,a.valuationQty=$(e).find(".valuationQty").html(),a.valuationUnit=s[y].valuationUnitName,a.lineNo=t+1,f.addPoSubLineList.push(a),T=!0}),f.danShenfileList)for(var A=0,S=f.danShenfileList.length;S>A;A++){var k=f.danShenfileList[A];k.isDeleted?f.delPoLineFileList.push(k.id):k.id||f.addPoLineFileList.push({lineNo:k.lineNo,fileUrl:k.fileUrl,fileSize:k.fileSize,fileName:k.fileName})}var _=0;C.find(".purchaseQty").forEach(function(e){_+=Number($(e).html())}),L.poAnswerLineId=f.id,L.vProdId=f.vProdId,L.vProdCode=$.trim(f.vProdCode),L.vProdDesc=$.trim(f.vProdDesc),L.vProdScale=$.trim(f.vProdScale),L.vProdName=$.trim(f.vProdName),L.isBatchAnswer=T?1:f.vBatchAnswer,L.vPurchaseQty=_,L.vValuationQty=P.attr("data-vtaxlinetotal")/f.vTaxPrice,L.vExpectedDelivery=new Date(f.vExpectedDelivery).getTime(),L.vPrice=f.vPrice,L.vTaxPrice=f.vTaxPrice,L.vRemark=f.vRemark,L.vLineAmount=Number(P.attr("data-vlineamount")),L.vTaxLineTotal=Number(P.attr("data-vtaxlinetotal")),L.vAnswerUnitId=f.vAnswerUnitId,L.vAnswerUnitCode=f.vAnswerUnitCode,L.vAnswerUnitName=f.vAnswerUnitName,L.vValuationUnitId=f.vValuationUnitId,L.vValuationUnitCode=f.vValuationUnitCode,L.vValuationUnitName=f.vValuationUnitName,L.addPoSubLineList=f.addPoSubLineList?f.addPoSubLineList:[],L.modiPoSubLineList=f.modiPoSubLineList?f.modiPoSubLineList:[],L.delPoSubLineList=w?w:[],L.vFileCount=f.addPoLineFileList.length,L.addPoLineFileList=f.addPoLineFileList?f.addPoLineFileList:[],L.delPoLineFileList=f.delPoLineFileList?f.delPoLineFileList:[],h.push(L)}for(var B=0,R=o.length;R>B;B++){var U=o[B];U.isDeleted?i.push(U.id):U.id||r.push({lineNo:U.lineNo,fileUrl:U.fileUrl,fileSize:U.fileSize,fileName:U.fileName})}var F=Number($("#changeCost").attr("data-othermoney")),q=Number($(".item-total-dj").eq(0).attr("data-vtotalamount")),j=q-F;return{vStatus:3,poAnswerId:_vParams.poAnswerId,vendorId:_vParams.vendorId,serviceId:"B03_saveAnswerPo",modiPoLineList:h,addPoOtherCostList:t,modiPoOthreCostList:a,delPoOthreCostList:l,vFeeInfo:{vTotal:e.vTotal(),vOtherCostTotal:F,vTaxTotal:j,vTotalAmount:q},addPoFileList:r,delPoFileList:i,vRemark:$("#vRemark").val()}},submitFn:function(){var e=this,t=e.getParam();t.token=_vParams.token,t.secretNumber=_vParams.secretNumber,console.log(JSON.stringify(t))},vendorPoAnswer:function(e,t){var a=this,t=t||"";$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{ "token":"'+_vParams.token+'", "secretNumber":"'+_vParams.secretNumber+'", "serviceId":"'+e+'", "poAnswerId":"'+_vParams.poAnswerId+'", "companyId":"'+_vParams.vendorId+'", "vendorId":"'+_vParams.vendorId+'", "commonParam":'+JSON.stringify(commonParam())+t+" }"},success:function(e){e=e||{},e.success?(fnTip.success(2e3),setTimeout(function(){goBack()},2e3)):a.popup("alert","","提交失败："+e.errorMsg)}})}};