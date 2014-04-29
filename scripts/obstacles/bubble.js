factory['bubble'] = Class.extend({

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


		damageAmount: 20,


        maxSpeed: 2,

        img: null,
        imgSrc: 'img/bubble.png',

        life: 100,
        maxLife: 100,
		lifetime: 800,

        move: false,

        //the list of checkpoints for the obstacles

        checkpoints: [],

        //counter for how many item the above list has

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

			this.physBody = PhysicsEngine.addBody({
						
					id: 'bubble',
					x: x,
					y: y,
					userData: { id: 'bubble',
								ent: this },
					halfWidth: this.width/2,
					halfHeight: this.height/2,

					groups: ['enemies'],
					collidesWith: ['allies', 'enemies']
					
			});
	        
			this.img = Loader.load(this.imgSrc);


        },


        update: function() {
	
				var pPos = this.physBody.GetPosition();
				this.pos.x = pPos.x
				this.pos.y = pPos.y
				
				var vec = new Vec2(0,-30)
				this.physBody.SetLinearVelocity(vec)

				if (this.pos.y <= Wave.pos.y - Wave.width/2  - 3) {
					this.kill();
				}

				if (this.lifetime <= 0 ) {
					this.kill();
				}
				this.lifetime--;

        },
        
        kill: function () {
			this._killed = true;
		},

 		draw: function (ctx) {

            	Drawer.rawImage( this.img , this.pos.x , this.pos.y , this.width , this.height );
		},


		onImpact: function(otherEnt) {
			otherEnt.physBody.ApplyImpulse( this.physBody.GetLinearVelocity(),													otherEnt.physBody.GetWorldCenter())

		},

		damage: function(amount) {
		}

})



