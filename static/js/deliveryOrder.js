/*
出货单详情
*/
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var $scope = {};
var $fileData = {};
var deliveryOrder = function(){
	this.init();
}
deliveryOrder.prototype = {
	init: function(){
		this.commonParam = JSON.stringify(commonParam());
		this.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';

		this.start();
	},
	orderHead: function(){
		var that = this, html = '';
		$.ajax({
			type:"POST",
	        async: false,
	        url:config.serviceUrl,
	        data: {
		        "param": '{"doId":"'+ _vParams.doId +'","companyId":"'+ _vParams.companyId +'",'+ that.tokens +',"serviceId":"B03_getDeliveryOrderInfo", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.orderInfo = data.deliveryOrder;
	        		html+='<h2 class="m-title">基础信息</h2>'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>客户：</span>'+ $scope.orderInfo.customerCode + '-' + $scope.orderInfo.customerAbbr +'</li>'
						+'			<li><span>出货单号：</span><b>'+ $scope.orderInfo.doFormNo +'</b></li>'
						+'			<li><span>内部单号：</span><b>'+ $scope.orderInfo.doInsideNo +'</b></li>'
						+'			<li><span>出货日期：</span>'+ $scope.orderInfo.doFormDate +'</li>'
						+'			<li><span>预送达时间：</span>'+ $scope.orderInfo.planDeliveryDate +'</li>'
						+'			<li><span>交易币别：</span>'+ $scope.orderInfo.currencyName +'</li>'
						+'			<li><span>交易税别：</span>'+ $scope.orderInfo.taxName +'<label class="checkbox'+ (($scope.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ $scope.orderInfo.taxRate*100 +'%</label></li>'
						+'			<li><span>交易条件：</span>'+ $scope.orderInfo.conditionName +'</li>'
						+'			<li><span>收款条件：</span>'+ $scope.orderInfo.payWayName +'</li>'
						+'		</ul>'
						+'	</div>'
					$('.orderInfo').html(html);
	        	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
	        }
		})
	},
	orderBody: function(){
		var that = this, html = '';

	    //加载单身附件
	    function f_init_l_file(line){
	        line.l_file = [];

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":'14', "companyId":_vParams.companyId, "searchType":2, "id":line.lineId, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
				if(data.success){
					data.fileList.forEach(function(v){
	                    line.l_file.push({
	                        "id": v.id,
	                        "fileName":v.fileName,
	                        "fileSize":v.fileSize,
	                        "fileUrl": v.fileUrl,
	                        "lineNo": v.lineNo
	                    });
	                });
				}
			});	
	    }

		$.ajax({
			type:"POST",
	        url:config.serviceUrl,
	        data: {
		        "param": '{"doId":"'+ _vParams.doId +'","companyId":"'+ $scope.orderInfo.companyId +'",'+ that.tokens +',"serviceId":"B03_findDoLineList", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.doLineList = data.doLineList, L = $scope.doLineList.length;
	        		html+='<h2 class="m-title">出货产品</h2>'
					for(var i=0; i<L; i++){
						var unitName = true;
						if($scope.doLineList[i].deliveryUnitName==$scope.doLineList[i].valuationUnitName){
							unitName = false;
						}
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>出货产品：</span><p>'+ $scope.doLineList[i].prodName + ' ' + $scope.doLineList[i].prodScale +'</p></li>'
							+'		<li><span>来源单据：</span><p>采购单：' + $scope.doLineList[i].sourcePoNo + '-' + $scope.doLineList[i].sourcePoLineNo +(($scope.doLineList[i].sourceSoNo=='') ? '' : '<br>销售单：' + $scope.doLineList[i].sourceSoNo + '-' + $scope.doLineList[i].sourceSoLineNo) +'</p></li>'
							+'		<li><span>出货数量：</span><p>'+ $scope.doLineList[i].deliveryQty + $scope.doLineList[i].deliveryUnitName + (unitName ? ('/'+ $scope.doLineList[i].deliveryValuationQty + $scope.doLineList[i].valuationUnitName) : '') +'</p></li>'
							+'		<li><span>批号：</span>'+ $scope.doLineList[i].batchNo +'</li>'
							+'		<li><span>出货仓库：</span>'+ $scope.doLineList[i].invName +'</li>'
							+'		<li><span>出货库位：</span>'+ $scope.doLineList[i].locationName +'</li>'
							+'		<li><span>签收数量：</span>'+ $scope.doLineList[i].receiveQty + $scope.doLineList[i].deliveryUnitName + (unitName ? ('/'+ $scope.doLineList[i].receiveValuationQty + $scope.doLineList[i].valuationUnitName) : '') +'</li>'
							+'		<li><span>销退数量：</span>'+ $scope.doLineList[i].srQty + $scope.doLineList[i].deliveryUnitName + (unitName ? ('/'+ $scope.doLineList[i].srValuationQty + $scope.doLineList[i].valuationUnitName) : '') +'</li>'
							+'		<li><span>备注：</span><p>'+ $scope.doLineList[i].remark +'</p></li>'
							+'	</ul>'
							+'</div>'
						f_init_l_file($scope.doLineList[i]);
					}
					$('.deliveryOrderDetail').html(html);

					$scope.doLineList.forEach(function(line,idx){
						var fileHTML = '<p>'
						line.l_file.forEach(function(val){
							fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
						})
						fileHTML += '</p>'
						$('.deliveryOrderDetail .files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
					})

	        	}else{
            		fnTip.hideLoading();
            		container.show().html('<p style="line-height:2rem; text-align:center">'+ data.errorMsg +'</p>')
            	}
	        }
		})
	},
	remark: function(){
		var html='', fileHTML = '<p>';

		var logisticsType = [];
		requestFn("B02_LogisticsType",function(data){
			if(data.errorCode=='0'){
				logisticsType = data.dataSet.data.detail;
			}
		});

		html+='<h2 class="m-title">物流和备注</h2>'
			+'	<div class="item-wrap">'
			+'		<ul>'
			+'			<li><span>物流方式：</span>'+ enumFn(logisticsType,$scope.orderInfo.logisticsType) +'</li>'
			+'			<li><span>物流商：</span>'+ $scope.orderInfo.logisticsName +'</li>'
			+'			<li><span>物流单号：</span>'+ ($scope.orderInfo.logisticsNo||'--') +'</li>'
			+'			<li><span>联系人：</span>'+ ($scope.orderInfo.logisticsMan||'--') +'</li>'
			+'			<li><span>联系方式：</span>'+ ($scope.orderInfo.logisticsMobile||'--') +'</li>'
			+'			<li><span>'+ (($scope.orderInfo.logisticsType=='3') ? '自提点':'收货地址') +'：</span><p>'+ $scope.orderInfo.provinceName + $scope.orderInfo.cityName + $scope.orderInfo.districtName + $scope.orderInfo.address + '<br>(收货人：'+ $scope.orderInfo.contactPerson +'，电话：'+ $scope.orderInfo.mobile +')</p></li>'
			+'			<li><span>出货备注：</span>'+ $scope.orderInfo.remark +'</li>'
			+'			<li class="files"><span>出货附件：</span></li>'
			+'		</ul>'
			+'	</div>'
		$('.remarks').html(html);
		//单头附件
		var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":$scope.orderInfo.companyId, "id":_vParams.doId, "commonParam":commonParam(), "docType":"14","searchType":1};//searchType查询类型1单头2单身
		GetAJAXData('POST',fileParam,function(fileData){
			if(fileData.success){
				$fileData = fileData.fileList;
				$fileData.forEach(function(val){
					fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
				})
				fileHTML += '</p>';
				$('.remarks .files').html('<span>附件：</span>'+fileHTML).show();
			}
		})
	},
	start: function(){
		var that = this;
		that.orderHead();
		that.orderBody();
		setTimeout(function(){
			fnTip.hideLoading();
		},0);
		that.remark();
	}
}