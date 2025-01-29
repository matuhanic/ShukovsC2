function GetPluginSettings()
{
	return {
		"name":			"Cordova File",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaFile",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.28",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"read, write file, append file, remove file, copy file, move file, get directory entries and create directory.",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova core",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
org.apache.cordova.file
phonegap build service: https://build.phonegap.com/plugins/1164
cordova registry: http://plugins.cordova.io/#/package/org.apache.cordova.file
github: https://github.com/apache/cordova-plugin-file/tree/198ca61
//cranberrygame end
*/
		"cordova-plugins":	"cordova-plugin-file",		
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
AddCondition(0, cf_trigger, "On write text succeeded", "My category", "On write text succeeded", "Description for my condition!", "OnWriteTextSucceeded");//cranberrygame
AddCondition(1, cf_trigger, "On write text failed", "My category", "On write text failed", "Description for my condition!", "OnWriteTextFailed");//cranberrygame
AddCondition(2, cf_trigger, "On append text succeeded", "My category", "On append text succeeded", "Description for my condition!", "OnAppendTextSucceeded");//cranberrygame
AddCondition(3, cf_trigger, "On append text failed", "My category", "On append text failed", "Description for my condition!", "OnAppendTextFailed");//cranberrygame
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different read.", "\"\"");
AddCondition(4, cf_trigger, "On read text succeeded", "My category", "On read text (tag <b>{0}</b>) succeeded", "Description for my condition!", "OnReadTextSucceeded");//cranberrygame
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different read.", "\"\"");
AddCondition(5, cf_trigger, "On read text failed", "My category", "On read text (tag <b>{0}</b>) failed", "Description for my condition!", "OnReadTextFailed");//cranberrygame
AddCondition(6, cf_trigger, "On remove file succeeded", "My category", "On remove file succeeded", "Description for my condition!", "OnRemoveFileSucceeded");//cranberrygame
AddCondition(7, cf_trigger, "On remove file failed", "My category", "On remove file failed", "Description for my condition!", "OnRemoveFileFailed");//cranberrygame
AddCondition(8, cf_trigger, "On file exists", "My category", "On file exists", "Description for my condition!", "OnFileExists");//cranberrygame
AddCondition(9, cf_trigger, "On file does not exist", "My category", "On file does not exist", "Description for my condition!", "OnFileDoesNotExist");//cranberrygame
AddCondition(10, cf_trigger, "On copy file succeeded", "My category", "On copy file succeeded", "Description for my condition!", "OnCopyFileSucceeded");//cranberrygame
AddCondition(11, cf_trigger, "On copy file failed", "My category", "On copy file failed", "Description for my condition!", "OnCopyFileFailed");//cranberrygame
AddCondition(12, cf_trigger, "On move file succeeded", "My category", "On move file succeeded", "Description for my condition!", "OnMoveFileSucceeded");//cranberrygame
AddCondition(13, cf_trigger, "On move file failed", "My category", "On move file failed", "Description for my condition!", "OnMoveFileFailed");//cranberrygame
AddCondition(14, cf_trigger, "On get directory entries succeeded", "My category", "On get directory entries succeeded", "Description for my condition!", "OnGetDirectoryEntriesSucceeded");//cranberrygame
AddCondition(15, cf_trigger, "On get directory entries failed", "My category", "On get directory entries failed", "Description for my condition!", "OnGetDirectoryEntriesFailed");//cranberrygame
AddCondition(16, cf_trigger, "On create directory succeeded", "My category", "On create directory succeeded", "Description for my condition!", "OnCreateDirectorySucceeded");//cranberrygame
AddCondition(17, cf_trigger, "On create directory failed", "My category", "On create directory failed", "Description for my condition!", "OnCreateDirectoryFailed");//cranberrygame
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
AddStringParam("File", "Enter file path. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddStringParam("Text", "Enter text. ex) \"mytext\"", "\"mytext\"");
AddAction(0, af_none, "Write text", "My category", "Write text {0} {1}", "Description for my action!", "WriteText");
AddStringParam("File", "Enter file path. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddStringParam("Text", "Enter text. ex) \"myappend\"", "\"myappend\"");
AddAction(1, af_none, "Append text", "My category", "Append text {0} {1}", "Description for my action!", "AppendText");
AddStringParam("File", "Enter file path. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different read.", "\"\"");
AddAction(2, af_none, "Read text", "My category", "Read text {0} (tag <i>{1}</i>)", "Description for my action!", "ReadText");
AddStringParam("File", "Enter file path. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddAction(3, af_none, "Remove file", "My category", "Remove file {0}", "Description for my action!", "RemoveFile");
AddStringParam("File", "Enter file path to check exists. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddAction(4, cf_none, "Check if file exists", "My category", "Check if file {0} exists", "Description for my condition!", "CheckIfFileExists");//cranberrygame
AddStringParam("Source file path", "Enter source file path which you copy from. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddStringParam("Target file path", "Enter target file path which you copy to. (relative to external storage (SD card) root) ex) \"myfilecopied.txt\", \"mydir/myfilecopied.txt\"", "\"myfilecopied.txt\"");
AddAction(5, af_none, "Copy file", "My category", "Copy file {0} to {1}", "Description for my action!", "CopyFile");
AddStringParam("Source file path", "Enter source file path which you move from. (relative to external storage (SD card) root) ex) \"myfile.txt\", \"mydir/myfile.txt\"", "\"myfile.txt\"");
AddStringParam("Target file path", "Enter target file path which you move to. (relative to external storage (SD card) root) ex) \"myfilemoved.txt\", \"mydir/myfilemoved.txt\"", "\"myfilemoved.txt\"");
AddAction(6, af_none, "Move file", "My category", "Move file {0} to {1}", "Description for my action!", "MoveFile");
AddStringParam("Directory", "Enter directory path. (relative to external storage (SD card) root) ex1) \"\", \"mydir\"", "\"\"");
AddAction(7, af_none, "Get directory entries", "My category", "Get directory entries {0}", "Description for my action!", "GetDirectoryEntries");
AddStringParam("Directory", "Enter directory path. (relative to external storage (SD card) root) ex1) \"\", \"mydir\"", "\"\"");
AddAction(8, af_none, "Create directory", "My category", "Create directory {0}", "Description for my action!", "CreateDirectory");
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
AddExpression(0, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
AddExpression(1, ef_return_number, "Get directory entries count", "My category", "DirectoryEntriesCount", "Get directory entries count."); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(2, ef_return_number, "Is file at", "My category", "IsFileAt", "Is file at. (0 or 1)"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(3, ef_return_number, "Is directory at", "My category", "IsDirectoryAt", "Is directory at. (0 or 1)"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(4, ef_return_string, "Get name at", "My category", "NameAt", "Get name at."); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(5, ef_return_string, "Get full path at", "My category", "FullPathAt", "Get full path at."); //cranberrygame
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
