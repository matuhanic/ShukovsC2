function GetPluginSettings()
{
    return {
        "name": "Roguelike", // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id": "Roguelike", // this is used to identify this plugin and is saved to the project; never change it
        "version": "1.0", // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description": "Interface to rot.js roguelike library",
        "author": "Darko Draskovic",
        "help url": "<your website or a manual entry on Scirra.com>",
        "category": "General", // Prefer to re-use existing categories, but you can set anything here
        "type": "world", // either "world" (appears in layout and is drawn), else "object"
        "rotatable": true, // only used when "type" is "world".  Enables an angle property on the object.
        "dependency": "rot.min.js",
        "flags": 0						// uncomment lines to enable flags...
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
}
;

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

AddCondition(0, cf_looping, "For each map cell", "Roguelike", "For each map cell",
        "Repeat the event for each map cell.", "ForEachCell");

AddCondition(2, cf_looping, "For each visible map cell", "Roguelike", "For each visible map cell",
        "Repeat the event for each visible map cell.", "ForEachVisible");

AddCondition(3, cf_looping, "For each map cell on path", "Roguelike", "For each map cell on path",
        "Repeat the event for each map cell on the path.", "ForEachPath");

AddCondition(7, cf_looping, "For each room (Digger/Uniform)", "Roguelike", "For each room in map", "Repeat the event for each room in the map.", "ForEachRoom");
AddNumberParam("Room index", "The room position in the array of rooms.", "0");
AddCondition(8, cf_looping, "For each door (Digger/Uniform)", "Roguelike", "For each door of room <b>{0}</b>", 
        "Repeat the event for each door of the indicated room.", "ForEachDoorOfRoomAt");

AddStringParam("Map cell coords", "The map cell coords of the char to test.");
AddCmpParam("Comparison", "Test if the character is equal to a text.");
AddAnyTypeParam("Value", "The text to compare to.");
AddCondition(1, cf_none, "Compare map cell char", "Roguelike", "Char at <b>{0}</b> {1} <b>{2}</b>", "Compare the char at map coordinates.", "CompareChar");

AddCondition(6,	cf_trigger, "On map generated", "Roguelike", "On map generated", "Triggered when the map is generated", "OnMapGenerated");
AddCondition(5,	cf_trigger, "On FOV computed", "Roguelike", "On FOV computed", "Triggered when the FOV is computed", "OnFOVComputed");
AddCondition(4,	cf_trigger, "On path computed", "Roguelike", "On path computed", "Triggered when the path is computed", "OnPathComputed");

// cnd #8



////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name


AddNumberParam("Width", "width of the map");
AddNumberParam("Height", "height of the map");
AddComboParamOption("DungeonDigger");
AddComboParamOption("DungeonUniform");
AddComboParamOption("DungeonRogue");
AddComboParamOption("Arena");
AddComboParam("Dungeon type", "The type of the dungeon to generate", 0)
AddNumberParam("Room width min (Digger/Uniform)", "min width of the room", "4");
AddNumberParam("Room width max (Digger/Uniform)", "max width of the room", "8");
AddNumberParam("Room height min (Digger/Uniform)", "min height of the room", "4");
AddNumberParam("Room height max (Digger/Uniform)", "max height of the room", "8");
AddNumberParam("Corridor length min (Digger/Uniform)", "min length of the corridor", "4");
AddNumberParam("Corridor length max (Digger/Uniform)", "max length of the corridor", "8");
AddNumberParam("Room dug percentage (Digger/Uniform)", "algorithm stops after this fraction of map area has been filled with rooms", "0.2");
AddAction(0, af_none, "Generate Dungeon Map", "Roguelike", "Generate {0} x {1} dungeon map", 
        "Generate a walls/solids(\"#\")&floors/passables(\".\") map of and store it as a hashmap (e.g. \"12,4\" : \"#\").", "GenerateDungeon");

AddNumberParam("Width", "width of the map");
AddNumberParam("Height", "height of the map");
AddNumberParam("Probability ", "Set all cells to \"alive\" with a given probability (0 = no cells, 1 = all cells)", "0.9");
AddNumberParam("Number of generations", "Number of cells life turns", "49");
AddStringParam("born", "Single space sepated num text; when an empty cell has this number of neighbors, a new cell is born" , "\"4 5 6 7 8\"");
AddStringParam("survive", "Single space sepated num text; when an existing cell has this number of neighbors, it will survive into next iteration" 
        , "\"2 3 4 5\"");
AddAction(4, af_none, "Generate Cellular Map", "Roguelike", "Generate {0} x {1} cellular map", 
        "Generate a walls/solids(\"#\")&floors/passables(\".\") map of and store it as a hashmap (e.g. \"12,4\" : \"#\").", "GenerateCellular");

AddNumberParam("Width", "width of the map");
AddNumberParam("Height", "height of the map");
AddComboParamOption("Divided");
AddComboParamOption("Icey");
AddComboParamOption("Eller");
AddComboParam("Maze type", "The type of the maze to generate", 0)
AddNumberParam("Regularity (Icey)", "an integer value; 0 = most random", "1");
AddAction(5, af_none, "Generate Maze Map", "Roguelike", "Generate {0} x {1} maze map", 
        "Generate a walls/solids(\"#\")&floors/passables(\".\") map of and store it as a hashmap (e.g. \"12,4\" : \"#\").", "GenerateMaze");

AddNumberParam("X", "X map coordinate.");
AddNumberParam("Y", "Y map coordinate.");
AddStringParam("Ch", "Character to put in the (X, Y) cell of the map.");
AddAction(1, af_none, "Put character", "Roguelike", "Put {2} in cell {0} x {1}", "Put a character in the map cell", "PutCharacter");

AddNumberParam("X", "X map coordinate of the FOV center.");
AddNumberParam("Y", "Y map coordinate of the FOV center.");
AddNumberParam("r", "Radius of the FOV.");
AddAction(2, af_none, "Compute FOV", "Roguelike", "Compute the FOV centered at ({0},{1}) with a distance of {2}", 
        "Calculates a set coordinates, visible from a starting place", "ComputeFOV");

AddNumberParam("SourceX", "Path start X map coordinate.");
AddNumberParam("SourceY", "Path start Y map coordinate.");
AddNumberParam("TargetX", "Path end X map coordinate.");
AddNumberParam("TargetY", "Path end Y map coordinate.");
AddAction(3, af_none, "Compute path", "Roguelike", "Compute the path from ({0},{1}) to ({2}, {3})", 
        "Calculates a path", "ComputePath");

AddNumberParam("Seed", "The random number generator seed.");
AddAction(6, af_none, "Set seed", "Roguelike", "Set RNG seed to {0}", 
        "Sets the random number generator seed", "SetSeed");

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
AddNumberParam("X", "X map coordinate");
AddNumberParam("Y", "Y map coordinate");
AddExpression(0, ef_return_string, "Get character", "Roguelike", "getCharacter", "Get the chararcter stored in a map cell.");

AddStringParam("Cell coordinates", "Map cell coordinates; e.g. \"12,4\".");
AddExpression(1, ef_return_number, "Parse X", "Roguelike", "parseX", "Get int X in a coordinate string x + \",\" + y.");

AddStringParam("Cell coordinates", "Map cell coordinates; e.g. \"12,4\".");
AddExpression(2, ef_return_number, "Parse Y", "Roguelike", "parseY", "Get int Y in a coordinate string x + \",\" + y.");

AddExpression(3, ef_return_number, "CellCount", "Roguelike", "CellCount", "Get the number of map cells.");

AddExpression(4, ef_return_string, "CurrentCoordinates", "Roguelike", "CurrentCoordinates", "Get the current map cell coordinates in a for-each loop.");

AddExpression(5, ef_return_string, "CurrentCharacter", "Roguelike", "CurrentCharacter", "Get the current map cell character in a for-each loop.");

AddStringParam("Coordinates", "map coordinate as a \"x,y\" string (e.g. \"12,34\")");
AddExpression(6, ef_return_number, "CellVisibility", "Roguelike", "CellVisibility", "Get the visibility (0...1) of the map cells.");

AddExpression(7, ef_return_number, "Current room index (Digger)", "Roguelike", "CurRoomInd", "Get the current room index in a For Each Room loop.");

AddNumberParam("Index", "Index of the room");
AddStringParam("Room edge", "Accepted args: \"left\", \"right\", \"top\", \"bottom\"", "left");
AddExpression(8, ef_return_number, "Room edge (Digger)", "Roguelike", "getRoomEdge", "Get a corresponding room edge of an indicated room.");

AddExpression(9, ef_return_number, "Get number of rooms (Digger)", "Roguelike", "NumberOfRooms", "Get the number of rooms in the map.");

AddNumberParam("Index", "Index of the room");
AddExpression(10, ef_return_number, "Room center X (Digger/Uniform)", "Roguelike", "RoomCenterX", "Get the X center coordinate of an indicated room.");
AddNumberParam("Index", "Index of the room");
AddExpression(14, ef_return_number, "Room center Y (Digger/Uniform)", "Roguelike", "RoomCenterY", "Get the Y center coordinate of an indicated room.");

AddExpression(11, ef_return_number, "Current door X", "Roguelike", "CurDoorX", "Get the current door X coordinate.");
AddExpression(12, ef_return_number, "Current door Y", "Roguelike", "CurDoorY", "Get the current door Y coordinate.");

AddExpression(13, ef_return_number, "Current seed", "Roguelike", "Seed", "Retrieve the current seed.");

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
    new cr.Property(ept_integer, "My property", 77, "An example property.")
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
IDEObjectType.prototype.CreateInstance = function (instance)
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
IDEInstance.prototype.OnInserted = function ()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function ()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function (property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function (renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function (renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function (renderer)
{
}