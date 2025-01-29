function GetPluginSettings()
{
	return {
		"name":		"Nosy Facetype",
		"id":			"nosyfacetype",
		"version":		"1.0",
		"description":	"Nosy is a typeface facetype that uses standard Opentype ligatures to create thousands of potential faces. Add a beard, freckles, eyebrows or any one of dozens of component to make a face.",
		"author":		"Nosy Font by Rory Harnden , Plugin by HMMG",
		"help url":		"http://rrry.me/nosydemo/ , https://www.scirra.com/forum/plugin-nosy-facetype_t124765",
		"category":		"HMMG",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces,
		"dependency":"NOSY_Facetype_by_Rory_Harnden.otf;NOSY.css"
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
				

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel



for( var i = 0 ; i<32 ; i+=2)
{
	var str = "" ;
	switch(i)
	{
		case 0   : str = "Face";break;
		case 2   : str = "Ears";break;
		case 4   : str = "Skin";break;
		case 6   : str = "Mask";break;
		case 8   : str = "Glassesalt";break;
		case 10 : str = "Eyes";break;
		case 12 : str = "Mouth";break;
		case 14 : str = "Mouthalt";break;
		case 16 : str = "Cheeks";break;
		case 18 : str = "Eyebrows";break;
		case 20 : str = "Glasses";break;
		case 22 : str = "Hair";break;
		case 24 : str = "Hat";break;
		case 26 : str = "Beard";break;
		case 28 : str = "Moustache";break;
		case 30 : str = "Nose";break;
		default   : str = "";break;
	}
	if(str.length >0)
	{
		AddStringParam("Text", "Text to compare with Exemple for Nose :     \"NOSE1\" " , "");
		AddCondition(i, cf_trigger, "is "+str+" Text", "Nosyfacetype Text", "is "+str+" Text", "Return True if {my}'s Text equal to {0}.", "is"+str+"Text");
		AddStringParam("Color", "Color to compare with exemple   \"rgb(120,230,102)\"" , "rgb(0,0,0)");
		AddCondition(i+1, cf_trigger, "is "+str+" Color", "Nosyfacetype Color", "is "+str+" Color", "Return True if {my}'s Color equal to {0}.", "is"+str+"Color");

		AddStringParam("Text", "Exemple for Nose : \"NOSE1\"  Or if you want it to be random write \"random\" Or  \"None\" to make it Invisible " , "");
		AddAction(i, af_none, "set "+str+" Text", "Nosyfacetype Text", "Set "+str+"'s Text to {0}", "Set "+str+" Text.", "set"+str+"Text");
		AddStringParam("Color", "Exemple :  \"rgb(120,230,102)\" Or in Hex \"#000000\" Or if you want it to be random write \"random\"  " , "rgb(0,0,0)");
		AddAction(i+1, af_none, "set "+str+" Color", "Nosyfacetype Color", "Set "+str+"'s Color to {0}", "Set "+str+" Color.", "set"+str+"Color");

		AddExpression(i		, ef_return_string, "", "Nosyfacetype", str+"Text", "Return "+str+" Text");
		AddExpression(i+1	, ef_return_string, "", "Nosyfacetype", str+"Color", "Return "+str+" Color");
	}
}







ACESDone();







// Property grid properties for this plugin
var property_list = 
[
	new cr.Property(ept_combo,	"Face","Random","Select Face Type.", "Random|Face 1|None"),
	new cr.Property(ept_color,		"Face Color", cr.RGB(246,233,203),	"Set the Face Color"),
	
	new cr.Property(ept_combo,	"Ears","Random","Select Ears Type.", "Random|Ears 1|Ears 2|Ears 3|Ears 4|Ears 5|Ears 6|Ears 7|Ears 8|Ears 9|None"),
	new cr.Property(ept_color,		"Ears Color", cr.RGB(246,233,203),	"Set the Ears Color"),
	
	new cr.Property(ept_combo,	"Skin","Random","Select Skin Type.", "Random|Skin 1|Skin 2|Skin 3|Skin 4|Skin 5|None"),
	new cr.Property(ept_color,		"Skin Color", cr.RGB(68,220,100),	"Set the Skin Color"),
	
	new cr.Property(ept_combo,	"Mask","Random","Select Mask Type.", "Random|Mask 1|Mask 2|Mask 3|Mask 4|Mask 5|Mask 6|Mask 7|Mask 8|Mask 9|None"),
	new cr.Property(ept_color,		"Mask Color", cr.RGB(40,40,42),	"Set the Mask Color"),
	
	new cr.Property(ept_combo,	"Glassesalt","Random","Select Glassesalt Type.", "Random|Glassesalt 1|Glassesalt 2|Glassesalt 3|Glassesalt 4|Glassesalt 5|None"),
	new cr.Property(ept_color,		"Glassesalt Color", cr.RGB(118,88,131),	"Set the Glassesalt Color"),
	
	new cr.Property(ept_combo,	"Eyes","Random","Select Eyes Type.", "Random|Eyes 1|Eyes 2|Eyes 3|Eyes 4|Eyes 5|Eyes 6|Eyes 7|Eyes 8|Eyes 9|None"),
	new cr.Property(ept_color,		"Eyes Color", cr.RGB(172,210,58),	"Set the Eyes Color"),
	
	new cr.Property(ept_combo,	"Mouth","Random","Select Mouth Type.", "Random|Mouth 1|Mouth 2|Mouth 3|Mouth 4|Mouth 5|Mouth 6|Mouth 7|Mouth 8|Mouth 9|None"),
	new cr.Property(ept_color,		"Mouth Color", cr.RGB(0,0,0),	"Set the Mouth Color"),
	
	new cr.Property(ept_combo,	"Mouthalt","Random","Select Mouthalt Type.", "Random|Mouthalt 1|Mouthalt 2|Mouthalt 3|Mouthalt 4|Mouthalt 5|Mouthalt 6|Mouthalt 7|Mouthalt 8|Mouthalt 9|None"),
	new cr.Property(ept_color,		"Mouthalt Color", cr.RGB(229,47,167),	"Set the Mouthalt Color"),
	
	new cr.Property(ept_combo,	"Cheeks","Random","Select Cheeks Type.", "Random|Cheeks 1|Cheeks 2|Cheeks 3|Cheeks 4|Cheeks 5|Cheeks 6|Cheeks 7|Cheeks 8|Cheeks 9|None"),
	new cr.Property(ept_color,		"Cheeks Color", cr.RGB(241,143,175),	"Set the Cheeks Color"),
	
	new cr.Property(ept_combo,	"Eyebrows","Random","Select Eyebrows Type.", "Random|Eyebrows 1|Eyebrows 2|Eyebrows 3|Eyebrows 4|Eyebrows 5|Eyebrows 6|Eyebrows 7|Eyebrows 8|Eyebrows 9|None"),
	new cr.Property(ept_color,		"Eyebrows Color", cr.RGB(0,0,0),	"Set the Eyebrows Color"),
	
	new cr.Property(ept_combo,	"Glasses","Random","Select Glasses Type.", "Random|Glasses 1|Glasses 2|Glasses 3|Glasses 4|Glasses 5|None"),
	new cr.Property(ept_color,		"Glasses Color", cr.RGB(0,0,0),	"Set the Glasses Color"),
	
	new cr.Property(ept_combo,	"Hair","Random","Select Hair Type.", "Random|Hair 1|Hair 2|Hair 3|Hair 4|Hair 5|Hair 6|Hair 7|Hair 8|Hair 9|None"),
	new cr.Property(ept_color,		"Hair Color", cr.RGB(128,128,128),	"Set the Hair Color"),
	
	new cr.Property(ept_combo,	"Hat","Random","Select Hat Type.", "Random|Hat 1|Hat 2|Hat 3|Hat 4|Hat 5|Hat 6|Hat 7|Hat 8|Hat 9|None"),
	new cr.Property(ept_color,		"Hat Color", cr.RGB(63,211,228),	"Set the Hat Color"),
	
	new cr.Property(ept_combo,	"Beard","Random","Select Beard Type.", "Random|Beard 1|Beard 2|Beard 3|Beard 4|Beard 5|None"),
	new cr.Property(ept_color,		"Beard Color", cr.RGB(211,139,90),	"Set the Beard Color"),
	
	new cr.Property(ept_combo,	"Moustache","Random","Select Moustache Type.", "Random|Moustache 1|Moustache 2|Moustache 3|Moustache 4|Moustache 5|None"),
	new cr.Property(ept_color,		"Moustache Color", cr.RGB(241,230,139),	"Set the Moustache Color"),
	
	new cr.Property(ept_combo,	"Nose","Random","Select Nose Type.", "Random|Nose 1|Nose 2|Nose 3|Nose 4|Nose 5|Nose 6|Nose 7|Nose 8|Nose 9|None"),
	new cr.Property(ept_color,		"Nose Color", cr.RGB(63,211,228),	"Set the Nose Color"),
	
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
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(72, 24));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	
	this.font = renderer.CreateFont("Arial", 14, false, false);
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	
		renderer.Fill(quad, cr.RGB(224, 224, 224));
		renderer.Outline(quad, cr.RGB(0, 0, 0));
		
		cr.quad.prototype.offset.call(quad, 0, 2);

		this.font.DrawText("WA",
							quad,
							cr.RGB(0, 0, 0),
							ha_center);
	
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}