/*
收货单详情
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var orderReviseInfoCon = $('#orderReviseInfoCon');
var _reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
var $scope = {};
var $fileData = {};
var receivOrder = function(){
	this.init();
}
receivOrder.prototype = {
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
		        "param": '{"roId":'+ _vParams.roId +',"companyId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_getReceiveOrderInfo", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.orderInfo = data.receiveOrder;
	        		if(data.errorCode=='receive_err_033'){
	        			html = data.errorMsg;
	        			return html;
	        		}
	        		html+='<h2 class="m-title">基础信息</h2>'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>供应商：</span>'+ $scope.orderInfo.vendorCode + '-' + $scope.orderInfo.vendorAbbr +'</li>'
						+'			<li><span>收货单号：</span><b>'+ $scope.orderInfo.roFormNo +'</b></li>'
						+'			<li><span>内部单号：</span><b>'+ $scope.orderInfo.roInsideNo +'</b></li>'
						+'			<li><span>收货日期：</span>'+ $scope.orderInfo.roFormDate +'</li>'
						+'			<li><span>收货人：</span>'+ $scope.orderInfo.receiveManName +'</li>'
						+'			<li><span>交易币别：</span>'+ $scope.orderInfo.currencyName +'</li>'
						+'			<li><span>交易税别：</span>'+ $scope.orderInfo.taxName +'<label class="checkbox'+ (($scope.orderInfo.isContainTax==1) ? ' on':'') +'"><input type="checkbox" checked="checked" disabled>含税'+ $scope.orderInfo.taxRate*100 +'%</label></li>'
						+'			<li><span>交易条件：</span>'+ $scope.orderInfo.conditionName +'</li>'
						+'			<li><span>付款条件：</span>'+ $scope.orderInfo.payWayName +'</li>'
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

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":15, "companyId":_vParams.companyId, "searchType":2, "id":line.lineId, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
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
		        "param": '{"roId":'+ _vParams.roId +',"companyId":'+ _vParams.companyId +','+ that.tokens +',"serviceId":"B03_findRoLineList", "commonParam":'+ that.commonParam +'}'
		    },
	        success:function(data){
	        	data = data || {};
	        	if(data.success){
	        		$scope.roLineList = data.roLineList, L = $scope.roLineList.length
	        		html+='<h2 class="m-title">收货产品</h2>'
					for(var i=0; i<L; i++){
						var unitName = true;
						if($scope.roLineList[i].receiveUnitName==$scope.roLineList[i].valuationUnitName){
							unitName = false;
						}
						html+='<div class="item-wrap">'
							+'	<ul>'
							+'		<li><span>收货产品：</span><p>' + $scope.roLineList[i].prodName + ' ' + $scope.roLineList[i].prodScale +'</p></li>'
							+'		<li><span>来源单据：</span><p>采购单：' + $scope.roLineList[i].sourcePoNo + '-' + $scope.roLineList[i].sourcePoLineNo +(($scope.roLineList[i].sourceDoNo=='') ? '' : '<br>送货单：' + $scope.roLineList[i].sourceDoNo + '-' + $scope.roLineList[i].sourceDoLineNo) +'</p></li>'
							+'		<li><span>收货批号：</span>'+ $scope.roLineList[i].batchNo +'</li>'
							+'		<li><span>收货数量：</span>'+ ($scope.roLineList[i].receiveQty||0) + $scope.roLineList[i].receiveUnitName + (unitName ? ('/'+ ($scope.roLineList[i].receiveValuationQty||0) + $scope.roLineList[i].valuationUnitName):'') +'</li>'
							+'		<li><span>验退数量：</span>'+ ($scope.roLineList[i].prQty||0) + $scope.roLineList[i].receiveUnitName + (unitName ? ('/'+ ($scope.roLineList[i].prValuationQty||0) + $scope.roLineList[i].valuationUnitName):'') +'</li>'
							+'		<li><span>收货仓库：</span>'+ $scope.roLineList[i].invName +'</li>'
							+'		<li><span>备注：</span><p>'+ $scope.roLineList[i].remark +'</p></li>'
							+'		<li class="files"><span>附件：</span></li>'
							+'	</ul>'
							+'</div>'
						f_init_l_file($scope.roLineList[i]);
					}
					$('.receivOrderOrderDetail').html(html);
					$scope.roLineList.forEach(function(line,idx){
						var fileHTML = '<p>'
						line.l_file.forEach(function(val){
							fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
						})
						fileHTML += '</p>'
						$('.receivOrderOrderDetail .files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
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

		html+='<h2 class="m-title">备注</h2>'
			+'	<div class="item-wrap">'
			+'		<ul>'
			+'			<li><span>备注信息：</span>'+ $scope.orderInfo.remark +'</li>'
			+'			<li class="files"><span>附件：</span></li>'
			+'		</ul>'
			+'	</div>'
		$('.remarks').html(html);

		//单头附件
		var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":$scope.orderInfo.companyId, "id":_vParams.roId, "commonParam":commonParam(), "docType":"15","fileSource":1,"searchType":1};//searchType查询类型1单头2单身
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
		//通用底部
		//bottomBar(['share'],'',true);
	}
}