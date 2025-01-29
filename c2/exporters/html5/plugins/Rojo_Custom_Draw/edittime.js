function GetPluginSettings()
{
	return {
		"name":			"Custom Draw",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"customDraw",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Allows you to customize how the object is drawn.",
		"author":		"R0J0hound",
		"help url":		"https://www.scirra.com/forum/plugin-custom-draw_p1113959",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
						| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
						| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
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
				
// example				
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddAction(0, af_none, "Identity", "Matrix", "Identity Matrix", "Loads the current matrix with an identity matrix", "matIdent");

AddNumberParam("x", "Offset");
AddNumberParam("y", "Offset");
AddAction(1, af_none, "Translate", "Matrix", "Matrix Translate ({0},{1})", "Applys a translation transformation", "matTrans");

AddNumberParam("x", "Scale factor", "1");
AddNumberParam("y", "Scale factor", "1");
AddAction(2, af_none, "Scale", "Matrix", "Matrix Scale ({0},{1})", "Applys a scale transformation", "matScale");

AddNumberParam("angle", "Degrees");
AddAction(3, af_none, "Rotate", "Matrix", "Matrix Rotate ({0})", "Applys a rotation transformation", "matRotate");

AddNumberParam("x", "Shear amount in degrees");
AddNumberParam("y", "Shear amount in degrees");
AddAction(4, af_none, "Shear", "Matrix", "Matrix Shear ({0},{1})", "Applys a shear transformation", "matShear");

AddAction(5, af_none, "Push", "Matrix", "Matrix Push", "Pushes the current matrix to the stack", "matPush");
AddAction(6, af_none, "Pop", "Matrix", "Matrix Pop", "Pops a matrix from the stack to the current matrix", "matPop");

AddStringParam("JSON", "JSON string", "\"\"");
AddAction(7, af_none, "Load", "Matrix", "Matrix Load from JSON: {0}", "Load the matrix from a JSON string", "matLoad");


AddObjectParam("Sprite", "Use texture from this");
AddAction(10, af_none, "Load texture from sprite", "Texture", "Load texture from sprite {0}", "Loads the current animation frame of a sprite", "setTexFromSprite");

AddNumberParam("x", "Position from object center");
AddNumberParam("y", "Position from object center");
AddAction(12, af_none, "Add Vertex XY", "Vertex List", "Vertex XY ({0}, {1})", "Adds a vertex to a list", "vertexXY");

// AddNumberParam("U", "Position (0.0 to 1.0) on texture");
// AddNumberParam("V", "Position (0.0 to 1.0) on texture");
// AddAction(13, af_none, "Vertex UV", "Vertex List", "Vertex UV ({0}, {1})", "Sets UV of last vertex.  By default the uv coordinantes from the sprite are used.  This isn't used fot the draw points action.", "vertexUV"); //not used for points

AddNumberParam("x", "Position from object center");
AddNumberParam("y", "Position from object center");
AddNumberParam("U", "Position (0.0 to 1.0) on texture");
AddNumberParam("V", "Position (0.0 to 1.0) on texture");
AddAction(18, af_none, "Add Vertex XYUV", "Vertex List", "Vertex XY ({0}, {1}) and UV ({2},{3})", "Adds a vertex to a list", "vertexXYUV");

AddNumberParam("left", "Position");
AddNumberParam("top", "Position");
AddNumberParam("right", "Position", "1");
AddNumberParam("bottom", "Position", "1");
AddAction(19, af_none, "Add rectangle", "Vertex List", "Add Rect ({0}, {1}), ({2},{3})", "Adds four vertices for a rectangle.", "addRect");

AddNumberParam("left", "Position (0 to 1)");
AddNumberParam("top", "Position (0 to 1)");
AddNumberParam("right", "Position (0 to 1)", "1");
AddNumberParam("bottom", "Position (0 to 1)", "1");
AddAction(20, af_none, "Set sub-texture from rectange", "Texture", "Set sub-texture rectangle ({0}, {1}), ({2}, {3})", "Sets the sub-texture rectange", "setTexSubRect");

AddNumberParam("x count", "Number of tiles","1");
AddNumberParam("y count", "Number of tiles","1");
AddNumberParam("tile", "Tile number","0");
AddAction(21, af_none, "Set sub-texture from grid", "Texture", "Set sub-texture from grid ({0}, {1}) index {2}", "Sets the sub-texture from a grid", "setTexSubGrid");

AddNumberParam("mirror", "0 or 1");
AddNumberParam("flip", "0 or 1");
AddNumberParam("rot", "0 to 3");
AddAction(22, af_none, "Set sub-texture orientation", "Texture", "Set sub-texture orient to mirror:{0}, flip:{1} and rot:{2})", "Set sub-texture orientation", "setTexSubOrient");


AddNumberParam("size", "Size of particles.", "1");
AddAction(14, af_none, "Set point size", "Draw", "Set point size {0}", "Set the point size in pixels.", "setPointSize"); //size clamped

AddComboParamOption("Quads");
AddComboParamOption("Points");
AddComboParam("Type", "How the vertices are drawn.  Quads will use every four vertices as a quad.");
AddAction(15, af_none, "Draw", "Draw", "Draw {0}", "Draws the list of vertices and makes the vertex list empty", "drawElements");

AddAction(16, af_none, "Clear vertex list", "Vertex List", "Clear vertex list", "List is normally cleared every frame and after the draw action", "clearVertList");
AddAction(17, af_none, "Clear drawing", "Draw", "Clear drawing", "Clears any draw actions do this frame. This is automatically done when drawing during a new frame", "clearDrawing");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Matrix as JSON", "Matrix", "matrixAsJSON", "Return the current Matrix as a JSON string.");

AddNumberParam("x", "Position from object center");
AddNumberParam("y", "Position from object center");
AddExpression(1, ef_return_number, "Get transformed X", "Matrix", "getTransformedX", "Transforms a point with the current matrix.");
AddNumberParam("x", "Position from object center");
AddNumberParam("y", "Position from object center");
AddExpression(2, ef_return_number, "Get transformed Y", "Matrix", "getTransformedY", "Transforms a point with the current matrix.");

AddNumberParam("index", "Index 0 to 3 of texture coordinants");
AddExpression(3, ef_return_number, "Sprite texture U", "Texture", "textureU", "Get the u texture coordinant of one of the four corners of a sprite texture.");
AddNumberParam("index", "Index 0 to 3 of texture coordinants");
AddExpression(4, ef_return_number, "Sprite texture V", "Texture", "textureV", "Get the u texture coordinant of one of the four corners of a sprite texture.");

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
	var q=this.instance.GetBoundingQuad();
	renderer.Fill(q, cr.RGB(224, 224, 224));
	renderer.Outline(q, cr.RGB(0,0,0))
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}