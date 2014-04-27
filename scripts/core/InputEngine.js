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
            InputEngine.bind(87, 'go-up');     //W
            InputEngine.bind(83, 'go-down');   //S
			InputEngine.bind(65,'go-left');	   //A
			InputEngine.bind(68,'go-right');   //D
			InputEngine.bind(119, 'go-up');     //w
            InputEngine.bind(115, 'go-down');   //s
			InputEngine.bind(97,'go-left');	   //a
			InputEngine.bind(100,'go-right');   //d
			
			InputEngine.bind(38, 'go-up');	   //up-arrow
			InputEngine.bind(40, 'go-down');   //down-arrow
			InputEngine.bind(37,'go-left');    //left-arrow
			InputEngine.bind(39,'go-right');   //right-arrow
           
			InputEngine.bind(32,'fire-torpedo'); //space
			InputEngine.bind(16,'fire-misile');	 //shift
			InputEngine.bind(66,'fire-misile');	 //B
			InputEngine.bind(98,'fire-misile');	 //b
			
			InputEngine.bind(101,'use-powerup');	 //e
			InputEngine.bind(69,'use-powerup');		 //E
			
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
