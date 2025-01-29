// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3DRaycaster = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3DRaycaster.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.scene = this.runtime.Q3D.scene;
		this.Ray_numObj = 0;
		
		this.Ray_index = -1;
		
		/*this.Ray_originX = 0;
		this.Ray_originY = 0;
		this.Ray_originZ = 0;
		
		this.Ray_dirX = 0;
		this.Ray_dirY = 0;
		this.Ray_dirZ = 0;*/
		
		this.Ray_nX = 0;
		this.Ray_nY = 0;
		this.Ray_nZ = 1;
		
		this.Ray_distance = 0;
		
		this.Ray_pointX = 0;
		this.Ray_pointY = 0;
		this.Ray_pointZ = 0;
		
		this.Ray_MatIndex = -1;
		
		if(this.recycled){
			this.ObjectsToRayPick.length = 0;
			this.intersects.length = 0;
		}else{
			this.ObjectsToRayPick = [];
			this.intersects = [];
			this.raycaster = new THREE.Raycaster();
		}
		
		this.raycaster.precision = 10; 
		this.raycaster.near = 0;
		this.raycaster.far = 0;
		this.raycaster.ray.origin.set(0,0,0);
		this.raycaster.ray.direction.set(0,0,0);
		
		/**BEGIN-PREVIEWONLY**/
		if(this.properties[0] === 0){ // debug stuff
		    var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			geometry.vertices.push(new THREE.Vector3(0, 0, 1));
			var material = new THREE.LineBasicMaterial({color: 0xFF8C00});
			this.lineDebug = new THREE.Line(geometry, material);
			this.scene.add(this.lineDebug);
			this.runtime.tick2Me(this);
			this.lineDebugCast = false;
		};
		/**END-PREVIEWONLY**/
		
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.tick2 = function()
	{
		if(this.lineDebugCast ){
		this.lineDebug.position.set(

		this.raycaster.ray.origin.x+this.raycaster.ray.direction.x*this.raycaster.near,
		this.raycaster.ray.origin.y+this.raycaster.ray.direction.y*this.raycaster.near,
		this.raycaster.ray.origin.z+this.raycaster.ray.direction.z*this.raycaster.near
		)
		this.lineDebug.scale.set(1,1,Math.max(this.raycaster.far-this.raycaster.near,0));
		THREE.TSH.vec0.copy(this.raycaster.ray.direction);
		THREE.TSH.vec0.add(this.lineDebug.position);
		this.lineDebug.lookAt ( THREE.TSH.vec0 );
		}else{
		this.lineDebug.scale.set(0,0,0);
		};
		this.lineDebugCast = false;
	};
	/**END-PREVIEWONLY**/
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	/**BEGIN-PREVIEWONLY**/
	if(this.lineDebug) this.lineDebug.parent.remove;
	/**END-PREVIEWONLY**/
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		/*propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		/*if (name === "My property")
			this.myProperty = value;*/
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.PickByRaycast = function (type,step,min,max)
	{
		/**BEGIN-PREVIEWONLY**/
		this.lineDebugCast = true;
		/**END-PREVIEWONLY**/
		var sol = type.getCurrentSol();
		var objList
		if(sol.select_all){
			objList = sol.type.instances;
		}else{
			objList = sol.instances;
		}
		
		// filter sol for objects that have models to test against and which are part of the proper scene.
		
		var i
		this.ObjectsToRayPick.length = 0;
		
		for(i = objList.length-1 ; i>-1 ; i--){
			if(objList[i].model && objList[i].scene === this.scene){
				this.ObjectsToRayPick.push(objList[i].model);
			};
		};
		
		this.raycaster.near = min;	
		this.raycaster.far = max;
		this.raycaster.precision = step;		
		
		this.raycaster.intersectObjectsPASS( this.ObjectsToRayPick, true , this.intersects ); //recursive flag set to true so it works with weird obj models
		
		sol.select_all = false
		sol.instances.length = 0;

		var len = this.intersects.length;
			
		this.Ray_numObj = len;
			
		this.Ray_index = -1;
		
		if(this.intersects[0]){
		
		var P
		
		if(this.intersects[0].object.parent.userData.inst){
			P = this.intersects[0].object.parent.userData.inst
		}else{
			P = this.intersects[0].object.parent
			while(!P.userData.inst){
				P = P.parent				
			};
			P = P.userData.inst;
		};
		
		sol.instances.push(P);
		
		this.Ray_index = 0;
		this.Ray_distance = this.intersects[0].distance;
			
		this.Ray_pointX = this.intersects[0].point.x;
		this.Ray_pointY = this.intersects[0].point.y;
		this.Ray_pointZ = this.intersects[0].point.z;
		
		this.Ray_MatIndex = this.intersects[0].face.materialIndex;
		
		//var normalMatrix = new THREE.Matrix3().getNormalMatrix( this.intersects[0].object.matrixWorld );
		//if(this.intersects[0].face){
		//var worldNormal = this.intersects[0].face.normal.clone().applyMatrix3( normalMatrix ).normalize();
		P.fastWorldUpdate();
		THREE.TSH.vec0.copy(this.intersects[0].face.normal)
		THREE.TSH.mtx30.getNormalMatrix( this.intersects[0].object.matrixWorld )
		THREE.TSH.vec0.applyMatrix3(THREE.TSH.mtx30);
		THREE.TSH.vec0.normalize();
		
		this.Ray_nX = THREE.TSH.vec0.x;
		this.Ray_nY = THREE.TSH.vec0.y;
		this.Ray_nZ = THREE.TSH.vec0.z;
		//};
		
		return true
		};
	
		return false;
	};
	
	Cnds.prototype.LoopByRaycast = function (type,step,min,max)
	{
		/**BEGIN-PREVIEWONLY**/
		this.lineDebugCast = true;
		/**END-PREVIEWONLY**/
		var sol = type.getCurrentSol();
		var objList
		if(sol.select_all){
			objList = sol.type.instances;
		}else{
			objList = sol.instances;
		}
		
		// filter sol for objects that have models to test against and which are part of the proper scene.

		var i
		this.ObjectsToRayPick.length = 0;
		
		for(i = objList.length-1 ; i>-1 ; i--){
			if(objList[i].model && objList[i].scene === this.scene){
				this.ObjectsToRayPick.push(objList[i].model);
			};
		};
		
		this.raycaster.near = min;	
		this.raycaster.far = max;
		this.raycaster.precision = step;		
		
		this.raycaster.intersectObjectsPASS( this.ObjectsToRayPick, true , this.intersects ); //recursive flag set to true so it works with weird obj models
		
		sol.select_all = false
		sol.instances.length = 0;

		var len = this.intersects.length;
			
		this.Ray_numObj = len;
			
		this.Ray_index = -1;
		
		for (var i = 0; i < len; i++) {

		var P
		
		if(this.intersects[i].object.parent.userData.inst){
			P = this.intersects[i].object.parent.userData.inst
		}else{
			P = this.intersects[i].object.parent
			while(!P.userData.inst){
				P = P.parent				
			};
			P = P.userData.inst;
		};
		
		sol.instances.push(P);
	
		this.Ray_index = i;
		this.Ray_distance = this.intersects[i].distance;
			
		this.Ray_pointX = this.intersects[i].point.x;
		this.Ray_pointY = this.intersects[i].point.y;
		this.Ray_pointZ = this.intersects[i].point.z;
		
		this.Ray_MatIndex = this.intersects[i].face.materialIndex;
		
		//var normalMatrix = new THREE.Matrix3().getNormalMatrix( this.intersects[i].object.matrixWorld );
		//if(this.intersects[i].face){
		//var worldNormal = this.intersects[i].face.normal.clone().applyMatrix3( normalMatrix ).normalize();
		P.fastWorldUpdate();
		THREE.TSH.vec0.copy(this.intersects[i].face.normal)
		THREE.TSH.mtx30.getNormalMatrix( this.intersects[i].object.matrixWorld )
		THREE.TSH.vec0.applyMatrix3(THREE.TSH.mtx30);
		THREE.TSH.vec0.normalize();
		
		this.Ray_nX = THREE.TSH.vec0.x;
		this.Ray_nY = THREE.TSH.vec0.y;
		this.Ray_nZ = THREE.TSH.vec0.z;
		//};
		
		this.runtime.getCurrentEventStack().current_event.retrigger();
		};
	
		return false;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.SetScene = function ()
	{
		this.scene = this.runtime.Q3D.scene;
		
		/**BEGIN-PREVIEWONLY**/
		if(this.lineDebug){
			this.lineDebug.parent.remove(this.lineDebug);
			this.scene.add(this.lineDebug);
		};
		/**END-PREVIEWONLY**/
	};
	
	Acts.prototype.SetRayPos = function (x,y,z)
	{
		this.raycaster.ray.origin.set(x,y,z);
	};
	
	Acts.prototype.SetRayDir = function (x,y,z)
	{
		this.raycaster.ray.direction.set(x,y,z);
		this.raycaster.ray.direction.normalize();
	};
	
	Acts.prototype.SetRayDirToward = function (x,y,z)
	{
		this.raycaster.ray.direction.set(x,y,z);
		this.raycaster.ray.direction.sub(this.raycaster.ray.origin);
		this.raycaster.ray.direction.normalize();
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.scene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(this.scene.name);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.x = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.origin.x);			// for returning floats
	};
	
	Exps.prototype.y = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.origin.y);			// for returning floats
	};
	
	Exps.prototype.z = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.origin.z);			// for returning floats
	};
	
	Exps.prototype.rDx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.direction.x);			// for returning floats
	};
	
	Exps.prototype.rDy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.direction.y);			// for returning floats
	};
	
	Exps.prototype.rDz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.raycaster.ray.direction.z);			// for returning floats
	};
	
	Exps.prototype.rNx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_nX);			// for returning floats
	};
	
	Exps.prototype.rNy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_nY);			// for returning floats
	};
	
	Exps.prototype.rNz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_nZ);			// for returning floats
	};
	
	Exps.prototype.rPx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_pointX);			// for returning floats
	};
	
	Exps.prototype.rPy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_pointY);			// for returning floats
	};
	
	Exps.prototype.rPz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_pointZ);			// for returning floats
	};
	
	Exps.prototype.rDist = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_distance);			// for returning floats
	};
	
	Exps.prototype.rLoopLength = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.Ray_numObj);			// for returning floats
	};
	
	Exps.prototype.rLoopIndex = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.Ray_index);			// for returning floats
	};
	
	Exps.prototype.rMatIndex = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.Ray_MatIndex);			// for returning floats
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());