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
			<form action="" id="j-reg3">
				<div class="regForm">
					<input id="psw-1" class="required intStyle" type="password" placeholder="请输入密码" />
					<input id="psw-2" class="required intStyle" type="password" placeholder="请再次输入密码" />
					<p class="pswTip">密码至少6位，最长30位，数字、字符、字母至少含其中两种</p>
				</div>
				<a href="javascript:;" id="btn-end" class="btnBig btnBig-b">完成</a>
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