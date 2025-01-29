function GetBehaviorSettings()
{
	return {
		"name":			"Q3D \nSkeletal Anim.",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"SkinCont1",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Helps control skeletal animations using a Q3D Bone hierarchy automatically generated for the model, and a familiar / play / stop / tween system to animation frames / Q3D morph controller",
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
AddStringParam("Animation name", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddCondition(0, 0, "S. anim. is playing", "Skeletal animation", "{my} : Is skeletal animation <b>{0}</b> playing", "Test if a skeletal animation is currently playing.", "IsAnimPlaying");

AddStringParam("Animation name", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddCmpParam("Comparison", "How to compare the current time (seconds).");
AddNumberParam("Number", "The time to compare to (in seconds).");
AddCondition(1, 0, "Comp. anim time-position", "Skeletal animation", "{my} : Skeletal animation <b>{0}</b> time {1} {2}", "Test what time position an animation is in.", "CompareFrame");

AddStringParam("Animation name", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddCondition(2, cf_trigger, "On s. anim. finished", "Skeletal animation", "{my} : On skeletal animation <b>{0}</b> finished", "Triggered when a specific skeletal animation has finished.", "OnAnimFinished");

AddCondition(3, cf_trigger, "On any s. anim. finished", "Skeletal animation", "{my} : On any skeletal animation finished", "Triggered when any skeletal animation has finished playing.", "OnAnyAnimFinished");

AddStringParam("Animation name", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddCmpParam("Comparison", "How to compare the current animation speed.");
AddNumberParam("Number", "The animation speed to compare to.");
AddCondition(4, 0, "Comp. s. anim. speed", "Skeletal animation", "{my} : Skeletal animation <b>{0}</b> speed {1} {2}", "Compare a skeletal animation's speed multiplier.", "CompareAnimSpeed");

AddObjectParam("Bone type", "This type must match the type chosen with the property, or the condition won't work. this is a necessary redundancy for C2 to properly pick the bones.");
AddCondition(5, 0, "Pick skeleton bones", "Q3D Bone Control", "{my} : Pick all Q3D Bone objects {0} in the skeleton", "Picks all the Q3D Bones associated with the instances.", "PickBones");

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
AddStringParam("Animation name", "Name of the skeletal animation to play." , initial_string = "\"\"");
AddComboParamOption("current position");	
AddComboParamOption("beginning");	
AddComboParam("From", "choose where to start playing from" , initial_selection = 0);	
AddAction(0, af_none, "Play Animation", "Skeletal animation", "{my} : play skeletal animation <b>{0}</b> from {1}", "Play one of the skeletal animations from the model file.", "PlaySkinAnim");

AddStringParam("Animation name", "Name of the skeletal animation to stop." , initial_string = "\"\"");
//AddComboParamOption("reset influences");	
//AddComboParamOption("don't reset influences");	
//AddComboParam("Reset influences", "choose whether or not to also reset the effect of the morphing as well as stop the animation" , initial_selection = 0);	
AddAction(1, af_none, "Stop Animation", "Skeletal animation", "{my} : stop skeletal animation <b>{0}</b>", "Stop one of the playing skeletal animations from the model file, by its name.", "StopSkinAnim");

//AddComboParamOption("reset all influences");	
//AddComboParamOption("don't reset all influences");	
//AddComboParam("Reset influences", "choose whether or not to also reset the effect of the morphing as well as stop the animation" , initial_selection = 0);	
AddAction(2, af_none, "Stop all animations", "Skeletal animation", "{my} : stop all skeletal animations", "Stop all of the playing skeletal animations from the model file", "StopAllSkinAnim");

AddStringParam("Animation name", "Name of the skeletal animation to modify." , initial_string = "\"\"");
AddNumberParam("Weight", "Value between 0 and 1 (possibly greater) defining the weight of the animation. Note that if no other animations are playing this value has no effect. animations are played as a weighted average based on this." , initial_string = "1")			// a number
AddAction(3, af_none, "Set animation weight", "Skeletal animation", "{my} : set skeletal animation <b>{0}</b> weight to <i>({1})</i>", "Set the weight of one of the skeletal animations for blending purposes, only has an effect if multiple animations are playing.", "SetSkinScale");

AddStringParam("Animation name", "Name of the skeletal animation to modify." , initial_string = "\"\"");
AddNumberParam("Speed", "Speed multiplier, a value of 1 will play the animation in the specified amount of time in the model file, 2 at twice the speed, -1 at the specified speed in reverse, etc." , initial_string = "1")			// a number
AddAction(4, af_none, "Set animation speed", "Skeletal animation", "{my} : set skeletal animation <b>{0}</b> speed multiplier to <i>({1} X normal speed)</i> .", "Set the speed multiplier for a morph animation to increase its playback rate, slow it down, reverse it, etc.", "SetSkinSpeed");

AddStringParam("Animation name", "Name of the skeletal animation to modify." , initial_string = "\"\"");
AddNumberParam("Time", "time position to move to, based on the length specified in the file. this means if the animation is supposed to be 2 seconds long, using 2 here will move to the end of the animation, 1 to the midpoint, etc." , initial_string = "0")			// a number
AddAction(5, af_none, "Set animation time pos.'", "Skeletal animation", "{my} : set skeletal animation <b>{0}</b> time position to <i>({1} seconds)</i>.", "Set the time position in a skeletal animation, to move to a certain point. based on the length of the animation specified in the file", "SetSkinFrame");

AddStringParam("Animation 0", "Name of the first skeletal animation to set the scale of (based on tween)", initial_string = "\"\"");
AddStringParam("Animation 1", "Name of the second skeletal animation to set the scale of (based on tween)", initial_string = "\"\"");
AddNumberParam("tween value", "value between 0 to 1 which interpolates between the two animations linearly by modifying their weights." , initial_string = "0")			// a number
AddAction(6, af_none, "Interpolate animations", "Skeletal animation", "{my} : Interpolate between skeletal animation <b>{0}</b> and skeletal animation <b>{1}</b> by tween value <i>({2})</i>.", "Set the weight of two animations based on a linear interpolation", "SetSkinTween");

AddStringParam("Animation name", "Name of the skeletal animation to modify." , initial_string = "\"\"");
AddComboParamOption("do loop");
AddComboParamOption("don't loop");	
AddComboParam("Looping", "choose whether or not to loop (similar to how sprites loop using animation system)" , initial_selection = 0);
AddComboParamOption("do ping-pong");
AddComboParamOption("don't ping-pong");	
AddComboParam("Ping-pong", "choose whether or not to ping-pong (similar to how sprites ping-pong using animation system)" , initial_selection = 0);	
AddAction(7, af_none, "Animation settings", "Skeletal animation", "{my} : <b>{1} and {2}</b> skeletal animation <b>{0}</b>", "Set whether the animation loops, ping-pongs, both, or neither. similar to stuff sprite has in animation dialog", "SkinSettings");

AddAction(8, af_none, "Alert anim. info", "Debugging", "{my} : Alert anim info.", "See what the available animations, and their lengths are in an alert prompt, helpful to debug import issues, or just examine a files parsed skeletal animation content.", "AlertSkin");

AddStringParam("Animation 0", "Name of the first skeletal animation to start transfer from.", initial_string = "\"\"");
AddStringParam("Animation 1", "Name of the second skeletal animation to end transfer with." , initial_string = "\"\"");
AddNumberParam("Duration", "the duration of the transfer in seconds." , initial_string = "0")			// a number
AddAction(9, af_none, "Start anim. transfer", "Skeletal animation", "{my} : Transfer between skeletal animation <b>{0}</b> and skeletal animation <b>{1}</b> over <i>({2})</i> seconds.", "Set up an animation transfer which lerps smoothly between the two animations over a set time interval, starting one when the animation transfer begins, stopping the other when it's effect is zero.", "SkinTransf");

AddStringParam("Animation name", "Name of the skeletal animation to modify." , initial_string = "\"\"");
AddComboParamOption("Linear");
AddComboParamOption("Catmull-Rom");
AddComboParamOption("Catmull-Rom Forward");
AddComboParam("Interpolation", "choose the type of interpolation used to tween between animation states, Linear is computationally the fastest but least smoothed, yet recommended for speed reasons." , initial_selection = 0);	
AddAction(10, af_none, "Set Anim. Interpolation", "Skeletal animation", "{my} : Set skeletal animation <b>{0}</b> interpolation mode to <b>{1}</b>", "Set the interpolation mode of a single skeletal animation.", "SetSkinInterpolation");


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

AddStringParam("\"Name\"", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddExpression(0, ef_return_number, "Animation time position (can be decimal if between frames)", "Skeletal animation", "AnimTime", "Return the time position of a specified animation.");

AddStringParam("\"Name\"", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddExpression(1, ef_return_number, "Animation length", "Skeletal animation", "AnimLength", "Return the length of a skeletal animation in seconds.");

AddStringParam("\"Name\"", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddExpression(2, ef_return_number, "Animation speed", "Skeletal animation", "AnimSpeed", "Return the speed multiplier of a skeletal animation, a value of 1x means playback at the specified rate, 2x twice the speed, -1x backwards, etc.");

AddStringParam("\"Name\"", "Name of the skeletal animation to use." , initial_string = "\"\"");
AddExpression(3, ef_return_number, "Animation weight", "Skeletal animation", "AnimWeight", "Return the weight of a specified skeletal animation.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_text, 	"Bone Type-Index",		"0",		"The index of the Q3D Bone type this model will use to form the skeleton (The index of the type of Q3D Bone in Construct 2 this object will be using/creating for its skeleton. It's kind of sketchy to change this unless you know you wont add/remove bones. For most uses leaving this 0 and having one bone type should be fine)."),
	new cr.Property(ept_combo,		"Default Interpolation",	"Linear",		"Choose the type of interpolation used to tween between animation states, Linear is fastest but least smoothed, and recommended.", "Linear|Catmull-Rom|Catmull-Rom Forward"),	// a dropdown list (initial_value is string of initially selected item)
	new cr.Property(ept_combo,		"Bone Collider Transform",	"Scale to next",		"Choose the way the colliders on the bones are scaled to fit the skeleton.", "Off|Scale to next")
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
