function GetPluginSettings()
{
	return {
		"name":			"Flash Light",
		"id":			"FlashLight",
		"version":		"1.06",
		"description":	"A sprite-like object that draws shadows in the image.  You can select different objects to cast the shadows.",
		"author":		"Colludium",
		"help url":		"https://goo.gl/s5kcwi",
		"category":		"General",
		"dependency":	"flashlightPenumbra.png",
		"type":			"world",			// appears in layout
		"rotatable":	true,
		"flags":		pf_animations | pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_zorder_aces | pf_effects | pf_predraw
	};
};

////////////////////////////////////////
// Conditions
AddObjectParam("Object", "Select the object to test for a collision with.");
AddCondition(0, cf_fake_trigger | cf_static, "On collision with another object", "Collisions", "On collision with {0}", "Triggered when the object collides with another object.", "OnCollision");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddCondition(1, 0, "Is overlapping another object", "Collisions", "Is overlapping {0}", "Test if the object is overlapping another object.", "IsOverlapping");

AddAnimationParam("Animation", "Enter the name of the animation to check if playing.")
AddCondition(2, 0, "Is playing", "Animations", "Is animation <b>{0}</b> playing", "Test which of the object's animations is currently playing.", "IsAnimPlaying");

AddCmpParam("Comparison", "How to compare the current animation frame number (0-based).");
AddNumberParam("Number", "The animation frame number to compare to (0-based).");
AddCondition(3, 0, "Compare frame", "Animations", "Animation frame {0} {1}", "Test which animation frame is currently showing.", "CompareFrame");

AddAnimationParam("Animation", "Enter the name of the animation that has finished.")
AddCondition(4, cf_trigger, "On finished", "Animations", "On animation <b>{0}</b> finished", "Triggered when an animation has finished.", "OnAnimFinished");

AddCondition(5, cf_trigger, "On any finished", "Animations", "On any animation finished", "Triggered when any animation has finished.", "OnAnyAnimFinished");

AddCondition(6, cf_trigger, "On frame changed", "Animations", "On frame changed", "Triggered when the current animation frame changes.", "OnFrameChanged");

AddCondition(7, 0, "Is mirrored", "Appearance", "Is mirrored", "True if the object has been mirrored with the 'Set Mirrored' action.", "IsMirrored");
AddCondition(8, 0, "Is flipped", "Appearance", "Is flipped", "True if the object has been flipped with the 'Set Flipped' action.", "IsFlipped");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddNumberParam("Offset X", "The amount to offset the X co-ordinate (in pixels) before checking for a collision.");
AddNumberParam("Offset Y", "The amount to offset the Y co-ordinate (in pixels) before checking for a collision.");
AddCondition(9, 0, "Is overlapping at offset", "Collisions", "Is overlapping {0} at offset (<i>{1}</i>, <i>{2}</i>)", "Test if the object is overlapping another object at an offset position.", "IsOverlappingOffset");

//AddCondition(10, cf_trigger, "On image URL loaded", "Web", "On image URL loaded", "Triggered after 'Load image from URL' when the image has finished loading.", "OnURLLoaded");

AddCondition(11, 0, "Collisions enabled", "Collisions", "Collisions enabled", "True if the object's collisions are enabled and will fire collision events.", "IsCollisionEnabled");

AddCmpParam("Comparison", "How to compare the current animation speed.");
AddNumberParam("Number", "The animation speed to compare to.");
AddCondition(12, 0, "Compare speed", "Animations", "Animation speed {0} {1}", "Compare the current animation speed.", "CompareAnimSpeed");

AddCondition(13, cf_none, "Is blanked out", "Light collisions", "The light is blanked by an obstacle", "Returns true if the light is over a taller obstacle and is extinquished.", "BlankedByObstacle");

AddCondition(14, cf_none, "Enabled", "Light settings", "Is enabled", "Returns true if the plugin is enabled to update shadows.", "IsEnabled");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddCondition(15, 0, "Object is in shadow", "Light collisions", "{0} is in shadow", "Returns true if the selected object is in shadow (does not return true if the shadow is cast by the same object).", "IsInShadow");

AddObjectParam("Object", "Select the object type to test for.");
AddCondition(16, 0, "Object Type is ignored", "Light Lists", "Type {0} is in ignore list", "Returns true if the selected object type is in the ignore list.", "TypeIsInIgnoreList");

AddObjectParam("Object", "Select the object inst to test for.");
AddCondition(17, 0, "Object Inst is ignored", "Light Lists", "Inst {0} is in ignore list", "Returns true if the selected object instance is in the ignore list.", "InstIsInIgnoreList");

