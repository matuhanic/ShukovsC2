function GetPluginSettings()
{
	return {
		"name":			"Star Rating",
		"id":				"hmmg_starsratesystem",
		"version":			"1.0",
		"description":		"Star Rating System",
		"author":			"HMMG",
		"help url":			"https://www.scirra.com/forum/plugin-star-rating_t125134",
		"category":		"HMMG",
		"type":			"world",			// appears in layout
		"rotatable":		false,
		"flags":			pf_position_aces | pf_size_aces,
		"dependency":	"cancel-off.png;cancel-on.png;star-half.png;star-off.png;star-on.png;raty.eot;raty.svg;raty.ttf;raty.woff;jquery.raty.css;jquery.raty.js"
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
				
AddCondition(0, cf_trigger, "On clicked", "Stars Rating", "On clicked", "Triggered when any star is clicked.", "OnClicked");

AddCondition(1, cf_trigger, "is ReadOnly", "Stars Rating", "is ReadOnly", "Return True if stars are ReadOnly.", "isReadOnly");


AddNumberParam("Score", "" , 0);
AddAction(0, af_none, "Set Score", "Stars Rating", "Set Score to {0}", "Set Score.", "SetScore");

AddNumberParam("Numer", "" , 0);
AddAction(1, af_none, "Set Stars Number", "Stars Rating", "Set Stars Number to {0}", "Set Stars Number.", "SetStarsNumber");

AddComboParamOption("False");
AddComboParamOption("True");
AddComboParam("Value","Set True for ReadOnly");
AddAction(2, af_none, "Set ReadOnly", "Stars Rating", "Set ReadOnly to {0}", "Set ReadOnly.", "SetReadOnly");


AddExpression(0, ef_return_number, "Get Score", "Starsrating", "GetScore", "Return the Score.");


ACESDone();

// Property grid properties for this plugin
// new cr.Property(ept_combo,	"Type",					"Button",	"The kind of button to use.", "Button|Checkbox"),
// new cr.Property(ept_text,	"Text",					"OK",		"The initial text for the button."),
var property_list = 
[
	new cr.Property(ept_section,		"Stars",						"",			"Stars Properties"),
	new cr.Property(ept_float,			"Score",						"2",		"Set score  ."),
	new cr.Property(ept_integer,		"Stars number",				"5",		"Set number of stars ."),
	new cr.Property(ept_integer,		"MAX Stars number",		"5",		"Set max number of stars .If stars number is 100 and Max stars number is 100 , you will only see 5 stars"),
	new cr.Property(ept_text,			"Stars Hint",					"",			"Text to show when mouse over Each Star , each hint separeted by colon :  , Exemple Stars number is 5 , Star1HintText:Star2HintText:Star3HintText:Star4HintText:Star5HintText  ."),
	new cr.Property(ept_section,		"Cancel Button",				"",			"Cancel Button Properties"),
	new cr.Property(ept_combo,		"Cancel Button",				"False",	"Select True to allow user's to cancel the current score .", "False|True"),
	new cr.Property(ept_combo,		"Cancel Alignement",		"Left",		"Changes the cancel button alignement to the left or right side .", "Left|Right"),
	new cr.Property(ept_text,			"Cancel Hint",				"",			"Text to show when mouse over cancel Button ."),
	new cr.Property(ept_section,		"Icons",						"",			"Icons Properties"),
	new cr.Property(ept_text,			"Stars Off",					"",			"Change the off Stars icon , let it empty for Default icon"),
	new cr.Property(ept_text,			"Stars On",					"",			"Change the on Stars icon , let it empty for Default icon"),
	new cr.Property(ept_text,			"Stars Half",					"",			"Change the Half Star icon , let it empty for Default icon"),
	new cr.Property(ept_text,			"Cancel Not-Clicked Icon", "",			"Change the Not-Clicked Cancel icon , let it empty for Default icon"),
	new cr.Property(ept_text,			"Cancel Clicked Icon",		"",			"Change the Clicked Cancel icon , let it empty for Default icon"),
	new cr.Property(ept_section,		"Extra Option",				"",			""),
	new cr.Property(ept_text,			"ID",							"",			"Stars Oject ID."),
	new cr.Property(ept_combo,		"Half Show",					"False",	"True : If score's decimal is between x.26 and x.75 a half Star will be shown  . else if False : score's decimal < x.6 the star will be rounded down and if  score's decimal >= x.6 the star will be rounded up  ", "False|True"),
	new cr.Property(ept_combo,		"ReadOnly",					"False",	"Select True to allow user's interaction .", "False|True"),
	new cr.Property(ept_text,			"Target ID",					"",			"Some place to display the hints or the cancelHint."),
	new cr.Property(ept_combo,		"Target Type",				"Score",	"Score : set Target Text to Score , Hint set Target Text to Hint .", "Score|Hint"),
	new cr.Property(ept_combo,		"Target Keep",				"False",	"Keep text in target even mouse is not over stars .", "False|True"),
	new cr.Property(ept_combo,		"Show Space",				"True",	"False to remove space between stars .", "False|True"),
	new cr.Property(ept_combo,		"Single",						"False",	"Set True so you can turn on just the mouseovered star instead all from the first until that one .", "False|True"),


	
	
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
	var isCheckbox = (this.properties["Type"] === "Checkbox");
	
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