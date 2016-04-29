<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/clause.css" class="shareCss" data-cssname="clause">
	<title>补充条款备注</title>
</head>
<body>
	<div class="contarin">
		<div class="remarks-wrap"></div>
	</div>
	<?php include("footer.html"); ?>
	<script>
		$(function(){
			fnTip.loading();
			seajs.use('../js/payInfo2.js',function(payInfo){
				payInfo.init();
			});
		})
	</script>
</body>
</html>	