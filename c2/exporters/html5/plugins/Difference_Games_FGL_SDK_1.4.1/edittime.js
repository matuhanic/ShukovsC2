function GetPluginSettings()
{
	return {
		"name":			"FGL",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"FGLAPI",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.4.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"This plugin allows easy use of FGL SDK functionality.",
		"author":		"Difference Games LLC",
		"help url":		"http://www.fgl.com",
		"category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency":	"fgl.js;fgl-branding-placeholder.png;",
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

AddCondition(0, cf_none, "Is cross-promotion enabled", "Plaform conditions", "Cross-promotion is enabled", "Check if FGL cross-promotion is enabled", "crossPromotionEnabled");
AddCondition(1, cf_none, "Is premium", "Plaform conditions", "Premium version unlocked", "Check if the premium version of the game has been unlocked", "isPremium");
AddCondition(2, cf_none, "Is unlock enabled", "Plaform conditions", "Unlocking premium version is enabled", "Check if it should be possible to unlock the premium version", "unlockEnabled");
AddCondition(3, cf_trigger, "On unlock success", "Platform triggers", "On unlock success", "Triggered when the user successfully unlocks the premium version after InitiateUnlockFunction", "onUnlockSuccess");
AddCondition(4, cf_trigger, "On unlock failure", "Platform triggers", "On unlock failure", "Triggered when the user fails to unlock the premium version after InitiateUnlockFunction", "onUnlockFailure");
AddCondition(5, cf_none, "Is branding enabled", "Plaform conditions", "Sponsor branding is enabled", "Check if sponsor branding should be shown", "brandingEnabled");
AddCondition(6, cf_trigger | cf_deprecated, "On branding enabled", "Platform triggers", "On sponsor branding enabled", "Triggered if and when sponsor branding becomes enabled", "onBrandingEnabled");
AddCondition(7, cf_trigger | cf_deprecated, "On SDK Ready", "Platform triggers", "On FGL SDK ready", "Triggered when the FGL SDK is ready to start", "onReadyEvent");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddAction(0, af_none, "ShowAd", "Platform Functions", "ShowAd", "Show ad through the FGL Platform", "showAd");
AddAction(1, af_none, "ShowMoreGames", "Platform Functions", "ShowMoreGames", "Show cross-promotion window through the FGL Platform", "showMoreGames");
AddAction(2, af_none, "InitiateUnlockFunction", "Platform Functions", "InitiateUnlockProcess", "Show premium unlock process", "initiateUnlockFunction");

AddNumberParam("Score", "Enter the score to submit.");
AddAction(3, af_none, "SubmitScore", "Platform Functions", "Submit score of <b>{0}</b>", "Submit the game score for leaderboards", "submitScore");
AddAction(4, af_none, "DisplayScoreboard", "Platform Functions", "Display the scoreboard", "Display the scoreboard (automatically happens after SubmitScore)", "displayScoreboard");

// The following two are hidden for now; perhaps support should be added later for these?
AddNumberParam("X position", "Enter the X position at which to draw the branding logo.");
AddNumberParam("Y position", "Enter the Y position at which to draw the branding logo.");
AddAction(5, af_deprecated, "ShowBrandingLogo", "Platform Functions", "Show the sponsor branding logo at <b>{0}, {1}</b>", "Show the sponsor branding logo at a specific position", "showBrandingLogo");
AddAction(6, af_deprecated, "HideBrandingLogo", "Platform Functions", "Hide the sponsor branding logo", "Hide the sponsor branding logo", "hideBrandingLogo");

AddAction(7, af_none, "HandleBrandingClick", "Platform Functions", "Handle the branding logo click", "Invoke this when the branding logo is clicked", "handleBrandingClick");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "BrandingLogo", "Platform expressions", "BrandingLogo", "Return the string reference to the branding logo image");

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