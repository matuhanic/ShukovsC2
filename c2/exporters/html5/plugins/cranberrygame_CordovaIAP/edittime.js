﻿function GetPluginSettings()
{
	return {
		"name":			"Cordova IAP",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaIAP",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.0.48",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"in app purchase",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova extension: payment",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
cordova-plugin-payment-iap
phonegap build service: 
cordova registry: 
github: https://github.com/cranberrygame/cordova-plugin-payment-iap
//cranberrygame end
*/
		"cordova-plugins":	"https://github.com/cranberrygame/cordova-plugin-payment-iap",		
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
		,"dependency": "three.min.js;OBJLoader.js;"
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
//Request store listing
AddCondition(4, cf_trigger, "On request store listing succeeded", "Request store listing", "On request store listing succeeded", "Triggered when store listing received successfully.", "OnRequestStoreListingSucceeded");
AddCondition(5, cf_trigger, "On request store listing failed", "Request store listing", "On request store listing failed", "Triggered when store listing failed to receive.", "OnRequestStoreListingFailed");
AddCondition(7, cf_none | cf_deprecated, "Is store available", "Etc", "Is store available", "True if a store from which purchases can be made is available.", "IsAvailable");
//Purchase product
AddStringParam("Product ID", "Product ID that has been purchased successfully.");
AddCondition(0, cf_trigger, "On purchase product succeeded", "Purchase product", "On purchase product <i>{0}</i> succeeded", "Triggered when a specific product ID has been purchased successfully.", "OnPurchaseProductSucceeded");
AddStringParam("Product ID", "Product ID that has failed to purchase.");
AddCondition(2, cf_trigger, "On purchase product failed", "Purchase product", "On purchase product <i>{0}</i> failed", "Triggered when a specific product ID has failed to be purchased.", "OnPurchaseProductFailed");
AddCondition(1, cf_trigger | cf_deprecated, "On any purchase product succeeded", "Purchase product", "On any purchase product succeeded", "Triggered when any product has been purchased successfully.", "OnAnyPurchaseProductSucceeded");
AddCondition(3, cf_trigger | cf_deprecated, "On any purchase product failed", "Purchase product", "On any purchase product failed", "Triggered when any product has failed to be purchased.", "OnAnyPurchaseProductFailed");
//Consume product
AddStringParam("Product ID", "Product ID that has been purchased successfully.");
AddCondition(9, cf_trigger, "On consume product succeeded", "Consume product", "On consume product <i>{0}</i> succeeded", "Triggered when a specific product ID has been consumeed successfully.", "OnConsumeProductSucceeded");
AddStringParam("Product ID", "Product ID that has failed to consume.");
AddCondition(10, cf_trigger, "On consume product failed", "Consume product", "On consume product <i>{0}</i> failed", "Triggered when a specific product ID has failed to be consumeed.", "OnConsumeProductFailed");
//Restore purchases
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different restore purchases.", "\"\"");
AddCondition(11, cf_trigger, "On restore purchases succeeded", "Restore purchases", "On restore purchases (tag <b>{0}</b>) succeeded", "Triggered when store listing received successfully.", "OnRestorePurchasesSucceeded");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different restore purchases.", "\"\"");
AddCondition(12, cf_trigger, "On restore purchases failed", "Restore purchases", "On restore purchases (tag <b>{0}</b>) failed", "Triggered when store listing failed to receive.", "OnRestorePurchasesFailed");
AddStringParam("Product ID", "Product ID to check if owned.");
AddCondition(6, cf_none, "Has product", "Restore purchases", "Has product <i>{0}</i>", "True if the current user has purchased a given product ID.", "HasProduct");
AddCondition(8, cf_none | cf_deprecated, "Is app purchased", "Restore purchases", "Is app purchased", "True if app purchased, or on some platforms if product ID \"app\" is owned.", "IsAppPurchased");
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
//Request store listing
AddStringParam("Product ID", "A comma-separated list of product IDs to use, e.g. \"product1,product2,product3\".");
AddAction(0, af_none, "Add product ID", "Request store listing", "Add product IDs <b>{0}</b>", "Add the product IDs that the app will be using for IAP.", "AddProductID");
AddAction(4, af_none, "Request store listing", "Request store listing", "Request store listing", "Request a list of available items from the store.", "RequestStoreListing");
//Purchase product
AddStringParam("Product ID", "The product ID to purchase.");
AddAction(1, af_none, "Purchase product", "Purchase product", "Purchase product <b>{0}</b>", "Prompt the user to purchase a product.", "PurchaseProduct");
AddAction(2, af_none | af_deprecated, "Purchase app", "Purchase", "Purchase app", "Prompt the user to purchase the app, or on some platforms the product ID \"app\".", "PurchaseApp");
//Consume product
AddStringParam("Product ID", "The product ID to consume.");
AddAction(5, af_none, "Consume product", "Consume product", "Consume product <b>{0}</b>", "consume a product.", "ConsumeProduct");
//Restore purchases
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different restore purchases.", "\"\""); //cranberrygame
AddAction(3, af_none, "Restore purchases", "Restore purchases", "Restore purchases (tag <i>{0}</i>)", "Restore the purchases state from the store.", "RestorePurchases");
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
AddStringParam("ProductID", "Product ID to get");
AddExpression(0, ef_return_string, "", "Etc", "ProductName", "Return the name of a product from its ID.");
AddStringParam("ProductID", "Product ID to get");
AddExpression(1, ef_return_string, "", "Etc", "ProductPrice", "Return the formatted price of a produce from its ID.");
AddExpression(2, ef_return_string, "", "Etc", "AppName", "Return the name of the app or product ID \"app\".");
AddExpression(3, ef_return_string, "", "Etc", "AppPrice", "Return the price of the app or product ID \"app\".");
AddExpression(4, ef_return_string, "", "Etc", "ProductID", "In a trigger, the relevant product ID.");
AddExpression(5, ef_return_string, "", "Etc", "ErrorMessage", "In a trigger, an error message if available.");
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
	new cr.Property(ept_text, 	"Android application license key",		"",		"") //cranberrygame , this.properties[0] from runtime.js
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
