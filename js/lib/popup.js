// JavaScript Document
 var Popup = function(opts,obj,ev){
	this.opts = opts;//配置选项
	this.confirmTemplate = '<div class="popup-content">{content}</div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>';	
	this.imageConfirm = '<div class="popup-title">已选取图片</div><div class="popup-content"><img src="{src}" alt=""/></div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>';	
	this.alertTemplate = '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a data-target="closePopup" data-icon="checkmark">{ok}</a></div>';
	this.svg =  '<svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
				      +'<g id="circle" class="g-circles g-circles--v1">'
				           +'<circle id="12" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " cx="35" cy="16.6987298" r="10"></circle>'
				           +'<circle id="11" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " cx="16.6987298" cy="35" r="10"></circle>'
				           +'<circle id="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " cx="10" cy="60" r="10"></circle>'
				           +'<circle id="9" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " cx="16.6987298" cy="85" r="10"></circle>'
				           +'<circle id="8" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " cx="35" cy="103.30127" r="10"></circle>'
				           +'<circle id="7" cx="60" cy="110" r="10"></circle>'
				           +'<circle id="6" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " cx="85" cy="103.30127" r="10"></circle>'
				           +'<circle id="5" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " cx="103.30127" cy="85" r="10"></circle>'
				           +'<circle id="4" transform="translate(110, 60) rotate(-90) translate(-110, -60) " cx="110" cy="60" r="10"></circle>'
				           +'<circle id="3" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " cx="103.30127" cy="35" r="10"></circle>'
				           +'<circle id="2" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " cx="85" cy="16.6987298" r="10"></circle>'
				           +'<circle id="1" cx="60" cy="10" r="10"></circle>'
				       +'</g>'
				       +'<use xlink:href="#circle" class="use"></use>'
			  	 +'</svg>';	
	this.id = 0;
	this.dom = obj;
	this.ev = ev;
	this.move = true;
	this.scale = false;
	this.init();
}
Popup.prototype = {
	init: function() {
		var self = this;
		var type = this.opts.type;
		//overload 
		var overload = document.createElement("div");
		overload.className = "over_load";
		overload.style.height = document.body.scrollHeight+"px";
		var popup = document.createElement("div");
		self.overload = overload;
		self.popup = popup;
		self.addEvent(self.overload,"touchmove",self.preventDefault);
		self.addEvent(self.popup,"touchmove",self.preventDefault);
		switch(type){
			case 'confirm':
				popup.className = "center popup_in";	
				self.confirm();
				document.body.appendChild(overload);
				break;
			case 'alert':
				popup.className = "center popup_in";	
				self.alert();
				document.body.appendChild(overload);
				break;
			case 'top':
				popup.className = "popup_top popup_in";	
				self.top();
				document.body.appendChild(overload);
				break;
			case 'bottom':
				popup.className = "popup_bottom popup_in" ;
				self.bottom();
				document.body.appendChild(overload);
				break;
			case 'loading':
				if(window.loading){
					return;
				}
				window.loading = self.popup;
				window.loading.className = "popup_load";
				self.createLoad();
				break;
			case 'image':
				self.createImage();
				break;
			case 'toast':
				self.createToast();
				break;
			case 'image_preview':
				popup.className = "center popup_in";	
				self.createImagePreview();
				document.body.appendChild(overload);
				break;
		}
	},
	confirm: function() {
		var self= this;
		var title = self.opts.title || "";
		var content = self.opts.content || "";
		var ok = self.opts.ok || "";
		var cancel = self.opts.cancel || "";
		var markup = self.confirmTemplate.replace('{content}',content).replace('{cancel}',cancel).replace('{ok}',ok);
		if(self.opts.icon) {
			markup = '<span class="warning-icon"></span>'+ markup;
		}
		self.popup.innerHTML = markup;
		document.body.appendChild(self.popup);
		var confirm_ok = document.getElementById("popup_btn_container");
		setTimeout(function(){
			self.addEvent(confirm_ok,"click",self.close,"center popup_out");
		},200);
	},
	alert: function() {
		var self = this;
	    var title = self.opts.title;
	    var content = self.opts.content;
	    var ok = self.opts.ok;
	    var markup = self.alertTemplate.replace('{title}',title).replace('{content}',content).replace('{ok}',ok);
		self.popup.innerHTML = markup;
		document.body.appendChild(self.popup);
		var alert_ok = document.getElementById("popup_btn_container");
		self.addEvent(alert_ok,"click",self.close,"center popup_out");
	},
	top: function() {
		var self = this;
		var content = self.opts.content;
		self.popup.innerText = content;
		document.body.appendChild(self.popup);
		self.addEvent(self.overload,"click",self.close,"popup_top popup_out");
	},
	bottom: function() {
		var self = this;
		var content = self.opts.content;
		self.popup.innerHTML = content;
		document.body.appendChild(self.popup);
		self.addEvent(self.overload,"click",self.close,"popup_bottom popup_out");
	},
	createLoad: function() {
		var self = this;
		var now=new Date(); 
		self.loadSVG();
		document.body.appendChild(window.loading);
	},
	loadSVG: function() {
		var self = this;
		var svg_ns = 'http://www.w3.org/2000/svg';
		var if_svg = !!document.createElementNS && !!document.createElementNS(svg_ns, 'svg').createSVGRect; 
		if(if_svg) {
			loading.innerHTML = self.svg;
		} else {
			loading.className = "popup_load2";
		}
	},
	createImagePreview:function(){
		var self = this;
		var title = self.opts.title || "";
		var content = self.opts.content || "";
		var ok = self.opts.ok || "";
		var cancel = self.opts.cancel || "";
		var src = self.opts.imgUrl || "";
		var markup = self.imageConfirm.replace('{src}',src).replace('{cancel}',cancel).replace('{ok}',ok);
		self.popup.innerHTML = markup;
		document.body.appendChild(self.popup);
		var confirm_ok = document.getElementById("popup_btn_container");
		self.addEvent(confirm_ok,"click",self.close,"center popup_out");
	},
	createImage: function() {
		var self = this;
		var listClass = self.opts.list;
		var img_list = $("."+listClass);
		var le = img_list.length;
		var html = "";
		var j = self.index||0;
		self.img_slider = document.createElement("div");
		self.img_slider.className = "image_slider";
		document.body.appendChild(self.img_slider);
		var slide = document.createElement("div");
		slide.className = "slider_content";
		//dot
		self.doc = document.createElement("div");
		self.doc.className = "dot";
		self.doc.id = "dot";
		for(var i =0 ; i < le ; i++) {
			if(self.dom[0] == img_list[i]){
				j = i;
			}
			html = html + '<div class="item" id="item_'+i+'" style="width:'+self.img_slider.offsetWidth+'px"><img src="'+img_list[i].getAttribute("data_src")+'" alt="'+img_list[i].getAttribute("alt")+'"/></div>';
		}
		var closeA = document.createElement("a");
		closeA.innerText="完成";
		self.doc.appendChild(closeA);

		var span = document.createElement("span");
		span.className = "dot_count";
		span.innerText = (j+1)+"/"+le;
		self.doc.appendChild(span);
		//delete
		if(self.opts.canDelete){
			var deleteSpan = document.createElement("span");
			deleteSpan.className = "deleteSpan";
			self.doc.appendChild(deleteSpan);
			$(deleteSpan).on("click",function(){deleteImg()});
		}
		self.addEvent(closeA,"click",self.closeImage);

		slide.innerHTML = html;
		self.img_slider.appendChild(slide);
		document.body.appendChild(self.doc);
		slide.style.width = le*self.img_slider.offsetWidth + "px";
		//preventDefault
		self.addEvent(self.img_slider,"touchmove",self.preventDefault);
		var changeImageText = function(direct){
			if(direct <= 0){//左
				if(j < le-1){
					j++;
					span.innerText = (j+1)+"/"+le;
				}else{
					j = le-1;
				}
			}else{
				if(j > 0){
					j--;
					span.innerText = (j+1)+"/"+le;
				}else{
					j = 0;
				}
				
			}
		};
		var deleteImg = function(){
			new Popup({
				type: "confirm",
				title: "",
				content: "<p style='font-size:1.1em'></p><p style='font-size:1.5em'>您确定删除这张照片吗？</p>",
				ok: "确定",
				cancel: "取消",
				icon: false,
				closeCallBack: function(args){
				},
				okCallBack: function(){
					delImg();
				},
			});

		};
		var delImg = function(){
			var delCallBack = self.opts.delCallBack;
			var photo_id = img_list.eq(j).attr("photo_id");
			if(delCallBack){
				delCallBack(refreshImageSlider,photo_id);
			}
		};
		var refreshImageSlider = function(){
			img_list.eq(j).remove();
			if(j == 0){
				self.closeImage();
			}else{
				self.img_slider.remove();
				self.doc.remove();
				var obj = new Popup({
					type: "image",
					canDelete:true,
					delCallBack:self.opts.delCallBack,
					list:"img_item"
				},$(this));
			}
			
		};
		//左右滑动照片
		var distx = 0-self.img_slider.offsetWidth*j;
		slide.style.webkitTransform = "translate3d("+distx+"px,0,0)";
		new Swipe(slide,distx,j,changeImageText);
	},
	closeImage:function(){
		var self = this;
		document.body.removeChild(self.img_slider); 
		document.body.removeChild(self.doc); 
		document.body.style.height ="auto";
		document.body.style.overflowY ="auto";
	},
	scaleImage: function(args) {
		var self = this;
		var ev = args[0];
		var target = ev.target;
		var tag = target.tagName.toLowerCase();
		if(tag == 'img') {
			if(!self.scale) {
				target.style.webkitTransform = "scale(3)";
				self.scale = true;
			}else{
				target.style.webkitTransform = "scale(1) translate3d(-50%,-50%,0)";
				self.scale = false;
			}
			
		}
	},
	close: function(args) {
		var self = this;
		var data_icon = args[0].target.getAttribute("data-icon");
		self.popup.className = args[1];
		if(data_icon == 'close'){
			self.callBack(self.opts.closeCallBack);
		}else{
			var  input = $(".popup-content").find("input");
			if(self.opts.type == "confirm" && input && input.length > 0){
				var  input = $(".popup-content").find("input");
				if(input && input.length > 0){
					self.callBack(self.opts.okCallBack,input.val());
				}else{
					self.callBack(self.opts.okCallBack);
				}
			}else{
				self.callBack(self.opts.okCallBack);
			}
		}
	},
	closeLoad:function() {
		var self = this;
		if(window.loading){
			document.body.removeChild(window.loading);
			window.loading = null;
		}
	},
	callBack: function(callBackFn,args) {
		var self = this;
		setTimeout(function(){
			document.body.removeChild(self.popup);
			document.body.removeChild(self.overload);
			if(callBackFn){
				callBackFn(args);
			}
		},300);
	},
	addEvent: function(obj,event,func,arg) {
		var self = this;
		obj.addEventListener(event,function(ev){
			var args = [];
			args.push(ev);
			args.push(arg);
			func.call(self,args);
		},false);
	},
	preventDefault: function(args){
		document.body.style.height = "100%";
		document.body.style.overflowY = "hidden";
		args[0].preventDefault();
	},
	createToast:function(){
		var self = this;
		if(window.toa){
			return;
		}
		toa = document.createElement("span");
		var status = self.opts.status;
		toa.className = "toast";
		toa.innerText = self.opts.content;
		document.body.appendChild(toa);
		setTimeout(function(){
			document.body.removeChild(toa);
			window.toa = null;
		},2000);
		window.toa = toa;
	}
 }


