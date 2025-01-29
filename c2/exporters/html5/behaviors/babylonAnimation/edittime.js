function GetBehaviorSettings()
{
	return {
		"name":			"Animation",
		"id":			"babylonAnimation",
		"version":		"1.0",
		"description":	"Apply an animation to an entity (Light,Mesh or Camera).",
		"author":		"X3M",
		"help url":		"",
		"category":		"Babylon General",
		"flags":		0						// uncomment lines to enable flags...
						//| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions
AddNumberParam("Start frame", "", initial_string = "0");
AddNumberParam("End frame", "", initial_string = "20");
AddNumberParam("Speed", "", initial_string = "1");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Loop", "", "Disabled");
AddAction(0, af_none, "Begin", "", "{my}: Begin animation from <b>{0}</b> to <b>{1}</b> with speed <b>{2}</b> and loop set <b>{3}</b>", "", "Begin");
AddAction(1, af_none, "Stop", "", "{my}: Stop animation", "", "Stop");

//////////////////////////////////////////////////////////////
// Expressions
ACESDone();

// Property grid properties for this plugin
var property_list = [		
		new cr.Property(ept_text, "Anim name", "move", "The animation name, so that it can be referenced later."), 
		new cr.Property(ept_text, "Parameter", "position.y", "The parameter that should be animated, ex:position.x;scaling.x;rotation.x;...."), 
		new cr.Property(ept_integer, 	"FPS",		30,		"How many frames are played per second."),
		new cr.Property(ept_integer, 	"Start Frame",		0,		"The start frame."),
		new cr.Property(ept_float, 	"Start Value",		0,		"The value of the property."),
		new cr.Property(ept_integer, 	"Mid Frame",		10,		"The start frame."),
		new cr.Property(ept_float, 	"Mid Value",		20,		"The value of the property."),
		new cr.Property(ept_integer, 	"End Frame",		40,		"The start frame."),
		new cr.Property(ept_float, 	"End Value",		100,		"The value of the property."),
		new cr.Property(ept_float, 	"Blending speed",		0.5,		"The value of the blending speed."),
		new cr.Property(ept_combo, 	"Easing Type",		"None",		"Choose an easing function.","None|BackEase|BounceEase|CubicEase|ElasticEase|ExponentialEase|PowerEase|SineEase"),
		new cr.Property(ept_float, 	"Amplitude",		0.5,		"Backease amplitude."),
		new cr.Property(ept_integer, "Bounces",		2,		"Bounceease bounces count."),
		new cr.Property(ept_float, 	"Bounciness",		0.4,		"Bounceease bounciness."),
		new cr.Property(ept_float, 	"Oscillations",		0.7,		"Elasticease oscillations."),
		new cr.Property(ept_float, 	"Springiness",		0.6,		"Elasticease springiness."),
		new cr.Property(ept_float, 	"Exponent",		0.4,		"Elasticease exponent."),
		new cr.Property(ept_float, 	"Power",		0.4,		"PowerEase power."),
		new cr.Property(ept_combo, 	"Easing Mode",		"In",		"Choose an easing mode.","In|InOut|Out")
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
