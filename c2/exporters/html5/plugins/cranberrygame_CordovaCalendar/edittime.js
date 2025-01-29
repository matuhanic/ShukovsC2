function GetPluginSettings()
{
	return {
		"name":			"Cordova Calendar",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaCalendar",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"use the functionality of native calendar (Create event, Find event, Delete event, Open calendar).",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova extension",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
nl.x-services.plugins.calendar
phonegap build service: 
cordova registry: 
github: https://github.com/Telerik-Verified-Plugins/Calendar/tree/0d7d253c9d6a7b9da5c760fc2d040a08e782c64f
//cranberrygame end
*/
		"cordova-plugins":	"https://github.com/Telerik-Verified-Plugins/Calendar#0d7d253c9d6a7b9da5c760fc2d040a08e782c64f",		
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
//
AddCondition(3, cf_looping, "For each element", "For Each", "For each element", "Repeat the event for each element in the array.", "ArrForEach");
*/
//cranberrygame start
AddCondition(0, cf_trigger, "On create event succeeded", "My category", "On create event succeeded", "Description for my condition!", "OnCreateEventSucceeded");//cranberrygame
AddCondition(1, cf_trigger, "On create event failed", "My category", "On create event failed", "Description for my condition!", "OnCreateEventFailed");//cranberrygame
AddCondition(2, cf_trigger, "On delete event succeeded", "My category", "On delete event succeeded", "Description for my condition!", "OnDeleteEventSucceeded");//cranberrygame
AddCondition(3, cf_trigger, "On delete event failed", "My category", "On delete event failed", "Description for my condition!", "OnDeleteEventFailed");//cranberrygame
AddCondition(4, cf_trigger, "On find event succeeded", "My category", "On find event succeeded", "Description for my condition!", "OnFindEventSucceeded");//cranberrygame
AddCondition(5, cf_trigger, "On find event failed", "My category", "On find event failed", "Description for my condition!", "OnFindEventFailed");//cranberrygame
/*
AddCondition(6, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
AddCondition(7, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
AddCondition(8, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
AddCondition(9, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
AddCondition(10, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
AddCondition(11, cf_trigger, "On tttttttttt", "My category", "On tttttttttt", "Description for my condition!", "OnFindEventFailed");//cranberrygame
*/
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
AddStringParam("URL", "Enter URL to open.");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Location bar", "Select Yes or No.", 1);
AddAction(2, af_none, "Open", "My category", "Open {0}", "Description for my action!", "Open");
*/
//cranberrygame start
AddStringParam("Event name", "Enter event name. ex) \"New years party\"", "\"New years party\"");
AddStringParam("Location", "Enter location. ex) \"The club\"", "\"The club\"");
AddStringParam("Description", "Enter description. ex) \"Bring pizza\"", "\"Bring pizza\"");
AddNumberParam("From year", "Enter from year. ex) 2015", "2015");
AddNumberParam("From month", "Enter from month. ex) 1", "1");
AddNumberParam("From day", "Enter from day. ex) 1", "1");
AddNumberParam("From hour", "Enter from hour. ex) 20", "20");
AddNumberParam("From minute", "Enter from minute. ex) 30", "30");
AddNumberParam("To year", "Enter to year. ex) 2015", "2015");
AddNumberParam("To month", "Enter to month. ex) 1", "1");
AddNumberParam("To day", "Enter to day. ex) 1", "1");
AddNumberParam("To hour", "Enter to hour. ex) 21", "21");
AddNumberParam("To minute", "Enter to minute. ex) 40", "40");
AddAction(0, af_none, "Create event", "My category", "Create event {0}", "Create event.", "CreateEvent");
AddStringParam("Event name", "Enter event name. ex) \"New years party\"", "\"New years party\"");
AddStringParam("Location", "Enter location. ex) \"The club\"", "\"The club\"");
AddStringParam("Description", "Enter description. ex) \"Bring pizza\"", "\"Bring pizza\"");
AddNumberParam("From year", "Enter from year. ex) 2015", "2015");
AddNumberParam("From month", "Enter from month. ex) 1", "1");
AddNumberParam("From day", "Enter from day. ex) 1", "1");
AddNumberParam("From hour", "Enter from hour. ex) 20", "20");
AddNumberParam("From minute", "Enter from minute. ex) 30", "30");
AddNumberParam("To year", "Enter to year. ex) 2015", "2015");
AddNumberParam("To month", "Enter to month. ex) 1", "1");
AddNumberParam("To day", "Enter to day. ex) 1", "1");
AddNumberParam("To hour", "Enter to hour. ex) 21", "21");
AddNumberParam("To minute", "Enter to minute. ex) 40", "40");
AddAction(1, af_none, "Delete event", "My category", "Delete event {0}", "Delete event in time range.", "DeleteEvent");
AddStringParam("Event name", "Enter event name. ex) \"New years party\"", "\"New years party\"");
AddStringParam("Location", "Enter location. ex) \"The club\"", "\"The club\"");
AddStringParam("Description", "Enter description. ex) \"Bring pizza\"", "\"Bring pizza\"");
AddNumberParam("From year", "Enter from year. ex) 2015", "2015");
AddNumberParam("From month", "Enter from month. ex) 1", "1");
AddNumberParam("From day", "Enter from day. ex) 1", "1");
AddNumberParam("From hour", "Enter from hour. ex) 0", "0");
AddNumberParam("From minute", "Enter from minute. ex) 0", "0");
AddNumberParam("To year", "Enter to year. ex) 2015", "2015");
AddNumberParam("To month", "Enter to month. ex) 1", "1");
AddNumberParam("To day", "Enter to day. ex) 1", "1");
AddNumberParam("To hour", "Enter to hour. ex) 23", "23");
AddNumberParam("To minute", "Enter to minute. ex) 0", "0");
AddAction(2, af_none, "Find event", "My category", "Find event {0}", "Find events in time range.", "FindEvent");
AddAction(3, af_none, "Open calendar", "My category", "Open calendar", "Description for my action!", "OpenCalendar");
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
//
AddExpression(3, ef_return_any, "Current Value", "For Each", "CurValue", "Get the current value in a For Each loop.");
AddNumberParam("X", "The X index (0-based) of the array value to get.", "0");
AddExpression(4, ef_return_any | ef_variadic_parameters, "Get value at", "Array", "At", "Get value from the array.  Add second or third parameters to specify Y and Z indices.");
AddExpression(5, ef_return_number, "Get width", "Array", "Width", "Get the number of elements on the X axis of the array.");
*/
//cranberrygame start
AddExpression(0, ef_return_number, "Get events count", "My category", "EventsCount", "Get events count."); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(1, ef_return_string, "Get event name at", "My category", "EventNameAt", "Get event name at. ex) New Years party"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(2, ef_return_string, "Get location at", "My category", "LocationAt", "Get location at. ex) The Club"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(3, ef_return_string, "Get from date at", "My category", "FromDateAt", "Get from date at. ex) 2015-01-01 20:30:00"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(4, ef_return_string, "Get to date at", "My category", "ToDateAt", "Get to date at. ex) 2015-01-01 21:40:00"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(5, ef_return_string, "Get description at", "My category", "DescriptionAt", "Get description at. ex) Bring pizza."); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(6, ef_return_number, "Get from date year at", "My category", "FromDateYearAt", "Get from date year at. ex) 2015"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(7, ef_return_number, "Get from date month at", "My category", "FromDateMonthAt", "Get from date month at. ex) 1"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(8, ef_return_number, "Get from date day at", "My category", "FromDateDayAt", "Get from date day at. ex) 1"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(9, ef_return_number, "Get from date hour at", "My category", "FromDateHourAt", "Get from date hour at. ex) 20"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(10, ef_return_number, "Get from date minute at", "My category", "FromDateMinuteAt", "Get from date minute at. ex) 30"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(11, ef_return_number, "Get from date second at", "My category", "FromDateSecondAt", "Get from date second at. ex) 0"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(12, ef_return_number, "Get to date year at", "My category", "ToDateYearAt", "Get to date year at. ex) 2015"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(13, ef_return_number, "Get to date month at", "My category", "ToDateMonthAt", "Get to date month at. ex) 1"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(14, ef_return_number, "Get to date day at", "My category", "ToDateDayAt", "Get to date day at. ex) 1"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(15, ef_return_number, "Get to date hour at", "My category", "ToDateHourAt", "Get to date hour at. ex) 21"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(16, ef_return_number, "Get to date minute at", "My category", "ToDateMinuteAt", "Get to date minute at. ex) 40"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(17, ef_return_number, "Get to date second at", "My category", "ToDateSecondAt", "Get to date second at. ex) 0"); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(18, ef_return_string | ef_deprecated, "Get id at", "My category", "IdAt", "Get id at."); //cranberrygame
AddNumberParam("Index", "Enter index");
AddExpression(19, ef_return_number | ef_deprecated, "Get all day at", "My category", "AllDayAt", "Get all day at. 0 (not all day) or 1 (all day)"); //cranberrygame
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
