<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/news.css" class="shareCss" data-cssname="news">
	<title>企业消息</title>
</head>
<body>
	<div class="contarin newsCon">
		<div class="msgDetail"></div>
	</div>
	<?php include("footer.html"); ?>
	<script>
		$(function(){
			seajs.use('../js/msgDetail.js',function(msgDetail){
				msgDetail.init();
			});

		})
	</script>
</body>
</html>