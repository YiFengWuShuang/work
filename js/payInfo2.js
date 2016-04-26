define(function(require, exports, module){
	var lists = {
		init: function(){
			this.start();
		},
		//附件
		fileList: function(){
			var that = this, result = '', reg = /^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;
			$.ajax({
				type:"POST",
                async: false,
                url:config.serviceUrl,
                data: {
			        "param": '{"secretNumber":"4bef6eefabd0ef34ab42562e1b956852","token":"c5ef4cca77e9a7821ea5df0da650f07e","serviceId":"B01_findFileList","companyId":"10000001","fileSource":"1","searchType":"1","id":"100001000000001","docType":"10"}'
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
			console.log(result)
			return result;
		},
		payInfo: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"c5ef4cca77e9a7821ea5df0da650f07e", "serviceId":"B03_getPurchaseOrderInfo", "secretNumber":"4bef6eefabd0ef34ab42562e1b956852", "poId":"100001000000110", "companyId":"10000001", "commonParam":{ "mobileSysVersion":"1", "sourcePage":"1", "mobileModel":"1", "sourceSystem":"1", "interfaceVersion":"1", "dataSource":"1" } }'
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
								+	that.fileList()
								+'</div>'
                	}
                }
			})
			return html;
		},
		start: function(){
			var that = this;
			that.fileList();
			$('.remarks-wrap').append(that.payInfo());
		}
	};

	module.exports = lists
	
});