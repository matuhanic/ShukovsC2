// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.

populateCommonACE = function(){

AddCondition(1000, cf_none, "Is visible", "Appearance", "Is visible", "Check if visible or not", "ObjIsVisible");

AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Recursive", "Choose whether to loop through all childrens children or not", 0);
AddCondition(1001, cf_not_invertible, "Pick children", "Hierarchy", "Pick children (Recursive : <i>{0}</i>)", "Pick all the instances of valid Q3D-types that are parented to this object, either recursively or only those directly parented, overwrites current SOL, can be buggy if you're not careful", "ObjPickChildren");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Actions ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AddNumberParam("X", "X position in parent space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in parent space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in parent space z-axis units.", initial_string = "0")
AddAction(1000, af_none, "Set position (parent space)", "Position", "Set position to <i>parent space</i> coordinates ({0},{1},{2}).", "Set the position of the object in parent space coordinates. (if the object is parented to the scene this is a better choice than world)", "ObjSetPosParent");

AddStringParam("Order", "Rotation order of the euler angles (written as any string ''XYZ'',''YXZ'' etc. which is a combination of X, Y and Z)", initial_string = "\"XYZ\"")
AddNumberParam("X", "X rotation in degrees.", initial_string = "0")
AddNumberParam("Y", "Y rotation in degrees.", initial_string = "0")
AddNumberParam("Z", "Z rotation in degrees.", initial_string = "0")
AddAction(1001, af_none, "Rotation from euler angles", "Rotation", "Set rotation in {0} order to Euler angles ({1},{2},{3}).", "Set the rotation of the object using specified euler angles.", "ObjSetRot");

AddNumberParam("X", "Parent space X position for object to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Parent space Y position for object to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Parent space Z position for object to look at in z-axis units.", initial_string = "0")
AddAction(1002, af_none, "Look at (parent space)", "Rotation", "Look at <i>parent space</i> position ({0},{1},{2}).", "Make the object +Z (blue axis line) look towards a point in parent space using up vector in parent space. (better performance than [look at (world space)] if you can get away with using it)", "ObjLookAtLocal");

AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(1003, af_none, "Translate (local space)", "Position", "Translate along <i>local space</i> vector ({0},{1},{2}) by ({3}) units.", "Move the object along a given local space vector by a given amount", "ObjMoveAxisLocal");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(1004, af_none, "Rotate around (local space)", "Rotation", "Rotate around <i>local space</i> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the object around a given local space vector by a given amount", "ObjRotAxisLocal");

AddNumberParam("X", "X component of up vector.", initial_string = "0")
AddNumberParam("Y", "Y component of up vector.", initial_string = "0")
AddNumberParam("Z", "Z component of up vector.", initial_string = "1")
AddAction(1005, af_none, "Set 'up' vector", "Rotation", "Set up vector to ({0},{1},{2}).", "Use to define what 'Look at' uses for it's up direction.", "ObjSetUpVec");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(1006, af_deprecated, "Translate (world space)", " OBJECTS / POSITION", "<b>OBJECTS / POSITION</b> Move object {0} along <b>world</b> vector ({1},{2},{3}) by ({4}) units.", "Move the object along a given world space vector by a given amount", "ObjMoveAxis");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(1007, af_none, "Rotate around (world space)", "Rotation", "Rotate around <i>world space</i> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the object around a given world space vector by a given amount", "ObjRotAxisWorld");

AddNumberParam("X", "X component of axis.", initial_string = "1")
AddNumberParam("Y", "Y component of axis.", initial_string = "0")
AddNumberParam("Z", "Z component of axis.", initial_string = "0")
AddNumberParam("Angle", "Angle to rotate around given axis in degrees.", initial_string = "0")
AddAction(1008, af_none, "Rotation from axis-angle", "Rotation", "Set rotation from axis ({0},{1},{2}) and angle ({3}).", "Set the rotation of the object in axis-angle representation.", "ObjSetRotAxisAngle");

AddNumberParam("X", "X scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Y", "Y scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Z", "Z scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddAction(1009, af_none, "Set object scale (local)", "Scale & Size", "Set <i>local</i> object scale to ({0},{1},{2}).", "Sets the X,Y,Z scaling of the object.", "ObjSetScale");


////////////////////////////////////////////////////////////////////////////////////////////

AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParam("Visibility", "Set whether the object is visbile or invisible.", "0");
AddAction(1010, af_none, "Set object visibility", "Appearance", "Make object <b>{0}</b>.", "Sets if this object is visible/invisible.", "ObjSetVisible");

AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadows", "Set whether the object casts a shadow.", "1");
AddAction(1011, af_none, "Set object shadow casting", "Appearance", "<b>{0}</b> for object.", "Sets if this object casts a shadow (slow) default is no.", "ObjSetCastShadow");

AddComboParamOption("Don't receive shadows");
AddComboParamOption("Receive shadows");
AddComboParam("Shadows", "Set whether the object receives a shadow.", "1");
AddAction(1012, af_deprecated, "Set object shadow receiving", "Appearance", "<b>{0}</b> for object.", "Sets if this object receives a shadow (slow) default is no.", "ObjSetReceiveShadow");

AddComboParamOption("Frustum culled");
AddComboParamOption("Not frustum culled");
AddComboParam("Culling", "Set whether the object is frustum culled.", "0");
AddAction(1013, af_none, "Set object frustum culling", "Appearance", "Object is <b>{0}</b>.", "Sets if this object is frustum culled when rendering, default is yes.", "ObjSetFrustumCulled");

AddComboParamOption("Auto update");
AddComboParamOption("Don't auto update");
AddComboParam("Update", "Set whether the object's matrix is auto updated every frame.", "0");
AddAction(1014, af_none, "Matrix update mode", "Matrix", "<b>{0}</b> matrix.", "sets if this objects matrix is auto updated, which causes unnecessary slowdown in static objects that wont change", "ObjSetMatrixAutoUpdate");

AddAction(1015, af_none, "Update object model matrix", "Matrix", "<b>Update model matrix</b> with current <i>rotation / scale / position</i>.", "Updates the model matrix with rotation / scale / position settings.", "ObjSetMatrixUpdate");

AddNumberParam("Row 0 (0,0)", "Value of matrix entry Xx", initial_string = "1")
AddNumberParam("(1,0)", "Value of matrix entry Xy", initial_string = "0")
AddNumberParam("(2,0)", "Value of matrix entry Xz", initial_string = "0")
AddNumberParam("(3,0)", "Value of matrix entry Xw", initial_string = "0")
AddNumberParam("Row 1 (0,1)", "Value of matrix entry Yx", initial_string = "0")
AddNumberParam("(1,1)", "Value of matrix entry Yy", initial_string = "1")
AddNumberParam("(2,1)", "Value of matrix entry Yz", initial_string = "0")
AddNumberParam("(3,1)", "Value of matrix entry Yw", initial_string = "0")
AddNumberParam("Row 2 (0,2)", "Value of matrix entry Zx", initial_string = "0")
AddNumberParam("(1,2)", "Value of matrix entry Zy", initial_string = "0")
AddNumberParam("(2,2)", "Value of matrix entry Zz", initial_string = "1")
AddNumberParam("(3,2)", "Value of matrix entry Zw", initial_string = "0")
AddNumberParam("Row 3 (0,3)", "Value of matrix entry Wx", initial_string = "0")
AddNumberParam("(1,3)", "Value of matrix entry Wy", initial_string = "0")
AddNumberParam("(2,3)", "Value of matrix entry Wz", initial_string = "0")
AddNumberParam("(3,3)", "Value of matrix entry Ww", initial_string = "1")
AddAction(1016, af_none, "Set model matrix", "Matrix", "Set model matrix to <b>[Rows]</b> : [{0},{1},{2},{3}] , [{4},{5},{6},{7}] , [{8},{9},{10},{11}] , [{12},{13},{14},{15}]", "Advanced feature to manually set up the model matrix", "ObjSetMatrix");

AddObjectParam("Object", "Select the object to become new parent.");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1017, af_none, "Change parent", "Hierarchy", "Change parent to {0}, <i>Transform: {1}</i>", "Changes the parent of the object to a picked one (must be a valid Q3D type), any transformations to the parent affect the child, the child has local position/rotation", "ObjChangeParent");

AddObjectParam("Object", "Select the object to become new child");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1018, af_none, "Add child", "Hierarchy", "Add child {0}, <i>Transform: {1}</i>", "Adds a picked objects of a selected type as children of this one(must be a valid Q3D type), any transformations of the object affect the child, the child has local position/rotation", "ObjAddChild");

AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1019, af_none, "Change parent to scene", "Hierarchy", "Change parent to <b>current scene</b>, <i>Transform: {0}</i>", "Changes the parent of the object to the current scene", "ObjParentScene");

AddComboParamOption("On (filled)");
AddComboParamOption("On (wire)");
AddComboParamOption("Off");
AddComboParam("Debug", "Choose whether or not to show the Collision Grid Debug (will only appear if you have conditions which use it)", 2);
AddNumberParam("Cell x size", "Integer value representing the X size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell y size", "Integer value representing the Y size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell z size", "Integer value representing the Z size the collision grid cells", initial_string = "1000");
AddAction(1020, af_deprecated, "Coll. grid settings", "Collisions", "Set collision grid dimensions to <i>({1},{2},{3})</i> and turn debug <b>{0}</b>", "Make changes to the collision grid used to accelerate collision queries for this object type", "CollGridSettings");

AddNumberParam("X", "World space X position for object to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "World space Y position for object to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "World space Z position for object to look at in z-axis units.", initial_string = "0")
AddAction(1021, af_none, "Look at (world space)", "Rotation", "Look towards <i>world space</i> position ({0},{1},{2}).", "Make the object +Z (blue axis line) look towards a point in world space using up vector in world space.", "ObjLookAtWorld");

