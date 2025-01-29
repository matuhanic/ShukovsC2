function GetBehaviorSettings()
{
	return {
		"name":			"NWrap",
		"id":			"nwrap",
		"version":		"1.0",
		"description":	"Make an object leaving the layout reappear on the other side.",
		"author":		"???",
		"help url":		"",
		"category":		"General",
		"flags":		bf_onlyone
	};
};

////////////////////////////
//Condition
AddCondition(0, cf_trigger, "On Wrap", "Triggers", "{my} On Wrap", "Triggered when Wraping.", "OnWrap");

//////////////////////////////////////////////////////////////
// Actions
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.");
AddAction(0, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get state", "", "State", "Get current state the behavior, 0=disabled, 1=enabled.");

// No ACES
ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,		"Wrap to",	"Layout",		"Whether to wrap to layout bounds or viewport bounds.", "Layout|Viewport"),
	new cr.Property(ept_combo, "Initial state", "Enabled", "Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled")
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
