Seabed = {


	clock: 0 ,

	pos : {
		x:0,
		y:0
	},


	width: 100,
	height: 8,

	depths: [],

	color: "black",

	init: function () {
		
		
		
	},

	update: function () {
	
		

	},

	draw: function () {
		
		i = 0;
		for ( d in this.depths ) {

			Drawer.rect(this.x + this.width-i, this.y-d, 1, d)
			i++
		}
		

	}

};
