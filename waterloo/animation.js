WE.define('Waterloo.Graphics.Animation', Waterloo.WaterlooClass,{
	tcode: 'animation',
	loop: true,
	_fulllength: 0,
	_frametimers: [],
	defaults: MERGE({tcode:'image', delay: 10}),
	frames: [],
	init: function(config){
		this.xprop('frames', this.defaults);
		
		for(var x in this.frames){	
			this._frametimers.push(this._fulllength);
			this._fulllength+=this.frames[x].delay;
			this.frames[x]._timeofframe = this._fulllength;
		}
	},
	getFrame: function(msFromStart){
		//start with check for noloop frames
		if((!this.loop)&&msFromStart>this._fulllength)
			return this.frames[this.frames.length-1];
		var frm = msFromStart%this._fulllength;
		var ret = null;
		for(var x in this._frametimers){
			if(this._frametimers[x]>frm)
				return ret
			ret = this.frames[x];	
		}
		return ret;
	}
});

WE.define('Waterloo.Graphics.AnimationInstance', Waterloo.WaterlooClass,{
	tcode: 'animationinstance',
	animation: null,
	//direct location on canvas
	x:0,
	y:0,
	starttime: null,
	_curframe: null,
	_nextframetime: 0,
	// //direct size
	// //make a ratio later
	// height:null,
	// width:null,
	getFrame: function(currenttime){
		if(this.starttime==null) this.starttime = currenttime-0;
		var mg = null;
		var dt = currenttime - this.starttime;
		if(this._nextframetime>currenttime)
			mg = this._curframe;
		else{
			mg = this.animation.getFrame(dt);
			this._curframe = mg;
			this._nextframetime = (currenttime-0)+mg._timeofframe;
		}
		var result = Waterloo.Graphics.ObjectActivator.createInstance(mg);
		result.x = this.x-(mg.frameShX==null?0:mg.frameShX);
		result.y = this.y-(mg.frameShY==null?0:mg.frameShY);
		result.width = mg.origin.width;
		result.height = mg.origin.height;
		return result;
	}
});

WE.define("Waterloo.Graphics.AnimationActivator", Waterloo.Module,{
	tcode: 'animationactivator',
	
	doActivate: function(_, _input, _output){
		if(!(_input instanceof Waterloo.Graphics.Animation)) return;
		
		_output.result = WE.xcreate({
			tcode:'animationinstance',
			animation: _input
		});
	}
});

//add it to object activator
WE.xcreate({tcode:'objectactivator+animationactivator'});

// factories for animation

// {
	// tcode:'animation.imagelist',
	// defaults:{
		// delay: 100 //in milliseconds
	// },
	// images:[
		// 'dudemove1.gif',
		// 'dudemove2.gif',
		// 'dudemove3.gif',
		// 'dudemove4.gif',
		// 'dudemove5.gif',
		// 'dudemove6.gif',
		// 'dudemove7.gif',
	// ]
// }

// {
	// tcode:'animation.imagetile',
	// defaults:{
		// delay: 100 //in milliseconds
	// },
	// image: 'dudemove.gif'
	// tile: {width:50, height: 70},
	// frames:[
		// //write as object
		// {
			// tileNo:0
		// },
		// //write directly tile number
		// 1,
		// //write as object with additional
		// {
			// bindingX:5,
			// bindingY:5, //by default both are 0
			// tileNo:2,
			// delay:200 //delay before NEXT frame
		// },
		// //write as tile cutoff
		// {
			// tileX: 100,
			// tileY: 100,
			// tileWidth: 80,
			// tileHeight: 70
		// }
	// ]
// }

// {
	// tcode:'animation',
	// defaults:{
		// delay: 100, //in milliseconds
		// image: 'dudemove.gif', //default image - if we don't specify one in file - use this
		// tile: {width:50, height: 70} //default tiling options
	// },
	// frames:[
		// //use default file and tiling
		// {
			// tileNo:0
		// },
		// //use another file but same tiling
		// {
			// image: 'dudeepicmove.gif',
			// tileNo:0
		// },
		// //cut something from another file
		// {
			// image: 'dudeepicstand.gif',
			// tileX: 100,
			// tileY: 100,
			// tileWidth: 80,
			// tileHeight: 70
		// }
	// ]
// }