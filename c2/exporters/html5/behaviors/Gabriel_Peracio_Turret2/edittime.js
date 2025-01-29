function GetBehaviorSettings()
{
	return {
		"name":			"Turret2",
		"id":			"Turret2",
		"description":	"Rotate an object in a fixed range, behaving like a turret.",
		"author":		"Gabriel Perácio",
		"help url":		"http://www.sigsonic.com",
		"category":		"Automatic movements",
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0,0,"Is rotating", "","{my} is rotating", "True when the object is rotating towards a target","IsRotating");
AddNumberParam("X", "The X position of the point");
AddNumberParam("Y", "The Y position of the point");
AddCondition(1,0,"Check for point within arc","","({0},{1}) within {my} arc","True when the point is within the arc, but not necessarily within range","PtWithinArc");
AddNumberParam("X", "The X position of the point");
AddNumberParam("Y", "The Y position of the point");
AddCondition(2,0,"Check for point within range","","({0},{1}) within {my} range","True when the point is within the firing range, but not necessarily inside the arc","PtWithinRange");
AddNumberParam("X", "The X position of the point");
AddNumberParam("Y", "The Y position of the point");
AddCondition(3,0,"Check if point can be fired upon","","{my} can fire upon point ({0},{1})","True when the point can be fired upon, due to being inside the arc and within range","PtCanFire");
AddObjectParam("Object", "Select the object to test for arc range.");
AddCondition(4,0,"Check for object within arc","","{0} within {my} arc","True when the object is within the arc, but not necessarily within range","ObjWithinArc");
AddObjectParam("Object", "Select the object to test for range.");
AddCondition(5,0,"Check for object within range","","{0} within {my} range","True when the object is within the firing range, but not necessarily inside the arc","ObjWithinRange");
AddObjectParam("Object", "Select the object to test for range.");
AddCondition(6,0,"Check if object can be fired upon","","{my} can fire upon {0}","True when the object can be fired upon, due to being inside the arc and within range","ObjCanFire");
AddObjectParam("Object", "Select the object to target.");
AddCondition(7,cf_not_invertible,"Target closest object","","Target closest {0}","Select the closest object that can be fired upon","ObjPickClosest");
AddCondition(8,0,"Has Target", "","{my} has a target", "True when the object has a target","hasTarget");
AddNumberParam("Tolerance", "The amount of freedom, in degrees, to consider the object as Lined up");
AddCondition(9,0,"Is ready to fire", "","{my} is ready to fire ({0}° tolerance)", "True when the object is lined up to the target","ready");

//////////////////////////////////////////////////////////////
// Actions
AddNumberParam("X", "The X position of the point");
AddNumberParam("Y", "The Y position of the point");
AddAction(0, 0, "Set point as target", "", "Set {my} target to ({0},{1})", "Set the object's current motion angle.", "PtSetTarget");

AddAction(1, 0, "Clear Target", "", "Clear {my}'s targets", "Make the object stop targeting.", "ClearTarget");

AddNumberParam("Turn Rate", "The new turn rate, in degrees.");
AddAction(2, 0, "Set turning rate", "", "Set {my} turning rate to {0})", "Set the object's turning rate.", "SetTurnRate");




//////////////////////////////////////////////////////////////
// Expressions

AddExpression(0, ef_return_number, "Get turn rate", "", "TurnRate", "The current turning rate, in degrees per time.");
AddExpression(1, ef_return_number, "Get target X position", "", "targetX", "The current X position of the target.");
AddExpression(2, ef_return_number, "Get target Y position", "", "targetY", "The current Y position of the target.");
AddExpression(3, ef_return_number, "Get target UID", "", "targetUID", "The UID (unique ID) of the selected object");



ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_float, "Heading", 0, "Midpoint of the arc, in degrees - that is, the resting angle of the turret when it is not aiming."),
	new cr.Property(ept_float, "Arc", 90, "The angle range of a turret, in degrees. Set to 360 for full motion range."),
	new cr.Property(ept_float, "Maximum Range", 200, "How far ahead can the turret \"see\"."),
	new cr.Property(ept_float, "Minimum Range", 0, "How far ahead does the target have to be in order for the turret to start firing - in other words, the \"Blind Spot\""),
	new cr.Property(ept_float, "Turning Rate", 50, "How fast, in angles, does the object turn to face its target."),
	new cr.Property(ept_combo, "When not aiming", "Rest", "How to behave when hitting idle.", "Do Nothing|Rest")
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
