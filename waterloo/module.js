WE.define('Waterloo.Module', Waterloo.WaterlooClass,{
	tcode:'module',
	
	init: function(config){
		if(config.caller&&config.caller.registerModule){
			config.caller.registerModule(this);
		}
	}
});