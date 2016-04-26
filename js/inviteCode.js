define(function(require, exports, module){
	var code = {
		init: function(){
			this.evens();
			this.invitationCode;
		},
		createHTML: function(){
			var that = this, result='', that.invitationCode = getQueryString('invitationCode') || '';
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
		hasReg: function(){
			var that = this, isReg = false;

			return isReg;
		},
		evens: function(){
			var that = this;
			if(that.hasReg()){
				//已经注册
			}else{
				//未注册，走注册流程
				var compInfos = document.getElementById('compInfos');
				if(compInfos){
					compInfos.innerHTML = that.createHTML();
					$('.inviteCode').show();
					$('#joinUs').attr('href','http://172.31.10.164/html/invitationReg1.html?&inviteCode="'+ that.invitationCode +'"');
				}
			}
		}
	};

	module.exports = code
	
});