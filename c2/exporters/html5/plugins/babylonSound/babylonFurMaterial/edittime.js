function GetBehaviorSettings() {
	return {
		"name": "Fur material",
		"id": "babylonFurMat",
		"version": "1.0",
		"description": "Apply a fur material to this mesh.",
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

//////////////////////////////////////////////////////////////
// Expressions
var id = 20;

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, 	"Highlevel",		"False",		"","False|True"),
	new cr.Property(ept_float,		"Fur length",		3,			""),
	new cr.Property(ept_float,		"Fur angle",		0,			""),
	new cr.Property(ept_text, "[Optional] Fur texture", "", 		""),
	new cr.Property(ept_color, 	"Fur color",		0x1111FF,		"")

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
