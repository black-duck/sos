Gameplay = {

	speed: 1,

	clock:0,

	init: function () {
	
		Wave.init()
		Seabed.init()
			
		if (Player0.playing) {
        	Player0.submarine = GameEngine.spawn('submarine');
        }




	},

	setSpeed: function (speed) {
	
	},

	update: function () {
	
		if ( this.clock <= 0 ) {

			for ( var i =0 ; i < 20 * Math.random(); i++ ) {	
				GameEngine.spawn('obstacle', 700 + i * 50 + 2 * Math.random(), 100 + 200 * Math.random() )
			}
			this.clock = 300
		}
		this.clock -= 1
		
	}


};
