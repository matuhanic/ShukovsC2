function GetPluginSettings() 
{
	return {
		"name":		"Listview",
		"id":			"Listview",
		"version":		"1.3.1",
		"description":	"Listview.",
		"author":		"HMMG",
		"help url":		"https://www.scirra.com/forum/plugin-listview-header-sorting_t124360",
		"category":	"HMMG",
		"type":		"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces,
		"dependency":"jquery.stickytableheaders.min.js;jquery.tablesorter.js;"+
						"theme.black-ice.css;"+
						"theme.blue.css;"+
						"theme.bootstrap.css;"+
						"theme.bootstrap_2.css;"+
						"theme.dark.css;"+
						"theme.default.css;"+
						"theme.dropbox.css;"+
						"theme.green.css;"+
						"theme.grey.css;"+
						"theme.ice.css;"+
						"theme.jui.css;"
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
				


AddCondition(0, cf_trigger, "On selection changed", "Listview", "On selection changed", "Triggered when the selected ligne changes.", "OnSelectionChanged");
AddCondition(1, cf_trigger, "On clicked", "Listview", "On clicked", "Triggered when the Listview is clicked.", "OnClicked");
AddCondition(2, cf_trigger, "On double-clicked", "Listview", "On double-clicked", "Triggered when the Listview is double-clicked.", "OnDoubleClicked");
AddCondition(3, cf_trigger, "On mouse over", "Listview", "On mouse over", "Triggered when the cursor is over the Listview .", "OnHover");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddNumberParam("Index", "The zero-based index of the Row to select.");
AddAction(0, af_none, "Set selected index", "Row", "Select Row <i>{0}</i>", "Select a Row in the listview.", "SelectedRow");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the listview.");
AddAction(1, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the listview.", "SetVisible");

AddAction(2, af_none, "Set focused", "Listview", "Set focused", "Set the input focus to the listview.", "SetFocus");
AddAction(3, af_none, "Set unfocused", "Listview", "Set unfocused", "Remove the input focus from the listview.", "SetBlur");

AddStringParam("Text", "The Row text to add. Exemple 3 Column       \"Item1:Item2:Item3\"");
AddAction(4, af_none, "Add Row", "Row", "Add Row <i>{0}</i>", "Append a new Row to the listview.", "AddRow");

AddNumberParam("Index", "The zero-based index of the Row to insert before.");
AddStringParam("Text", "The Row text to add. Exemple 3 Column       \"Item1:Item2:Item3\"");
AddAction(5, af_none, "Add Row at", "Row", "Add Row <i>{1}</i> at index <i>{0}</i>", "Append a new Row to a specific place in the listview.", "AddRowAt");

AddNumberParam("Index", "The zero-based index of the Row to remove.");
AddAction(6, af_none, "Remove At", "Row", "Remove Row <i>{0}</i>", "Remove a Row from the listview.", "RemoveAt");

AddAction(7, af_none, "Clear", "Row", "Clear all Rows", "Remove all Rows from the listview.", "Clear");

AddNumberParam("Index", "The zero-based index of the Row to Change css.");
AddStringParam("Css", "Css exemple    \"background-color:blue;color:white;\" .");
AddAction(8, af_none, "Change Row CSS At", "Row", "Change Row <i>{0}</i> CSS to <i>{1}</i>", "Change a Row css.", "ChangeRowCssAt");

AddNumberParam("Row Index", "The zero-based index of the Row to Change the css.");
AddNumberParam("Cell Index", "The zero-based index of the Cell to Change the css.");
AddStringParam("Css", "Css exemple    \"background-color:blue;color:white;\" .");
AddAction(9, af_none, "Change Cell CSS At Row", "Row", "Change Cell <i>{1}</i> At Row <i>{0}</i> CSS to <i>{2}</i>", "Change a Cell css.", "ChangeCellCssAt");

AddNumberParam("Index", "The zero-based index of the Row to Change add a value to.");
AddStringParam("Key", "Key name where to store the value in the row");
AddStringParam("Value", "Value to store.");
AddAction(10, af_none, "Add Value at Row", "Row", "Set <i>{1}</i> = <i>{2}</i> At <i>{0}</i>", "Store a value.", "StoreValueAt");

AddNumberParam("Index", "The zero-based index of the Column to sort by.");
AddComboParamOption("Ascendant");
AddComboParamOption("Descendant");
AddComboParam("Direction", "Select if the sort is Ascendant or Descendant")
AddAction(11, af_none, "Sort Column", "Sort", "Sort Column of index <i>{0}</i> , Order <i>{1}</i> ", "Sort Column", "sortColumn");


AddStringParam("Text", "The text to use as filter");
AddNumberParam("Index", "The zero-based index of the Column to filter by. -1 for All Columns");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Sensitive", "is filter sensitive");
AddAction(12, af_none, "Filter By", "Filter", "Filter Column of index <i>{1}</i> using <i>{0}</i> and sensitive is <i>{2}</i>", "Filter By", "filterBy");

//////////////////////////////////////// 
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "", "Listview", "RowsCount", "The number of Rows in the listview.");
AddExpression(1, ef_return_number, "", "Listview", "SelectedRowIndex", "The zero-based index of the currently selected Row.");

AddNumberParam("SubTextIndex", "subText index to get.");
AddExpression(2, ef_return_string, "", "Listview", "SubTextSelectedRow", "The subText of the currently selected Row.");

AddNumberParam("RowIndex", "Row number to get.");
AddNumberParam("SubTextIndex", "subText index to get.");
AddExpression(3, ef_return_string, "", "Listview", "SubTextAt", "The subText of the Nth Row in the listview.");

AddNumberParam("RowIndex", "Row number to get.");
AddStringParam("Key", "Key name.");
AddExpression(4, ef_return_string, "", "Listview", "getValueOfKeyAt", "Get stored value of key at a specific row.");
AddExpression(5, ef_return_number, "", "Listview", "SelectedCellIndex", "The zero-based index of the currently selected cell.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Header",				"",			"The initial listiew's header separeted by colon : Exemple header1:header2:header3"),
	new cr.Property(ept_text,	"Items",				"",			"The initial listiew of items, separated by semicolons ; and colomuns separeted by colon : .Exemple Row1Col1:Row1Col2:Row1Col3;Row2Col1:Row2Col2:Row2Col3;"),
	new cr.Property(ept_text,	"Colomun Width",	"",			"Set Listview Colomun Width separated by semicolons ;  .Exemple 20%:50%:30%"),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the list is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_text,	"ID (optional)",		"",			"An ID for the control allowing it to be styled with CSS from the page HTML."),
	new cr.Property(ept_text,	"Header CSS (optional)",		"",		"Add Some CSS to your Listview's header."),
	new cr.Property(ept_text,	"Rows CSS (optional)",		"",			"Add Some CSS to your Listview's Rows."),
	new cr.Property(ept_text,	"Cell CSS (optional)",		"",			"Add Some CSS to your Listview's Cells."),
	new cr.Property(ept_combo,	"Horizontal Alignement",	"Center",		"Set Columns Alignement.", "Left|Center|Right"),
	new cr.Property(ept_combo,	"Vertical Alignement",	"Center",		"Set Columns Alignement.", "Top|Center|Bottom"),
	new cr.Property(ept_combo,	"Show Grid",	"No",		"For listview Grid.", "No|Yes"),
	new cr.Property(ept_combo,	"Show Sorter",	"Yes",		"Show Sorter Icons.", "No|Yes"),
	new cr.Property(ept_combo,	"Sorter Alignement",	"Right",		"Sorter Alignement .", "Left|Center|Right"),
	new cr.Property(ept_combo,	"Fixed Header",	"No",		"Header Fixed when scroll.", "No|Yes"),
	new cr.Property(ept_combo,	"Allow Sort",	"No",		"Allow Sorting.", "No|Yes"),
	new cr.Property(ept_combo,	"Theme",	"Default",		"Select Listview Theme.", "None|Black-Ice|Blue|Bootstrap|Bootstrap 2|Dark|Default|Dropbox|Green|Grey|Ice|Jui"),
	new cr.Property(ept_combo,	"Show Y-Scroll",	"Auto",		"Show Y-Scroll.", "Auto|Yes|No"),
	new cr.Property(ept_text,	"Selected Row Background Color",		"",			"Set a Background color to the selected row."),
	new cr.Property(ept_text,	"Selected Row Text Color",		"",			"Set a text color to the selected row."),
	new cr.Property(ept_text,	"Hover Row Background Color",		"",			"Set a Background color to the hovered row."),
	new cr.Property(ept_text,	"Hover Row Text Color",		"",			"Set a text color to the hovered row.")
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
	
	this.font.DrawText(this.properties["Items"].replace(/;/g, "\n"),
							quad,
							cr.RGB(0, 0, 0),
							ha_left);

}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}