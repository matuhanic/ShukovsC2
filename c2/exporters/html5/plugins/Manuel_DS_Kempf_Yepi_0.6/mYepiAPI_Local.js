
//mYepiAPI_loadingComplete() ?   informs when initial loading is complete.
mYepiAPI_loadingComplete = function(){
	console.log("mYepiAPI_loadingComplete");
};

//mYepiAPI_levelEnd() ?  sends "level end" after level is completed.
mYepiAPI_levelEnd = function(){
    console.log("mYepiAPI_levelEnd");
};

//mYepiAPI_gameOver() ?  sends "game over" when the game is over.
mYepiAPI_gameOver = function(){
	console.log("mYepiAPI_gameOver");
};

//mYepiAPI_sendScore(score) ? sends the game's score when the game is over.
mYepiAPI_sendScore = function(score){
	console.log("mYepiAPI_sendScore: " + score.toString());
};
