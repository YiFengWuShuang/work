var $formTip=$("#formTip"),Reg=function(){this.init()};Reg.prototype={init:function(){var i=this;$("form input.required").blur(function(){i.validateFn($(this))}),$("form .btnBig").on("click",function(){var e=$(this),r=e.parent("form").find("input.required");i.validateFn(r);var t=$(".formTipShow").length;if(t)return!1;if(e.is("#btn-getCode")){if(!$("#clauseChecked").prop("checked"))return $formTip.html("您未勾选《用户使用协议》").addClass("formTipShow"),!1;var o=$("#phone").val(),a=getQueryString("inviteCode");if(fnTip.loading(),i.checkAccount(o))return;$.ajax({type:"POST",dataType:"json",async:!1,url:"http://172.31.10.168/usersystem/login/getSmsVerifyCode/v1",data:JSON.stringify({mobile:o}),success:function(i){return fnTip.hideLoading(),i=i||{},"01250"!=i.retCode?(console.log(i.retMsg),!1):void e.attr("href","http://172.31.10.164/html/invitationReg2.html?&mobile="+o+"&inviteCode="+a)}})}if(e.is("#btn-next")){var o=getQueryString("mobile"),n=$("#validateCode").val().trim(),a=getQueryString("inviteCode");fnTip.loading(),$.ajax({type:"POST",dataType:"json",async:!1,url:"http://172.31.10.168/usersystem/recover_password/checkSmsVerifyCode/v1",data:JSON.stringify({mobile:o,smsVerifyCode:n}),success:function(i){return fnTip.hideLoading(),i=i||{},"0"!=i.errorCode?"01443"==i.errorCode?($formTip.html("手机验证码不正确").addClass("formTipShow"),!1):(console.log(i.errorMsg),!1):void e.attr("href","http://172.31.10.164/html/invitationReg3.html?&mobile="+o+"&inviteCode="+a)}})}if(e.is("#btn-end")){var o=getQueryString("mobile"),a=getQueryString("inviteCode"),s=$("#psw-1").val(),d=$("#psw-2").val();fnTip.loading(),$.ajax({type:"POST",dataType:"json",async:!1,url:"http://172.31.10.168/usersystem/register/registerAccountOnMobile/v1",data:JSON.stringify({mobile:o,invitationCode:a,password:s,confirmPassWd:d,dataSource:dataSource()}),success:function(i){return fnTip.hideLoading(),i=i||{},"0"!=i.errorCode?"02145"==i.errorCode?($formTip.html("输入密码不一致").addClass("formTipShow"),!1):(console.log(i.errorMsg),!1):void e.attr("href","http://172.31.10.164/html/join.html?&companyName="+i.companyName)}})}e.is("#btn-login"),e.is("#btn-reg")})},validateFn:function(i){i.each(function(){var i=$(this);if(i.is("#phone")){if(""==i.val()||""!=i.val()&&!/^[1][3578][0-9]{9}$/.test(i.val())){var e="手机号码格式不正确";return $formTip.html(e).addClass("formTipShow"),!1}$formTip.removeClass("formTipShow")}if(i.is("#validateCode")){var r=i.val();if(""==r){var e="手机验证码不能为空";return $formTip.html(e).addClass("formTipShow"),!1}$formTip.removeClass("formTipShow")}if(i.is("#psw-1")){if(""==i.val()||""!=i.val()&&!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(i.val())){var e="密码不能为空或格式不正确";return $formTip.html(e).addClass("formTipShow"),!1}$formTip.removeClass("formTipShow")}if(i.is("#psw-2")){var t=$("#psw-1").val();if(""==i.val()||i.val()!=t){var e="输入密码不一致";return $formTip.html(e).addClass("formTipShow"),!1}$formTip.removeClass("formTipShow")}})},checkAccount:function(i){var e=!0;return $.ajax({type:"POST",dataType:"json",async:!1,url:"http://172.31.10.168/usersystem/register/checkAccount/v1",data:JSON.stringify({account:i}),success:function(i){fnTip.hideLoading(),i=i||{},"01110"==i.retCode?e=!1:"01111"==i.retCode?($formTip.html("用户名已注册").addClass("formTipShow"),e=!0):($formTip.html("操作失败").addClass("formTipShow"),e=!0)}}),e}};