function GetPluginSettings()
{
	return {
		"name":			"Rojo3d",
		"id":			"rojo3d",
		"version":		"0.96",
		"description":	"General 3d plugin.",
		"author":		"R0J0hound",
		"help url":		"",
		"category":		"General",
		"type":			"world",
		"rotatable":	false,
		"flags":		pf_zorder_aces /*| pf_effects*/ | pf_predraw
	};
};

function AddVec3param(pre, d)
{
	pre = pre || "";
	d = d || 0;
	AddNumberParam(pre+"x", "vector x", d);
	AddNumberParam(pre+"y", "vector y", d);
	AddNumberParam(pre+"z", "vector z", d);
	//AddStringParam("relative to", "Object that the vector is relative to.", "\"\"");
}


AddComboParamOption("Perspective");
AddComboParamOption("Orthographic");
AddComboParam("camera mode", "todo", 0);
AddNumberParam("fov", "vertical field of vision", "45");
AddNumberParam("near clip dist", "how near to draw before clipping", "1");
AddNumberParam("far clip dist", "how far to draw before clipping", "1000");
AddAction(0, af_none, "Setup Camera", "3d setup", "Setup {0} camera with FOV: {1}, near:{2} & far:{3}", "Setup the camera frustum.", "setupCamera");

AddNumberParam("near", "fog near", "500");
AddNumberParam("far", "fog far", "1000");
AddNumberParam("colorRed", "fog color", "1");
AddNumberParam("colorGreen", "fog color", "1");
AddNumberParam("colorBlue", "fog color", "1");
AddAction(1, af_none, "Setup fog", "3d setup", "Setup fog with near:{0}, far:{1} and color({2},{3},{4})", "setup the fog color and distances.", "setupFog");


AddStringParam("tag", "Object tag.");
AddStringParam("copyfrom", "Object tag.");
AddAction(2, af_none, "Create object", "3d create/destroy", "Create object with tag:{0}, copying from:{1}", "create new 3d object instance.", "createObject");

AddStringParam("tag", "Object tag."); 
AddAction(3, af_none, "Destroy object", "3d create/destroy", "Destroy {0}", "destroy 3d object instance.", "destroyObject");

AddStringParam("tag", "Object tag.");
AddVec3param("pos");
AddStringParam("relative to", "Object that the vector is relative to.", "\"\"");
AddAction(4, af_none, "Set object position", "3d position", "Set {0} position to ({1},{2},{3}) relto:{4}", "set 3d object position", "setPosition");

AddStringParam("tag", "Object tag.");
AddVec3param("scale", 1);
AddStringParam("relative to", "Object that the vector is relative to.", "\"\"");
AddAction(5, af_none, "Set object scale", "3d scale", "Set {0} scale to ({1},{2},{3}) relto:{4}", "set 3d object scale", "setScale");

AddStringParam("tag", "Object tag.");
AddVec3param("angle");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
AddAction(6, af_none, "Set object Euler Orientation", "3d orientation", "Set {0} euler orientation to ({1},{2},{3}) relto:{4}", "set 3d object euler orientation.", "setOrientationEuler");

AddStringParam("tag", "Object tag.");
AddVec3param("target");
AddStringParam("relative to", "Object that the vector is relative to.", "\"\"");
AddNumberParam("up x", "vector x", "0");
AddNumberParam("up y", "vector y", "-1");
AddNumberParam("up z", "vector z", "0");
AddStringParam("relative to", "Object that the vector is relative to.", "\"\"");
AddAction(7, af_none, "Make object look at", "3d orientation", "Make {0} look at ({1},{2},{3}) relto:{4} with up({5},{6},{7}) relto:{8}", "make 3d object look at position.", "lookAt");

AddStringParam("tag", "Object tag.");
AddNumberParam("colorRed", "color", "1");
AddNumberParam("colorGreen", "color", "1");
AddNumberParam("colorBlue", "color", "1");
AddNumberParam("colorAlpha", "color", "1");
AddAction(8, af_none, "Set object color", "3d appearance", "Set {0} color to ({1},{2},{3},{4})", "set 3d object color", "setColor");

AddStringParam("tag", "Object tag.");
AddStringParam("texTag", "Texture tag.");
AddAction(9, af_none, "Set object texture", "3d appearance", "Set {0} texture to {1}", "set 3d object texture", "setTexture");

AddStringParam("tag", "Object tag.");
AddStringParam("meshTag", "Mesh tag.");
AddAction(10, af_none, "Set object mesh", "3d appearance", "Set {0} mesh to {1}", "set 3d object mesh", "setMesh");

