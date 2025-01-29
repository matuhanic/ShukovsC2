function GetBehaviorSettings()
{
	return {
		"name":			"Fog",
		"id":			"babylonFog",
		"version":		"1.0",
		"description":	"Add fog to the scene.",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon Scene",
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions
	AddNumberParam("Density", "", initial_string = "0.005");
	AddAction(0, af_none, "Set density", "Set fog density to <b>{0}</b>.", "Set fog density.", "FogSetDensity");
//////////////////////////////////////////////////////////////
// Expressions
ACESDone();

// Property grid properties for this plugin
var property_list = [
		new cr.Property(ept_combo, 	"Fog Enabled",		"True",		"Is the fog enabled.","False|True"),
		new cr.Property(ept_combo, 	"Fog mode",		"Exp",		"Is the fog enabled.","Exp|Exp2|Linear"),
		new cr.Property(ept_color, 	"Fog color",		0x222222,		"The color of the fog."),
		new cr.Property(ept_float, 	"Fog start",		20.0,		"The starting offset, only for Linear mod."),
		new cr.Property(ept_float, 	"Fog end",		60.0,		"The ending offset, only for Linear mod."),
		new cr.Property(ept_float, 	"Fog density",		0.0005,		"The fog density."),
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
