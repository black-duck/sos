Seabed = {


	clock: 0 ,

	pos : {
		x:0,
		y:500
	},


	width: 1000,
	height: 8,

	step: 5,
	speed: 1,
	wait: 0,

	depths: [],

	color: "grey",
	bgcolor: "black",

	__ddelay: 0,

	init: function () {
	
		
	},

	update: function () {
	
		if ( this.wait > this.step ) {
			var array = new Uint8Array(1024)
			SoundGen.analyser.getByteFrequencyData(array)

			var sum = 0, i;
			for (i=0; i < 300 && i < array.length; i++) {
				sum += array[i]
			}

			Seabed.depths.unshift(sum/i);
			this.__ddelay = (this.__ddelay + 1) % 2

			this.wait = 0
		}
		else {
			this.wait += this.speed
		}
	},


	draw: function () {
		
		for ( var i = 0, x = this.pos.x + this.width + 2;
				i < this.depths.length && x > this.pos.x; 
				i++, x -= this.step ) {

			d = this.depths[i]
				
			Drawer.rect(x, this.pos.y - d/2,  
					 	 this.step, d, 
						 this.bgcolor, this.bgcolor )
		}	

	
	
		for ( var i = 0, x = this.pos.x + this.width;
				i < this.depths.length && x > this.pos.x; 
				i++, x -= this.step ) {

			d = 2*this.depths[i]/3 
				
			Drawer.rect(x, this.pos.y - d/2,  
					 	 this.step, d, 
						 this.color, this.color)
		}

	}

};
