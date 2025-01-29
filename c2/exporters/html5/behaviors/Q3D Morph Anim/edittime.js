function GetBehaviorSettings()
{
	return {
		"name":			"Q3D\nMorph Anim.",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"MorCont1",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Helps control morph animations",
		"author":		"Quazi",
		"help url":		"",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
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
AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddCondition(0, 0, "M. anim. is playing", "Morph animation", "{my} : Is morph animation <b>{0}</b> playing", "Test if a morph animation is currently playing.", "IsAnimPlaying");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddCmpParam("Comparison", "How to compare the current frame number (0-based).");
AddNumberParam("Number", "The frame number to compare to (0-based).");
AddCondition(1, 0, "Comp. m. frame", "Morph animation", "{my} : Morph animation <b>{0}</b> frame {1} {2}", "Test which morph animation frame is currently showing for a named animation.", "CompareFrame");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddCondition(2, cf_trigger, "On m. anim. finished", "Morph animation", "{my} : On morph animation <b>{0}</b> finished", "Triggered when a specific morph animation has finished.", "OnAnimFinished");

AddCondition(3, cf_trigger, "On any m. anim. finished", "Morph animation", "{my} : On any morph animation finished", "Triggered when any morph animation has finished playing.", "OnAnyAnimFinished");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddCmpParam("Comparison", "How to compare the current animation speed.");
AddNumberParam("Number", "The animation speed to compare to.");
AddCondition(4, 0, "Comp. m. anim. speed", "Morph animation", "{my} : Morph animation <b>{0}</b> speed {1} {2}", "Compare a morph animation speed.", "CompareAnimSpeed");

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
AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddComboParamOption("current position");	
AddComboParamOption("beginning");	
AddComboParam("From", "choose where to start playing from" , initial_selection = 0);	
AddAction(0, af_none, "Play Animation", "Morph animation", "{my} : play morph animation <b>{0}</b> from {1}", "Play one of the parsed morph animation names (morph animations are named based on parsed data in the model .js file, with the appended numbers removed i.e. stand001, would be \"stand\")", "PlayMorphAnim");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddComboParamOption("reset influences");	
AddComboParamOption("don't reset influences");	
AddComboParam("Reset influences", "choose whether or not to also reset the effect of the morphing as well as stop the animation" , initial_selection = 0);	
AddAction(1, af_none, "Stop Animation", "Morph animation", "{my} : stop morph animation <b>{0}</b>, {1}", "Stop one of the parsed morph animation names (morph animations are named based on parsed data in the model .js file, with the appended numbers removed i.e. stand001, would be \"stand\")", "StopMorphAnim");

AddComboParamOption("reset all influences");	
AddComboParamOption("don't reset all influences");	
AddComboParam("Reset influences", "choose whether or not to also reset the effect of the morphing as well as stop the animation" , initial_selection = 0);	
AddAction(2, af_none, "Stop all animations", "Morph animation", "{my} : stop all morph animations, {0}", "Stop all of the parsed morph animation names (morph animations are named based on parsed data in the model .js file, with the appended numbers removed i.e. stand001, would be \"stand\")", "StopAllMorphAnim");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddNumberParam("Scale", "Value between 0 and 1 (possibly greater) defining the amount/scale of the morph" , initial_string = "1")			// a number
AddAction(3, af_none, "Set animation scale", "Morph animation", "{my} : set morph animation <b>{0}</b> scale to <i>({1})</i>", "Set the scaling of one of parsed morph animation names (morph animations are named based on parsed data in the model .js file, with the appended numbers removed i.e. stand001, would be \"stand\")", "SetMorphScale");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddNumberParam("Speed", "Speed in morph 'frames' per second (note that the morph 'frames' are interpolated) negative values are acceptable." , initial_string = "30")			// a number
AddAction(4, af_none, "Set animation speed", "Morph animation", "{my} : set morph animation <b>{0}</b> speed to <i>({1})</i> frames / second.", "Set the speed in frames/second of one of parsed morph animation names (morph animations are named based on parsed data in the model .js file, with the appended numbers removed i.e. stand001, would be \"stand\")", "SetMorphSpeed");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddNumberParam("Frame", "Morph animation 'frame'. Values are actually interpolated between morph frames so decimals are acceptable (0 based, so your first frame of a particular anim, regardless of numbering in name, is 0.)" , initial_string = "0")			// a number
AddAction(5, af_none, "Set animation 'frame'", "Morph animation", "{my} : set morph animation <b>{0}</b> frame position to <i>({1})</i>.", "Set the frame position of a morph animation)", "SetMorphFrame");

AddStringParam("Morph animation 0", "name of the first morph animation to set the scale of (based on tween)", initial_string = "\"\"");
AddStringParam("Morph animation 1", "name of the second morph animation to set the scale of (based on tween)" , initial_string = "\"\"");
AddNumberParam("tween value", "value between 0 to 1 which interpolates between the two animations linearly by modifying their scaling." , initial_string = "0")			// a number
AddAction(6, af_none, "Interpolate animations", "Morph animation", "{my} : Interpolate between morph animation <b>{0}</b> and morph animation <b>{1}</b> by tween value <i>({2})</i>.", "Set the scale of two animations based on a linear interpolation", "SetMorphTween");

AddStringParam("Morph animation", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddComboParamOption("do loop");
AddComboParamOption("don't loop");	
AddComboParam("Looping", "choose whether or not to loop (similar to how sprites loop using animation system)" , initial_selection = 0);
AddComboParamOption("do ping-pong");
AddComboParamOption("don't ping-pong");	
AddComboParam("Ping-pong", "choose whether or not to ping-pong (similar to how sprites ping-pong using animation system)" , initial_selection = 0);	
AddAction(7, af_none, "Animation settings", "Morph animation", "{my} : <b>{1} and {2}</b> morph animation <b>{0}</b>", "Set whether the animation loops, ping-pongs, both, or neither. similar to stuff sprite has in animation dialog", "MorphSettings");

AddAction(8, af_none, "Alert anim. info", "Debugging", "{my} : Alert anim info.", "See what the available animations, and their lengths are in an alert prompt, helpful to debug import issues.", "AlertMorph");

AddStringParam("Morph animation 0", "name of the first morph animation to start transfer from.", initial_string = "\"\"");
AddStringParam("Morph animation 1", "name of the second morph animation to end transfer with." , initial_string = "\"\"");
AddNumberParam("Duration", "the duration of the transfer in seconds." , initial_string = "0")			// a number
AddAction(9, af_none, "Start anim. transfer", "Morph animation", "{my} : Transfer between morph animation <b>{0}</b> and morph animation <b>{1}</b> over <i>({2})</i> seconds.", "Set up an animation transfer which lerps smoothly between the two animations over a set interval, starting one when the animation transfer begins, stopping the other when it's effect is zero.", "MorphTransf");


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

AddStringParam("\"Name\"", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddExpression(0, ef_return_number, "Animation frame (can be decimal if between frames)", "Morph animation", "MorphFrame", "Return the frame position.");

AddStringParam("\"Name\"", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddExpression(1, ef_return_number, "Animation length (can be decimal if between frames)", "Morph animation", "MorphLength", "Return the length of a morph animation in morph frames.");

AddStringParam("\"Name\"", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddExpression(2, ef_return_number, "Animation speed", "Morph animation", "MorphSpeed", "Return the speed of a morph animation in morph frames per second.");

AddStringParam("\"Name\"", "name of the numberless part from the .js file, e.x. if naming of morphs is stand001,stand002,stand003 etc, animation name parsed to have name \"stand\"," , initial_string = "\"\"");
AddExpression(3, ef_return_number, "Animation scale", "Morph animation", "MorphScale", "Return the scale of a morph animation.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
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
