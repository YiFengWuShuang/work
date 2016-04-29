<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/list.css" class="shareCss" data-cssname="list">
	<title>交易和付款信息</title>
</head>
<body>
	<div class="contarin">
		<ul id="payInfoList" class="payInfoList"></ul>
	</div>
	<?php include("footer.html"); ?>
	<script>
		$(function(){
			fnTip.loading();
			seajs.use('../js/payInfo.js',function(payInfo){
				payInfo.init();
			});
		})
	</script>
</body>
</html>