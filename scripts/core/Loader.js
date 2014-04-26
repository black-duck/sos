Loader = {

	FILE_EXT: {
		sound: /(.mp3|.ogg)$/,
		image: /(.jpg|.jpeg|.png)$/,
		json: /(.json)$/
	},
	
	images: {},
	sounds: {},
	objects: {},
	
	_loadJson: function(src, fn) {
		var objectCache = Loader.objects;
		
		if (objectCache[src]) {
			if (fn) fn(objectCache[src]);
			return objectCache[src];
		}

		xhr = new XMLHttpRequest();
		xhr.open("GET", src, true);
		xhr.onload = function() {
			var obj = JSON.parse(this.responseText); 
			objectCache[src] = obj;
			if (fn) fn(obj);
			
		};
		xhr.send();
		return ;
	},

	_loadImg: function(src) { 
		var imageCache = Loader.images;
		
		if (imageCache[src]) {
			return  imageCache[src];
		}

		var img = new Image();

		img.onload = function() { 			
			imageCache[src] = img;
		};
	
		img.src = src;
		return img;

	},

	_loadSound: function(src) {
		var soundCache = Loader.sounds;
		
		if (soundCache[src]) {
			return soundCache[src];
		}
		
		var audio = new Audio();
		
		audio.onload = function() {
			soundCache[src] = audio;
		};
		audio.preload = 'auto';
		audio.src = src;
		return audio;

	},

	isLoaded: function(src) {
		
		var ext = this.FILE_EXT;

		if (ext.image.test(src)) {
			if (this.images[src]) {
				return true;	
			}
			return false;
		}
		else if (ext.sound.test(src)) {
			if (this.sounds[src]) {
				return true;	
			}
			return false;
		}
		else if (ext.json.test(src)) {
			if (this.objects[src]) {
				return true;	
			}
			return false;
		}

	},
	//Tell Loader that you will need a resource later
	//
	//parameters:
	//src	- uri location of resource
	preload: function(src) {
		var ext = this.FILE_EXT;
		
		if (ext.image.test(src)) {
			this._loadImg(src);
		}
		else if (ext.sound.test()){
			this._loadSound(src);
		}
		else if (ext.json.test(src)) {
			return this._loadJson(src);
		}
	},

	//Loads specified resource
	//
	//It automatically determines how to load the 
	//specified resource based on its extension
	//
	//overloaded method:
	//load(src);
	//load(src, callback);
	//
	//parameters:
	//src 		- uri location of resource
	//callback	- callback function to run when resources is loaded
	//
	//note: callback function is not needed for images and audio
	load: function(src, fn) {
		
		var ext = this.FILE_EXT;
		
		if (ext.image.test(src)) {
			return this._loadImg(src, fn);
		}
		else if (ext.sound.test(src)) {
			return this._loadSound(src);
		}
		else if (ext.json.test(src)) {
			return this._loadJson(src,fn);
		}

	}
}
