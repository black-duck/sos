factory['base'] = Class.extend({ 

	_killed: false,
	crashed: false,	
	physBody: null,
	
	surface: null,  

	zIndex: 3,	

	width: 90,
	height: 130,
	
	pos: {
		x: 150,
		y: 250
	},

	dir: {
		x: 0,
		y: 0
	},

	speed: { 
		x:0,
		y:3
	},
	
	maxSpeed: 200,
	
	img: null,


	imgSrc: "img/base.png",
	

	go: {
		'up':   0,
		'down': 0,
		'front':0	
	},

	init: function(x, y) {
	
		x = this.pos.x;
		y = this.pos.y;
		this.img = Loader.load( this.imgSrc);
		this.physBody = PhysicsEngine.addBody({
						
						id: 'base',
						x: x,
						y: y,
						userData: { id: 'base',
									ent: this },
						halfWidth: this.width/2,
						halfHeight: this.height/2,
						type: "static",
						groups: ['allies'],
						collidesWith: ['enemies']
		});
		
			
	},

    update: function() {
		
		
	},
	

	draw: function (ctx) {
 	
	    Drawer.rawImage( this.img,this.pos.x ,this.pos.y , this.width, this.height);
		
	},	

	damage: function (amount) {
		
	},
	
	
});
