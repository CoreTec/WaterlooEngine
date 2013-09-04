WE.define('Waterloo.Graphics.AnimationRender', Waterloo.Module,{
	tcode: 'animationrender',
	
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
	}
});