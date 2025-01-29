function GetPluginSettings()
{
	return {
		"name":			"App Review",				
		"id":			"EMI_INDO_plugin_app_review",
		"version":		"1.0.0.3",					
		"description":	"cordova-plugin-app-review",
		"author":		"EMI INDO",
		"help url":		"https://www.cordova-c3addon.store/?page_id=422",
		"category":		"EMI INDO",				
		"type":			"object",				
		"rotatable":	false,					
		"cordova-plugins":	"cordova-plugin-app-review",
		"flags":	pf_singleglobal
	};
};


AddAction(0, af_none, "open Store Screen", "App Review", 
                      "open Store Screen", 
	                  "Most of time you can just use a boilerplate below to trigger the inapp review dialog and fallback to app/play store screen when the dialog wasn't displayed:", 
					  "aa");
					  
AddAction(1, af_none, "request Review", "App Review", 
                      "request Review", 
	                  "Launches inapp review dialog.", 
					  "bb");
AddStringParam("package_name", 		"Launches App/Play store page with a review form.");	
AddAction(2, af_none, "package_name", "App Review", 
                      "package: <b>{0}</b>.", 
	                  "By default current app screen is displayed. Optionally you can pass a package name string to show another app details.", 
					  "cc");
				  

ACESDone();

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