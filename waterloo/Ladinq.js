WE.define('Waterloo.Ladinq.FunctionManager', Waterloo.WaterlooClass,{
	tcode:'ladinq.fs',
	
	_fdef: '',
	_parameters: {},
	_parentNode: null,
	_parentRule: '',
	
	_getParameterList: function(){
		var vd = false;//variable detected
		var vstr = '';
		var st = this._fdef;
		for(var i=0; i<st.length; i++){
			if(st[i]!='%'&&!vd) continue;
			if(st[i]=='%'){
				vd = true;
				continue;
			}
			if(isNaN(st[i])){
				vd = false;
				this._parameters[vstr] = null;
				vstr = '';
				continue;
			}
			vstr+=st[i];
		}
		if(vstr!='')
			this._parameters[vstr] = null;
	},
	
	define: function(str){
		this._fdef = str;
		this._getParameterList();
		return this;
	},
	
	set: function(id, value){
		this._parameters[id] = value;
		return this;
	},
	
	down: function(value, prule){
		var fm = WE.x('ladinq.fs');
		fm._parentNode = this;
		fm._parentRule = prule==null?'':prule;
		return fm;
	},
	
	makeFunction: function(){
		var fcode = [];
		
		var header = 'function(op';
		
	}
});

WE.define('Waterloo.Ladinq.Ladinq', Waterloo.WaterlooClass, {
	tcode:'ladinq',
	singleton: true,
	
		
});