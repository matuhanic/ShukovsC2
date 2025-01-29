function GetPluginSettings()
{
	return {
		"name":			"Multiple Touch",
		"id":			"MultipleTouch",
		"version":		"1.0",
		"description":	"Retrieve touches on a touch screen.",
		"author":		"stas's ports",
		"help url":		"http://www.scirra.com/manual/119/touch",
		"category":		"Clickteam Extensions",
		"type":			"world",		
		"rotatable":	false,
		"defaultimage":	"TouchIco.png",
		"flags":		pf_animations
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, cf_trigger, "On any touch start", "Touch", "On any touch start", "Triggered when any touch input begins.", "OnTouchStart");
AddCondition(1, cf_trigger, "On any touch end", "Touch", "On any touch end", "Triggered when any touch input ends.", "OnTouchEnd");
AddCondition(2, 0,			"Is in touch", "Touch", "Is in touch", "True if any touch is currently in contact with the device.", "IsInTouch");

AddObjectParam("Object", "Choose the object to check for touch.");
AddCondition(3,	cf_trigger, "On touched object", "Touch", "On touched {0}", "Triggered when an object is touched.", "OnTouchObject");

AddObjectParam("Object", "Choose the object to check for being touched.");
AddCondition(4, 0,			"Is touching object", "Touch", "Is touching {0}", "Test if in a touch and the touch point is over an object.", "IsTouchingObject");

AddCondition(5, cf_deprecated,			"Device orientation supported", "Orientation & motion", "Device orientation is supported", "True if the device supports orientation detection.", "OrientationSupported");

AddCondition(6, cf_deprecated,			"Device motion supported", "Orientation & motion", "Device motion is supported", "True if the device supports motion detection.", "MotionSupported");

AddNumberParam("Touch index", "The zero-based index of the touch to test the speed for.  0 is the first touch.");
AddCmpParam("Comparison", "How to compare the touch speed.");
AddNumberParam("Speed", "Speed to compare to, in absolute pixels per second.");
AddCondition(7, 0,			"Compare touch speed", "Touch", "Touch <b>{0}</b> speed {1} <b>{2}</b>", "Compare the speed of a touch, e.g. to detect a swipe.", "CompareTouchSpeed");

AddComboParamOption("Alpha");
AddComboParamOption("Beta");
AddComboParamOption("Gamma");
AddComboParam("Orientation", "Choose the orientation to compare (alpha = compass direction, beta = front-to-back tilt, gamma = left-to-right tilt).");
AddCmpParam("Comparison", "How to compare the orientation.");
AddNumberParam("Angle", "The orientation to compare to, in degrees.")
AddCondition(8, 0,			"Compare orientation", "Orientation & motion", "<b>{0}</b> orientation {1} <b>{2}</b>", "Compare the current orientation (or tilt) of the device.", "CompareOrientation");

AddComboParamOption("X (with gravity)");
AddComboParamOption("Y (with gravity)");
AddComboParamOption("Z (with gravity)");
AddComboParamOption("X (without gravity)");
AddComboParamOption("Y (without gravity)");
AddComboParamOption("Z (without gravity)");
AddComboParam("Axis", "Choose the axis to compare acceleration for, and whether the measurement should include the force of gravity.");
AddCmpParam("Comparison", "How to compare the acceleration.");
AddNumberParam("Acceleration", "The acceleration to compare to, in m/s^2.");
AddCondition(9, 0,			"Compare acceleration", "Orientation & motion", "{0} acceleration {1} <b>{2}</b>", "Compare the acceleration of the device along an axis.", "CompareAcceleration");

AddNumberParam("Touch number", "Enter a zero-based index of the touch to test, e.g. 0 for first touch, 1 for second, etc.");
AddCondition(10, cf_trigger, "On Nth touch start", "Touch", "On touch {0} start", "Triggered when a particular touch input begins.", "OnNthTouchStart");

AddNumberParam("Touch number", "Enter a zero-based index of the touch to test, e.g. 0 for first touch, 1 for second, etc.");
AddCondition(11, cf_trigger, "On Nth touch end", "Touch", "On touch {0} end", "Triggered when a particular touch input ends.", "OnNthTouchEnd");

AddNumberParam("Touch number", "Enter a zero-based index of the touch to test, e.g. 0 for first touch, 1 for second, etc.");
AddCondition(12, 0,			"Has Nth touch", "Touch", "Has touch {0}", "True if a particular touch is currently in contact with the device.", "HasNthTouch");

AddCondition(13, cf_trigger, "On hold",		"Gestures", "On hold gesture", "Triggered when a touch held in the same place for a time.", "OnHoldGesture");

AddCondition(14, cf_trigger, "On tap",		"Gestures", "On tap gesture", "Triggered when a touch is quickly released from its start location.", "OnTapGesture");

AddCondition(15, cf_trigger, "On double-tap",	"Gestures", "On double-tap gesture", "Triggered when two taps occur in quick succession.", "OnDoubleTapGesture");

AddObjectParam("Object", "Choose the object to check.");
AddCondition(16, cf_trigger, "On hold over object",		"Gestures", "On hold gesture over {0}", "Triggered when a hold gesture is made over an object.", "OnHoldGestureObject");

AddObjectParam("Object", "Choose the object to check.");
AddCondition(17, cf_trigger, "On tap object",		"Gestures", "On tap gesture on {0}", "Triggered when a tap gesture is made on an object.", "OnTapGestureObject");

AddObjectParam("Object", "Choose the object to check.");
AddCondition(18, cf_trigger, "On double-tap object",	"Gestures", "On double-tap gesture on {0}", "Triggered when a double-tap gesture is made on an object.", "OnDoubleTapGestureObject");

AddComboParamOption("Orientation");
AddComboParamOption("Motion");
AddComboParam("Type", "The type of permission.");
AddCondition(19, cf_trigger, "On permission granted",	"Orientation & motion", "On <i>{0}</i> permission granted", "Triggered after the 'Request permission' action if the permission was granted.", "OnPermissionGranted");

AddComboParamOption("Orientation");
AddComboParamOption("Motion");
AddComboParam("Type", "The type of permission.");
AddCondition(20, cf_trigger, "On permission denied",	"Orientation & motion", "On <i>{0}</i> permission denied", "Triggered after the 'Request permission' action if the permission was denied.", "OnPermissionDenied");

//////////////////////////////////////////////////////////////
// Actions

AddComboParamOption("Orientation");
AddComboParamOption("Motion");
AddComboParam("Type", "The type of permission.");
AddAction(0, 0, "Request permission",	"Orientation & motion", "Request <b>{0}</b> permission", "Request permission to use device orientation or motion.", "RequestPermission");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number | ef_variadic_parameters, "Touch X position", "Touch", "X", "Get the primary touch X co-ordinate in the layout.");
AddExpression(1, ef_return_number | ef_variadic_parameters, "Touch Y position", "Touch", "Y", "Get the primary touch Y co-ordinate in the layout.");

