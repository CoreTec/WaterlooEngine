WE.define('Waterloo.KeyMapper', Waterloo.WaterlooClass, {
	tcode: 'keymapper',
	element: null,
	
	readyElement: function(){
	},
	
	
	factories: {
		//"plus" factory
		//getElement is needed in caller
		'keymapper':function(config){
			var rooter = config.sender;
			var kmapper = WE.create(Waterloo.KeyMapper, {
				element: rooter.getElement()
			});
			rooter.exports = {
				__keymapper: kmapper,
				mapKeys: function(){
					this.__keymapper.mapKeys.apply(this.__keymapper, arguments);},
				unmapKeys: function(){
					this.__keymapper.unmapKeys.apply(this.__keymapper, arguments);},
				}
			}
			return rooter;
		}
	}
});