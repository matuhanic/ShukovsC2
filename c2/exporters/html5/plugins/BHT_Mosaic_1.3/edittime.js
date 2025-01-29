function GetPluginSettings()
{
	return {
		"name":			"BHT Mosaic",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"bht_mosaic",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.3",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Double-side mosaic tile manager",
		"author":		"Black Hornet Technologies",
		"help url":		"www.blackhornettechnologies.com",
		"category":		"Graphics",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
						| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
						| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
						| pf_effects			// allow WebGL shader effects to be added
						| pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
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

AddCondition(0, cf_trigger, "On all finished", "Mosaic", "On animation finished", "Triggered when all animations/rotations have finished.", "OnAllFinished");
AddCondition(1, cf_none, "Is animation running", "Mosaic", "Animation is running", "Check if the animation is running.", "IsAnimationRunning");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// General actions
AddNumberParam("Columns", "Number of columns in mosaic" , "1");
AddNumberParam("Rows", "Number of rows in mosaic" , "1");
AddAction(0, af_none, "Set grid dimensions", "Mosaic", "Mosaic is a grid: {0}x{1}", "Set the grid dimensions for the mosaic.", "SetGridDimensions");

AddAction(1, af_none, "Synchronize sizes", "Mosaic", "Synchronize the cells and resize to current dimensions.", "Clear and reset the internal cells to the current size of the object and camera settings.", "Empty");

AddNumberParam("Zcam", "Zcam offset" , "2");
AddAction(2, af_none, "Zcam", "Mosaic", "Set the Zcam offset to {0}.", "Set the Zcam offset value used to alter the depth of the rotation in the z-axis. Min: 0.1", "SetZcam");

AddNumberParam("Camera width", "Camera width");
AddNumberParam("Camera height", "Camera height");
AddAction(3, af_none, "Set camera size", "Mosaic", "Set the camera size to ({0}, {1})", "Set the camera window size. This should be the same size as the texture, for 1:1 mapping.", "SetCameraSize");

AddObjectParam("Front texture", "Use the texture of the first picked object for the 'front' of the mosaic.");
AddAction(4, af_none, "Set front texture", "Mosaic", "Set the front texture to: {0}", "Set the 'front' texture for the mosaic.", "SetFrontTexture");

AddObjectParam("Back texture", "Use the texture of the first picked object for the 'back' of the mosaic.");
AddAction(5, af_none, "Set back texture", "Mosaic", "Set the back texture to: {0}", "Set the 'back' texture for the mosaic.", "SetBackTexture");

AddAction(6, af_none, "Run", "Mosaic", "Run the animation/rotations", "Run all of the animations/rotations.", "RunAnimation");
AddAction(7, af_none, "Stop", "Mosaic", "Stop the animation", "Stop the animation.", "StopAnimation");
AddAction(8, af_none, "Refresh", "Mosaic", "Refresh the current texture.", "Refresh the current texture to any changes made to the cells.", "Refresh");

// Cell based actions
AddNumberParam("Column", "Cell column", "0");
AddNumberParam("Row", "Cell row", "0");
AddNumberParam("Front index", "Index of the cell's front texture", "0");
AddNumberParam("Back index", "Index of the cell's back texture", "0");
AddNumberParam("Rate", "The rotation rate, in degrees-per-second", "0");
AddComboParamOption("X-axis");
AddComboParamOption("Y-axis");
AddComboParam("Rotation axis", "The axis to rotate around: X-axis or Y-axis", 0);
AddNumberParam("Target", "The target angle that is consideded 'done'", "0");
AddNumberParam("Delay", "Delay until the rotation starts, in milliseconds", "0");
AddAction(50, af_none, "Set cell parameters", "Mosaic Cell", "Set cell parameters({0}, {1}) to front={2}, back={3}, rate={4} deg/sec, rot-axis={5}, target={6} deg, delay={7}ms. Use (-1,-1) to set all at once!", "Set up the cell parameters for the animation.", "SetCellParameters");

AddNumberParam("Column", "Cell column", "0");
AddNumberParam("Row", "Cell row", "0");
AddNumberParam("Front index", "Index of the cell's front texture", "0");
AddNumberParam("Back index", "Index of the cell's back texture", "0");
AddNumberParam("Rate", "The rotation rate, in degrees-per-second", "0");
AddNumberParam("Rotation axis", "The axis to rotate around: 1 for X-axis or 2 for Y-axis", "1");
AddNumberParam("Target", "The target angle that is considered 'done'", "0");
AddNumberParam("Delay", "Delay until the rotation starts, in milliseconds", "0");
AddAction(51, af_none, "Set cell parameters (explicit)", "Mosaic Cell", "Set cell parameters({0}, {1}) to front={2}, back={3}, rate={4} deg/sec, rot-axis={5}, target={6} deg, delay={7}ms.", "Set up the cell parameters for the animation.", "SetCellParametersExplicit");

AddNumberParam("Column", "Cell column", "0");
AddNumberParam("Row", "Cell row", "0");
AddAction(52, af_none, "Reset", "Mosaic Cell", "Reset the rotation for cell ({0}, {1}).", "Reset the rotation values. Use (-1,-1) to reset all at once!", "ResetCell");

AddNumberParam("Column", "Cell column", "0");
AddNumberParam("Row", "Cell row", "0");
AddObjectParam("Front texture", "Use the texture of the first picked object for the 'front' of the mosaic.");
AddAction(53, af_none, "Set cell front texture", "Mosaic Cell", "Set cell ({0},{1}) front texture to: {2}", "Set the 'front' texture for the cell. Use (-1,-1) to reset all at once!", "SetCellFrontTexture");

AddNumberParam("Column", "Cell column", "0");
AddNumberParam("Row", "Cell row", "0");
AddObjectParam("Back texture", "Use the texture of the first picked object for the 'back' of the mosaic.");
AddAction(54, af_none, "Set cell back texture", "Mosaic Cell", "Set cell ({0},{1}) back texture to: {2}", "Set the 'back' texture for the cell. Use (-1,-1) to reset all at once!", "SetCellBackTexture");

// Debug actions
AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParam("Grid", "Make the grid visible or invisible." , 0);
AddAction(900, af_none, "Grid visibility", "Mosaic", "Grid {0}.", "Set the visibility of the grid.", "SetGridVisibility");

/*
AddNumberParam("Column", "Cell column" , "0");
AddNumberParam("Row", "Cell row" , "0");
AddAction(1000, af_none, "Dump cell", "Mosaic Cell", "Dump cell({0}, {1}).", "Dump cell to console.", "CellDump");
*/
////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "Columns", "Mosaic", "Columns", "Get the number of columns in the mosaic.");
AddExpression(1, ef_return_number, "Rows", "Mosaic", "Rows", "Get the number of rows in the mosaic.");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(2, ef_return_number | ef_variadic_parameters, "Get index", "Mosaic Cell", "CellTextureIndex", "Get the cell's texture index.");

AddExpression(3, ef_return_number, "Is running", "Mosaic", "IsAnimationRunning", "Check if the animation is running.");

AddExpression(4, ef_return_number, "Zcam", "Mosaic", "Zcam", "Get the Zcam value.");
AddExpression(5, ef_return_number, "Camera width", "Mosaic", "CameraWidth", "Get the camera window width.");
AddExpression(6, ef_return_number, "Camera height", "Mosaic", "CameraHeight", "Get the camera window height.");

AddExpression(900, ef_return_number, "Is grid visible", "Mosaic", "IsGridVisible", "Check if the grid is visible.");

// Cell properties 

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(100, ef_return_number | ef_variadic_parameters, "Get front texture index", "Mosaic Cell", "CellTextureFrontIndex", "Get the cell's front texture index.");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(101, ef_return_number | ef_variadic_parameters, "Get back texture index", "Mosaic Cell", "CellTextureBackIndex", "Get the cell's back texture index.");


AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(102, ef_return_number | ef_variadic_parameters, "Get horizontal angle", "Mosaic Cell", "CellHorzAngle", "Get the cell's horizontal angle (deg).");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(103, ef_return_number | ef_variadic_parameters, "Get vertical angle", "Mosaic Cell", "CellVertAngle", "Get the cell's vertical angle (deg).");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(104, ef_return_number | ef_variadic_parameters, "Get rate", "Mosaic Cell", "CellRate", "Get the cell's rotation rate (degrees-per-second).");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(105, ef_return_number | ef_variadic_parameters, "Get rotation axis", "Mosaic Cell", "CellRotationAxis", "Get the cell's rotation axis (1-h, 2-v).");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(106, ef_return_number | ef_variadic_parameters, "Get target angle", "Mosaic Cell", "CellTargetAngle", "Get the cell's target angle (deg).");

AddNumberParam("Column","Column index","0");
AddNumberParam("Row","Row index","0");
AddExpression(107, ef_return_number | ef_variadic_parameters, "Get start delay", "Mosaic Cell", "CellDelay", "Get the cell's start delay (ms).");

AddNumberParam("X","X coordinate in the layout","0");
AddNumberParam("Y","Y coordinate in the layout","0");
AddExpression(108, ef_return_number | ef_variadic_parameters, "Get column number at point (X,Y)", "Mosaic Cell", "CellGetColumnByPoint", "Get the cell's column number gived the point at (X,Y).");

AddNumberParam("X","X coordinate in the layout","0");
AddNumberParam("Y","Y coordinate in the layout","0");
AddExpression(109, ef_return_number | ef_variadic_parameters, "Get row number at point (X,Y)", "Mosaic Cell", "CellGetRowByPoint", "Get the cell's row number gived the point at (X,Y).");

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
	new cr.Property(ept_integer,	"Columns",				"1",		"The number of columns in the mosaic."),
	new cr.Property(ept_integer,	"Rows",					"1",		"The number of rows in the mosaic."),
	new cr.Property(ept_combo,		"Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.",		"Visible|Invisible"),
	new cr.Property(ept_combo,		"Show grid",			"Show",		"Choose whether to show the grid when the layout starts.",			"Show|Hide"),
	new cr.Property(ept_float,		"Zcam",					"2.0",		"Zcam is the 'camera' offset in the Z-axis for the perpective calculation. The smaller the value, the closer the camera is to the object, and the greater the perspective. Min: 0.1"),
	new cr.Property(ept_float,		"Camera width",			"320",		"The width of the window for the default texture display."),
	new cr.Property(ept_float,		"Camera height",		"240",		"The height of the window for the default texture display."),
	new cr.Property(ept_combo,		"Hotspot",				"Top-left",	"Choose the location of the hot spot in the object.", "Top-left|Center")
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
}

IDEInstance.prototype.OnCreate = function()
{
	if (this.properties["Hotspot"] === "Top-left")
		this.instance.SetHotspot(new cr.vector2(0, 0));
	else
		this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
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
	if (property_name === "Hotspot")
	{
		if (this.properties["Hotspot"] === "Top-left")
			this.instance.SetHotspot(new cr.vector2(0, 0));
		else
			this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	}
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
    var q=this.instance.GetBoundingQuad();
	renderer.Fill(q, cr.RGB(128,128,128));
	renderer.Outline(q, cr.RGB(0,0,0));
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}

// v1.3
// 2014-08-12: added hot-spot. This is a 'breaking-change' in that the hot-spot will read incorrectly as Top-left. Change to Center to correct.

// v1.2
// 2014-04-13: wasn't setting opacity when needed

// v1.1
// 2014-02-17: fixed double-click crash.
// 2014-02-12: added 'Set cell front texture' & 'Set cell back texture'
