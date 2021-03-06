Gameplay = {

	speed: 1,

	clock: 0,
	time: 0,
	base: null,
	
	over: false,
	win: false,
	init: function () {
	
		Wave.init()
		Seabed.init()
		Player0.submarine = GameEngine.spawn('submarine');

	},


	update: function () {
	
		if( this.time >= 200  ) {
			if (this.base == null ) {
				this.base = GameEngine.spawn("base", Player0.submarine.pos.x, Player0.submarine.pos.y);
				//stop the submarine
				Player0.submarine.speed.x = 0
				Player0.submarine.maxSpeed = 0
				this.clock = 300;
			}
			if (this.clock < 0) {
				this.win = true;
			}

		}
		else if ( this.clock <= 0 ) {

			for ( var i =0 ; i < 20 * Math.random(); i++ ) {	
				GameEngine.spawn('obstacle', 800 + i * 50 + 2 * Math.random(), 100 + i+ 400 * Math.random() )
			}
			for ( var i =0 ; i < 5 * Math.random(); i++ ) {	
				GameEngine.spawn('bubble', Player0.submarine.pos.x + 100 + i * 50 + 2 * Math.random(), 500 + 100 * Math.random() )
			}
			GameEngine.spawn('bubble', 100 + 800 * Math.random(), 500 + 50 * Math.random() )
	
			this.clock = 300
			this.time ++
			//TODO give points every time
		}
		this.clock -= 1

	
	},

	draw: function () {
		
		if (this.over == true) {
			GameEngine.ctx.fillStyle="red";
			GameEngine.ctx.lineStyle="red";
			GameEngine.ctx.font="34px sans-serif"
			GameEngine.ctx.fillText("Argh! The last hope of humanity is now gone. Nice one Captain!", 250,400);
		}
		 if (this.win == true) {
			
			GameEngine.ctx.fillStyle="red";
			GameEngine.ctx.lineStyle="red";
			GameEngine.ctx.font="34px sans-serif"
			GameEngine.ctx.fillText("Aye! You saved your ship and crew! Good Job!", 250,400);
			}

	},

	//game over message
	gameOver: function () { 

	  
	}
};