AddObjectParam("Object", "Select the object type to test for.");
AddCondition(18, 0, "Object Type in shadow list", "Light Lists", "Type {0} is in shadow list", "Returns true if the selected object type is in the shadow list.", "TypeInShadowList");

AddObjectParam("Object", "Select the object inst to test for.");
AddCondition(19, 0, "Object Inst casts shadow", "Light Lists", "Inst {0} is casting a shadow", "Returns true if the selected object instance is casting a shadow.", "InstCastsShadow");



////////////////////////////////////////
// Actions
AddObjectParam("Object", "Choose the object type of the new instance to create.");
AddLayerParam("Layer", "The layer name or number to create the instance on.");
AddAnyTypeParam("Image point", "Use 0 for the object's origin, or the name or number of an image point to spawn the object from.", "0");
AddAction(0, 0, "Spawn another object", "Misc", "Spawn {0} on layer <b>{1}</b> <i>(image point {2})</i>", "Create another object at this object.", "Spawn");

AddComboParamOption("Normal");
AddComboParamOption("Additive");
AddComboParamOption("XOR");
AddComboParamOption("Copy");
AddComboParamOption("Destination over");
AddComboParamOption("Source in");
AddComboParamOption("Destination in");
AddComboParamOption("Source out");
AddComboParamOption("Destination out");
AddComboParamOption("Source atop");
AddComboParamOption("Destination atop");
AddComboParam("Blend mode", "Choose the new blend mode for this object.");
AddAction(1, 0, "Set blend mode", "Appearance", "Set blend mode to <i>{0}</i>", "Set the background blend mode for this object.", "SetEffect");

AddAction(2, 0, "Stop",		"Animations",	"Stop animation",	"Stop the current animation from playing.", "StopAnim");

AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to resume or rewind the animation back to the first frame.");
AddAction(3, 0, "Start",	"Animations",	"Start animation from {0}",	"Start the current animation, if it was stopped.", "StartAnim");

AddAnimationParam("Animation", "The name of the animation to set.");
AddComboParamOption("current frame");
AddComboParamOption("beginning");
AddComboParam("From", "Choose whether to play from the same frame number or rewind the animation back to the first frame.", 1);
AddAction(4, 0, "Set animation", "Animations", "Set animation to <b>{0}</b> (play from {1})", "Set the current animation", "SetAnim");

AddNumberParam("Frame number", "The animation frame number to set (0-based).");
AddAction(5, 0, "Set frame", "Animations", "Set animation frame to <b>{0}</b>", "Set the current animation frame number.", "SetAnimFrame");

AddNumberParam("Speed", "The new animation speed, in animation frames per second.");
AddAction(6, 0, "Set speed", "Animations", "Set animation speed to <b>{0}</b>", "Set the current animation speed.", "SetAnimSpeed");

AddComboParamOption("Mirrored");
AddComboParamOption("Not mirrored");
AddComboParam("State", "Choose whether to horizontally mirror the object or set it back to normal.");
AddAction(7, 0, "Set mirrored", "Appearance", "Set <b>{0}</b>", "Set the object horizontally mirrored or back to normal.", "SetMirrored");

AddComboParamOption("Flipped");
AddComboParamOption("Not flipped");
AddComboParam("State", "Choose whether to vertically flip the object or set it back to normal.");
AddAction(8, 0, "Set flipped", "Appearance", "Set <b>{0}</b>", "Set the object vertically flipped or back to normal.", "SetFlipped");

AddNumberParam("Scale", "The object width and height to set, based on a multiple of its original dimensions, e.g. 1 = original size, 2 = double size, 0.5 = half size etc.", "1");
AddAction(9, 0, "Set scale", "Size & Position", "Set scale to <i>{0}</i>", "Set the width and height as a multiple of its original size.", "SetScale");

/*
AddStringParam("URI", "Enter the URL on the web, or data URI, of an image to load.", "\"http://\"");
AddComboParamOption("Resize to image size");
AddComboParamOption("Keep current size");
AddComboParam("Size", "Whether to resize the FlashLight to the size of the loaded image, or stretch it to the current size.");
AddComboParamOption("anonymous");
AddComboParamOption("none");
AddComboParam("Cross-origin", "The cross-origin (CORS) mode to use for the request.");
AddAction(10, 0, "Load image from URL", "Web", "Load image from <i>{0}</i> ({1}, cross-origin {2})", "Replace the currently displaying animation frame with an image loaded from a web address or data URI.", "LoadURL");
*/

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Collisions", "Whether to enable or disable collisions for this object.");
AddAction(11, 0, "Set collisions enabled", "Misc", "Set collisions <b>{0}</b>", "Set whether the object will register collision events or not.", "SetCollisions");

