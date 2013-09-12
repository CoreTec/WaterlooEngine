WE.define('Waterloo.Graphics.AnimationRender', Waterloo.Module,{
	tcode: 'animationrender',
	
	_objectsByLayers: {},
	
	doRender: function(e, _input, _output){
		if(!(_input.item instanceof Waterloo.Graphics.AnimationInstance)) return;
		var anim = _input.item;
		var layer = _input.layer;
		var obj = anim.getFrame(new Date());
		e.reApply(_output.todo, layer, obj);
	},
	
	doBeforeDrawStart: function(e, _input, _output){
		if(_input.needsRedraw()) return;
		for(var x in _input.objects){
			var obj = _input.objects[x];
			if(!(obj instanceof Waterloo.Graphics.AnimationInstance))
				continue;
			var cframe = new Date();
			if(obj._nextframetime<=cframe){
				_input.invalidate();
				return;
			}
		}
	},
	
	doAddObjectsToLayer: function(e, _input, _output){
		var lr = _input.layer;
		var objs = _input.objects;
		var obl = this._objectsByLayers;
		
		if(obl[lr.id]==null) obl[lr.id] = [];
		
		for(var x in objs){
			if(!(objs[x] instanceof Waterloo.Graphics.AnimationInstance)) continue;
			obl[lr.id].push(objs[x]);
			lr.objects.push(objs[x]);
		}		
	},
	
	doRenderLayer: function(e, _input, _output){
		var lr = _input.layer;
		var time = new Date();
		var objs = this._objectsByLayers[lr.id];
		for(var x in objs){
			var xx = objs[x];
			var obj = xx.getFrame(time);
			e.reApply(_output.todo, lr, obj);
		}
	}
});