//Mouse Layer and engine extension (tbd later)

WE.define('Waterloo.Mouse', Waterloo.Graphics.Layer,{
	cursors: {},
	current: '',
	mouseX: 0,
	mouseY: 0,
	lastDownX: 0,
	lastDownY: 0,
	inside: false,
	pressed: false,
	alwaysNeedsRedraw: true,
	cursorobj: {},
	canvas:{},
	toString: function(){
		return 'MouseLayer';
	},
	
	init: function(config){
		//this._super(config);
		this.events(['Draw', 'MouseMove', 'MouseClick', 'MouseDown', 'MouseUp', 'MouseEnter', 'MouseLeave']);
		this.setDefaultContext('2d');
		var me = this;
		var realcanvas = this.canvas.canvas;
		realcanvas.addEventListener('mousemove',function(ev){
			me._mouseMove(realcanvas, ev);
		});
		realcanvas.addEventListener('click',function(ev){
			me._mouseClick(realcanvas, ev);
		});
		realcanvas.addEventListener('mousedown',function(ev){
			me._mouseDown(realcanvas, ev);
		});
		realcanvas.addEventListener('mouseup',function(ev){
			me._mouseUp(realcanvas, ev);
		});
		realcanvas.addEventListener('mouseleave',function(ev){
			me._mouseLeave(realcanvas, ev);
		});
		realcanvas.addEventListener('mouseenter',function(ev){
			me._mouseEnter(realcanvas, ev);
		});	
	},

	setCursor: function(name){
		this.current = name;
		this.objects = [];
		this.cursorobj = WE.clone(this.cursors[name],true);
		this.objects.push(this.cursorobj);
		this.canvas.canvas.style.cursor = name==null?null:'none';	
	},
	
	// draw: function(){
		// if(current=='') return;
		// this.onDraw();
	// },	
	
	_mouseMove: function(canv, ev){
		var offset = canv.getBoundingClientRect();
		this.mouseX = ev.pageX - offset.left;
		this.mouseY = ev.pageY - offset.top;
		this.cursorobj.x = this.mouseX-this.cursorobj.xPointerOffset|0;
		this.cursorobj.y = this.mouseY-this.cursorobj.yPointerOffset|0;
		this.onMouseMove(canv, ev);
	},	
	
	_mouseClick: function(canv,ev){
		this.onMouseClick(canv,ev);
	},
	
	_mouseDown: function(canv,ev){
		var offset = canv.getBoundingClientRect();
		ev.preventDefault();
		this.pressed = true;
		this.lastDownX = ev.pageX - offset.left;
		this.lastDownY = ev.pageY - offset.top;
		this.onMouseDown(canv,ev);
	},
	
	_mouseUp: function(canv,ev){
		this.pressed = false;
		this.onMouseUp(canv,ev);
	},
	
	_mouseEnter: function(canv,ev){
		this.inside = true;
		this.onMouseEnter(canv,ev);
	},
	
	_mouseLeave: function(canv,ev){
		this.inside=false;
		this.pressed = false;
		this.onMouseLeave(canv,ev);
	}
});