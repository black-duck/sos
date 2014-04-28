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
	
		
	}


};
