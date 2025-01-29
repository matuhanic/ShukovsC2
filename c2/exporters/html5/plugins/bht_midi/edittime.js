function GetPluginSettings()
{
	return {
		"name":			"BHT MIDI",				// Black Hornet Technologies MIDI implementation
		"id":			"BHT_MIDI",
		"version":		"1.1",
		"description":	"MIDI interface",
		"author":		"Black Hornet Technologies",
		"help url":		"blackhornettechnologies.com/construct2/plugins/BHTMIDI.aspx",
		"category":		"Media",				// This is a Media plugin
		"type":			"object",				// Not drawn in the layout
		"rotatable":	false,					// Not "world", so false.
		"flags":        pf_singleglobal,		// exists project-wide
	    // All of these are from the MIDI.js repository on https://github.com/mudcube/MIDI.js They have been modified, in some cases.
		"dependency": "AudioDetect.js;LoadPlugin.js;Player.js;Plugin.js;midifile.js;replayer.js;stream.js;DOMLoader.script.js;base64binary.js;WebMIDIAPI.js"
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
				
// example				
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

AddCondition(1000, cf_trigger, "On interface loaded", "MIDI Player", "On interface load ended", "Triggered when the MIDI interface finishes loading.", "OnInterfaceLoaded");
//AddCondition(1001, cf_trigger, "On interface load failed", "MIDI Player", "On interface failed to load", "Triggered when the MIDI interface fails the loading action.", "InterfaceFailedToLoad");

AddCondition(1010, cf_trigger, "On file loaded", "MIDI Player", "On file load ended", "Triggered when the MIDI file finishes loading.", "OnFileLoaded");
//AddCondition(1011, cf_trigger, "On file load failed", "MIDI Player", "On file failed to load", "Triggered when the MIDI file fails the loading action.", "FileOnFailedToLoad");

AddCondition(1100, cf_none, "Is MIDI Player playing", "MIDI Player", "Is MIDI Player playing", "True if the MIDI Player is playing.", "IsPlaying");

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
//AddStringParam("Message", "Enter a string to alert.");
//AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

// ASYNC - calls OnInterfaceLoaded when done.
// Load an interface from a list. Sets up the underlying framework for MIDI processing. 
AddComboParamOption("c2midi");
AddComboParamOption("webmidi");
AddComboParam("Interface", "The internal interface to use to interpret the MIDI data", 0);
AddNumberParam("Device index", "The index of the MIDI device (only valid for webmidi)", "0");
AddAction(1000, af_none, "Load by interface", "MIDI Commands", "Load interface: {0}, device: {1}", "Load a special interface.", "LoadInterfaceByIndex");

// Set the overall volume for a given MIDI channel.
AddNumberParam("Channel", "MIDI channel.", "0");
AddNumberParam("Volume", "Sound volume.", "0");
AddAction(1100, af_none, "Set volume", "MIDI Commands", "Set channel {0} volume to {1}", "Set the volume.", "SetVolume");

// Play a numerical note.
// Channel:     0-15
// Note:        0-127   The full range is rarely supported.
// Velocity:    0-127   Velocity is translated to a volume. There is no attempt to mimic any kind of attack to the sound.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddNumberParam("Note", "Note to play.", "0");
AddNumberParam("Velocity", "Velocity of note (0-127).", "127");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1101, af_none, "Play a note", "MIDI Commands", "Play note {1} at velocity {2}, with delay {3}, on channel {0}.", "Play the given note at the given velocity, after a delay.", "NoteOn");

// Stop playing a numerical note.
// Channel:     0-15
// Note:        0-127   The full range is rarely supported.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddNumberParam("Note", "Note to stop.", "0");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1102, af_none, "Stop playing a note", "MIDI Commands", "Stop playing note {1}, with delay {2}, on channel {0}.", "Stop playing the given note, after a delay.", "NoteOff");

// Play a piano key by name.
// Channel:     0-15
// Key:         A0-C8   Only an 88-note piano keyboard is mapped.
// Velocity:    0-127   Velocity is translated to a volume. There is no attempt to mimic any kind of attack to the sound.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Key", "Key to play.", "0");
AddNumberParam("Velocity", "Velocity of note (0-127).", "127");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1103, af_none, "Play a key", "MIDI Commands", "Play {1} at velocity {2}, with delay {3}, on channel {0}.", "Play the given key at the given velocity, after a delay.", "KeyOn");

