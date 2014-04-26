//DRAFT - to be modified area start
Player0 = {
    playing: true,
	submarine: null,
    lifebar: null,
	area: { 
		x:0,
		y:0,
		w:0,
		h:0
	}
}


assets = { 
	'background': 'atlas/',
	'submarine'	: 'atlas/', 
    'Surface'   : 'atlas/',
}


factory = {};

//DRAFT - to be modified area stop

GameEngine = { 

	ctx: null,
	canvas: null,

	Entities: [],

	init: function (canvas) {
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
        Player0.lifebar = this.spawn('Lifebar');
		this.setLines(10);
	},

	setLines: function (lines) {
		var SIZE_OF_LINE = 50;
		var scale;
		Player0.area.h = (lines) * SIZE_OF_LINE;
		
		scale = Math.max([2]);
		Drawer.setScale(scale, scale);						
		Player0.area.w = this.canvas.width / Drawer.xScale;
		GenPath.setLines(lines);	
	},

	draw: function () {

		var ctx = this.ctx;
		
		//DRAFT start
		ctx.fillStyle = "rgb(200,0,0)";
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//DRAFT end
		
		var ent = this.Entities;
		
		/*
		//Draw all z-index with number n, and store the others.
		//Draw all z-index with number n+1, and store the others.
		//Until everything is drawn
		for(var i = 0; i < ent.length; i++){
			if(ent[i].zIndex == undefined)
				ent[i].zIndex = 0;
		}
		var indexCounter = 0;
		while(ent.length != 0){
			var temp = [];
			for(var i = 0; i < ent.length; i++){
				if(ent[i].zIndex == indexCounter)
					ent[i].draw(ctx);
				else
					temp.push(ent[i]);
			}
			ent = temp;
			indexCounter++;
		}*/
		//not optimized 
		ent.sort(function (a,b) { 
					
			var az=0;
			var bz=0;

			if (a.zIndex == undefined) {
				az = 0;
			}
			else {
				az =  a.zIndex;
			}

			if (b.zIndex == undefined) {
				bz = 0;
			}
			else {
				bz = b.zIndex;
			}
			
			return az - bz; 
		});

		for ( i in ent ) {
			ent[i].draw(ctx);	
		}
		
		
		if ( Player0.sumarine.crashed) {
			Drawer.ctx.fillStyle="#efe";
			Drawer.ctx.lineStyle="#fffff0";
			Drawer.ctx.font="38px sans-serif";
			Drawer.ctx.fillText('Game Over, press F5 to restart',
								Drawer.canvas.width/4 - 20,
								Drawer.canvas.height/4 - 10);
			Player0.submarine.zIndex = -1;
		}


	},
	physic: function () {

		var ent = this.Entities;
		for (var i in ent) {
			if (Player0.submarine == ent[i]) 
				continue;
			if (ent[i] === undefined)
				continue;
			if (Math.abs(Player0.submarine.pos.x - ent[i].pos.x) <  Player0.submarine.width/2 + ent[i].width/2 &&			
				Math.abs(Player0.submarine.pos.y - ent[i].pos.y) <  Player0.submarine.height/2 + ent[i].height/2) {
		
				if (Math.abs(Player0.submarine.pos.x - ent[i].pos.x) < ent[i].width/2 - Player0.submarine.width/2 && 
					Math.abs(Player0.submarine.pos.y - ent[i].pos.y) < ent[i].height/2 + Player0.submarine.height/2 ){	
					Player0.submarine.inside(ent[i]);	
					return;
				}
				else {
					Player0.submarine.collision(ent[i]);					
					
				}
			}
		}
	},
	update: function () {


		//DRAFT start
		if(InputEngine.actions['go-up']) {
			
				Player0.submarine.moveUp();	
			
		}
		else if(InputEngine.actions['go-down']) {
			
				Player0.submarine.moveDown();
			
		}
		
		if(InputEngine.actions['go-left']) {
			
				Player0.submarine.moveLeft();
			
		}
		else if(InputEngine.actions['go-right']) {
			
				Player0.submarine.moveRight();
			
		}
		if (InputEngine.actions['rotate']) {
			
			InputEngine.actions['rotate'] = false;
			Player0.submarine.rotate(true);
		}
		
		var ent = this.Entities;
		for (var i=ent.length; i-- ; i) {	
			ent[i].update();   	 
		}
			
		Drawer.portPos.y = Player0.submarine.pos.y - (Drawer.portSize.h/2);
		Drawer.portPos.x = Player0.submarine.pos.x - (Drawer.portSize.w/2);
		if (Drawer.portPos.y < 0) {
			Drawer.portPos.y = 0;
		}
		if (Drawer.portPos.y + Drawer.portSize.h > Player0.area.h) {
			Drawer.portPos.y = Player0.area.h - Drawer.portSize.h;
		}
		if (Drawer.portPos.x < 0) {
			Drawer.portPos.x = 0; 
		}
		if (Drawer.portPos.x + Drawer.portSize.w > Player0.area.w) {
			Drawer.portPos.x = Player0.area.w - Drawer.portSize.w;
		}
			
		
		
		this.physic();

		//Draft Garbage collector
		//TODO
		for (var i=ent.length; i-- ; i) {	
        	if ( ent[i] &&  ent[i].pos.x < -50 ) {
				ent.splice( i, 1);		
			}
		}

	},

	
	spawn: function (entityName) {
	
		var args = Array.prototype.slice.call(arguments, 1);


		var Temp = function(){}

		var inst, ent;

		Temp.prototype = factory[entityName].prototype;
		inst = new Temp;
		ent = factory[entityName].apply(inst, args); 
		
		this.Entities.push(ent);
		return ent;
	},
	//Drawer.rect(x, y, width, height, color, fillColor);
	batchSpawn: function(x,array) {
		var y=25;
		for (var i=0; i<array.length; i++) {
			
			this.spawn ('Surface',x,y,array[i]); 
			y+=50;
		}
	},

	removeEntity: function(ent) {

		ent._killed = true;
	}

}
