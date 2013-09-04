//Defines image class and palette registrar.
//Palette registrar takes care of palette images in a way, that no one needs to
//Use any additional classes in endpoint app
WE.define("Waterloo.Graphics.Image", Waterloo.WaterlooClass,{
	tcode:'image',
	src:'',
	bufferImage: false,
	buffer: null,
	size: {
		width:0,
		height:0
	},
	//transformation: null,
	// {
		// x:0,
		// y:0,
		// width:0,
		// height:0
	// }
	//OR
	// {
		// cellWidth:0,
		// cellHeight:0,
		// cellx:0,
		// celly:0,
	// }
	origin: null,
	
	_loadImage: function(){			
		var me = this;
		var calie = function(x){
			if(me.origin!=null&&(me.origin.cellWidth>0||me.origin.cellHeight>0)){
				me.origin.width = me.origin.cellWidth==null?x.width:me.origin.cellWidth;
				me.origin.height = me.origin.cellHeight==null?x.height:me.origin.cellHeight;
				me.origin.x = me.origin.width*(me.origin.cellx|0);
				me.origin.y = me.origin.height*(me.origin.celly|0);
			}
			if(me.origin==null){
				me.origin = {
					x:0,
					y:0,
					width:x.width,
					height:x.height
				}
			}
		}		
		this.buffer = Waterloo.Graphics.PalletteRegistrator.getOrConnectPallette(this.src, calie);
		
	},
	getImage: function(){
		return this.buffer;
	},	
	init: function(){
		//this._super(arguments);
		this._loadImage();
	}
	
});

WE.define("Waterloo.Graphics.PalletteRegistrator", Waterloo.WaterlooClass,{
	pallettes:{},
	singleton: true,
	_objectsToLoad: 0,
	_totalObjects: 0,
	getOrConnectPallette: function(palletteName, onready){
		if(this.pallettes[palletteName]==null){
			var me = this;
			var npal = new Image();
			this._objectsToLoad++;
			this._totalObjects++;
			npal.ready = false;
			npal.onready=[];
			npal.onready.push(onready);
			npal.onload = function(){				
				this.ready = true;
				for(var x in this.onready){
					this.onready[x](this);
				}
				//canvas optimizations
				var canvas = document.createElement('canvas');
				canvas.id = 'cache-'+this.src;
				canvas.width = this.width;
				canvas.height = this.height;
				canvas.style.visibility = 'hidden';
				var ctext = canvas.getContext('2d');
				ctext.drawImage(this,0,0);
				this._canvas = canvas;
				me._objectsToLoad--;				
			};
			npal.src = palletteName;
			this.pallettes[palletteName] = npal;			
			return npal;		
		}
		if(this.pallettes[palletteName].ready){
			onready(this.pallettes[palletteName]);
			return this.pallettes[palletteName];
		}
		if(this.pallettes[palletteName].ready===false){
			
			this.pallettes[palletteName].onready.push(onready);
			return this.pallettes[palletteName];
		}
		
	},
	isReady: function(){
		return this._objectsToLoad==0;
	},
	//returns new name
	directSave: function(imageobject){
		this._totalObjects++;
		var name = '_inner'+this._totalObjects;
		this.pallettes[name] = imageobject;
		return name;
	}
});

WE.define("Waterloo.Graphics.ImageInstance", Waterloo.WaterlooClass,{	
	image: null,
	tcode: 'imageinstance',
	//direct location on canvas
	x:0,
	y:0,
	//direct size
	height:null,
	width:null,
	
	getImage: function(){
		return this.image.getImage();
	},
	
	getOrigin: function(){
		return this.image.origin;
	},
	
	init: function(){
		if(this.height==null)
			this.height = this.image.origin.height;
		if(this.width==null)
			this.width = this.image.origin.width;
	}
});

WE.define("Waterloo.Graphics.ImageActivator", Waterloo.Module,{
	tcode: 'imageactivator',
	
	doActivate: function(_, _input, _output){
		if(!(_input instanceof Waterloo.Graphics.Image)) return;
		
		_output.result = WE.xcreate({
			tcode:'imageinstance',
			image: _input
		});
	}
});

//add it to object activator
WE.xcreate({tcode:'objectactivator+imageactivator'});