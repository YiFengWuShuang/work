var _vParams=JSON.parse(decodeURI(getQueryString("param"))),container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),receivOrder=function(){this.init()};receivOrder.prototype={init:function(){this.commonParam=JSON.stringify(commonParam()),this.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',this.start()},orderHead:function(){var e=this,r="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"roId":'+_vParams.roId+',"companyId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_getReceiveOrderInfo", "commonParam":'+e.commonParam+"}"},success:function(e){if(e=e||{},e.success){var a=e.receiveOrder;if("receive_err_033"==e.errorCode)return r=e.errorMsg;r+='<div class="m-item">	<div class="item-wrap">		<ul>			<li><span>供应商：</span>'+a.vendorName+"</li>			<li><span>收货单单号：</span><b>"+a.roFormNo+"</b></li>			<li><span>收货日期：</span>"+a.roFormDate+"</li>			<li><span>收货人：</span>"+a.receiveManName+'</li>		</ul>	</div></div><div class="m-item receivOrderOrderDetail"></div>'}}}),r},orderBody:function(){var e=this,r="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"roId":'+_vParams.roId+',"companyId":'+_vParams.companyId+","+e.tokens+',"serviceId":"B03_findRoLineList", "commonParam":'+e.commonParam+"}"},success:function(e){if(e=e||{},e.success){var a=e.roLineList,i=a.length;r+='<h2 class="m-title">出货明细</h2>';for(var n=0;i>n;n++)r+='<div class="item-wrap">	<ul>		<li><span>采购单号：</span><b>'+a[n].sourcePoNo+"</b></li>		<li><span>物料编码：</span><b>"+a[n].prodCode+"</b></li>		<li><span>物料详细：</span><p>"+a[n].prodDesc+" "+a[n].prodScale+"</p></li>		<li><span>待收货数量：</span>"+a[n].receiveQty+a[n].receiveUnitName+"/"+a[n].receiveValuationQty+a[n].valuationUnitName+"</li>		<li><span>收货数量：</span>"+a[n].receiveQty+a[n].receiveUnitName+"/"+a[n].receiveValuationQty+a[n].valuationUnitName+"</li>		<li><span>收货批号：</span>"+a[n].batchNo+"</li>		<li><span>收货备注：</span><p>"+a[n].remark+"</p></li>	</ul></div>"}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+e.errorMsg+"</p>")}}),r},start:function(){var e=this;$(".receivOrder").html(e.orderHead()),$(".receivOrderOrderDetail").html(e.orderBody()),setTimeout(function(){fnTip.hideLoading()},0),bottomBar(["share"],"","","我要收货"),$body.on("click",".bottom-btn-confirm",function(){})}};