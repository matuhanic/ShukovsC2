function GetPluginSettings()
{
	return {
		"name":			"New Scene",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"babylonNewScene",	// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Load 3DS max, Unity3D or Blender scenes into Construct 2",
		"author":		"X3M",
		"help url":		"www.x3mworks.blogspot.com",
		"category":		"Babylon3D",			// Prefer to re-use existing categories, but you can set anything here
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
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
						| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
		,"dependency": "babylon.custom.js;oimo.js;cannon.js;hand.js;babylon.objFileLoader.js"
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

// example
//AddStringParam("Message", "Enter a string to alert.");
//AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

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
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");

////////////////////////////////////////
populateCommonACE();
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
	new cr.Property(ept_section, "Engine Properties", "",	"Babylon Engine related properties."),
		new cr.Property(ept_combo, 	"Antialias",		"True",		"True if this engine should support antialiasing, false otherwise.","False|True"),
		new cr.Property(ept_combo, 	"Depthbuffer",		"True",		"Enable or disable the depth buffer.","False|True"),
		new cr.Property(ept_combo, 	"RenderEvenInBackground",		"True",		"If true, the engine will compute all frames even if the app is in background.","False|True"),
		new cr.Property(ept_combo, 	"CullBackFaces",		"True",		"True if back faces should be culled, false otherwise.","False|True"),
		new cr.Property(ept_combo, 	"Display Loading Screen",		"True",		"Whether to display the default loading screen or not.","False|True"),	
	
	new cr.Property(ept_section, "Scene Properties", "",	"Babylon Scene related properties."),
		new cr.Property(ept_float, 	"MinDeltaTime",		1.0,		"In milliseconds, the minimum delta time between two steps."),
		new cr.Property(ept_float, 	"MaxDeltaTime",		1000.0,		"In milliseconds, the maximum delta time between two steps."),
		new cr.Property(ept_combo, 	"AutoClear",		"True",		"True to clear the color buffer at each render, false either.","False|True"),
		new cr.Property(ept_color, 	"ClearColor",		0xFCECAC,		"The color of the scene when cleared."),
		new cr.Property(ept_color, 	"AmbientColor",		0x000000,		"The scene ambiant color."),
		new cr.Property(ept_combo, 	"ForceWireframe",		"False",		"Forces the wireframe display of meshes.","False|True"),
		new cr.Property(ept_combo, 	"ForcePointsCloud",		"False",		"Forces the display of points cloud.","False|True"),
		new cr.Property(ept_combo, 	"ForceShowBoundingBoxes",		"False",		"Forces the display of bounding boxes.","False|True"),
		new cr.Property(ept_combo, 	"ShadowsEnabled",		"True",		"Is shadow enabled on this scene.","False|True"),
		new cr.Property(ept_combo, 	"LightsEnabled ",		"True",		"Are lights enabled on this scene.","False|True"),
		new cr.Property(ept_combo, 	"TexturesEnabled  ",		"True",		"True if texture should be enabled, false otherwise.","False|True"),
	new cr.Property(ept_section, "Debug Properties", "",	"Babylon Debug related properties."),
		new cr.Property(ept_combo, 	"Debug Enabled ",		"False",		"Is the debug layer enabled.","False|True"),
	new cr.Property(ept_section, "Physics Properties", "",	"Babylon Physics related properties."),
		new cr.Property(ept_text,	"Gravity",	"0,-9.81,0",	"The gravity vector"),
	new cr.Property(ept_section, "Identifier", "",	""),
		new cr.Property(ept_integer, 	"Scene ID",		0,		"A unique ID which represents this scene for other objects."),
	new cr.Property(ept_section, "Layering", "",	""),
		new cr.Property(ept_combo, 	"Layering of the engine",		"Inside",		"---Inside: The engine is rendered inside the C2 canvas ((Pros:Compatible with effects|Cons:CPU intensive)) ---Bottom-Top:Rendered behind or ontop of the C2 canvas ((Pros:Great perfomance|Cons:Effects not compatible)).","Inside|Bottom|Top"),
		new cr.Property(ept_integer, 	"Hardware scaling",		1,		"Higher value means less quality and more performance,.")
	];
	
// Called by IDE when a new object type is to be createdm
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
	this.instance.SetHotspot(new cr.vector2(0, 0));
	this.instance.SetPosition(new cr.vector2(0, 0));
	this.instance.SetSize(new cr.vector2(this.instance.GetLayoutSize().x, this.instance.GetLayoutSize().y));
	var q = this.instance.GetBoundingQuad();
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
	
	this.font_str = "Arial,-16";
	var font_info = cr.ParseFontString(this.font_str);
	this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
	
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	
	var q = this.instance.GetBoundingQuad();
	// If there is a font present, draw it

	if (this.font != null)
	{

		this.font.DrawText("SCENE"+this.properties["Scene ID"],
								q,
								cr.RGB(0,0,0),
								ha_center,
								1,
								0,
								false,
								0,
								ha_center);
		renderer.Outline(q, cr.RGB(255,111,40));
		renderer.Outline(scale(q,1), cr.RGB(255,111,40));
		

		
		
	}
}

function scale(quad,factor)
{
	quad.tlx -= factor;
	quad.tly -= factor;
	quad.trx += factor;
	quad.try_ -= factor;
	quad.blx -= factor;
	quad.bly += factor;
	quad.brx += factor;
	quad.bry += factor;
	return quad;
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}


