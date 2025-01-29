function GetBehaviorSettings()
{
	return {
		"name":			"Fader",
		"id":			"Fader",
		"version":		"1.0",
		"description":	"Change an object's opacity over time.  Modified version of original Fade behaviour by Scirra.",
		"author":		"Colludium",
		"help url":		"http://www.scirra.com/manual/95/fade",
		"category":		"General",
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, cf_trigger, "On fade-out finished", "", "On {my} fade-out finished", "Triggered when the fade-out has finished.", "OnFadeOutEnd");
AddCondition(1, cf_trigger, "On fade-in finished", "", "On {my} fade-in finished", "Triggered when the fade-in has finished.", "OnFadeInEnd");
AddCondition(2, cf_trigger, "On wait finished", "", "On {my} wait finished", "Triggered when the wait has finished.", "OnWaitEnd");
AddCondition(3, 0, "Is running", "", "Fade is running", "Fade is running.", "FadeIsRunning");

//////////////////////////////////////////////////////////////
// Actions
AddAction(0, 0, "Restart fade", "Run", "{my}: restart fade", "Run the fade again.", "RestartFade");

AddAction(1, 0, "Resume fade", "Run", "{my}: start / resume fade", "Set the fade to running, if paused or not started.", "ResumeFade");

AddNumberParam("Fade-in time", "Time in seconds to spend in the fade-in phase.");
AddAction(2, 0, "Set fade-in time", "Settings", "{my}: set fade-in time to <i>{0}</i>", "Set the fade-in time property.", "SetFadeInTime");

AddNumberParam("Wait time", "Time in seconds to spend in the wait phase.");
AddAction(3, 0, "Set wait time", "Settings", "{my}: set wait time to <i>{0}</i>", "Set the wait time property.", "SetWaitTime");

AddNumberParam("Fade-out time", "Time in seconds to spend in the fade-out phase.");
AddAction(4, 0, "Set fade-out time", "Settings", "{my}: set fade-out time to <i>{0}</i>", "Set the fade-out time property.", "SetFadeOutTime");

AddAction(5, 0, "Pause fade", "Run", "{my}: pause the fade.", "Pause the fade.", "PauseTheFade");



//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "", "", "TimeFadeIn", "The fade-in time in seconds.");
AddExpression(1, ef_return_number, "", "", "TimeWait", "The wait time in seconds.");
AddExpression(2, ef_return_number, "", "", "TimeFadeOut", "The fade-out time in seconds.");
AddExpression(3, ef_return_number, "", "", "Progress", "Progress of current Stage, 0 to 1.");
AddExpression(4, ef_return_number, "", "", "Stage", "The current Stage of the fade, 0 = in, 1 = wait, 2 = out, 3 = finished.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Running at start", "Yes", "Whether the fade starts running on created.", "No|Yes"),
	new cr.Property(ept_float, "Fade in time", 0, "Duration in seconds of fade-in, or zero to skip."),
	new cr.Property(ept_float, "Wait time", 0, "Duration in seconds of time to wait between fade-in and fade-out, or zero to skip."),
	new cr.Property(ept_float, "Fade out time", 1, "Duration in seconds of fade-out, or zero to skip."),
	new cr.Property(ept_combo, "At end", "Destroy", "What to do at the end of the fade.", "Do Nothing|Destroy|Loop")
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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Clamp values
	if (this.properties["Fade in time"] < 0)
		this.properties["Fade in time"] = 0;
		
	if (this.properties["Wait time"] < 0)
		this.properties["Wait time"] = 0;
		
	if (this.properties["Fade out time"] < 0)
		this.properties["Fade out time"] = 0;
}
