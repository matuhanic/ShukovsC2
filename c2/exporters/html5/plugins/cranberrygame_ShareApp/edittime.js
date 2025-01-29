function GetPluginSettings()
{
	return {
		"name":			"ShareApp",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_ShareApp",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.0.32",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"share message and link via SNS (facebook, twitter, google+, whatsapp, SMS, email).",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Html5: share",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
cordova-plugin-x-socialsharing
phonegap build service: 
cordova registry:
github: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/tree/5.0.4
//cranberrygame end
*/
		//"cordova-plugins":	"https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#1364a0cc0a782793070396fde481ee5bb6ec5ab7;org.apache.cordova.inappbrowser;com.blackberry.invoke@2.1.0",
		//"cordova-plugins":	"https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#1364a0cc0a782793070396fde481ee5bb6ec5ab7;org.apache.cordova.inappbrowser",
		//"cordova-plugins":	"https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#5.0.4;org.apache.cordova.inappbrowser",
		//"cordova-plugins":	"https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#5.0.4;cordova-plugin-inappbrowser",
		"cordova-plugins":	"https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#5.0.10;cordova-plugin-inappbrowser",
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
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");
AddCondition(1, cf_trigger, "Trigger Condition", "My category", "Trigger Condition", "Triggered when TriggerAction", "TriggerCondition");//cranberrygame
*/
//cranberrygame start
AddCondition(0, cf_trigger | cf_deprecated, "On share app succeeded", "My category", "On share app succeeded", "Triggered when TriggerAction", "OnShareAppSucceeded");//cranberrygame
AddCondition(1, cf_trigger | cf_deprecated, "On share app failed", "My category", "On share app failed", "Triggered when TriggerAction", "OnShareAppFailed");//cranberrygame
AddCondition(2, cf_trigger | cf_deprecated, "On share app via facebook succeeded", "My category", "On share app via facebook succeeded", "Triggered when TriggerAction", "OnShareAppViaFacebookSucceeded");//cranberrygame
AddCondition(3, cf_trigger | cf_deprecated, "On share app via facebook failed", "My category", "On share app via facebook failed", "Triggered when TriggerAction", "OnShareAppViaFacebookFailed");//cranberrygame
AddCondition(4, cf_trigger | cf_deprecated, "On share app via twitter succeeded", "My category", "On share app via twitter succeeded", "Triggered when TriggerAction", "OnShareAppViaTwitterSucceeded");//cranberrygame
AddCondition(5, cf_trigger | cf_deprecated, "On share app via twitter failed", "My category", "On share app via twitter failed", "Triggered when TriggerAction", "OnShareAppViaTwitterFailed");//cranberrygame
AddCondition(6, cf_trigger | cf_deprecated, "On share app via whatsapp succeeded", "My category", "On share app via whatsapp succeeded", "Triggered when TriggerAction", "OnShareAppViaWhatsappSucceeded");//cranberrygame
AddCondition(7, cf_trigger | cf_deprecated, "On share app via whatsapp failed", "My category", "On share app via whatsapp failed", "Triggered when TriggerAction", "OnShareAppViaWhatsappFailed");//cranberrygame
AddCondition(8, cf_trigger | cf_deprecated, "On share app via SMS succeeded", "My category", "On share app via SMS succeeded", "Triggered when TriggerAction", "OnShareAppViaSMSSucceeded");//cranberrygame
AddCondition(9, cf_trigger | cf_deprecated, "On share app via SMS failed", "My category", "On share app via SMS failed", "Triggered when TriggerAction", "OnShareAppViaSMSFailed");//cranberrygame
AddCondition(10, cf_trigger | cf_deprecated, "On share app via email succeeded", "My category", "On share app via email succeeded", "Triggered when TriggerAction", "OnShareAppViaEmailSucceeded");//cranberrygame
AddCondition(11, cf_trigger | cf_deprecated, "On share app via email failed", "My category", "On share app via email failed", "Triggered when TriggerAction", "OnShareAppViaEmailFailed");//cranberrygame
AddCondition(12, cf_trigger | cf_deprecated, "On share app via google plus succeeded", "My category", "On share app via google plus succeeded", "Triggered when TriggerAction", "OnShareAppViaGooglePlusSucceeded");//cranberrygame
AddCondition(13, cf_trigger | cf_deprecated, "On share app via google plus failed", "My category", "On share app via google plus failed", "Triggered when TriggerAction", "OnShareAppViaGooglePlusFailed");//cranberrygame
AddCondition(14, cf_trigger | cf_deprecated, "On share app via line succeeded", "My category", "On share app via line succeeded", "Triggered when TriggerAction", "OnShareAppViaLineSucceeded");//cranberrygame
AddCondition(15, cf_trigger | cf_deprecated, "On share app via line failed", "My category", "On share app via line failed", "Triggered when TriggerAction", "OnShareAppViaLineFailed");//cranberrygame
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
*/
//cranberrygame start
AddStringParam("Title", "Enter title. ex1) \"Can you beat me?\" ex2) \"I want to share this game!\"", "\"Can you beat me?\"");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(0, af_none, "Share app", "My category", "Share app {0} {1}", "Description for my action!", "ShareApp");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(1, af_none, "Share app via facebook", "My category", "Share app via facebook {0}", "Description for my action!", "ShareAppViaFacebook");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(2, af_none, "Share app via twitter", "My category", "Share app via twitter {0}", "Description for my action!", "ShareAppViaTwitter");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(3, af_none, "Share app via whatsapp", "My category", "Share app via whatsapp {0}", "Description for my action!", "ShareAppViaWhatsapp");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(4, af_none, "Share app via SMS", "My category", "Share app via SMS {0}", "Description for my action!", "ShareAppViaSMS");
AddStringParam("Title", "Enter title. ex1) \"Can you beat me?\" ex2) \"I want to share this game!\"", "\"Can you beat me?\"");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(5, af_none, "Share app via email", "My category", "Share app via email {0} {1}", "Description for my action!", "ShareAppViaEmail");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(6, af_none, "Share app via google+", "My category", "Share app via google+ {0}", "Description for my action!", "ShareAppViaGooglePlus");
AddStringParam("Message", "Enter message. ex1) \"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\" ex2) \"Hey friend, I want to share Pick Up Sticks game with you!\"", "\"Hey friend, I scored 30 on Pick Up Sticks game. Can you beat me?\"");
AddAction(7, af_none, "Share app via line", "My category", "Share app via line {0}", "Description for my action!", "ShareAppViaLine");
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
AddExpression(0, ef_return_number, "Get cell x count", "My category", "MyExpression", "Get cell x count."); //cranberrygame
AddExpression(1, ef_return_string, "Get text.", "My category", "TextWithNoParam", "Get text."); //cranberrygame
AddStringParam("StringParam", "Enter string param");
AddExpression(2, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
*/
//cranberrygame start
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
	new cr.Property(ept_text, "HTML5 website share app url", "http://testapp.cranberrygame.com/", "ex) http://testapp.cranberrygame.com/"),	// a string
	new cr.Property(ept_text, "Android share app url", "https://play.google.com/store/apps/details?id=<PACKAGE>", "ex) https://play.google.com/store/apps/details?id=com.yourdomain.yourapp"),		// a string
	new cr.Property(ept_text, "Blackberry10 share app url", "http://appworld.blackberry.com/webstore/content/<APP_ID>", "ex) http://appworld.blackberry.com/webstore/content/41154111"),		// a string
	new cr.Property(ept_text, "iOS share app url", "https://itunes.apple.com/app/id<APP_ID>", "ex) https://itunes.apple.com/app/id738268111"),		// a string
	new cr.Property(ept_text, "Windows8 share app url", "https://www.microsoft.com/store/apps/<APP_ID>", "ex) https://www.microsoft.com/store/apps/9nblggh1zv30"),		// a string
	new cr.Property(ept_text, "Wp8 share app url", "https://www.microsoft.com/store/apps/<APP_ID>", "ex) https://www.microsoft.com/store/apps/9nblggh1zv30")		// a string

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
