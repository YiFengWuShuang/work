var Popup=function(e,t,o){this.opts=e,this.confirmTemplate='<div class="popup-content">{content}</div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>',this.imageConfirm='<div class="popup-title">已选取图片</div><div class="popup-content"><img src="{src}" alt=""/></div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>',this.alertTemplate='<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a data-target="closePopup" data-icon="checkmark">{ok}</a></div>',this.svg='<svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="circle" class="g-circles g-circles--v1"><circle id="12" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " cx="35" cy="16.6987298" r="10"></circle><circle id="11" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " cx="16.6987298" cy="35" r="10"></circle><circle id="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " cx="10" cy="60" r="10"></circle><circle id="9" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " cx="16.6987298" cy="85" r="10"></circle><circle id="8" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " cx="35" cy="103.30127" r="10"></circle><circle id="7" cx="60" cy="110" r="10"></circle><circle id="6" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " cx="85" cy="103.30127" r="10"></circle><circle id="5" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " cx="103.30127" cy="85" r="10"></circle><circle id="4" transform="translate(110, 60) rotate(-90) translate(-110, -60) " cx="110" cy="60" r="10"></circle><circle id="3" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " cx="103.30127" cy="35" r="10"></circle><circle id="2" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " cx="85" cy="16.6987298" r="10"></circle><circle id="1" cx="60" cy="10" r="10"></circle></g><use xlink:href="#circle" class="use"></use></svg>',this.id=0,this.dom=t,this.ev=o,this.move=!0,this.scale=!1,this.init()};Popup.prototype={init:function(){var e=this,t=this.opts.type,o=document.createElement("div");o.className="over_load",o.style.height=document.body.scrollHeight+"px";var a=document.createElement("div");switch(e.overload=o,e.popup=a,e.addEvent(e.overload,"touchmove",e.preventDefault),e.addEvent(e.popup,"touchmove",e.preventDefault),t){case"confirm":a.className="center popup_in",e.confirm(),document.body.appendChild(o);break;case"alert":a.className="center popup_in",e.alert(),document.body.appendChild(o);break;case"top":a.className="popup_top popup_in",e.top(),document.body.appendChild(o);break;case"bottom":a.className="popup_bottom popup_in",e.bottom(),document.body.appendChild(o);break;case"loading":if(window.loading)return;window.loading=e.popup,window.loading.className="popup_load",e.createLoad();break;case"image":e.createImage();break;case"toast":e.createToast();break;case"image_preview":a.className="center popup_in",e.createImagePreview(),document.body.appendChild(o)}},confirm:function(){var e=this,t=(e.opts.title||"",e.opts.content||""),o=e.opts.ok||"",a=e.opts.cancel||"",c=e.confirmTemplate.replace("{content}",t).replace("{cancel}",a).replace("{ok}",o);e.opts.icon&&(c='<span class="warning-icon"></span>'+c),e.popup.innerHTML=c,document.body.appendChild(e.popup);var n=document.getElementById("popup_btn_container");setTimeout(function(){e.addEvent(n,"click",e.close,"center popup_out")},200)},alert:function(){var e=this,t=e.opts.title,o=e.opts.content,a=e.opts.ok,c=e.alertTemplate.replace("{title}",t).replace("{content}",o).replace("{ok}",a);e.popup.innerHTML=c,document.body.appendChild(e.popup);var n=document.getElementById("popup_btn_container");e.addEvent(n,"click",e.close,"center popup_out")},top:function(){var e=this,t=e.opts.content;e.popup.innerText=t,document.body.appendChild(e.popup),e.addEvent(e.overload,"click",e.close,"popup_top popup_out")},bottom:function(){var e=this,t=e.opts.content;e.popup.innerHTML=t,document.body.appendChild(e.popup),e.addEvent(e.overload,"click",e.close,"popup_bottom popup_out")},createLoad:function(){{var e=this;new Date}e.loadSVG(),document.body.appendChild(window.loading)},loadSVG:function(){var e=this,t="http://www.w3.org/2000/svg",o=!!document.createElementNS&&!!document.createElementNS(t,"svg").createSVGRect;o?loading.innerHTML=e.svg:loading.className="popup_load2"},createImagePreview:function(){var e=this,t=(e.opts.title||"",e.opts.content||"",e.opts.ok||""),o=e.opts.cancel||"",a=e.opts.imgUrl||"",c=e.imageConfirm.replace("{src}",a).replace("{cancel}",o).replace("{ok}",t);e.popup.innerHTML=c,document.body.appendChild(e.popup);var n=document.getElementById("popup_btn_container");e.addEvent(n,"click",e.close,"center popup_out")},createImage:function(){var e=this,t=e.opts.list,o=$("."+t),a=o.length,c="",n=e.index||0;e.img_slider=document.createElement("div"),e.img_slider.className="image_slider",document.body.appendChild(e.img_slider);var i=document.createElement("div");i.className="slider_content",e.doc=document.createElement("div"),e.doc.className="dot",e.doc.id="dot";for(var l=0;a>l;l++)e.dom[0]==o[l]&&(n=l),c=c+'<div class="item" id="item_'+l+'" style="width:'+e.img_slider.offsetWidth+'px"><img src="'+o[l].getAttribute("data_src")+'" alt="'+o[l].getAttribute("alt")+'"/></div>';var r=document.createElement("a");r.innerText="完成",e.doc.appendChild(r);var p=document.createElement("span");if(p.className="dot_count",p.innerText=n+1+"/"+a,e.doc.appendChild(p),e.opts.canDelete){var d=document.createElement("span");d.className="deleteSpan",e.doc.appendChild(d),$(d).on("click",function(){m()})}e.addEvent(r,"click",e.closeImage),i.innerHTML=c,e.img_slider.appendChild(i),document.body.appendChild(e.doc),i.style.width=a*e.img_slider.offsetWidth+"px",e.addEvent(e.img_slider,"touchmove",e.preventDefault);var s=function(e){0>=e?a-1>n?(n++,p.innerText=n+1+"/"+a):n=a-1:n>0?(n--,p.innerText=n+1+"/"+a):n=0},m=function(){new Popup({type:"confirm",title:"",content:"<p style='font-size:1.1em'></p><p style='font-size:1.5em'>您确定删除这张照片吗？</p>",ok:"确定",cancel:"取消",icon:!1,closeCallBack:function(){},okCallBack:function(){u()}})},u=function(){var t=e.opts.delCallBack,a=o.eq(n).attr("photo_id");t&&t(v,a)},v=function(){if(o.eq(n).remove(),0==n)e.closeImage();else{e.img_slider.remove(),e.doc.remove();{new Popup({type:"image",canDelete:!0,delCallBack:e.opts.delCallBack,list:"img_item"},$(this))}}},h=0-e.img_slider.offsetWidth*n;i.style.webkitTransform="translate3d("+h+"px,0,0)",new Swipe(i,h,n,s)},closeImage:function(){var e=this;document.body.removeChild(e.img_slider),document.body.removeChild(e.doc),document.body.style.height="auto",document.body.style.overflowY="auto"},scaleImage:function(e){var t=this,o=e[0],a=o.target,c=a.tagName.toLowerCase();"img"==c&&(t.scale?(a.style.webkitTransform="scale(1) translate3d(-50%,-50%,0)",t.scale=!1):(a.style.webkitTransform="scale(3)",t.scale=!0))},close:function(e){var t=this,o=e[0].target.getAttribute("data-icon");if(t.popup.className=e[1],"close"==o)t.callBack(t.opts.closeCallBack);else{var a=$(".popup-content").find("input");if("confirm"==t.opts.type&&a&&a.length>0){var a=$(".popup-content").find("input");a&&a.length>0?t.callBack(t.opts.okCallBack,a.val()):t.callBack(t.opts.okCallBack)}else t.callBack(t.opts.okCallBack)}},closeLoad:function(){window.loading&&(document.body.removeChild(window.loading),window.loading=null)},callBack:function(e,t){var o=this;setTimeout(function(){document.body.removeChild(o.popup),document.body.removeChild(o.overload),e&&e(t)},300)},addEvent:function(e,t,o,a){var c=this;e.addEventListener(t,function(e){var t=[];t.push(e),t.push(a),o.call(c,t)},!1)},preventDefault:function(e){document.body.style.height="100%",document.body.style.overflowY="hidden",e[0].preventDefault()},createToast:function(){var e=this;if(!window.toa){toa=document.createElement("span");{e.opts.status}toa.className="toast",toa.innerText=e.opts.content,document.body.appendChild(toa),setTimeout(function(){document.body.removeChild(toa),window.toa=null},2e3),window.toa=toa}}};