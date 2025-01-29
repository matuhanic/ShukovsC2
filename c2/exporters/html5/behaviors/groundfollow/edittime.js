function GetBehaviorSettings()
{
	return {
		"name":			"Ground Follow",
		"id":			"groundfollow",
		"version":		"1.0",
		"description":	"Auto set the orientation of the platformer character on solid.",
		"author":		"Loïc Martinez",
		"help url":		"https://github.com/Mimiste/c2-groundfollow-behavior",
		"category":		"Movements",
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions

AddCondition(0, 0, "Is enabled", "", "{my} is enabled", "Test whether the behavior is currently enabled.", "IsEnabled");

//////////////////////////////////////////////////////////////
// Actions

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether the object follow the ground angle or not.", 1);
AddAction(0, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set if the object follow the ground angle or not.", "SetEnabled");

//////////////////////////////////////////////////////////////
// Expressions

ACESDone();

// Property grid properties for this plugin
var property_list = [
    new cr.Property(ept_combo, "Initial state", "Enabled", "Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled"),
	new cr.Property(ept_integer, "Catch precision", 15, "A higher number will be more precise but will be slower to catch the ground angle."),
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
	// Set initial value for "default controls" if empty (added r51)
	if (property_name === "Default controls" && !this.properties["Default controls"])
		this.properties["Default controls"] = "Yes";
}
