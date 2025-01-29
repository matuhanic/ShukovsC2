"use strict"; // ECMAScript 5 strict mode

// PhotonCloud plugin (www.exitgames.com) for Construct2 by Deko.    Photon-Javascript_SDK.js Version3-2-1-4 (22.10.2013 - rev391)

var __extends = this.__extends || function (d, b) {
	function __() { this.constructor = d; }
	__.prototype = b.prototype;
	d.prototype = new __();
};

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.PhotonCloudD = function(runtime)
{
	this.runtime = runtime;
};

(function () 
{
	var pluginProto = cr.plugins_.PhotonCloudD.prototype;
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	
	// Use jQuery to load external Photon SDK script - doing it dynamically here saves making static changes in the C2-generated index.html
	//jQuery.getScript('Photon-Javascript_SDK.js', function(data, textStatus, jqxhr) { console.info('#### getScript(Photon client SDK) status: ' + textStatus); });
	
	var gameclient = {}; // will be initialised as a PhotonClient instance, to give C2 functions access
	
	var clientError = "";
	var roomPropsList = "";  //Because we can't see a list of names in 'Lobby', I set a room custom property containing names in each room, and then every onRoomListUpdate I can join all properties in a string.
	var maxPlayers = 2;
	var myActorIDinRoom = 0;
	var joinedActorNumber = "";
	var joinedActorName = "";
	var retiredActorNumber = "";
	var retiredActorName = "";
	var triggerWhenActorLeaveEnabled = false;  //Because I don't want onActorLeave triggers if MY actor leaves
	var myLastEventNumber = 0;
	var myArrayLastSenderIDs = [1];
	var myArrayLastEventValues = ["one"];
	// Photon Cloud app parameters (Would be nice to load them from C2 behavior properties, but those are loaded too late to be used here)
	var masterAddress = "app-eu.exitgamescloud.com:9090";
	var appId = "4aefda46-28e7-4a44-8a0c-63bbfcd24c06";
	var appVersion = "1.0";
	
	var PhotonClient = (function (_super) {
		__extends(PhotonClient, _super);

		// PhotonClient constructor
		function PhotonClient() {
			_super.call(this, masterAddress, appId, appVersion);
		}

		PhotonClient.prototype.start = function(runtime) {
			this.runtime = runtime;
			this.connect(true);
		};

		PhotonClient.prototype.onError = function(errorCode, errorMsg) {
			clientError = errorCode + ":" + errorMsg;
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnError, theInstance);
		};

		PhotonClient.prototype.onOperationResponse = function(errorCode, errorMsg, code, content) {
			if (code == 229) {  //I Choiced this instead of onStateChange equals ConnectedToMaster
					this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.ConnectedToMasterOK, theInstance);
			}
			if (errorCode == 32760) {  //When no random match found
				var myCustomGameProperties = {a: "y", rprop: "o"};    //it signifies "available:yes, aroomproperty:nothing"
				var myPropsListedInLobby = ["a", "rprop"];
				this.createRoom(null, {maxPlayers: maxPlayers, customGameProperties: myCustomGameProperties, propsListedInLobby: myPropsListedInLobby});
			}
		};

		PhotonClient.prototype.onRoomList = function(rooms) {  //Called on room list received from master server (on connection).
			var arrayTemp = [];
			for(var i = 0; i < rooms.length; ++i) {
				arrayTemp[i] = rooms[i].getCustomProperty("rprop") ;
			}
			roomPropsList = arrayTemp.join("|");    //roomPropList looks like:    blue;green|red;black|yellow
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnRoomListUpdate, theInstance);
		};

		PhotonClient.prototype.onRoomListUpdate = function(rooms, roomsUpdated, roomsAdded, roomsRemoved) {
			var arrayTemp = [];
			for(var i = 0; i < rooms.length; ++i) {
				arrayTemp[i] = rooms[i].getCustomProperty("rprop");
			}
			roomPropsList = arrayTemp.join("|");    //roomPropList looks like:    blue;green|red;black|yellow
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnRoomListUpdate, theInstance);
		};

		PhotonClient.prototype.onJoinRoom = function() {  //I take advantage of onJoinRoom, it is triggered just once for each player.
			myActorIDinRoom = this.myActor().actorNr;
			triggerWhenActorLeaveEnabled = true;  //now can trigger onActorLeave
			var arrayTemp = [];
			for (var i in this.myRoomActors()) {
				var a = this.myRoomActors()[i];
				if (a.actorNr > 0) arrayTemp[arrayTemp.length] = a.name;  //avoid  ;;green;gray  when someone leaves
			}
			this.myRoom().setCustomProperty("rprop", arrayTemp.join(";"));    //rprop looks like:    blue;green
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnJoinRoom, theInstance);
		};

		PhotonClient.prototype.onActorJoin = function(actor) {
			joinedActorNumber = actor.actorNr;
			joinedActorName = actor.name;
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnActorJoin, theInstance);
		};

		PhotonClient.prototype.onActorLeave = function(actor) {  //WHEN MY ACTOR LEAVES, onActorLeave IS CALLED FOR EACH ACTOR IN ROOM
			if (triggerWhenActorLeaveEnabled == true) {  //variable triggerWhenActorLeaveEnabled is set to 'false' just before QuitGame, is set to 'true' when onJoinRoom.
				retiredActorNumber = actor.actorNr;
				retiredActorName = actor.name;
				this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnActorLeave, theInstance);
			}
		};

		PhotonClient.prototype.onEvent = function (code, content, actorNr) {
			myLastEventNumber = code;    //code number is used for trigger OnEventBy, and to set or add values in the arrays
			myArrayLastSenderIDs[code] = actorNr;
			myArrayLastEventValues[code] = content.text;
			this.runtime.trigger(cr.plugins_.PhotonCloudD.prototype.cnds.OnEventBy, theInstance);
		};
		
		return PhotonClient;
	})(Photon.LoadBalancing.LoadBalancingClient); // PhotonClient end
	
	
	// checkPhoton() : Is the Photon server available yet?
	var checkPhoton = function(runtime) {
		if (typeof Photon === 'undefined' )     {
			window.setTimeout(function() { checkPhoton(runtime); runtime = null }, 100);
		} 
		else	{
			// Now we can construct a PhotonClient object
			gameclient = new PhotonClient();
			gameclient.start(runtime);
		} 
	};
	
	
	typeProto.onCreate = function() {  // called on startup for each object type
		checkPhoton(this.runtime);
	};


	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		// any other properties you need, e.g... this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	var theInstance = null;
	
	instanceProto.onCreate = function() {  // called whenever an instance is created
		// note the object is sealed after this call; ensure any properties you'll ever need are SET on the object  e.g. this.myValue = 0;
		theInstance = this;
	};


	//////////////////////////////////////
	// Construct 2 Actions Conditions Expressions

	//////////////////////////////////////
	// Conditions
	
	function Cnds() {};

	Cnds.prototype.ConnectedToMasterOK = function() {
		return true;		//This functions must return true if the condition was true for this instance, or false if not.
	};

	Cnds.prototype.OnError = function()	{
		return true;
	};

	Cnds.prototype.OnRoomListUpdate = function() {
		return true;
	};

	Cnds.prototype.OnJoinRoom = function()	{
		return true;
	};

	Cnds.prototype.OnActorJoin = function()	{
		return true;
	};

	Cnds.prototype.OnActorLeave = function()	{  //I AVOID REPEATED TRIGGERS
		return true;
	};

	Cnds.prototype.OnEventBy = function (eventnumber)
	{
		return myLastEventNumber === eventnumber;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions

	function Acts() {};
	
	Acts.prototype.SetName = function(nickname) {
		gameclient.myActor().setName(nickname);
		//Actions do not need to return anything.
	};
	
	Acts.prototype.NewGame = function(maxplayersfornewroom) {
		maxPlayers = maxplayersfornewroom;
		if (gameclient.isInLobby()) {
			var myExpectedCustomRoomProperties = {a:"y"};  //join if "available: yes"
			gameclient.joinRandomRoom({expectedCustomRoomProperties: myExpectedCustomRoomProperties});
		}
	};
	
	Acts.prototype.RaiseEventBy = function(eventcode, content, r) {
		if (gameclient.isJoinedToRoom()) {  // Raise message event To Others / To All with especific eventcode
			if (r == 0) gameclient.raiseEvent( eventcode, {text: content} );
			if (r == 1) gameclient.raiseEvent( eventcode, {text: content}, {receivers: 1} );
		}
	};
	
	Acts.prototype.QuitGame = function(closeroom) {
		if(gameclient.isJoinedToRoom()) {
			triggerWhenActorLeaveEnabled = false;  //Because I don't want onActorLeave triggers if MY actor leaves
			var arrayTemp = [];
			for (var i in gameclient.myRoomActors()) {
				var a = gameclient.myRoomActors()[i];
				if (a.actorNr > 0) { if(a.actorNr != myActorIDinRoom) arrayTemp[arrayTemp.length] = a.name; }  //avoid  ;;green;gray  when someone leaves
			}
			gameclient.myRoom().setCustomProperty("rprop", arrayTemp.join(";"));    //rprop looks like:    blue;green
			if (closeroom == 1) gameclient.myRoom().setCustomProperty("a","n");  //"available: no"  joinRandomRoom searches for "y" so ignores this room
			gameclient.leaveRoom();
		}
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	
	function Exps() {};
	
	Exps.prototype.ClientError = function(ret) {  // 'ret' must always be the first parameter - always return the expression's result through it!
		ret.set_string(clientError);
	};
	
	Exps.prototype.RoomPropsList = function(ret) {
		ret.set_string(roomPropsList);
	};
	
	Exps.prototype.MyPlayerIDinRoom = function(ret) {
		ret.set_int(myActorIDinRoom);
	};
	
	Exps.prototype.PlayerJoinedID = function(ret) {
		ret.set_int(joinedActorNumber);
	};
	
	Exps.prototype.PlayerJoinedName = function(ret) {
		ret.set_string(joinedActorName);
	};
	
	Exps.prototype.PlayerRetiredID = function(ret) {  //PROBLEM WITH REPEATED TRIGGERS REWRITE retiredPlayerNumberName TOO FAST
		ret.set_int(retiredActorNumber);
	};
	
	Exps.prototype.PlayerRetiredName = function(ret) {
		ret.set_string(retiredActorName);
	};
	
	Exps.prototype.LastSenderIDby = function(ret, eventcode) {
		ret.set_int( myArrayLastSenderIDs[eventcode] );
	};
	
	Exps.prototype.LastMessageBy = function(ret, eventcode) {
		ret.set_any( myArrayLastEventValues[eventcode] );
	};
	
	pluginProto.exps = new Exps();
	
}()); // \enclosing immediate execution function