AddNumberParam("Frame number", "The animation frame number to repeat to (0-based).");
AddAction(12, 0, "Set repeat-to frame", "Animations", "Set repeat-to frame to <b>{0}</b>", "Set the animation frame number to repeat to in a looping animation.", "SetAnimRepeatToFrame");

AddObjectParam("Object", "Object to add to shadow cast list.");
AddAction(13, af_none, "Shadow list - add", "Light shadows", "Add Object {0} to the shadow cast list", "Add an object to the shadow cast object list.", "AddShadowObject");

AddObjectParam("Object", "Object to remove from shadow creation list.");
AddAction(14, af_none, "Shadow list - remove", "Light shadows", "Remove Object {0} from the shadow cast list", "Remove an object from the shadow cast object list.", "RemoveShadowObject");

AddAction(15, af_none, "Shadow list - clear", "Light shadows", "Clear the shadow cast list", "Remove all objects from the shadow cast object list.", "ClearShadowList");

AddObjectParam("Object", "Object type to add to ignore list.");
AddAction(16, af_none, "Ignore types - add", "Light shadows", "Add type {0} to the ignore list", "Ignore a type of object when shadow casting.", "IgnoreType");

AddObjectParam("Object", "Object type to remove from ignore list.");
AddAction(17, af_none, "Ignore types - remove", "Light shadows", "Remove type {0} from the ignore list", "Remove a type of object from the ignore list.", "RemoveIgnoreType");

AddAction(18, af_none, "Ignore types - clear list", "Light shadows", "Clear the type ignore list", "Remove all objects from the object type ignore list.", "ClearIgnoreType");

AddAction(19, af_none, "Draw full then disable", "Light settings", "Redraw full image, then disable shadow drawing", "Redraw the full image then disable the object so no more shadows will be drawn.", "DrawFullDisable");

AddComboParamOption("Solid + Jump-Through");
AddComboParamOption("Flashlight Shadow");
AddComboParamOption("Selected Only");
AddComboParam("Shadow objects", "Choose the type of objects that will cast shadows.");
AddAction(20, af_none, "Shadow casting types", "Light shadows", "Shadows will be cast from <b>{0}</b> ", "Select the group of objects that will cast shadows.", "SetShadowCastGroup");

AddNumberParam("Height", "Pixel height of light source", 0);
AddAction(21, af_none, "Light height", "Light settings", "Set light height to <b>{0}</b> pixels", "Set the height for this light.  Zero causes infinite shadows.  To use this feature you need to add the Illuminated helper plugin to the shadow-casting objects.", "SetLightHeight");

AddComboParamOption("Disable");
AddComboParamOption("Enable");
AddComboParam("Choose", "Choose to enable shadow updating.");
AddAction(22, af_none, "Enable redraw", "Light settings", "{0} shadow update", "Choose to enable shadow drawing.  If set to disabled it first refreshes the image and shadows.", "SetEnabled");

AddObjectParam("Object", "Object to add to the ignore list.");
AddAction(23, af_none, "Ignore inst - add", "Light shadows", "Add {0} to the ignore list", "Ignore an instance of an object when shadow casting.", "IgnoreInst");

AddObjectParam("Object", "Object to remove from solid ignore list.");
AddAction(24, af_none, "Ignore inst - remove", "Light shadows", "Remove {0} from the ignore list", "Remove an object instance from the ignore list.", "RemoveIgnoreInst");

AddAction(25, af_none, "Ignore inst - clear list", "Light shadows", "Clear the instance ignore list", "Remove all instances from the instance ignore list.", "ClearIgnoreInst");

AddNumberParam("Radius", "Pixel radius of light source", 0);
AddAction(26, af_none, "Light radius", "Light settings", "Set light radius to <b>{0}</b> pixels", "Set the light radius to cast penumbra shadows.  If the light height is greater than zero then this setting is ignored.", "SetLightRadius");

AddAction(27, af_none, "Force early draw", "Light shadows", "Force early draw of image and shadows", "Force an early draw of the image and any shadows for Paster compatibility.  This is only necessary in the same tick that the Flashlight object is created.", "ForceEarlyDraw");

AddNumberParam("Texture scale", "The scale of the webgl texture.", 1);
AddAction(28, af_none, "Texture scale", "Light settings", "Set webGL texture scale to <b>{0}</b>", "Set the scale of the webGL texture (values 0.2+).  Limits to ensure max texture size 2048 x 2048.", "SetTexScale");


////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get animation frame", "Animations", "AnimationFrame", "The current animation frame number (0-based).");

