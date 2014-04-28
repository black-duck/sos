factory['obstacle'] = Class.extend({

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
        imgSrc: assets['obstacle'],

        life: 100,
        maxLife: 100,

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
						
					id: 'obstacle',
					x: x,
					y: y,
					userData: { id: 'obstacle',
								ent: this },
					halfWidth: this.width/2,
					halfHeight: this.height/2,

					groups: ['enemies'],
					collidesWith: ['allies']
					
			});
			var vec = new Vec2(0,-1)
	        
			this.img = Loader.load( this.imgSrc);
			this.physBody.SetLinearVelocity(vec)

        },


        update: function() {
	
				var pPos = this.physBody.GetPosition();
				this.pos.x = pPos.x
				this.pos.y = pPos.y

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



                //checks if the item reached the wanted place,then stops it

                if (  Math.abs(this.pos.x - this.newPos.x)< 2 && Math.abs(this.pos.y - this.newPos.y) < 2 ){
                       
                        this.move = false;
                }

		if (  Math.abs(this.pos.x - this.newPos.x)< 2 ) {
			this.speed.x = 0;
		}
		
		 if (  Math.abs(this.pos.y - this.newPos.y)< 2 ) {
			this.speed.y = 0;
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
        
        kill: function () {
		this._killed= true;
		},

 		draw: function (ctx) {

                	Drawer.rawImage( this.img , this.pos.x , this.pos.y , this.width , this.height );
		},



       	//seting the new position

       	 moveTo: function (x,y) {
          		 this.newPos.x = x;
           		 this.newPos.y = y;
               	
				 if ( this.pos.x != this.newPos.x || this.pos.y != this.newPos.y ) {
                       		 this.move = true;
                }
        },

       	 //adding items to checkpoints list

      	addCheckpoint: function (x,y) {
        		 this.checkpoints.push({x:x,y:y})
       	},

		onImpact: function(otherEnt) {
			otherEnt.damage(this.damageAmount);
			this.kill();
		},

		damage: function(amount) {
			this.life -= amount
			if ( this.life < 0 ) {
				this._killed = true;
			}
		}

})



