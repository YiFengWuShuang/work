var _vParams=JSON.parse(decodeURI(getQueryString("param"))),Lists=function(){this.init()};Lists.prototype={init:function(){this.commonParam=JSON.stringify(commonParam()),this.tokens='"token":"'+_vParams.token+'","secretNumber":"'+_vParams.secretNumber+'"',this.load=!1,this.start(),fnTip.hideLoading()},payInfo:function(){var a=this,e="";return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{ "+a.tokens+', "serviceId":"B03_getPurchaseOrderInfo", "poId":"'+_vParams.poId+'", "companyId":"'+_vParams.companyId+'", "commonParam":'+a.commonParam+" }"},success:function(s){if(s=s||{},s.success){var i=s.purchaseOrderInfo;e+='<div id="provisions" class="item-wrap clause">	<h2>补充条款：</h2>	<p>'+i.agreement+'</p></div><div id="taRemarks" class="item-wrap taRemarks">	<h2>备注信息：</h2>	<p>'+i.remark+'</p></div><div id="files" class="item-wrap attachment">	<h2>订单附件：</h2></div>',a.load=!0}}}),e},fileList:function(){var a=this,e="",s=/^(\s|\S)+(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)+$/;return $.ajax({type:"POST",async:!1,url:config.serviceUrl,data:{param:"{"+a.tokens+',"serviceId":"B01_findFileList","companyId":"'+_vParams.companyId+'","fileSource":"1","searchType":"1","id":"'+_vParams.id+'","docType":"'+_vParams.docType+'"}'},success:function(a){if(a=a||{},a.success)for(var i=a.fileList,r=0,t=i.length;t>r;r++)e+='<p><a href="'+i[r].fileUrl+'"><i class=i-'+(s.test(i[r].fileName)?"image":"word")+"></i>"+i[r].fileName+"</a></p>"}}),e},start:function(){var a=this;$(".remarks-wrap").append(a.payInfo()),a.load&&$("#files").append(a.fileList())}};