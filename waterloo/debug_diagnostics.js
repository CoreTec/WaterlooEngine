//add for debug version
WE.define('Waterloo.Diagnostics.Stopwatch', Waterloo.WaterlooClass,{
	tcode:'debug.swatch',
	_starttime: 0,
	_finishtime: 0,
	_totaltime: 0,
	elapsedTime: 0,
	_nodebug: true,
	
	reset: function(){
		this._starttime = 0;
		this._finishtime = 0;
		this._totaltime = 0;
	},
	
	start: function(){
		this._starttime = new Date();
		this._totaltime = 0;
	},
	
	finish: function(){
		this._finishtime = new Date();
		this._totaltime += this._finishtime-this._starttime;
		this.elapsedTime = this._totaltime;
	},
	
	pause: function(){
		this._finishtime = new Date();
		this._totaltime += this._finishtime-this._starttime;
	},
	
	cont: function(){
		this._starttime = new Date();
	}
});
//DOES NOT USE STOPWATCH
WE.define('Waterloo.Diagnostics.TimeProfile', Waterloo.WaterlooClass,{
	callTree: [], //flattned
	logArguments: false,
	stopped: true,
	_currentLevel: null,
	_nodebug: true,
	//this two must be maximally optimized
	startLog: function(logname){
		if(this.stopped) return;
		var logger = {name: logname, _s:new Date(), _f:null, _i:[], _p:this._currentLevel};
		this.callTree.push(logger);
		if(this._currentLevel!=null) this._currentLevel._i.push(logger);
		this._currentLevel = logger;
	},
	stopLog: function(){
		if(this.stopped) return;
		this._currentLevel._f = new Date();
		this._currentLevel.elapsed = this._currentLevel._f - this._currentLevel._s;
		this._currentLevel = this._currentLevel._p;
	},
	//end of procs that should be really fast
	root: function(){
		var result = [];
		for(var x in this.callTree)
			if(this.callTree[x]._p==null) result.push(this.callTree[x]);
		return result;
	}
});

WE.define('Waterloo.Diagnostics.TimeProfileManager', Waterloo.WaterlooClass,{
	singleton: true,
	profiles: {},
	currentProfile: '',
	debugPrefix: '__debug__',
	_nodebug: true,
	
	startProfile: function(profilename){
		this.profiles[profilename] = WE.create('Waterloo.Diagnostics.TimeProfile');
		this.currentProfile = profilename;
	},
	
	switchProfile: function(profilename){
		this.currentProfile = profilename;
	},
	
	runProfile: function(){
		this.profiles[this.currentProfile].stopped = false;
	},
	
	stopProfile: function(){
		this.profiles[this.currentProfile].stopped = true;
	},
	
	applyToClass: function(classdesc, flist){
		var prot = classdesc.singleton?classdesc:classdesc.prototype;
		var profprefix = this.debugPrefix+'profile__'+this.currentProfile;
		prot[profprefix] = this.profiles[this.currentProfile];
		var aplto = flist==null?[]:flist;
		if(flist==null){
			for(var x in prot)
				if(typeof prot[x] == "function" )
					aplto.push(x);
		}
		for(var y in aplto){
			var aplname = aplto[y];
			if(prot[this.debugPrefix+aplname]){
				WE.warning(aplname+' of class '+prot.__type+' is already been profiled');
				continue;
			}
			prot[this.debugPrefix+aplname] = prot[aplname];
			var f = null;
			var scode=[
				'var f = function(){',
				'this.'+profprefix+'.startLog("'+prot.__fullClassName+'->'+aplname+'");',
				'var result = this.'+this.debugPrefix+aplname+'.apply(this, arguments);',
				'this.'+profprefix+'.stopLog();',
				'return result',
				'}'
			];
			eval(scode.join('\n'));
			
			prot[aplname] = f;
		}
	},
	
	applyToNamespace: function(nspace){
		var ncd = nspace.__class_defs;
		for(var x in ncd){
			if(ncd[x]._nodebug||(ncd[x].prototype&&ncd[x].prototype._nodebug)) continue;
			if(ncd[x] instanceof Waterloo.WaterlooNamespace){
				this.applyToNamespace(ncd[x]);
				continue;
			}
			this.applyToClass(ncd[x]);
		}
	}
});