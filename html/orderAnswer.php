<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<?php include("head.html"); ?>
	<link rel="stylesheet" href="../css/popup.css">
	<link rel="stylesheet" href="../css/zepto.mdater.css">
	<link class="shareCss" data-cssname="list" rel="stylesheet" href="../css/list.css">
	<title>采购订单作业</title>
</head>
<body>
	<div class="contarin">
		<div class="item-tips"><i></i><span></span></div>
		<div id="orderAnswerInfo" class="m-item"></div>
		<div id="prodAnswerInfo" class="m-item m-item2"></div>
		<div id="othersCost" class="m-item"></div>
		<div class="item-wrap item-total"></div>
		<div class="item-wrap item-total-dj"></div>
		<a href="./orderHandedOut1.html" class="item-wrap item-link">交易和付款信息<span class="arrow_down"></span></a>
		<a href="./orderHandedOut2.html" class="item-wrap item-link">补充条款，备注与订单附件<span class="arrow_down"></span></a>
		<div class="btn-wrap">
			<a href="javascript:;" class="btnB">完成</a>
		</div>
	</div>
	<script src="../js/lib/sea.js"></script>
	<script src="../js/lib/zepto-min.js"></script>
	<script src="../js/public/public.js"></script>
	<script>
		$(function(){
			fnTip.loading();
			seajs.use('../js/ordersList.js',function(lists){
				lists.init();
			});
		})
	</script>

</body>
</html>