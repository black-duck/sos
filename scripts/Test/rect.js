factory['Rect'] = Class.extend({ 

	_killed: false,
	crashed: false,	

	surface: null,
    color: null,   

	zIndex: 3,	

	width: 20,
	height: 20,

	pos: {
		x: 150,
		y: 250
	},

	speed: { 
		x:0,
		y:0
	},

	ang: 0,

    	nextSurface: false,

	maxSpeed: 2,

	img: null,
	imgSrc: assets['Prisma'],

	life: 100,
	maxLife: 100,

	go: {
		'up':   0,
		'down': 0,
		'front':0	
	},

	init: function(x, y) {

		x = this.pos.x;
		y = this.pos.y;
		this.img = Loader.load( this.imgSrc);

	},

	
	update: function() {

                this.pos.x += this.speed.x;
                this.pos.y += this.speed.y;
	},
	

	

		

	draw: function (ctx) {
      	
		Drawer.rect(this.pos.x,this.pos.y,this.width,this.height); 
	}
	    
})
