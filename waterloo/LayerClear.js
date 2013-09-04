WE.define('Waterloo.Graphics.LayerClearer', Waterloo.Module,{
	tcode: 'layerclearer',
	
	doDrawStart: function(e, _input, _output){		
		if(!_input.needsRedraw())
			_output.blockDrawing = true;
		var nr = _input.needsRedraw();
		_output.todo.push(
			function(ctx,engine,layer){
				if(nr){
					ctx.save();
					// Use the identity matrix while clearing the canvas
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					ctx.clearRect(0, 0, layer.canvas.canvas.width, layer.canvas.canvas.height);
					// Restore the transform
					ctx.restore();
				}
			});
	}
});