AddExpression(2, ef_return_number, "Absolute touch X", "Touch", "AbsoluteX", "Get the primary touch X co-ordinate on the canvas.");
AddExpression(3, ef_return_number, "Absolute touch Y", "Touch", "AbsoluteY", "Get the primary touch Y co-ordinate on the canvas.");

AddExpression(4, ef_return_number, "Orientation alpha", "Orientation & motion", "Alpha", "The device compass direction, in degrees.");
AddExpression(5, ef_return_number, "Orientation beta", "Orientation & motion", "Beta", "The device front-to-back tilt, in degrees (front is positive).");
AddExpression(6, ef_return_number, "Orientation gamma", "Orientation & motion", "Gamma", "The device left-to-right tilt, in degrees (right is positive).");

AddExpression(7, ef_return_number, "X acceleration with gravity", "Orientation & motion", "AccelerationXWithG", "The device X acceleration with gravity, in m/s^2.");
AddExpression(8, ef_return_number, "Y acceleration with gravity", "Orientation & motion", "AccelerationYWithG", "The device Y acceleration with gravity, in m/s^2.");
AddExpression(9, ef_return_number, "Z acceleration with gravity", "Orientation & motion", "AccelerationZWithG", "The device Z acceleration with gravity, in m/s^2.");

AddExpression(10, ef_return_number, "X acceleration", "Orientation & motion", "AccelerationX", "The device X acceleration without gravity (if supported), in m/s^2.");
AddExpression(11, ef_return_number, "Y acceleration", "Orientation & motion", "AccelerationY", "The device Y acceleration without gravity (if supported), in m/s^2.");
AddExpression(12, ef_return_number, "Z acceleration", "Orientation & motion", "AccelerationZ", "The device Z acceleration without gravity (if supported), in m/s^2.");

