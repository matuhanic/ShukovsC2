function GetPluginSettings()
{
	return {
		"name": "PhotonCloudD",
		"id": "PhotonCloudD",
		"version": "1.0",
		"description": "Allows you to send messages between players via PhotonCloud.",
		"author": "Deko",
		"help url": "http://www.scirra.com/forum",
		"category": "Web",
		"type": "object",
		"rotatable": false,
		"flags": pf_singleglobal,
		"dependency": "Photon-Javascript_SDK.js" //Construct 2 will copy it out when exporting the project, also automatically insert a script tag in to the HTML page.
	};
};


AddCondition(0, cf_trigger, "On connected", "PhotonCloud", "On connected", "Triggered when you are connected to the Master Server. Clients can't interact with each other in this 'Lobby'.", "ConnectedToMasterOK");
AddCondition(1, cf_trigger, "On error", "PhotonCloud", "On error", "Triggered if client error occures (use ClientError expression to get the string).", "OnError");
AddCondition(2, cf_trigger, "On room list update", "PhotonCloud", "On RoomList update", "Every room list update, I assemble a string with the custompropertytext of each room (each custompropertytext have names of all players in a room, and is updated when onJoinRoom and QuitGame occures) .Use RoomPropsList expression to get the string.", "OnRoomListUpdate");
AddCondition(3, cf_trigger, "On join room", "PhotonCloud", "On join room", "Triggered when my player joins a room (it is not triggered when other player join).", "OnJoinRoom");
AddCondition(4, cf_trigger, "On player join", "PhotonCloud", "On player join", "Triggered when a player joins the room (use the expressions PlayerJoinedID, PlayerJoinedName).", "OnActorJoin");
AddCondition(5, cf_trigger, "On player leave", "PhotonCloud", "On player leave", "Triggered when a player leaves the room (use the expressions PlayerRetiredID, PlayerRetiredName)", "OnActorLeave");
	AddNumberParam("Event number", "Event identified by number (You can set a global number with any name and use it here).", "1");
AddCondition(6, cf_trigger, "On message by event", "PhotonCloud", "On event <b>{0}</b>", "Triggered when a message from a especific event is received (use LastMessageBy expression to get the string).", "OnEventBy");

	AddStringParam("Nickname", "Name of my player (It is just a text property of my player that can be set at anytime). Can be retrieved in rooms using PlayerJoinedName and PlayerRetiredName. (It is required to assemble RoomPropsList expression)", "text");
AddAction(0, af_none, "Set name", "PhotonCloud", "Set my name: <i>{0}</i>", "Set the name of my player on PhotonCloud (It can be set at anytime, is better to set it before join in any room).", "SetName");
	AddNumberParam("Max players for new room", "If no random match found (unsuccessful matchmaking) then creates a room with the especified max players. (0 creates a room without limit of players)", "2");
AddAction(1, af_none, "New Game", "PhotonCloud", "Try a New Game ({0} players game)", "Joins a random available room / Creates a new room on the server and join (the server will assign a GUID as name to the room).", "NewGame");
	AddComboParamOption("Room remain open");
	AddComboParamOption("Close room");
	AddComboParam("Quit game and", "A room exists while it have at least one player in it; if you don't close the room any other player can join.", 1);
AddAction(2, af_none, "Quit Game", "PhotonCloud", "Quit from current Game ({0}).", "Leaves room and connects to master server if not connected.", "QuitGame");
	AddNumberParam("Event", "Number of the Event to raise. (You can set a global number with any name and use it here)", "1");
	AddAnyTypeParam("Content", "Message to send to others/all players", "0");
	AddComboParamOption("To Others");
	AddComboParamOption("To All");
	AddComboParam("Receivers", "Others: Anyone else gets my event. All: Everyone in the current room (including this peer) will get this event.", 0);
AddAction(3, af_none, "Send message by event", "PhotonCloud", "Send <b>{0}</b>: <i>{1}</i> ({2})", "Send a message enumerated. Since each event is identified by a number. Although you can make a game using just the 'event 1' for all the messages.", "RaiseEventBy");

AddExpression(0, ef_return_string, "Get client error", "PhotonCloud", "ClientError","Get the error message, if client error occures e.g. '1004:Master peer error timeout'");
AddExpression(1, ef_return_string, "Get room customproperties(names) listed", "PhotonCloud", "RoomPropsList", "Get a string that looks like: 'blue;green|red;black|yellow' ");
AddExpression(2, ef_return_number, "Get my current player ID", "PhotonCloud", "MyPlayerIDinRoom", "Get the current ID number of my player. My ID changes in each room. When a player creates a room obtains the playerID=1, the second player ID=2,...");
AddExpression(3, ef_return_number, "Get player joined ID", "PhotonCloud", "PlayerJoinedID", "Get the ID number of the player that join");
AddExpression(4, ef_return_string, "Get player joined name", "PhotonCloud", "PlayerJoinedName", "Get the name of the player that join");
AddExpression(5, ef_return_number, "Get player retired ID", "PhotonCloud", "PlayerRetiredID", "Get the ID number of the player that left");
AddExpression(6, ef_return_string, "Get player retired name", "PhotonCloud", "PlayerRetiredName", "Get the name of the player that left");
	AddNumberParam("EventNum", "Number of event sender (You can set a global number with any name and use it here)", "1");
AddExpression(7, ef_return_number, "Get last senderID by event", "PhotonCloud", "LastSenderIDby", "Get the ID number of the sender (of the especified event). You can set a global number with any name and use it here");
	AddNumberParam("EventNum", "Number of event sender (You can set a global number with any name and use it here)", "1");
AddExpression(8, ef_return_any, "Get last message by event", "PhotonCloud", "LastMessageBy", "Get the most recent message received (by especified event). You can set a global number with any name and use it here");

ACESDone();


var property_list = [
];

function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}
IDEInstance.prototype.OnInserted = function()
{
}
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}