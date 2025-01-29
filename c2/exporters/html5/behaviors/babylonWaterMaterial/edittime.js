function GetBehaviorSettings() {
	return {
		"name": "Water material",
		"id": "babylonWaterMat",
		"version": "1.0",
		"description": "Apply a water material to this mesh.",
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
	new cr.Property(ept_text, "Bump texture", "waterbump.png", ""),
	new cr.Property(ept_integer,		"Wind force",		-15,			""),
	new cr.Property(ept_float,		"Wave height",		0,			""),
	new cr.Property(ept_integer,		"Wind direction x",		1,			""),
	new cr.Property(ept_integer,		"Wind direction y",		1,			""),
	new cr.Property(ept_color, 	"Water color",		0x1111FF,		""),
	new cr.Property(ept_float,		"Color blend factor",		0.3,			""),
	new cr.Property(ept_float,		"Bump height",		1,			""),
	new cr.Property(ept_float,		"Wave length",		0.1,			""),
	new cr.Property(ept_text, "Meshes render list", "mesh1,mesh4,skyBox0", "")

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