AddExpression(13, ef_return_number, "", "Touch", "TouchCount", "Get the number of current touches.");

AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(14, ef_return_number | ef_variadic_parameters, "", "Touch", "XAt", "Get a touch X co-ordinate in the layout from a zero-based index of the touch.");
AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(15, ef_return_number | ef_variadic_parameters, "", "Touch", "YAt", "Get a touch Y co-ordinate in the layout from a zero-based index of the touch.");

AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(16, ef_return_number, "", "Touch", "AbsoluteXAt", "Get a touch X co-ordinate on the canvas from a zero-based index of the touch.");
AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(17, ef_return_number, "", "Touch", "AbsoluteYAt", "Get a touch Y co-ordinate on the canvas from a zero-based index of the touch.");

AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(18, ef_return_number, "", "Touch", "SpeedAt", "Get the speed of a touch, in absolute (screen) pixels per second.");

AddNumberParam("Index", "Zero-based index of the touch to get.");
AddExpression(19, ef_return_number, "", "Touch", "AngleAt", "Get the angle of motion of a touch, in degrees.");

AddExpression(20, ef_return_number, "", "Touch", "TouchIndex", "Get the index of the current touch.");

AddExpression(21, ef_return_number, "", "Touch", "TouchID", "Get the unique ID of the current touch.");

AddNumberParam("ID", "ID of the touch to get.");
AddExpression(22, ef_return_number | ef_variadic_parameters, "", "Touch", "XForID", "Get a touch X co-ordinate in the layout for a touch with a specific ID.");
AddNumberParam("ID", "ID of the touch to get.");
AddExpression(23, ef_return_number | ef_variadic_parameters, "", "Touch", "YForID", "Get a touch Y co-ordinate in the layout for a touch with a specific ID.");

AddNumberParam("ID", "ID of the touch to get.");
AddExpression(24, ef_return_number, "", "Touch", "AbsoluteXForID", "Get a touch X co-ordinate on the canvas for a touch with a specific ID.");
AddNumberParam("ID", "ID of the touch to get.");
AddExpression(25, ef_return_number, "", "Touch", "AbsoluteYForID", "Get a touch Y co-ordinate on the canvas for a touch with a specific ID.");

AddNumberParam("ID", "ID of the touch to get.");
AddExpression(26, ef_return_number, "", "Touch", "SpeedForID", "Get the speed of a touch with a specific ID, in absolute (screen) pixels per second.");

AddNumberParam("ID", "ID of the touch to get.");
AddExpression(27, ef_return_number, "", "Touch", "AngleForID", "Get the angle of motion of a touch with a specific ID, in degrees.");

AddNumberParam("ID", "ID of the touch to get.");
AddExpression(28, ef_return_number, "", "Touch", "WidthForID", "Get the width of a touch with a specific ID.");
AddNumberParam("ID", "ID of the touch to get.");
AddExpression(29, ef_return_number, "", "Touch", "HeightForID", "Get the height of a touch with a specific ID.");
AddNumberParam("ID", "ID of the touch to get.");
AddExpression(30, ef_return_number, "", "Touch", "PressureForID", "Get the pressure (from 0 to 1) of a touch with a specific ID.");

ACESDone();


// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_link,	"Animations",			lang("project\\misc\\sprite-edit-link"), "Click to edit the object's animations.", "firstonly"),
	new cr.Property(ept_link,	"Size",					lang("project\\misc\\sprite-make11-link"), "Click to set the object to the same size as its image.", "worldundo"),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_text,	"Initial animation",	"Default",	"The initial animation showing."),
	new cr.Property(ept_integer,"Initial frame",		0,			"The initial animation frame showing."),
	new cr.Property(ept_combo,	"Collisions",			"Enabled",	"Whether the object will register collision events or not.", "Disabled|Enabled")
	//new cr.Property(ept_combo,	"Effect",				"(none)",	"Choose an effect for this object.  (This does not preview in the layout, only when you run.)", "(none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop")
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
	this.just_inserted = false;
	this.texture_loaded = false;
	this.last_imgsize = new cr.vector2(0, 0);
	this.last_texture = null;
	this.last_texture_id = "";
}

