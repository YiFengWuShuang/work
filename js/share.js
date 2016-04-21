define(function(require, exports, module){
	
	function ShareFn(opts){
		this.cssname = opts.cssname;
		this.containers = opts.containers;
		this.childrens = opts.childrens;
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
				L = that.childrens.length,
				_containers = that.containers.html(),
				c_html = '';
			for(var i=0; i<L; i++){
				$(that.childrens[i]).each(function(){
					c_html = $(this)[0].outerHTML;
					_containers = _containers.replace(c_html,'');
				})
			}
			return _containers;
		},
		evens: function(){
			var that = this, shareCon = '', L = that.childrens.length;
			shareCon = that.createLink() + ( (L==0) ? that.fullCon() : that.filterCon() );
			return shareCon;
		}
	}

	module.exports = function(opts){
		return new ShareFn(opts);
	};
	
});