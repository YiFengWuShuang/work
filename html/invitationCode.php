<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/invite.css">
	<title>邀请码</title>
</head>
<body>
	<div class="contarin" style="display:none;">
		<div class="step1">
			<div class="codeBox">
				<div class="codeBox-1">
					<img src="../img/invite/code.png" alt="" class="code" />
					<ul id="compInfos"></ul>
				</div>
				<span class="sub"></span>
			</div>
			<a href="#" id="joinUs" class="btnBig btnBig-b">同意加入</a>
		</div>
	</div>
	<?php include("footer.html"); ?>
	<script>
	$(function(){
		seajs.use('../js/inviteCode.js',function(code){
			code.init();
		})
	})
	</script>
</body>
</html>