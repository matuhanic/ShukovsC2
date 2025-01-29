/*jshint smarttabs:true */ 
/*jshint laxcomma:true */ 

/*
	MultiPlayer behavior for Construct 2
	author:  Velojet	
	version: 6 Jan 2013
*/

'use strict'; // ECMAScript 5 strict mode

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");


///////////////////////////////////////////////////////////////////////////////////////////////
// Classes: Behavior, Type, Instance //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Behavior class
//
cr.behaviors.MultiPlayer = function(runtime)
{
	this.runtime = runtime;
};


(function () {
	var behaviorProto = cr.behaviors.MultiPlayer.prototype;
		
	var nowjsLoaded = false; // true when index.html has fully loaded the now.js script
	var serverReady = false; // true when the now.ready() function has fired (meaning socket.io connection has been established to server)
	
	var behInst = null; // initialised by behaviorProto.Instance() to act as reference to this.inst to make its members available to internal functions
	
	// PlayerData()
	// Constructor of objects to hold players' properties
	//
	var PlayerData = function(x, y, name) {
		this.x			  = x !== undefined ? x : 0; // x and y will be set to initial position of player, and sent to server by now.updatePlayer()
		this.y		    = y !== undefined ? y : 0;
		this.name     = name !== undefined ? name : ''; // to be set (eventually) by live input on start of game
	
		this.w = 32; // player sprite's width and height to be set by C2 via behInst
		this.h = 32;
		this.status = null;
		this.joined = false;
		this.updated = false;
		this.placed = false; // on canvas by placePlayer()
		this.left = false;
		this.move = null;
		
		// Server-managed properties
		//
		this.clientID	= 0; // server-allocated client ID, to be used by the SetWebPlayerID() action
		this.SUID = 0; // server-allocated UID
		this.score = 0;
		this.health = 0;
		this.collided = false; // true for my player when it collides with a web player
	};

	// Player objects passed by server to placePlayer() - either my player or a web player
	//
	var	myPlayer = new PlayerData(),
			webPlayer = new PlayerData();
	
	var webPlayers = []; // array (0-based) of PlayerData objects to be used for managing web players
	var idPairs = []; 	 // associative array to pair webPlayer.clientID (key) with C2 UID (value) - enables C2<->server communication
			
	var webPlayersToMake = false,
			numWebPlayersToMake = 0,
			currWebPlayer = 0;
			
	var infoBox = null; // panel on page outside canvas to display game info - will be initialised by behtypeProto.onCreate()
			
	var isRejected = false; // true if limit set (by server) to number of players
	
	var acceptKeyDown = true; // assigning false will prevent auto-repeat
	
	// initClient()
	//   Sets up now communication function: placePlayer()
	//
	//   (Not called (by checkNow()) until MultiPlayer.behtypeProto.onCreate() has executed)
	//
	var init = function(now, runtime) {
		now.ready(function() {
			serverReady = true;
			
			// now.reject() /////////////////////////////////////////////////////////////////////////////////////////////////
			//   Called by server if this client exceeds number of permitted connected clients
			//
			now.reject = function() {
				isRejected = true;
			};
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			
			// now.showInfoBox() ////////////////////////////////////////////////////////////////////////////////////////////
			//   Called by server if info panel is required to be shown
			//
			now.showInfoBox = function() {
				jQuery('#info').show();
			};
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			
			// now.showInfo() definition ////////////////////////////////////////////////////////////////////////////////
			//   Called by server to place text in info panel
			//	 - second parameter is a Boolean: if true, will append text
			//
			now.showInfo = function(text, append) {
				var infoBox = document.getElementById('info');
				
				if (append) {
					infoBox.innerHTML += text;
				}
				else {
					infoBox.innerHTML = text;
				}
			};
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			// Call initBoard (defined in server, which can us it to set up 2D board array to track players)
			//
			now.initBoard(runtime.width, runtime.height, behInst.width, behInst.height);

			// now.placePlayer() definition /////////////////////////////////////////////////////////////////////////////////
			// NOTE: If both my player's and web players' positions emanate from server,
			//       that eliminates potential for my player to have moved before web players' positions have been received
			//
			now.placePlayer = function(player) { // updated player passed by server (carrying its server-allocated ID: player.ID)
				myPlayer.updated = false; // reset
					
				// My player? Place it
				//
				if (player.ID === now.core.clientId) {
					behInst.x = myPlayer.x = player.x;
					behInst.y = myPlayer.y = player.y;
					behInst.set_bbox_changed();
					myPlayer.updated = myPlayer.placed = true;
					
					myPlayer.SUID = player.SUID; // TODO: should happen only once
					myPlayer.name = player.name; // TODO: should happen only once
					myPlayer.score = player.score;
					myPlayer.health = player.health;

					myPlayer.collided = false; // reset

					if (player.status == playerStatus.COLLIDED) { // my player has collided with a web player
						myPlayer.collided = true;
					}
				}
				else { // web player

					webPlayer.clientID = player.ID; // for cross-function access by SetWebPlayerID()
					webPlayer.joined = false; // reset
					webPlayer.updated = false; // reset
					webPlayer.left = false; // reset

					// Has this player just joined?
					//
					if (player.status === playerStatus.JOINED) {

						webPlayer.joined = true;
						webPlayer.x = player.x;
						webPlayer.y = player.y;
					}
					else { // existing web player - move to position

						webPlayer.updated = true;
						webPlayer.clientID = player.ID; // for cross-function access by SetWebPlayerID()
						webPlayer.x = player.x;
						webPlayer.y = player.y;
					}
				} // \else web player
			}; // \placePlayer() ////////////////////////////////////////////////////////////////////////////////////////////
			
			
			// now.makeWebPlayers() definition //////////////////////////////////////////////////////////////////////////////
			//   Populates array of web players
			//
			now.makeWebPlayers = function(players) { // set of web players passed by server
				var j = 0; // array index
				
				for(var i in players) { // i is server-assigned ID
				
					// Populate webPlayers array
					//
					if (i !== now.core.clientId) { // skip past my player
						webPlayers[j] = new PlayerData(players[i].x, players[i].y, players[i].name);
						webPlayers[j].clientID = i;
						webPlayers[j].status = players[i].status;
						
						++j;
						webPlayersToMake = true;
					}
					numWebPlayersToMake = j;
					currWebPlayer = 0;
				}
			}; // \makeWebPlayers() /////////////////////////////////////////////////////////////////////////////////////////

			// now.removePlayer() definition ////////////////////////////////////////////////////////////////////////////////
			//
			now.removePlayer = function(SUID) {
				webPlayer.left = true;
			};

			// Initial placement
			//   Call now.updatePlayer() (defined in server)
			//   - will be received back by placePlayer() as element in players array
			//
			// NOTE: Initial position will be set by server
			//
			if (! isRejected) {
				now.updatePlayer(move.STATIC, '', playerStatus.JOINED); // calls everyone.now.updatePlayer() in server.js - with my player's initial data
																																// NOTE: parameter 2 is player name
			}																														 						 
		}); // \now.ready wrapper
	}; // \init()

	// checkNow() : Is NowJS available yet?
	//
	var checkNow = function(runtime) { 
		if (typeof now === 'undefined' )     { 
			window.setTimeout(function() { checkNow(runtime); runtime = null; }, 100);
		} 
		else	{ 
			nowjsLoaded = true;		
		
			init(now, runtime);
		} 
	};
	

	/////////////////////////////////////////////////////////////////////////////////////////////
	// Behavior Type class
	//
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()	{

		// Use jQuery to add multiplayer stylesheet to head
		//
		jQuery('head').append('<link rel="stylesheet" media="all" href="/css/multiplayer.css" />');

		// Use jQuery to add info panel to window, outside canvas
		// NOTE: can user jQuery to hide it
		//
		var mpHTML =
			'<div>' +
				'<div id="info">' +
				'</div>' +
			'</div>'
			;

		jQuery('body').prepend(mpHTML);
		
		// Use jQuery to load NowJS framework and mp module with shared data structures
		//
		jQuery.getScript('/nowjs/now.js', function(data, textStatus, jqxh) {
		});

		jQuery.getScript('/lib/mp.js', function(data, textStatus, jqxh) {
		});

		checkNow(this.runtime); // check that NowJs has been loaded
	};

	/////////////////////////////////////////////////////////////////////////////////////////////
	// Behavior Instance class
	//
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		
		myPlayer.w = webPlayer.w = inst.width;
		myPlayer.h = webPlayer.h = inst.height;
		
		behInst = inst;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function() {
		// Load properties
		//
		this.defaultControls = (this.properties[0] === 1); // 0=no, 1=yes
		this.allowAutoRepeat = (this.properties[1] === 1);
		
		// Only bind keyboard events via jQuery if default controls are in use
		//
		if (this.defaultControls && ! this.runtime.isDomFree) {
		
			// Register keydown handler ///////////////////////////////
			//
			jQuery(document).keydown(
				(function (self) {
					return function(event) {
						self.onKeyDown(event);
					};
				})(this)
			);
			
			// Register keyup handler ///////////////////////////////
			//
			jQuery(document).keyup(
				(function (self) {
					return function(event) {
						self.onKeyUp(event);
					};
				})(this)
			);
		}
	};

	// onKeyDown()
	//   Arrow keypress handler
	//   Updates player position
	//   Calls server's now.updatePlayer to action necessary redraws (including of my player)
	//
	behinstProto.onKeyDown = function(event) {
	
		// Check if we can accept a key down event, dependent on:
		//   1) (if auto-repeat is disabled) a key-up event having occurred since last keydown
		//	 2) display having been redrawn following previous move
		//
		if (acceptKeyDown && myPlayer.placed) { 
			myPlayer.move = move.STATIC; // default - prevents off-window move being sent to server

			switch (event.keyCode) {
				case 37:// left
					event.preventDefault();
					if (this.inst.x >= this.inst.width) {
						myPlayer.move = move.LEFT;
						myPlayer.placed = false; // until placePlayer() actually moves myPlayer
					}
					break;

				case 38:// up
					event.preventDefault();
					if (this.inst.y >= this.inst.height) {
						myPlayer.move = move.UP;
						myPlayer.placed = false; // until placePlayer() actually moves myPlayer
					}
					break;

				case 39:// right
					event.preventDefault();
					if (this.inst.x <= this.runtime.width - this.inst.width) {
						myPlayer.move = move.RIGHT;
						myPlayer.placed = false; // until placePlayer() actually moves myPlayer
					}
					break;

				case 40:// down
					event.preventDefault();
					if (this.inst.y <= this.runtime.height - this.inst.height) {
						myPlayer.move = move.DOWN;
						myPlayer.placed = false; // until placePlayer() actually moves myPlayer
					}
					break;
			}

			// OUT >> : Call now.updatePlayer() (defined in server)
			//
			if (! isRejected && nowjsLoaded && myPlayer.move !== move.STATIC) {
				now.updatePlayer(myPlayer.move, '', playerStatus.PLAYING); // calls everyone.now.updatePlayer() in server.js
																																	 // NOTE: parameter 2 is player name
			}
			if (! behInst.allowAutoRepeat) acceptKeyDown = false; // prevent auto-repeat
		} //\if
	};

	// onKeyUp()
	// (If auto-repeat is disabled) allow another keydown event to trigger a move i.e. prevent auto-repeat
	//
	behinstProto.onKeyUp = function(event) {	
		acceptKeyDown = true;
	};

	behinstProto.tick = function ()
	{
	};
	

  /////////////////////////////////////////////////////////////////////////////////////////////	
	// Construct 2 ACEs /////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////
	
	// Conditions ///////////////////////////////////////////////////////////////////////////////
	
	function Cnds() {}

	Cnds.prototype.WebPlayerJoined = function()	{
		return webPlayer.joined;
	};

	Cnds.prototype.WebPlayerUpdated = function() {
		return webPlayer.updated;
	};

	Cnds.prototype.WebPlayersToMake = function() {
		var retVal = webPlayersToMake;
		
		webPlayersToMake = false; // reset
		
		return retVal;
	};

	Cnds.prototype.MyPlayerCollided = function()	{
		return myPlayer.collided;
	};

	Cnds.prototype.MyPlayerMoved = function()	{
		var retVal = myPlayer.updated;
		
		myPlayer.updated = false; // reset
		
		return retVal;
	};

	Cnds.prototype.WebPlayerLeft = function() {
		return webPlayer.left;
	};

	Cnds.prototype.ServerReady = function() {
		return serverReady;
	};

	behaviorProto.cnds = new Cnds();
	
	
	// Actions //////////////////////////////////////////////////////////////////////////////////
	
	function Acts() {}

	
	// InitWebPlayersData()
	//	 Initialises web players' data to be used by C2 in creating web players 
	//
	Acts.prototype.InitWebPlayerData = function() {
	
		if (currWebPlayer < numWebPlayersToMake) {
			webPlayer.x = webPlayers[currWebPlayer].x;
			webPlayer.y = webPlayers[currWebPlayer].y;
			webPlayer.clientID = webPlayers[currWebPlayer].clientID;
		}
		else {
			numWebPlayersToMake	= 0;
		}
		
		++currWebPlayer;
		
		return;
	};
	
	// SetWebPlayerID()
	//	 Pairs server-allocated clientID with C2-allocated UID (in this client browser) to enable appropriate web player to be moved
	//
	Acts.prototype.SetWebPlayerID = function(UID) {
		idPairs[webPlayer.clientID] = UID; // object/property syntax
		webPlayer.joined = false; // reset at this point,  to prevent further calls
		
		return;
	};
	
	behaviorProto.acts = new Acts();

	
	// Expressions //////////////////////////////////////////////////////////////////////////////
	
	function Exps() {}

	Exps.prototype.WebPlayerX = function(ret) {
		ret.set_int(webPlayer.x);
	};
	
	Exps.prototype.WebPlayerY = function(ret) {
		ret.set_int(webPlayer.y);
	};
	
	// WebPlayerUID()
	// Returns C2 UID for server-allocated client ID
	//
	Exps.prototype.WebPlayerUID = function(ret) {
		webPlayer.updated = false; // reset at this point,  to prevent further calls

		ret.set_int(idPairs[webPlayer.clientID]);
	};
	
	Exps.prototype.NumWebPlayersToMake = function(ret) {
		ret.set_int(numWebPlayersToMake);
	};
	
	Exps.prototype.SUID = function(ret, ID) {
		ret.set_int(ID == 0 ? myPlayer.SUID : 0)
	};
	
	Exps.prototype.Name = function(ret, ID) {
		 ret.set_string(ID == 0 ? myPlayer.name : 'unnamed')
	};
	
	Exps.prototype.Score = function(ret, ID) {
		ret.set_int(ID == 0 ? myPlayer.score : 0)
	};
	
	Exps.prototype.Health = function(ret, ID) {
		ret.set_int(ID == 0 ? myPlayer.health : 0)
	};
	
	behaviorProto.exps = new Exps();
}());