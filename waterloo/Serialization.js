WE.define('Waterloo.Serialization.SerializationConfig', Waterloo.WaterlooClass,{
	
});

WE.define('Waterloo.Serialization.Serializator', Waterloo.WaterlooClass,{
	tcode: 'serializators.base',
	
	factories: {
		'serialization': function(cfg){
			var ptcode = 'serializators.'+cfg.serializator;
			var messagecfg = cfg;
			var rcfg = {tcode:ptcode, serializationConfig: messagecfg};
			var px = WE.x(rcfg);
			px._prepareSerializator();
			return px;
		}
	},
	
	_serializationFunction: null,
	_deserializationFunction: null,
	serializationConfig: null,
	
	makeSerializationFunction: function(scfg){
		return function(input){return '';};
	},
	makeDeserializationFunction: function(scfg){
		return function(input){return {};};
	},
	
	_prepareSerializator: function(){
		this._serializationFunction = this.makeSerializationFunction(this.serializationConfig);
		this._deserializationFunction = this.makeDeserializationFunction(this.serializationConfig);
	},
	
	serialize: function(input){
		return this._serializationFunction(input);
	},
	
	deserialize: function(input){
		return this._deserializationFunction(input);
	}
});

//Config example for JSON
// {
	// serializator: 'JSON',
	// mappings: [
		// {
			// source: 'lx',
			// map: 'location.x',
			// defaults: 0
		// },
		// {
			// source: 'ly',
			// map: 'location.y',
			// defaults: 0
		// },
		// {
			// source: 'n',
			// map: 'name',
			// defaults: ''
		// },
		// {
			// source: 'm',
			// map: 'messageId',
			// required: true
		// }
	// ]
// }
WE.define('Waterloo.Serialization.JSON', Waterloo.Serialization.Serializator,{
	tcode: 'serializators.JSON',
	
	makeSerializationFunction: function(scfg){
		var f = null;
		var mps = scfg.mappings;
		var trumps = [];
		var defs = [];
		
		for(var i=0; i<mps.length; i++){
			var tmps = mps[i];
			if(tmps.type==null){
				var pre = '';
				var post = '';
				var src = '';			
				src = tmps.source;
				var loc = src.lastIndexOf('.');
				pre = loc.
			}
			
		}
		return function(input){return '';};
	}
});

WE.define('Waterloo.Serialization.Base64', Waterloo.Serialization.Serializator,{
});