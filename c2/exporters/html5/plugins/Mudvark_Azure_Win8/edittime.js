function GetPluginSettings()
{
	return {
		"name":			"Azure for Windows 8",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"AzureForWin8",					// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Store your Windows 8 app data in the cloud",
		"author":		"Mudvark",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal,		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
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
		
AddCondition(0, cf_trigger, "On completed query", "Data", "On completed query", "Triggered when a query is successfully executed", "OnComplete");
AddCondition(1, cf_trigger, "On record inserted", "Data", "On record inserted", "Triggered when a record is successfully inserted", "OnInsert");
AddCondition(2, cf_trigger, "On record updated", "Data", "On record updated", "Triggered when a record is successfully updated", "OnUpdate");
AddCondition(3, cf_trigger, "On record deleted", "Data", "On record deleted", "Triggered when a record is successfully deleted", "OnDelete");
AddCondition(4, cf_trigger, "On authenticate success", "Identity", "On authenticate success", "Triggered when a user is successfully authenticated", "AuthSuccess");
AddCondition(5, cf_trigger, "On authenticate error", "Identity Error handling", "On authenticate error", "Triggered when a user cannot be authenticated", "AuthError");
AddCondition(6, cf_none, "Is user authenticated", "Identity", "Is user authenticated", "True when a user is logged into their choice of identity provider", "IsAuthenticated");
AddCondition(7, cf_trigger, "On logged out", "Identity", "On logged out", "Triggered when a user is logged out", "LoggedOut");
AddCondition(8, cf_trigger, "On query error", "Data Error handling", "Query Error", "Triggered when there is a connection error when querying a table", "ConnectionError");
AddCondition(9, cf_trigger, "On record insert error", "Data Error handling", "On record insert error", "Triggered when a record fails during insertion", "OnInsertError");
AddCondition(10, cf_trigger, "On record update error", "Data Error handling", "On record update error", "Triggered when a record fails whilst updating", "OnUpdateError");
AddCondition(11, cf_trigger, "On record delete error", "Data Error handling", "On record delete error", "Triggered when a record fails whilst deleting", "OnDeleteError");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Table name", "The name of the table to query");
AddNumberParam("Count", "The number of results to return", "50");
AddNumberParam("Skip", "Skips a number of rows (useful for pagination)", 0);
AddStringParam("Order by", "The name of column to sort the table by in descending order", "\"id\"");

AddComboParamOption("Ascending");
AddComboParamOption("Descending");
AddComboParam("Order", "Order", 1);

AddStringParam("Where column", "Enter the name of a column with the values to filter by", "\"id\"");
AddComboParamOption("= Equal to");
AddComboParamOption("≠ Not equal to");
AddComboParamOption("< Less than");
AddComboParamOption("≤ Less than or equal to");
AddComboParamOption("> Greater than");
AddComboParamOption("≥ Greater than or equal to");
AddComboParam("Where comparison", "Where comparison", 5);
AddAnyTypeParam("Where value", "Enter a value to compare with", 0);

AddAction(0, af_none, "Query Table", "Data", "Query the table <b>{0}</b>, retrieving <b>{1}</b> results, skipping <b>{2}</b>, ordering column <b>{3}</b> in <b>{4}</b> order, where <b>{5}</b> is <b>{6}</b> <b>{7}</b>. ", "Query the table by name", "QueryTable");

AddStringParam("Table name", "The name of the table to insert the record into");
AddStringParam("JSON string", "A dictionary as a JSON string containing the column names and row data");
AddAction(1, af_none, "Insert new record", "Data", "Insert new record <i>{1}</i> into table <b>{0}</b>", "Insert new record", "InsertRecord");

AddStringParam("Table name", "The name of the table where the record you're updating is located");
AddStringParam("JSON string", "A dictionary as a JSON string containing the column names and row data");
AddNumberParam("ID", "The unique identifier of the record to update", "");
AddAction(2, af_none, "Update existing record", "Data", "Update record with ID <b>{2}</b>, with JSON string <i>{1}</i> in table <b>{0}</b>", "Update existing record", "UpdateRecord");

AddStringParam("Table name", "The name of the table where the record you're updating is located");
AddNumberParam("ID", "The unique identifier of the record to delete", "");
AddAction(3, af_none, "Delete existing record", "Data", "Delete existing record with ID <b>{0}</b>", "Delete existing record", "DeleteRecord");

AddComboParamOption("Microsoft");
AddComboParamOption("Facebook");
AddComboParamOption("Twitter");
AddComboParamOption("Google");
AddComboParam("Identity Provider", "Choose your preferred identity provider to authenticate with (e.g. Facebook)");
AddAction(4, af_none, "Authenticate user", "Identity", "Authenticate user with <b>{0}</b>", "Authenticate user", "Authenticate");

AddAction(5, af_none, "Log out", "Identity", "Log out", "Log out", "LogOut");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get last data", "Data", "LastData", "Get the data returned by the last request.");
AddExpression(1, ef_return_string, "Get last retrieved full name", "Data", "LastFullName", "Get the last full name retrieved from an identity provider");

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
	new cr.Property(ept_text,	"App URL",		"",	"App URL is called 'Site URL' in your Azure dashboard"),
	new cr.Property(ept_text,	"App Key",		"",	"App Key can be found in your Azure dashboard")
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