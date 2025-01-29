

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

AddStringParam("Class", "Object Class.");
AddCondition(4, cf_none, "Compare class", "Text box Advance", "Compare Class {0}", "Class.", "IsClassText");

AddStringParam("Id", "Object Id.");
AddCondition(5, cf_none, "Compare Id", "Text box Advance", "Compare Id {0}", "Id.", "IsIdText");

AddCondition(6, cf_none, "On Text Cut", "Text box Advance", "On Text Cut", "TextCut.", "OnTextCut");

AddCondition(7, cf_none, "On Text Add", "Text box Advance", "On Text Add", "TextAdd.", "OnTextAdd");

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

AddAction(9, af_none, "Scroll to bottom", "Text box", "Scroll to bottom", "Scroll to the bottom of the text box if a textarea.", "ScrollToBottom");

AddStringParam("Add Text", "Text for add.");
AddAction(10, af_none, "Add text", "Text box Advance", "Add text {0}", "Add text.", "AddText");

AddStringParam("Cut Text", "Text for cut.");
AddAction(11, af_none, "Cut text", "Text box Advance", "Cut text <b>{0}</b>", "Cut text.", "CutText");

AddAction(12, af_none, "Scroll to top", "Text box Advance", "Scroll to top", "Scroll to the top of the text box if a textarea.", "ScrollToTop");

AddNumberParam("Scroll To", "Scroll to / %.");
AddAction(13, af_none, "Scroll To", "Text box Advance", "Scroll to <b>{0}%</b>", "Scroll To.", "ScrollTo");

AddStringParam("Set Id", "Set Id.");
AddAction(14, af_none, "Set Id", "Text box Advance", "Set Id <b>{0}</b>", "Set Id.", "SetId");

AddStringParam("Set Class", "Set Class.");
AddAction(15, af_none, "Set Class", "Text box Advance", "Set Class <b>{0}</b>", "Set Class.", "SetClass");

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
AddExpression(1, ef_return_string, "Get id", "Text box Advance", "Id", "Get text box id.");
AddExpression(2, ef_return_string, "Get class", "Text box Advance", "Class", "Get text box class.");
AddExpression(3, ef_return_string, "Amount", "Text box Advance", "Amount", "Amount.");


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
	new cr.Property(ept_combo,	"Type",					"Text",		"The kind of text entered in to the text box, which also affects on-screen keyboards on touch devices.", "Text|Password|Email|Number|Telephone number|URL|Textarea|Blank Text"),
	new cr.Property(ept_combo,	"Auto font size",		"Yes",		"Automatically set the font size depending on the layer scale.", "No|Yes"),
	new cr.Property(ept_text,	"ID (optional)",		"",			"An ID for the control allowing it to be styled with CSS from the page HTML."),
	new cr.Property(ept_integer,	"Text Size",		"30",			"Text size/px."),
	new cr.Property(ept_color,	"Text Color",		cr.RGB(0, 0, 0),			"Text color."),
	new cr.Property(ept_color,	"Background color",		cr.RGB(255, 255, 255),			"Background color."),
	new cr.Property(ept_integer,	"Rounding",		"0",			"Border-radius/px."),
	new cr.Property(ept_combo,	"Outline",		"None",			"Just in case.", "None|Yes"),
	new cr.Property(ept_combo,	"Border",		"None",			"Standart selection around object.", "None|Yes"),
	new cr.Property(ept_text,	"Class",		"",			"Object Class."),
	new cr.Property(ept_integer,	"MaxLenght",		"999",			"Max Lenght.")

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
function GetPluginSettings()
{
	return {
		"name":			"TextBoxAdvance",
		"id":			"TextBoxTwo",
		"version":		"2.0",
		"description":	"A text field form control for the user to type text in to. For simply displaying text, use the 'Text' object instead.",
		"author":		"Scirra, Pudgergun",
		"help url":		"http://www.scirra.com/manual/117/textbox",
		"category":		"Form controls",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces
	};
};
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(150, 22));
}
var clicksdonot = 1;

IDEInstance.prototype.OnDoubleClicked = function(renderer)
{
	var clickcounter = clicksdonot - 4;
	if(clickcounter<1000){
	if(clicksdonot==1){alert('Do not click!');}
	if(clicksdonot==2){alert('Thats enough');}
	if(clicksdonot==3){alert('Want to play in the clicker ?');}
	if(clicksdonot==4){alert('Ok , play..');}
	if(clicksdonot>=5){alert('Click:'+clickcounter);}
	if(clicksdonot>=1000){alert('You Win!!!...');}
	clicksdonot++;
	}
	
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
		{
		this.font = renderer.CreateFont("Arial", 14, false, false);
		}
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	
	if(this.properties["Type"] != "Blank Text"){
	renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? this.properties["Background color"] : cr.RGB(224, 224, 224));
	
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	}
	cr.quad.prototype.offset.call(quad, 4, 2);
	if (!this.properties["Text"].length) if(!this.properties["Placeholder"].length){
		if(this.properties["Type"] == "Blank Text"){
			this.font.DrawText("Blank Text",
							quad,
							this.properties["Text Color"],
							ha_left);
		}
	}
	if (this.properties["Text"].length)
	{
		this.font.DrawText(this.properties["Text"],
							quad,
							this.properties["Text Color"],
							ha_left);
	}
	else
	{
	if (this.properties["Placeholder"].length){
		this.font.DrawText(this.properties["Placeholder"],
							quad,
							cr.RGB(128, 128, 128),
							ha_left);
							}
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}