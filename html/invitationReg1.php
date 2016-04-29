<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/invite.css">
	<title>邀请码</title>
</head>
<body>
	<div class="contarin">
		<div class="register">
			<form action="" id="j-reg1">
				<div class="regForm">
					<input id="phone" class="required intStyle" type="text" placeholder="请输入手机号码" />
					<div class="clauseBox">
						<label class="checkbox on"><input type="checkbox" id="clauseChecked" checked="checked" />我已阅读并同意</label>
						<a href="#">《用户使用协议》</a>
					</div>
				</div>
				<a href="javascript:;" id="btn-getCode" class="btnBig btnBig-b">获取验证码</a>
			</form>
		</div>
	</div>
	<div id="formTip" class="formTip"></div>
	<?php include("footer.html"); ?>
	<script>
	$(function(){
		seajs.use('../js/register.js',function(reg){
			reg.init();
		})
	})
	</script>
</body>
</html>