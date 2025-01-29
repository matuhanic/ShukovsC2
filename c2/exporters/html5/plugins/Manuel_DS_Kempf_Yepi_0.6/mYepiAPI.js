var soundControl = -1;
var gamePause = -1;
var gameRestart = 0;
var gameResize = 0;
var gameWidth = 0;
var gameHeight = 0;

//mYepiAPI_SoundControl("on" / "off") ? set sound on/off.
mYepiAPI_SoundControl = function(sound_on_off){
	console.log("mYepiAPI_SoundControl: " + sound_on_off.toString());
	if(sound_on_off === "on"){
		//alert("Need to Implement call to game Sound-on");  //Change this line
		soundControl=1;
	} else {	
		//alert("Need to Implement call to game Sound-off");  //Change this line
		soundControl=0;
	}	
};

//mYepiAPI_gamePause(on/off) ?  "pause = on", "unpause=off" the game
mYepiAPI_gamePause = function(pause_on_off){
	console.log("mYepiAPI_gamePause: " + pause_on_off.toString());
	if(pause_on_off === "on"){
		//alert("Need to Implement call to game Pause-on");  //Change this line
		gamePause=1;
	} else {
		//alert("Need to Implement call to game Sound-off");  //Change this line
		gamePause=0;
	}
};


//mYepiAPI_gameRestart() ?  Restart Game, "Play Again"
mYepiAPI_gameRestart = function(){
        console.log("mYepiAPI_gameRestart");
        //alert("Need to Implement call to Restart / Play Again");  //Change this line
		gameRestart=1;
};

mYepiAPI_gameResize = function(w,h){
        console.log("mYepiAPI_gameResize");
        //alert("Need to Implement call to Restart / Play Again");  //Change this line
		
		gameWidth=w;
		gameHeight=h;
		gameResize=1;
};

