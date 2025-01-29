function GetBehaviorSettings()
{
	return {
		"name":			"Skybox",
		"id":			"babylonSkyboxSLE",
		"version":		"1.0",
		"description":	"Add a skybox to the scene.",
		"author":		"X3M",
		"help url":		"www.x3mworks.blogspot.com",
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
		new cr.Property(ept_combo, 	"Skybox Enabled ",		"True",		"Is the skybox enabled.","False|True"),
		new cr.Property(ept_text, 	"Textures prefix ",		"skybox",		"The skybox image file prefix."),
		new cr.Property(ept_float, 	"Box size",		10000.0,		"The skybox size.")
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
