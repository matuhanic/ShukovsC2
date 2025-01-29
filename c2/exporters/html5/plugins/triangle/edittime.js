function GetPluginSettings()
{
	return {
		"name":			"Triangle3d",
		"id":			"Triangle",
		"version":		"0.81",
		"description":	"Draw 3d triangles.",
		"author":		"R0J0hound",
		"help url":		"",
		"category":		"General",
		"type":			"world",
		"rotatable":	false,
		"flags":		pf_zorder_aces /*| pf_effects*/ | pf_predraw
	};
};

AddNumberParam("x", "todo", "0");
AddNumberParam("y", "todo", "0");
AddNumberParam("z", "todo", "0");
AddAction(0, af_none, "Set Draw Position", "Draw Matrix", "Set draw position to ({0},{1},{2})", "todo", "setPosition");
AddNumberParam("x", "todo", "1");
AddNumberParam("y", "todo", "1");
AddNumberParam("z", "todo", "1");
AddAction(1, af_none, "Set Draw Scale", "Draw Matrix", "Set draw scale to ({0},{1},{2})", "todo", "setScale");
AddNumberParam("x", "todo", "0");
AddNumberParam("y", "todo", "0");
AddNumberParam("z", "todo", "0");
AddAction(2, af_none, "Set Draw Rotation", "Draw Matrix", "Set draw rotation to ({0},{1},{2})", "todo", "setRotation");

AddAction(3, af_none, "Reset Draw Matrix", "Draw Matrix", "Reset draw matrix", "todo", "resetMatrix");

AddComboParamOption("Perspective");
AddComboParamOption("Orthographic");
AddComboParam("camera mode", "todo", 0);
AddNumberParam("fov", "vertical field of vision", "45");
AddNumberParam("far clip dist", "how far to draw before clipping", "10000");
AddAction(9, af_none, "Setup Camera", "Camera", "Setup {0} camera with FOV: {1} and far: {2}", "todo", "setupCamera");

AddNumberParam("x", "todo", "0");
AddNumberParam("y", "todo", "0");
AddNumberParam("z", "todo", "0");
AddAction(10, af_none, "Set Camera Position", "Camera", "Set camera position to ({0},{1},{2})", "todo", "setCameraPosition");
AddNumberParam("x", "todo", "1");
AddNumberParam("y", "todo", "1");
AddNumberParam("z", "todo", "1");
AddAction(11, af_none, "Set Camera Scale", "Camera", "Set camera scale to ({0},{1},{2})", "todo", "setCameraScale");
AddNumberParam("x", "todo", "0");
AddNumberParam("y", "todo", "0");
AddNumberParam("z", "todo", "0");
AddAction(12, af_none, "Set Camera Rotation", "Camera", "Set camera rotation to ({0},{1},{2})", "todo", "setCameraRotation");

// AddNumberParam("target x", "todo", "0");
// AddNumberParam("target y", "todo", "0");
// AddNumberParam("target z", "todo", "0");
// AddNumberParam("up x", "todo", "0");
// AddNumberParam("up y", "todo", "0");
// AddNumberParam("up z", "todo", "0");
// AddAction(14, af_none, "Camera look at", "Camera", "Camera look at ({0},{1},{2}) with up ({3},{4},{5})", "todo", "cameraLookAt");

AddAction(13, af_none, "Reset Camera Matrix", "Camera", "Reset camera matrix", "todo", "resetCameraMatrix");

AddStringParam("obj url", "todo", "\"\"");
AddStringParam("mesh tag", "todo", "\"mesh\"");
AddAction(20, af_none, "Load Obj Mesh from Url", "Load", "Load mesh from url {0} as {1}", "todo", "loadObjFile");

AddStringParam("mesh tag", "todo", "\"mesh\"");
AddAction(21, af_none, "Save Triangles to Mesh", "Draw", "Save triangles as mesh {0}", "todo", "saveMesh");

AddNumberParam("x", "x coord", "0");
AddNumberParam("y", "y coord", "0");
AddNumberParam("z", "z coord", "0");
AddNumberParam("u", "u coord: 0-1", "0");
AddNumberParam("v", "v coord: 0-1", "0");
AddAction(31, af_none, "Add Vertex", "Draw", "Vertex ({0},{1},{2}) with UV ({3},{4})", "todo", "addVertex");

AddStringParam("texture tag", "Empty for no texture.", "\"\"");
AddAction(34, af_none, "Draw Triangles", "Draw", "Draw triangles with texture {0}", "todo", "drawTriangles");

AddStringParam("mesh tag", "todo", "\"mesh\"");
AddStringParam("texture tag", "Empty for no texture.", "\"\"");
AddAction(35, af_none, "Draw Mesh", "Draw", "Draw mesh {0} with texture {1}", "todo", "drawMesh");

AddNumberParam("r", "0 to 1", "1");
AddNumberParam("g", "0 to 1", "1");
AddNumberParam("b", "0 to 1", "1");
AddNumberParam("a", "0 to 1", "1");
AddAction(36, af_none, "Set Color", "Draw", "Color ({0},{1},{2},{3})", "todo", "setColor");

// AddStringParam("texture tag", "Texture tag.  Empty for no texture.", "\"\"");
// AddAction(37, cf_deprecated, "Set Texture", "Draw", "Set texture to {0}", "todo", "setTexture");

AddStringParam("url", "todo", "\"\"");
AddStringParam("texture tag", "todo", "\"tex\"");
AddAction(40, af_none, "Load Texture from Url", "Load", "Load texture from url {0} as {1}", "todo", "loadTextureFile");

//AddStringParam("texture tag", "todo", "\"tex\"");
//AddAction(41, af_none, "Unload Texture", "Save/Load", "Unload texture {0}", "todo", "unloadTexture");

AddNumberParam("x", "todo", "0");
AddNumberParam("y", "todo", "0");
AddNumberParam("z", "todo", "0");
AddAction(50, af_none, "Calculate Vectors from Rotation", "Math", "Calculate vectors from rotation({0},{1},{2})", "todo", "calcAxisFromRot");

AddNumberParam("index", "0,1,2", "0");
AddExpression(0, ef_return_number, "Vector X", "Math", "vecX", "axis vectors. 0,1 or 2.");
AddNumberParam("index", "0,1,2", "0");
AddExpression(1, ef_return_number, "Vector Y", "Math", "vecY", "axis vectors. 0,1 or 2.");
AddNumberParam("index", "0,1,2", "0");
AddExpression(2, ef_return_number, "Vector Z", "Math", "vecZ", "axis vectors. 0,1 or 2.");

AddExpression(3, ef_return_number, "Camera Z offset", "Camera", "cameraZoffset", "default camera offset.");


ACESDone();

var property_list = [];

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

