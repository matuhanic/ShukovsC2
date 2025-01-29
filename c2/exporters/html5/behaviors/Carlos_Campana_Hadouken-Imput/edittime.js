function GetBehaviorSettings()
{
	return {
		"name":			"Hadoken Input",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"HadokenInput",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"0.1",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"It allows to detect a chain of events (tipically a chain of keys or movements) in a short period of time",
		"author":		"Carlos Campaña",
		"help url":		"No URL. Sorry!",
		"category":		"Input",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		bf_onlyone						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
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
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
AddStringParam("Chain", "Enter the command chain to detect.");
AddCondition(0, cf_trigger, "On command chain fired", "Chain", "On {my} fired {0}", "A command chain has been fired", "onCommandChainFired");

AddCondition(1, cf_trigger, "On command chain link added", "Chain link", "On {my} command chain link added", "A command chain link has been added", "onCommandChainLinkAdded");

AddCondition(2, cf_trigger, "On command chain time out", "Chain", "On {my} command chain time out", "The command chain is cleared because too much time has passed since the last received command chain link", "onCommandChainTimeout");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddAction(0, af_none, "Clear command chain", "Chain", "Clear {my}", "Clears the command chain", "ClearChainLink");

AddStringParam("Tag", "Enter a name for this chain link");
AddAction(1, af_none, "Add command chain link", "Chain link", "Adds command chain link {0} to {my} chain", "Add a command chain link to the shortcut detection", "AddChainLink");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "Last command chain link", "General", "lastCommandChainLink", "Returns the last command chain link added");
AddExpression(1, ef_return_string, "Get current command chain", "General", "chain", "Returns the whole current command chain");
AddExpression(2, ef_return_number, "Get remaining time to clear command chain", "General", "remainingTimeToTimeout", "Returns the remaining time to receive another command chain link before cleared the whole current command chain");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	  new cr.Property(ept_float, 	"Time to reset the chain", 0.25, "If the shortcut doesn't receive any new chain link after this time, the chain is cleaned.")
	, new cr.Property(ept_combo, 	"Reset chain when a shortcut is fired", "true", "If a shortcut is fired, clean the chain instead of keeping accumulating chain links.", "false|true")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of the behavior in the IDE
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
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
