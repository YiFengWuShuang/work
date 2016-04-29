<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/invite.css">
	<title>邀请码</title>
</head>
<body>
	<div class="contarin">
		<div class="step2">
			<p class="comp">飞毛腿（福建）电子有限公司</p>
			<p class="comp2">飞毛腿创建您的个人帐户，加入企业</p>
			<form action="" id="j-login">
				<div class="loginForm">
					<input id="username" class="required intStyle" type="text" placeholder="请输入用户名" />
					<input id="password" class="required intStyle" type="password" placeholder="请输入密码" />
				</div>
				<button id="btn-login" class="btnBig btnBig-b">登录</button>
				<button id="btn-reg" class="btnBig btnBig-g">注册</button>
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