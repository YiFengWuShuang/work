var Message=function(){this.init()};Message.prototype={init:function(){fnTip.loading(),this.title="",this.evens()},createHTML:function(){var e=this,t="",i=parseInt(getQueryString("userId"),10),a=parseInt(getQueryString("id"),10),s={params:{content:{header:{module:"",key:"",operator:""},body:{method:"queryMessage",data:{UserId:i,Id:a,pageInfo:{}}}}}};return $.ajax({type:"POST",dataType:"json",async:!1,url:config.ossNotifyUrl,data:JSON.stringify(s),success:function(i){if(i=i||{},"0"==i.errorCode){var a=i.dataSet.data.detail[0];e.title=a.Title,t+='<div class="itemHead">	<h2>'+a.UserName+"</h2>	<time>"+a.DateTime+'</time></div><div class="itemBody">	<h3>'+a.Title+"</h3>	<section>"+a.Content+"</section></div>"}else console.log(i.errorMsg)}}),fnTip.hideLoading(),t},evens:function(){var e=this;webViewTitle(e.title),$(".msgDetail").html(e.createHTML())}};