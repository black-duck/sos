var Color = net.brehaut.Color;

// Used to calculate framesInterval.
// 
var beforeFrame = 0;
var afterFrame = 0;
var framesInterval = 0;

DELAY = 1000.0/60.0;
Logger = {};
Logger.log = console.log;
var loading = true;

function loop() {

    beforeFrame = new Date();

    Gameplay.update();
	PhysicsEngine.update();
    GameEngine.update();
    GameEngine.draw();
	
    afterFrame = new Date();
    framesInterval = afterFrame - beforeFrame;

    window.setTimeout(loop, DELAY - framesInterval);
}

function startGame() {

	//Load stuff
	for (var i in assets) {
		Loader.preload(assets[i]);
	}
    // Do some initialization.
    InputEngine.setup(canvas);
   	load();

}

function load() {

	
	loading = false;
	for (var i in assets) {

		if (!Loader.isLoaded(assets[i])) {
			loading = true;
			
		}
		
	}


	if (loading) {
    	window.setTimeout(load, 50);
	}
	else {
		 // And loop.
		var canvas = document.getElementById('canvas');
    	InputEngine.setup(canvas);
		PhysicsEngine.init(); //PhysicsEngine must be init before GameEngine.
		GameEngine.init(canvas);
		Drawer.init(canvas);
		Gameplay.init();
    	
    	loop();
	}

}
