SoundManager = {


	/* General Properties */
	
	//The offset volume
	offsetVolume: 0.1,
	
	//If sounds and music are muted
	globalMute: false,
	
	//The audio type supported
	audioType: 'ogg',	
	
	//Init Function	
	init: function(){
	
		var audio =  new Audio();
		//Define the type of audio supported.
		if (audio.canPlayType('audio/ogg; codecs="vorbis"'))
			this.audioType = 'ogg';
		else
			this.audioType = 'mp3';
		
		//Create AudioContext
		if (typeof AudioContext !== "undefined")
			this.context = new AudioContext();
		else if (typeof webkitAudioContext !== "undefined")
			this.context = new webkitAudioContext();
		else
			console.log('AudioContext not supported. :(');	
	
		//If AudioContext is supported
		if(this.context != null){
			
			//Create a volumeNode of AudioContext
			this.volumeNode = this.context.createGainNode();
			//Set the volume in volumeNode
			this.volumeNode.gain.value = this.effectsVolume;
			//Connect the volumeNode to the context destination
			this.volumeNode.connect(this.context.destination);


			this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1)	

			this.analyser = this.context.createAnalyser();
			this.analyser.smoothingTimeConstant = 0;
			this.analyser.fftSize = 1024;
			
			var musicSource = this.context.createMediaElementSource(this.primaryAudio);
			
			musicSource.connect(this.analyser);
			this.analyser.connect(this.javascriptNode);
			this.javascriptNode.connect(this.context.destination);

		}
		
	},
	
	
	/*   Effects Player   */
	
	//Sound Variables
	effectsVolume: 0.15,
	
	//This array will hold the source of each sound
	sounds: [],
	
	//When Audio Context is supported
	
	//The Audio Context object
	context: null,
	analyser: null,
	//The volume node
	volumeNode: null,
	
	//The buffer of the sounds
	soundBuffers: {},
	
	//When Audio Context is not supported
	
	//Array that holds all sound arrays - Non Audio Context 
	soundArrays: {},
	
	//Internal counters - Non Audio Context
	counters: {},
	
	//Preload sounds effects
	loadSounds: function(soundsArray, timeArray){
		for(var i = 0; i < soundsArray.length; i++)
			this._loadSound(soundsArray[i],timeArray[i]);
	},
	
	//Play sound, if loaded - DRAFT
	playSound: function(src){
	
		//Search for the sound
		var res = this._searchSound(src);
		if(res == -1){//If sound not found, do nothing
			console.log('Not Loaded Yet');
			return;
		}
		
		//Play the sound
		if(this.context != null){//If Audio Context is supported
			//Create a buffer source object
			var source = this.context.createBufferSource();
			//Set the buffer source to the buffer of the sound
			source.buffer = this.soundBuffers[this.sounds[res]];
			//No Loop
			source.loop = false;
			// AnalyserNode method
			analyser = context.createAnalyser();			
			//Connect it to the volumeNode
			source.connect(this.volumeNode);
			//Play immediately
			source.noteOn(0);
		}
		else{//If Audio Context is not supported
			//Find the internal counter
			var counter = this.counters[src];
			//Find the proper audio
			var audio = this.soundArrays[src][counter];
			//Set the parameters
			audio.autoplay = false;
			audio.muted = this.globalMute;
			audio.volume = this.effectsVolume;
			//Play the sound
			audio.play();
			//Increase the counter by one
			this.counters[src] = (this.counters[src] + 1) % this.soundArrays[src].length;
		}
	},
	
	//Return the index of src in sounds if loaded
	_searchSound: function(src){
		return this.sounds.indexOf(src);
	},
	
	//Send a request
	_sendXMLHttpRequest: function(src){
		//Set a new request
		var request = new XMLHttpRequest();
		//Set the parameters
		request.open('GET', src + '.' + this.audioType, true);
		//Define the response type
		request.responseType = 'arraybuffer';
		//A new parameter
		request.src = src;
		//When it loads
		request.addEventListener('load',SoundManager._functionCreateSounds, false);
		//Send the request
		request.send();
	},
	
	//Function when the sound loads
	_functionCreateSounds: function(event){
		//Capture the target of the event
		var request = event.target;
		//Convert the response to buffer
		var buffer = SoundManager.context.createBuffer(request.response, false);
		//Save the buffer
		SoundManager.soundBuffers[this.src] = buffer;
		//Save the source of the buffer
		SoundManager.sounds.push(this.src);		
	},
	
	//Load the sounds
	_loadSound: function(src, sps){ //sps = Sounds per second
		if(this.context != null){//If Audio Context is supported
			this._sendXMLHttpRequest(src);
		}
		else{//If Audio Context is not supported
			//Load a sound
			var audio = Loader.load(src + '.' + SoundManager.audioType);
			
			//When a sound loads
			audio.addEventListener("loadeddata", function(){
				//Calculate the minimum number of sounds
				var length = Math.ceil(sps * this.duration);
				//Create a new array
				var array = new Array(length);
				
				//Load the array with the same sound
				for(var i = 0; i < length; i++){
					//Load the sound
					array[i] = Loader.load(src + '.' + SoundManager.audioType);
					//Set the parameters
					array[i].autoplay = false;
					array[i].muted = SoundManager.globalMute;
					array[i].volume = SoundManager.effectsVolume;
				}
				
				//Save the array
				SoundManager.soundArrays[src] = array;
				//Set the internal counter
				SoundManager.counters[src] = 0;
				//Save the link
				SoundManager.sounds.push(src);
			});
		}
	},	
	
	//Volume up the effects
	volumeUpEffects: function(){
		if(this.context != null){//If Audio Context is supported
		
			//Change the volume in volume node
			if(this.effectsVolume + this.offsetVolume <= 1)
				this.volumeNode.gain.value += this.offsetVolume ;
			else
				this.volumeNode.gain.value = 1;	
		}
		else{//If Audio Context is supported
		
			//Change the volume effects
			if(this.effectsVolume + this.offsetVolume <= 1)
				this.effectsVolume += this.offsetVolume ;
			else
				this.effectsVolume = 1;	
		}		
	},
	
	//Volume down the effects
	volumeDownEffects: function(){
		if(this.context != null){//If Audio Context is supported
		
			//Change the volume in volume node
			if(this.effectsVolume - this.offsetVolume >=0)
				this.volumeNode.gain.value -= this.offsetVolume;
			else
				this.volumeNode.gain.value = 0;
		}
		else{//If Audio Context is supported
		
			//Change the volume effects
			if(this.effectsVolume - this.offsetVolume >=0)
				this.effectsVolume -= this.offsetVolume;
			else
				this.effectsVolume = 0;
		}
	},
	
	//Returns the volume of the effects
	volumeEffects: function(){
		return Math.floor(this.effectsVolume * 100);
	},
	
	
	/*   Music Player   */

	//Array to hold the links of the music
	srcArray: new Array(),
	
	//The music volume
	musicVolume: 1,
	
	//The primary music
	primaryAudio: new Audio(),
	
	//The secondary (temporary) music
	secondaryAudio: new Audio(),
	
	//Counter for the srcArray
	counter: 0,
	
	//Fade in/out time
	fadeTime: 5,
	
	//If tracks are changing
	nextTrackInProgress: false,
	
	//Set the playlist of the songs
	setMusic: function(srcArray){
		this.srcArray = srcArray;
	},
	
	//Start the playlist, from the beginning.
	startMusic: function(){
		//Set the counter to zero
		this.counter = 0;
		//Start Loading the new track
		this.primaryAudio = Loader.load(this.srcArray[this.counter] + '.' + this.audioType);
		//Set the parameters
		this.primaryAudio.autoplay = false;
		this.primaryAudio.muted = this.globalMute;
		this.primaryAudio.volume = this.musicVolume;
		//Flag that indicates if a track is changing
		this.primaryAudio.next = false;
		//When this audio ends. Set when the track is loaded.
		this.primaryAudio.end = null;
		
		//Constantly check volume and time to play next track
		this.primaryAudio.addEventListener("timeupdate",function(){
			var d = this.end - this.currentTime;
			var c = this.currentTime;
			
			if(d <= SoundManager.fadeTime){//Time to start the next song.
				if(d < 0){//If already ended
					this.currentTime = this.duration;
				}
				else{
					//Fade Out
					this.volume = (d / SoundManager.fadeTime) * SoundManager.musicVolume;
					//If not in prccess of changing track.
					if(this.next === false){
						this.next = true;
						SoundManager.nextTrack(); //Change Track
					}
				}
			}
			if(c <= SoundManager.fadeTime)//Fade in
				this.volume = (c / SoundManager.fadeTime) * SoundManager.musicVolume;	
			if(c > SoundManager.fadeTime && d > SoundManager.fadeTime)//Set the volume of music
				this.volume = SoundManager.musicVolume;
		});
		
		//When the song ends
		this.primaryAudio.addEventListener("ended",function(){
			SoundManager.primaryAudio = SoundManager.secondaryAudio; //Change the secondary track to primary
			SoundManager.secondaryAudio = null; //Set the secondary track a null track
			SoundManager.nextTrackInProgress = false; //Track changed
		});
		
		//When the music loads, play it.
		this.primaryAudio.addEventListener("loadeddata", function(){
			this.end = this.duration;
			this.play();
		});
	},
	
	//Next track please!
	nextTrack: function(){
		if(SoundManager.nextTrackInProgress === false){
			SoundManager.nextTrackInProgress = true;
			//In order to change whenever we want
			if(!this.primaryAudio.next){
				this.primaryAudio.next = true;
				this.primaryAudio.end = this.primaryAudio.currentTime + SoundManager.fadeTime;
			}
			//Increase the counter
			this.counter = (this.counter + 1) % this.srcArray.length;
			//Start Loading the new track
			this.secondaryAudio = Loader.load(this.srcArray[this.counter] + '.' + this.audioType);
			//Set the parameters
			this.secondaryAudio.autoplay = false;
			this.secondaryAudio.muted = this.globalMute;
			this.secondaryAudio.volume = this.musicVolume;
			//Flag that indicates if a track is changing
			this.secondaryAudio.next = false;
			//When this audio ends. Set when the track is loaded.
			this.secondaryAudio.end = null;
			//Constantly check volume and time to play next track
			this.secondaryAudio.addEventListener("timeupdate",function(){
				var d = this.end - this.currentTime;
				var c = this.currentTime;
				if(d <= SoundManager.fadeTime){//Time to start the next song.
					if(d < 0){//If already ended
						this.currentTime = this.duration;
					}
					else{
						//Fade Out
						this.volume = (d / SoundManager.fadeTime) * SoundManager.musicVolume;
						//If not in prccess of changing track.
						if(this.next === false){
							this.next = true;
							SoundManager.nextTrack(); //Change Track
						}
					}
				}
				if(c <= SoundManager.fadeTime)//Fade in
					this.volume = (c / SoundManager.fadeTime) * SoundManager.musicVolume;	
				if(c > SoundManager.fadeTime && d > SoundManager.fadeTime)//Set the volume of music
					this.volume = SoundManager.musicVolume;
			});
			//On end
			this.secondaryAudio.addEventListener("ended",function(){
				SoundManager.primaryAudio = SoundManager.secondaryAudio; //Change the secondary track to primary
				SoundManager.secondaryAudio = null; //Set the secondary track a null track
				SoundManager.nextTrackInProgress = false; //Track changed
			});
			//When the music loads, play it.
			this.secondaryAudio.addEventListener("loadeddata", function(){
				this.end = this.duration;
				this.play();
			});
		}
	},
	
	//Disable sound
	disableSound: function(){
		try{
			//Stop the primary music
			SoundManager.primaryAudio.pause();
			SoundManager.primaryAudio.src = "";
			//Stop the secondary music
			SoundManager.secondaryAudio.pause();
			SoundManager.secondaryAudio.src = "";
			console.log('Music Didabled :(');
		}
		catch(e){
		}
	},
	
	//Play the music
	playMusic: function(){
		this.analyser = this.context.createAnalyser(); 
		this.analyser.smoothingTimeConstant = 0;
		this.analyser.fftSize = 1024;
		this.analyser.connect(this.context.destination);
		var source = this.context.createMediaElementSource(this.primaryAudio); 
		source.connect(this.analyser);
	},
		
	//Volume up the music
	volumeUpMusic: function(){
		if(this.musicVolume + this.offsetVolume <= 1)
			this.musicVolume += this.offsetVolume;
		else
			this.musicVolume = 1;
		this.primaryAudio.volume = this.musicVolume;	
	},
	
	//Volume down the music
	volumeDownMusic: function(){
		if(this.musicVolume - this.offsetVolume >=0)
			this.musicVolume -= this.offsetVolume;
		else
			this.musicVolume = 0;
		this.primaryAudio.volume = this.musicVolume;	
	},
	
	//Returns the volume of the music
	volumeMusic: function(){
		return Math.floor(this.volumeMusic * 100);
	},
	
	
	/* General Methods */
	
	//Mute the sound
	muteAll: function(){
		this.globalMute = true;
		if(this.context != null)
			this.volumeNode.gain.value = 0;
		this.primaryAudio.muted = true;
	},
	
	//Unmute the sound
	umuteAll: function(){
		this.globalMute = false;
		if(this.context != null)
			this.volumeNode.gain.value = this.effectsVolume;
		this.primaryAudio.muted = false;
	},	
	
	//Global volume up
	globalVolumeUp: function(){
		this.volumeUpMusic();
		this.volumeUpEffects();
	},
	
	//Global volume down
	globalVolumeUp: function(){
		this.volumeUpMusic();
		this.volumeUpEffects();
	},
	
	//Returns the global volume
	globalVolume: function(){
		var diff = Math.abs(this.effectsVolume - this.volumeMusic);
		diff = Math.floor(diff * 100);	
		
		if(diff == 0) 
			return Math.floor(this.volumeMusic * 100);
		else
			return  Math.floor((this.effectsVolume + this.volumeMusic) * 100 / 2);
	},
	
	//Returns the supported audio type
	soundType: function(){
		return this.audioType;
	}	

	
}
//Draft
//SoundManager.init();
//SoundManager.loadSounds(['sounds/die', 'sounds/transition'], [2, 3]);
//SoundManager.setMusic(['sounds/Nature_Dreams', 'sounds/Epic_Dubstep_Chillstep', 'sounds/Milosc']);
//SoundManager.startMusic();
