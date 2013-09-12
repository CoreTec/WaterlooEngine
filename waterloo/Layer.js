//Handles layer system
//Layer contains set of objects, link to drawing canvas, and link to drawing engine
//Layer itself does nothing - it's engine which gives commands

WE.define('Waterloo.Graphics.Layer', Waterloo.WaterlooClass,{
	tcode: 'layer',
	objects:[],
	id: '',
	canvas: null,
	engine: null,
	defaultContext: null,
	canvasContainer: null,
	shiftX: 0,
	shiftY: 0,
	width: 0,
	hegith: 0,
	_rendertime: 0,
	_cachecanvas: null,
	_cachecontext: null,
	_validated: true,
	_needsRedraw: true,
	alwaysNeedsRedraw: false,
	neverRedraw:false,
	_firstframe:true,
	toString: function(){
		return 'layer';
	},
	init: function(config){
		//this._super(arguments);
		this.canvas.tcode = 'canvas';
		this.canvas = WE.xcreate(this.canvas);
		this.canvas.appendTo(this.canvasContainer);
		this.width = this.canvas.canvas.width;
		this.height = this.canvas.canvas.height;
		
		this._cachecanvas = WE.xcreate({
			tcode: 'canvas',
			id:'cache-'+this.canvas.id,
			width: this.width,
			height: this.height,
			position: 'absolute'
		});
		
		this._cachecanvas.appendTo(this.canvasContainer);
		this._cachecanvas.canvas.style.visibility = 'hidden';
	},
	
	setDefaultContext: function(name){
		this.defaultContext = this.canvas.createContext(name);
		this._cachecontext = this._cachecanvas.createContext(name);
	},
	
	prepareFrame: function(ctxname){
		var ctx = ctxname?this.canvas.createContext(ctxname):this.defaultContext;
		ctx.save();
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
		// Restore the transform
		ctx.restore();
	},
	
	executeOver: function(f, contextName){
		f(contextName?this._cachecanvas.createContext(contextName):this._cachecontext, this.engine, this);
		var ctxx = (contextName?this.canvas.createContext(contextName):this.defaultContext);
		//ctxx.translate(-this.shiftX, -this.shiftY);
		ctxx.drawImage(this._cachecanvas.canvas,0,0, this.width, this.height, -this.shiftX, -this.shiftY, this.width, this.height);
		//ctxx.translate(this.shiftX, this.shiftY);
	},
	executeAllOver: function(f, contextName){
		var ctx = contextName?this._cachecanvas.createContext(contextName):this._cachecontext;
		for(var x in f){
			f[x](ctx, this.engine, this);
		}
		var ctxx = (contextName?this.canvas.createContext(contextName):this.defaultContext);
		//ctxx.translate(-this.shiftX, -this.shiftY);
		ctxx.drawImage(this._cachecanvas.canvas,0,0, this.width, this.height, -this.shiftX, -this.shiftY, this.width, this.height);
		//ctxx.translate(this.shiftX, this.shiftY);
	},
	invalidate: function(){
		this._needsRedraw = true;
	},
	needsRedraw: function(){
		var res = (this.alwaysNeedsRedraw||this._needsRedraw)&&(!this.neverRedraw||this._firstframe);
		this._firstframe = false;
		return res;
	}
});

WE.define('Waterloo.Graphics.Canvas', Waterloo.WaterlooClass,{
	tcode: 'canvas',
	id:0,
	top:0,
	left:0,
	width: 100,
	height: 100,
	zIndex: 0,
	position: null,
	border: null,
	canvas: null,
		
	init: function(config){
		this._super(arguments);
		var canvas = document.createElement('canvas');
		canvas.id = 'layer-'+this.id;
		canvas.top = this.top;
		canvas.left = this.left;
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.style.zIndex = this.zIndex;
		canvas.style.position = this.position;
		canvas.style.border = this.border;
		this.canvas = canvas;
	},
	
	createContext: function(name){
		return this.canvas.getContext(name);
	},
	
	appendTo: function(control){
		if(control!=null)
			control.appendChild(this.canvas);
	}
});