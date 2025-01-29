function GetBehaviorSettings()
{
	return {
		"name":			"GauVeldt_Ease",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"GauVeldt_Ease",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Smooth back-and-forth movement.\nBehavior may be repeated for multiple paths.",
		"author":		"Brian Jack",
		"help url":		"TBA",
		"category":		"Movements",			// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
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
				
// example				
AddCondition(0, cf_none,           "Is in transition",             "Transition", "{my} is in transition",
             "Condition is true when transition is still in progress",
             "IsInTransition");
// next two conditions disallow inverting to prevent any
// potential trouble becuase while in transition both
// conditions yield false and thus inverting one condition
// does not result in affirmatation of the other logically
AddCondition(1, cf_not_invertible, "Is at destination", "Transition", "{my} is at destination",
             "Condition is true when at destination point.",
             "IsAtDestination");
AddCondition(2, cf_not_invertible, "Is at origin",      "Transition", "{my} is at origin",
             "Condition is true when at origin point.",
             "IsAtOrigin");
             
AddComboParamOption("Origin");
AddComboParamOption("Destination");
AddComboParam("Endpoint", "Choose the endpoint to test.");
AddCondition(3, cf_trigger, "On Endpoint Reached", "Triggers", "{my} reached endpoint {0}",
             "Condition fires when chosen endpoint reached.",
             "OnArrived");
AddCondition(4, cf_trigger, "On Update Tick", "Triggers", "{my} update tick",
             "Condition fires whenever transition updates (on ticks).",
             "OnUpdate");

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
AddAction(0, af_none, "Move easing into", "Movements",
                      "Move {my} easing into", "Move easing into opposite point.",
                      "EaseIn");
AddAction(1, af_none, "Move easing away", "Movements",
                      "Move {my} easing away", "Move easing away from current point.",
                      "EaseOut");
AddAction(2, af_none, "Move easing both", "Movements",
                      "Move {my} easing both", "Move to opposite point easing completely.",
                      "EaseInOut");
AddNumberParam("Origin X", "Origin point X", "0");
AddNumberParam("Origin Y", "Origin point Y", "0");
AddAction(3, af_none, "Set origin point", "Movement Setting",
	              "Change {my} origin endpoint to {0},{1}", "Change origin endpoint",
		      "SetOrigin");
AddNumberParam("Destination X", "Destination point X", "0");
AddNumberParam("Destination Y", "Destination point Y", "0");
AddAction(4, af_none, "Set destination point", "Movement Setting",
	              "Change {my} destination endpoint to {0},{1}", "Change destination endpoint",
		      "SetDestination");
AddNumberParam("Transition Period", "Transition period in seconds (Do NOT set to zero).", "1.0");
AddAction(5, af_none, "Set transition period", "Movement Setting",
	              "Change {my} transition period to {0) seconds", "Change transition period",
		      "SetPeriod");

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
AddExpression(0, ef_return_number, "Is ease in progress?", "Movement", "IsEasing", "Returns 1 if easing otherwise 0");
AddExpression(1, ef_return_number, "Get state of transition", "Movement", "GetTransition", "Transition state in range 0 (origin) to 1 (destination) inclusive.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
    new cr.Property(ept_combo,   "Initial point", "Origin", "Initial starting point.",
                    "Origin|Destination"),
    new cr.Property(ept_integer, "Origin X",          0,   "Origin point X."),
    new cr.Property(ept_integer, "Origin Y",          0,   "Origin point Y."),
    new cr.Property(ept_integer, "Destination X",     0,   "Desintation point X."),
    new cr.Property(ept_integer, "Destination Y",     0,   "Destination point Y."),
    new cr.Property(ept_float,   "Transition Period", 1.0, "Time in seconds taken to perfrom transition.")
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