IDEInstance.prototype.OnAfterLoad = function ()
{
	// Must initialise last_imgsize for correct updating of sprites on layouts without a tab open
	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.last_imgsize = texture.GetImageSize();
}

IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Edit animations link
	if (property_name == "Animations")
	{
		this.instance.EditTexture();
	}
	// Make 1:1 link
	else if (property_name == "Size")
	{
		if (this.texture_loaded)
			this.just_inserted = true;		// will scale to texture size when redrawn and update property grid
		else
		{
			// The object could be resized, but we can't refresh the property grid here.
			// Just assume the layout is always open, and prompt if not.
			alert("The object cannot be scaled to original size unless the layout containing it is open.");
		}
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
	this.last_texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.last_texture_id = this.last_texture.GetID();
	
	renderer.LoadTexture(this.last_texture);
	this.texture_loaded = true;
	
	this.instance.SetHotspot(this.last_texture.GetHotspot());
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	var texture_id = texture.GetID();
	
	if (this.last_texture_id !== "" && this.last_texture_id !== texture_id)
	{
		// Texture has changed: unload old and reload new.
		if (this.last_texture)
			renderer.ReleaseTexture(this.last_texture);
			
		renderer.LoadTexture(texture);
		this.instance.SetHotspot(texture.GetHotspot());
	}
	
	this.last_texture = texture;
	this.last_texture_id = texture_id;
	
	renderer.SetTexture(texture);
	
	var imgsize = texture.GetImageSize();
	
	// First draw after insert: use size of texture.
	// Done after SetTexture so the file is loaded and dimensions known, preventing
	// the file being loaded twice.
	if (this.just_inserted)
	{
		this.just_inserted = false;
		this.instance.SetSize(imgsize);
		
		RefreshPropertyGrid();		// show new size
	}
	// If not just inserted and the sprite texture has been edited and changed size, scale the texture accordingly.
	else if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
		&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
	{
		var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
		var instsize = this.instance.GetSize();
		
		sz.mul(instsize.x, instsize.y);
		this.instance.SetSize(sz);
		this.instance.SetHotspot(texture.GetHotspot());
		
		RefreshPropertyGrid();		// show new size
	}

	this.last_imgsize = imgsize;
	
	if (renderer.SupportsFullSmoothEdges())
	{
		// Get the object size and texture size
		var objsize = this.instance.GetSize();
		var texsize = texture.GetImageSize();
		
		// Calculate pixels per texel, then get a quad padded with a texel padding
		var pxtex = new cr.vector2(objsize.x / texsize.x, objsize.y / texsize.y);
		var q = this.instance.GetBoundingQuad(new cr.vector2(pxtex.x, pxtex.y));
		
		// Calculate the size of a texel in texture coordinates, then calculate texture coordinates
		// for the texel padded quad
		var tex = new cr.vector2(1.0 / texsize.x, 1.0 / texsize.y);
		var uv = new cr.rect(-tex.x, -tex.y, 1.0 + tex.x, 1.0 + tex.y);
		
		// Render a quad with a half-texel padding for smooth edges
		renderer.Quad(q, this.instance.GetOpacity(), uv);
	}
	else
	{
		// Fall back to half-smoothed or jagged edges, depending on what the renderer supports
		renderer.Quad(this.instance.GetBoundingQuad(), this.instance.GetOpacity());
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.texture_loaded = false;
	renderer.ReleaseTexture(this.last_texture);
}

IDEInstance.prototype.OnTextureEdited = function ()
{
	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.instance.SetHotspot(texture.GetHotspot());
	
	var imgsize = texture.GetImageSize();
	
	// If sprite texture has been edited and changed size, scale the texture accordingly.
	if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
		&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
	{
		var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
		var instsize = this.instance.GetSize();
		
		sz.mul(instsize.x, instsize.y);
		this.instance.SetSize(sz);
		
		this.last_imgsize = imgsize;
	}
}

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Use mouse input", "Yes", "Use mouse clicks as single-touch input (useful for testing).", "No|Yes")
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
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
