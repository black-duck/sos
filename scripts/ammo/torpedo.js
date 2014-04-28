
factory['torpedo'] = Class.extend({ 

	_killed: false,

	physBody: null,
	
	speed: 700,
	lifetime: 20000,
	damageAmount: 5,
	speed: 80,

	size: {
		x: 32,
		y: 4
	},
	
	pos: {
		x: 0,
		y: 0
	},

	dir: {
		x: 0,
		y: 0
	},


	img: assets['torpedo'],

	init: function(sX, sY, eX, eY) {

		this.pos.x = sX;
		this.pos.y = sY;
		this.dir.x = eX;
		this.dir.y = eY;

		this.physBody = PhysicsEngine.addBody({
							
								id: 'torpedo',
	                             x: sX,
	                        	 y: sY,
								 damping: 0,
								 bullet: true,
								 density: 0,
								 friction: 0,
	                        	 userData: { id: 'torpedo',
	                            	         ent: this 
	                                     },
	                             halfWidth: this.size.y/2,
	                             halfHeight: this.size.x/2,
								
								groups: ['allies'],
								collidesWith: ['allies','enemies']
	                        });     
		
		var vec = new Vec2(this.speed, 0);
		vec.Normalize();
		vec.Multiply(this.speed);
		this.physBody.SetLinearVelocity(vec);

	
	},

	update: function() {
		 
		if (this.physBody != null) {
			var pPos = this.physBody.GetPosition();
			this.pos.x = pPos.x;
			this.pos.y = pPos.y;
		}
		if (this.lifetime <= 0) {
			this.kill();
		}
		else {
			this.lifetime -= 1000/60;
		}

	},

	kill: function () {
		this._killed= true;
	},

	draw: function(ctx) {
		//var rad = this.physBody.GetAngle();	
		Drawer.image( this.img, 
						this.pos.x, this.pos.y, 
						this.size.x, this.size.y );

	},

	onImpact: function(otherEnt) {
		otherEnt.damage(this.damageAmount);
		this.kill();
	},

	damage: function(amount) {
		this.life -= amount;
		if ( this.life < 0) {
			this._killed = true;
		}
	}

	
});
