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

	move: false,

	checkpoints: [],
	
	pointCounter: 0,

	newPos: {
		x: 0,
		y: 0
	},

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
		
		if ( this.move == true ) {
			//this.speed.x = 1;
		
			if ( this.pos.x < this.newPos.x){
				this.speed.x = 1;
			}
			else if ( this.pos.x > this.newPos.x) {
				this.speed.x = -1;
			} 
			
			if ( this.pos.y < this.newPos.y) {
				this.speed.y = 1;
			}
			else if ( this.pos.y > this.newPos.y) {
				this.speed.y = -1;
			}



		}
		
	
			

		if ( this.pos.x == this.newPos.x &&  this.pos.y ==  this.newPos.y) {
			this.speed.x = 0;
			this.speed.y = 0;
			this.move = false;
		}
		
		if (this.checkpoints.length > 0 && this.move == false ) {
			var newLocation = this.checkpoints[this.pointCounter];
 			this.moveTo(newLocation.x, newLocation.y)
			this.pointCounter += 1;
	
		}
		
	
		if ( this.pointCounter >= this.checkpoints.length ) {
			this.pointCounter = 0;
		}
		

		
	

	},
	

	

		

	draw: function (ctx) {
      	
		Drawer.rect(this.pos.x,this.pos.y,this.width,this.height); 
	},




	moveTo: function (x,y) {
		this.newPos.x = x;
		this.newPos.y = y;
		if ( this.pos.x != this.newPos.x && this.pos.y != this.newPos.y ) {
			this.move = true; 
		}
	},	    


	addCheckpoint: function (x,y) {
		this.checkpoints.push({x:x,y:y})
	}

})
