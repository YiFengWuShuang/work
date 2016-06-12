function ShareFn(opts){
	opts = opts || '';
	this.cssname = opts.cssname || $('.shareCss');
	this.containers = opts.containers || $('.contarin');
	this.filterItems = opts.filterItems || [];
	this.init();
}

ShareFn.prototype = {
	init: function(){
		this.evens();
	},
	getCssNames: function(){
		var that = this, names = [];
		for(var i=0, L=that.cssname.length; i<L; i++){
			names.push(that.cssname.eq(i).attr('data-cssname'));
		}
		return names;
	},
	createLink: function(){
		var that = this, links = '', names = that.getCssNames();
		for(var i=0, L=that.cssname.length; i<L; i++){
			links += '<link rel="stylesheet" href="../css/'+ names[i] +'.css">';
		}
		return links;
	},
	fullCon: function(){
		return this.containers.html();
	},
	filterCon: function(){
		var that = this,
			L = that.filterItems.length,
			_containers = that.containers.html(),
			c_html = '';
		for(var i=0; i<L; i++){
			$(that.filterItems[i]).each(function(){
				c_html = $(this)[0].outerHTML;
				_containers = _containers.replace(c_html,'');
			})
		}
		return _containers;
	},
	evens: function(){
		var that = this, shareCon = '', L = that.filterItems.length;
		shareCon = that.createLink() + ( (L==0) ? that.fullCon() : that.filterCon() );
		return shareCon;
	}
}