function GetPluginSettings()
{
	return {
		"name":			"BHT Smart Random",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"BHT_Smart_Random",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Generates non-repeating integers in a range with a guaranteed non-repeat threshold.",
		"author":		"David Taylor/Black Hornet Technologies",
		"help url":		"http://blackhornettechnologies.com/construct2/plugins/BHTSmartRandom.aspx",
		"category":		"Data & Storage",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0
	};
};

AddAction(0, af_none, "Randomize", "Smart Random", "Randomize the data.", "Given the start and end settings, start the randomization.", "Randomize");

AddNumberParam("Start", "The initial value to start with.", "1");
AddNumberParam("End", "The final value to end on.", "10");
AddNumberParam("Threshold", "The number of values that must be enforced to be unique when the cycle repeats.", "1");
AddAction(1, af_none, "New", "Smart Random", "Generate unique random numbers in the range {{0}-{1}} (inclusive), that will not repeat for {2} value(s).", "Generate with new settings.", "New");

AddExpression(0, ef_return_number, "Get next value", "Smart Random", "Next", "Return the next random value within the range specified.");
AddExpression(1, ef_return_number, "Get Start value", "Smart Random", "Start", "Return the start of range value.");
AddExpression(2, ef_return_number, "Get End value", "Smart Random", "End", "Return the end of range value.");
AddExpression(3, ef_return_number, "Get Threshold value", "Smart Random", "Threshold", "Return the threshold value.");
AddExpression(4, ef_return_number, "Peek at the next value without removing it", "Smart Random", "Peek", "Return the next value but don't remove it.");

////////////////////////////////////////
ACESDone();

var property_list = [
	new cr.Property(ept_integer, 	"Start",				1,		"The initial value to start with."),
	new cr.Property(ept_integer, 	"End",					10,		"The final value to end on."),
	new cr.Property(ept_integer, 	"Repeat threshold",		1,		"The number of values that must be enforced to be unique when the cycle repeats.")
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
		
	// Plugin-specific variables
	// this.myValue = 0...
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