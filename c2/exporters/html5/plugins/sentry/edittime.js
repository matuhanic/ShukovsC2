function GetPluginSettings()
{
	return {
		"name":			"Sentry",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Sentry",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Ray casting sentry, used to detect objects, can be blocked by defined obstacles.",
		"author":		"Khoi Pham",
		//"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
						| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
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

AddObjectParam("Object", "Sentry will keep a look out for this object type.");
AddCondition(0, 0, "See Other Object", "Ray Casting", "See {0}", "True if any of the rays collide with {0} and not blocked anywhere.", "SeeObject");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddNumberParam("Degree", "Enter angle of view for this sentry in degree.", "60");
AddAction(0, 0, "Set Angle of View", "Ray Casting", "Set angle to {0} degree", "Set maximum view angle for this sentry, for sentry's direction use SetDirection instead.", "SetAngle");

AddNumberParam("Number", "Enter Length of each ray (in pixel).", "100");
AddAction(1, 0, "Set Length of Rays", "Ray Casting", "Set rays length to {0}", "Set the length of each ray.", "SetLength");

AddNumberParam("Number", "Enter total number of rays.", "5");
AddAction(2, 0, "Set Number of Rays", "Ray Casting", "Set number of rays to {0}", "Set total number of rays.", "SetNumRays");

AddAction(3, 0, "Recalculate rays", "Ray Casting", "Recalculate rays", "This should be called whenever sentry's position or angle change.", "RecalculateRays");

AddObjectParam("Object", "Sentry's ray will not be able to see through this object type");
AddAction(4, 0, "Add Blockade", "Ray Casting", "Add {0} as blockade", "Add an object type to list of blockade, sentry can't see through objects in this list.", "AddBlockade");

AddAction(5, 0, "Search for Blockades", "Ray Casting", "Search for blockade", "If you defined blockade for this sentry. This should be called once every ticks before any 'See Other Object' condition is checked.", "SearchBlockade");

AddAction(6, 0, "Initialize", "Ray Casting", "Initialize", "This is to be called at the start of layout", "Initialize");

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
	new cr.Property(ept_integer, 	"Angle of view",		60,		"sentry's angle of view in degree"),
	new cr.Property(ept_integer, 	"Ray length",		100,		"length of each ray, determine how far sentry can see"),
	new cr.Property(ept_integer, 	"Number of rays",		1,		"Number of rays used for detection. The denser the more accurate ray casting is gonna be."),
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
	this.rayPoints = [];
	this.rayLength = 1;
	this.angleOfView = 0;
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(128, 128));
	//this.refreshBoundingBox();
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (property_name == "Angle of view"
			|| property_name == "Ray length" || property_name == "Number of rays")
	{
		this.rayLength = this.properties["Ray length"];
		
		this.angleOfView = this.properties["Angle of view"]*Math.PI/180;
	}
}

IDEInstance.prototype.calculateRays = function() {
	for (var i = 0; i < this.rayPoints.length; i++)
		delete this.rayPoints[i];
	this.rayPoints.splice(0, this.rayPoints.length);
		
	var numRays = this.properties["Number of rays"];
	
	if (numRays > 1) {
		var angleDif = this.angleOfView/(numRays-1);
		var a = this.instance.GetAngle();
		
		for (var i = 0; i < numRays; i++) {
			var s = Math.sin( a - this.angleOfView/2 + angleDif*i );
			var c = Math.cos( a - this.angleOfView/2 + angleDif*i );
			var px = c * this.rayLength; 
			var py = s * this.rayLength;
			this.rayPoints[i] = new cr.vector2(px, py);
			//alert(", sin: "+s+", cos: "+c+", px: "+px+", py: "+py+", angleOfView: "+this.angleOfView+", rayLength: "+this.rayLength);
		}
	}
	else {
		var a = this.instance.GetAngle();
		var s = Math.sin( a );
		var c = Math.cos( a );
		var px = c * this.rayLength; 
		var py = s * this.rayLength;
		this.rayPoints[0] = new cr.vector2(px, py);
	}
	/**
	for (var i = 0; i < this.rayPoints.length; i++) {
		alert("rayPoints "+i+"    X: "+this.rayPoints[i].x+"    Y: "+this.rayPoints[i].y);
	}
	*/
	//this.refreshBoundingBox();
}

IDEInstance.prototype.refreshBoundingBox = function() {
	var width = this.rayLength;
	var height = 2 * Math.sin( this.angleOfView/2 ) * this.rayLength;
	this.instance.SetSize(new cr.vector2(width, height));
};

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
	this.instance.SetHotspot(new cr.vector2(0, 0.5));
	
	//alert("direction x:"+this.direction.x+", y: "+this.direction.y);
	
	this.rayLength = this.properties["Ray length"];
	
	this.angleOfView = this.properties["Angle of view"]*Math.PI/180;
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	renderer.SetTexture(null);
		
	this.calculateRays();
	
	var q = this.instance.GetBoundingQuad();
	//renderer.Fill(q, cr.RGB(255, 0, 0));
	var origin = new cr.vector2((q.tlx + q.blx) / 2, (q.tly + q.bly) / 2);
	
	for(var i = 0; i < this.rayPoints.length; i++) {
		renderer.Line(origin, new cr.vector2(origin.x + this.rayPoints[i].x, 
							origin.y + this.rayPoints[i].y), cr.RGB(0, 255, 255));		
	}
	
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	
}