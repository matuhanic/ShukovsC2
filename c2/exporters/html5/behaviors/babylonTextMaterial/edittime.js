function GetBehaviorSettings() {
	return {
		"name": "Text material",
		"id": "babylonTextMat",
		"version": "1.0",
		"description": "Apply a text material to this mesh.",
		"author": "X3M",
		"help url": "",
		"category": "Babylon Mesh",
		"flags": 0 // uncomment lines to enable flags...
		 | bf_onlyone // can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions

//////////////////////////////////////////////////////////////
// Actions
var id = 0;
AddStringParam("New text", "", initial_string = "\"My text\"");
AddNumberParam("X", "", initial_string = "0");
AddNumberParam("Y", "", initial_string = "20");
AddStringParam("Text params", "", initial_string = "\"Bold 20px Arial\"");
AddStringParam("Font color", "", initial_string = "\"rgba(0,0,0,1.0)\"");
AddStringParam("Background color", "", initial_string = "\"rgba(255,255,0,1.0)\"");
AddAction(id, af_none, "Update text", "Babylon Text Material", "{my}: Update text to <b>({0})</b> set x to <b>({1})</b> and y to <b>({2})</b> set text parameters to <b>({3})</b>.", "", "UpdateText");
id++;
AddStringParam("New text", "", initial_string = "\"My text\"");
AddNumberParam("X", "", initial_string = "0");
AddNumberParam("Y", "", initial_string = "20");
AddAction(id, af_none, "Add text", "Babylon Text Material", "{my}: Update text to <b>({0})</b> set x to <b>({1})</b> and y to <b>({2})</b>.", "", "AddText");
id++;

//////////////////////////////////////////////////////////////
// Expressions
var id = 20;

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text, "Text", "My text", ""),
	new cr.Property(ept_float, "X", 0.0, ""),
	new cr.Property(ept_float, "Y", 20.0, ""),
	new cr.Property(ept_float, "Width", 200.0, ""),
	new cr.Property(ept_float, "Height", 100.0, ""),
	new cr.Property(ept_text, "Text parameters", "Bold 20px Arial", "Boldness|Size|Font"),
	new cr.Property(ept_color, "Font color", 0x000000, ""),
	new cr.Property(ept_color, "Background color", 0xFFFF00, ""),
	new cr.Property(ept_float, "Background alpha", 1.0, ""),
	new cr.Property(ept_integer, "Billboardmod", 0, "0:None|1:Vertical|2:Horizantal")

];

// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType() {
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function (instance) {
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
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
IDEInstance.prototype.OnCreate = function () {}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function (property_name) {}
