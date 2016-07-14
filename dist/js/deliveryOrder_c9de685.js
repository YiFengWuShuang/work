var container=$(".contarin"),orderReviseInfoCon=$("#orderReviseInfoCon"),$scope={},$fileData={},deliveryOrder=function(){this.init()};deliveryOrder.prototype={init:function(){this.commonParam=JSON.stringify(commonParam()),this.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',this.start()},orderHead:function(){var e=this,o="";$.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:'{"doId":"'+_vParams.doId+'","companyId":"'+_vParams.companyId+'",'+e.tokens+',"serviceId":"B03_getDeliveryOrderInfo", "commonParam":'+e.commonParam+"}"},success:function(e){e=e||{},e.success?($scope.orderInfo=e.deliveryOrder,o+='<h2 class="m-title">基础信息</h2>	<div class="item-wrap">		<ul>			<li><span>客户：</span>'+$scope.orderInfo.customerCode+"-"+$scope.orderInfo.customerAbbr+"</li>			<li><span>出货单号：</span><b>"+$scope.orderInfo.doFormNo+"</b></li>			<li><span>内部单号：</span><b>"+$scope.orderInfo.doInsideNo+"</b></li>			<li><span>出货日期：</span>"+$scope.orderInfo.doFormDate+"</li>			<li><span>预送达时间：</span>"+$scope.orderInfo.planDeliveryDate+"</li>			<li><span>交易币别：</span>"+$scope.orderInfo.currencyName+"</li>			<li><span>交易税别：</span>"+$scope.orderInfo.taxName+'<label class="checkbox'+(1==$scope.orderInfo.isContainTax?" on":"")+'"><input type="checkbox" checked="checked" disabled>含税'+100*$scope.orderInfo.taxRate+"%</label></li>			<li><span>交易条件：</span>"+$scope.orderInfo.conditionName+"</li>			<li><span>收款条件：</span>"+$scope.orderInfo.payWayName+"</li>		</ul>	</div>",$(".orderInfo").html(o)):(fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+e.errorMsg+"</p>"))}})},orderBody:function(){function e(e){e.l_file=[],GetAJAXData("POST",{serviceId:"B01_findFileList",docType:"14",companyId:_vParams.companyId,searchType:2,id:e.lineId,token:_vParams.token,secretNumber:_vParams.secretNumber,commonParam:commonParam()},function(o){o.success&&o.fileList.forEach(function(o){e.l_file.push({id:o.id,fileName:o.fileName,fileSize:o.fileSize,fileUrl:o.fileUrl,lineNo:o.lineNo})})})}var o=this,i="";$.ajax({type:"POST",url:config.serviceUrl,data:{param:'{"doId":"'+_vParams.doId+'","companyId":"'+$scope.orderInfo.companyId+'",'+o.tokens+',"serviceId":"B03_findDoLineList", "commonParam":'+o.commonParam+"}"},success:function(o){if(o=o||{},o.success){$scope.doLineList=o.doLineList,L=$scope.doLineList.length,i+='<h2 class="m-title">出货产品</h2>';for(var s=0;L>s;s++){var n=!0;$scope.doLineList[s].deliveryUnitName==$scope.doLineList[s].valuationUnitName&&(n=!1),i+='<div class="item-wrap">	<ul>		<li><span>出货产品：</span><p>'+$scope.doLineList[s].prodName+" "+$scope.doLineList[s].prodScale+"</p></li>		<li><span>来源单据：</span><p>采购单："+$scope.doLineList[s].sourcePoNo+"-"+$scope.doLineList[s].sourcePoLineNo+(""==$scope.doLineList[s].sourceSoNo?"":"<br>销售单："+$scope.doLineList[s].sourceSoNo+"-"+$scope.doLineList[s].sourceSoLineNo)+"</p></li>		<li><span>出货数量：</span><p>"+$scope.doLineList[s].deliveryQty+$scope.doLineList[s].deliveryUnitName+(n?"/"+$scope.doLineList[s].deliveryValuationQty+$scope.doLineList[s].valuationUnitName:"")+"</p></li>		<li><span>批号：</span>"+$scope.doLineList[s].batchNo+"</li>		<li><span>出货仓库：</span>"+$scope.doLineList[s].invName+"</li>		<li><span>出货库位：</span>"+$scope.doLineList[s].locationName+"</li>		<li><span>签收数量：</span>"+$scope.doLineList[s].receiveQty+$scope.doLineList[s].deliveryUnitName+(n?"/"+$scope.doLineList[s].receiveValuationQty+$scope.doLineList[s].valuationUnitName:"")+"</li>		<li><span>销退数量：</span>"+$scope.doLineList[s].srQty+$scope.doLineList[s].deliveryUnitName+(n?"/"+$scope.doLineList[s].srValuationQty+$scope.doLineList[s].valuationUnitName:"")+"</li>		<li><span>备注：</span><p>"+$scope.doLineList[s].remark+"</p></li>	</ul></div>",e($scope.doLineList[s])}$(".deliveryOrderDetail").html(i),$scope.doLineList.forEach(function(e,o){var i="<p>";e.l_file.forEach(function(e){i+='<a href="'+e.fileUrl+'"><i class=i-'+(_reg.test(e.fileName)?"image":"word")+"></i>"+e.fileName+"</a>"}),i+="</p>",$(".deliveryOrderDetail .files").eq(o).html("<span>附件：</span>"+i).show()})}else fnTip.hideLoading(),container.show().html('<p style="line-height:2rem; text-align:center">'+o.errorMsg+"</p>")}})},remark:function(){var e="",o="<p>",i=[];requestFn("B02_LogisticsType",function(e){"0"==e.errorCode&&(i=e.dataSet.data.detail)}),e+='<h2 class="m-title">物流和备注</h2>	<div class="item-wrap">		<ul>			<li><span>物流方式：</span>'+enumFn(i,$scope.orderInfo.logisticsType)+"</li>			<li><span>物流商：</span>"+$scope.orderInfo.logisticsName+"</li>			<li><span>物流单号：</span>"+($scope.orderInfo.logisticsNo||"--")+"</li>			<li><span>联系人：</span>"+($scope.orderInfo.logisticsMan||"--")+"</li>			<li><span>联系方式：</span>"+($scope.orderInfo.logisticsMobile||"--")+"</li>			<li><span>"+("3"==$scope.orderInfo.logisticsType?"自提点":"收货地址")+"：</span><p>"+$scope.orderInfo.provinceName+$scope.orderInfo.cityName+$scope.orderInfo.districtName+$scope.orderInfo.address+"<br>(收货人："+$scope.orderInfo.contactPerson+"，电话："+$scope.orderInfo.mobile+")</p></li>			<li><span>出货备注：</span>"+$scope.orderInfo.remark+'</li>			<li class="files"><span>出货附件：</span></li>		</ul>	</div>',$(".remarks").html(e);var s={token:_vParams.token,secretNumber:_vParams.secretNumber,serviceId:"B01_findFileList",companyId:$scope.orderInfo.companyId,id:_vParams.doId,commonParam:commonParam(),docType:"14",searchType:1};GetAJAXData("POST",s,function(e){e.success&&($fileData=e.fileList,$fileData.forEach(function(e){o+='<a href="'+e.fileUrl+'"><i class=i-'+(_reg.test(e.fileName)?"image":"word")+"></i>"+e.fileName+"</a>"}),o+="</p>",$(".remarks .files").html("<span>附件：</span>"+o).show())})},start:function(){var e=this;e.orderHead(),e.orderBody(),setTimeout(function(){fnTip.hideLoading()},0),e.remark()}};