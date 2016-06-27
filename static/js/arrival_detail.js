/*
到货通知详情
*/
var _vParams = JSON.parse(decodeURI(getQueryString('param')));
var container = $('.contarin');
var $scope = {};
var arrivalOrder = function(){
	this.init();
}
arrivalOrder.prototype = {
	init: function(){
		var that = this;
		setTimeout(function(){
			fnTip.hideLoading();
			container.show();
		},0)


		//订单信息
		function getOrderInfo(){
			var html='';
			var param = {"serviceId":"B03_getDeliveryOrderNoticeInfo", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"doId":_vParams.doId,"companyId":_vParams.companyId,"commonParam": commonParam()};
			GetAJAXData('POST',param,function(data){
				if(data.success){
					success = true;
					$scope.orderInfo = data.deliveryOrderNotic;
	        		html+='<h2 class="m-title">基础信息</h2>'
						+'	<div class="item-wrap">'
						+'		<ul>'
						+'			<li><span>出货日期：</span>'+ $scope.orderInfo.doFormDate +'</li>'
						+'			<li><span>预计送达时间：</span><b>'+ $scope.orderInfo.planDeliveryDate +'</b></li>'
						+'			<li><span>到货地址：</span>'+ $scope.orderInfo.address +'</li>'
						+'		</ul>'
						+'	</div>'
					$('.orderInfo').html(html);			
				}else{
					container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
					success = false;
				}
			});			
		}
		getOrderInfo();

	    //加载单身附件
	    function f_init_l_file(line){
	        line.l_file = [];

	        GetAJAXData('POST',{"serviceId":"B01_findFileList", "docType":'26', "companyId":_vParams.companyId, "searchType":2, "id":line.rolineId, "token":_vParams.token, "secretNumber":_vParams.secretNumber,"commonParam":commonParam()},function(data){
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
		//获取产品明细
		function getDoNoticeLineList(){
			var html='';
			var param = {"serviceId":"B03_findDoNoticeLineList", "token":_vParams.token, "secretNumber":_vParams.secretNumber,"doId":_vParams.doId,"companyId":_vParams.companyId,"commonParam": commonParam()};
			GetAJAXData('POST',param,function(data){
				if(data.success){
					$scope.doNotLineList = data.doNotLineList;
	        		html+='<h2 class="m-title">到货产品</h2>'
	        		$scope.doNotLineList.forEach(function(val){
	        			var unitName = true;
						if(val.deliveryUnitName==val.valuationUnitName){
							unitName = false;
						}
	        			html+='<div class="item-wrap">'
							+'		<ul>'
							+'			<li><span>送货产品：</span><p>'+ val.prodCode + '<br>' + val.prodName + ' ' + val.prodScale +'</p></li>'
							+'			<li><span>采购单号：</span>'+ val.sourcePoNo + '-' + val.sourcePoLineNo +'</li>'
							+'			<li><span>本次送货数量：</span>'+ (val.deliveryQty||0) + val.deliveryUnitName + (unitName ? ('/'+ (val.deliveryValuationQty||0) + val.valuationUnitName):'') +'</li>'
							+'			<li><span>送货批号：</span>'+ val.batchNo +'</li>'
							+'			<li><span>已签收数量：</span>'+ (val.receiveQty||0) + val.deliveryUnitName + (unitName ? ('/'+ (val.receiveValuationQty||0) + val.valuationUnitName):'') +'</li>'
							+'			<li><span>备注：</span>'+ val.lineRemark +'</li>'
							+'			<li class="file"><span>附件：</span></li>'
							+'		</ul>'
							+'	</div>'
						f_init_l_file(val)
	        		})
					$('.receivOrderDetail').html(html);
					$scope.doNotLineList.forEach(function(line,idx){
						var fileHTML = '<p>'
						line.l_file.forEach(function(val){
							fileHTML += '<a href="'+ val.fileUrl +'"><i class=i-'+ (_reg.test(val.fileName) ? "image" : "word") +'></i>'+ val.fileName +'</a>'
						})
						fileHTML += '</p>'
						$('.receivOrderDetail .files').eq(idx).html('<span>附件：</span>'+fileHTML).show();
					})
				}else{
					container.html('<p style="text-align:center;">'+ data.errorMsg +'</p>');
				}
			});				
		}
		getDoNoticeLineList();

		function remark(){
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
				+'			<li><span>物流单号：</span><p>'+ ($scope.orderInfo.logisticsNo||'-- ') + ' 联系人：'+ $scope.orderInfo.contactPerson +'，联系方式：'+ $scope.orderInfo.mobile +'</p></li>'
				+'			<li><span>备注信息：</span>'+ $scope.orderInfo.remark +'</li>'
				+'			<li class="files"><span>出货附件：</span></li>'
				+'		</ul>'
				+'	</div>'
			$('.remarks').html(html);
			//单头附件
			var fileParam = { "token":_vParams.token, "secretNumber":_vParams.secretNumber,"serviceId":"B01_findFileList", "companyId":_vParams.companyId, "id":_vParams.doId, "commonParam":commonParam(), "docType":"26","searchType":1};//searchType查询类型1单头2单身
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
		}
		remark();
		
		//通用底部
		bottomBar(['share'],$scope.orderInfo.deliveryManId,'','收货');

		$body.on('click','.bottom-btn-confirm',function(){
			that.popup('confirm', '', '确定要收货吗？', function(){

			},function(){
				//---》跳转至app收货单新建
				if(isAndroidMobileDevice() && window.WebViewJavascriptBridge){
					window.WebViewJavascriptBridge.callHandler( "goodsReceive", {"param":that.orderInfo.poFormNo}, function(responseData) {});
				}else{
					setupWebViewJavascriptBridge(function(bridge) {
						bridge.callHandler( "goodsReceive", {"param":that.orderInfo.poFormNo}, function responseCallback(responseData) {})
					})
				}
				return false;
			})				
		})

	},
	popup: function(type, title, content, closeCallBack, okCallBack){
		new Popup({
			type:type,
			title:title,
			content:content,
			ok:'确定',
			cancel:'取消',
			closeCallBack:closeCallBack,
			okCallBack:okCallBack
		});
	}
}