function GetBehaviorSettings() {
	return {
		"name": "Shadows",
		"id": "babylonSLEShadows",
		"version": "1.0",
		"description": "Add shadow casting to the light.",
		"author": "X3M",
		"help url": "",
		"category": "Babylon Light",
		"flags": 0						// uncomment lines to enable flags...
		| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////////////
// Actions
AddObjectParam("Mesh", "The mesh which should not cast shadows");
AddAction(0, af_none, "Remove mesh from rendering stack", "Babylon Shadows", "{my}: Prevent mesh {0} from casting shadows.", "Prevent mesh from casting shadow", "PreventMeshCastShad");
AddObjectParam("Mesh", "The mesh which should not cast shadows");
AddAction(1, af_none, "Add mesh to rendering stack", "Babylon Shadows", "{my}: Allow mesh {0} to cast shadows.", "Allow mesh to cast shadow", "AllowMeshCastShad");
AddNumberParam("Bias", "Bigger value means less precise shadows", initial_string = "0.005");
AddAction(2, af_none, "Set bias", "", "{my}: Set bias of shadows to <b>{0}</b>.", "Set bias of shadows", "SetBias");
AddNumberParam("Blur offset", "s", initial_string = "2");
AddAction(3, af_none, "Set blur offset", "", "{my}: Set blur offset of blurvariance shadows to <b>{0}</b>.", "Set blur offset of shadows", "SetBlurOffs");
AddNumberParam("Blur scale", "", initial_string = "1");
AddAction(4, af_none, "Set blur scale", "", "{my}: Set blur scale of blurvariance shadows to <b>{0}</b>.", "Set blur scale of shadows", "SetBlurScale");
AddNumberParam("Filter", "", initial_string = "1");
AddAction(5, af_none, "Set filter", "", "{my}: Set filter of shadows to <b>{0}</b>.", "Set filter of shadows", "SetFilter");
AddComboParamOption('Disabled');
AddComboParamOption('Enabled');
AddComboParam('State', 'Set state', 'Disabled');
AddAction(6, af_none, "Set backfaces only", "", "{my}: Set  backfaces only to <b>{0}</b>.", "Set backfaces only", "SetBackface");
AddNumberParam("Lightness", "0: dark,1:light", initial_string = "0.2");
AddAction(7, af_none, "Set lightness", "", "{my}: Set lightness of shadows to <b>{0}</b>.", "Set darkness of shadows", "SetDarkness");
//////////////////////////////////////////////////////////////
// Expressions
ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Sampling mod", "Poisson", "The sampling mod of the shadows.", "Variance|BlurVariance|Poisson"),
	new cr.Property(ept_combo, "Force backface only", "False", "Force shadows to be only projected on the backfaces.", "False|True"),
	new cr.Property(ept_integer, "Map size", 1024, "The shadow map size, 512,1024,etc..."),
	new cr.Property(ept_float, "Lightness", 0.2, "Lightness of the shadows."),
	new cr.Property(ept_float, "Blur box offset", 2, "Bluring offset for blur variance."),
	new cr.Property(ept_float, "Blur scale", 1, "Bluring scale for blur variance.")
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
IDEInstance.prototype.OnCreate = function () {
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function (property_name) {

}
