var Code = function(){
	this.init();
}
Code.prototype = {
	init: function(){
		this.invitationCode = '';

		this.evens();
	},
	createHTML: function(){
		var that = this, result='';
		that.invitationCode = getQueryString('invitationCode');
		$.ajax({
			type:"POST",
            dataType: "json",
            async: false,
            url:'http://172.31.10.168/usersystem/register/getCompInfoByInvitationCode/v1',
            data:JSON.stringify({"invitationCode":that.invitationCode}),
            success:function(data){
            	data = data || {};
            	if(data.errorCode=='0'){
            		result	+='<li>邀请码：'+ that.invitationCode +'</li>'
							+'<li>企业名称：'+ data.companyInfo.companyName +'</li>'
							+'<li>企业号：'+ data.companyInfo.companyCode +'</li>'
            	}else{
            		console.log(data.errorMsg)
            	}
            }
		})
		return result;
	},
	evens: function(){
		var that = this, btn = $('#joinUs');

		//未注册，走注册流程
		var compInfos = document.getElementById('compInfos');
		if(compInfos){
			compInfos.innerHTML = that.createHTML();
			$('.inviteCode').show();
			btn.attr('href','http://172.31.10.164/html/invitationReg1.html?&inviteCode='+ that.invitationCode);
		}

	}	
}