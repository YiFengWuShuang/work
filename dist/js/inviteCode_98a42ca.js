var Code=function(){this.init()};Code.prototype={init:function(){this.invitationCode="",this.evens()},createHTML:function(){var i=this,n="";return i.invitationCode=getQueryString("invitationCode"),$.ajax({type:"POST",dataType:"json",async:!1,url:config.ussUrl+"/register/getCompInfoByInvitationCode/v1",data:JSON.stringify({invitationCode:i.invitationCode}),success:function(t){t=t||{},"0"==t.errorCode?n+="<li>邀请码："+i.invitationCode+"</li><li>企业名称："+t.companyInfo.companyName+"</li><li>企业号："+t.companyInfo.companyCode+"</li>":console.log(t.errorMsg)}}),n},evens:function(){var i=this,n=$("#joinUs"),t=document.getElementById("compInfos");t&&(t.innerHTML=i.createHTML(),$(".inviteCode").show(),n.attr("href",config.htmlUrl+"invitationReg1.html?&inviteCode="+i.invitationCode))}};