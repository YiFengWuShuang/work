var Message=function(){this.init()};Message.prototype={init:function(){fnTip.loading(),this.evens()},createHTML:function(){var e="",t=parseInt(getQueryString("userId"),10),a=parseInt(getQueryString("id"),10),i={params:{content:{header:{module:"",key:"",operator:""},body:{method:"queryMessage",data:{UserId:t,Id:a,pageInfo:{}}}}}};return $.ajax({type:"POST",dataType:"json",async:!1,url:"http://172.31.10.155:19890/oss/notify/api",data:JSON.stringify(i),success:function(t){if(t=t||{},"0"==t.errorCode){var a=t.dataSet.data.detail[0];e+='<div class="itemHead">	<h2>'+a.UserName+"</h2>	<time>"+a.DateTime+'</time></div><div class="itemBody">	<h3>'+a.Title+"</h3>	<section>"+a.Content+"</section></div>"}else console.log(t.errorMsg)}}),fnTip.hideLoading(),e},evens:function(){var e=this;$(".msgDetail").html(e.createHTML())}};