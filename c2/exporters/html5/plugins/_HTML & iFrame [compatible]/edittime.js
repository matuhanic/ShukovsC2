function GetPluginSettings()
{
	return {
		"name":				"HTML | iFrame [compatible]",
		"id":				"htmlCODE",
		"version":			"1.42",
		"description":		"iFrame or insert html code inside of Construct 2.",
		"author":			"PlayLive",
		"help url":			"https://www.scirra.com/forum/plugin-html-iframe_t149647",
		"category":			"Addon",
		"type":				"world",
		"rotatable":		true,
		"flags":			pf_position_aces | pf_size_aces,
		"cordova-plugins":	"org.apache.cordova.inappbrowser"
	};
};

////////////////////////////////////////
// Conditions
AddStringParam("CSS file name", "CSS file name to compare.");
AddCondition(0, cf_none, "Compare CSS file name", "Appearance", "CSS file name is <i>{0}</i>", "Compare the CSS file name imported.", "CompareCSSfilename");

AddStringParam("CSS style", "CSS style to compare.");
AddCondition(1, cf_none, "Compare CSS style", "Appearance", "CSS style is <i>{0}</i>", "Compare the CSS style currently displayed in this object.", "CompareCSSstyle");

//--- Javascript
AddCondition(3, cf_trigger, "On C2 Function", "_HTML", "On C2 Function", "Triggered when javascript C2 Function returns any value.", "OnC2");

AddStringParam("C2", "The Javascript return to compare.");
AddComboParamOption("case insensitive");
AddComboParamOption("case sensitive");
AddComboParam("Case", "Choose whether the comparison is case sensitive (PLAYLIVE different to PlayLive) or case insensitive (PLAYLIVE same as PlayLive).");
AddCondition(4, cf_none, "Compare C2 Function", "_HTML", "C2 Function return is <i>{0}</i>", "Compare the return of the javascript inside this object.", "C2value");

//--- Both
AddCondition(5, cf_trigger, "On Error", "_Both", "On load error", "Triggered when content loading fails.", "OnError");
AddCondition(6, cf_trigger, "On Load", "_Both", "On load completed", "Triggered when content loading completes successfully.", "OnLoad");

//--- HTML
AddStringParam("HTML code", "The HTML code to compare.");
AddComboParamOption("case insensitive");
AddComboParamOption("case sensitive");
AddComboParam("Case", "Choose whether the comparison is case sensitive (PLAYLIVE different to PlayLive) or case insensitive (PLAYLIVE same as PlayLive).");
AddCondition(2, cf_none, "Compare HTML code", "_HTML", "HTML code is <i>{0}</i>", "Compare the HTML code currently displayed in this object.", "CompareHTML");

//--- iFrame
AddCondition(7, cf_none, "Is focused", "_iFrame", "<i>iFrame:</i> Is focused", "True if the iFrame is focused.", "IsFocused");

AddCondition(8, cf_none, "Is loading", "_iFrame", "<i>iFrame:</i> Is loading", "True if the iframe is loading.", "IsLoading");

AddStringParam("URL", "The URL to compare.");
AddCondition(9, cf_none, "Compare URL", "_iFrame", "<i>iFrame:</i> URL is <i>{0}</i>", "Compare the url currently displayed in iFrame.", "URL");

AddCondition(10, cf_trigger, "On Go to URL", "_iFrame", "On Go to URL", "Triggered when a new page load starts.", "OnGoToURL");
// ===== END IN 10 ===== \\

////////////////////////////////////////
// Actions
AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether the object is hidden or shown.");
AddAction(0, af_none, "Set visible", "Appearance", "Set {0}", "Set whether the object is hidden or shown.", "SetVisible");

AddStringParam("Tooltip", "The tooltip to set on this object.");
AddAction(1, af_none, "Set tooltip", "Appearance", "Set tooltip to <i>{0}</i>", "Set the text box's tooltip.", "SetTooltip");

AddStringParam("CSS file", "The CSS file to import separated by semicolons(eg. 'style-01.css; style-02.css;')");
AddAction(2, af_none, "Import CSS file", "Appearance", "Import CSS <i>{0}</i>", "Import CSS file.", "ImpCSSfile");

AddStringParam("CSS file", "The CSS file to remove (eg. style.css)");
AddAction(3, af_none, "Remove CSS file", "Appearance", "Remove CSS <i>{0}</i>", "Remove CSS file.", "RemCSSfile");

AddStringParam("Property name", "A CSS property name to set on the control.", "\"color\"");
AddStringParam("Value", "A string to assign as the value for this CSS property.", "\"rgb(255, 255, 255)\"");
AddAction(4, af_none, "Set CSS style", "Appearance", "Set CSS style <i>{0}</i> to <i>{1}</i>", "Set a CSS style on the control.", "SetCSS");

