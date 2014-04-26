Scale={
  x:1.0,
  y:1.0,
  setScale:function(ScaleX,ScaleY){
    Scale.x=ScaleX;
    Scale.y=ScaleY;
  }
};
InputEngine = {

        bindings: {},

        actions: {},

        mouse: {
                x: 0,
                y: 0
        },

		portPos: {
					x:0, 
					y:0
		},
		
        //-----------------------------
        setup: function (canvas) {
		
				
            //move key bindings
            InputEngine.bind(87, 'go-up');
            InputEngine.bind(83, 'go-down');
			InputEngine.bind(65,'go-left');
			InputEngine.bind(68,'go-right');
			
			InputEngine.bind(38, 'go-up');
			InputEngine.bind(40, 'go-down');
			InputEngine.bind(37,'go-left');
			InputEngine.bind(39,'go-right');
           
			InputEngine.bind(32, 'rotate');
            //event listeners
            canvas.addEventListener('mousemove', InputEngine.onMouseMove,true);
            document.addEventListener('keydown', InputEngine.onKeyDown,true);
            document.addEventListener('keyup', InputEngine.onKeyUp,true);

        },

	
       
    onMouseMove: function (event) {
       	var rect = canvas.getBoundingClientRect();
		InputEngine.actions['mousemove'] = true;
		InputEngine.mouse.x = ((event.clientX+InputEngine.portPos.x)-rect.left) * Scale.x;
       	InputEngine.mouse.y = ((event.clientY+InputEngine.portPos.y)-rect.top) * Scale.y;	
	},


      
    onKeyDown: function (event) {
		
		event.preventDefault();		
    	
		var action = InputEngine.bindings[event.keyCode];
        	if (action) {
            	InputEngine.actions[action] = true;
						
    		}
	},

   
    onKeyUp: function (event) {
		
		event.preventDefault();	
    	
		var action = InputEngine.bindings[event.keyCode];

        if (action) {
        	InputEngine.actions[action] = false;
		
        }
        },

        
        bind: function (key, action) {
                InputEngine.bindings[key] = action;
				
        }

};
