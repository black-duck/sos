factory['Explosion'] = Class.extend({

	_killed: false,

	size: {
		x:8,
		y:8
	},

	pos: {
		x:0,
		y:0
	},

	duration: 250, //in ms

    extend_possibility_percent: 50, // 50% to play the 'explosion' animation once more.

	frames: [],
	_animIter: 0,
	imgSrc: 'img/Explosion1.png',

	init: function(x, y, settings) {

		this.pos.x = x;
		this.pos.y = y;
		if (settings) {
			if (settings.width) this.size.x = settings.width;
			if (settings.height) this.size.y = settings.height;
		}
		//this one using atlases
		//this.frames = Drawer.getFrames(this.imgSrc);
		//this.frames.sort();
	},

	update: function() {
		this.duration -= 1000/60;
		if (this.duration <= 0) {
            perc = Math.floor(Math.random() * 101);
            if (perc > this.extend_possibility_percent) {
			    this.kill();
            }
		}
	},

	draw: function() {

		//var frame = this.frames[this._animIter];
		
		Drawer.image(this.imgSrc, this.pos.x, this.pos.y, 
							this.size.x, this.size.y);
		//this._animIter = (this._animIter + 1) % this.frames.length;
	},

	kill: function() {
		this._killed= true;
	}

});


