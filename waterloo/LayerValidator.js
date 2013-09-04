WE.define('Waterloo.Graphics.LayerValidator', Waterloo.Module,{
	tcode: 'layervalidator',
	
	doDrawEnd: function(e, _input, _output){		
		_input._needsRedraw=false;
		_input._validated=true;
	}
});