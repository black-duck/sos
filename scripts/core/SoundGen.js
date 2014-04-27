
SoundGen = {

	fft : function () {


	},

	init : function() {

    	// create the audio context (chrome only for now)
    	if (! window.AudioContext) {
    	    if (! window.webkitAudioContext) {
    	        alert('no audiocontext found');
    	    }
    	    window.AudioContext = window.webkitAudioContext;
   	 	}

    	var context = new AudioContext();

    	var audioBuffer;
   		var sourceNode;
    	var analyser;
   		var javascriptNode;
		
			
		// setup a javascript node
	    javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);


        // setup a analyzer
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = 1024;
	
		
		
        // create a buffer source node
        sourceNode = context.createBufferSource();
        sourceNode.connect(analyser);
        analyser.connect(javascriptNode);
		
        sourceNode.connect(context.destination);
 
		javascriptNode.onaudioprocess = function () {

			// get the average for the first channel
			var array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);

			// draw the spectrogram
			SoundGen.fft(array)


    	}
	 	this.context = context;
		this.AudioNode = audioNode;
   		this.sourceNode = sourceNode;
    	this.analyser = analyser;
   		//var javascriptNode;
 
	

    	this.loadSound("sounds/UltraMix.ogg");


   },

    // load the specified sound
	loadSound: function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

		var sourceNode = this.sourceNode;
		var context    = this.context;
        // When loaded decode the data
        request.onload = function () {

            // decode the data
            context.decodeAudioData(request.response, function (buffer) {
                // when the audio is decoded play the sound
                sourceNode.buffer = buffer;
        		sourceNode.start(0);
        		sourceNode.loop = true;
            });
        }
        request.send();
    },

	
	
	
	
	
	
	
	Mute all
	muteall : function(){
		this.sourceNode.gain.value = 0;
	},
	
	Unmute all
	unmuteall : function(){
		this.sourceNode.gain.value = 1;
	},

}
SoundGen.init()

