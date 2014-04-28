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
	'background': 'atlas/sea.jpg',
	'submarine'	: 'img/Submarinara.png', 
    'torpedo' : 'img/torpilh.png',
	'obstacle' : 'img/Seamine.png',
}


factory = {};

//DRAFT - to be modified area stop

GameEngine = { 

	ctx: null,
	canvas: null,
	counter: 0,
	Entities: [],
	
	init: function (canvas) {
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		PhysicsEngine.addContactListener({

			BeginContact: function(A,B) {
				if (A.GetUserData().ent.onImpact) {
					A.GetUserData().ent.onImpact(B.GetUserData().ent);
				}
				if (B.GetUserData().ent.onImpact) {
					B.GetUserData().ent.onImpact(A.GetUserData().ent);
				}
			}

		});


		Player0.lifebar = this.spawn('Lifebar');
		var scale;
		
		
		scale = Math.max([2]);
		Drawer.setScale(scale, scale);						
		Player0.area.w = this.canvas.width / Drawer.xScale;
		Player0.area.h = this.canvas.height / Drawer.yScale;
	},

	draw: function () {

		var ctx = this.ctx;
		var counter = this.counter;
		//DRAFT start
		ctx.fillStyle = "#395368";
		ctx.fillRect(0,100, this.canvas.width, this.canvas.height -100);
	
		ctx.fillStyle = "#C9CBCD";
        
        ctx.fillRect(0 , 0 , this.canvas.width , 100);
        ctx.fillStyle="red";
		ctx.lineStyle="red";
		ctx.font="34px sans-serif";
        ctx.fillText(counter, 860, 60);        
		ctx.fillText("Points", 820, 30);
		//DRAFT end
		
		var ent = this.Entities;
		
		/* Draw static Classes */
		Seabed.draw()
		Wave.draw()
		

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
		
		

	},
	update: function () {

	
		Wave.update()
		Seabed.update()

		//DRAFT start
		if(InputEngine.actions['fire-torpedo']) {
			Player0.submarine.startFire();	
		}
		else {
			Player0.submarine.stopFire();	
		}
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
			
		
		
		var dead = [];	

		for (var i=ent.length; i-- ; i) {

			if (ent[i]._killed === true) {
				dead.push(i);
			} 
			else {
				ent[i].update();	
			}
		}

		for (var i=0; i < dead.length; i++) {

			if (ent[dead[i]].physBody) {
				PhysicsEngine.removeBodyAsObj(ent[dead[i]].physBody);			
			}
			ent.splice(dead[i], 1);

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

	removeEntity: function(ent) {

		ent._killed = true;
	}

}
