function GetPluginSettings()
{
	return {
		"name":			"Cordova FileTransfer",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaFileTransfer",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.15",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"download or upload file to your server. (http file download and upload)",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova core",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
org.apache.cordova.file-transfer
phonegap build service: https://build.phonegap.com/plugins/1177
cordova registry: http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer
github: https://github.com/apache/cordova-plugin-file-transfer/tree/16249c2
//cranberrygame end
*/
		"cordova-plugins":	"cordova-plugin-file-transfer",		
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
*/
//cranberrygame start
AddCondition(0, cf_trigger, "On download file from URL succeeded", "My category", "On download file from URL succeeded", "Description for my condition!", "OnDownloadFileFromURLSucceeded");//cranberrygame
AddCondition(1, cf_trigger, "On download file from URL failed", "My category", "On download file from URL failed", "Description for my condition!", "OnDownloadFileFromURLFailed");//cranberrygame
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different upload.", "\"\"");
AddCondition(2, cf_trigger, "On upload file to server succeeded", "My category", "On upload file to server (tag <b>{0}</b>) succeeded", "Description for my condition!", "OnUploadFileToServerSucceeded");//cranberrygame
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different upload.", "\"\"");
AddCondition(3, cf_trigger, "On upload file to server failed", "My category", "On upload file to server (tag <b>{0}</b>) failed", "Description for my condition!", "OnUploadFileToServerFailed");//cranberrygame
AddCondition(4, cf_trigger, "On progress", "My category", "On progress", "Description for my condition!", "OnProgress");//cranberrygame
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
AddStringParam("URL", "Enter URL to download. ex) \"http://www.yourserver.com/upload/c2i_139201420123.png\"", "\"http://www.yourserver.com/upload/c2i_139201420123.png\"");
AddStringParam("Save file", "Enter file to save. ex) \"cdvfile://localhost/persistent/Pictures/c2i_139201420123.png\", \"file:///storage/sdcard0/Pictures/c2i_139201420123.png\"", "\"cdvfile://localhost/persistent/Pictures/c2i_139201420123.png\"");
AddAction(0, cf_none, "Download file from URL", "My category", "Download file {1} from URL {0}", "Description for my condition!", "DownloadFileFromURL");//cranberrygame
AddStringParam("Upload file", "Enter file to upload. ex) \"cdvfile://localhost/persistent/Pictures/c2i_139201420123.png\", \"file:///storage/sdcard0/Pictures/c2i_139201420123.png\"", "\"cdvfile://localhost/persistent/Pictures/c2i_139201420123.png\"");
AddStringParam("Mime type", "Enter mime type of upload file. ex1) \"image/png\" ex2) \"image/jpeg\" ex3) \"text/plain\"", "\"image/png\"");
AddStringParam("Server cgi URL", "Enter server cgi URL. ex) \"http://www.yourserver.com/upload/upload.php\"", "\"http://www.yourserver.com/upload/upload.php\"");
AddStringParam("File input field name" , "ex) \"uploadfile\" when using <input type=\"file\" name=\"uploadfile\" />", "\"uploadfile\"");
AddStringParam("Additional parameters" , "ex) \"param1=value1&param2=value2\"", "\"\"");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different upload.", "\"\"");
AddAction(1, cf_none, "Upload file to server", "My category", "Upload file {0} to server {2} (tag <i>{5}</i>)", "Description for my condition!", "UploadFileToServer");//cranberrygame
AddAction(2, cf_none, "Abort", "My category", "Abort", "Description for my condition!", "Abort");//cranberrygame
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
*/
//cranberrygame start
AddExpression(0, ef_return_number, "Get progress", "My category", "Progress", "Get progress."); //cranberrygame
AddExpression(1, ef_return_number, "Get total", "My category", "Total", "Get total."); //cranberrygame
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