AddExpression(1, ef_return_number, "Get animation frame count", "Animations", "AnimationFrameCount", "The number of animation frames in the current animation.");

AddExpression(2, ef_return_string, "Get animation name", "Animations", "AnimationName", "The name of the current animation.");

AddExpression(3, ef_return_number, "Get animation speed", "Animations", "AnimationSpeed", "The speed of the current animation, in animation frames per second.");

AddAnyTypeParam("ImagePoint", "Name or number of image point to get.");
AddExpression(4, ef_return_number, "Get image point X",		"Size & Position",	"ImagePointX", "The X position of one of the object's image points.");

AddAnyTypeParam("ImagePoint", "Name or number of image point to get.");
AddExpression(5, ef_return_number, "Get image point Y",		"Size & Position",	"ImagePointY", "The Y position of one of the object's image points.");

AddExpression(6, ef_return_number, "Get image width", "Animations", "ImageWidth", "The width of the current animation frame image, in pixels.");
AddExpression(7, ef_return_number, "Get image height", "Animations", "ImageHeight", "The height of the current animation frame image, in pixels.");

AddExpression(8, ef_return_number, "", "Size & Position", "ImagePointCount", "The number of image points the current frame has.");

AddExpression(9, ef_return_number, "Light height", "Light", "LightHeight", "This returns the height of the light in pixels.");

AddExpression(10, ef_return_number, "Light radius", "Light", "LightRadius", "This returns the light radius in pixels.");

AddExpression(11, ef_return_number, "Texture scale", "Light", "TextureScale", "This returns the webGL texture scale being used to draw the shadows.");

AddExpression(12, ef_return_number, "Shadow Obj Number", "Light", "ShadowNumber", "The number of shadow objects that cast shadows in this Flashlight (last tick, due to runtime order of functions).");

AddNumberParam("Index", "The index number.");
AddExpression(13, ef_return_number, "Shadow Obj UID", "Light", "ShadowUID", "This returns the UID of the shadow object at index.");

AddExpression(14, ef_return_number, "Ignore list length", "Light", "IgnoreListLen", "The number of object instances in the ignore instance list.");

AddNumberParam("Index", "The index number.");
AddExpression(15, ef_return_number, "Ignore list UID", "Light", "IgnoreListAt", "This returns the UID of the ignore instance object at index.");



ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_link,	"Animations",			lang("project\\misc\\sprite-edit-link"), "Click to edit the object's animations.", "firstonly"),
	new cr.Property(ept_link,	"Size",					lang("project\\misc\\sprite-make11-link"), "Click to set the object to the same size as its image.", "worldundo"),
	new cr.Property(ept_text,	"Initial animation",	"Default",	"The initial animation showing."),
	new cr.Property(ept_integer,"Initial frame",		0,			"The initial animation frame showing."),
	new cr.Property(ept_combo,	"Visible",	"Visible",	"Choose whether the light is visible or invisible.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Shadow objects",		"Solids",	"The group of objects that will cast shadows.  Other objects can be added using events.", "Solids|Flash-Shadow|Other"),
	new cr.Property(ept_integer,"Light height",		0,	"For objects with Flashlight Shadow behavior, the light height will be used to determine the shape of the shadow."),
	new cr.Property(ept_integer,"Light radius",		0,	"In WebGL, setting radius > 0 will draw penumbra shadows, if the light height is zero.  If light height is > 0 then this setting is ignored."),
	new cr.Property(ept_integer,"Texture scale",		1,	"Sets the relative size of the WebGL render texture, compared to the animation image size (the original image size)."),


	//new cr.Property(ept_combo,	"Effect",				"(none)",	"Choose an effect for this object.  (This does not preview in the layout, only when you run.)", "(none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop")
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

IDEInstance.prototype.OnAfterLoad = function ()
{
	// Must initialise last_imgsize for correct updating of FlashLights on layouts without a tab open
	var texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.last_imgsize = texture.GetImageSize();
}

IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

// Called by the IDE after a property has been changed
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

IDEInstance.prototype.OnRendererInit = function(renderer)
{
	this.last_texture = this.instance.GetTexture(this.properties["Initial frame"], this.properties["Initial animation"]);
	this.last_texture_id = this.last_texture.GetID();
	
	renderer.LoadTexture(this.last_texture);
	this.texture_loaded = true;
	
	this.instance.SetHotspot(this.last_texture.GetHotspot());
}
	
// Called to draw self in the editor
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
	// If not just inserted and the FlashLight texture has been edited and changed size, scale the texture accordingly.
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
		renderer.Quad(this.instance.GetBoundingQuad(), this.instance.GetOpacity());
	}
}

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