AddNumberParam("X", "X position in world space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in world space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in world space z-axis units.", initial_string = "0")
AddAction(1022, af_none, "Set position (world space)", "Position", "Set position to <i>world space</i> coordinates ({0},{1},{2}).", "Set the position of the object in world space coordinates.(the calculations done to transform the position to world space are intensive, use only if necessary)", "ObjSetPosWorld");

AddNumberParam("X", "X position in local space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in local space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in local space z-axis units.", initial_string = "0")
AddAction(1023, af_none, "Set position (local space)", "Position", "Set position to <i>local space</i> coordinates ({0},{1},{2}).", "Set the position of the object in local space coordinates.(the calculations done to transform the position to local space are intensive, use only if necessary)", "ObjSetPosLocal");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Expressions ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AddExpression(1000, ef_return_number, "X position", "Position", "x", "Return the parent space x positon of the object (fast)");
AddExpression(1001, ef_return_number, "Y position", "Position", "y", "Return the parent space y positon of the object (fast)");
AddExpression(1002, ef_return_number, "Z position", "Position", "z", "Return the parent space z positon of the object (fast)");

AddExpression(1003, ef_return_number, "World x position", "Position", "xw", "Return the world space x positon of the object (slow)");
AddExpression(1004, ef_return_number, "World y position", "Position", "yw", "Return the world space y positon of the object (slow)");
AddExpression(1005, ef_return_number, "World z position", "Position", "zw", "Return the world space z positon of the object (slow)");

AddExpression(1006, ef_return_number, "Euler x rotation", "Rotation", "Rx", "Return the x component of rotation using euler angles");
AddExpression(1007, ef_return_number, "Euler y rotation", "Rotation", "Ry", "Return the y component of rotation using euler angles");
AddExpression(1008, ef_return_number, "Euler z rotation", "Rotation", "Rz", "Return the z component of rotation using euler angles");

AddExpression(1009, ef_return_string, "Euler rotation order", "Rotation", "Ro", "Return the euler angles rotation order");

