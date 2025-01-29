function GetBehaviorSettings()
{
	return {
		"name": "ParallaxBG",
		"id": "ParallaxBG",	
		"version": "1.0",
		"description": "Make a TiledBackground wrap around screen horizontally and scroll with parallax effect.",
		"author": "Zed2100",
		"help url": "http://www.gameplaypassion.com",
		"category": "General",
		"flags": 0
	};
};

/////// ACEs ////////////////////////////////////////////////////////////////////


////// Actions /////////////////////////////////////////////////////////////////
AddNumberParam("Value", "The horizontal scroll rate in percentage (e.g 100 is full speed, 50 is half-speed, 200 is double speed).", "100");
AddAction(0, af_none, "Set Parallax X", "Parallax", "Set {my} Parallax X to <b>{0}</b>", "Set value of Parallax X", "SetParallaxX");

AddNumberParam("Value", "The vertical scroll rate in percentage (e.g 100 is full speed, 50 is half-speed, 200 is double speed).", "100");
AddAction(1, af_none, "Set Parallax Y", "Parallax", "Set {my} Parallax Y to <b>{0}</b>", "Set value of Parallax Y", "SetParallaxY");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Only Wrap", "Only wrap background around screen without scrolling it.");
AddAction(2, 0, "Set only wrap", "", "Set {my} only wrap to <b>{0}</b>", "Only wrap background around screen without scrolling it.", "SetOnlyWrap");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.");
AddAction(3, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");



AddAction(50, af_none, "Reset initial Y-Coordinate", "", "Reset initial Y-coordinate in {my}", "Reset the initial Y coordinate to this object's Y position.", "ResetY");

///// Expressions /////////////////////////////////////////////////////////////

AddExpression(0, ef_return_number, "ParallaxX", "Parallax", "ParallaxX", "Return the value of Parallax X.");
AddExpression(1, ef_return_number, "ParallaxY", "Parallax", "ParallaxY", "Return the value of Parallax Y.");

ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
var property_list = [
		new cr.Property(ept_integer, "Parallax X", 100,	"The horizontal scroll rate in percentage (e.g 100 is full speed, 50 is half-speed, 200 is double speed)."),
		new cr.Property(ept_integer, "Parallax Y", 100,	"The vertical scroll rate in percentage (e.g 100 is full speed, 50 is half-speed, 200 is double speed)."),
		new cr.Property(ept_combo, "Initial state",	"Enabled", "Whether to initially have the behavior enabled or disabled.", "Enabled|Disabled"),
		new cr.Property(ept_combo, "Only wrap",	"No", "Only wrap background around screen without scrolling it.", "Yes|No")
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
};

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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};