//AddStringParam("tag", "Object tag.");
//AddStringParam("group", "Object group tag.");
//AddAction(11, af_none, "Set object group", "3d setup", "Set {0} group to {1}", "set 3d object group", "setGroup");

AddStringParam("tag", "Object tag.");
AddVec3param("");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
AddAction(12, af_none, "Move object", "3d position", "Move {0} by ({1},{2},{3}) relto:{4}", "move 3d object", "translate");

AddStringParam("tag", "Object tag.");
AddVec3param("axis");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
AddNumberParam("angle", "Rotation angle.");
// AddComboParamOption("before");
// AddComboParamOption("after");
// AddComboParam("where to rotate", "todo", 1);
AddAction(13, af_none, "Rotate object by axis", "3d orientation", "Rotate {0} by {5} degrees with axis({1},{2},{3}) relto:{4}", "rotate 3d object by axis", "rotateAxis");


AddStringParam("tag", "Object tag.");
AddVec3param("axis");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
AddNumberParam("angle", "Rotation angle.");
AddVec3param("center");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
// AddComboParamOption("before");
// AddComboParamOption("after");
// AddComboParam("where to rotate", "todo", 1);
AddAction(14, af_none, "Rotate object by axis around center", "3d orientation", "Rotate {0} by {5} degrees with axis({1},{2},{3}) relto:{4} around center({6},{7},{8}) relto:{9}", "rotate 3d object by axis around center", "rotateAxisAroundCenter");


AddStringParam("tag", "Object tag.");
AddVec3param("factor", 1);
AddAction(15, af_none, "Scale object", "3d scale", "Scale {0} by ({1},{2},{3})", "todo", "scale");

AddNumberParam("colorRed", "color", "1");
AddNumberParam("colorGreen", "color", "1");
AddNumberParam("colorBlue", "color", "1");
AddNumberParam("colorAlpha", "color", "1");
AddAction(16, af_none, "Set vertex color", "3d mesh", "Set vertex color to ({0},{1},{2},{3})", "set next vertex color", "setVColor");

AddVec3param("");
AddStringParam("relative to", "Object that the angles are relative to.", "\"\"");
AddNumberParam("u", "texture coordinants 0-1.", "0");
AddNumberParam("v", "texture coordinants 0-1.", "0");
AddAction(17, af_none, "Add vertex", "3d mesh", "Add vertex({0},{1},{2}) relto:{3} with uv({4},{5})", "add vertex with uv", "addVertex");

AddStringParam("meshTag", "Mesh tag.");
AddAction(18, af_none, "Save as mesh", "3d mesh", "Save vertex data as {0}", "save vertex list to a mesh", "saveMesh");

AddStringParam("url", "*.obj file url.");
AddStringParam("meshTag", "Mesh tag.");
AddAction(19, af_none, "Load mesh from url", "3d mesh", "Load mesh from url:{0} as {1}", "load obj file from url", "loadObjFile");


AddStringParam("url", "Image file url.");
AddStringParam("texTag", "Texture tag.");
AddComboParamOption("nearest");
AddComboParamOption("linear");
AddComboParam("filtering", "todo", 1);
AddComboParamOption("clamp_to_edge");
AddComboParamOption("repeat");
AddComboParamOption("mirrored_repeat");
AddComboParam("wrapping mode", "todo", 1);
AddAction(20, af_none, "Load Texture from url", "3d texture", "Load texture from url:{0} as {1} with {2} filtering, an {3} wrap", "load teture from url", "loadTextureFile");

AddStringParam("texTag", "Texture tag.");
AddAction(21, af_none, "Unload Texture", "3d texture", "Unload texture {0}", "todo", "unloadTexture");

AddNumberParam("shadow map size", "texture size for shadow map", "1024");
AddNumberParam("max far distance", "furthest distance to draw shadows", "infinity");
AddNumberParam("shadow bias", "Bias to remove shadow acne.", "0.005");
AddAction(22, af_none, "Setup shadow", "3d setup", "Setup shadow texture size:{0}, max far dist:{1}, and bias:{2}", "setup shadowmap size and max shadow distance", "setupShadow");

AddNumberParam("colorRed", "color", "0");
AddNumberParam("colorGreen", "color", "0");
AddNumberParam("colorBlue", "color", "0");
AddNumberParam("colorAlpha", "color", "0.5");
AddAction(23, af_none, "Set shadow color", "3d setup", "Set shadow color to ({0},{1},{2},{3})", "set shadow color", "setShadowColor");

