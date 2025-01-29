function GetPluginSettings()
{
	return {
		"name":			"CordovaSocialSharing",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"CordovaSocialSharing",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Social sharing calling cordova-plugin-x-socialsharing",
		"author":		"Josek5494",
		"help url":		"http://hermitsdevelopment.blogspot.com.es",
		"category":		"Plugins by Josek5494",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":	pf_singleglobal
	};
};

////////////////////////////////////////
// Conditions


////////////////////////////////////////
// Actions
AddStringParam("Message", "");
AddStringParam("Subject", "");
AddStringParam("Link", "");
AddStringParam("Image/File", "");
AddAction(1, af_none, "Share", "Share Widget", "Share", 
	"Opens a widget with the differents methods of sharing availables in the device. (Recommended)", "generalShare");

AddStringParam("Message", "");
AddStringParam("Link", "");
AddStringParam("Image/File", "");
AddAction(2, af_none, "Twitter share", "Share Directly", "Twitter share", 
	"Skip the dialog and share directly to Twitter", "twitterShare");

AddStringParam("Message", "Beware: it's against Facebook Policies and doesn't work always.");
AddStringParam("Link", "");
AddStringParam("Image/File", "");
AddAction(3, af_none, "Facebook share", "Share Directly", "Facebook share", 
	"Skip the dialog and share directly to Facebook", "facebookShare");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Properties

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