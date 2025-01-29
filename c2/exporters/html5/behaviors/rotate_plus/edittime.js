function GetBehaviorSettings()
{
	return {
		"name":			"Rotate",
		"id":			"RotatePlus",
		"version":		"0.2",
		"description":	"Make an object spin. Enhanced version of Scirra´s Rotate behavior.",
		"author":		"GameSoul",
		"help url":		"http://www.google.com",
		"category":		"GameSoul - Movements",
		"flags":		0
						| bf_onlyone
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, 0, "Is enabled", "", "{my} is enabled", "Test if the behavior is enabled.", "IsBehaviorEnabled");
//////////////////////////////////////////////////////////////
// Actions
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.", 1);
AddAction(0, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");

AddNumberParam("Acceleration", "The new rotation acceleration, in degrees per second.");
AddAction(1, 0, "Set acceleration", "", "Set {my} acceleration to {0} degrees per second", "Set the rate the object's spinning changes.", "SetAcceleration");

AddNumberParam("Speed", "The new rotation speed, in degrees per second.", 0);
AddAction(2, 0, "Set speed", "", "Set {my} speed to {0} degrees per second", "Set the rate the object spins at.", "SetSpeed");                
//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get acceleration", "", "Acceleration", "The current rotation acceleration, in degrees per second.");
AddExpression(1, ef_return_number, "Get current speed", "", "Speed", "The current rotation speed, in degrees per second.");
AddExpression(2, ef_return_number, "Enabled", "", "Enabled", "The current initial state of behavior.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_float, "Speed", 180, "The rotation speed, in degrees per second. Positive is clockwise and negative is anticlockwise."),
	new cr.Property(ept_float, "Acceleration", 0, "Rotation acceleration, in degrees per second (negative slows down)."),
	new cr.Property(ept_combo, "Initial state", "Enabled", "Whether the behavior is initially enabled or disabled.", "Disabled|Enabled")
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
