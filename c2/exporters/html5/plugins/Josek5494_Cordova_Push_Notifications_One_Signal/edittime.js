//All rights of distribution and editing reserved to Jose Carlos Hernández González (Josek5494) Spain
function GetPluginSettings()
{
	return {
		"name":			"Cordova Push notifications One Signal",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"CordovaPushNotifications",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"This plugin let's you use push notifications with One Signal service.",
		"author":		"Josek5494",
		"help url":		"http://hermitsdevelopment.blogspot.com.es",
		"category":		"Plugins by Josek5494",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":	pf_singleglobal//,
		//"cordova-plugins":	"https://github.com/one-signal/OneSignal-Cordova-SDK.git#PGB-Compat, https://github.com/floatinghotpot/google-play-services"
	};
};

////////////////////////////////////////
// Conditions

AddCondition(0, cf_trigger, "On notification opened", "Push notifications", "On notification opened/received", "Gets called when a notification is opened.", "onNotifOpened");

AddCondition(1, cf_trigger, "On post notification received/success", "Push notifications", "On notification received/post success", "Gets called when a notification is received or one is posted succesfully.", "onNotifSucc");

AddCondition(2, cf_trigger, "On post notification failed", "Push notifications", "On notification post failed", "Triggered when a notification post failed to send.", "onNotifFailed");


////////////////////////////////////////
// Actions

AddAction(2, af_none, "Register notifications", "Push notifications", "Register for push notifications", 
	"Only use if you set Auto register to False in the plugin properties", "register");


AddStringParam("Key", "");
AddStringParam("Value", "");
AddAction(3, af_none, "Send Tag", "Push notifications", "Send a tag", 
	"Tag a user based on an app event of your choosing so later you can create segments on onesignal.com to target these users", "sendTag");

AddStringParam("Key", "");
AddAction(4, af_none, "Delete Tag", "Push notifications", "Delete a tag", 
	"Deletes a tag that was previously set on a user with Send Tag action", "deleteTag");

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Parameter", "", 0);
AddAction(5, af_none, "Enable vibrate", "Push notifications", "Enable vibrate", 
	"Enable or disable the vibration of the device when the user receives a notification", "enableVibrate");

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Parameter", "", 0);
AddAction(6, af_none, "Enable sound", "Push notifications", "Enable sound", 
	"Enable or disable the sound when the user receives a notification.", "enableSound");

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Parameter", "", 0);
AddAction(12, af_none, "Enable or disable subscription", "Push notifications", "Enable or disable subscription", 
	"You can call this method with false to opt users out of receiving all notifications through OneSignal.", "enableSubs");

AddAction(13, af_none, "Prompt location", "Push notifications", "Prompt location", 
	"Prompts the user for location permission to allow geotagging based on the Location radius filter on the OneSignal dashboard.", "promptLoc");

AddStringParam("Notification object", "Like: {app_id:'xxxxxxxx',contents:{en:'Message'}} Read more here: https://documentation.onesignal.com/v2.0/docs/notifications-create-notification");
AddAction(14, af_none, "Post notification", "Push notifications", "Post notification", 
	"Allows you to send notifications from user to user or schedule ones in the future to be delivered to the current device. More information here: https://documentation.onesignal.com/v2.0/docs/notifications-create-notification", "postNotif");

////////////////////////////////////////
// Expressions

AddExpression(0, ef_return_string, "Get tags", "Push notifications", "getTags", "Retrieve a list of tags that have been set on the user from the OneSignal server.");
AddExpression(1, ef_return_string, "Get user id", "Push notifications", "getUserId", "Lets you retrieve the OneSignal user id.");
AddExpression(2, ef_return_string, "Get push token", "Push notifications", "getPushToken", "Lets you retrieve the OneSignal push token.");


////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Properties

var property_list = [

	new cr.Property(ept_text, 	"One Signal's app id","","Put your app id number here."),
	new cr.Property(ept_text, 	"Google Project Number","",	"Only for Android."),
	new cr.Property(ept_combo, 	"In focus displaying","None","Handle notifications while the app is in focus.","None|Notification|InAppAlert")

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