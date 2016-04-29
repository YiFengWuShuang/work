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
			<form action="" id="j-reg2">
				<p class="phoneBox"><b>+86 13800138000</b>已发送验证码到这个手机上</p>
				<div class="regForm">
					<input id="validateCode" class="required intStyle" type="text" placeholder="请输入验证码" />
				</div>
				<a href="javascript:;" id="btn-next" class="btnBig btnBig-b">下一步</a>
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