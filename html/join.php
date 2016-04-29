<!DOCTYPE html>
<html>
<head>
	<?php include("header.html"); ?>
	<link rel="stylesheet" href="../css/invite.css">
	<title></title>
</head>
<body>
	<div class="contarin">
		<div id="join-status" class="step3"></div>
	</div>
	<?php include("footer.html"); ?>
	<script>
	$(function(){
		var invitationCode = getQueryString('key'), companyName = getQueryString('companyName'), joinStatus = $('#join-status');
		function statusMsg(str){
			return '<p class="joinSucc"><i></i><b>您已成功加入'+ str +'！</b></p><p class="openapp">赶紧打开app开启便捷工作之旅！</p>'
		}
		if(invitationCode==null){
			joinStatus.html(statusMsg(companyName));
			return false;
		}
		$.ajax({
				type:"POST",
                async:false,
                url:'http://172.31.10.168/usersystem/register/joinCompanyByAccount/v1',
                data:JSON.stringify({"invitationCode":invitationCode}),
                success:function(data){
                	data = data || {};
                	if(data.errorCode=='0'){
                		joinStatus.html(statusMsg(data.companyName));
                	}else if(data.errorCode=='02154'){
                		joinStatus.html('<p class="openapp">该账号已有关联公司</p>');
                	}else{
                		joinStatus.html('<p class="openapp">'+ data.errorMsg +'</p>');
                	}
                }
            })
	})
	</script>
</body>
</html>