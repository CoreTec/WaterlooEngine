WE.define("Waterloo.Modular", Waterloo.WaterlooClass,{
	tcode:'modular',
	modules: [],
	_actions: [],
	
	action: function(name, startout){
		this.event(name);
		var p = 'on'+name;
		(function(me, scope){
			var pscope = scope;
			me[pscope.name]=function(_in){
				var _out=pscope.sout();
				this[pscope.ename](_in,_out);
				return _out;
			}
		})(this, {name: name, ename: 'on'+name, sout: WE.makeCloner(startout==null?{}:startout)});
		this._actions.push(name);
	},
	
	actions: function(names){
		for(var x in names){
			this.action(names[x]);
		}
	},
	
	registerModule: function(module){
		this.modules.push(module);
		for(var x in this._actions){
			var xname = this._actions[x];
			var p = module['do'+xname];
			if(p)
				this.on(xname, p, module);
		}
	}
});