AddStringParam("tag", "Object tag.");
AddComboParamOption("no"); AddComboParamOption("yes"); AddComboParam("shadows", ".", 1);
AddComboParamOption("no"); AddComboParamOption("yes"); AddComboParam("shading", ".", 1);
AddComboParamOption("no"); AddComboParamOption("yes"); AddComboParam("fog", ".", 1);
AddComboParamOption("no"); AddComboParamOption("yes"); AddComboParamOption("bilboard"); AddComboParam("transparent", ".", 0);
AddAction(24, af_none, "Set object settings", "3d appearance", "Set {0} settings: shadows:{1}, shading:{2}, fog:{3}, transparent:{4}", "set 3d object draw settings", "setObjSettings");

AddObjectParam("sprite", "sprite to copy texture from.");
AddStringParam("texTag", "Texture tag.");
AddAction(25, af_none, "Load Texture from sprite", "3d texture", "Load texture from sprite:{0} as {1}", "load teture from sprite", "loadTextureSprite");

AddStringParam("tag", "Object tag.");
AddNumberParam("left", "texture coordinants 0-1.", "0");
AddNumberParam("top", "texture coordinants 0-1.", "0");
AddNumberParam("right", "texture coordinants 0-1.", "1");
AddNumberParam("bottom", "texture coordinants 0-1.", "1");
AddAction(26, af_none, "Set object texture rectangle", "3d appearance", "Set {0} tex rectangle to ({1},{2},{3},{4})", "set 3d object texture rectangle", "setTexRect");

//Expressions
AddStringParam("tag", "Object tag.");
AddExpression(0, ef_return_number, "get positionX of object", "3d", "posX", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(1, ef_return_number, "get positionY of object", "3d", "posY", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(2, ef_return_number, "get positionZ of object", "3d", "posZ", "get property");

AddStringParam("tag", "Object tag.");
AddExpression(3, ef_return_number, "get scaleX of object", "3d", "scaleX", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(4, ef_return_number, "get scaleY of object", "3d", "scaleY", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(5, ef_return_number, "get scaleZ of object", "3d", "scaleZ", "get property");

AddStringParam("tag", "Object tag.");
AddExpression(6, ef_return_number, "get orientXX of object", "3d", "orientXX", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(7, ef_return_number, "get orientXY of object", "3d", "orientXY", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(8, ef_return_number, "get orientXZ of object", "3d", "orientXZ", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(9, ef_return_number, "get orientYX of object", "3d", "orientYX", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(10, ef_return_number, "get orientYY of object", "3d", "orientYY", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(11, ef_return_number, "get orientYZ of object", "3d", "orientYZ", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(12, ef_return_number, "get orientZX of object", "3d", "orientZX", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(13, ef_return_number, "get orientZY of object", "3d", "orientZY", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(14, ef_return_number, "get orientZZ of object", "3d", "orientZZ", "get property");

AddStringParam("tag", "Object tag.");
AddExpression(15, ef_return_number, "get colorR of object", "3d", "colorR", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(16, ef_return_number, "get colorG of object", "3d", "colorG", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(17, ef_return_number, "get colorB of object", "3d", "colorB", "get property");
AddStringParam("tag", "Object tag.");
AddExpression(18, ef_return_number, "get colorA of object", "3d", "colorA", "get property");

AddStringParam("tag", "Object tag."); 
AddExpression(19, ef_return_string, "get meshTag of object", "3d", "meshTag", "get property");

AddStringParam("tag", "Object tag.");
AddExpression(20, ef_return_string, "get textureTag of object", "3d", "textureTag", "get property");

//AddStringParam("tag", "Object tag.");
//AddExpression(21, ef_return_string, "get group of object", "Object", "group", "get property");

ACESDone();

var property_list = []; //todo: add fov, far and camera type here.

function CreateIDEObjectType(){	return new IDEObjectType();}
function IDEObjectType(){	assert2(this instanceof arguments.callee, "Constructor called as a function");}
IDEObjectType.prototype.CreateInstance = function(instance){return new IDEInstance(instance);}
function IDEInstance(instance, type){this.instance = instance; this.type = type; this.properties = {};}
IDEInstance.prototype.OnCreate = function(){}
IDEInstance.prototype.OnInserted = function(){}
IDEInstance.prototype.OnDoubleClicked = function(){}
IDEInstance.prototype.OnPropertyChanged = function(property_name){}
IDEInstance.prototype.OnRendererInit = function(renderer){}
IDEInstance.prototype.OnRendererReleased = function(renderer){}
IDEInstance.prototype.Draw = function(renderer)
{
	var q=this.instance.GetBoundingQuad();
	renderer.Fill(q, cr.RGB(224, 224, 224));
	renderer.Outline(q, cr.RGB(0,0,0));
}

