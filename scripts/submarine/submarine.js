factory['submarine'] = Class.extend({ 

	_killed: false,
	crashed: false,	
	physBody: null,
	
	surface: null,  

	zIndex: 3,	

	width: 90,
	height: 30,
	
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
	
	//6 bullets per sec To Be changed
	_fireRate: (1000/6),
	_fireTrigger: false,
	_fireCool: 10,

	energy: 120,
	maxEnergy: 150,
	regen: 0.8,
	


	imgSrc: assets['submarine'],
	

	life: 100,
	maxLife: 100,


	ballast: 10,

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
						
						id: 'submarine',
						x: x,
						y: y,
						userData: { id: 'submarine',
									ent: this },
						halfWidth: this.width/2,
						halfHeight: this.height/2
		});
		
			
	},

    update: function() {
		
		var areaWidth = Player0.area.w;
		var areaHeight = Player0.area.h;
		var localHeight = this.height/2;
		
		if (this._fireTrigger && this._fireCool <= 0 ) {
			this.__fire();
		}
		this._fireCool -= 1000/60
		if (this._fireCool < 0 ) {
			this._fireCool = 0;
		}

		this.physBody.SetAngle(0)
		
		var vec = new Vec2(0,-this.pos.y/500 + this.ballast/5)


		this.physBody.SetLinearVelocity(vec)

	
		//update possition from physicEngine
		var pPos = this.physBody.GetPosition();
		this.pos.x = pPos.x
		this.pos.y = pPos.y


	//	if (this.pos.y < 0 +localHeight) {
	//		this.pos.y = 0 +localHeight;
	//	}
		
	//	if (this.pos.y > areaHeight - localHeight) {
	//		this.pos.y = areaHeight - localHeight;
	//	}
		
	//	if (this.pos.x < 0 +this.width/2) {
	//		this.pos.x = 0 +this.width/2;
	//	}
		
	//	if (this.pos.x > areaWidth -this.width/2) {
	//		this.pos.x = areaWidth -this.width/2;
	//	}
		
		
	},
	
	moveUp: function () {
	
		this.ballast -= 2*this.speed.y
		if ( this.ballast < -this.maxSpeed) {
			this.ballast = -this.maxSpeed
		}
	},

	moveDown: function () {
		this.ballast += this.speed.y
		if ( this.ballast > this.maxSpeed) {
			this.ballast = this.maxSpeed
		}	

	},

	startFire: function() {
		this._fireTrigger = true;
	},
	stopFire: function() {
		this._fireTrigger = false;
	},
	//DRAFT-part RT
	__fire: function() {
		GameEngine.spawn('torpedo',
					this.pos.x + (5 + this.width/2) ,
					this.pos.y + (5 + this.height/2)
					
				);

		//SoundManager.playSound('sounds/LaserBeam0');
		this._fireCool = this._fireRate;
	

	},

	draw: function (ctx) {
 	
    //this.pos.xthis.pos.y
	    Drawer.rawImage( this.img,this.pos.x ,this.pos.y , this.width, this.height);
		
	},	

	
	//collision: function (other) {

	//	if (this.color == null ) { //DRAFT TODO
	//		this._changeColor(other.color);
	//	}
	//	else {
	//		if (!GenPath._canTransition(this.color, other.color)) {
	//			this.life -= 2;
	//			if (this.life < 0 ) {
	//				this.life = 0;
	//				this.crashed = true;
	//			}
	//		}
	//
	//	}

	//},
	
	moveLeft:function () {
			this.speed.x = -this.maxSpeed;
	},
	
	moveRight:function () {
			this.speed.x = this.maxSpeed;
	},
	
	
});
