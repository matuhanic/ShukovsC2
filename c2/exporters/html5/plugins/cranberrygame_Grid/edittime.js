function GetPluginSettings()
{
	return {
		"name":			"Grid",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Grid",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.14",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"visual grid in design time specially for grid puzzle game.",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Html5",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
/*
		// example
		,"dependency": "three.min.js;OBJLoader.js"
*/
//cranberrygame start
//cranberrygame start
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

/*				
// example				
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");
AddCondition(1, cf_trigger, "Trigger Condition", "My category", "Trigger Condition", "Triggered when TriggerAction", "TriggerCondition");//cranberrygame
*/
//cranberrygame start
//cranberrygame end
	
////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/*
// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
AddAction(1, af_none, "Trigger Action", "My category", "Trigger Action", "Trigger TriggerCondition", "TriggerAction");//cranberrygame
*/
//cranberrygame start
AddNumberParam("Cell width", "Enter cell width.");
AddAction(0, af_none, "Set cell width", "Cell size", "Set cell width to {0}", "Description for my action!", "SetCellWidth");
AddNumberParam("Cell height", "Enter cell height.");
AddAction(1, af_none, "Set cell height", "Cell size", "Set cell height to {0}", "Description for my action!", "SetCellHeight");
AddNumberParam("Cell width", "Enter cell width.");
AddNumberParam("Cell height", "Enter cell height.");
AddAction(2, af_none, "Set cell size", "Cell size", "Set cell width to {0}, cell height to {1}", "Description for my action!", "SetCellSize");

//cranberrygame end

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

/*
// example
AddExpression(0, ef_return_number, "Get cell x count", "My category", "MyExpression", "Get cell x count."); //cranberrygame
AddExpression(1, ef_return_string, "Get text.", "My category", "TextWithNoParam", "Get text."); //cranberrygame
AddStringParam("StringParam", "Enter string param");
AddExpression(2, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
*/
//cranberrygame start
AddExpression(0, ef_return_number, "Return cell width.", "My category", "CellWidth", "Return cell width.");
AddExpression(1, ef_return_number, "Return cell height.", "My category", "CellHeight", "Return cell height.");
AddExpression(2, ef_return_number | ef_variadic_parameters, "Get cell x form cell x index", "My category", "XIndex2X", "Get cell x form cell x index.");
AddExpression(3, ef_return_number | ef_variadic_parameters, "Get cell y form cell y index", "My category", "YIndex2Y", "Get cell y form cell y index.");
AddExpression(4, ef_return_number | ef_variadic_parameters, "Get cell x index form cell x", "My category", "X2XIndex", "Get cell x index form cell x.");
AddExpression(5, ef_return_number | ef_variadic_parameters, "Get cell y index form cell y", "My category", "Y2YIndex", "Get cell y index form cell y.");
AddExpression(6, ef_return_number, "Get cell x count", "My category", "XCount", "Get cell x count.");
AddExpression(7, ef_return_number, "Get cell y count", "My category", "YCount", "Get cell y count.");
//cranberrygame end

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
/*
	new cr.Property(ept_integer, 	"My property",		77,		"An example property.") //cranberrygame , this.properties[0] from runtime.js
*/
//cranberrygame start
	new cr.Property(ept_integer, 	"Cell width",		64,		"An example property."),
	new cr.Property(ept_integer, 	"Cell height",		64,		"An example property."),
	new cr.Property(ept_combo,	"Cell origin",				"Center",	"Choose the location of the origin in the cell.", "Center|Top-left"),
	new cr.Property(ept_combo,	"Hotspot",				"Center",	"Choose the location of the hot spot in the object.", "Center|Top-left")
//cranberrygame emd
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
//cranberrygame start	
	this.instance.SetSize(new cr.vector2(192, 192));
//cranberrygame end
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
//cranberrygame start
	if (property_name === "Hotspot")
	{
		if (this.properties["Hotspot"] === "Top-left")
			this.instance.SetHotspot(new cr.vector2(0, 0));
		else
			this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	}
//cranberrygame end
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
//cranberrygame start
	//
	var width=this.instance.GetSize().x;
	var height=this.instance.GetSize().y;

	var cellWidth=this.properties["Cell width"];
	var newWidth=cellWidth*Math.round(width/cellWidth);

	var cellHeight=this.properties["Cell height"];
	var newHeight=cellHeight*Math.round(height/cellHeight);

	if((width!=newWidth)||(height!=newHeight))	
		this.instance.SetSize(new cr.vector2(newWidth, newHeight));	

	//
	renderer.SetTexture(null);

	var q = this.instance.GetBoundingQuad();

	//renderer.Fill(q, cr.RGB(224, 224, 224));
		
	for (var y = q.tly; y <= q.bly; y += this.properties["Cell height"]) { // horizontal lines
		var v1 = new cr.vector2(q.tlx, y);
		var v2 = new cr.vector2(q.brx, y);
		
		renderer.Line(v1, v2, cr.RGB(0, 0, 255));
	}
	
	for (var x = q.tlx; x <= q.trx; x += this.properties["Cell width"]) { // vertical lines
		var v1 = new cr.vector2(x, q.tly);
		var v2 = new cr.vector2(x, q.bly);
		
		renderer.Line(v1, v2, cr.RGB(0, 0, 255));
	}
	
	//
	var cellOriginOffsetX=0;
	var cellOriginOffsetY=0;
	if (this.properties["Cell origin"] == "Top-left")
	{
		cellOriginOffsetX=-cellWidth/2;
		cellOriginOffsetY=-cellHeight/2;
	}
		
	for (var y = q.tly+(this.properties["Cell height"]/2); y <= q.bly; y += this.properties["Cell height"]) { // horizontal lines
		///var v1 = new cr.vector2(q.tlx, y);
		//var v2 = new cr.vector2(q.brx, y);
		
		//renderer.Line(v1, v2, cr.RGB(0, 0, 255));
		
		for (var x = q.tlx+(this.properties["Cell width"]/2); x <= q.trx; x += this.properties["Cell width"]) { // vertical lines
			//var v1 = new cr.vector2(x, q.tly);
			//var v2 = new cr.vector2(x, q.bly);

			var v1 = new cr.vector2(x-4+cellOriginOffsetX, y-4+cellOriginOffsetY);
			var v2 = new cr.vector2(x+4+cellOriginOffsetX, y+4+cellOriginOffsetY);			
			renderer.Line(v1, v2, cr.RGB(0, 0, 255));

			var v1 = new cr.vector2(x-4+cellOriginOffsetX, y+4+cellOriginOffsetY);
			var v2 = new cr.vector2(x+4+cellOriginOffsetX, y-4+cellOriginOffsetY);			
			renderer.Line(v1, v2, cr.RGB(0, 0, 255));
		}		
	}
//cranberrygame end
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}

//cranberrygame start
IDEInstance.prototype.OnCreate = function()
{
	if (this.properties["Hotspot"] === "Top-left")
		this.instance.SetHotspot(new cr.vector2(0, 0));
	else
		this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
}
//cranberrygame end
