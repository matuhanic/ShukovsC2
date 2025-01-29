function GetPluginSettings()
{
	return {
		"name":			"Cordova AppsFlyer",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaAppsFlyer",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.9",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"appsflyer analytics",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova extension: analytics",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
com.appsflyer.cordova.plugins.appsflyer
phonegap build service: 
cordova registry: 
github: https://github.com/AppsFlyerSDK/PhoneGap/tree/4b1e4449c596924f1b002651ef934fbe6c6e1c3c
//cranberrygame end
*/
		"cordova-plugins":	"https://github.com/AppsFlyerSDK/PhoneGap#4b1e4449c596924f1b002651ef934fbe6c6e1c3c",		
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
/*
		// example
		,"dependency": "three.min.js;OBJLoader.js"
*/
//cranberrygame start
//cranberrygame start												
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

/*				
// example				
AddCondition(0, cf_trigger, "On write text succeeded", "My category", "On write text succeeded", "Description for my condition!", "OnWriteTextSucceeded");//cranberrygame
AddCondition(1, cf_trigger, "On write text failed", "My category", "On write text failed", "Description for my condition!", "OnWriteTextFailed");//cranberrygame
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(2, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "IsNumberPositive");
//
AddCondition(3, cf_looping, "For each element", "For Each", "For each element", "Repeat the event for each element in the array.", "ArrForEach");
*/
//cranberrygame start
AddCondition(0, cf_trigger, "On install conversion data loaded", "My category", "On install conversion data loaded", "Description for my condition!", "OnInstallConversionDataLoaded");//cranberrygame
//cranberrygame end
	
////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/*
// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
AddAction(1, af_none, "Trigger Action", "My category", "Trigger Action", "Trigger TriggerCondition", "TriggerAction");//cranberrygame
AddStringParam("URL", "Enter URL to open.");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Location bar", "Select Yes or No.", 1);
AddAction(2, af_none, "Open", "My category", "Open {0}", "Description for my action!", "Open");
*/
//cranberrygame start
AddStringParam("Event name", "Enter event name. ex) \"IAP\"", "\"IAP\"");
AddStringParam("Event value", "Enter event value. ex) \"Purchase product removeads\"", "\"Purchase product removeads\"");
AddAction(0, af_none, "Track event", "My category", "Track event {0} {1}", "Description for my action!", "TrackEvent");
//cranberrygame end

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

/*
// example
AddExpression(0, ef_return_number, "Get cell x count", "My category", "CellXCount", "Get cell x count."); //cranberrygame
AddExpression(1, ef_return_string, "Get text.", "My category", "TextWithNoParam", "Get text."); //cranberrygame
AddStringParam("StringParam", "Enter string param");
AddExpression(2, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
//
AddExpression(3, ef_return_any, "Current Value", "For Each", "CurValue", "Get the current value in a For Each loop.");
AddNumberParam("X", "The X index (0-based) of the array value to get.", "0");
AddExpression(4, ef_return_any | ef_variadic_parameters, "Get value at", "Array", "At", "Get value from the array.  Add second or third parameters to specify Y and Z indices.");
AddExpression(5, ef_return_number, "Get width", "Array", "Width", "Get the number of elements on the X axis of the array.");
*/
//cranberrygame start
AddExpression(0, ef_return_string | ef_deprecated, "Get install conversion data af_status.", "My category", "InstallConversionDataStatus", "Get install conversion data af_status. ex1) Organic ex2) Non-Organic ex3) Error"); //cranberrygame
AddExpression(1, ef_return_string | ef_deprecated, "Get install conversion data af_message.", "My category", "InstallConversionDataMessage", "Get install conversion data af_message. ex) organic install"); //cranberrygame
//
AddExpression(2, ef_return_string, "Get apps flyer uid.", "My category", "AppsFlyerUid", "Get apps flyer uid. ex) 14270361111000-450116"); //cranberrygame
AddExpression(3, ef_return_string, "Get install conversion data adgroup.", "My category", "InstallConversionDataAdgroup", "Get install conversion data adgroup. ex) Angry Bird Facebook ad 1"); //cranberrygame
AddExpression(4, ef_return_string, "Get install conversion data adgroup_id.", "My category", "InstallConversionDataAdgroupId", "Get install conversion data adgroup_id. ex) 6012740800279"); //cranberrygame
AddExpression(5, ef_return_string, "Get install conversion data ad_id.", "My category", "InstallConversionDataAdId", "Get install conversion data ad_id. ex) 6012998843079"); //cranberrygame
AddExpression(6, ef_return_string, "Get install conversion data Adset.", "My category", "InstallConversionDataAdset", "Get install conversion data Adset. ex) US - 18+"); //cranberrygame
AddExpression(7, ef_return_string, "Get install conversion data adset_id.", "My category", "InstallConversionDataAdsetId", "Get install conversion data adset_id. ex) 6099800005123"); //cranberrygame
AddExpression(8, ef_return_string, "Get install conversion data af_message.", "My category", "InstallConversionDataAfMessage", "Get install conversion data af_message. ex) organic install"); //cranberrygame
AddExpression(9, ef_return_string, "Get install conversion data af_siteid.", "My category", "InstallConversionDataAfSiteid", "Get install conversion data af_siteid. ex) Site1"); //cranberrygame
AddExpression(10, ef_return_string, "Get install conversion data af_status.", "My category", "InstallConversionDataAfStatus", "Get install conversion data af_status. ex1) Organic ex2) Non-Organic ex3) Error"); //cranberrygame
AddExpression(11, ef_return_string, "Get install conversion data af_sub1.", "My category", "InstallConversionDataAfSub1", "Get install conversion data af_sub1. ex) someParameter"); //cranberrygame
AddExpression(12, ef_return_string, "Get install conversion data af_sub2.", "My category", "InstallConversionDataAfSub2", "Get install conversion data af_sub2. ex)"); //cranberrygame
AddExpression(13, ef_return_string, "Get install conversion data af_sub3.", "My category", "InstallConversionDataAfSub3", "Get install conversion data af_sub3. ex)"); //cranberrygame
AddExpression(14, ef_return_string, "Get install conversion data af_sub4.", "My category", "InstallConversionDataAfSub4", "Get install conversion data af_sub4. ex)"); //cranberrygame
AddExpression(15, ef_return_string, "Get install conversion data af_sub5.", "My category", "InstallConversionDataAfSub5", "Get install conversion data af_sub5. ex)"); //cranberrygame
AddExpression(16, ef_return_string, "Get install conversion data agency.", "My category", "InstallConversionDataAgency", "Get install conversion data agency. ex) nanigans"); //cranberrygame
AddExpression(17, ef_return_string, "Get install conversion data campaign.", "My category", "InstallConversionDataCampaign", "Get install conversion data campaign. ex) Ad1/camp123"); //cranberrygame
AddExpression(18, ef_return_string, "Get install conversion data campaign_id.", "My category", "InstallConversionDataCampaignId", "Get install conversion data campaign_id. ex) 6012700005123"); //cranberrygame
AddExpression(19, ef_return_string, "Get install conversion data clickid.", "My category", "InstallConversionDataClickid", "Get install conversion data clickid. ex) 123456/xsfd234"); //cranberrygame
AddExpression(20, ef_return_string, "Get install conversion data click_time.", "My category", "InstallConversionDataClickTime", "Get install conversion data click_time. ex) 2014-01-08 00:07:53.233"); //cranberrygame
AddExpression(21, ef_return_string, "Get install conversion data install_time.", "My category", "InstallConversionDataInstallTime", "Get install conversion data install_time. ex) 2014-01-08 00:12:51.701"); //cranberrygame
AddExpression(22, ef_return_string, "Get install conversion data is_fb.", "My category", "InstallConversionDataIsFb", "Get install conversion data is_fb. ex) true"); //cranberrygame
AddExpression(23, ef_return_string, "Get install conversion data media_source.", "My category", "InstallConversionDataMediaSource", "Get install conversion data media_source. ex1) inmobi_int ex2) tapjoy_int ex3) tapjoy_int"); //cranberrygame
//cranberrygame end

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
/*
	new cr.Property(ept_integer, 	"My property",		77,		"An example property.") //cranberrygame , this.properties[0] from runtime.js
*/
//cranberrygame start
	new cr.Property(ept_text, 	"Dev key",		"",		"An example property."), //cranberrygame , this.properties[0] from runtime.js
	new cr.Property(ept_text, 	"iOS itunes app id",		"",		"An example property.") //cranberrygame , this.properties[0] from runtime.js
//cranberrygame emd
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

//cranberrygame start
//cranberrygame end
