<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/select3.css">
	<link rel="stylesheet" href="../css/orderMt.css" class="shareCss" data-cssname="orderMt">
	<title>销售订单维护</title>
</head>
<body>
	<div class="contarin orderWH">
		<div id="btnSaveOrder" class="btn-wrap">
			<a href="javascript:;" class="btnB">完成</a>			
		</div>
	</div>
	<?php include("footer.html"); ?>
	<script src="../js/lib/select3-full-min.js"></script>
	<script>
		$(function(){
			seajs.use('../js/ordersMt2.js',function(ordersMt){
				ordersMt.init();
			});
		})
	</script>

</body>
</html>