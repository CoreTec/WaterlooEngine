WE.define('Waterloo.Graphics.ImageRender', Waterloo.Module,{
	tcode: 'imagerender',
	
	_objectsByLayers: {},
	
	doRender: function(e, _input, _output){
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
	},
	
	doAddObjectsToLayer: function(e, _input, _output){
		var lr = _input.layer;
		var objs = _input.objects;
		var obl = this._objectsByLayers;
		
		if(obl[lr.id]==null) obl[lr.id] = [];
		
		for(var x in objs){
			if(!(objs[x] instanceof Waterloo.Graphics.ImageInstance)) continue;
			obl[lr.id].push(objs[x]);
		}		
	},
	
	doRenderLayer: function(e, _input, _output){
		var lr = _input.layer;
		var objs = this._objectsByLayers[lr.id];
		var mgs = [];
		for(var x in objs){
			var image = objs[x];
			var origin = image.getOrigin();
			//check if in bounding rect
			var drawtox = image.x;//-layer.shiftX;
			var drawtoy = image.y;//-layer.shiftY;
			mgs.push({image:image, origin:origin, drawtox:drawtox, drawtoy:drawtoy});
		}
		
		_output.todo.push(
			function(ctx,engine,layer){
				for(var x in msg){
					var xx = msg[x];
					ctx.drawImage (xx.image.getImage(), 
											 xx.origin.x , xx.origin.y , xx.origin.width, xx.origin.height,
											 xx.drawtox, xx.drawtoy, xx.image.width, xx.image.height);
				}
			});
	}
});