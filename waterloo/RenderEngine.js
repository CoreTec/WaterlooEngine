WE.define('Waterloo.Graphics.RenderEngine', Waterloo.Modular,{
	tcode: 'renderengine',
	_layers: [],
	_dom: null,
	_prevframe: 0,
	init: function(config){
		this.action('Render', {todo:[]});
		this.action('DrawStart', {todo:[]});
		this.action('BeforeDrawStart', {});
		this.action('DrawEnd', {todo:[]});
		this.action('MakeLayer', {layers:[]});
		this.action('Start', {});
		this._dom = document.getElementById(config.domId);
	},
	
	addLayer: function(layercfg){
		var result = this.MakeLayer({layer:layercfg, oldlayers: this._layers}).layers;
		this._layers = this._layers.concat(result);
	},
	
	renderLayer: function(layer){
		var todo = [];
		for(var x in layer.objects){
			var p = layer.objects[x];
			WE.apply(todo, this.Render({item:p, layer:layer}).todo);
		}
		return todo;
	},
	
	reApply:function(base, layer, item){
		WE.apply(base, this.Render({item:item, layer:layer}).todo);
	},
		
	renderAll:function(){
		var rstart = new Date();
		this.gFPS = 1000/(rstart-this._prevframe);		
		this._prevframe = rstart;
		for(var x in this._layers){
			var layer = this._layers[x];
			if(!layer._validated) continue;
			
			layer._validated = false;
			this.BeforeDrawStart(layer);
			var dsaction = this.DrawStart(layer);
			var todo = [];
			WE.apply(todo,dsaction.todo);
			var me = this;
			if(dsaction.blockDrawing!==true)
				WE.apply(todo,this.renderLayer(layer));
			var deaction = this.DrawEnd(layer);
			WE.apply(todo,deaction.todo);
			setTimeout(function(lr,td){
				var pp = new Date();
				lr.prepareFrame();
				lr.executeAllOver(td);
				lr._rendertime = new Date()-pp;
				lr._validated = true;
			}, layer._rendertime==0?10:layer._rendertime, layer, todo);
		}
		var rend = new Date();
		this.FPS = 1000/(rend-rstart)
		//WE.log('FPS:'+this.FPS+'; GFPS:'+this.gFPS);
	}
});