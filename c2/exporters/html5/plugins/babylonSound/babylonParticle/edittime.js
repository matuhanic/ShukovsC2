function GetBehaviorSettings()
{
	return {
		"name":			"Particle",
		"id":			"babylonParticle",
		"version":		"1.0",
		"description":	"Adds a particle system to a mesh.",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon Mesh",
		"flags":		0						
						| bf_onlyone			
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions

//////////////////////////////////////////////////////////////
// Expressions
populateCommonACE();
ACESDone();

// Property grid properties for this plugin
var property_list = [		
		new cr.Property(ept_integer, 	"Capacity",		1000,		"The maximum number of particles."), 
		new cr.Property(ept_text, "Texture", "flare.png", "The texture filename."),
		new cr.Property(ept_text, "Start offset", "-0.5,-0.5,-0.5", "The starting offset of the emission, represents the bottom of the bounding box."),
		new cr.Property(ept_text, "End offset", "0.5,0.5,0.5", "The ending offset of the emission, represents the top of the bounding box."),
		new cr.Property(ept_text, "Direction A", "10,20,0", "The direction which half of the particles take."),
		new cr.Property(ept_text, "Direction B", "-10,20,0", "The direction wich the other half of the particles take."),
		new cr.Property(ept_color, 	"Start color",		0xFF0000,		"The starting color."), 
		new cr.Property(ept_color, 	"Mid color",		0x00FF00,		"The mid range color."), 
		new cr.Property(ept_color, 	"End color",		0x0000FF,		"The ending color."), 
		new cr.Property(ept_float, 	"Min life",		1.0,		"The minimum duration of the life of a particle."), 
		new cr.Property(ept_float, 	"Max life",		4.0,		"The maximum duration of the life of a particle."), 		
		new cr.Property(ept_float, 	"Min size",		0.5,		"The minimum size of a particle."), 
		new cr.Property(ept_float, 	"Max size",		2.0,		"The maximum size of a particle."), 
		new cr.Property(ept_integer, 	"Emit rate",		200,		"The number of particles emitted constantly."), 
		new cr.Property(ept_float, 	"Min angle",		0.0,		"The minimum angle of a particle."), 
		new cr.Property(ept_float, 	"Max angle",		45.0,		"The maximum angle of a particle."), 		
		new cr.Property(ept_float, 	"Min power",		10.0,		"The minimum emission power of a particle."), 
		new cr.Property(ept_float, 	"Max power",		20.0,		"The maximum emission power of a particle."), 
		new cr.Property(ept_float, 	"Update speed",		0.01,		"The upadte speed of the system."), 
		new cr.Property(ept_text, "Gravity", "0,-9.81,0", "The gravity applied to the system."),
		new cr.Property(ept_combo, "Autostart", "False", "", "False|True")
	
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
