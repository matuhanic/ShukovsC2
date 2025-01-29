function GetPluginSettings()
{
	return {
		"name":			"Dialog System (Simple)",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"sirg_dialogsystem_simple",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Add simple dialog message.",
		"author":		"SirG",
		"help url":		"http://c2community.ru",
		"category":		"Notifications",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
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
					  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
,
        "dependency":	"jquery.noty.js;noty-theme.js"
	};
};

////////////////////////////////////////
// Conditions
////////////////////////////////////////
// Conditions
AddStringParam("ID", "Need for callback.","");
AddCondition(0, cf_trigger, "Dialogue callback: onShow", "Dialogue callback: onShow", "onShow dialogue {0}", "Triggered after dialogue is open.", "DialogueonShow");

AddStringParam("ID", "Need for callback.","");
AddCondition(1, cf_trigger, "Dialogue callback: afterShow", "Dialogue callback: afterShow", "afterShow dialogue {0}", "Triggered after dialogue is open.", "DialogueonShow");

AddStringParam("ID", "Need for callback.","");
AddCondition(2, cf_trigger, "Dialogue callback: onClose", "Dialogue callback: onClose", "onClose dialogue {0}", "Triggered after dialogue is open.", "DialogueonShow");

AddStringParam("ID", "Need for callback.","");
AddCondition(3, cf_trigger, "Dialogue callback: afterClose", "Dialogue callback: afterClose", "afterClose dialogue {0}", "Triggered after dialogue is open.", "DialogueonShow");

AddStringParam("ID", "Need for callback.","");
AddCondition(4, cf_trigger, "Dialogue callback: onCloseClick", "Dialogue callback: onCloseClick", "onCloseClick dialogue {0}", "Triggered after dialogue is open.", "DialogueonShow");
////////////////////////////////////////
// Actions
AddStringParam("ID", "Need for close dialogue notification.","");
AddAnyTypeParam("Text", "Dialogue text.","");

AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Sticky", "If you want it to fade out on its own or just sit there.");

AddComboParamOption("Simple");
AddComboParamOption("Warning");
AddComboParamOption("Error");
AddComboParamOption("Information");
AddComboParamOption("Success");
AddComboParam("Dialogue style", "Dialogue style");

AddAction(0, af_none, "Show simple dialogue", "Dialogue", "Show dialogue {0}", "Add dialogue to layout", "AddDialogue");

AddStringParam("ID", "Need for close dialogue notification.","");
AddAnyTypeParam("Text", "Dialogue text.","");

AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Sticky", "If you want it to fade out on its own or just sit there.");

AddComboParamOption("Simple");
AddComboParamOption("Warning");
AddComboParamOption("Error");
AddComboParamOption("Information");
AddComboParamOption("Success");
AddComboParam("Dialogue style", "Dialogue style");

AddAction(1, af_none, "Update simple dialogue", "Dialogue", "Update dialogue {0}", "Update dialogue", "UpdateDialogue");



AddStringParam("ID", "Close dialogue with ID.","");
AddAction(2, af_none, "Close dialogue", "Dialogue", "Close dialogue {0}", "Close dialogue from layout", "CloseDialogue");

AddAction(3, af_none, "Close all dialogues", "Dialogue", "Close all dialogues", "Close all dialogues from layout", "CloseAllDialogues");

////////////////////////////////////////
// Expressions
////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
var property_list = [];
	
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
