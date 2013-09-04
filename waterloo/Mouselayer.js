WE.define('Waterloo.Graphics.MouseLayerMaker', Waterloo.Module,{
	tcode: 'mouselayermaker',
	
	doMakeLayer: function(e, _input, _output){
		if(_input.layer.tcode!='mouselayer') return;
		var layercfg = _input.layer;
		var canv = {
			top: layercfg.x,
			left: layercfg.y,
			width: layercfg.width,
			height: layercfg.height,
			id: _input.oldlayers.length+_output.layers.length,
			position: 'absolute',
			//zIndex: 10000,
			border: layercfg.border
		};
		layercfg.canvas = canv;
		layercfg.engine = e;
		layercfg.canvasContainer = e._dom;
		var lyr= WE.create(Waterloo.Mouse, layercfg);
		_output.layers.push(lyr);
	}
});