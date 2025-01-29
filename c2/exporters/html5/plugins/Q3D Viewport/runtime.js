// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3Dviewp = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3Dviewp.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		this.runtime.Q3D.raycaster = new THREE.Raycaster(); // this has to be in the type declaration, this.runtime.Q3D is not always created before this plugin.
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
	
	this.Ray_numObj = 0;
	
	this.Ray_index = -1;
	
	this.Ray_originX = 0;
	this.Ray_originY = 0;
	this.Ray_originZ = 0;
	
	this.Ray_dirX = 0;
	this.Ray_dirY = 0;
	this.Ray_dirZ = 0;
	
	this.Ray_nX = 0;
	this.Ray_nY = 0;
	this.Ray_nZ = 1;
	
	this.Ray_distance = 0;
	
	this.Ray_pointX = 0;
	this.Ray_pointY = 0;
	this.Ray_pointZ = 0;
	
	this.Ray_MatIndex = -1;
	
	//alert("[Q3D Viewport] Scene : ''"+scene+"'' doesn't exist, create it with 'add scene'")
	//alert("[Q3D Viewport] Camera : ''"+camera+"'' doesn't exist, create it with 'add camera'")
	//if(this.runtime.Q3D.viewports.Default) delete this.runtime.Q3D.viewports.Default;
	this.runtime.Q3D.viewportsEnabled = true;
	this.scene = this.properties[2];
	this.camera = this.properties[3];
	//if(!this.runtime.Q3D.sceneDic[this.scene]){this.scene = default;} //set to an existing scene?
	//if(!this.runtime.Q3D.cameraDic[this.camera]){this.camera = default;} // set to an existing camera?
	this.trx = (this.x+(1-this.hotspotX)*this.width)/this.runtime.original_width
	this.try_ =  1-(this.y-this.hotspotY*this.height)/this.runtime.original_height
	this.blx = (this.x-this.hotspotX*this.width)/this.runtime.original_width
	this.bly = 1-(this.y+(1-this.hotspotY)*this.height)/this.runtime.original_height
	this.visible = (this.properties[0] === 0);
	
	this.runtime.Q3D.viewports[(this.uid)] = [this.blx, this.bly, this.trx, this.try_, this.scene, this.camera,this.zindex, this.visible];
	this.runtime.tickMe(this);
	//alert(this.hotspotX)
	//this.runtime.Q3D.viewports[toString(this.uid)] = [0, 0, 0.5, 0.5,"Default","Default",0];
	//alert(this.runtime.Q3D.viewports[this.uid]);
	this.runtime.Q3D.orderViewportZarray();	

	this.update_bbox = this.update_bbox_shim;
	
	if(this.recycled){
		this.ObjectsToRayPick.length = 0;
		this.intersects.length = 0;
	}else{
		this.ObjectsToRayPick = [];
		this.intersects = [];
	}

	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.tick = function ()
	{
	this.trx = (this.x+(1-this.hotspotX)*this.width)/this.runtime.original_width
	this.try_ =  1-(this.y-this.hotspotY*this.height)/this.runtime.original_height
	this.blx = (this.x-this.hotspotX*this.width)/this.runtime.original_width
	this.bly = 1-(this.y+(1-this.hotspotY)*this.height)/this.runtime.original_height

	this.runtime.Q3D.viewports[(this.uid)][0] = this.blx;
	this.runtime.Q3D.viewports[(this.uid)][1] = this.bly;
	this.runtime.Q3D.viewports[(this.uid)][2] = this.trx;
	this.runtime.Q3D.viewports[(this.uid)][3] = this.try_;
	if(this.runtime.Q3D.viewports[(this.uid)][6]!==this.zindex){
	this.runtime.Q3D.viewports[(this.uid)][6] = this.zindex;
	this.runtime.Q3D.orderViewportZarray();	// does it really matter if this is called a lot?
	}
	
	//this.runtime.Q3D.viewports[(this.uid)][7] = this.visible;
	
	
	};
	
	
	instanceProto.onDestroy = function ()
	{
	delete this.runtime.Q3D.viewports[this.uid];
	
	var count = 0, key;
	
	for (key in this.runtime.Q3D.viewports){ count++; }
	
	if(count === 0) 
		this.runtime.Q3D.viewportsEnabled = false;
	else 
		this.runtime.Q3D.orderViewportZarray();	
	};
	
	instanceProto.update_bbox_shim = function ()
	{
	// take advantage of the fact position/angle etc aces call update_bbox, but need to modify it so i'm using this function to replace it;
	if (!this.bbox_changed)
	return;
	
	this.trx = (this.x+(1-this.hotspotX)*this.width)/this.runtime.original_width
	this.try_ =  1-(this.y-this.hotspotY*this.height)/this.runtime.original_height
	this.blx = (this.x-this.hotspotX*this.width)/this.runtime.original_width
	this.bly = 1-(this.y+(1-this.hotspotY)*this.height)/this.runtime.original_height

	this.runtime.Q3D.viewports[(this.uid)][0] = this.blx;
	this.runtime.Q3D.viewports[(this.uid)][1] = this.bly;
	this.runtime.Q3D.viewports[(this.uid)][2] = this.trx;
	this.runtime.Q3D.viewports[(this.uid)][3] = this.try_;
	//alert("test")
	cr.update_bbox.call(this); // this works I think (hopefully)

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

	// the example condition
	
	Cnds.prototype.IsVisible = function ()
	{
		return this.visible;
	};

	Cnds.prototype.PointInFrame = function (absX,absY)
	{
		this.update_bbox();
		var coordsx,coordsy
		var Q3D = this.runtime.Q3D
		
		coordsx = (((absX - Q3D.Cblx)/(Q3D.Ctrx-Q3D.Cblx) - this.blx)/(this.trx-this.blx))*2 - 1
		coordsy = (((absY - Q3D.Cbly)/(Q3D.Ctry-Q3D.Cbly)- this.bly)/(this.try_-this.bly))*2 - 1
		
		//alert(Q3D.Cblx)
		
		return !(coordsx > 1 || coordsx < -1 || coordsy > 1 || coordsy < -1);
	};
	
	Cnds.prototype.PickByProjection = function (type,absX,absY,step,min,max)
	{
		this.update_bbox();
		// first generate the correct type of screen position to check; (this is going to be tricky if i want it to work in all cases, i removed q3dviewport angles cause there's no real point...)
		var coordsx,coordsy
		var Q3D = this.runtime.Q3D
		

		coordsx = (((absX - Q3D.Cblx)/(Q3D.Ctrx-Q3D.Cblx) - this.blx)/(this.trx-this.blx))*2 - 1
		coordsy = (((absY - Q3D.Cbly)/(Q3D.Ctry-Q3D.Cbly)- this.bly)/(this.try_-this.bly))*2 - 1

		
		var cam = this.runtime.Q3D.cameraDic[this.camera] // combined camera might break code
		if(!cam) return false;
		cam.updateMatrixWorld();
		var raycaster = this.runtime.Q3D.raycaster
		raycaster.pickingRaySHIM( coordsx, coordsy, cam );
		
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
			if(objList[i].model && objList[i].scene.name === this.scene){
				this.ObjectsToRayPick.push(objList[i].model);
			};
		};
		
		raycaster.near = min;	
		raycaster.far = max;
		raycaster.precision = step;		
		
		raycaster.intersectObjectsPASS( this.ObjectsToRayPick, true, this.intersects ); //recursive flag set to true so it works with weird obj models
		
		sol.select_all = false
		sol.instances.length = 0;

		var len = this.intersects.length;
			
		this.Ray_numObj = len;
			
		this.Ray_index = -1;
		
		this.Ray_originX = raycaster.ray.origin.x;
		this.Ray_originY = raycaster.ray.origin.y;
		this.Ray_originZ = raycaster.ray.origin.z;
		
		this.Ray_dirX = raycaster.ray.direction.x;
		this.Ray_dirY = raycaster.ray.direction.y;
		this.Ray_dirZ = raycaster.ray.direction.z;
		
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
	
	Cnds.prototype.LoopByProjection = function (type,absX,absY,step,min,max)
	{
		this.update_bbox();
		// first generate the correct type of screen position to check; (this is going to be tricky if i want it to work in all cases, i removed q3dviewport angles cause there's no real point...)
		var coordsx,coordsy
		var Q3D = this.runtime.Q3D
		

		coordsx = (((absX - Q3D.Cblx)/(Q3D.Ctrx-Q3D.Cblx) - this.blx)/(this.trx-this.blx))*2 - 1
		coordsy = (((absY - Q3D.Cbly)/(Q3D.Ctry-Q3D.Cbly)- this.bly)/(this.try_-this.bly))*2 - 1

		
		var cam = this.runtime.Q3D.cameraDic[this.camera] // combined camera might break code
		if(!cam) return false;
		cam.updateMatrixWorld();
		var raycaster = this.runtime.Q3D.raycaster
		raycaster.pickingRaySHIM( coordsx, coordsy, cam );
		
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
			if(objList[i].model && objList[i].scene.name === this.scene){
				this.ObjectsToRayPick.push(objList[i].model);
			};
		};
		
		raycaster.near = min;	
		raycaster.far = max;
		raycaster.precision = step;		
		
		raycaster.intersectObjectsPASS( this.ObjectsToRayPick, true , this.intersects); //recursive flag set to true so it works with weird obj models
		
		sol.select_all = false
		sol.instances.length = 0;

		var len = this.intersects.length;
			
		this.Ray_numObj = len;
			
		this.Ray_index = -1;
		
		this.Ray_originX = raycaster.ray.origin.x;
		this.Ray_originY = raycaster.ray.origin.y;
		this.Ray_originZ = raycaster.ray.origin.z;
		
		this.Ray_dirX = raycaster.ray.direction.x;
		this.Ray_dirY = raycaster.ray.direction.y;
		this.Ray_dirZ = raycaster.ray.direction.z;

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
	
	Acts.prototype.SetVisible = function (v)
	{
		if (!v !== !this.visible)
		{

			this.visible = v;
			this.runtime.Q3D.viewports[(this.uid)][7] = this.visible;
			this.runtime.Q3D.orderViewportZarray();

		}
	};
	
	Acts.prototype.SetScene = function (scene)
	{
		this.scene = scene;
		this.runtime.Q3D.viewports[(this.uid)][4] = this.scene;
	};
	
	Acts.prototype.SetCamera = function (camera)
	{
		this.camera = camera;
		this.runtime.Q3D.viewports[(this.uid)][5] = this.camera;
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	
	Exps.prototype.scene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(this.scene);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.camera = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(this.camera);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.rOx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_originX);			// for returning floats
	};
	
	Exps.prototype.rOy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_originY);			// for returning floats
	};
	
	Exps.prototype.rOz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_originZ);			// for returning floats
	};
	
	Exps.prototype.rDx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_dirX);			// for returning floats
	};
	
	Exps.prototype.rDy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_dirY);			// for returning floats
	};
	
	Exps.prototype.rDz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.Ray_dirZ);			// for returning floats
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