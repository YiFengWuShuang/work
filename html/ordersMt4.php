<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/select3.css">
	<link rel="stylesheet" href="../css/orderMt.css" class="shareCss" data-cssname="orderMt">
	<title>销售订单维护</title>
</head>
<body>
	<div class="contarin">
		<div id="othersCost" class="m-item"></div>
		<div id="costList" class="m-item">
			<h2 class="m-title">订单其他费用维护</h2>
			<div class="item-wrap"></div>
			<div class="btn-wrap">
				<a href="javascript:;" class="btnB">完成</a>			
			</div>
		</div>
	</div>
	<?php include("footer.html"); ?>
	<script src="../js/lib/select3-full-min.js"></script>
	<script>
		$(function(){
			seajs.use('../js/ordersMt4.js',function(ordersMt){
				ordersMt.init();
			});
		})
	</script>

</body>
</html>