function GetBehaviorSettings()
{
	return {
		"name":			"EasyStar.js for Tilemap",
		"id":			"EasystarTilemap",
		"version":		"1.0",
		"description":		"Add pathfinding fonctionnalities to your Tilemaps using the EasyStar.js API.",
		"author":		"Magistross",
		"help url":		"",
		"category":		"General",
		"flags":		bf_onlyone,
		"dependency":	 	"easystar-0.1.13.js"
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
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddCondition(0, cf_trigger, "On path found", "Pathfinding", "On path <b>{0}</b> found", "Triggered when a path has been found and calculated.", "OnPathFound");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddCondition(1, cf_trigger, "On no path found", "Pathfinding", "On path <b>{0}</b> not found", "Triggered when a path can't be found.", "OnFailedToFindPath");

AddCondition(2, cf_trigger, "On any path found", "Pathfinding", "On any path found", "Triggered when any path has been found.", "OnAnyPathFound");

AddCondition(3, cf_trigger, "On any path not found", "Pathfinding", "On any path not found", "Triggered when any path can't be found.", "OnAnyPathNotFound");

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
AddAction(0, af_none, "Force calculate", "Pathfinding", "Force paths calculations", "Use this after one or many \"findpath\" directives to force them to execute immediately.", "ForceCalculate");

AddNumberParam("Start tile X", "Tile X of the starting point of the path", "0");
AddNumberParam("Start tile Y", "Tile Y of the starting point of the path", "0");
AddNumberParam("Target tile X", "Tile X of the ending point of the path", "0");
AddNumberParam("Target tile Y", "Tile Y of the ending point of the path", "0");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddAction(1, af_none, "Find path", "Pathfinding", "Find a path from <b>({0},{1})</b> to <b>({2},{3})</b> (tag <i>{4}</i>)", "Find a path between two tiles. Use \"Force calculate\" just after to make the call synchronous.", "FindPath");

AddStringParam("Tile ID list", "A semi-colon separated list of values of the walkable tile IDs", "\"\"");
AddAction(2, af_none, "Set walkable tiles", "Pathfinding", "Set tiles <b>{0}</b> walkable", "Set the walkable tile IDs. No tiles are walkable by default.", "SetWalkableTiles");

AddComboParamOption("enabled")
AddComboParamOption("disabled")
AddComboParam("Diagonal", "Allows for diagonals if enabled", 0)
AddAction(3, af_none, "Set diagonal enabled", "Pathfinding", "Set diagonal <b>{0}</b>", "Enable or disable diagonals when searching for a path.", "SetDiagonal");

AddNumberParam("Tile ID", "Tile ID to set the relative cost of", "0");
AddNumberParam("Relative cost", "The relative cost of this particular tile ID in a path. (1 is default, 0.5 is half, etc.)", "1");
AddAction(4, af_none, "Set tile cost", "Pathfinding", "Set tile ID <b>{0}</b> relative cost to <b>{1}</b>", "Set the relative cost to walk on a tile. All tiles have a default relative cost of 1.", "SetTileCost");

AddNumberParam("Tile X", "X coordinate of the tile you wish to add as an obstacle", "0");
AddNumberParam("Tile Y", "Y coordinate of the tile you wish to add as an obstacle", "0");
AddAction(5, af_none, "Add additional obstacle", "Pathfinding", "Add obstacle at <b>({0},{1})</b>", "Set tile to act as an obstacle, regardless of whether or not it is a walkable tile.", "AddObstacle");

AddNumberParam("Tile X", "X coordinate of the tile you wish to no longer act as an additional obstacle", "0");
AddNumberParam("Tile Y", "Y coordinate of the tile you wish to no longer act as an additional obstacle", "0");
AddAction(6, af_none, "Remove additional obstacle", "Pathfinding", "Remove obstacle at <b>({0},{1})</b>", "Removes an additional obstacle.", "RemoveObstacle");

AddAction(7, af_none, "Remove all additional obstacles", "Pathfinding", "Remove all additional obstacles", "Removes all additional obstacles currently added.", "RemoveAllObstacles");

AddNumberParam("Iterations per calculation", "The number of searches to perform per \"calculate\" call. -1 for maximum (synchronous calculation)", "-1");
AddAction(8, af_none, "Set iterations per calculation", "Pathfinding", "Set iterations per calculation to <b>{0}</b>", "Change the iterations per calculation parameter.", "SetIterationsPerCalculation");

AddAction(9, af_none, "Cancel pending path jobs", "Pathfinding", "Cancel pending path jobs", "Abort all path jobs not yet fully calculated.", "CancelPendingPath");

AddComboParamOption("walkable")
AddComboParamOption("non-walkable")
AddComboParam("Empty tile is", "Set empty tiles as walkable or non-walkable.", 0)
AddAction(10, af_none, "Set empty tiles walkable", "Pathfinding", "Set empty tiles as <b>{0}</b>", "Set or remove empty tiles as walkable.", "SetEmptyTileWalkable");

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
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddExpression(0, ef_return_number, "Path length", "Pathfinding", "PathLength", "Returns the length of the specified path.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddNumberParam("NodeIndex", "The 0-based index of the node you wish to retrieve.", "0");
AddExpression(1, ef_return_number, "NodeTileXAt", "Pathfinding", "NodeTileXAt", "Returns the X tile coordinate of the specified node index and path name.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddNumberParam("NodeIndex", "The 0-based index of the node you wish to retrieve.", "0");
AddExpression(2, ef_return_number, "NodeTileYAt", "Pathfinding", "NodeTileYAt", "Returns the Y tile coordinate of the specified node index and path name.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddNumberParam("NodeIndex", "The 0-based index of the node you wish to retrieve.", "0");
AddExpression(3, ef_return_number, "NodeLayoutXAt", "Pathfinding", "NodeLayoutXAt", "Returns the X layout coordinate of the specified node index and path name.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddNumberParam("NodeIndex", "The 0-based index of the node you wish to retrieve.", "0");
AddExpression(4, ef_return_number, "NodeLayoutYAt", "Pathfinding", "NodeLayoutYAt", "Returns the Y layout coordinate of the specified node index and path name.");

AddExpression(5, ef_return_string, "CurrentTag", "Pathfinding", "CurrentTag", "Returns the current tag in a \"any path\" trigger.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddNumberParam("NodeIndex", "The 0-based index of the node you wish to retrieve.", "0");
AddExpression(6, ef_return_number, "NodeCostAt", "Pathfinding", "NodeCostAt", "Returns the current cost at a specified node index and path name.");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different pathing requests.", "\"\"");
AddExpression(7, ef_return_number, "PathCost", "Pathfinding", "PathCost", "Returns the total cost of a specific path name.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_combo, "Diagonal", "enabled", "Allow diagonal in paths.", "enabled|disabled"),
	new cr.Property(ept_integer, "Iterations per calculation", "-1", "-1 for maximum synchronicity, low number for asynchronous pathfinding (slower, but won't hang the game)"),
	new cr.Property(ept_combo, "Empty tile is", "walkable", "Define how should an empty tile be considered.", "walkable|non-walkable")
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

// Class representing an individual instance of the behavior in the IDE
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
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (this.properties["Iterations per calculation"] < 0)
		this.properties["Iterations per calculation"] = -1;
}
