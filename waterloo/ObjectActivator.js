WE.define('Waterloo.Graphics.ObjectActivator', Waterloo.Modular,{
	tcode: 'objectactivator',
	singleton: true,
	init: function(config){
		this.action('Activate', {result:{}});
	},
	createInstance:function(cfg){
		return this.Activate(cfg).result;
	}
});