function GetPluginSettings()
{
	return {
		"name":			"JSON",
		"id":			"playlive_json",
		"version":		"1.02",
		"description":	"JSON",
		"author":		"PlayLive",
		"help url":		"https://www.scirra.com/forum/plugin-json_t178836?sid=e3d4090ade6cc56309886961cae45151",
		"category":		"Addon",
		"type":			"object",
		"rotatable":	false,
		"flags":		0
	};
};

////////////////////////////////////////
// Conditions
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different JSON requests.", "\"\"");
AddCondition(0,	cf_trigger, "On completed", "JSON", "On <b>{0}</b> completed", "Triggered when the loading completes successfully.", "OnComplete");

AddCondition(1,	cf_trigger, "On any completed", "JSON", "On <b>ANY</b> completed", "Triggered when the loading completes successfully.", "OnAnyComplete");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different JSON requests.", "\"\"");
AddCondition(2,	cf_trigger, "On error", "JSON", "On <b>{0}</b> error", "Triggered when an JSON request fails.", "OnError");

AddCondition(3,	cf_trigger, "On any error", "JSON", "On <b>ANY</b> error", "Triggered when an JSON request fails.", "OnAnyError");

AddCondition(4, cf_none, "Is empty", "JSON", "Is empty", "JSON is empty", "IsEmpty");

////////////////////////////////////////
// Actions
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different JSON requests.", "\"\"");
AddStringParam("URL", "The URL to request.  Note: most browsers prevent cross-domain requests.", "\"http://\"");
AddComboParamOption("GET");
AddComboParamOption("POST");
AddComboParam("Type", "Choose the type between 'GET' and 'POST'.");
AddAction(0, 0, "Load JSON", "JSON", "Load JSON(<i>{0}</i>)", "Load a JSON-File.", "LoadJSON");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different JSON requests.", "\"\"");
AddStringParam("JSON", "Set JSON value.", "\"\"");
AddAction(1, 0, "Set JSON", "JSON", "Set JSON(<i>{0}</i>)", "Set JSON value.", "SetJSON");

AddAction(2, 0, "Clear JSON", "JSON", "Clear JSON", "Clear all values inside the JSON.", "Clear");

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Get last data", "JSON", "GetAsJSON", "Return the contents in JSON format.");

AddAnyTypeParam("Root", "Enter the root (keyword or position) to get the key name.");
AddExpression(1, ef_return_string | ef_variadic_parameters, "Get key name", "JSON", "GetKeyName", "Get key name via position.");

AddAnyTypeParam("Root", "Enter the root (position or keyword) to count its values.");
AddExpression(2, ef_return_number | ef_variadic_parameters, "Get size", "JSON", "GetSize", "How many values are in use.");

AddAnyTypeParam("Root", "Enter the root (position or keyword) for the loading.");
AddExpression(3, ef_return_any | ef_variadic_parameters, "Get value", "JSON", "GetValue", "Get value.");

AddExpression(4, ef_return_string, "Get tag", "JSON", "GetTag", "Get the last tag name.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
var property_list = [];
	
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
	return new IDEInstance(instance);
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

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}