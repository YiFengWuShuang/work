function ShareFn(t){t=t||"",this.cssname=t.cssname||$(".shareCss"),this.containers=t.containers||$(".contarin"),this.filterItems=t.filterItems||[],this.init()}ShareFn.prototype={init:function(){this.evens()},getCssNames:function(){for(var t=this,e=[],n=0,s=t.cssname.length;s>n;n++)e.push(t.cssname.eq(n).attr("data-cssname"));return e},createLink:function(){for(var t=this,e="",n=t.getCssNames(),s=0,r=t.cssname.length;r>s;s++)e+='<link rel="stylesheet" href="../css/'+n[s]+'.css">';return e},fullCon:function(){return this.containers.html()},filterCon:function(){for(var t=this,e=t.filterItems.length,n=t.containers.html(),s="",r=0;e>r;r++)$(t.filterItems[r]).each(function(){s=$(this)[0].outerHTML,n=n.replace(s,"")});return n},evens:function(){var t=this,e="",n=t.filterItems.length;return e=t.createLink()+(0==n?t.fullCon():t.filterCon())}};