function GetPluginSettings()
{
	return {
		"name":			"More Cursors",
		"id":			"MoreCursors",
		"version":		"1.0",
		"description":	"Extends the list of base cursors for mouse.",
		"author":		"FrezerTop",
		"help url":		"",
		"category":		"Input",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};


//////////////////////////////////////////////////////////////
// Actions
AddComboParamOption("Default");
AddComboParamOption("Pointer");
AddComboParamOption("Text select");
AddComboParamOption("Crosshair");
AddComboParamOption("Move");
AddComboParamOption("Help");
AddComboParamOption("Wait");
AddComboParamOption("None");
AddComboParamOption("Context menu");
AddComboParamOption("Progress");
AddComboParamOption("Cell");
AddComboParamOption("Vertical text select");
AddComboParamOption("Alias");
AddComboParamOption("Copy");
AddComboParamOption("No drop");
AddComboParamOption("Not allowed");
AddComboParamOption("All scroll	");
AddComboParamOption("Col resize	");
AddComboParamOption("Row resize");
AddComboParamOption("N resize");
AddComboParamOption("E resize");
AddComboParamOption("S resize");
AddComboParamOption("W resize");
AddComboParamOption("Ne resize");
AddComboParamOption("Nw resize");
AddComboParamOption("Se resize");
AddComboParamOption("Sw-resize");
AddComboParamOption("Ew resize");
AddComboParamOption("Ns resize");
AddComboParamOption("Nesw resize");
AddComboParamOption("Nwse resize");
AddComboParamOption("Zoom in");
AddComboParamOption("Zoom out");
AddComboParamOption("Grab");
AddComboParamOption("Grabbing");

AddComboParam("Cursor style", "Choose the cursor style to set.");
AddAction(0, 0, "Set cursor style", "Mouse", "Set cursor to <b>{0}</b>", "Change the style of the mouse cursor.", "SetCursor");


//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Current Mouse Cursor", "Cursor", "CurrentCursor", "Get name current mouse cursor.");

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
