Wave = {


	clock: 0 ,

	pos : {
		x:0,
		y:80
	},


	width: 800,
	height: 8,

	step: 20,
	speed: 1,
	wait: 0,
	time: 1,


	wavesWidth: [],

	color: "blue",

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
			this.time += 1

			this.wait = 0
		}
		else {
			this.wait += this.speed
		}
	},


	draw: function () {
		
		for ( var i = 0, x = this.pos.x + this.width;
				x > this.pos.x; 
				i++, x -= this.step ) {
				
			Drawer.rect(x, this.pos.y + 5*Math.abs(Math.cos(i/10+this.time)),  
					 	this.step , 8, 
						this.color, this.color)
		}

	}

};
