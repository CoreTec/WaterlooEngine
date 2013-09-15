WE.define('Waterloo.Graphics.AnimationRender', Waterloo.Module,{
	tcode: 'animationrender',
	
	_objectsByLayers: {},
	_frameTimer: 0,
	_minframe: {},
	_maxPerFrame: {},
	_lastFrameObj: {},
	_cache: {},
	
	doRender: function(e, _input, _output){
		if(!(_input.item instanceof Waterloo.Graphics.AnimationInstance)) return;
		var anim = _input.item;
		var layer = _input.layer;
		var obj = anim.getFrame(this._frameTimer);
		e.reApply(_output.todo, layer, obj);
	},
	
	doBeforeDrawStart: function(e, _input, _output){
		this._frameTimer = (new Date())-0;
		if(_input.needsRedraw()){
			return;
		}
		
		_input.invalidate();
		// for(var x in _input.objects){
			// var obj = _input.objects[x];
			// if(!(obj instanceof Waterloo.Graphics.AnimationInstance))
				// continue;
			// if(obj._nextframetime<=this._frameTimer){
				// _input.invalidate();
				// return;
			// }
		// }
	},
	
	doAddObjectsToLayer: function(e, _input, _output){
		var lr = _input.layer;
		var objs = _input.objects;
		var obl = this._objectsByLayers;
		
		if(obl[lr.id]==null) obl[lr.id] = [];
		this._maxPerFrame[lr.id] = 50;
		this._lastFrameObj[lr.id] = 0;
		this._minframe[lr.id] = 0;
		this._cache[lr.id] = [];
		for(var x in objs){
			if(!(objs[x] instanceof Waterloo.Graphics.AnimationInstance)) continue;
			obl[lr.id].push(objs[x]);
			lr.objects.push(objs[x]);
			this._cache[lr.id][x] = null;
		}		
	},
	
	doRenderLayer: function(e, _input, _output){
		var lr = _input.layer;
		var time = this._frameTimer;
		var objs = this._objectsByLayers[lr.id];
		if(objs==null) return;
		var maxPerFrame = this._maxPerFrame[lr.id];
		var lastFrameObj = this._lastFrameObj[lr.id];
		var cache = this._cache[lr.id];
		var lastobj = Math.min(objs.length,lastFrameObj+maxPerFrame);
		for(var x=lastFrameObj; x<lastobj; x++){		
			var xx = objs[x];
			var obj = xx.getFrame(time);
			cache[x] = obj;			
		}
		for(var x=0; x<cache.length;x++){
			e.reApply(_output.todo, lr, cache[x]);
		}
		this._lastFrameObj[lr.id] = (lastFrameObj+maxPerFrame>objs.length)?0:(lastFrameObj+maxPerFrame);
	}
});