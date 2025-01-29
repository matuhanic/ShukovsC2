function GetPluginSettings()
{
	return {
		"name":			"Q3D\nSprite",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Q3Dsprite",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"2.4",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Creates a '3D' sprite billboard which properly integrates with Q3D Master (exists within the 3D scene, rather than in the C2 layer)",
		"author":		"Quazi",
		"help url":		"http://threejs.org/",
		"category":		"Q3D",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
						| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
						| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
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

AddCmpParam("Comparison", "How to compare the sprite 'width'.")
AddNumberParam("Width", "The width to compare to." , initial_string = "0")
AddCondition(2000, cf_none, "Compare width", "Sprite size", "Graphic width {0} {1}", "Compare the graphic width of the 2D sprite being shown", "CompareWidth");

AddCmpParam("Comparison", "How to compare the sprite 'height'.")
AddNumberParam("Height", "The height to compare to." , initial_string = "0")
AddCondition(2001, cf_none, "Compare height", "Sprite size", "Graphic height {0} {1}", "Compare the graphic height of the 2D sprite being shown", "CompareHeight");

AddNumberParam("Within", "Number of degrees the angle must be within." , initial_string = "0.5")
AddNumberParam("Angle", "The angle, in degrees, to compare if the sprite is facing towards." , initial_string = "0")
AddCondition(2002, cf_none, "Is within angle", "Sprite angle", "Graphic within {0} degrees of {1}", "Compare if the sprite graphic angle is within X degrees of another angle", "AngleWithin");

AddNumberParam("Angle", "The angle, in degrees, to compare if the sprite is clockwise from." , initial_string = "0")
AddCondition(2003, cf_none, "Is clockwise from", "Sprite angle", "Graphic is clockwise from {0}", "Compare if the sprite graphic angle is clockwise of another angle", "IsClockwiseFrom");

AddNumberParam("First angle", "First angle, in degrees. specify in clockwise order." , initial_string = "0")
AddNumberParam("Second angle", "Second angle, in degrees. specify in clockwise order." , initial_string = "45")
AddCondition(2004, cf_none, "Is between angles", "Sprite angle", "Graphic is between {0} and {45} degrees", "Compare if the sprite graphic angle is between two angles", "IsBetweenAngles");

//////////////////////////////

AddAnimationParam("Animation", "Enter the name of the animation to check if playing.")
AddCondition(2005, 0, "Is playing", "Animations", "Is animation {0} playing", "Test which of the graphic's animations is currently playing.", "IsAnimPlaying");

AddCmpParam("Comparison", "How to compare the current animation frame number (0-based).");
AddNumberParam("Number", "The animation frame number to compare to (0-based).");
AddCondition(2006, 0, "Compare frame", "Animations", "Animation frame {0} {1}", "Test which animation frame is currently showing.", "CompareFrame");

AddAnimationParam("Animation", "Enter the name of the animation that has finished.")
AddCondition(2007, cf_trigger, "On finished", "Animations", "On animation {0} finished", "Triggered when an animation has finished.", "OnAnimFinished");

AddCondition(2008, cf_trigger, "On any finished", "Animations", "On any animation finished", "Triggered when any animation has finished.", "OnAnyAnimFinished");

AddCondition(2009, cf_trigger, "On frame changed", "Animations", "On frame changed", "Triggered when the current animation frame changes.", "OnFrameChanged");

AddCondition(2010, 0, "Is mirrored", "Sprite angle", "Is graphic mirrored", "True if the graphic has been mirrored with the 'Set Mirrored' action.", "IsMirrored");

AddCondition(2011, 0, "Is flipped", "Sprite angle", "Is graphic flipped", "True if the graphic has been flipped with the 'Set Flipped' action.", "IsFlipped");

AddCondition(2012, cf_trigger, "On image URL loaded", "Web", "On image URL loaded", "Triggered after 'Load image from URL' when the image has finished loading.", "OnURLLoaded");

AddCmpParam("Comparison", "How to compare the current animation speed.");
AddNumberParam("Number", "The animation speed to compare to.");
AddCondition(2013, 0, "Compare speed", "Animations", "Animation speed {0} {1}", "Compare the current animation speed.", "CompareAnimSpeed");

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				


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

AddNumberParam("Width", "New graphic width." , initial_string = "0")
AddAction(2000, cf_none, "Set width", "Sprite size", "Set sprite graphic width to <i>{0}</i>", "Set the width of the sprite graphic", "SetWidth");

AddNumberParam("Height", "New graphic height." , initial_string = "0")
AddAction(2001, cf_none, "Set height", "Sprite size", "Set sprite graphic height to <i>{0}</i>", "Set the height of the sprite graphic", "SetHeight");

AddNumberParam("Width", "New graphic width." , initial_string = "0")
AddNumberParam("Height", "New graphic height." , initial_string = "0")
AddAction(2002, cf_none, "Set size", "Sprite size", "Set sprite graphic size to <i>({0}, {1})</i>", "Set the width and height of the sprite graphic", "SetSize");

AddNumberParam("Angle", "New graphic angle, in degrees." , initial_string = "0")
AddAction(2003, cf_none, "Set angle", "Sprite angle", "Set sprite graphic angle to <i>{0}</i> degrees", "Set the angle of the sprite graphic", "SetAngle");

AddNumberParam("Degrees", "Amount to rotate towards target angle, in degrees." , initial_string = "0")
AddNumberParam("Angle", "Angle to rotate towards, in degrees." , initial_string = "0")
AddAction(2004, cf_none, "Rotate toward angle", "Sprite angle", "Rotate sprite graphic angle by <i>{0}</i> degrees towards <i>{1}</i> ", "Rotate the sprite graphic angle towards another angle by a set amount", "RotateTowardAngle");

/////////////////////////////////////////////////////

AddAction(2005, 0, "Stop",		"Animations",	"Stop animation",	"Stop the current animation from playing.", "StopAnim");

AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to resume or rewind the animation back to the first frame.");
AddAction(2006, 0, "Start",	"Animations",	"Start animation from {0}",	"Start the current animation, if it was stopped.", "StartAnim");

AddAnimationParam("Animation", "The name of the animation to set.");
AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to play from the same frame number or rewind the animation back to the first frame.", 1);
AddAction(2007, 0, "Set animation", "Animations", "Set animation to <b>{0}</b> (play from {1})", "Set the current animation", "SetAnim");

AddNumberParam("Frame number", "The animation frame number to set (0-based).");
AddAction(2008, 0, "Set frame", "Animations", "Set animation frame to <b>{0}</b>", "Set the current animation frame number.", "SetAnimFrame");

AddNumberParam("Speed", "The new animation speed, in animation frames per second.");
AddAction(2009, 0, "Set speed", "Animations", "Set animation speed to <b>{0}</b>", "Set the current animation speed.", "SetAnimSpeed");

AddComboParamOption("Mirrored");
AddComboParamOption("Not mirrored");
AddComboParam("State", "Choose whether to horizontally mirror the graphic or set it back to normal.");
AddAction(2010, 0, "Set mirrored", "Sprite angle", "Set graphic <b>{0}</b>", "Set the graphic horizontally mirrored or back to normal.", "SetMirrored");

AddComboParamOption("Flipped");
AddComboParamOption("Not flipped");
AddComboParam("State", "Choose whether to vertically flip the graphic or set it back to normal.");
AddAction(2011, 0, "Set flipped", "Sprite angle", "Set graphic <b>{0}</b>", "Set the graphic vertically flipped or back to normal.", "SetFlipped");

AddNumberParam("Scale", "The graphic width and height to set, based on a multiple of its original dimensions, e.g. 1 = original size, 2 = double size, 0.5 = half size etc.", "1");
AddAction(2012, 0, "Set scale", "Sprite size", "Set graphic scale to <i>{0}</i>", "Set the width and height of the graphic as a multiple of its original size.", "SetScale");

AddStringParam("URI", "Enter the URL on the web, or data URI, of an image to load.", "\"http://\"");
AddComboParamOption("Resize to image size");
AddComboParamOption("Keep current size");
AddComboParam("Size", "Whether to resize the sprite to the size of the loaded image, or stretch it to the current size.");
AddAction(2013, 0, "Load image from URL", "Web", "Load image from <i>{0}</i> ({1})", "Replace the currently displaying animation frame with an image loaded from a web address or data URI.", "LoadURL");

//////////////////////////////////////////////// material

/*AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Transparency", "Choose whether the sprite material has transparency layering on/off.", initial_string = "0");*/
AddNumberParam("Opacity", "Opacity of the material if transparency is on ( value from 0 to 1 )", initial_string = "1")
AddAction(83, af_none, "Set opacity", "Material", "Set material opacity to ({0})", "Set the opacity of the sprite material", "MaterialsSetOpacity"); ////////////////////// LAST THING WORKED ON

AddComboParamOption("No Blending");
AddComboParamOption("Normal Blending");
AddComboParamOption("Additive Blending");
AddComboParamOption("Subtractive Blending");
AddComboParamOption("Multiply Blending");
AddComboParamOption("Custom Blending");
AddComboParam("Blend Mode", "Choose the blend mode of the material, the properties below control custom blending if is set", initial_string = "1");
AddComboParamOption("Source Alpha Factor");
AddComboParamOption("1 - Source Alpha Factor");
AddComboParamOption("Destination Alpha Factor");
AddComboParamOption("1 - Destination Alpha Factor");
AddComboParamOption("0 Factor");
AddComboParamOption("1 Factor");
AddComboParamOption("Destination Color Factor");
AddComboParamOption("1 - Destination Color Factor");
AddComboParamOption("Source Alpha Saturate Factor");
AddComboParam("C.Blend Source", "Choose the blend source of the material if custom blending", initial_string = "0");
AddComboParamOption("Source Alpha Factor");
AddComboParamOption("1 - Source Alpha Factor");
AddComboParamOption("Destination Alpha Factor");
AddComboParamOption("1 - Destination Alpha Factor");
AddComboParamOption("0 Factor");
AddComboParamOption("1 Factor");
AddComboParamOption("Source Color Factor");
AddComboParamOption("1 - Source Color Factor");
AddComboParam("C.Blend Destination", "Choose the blend destination of the material if custom blending", initial_string = "1");
AddComboParamOption("Add Equation");
AddComboParamOption("Subtract Equation");
AddComboParamOption("Reverse Subtract Equation");
AddComboParam("C.Blend Equation", "Choose the blend equation of the material if custom blending", initial_string = "0");
AddAction(84, af_none, "Blending", "Material", "Set material blending mode to <b>{0}</b>", "Set the blending mode of the material, Transparency must be enabled or no blending occurs in some cases", "MaterialsSetBlending");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Test", "Choose whether this material has depth testing on/off when being rendered", initial_string = "1");
AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Depth Write", "Choose whether this material has any effect on the depth buffer", initial_string = "1");
AddAction(85, af_none, "Depth settings", "Material", "<b>MATERIALS</b> Set material depth testing {0} and depth writing {1}", "Set the the depth testing and depth writing properties of the material", "MaterialsDepthSettings");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Polygon offset", "Choose whether this material has polygon offset enabled", initial_string = "0");
AddNumberParam("Offset factor", "If polygon offset is enabled, the offset factor controlling it", initial_string = "0")
AddNumberParam("Offset units", "If polygon offset is enabled, the offset units controlling it", initial_string = "0")
AddAction(86, af_none, "Polygon offset", "Material", "Set material polygon offset {0} with factor {1} and units {2}", "Set the polygon offset of the material, helps prevent z-fighting if its a problem", "MaterialsPolygonOffset");

//doesnt really work with sprites does it
AddComboParamOption("Front");
AddComboParamOption("Back");
AddComboParamOption("Front & Back");
AddComboParam("Side", "Choose which side of geometry this material renders (based on normals)", initial_string = "0");
AddAction(90, af_deprecated, "Set draw side", "Material", "Set material draw side to {0}", "Control which side of the geometry a material renders", "MaterialsDrawSide");

AddNumberParam("Color", "Color of this material (uses 'hex' color notation)", initial_string = "rgb(255,255,255)")
AddAction(93, af_none, "Set color diffuse", "Material", "Set material color to {0}", "Set the diffuse color of the sprite material", "MaterialsSetColor");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Fog", "Choose whether this material is affected by global fog settings", initial_string = "1")
AddAction(97, af_none, "Set fog", "Material", "Set material fog effects {0}", "Set whether the material is affected by global fog settings, if it has the property", "MaterialsSetFog");

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

AddExpression(2000, ef_return_number, "", "Sprite Graphic", "Angle", "Return the sprite graphic's angle");

AddExpression(2001, ef_return_number, "", "Sprite Graphic", "Height", "Return the sprite graphic's height");

AddExpression(2002, ef_return_number, "", "Sprite Graphic", "Width", "Return the sprite graphic's width");

/////////////////////////////////

AddExpression(2003, ef_return_number, "Get animation frame", "Animations", "AnimationFrame", "The current animation frame number (0-based).");

AddExpression(2004, ef_return_number, "Get animation frame count", "Animations", "AnimationFrameCount", "The number of animation frames in the current animation.");

AddExpression(2005, ef_return_string, "Get animation name", "Animations", "AnimationName", "The name of the current animation.");

AddExpression(2006, ef_return_number, "Get animation speed", "Animations", "AnimationSpeed", "The speed of the current animation, in animation frames per second.");

AddExpression(2007, ef_return_number, "Get image width", "Animations", "ImageWidth", "The width of the current animation frame image, in pixels.");

AddExpression(2008, ef_return_number, "Get image height", "Animations", "ImageHeight", "The height of the current animation frame image, in pixels.");

////////////////////////////////////////

AddExpression(35, ef_return_number, "Polygon offset factor", "Material", "pOffsetFactor", "Return the polygon offset factor of the current material");

AddExpression(36, ef_return_number, "Polygon offset units", "Material", "pOffsetUnits", "Return the polygon offset units of the current material");

AddExpression(40, ef_return_number, "Diffuse color", "Material", "Diffuse", "Return the hex value diffuse color of the current material");

AddExpression(45, ef_return_number, "Opacity", "Material", "Opacity", "Return the opacity value of the current material (0 to 1 based rather than 0 to 100)");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////					EDITTIME COMMON ACE								  //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

populateCommonACE();

/////////////////////////////////////////
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
	
	new cr.Property(ept_section, "General Properties", "",	"General properties affecting things like initial position, scale, rotation, and visibility."),
		new cr.Property(ept_combo,	"Initial Visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
		new cr.Property(ept_float, 	"Z Position",		0,		"Z position of the 3D object, positive direction goes 'into' the screen"),
		new cr.Property(ept_text, 	"Rotation Order",		"ZYX",		"Euler angles rotation order."),
		new cr.Property(ept_float, 	"Rotation X",		0,		"Rotation amount around the local object X axis (red) in degrees (roll)"),
		new cr.Property(ept_float, 	"Rotation Y",		0,		"Rotation amount around the local object Y axis (green) in degrees (pitch)"),
		new cr.Property(ept_float, 	"Rotation Z",		0,		"Rotation amount around the local object Z axis (blue) in degrees (pitch)"),
		new cr.Property(ept_float, 	"X Size",		1,		"X Scaling of the 3D object"),
		new cr.Property(ept_float, 	"Y Size",		1,		"Y Scaling of the 3D object"),
		new cr.Property(ept_float, 	"Z Size",		1,		"Z Scaling of the 3D object"),
	
	new cr.Property(ept_section, "Debug properties", "",	"Properties to help with debugging the 3D object in the editor and at runtime."),
		new cr.Property(ept_combo, 	"B.Box Debug",		"On",		"Show the bounding box and axis helper at runtime","On|Off"),
		
	new cr.Property(ept_section, "Material properties", "",	"Properties affecting the look of the sprite."),
		new cr.Property(ept_color, 	"Color",		0xFFFFFF,		"Diffuse color of the sprite"),
		new cr.Property(ept_float, 	"Opacity",		1,		"Value between 0 and 1, which sets the opacity of the sprite"),
		
	new cr.Property(ept_section, "Sprite properties", "",	"Properties related to the sprite / animations, similar to those for regular C2 sprites."),
		new cr.Property(ept_link,	"Animations",			lang("project\\misc\\sprite-edit-link"), "Click to edit the object's animations.", "firstonly"),
		new cr.Property(ept_link,	"Size",					lang("project\\misc\\sprite-make11-link"), "Click to set the object to the same size as its image.", "worldundo"),
		new cr.Property(ept_text,	"Initial animation",	"Default",	"The initial animation showing."),
		new cr.Property(ept_integer,"Initial frame",		0,			"The initial animation frame showing."),		
	
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
	this.texture_loaded = false;
	this.last_imgsize = new cr.vector2(0, 0);
	this.last_texture = null;
	this.last_texture_id = "";
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(100, 100));
	
	this.just_inserted = true;
	
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}


// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{

	// Edit animations link
	if (property_name == "Animations")
	{
		this.instance.EditTexture();
	}
	// Make 1:1 link
	else if (property_name == "Size")
	{
		if (this.texture_loaded)
			this.just_inserted = true;		// will scale to texture size when redrawn and update property grid
		else
		{
			// The object could be resized, but we can't refresh the property grid here.
			// Just assume the layout is always open, and prompt if not.
			alert("The object cannot be scaled to original size unless the layout containing it is open.");
		}
	}

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
	this.last_texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.last_texture_id = this.last_texture.GetID();
	
	renderer.LoadTexture(this.last_texture);
	this.texture_loaded = true;
	
	this.instance.SetHotspot(this.last_texture.GetHotspot());
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{

	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	var texture_id = texture.GetID();
	
	if (this.last_texture_id !== "" && this.last_texture_id !== texture_id)
	{
		// Texture has changed: unload old and reload new.
		if (this.last_texture)
			renderer.ReleaseTexture(this.last_texture);
			
		renderer.LoadTexture(texture);
		this.instance.SetHotspot(texture.GetHotspot());
	}
	
	this.last_texture = texture;
	this.last_texture_id = texture_id;
	
	renderer.SetTexture(texture);
	
	var imgsize = texture.GetImageSize();
	
	// First draw after insert: use size of texture.
	// Done after SetTexture so the file is loaded and dimensions known, preventing
	// the file being loaded twice.
	if (this.just_inserted)
	{
		this.just_inserted = false;
		this.instance.SetSize(imgsize);
		
		RefreshPropertyGrid();		// show new size
	}
	// If not just inserted and the sprite texture has been edited and changed size, scale the texture accordingly.
	else if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
		&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
	{
		var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
		var instsize = this.instance.GetSize();
		
		sz.mul(instsize.x, instsize.y);
		this.instance.SetSize(sz);
		this.instance.SetHotspot(texture.GetHotspot());
		
		RefreshPropertyGrid();		// show new size
	}

	this.last_imgsize = imgsize;
	
	if (renderer.SupportsFullSmoothEdges())
	{
		// Get the object size and texture size
		var objsize = this.instance.GetSize();
		var texsize = texture.GetImageSize();
		
		// Calculate pixels per texel, then get a quad padded with a texel padding
		var pxtex = new cr.vector2(objsize.x / texsize.x, objsize.y / texsize.y);
		var q = this.instance.GetBoundingQuad(new cr.vector2(pxtex.x, pxtex.y));
		
		// Calculate the size of a texel in texture coordinates, then calculate texture coordinates
		// for the texel padded quad
		var tex = new cr.vector2(1.0 / texsize.x, 1.0 / texsize.y);
		var uv = new cr.rect(-tex.x, -tex.y, 1.0 + tex.x, 1.0 + tex.y);
		
		// Render a quad with a half-texel padding for smooth edges
		renderer.Quad(q, this.instance.GetOpacity(), uv);
	}
	else
	{
		// Fall back to half-smoothed or jagged edges, depending on what the renderer supports
		renderer.Quad(this.instance.GetBoundingQuad(), this.properties["Opacity"]);
	};

	/////////////////////////////////////////////// 3D drawing

	//var q= this.instance.GetSize();
	q= new cr.vector2( this.properties["X Size"], this.properties["Y Size"]);
	var quad = this.instance.GetBoundingQuad();
	
	var xpos = (quad.tlx+quad.trx+quad.blx+quad.brx)/4;
	var ypos = (quad.tly+quad.try_+quad.bly+quad.bry)/4;  // i don't know how to get the position of the object... its not in the sdk
	
	var xtemp;
	var ytemp;
	var ztemp;
	
	var zsize = this.properties["Z Size"];
	var zpos = this.properties["Z Position"];
	
	var xrot = this.properties["Rotation X"]*(Math.PI/180);
	var yrot = this.properties["Rotation Y"]*(Math.PI/180);
	var zrot = this.properties["Rotation Z"]*(Math.PI/180);//cr.angleTo(quad.tlx, quad.tly, quad.trx, quad.try_);  //this.properties["Rotation Z"]*(Math.PI/180);this.instance.getAngle()*(Math.PI/180); // get angle seems to be new, not gonna use it.
	
	var rcos;
	var rsin;
	
	var verts = [];
	var faces = [];
	
	var hsegs = 6;
	var csegs = 12;
	

	var maxExtent = Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(zsize));
	
	var XmaxExtent = 0;
	var YmaxExtent = 0;
	
	//var outlineCol = cr.RGB(0,0,0);
	
	// Make debug object
	
		//var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
		//var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
		
		//var verts = [[q.x/-2,0,0],[0,0,zsize/-2],[q.x/2,0,0],[0,0,zsize/2],[0,q.y/-2,0],[0,q.y/2,0]];
		//var faces = [[0,1,2,3],[1,5,3,4],[2,5,0,4]];
		//var faces = [[0,5,3,3],[3,5,2,2],[2,5,1,1],[1,5,0,0],[0,3,4,4],[3,2,4,4],[2,1,4,4],[1,0,4,4]];

	var verts = [[q.x/2,q.y/2,zsize/2],[q.x/-2,q.y/2,zsize/2],[q.x/-2,q.y/-2,zsize/2],[q.x/2,q.y/-2,zsize/2]   ,   [q.x/2,q.y/2,zsize/-2],[q.x/-2,q.y/2,zsize/-2],[q.x/-2,q.y/-2,zsize/-2],[q.x/2,q.y/-2,zsize/-2]]; // list of vertices of object
	var faces = [[3,2,1,0],[4,5,6,7],[5,4,0,1],[3,0,4,7],[2,6,5,1],[2,3,7,6]];
		
	/*faces[0][5] = cr.RGB(200,200,255);
	faces[1][5] = cr.RGB(200,200,255);
	faces[2][5] = cr.RGB(200,255,200);
	faces[5][5] = cr.RGB(200,255,200);
	faces[3][5] = cr.RGB(255,200,200);
	faces[4][5] = cr.RGB(255,200,200);*/
	
	var mtx = [[1,0,0],[0,1,0],[0,0,1]]; // initial matrix
	
	//alert(mtx[0][0]);
	
	//var mtxt = [[],[],[]]; // temp matrix?
	var xsto;
	var ysto;
	//var zsto;
	
	var rotfunc = function(c){
		if(c==="X"){
			
			// X rotation
		
			rcos = Math.cos(xrot);
			rsin = Math.sin(xrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
			
			mtx[i][1] = xsto;
			mtx[i][2] = ysto;
			
			};
		};
		
		if(c==="Y"){
			
			// Y rotation
		
			rcos = Math.cos(yrot*-1); // needs this to work properly with rotations in actual runtime
			rsin = Math.sin(yrot*-1);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][2] = ysto;
		
			};
		};
		
		if(c==="Z"){
				
			// Z rotation
		
			rcos = Math.cos(zrot);
			rsin = Math.sin(zrot);
			
			for (var i = 0; i <= 2 ; i++) { 
			
			xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
			ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
			
			mtx[i][0] = xsto;
			mtx[i][1] = ysto;
			
			};
		};
	};
	
	/*// XYZ order rotation? calculate transform matrix about origin then shift by position
	
		// X rotation
	
		rcos = Math.cos(xrot);
		rsin = Math.sin(xrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][1]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][1]*rsin + mtx[i][2]*rcos
		
		mtx[i][1] = xsto;
		mtx[i][2] = ysto;
		
		};
	
		// Y rotation
	
		rcos = Math.cos(yrot);
		rsin = Math.sin(yrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][2]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][2]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][2] = ysto;
		
		};
		
		// Z rotation
	
		rcos = Math.cos(zrot);
		rsin = Math.sin(zrot);
		
		for (var i = 0; i <= 2 ; i++) { 
		
		xsto = mtx[i][0]*rcos - mtx[i][1]*rsin
		ysto = mtx[i][0]*rsin + mtx[i][1]*rcos
		
		mtx[i][0] = xsto;
		mtx[i][1] = ysto;
		
		};
		
	/////////////////////////////////////////*/
	
	rotfunc(this.properties["Rotation Order"].charAt(2));
	rotfunc(this.properties["Rotation Order"].charAt(1));
	rotfunc(this.properties["Rotation Order"].charAt(0));
	
	/////////////////////////////////////////

	//renderer.Outline(quad, cr.RGB(128,128,128));
	
	for (var i = 0; i < verts.length ; i++) { 
	
	xsto = verts[i][0]*mtx[0][0]+verts[i][1]*mtx[1][0]+verts[i][2]*mtx[2][0]
	ysto = verts[i][0]*mtx[0][1]+verts[i][1]*mtx[1][1]+verts[i][2]*mtx[2][1]
	
	XmaxExtent = Math.max(XmaxExtent,xsto);
	YmaxExtent = Math.max(YmaxExtent,ysto);
	
	verts[i][2] = verts[i][0]*mtx[0][2]+verts[i][1]*mtx[1][2]+verts[i][2]*mtx[2][2]+zpos;
	verts[i][0] = xsto+xpos;
	verts[i][1] = ysto+ypos;
	
	};
	
	//draw circle
	
	xsto = new cr.vector2(20,0);
	ysto = new cr.vector2(20,0);

	rcos = Math.cos((Math.PI/4.5))
	rsin = Math.sin((Math.PI/4.5))
	
	for (var i = 0; i < 9 ; i++) {
	
	xsto.x = ysto.x*rcos - ysto.y*rsin;
	xsto.y = ysto.x*rsin + ysto.y*rcos;
	
	renderer.Line(new cr.vector2(xpos+xsto.x,ypos+xsto.y), new cr.vector2(xpos+ysto.x,ypos+ysto.y), this.properties['Color']);
	
	ysto = new cr.vector2(xsto.x,xsto.y);
		
	};
	
	renderer.Outline(quad, this.properties['Color']);
	
	//Project everything (LOOKS CONFUSING IN WIREFRAME)
	/*
	for (var i = 0; i <= 7 ; i++) {
	
	verts[i][0] += verts[i][2]*0.1
	verts[i][1] += verts[i][2]*0.1
	
	};
	
	for (var i = 0; i <= 2 ; i++) {
	
	mtx[i][0] += mtx[i][2]*0.1
	mtx[i][1] += mtx[i][2]*0.1
	
	};
	
	xpos += zpos*0.1;
	ypos += zpos*0.1;
	*/
	
	
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[1][0])*50,ypos+(mtx[1][1])*50), mtx[1][3]);
	//renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[2][0])*50,ypos+(mtx[2][1])*50), mtx[2][3]);
	
	// Draw/Sort Faces for colliders
	
	for (var k = 0; k < faces.length ; k++) {
	
	faces[k][4] = [0,0,0];
	faces[k][6] = [0,0,0];
	
	faces[k][6][0] = (verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2])-(verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1]);
	faces[k][6][1] = (verts[ faces[k][0] ][2]-verts[ faces[k][1] ][2])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0])-(verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][2]-verts[ faces[k][1] ][2]);
	faces[k][6][2] = (verts[ faces[k][0] ][0]-verts[ faces[k][1] ][0])*(verts[ faces[k][3] ][1]-verts[ faces[k][1] ][1])-(verts[ faces[k][0] ][1]-verts[ faces[k][1] ][1])*(verts[ faces[k][3] ][0]-verts[ faces[k][1] ][0]);//calculate normal z to determine which direction its facing
	//faces[k][5] = cr.RGB(100+(k/5)*100,100+(k/5)*100,100+(k/5)*100);
	
	//faces[k][4][0] = (verts[ faces[k][0] ][0]+verts[ faces[k][1] ][0]+verts[ faces[k][2] ][0]+verts[ faces[k][3] ][0])/4;
	//faces[k][4][1] = (verts[ faces[k][0] ][1]+verts[ faces[k][1] ][1]+verts[ faces[k][2] ][1]+verts[ faces[k][3] ][1])/4;
	faces[k][4][2] = (verts[ faces[k][0] ][2]+verts[ faces[k][1] ][2]+verts[ faces[k][2] ][2]+verts[ faces[k][3] ][2])/4;
	
	};
	
	faces.sort(function(a, b){ return a[4][2]-b[4][2]});
	
	var fq = new cr.quad;
	var light = [1,1,1];
	ztemp = 1/Math.sqrt(light[0]*light[0]+light[1]*light[1]+light[2]*light[2]);
	light = [light[0]*ztemp,light[1]*ztemp,light[2]*ztemp];
	
	for (var k = 0; k < faces.length ; k++) {
	
	if(faces[k][6][2]<0){
	
	fq.tlx = verts[faces[k][0]][0]
	fq.tly = verts[faces[k][0]][1]
	
	fq.trx = verts[faces[k][1]][0]
	fq.try_ = verts[faces[k][1]][1]
	
	fq.brx = verts[faces[k][2]][0]
	fq.bry = verts[faces[k][2]][1]
		
	fq.blx = verts[faces[k][3]][0]
	fq.bly = verts[faces[k][3]][1]
	
	renderer.Outline(fq,cr.RGB(0,0,0));
	
	};
	
	};
	
	//triad
	
	mtx[0][3] = cr.RGB(255,0,0);
	mtx[1][3] = cr.RGB(0,205,0);
	mtx[2][3] = cr.RGB(0,0,255);
	
	// sort by z value so lower arms show below higher ones (or else confusing)
	var fq = new cr.quad; 
	
	mtx.sort(function(a, b){ return b[2]-a[2]});
	for (var i = 0; i <= 2 ; i++) {
	renderer.Line(new cr.vector2(xpos,ypos), new cr.vector2(xpos+(mtx[i][0])*50,ypos+(mtx[i][1])*50), mtx[i][3]);
	
	var scale = ((mtx[i][2]*-1+3)/3)*5
	
	fq.tlx = xpos+mtx[i][0]*50 -scale;
	fq.tly = ypos+mtx[i][1]*50 -scale;
	
	fq.trx = xpos+mtx[i][0]*50 +scale;
	fq.try_ = ypos+mtx[i][1]*50 -scale;
	
	fq.brx = xpos+mtx[i][0]*50 +scale;
	fq.bry = ypos+mtx[i][1]*50 +scale;
	
	fq.blx = xpos+mtx[i][0]*50 -scale;
	fq.bly = ypos+mtx[i][1]*50 +scale;
	
	renderer.Fill(fq,mtx[i][3]);
	};		
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.texture_loaded = false;
	renderer.ReleaseTexture(this.last_texture);
}

IDEInstance.prototype.OnTextureEdited = function ()
{
	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.instance.SetHotspot(texture.GetHotspot());
	
	var imgsize = texture.GetImageSize();
	
	// If sprite texture has been edited and changed size, scale the texture accordingly.
	if ((imgsize.x !== this.last_imgsize.x || imgsize.y !== this.last_imgsize.y)
		&& (this.last_imgsize.x !== 0 && this.last_imgsize.y !== 0))
	{
		var sz = new cr.vector2(imgsize.x / this.last_imgsize.x, imgsize.y / this.last_imgsize.y);
		var instsize = this.instance.GetSize();
		
		sz.mul(instsize.x, instsize.y);
		this.instance.SetSize(sz);
		
		this.last_imgsize = imgsize;
	}
}