function GetPluginSettings()
{
	return {
		"name":			"PeerJS",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"rojo_PeerJS",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"<appears at the bottom of the insert object dialog>",
		"author":		"<your name/organisation>",
		"help url":		"http://peerjs.com/docs/#api",
		"category":		"Web",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
//AddNumberParam("Number", "Enter a number to test if positive.");

AddCondition(0, cf_trigger, "On peer open", "Peer", "On peer open", "On peer connected to PeerServer Cloud service.", "onPeerOpen");
AddCondition(1, cf_trigger, "On peer error", "Peer", "On peer error", "On peer error.", "onPeerError");
AddCondition(2, cf_trigger, "On connection recieved", "Connection", "On connection recieved", "The connection needs to be tagged to save.", "onConnectionRecieved");
AddCondition(3, cf_trigger, "On connection open", "Connection", "On connection open", "On connection open.", "onConnectionOpen");
AddCondition(4, cf_trigger, "On data recieved", "Connection", "On connection data recieved", "On data recieved.", "onData");
AddCondition(5, cf_trigger, "On connection closed", "Connection", "On connection closed", "On connection closed.", "onConnectionClose");
AddCondition(6, cf_trigger, "On connection error", "Connection", "On connection error", "On connection error.", "onConnectionError");

AddStringParam("id", "ID of connected peer.");
AddCondition(7, cf_none, "Connection is open", "Connection", "Connection {0} is open", "Connection is open.", "connectionOpen");

AddCondition(8, cf_none, "PeerJS is supported", "PeerJS", "PeerJS is supported", "PeerJS is supported.", "peerjsSupported");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("server", "Server adress");
AddStringParam("id", "ID to use.  Leave blank to have a unique one assigned");
AddAction(0, af_none, "Initialize Peer", "Peer", "Initialize Peer on server {0} with id {1}", "Connect to server.", "initPeer");

AddAction(1, af_none, "Close Peer", "Peer", "Close Peer", "Closing will prevent any more connections.", "closePeer");

AddStringParam("id", "Peer to try to connect to.");
AddAction(2, af_none, "Connect to peer", "Connection", "Connect to peer {0}", "Connect to peer.", "connectPeer");

AddStringParam("id", "Peer to disconnect from.");
AddAction(3, af_none, "Close connection", "Connection", "Close connection with peer {0}", "Close a connection.", "closeConnection");

AddStringParam("id", "ID of connected peer.");
AddStringParam("data", "Text data to send.");
AddAction(4, af_none, "Send data", "Connection", "Send {1} to connection {0}", "Send data.", "sendData");

//AddStringParam("peerID", "Id of connected peer.");
//AddAction(5, af_none, "Assign new connection to tag", "Connection", "Assign new connection to tag {0}", "Any connection not assigned to a tag will be dropped.", "assignTag");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "Number of connections", "Info", "numConnections", "Return the number of connections.");
AddExpression(1, ef_return_string, "My peer ID", "Info", "myId", "Return the peer ID. This is so other peers can connect to this one.");
AddNumberParam("index", "Index of connected peer", "index");
AddExpression(2, ef_return_string, "ID of nth connection", "Info", "nthConnection", "Last connection tag.");
AddExpression(3, ef_return_string, "Last data recieved", "trigger", "lastData", "Last data recieved.");
AddExpression(4, ef_return_string, "Last connection ID", "trigger", "lastId", "Last connection ID.");
AddExpression(5, ef_return_string, "Last error", "trigger", "lastError", "Last error.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
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
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}