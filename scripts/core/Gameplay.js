Gameplay = {

	speed: 1,

	clock: 0,
	
	over: false,

	init: function () {
	
		Wave.init()
		Seabed.init()
		Player0.submarine = GameEngine.spawn('submarine');

	},


	update: function () {
	
		if ( this.clock <= 0 ) {

			for ( var i =0 ; i < 20 * Math.random(); i++ ) {	
				GameEngine.spawn('obstacle', 700 + i * 50 + 2 * Math.random(), 100 + 200 * Math.random() )
			}
			this.clock = 300
		}
		this.clock -= 1
		
	},

	draw: function () {
		
		if (this.over == true) {
			GameEngine.ctx.fillStyle="red";
			GameEngine.ctx.lineStyle="red";
			GameEngine.ctx.font="34px sans-serif"
			GameEngine.ctx.fillText("GAME OVER", 400,400);
		}

	},

	//game over message
	gameOver: function () { 

	  
	},
};
