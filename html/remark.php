<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/clause.css" class="shareCss" data-cssname="clause">
	<title>交易和付款信息</title>
</head>
<body>
	<div class="contarin">
		<div class="remarks-wrap">
			<!-- <div id="provisions" class="item-wrap clause">
				<h2>补充条款：</h2>
				<p>1.按双方已签定报价单上结算方式或采购合同结算方式执行。</p>
				<p>2.双方在每月27日前核对货物的送货、领用、退货数量与金额，对帐后，供方开出增值税发票送达需方作为需方支付货款的依据，需方以规定的认证时间加初步审核、路途时间为限办理发票认证，当月认证入当月帐，次月认证入次月帐。</p>
				<p>3.对需方订货需求、需求变更及相关信息查询的评估及反馈：供方对需方采购订单和送货通知及时进行评估和反馈。如评估不能满足需求时，应在需方信息发出3小时内向需方反馈协商，则视同默认执行。若供方未按需方要求按时查询相关信息时，需方按200元/次处罚供方。</p>
			</div>
			<div id="taRemarks" class="item-wrap taRemarks">
				<h2>备注信息：</h2>
				<p>1.按双方已签定报价单上结算方式或采购合同结算方式执行。</p>
				<p>2.双方在每月27日前核对货物的送货、领用、退货数量与金额，对帐后，供方开出增值税发票送达需方作为需方支付货款的依据。</p>
			</div>
			<div id="files" class="item-wrap attachment">
				<h2>订单附件：</h2>
				<p><a href="#"><i class="i-image"></i>订单生产图纸.jpeg</a></p>
				<p><a href="#"><i class="i-word"></i>配件清单.xlsx</a></p>
			</div> -->
		</div>
		<div class="item-wrap myRemarks">
			<p>双方在每月27日前核对货物的送货、领用、退货数量与金额，对帐后，供方开出增值税发票送达需方作为需方支付货款的依据。</p>
		</div>
		<div class="item-wrap int-remarks">
			<textarea name="" id="intRemarks" placeholder="填写我方备注"></textarea>
		</div>
		<div class="btn-wrap">
			<a href="javascript:;" class="btnB">保存备注</a>			
		</div>
	</div>
	<?php include("footer.html"); ?>
	<script>
		$(function(){
			seajs.use('../js/payInfo2.js',function(payInfo){
				payInfo.init();
			});
		})
	</script>
</body>
</html>	