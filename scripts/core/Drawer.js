//Drawer
//You must use it whenever you want to draw in canvas.
//
//Dependencies: canvas, Loader.
//
//API methods:
//
//init(canvas);
//useAtlas(Atlas json file without extension);
//getFrames(Regular Expresion);
//setScale(x Scale, y Scale);
//image(Image src);
//
//Features:

Drawer = {

	canvas: null ,
	ctx: null,

	_imgToAtlas: {},
	_atlas: {},
	
	xScale: 1,
	yScale: 1,
	xScaleHalf: 0.5,
	yScaleHalf: 0.5,
	
	portPos:{x:0,y:0},
	portSize:{w:0,h:0},

	init: function (canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.portSize.w = this.canvas.width/ this.xScale;
		this.portSize.h = this.canvas.height/ this.yScale;
	},	
	
	//Load Atlas images in order to draw them later
	//parameters: 
	//atlasSrc - Atlas json uri *without* .json extension
	//
	//note: It does not support trim and rotation yet.
	//
	//example:
	//to load images/atlas1.json
	//Drawer.useAtlas('images/atlas1');
	useAtlas: function (atlasSrc) {
		var atlas = this._atlas;
		var imgToAtlas = this._imgToAtlas;
		
		//NOT trimmed, NOT rotated atlases
		Loader.load(atlasSrc + ".json", function (json) {
			
			Loader.preload(json.meta.image);
			atlas[atlasSrc] = json;
		
			var frames = json.frames;
			for (var i=0; i < frames.length; i++) {
				Drawer._imgToAtlas[frames[i].filename] = { img: json.meta.image,
													 frame: frames[i].frame };
			}	
		});	

	},

	//Search on Atlases images and return an array of images names
	//that much the given regular expresion
	//
	//Usefull for animation frames
	//
	//parameters:
	//frameName - String that contains a regular expresion
	getFrames: function (frameName) {
		var name = new RegExp(frameName);
		var frames = [];
		for (var key in this._imgToAtlas) {
			if (name.test(key)) {
				frames.push(key);
			}
		}

		return frames;
	},
	
	//Change the scale ratio between gameEngine metrics and pixels
	//
	//Usefull for cross-screen scaling
	//
	//
	//parameters:
	//x - x scale ratio
	//y - y scale ratio
	//
	//note: It is recommended to use the same number for x and y scale.
	//note: Use the invert scale in InputEngine.
	//
	//example:
	//if you have a 800x600 map, a 1920x1080 screen and you want to keep aspect ratio:
	//Drawer.setScale(1080/600, 1080/600);
	//if you don't want to keep the aspect ratio:
	//Drawer.setScale(1920/800, 1080,600);
	//
	//Don't forget to scale InputEngine
	setScale: function (x, y) {
	
		//TODO DRAFT
		x = Math.ceil(x);
		y = Math.ceil(y);
		this.xScale = x;
		this.yScale = y;
		this.xScaleHalf = x/2;
		this.yScaleHalf = x/2;
		
		
	},
	
	setPort: function(x,y){ 
		this.portPos.x = x;
		this.portPos.y = y;
		
	
	},
	//Draw a rectangle shape
	//
	//rect is an overloaded method
	//
	//Drawer.rect(x, y, width, height);
	//Drawer.rect(x, y, width, height, color);
	//Drawer.rect(x, y, width, height, color, fillColor);
	//Drawer.rect(x, y, angle, width, height, color, fillColor);
	rect: function () {
		
		if (arguments.length == 4) {
			this.__rect4(arguments[0], arguments[1], arguments[2], arguments[3]);

		}
		else if (arguments.length == 5) {
			this.__rect5(arguments[0], arguments[1], arguments[2], 
					arguments[3], arguments[4]);
		}
		else if (arguments.length == 6) {
			this.__rect6(arguments[0], arguments[1], arguments[2], 
					arguments[3], arguments[4], arguments[5]);
		}
		else if (arguments.length == 7) {


		}

	},

	__rect4: function (x, y, width, height) {
	
		var ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
			
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-width/2 -xp;
		y = y-height/2-yp;
			
		ctx.beginPath();
		ctx.lineWidth = '1';	
		ctx.strokeStyle = 'blue';
		ctx.strokeRect( x * xs, y * ys, width * xs, height * ys);
		ctx.stroke();
	},

	__rect5: function (x, y, width, height, color) {
		
		var ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
			
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-width/2 -xp;
		y = y-height/2-yp;
	
		ctx.beginPath();
		ctx.lineWidth = '1';	
		ctx.strokeStyle = color;
		ctx.strokeRect( x * xs, y * ys, width * xs, height * ys);
		ctx.stroke();


	},

	__rect6: function (x, y, width, height, color, fillColor) {
		
		var ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
	
		var xp = this.portPos.x;
			yp = this.portPos.y;

		x = x-width/2 -xp;
		y = y-height/2-yp;
		
		ctx.beginPath();
		ctx.rect(x * xs, y * ys, width * xs, height * ys);
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.lineWidth = 0;	
		ctx.strokeStyle = color;
		ctx.stroke();


	},

	__rect7: function (x, y, angle, width, height, color, fill) {


	},
	//Draw an image to canvas
	//
	//image is an overloaded method
	//
	//Drawer.image(imgSrc, x, y);
	//Drawer.image(imgSrc, x, y, angle);
	//Drawer.image(imgSrc, x, y, width, height);
	//Drawer.image(imgSrc, x, y, rad, width, height);
	//
	//Features:
	//1.Translate x,y image possition from top-right to center.
	//2.Scale x,y posstions and width, heigth.
	//3.Load Atlases in order draw images from them.
	//3.Automatically detects if image belongs to an Atlas  
	//and use proper translations to draw it from there.
	//
	//parameters:
	//imgSrc - string with image uri, or image name on an atlas
	//x		 - x axis center possition of image
	//y		 - y axis center possition of image
	//angle	 - rotation angle in radius
	//width  - resize image width to specified
	//height - resize image height to specified
	//
	image: function (imgSrc, x, y) {

		if (this._imgToAtlas[imgSrc]) {
			
			if (arguments.length == 3) {
				this.__imageAtlas3(imgSrc, x, y);
			}
			else if (arguments.length == 4) {
				this.__imageAtlas4(imgSrc, x, y, arguments[3]);
			}
			else if (arguments.length == 5) {
				this.__imageAtlas5(imgSrc, x, y, 
						arguments[3], arguments[4]);
			}
			else if (arguments.length == 6) {
				//better way to do it
				this.__imageAtlas6(imgSrc, x, y, 
						arguments[3], arguments[4], arguments[5]);
			}

			return ;

		}


		
		var img,ctx;
			
		ctx = this.ctx;
		img = Loader.load(imgSrc);
		
		if (arguments.length == 3) {
			this.__image3(img, x, y);
		}
		else if (arguments.length == 4) {
			this.__image4(img, x, y, arguments[3]);
		}
		else if (arguments.length == 5) {
			this.__image5(img, x, y, 
					arguments[3], arguments[4]);
		}
		else if (arguments.length == 6) {
			//better way to do it
			this.__image6(img, x, y, 
					arguments[3], arguments[4], arguments[5]);
		}
		return ;
		
	},
	//Draw a raw (not src) image to canvas
	//
	//rawImage is an overloaded method
	//
	//Drawer.rawImage(img, x, y);
	//Drawer.rawImage(img, x, y, angle);
	//Drawer.rawImage(img, x, y, width, height);
	//Drawer.rawImage(img, x, y, rad, width, height);
	//
	//Warning: 
	//You have to provide an image element not a string with
	//image src
	//
	//Features:
	//1.Translate x,y image possition from top-right to center.
	//2.Scale x,y posstions and width, heigth.
	//
	//parameters:
	//imgSrc - string with image uri, or image name on an atlas
	//x		 - x axis center possition of image
	//y		 - y axis center possition of image
	//angle	 - rotation angle in radius
	//width  - resize image width to specified
	//height - resize image height to specified
	rawImage: function (img, x, y) {
	
		if (arguments.length == 3) {
			this.__image3(img, x, y);
		}
		else if (arguments.length == 4) {
			this.__image4(img, x, y, arguments[3]);
		}
		else if (arguments.length == 5) {
			this.__image5(img, x, y, 
					arguments[3], arguments[4]);
		}
		else if (arguments.length == 6) {
			//better way to do it
			this.__image6(img, x, y, 
					arguments[3], arguments[4], arguments[5]);
		}

		return ;

	},

	//Overloaded methods __image*
	//draw raw image with out atlas
	__image3: function (img, x, y) {
	
		var ctx;
			
		ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh= this.xScaleHalf,
			ysh= this.yScaleHalf;
		
		var xp = this.portPos.x;
		var yp = this.portPos.y;
		
		x = x-xp;
		y = y-yp;

		ctx.drawImage(img, xs * x, ys * y);

	},

	__image4: function (img, x, y, rot) {
		
		var ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh= this.xScaleHalf,
			ysh= this.yScaleHalf;
		
		var xp = this.portPos.x;
		var yp = this.portPos.y;
		x = x-xp;
		y = y-yp;
	
		ctx.save();
		ctx.translate(xs * x, ys * y);
		ctx.rotate(rot);
		ctx.drawImage( img, -(img.width * xsh ), -(img.height * ysh));
		ctx.restore();

	},

	__image5: function (img, x, y, w, h) {
		var ctx;
			
		ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh= this.xScaleHalf,
			ysh= this.yScaleHalf;
		
		var xp = this.portPos.x;
		var yp = this.portPos.y;
		x = x-xp;
		y = y-yp;
	
		ctx.drawImage(img, 	x * xs - (w * xsh), 
						 	y * ys - (h * ysh), 
							w * xs, 
							h * ys);
	

	},

	__image6: function (img, x, y, rot, w, h) {
		var ctx;
			
		ctx = this.ctx;
		
		var xs = this.xScale,
			ys = this.yScale,
			xsh= this.xScaleHalf,
			ysh= this.yScaleHalf;
		
		var xp = this.portPos.x;
		var yp = this.portPos.y;
		x = x-xp;
		y = y-yp;
		
			
		ctx.save();
		ctx.translate(x * xs, y * ys);
		ctx.rotate(rot);
		ctx.drawImage( img, -(w * xsh),
							-(h * ysh), 
							h * xs,
							h * ys);
		ctx.restore();
	
	},

	//overloaded versions of .image()
	//[if a fucntion is not overloaded 
	// js-interpreter can compile them 
	// for great performance]
	
	//Called when we use Atlas and have 3 arguments
	__imageAltas3: function (imgSrc, x, y) {

		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
			
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-xp;
		y = y-yp;
		
		var atlas, img, frame;
		var ctx = this.ctx;

		atlas = this._imgToAtlas[imgSrc];
		img = Loader.load(atlas.img);
		f = atlas.frame;

		ctx.drawImage(img, f.x, f.y, 
							f.w, f.h, 
							x * xs, y * ys, 
							f.w * xsh, f.h * ysh);
	},
	//Called when we use Atlas and have 4 arguments
	//Parameters:
	//string with image src, x possition, y possition and rotation angle in radius
	__imageAtlas4: function (imgSrc, x, y, ang) {
			
		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
		
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-xp;
		y = y-yp;
			
		var atlas, img, frame;
		var ctx = this.ctx;

		atlas = this._imgToAtlas[imgSrc];
		img = Loader.load(atlas.img);
		f = atlas.frame;

		ctx.save();
		ctx.translate( x * xs, y * ys);
		ctx.rotate(ang);
		ctx.drawImage( img, f.x, f.y,
							f.w, f.h,
							-(f.w * xsh), -(f.h * ysh), 
							f.w  * xs, f.h * ys);
		ctx.restore();

	},
	//Called when we use Atlas and have 5 arguments
	//Parameters:
	//string with image src, x possition, y possition, width, height
	__imageAtlas5: function ( imgSrc, x, y, w, h) {

		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
			
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-xp;
		y = y-yp;
		
		var atlas, img, frame;
		var ctx = this.ctx;

		atlas = this._imgToAtlas[imgSrc];
		img = Loader.load(atlas.img);
		f = atlas.frame;
		
		
		
		ctx.drawImage(img, f.x, f.y, 
							f.w, f.h, 
							x * xs - (w * xsh), y * ys - (h * ysh), 
							w * xs, h * ys);
	},
	//Called when we use Atlas and have 6 arguments
	//Parameters:
	//string with image src, x possition, y possition, rotation angle in radius
	//, width, height
	__imageAtlas6: function (imgSrc, x, y, ang, w, h) {
			
		var xs = this.xScale,
			ys = this.yScale,
			xsh = this.xScaleHalf,
			ysh = this.yScaleHalf;
			
		var xp = this.portPos.x;
			yp = this.portPos.y;
			
		x = x-xp;
		y = y-yp;

		var atlas, img, frame;
		var ctx = this.ctx;

		atlas = this._imgToAtlas[imgSrc];
		img = Loader.load(atlas.img);
		f = atlas.frame;

		ctx.save();
		ctx.translate(x * xs, y * ys);
		ctx.rotate(ang);
		ctx.drawImage( img, f.x, f.y,
							f.w, f.h,
							-(w * xsh), -(h * ysh), 
							w  * xs, h * ys);
		ctx.restore();

	},
	//Apply filter to image
	//
	//Parametrs:
	//img - image element to apply filter
	//fn  - filter function(imgData) with imgData argument
	//    - imgData is imageData object https://developer.mozilla.org/en-US/docs/DOM/ImageData
	//	  - provided function must return imageData
	//
	//Returns: image element with filter applied
	//
	filter: function (img, fn) {
		var tempCanvas, tempImage, ctx, imgData;

		tempCanvas = window.document.createElement('canvas');
		tempCanvas.width = img.width;
		tempCanvas.height = img.height;
		
		ctx = tempCanvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		imgData = ctx.getImageData(0, 0, img.width, img.height);
		imgData = fn(imgData);
		ctx.putImageData(imgData,0,0);

		var tempImage = new Image();
		tempImage.src = tempCanvas.toDataURL('image/png');
		
		//helpfull for debuging let the above comment for a while
		//window.open(tempImage.src);
		
		return tempImage;
	}

}