AddExpression(1010, ef_return_number, "X scale", "Scale", "Sx", "Return the local x scale of the object");
AddExpression(1011, ef_return_number, "Y scale", "Scale", "Sy", "Return the local y scale of the object");
AddExpression(1012, ef_return_number, "Z scale", "Scale", "Sz", "Return the local z scale of the object");

AddExpression(1013, ef_return_number, "Normalized tangent vector x", "Pointing", "nTx", "Return the x component of the normalized tangent (local z axis) in world space");
AddExpression(1014, ef_return_number, "Normalized tangent vector y", "Pointing", "nTy", "Return the y component of the normalized tangent (local z axis) in world space");
AddExpression(1015, ef_return_number, "Normalized tangent vector z", "Pointing", "nTz", "Return the z component of the normalized tangent (local z axis) in world space");

AddExpression(1016, ef_return_number, "Normalized normal vector x", "Pointing", "nNx", "Return the x component of the normalized normal (local y axis) in world space");
AddExpression(1017, ef_return_number, "Normalized normal vector y", "Pointing", "nNy", "Return the y component of the normalized normal (local y axis) in world space");
AddExpression(1018, ef_return_number, "Normalized normal vector z", "Pointing", "nNz", "Return the z component of the normalized normal (local y axis) in world space");

AddExpression(1019, ef_return_number, "Normalized binormal vector x", "Pointing", "nBx", "Return the x component of the normalized binormal (local x axis) in world space");
AddExpression(1020, ef_return_number, "Normalized binormal vector y", "Pointing", "nBy", "Return the y component of the normalized binormal (local x axis) in world space");
AddExpression(1021, ef_return_number, "Normalized binormal vector z", "Pointing", "nBz", "Return the z component of the normalized binormal (local x axis) in world space");

AddExpression(1022, ef_return_number, "Tangent vector length", 	"Pointing", "Td", "Return the length of the tangent (local z axis) in world space");
AddExpression(1023, ef_return_number, "Normal vector length", 	"Pointing", "Nd", "Return the length of the normal (local y axis) in world space");
AddExpression(1024, ef_return_number, "Binormal vector length",  "Pointing", "Bd", "Return the length of the binormal (local x axis) in world space");

AddExpression(1025, ef_return_number, "'Up' vector x", "Rotation", "Ux", "Return the parent space x component of the up vector used for lookAt");
AddExpression(1026, ef_return_number, "'Up' vector y", "Rotation", "Uy", "Return the parent space y component of the up vector used for lookAt");
AddExpression(1027, ef_return_number, "'Up' vector z", "Rotation", "Uz", "Return the parent space z component of the up vector used for lookAt");

AddExpression(1028, ef_return_number, "'Up' vector world x", "Rotation", "Uxw", "Return the world space x component of the up vector used for lookAt");
AddExpression(1029, ef_return_number, "'Up' vector world y", "Rotation", "Uyw", "Return the world space y component of the up vector used for lookAt");
AddExpression(1030, ef_return_number, "'Up' vector world z", "Rotation", "Uzw", "Return the world space z component of the up vector used for lookAt");

AddExpression(1031, ef_return_number, "Parent UID", "Hierarchy", "Puid", "Return the uid of this objects direct parent (returns -1 for parent-less objects)");

AddExpression(1032, ef_return_number, "Top level parent UID", "Hierarchy", "TOPuid", "Return the uid of this objects top parent before the scene (returns -1 for parent-less objects)");

AddExpression(1033, ef_return_string, "Parent scene name", "Hierarchy", "scene", "Return the name of the scene this object is in");

AddNumberParam("index from 0 to 15");
AddExpression(1034, ef_return_number, "Model matrix element", "Matrix", "mM", "Return the value of an entry in the model matrix (a value from 0 - 15, column-major, see three.js matrix.elements)");

AddNumberParam("index from 0 to 15");
AddExpression(1035, ef_return_number, "World matrix element", "Matrix", "mW", "Return the value of an entry in the world matrix (a value from 0 - 15, column-major, see three.js matrix.elements)");

};