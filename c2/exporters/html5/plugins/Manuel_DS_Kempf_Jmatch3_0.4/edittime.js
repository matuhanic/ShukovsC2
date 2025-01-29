function GetPluginSettings()
{
	return {
		"name":			"jMatch3",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"pix_jmatch3",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Handles the logic of a match-3 game. Based on the jMatch3 lib created by Cyrille Bogaert.",
		"author":		"Manuel D.S. Kempf",
		"help url":		"http://www.pixelrebirth.net/plugins",
		"category":		"Data & Storage",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0,
		"dependency":	"jmatch3.js;"
					
					// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
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
AddNumberParam("X", "X coordinate to check.");
AddNumberParam("Y", "Y coordinate to check.");
AddCondition(0, cf_none, "Coordinates in grid", "General", "{0},{1} coordinates are in the grid", "True if given coordinates are in the grid.", "CoordsInGrid");
AddCondition(1, cf_looping, "For each piece", "General", "For each piece of the grid", "Loop through every piece of the grid.", "ForEachPiece");
AddCondition(2, cf_looping, "For each match", "General", "For each match", "Loop through every match.", "ForEachMatch");
AddNumberParam("First X", "X coordinate of the first piece to check.");
AddNumberParam("First Y", "Y coordinate of the first piece to check.");
AddNumberParam("Second X", "X coordinate of the second piece to check.");
AddNumberParam("Second Y", "Y coordinate of the second piece to check.");
AddCondition(3, cf_none, "Is adjacent to", "General", "Piece {0},{1} is adjacent to {2},{3}", "True if piece at given coordinates is adjacent.", "isAdjacent");
AddCondition(4, cf_none, "Matches are available", "General", "Matches are available", "True if there are matches in the grid.", "MatchAvail");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Debug (console)", "Misc", "Debug (console)", "Show debug information in the browser console.", "DebugConsole");
AddNumberParam("X", "Enter the x coordinate of the piece.")
AddNumberParam("Y", "Enter the y coordinate of the piece.")
AddStringParam("Type", "Enter the type to set the piece to.")
AddAction(1, af_none, "Set piece type", "General", "Set piece at {0},{1} to type {2}", "Set the type of a piece in the grid.", "SetPieceType");
AddNumberParam("X", "Enter the x coordinate of the piece.")
AddNumberParam("Y", "Enter the y coordinate of the piece.")
AddAction(2, af_none, "Clear piece", "General", "Clear piece at {0},{1}", "Clear the type of a piece by resetting it to void.", "ClearPiece");
AddAction(3, af_none, "Clear matches", "General", "Clear matches", "Destroy all matches and update the grid.", "ClearMatches");
AddAction(4, af_none, "Apply gravity", "General", "Apply gravity", "Apply gravity to fall down your pieces.", "ApplyGravity");
AddNumberParam("First X", "Enter the x coordinate of the first piece to swap.")
AddNumberParam("First Y", "Enter the y coordinate of the first piece to swap.")
AddNumberParam("Second X", "Enter the x coordinate of the second piece to swap.")
AddNumberParam("Second Y", "Enter the y coordinate of the second piece to swap.")
AddAction(5, af_none, "Swap pieces", "General", "Swap piece {0},{1} and piece {2},{3}", "Swap two pieces.", "SwapPieces");
AddStringParam("Type", "Enter the type to use the log symbol for.")
AddStringParam("Symbol", "Enter the log symbol you want to use.")
AddAction(6, af_none, "Set log symbol", "Debug", "Set log symbol {1} for type {0}", "Set log symbol for debugging.", "LogSymbol");
AddComboParamOption("right")
AddComboParamOption("down")
AddComboParamOption("left")
AddComboParamOption("up")
AddComboParam("Direction", "Enter the new gravity direction.")
AddAction(7, af_none, "Set gravity direction", "General", "Set gravity direction to {0}", "Set the gravity direction.", "SetGravity");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_number, "Get width", "General", "Width", "Return the width of the game grid.");
AddExpression(1, ef_return_number, "Get height", "General", "Height", "Return the height of the game grid.");
AddExpression(2, ef_return_string, "Get gravity direction", "General", "Gravity", "Return the gravity direction.");
AddExpression(3, ef_return_number, "Get gravity direction as number", "General", "GravityNumber", "Return the gravity direction as number (0 for right, 1 for down, 2 for left, 3 for up).");
AddNumberParam("X", "The X index (0-based) of the piece type to get.", "0");
AddNumberParam("Y", "The Y index (0-based) of the piece type to get.", "0");
AddExpression(4, ef_return_string, "Get piece type", "General", "Piece", "Return the piece type at given coordinates.");
AddExpression(5, ef_return_number, "Get current X index", "General", "CurX", "Return the current X index.");
AddExpression(6, ef_return_number, "Get current Y index", "General", "CurY", "Return the current Y index.");
AddExpression(7, ef_return_string, "Get current piece type", "General", "CurPiece", "Return the current piece type.");
AddExpression(8, ef_return_any, "Get current match length", "General", "CurMatchLength", "Return the length of the current match.");
AddExpression(9, ef_return_string, "Get current match type", "General", "CurMatchType", "Return the type of the current match.");
AddExpression(10, ef_return_number, "Get last adjacent direction", "General", "AdjDir", "Return the last adjacent direction as number.");

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
	new cr.Property(ept_integer, 	"Width",		10,		"The width of the game grid."),
	new cr.Property(ept_integer,	"Height",		10,		"The height of the game grid."),
	new cr.Property(ept_combo,		"Gravity",		"down",	"The gravity direction.", "right|down|left|up")
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