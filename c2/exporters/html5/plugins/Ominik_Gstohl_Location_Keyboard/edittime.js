function GetPluginSettings()
{
	return {
		"name":			"LocationKeyboard",
		"id":			"LocationKeyboard",
		"version":		"1.0",
		"description":	"Retrieve input from the keyboard and gets location.",
		"author":		"Dominik Gstöhl",
		"help url":			"none",
		"category":		"Input",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions

AddComboParamOption("standard");
AddComboParamOption("left");
AddComboParamOption("right");
AddKeybParam("Key", "Choose a numeric key code to test.");
AddComboParam("Location", "Choose a key and a Location on the Keyboard. Note that this is made for key that are multiple on the keyboard.", 0);
AddCondition(8,	0,	"Key is down at location",	"Keyboard", "<b>{0}</b> is down on <b>{1}</b>", "Test if a keyboard key is currently held down on the given location.", "IsKeyDownLocation");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "", "Key codes", "LastKeyCode", "Get the key code for the last pressed key.");

AddNumberParam("Key code", "The key code to get a string from");

AddExpression(1, ef_return_string, "", "Key codes", "StringFromKeyCode", "Get a character string representing a key code.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
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
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
