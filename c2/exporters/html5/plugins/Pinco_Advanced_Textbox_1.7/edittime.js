function GetPluginSettings()
{
	return {
		"name":			"Advanced Text box",
		"id":			"AdvTextBox",
		"version":		"1.7",
		"description":	"A text field for the user to enter text in to.",
		"author":		"Pinco, Scirra",
		"help url":		"http://www.scirra.com/manual/117/textbox",
		"category":		"Form controls",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces
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
				
AddStringParam("Text", "The text to compare the text box's text to.");
AddComboParamOption("case insensitive");
AddComboParamOption("case sensitive");
AddComboParam("Case", "Choose whether the comparison is case sensitive (FOO different to Foo) or case insensitive (FOO same as Foo).");
AddCondition(0, cf_none, "Compare text", "Text box", "Text is {0} (<i>{1}</i>)", "Compare the text currently entered in to the text box.", "CompareText");

AddCondition(1, cf_trigger, "On text changed", "Text box", "On text changed", "Triggered when the text in the text box changes.", "OnTextChanged");
AddCondition(2, cf_trigger, "On clicked", "Text box", "On clicked", "Triggered when the text box is clicked.", "OnClicked");
AddCondition(3, cf_trigger, "On double-clicked", "Text box", "On double-clicked", "Triggered when the text box is double-clicked.", "OnDoubleClicked");
AddCondition(4, cf_trigger, "On focus lost", "Text box", "On focus lost", "Triggered when object other than the textbox gets focussed.", "OnFocusLost");
AddCondition(5, cf_trigger, "On focus gain", "Text box", "On focus gain", "Triggered when this object gets focussed.", "OnFocusGain");
AddCondition(6, cf_none, "Has Focus", "Text box", "has focus", "Detect if the Text Box is focused", "GotFocus");
AddCondition(7, cf_none, "Validate", "Text box", "check if valid", "Determine if the text is valid based on the selected type.", "Validate");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text to set in the text box.");
AddAction(0, af_none, "Set text", "Text box", "Set text to {0}", "Set the text box's text.", "SetText");

AddStringParam("Placeholder", "The new text box placeholder.");
AddAction(1, af_none, "Set placeholder", "Text box", "Set placeholder to {0}", "Set the text box's placeholder.", "SetPlaceholder");

AddStringParam("Tooltip", "The tooltip to set on the text box.");
AddAction(2, af_none, "Set tooltip", "Text box", "Set tooltip to {0}", "Set the text box's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the text box.");
AddAction(3, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the text box.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the text box.");
AddAction(4, af_none, "Set enabled", "Text box", "Set <b>{0}</b>", "Disable or enable the text box.", "SetEnabled");

AddComboParamOption("Read-only");
AddComboParamOption("Not read-only");
AddComboParam("Mode", "Choose whether to enable or disable read-only mode.");
AddAction(5, af_none, "Set read-only", "Text box", "Set <b>{0}</b>", "Turn read-only on or off.", "SetReadOnly");

AddAction(6, af_none, "Set focused", "Text box", "Set focused", "Set the input focus to the text box.", "SetFocus");

AddStringParam("Property name", "A CSS property name to set on the control.", "\"color\"");
AddStringParam("Value", "A string to assign as the value for this CSS property.", "\"red\"");
AddAction(7, af_none, "Set CSS style", "Appearance", "Set CSS style {0} to {1}", "Set a CSS style on the control.", "SetCSSStyle");

AddAction(8, af_none, "Set unfocused", "Text box", "Set unfocused", "Remove the input focus from the text box.", "SetBlur");

//-- NEW

AddStringParam("Font face", "The new font face name to set.", "\"Arial\"");
AddComboParamOption("normal");
AddComboParamOption("bold");
AddComboParamOption("italic");
AddComboParamOption("bold and italic");
AddComboParam("Style", "Choose the style for the given font face.");
AddAction(9, 0, "Set font face", "Appearance", "Set font face to <i>{0}</i> (<i>{1}</i>)", "Set the font face used to display text.", "SetFontFace");

AddNumberParam("Size (pt)", "The new font size.", "12");
AddAction(10, 0, "Set font size", "Appearance", "Set font size to <i>{0}</i> pt", "Set the font size.", "SetFontSize");

AddNumberParam("Color", "The new font color, in the form rgb(r, g, b).", "rgb(0, 0, 0)");
AddAction(11, 0, "Set font color", "Appearance", "Set font color to <i>{0}</i>", "Set the font color.", "SetFontColor");

AddStringParam("Family name", "Enter the font family name.");
AddStringParam("CSS URL", "Enter the web URL to the CSS file referencing the web font.", "\"http://\"");
AddAction(12, 0, "Set web font", "Appearance", "Set web font <i>{0}</i> from <i>{1}</i>", "Set the font face from an online web font.", "SetWebFont");

AddStringParam("Color", "The new background color, in the form \"rgb(r, g, b)\". You can also use string name for colors like \"transparent\" to get a transparent background.", "\"rgb(0, 0, 0)\"");
AddAction(13, 0, "Set background color", "Appearance", "Set background color to <i>{0}</i>", "Set the background color.", "SetBGColor");

AddComboParamOption("OFF");
AddComboParamOption("ON");
AddComboParam("Borders", "Choose if activate or deactivate borders.");
AddAction(14, 0, "Toggle Borders", "Appearance", "Toggle the textbox borders.", "Toggle the textbox borders.", "ToggleBorders");

AddAction(15, 0, "Scroll Top", "Text box", "Scroll to the top line of a textarea.", "Scroll to the top line of a textarea.", "ScrollTop");
AddAction(16, 0, "Scroll Bottom", "Text box", "Scroll to  the bottom line of a textarea.", "Scroll to  the bottom line of a textarea.", "ScrollBottom");
AddAction(17, 0, "Select All", "Text box", "Select all the text inside the textbox.", "Select all the text inside the textbox.", "Selectall");

AddStringParam("Text", "The text to append in the text box.");
AddAction(18, af_none, "Append text", "Text box", "Append text to {0}", "Add text at the end of the current existing one.", "AppendText");

AddStringParam("Text", "The new line to append in the text box.");
AddAction(19, af_none, "Append new line text", "Text box", "Append text to {0} in a new line", "Add text at the end of the current existing one in a new line.", "AppendNewlineText");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get text", "Text box", "Text", "Get the text box's text.");
AddExpression(1, ef_return_string, "Get before text", "Text box", "TextBefore", "Get the before caret text box's text.");
AddExpression(2, ef_return_string, "Get after text", "Text box", "TextAfter", "Get the after caret text box's text.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Text",					"",			"The initial text for the text box."),
	new cr.Property(ept_text,	"Placeholder",			"",			"A tip to display when the text box is empty."),
	new cr.Property(ept_text,	"Tooltip",				"",			"Display this text when hovering the mouse over the control."),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the text box is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				"Yes",		"Choose whether the text box is enabled or disabled on startup.", "No|Yes"),
	new cr.Property(ept_combo,	"Read-only",			"No",		"Choose whether the text box is read-only on startup.", "No|Yes"),
	new cr.Property(ept_combo,	"Spell check",			"No",		"Allow the browser to spell-check the text box, if supported.", "No|Yes"),
	new cr.Property(ept_combo,	"Type",					"Text",		"The kind of text entered in to the text box, which also affects on-screen keyboards on touch devices.", "Text|Password|Email|Number|Telephone number|URL|Textarea"),
	new cr.Property(ept_combo,	"Auto font size",		"No",		"Automatically set the font size depending on the layer scale.", "No|Yes"),
	new cr.Property(ept_text,	"ID (optional)",		"",			"An ID for the control allowing it to be styled with CSS from the page HTML."),
	
new cr.Property(ept_section, "Customizations", "",	"Style properties of the text box."),	
	new cr.Property(ept_color,	"Background color",			cr.RGB(255, 255, 255), 	"The background color."),
	new cr.Property(ept_combo,	"Transparent Background",	"No", 		"Make the background transparent?", "No|Yes"),
	new cr.Property(ept_font,	"Font",						"Arial,-16","The font family for the text box."), 
	new cr.Property(ept_color,	"Font color",				cr.RGB(0, 0, 0), 	"Color of the text."),
	new cr.Property(ept_combo,	"Borders",					"Yes",		"Choose whether the text box has borders.", "Yes|No"),
	new cr.Property(ept_float,	"Top Margin",				0,			"Specifies the amount of space between the content and its TOP border."),
	new cr.Property(ept_float,	"Bottom Margin",			0,			"Specifies the amount of space between the content and its BOTTOM border."),
	new cr.Property(ept_float,	"Left Margin",				0,			"Specifies the amount of space between the content and its LEFT border."),
	new cr.Property(ept_float,	"Right Margin",				0,			"Specifies the amount of space between the content and its RIGHT border."),
	new cr.Property(ept_combo,	"Horizontal alignment",		"Left", 	"Horizontal alignment of the text.", "Left|Center|Right"),
	new cr.Property(ept_combo,	"Select all on focus",		"No", 		"If set to Yes, when the textbox get the focus, the whole content will be selected.", "No|Yes"),
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
	this.instance.SetSize(new cr.vector2(150, 22));
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
	renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	cr.quad.prototype.offset.call(quad, 4, 2);
	
	if (this.properties["Text"].length)
	{
		this.font.DrawText(this.properties["Text"],
							quad,
							cr.RGB(0, 0, 0),
							ha_left);
	}
	else
	{
		this.font.DrawText(this.properties["Placeholder"],
							quad,
							cr.RGB(128, 128, 128),
							ha_left);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}