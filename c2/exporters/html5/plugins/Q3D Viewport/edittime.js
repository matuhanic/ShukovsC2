function GetPluginSettings()
{
	return {
		"name":			"Q3D\nViewport",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Q3Dviewp",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Allows for split screen and easy control of viewports for 3D rendering.",
		"author":		"Quazi",
		"help url":		"http://threejs.org/",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
						| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
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

AddCondition(0, cf_none, "Is visible", "Appearance", "Is visible", "Check if the Q3D viewport is visible or not", "IsVisible");

AddObjectParam("Q3D Object", "Select a Q3D Object type to test projected ray against");
AddNumberParam("Absolute X", "An absolute X position relative the Construct 2 canvas to use for projection (you can use mouse.AbsoluteX for example)" , initial_string = "0");
AddNumberParam("Absolute Y", "An absolute Y position relative the Construct 2 canvas to use for projection (you can use mouse.AbsoluteY for example)" , initial_string = "0");
AddNumberParam("Step", "Step size to use for moving forward the projected ray forward, smaller values are more precise but more CPU intensive" , initial_string = "10");
AddNumberParam("Min Distance", "Min distance to move without triggering a result" , initial_string = "0");
AddNumberParam("Max Distance", "Max distance allowable to step the ray forward before terminating condition without results" , initial_string = "1000");
AddCondition(1, cf_not_invertible, "Project, Pick 1st", "Projection", "Pick first {0} by intersecting projected ray.", "Project absolute coordinates (e.g. mouse.AbsoluteX,AbsoluteY) into the viewport, picking the first object a test ray intersects of a specified type, generates info about contact that can be retrieved from expressions", "PickByProjection");

AddNumberParam("Absolute X", "An absolute X position relative the Construct 2 canvas to test (you can use mouse.AbsoluteX for example)" , initial_string = "0");
AddNumberParam("Absolute Y", "An absolute Y position relative the Construct 2 canvas to test (you can use mouse.AbsoluteY for example)" , initial_string = "0");
AddCondition(2, cf_none, "Point in frame", "Projection", "Absolute position ({0},{1}) is in viewport frame", "Test which returns true if absolute position is in viewport frame", "PointInFrame");


AddObjectParam("Q3D Object", "Select a Q3D Object type to test projected ray against");
AddNumberParam("Absolute X", "An absolute X position relative the Construct 2 canvas to use for projection (you can use mouse.AbsoluteX for example)" , initial_string = "0");
AddNumberParam("Absolute Y", "An absolute Y position relative the Construct 2 canvas to use for projection (you can use mouse.AbsoluteY for example)" , initial_string = "0");
AddNumberParam("Step", "Step size to use for moving forward the projected ray forward, smaller values are more precise but more CPU intensive" , initial_string = "10");
AddNumberParam("Min Distance", "Min distance to move without triggering a result" , initial_string = "0");
AddNumberParam("Max Distance", "Max distance allowable to step the ray forward before terminating condition without results" , initial_string = "1000");
AddCondition(3, cf_looping, "Project, Loop all", "Projection", "Loop picked {0} by intersecting projected ray.", "Project absolute coordinates (e.g. mouse.AbsoluteX,AbsoluteY) into the viewport, looping through the objects a test ray intersects of a specified type from closest to furthest, generates info about contact that can be retrieved from expressions", "LoopByProjection");


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
AddComboParamOption("Invisible")
AddComboParamOption("Visible")	
AddComboParam("Visibility", "Choose whether the viewport is hidden or shown")
AddAction(0, af_none, "Set visible", "Appearance", "Set {0}", "Set whether or not the Q3D viewport is visible/rendered", "SetVisible");

AddStringParam("Scene name", "Name of the scene to use when rendering this viewport" , initial_string = "\"Default\"")
AddAction(1, af_none, "Set scene", "Rendering", "Set scene to <i>{0}</i>", "Set the scene to render in viewport.", "SetScene");

AddStringParam("Camera name", "Name of the camera to use when rendering scene in this viewport" , initial_string = "\"Default\"")
AddAction(2, af_none, "Set camera", "Rendering", "Set camera to <i>{0}</i>", "Set the camera to render scene from in viewport.", "SetCamera");

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
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");

AddExpression(0, ef_return_string, "Scene name", "Rendering", "scene", "Return the name of this viewport's associated scene.");

AddExpression(1, ef_return_string, "Camera name", "Rendering", "camera", "Return the name of this viewport's associated camera.");


AddExpression(2, ef_return_number, "Get ray X origin", "Projection", "rOx", "Return the origin x position of the cast ray from a Projection condition.");

AddExpression(3, ef_return_number, "Get ray Y origin", "Projection", "rOy", "Return the origin y position of the cast ray from a Projection condition.");

AddExpression(4, ef_return_number, "Get ray Z origin", "Projection", "rOz", "Return the origin z position of the cast ray from a Projection condition.");


AddExpression(5, ef_return_number, "Get ray X direction", "Projection", "rDx", "Return the x direction of the cast ray from a Projection condition.");

AddExpression(6, ef_return_number, "Get ray Y direction", "Projection", "rDy", "Return the y direction of the cast ray from a Projection condition.");

AddExpression(7, ef_return_number, "Get ray Z direction", "Projection", "rDz", "Return the z direction of the cast ray from a Projection condition.");


AddExpression(8, ef_return_number, "Get number of intersections", "Projection", "rLoopLength", "Return the total number of intersections (similar to looplength) from a Projection loop condition.");


AddExpression(9, ef_return_number, "Get distance to current object", "Projection", "rDist", "Return the distance of the current intersection from the rays origin in a Projection condition.");


AddExpression(10, ef_return_number, "Get intersection X position", "Projection", "rPx", "Return the x position of the current intersection with the ray in a Projection condition.");

AddExpression(11, ef_return_number, "Get intersection Y position", "Projection", "rPy", "Return the y position of the current intersection with the ray in a Projection condition.");

AddExpression(12, ef_return_number, "Get intersection Z position", "Projection", "rPz", "Return the z position of the current intersection with the ray in a Projection condition.");


AddExpression(13, ef_return_number, "Get intersection index", "Projection", "rLoopIndex", "Return the current 0 based index of the intersection (similar to loopindex) from a Projection loop condition, index of 0 is closest intersection.");


AddExpression(14, ef_return_number, "Get face normal X", "Projection", "rNx", "Return the normal x component of the face the ray is intersecting in Projection condition.");

AddExpression(15, ef_return_number, "Get face normal Y", "Projection", "rNy", "Return the normal y component of the face the ray is intersecting in Projection condition.");

AddExpression(16, ef_return_number, "Get face normal Z", "Projection", "rNz", "Return the normal z component of the face the ray is intersecting in Projection condition.");

AddExpression(17, ef_return_number, "Get face material index", "Projection", "rMatIndex", "Return the material index of the current face, useful if you're using a model that has multiple materials.");

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
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the viewport is visible or not when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_combo,	"Hotspot",				"Top-left",	"Choose the location of the hot spot for the viewport", "Top-left|Top|Top-right|Left|Center|Right|Bottom-left|Bottom|Bottom-right"),
	new cr.Property(ept_text,	"Scene",	"Default",	"Choose which scene (by name) the viewport is set to render from."),
	new cr.Property(ept_text,	"Camera",	"Default",	"Choose which camera (by name) the viewport is set to render from.")
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
		// Properties for font
	
	this.font_str = "Arial,-16";		// default font string
	this.old_font_str = "Test";				// last font string, in case not changed
	this.recreate_font = true;			// font not yet created
	this.font = null;					// handle to font in IDE
	
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnCreate = function()
{

	switch (this.properties["Hotspot"])
	{
    case "Top-left" :
      this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
    case "Top" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
    case "Top-right" :
      this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
    case "Left" :
      this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
    case "Center" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
    case "Right" :
      this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
    case "Bottom-left" :
      this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
    case "Bottom" :
      this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
    case "Bottom-right" :
		  this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
	}
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	//this.instance.SetPosition(new cr.vector2(0, 0));
	this.instance.SetSize(new cr.vector2(427, 240));
};

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
  if (property_name === "Hotspot")
	{
        switch (this.properties["Hotspot"])
        {
          case "Top-left" :
            this.instance.SetHotspot(new cr.vector2(0, 0));
          break;
          case "Top" :
            this.instance.SetHotspot(new cr.vector2(0.5, 0));
          break;
          case "Top-right" :
            this.instance.SetHotspot(new cr.vector2(1, 0));
          break;
          case "Left" :
            this.instance.SetHotspot(new cr.vector2(0, 0.5));
          break;
          case "Center" :
            this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
          break;
          case "Right" :
            this.instance.SetHotspot(new cr.vector2(1, 0.5));
          break;
          case "Bottom-left" :
            this.instance.SetHotspot(new cr.vector2(0, 1));
          break;
          case "Bottom" :
            this.instance.SetHotspot(new cr.vector2(0.5, 1));
          break;
          case "Bottom-right" :
            this.instance.SetHotspot(new cr.vector2(1, 1));
          break;
        }
    }

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

IDEInstance.prototype.RecreateFont = function(renderer)
{
	// The font hasn't really changed: don't actually recreate
	if (this.font_str == this.old_font_str)
	{
		this.recreate_font = false;
		return;
	}
		
	var had_font = false;
	
	// Release any existing font first
	if (this.font != null)
	{
		renderer.ReleaseFont(this.font);
		had_font = true;
	}
	
	// Parse the font details out of the font string
	var font_info = cr.ParseFontString(this.font_str);
	
	// Attempt to create the font as requested
	this.font = renderer.CreateFont(font_info.face_name, font_info.face_size, font_info.bold, font_info.italic);
	
	// Creating the font failed: fall back to arial
	if (this.font == null)
	{
		this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
		
		// Notify the user if the font has been changed via the property grid.  Don't notify
		// if this error happens just loading a layout.
		if (had_font)
		{
			BalloonTipLastProperty("Font not supported",
								   "The font you chose does not appear to be supported by Construct 2, for technical reasons.  "
								   + "The object has fallen back to 'Arial'.  Click the help link for more information.",
								   bti_warning);
		}
	}
	else if (!this.font.exact_match && had_font)
	{
		// The font was not an exact match.  Notify the user, but only when the font was changed,
		// don't display this when loading a layout.
		BalloonTipLastProperty("Font variation not supported",
							   "The exact font you chose does not appear to be supported by Construct 2, for technical reasons.  "
							   + "The object has fallen back to a different variation of the chosen font.  Click the help link for more information.",
							   bti_warning);
	}
	
	assert2(this.font != null, "Failed to create font or default Arial font");
		
	// Font has been created
	this.recreate_font = false;
	this.old_font_str = this.font_str;
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
    var q=this.instance.GetBoundingQuad();
	//renderer.SetTexture(this.instance.GetTexture()); // hack for white texture so i can use opacity/// might be buggy

	//renderer.Quad(q , 0.75)
	renderer.Fill(q, cr.RGB(245,245,245));
	
	//p=this.instance.GetBoundingQuad(); //add fancy shine for fun?
	var p = new cr.quad;
	var t = 0.2//cr.clamp(((q.tlx+q.tly)%(q.trx-q.tlx+q.bly-q.tly))/(q.trx-q.tlx+q.bly-q.tly), 0, 1)
	var t2 = 0.4//cr.clamp(((q.tlx+q.tly+(q.trx-q.tlx+q.bly-q.tly)*0.3)%(q.trx-q.tlx+q.bly-q.tly+(q.trx-q.tlx+q.bly-q.tly)*0.3))/(q.trx-q.tlx+q.bly-q.tly+(q.trx-q.tlx+q.bly-q.tly)*0.3), 0, 1)
	p.trx = q.tlx+(q.trx-q.tlx)*t
	p.try_ = q.try_

	
	p.tlx =  q.tlx+(q.trx-q.tlx)*t2
	p.tly = q.tly
	
	p.blx = q.blx
	p.bly = q.bly+(q.tly-q.bly)*t

	p.brx = q.blx
	p.bry = q.bly+(q.tly-q.bly)*t2
	
	renderer.Fill(p, cr.RGB(255,255,255));
	
	// If the font is not yet created or needs recreating, recreate it
	if (this.font == null || this.recreate_font)
		this.RecreateFont(renderer);
		
	// If there is a font present, draw it
	if (this.font != null)
	{
		
		this.font.DrawText("Scene : "+this.properties["Scene"]+"\n"+"Camera : "+this.properties["Camera"],
								this.instance.GetBoundingQuad(),
								cr.RGB(0,0,0),
								ha_center,
								1,
								0,
								false,
								0,
								ha_center);
	}
	
	
	renderer.Outline(q, cr.RGB(0,0,0));
	q.tlx+=2;
	q.tly+=2;
	q.trx+=-2;
	q.try_+=2;
	q.blx+=2;
	q.bly+=-2;
	q.brx+=-2;
	q.bry+=-2;
	renderer.Outline(q, cr.RGB(0,0,0));
	
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}