// Stop playing a piano key by name.
// Channel:     0-15
// Key:         A0-C8   Only an 88-note piano keyboard is mapped.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Key", "Key to stop.", "0");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1104, af_none, "Stop playing a key", "MIDI Commands", "Stop playing {1}, with delay {2}, on channel {0}.", "Stop playing the given key, after a delay.", "KeyOff");

// Play a chord of numerical notes.
// Channel:     0-15
// Chord:       a list of comma separated numerical notes to play. Each value 0-127.
// Velocity:    0-127   Velocity is translated to a volume. There is no attempt to mimic any kind of attack to the sound.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Chord", "Chord to play (comma separated note values).", "0");
AddNumberParam("Velocity", "Velocity of note (0-127).", "127");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1110, af_none, "Play a (note) chord", "MIDI Commands", "Play note chord {1} at velocity {2}, with delay {3}, on channel {0}.", "Play the given chord at the given velocity, with delay.", "NoteChordOnByString");

// Stop playing a chord of numerical notes.
// Channel:     0-15
// Chord:       a list of comma separated numerical notes to play. Each value 0-127.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Chord", "Chord to stop (comma separated note values).", "0");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1111, af_none, "Stop playing a (note) chord", "MIDI Commands", "Stop playing note chord {1}, with delay {2}, on channel {0}.", "Play the given chord at the given velocity, with delay.", "NoteChordOffByString");

// Play a chord of piano key names.
// Channel:     0-15
// Chord:       a list of comma separated numerical notes to play. Each value A0-C8.
// Velocity:    0-127   Velocity is translated to a volume. There is no attempt to mimic any kind of attack to the sound.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Chord", "Chord to play (comma separated key values).", "0");
AddNumberParam("Velocity", "Velocity of note (0-127).", "127");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1112, af_none, "Play a (key) chord", "MIDI Commands", "Play key chord {1} at velocity {2}, with delay {3}, on channel {0}.", "Play the given chord at the given velocity, with delay.", "KeyChordOnByString");

// Stop playing a chord of piano key names.
// Channel:     0-15
// Chord:       a list of comma separated numerical notes to play. Each value A0-C8.
// Velocity:    0-127   Velocity is translated to a volume. There is no attempt to mimic any kind of attack to the sound.
// Delay:       0-?     The length of time in seconds until the note plays. (window.setTimeout uses ms)
AddNumberParam("Channel", "MIDI channel.", "0");
AddStringParam("Chord", "Chord to stop (comma separated key values).", "0");
AddNumberParam("Delay", "Delay.", "0");
AddAction(1113, af_none, "Stop playing a (key) chord", "MIDI Commands", "Stop playing key chord {1}, with delay {2}, on channel {0}..", "Play the given chord at the given velocity, with delay.", "KeyChordOffByString");


AddStringParam("Name", "File name.");
AddAction(1200, af_none, "Load a file", "MIDI Player", "Load: {0}", "Load a file", "PlayerLoadFile");

AddComboParamOption("looping off");
AddComboParamOption("looping on");
AddComboParam("Loop", "Turn looping on or off.", 0);
AddAction(1201, af_none, "Start", "MIDI Player", "Start with {0}", "Start", "PlayerStart");

AddAction(1202, af_none, "Resume", "MIDI Player", "Resume", "Resume", "PlayerResume");

AddAction(1203, af_none, "Pause", "MIDI Player", "Pause", "Pause", "PlayerPause");

AddAction(1204, af_none, "Stop", "MIDI Player", "Stop", "Stop", "PlayerStop");

AddStringParam("Callback", "The name of the callback function.");
AddAction(1205, af_none, "Add listener", "MIDI Player", "Add listener: {0}", "Add listener", "PlayerAddListener");

AddStringParam("Callback", "The name of the callback function.");
AddAction(1206, af_none, "Remove listener", "MIDI Player", "Remove listener: {0}", "Remove listener", "PlayerRemoveListener");

AddStringParam("Data", "MIDI file data (base64)");
AddAction(1207, af_none, "Load a user MIDI file", "MIDI Player", "Load a user MIDI file (base64)", "Load a user MIDI file", "PlayerLoadBase64File");

