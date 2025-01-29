function GetBehaviorSettings()
{
	return {
		"name":			"SkyHDR",
		"id":			"babylonSkyhdr",
		"version":		"1.0",
		"description":	"Add a sky HDR texture to the scene.",
		"author":		"X3M",
		"help url":		"http://www.scirra.com/manual/95/fade",
		"category":		"Babylon Scene",
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions
//////////////////////////////////////////////////////////////
// Expressions
ACESDone();

// Property grid properties for this plugin
var property_list = [
		new cr.Property(ept_combo, 	"Sky HDR Enabled",		"True",		"Is the sky HDR enabled.","False|True"),
		new cr.Property(ept_text, 	"HDR filename",		"garden",		"The hdr texture filename without the .hdr extension."),
		new cr.Property(ept_integer, 	"Texture size",		512,		"The texture size."),
		new cr.Property(ept_float, 	"Box size",		10000.0,		"The skybox size."),
		new cr.Property(ept_float, 	"Microsurface",		1.0,		"The microsurface."),
		new cr.Property(ept_float, 	"cameraExposure",		0.6,		"The cameraExposure."),
		new cr.Property(ept_float, 	"cameraContrast",		1.6,		"The cameraContrast."),
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
