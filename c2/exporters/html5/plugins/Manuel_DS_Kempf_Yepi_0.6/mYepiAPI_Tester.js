
setTimeout("mYepiTester()", 50);

function mYepiTester(){
    var b = document.getElementsByName("body"); 
    var newDiv = document.createElement("div");
    newDiv.setAttribute("style","z-index:1000");
    var s = ''; 
    //s += '<div id="Tester_mYepiAPI">';
    s += '<input type="button" style="width:100px;" value="Game Loaded" id="Tester_mYepiAPI_GameLoaded" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Sound On" id="Tester_mYepiAPI_SoundOn" onclick="mYepiAPI_checkSoundOn();" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Sound Off" id="Tester_mYepiAPI_SoundOff" onclick="mYepiAPI_checkSoundOff();" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Game Pause" id="Tester_mYepiAPI_PauseOn" onclick="mYepiAPI_checkPauseOn();" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Game Play" id="Tester_mYepiAPI_PauseOff" onclick="mYepiAPI_checkPauseOff();" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Game Restart" id="Tester_mYepiAPI_Restart" onclick="mYepiAPI_checkGameRestart();" /> <br/>';
    s += '<input type="button" style="width:100px;" value="Score" id="Tester_mYepiAPI_SendScore"/> <br/>';
    s += '<input type="button" style="width:100px;" value="Level Ended" id="Tester_mYepiAPI_LevelEnded"/> <br/>';
    s += '<input type="button" style="width:100px;" value="Game Over" id="Tester_mYepiAPI_GameOver"/> <br/>';
    //s += '</div>';
    newDiv.innerHTML = s;
    document.body.insertBefore(newDiv, document.body.children[0]);
};

function mYepiAPI_checkSoundOn(){   
    try{
        mYepiAPI_SoundControl("on");
        mYepiAPI_setTestOK("Tester_mYepiAPI_SoundOn", true);
    }catch(e){
        mYepiAPI_setTestOK("Tester_mYepiAPI_SoundOn", false);
    }
}

function mYepiAPI_checkSoundOff(){   
    try{
        mYepiAPI_SoundControl("off");
        mYepiAPI_setTestOK("Tester_mYepiAPI_SoundOff", true);
    }catch(e){
        mYepiAPI_setTestOK("Tester_mYepiAPI_SoundOff", false);
    }
}

function mYepiAPI_checkPauseOn(){   
    try{
        mYepiAPI_gamePause("on");
        mYepiAPI_setTestOK("Tester_mYepiAPI_PauseOn", true);
    }catch(e){
        mYepiAPI_setTestOK("Tester_mYepiAPI_PauseOn", false);
    }
}

function mYepiAPI_checkPauseOff(){   
    try{
        mYepiAPI_gamePause("off");
        mYepiAPI_setTestOK("Tester_mYepiAPI_PauseOff", true);
    }catch(e){
        mYepiAPI_setTestOK("Tester_mYepiAPI_PauseOff", false);
    }
}

function mYepiAPI_checkGameRestart(){   
    try{
        mYepiAPI_gameRestart();
        mYepiAPI_setTestOK("Tester_mYepiAPI_Restart", true);
    }catch(e){
        mYepiAPI_setTestOK("Tester_mYepiAPI_Restart", false);
    }
}

mYepiAPI_sendScore = function (score){
    mYepiAPI_setTestOK("Tester_mYepiAPI_SendScore", true);
    document.getElementById("Tester_mYepiAPI_SendScore").value = "Score:" + score.toString();
};


mYepiAPI_loadingComplete = function(){
    mYepiAPI_setTestOK("Tester_mYepiAPI_GameLoaded", true);
};

mYepiAPI_levelEnd = function(){
    mYepiAPI_setTestOK("Tester_mYepiAPI_LevelEnded", true);
};

mYepiAPI_gameOver = function(){
    mYepiAPI_setTestOK("Tester_mYepiAPI_GameOver", true);
};


function mYepiAPI_setTestOK(TestID, IsOK){
    var color = 'Red';
    if (IsOK)
        color = 'lightGreen';
    document.getElementById(TestID).style.backgroundColor = color;
}
