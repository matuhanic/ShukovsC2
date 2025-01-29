//All rights of distribution and editing reserved to Jose Carlos Hernández González (Josek5494) Spain
function GetPluginSettings()
{
	return {
		"name":			"Cordova Open Native Settings",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"CordovaOpNatSet",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Open the device native settings in Android and iOS 8",
		"author":		"Josek5494",
		"help url":		"http://hermitsdevelopment.blogspot.com.es",
		"category":		"Plugins by Josek5494",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":	pf_singleglobal//,
	};
};

////////////////////////////////////////
// Conditions

AddCondition(0, cf_trigger, "On open Android location settings suceed", "Cordova Native Settings", "On open Android location settings suceed", "Triggered when the Android location settings opens succesfully.", "onAndLocSuc");
AddCondition(1, cf_trigger, "On open iOS 8 native settings suceed", "Cordova Native Settings", "On open iOS 8 native settings suceed", "Triggered when the iOS 8 native settings opens succesfully.", "onIOSNatSuc");
AddCondition(2, cf_trigger, "On open Android custom native setting suceed", "Cordova Native Settings", "On open Android custom native setting suceed", "Triggered when the Android custom native setting opens succesfully.", "onAndCusSuc");
AddCondition(3, cf_trigger, "On open Android location settings failed", "Cordova Native Settings", "On open Android location settings failed", "Triggered when the Android location settings fails.", "onAndLocFail");
AddCondition(4, cf_trigger, "On open iOS 8 native settings failed", "Cordova Native Settings", "On open iOS 8 native settings failed", "Triggered when the iOS 8 native settings fails.", "onIOSNatFail");
AddCondition(5, cf_trigger, "On open Android custom native setting failed", "Cordova Native Settings", "On open Android custom native setting failed", "Triggered when the Android custom native setting fails.", "onAndCusFail");

////////////////////////////////////////
// Actions

AddAction(0, af_none, "Open Android location settings", "Cordova native settings", "Open Android location settings", 
	"Open the native location settings in your Android device.", "opAndLocSet");

AddAction(1, af_none, "Open iOS 8 location settings", "Cordova native settings", "Open iOS 8 location settings", 
	"Open the native location settings in your iOS 8 device.", "opIOSNatSet");

AddComboParamOption("Open");
AddComboParamOption("Accesibility");
AddComboParamOption("Add Account");
AddComboParamOption("Airplane mode");
AddComboParamOption("Apn");
AddComboParamOption("Application details");
AddComboParamOption("Application development");
AddComboParamOption("Application");
AddComboParamOption("Bluetooth");
AddComboParamOption("Captioning");
AddComboParamOption("Cast");
AddComboParamOption("Data roaming");
AddComboParamOption("Date");
AddComboParamOption("Device info");
AddComboParamOption("Display");
AddComboParamOption("Dream");
AddComboParamOption("Home");
AddComboParamOption("Input method");
AddComboParamOption("Input method subtype");
AddComboParamOption("Internal storage");
AddComboParamOption("Locale");
AddComboParamOption("Location source");
AddComboParamOption("Manage all applications");
AddComboParamOption("Manage applications");
AddComboParamOption("Memory card");
AddComboParamOption("Network operator");
AddComboParamOption("Nfc sharing");
AddComboParamOption("Nfc payment");
AddComboParamOption("Nfc settings");
AddComboParamOption("Print");
AddComboParamOption("Privacy");
AddComboParamOption("Quick launch");
AddComboParamOption("Search");
AddComboParamOption("Security");
AddComboParamOption("Settings");
AddComboParamOption("Show regulatory info");
AddComboParamOption("Sound");
AddComboParamOption("Sync");
AddComboParamOption("Usage access");
AddComboParamOption("User dictionary");
AddComboParamOption("Voice input");
AddComboParamOption("Wifi ip");
AddComboParamOption("Wifi");
AddComboParamOption("Wireless");
AddComboParam("Setting name", "", 3);

AddAction(2, af_none, "Open Android custom setting", "Cordova native settings", "Open Android custom setting", 
	"Open a native custom setting in your Android device.", "opAndCusSet");

////////////////////////////////////////
// Expressions

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