AddNumberParam("Set scale", "Set the scale for this object.", "1.0");
AddComboParamOption("Resize to scale");
AddComboParamOption("Keep current size");
AddComboParam("Size", "Whether to resize this object to the size of the scale, or keep it in the current size.", "1");
AddAction(5, af_none, "Set scale", "Appearance", "Set scale for <i>{0}</i> (<i>{1}</i>)", "Set scale of this object.", "SetScale");

AddStringParam("Add Class", "Add class name's separated by spaces.");
AddAction(22, af_none, "Add Class", "Appearance", "Add Class <i>{0}</i>", "Add class name to object.", "AddClass");

AddStringParam("Remove Class", "Remove class name's separated by spaces.");
AddAction(23, af_none, "Remove Class", "Appearance", "Remove Class <i>{0}</i>", "Remove object class name.", "RemClass");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Text selectable", "'Yes' to allow text selection, 'No' to refuse.", "1");
AddAction(26, af_none, "Text selectable", "Appearance", "Selectable text <i>{0}</i>", "Set whether selectable text is true or not.", "TextSelectable");

//--- Javascript
AddStringParam("Javascript file", "The Javascript file to import separated by semicolons(eg. 'script-01.js; script-02.js')");
AddAction(19, af_none, "Include Javascript file", "_Javascript", "Include JS file name <i>{0}</i>", "Include JS file.", "ImpJSfile");
/***** Browsers save scripts in memory
AddStringParam("Javascript file", "The Javascript file to remove (eg. script.js)");
AddAction(20, af_none, "Remove Javascript file", "_HTML", "Remove JS file name <i>{0}</i>", "Remove JS file.", "RemJSfile");
*****/
AddStringParam("Javascript", "String of javascript code to execute. Beware of causing security vulnerabilities or causing errors that break the game! Refer to the documentation for more advice. Wherever possible, prefer to use Construct 2's Javascript SDK instead.", "\"myFunction();\"");
AddAction(21, 0, "Execute Javascript", "_Javascript", "Execute javascript <i>{0}</i>", "Execute a string of javascript in the browser. Use with care!", "ExecJS");

//--- HTML
AddStringParam("Set HTML", "Set content HTML code for this object.", "\"\"");
AddAction(6, af_none, "Set HTML", "_HTML", "<i>HTML:</i> Set HTML to <i>{0}</i>", "Set the HTML content.", "SetHTML");

AddStringParam("Append HTML", "Enter the HTML code to append to this object.", "\"\"");
AddAction(7, af_none, "Append HTML", "_HTML", "<i>HTML:</i> Append HTML code <i>{0}</i>", "Add HTML code to the end of the existing code in this object.", "AppendHTML");

AddStringParam("URL", "The URL to load into this object.");
AddStringParam("POST Data (Optional)", "The post data to pass to the URL <i>(eg. name=playlive&id=10)</i>");
AddAction(8, af_none, "Load content", "_HTML", "<i>HTML:</i> Load content from page <i>{0}</i>", "Load content into this object from another page.", "LoadHTML");

AddAction(9, af_none, "Scroll Top", "_HTML", "<i>HTML:</i> Scroll top", "Scroll to the top line of this object.", "ScrollTop");
AddAction(10, af_none, "Scroll bottom", "_HTML", "<i>HTML:</i> Scroll bottom", "Scroll to the bottom of this object.", "ScrollBottom");

AddNumberParam("Scroll to (%)", "Scroll to (X%).", "0");
AddAction(17, af_none, "Scroll to (%)", "_HTML", "<i>HTML:</i> Scroll to <i>{0}</i>%", "Scroll to the custom position (in percentage) of this object.", "ScrollTo");

AddNumberParam("Scroll to (position)", "Scroll to (position).", "0");
AddAction(18, af_none, "Scroll to (position)", "_HTML", "<i>HTML:</i> Scroll to <i>{0}</i> position", "Scroll to the custom position of this object.", "ScrollToPosition");

AddStringParam("ID/Class", "Get elements by #ID or .Class", "\"\"");
AddStringParam("Set", "Set value for element", "\"\"");
AddStringParam("Append", "Append value for element", "\"\"");
AddAction(24, af_none, "Get elements", "_HTML", "<i>HTML:</i> Get elements {0} and set/add value {1} {2}", "Set or add values to elements by #ID or .Class.", "GetElement");

AddStringParam("ID/Class", "Get elements by #ID or .Class", "\"\"");
AddAction(25, af_none, "Remove elements", "_HTML", "<i>HTML:</i> Remove {0}", "Remove elements by #ID or .Class.", "RemoveElement");

//--- iFrame
AddAction(11, af_none, "Blur", "_iFrame", "<i>iFrame:</i> Blur (unfocus) for this object", "Blur (unfocus) on iFrame.", "Blur");
AddAction(12, af_none, "Focus", "_iFrame", "<i>iFrame:</i> Focus for this object", "Focus on iFrame.", "Focus");

AddStringParam("URL", "Go to url.");
AddAction(13, af_none, "Go to URL", "_iFrame", "<i>iFrame:</i> Go to <i>{0}</i>", "Go to url.", "GoTo");

