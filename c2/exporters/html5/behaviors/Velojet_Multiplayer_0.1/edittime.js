function GetBehaviorSettings()
{
	return { 
		"name":			   "MultiPlayer",
		"id":			     "MultiPlayer",
		"version":		 "0.1",
		"description": "Enables an object to participate in a multiplayer game",
		"author":		   "Velojet",
		"help url":		 "http://www.scirra.com",
		"category":		 "General",
		"flags":		    bf_onlyone
	};
};


// Conditions //////////////////////////////////////////////////////////
//
// AddCondition(id,			// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//											// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,		// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,	// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,	// appears in event wizard dialog when selected
//				script_name);	// corresponding runtime function name

AddCondition(0, 0, "New web player has joined", "", "{my}: New web player has joined", "True when a new web player has joined", "WebPlayerJoined");
AddCondition(1, 0, "Web player has been updated", "", "{my}: Web player has been updated", "True when a web player has been updated", "WebPlayerUpdated");
AddCondition(2, 0, "On collision with another player", "", "{my}: On collision with another player", "Triggered when my player collides with a web player", "MyPlayerCollided");
AddCondition(3, 0, "Web player/s to be created", "", "{my}: Web player/s to be created", "True when there are Web players to be created", "WebPlayersToMake");
AddCondition(4, 0, "On moved", "", "{my}: On moved", "True when my player has moved", "MyPlayerMoved");
AddCondition(5, 0, "Web player has left", "", "{my}: Web player has left", "True when a web player has left", "WebPlayerLeft");
AddCondition(6, 0, "Game server is ready", "", "{my}: Game server is ready", "True when the game server is ready", "ServerReady");



// Actions /////////////////////////////////////////////////////////////

AddNumberParam("ID", "Obtain the Web player's UID");
AddAction(0, 0, "Set web player's ID", "", "{my}: Set web player's ID", "Set the web player's ID", "SetWebPlayerID");
AddAction(1, 0, "Initialise data of web player to create", "", "{my}: Initialise data of web player to create", "Initialise data of web player to create", "InitWebPlayerData");



// Expressions /////////////////////////////////////////////////////////

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,					// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//												// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 category,			// category in expressions panel
//				 exp_name,			// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "Get X co-ordinate of web player", "MultiPlayer", "WebPlayerX", "The current X co-ordinate of web player");
AddExpression(1, ef_return_number, "Get Y co-ordinate of web player", "MultiPlayer", "WebPlayerY", "The current Y co-ordinate of web player");
AddExpression(2, ef_return_number, "Get web player's UID", "MultiPlayer", "WebPlayerUID", "The web player's UID");
AddExpression(3, ef_return_number, "Get number of web players to make", "MultiPlayer", "NumWebPlayersToMake", "The number of web players to make");

AddNumberParam('UID', "player's UID (0 = my player", '0');
AddExpression(4, ef_return_number, "Get the player's server-allocated UID", "MultiPlayer", "SUID", "The player's server-allocated UID");

AddNumberParam('UID', "player's UID (0 = my player", '0');
AddExpression(5, ef_return_string, "Get the player's name", "MultiPlayer", "Name", "The player's name");

AddNumberParam('UID', "player's UID (0 = my player", '0');
AddExpression(6, ef_return_number, "Get the player's current score", "MultiPlayer", "Score", "The player's current score");

AddNumberParam('UID', "player's UID (0 = my player", '0');
AddExpression(7, ef_return_number, "Get the player's current health", "MultiPlayer", "Health", "The player's current health");

ACESDone();



// Array of property grid properties for this plugin ///////////////////
//
// new cr.Property(ept_integer,	name,	initial_value, description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value, description)		// a float value
// new cr.Property(ept_text,		name,	initial_value, description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		   description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
//
var property_list = [
	new cr.Property(ept_combo, "Default controls", "Yes", "If enabled, arrow keys control movement.  Otherwise, use the 'simulate control' action.", "No|Yes"),
	new cr.Property(ept_combo, "Auto-repeat", "No", "If enabled, arrow keys repeat if held down. Otherwise, keys need to be tapped repeatedly", "No|Yes")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Set initial value for "default controls" if empty (added r51)
	if (property_name === "Default controls" && ! this.properties["Default controls"])
		this.properties["Default controls"] = "Yes";
		
	if (property_name === "Auto-repeat" && ! this.properties["Auto-repeat"])
		this.properties["Auto-repeat"] = "No";
}
