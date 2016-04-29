<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/list.css" class="shareCss" data-cssname="list">
	<title>采购订单发放</title>
</head>
<body>
	<div class="contarin">
		<div id="orderBaseInfo" class="m-item"></div>
		<div id="prodListsInfo" class="m-item m-item2"></div>
		<div id="otherCost" class="m-item"></div>
		<div class="item-wrap item-total"></div>
		<div class="item-wrap item-total-dj"></div>
		<a href="./orderHandedOut1.html" class="item-wrap item-link">交易于付款信息<span class="arrow_down"></span></a>
		<a href="./orderHandedOut2.html" class="item-wrap item-link">补充条款，备注与订单附件<span class="arrow_down"></span></a>
		<div class="btn-wrap">
			<a href="javascript:;" class="btnB">完成</a>			
		</div>
	</div>
	<?php include("footer.html"); ?>
	<script>
		$(function(){
			fnTip.loading();
			seajs.use('../js/orderHandedOut.js',function(order){
				order.init();
			});
		})
	</script>

</body>
</html>