define(function(require, exports, module){

	var ordersMt = {
		init: function(){
			this.commonParam = JSON.stringify(commonParam());
			this.start();
		},
		otherCostList: function(){
			var that = this, html = '';
			$.ajax({
				type:"POST",
                //dataType: "json",
                url:config.serviceUrl,
                data: {
			        "param": '{ "token":"令牌", "secretNumber":"序列号", "serviceId":"B03_findPoAnswerOtherCostList", "poAnswerId":"100001000000001", "vendorId":"10000021", "commonParam":'+ that.commonParam +' }'
			    },
                success:function(data){
                	data = data || {};
                	if(data){
                		var otherCostList = data.poOtherCostList;
                		html = '<h2 class="m-title">其他费用</h2><div class="item-wrap"><ul>';
                		for(var i=0, len=otherCostList.length; i<len; i++){
                			html+='<li data-money="'+ ((otherCostList[i].vCostAmount!='') ? otherCostList[i].vCostAmount : otherCostList[i].costAmount) +'"><span>'+ otherCostList[i].costName +'：</span><b>&yen; '+ otherCostList[i].costAmount +'.00</b>'+ ((otherCostList[i].vCostAmount!='') ? '<b class="dj">&yen; <em class="money">'+ otherCostList[i].vCostAmount +'</em>.00</b>' : '') +'</li>'
                		}
                		html+='</ul></div>';
                	}
                },
                error:function(){
                	alert('数据请求发生错误，请刷新页面!');
                }
			})
			return html;
		},
		createCostList: function(){
			var that = this, optionsAll = ['选项1','选项2','选项3','选项4','选项5'];//无接口,直接录入选项
			var othersCost = $('#othersCost'), lis = othersCost.find('li'), len = lis.length, listHTML = '', options = [], moneys = [];
			othersCost.find('li span').forEach(function(item){
				var span = item.innerHTML, $item = $(item);
				options.push(span.substring(0,span.length-1));
				moneys.push($item.parent('li').attr('data-money'));
			})
			for(var i=0; i<len; i++){
				listHTML+='<section class="m-select clearfix">'
						+'	<div class="c-cont c-cont2">'
						+'		<div id="fy_'+ (i+1) +'" class="select3-input"></div>'
						+'		<p class="fy'+ (lis.eq(i).find('.dj').size() ? ' djfy' : '') +'">&yen;'+ moneys[i] +'.00</p>'
						+'	</div>'
						+'</section>'
			}
			$('#costList').find('.item-wrap').append(listHTML);
			for(var j=0; j<len; j++){
				that.initSelect3('#fy_'+(j+1),optionsAll,options[j]);
			}
		},
		initSelect3: function(el,options,currValue){
			$(el).select3({
			    allowClear: true,
			    items:options,
			    placeholder: '请选择',
			    showSearchInputInDropdown: false,
			    value: currValue
			});
		},
		start: function(){
			var that = this;
			document.getElementById('othersCost').innerHTML = that.otherCostList();
			that.createCostList();
		},
		submitFn: function(){

		}
	};

	module.exports = ordersMt;
	
});