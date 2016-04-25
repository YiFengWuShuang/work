define(function(require, exports, module){
	var $formTip = $('#formTip');
	var reg = {
		init: function(){
			var that = this;
			//文本框失去焦点后
	        $('form input.required').blur(function(){
	        	that.validateFn($(this))
	        });

	        //校验
			$('form .btnBig').on('click',function(){
				var _this = $(this);
				var inputs = _this.parent('form').find('input.required');
			    that.validateFn(inputs);
			    var numError = $('.formTipShow').length;
			    if(numError){
			        return false;
			    }
			    //获取验证码
			    if( _this.is('#btn-getCode') ){
			    	if(!$('#clauseChecked').prop('checked')){
			    		$formTip.html('您未勾选《用户使用协议》').addClass('formTipShow');
			    		return false;
			    	}
			    	var mobile = $('#phone').val();
			    	fnTip.loading();
			    	$.ajax({
						type:"POST",
		                dataType: "json",
		                url:'http://172.31.10.52/usersystem/login/getSmsVerifyCode/v1',
		                data:{mobile:mobile},
		                success:function(data){
		                	fnTip.hideLoading();
		                	data = data || {};
		                	if(data){
		                		window.open('http://172.31.10.164/html/invitationReg2.html?&mobile="'+ mobile +'"&verifyCode='+ data.smsVerifyCode);
		                	}
		                }
					})
			    	
			    }
			    //下一步
			    if( _this.is('#btn-next') ){
					var mobile = getQueryString('mobile'),
						verifyCode = getQueryString('verifyCode');
					fnTip.loading();
					$.ajax({
						type:"POST",
					    dataType: "json",
					    url:'http://172.31.10.52/usersystem/recover_password/checkSmsVerifyCode/v1',
					    data:{mobile:mobile, smsVerifyCode:verifyCode},
					    success:function(data){
					    	data = data || {};
					    	if(data){
					    		window.open('http://172.31.10.164/html/invitationReg3.html?&mobile='+ mobile);
					    	}
					    }
					})
			    }
			    //完成
			    if( _this.is('#btn-end') ){
			    	var mobile = getQueryString('mobile'),
			    		password = $('#psw-1').val();
			    	//window.open('http://172.31.10.164/html/invitationLogin.html');
			    }
			    //登录
			    if( _this.is('#btn-login') ){
			    	var nameVal = $('#username').val(),
			    		pswVal = $('#password').val();
			    	if( nameVal=='' || pswVal=='' ){
			    		$formTip.html('用户名和密码不能为空').addClass('formTipShow');
			    		return false;
			    	}else{
			    		fnTip.loading();
			    		$.ajax({
							type:"POST",
			                dataType: "json",
			                async:false,
			                url:'http://172.31.10.52/usersystem/login/memberLogin/v1',
			                data:{account:nameVal, password:pswVal},
			                success:function(data){
			                	fnTip.hideLoading();
			                	data = data || {};
			                	if(data){
			                		switch(data.retCode){
				                		case '01211':
				                			$formTip.html('用户名或密码错误').addClass('formTipShow');
				                			return false;
				                			break;
				                		case '01210':
				                			//登入成功
				                			//跳转到相应页面
				                			$formTip.removeClass('formTipShow');
				                			break;
				                	}
			                	}
			                }
						})
			    	}
			    	$formTip.removeClass('formTipShow');
			    }
			    if( _this.is('#btn-reg') ){
			    	//跳去注册页面
			    }
			});
		},
		validateFn: function(obj){
        	obj.each(function(){
        		var _this = $(this);
	            //验证手机号
	            if( _this.is('#phone') ){
					if( _this.val()=="" || ( _this.val()!="" && !/^[1][3578][0-9]{9}$/.test(_this.val()) ) ){
						var errorMsg = '手机号码格式不正确';
						$formTip.html(errorMsg).addClass('formTipShow');
						return false;
					}else{
					    $formTip.removeClass('formTipShow');
					}
	            }
	            //手机验证码
	            if( _this.is('#validateCode') ){
					var verifyCode = getQueryString('verifyCode'),
						validateCode = _this.val();
					if(validateCode!=verifyCode){
						var errorMsg = '手机验证码不正确';
						$formTip.html(errorMsg).addClass('formTipShow');
						return false;
					}else{
					    $formTip.removeClass('formTipShow');
					}
	            }
	            //验证密码,密码至少6位，最长30位，数字、字符、字母至少含其中两种
	            if( _this.is('#psw-1') ){
	                if( _this.val()=="" || ( _this.val()!="" && !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(_this.val()) ) ){
	                    var errorMsg = '密码不能为空或格式不正确';
	                    $formTip.html(errorMsg).addClass('formTipShow');
	                    return false;
	                }else{
	                    $formTip.removeClass('formTipShow');
	                }
	            }
	            //再次输入密码
	            if( _this.is('#psw-2') ){
	            	var val1 = $('#psw-1').val();
	                if( _this.val()=="" || _this.val()!= val1 ){
	                    var errorMsg = '再次输入密码需一致';
	                    $formTip.html(errorMsg).addClass('formTipShow');
	                    return false;
	                }else{
	                    $formTip.removeClass('formTipShow');
	                }
	            }
            })
		}
	};

	module.exports = reg;
	
});