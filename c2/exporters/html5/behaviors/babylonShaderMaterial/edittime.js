function GetBehaviorSettings() {
	return {
		"name": "Shader material",
		"id": "babylonShaderMat",
		"version": "1.0",
		"description": "Apply a shader material to this mesh.",
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
AddStringParam("Parameter", "", initial_string = "\"myFloat\"");
AddNumberParam("Value", "", initial_string = "0");
AddAction(id, af_none, "Set float", "Babylon Shader Material", "{my}: Set float <b>({0})</b> value to <b>({1})</b>.", "", "SetFloat");
id++;
AddStringParam("Parameter", "", initial_string = "\"myTexture\"");
AddStringParam("Value", "", initial_string = "\"image.png\"");
AddAction(id, af_none, "Set texture", "Babylon Shader Material", "{my}: Set texture to <b>({0})</b> value to <b>({1})</b>.", "", "SetTexture");
id++;
AddStringParam("Parameter", "", initial_string = "\"myVector3\"");
AddNumberParam("X", "", initial_string = "0");
AddNumberParam("Y", "", initial_string = "0");
AddNumberParam("Z", "", initial_string = "0");
AddAction(id, af_none, "Set vector3", "Babylon Shader Material", "{my}: Set vector3 <b>({0})</b> value to <b>({1},{2},{3})</b>.", "", "SetVector3");
id++;
AddStringParam("Parameter", "", initial_string = "\"myVector2\"");
AddNumberParam("X", "", initial_string = "0");
AddNumberParam("Y", "", initial_string = "0");
AddAction(id, af_none, "Set vector2", "Babylon Shader Material", "{my}: Set vector2 <b>({0})</b> value to <b>({1},{2})</b>.", "", "SetVector2");
id++;
AddStringParam("Parameter", "", initial_string = "\"myColor3\"");
AddNumberParam("R", "", initial_string = "0");
AddNumberParam("G", "", initial_string = "0");
AddNumberParam("B", "", initial_string = "0");
AddAction(id, af_none, "Set color3", "Babylon Shader Material", "{my}: Set color3 <b>({0})</b> value to <b>({1},{2},{3})</b>.", "", "SetColor3");
id++;
AddStringParam("Parameter", "", initial_string = "\"myColor4\"");
AddNumberParam("R", "", initial_string = "0");
AddNumberParam("G", "", initial_string = "0");
AddNumberParam("B", "", initial_string = "0");
AddNumberParam("A", "", initial_string = "0");
AddAction(id, af_none, "Set color4", "Babylon Shader Material", "{my}: Set color4 <b>({0})</b> value to <b>({1},{2},{3},{4})</b>.", "", "SetColor4");
id++;
//////////////////////////////////////////////////////////////
// Expressions
var id = 20;

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text, "Vertex shader", "", ""),
	new cr.Property(ept_text, "Fragment shader", "", ""),
	new cr.Property(ept_text, "Attributes", "", ""),
	new cr.Property(ept_text, "Uniforms", "", "")

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