AddAction(14, af_none, "Back", "_iFrame", "<i>iFrame:</i> Backward", "Move the iFrame back one in history.", "Backward");
AddAction(15, af_none, "Forward", "_iFrame", "<i>iFrame:</i> Forward", "Move the iFrame forward one in history.", "Forward");
AddAction(16, af_none, "Refresh", "_iFrame", "<i>iFrame:</i> Refresh", "Refresh iFrame.", "Refresh");
// ===== END IN 26 ===== \\

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Get CSS file name", "Appearance", "CSSfilename", "Get the style file names imported.");
AddExpression(1, ef_return_string, "Get CSS style", "Appearance", "CSS", "Get the CSS style of the object.");
//--- Javascript
AddExpression(3, ef_return_string, "Get C2 Function return", "_Javascript", "C2", "Get the returned string of Function C2().");
//--- Both
AddExpression(5, ef_return_string, "Get object ID", "_Both", "ID", "Get the object ID.");
AddExpression(8, ef_return_string, "Get object Class", "_Both", "Class", "Get the object Class.");
//--- HTML
AddExpression(2, ef_return_string, "Get HTML code", "_HTML", "HTML", "Get the HTML code.");
AddExpression(6, ef_return_number, "Get Scroll Position", "_HTML", "ScrollPosition", "Get scroll position.");
AddExpression(7, ef_return_number, "Get Scroll Height", "_HTML", "ScrollHeight", "Get scroll height.");
//--- iFrame
AddExpression(4, ef_return_string, "Get URL", "_iFrame", "URL", "Get the current URL.");
AddExpression(9, ef_return_string, "Get Host name", "_iFrame", "Host", "Get the host name.");
AddExpression(10, ef_return_string, "Get Host path", "_iFrame", "HostPath", "Get the host path.");
// ===== END IN 10 ===== \\

ACESDone();

// Property grid properties for this object
var property_list = [
/* [00] */	new cr.Property(ept_text,	"ID (optional)",		"",					"An ID for the control allowing it to be styled with CSS from the page HTML."),
/* [01] */	new cr.Property(ept_text,	"Class (optional)",		"",					"An Class for the control allowing it to be styled with CSS from the page HTML."),
/* [02] */	new cr.Property(ept_combo,	"Initial visibility",	"Visible",			"Choose whether this object is visible on startup.", "Invisible|Visible"),
/* [03] */	new cr.Property(ept_text,	"Tooltip",				"",					"Display this text when hovering the mouse over the control."),
/* [04] */	new cr.Property(ept_text,	"Background",			"", 				"The background color.\neg. rgb(255, 255, 255)"),
/* [05] */	new cr.Property(ept_text,	"Border",				"",					"Choose whether this object has borders.\neg. 3px solid rgb(255, 255, 255)"),
/* [06] */	new cr.Property(ept_combo,	"Scroll",				"Auto",				"Choose whether this object has scrolling.", "No|Auto|Horizontal|Vertical"),
/* [07] */	new cr.Property(ept_combo,	"Object",				"iFrame",			"Select object 'iFrame' or 'HTML'.", "iFrame|HTML"),
/* [--] */	new cr.Property(ept_section,"iFrame",				"",					""),
/* [08] */	new cr.Property(ept_text,	"URL",					"",					"The url of this iFrame.\neg. http://www.site.com/"),
/* [--] */	new cr.Property(ept_section,"HTML",					"",					""),
/* [09] */	new cr.Property(ept_text,	"Code",					"",					"The HTML code of this object.\neg. <h1>Hello World</h1>"),
/* [10] */	new cr.Property(ept_text,	"Color",				"",					"Text color of this object.\neg. rgb(255, 255, 255)"),
/* [11] */	new cr.Property(ept_combo,	"Text selectable",		"Yes",				"Set whether text can be selected.","No|Yes"),
/* [12] */	new cr.Property(ept_combo,	"Auto font size",		"Default",			"Automatically set the font size.", "No|Default|Small|Big|Large"),
/* [--] */	new cr.Property(ept_section,"Import",				"",					""),
/* [13] */	new cr.Property(ept_text,	"CSS import",			"",					"The name of the external CSS file to import separated by semicolons.\neg.\nstyle-01.css; style-02.css"),
/* [14] */	new cr.Property(ept_text,	'Javascript import',	"",					"The name of the external Javascript to import separated by semicolons.\neg.\nscript-01.js; script-02.js")
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
	this.instance.SetSize(new cr.vector2(320, 240));
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
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(30, 30, 30));

	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);

	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(224, 224, 224));

	if (this.properties["Border"].length)
		renderer.Outline(quad, cr.RGB(30, 30, 30));

	if (this.properties["HTML"] && this.properties["HTML"].length) {
		this.font.DrawText(this.properties["HTML"],
											quad,
											cr.RGB(128, 128, 128),
											ha_left);
	};
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}