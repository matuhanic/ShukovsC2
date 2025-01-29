function GetBehaviorSettings()
{
	return {
		"name":			"Lensflare",
		"id":			"babylonLensflare",
		"version":		"1.0",
		"description":	"Add a lensflare to the light.",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon Light",
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
		new cr.Property(ept_combo, 	"Lensflare 1 Enabled",		"True",		"Is the lensflare enabled.","False|True"), //0
		new cr.Property(ept_float, 	"Size 1",		0.2,		"The size of the dot."), //1
		new cr.Property(ept_float, 	"Distance 1",		0.0,		"The distance from the center of the light."), //2
		new cr.Property(ept_color, 	"Color 1",		0xFFFFFF,		"The color of the dot."), //3
		new cr.Property(ept_text, "Image 1", "flare.png", "The image filename."), //4

		new cr.Property(ept_combo, 	"Lensflare 2 Enabled",		"True",		"Is the lensflare enabled.","False|True"), //5
		new cr.Property(ept_float, 	"Size 2",		0.5,		"The size of the dot."), //6
		new cr.Property(ept_float, 	"Distance 2",		0.2,		"The distance from the center of the light."), //7
		new cr.Property(ept_color, 	"Color 2",		0x2222FF,		"The color of the dot."), //8
		new cr.Property(ept_text, "Image 2", "flare.png", "The image filename."), //9

		new cr.Property(ept_combo, 	"Lensflare Enabled 3",		"True",		"Is the lensflare enabled.","False|True"), //10
		new cr.Property(ept_float, 	"Size 3",		0.2,		"The size of the dot."), //11
		new cr.Property(ept_float, 	"Distance 3",		1.0,		"The distance from the center of the light."), //12
		new cr.Property(ept_color, 	"Color 3",		0xFFFFFF,		"The color of the dot."), //13
		new cr.Property(ept_text, "Image 3", "flare.png", "The image filename."), //14
 
		new cr.Property(ept_combo, 	"Lensflare Enabled 4",		"True",		"Is the lensflare enabled.","False|True"), //15
		new cr.Property(ept_float, 	"Size 4",		0.4,		"The size of the dot."), //16
		new cr.Property(ept_float, 	"Distance 4",		0.4,		"The distance from the center of the light."), //17
		new cr.Property(ept_color, 	"Color 4",		0xFF22FF,		"The color of the dot."), //18
		new cr.Property(ept_text, "Image 4", "flare.png", "The image filename."), //19

		new cr.Property(ept_combo, 	"Lensflare Enabled 5",		"True",		"Is the lensflare enabled.","False|True"), //20
		new cr.Property(ept_float, 	"Size 5",		0.1,		"The size of the dot."), //21
		new cr.Property(ept_float, 	"Distance 5",		0.6,		"The distance from the center of the light."), //22
		new cr.Property(ept_color, 	"Color 5",		0xFFFFFF,		"The color of the dot."), //23
		new cr.Property(ept_text, "Image 5", "flare.png", "The image filename.") //24
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
