define(function(require, exports, module){
	var _vParams = JSON.parse(decodeURI(getQueryString('param')));
	var lists = {
		init: function(){
			this.commonParam = JSON.stringify(commonParam());
			this.tokens = '"token":"'+ _vParams.token +'","secretNumber":"'+ _vParams.secretNumber +'"';
			this.load = false;
			this.start();
			fnTip.hideLoading();
		},
		payInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
				async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{ '+ that.tokens +', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+ _vParams.poId +'", "companyId":"'+ _vParams.companyId +'", "commonParam":'+ that.commonParam +' }'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var infos = data.purchaseOrderInfo;
                		html += '<div id="provisions" class="item-wrap clause">'
								+'	<h2>补充条款：</h2>'
								+'	<p>'+ infos.agreement +'</p>'
								+'</div>'
								+'<div id="taRemarks" class="item-wrap taRemarks">'
								+'	<h2>备注信息：</h2>'
								+'	<p>'+ infos.remark +'</p>'
								+'</div>'
								+'<div id="files" class="item-wrap attachment">'
								+'	<h2>订单附件：</h2>'
								+'</div>'
						that.load = true;
                	}
                }
			})
			return html;
		},
		//附件
		fileList: function(){
			var that = this, result = '', reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
			$.ajax({
				type:"POST",
				async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{'+ that.tokens +',"serviceId":"B01_findFileList","companyId":"'+ _vParams.companyId +'","fileSource":"1","searchType":"1","id":"'+ _vParams.id +'","docType":"'+ _vParams.docType +'"}'
			    },
                success:function(data){
                	data = data || {};
                	if(data.success){
                		var file = data.fileList;
                		for(var i=0, len=file.length; i<len; i++){
                			result += '<p><a href="'+ file[i].fileUrl +'"><i class=i-'+ (reg.test(file[i].fileName) ? "image" : "word") +'></i>'+ file[i].fileName +'</a></p>'
                		}
                	}
                }
			})
			return result;
		},
		start: function(){
			var that = this;
			$('.remarks-wrap').append(that.payInfo());
			if(that.load){
				$('#files').append(that.fileList());
			}
		}
	};

	module.exports = lists
	
});