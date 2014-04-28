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
	
	//1 bullet per sec 
	_fireRate: (1000/1),
	_fireTrigger: false,
	_fireCool: 2,

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
						halfHeight: this.height/2,
						groups: ['allies'],
						collidesWith: ['allies', 'enemies']
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
		
		var vec = new Vec2(this.speed.x, -this.pos.y/500 + this.ballast/5)
		
		if (this.speed.x > 0) this.speed.x /= 2
		if (this.speed.x < 0) this.speed.x /= 2

		this.physBody.SetLinearVelocity(vec)
	
		//update possition from physicEngine
		var pPos = this.physBody.GetPosition();
		this.pos.x = pPos.x
		this.pos.y = pPos.y


		
		
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
 	
	    Drawer.rawImage( this.img,this.pos.x ,this.pos.y , this.width, this.height);
		
	},	

	damage: function (amount) {
		this.life -= amount
		if (this.life < 0) {
			this.__killed = true
		}
		
	},
	
	moveLeft:function () {
			this.speed.x = -this.maxSpeed;
	},
	
	moveRight:function () {
			this.speed.x = this.maxSpeed;
	},
	
	
});
