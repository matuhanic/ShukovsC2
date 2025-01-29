function GetBehaviorSettings()
{
	return {
		"name":			"Spaceship",
		"id":			"Spaceship",
		"version":		"0.2",
		"description":		"Moves an object like a spaceship with a rear thruster, preserving inertia",
		"author":		"Gabriel Perácio",
		"help url":		"http://www.sigsonic.com",
		"category":		"Movements",
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, 0, "Is moving", "", "{my} is moving", "True when the object is moving.", "IsMoving");

AddCmpParam("Comparison", "Choose the way to compare the current speed.");
AddNumberParam("Speed", "The speed, in pixels per second, to compare the current speed to.");
AddCondition(1, 0, "Compare speed", "", "{my} speed {0} {1}", "Compare the current speed of the object.", "CompareSpeed");

AddCmpParam("Comparison", "Choose the way to compare the current movement angle.");
AddNumberParam("Angle", "The angle, in degrees, to compare the current angle to.");
AddCondition(2, 0, "Compare angle", "", "{my} angle {0} {1}", "Compare the current angle of the object.", "CompareAngle");

//////////////////////////////////////////////////////////////
// Actions
AddAction(0, 0, "Stop", "", "Stop {my}", "Set the speed to zero.", "Stop");
AddAction(1, 0, "Reverse", "", "Reverse {my}", "Invert the direction of motion.", "Reverse");

AddComboParamOption("Stop ignoring");
AddComboParamOption("Start ignoring");
AddComboParam("Input", "Set whether to ignore the controls for this movement.");
AddAction(2, 0, "Set ignoring input", "", "{0} {my} user input", "Set whether to ignore the controls for this movement.", "SetIgnoreInput");

AddNumberParam("SetMovingAngle", "The new angle of the motion to set.");
AddAction(3, 0, "Set motion angle", "", "Set {my} motion angle to <i>{0}</i>", "Set the object's current motion angle.", "SetMovingAngle");

AddNumberParam("SetSpeed", "The new speed of the object to set.");
AddAction(4, 0, "Set speed", "", "Set {my} speed to <i>{0}</i>", "Set the object's current speed.", "SetSpeed");

AddNumberParam("SetMaxSpeed", "The new maximum speed of the object to set.");
AddAction(5, 0, "Set max speed", "", "Set {my} maximum speed to <i>{0}</i>", "Set the object's maximum speed.", "SetMaxSpeed");

AddNumberParam("SetAcceleration", "The new acceleration of the object to set.");
AddAction(6, 0, "Set acceleration", "", "Set {my} acceleration to <i>{0}</i>", "Set the object's acceleration.", "SetAcceleration");

AddNumberParam("SetDeceleration", "The new deceleration of the object to set.");
AddAction(7, 0, "Set deceleration", "", "Set {my} deceleration to <i>{0}</i>", "Set the object's deceleration.", "SetDeceleration");

AddNumberParam("SetVectorX", "The new X vector component of the object to set.");
AddAction(8, 0, "Set X Vector", "", "Set {my} X vector to <i>{0}</i>", "Set the object's X vector component.", "SetVectorX");

AddNumberParam("SetVectorY", "The new Y vector component of the object to set.");
AddAction(9, 0, "Set Y Vector", "", "Set {my} Y vector to <i>{0}</i>", "Set the object's Y vector component.", "SetVectorY");

AddNumberParam("SetTurnRate", "The new turning rate of the object to set.");
AddAction(10, 0, "Set Turn Rate", "", "Set {my} turn rate to <i>{0}</i>", "Set the object's turn rate.", "SetTurnRate");

AddAction(11, 0, "Reverse X vector", "", "Reverse X vector of  {my}", "Reverse the X vector component.", "ReverseX");
AddAction(12, 0, "Reverse Y vector", "", "Reverse Y vector of {my}", "Reverse the X vector component.", "ReverseY");

AddComboParamOption("Left");
AddComboParamOption("Right");
AddComboParamOption("Up");
AddComboParamOption("Down");
AddComboParam("Control", "The movement control to simulate pressing.");
AddAction(13, 0, "Simulate control", "", "Simulate {my} pressing {0}", "Control the movement by events.", "SimulateControl");


//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get motion angle", "", "MovingAngle", "The current angle of motion, in degrees");
AddExpression(1, ef_return_number, "Get speed", "", "Speed", "The current object speed.");
AddExpression(2, ef_return_number, "Get max speed", "", "MaxSpeed", "The maximum speed setting.");
AddExpression(3, ef_return_number, "Get acceleration", "", "Acceleration", "The acceleration setting.");
AddExpression(4, ef_return_number, "Get deceleration", "", "Deceleration", "The deceleration setting.");
AddExpression(5, ef_return_number, "Get vector X", "", "VectorX", "The current X component of motion.");
AddExpression(6, ef_return_number, "Get vector Y", "", "VectorY", "The current Y component of motion.");
AddExpression(7, ef_return_number, "Get turn rate", "", "TurnRate", "The current turning rate, in degrees per time.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_float, "Initial Motion Angle", 0, "Initial angle of the motion, in degrees."),
	new cr.Property(ept_float, "Initial Speed", 0, "The initial speed."),
	new cr.Property(ept_float, "Acceleration", 20, "The rate of acceleration."),
	new cr.Property(ept_float, "Deceleration", 20, "The rate of deceleration."),
	new cr.Property(ept_float, "Turn Rate", 2, "The rate of turning, in degrees per tick."),
	new cr.Property(ept_float, "Maximum Speed", 50, "The maximum speed."),
	new cr.Property(ept_combo, "On solid collision", "Bounce", "How to behave when hitting a solid.", "Do Nothing|Stop|Reverse|Bounce"),
	new cr.Property(ept_combo, "Default controls", "Yes", "If enabled, arrow keys control movement.  Otherwise, use the 'simulate control' action.", "No|Yes")
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
