/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Heavily modified by Andrii Yukhymchak
 */
// Inspired by base2 and Prototype
(function(){
 
  // The base Class implementation (does nothing)
  this._classCore = function(){};
  this.WE = {initializing: false, fnTest: /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/};
  //const keyword
  this.CONST = function(config){
	var cfg = config;
	cfg.CONST = true;
	return cfg;
  };
  //merge keyword
  this.MERGE = function(config){
	var cfg = config;
	cfg.__apply_recursive = true;
	return cfg;
  }
  //apply with clones
  this.WE.apply = function(ar1,ar2,recursives){
	//if this is two arrays - just join them
	if(ar1 instanceof Array && ar2 instanceof Array){
		for(var x in ar2){
			ar1.push(ar2[x]);
		}
		return ar1;
	}
	var forceRecreate = ar1.__apply_forceRecreate;
	var softApply = ar2.__apply_soft||ar1.__apply_soft;
	for(var x in ar1){
		//we don't want to recreate function - this will kill it
		var recreate = (ar1[x])&&(typeof ar1[x] != "function")&&(ar1[x].CONST!==true)&&(forceRecreate||ar1[x].__apply_recreate);
		
		if(recreate){
			//we don't want to recreate constants
			var val = ar1[x] instanceof Array?WE.apply([],ar1[x]):(ar1[x] instanceof Object?WE.apply({},ar1[x]):ar1[x]);
			ar1[x] = val;
		}
	}
	for(var x in ar2){
		var recursive = (ar2[x]&&ar2[x].__apply_recursive)||(ar1[x]&&ar1[x].__apply_recursive)||(recursives&&recursives[x]);		
		var val = (ar1[x]==null?(ar2[x] instanceof Array?[]:{}):(recreate?WE.apply({},ar1):ar1));
		if(recursive){
			var val = (ar1[x]==null?(ar2[x] instanceof Array?[]:{}):ar1[x]);
			ar1[x] = WE.apply(val, ar2[x]);
		}
		else{
			if(!softApply||ar1[x]==null)
				ar1[x] = ar2[x];
		}		
	}
	return ar1;
  };
  this.WE.unbind = function(ar){
	ar.__apply_forceRecreate = true;	
	return WE.apply(ar,{});
  };
  this.WE.clone = function(ar,unbind){
	WE.initializing = true;
	var rc = new ar.__proto__.constructor();
	WE.initializing = false;
    var result = WE.apply(rc,ar);
	if(unbind)
		WE.unbind(result)
	return result;
  }
  // Create a new Class that inherits from this class
  _classCore.extend = function(prop) {
    var _super = this.prototype;
	var _parent_class = this.prototype;
	
	
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    WE.initializing = true;
    var prototype = new this();
    WE.initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && WE.fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    prototype.type = prop.__type;
    // The dummy class constructor
	var f = null;
	f=function() {
		if ( !WE.initializing ){
			if(this.init!=null){
				this.init.apply(this, arguments);
			}
		}
    };
	//f.name = this.__type;
	var strs = ['f=',
		'function '+prop.__type+'() {',
		'if ( !WE.initializing ){',
		'if(this.init!=null){',
		'this.init.apply(this, arguments);',
		'}',
		'}',		
		'}'];
	
	eval(strs.join('\n'));
   
    // Populate our constructed prototype object
    f.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    f.prototype.constructor = f;
    // And make this class extendable
    f.extend = arguments.callee;
	// _classCore._base_ctor = function(){
		// if(_parent_class) {
			// if(_parent_class._base_ctor!=null)
				// _parent_class._base_ctor.apply(this, arguments);
			// _parent_class.init.apply(this, arguments);
		// }
	// };
	return f;
  };
    
  this.WaterlooClass = _classCore.extend({
	unextendable: false,
	namespace:false,
	__type:'WaterlooClass',
	__fullClassName:'Waterloo.WaterlooClass',
	__events: {},
	__eventScopes: {},
	__prop_ctor: function(){
		this.__events={};
		this.__eventScopes={};
	},
	toString: function(){
		return 'basic class';
	},
	on: function(name, f, scope){
				this.__events[name].push(f);
				this.__eventScopes[name].push(scope);
	},
	un: function(name){
				var what, a = arguments, L = a.length, ax;
				var arr = this.__events[name];
				var arr2 = this.__eventScopes[name];
				while (L > 1 && arr.length) {
					what = a[--L];
					while ((ax= arr.indexOf(what)) !== -1) {
						arr.splice(ax, 1);
						arr2.splice(ax, 1);
					}
				}
	},
	event: function(name){
		var xx = name;
		this.__events[xx] = []; 
		this.__eventScopes[xx] = [];
		(function(m, xy){
			var evclos = {caller: m, handler: xy};
			m['on'+xy] = function(){
				
				var args = [evclos.caller];
				for(var pp = 0;pp<arguments.length; pp++)
					args.push(arguments[pp]);
				//probably add possibility to manipulate scopes
				var handlers = evclos.caller.__events[evclos.handler];
				for(var h in handlers){
					var scope = evclos.caller.__eventScopes[evclos.handler][h];
					if(scope==null) scope = evclos.caller;
					handlers[h].apply(scope, args);
				}
			}
		})(this, xx);
	},
	events: function(list){
		for(var x in list){
			this.event(list[x]);
		}
	},
	init: function(config){		
		this.__prop_ctor();
		if(config!=null)
			WE.apply(this, config);
			// for(var x in config)
				// this[x] = config[x];	
	},
	xprop: function(name, defaults){
		this[name] = WE.xcreateArray({defaults:defaults, items: this[name]});
	},
	extendWith: function(config){
		if(config instanceof Array){
			for(var x in config){
				config[x].caller=this;
				var xc = WE.xcreate(config);
				if(xc.exports)
					WE.apply(this, xc.exports);
			}
			return this;
		}
		config.caller = this;
		var xc = WE.xcreate(config);
		if(xc&&xc.exports)
			WE.apply(this, xc.exports);
		return this;
	}
  });
  
  this.WaterlooNamespace = this.WaterlooClass.extend({
	unextendable: false,
	namespace:true,
	name:'',
	globalMe: null,
	__type: 'WaterlooNamespace',
	__fullClassName:'Waterloo.WaterlooNamespace',
	__class_defs: {},
	__nodebug: false,
	__prop_ctor: function(){
		this._super();
		this.__class_defs={};
	},
	makePropCtor: function(props){
		var f = null;
		var strs = [
		'f = function(){',
		//'this._super();',
		'var _temp=null;'];
		for(var x in props){
			var prop = props[x];
			if(!prop) continue;
			if(prop.CONST) continue;
			if(typeof prop == "function") continue;
			if(WE.onClassPropCtor){
				var evout = {todo:[], ignore:false, handled:false};
				WE.onClassPropCtor(props, x, evout);
				if(evout.fail) continue;
				WE.apply(strs, evout.todo);
				if(evout.handled) continue;
			}
			if(prop instanceof Array){
				var prp = 'this["'+x+'"]';
				strs.push('_temp='+prp+';');
				strs.push(prp+'=[];');
				strs.push('for(var ___ in _temp){');
				strs.push(prp+'.push(_temp[___]);');
				strs.push('}');
				continue;
			}
			if(prop instanceof Object){
				var prp = 'this["'+x+'"]';
				strs.push('_temp='+prp+';');
				strs.push(prp+'={};');
				strs.push('for(var ___ in _temp){');
				strs.push(prp+'[___]=_temp[___];');
				strs.push('}');
				continue;
			}
		}
		strs.push('}');
		eval(strs.join('\n'));
		return f;
	},
	toString: function(){
		return 'Namespace: ' + this.name;
	},
	init: function(){		
		this._super();
		this.event('ClassDefine');
		this.event('ClassRegister');
	},
	getClass:function(classname){
		var ndex = classname.indexOf('.');
		var splstr = classname.substring(0, ndex);
		var rest = classname.substring(ndex+1);		
		if(ndex!=-1)
			return this.__class_defs[splstr].getClass(rest);
		if(this.__class_defs[rest]==null)
			return null;
		return this.__class_defs[rest];
	},
	//There is several properties that are handled in DEFINE function, not in class itself
	//These properties would require class to know about whole system. We don't want that
	//Also we have problems with static constructor, so we do everything here
	//These properties are: alias, tcode, singleton, statics, factories
	define:function(classname, parentclass, prop){
		
		//allow usage of namespaces
		var ndex = classname.indexOf('.');
		var splstr = classname.substring(0, ndex);
		var rest = classname.substring(ndex+1);
		
		if(ndex!=-1)
		{
			if(this.__class_defs[splstr]==null){
				var cls = new WaterlooNamespace({
					name: splstr,
					//globalMe: this.globalMe[splstr]
				});
				this.__class_defs[splstr] = cls;
				this.globalMe[splstr] = cls;
				cls.globalMe = cls;
			}
			return this.__class_defs[splstr].define(rest, parentclass, prop);
		}
		if(splstr.indexOf('{')!=-1) throw "Incorrect class name "+splstr;
		var parent;
		if(parentclass instanceof String)
			parent = this.getClass(parentclass);		
		else
			parent = parentclass;
		if(parent.namespace) throw "Can't extend namespace. Namespace name is "+parentclass;
		if(parent.unextendable) throw 'Class '+parentclass+' is unextendable';
		//create empty constructor if not specified
		if(prop.init==null) prop.init = function(){};
		//mutate constructor, so it calls parent
		var __main_ctor = prop.init;
		if(prop.__prop_ctor==null)
			prop.__prop_ctor = this.makePropCtor(prop);
		prop.init = function(){
			this.__prop_ctor();
			if(this._super)
				this._super.apply(this, arguments);
			__main_ctor.apply(this,arguments);
		}
		this.onClassDefine(prop);		
		prop.__type = classname;
		var excls = parent.extend(prop);
		this.__class_defs[rest] = excls;
		this.globalMe[rest] = excls;
		
		if(prop.singleton){
			excls = new excls();
			this.globalMe[rest] = excls;	
			this.__class_defs[rest]	= excls;
		}
		if(prop.alias!=null)
			for(var x in prop.alias)
				WE.registerClass(prop.alias[x], excls);
		if(prop.tcode!=null)
			WE.registerClass('Waterloo.X.'+prop.tcode, excls);
		if(prop.statics)
			for(x in prop.statics)
				this.globalMe[rest][x] = prop.statics[x];
		if(prop.factories){
			for(x in prop.factories){
				var caller = prop.factories[x];
				Waterloo.F.registerClass(x, caller);
			}			
		}
		this.onClassRegister(excls);
		return excls;
	},
	makeSubspace: function(namespace){
		//allow usage of namespaces
		var ndex = namespace.indexOf('.');
		var splstr = namespace.substring(0, ndex);
		var rest = namespace.substring(ndex+1);
		
		if(ndex!=-1)
		{
			if(this.__class_defs[splstr]==null){
				var cls = new WaterlooNamespace({
					name: splstr,
					//globalMe: this.globalMe[splstr]
				});
				this.__class_defs[splstr] = cls;
				this.globalMe[splstr] = cls;
				cls.globalMe = cls;
			}
			return this.__class_defs[splstr].makeSubspace(rest);
		}
		var excls = new WaterlooNamespace({
					name: rest,
					//globalMe: globalMe[rest]
				});
		this.__class_defs[rest] = excls;
		this.globalMe[rest] = excls;
		excls.globalMe = excls;
		return excls;
	},
	gotoSubspace: function(namespace, ignorelast){
		var ndex = namespace.indexOf('.');
		var splstr = namespace.substring(0, ndex);
		var rest = namespace.substring(ndex+1);
		
		if(ndex!=-1){
			return this.__class_defs[splstr].gotoSubspace(rest, ignorelast);
		}
		if(ignorelast)
			return this;
		return this.__class_defs[rest];
	},
	registerClass:function(classname, classdef, noglobalreg){
		var ndex = classname.indexOf('.');
		var splstr = classname.substring(0, ndex);
		var rest = classname.substring(ndex+1);
		
		if(ndex!=-1){
			if(this.__class_defs[splstr]==null){
				var cls = new WaterlooNamespace({
					name: splstr,
					//globalMe: this.globalMe[splstr]
				});
				this.__class_defs[splstr] = cls;
				this.globalMe[splstr] = cls;
				cls.globalMe = cls;
			}
			return this.__class_defs[splstr].registerClass(rest, classdef);
		}
		this.__class_defs[rest] = classdef;
		if(!noglobalreg)
			this.globalMe[rest] = classdef;
		this.onClassRegister(classdef);
		return classdef;
	}
  });  
  
  this.WaterlooEngine = this.WaterlooNamespace.extend({
	apply: WE.apply,
	unbind: WE.unbind,
	clone: WE.clone,
	__type: 'WaterlooEngine',
	__fullClassName:'WaterlooEngine',
	_log: [],
	_logmode: false,
	aliases: {},
	cache: {},
	initializing: WE.initializing,
	define: function(classname, parentclass, prop){
		prop.__fullClassName = classname;
		this._super(classname, parentclass, prop);
	},
	init: function(config){
		this._super.apply(this, arguments);
		this.event('Error');
		this.event('Warning');
		this.event('ClassPropCtor');
	},
	_createByTCode: function(xcode, config){
		var tcode = xcode;
		var pcode = tcode.indexOf('+');
		if(pcode==-1){
			var ctc = this.cache[tcode];
			if(ctc){
				if(ctc.f){
					if(ctc.f._origin)
						return ctc.f.apply(ctc.f._origin, config);
					return ctc.f(config);
				}
				if(ctc.c){
					if(ctc.c.singleton){
						if(ctc.c.applyConfig)
							return ctc.c.applyConfig(config);
						return ctc.c;
					}
					return new ctc.c(config);
				}
			}
			var atc = this.aliases[tcode];
			if(atc){
				return this._createByTCode(atc, config);
			}
			var dtcode = tcode==null?'default':'Waterloo.F.'+tcode;
			
			var cls = WE.getClass(dtcode);
			if(cls instanceof Waterloo.WaterlooNamespace)
				cls = null;
			if(cls!=null){
				this.cache[tcode] = {f:cls};
				if(cls._origin)
					return cls.apply(cls._origin, config);
				return cls(config);
			}
			dtcode = 'Waterloo.X.'+tcode;
			cls = WE.getClass(dtcode);
			if(cls==null)
				throw 'To load class through tcode you need it to be registered in Waterloo.X namespace';
				
			this.cache[tcode] = {c:cls};		
			if(cls.singleton){
				if(cls.applyConfig)
					return cls.applyConfig(config);
				return cls;
			}
			return new cls(config);
		}
		
		var base = null;
		var splits = null;
		var ctc = this.cache[tcode];
		if(ctc){
			base = ctc.b;
			splits = ctc.s;
		}
		else{
		base = tcode.substring(0, pcode);
		splits = tcode.substring(pcode+1).split('+');
		}
		
		var bcls = this._createByTCode(base, config);
		
		for(var xx in splits){
			var x = splits[xx];
			var cnf = {tcode:x};
			bcls.extendWith(cnf);
		}		
		if(ctc==null)
			this.cache[tcode] = {b:base, s:splits};
		return bcls;
	},
	_createByClassName: function(xclass, config){
		if(typeof xclass == 'string'){
			cls = this.getClass(xclass);
			if(cls==null)
				throw "Can't find class "+xclass;
		}
		else
			cls = xclass;
		
		var res = null;
		if(cls.singleton)
			res = cls;
		else
			res = new cls(config);
		
		return res;
	},	
	create: function(xclass, config){
		//if class is already created or someone wants to cheat (won't do anything criminal, but looks bad to redefine ctor in config)
		if(config&&(config.init!=null)) return config;
		if(xclass==null){
			var tcode = config.tcode;
			tcode = tcode.replace(/\s+/g, '');
			return this._createByTCode(tcode, config);
		}
		return this._createByClassName(xclass, config);
	},
	xcreate: function(tcodeorcfg, config){
		if(typeof tcodeorcfg == 'string'){
			var cfg = config==null?{}:config;
			cfg.tcode = tcodeorcfg;
			return WE.create(null, cfg);
		}
		return WE.create(null, tcodeorcfg);
	},
	x: function(tcodeorcfg, config){
		return this.xcreate(tcodeorcfg, config);
	},
	createArray: function(xclass, config){		
		var items = config.items==null?config:config.items;
		var defaults = config.defaults==null?{}:config.defaults;
		for(var x in items){
			//don't want to apply defaults to inited objects
			if(items[x].init==null)
				WE.apply(items[x],defaults);
		}
		if(items instanceof Array){
			var result = [];
			for(var x in items){
				var obj = WE.create(xclass, items[x]);
				result.push(obj);
			}
			return result;
		}
		var result = {};
		for(var x in items){
			var obj = WE.create(xclass, items[x]);
			result[x] = obj;
		}
		return result;
	},
	xcreateArray: function(config){
		return WE.createArray(null, config);
	},
	setTCode: function(name, code){
		if(typeof code == 'string'){
			this.aliases[name] = code;
		}
		else{
			WE.registerClass('Waterloo.X.'+name, code, true);
		}
		this.cache={};
	},
	warning: function(msg){
		var ms = {type:'warning', level:1, msg:msg, time:new Date().getTime()}
		WE._log.push(ms);
		WE.onWarning(ms);
	},
	error: function(msg){
		var ms = {type:'error', level:4, msg:msg, time:new Date().getTime()}
		WE._log.push(ms);
		WE.onError(ms);
	},
	log: function(msg){
		if(WE._logmode){
			var ms = {type:'log', level:0, msg:msg, time:new Date().getTime()}
			WE._log.push(ms);
		}
	},
	flushlog: function(){
		WE._log=[];
	},
	makeCloner: function(prop){
		var base = prop;
		var rc = base.__proto__.constructor;
		var fnk = this.makePropCtor(base);
		var ret = function(){
			WE.initializing = true;
			var res = new rc();
			WE.initializing = false;
			for(var px in base)
				res[px] = base[px];
			fnk.apply(res);
			return res;
		}
		return ret;
	},
	makeTCode:function(tcode, obj, sender){
		if(typeof obj == "function"){
			if(sender!=null)
				obj._origin = sender;
			Waterloo.F.registerClass(tcode, obj);
			return;
		}
		if(typeof obj =="string"){
			this.setTcode(tcode, obj);
			return;
		}
		
		Waterloo.X.registerClass(tcode,obj);
	}
  });
  this.WaterlooEngine = new this.WaterlooEngine;
  this.WaterlooEngine.fnTest = this.WE.fnTest;
  this.WE = this.WaterlooEngine;
  this.WaterlooEngine.globalMe = window;
  this.WaterlooEngine.registerClass('default', this.WaterlooClass, true);
  this.WaterlooEngine.registerClass('namespace', this.WaterlooNamespace, true);
  this.WaterlooEngine.registerClass('Waterloo.class', this.WaterlooClass, true);
  this.WaterlooEngine.registerClass('Waterloo.WaterlooClass', this.WaterlooClass);
  this.WaterlooEngine.registerClass('WaterlooClass', this.WaterlooClass, true);
  this.WaterlooEngine.registerClass('Waterloo.namespace', this.WaterlooNamespace, true);
  this.WaterlooEngine.registerClass('Waterloo.WaterlooNamespace', this.WaterlooNamespace);
  this.WaterlooEngine.registerClass('WaterlooNamespace', this.WaterlooNamespace, true);
  this.WaterlooEngine.makeSubspace('Waterloo.F');
  this.WaterlooEngine.makeSubspace('Waterloo.X');
  Waterloo.X._nodebug = true;
  Waterloo.F._nodebug = true;
  
  
})();