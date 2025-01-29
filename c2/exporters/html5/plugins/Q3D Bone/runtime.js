// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3DBone = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3DBone.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		

		
		//THREE.Q3D.BoneType = this;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
		// needs to be here, ughh C2 renames types on export.....
		//alert(this.name);
		
		
		//this.runtime.Q3D.boneTypes[this.name] = this; // can't use names because they change, which is stupid but not something i can do anything about.
		this.runtime.Q3D.boneTypes[this.runtime.Q3D.boneTypesIndex] = this;
		this.runtime.Q3D.boneTypesIndex ++;
		
		this.collision_grid3D = new THREE.TSH.SparseGrid3D(1000, 1000, 1000, this);
		this.any_cell3D_changed = true; // initialize the grid.
	
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		this.update_collision_cell3D = THREE.TSH.update_collision_cell3D;
		this.update_bbox3D = THREE.TSH.update_bbox3D;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.setupCollider = function(colliderType)
	{

		this.collisionsEnabled  = true;
		this.col.type.sphere = false;
		this.col.type.AABB = false;
		this.col.type.OBB = false;
		this.col.type.colliderType = colliderType;
		
		switch(colliderType)
			{
			case 0: //none
				this.collisionsEnabled  = false;
				
				break;
			case 1: //sphere
				this.col.type.sphere = true;
				
				break;
			case 2: //AABB
				this.col.type.AABB = true;
				
				break;
			case 3: // Box
				this.col.type.OBB = true;
				
				break;
			case 4: //ellipsoid

				break;
			};
		
		// mesh used if debug is enabled
		//this.colDebug = null;
		
		// if collider debug enabled
		if(this.properties[6] === 0){
		var maty;
		//this.col.visible = true;
		maty = new THREE.MeshPhongMaterial({color : this.debugColor, emissive: 0x111111});
		
		this.runtime.tick2Me(this);
		
			switch(colliderType)
			{
			case 0: //none
				//this.col = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshPhongMaterial({shading: THREE.FlatShading}));
				//this.collisionsEnabled  = false;
				break;
			case 1: //sphere
				this.colDebug = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), maty);
				this.scene.add(this.colDebug);
				//this.obj.colDebugAddedFlag = true;
				break;
			case 2: //AABB
				this.colDebug = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1), maty);
				this.scene.add(this.colDebug);
				//this.obj.colDebugAddedFlag = true;
				break;
			case 3: //Box
				this.colDebug = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1), maty);
				this.col.add(this.colDebug);
				//this.col.colDebugAddedFlag = true;
				break;
			case 4://Ellipsoid
				this.colDebug = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), maty);
				this.col.add(this.colDebug);
				//this.col.colDebugAddedFlag = true;
				break;
			};					
			
		};
		
		this.col.scale.set(this.width,this.height,this.properties[5]);
	
	};
		

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	
		//var strj= ""
		//for(var key in window) strj += key+"\n"
		//alert(strj)
	
		this.setupObj(true,true);
		this.visible = false // force renderer to early out of drawing;
		//this.obj.debugAddedFlag = false;
		this.skeleParent = undefined;
		//this.obj.position.set(this.x,this.y,this.properties[1])
		//this.obj.scale.set(this.width,this.height,this.properties[5]);
		//this.obj.rotation.order = this.properties[2];
		//this.obj.rotation.set(this.properties[3]*(THREE.Deg2Rad),this.properties[4]*(THREE.Deg2Rad),this.angle);
		//alert(this.width)
		this.obj.position.set(0,0,0)
		this.obj.scale.set(1,1,1)
		this.obj.quaternion.set(0,0,0,1)
		//this.obj.rotation.set(0,0,0); should be unnecessary
		
		this.obj.visible = this.properties[0] === 0;
		
		if(this.properties[6] === 0 || this.properties[7] === 0) this.debugColor = Math.random()*(16777215-10000000)+10000000
		
		if(this.recycled){

			this.collcells3Dt.min.set(0,0,0);
			this.collcells3Dt.max.set(-1,-1,-1);

		}else{
		
			this.col.geometry = new THREE.BoxGeometry(1,1,1,1,1,1) // this has to change...
			this.collcells3Dt = new THREE.Box3( new THREE.Vector3(0,0,0) , new THREE.Vector3(-1,-1,-1));
			this.col.geometry.boundingSphere = new THREE.Sphere();
			this.col.geometry.boundingBox = new THREE.Box3();
			this.col.type = {}; // create new object
			this.col.AbsRotationMatrix = new THREE.Matrix4();
			this.col.InverseMatrix = new THREE.Matrix3();
			this.col.AbsPosition = new THREE.Vector3();
			this.col.AbsScale = new THREE.Vector3();
			this.col.decompose = THREE.TSH.decompose;
		
		};
		
		this.setupCollider(this.properties[8]);
		this.obj.add(this.col);
		
		//if(!this.recycled)	this.col = new THREE.Object3D();
		
		/*if(this.properties[6] === 0){
		
			// box for visualization
			//this.box = new THREE.OldBoxHelper();
			
			//var geometry = new THREE.SphereGeometry( 1, 4, 2 );
			//var material = new THREE.MeshLambertMaterial( { wireframe: false, fog: false } );
			
			//this.box = new THREE.Mesh(geometry,material);
			
			//this.box.scale.set(this.width,this.height,this.properties[5]);
			//this.box.material.color.setRGB( 1, 1, 1 );
			//this.obj.add(this.box);
			
			// axis helper for visualization
			this.axis = new THREE.AxisHelper(1);
			this.obj.add(this.axis);
			this.axis.scale.set(10/this.obj.scale.x,10/this.obj.scale.y,10/this.obj.scale.z);
			
			//this.obj.debugAddedFlag = true;
			
			this.runtime.tick2Me(this);
		
		};*/
		
		if(this.properties[7] === 0){
		
			var div = this.debugFloatText = document.createElement("div");
			div.style.background = "black";
			div.style.color = '#'+Math.floor(this.debugColor).toString(16);
			div.style.position = "absolute";
			div.style.width = "auto"
			div.style.height = "auto"
			div.style.fontFamily = "Arial"
			
			document.body.appendChild(this.debugFloatText)	
			
			this.runtime.tick2Me(this);
			
		}
		
		//this.runtime.Q3D.scene.add(this.obj); // not needed
		//this.obj.matrixWorld.set(1,0,0,0,   0,1,0,0,   0,0,1,0,  0,0,0,1)
		//this.set_bbox3D_changed()
		//this.fastWorldUpdate();
		
		this.obj.updateMatrixWorld(true);
		
		// fast world update here is broken for some reason (??? no idea why)
		//this.fastWorldUpdate();
		
		if(this.box){ 
			this.box.matrixAutoUpdate = true; // this looks nicer, parenting doesn't mess up the axial scaling, as the tree updates but not the bbox
			this.axis.matrixAutoUpdate = true;
		};// this too
	
	// some kind of auto destroy for non-skeletal bones would be nice, a global flag perhaps?
	//this.runtime.DestroyInstance(this);
		// special flag so there's no starting bone.
		if(!THREE.Q3D.Runtime.BONECREATINGFLAG){
		this.runtime.Q3D.scene.add(this.obj); // just so stuff doesn't screw up;
		this.runtime.DestroyInstance(this);
		//return;
		};	
	
	};
	
	instanceProto.tick2 = function () //called after events
	{
		//this.set_bbox3D_changed(); // need some kind of custom hook to notify collider of update when skeleton runs
		
		if(this.colDebug){
			
			if(this.col.type.sphere){ //sphere

			this.update_bbox3D();
			
			this.colDebug.position.copy(this.col.geometry.boundingSphere.center);
			this.colDebug.scale.set(this.col.geometry.boundingSphere.radius,this.col.geometry.boundingSphere.radius,this.col.geometry.boundingSphere.radius);

			};
			
			if(this.col.type.AABB){ //AABB

			this.update_bbox3D();
			
			this.colDebug.position.set((this.col.geometry.boundingBox.min.x+this.col.geometry.boundingBox.max.x)/2,(this.col.geometry.boundingBox.min.y+this.col.geometry.boundingBox.max.y)/2,(this.col.geometry.boundingBox.min.z+this.col.geometry.boundingBox.max.z)/2)
			this.colDebug.scale.copy( this.col.geometry.boundingBox.size() );

			};
		
		};
		
		if(this.axis) this.axis.scale.set(10/this.obj.scale.x,10/this.obj.scale.y,10/this.obj.scale.z);

		if(this.debugFloatText){
						
			var div = this.debugFloatText
			div.innerHTML = this.obj.name; // the text in the div
			var e = this.obj.matrixWorld.elements
			var v3 = THREE.TSH.vec0.set(e[12],e[13],e[14]);
			var pm = this.runtime.Q3D.cameraForRender.projectionMatrix
			this.runtime.Q3D.cameraForRender.updateProjectionMatrix();
			var parent =  this.runtime.canvas.parentNode;
			v3.project ( this.runtime.Q3D.cameraForRender )
			var rect = parent.getBoundingClientRect();
			var textsizer = cr.clamp((1-v3.z)*20000,0,12);
			div.style.fontSize = textsizer+"px"
			div.style.zIndex = Math.round((1-v3.z)*100000)+'';
			var xs = (rect.left+rect.right)/2 + (v3.x*(rect.right-rect.left)/2)-div.clientWidth/2
			var ys = (rect.top+rect.bottom)/2 + (v3.y*(rect.top-rect.bottom)/2)-div.clientHeight/2
			div.style.left = cr.clamp(xs,rect.left,rect.right) + "px"
			div.style.top = cr.clamp(ys,rect.top,rect.bottom) + "px"
			var xst =  (rect.left+rect.right)/2 + (v3.x*(rect.right-rect.left)/2) - 50
			var yst =  (rect.top+rect.bottom)/2 + (v3.y*(rect.top-rect.bottom)/2) - 10
			if(xst <= rect.left || xst >= rect.right-150 || yst <= rect.top || yst >= rect.bottom-20) div.style.display = "none"
			else div.style.display = ""
		
		}
		
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	
	this.obj.colupd = false;
	
	
	if(this.debugFloatText){
	this.debugFloatText.parentNode.removeChild(this.debugFloatText)
	this.debugFloatText = null;
	}
	
	//alert('boned')
	this.obj.parent.remove(this.obj);
	
	if(this.box){
		this.obj.remove(this.box);
		this.obj.remove(this.axis);
		this.box = null;
		this.axis = null;
	};
	
	this.obj.frustumCulled = true;
	
	/*if(this.traversingResetFlag){
	
		this.obj.frustumCulled = true;
		
		this.obj.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.frustumCulled = true;
				child.castShadow = false;
				child.receiveShadow = false;
							
			}
		} );
	};*/
	
	/*for ( var i = this.obj.children.length-1; i > 0; i -- ) { //iterate backwards or remove messes up!
		
		if(this.obj.children[ i ].userData.inst){ 
		//alert("called DestroyInstance : "+this )
		this.runtime.DestroyInstance(this.obj.children[ i ].userData.inst); //recursively destroy all Q3D type objects with the userData.inst flag/ref
		}

	};*/
	
	if(this.colDebug){
	this.colDebug.parent.remove(this.colDebug);
	this.colDebug = null;
	};
	
	this.type.collision_grid3D.update(this, this.collcells3Dt, null);
	
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

		// ... other conditions here ...
		
	Cnds.prototype.PickBoneByName = function (animname)
	{
		return this.obj.name === animname; // this is all I really need isn't it
	};
	
	Cnds.prototype.PickSkeleModel = function (type)
	{
		//if(!this.inst.model || type !== this.inst.boneType) return;
		
		var skeleSol = type.getCurrentSol(); // may need to pass in the type, not sure if just having one is a legal move in the c2 engine, I think it isn't.

		skeleSol.select_all = false // we want to provide a custom list of instances, not use the list of all instances

		
		skeleSol.instances = [this.skeleParent]; // select only the current instances bone parent
		// js perf indicated slice() is faster in most browsers http://jsperf.com/duplicate-array-slice-vs-concat/3 
		
		return this.skeleParent !== undefined // that should be all, return true so this condition fires 
		
	};
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// stolen collision stuff from sprite, modified for 3D using modified sparsegrid stuff

	// For the collision memory in 'On collision'.
	var arrCache3D = [];
	
	function allocArr3D()
	{
		if (arrCache3D.length)
			return arrCache3D.pop();
		else
			return [0, 0, 0];
	};
	
	function freeArr3D(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache3D.push(a);
	};
	
	function makeCollKey3D(a, b)
	{
		// comma separated string with lowest value first
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	
	function collmemory_add3D(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;

		var key = makeCollKey3D(a_uid, b_uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			// added already; just update tickcount
			collmemory[key][2] = tickcount;
			return;
		}
		
		var arr = allocArr3D();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	
	function collmemory_remove3D(collmemory, a, b)
	{
		var key = makeCollKey3D(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			freeArr3D(collmemory[key]);
			delete collmemory[key];
		}
	};
	
	function collmemory_removeInstance3D(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				
				// Referenced in either UID: must be removed
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr3D(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	
	var last_coll_tickcount3D = -2;
	
	function collmemory_has3D(collmemory, a, b)
	{
		var key = makeCollKey3D(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount3D = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount3D = -2;
			return false;
		}
	};
	
	var candidates3D = [];
	
	Cnds.prototype.OnCollision = function (rtype)
	{	
		if (!rtype)
			return false;
			
		var runtime = this.runtime;
			
		// Static condition: perform picking manually.
		// Get the current condition.  This is like the 'is overlapping' condition
		// but with a built in 'trigger once' for the l instances.
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		
		// Create the collision memory, which remembers pairs of collisions that
		// are already overlapping
		if (!cnd.extra.collmemory)
		{
			cnd.extra.collmemory = {};
			
			// Since this is one-time initialisation, also add a destroy callback
			// to remove any instance references from memory
			runtime.addDestroyCallback((function (collmemory) {
				return function(inst) {
					collmemory_removeInstance3D(collmemory, inst);
				};
			})(cnd.extra.collmemory));
		}
		
		var collmemory = cnd.extra.collmemory;
		
		// Get the currently active SOLs for both objects involved in the overlap test
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		
		// Iterate each combination of instances
		var l, linst, r, rinst;
		var curlsol, currsol;
		
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		
		// Note: don't cache lengths of linstances or rinstances. They can change if objects get destroyed in the event
		// retriggering.
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			
			if (rsol.select_all)
			{
				linst.update_bbox();
				//this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates);
				THREE.TSH.getCollisionCandidates(rtype, linst.col.geometry.boundingBox , candidates3D);
				rinstances = candidates3D;
			}
			else
				rinstances = rsol.getObjects();
			
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				
				if (THREE.TSH.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has3D(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount3D < lasttickcount));
					
					// objects are still touching so update the tickcount
					collmemory_add3D(collmemory, linst, rinst, tickcount);
					
					if (run)
					{						
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						
						// If ltype === rtype, it's the same object (e.g. Sprite collides with Sprite)
						// In which case, pick both instances
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							// Pick each instance in its respective SOL
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					// Pair not overlapping: ensure any record removed (mainly to save memory)
					collmemory_remove3D(collmemory, linst, rinst);
				}
			}
			
			candidates3D.length = 0;
		}
		
		// We've aleady run the event by now.
		return false;
	};
	
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	
	function DoOverlapCondition3D(rtype, do_offset, oldx,oldy,oldz)
	{
		if (!rtype)
			return false;
			
		//var do_offset = (offx !== 0 || offy !== 0 || offz !== 0);
		var /*oldx, oldy, oldz,*/ ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		
		if (rsol.select_all)
		{
			this.update_bbox3D();
			// this function works by using the current objects bbox to find the rtypes which are in the spatial locations that bbox crosses, i must modify it to work in 3D.
			
			THREE.TSH.getCollisionCandidates(rtype, this.col.geometry.boundingBox , candidates3D);
			rinstances = candidates3D;
			
			
			//rinstances = rtype.instances; // This is basically un-optimized, very slow n^2 test.
		}
		else if (orblock)
			rinstances = rsol.else_instances;
		else
			rinstances = rsol.instances;
		
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		
		/*if (do_offset)
		{
			//oldx = this.obj.position.x;
			//oldy = this.obj.position.y;
			//oldz = this.obj.position.z;
			//this.x += offx;
			//this.y += offy;
			//this.obj.position.set(this.obj.position.x+offx,this.obj.position.y+offy,this.obj.position.z+offz)
			this.set_bbox3D_changed();
		}*/
		
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			
			// objects overlap: true for this instance, ensure both are picked
			// (if ltype and rtype are same, e.g. "Sprite overlaps Sprite", don't pick the other instance,
			// it will be picked when it gets iterated to itself)
			if (THREE.TSH.testOverlap(this, rinst)) 								 /////// modified testOverlap function for 3D objects.
			{
				ret = true;
				
				// Inverted condition: just bail out now, don't pick right hand instance -
				// also note we still return true since the condition invert flag makes that false
				if (inverted)
					break;
					
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		
		if (do_offset)
		{
			//this.x = oldx;
			//this.y = oldy;
			this.obj.position.set(oldx,oldy,oldz);
			this.set_bbox3D_changed();
		}
		
		candidates3D.length = 0;
		return ret;
	};
	
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			
			if (sol.select_all)
			{
				// All selected: filter down to just those in topick
				sol.select_all = false;
				sol.instances.length = topick.length;
			
				for (i = 0, len = topick.length; i < len; i++)
				{
					sol.instances[i] = topick[i];
				}
				
				// In OR blocks, else_instances must also be filled with objects not in topick
				if (orblock)
				{
					sol.else_instances.length = 0;
					
					for (i = 0, len = rpicktype.instances.length; i < len; i++)
					{
						inst = rpicktype.instances[i];
						
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
					sol.instances.length = initsize + topick.length;
				
					for (i = 0, len = topick.length; i < len; i++)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			
			rpicktype.applySolToContainer();
		}
		
		rtopick.clear();
		needscollisionfinish = false;
		
		
	};
	
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition3D.call(this, rtype, false);//, 0, 0, 0);
	};
	
	Cnds.prototype.IsOverlappingOffsetParent = function (rtype, offx, offy, offz)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		this.obj.position.set(this.obj.position.x+offx,this.obj.position.y+offy,this.obj.position.z+offz);
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	Cnds.prototype.IsOverlappingOffsetLocal = function (rtype, vecx, vecy, vecz, amount)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		this.fastWorldUpdate();
		THREE.TSH.vec1.set(vecx,vecy,vecz);
		THREE.TSH.vec1.normalize();
		this.obj.translateOnAxis(THREE.TSH.vec1, amount);
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	// this isn't working right now, need to do some matrix magic i haven't worked out yet
	Cnds.prototype.IsOverlappingOffsetWorld = function (rtype, vecx, vecy, vecz)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		
		if(this.hasQ3DObjParent){
			this.fastWorldUpdate();
			var m1 = THREE.TSH.mtx0;
			var e = this.obj.matrixWorld.elements;
			m1.getInverse(this.obj.parent.matrixWorld);
			THREE.TSH.vec0.set(e[12]+vecx,e[13]+vecy,e[14]+vecz);
			THREE.TSH.vec0.applyMatrix4(m1);
		}
		else{ //parent is scene, or someone glitched everything (hopefully my fail-safes suffice)
			THREE.TSH.vec0.set( this.obj.position.x+vecx, this.obj.position.y+vecy, this.obj.position.z+vecz);
		};
		this.obj.position.copy(THREE.TSH.vec0)
		//alert("test")
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};

//////////////////////////////////////////////////////////////////////		
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// ... other actions here ...
	
	Acts.prototype.ChangeCollider = function (colliderType)
	{
		if(this.col.type.colliderType === colliderType) return; //don't waste time reseting to same collider.
		//alert(this.colDebug)
		if(this.colDebug){
		this.colDebug.parent.remove(this.colDebug);
		this.colDebug = null;
		}
		this.setupCollider(colliderType);
		this.set_bbox3D_changed();		
		//return;
	};
	
	Acts.prototype.ColliderSetScale = function (x,y,z)
	{
		//if() return; //don't waste time reseting to same collider.
		//alert(this.colDebug)

		this.col.scale.set(x,y,z);
		
		this.set_bbox3D_changed();		
		//return;
	};
	
	Acts.prototype.ColliderSetOffset = function (x,y,z)
	{
		//if() return; //don't waste time reseting to same collider.
		//alert(this.colDebug)

		this.col.position.set(x,y,z);
		
		this.set_bbox3D_changed();		
		//return;
	};
	
	Acts.prototype.ColliderSetRotation = function (x,y,z)
	{
		//if() return; //don't waste time reseting to same collider.
		//alert(this.colDebug)

		this.col.rotation.set(x,y,z);
		
		this.set_bbox3D_changed();		
		//return;
	};	
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.BoneName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_string(this.obj.name);			// for returning floats
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();
	
	THREE.TSH.commonACEappend(Cnds,Acts,Exps,instanceProto,typeProto,pluginProto);

}());