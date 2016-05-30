var formTip='<div id="formTip" class="formTip"></div>',$itemTips=$(".item-tips"),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),_vParams=JSON.parse(decodeURI(getQueryString("param"))),_reg=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/,Lists=function(){this.init()};Lists.prototype={init:function(){var a=this;a._files=[],a._lineLists=[],a._othersCost=[],a.totals=0,a.load=!1,requestFn("B03_POCType",function(e){"0"==e.errorCode&&(a.changeType=e.dataSet.data.detail)}),requestFn("B03_POCReasonType",function(e){"0"==e.errorCode&&(a.changeReasons=e.dataSet.data.detail)}),requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(a.logisticsType=e.dataSet.data.detail)}),requestFn("B02_InvoiceType",function(e){"0"==e.errorCode&&(a.invoiceType=e.dataSet.data.detail)}),a.start()},orderBaseInfo:function(){var a=this,e="",n={serviceId:"B03_getPoChangeInfo",companyId:_vParams.companyId,id:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(n),success:function(n){n=n||{},n.success&&(a.orderInfo=n.poChange,e+='<h2 class="m-title">变更信息</h2><div class="item-wrap">	<ul>		<li><span>内部采购单号：</span><b>'+a.orderInfo.poInsideNo+"</b></li>		<li><span>变更类型：</span>"+enumFn(a.changeType,a.orderInfo.changeType)+"</li>		<li><span>变更日期：</span>"+transDate(a.orderInfo.pocFormDate)+"</li>		<li><span>变更原因：</span>"+enumFn(a.changeReasons,a.orderInfo.changeReason)+"</li>		<li><span>变更备注：</span>"+a.orderInfo.remark+"</li>	</ul></div>")}}),e},fileList:function(){var a=this;if(a.load){var e={secretNumber:_vParams.secretNumber,token:_vParams.token,serviceId:"B01_findFileList",companyId:_vParams.companyId,commonParam:commonParam(),fileSource:"2",searchType:"1",id:_vParams.id,docType:25};$.ajax({type:"POST",url:config.serviceUrl,data:"param="+JSON.stringify(e),success:function(e){if(e=e||{},e.success){for(var n=e.fileList,s=0,t=n.length;t>s;s++)""!=n[s].fileName&&$(".files").eq(s).html('<span>附件：</span><a href="'+n[s].fileUrl+'"><i class=i-'+(_reg.test(n[s].fileName)?"image":"word")+"></i>"+n[s].fileName+"</a>").show();a._files=n}}})}},prodBodyInfo:function(){var a=this,e="",n={serviceId:"B03_findPoChangeLineList",companyId:_vParams.companyId,id:_vParams.id,commonParam:commonParam(),token:_vParams.token,secretNumber:_vParams.secretNumber};return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:"param="+JSON.stringify(n),success:function(n){if(n=n||{},n.success){var s=n.changeList;a._lineLists=s,e='<h2 class="m-title">采购明细</h2>';for(var t=0,i=s.length;i>t;t++)e+='<div class="item-wrap" data-index="'+t+'">	<ul>		<li class="prodCode"><span>物料编码：</span><b>'+s[t].prodCode+"</b></li>		<li><span>物料名称：</span><p>"+s[t].prodName+"</p></li>		<li><section><span>数量：</span><em>"+s[t].purchaseQty+"</em>"+s[t].purchaseUnitName+"/<em>"+s[t].valuationQty+"</em>"+s[t].valuationUnitName+"</section><section><span>交期：</span><em>"+transDate(s[t].expectedDelivery)+'</em></section></li>		<li class="changeItem"><section><span>变更：</span><em>'+s[t].changeQty+"</em>"+s[t].purchaseUnitName+"/<em>"+s[t].changeValuationQty+"</em>"+s[t].valuationUnitName+"</section><section><span>交期：</span><em>"+transDate(s[t].changeExpectedDelivery)+'</em></section></li>		<li class="price"><span>单价：</span>&yen; '+formatMoney(s[t].taxPrice)+"/"+s[t].valuationUnitName+"</li>		<li><span>备注：</span><p>"+s[t].remark+'</p></li>		<li class="files"><span>附件：</span></li>		<li class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(s[t].taxLineTotal)+"</b></li>"+(""!=s[t].changeTaxLineTotal?'<li class="changeItem changeLineTotal" data-changeTotal="'+s[t].changeTaxLineTotal+'"><span>变更金额：</span>&yen; '+formatMoney(s[t].changeTaxLineTotal)+"</li>":"")+"	</ul></div>",a.totals+=parseInt(s[t].taxLineTotal,10);a.load=!0,setTimeout(function(){container.show(),fnTip.hideLoading()},0)}else container.show().html('<p style="text-align:center;">'+n.errorMsg+"</p>"),fnTip.hideLoading()}}),e},othersCost:function(){var a=this,e="",n=0,s=0,t=!1;if(a.load){var i={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B03_findPoChangeOtherCostList",companyId:_vParams.companyId,pocId:_vParams.id,commonParam:commonParam()};$.ajax({type:"POST",url:config.serviceUrl,async:!1,data:"param="+JSON.stringify(i),success:function(i){if(i=i||{},i.success){var o=i.poChangeOtherCostList;a._othersCost=o,e='<h2 class="m-title">其他费用</h2><div class="item-wrap" data-index="0"><ul>';for(var r=0,c=o.length;c>r;r++)e+="<li><span>"+o[r].costName+"：</span><b>&yen; "+formatMoney(o[r].costAmount)+'</b><b class="dj"><em class="money" data-money="'+(""==o[r].changeCostAmount?o[r].costAmount:o[r].changeCostAmount)+'">'+(""==o[r].changeCostAmount?"":formatMoney(o[r].changeCostAmount))+"</em></b></li>",n+=Number(""==o[r].costAmount?0:o[r].costAmount),s+=Number(""==o[r].changeCostAmount?o[r].costAmount:o[r].changeCostAmount),""!=o[r].changeCostAmount&&(t=!0);e+='<li id="othersCostSubtotal" class="subtotal"><span>小计：</span><b>&yen; '+formatMoney(n)+'</b></li><li id="changeCost" class="response changeLineTotal" data-changeTotal="'+s+'"><span>变更费用：</span>&yen; '+formatMoney(s)+"</li></ul></div>",$("#othersCost").html(e),a.totals+=Number(n)}}})}},reCostTotalFn:function(){var a=0;return container.find(".changeLineTotal").each(function(){a+=parseInt($(this).attr("data-changeTotal"),10)}),a},initSelect3:function(a,e,n){$(a).select3({allowClear:!0,items:e,placeholder:"请选择",showSearchInputInDropdown:!1,value:n})},start:function(){var a=this,e=document.getElementById("orderHeadInfo"),n=document.getElementById("prodBodyInfo");e.innerHTML=a.orderBaseInfo(),n.innerHTML=a.prodBodyInfo(),a.fileList(),a.othersCost(),$(".item-total").html("变更前总金额：&yen;"+formatMoney(a.totals)).show(),$(".item-total-dj").html("变更后总金额：&yen;"+formatMoney(a.reCostTotalFn())).show(),bottomBar(["share"],a.orderInfo.mobile,!0),container.on("click","a.item-link",function(){var e=$(this),n=e.attr("name"),s=$body.scrollTop();switch(n){case"payInfo":orderReviseInfoCon.html(a.payInfo(s));break;case"remark":orderReviseInfoCon.html(a.remark(s));break;case"changeCause":orderReviseInfoCon.html(a.changeCause(s)),a.POCReasonType()}$body.scrollTop(0),container.addClass("contarinEdit"),$("#jBottom").addClass("m-bottom-hide")}).on("click",".btn-wrap .btnB",function(){var e=$(this),n=e.attr("data-scrollTop");if(e.is("#saveChangeCause")){var s=reEnumFn(a.pocReasonType,$("#changeCause").select3("value"));$("#changeCauseVal1").val(s),$("#changeCauseVal2").val($("#intRemarks").val())}container.removeClass("contarinEdit"),$("#jBottom").removeClass("m-bottom-hide"),setTimeout(function(){$body.scrollTop(n)},200)})},changeCause:function(){var a='<div class="m-item m-item-select">	<h2 class="m-title">变更类型：</h2>	<div id="changeCause" class="select3-input"></div></div><div class="m-item">	<h2 class="m-title">变更原因：</h2>	<div class="item-wrap int-remarks">		<textarea name="" id="intRemarks" placeholder="在此处录入变更的备注和说明"></textarea>	</div></div><div class="btn-wrap">	<a href="javascript:;" id="saveChangeCause" class="btnB">保存说明</a></div>';return a},POCReasonType:function(){var a=this,e=[];requestFn("B03_POCReasonType",function(n){if("0"==n.errorCode){{var s=n.dataSet.data.detail;s.length}a.pocReasonType=s,s.forEach(function(a){e.push(a.Value)})}}),a.initSelect3("#changeCause",e,"")},payInfo:function(a){var e=this,n=e.orderInfo,s='<ul class="payInfoList"><li><span>交易条件：</span><p>'+n.conditionName+"</p></li><li><span>物流方式：</span><p>"+enumFn(e.logisticsType,n.logisticsType)+("3"==n.logisticsType?"（自提点："+n.address+"）":"")+"</p></li><li><span>收货地址：</span><p>"+n.address+"；"+(""==n.mobile?"":"<br>电话："+n.mobile)+"</p></li><li><span>付款条件：</span><p>"+n.payWayName+"</p></li><li><span>发票类型：</span><p>"+enumFn(e.invoiceType,n.invoiceType)+"</p></li><li><span>发票抬头：</span><p>"+n.invoiceHeader+"</p></li><li><span>发票类容：</span><p>"+n.invoiceContent+'</p></li></ul><div class="btn-wrap"><a href="javascript:;" class="btnB" data-scrollTop="'+a+'">完成</a></div>';return s},remark:function(a){for(var e=this,n='<div class="remarks-wrap"><div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+e.orderInfo.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+e.orderInfo.poRemark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2>',s=0;s<e._files.length;s++)n+='<p><a href="'+e._files[s].fileUrl+'"><i class=i-'+(_reg.test(e._files[s].fileName)?"image":"word")+"></i>"+e._files[s].fileName+"</a></p>";return n+='</div></div></div><div class="btn-wrap"><a href="javascript:;" id="saveRemark" class="btnB" data-scrollTop="'+a+'">完成</a></div>'},popup:function(a,e,n,s,t){new Popup({type:a,title:e,content:n,ok:"确定",cancel:"取消",closeCallBack:s,okCallBack:t})}};