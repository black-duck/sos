Seabed = {


	clock: 0 ,

	pos : {
		x:0,
		y:500
	},


	width: 100,
	height: 8,

	depths: [],

	color: "black",

	init: function () {
	
		SoundGen.fft = function (array) {

			var sum = 0;
			for (var i=10; i < 300; i++) {
				sum += array[i]
			}

			
			Seabed.depths.unshift(sum/50);
			if (Seabed.depths.length > 300) {
				Seabed.depths.pop()
			}

		}
		
	},

	update: function () {
	
		

	},


	draw: function () {
		
		var i = 0;
		for ( d in this.depths ) {

			Drawer.rect(this.pos.x + i*10, this.pos.y - this.depths[d]/2,  
					 	 10, this.depths[d], 
						 this.color, this.color)
			i++
		}
		

	}

};
