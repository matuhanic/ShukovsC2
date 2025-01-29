function GetBehaviorSettings()
{
	return {
		"name":			"Wrap",
		"id":			"wrapPlus",
		"version":		"1.1",
		"description":	"Make an object leaving the layout reappear on the other side. Enhanced version of Scirra's Wrap behavior.",
		"author":		"GameSoul",
		"help url":		"http://www.scirra.com/manual/105/wrap",
		"category":		"GameSoul - General",
		"flags":		bf_onlyone
	};
};
// Conditions
AddCondition(0, 0, "Is enabled", "", "{my} is enabled", "Test if the behavior is enabled.", "IsBehaviorEnabled");
AddCondition(1, cf_trigger, "On wrap", "", "{my} on wrap", "Triggered when wraping.", "OnWrap");

// Actions
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.");
AddAction(0, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");

AddComboParamOption("Both");
AddComboParamOption("Horizontal only");
AddComboParamOption("Vertical only");
AddComboParam("Ways", "The ways in which the object can be wrapped.");
AddAction(1, af_none, "Set ways", "", "Set {my} ways <b>{0}</b>", "Set which ways the object can be wrapped.", "SetWays");

AddNumberParam("Left margin", "The new left margin of the object to set.");
AddAction(2, 0, "Set left margin", "", "Set {my} left margin to <i>{0}</i>", "Set the object's left margin.", "SetLeftMargin");

AddNumberParam("Right margin", "The new right margin of the object to set.");
AddAction(3, 0, "Set right margin", "", "Set {my} right margin to <i>{0}</i>", "Set the object's right margin.", "SetRightMargin");

AddNumberParam("Top margin", "The new top margin of the object to set.");
AddAction(4, 0, "Set top margin", "", "Set {my} top margin to <i>{0}</i>", "Set the object's top margin.", "SetTopMargin");

AddNumberParam("Bottom margin", "The new bottom margin of the object to set.");
AddAction(5, 0, "Set bottom margin", "", "Set {my} bottom margin to <i>{0}</i>", "Set the object's bottom margin.", "SetBottomMargin");

// Expressions
AddExpression(0, ef_return_number, "Enabled", "", "Enabled", "The current initial state of behavior.");
AddExpression(1, ef_return_number, "LeftMargin", "", "LeftMargin", "Get the left margin value.");
AddExpression(2, ef_return_number, "RightMargin", "", "RightMargin", "Get the right margin value.");
AddExpression(3, ef_return_number, "TopMargin", "", "TopMargin", "Get the top margin value.");
AddExpression(4, ef_return_number, "BottomMargin", "", "BottomMargin", "Get the bottom margin value.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,		"Wrap to",			"Layout",		"Whether to wrap to layout bounds, viewport bounds or custom coordinates.", "Layout|Viewport|Custom coordinates"),
	new cr.Property(ept_combo,		"Ways",				"Both",			"Which ways the object can be wrapped.", "Both|Horizontal only|Vertical only"),
	new cr.Property(ept_float,		"Left margin",		0,				"The left margin to which an object will wrap around."),
	new cr.Property(ept_float,		"Right margin",		854,			"The right margin to which an object will wrap around."),
	new cr.Property(ept_float,		"Top margin",		0,				"The top margin to which an object will wrap around."),
	new cr.Property(ept_float,		"Bottom margin",	480,			"The bottom margin to which an object will wrap around."),
	new cr.Property(ept_combo,		"Initial state", 	"Enabled",		"Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled")
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
