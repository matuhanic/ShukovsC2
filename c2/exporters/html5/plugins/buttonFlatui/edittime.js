function GetPluginSettings()
{
	return {
		"name":			"FlatUi Button",
		"id":			"FlatButton",
		"version":		"1.4",
		"description":	"A clickable push button with FlatUi Button.",
		"author":		"Scirra Edited By HMMG",
		"help url":		"https://www.scirra.com/forum/plugin-flatui-button-7-theme-50-icons-fixed-bug_t124213",
		"category":		"HMMG",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces,
		"dependency":"jquery.mobile.flatui.css;Flat-UI-Icons-24.ttf;Flat-UI-Icons-24.woff;lato-black.ttf;lato-black.woff;lato-bold.ttf;lato-bold.woff;lato-italic.ttf;lato-italic.woff;lato-regular.ttf;lato-regular.woff;ajax-loader.gif"
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
				
AddCondition(0, cf_trigger, "On clicked", "Button", "On clicked", "Triggered when the button is clicked.", "OnClicked");
AddCondition(1, cf_none, "Is enabled", "Button", "Is enabled", "True if the Button is enabled.", "IsEnabled");
AddCondition(2, cf_none, "Is visible", "Button", "Is visible", "True if the Button is Button.", "IsVisible");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text to set in the button.");
AddAction(0, af_none, "Set text", "Button", "Set text to {0}", "Set the button's text.", "SetText");

AddStringParam("Tooltip", "The tooltip to set on the button.");
AddAction(1, af_none, "Set tooltip", "Button", "Set tooltip to {0}", "Set the button's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the button.");
AddAction(2, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the button.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the button.");
AddAction(3, af_none, "Set enabled", "Button", "Set <b>{0}</b>", "Disable or enable the button.", "SetEnabled");

AddAction(4, af_none, "Set focused", "Button", "Set focused", "Set the input focus to the button.", "SetFocus");

AddStringParam("Property name", "A CSS property name to set on the control.", "\"color\"");
AddStringParam("Value", "A string to assign as the value for this CSS property.", "\"red\"");
AddAction(5, af_none, "Set CSS style", "Appearance", "Set CSS style {0} to {1}", "Set a CSS style on the control.", "SetCSSStyle");

AddComboParamOption("Unchecked");
AddComboParamOption("Checked");
AddComboParam("State", "Choose the checkbox state.");
AddAction(6, af_none, "Set checked", "Button", "Set <b>{0}</b>", "Check or uncheck a checkbox.", "SetChecked");
AddAction(7, af_none, "Toggle checked", "Button", "Toggle checked", "Toggle a checkbox.", "ToggleChecked");

AddAction(8, af_none, "Set unfocused", "Button", "Set unfocused", "Remove the input focus from the button.", "SetBlur");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Text",					"OK",		"The initial text for the button."),
	new cr.Property(ept_text,	"Tooltip",				"",			"Display this text when hovering the mouse over the control."),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the button is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				"Yes",		"Choose whether the button is enabled or disabled on startup.", "No|Yes"),
	new cr.Property(ept_text,	"ID (optional)",		"",			"An ID for the control allowing it to be styled with CSS from the page HTML."),
	new cr.Property(ept_combo,	"Theme",				"Default",		"Select Your Theme.", "Default|A|B|C|D|E|F|G"),
	new cr.Property(ept_combo,	"Icon",				"None",		"Select The Icon.", "None|Action|Alert|Arrow Down|Arrow Down Left|Arrow Down Right|Arrow Left|Arrow Right|Arrow Up|Arrow Up Left|Arrow Up Right|Audio|Back|Bars|Bullets|Calendar|Camera|Carat Down|Carat Left|Carat-Right|Carat Up|Check|Clock|Cloud|Comment|Delete|Edit|Eye|Forbidden|Forward|Gear|Grid|Heart|Home|Info|Location|Lock|Mail|Minus|Navigation|Phone|Plus|Power|Recycle|Refresh|Search|Shop|Star|Tag|User|Video"),
	new cr.Property(ept_combo,	"Icon Position",		"Left",		"Select Icon's Position. *If no text in the button you have to select Without Text*", "Left|Right|Top|Bottom|Without Text"),
	new cr.Property(ept_combo,	"Round Corner",		"Yes",		"Set if the button Corners are rounded or not.", "No|Yes"),
	new cr.Property(ept_combo,	"Text Align",		"Center",		"Select Text's Position.", "Left|Center|Right"),
	new cr.Property(ept_text,		"CSS",					"",		"Add Some CSS to your button.")
	
	
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
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(72, 24));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{

	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
		
	cr.quad.prototype.offset.call(quad, 0, 2);

	this.font.DrawText(this.properties["Text"],
							quad,
							cr.RGB(0, 0, 0),
							ha_center);
	
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}