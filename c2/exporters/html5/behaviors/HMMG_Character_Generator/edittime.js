function GetBehaviorSettings()
{
	return {
		"name":		"Character Generator",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"hmmg_CharacterGenerator",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Generate a random Person's First Name , Last Name , Even Middle Name , Age , Birthday , SSN () , Social security number",
		"author":		"HMMG",
		"help url":		"",
		"category":	"HMMG",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0	,					// uncomment lines to enable flags...
		"dependency":"chance.min.js"

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
AddCondition(0, cf_none, "has Middle Name", "Condition", "{my} has middle Name", "Return true is has Middle Name", "hasMiddleName");
AddCondition(1, cf_none, "is Male"	, "Condition", "{my}  is Male"  	, "Return true if is Male", "isMale");
AddCondition(2, cf_none, "is Female", "Condition", "{my}  is Female", "Return true if is Female", "isFemale");
AddCondition(3, cf_none, "is Child"	, "Condition", "{my}  is Child"	, "Return true if is Child", "isChild");
AddCondition(4, cf_none, "is Teen"	, "Condition", "{my}  is Teen"	, "Return true if is Teen", "isTeen");
AddCondition(5, cf_none, "is Adult"  	, "Condition", "{my}  is Adult"	, "Return true if is Adult", "isAdult");
AddCondition(6, cf_none, "is Senior"	, "Condition", "{my}  is Senior", "Return true if is Senior", "isSenior");

AddNumberParam("Day"	, "Older than date Day.");
AddNumberParam("Month"	, "Older than date Month.");
AddNumberParam("Year"	, "Older than date Year.");
AddCondition(7, cf_none, "is Older Than", "Condition", "{my}  is Older than  {0}/{1}/{2}", "Return true if {my} is Older", "isOlderThan");

AddNumberParam("Day"		, "Younger than date's Day.");
AddNumberParam("Month"	, "Younger than date's Month.");
AddNumberParam("Year"	, "Younger than date's Year.");
AddCondition(8, cf_none, "is Younger Than", "Condition", "{my}  is Younger than {0}/{1}/{2}", "Return true if {my} is Younger", "isYoungerThan");

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



AddStringParam("First Name"	, "Character First Name.");
AddStringParam("Middle Name"	, "Character Middle Name.");
AddStringParam("Last Name"	, "Character Last Name.");
AddAction(0, af_none, "Set Name", "General", "{my} Name is  {0} {1} {2}", "Set Your Character's Name .", "SetName");


AddStringParam("Day"	, "Birthday Day.");
AddStringParam("Month"	, "Birthday Month.");
AddStringParam("Year"	, "Birthday Year.");
AddAction(1, af_none, "Set Birthday", "General", "{my} Birthday is  {0}", "Set Your Character's Birthday .", "SetBirthday");

AddComboParamOption("Male");
AddComboParamOption("Female");
AddComboParam("Gender", "Choose gender.");
AddAction(2, af_none, "Set Gender", "General", "{my} Gender is  {0}", "Set Your Character's Gender .", "SetGender");


AddAction(3, af_none, "Re-Generate Full Name", "Re-Generate", "{my} Re-Generate Full Name", "Re-Generate Full Name", "ReGenerateFullName");
AddAction(4, af_none, "Re-Generate First Name", "Re-Generate", "{my} Re-Generate First Name", "Re-Generate First Name", "ReGenerateFirstName");
AddAction(5, af_none, "Re-Generate Middle Name", "Re-Generate", "{my} Re-Generate Middle Name","Re-Generate Middle Name",  "ReGenerateMiddleName");
AddAction(6, af_none, "Re-Generate Last Name", "Re-Generate", "{my} Re-Generate Last Name",  "Re-Generate Last Name", "ReGenerateLastName");
AddAction(7, af_none, "Re-Generate Birthday", "Re-Generate", "{my} Re-Generate Birthday", "Re-Generate Birthday", "ReGenerateBirthday");

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
AddExpression(0, ef_return_string, "", "CharacterGenerator", "FirstName", "Return First Name.");
AddExpression(1, ef_return_string, "", "CharacterGenerator", "MiddleName", "Return Middle Name.");
AddExpression(2, ef_return_string, "", "CharacterGenerator", "LastName", "Return Last Name.");
AddExpression(3, ef_return_string, "", "CharacterGenerator", "FullName", "Return Full Name.");
AddStringParam("Date to Compare with", "Write 'today' or a date exemple '25/06/2014' ");
AddExpression(4, ef_return_number, "", "CharacterGenerator", "Age", "Return Age between Birthday and  'today' Or 'anotherDate'.");
AddExpression(5, ef_return_string, "", "CharacterGenerator", "Birthday", "Return Birthday Format 25/02/2015.");
AddExpression(6, ef_return_number, "", "CharacterGenerator", "BirthdayYear", "Return Birthday's Year.");
AddExpression(7, ef_return_number, "", "CharacterGenerator", "BirthdayMonth", "Return Birthday's Month.");
AddExpression(8, ef_return_number, "", "CharacterGenerator", "BirthdayDay", "Return Birthday's Day.");
AddExpression(9, ef_return_number, "", "CharacterGenerator", "Gender", "Return Gender.");
AddExpression(10, ef_return_number, "", "CharacterGenerator", "Type", "Return Type.");


////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_combo,	"Gender"   			,		"Male",				"Set gender", "Male|Female"),
	new cr.Property(ept_combo,	"Middle Name"   	,			"No",					"Generate Middle Name", "No|Yes"),
	new cr.Property(ept_combo,	"Type"   			,			"Adult",				"Set type : Child|Teen|Adult|Senior", "Child|Teen|Adult|Senior")
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
