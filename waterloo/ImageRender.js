WE.define('Waterloo.Graphics.ImageRender', Waterloo.Module,{
	tcode: 'imagerender',
	
	doRender: function(enigne, _input, _output){
		if(!(_input.item instanceof Waterloo.Graphics.ImageInstance)) return;
		var image = _input.item;
		var layer = _input.layer;
		var origin = image.getOrigin();
		//check if in bounding rect
		var drawtox = image.x;//-layer.shiftX;
		var drawtoy = image.y;//-layer.shiftY;
		//if(drawtox+image.width<0||drawtoy+image.height<0) return;
		//if(drawtox>layer.width||drawtoy>layer.height) return;
		_output.todo.push(
			function(ctx,engine,layer){
				var origin = image.getOrigin();
				 ctx.drawImage (image.getImage(), 
											 origin.x , origin.y , origin.width, origin.height,
											 drawtox, drawtoy, image.width, image.height);
			});
	}
});