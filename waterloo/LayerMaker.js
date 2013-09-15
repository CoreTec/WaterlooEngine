WE.define('Waterloo.Graphics.LayerMaker2D', Waterloo.Module,{
	tcode: 'layermaker2d',
	
	doMakeLayer: function(e, _input, _output){
		if(_input.layer.tcode!='layer') return;
		var layercfg = _input.layer;
		var canv = {
			top: layercfg.x,
			left: layercfg.y,
			width: layercfg.width,
			height: layercfg.height,
			id: _input.oldlayers.length+_output.layers.length,
			position: 'absolute',
			zIndex: layercfg.z,
			border: layercfg.border
		};
		layercfg.id=_input.oldlayers.length+_output.layers.length;
		layercfg.canvas = canv;
		layercfg.engine = e;
		layercfg.canvasContainer = e._dom;
		var lyr= WE.xcreate(layercfg);
		_output.layers.push(lyr);
		lyr.setDefaultContext('2d');
	}
});