//AddNumberParam("Tempo", "Tempo.", "120");
//AddAction(1208, af_none, "Set new tempo", "MIDI Player", "Set the playback tempo to {0} bpm", "Set the tempo, in beats-per-minute.", "PlayerSetTempo");

AddNumberParam("GMIndex", "General MIDI Index", "0");
AddStringParam("Prefix", "The file name prefix for this instrument. IE: piano_A3; the prefix is 'piano_'");
AddNumberParam("Volume", "Master volume for this patch.", "127");
AddComboParamOption("Named");
AddComboParamOption("Numbered");
AddComboParam("Note naming", "Do note names have names, or numbers (000_C1 vs 000_024)?", 0);
AddStringParam("Known notes", "The list of notes/keys that have been loaded into the Sounds folder. ie: A0-C8 *OR* A2, A4, C4 *OR* 023-086 *OR* any combination.");
AddAction(1300, af_none, "Configure an instrument", "MIDI Patches", "Set up a GM instrument patch. GM index {0}, prefix {1}, patch volume {2}. Notes are {3}. Known notes to preload: {4}.", "GM index is zero based", "AssignInstrument");

AddNumberParam("Index", "Drum kit index", "0");
AddStringParam("Prefix", "The file name prefix for this instrument. IE: drum_A3; the prefix is 'drum_'");
AddNumberParam("Volume", "Master volume for this patch.", "127");
AddComboParamOption("Named");
AddComboParamOption("Numbered");
AddComboParam("Note naming", "Do note names have names, or numbers (000_C1 vs 000_024)?", 0);
AddStringParam("Known notes", "The list of notes/keys that have been loaded into the Sounds folder. ie: A0-C8 *OR* A2, A4, C4 *OR* 023-086 *OR* any combination.");
AddAction(1301, af_none, "Configure a drum kit mapping", "MIDI Patches", "Set up a drum kit. Drum index {0}, prefix {1}, patch volume is {2}. Notes are {3}. Known notes to preload: {4}.", "Index is zero based", "AssignDrumKit");

AddNumberParam("Channel", "Channel number", "0");
AddNumberParam("Patch", "Patch number", "0");
AddAction(1302, af_none, "Program change", "MIDI Patches", "Assign patch number {1} to channel {0}.", "Patch to channel. Channel 10 will be a drum patch.", "ProgramChange");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(1000, ef_return_number, "", "MIDI Player", "CurrentTime", "Return the current time of the MIDI Player.");
AddExpression(1001, ef_return_number, "", "MIDI Player", "EndTime", "The end time of the MIDI Player/file.");
AddExpression(1002, ef_return_number, "", "MIDI Player", "IsPlaying", "True if the MIDI Player is playing.");

AddStringParam("Key", "The Key string to convert to it's numeric value");
AddExpression(1010, ef_return_number, "", "Utilities", "KeyToNote", "Convert a Key string (like C4) to it's MIDI numeric value ('C4'=60)");

AddNumberParam("Note", "The note value to convert to it's Key string");
AddExpression(1011, ef_return_string, "", "Utilities", "NoteToKey", "Convert a MIDI numeric value to it's Key string (60='C4')");

AddExpression(1020, ef_return_string, "", "Utilities", "GetInputs", "Get the list of Input devices");
AddExpression(1021, ef_return_string, "", "Utilities", "GetOutputs", "Get the list of Output devices");

AddStringParam("Name", "name");
AddExpression(1030, ef_return_number, "", "Utilities", "InterfaceSupported", "MIDI Interface supported");

AddExpression(1031, ef_return_string, "", "Utilities", "CurrentInterface", "MIDI Interface currently initialized (it may not be what you asked for)");

AddExpression(1100, ef_return_number, "", "MIDI File", "Tempo", "Return the tempo in beats-per-minute");


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
	new cr.Property(ept_integer, "Player buffer size", 100, "Controls how many MIDI NoteOn events are processed at once."),
    new cr.Property(ept_float, "Note-off decay", 0.2, "The amount of extra time to add to a note-off event to allow for the note to decay.")
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

// v1.1
// 2014-09-25: PlayerStart(loop) wasn't looping - throwing an exception. I don't know how this got lost, but I think I've fixed it correctly.
//             Also fixed Stop (it wasn't!)
