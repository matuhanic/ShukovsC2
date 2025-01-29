// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.Q3DOimo = function(runtime)
{
	this.runtime = runtime;
	
	// physics engine, initialize
	this.runtime.QPhys = {};
		
	var Q = this.runtime.QPhys;
	Q.steppingMode = 0; // choose whether dt is used or not.
	
	Q.OV3_0 =new OIMO.Vec3();
	Q.OV3_1 =new OIMO.Vec3();
	Q.OV3_2 =new OIMO.Vec3();

	////// oimo
	
	// The time between each step
	var timestep = 1/60;

	// Algorithm used for collision
	// 1: BruteForceBroadPhase  2: sweep and prune  3: dynamic bounding volume tree
	// default is 2 : best speed and lower cpu use.
	var boardphase = 2;

	// The number of iterations for constraint solvers : default 8.
	var Iterations = 8;

	// calculate statistique or not
	var noStat = false;

	// create oimo world contains all rigidBodys and joint.
	Q.world = new OIMO.World( timestep, boardphase, Iterations, noStat );
	Q.world.gravity = new OIMO.Vec3(0, 9.8, 0);
	Q.world.worldscale(100);
	
	Q.bodys = [];
	// Array to keep reference of three mesh
	Q.bodysBuffer = [];
	//Q.cleanup = [];
	
	Q.stepPhys = function(){
		
		var x, y, z, mesh, N , b;
		var L = Q.bodys.length;
		var i;
		
		//Q.cleanup.length = 0;
		var cleanup = false;
		
		i = L;
		
		while (i--){
			
			N = Q.bodys[i];
			
			if(N.pActive){ // at this point, the bodies array may contain "dead" physics bodies, which will return null at this point
			
				b = N.pBod.body;
				
				if(N.pBod.NOROT){
					b.newOrientation.x = N.obj.quaternion.x;
					b.newOrientation.y = N.obj.quaternion.y;
					b.newOrientation.z = N.obj.quaternion.z;
					b.newOrientation.s = N.obj.quaternion.w;
					b.controlRot = true;
				};
				
				if(N.pBod.needsSync){
					b.syncShapes()
					N.pBod.needsSync = false;
					// need to decide if i want the mass to "rescale" when the object changes, it's a bit of a pain to not do this automatically.
					if(N.pBod.shapeScaled){
						b.setupMass(b.type); // maintain the objects density, and update mass/moments to correspond to this change, but there's no need to stress these changes so don't overdo it.
						N.pBod.shapeScaled = false;
					};					
				};
				
				// apply damping settings 
				
				b.angularVelocity.x *= N.pBod.AngDAMP
				b.angularVelocity.y *= N.pBod.AngDAMP
				b.angularVelocity.z *= N.pBod.AngDAMP
				
				b.linearVelocity.x *= N.pBod.LinDAMP
				b.linearVelocity.y *= N.pBod.LinDAMP
				b.linearVelocity.z *= N.pBod.LinDAMP
			
			}else{
			
			//Q.cleanup.push(i) // store all the values that have to 
			cleanup = true
			
			}
			
		};
		
		if(cleanup){
			
			Q.bodysBuffer.length = 0;
			
			for( i = 0, L = Q.bodys.length ; i < L ; i++){
			
				if(Q.bodys[i].pActive) Q.bodysBuffer.push(Q.bodys[i])
				else Q.bodys[i].pInBodys = false // flag the fact instance has been pruned from bodys array
			
			};
			
			// swap arrays around so that buffer becomes bodys and old bodys becomes new buffer
			
			b = Q.bodys;
			Q.bodys = Q.bodysBuffer;
			Q.bodysBuffer = b;
			
			//alert(Q.bodys);
			//alert(Q.bodysBuffer);
			
			
		};

		Q.world.step();// update world
		
		L = Q.bodys.length;
		i = L ;
		
		while (i--){
			N = Q.bodys[i];
			
			if(!N.sleeping){ // if body didn't sleep
	
				// apply rigidbody position and rotation to mesh
				N.obj.position.copy(N.pBod.getPosition());
				N.obj.quaternion.copy(N.pBod.getQuaternion());
				N.set_bbox3D_changed(false,true);
				
				if(N.pBod.debugEnabled){
					//N.pBod.debugCOM.position.set(N.pBod.body.position.x*OIMO.WORLD_SCALE,N.pBod.body.position.y*OIMO.WORLD_SCALE,N.pBod.body.position.z*OIMO.WORLD_SCALE)
					var i1, L1,D,shp,te;
					
					for(i1=0,L1= N.pBod.debugShapes.length; i1<L1;i1++){ // loop through all shapes to show their debug body (a true representation of the collider)
					
						D = N.pBod.debugShapes[i1][0];
						
						shp = N.pBod.debugShapes[i1][1];
						
						if(shp.type === OIMO.SHAPE_BOX){
							D.scale.set(shp.width*OIMO.WORLD_SCALE , shp.height*OIMO.WORLD_SCALE, shp.depth*OIMO.WORLD_SCALE);
						}else if(shp.type === OIMO.SHAPE_CYLINDER){
							D.scale.set(shp.radius*2*OIMO.WORLD_SCALE , shp.height*OIMO.WORLD_SCALE , shp.radius*2*OIMO.WORLD_SCALE );
						}else if(shp.type === OIMO.SHAPE_SPHERE){
							D.scale.set(shp.radius*2*OIMO.WORLD_SCALE , shp.radius*2*OIMO.WORLD_SCALE , shp.radius*2*OIMO.WORLD_SCALE );
						}
							
						te = shp.rotation.elements;
						D.matrix.set(
						te[0]*D.scale.x,te[1]*D.scale.y,te[2]*D.scale.z,OIMO.WORLD_SCALE*shp.position.x,
						te[3]*D.scale.x,te[4]*D.scale.y,te[5]*D.scale.z,OIMO.WORLD_SCALE*shp.position.y,
						te[6]*D.scale.x,te[7]*D.scale.y,te[8]*D.scale.z,OIMO.WORLD_SCALE*shp.position.z,
						0,0,0,1);
								
					};
					
				};
				
			}
		}
	
	};
	
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.Q3DOimo.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function(){
	
	};
	
	behinstProto.postCreate = function()
	{
		// Load properties
		//this.myProperty = this.properties[0];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
		
		var Q = this.runtime.QPhys;
		
		//var bodOption = { type:"box", size:[this.obj.scale.x,this.obj.scale.y,this.obj.scale.z], pos:[this.obj.position.x,this.obj.position.y,this.obj.position.z], mass:1 }
		
		//Q.World.addBody(bodOption);
		//H = { type:'box', size:[this.inst.obj.scale.x,this.inst.obj.scale.y,this.inst.obj.scale.z], pos:[this.inst.obj.position.x,this.inst.obj.position.y,this.inst.obj.position.z], move:true, }
		// support multiple scenes, somehow? (multiple worlds)
		
		var H = {}
		
		H.world = Q.world
		//alert(Q.world.numRigidBodies)
		
		H.size = [this.inst.obj.scale.x,this.inst.obj.scale.y,this.inst.obj.scale.z];
		H.pos = [this.inst.obj.position.x,this.inst.obj.position.y,this.inst.obj.position.z];
		H.config = [  this.properties[3],this.properties[4],this.properties[5],  this.inst.uid , 0x00000  ]
		//alert(H.pos)
		// choose if object is immovable or not based on properties
		
		H.move =		 this.properties[0] === 0

		// choose the type of collision mask
		if(this.properties[1]===0){
			if(this.inst.col.type.OBB ) H.type = 'box' ; 
			if(this.inst.col.type.sphere ){
				
				H.type = 'sphere'
				H.size = [this.inst.obj.scale.x*0.5,this.inst.obj.scale.y*0.5,this.inst.obj.scale.z*0.5];
				
			};
		}else if(this.properties[1]===1){
		
			H.type = 'box'
			H.t = 0;
			
		
		}else if(this.properties[1]===2){
		
			H.type = 'sphere'
			H.t = 1;
			H.size = [this.inst.obj.scale.x*0.5,undefined,undefined];
		
		}else if(this.properties[1]===3){
		
			H.type = 'cylinder'
			H.t = 2;
			H.size = [this.inst.obj.scale.x*0.5,this.inst.obj.scale.y,undefined];
		
		}else if(this.properties[1]===4){ // capsule (multi shape body)
		
			H.type = ['cylinder','sphere','sphere']
			H.t = 3;
			H.size = [this.inst.obj.scale.x*0.5,this.inst.obj.scale.y-this.inst.obj.scale.x,undefined,       this.inst.obj.scale.x*0.5,undefined,undefined,       this.inst.obj.scale.x*0.5,undefined,undefined];
			
			//H.pos.push(H[0]*1000,H[1]-this.inst.obj.scale.y*OIMO.WORLD_SCALE*1000 ,H[2],   H[0],H[1]+this.inst.obj.scale.y*OIMO.WORLD_SCALE ,H[2])
			 H.pos.push( 0,-this.inst.obj.scale.y*0.5+this.inst.obj.scale.x*0.5,0, 0,this.inst.obj.scale.y*0.5-this.inst.obj.scale.x*0.5,0);
			
		};
		//alert(H.size[0])
		//alert(H.type)
		
		// use property to choose whether body can sleep or not;
		H.noSleep = ( this.properties[10] === 0 );
		
		this.inst.pBod = new OIMO.Body(H)
		//this.inst.pBod.shapeSize = H.size;
		//this.inst.pBod.shapeType = H.t;
		//this.inst.pBod.shape = this.inst.pBod.body.shapes;
		this.inst.pBod.linkDic = {}; // dictionary for keeping track of joints by name;
		this.inst.pBod.shapeDic = {}; // dictionary for keeping track of shapes by name;
		
		this.inst.pBod.world = Q.world;
		
		//this.inst.pBod = new OIMO.Body({ type:'box', size:[this.inst.obj.scale.x,this.inst.obj.scale.y,this.inst.obj.scale.z], pos:[this.inst.obj.position.x,this.inst.obj.position.y,this.inst.obj.position.z], move:true, world: Q.world });
		//var qn = {s : this.inst.obj.quaternion.w, x : this.inst.obj.quaternion.x, y : this.inst.obj.quaternion.y, z : this.inst.obj.quaternion.z};
		//this.inst.pBod.setQuaternion(qn) 
		this.inst.pBod.body.orientation.x = this.inst.obj.quaternion.x;
		this.inst.pBod.body.orientation.y = this.inst.obj.quaternion.y;
		this.inst.pBod.body.orientation.z = this.inst.obj.quaternion.z;
		this.inst.pBod.body.orientation.s = this.inst.obj.quaternion.w;
		
		this.inst.pBod.body.allowablePen = this.properties[11];
		this.inst.pBod.body.compliance = this.properties[12];
		this.inst.pBod.body.stickiness = this.properties[13];
		
		//this.sleepOrientation
		//this.inst.pBod.body.sleepOrientation.x = this.inst.obj.quaternion.x;
		//this.inst.pBod.body.sleepOrientation.y = this.inst.obj.quaternion.y;
	//	this.inst.pBod.body.sleepOrientation.z = this.inst.obj.quaternion.z;
		//this.inst.pBod.body.sleepOrientation.s = this.inst.obj.quaternion.w;

		// special flag for non-rotating objects.
		this.inst.pBod.NOROT = 	this.properties[2] === 1
		this.inst.pBod.LinDAMP = 1-this.properties[6];
		this.inst.pBod.AngDAMP = 1-this.properties[7];
		
		if( this.properties[8] === 0 ){
			this.destroyBody(); // by default rigid body is added to world in " new OIMO.Body() ", so we have to remove it right after adding it in this case...
			this.inst.pInBodys = false;
		}else{
			Q.bodys.push(	this.inst	);
			this.inst.pInBodys = true; // flag for when its in bodys array
			this.inst.pActive = true;
		}
		
		//this.inst.pBod.body.updatePosition(Q.world.timeStep);
		
		this.inst.pBod.needsSync = true; // start up sync for next step
		
		/////////////////////// DEBUG ENABLED // unoptimized code
		if(this.properties[9] === 1){
			
			this.inst.pBod.debugEnabled = true;
			
			this.initDebugShapes();
			
			//this.inst.pBod.debugCOM = new THREE.Mesh( sphGeom , new THREE.MeshPhongMaterial({color : 0xffffffff, emissive : 0xff0000}));
			//this.inst.pBod.debugCOM.scale.set(60,60,60);
			
			//this.inst.toplevelparent.parent.add(this.inst.pBod.debugCOM)
			
		};
		
	};
	
	// geoms for debug
	var cylGeom = new THREE.CylinderGeometry(0.5,0.5,1,32,1)
	//cylGeom.applyMatrix ( new THREE.Matrix4().makeRotationX( Math.PI/2 ) ) // not needed
	
	var boxGeom = new THREE.BoxGeometry(1,1,1,1,1,1)
	
	var sphGeom =  new THREE.IcosahedronGeometry(0.5, 2)
	
	behinstProto.initDebugShapes = function()
	{
		var debug;
		var i = 0;
		// initialize / or reset debug-shapes
		if(this.inst.pBod.debugShapes === undefined){
			this.inst.pBod.debugShapes = [];
		}else{
			this.destroyDebugShapes();
		};
		
		for(var shape=this.inst.pBod.body.shapes ;shape!=null;shape=shape.next){
				
			if(shape.type === OIMO.SHAPE_BOX) debug = new THREE.Mesh( boxGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
		
			if(shape.type === OIMO.SHAPE_CYLINDER) debug = new THREE.Mesh( cylGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
			
			if(shape.type === OIMO.SHAPE_SPHERE) debug = new THREE.Mesh( sphGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
			
			debug.matrixAutoUpdate = false;
			
			// the objs scene
			this.inst.toplevelparent.parent.add(debug)
			
			this.inst.pBod.debugShapes.push([debug,shape])
			
			this.inst.pBod.shapeDic["DefaultShape"+i] = shape;
			i++
		};		

	};
	
	behinstProto.destroyDebugShapes = function()
	{
		var i,L,b;
	
			for(i=0,L=this.inst.pBod.debugShapes.length;i<L;i++){
			
				b = this.inst.pBod.debugShapes[i][0];
				
				b.parent.remove(b);

			}
			
		this.inst.pBod.debugShapes.length = 0
	};
	
	behinstProto.createBody = function()
	{
	
	var Q = this.runtime.QPhys;
	Q.world.addRigidBody(this.inst.pBod.body);
	this.inst.pActive = true;
	if(!this.inst.pInBodys) Q.bodys.push(	this.inst	); // incase it was removed and readded or something weird, check inBodys flag so it isn't added twice

	};
	
	behinstProto.destroyBody = function()
	{
	
	var Q = this.runtime.QPhys;
	Q.world.removeRigidBody(this.inst.pBod.body);
	this.inst.pActive = false;

	};
	
	behinstProto.onDestroy = function ()
	{
		
		var i,L,b;
		if(this.inst.pBod.debugEnabled){ // clear out the debug objects
			
			this.destroyDebugShapes();
			
			this.inst.pBod.debugEnabled = false; // make sure this gets reset for next object(?) should be handled in the constructor already but whatever
		};

		var Q = this.runtime.QPhys;
		
		this.destroyBody();
		//Q.world.removeRigidBody(this.inst.pBod.body);
		
		this.inst.pBod = null;
		

		
		//this.inst.pActive = false;
		//alert(Q.bodys.indexOf(this.inst));
		//this is a slow way to do it, instead, do it in step phys so you iterate over entire array, looking for empty slots, removing them, and replacing the array.
		//Q.bodys.splice(Q.bodys.indexOf(this.inst),1);
		
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	behinstProto.tick = function ()
	{
		//var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "My property", "value": this.myProperty}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsSleeping = function ()
	{
		if (!this.inst.pActive)
			return false;
		
		//alert( this.inst.pBod )
		return this.inst.pBod.body.sleeping;
	};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.pActive;
	};
	
	Cnds.prototype.CompareVelocity = function (which_, cmp_, x_)
	{
		if (!this.inst.pActive)
			return false;
		
		var velocity_vec = this.inst.pBod.body.linearVelocity//this.body.GetLinearVelocity();
		var v, vx, vy, vz;
		
		if (which_ === 0)		// X velocity
			v = velocity_vec.x;
		else if (which_ === 1)	// Y velocity
			v = velocity_vec.y;
		else if (which_ === 2)	// Z velocity
			v = velocity_vec.z;
		else					// Overall velocity
		{
			vx = velocity_vec.x;
			vy = velocity_vec.y;
			vz = velocity_vec.z;
			v = Math.sqrt(vx*vx+vy*vy+vz*vz)
		}
		
		return cr.do_cmp(v, cmp_, x_);
	};
	
	Cnds.prototype.CompareMass = function (cmp_, x_)
	{
		if (!this.inst.pActive)
			return false;
		
		var mass = this.inst.pBod.body.mass;
		return cr.do_cmp(mass, cmp_, x_);
	};
	
	Cnds.prototype.IsInContact = function ()
	{
		if (!this.inst.pActive)
			return false;
		
		//alert( this.inst.pBod )
		//return (this.inst.pBod.body.contactLink && this.inst.pBod.body.contactLink.contact && this.inst.pBod.body.contactLink.contact.body1 && ( this.inst.pBod.body.contactLink.contact.manifold.numPoints > 0)); // !! casts tp bool, so that if a contactLink exists a contact must, but if it doesn't it doesn't
		//return (this.inst.pBod.body.contactLink && ( this.inst.pBod.body.contactLink.contact.manifold.numPoints > 0));
		
        var b1, b2;
        var contact = this.inst.pBod.world.contacts;
        while(contact!==null){
            b1 = contact.body1;
            b2 = contact.body2;
            if(b1 === this.inst.pBod.body || b2 === this.inst.pBod.body){ if(contact.touching) return true; else return false;}
            else contact = contact.next;
        }
        return false;
		
	};
	
	Cnds.prototype.ContactObj = function (type)
	{
		if (!this.inst.pActive)
			return false;
		
		var sol = type.getCurrentSol()
		var insarr
		if(sol.select_all){
			insarr= type.instances
		}else{
			insarr = sol.instances
		}
		var newSol = [];
		var i,L;
		var result = false;
		for(i=0,L=insarr.length; i<L; i++){
			var inst = insarr[i];
			var b1, b2;
			var contact = this.inst.pBod.world.contacts;
			//while(contact!==null){
			//	b1 = contact.body1;
			//	b2 = contact.body2;
		//		if(b1 === this.inst.pBod.body || b2 === this.inst.pBod.body && b1 === inst.pBod.body || b2 === inst.pBod.body){ 
		//			if(contact.touching){ newSol.push(inst); result = true;}else{break testloop}
			//	}
			//	else contact = contact.next;
			//}
			//return false;
		};
		
		sol.instances = newSol;
		return result;
		
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	
	Acts.prototype.AlertShapeInfo = function ()
	{
		if (!this.inst.pActive)
			return;
		var str = ""
		for(var key in this.inst.pBod.shapeDic){
		
		str += "[ NAME ] : "+key 
		str+="\n[ TYPE ] : "
			if(this.inst.pBod.shapeDic[key].type === OIMO.SHAPE_BOX) str += "Box";
		
			if(this.inst.pBod.shapeDic[key].type === OIMO.SHAPE_CYLINDER) str += "Cylinder";
			
			if(this.inst.pBod.shapeDic[key].type === OIMO.SHAPE_SPHERE) str += "Sphere";
		str+="\n\n"
		}
		
		alert(str);
		
	};
	
	// the example action

	Acts.prototype.SetVelocity = function (vx, vy, vz)
	{
		if (!this.inst.pActive)
			return;
		
		// should I have some sort of pixels per second conversion? not even sure what units im setting this to.
		this.inst.pBod.body.linearVelocity.x = vx;
		this.inst.pBod.body.linearVelocity.y = vy;
		this.inst.pBod.body.linearVelocity.z = vz;
		
	};
	
	Acts.prototype.ApplyForce = function (fx, fy, fz)
	{
		if (!this.inst.pActive)
			return;
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += fx*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += fy*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += fz*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
	};
	
	Acts.prototype.OffsetApplyForce = function (fx, fy, fz,ox,oy,oz)
	{
		if (!this.inst.pActive)
			return;

		//var rel = this.runtime.QPhys.OV3_0;
		var position = this.runtime.QPhys.OV3_1;
		var force = this.runtime.QPhys.OV3_2;
		
		position.x = ox;
		position.y = oy;
		position.z = oz;
		
		force.x = fx;
		force.y = fy;
		force.z = fz;
		
        position.cross(position,force).mulMat(this.inst.pBod.body.inverseInertia,position);
        
		// multiplying by timestep might be wrong, but i think its applying the impulse torque otherwise.
		this.inst.pBod.body.angularVelocity.x+=position.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=position.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=position.z*this.inst.pBod.world.timeStep;
			
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += fx*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += fy*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += fz*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		
		 //this.sleeping=false;
	};
	
	Acts.prototype.WorldApplyForce = function (fx, fy, fz,ox,oy,oz)
	{
		if (!this.inst.pActive)
			return;

		var rel = this.runtime.QPhys.OV3_0;
		var position = this.runtime.QPhys.OV3_1;
		var force = this.runtime.QPhys.OV3_2;
		
		position.x = ox;
		position.y = oy;
		position.z = oz;
		
		force.x = fx;
		force.y = fy;
		force.z = fz;
		
        //position.cross(position,force).mulMat(this.inst.pBod.body.inverseInertia,position);
        rel.sub(position,this.inst.pBod.body.position).cross(rel,force).mulMat(this.inst.pBod.body.inverseInertia,rel);
		
		// multiplying by timestep might be wrong, but i think its applying the impulse torque otherwise.
		this.inst.pBod.body.angularVelocity.x+=rel.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=rel.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=rel.z*this.inst.pBod.world.timeStep;
			
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += fx*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += fy*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += fz*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
	};
	
	Acts.prototype.ApplyForceToward = function (f, pX,pY,pZ)
	{
		if (!this.inst.pActive)
			return;
			
		var dx,dy,dz,n;
		
		dx = pX-this.inst.obj.position.x;
		dy = pY-this.inst.obj.position.y;
		dz = pZ-this.inst.obj.position.z;
		
		n = 1/Math.sqrt(dx*dx + dy*dy + dz*dz);
		
		if(isFinite(n)){		//n = 0; // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += f*dx*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += f*dy*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += f*dz*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.ApplyForceInDir = function (f, dx,dy,dz)
	{
		if (!this.inst.pActive)
			return;
			
		var n;
		
		n = 1/Math.sqrt(dx*dx + dy*dy + dz*dz);
		
		if(isFinite(n)){		//n = 0; // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += f*dx*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += f*dy*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += f*dz*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.ApplyForceRkToward = function (f , pX,pY,pZ,k)
	{
		if (!this.inst.pActive)
			return;
			
		var dx,dy,dz,n;
		
		dx = pX-this.inst.obj.position.x;
		dy = pY-this.inst.obj.position.y;
		dz = pZ-this.inst.obj.position.z;
		
		n = Math.pow(Math.sqrt(dx*dx + dy*dy + dz*dz),k-1); // k-1, because the normalization of the direction has to be accounted for.

		if(isFinite(n)){		//n = 0; // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
			//	alert(n)
		this.inst.pBod.body.linearVelocity.x += f*dx*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += f*dy*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += f*dz*n*this.inst.pBod.world.timeStep*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.ApplyImpulse = function (ix,iy,iz)
	{
		if (!this.inst.pActive)
			return;
		// this is actually applying an impulse i think, since F=ma, integral(F,dt) = mv, Impulse = J = mv. Impulse is like a force, but not reliant on timestep. oimo relies on velocity to apply forces, so i need to add to velocity by rearranging terms
		this.inst.pBod.body.linearVelocity.x += ix*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += iy*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += iz*this.inst.pBod.body.inverseMass;
	};
	
	Acts.prototype.ApplyImpulseRkToward = function (i , pX,pY,pZ,k)
	{
		if (!this.inst.pActive)
			return;
			
		var dx,dy,dz,n;
		
		dx = pX-this.inst.obj.position.x;
		dy = pY-this.inst.obj.position.y;
		dz = pZ-this.inst.obj.position.z;
		
		n = Math.pow(Math.sqrt(dx*dx + dy*dy + dz*dz),k-1); // k-1, because the normalization of the direction has to be accounted for.

		if(isFinite(n)){		//n = 0; // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
			//	alert(n)
		this.inst.pBod.body.linearVelocity.x +=i*dx*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += i*dy*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += i*dz*n*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.ApplyImpulseToward = function (i, pX,pY,pZ)
	{
		if (!this.inst.pActive)
			return;
			
		var dx,dy,dz,n;
		
		dx = pX-this.inst.obj.position.x;
		dy = pY-this.inst.obj.position.y;
		dz = pZ-this.inst.obj.position.z;
		
		n = 1/Math.sqrt(dx*dx + dy*dy + dz*dz);
		
		if(isFinite(n)){		 // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += i*dx*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += i*dy*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += i*dz*n*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.ApplyImpulseInDir = function (i, dx,dy,dz)
	{
		if (!this.inst.pActive)
			return;
			
		var n;
		
		n = 1/Math.sqrt(dx*dx + dy*dy + dz*dz);
		
		if(isFinite(n)){		 // prevent singularities
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += i*dx*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += i*dy*n*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += i*dz*n*this.inst.pBod.body.inverseMass;
		};
	};
	
	Acts.prototype.OffsetApplyImpulse = function (fx, fy, fz,ox,oy,oz)
	{
		if (!this.inst.pActive)
			return;

		//var rel = this.runtime.QPhys.OV3_0;
		var position = this.runtime.QPhys.OV3_1;
		var force = this.runtime.QPhys.OV3_2;
		
		position.x = ox;
		position.y = oy;
		position.z = oz;
		
		force.x = fx;
		force.y = fy;
		force.z = fz;
		
        position.cross(position,force).mulMat(this.inst.pBod.body.inverseInertia,position);
        
		// multiplying by timestep might be wrong, but i think its applying the impulse torque otherwise.
		this.inst.pBod.body.angularVelocity.x+=position.x;
        this.inst.pBod.body.angularVelocity.y+=position.y;
        this.inst.pBod.body.angularVelocity.z+=position.z;
			
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += fx*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += fy*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += fz*this.inst.pBod.body.inverseMass;
	};
	
	Acts.prototype.WorldApplyImpulse = function (fx, fy, fz,ox,oy,oz)
	{
		if (!this.inst.pActive)
			return;

		var rel = this.runtime.QPhys.OV3_0;
		var position = this.runtime.QPhys.OV3_1;
		var force = this.runtime.QPhys.OV3_2;
		
		position.x = ox;
		position.y = oy;
		position.z = oz;
		
		force.x = fx;
		force.y = fy;
		force.z = fz;
		
        //position.cross(position,force).mulMat(this.inst.pBod.body.inverseInertia,position);
        rel.sub(position,this.inst.pBod.body.position).cross(rel,force).mulMat(this.inst.pBod.body.inverseInertia,rel);
		
		// multiplying by timestep might be wrong, but i think its applying the impulse torque otherwise.
		this.inst.pBod.body.angularVelocity.x+=rel.x;
        this.inst.pBod.body.angularVelocity.y+=rel.y;
        this.inst.pBod.body.angularVelocity.z+=rel.z;
			
		// this is actually applying an impulse i think..., multiplying by timestep should give the actual "force acceleration" for the given force value
		this.inst.pBod.body.linearVelocity.x += fx*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.y += fy*this.inst.pBod.body.inverseMass;
		this.inst.pBod.body.linearVelocity.z += fz*this.inst.pBod.body.inverseMass;
	};
	
	Acts.prototype.ApplyTorqueAxial = function (torque,ox,oy,oz)
	{
		
		if (!this.inst.pActive)
			return;
		
		var n = torque/Math.sqrt(ox*ox+oy*oy+oz*oz) // normalize axis while simulatenously multiplying torque into it.
		
		if(!isFinite(n)) return; // in case an invalid axis / torque (0) is specified, prevent errors, and don't apply a torque, this seems like a natural way to handle it, if people complain ill change it
		
		var axis = this.runtime.QPhys.OV3_1;
		
		// get the torque components
		
		axis.x = ox*n;
		axis.y = oy*n;
		axis.z = oz*n;
		
        axis.mulMat(this.inst.pBod.body.inverseInertia,axis); // multiply by the the inverse inertial tensor/matrix, to get the acceleration/velocity change along each axis(?) my physics might be wrong here.
        
		// multiplying by timestep might be wrong, but i think its applying the angular impulse otherwise though.
		this.inst.pBod.body.angularVelocity.x+=axis.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=axis.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=axis.z*this.inst.pBod.world.timeStep;

	};
	
	Acts.prototype.ApplyTorqueXYZ = function (tx,ty,tz)
	{
	
		// there wont be error checking here, as it wont be a common case (hopefully).
		
		if (!this.inst.pActive)
			return;
		
		var axis = this.runtime.QPhys.OV3_1;
		
		// get the torque components
		
		axis.x = tx;
		axis.y = ty;
		axis.z = tz;
		
        axis.mulMat(this.inst.pBod.body.inverseInertia,axis); // multiply by the the inverse inertial tensor/matrix, to get the acceleration/velocity change along each axis(?) my physics might be wrong here.
        
		// multiplying by timestep might be wrong, but i think its applying the angular impulse otherwise though.
		this.inst.pBod.body.angularVelocity.x+=axis.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=axis.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=axis.z*this.inst.pBod.world.timeStep;

	};
	
	Acts.prototype.ApplyTorqueToPosition = function (torque,ox,oy,oz) // point +Z of the body toward a specified position by torquing it, useful for stuff like seeking missiles. Will have a variant which can specify an anglediff^k scaling?
	{
		
		if (!this.inst.pActive)
			return;

		//var n = 1/Math.sqrt(ox*ox+oy*oy+oz*oz) // normalize axis while simulatenously multiplying torque into it.
		
		var forward = this.runtime.QPhys.OV3_0; // this will hold the vector which corresponds to the "forward" direction that will point toward
		var axis = this.runtime.QPhys.OV3_1;

		// extract the forward axis from rotation elements
		
		forward.x = -this.inst.pBod.body.rotation.elements[2];
		forward.y = -this.inst.pBod.body.rotation.elements[5];
		forward.z = -this.inst.pBod.body.rotation.elements[8];
		
		// get the torque components
		
		axis.x = ox-this.inst.obj.position.x;
		axis.y = oy-this.inst.obj.position.y;
		axis.z = oz-this.inst.obj.position.z;
		
		axis.cross(axis,forward);
		
		var n = torque/Math.sqrt(axis.x*axis.x+axis.y*axis.y+axis.z*axis.z); // normalize so that scaling does not depend on cross product size.
		
		if(!isFinite(n)) return; // in case an invalid axis/torque is specified, prevent errors, and don't apply a torque, this seems like a natural way to handle it, if people complain ill change it
		
		axis.x *= n;
		axis.y *= n;
		axis.z *= n;		
		
        axis.mulMat(this.inst.pBod.body.inverseInertia,axis); // multiply by the the inverse inertial tensor/matrix, to get the acceleration/velocity change along each axis(?) my physics might be wrong here.
        
		// multiplying by timestep might be wrong, but i think its applying the angular impulse otherwise though.
		this.inst.pBod.body.angularVelocity.x+=axis.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=axis.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=axis.z*this.inst.pBod.world.timeStep;

	};
	
	Acts.prototype.ApplyTorqueAkToPosition = function (torque,ox,oy,oz,k) // point +Z of the body toward a specified position by torquing it, useful for stuff like seeking missiles. Will have a variant which can specify an anglediff^k scaling?
	{
		
		if (!this.inst.pActive)
			return;

		//var n = 1/Math.sqrt(ox*ox+oy*oy+oz*oz) // normalize axis while simulatenously multiplying torque into it.
		
		var forward = this.runtime.QPhys.OV3_0; // this will hold the vector which corresponds to the "forward" direction that will point toward
		var axis = this.runtime.QPhys.OV3_1;
		//var angle = this.runtime.QPhys.OV3_2;

		// extract the forward axis from rotation elements
		
		forward.x = -this.inst.pBod.body.rotation.elements[2];
		forward.y = -this.inst.pBod.body.rotation.elements[5];
		forward.z = -this.inst.pBod.body.rotation.elements[8];
		
		// get the torque components
		
		axis.x = ox-this.inst.obj.position.x;
		axis.y = oy-this.inst.obj.position.y;
		axis.z = oz-this.inst.obj.position.z;
		
		// need to normalize pointing direction first to get angle, can't be avoided.
		
		var n = 1/Math.sqrt(axis.x*axis.x+axis.y*axis.y+axis.z*axis.z); // normalize so that scaling does not depend on cross product size.
		
		if(!isFinite(n)) return; // in case an invalid axis/torque is specified, prevent errors, and don't apply a torque, this seems like a natural way to handle it, if people complain ill change it
		
		axis.x *= n;
		axis.y *= n;
		axis.z *= n;		
		
		var angle = 1-Math.acos(axis.dot(forward))/Math.PI; // normalize angle from radians, so that full A^k = 0^k if angle is 0, and A^k = 1^k if angle is 180 degrees
		console.log(angle)
		axis.cross(axis,forward);
		
		// normalization after cross product, so that angular difference doesn't introduce a sin(angle) scaling factor, which is obviously unwanted in most cases.
		// using negative values for this is a bit wonky.
		
		var n = Math.pow(angle,k)*torque/Math.sqrt(axis.x*axis.x+axis.y*axis.y+axis.z*axis.z); // normalize so that scaling does not depend on cross product size. i could use 1/sin(angle in radians) too, but the optimization doesn't seem to offer much benefit without me testing extensively to make sure.
		
		if(!isFinite(n)) return; // check again to prevent super weirdness with pow, and just to be safe everything went ok.

		axis.x *= n;
		axis.y *= n;
		axis.z *= n;	
		
        axis.mulMat(this.inst.pBod.body.inverseInertia,axis); // multiply by the the inverse inertial tensor/matrix, to get the acceleration/velocity change along each axis(?) my physics might be wrong here.
        
		// multiplying by timestep might be wrong, but i think its applying the angular impulse otherwise though.
		this.inst.pBod.body.angularVelocity.x+=axis.x*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.y+=axis.y*this.inst.pBod.world.timeStep;
        this.inst.pBod.body.angularVelocity.z+=axis.z*this.inst.pBod.world.timeStep;

	};
	
	Acts.prototype.SetAngularVelocityXYZ = function (vx,vy,vz)
	{
	
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.body.angularVelocity.x=vx*THREE.Deg2Rad;
        this.inst.pBod.body.angularVelocity.y=vy*THREE.Deg2Rad;
        this.inst.pBod.body.angularVelocity.z=vz*THREE.Deg2Rad;

	};
	
	Acts.prototype.SetEnabled = function (e)
	{
		// Is enabled, and setting disabled
		if (this.inst.pActive && e === 0)
		{
			this.destroyBody();
			//this.inst = false;
		}
		// Is disabled, and setting enabled
		else if (!this.inst.pActive && e === 1)
		{
			//this.enabled = true;
			this.createBody();
		}
	};
	
	Acts.prototype.SetDensity = function (d)
	{
		if (!this.inst.pActive)
			return;
		
		for(var shape=this.inst.pBod.body.shapes;shape!=null;shape=shape.next){
		
			shape.density = d; // need to change all objects component shape's densities.
		
		};
		
		this.inst.pBod.body.setupMass(this.inst.pBod.body.type) // recalculate bodies/shapes mass/moments based on new shape densities;
	};
	
	Acts.prototype.SetAllowablePen = function (v)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.body.allowablePen = v
	};
	
	Acts.prototype.SetCompliance = function (v)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.body.compliance = v
	};
	
	Acts.prototype.SetStickiness = function (v)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.body.stickiness = v
	};
	
	Acts.prototype.SetFriction = function (f)
	{
		
		if (!this.inst.pActive)
			return;
		
		for(var shape=this.inst.pBod.body.shapes;shape!=null;shape=shape.next){
		
			shape.friction = f; // need to change all objects component shape's densities.
		
		};
		
	};
	
	Acts.prototype.SetElasticity = function (e)
	{
	
		if (!this.inst.pActive)
			return;
		
		for(var shape=this.inst.pBod.body.shapes;shape!=null;shape=shape.next){
		
			shape.restitution = e; // need to change all objects component shape's densities.
		
		};
		
	};
	
	Acts.prototype.SetLinearDamping = function (ld)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.LinDAMP = ld;
		
	};
	
	Acts.prototype.SetAngularDamping = function (ad)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.AngDAMP = ad;
	};
	
	Acts.prototype.SetImmovable = function (i)
	{
		
		if (!this.inst.pActive || (this.inst.pBod.body.isDynamic === (i === 0)  )  )
		return;
		
		if(i === 0){
			this.inst.pBod.body.setupMass(0x1);
		}else{
			this.inst.pBod.body.setupMass(0x2);
		}

	};

	Acts.prototype.SetPreventRotate = function (i)
	{
		if (!this.inst.pActive)
			return;
		
		this.inst.pBod.NOROT = i === 1
	};
	
	Acts.prototype.SetWorldGravityXYZ = function (gx,gy,gz)
	{
	
	var Q = this.runtime.QPhys;
	
	Q.world.gravity.x = gx;
	Q.world.gravity.y = gy;
	Q.world.gravity.z = gz;
		
	};
	
	Acts.prototype.SetSteppingMode = function (mode)
	{
		this.runtime.QPhys.steppingMode = mode;
	};
	
	Acts.prototype.SetIterations = function (iterations)
	{
		this.runtime.QPhys.world.numIterations = iterations;
	};
	
	Acts.prototype.CollisionsSlotOp = function (mg,op,slot)
	{
		if (!this.inst.pActive)
			return;
		
		var p = this.inst.pBod;
		var m
		
		for(var shape=this.inst.pBod.body.shapes;shape!=null;shape=shape.next){
		
			if(mg === 0) m = shape.belongsTo;
			else  m = shape.collidesWith;
			
			// bitwise js helper
			//http://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascript
			
			var mask = 1 << slot; // pushes 1 by "slot" to the right, grabbing the "slot" bit, so 0 shifts 1 by 0 to the right, 1 by etc, so 31 would be the max allowable slot
			
			if(op === 0){ // remove
			
				m &= ~mask; // clear the bit
				
			}else if(op === 1){ // add
				
				m |= mask; // set the bit
				
			}else if(op === 2){ // set only
				
				m = mask; // just use the mask as the only bit
				
			}else if(op === 3){ // add to everything except slot
			
				m = ~mask // invert the mask
			
			}else if(op === 4){
			
				m =  0xffffffff; // all bits are set
			
			}else if(op === 5){
				
				m = 0x00000000; // no bits are set
			
			};
			
			//pass m back in (because its an int, its passed by value not ref)
			
			if(mg === 0) shape.belongsTo = m;
			else shape.collidesWith = m;
		
		};

		// do this to make sure objects dont still collider when they shouldn't since they're still "in contact"
		
		this.stripContacts(p.body.contactLink)
		
	};
	
	behinstProto.stripContacts = function (link)
	{
		
		// lets try a naive check to remove pairs which 

		// brute force way to do it, kinda overly bad. should loop through contacts removing any featuring this object instead.
       // while(this.runtime.QPhys.world.contacts!==null){
       // this.runtime.QPhys.world.removeContact(this.runtime.QPhys.world.contacts);
       // }
		
		// need to do a double sided search? will this be faster or slower?
		// remove any contacts featuring this object, or else they'll persist even if they shouldn't.
		// not sure if this is bug free but it works. could perhaps batch the checks for body's that need to be reset into one function before step, which checks if contacts should be persisting.
		
		var next;
		var prev;
		var contact;
		
		if(link){ // body has contacts that need to be cleared in this case, this stuff should be reasonably fast, as it only goes through contacts that actually exist on the body using the linked list.
		
			this.inst.pBod.body.awake(); // should only need to wake the body if something is contacting it, or else its just frozen in space for some good reason.
			
				contact = link.contact;
			if(contact){
				next = link.next
				prev = link.prev
				this.runtime.QPhys.world.removeContact(contact);
			};
			if(next) contact = next.contact;
			while(contact.body1){
				this.runtime.QPhys.world.removeContact(contact);
				if(next.next && next.next.contact ) contact = next.next.contact;
			};
			if(prev) contact = prev.contact;
			while(contact.body1){
				this.runtime.QPhys.world.removeContact(contact);
				if(prev.prev && prev.prev.contact ) contact = prev.prev.contact;
			};
		
		};
		
	};
	
	Acts.prototype.CreateLimitedDistanceJoint = function (jname,allowcol,damp,freq,min,max,Ax,Ay,Az,B2,Bx,By,Bz) // needs a lot of polish to be easily usable
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointDistance"
		obj.min = min;
		obj.max = max;
		obj.spring = [freq,damp];
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	// the angular limit works kind of strangely. but it's kinda complicated and i'm not sure how to easily specify a better way to do it, so leave it for now, so users can work around it.
	Acts.prototype.CreateLimitedHingeJoint = function (jname,allowcol,damp,freq,min,max,Ax,Ay,Az,axisAx,axisAy,axisAz,B2,Bx,By,Bz,axisBx,axisBy,axisBz) // needs a lot of polish to be easily usable
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointHinge"
		obj.min = min; //automatically coerced to deg
		obj.max = max; //automatically coerced to deg
		obj.spring = [freq,damp];
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.axe1 = [axisAx,axisAy,axisAz];
		obj.axe2 = [axisBx,axisBy,axisBz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	Acts.prototype.CreateBallAndSocketJoint = function (jname,allowcol,Ax,Ay,Az,B2,Bx,By,Bz) // needs a lot of polish to be easily usable
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointBall"
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	Acts.prototype.CreatePrismaticJoint = function (jname,allowcol,min,max,Ax,Ay,Az,axisAx,axisAy,axisAz,B2,Bx,By,Bz,axisBx,axisBy,axisBz)
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointPrisme"
		obj.min = min;
		obj.max = max;
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.axe1 = [axisAx,axisAy,axisAz];
		obj.axe2 = [axisBx,axisBy,axisBz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	Acts.prototype.CreateSliderJoint = function (jname,allowcol,min,max,Ax,Ay,Az,axisAx,axisAy,axisAz,B2,Bx,By,Bz,axisBx,axisBy,axisBz)
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointSlide"
		obj.min = min;
		obj.max = max;
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.axe1 = [axisAx,axisAy,axisAz];
		obj.axe2 = [axisBx,axisBy,axisBz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	// kind of a weird constraint.
	Acts.prototype.CreateWheelJoint = function (jname,allowcol,damp,freq,min,max,Ax,Ay,Az,axisAx,axisAy,axisAz,B2,Bx,By,Bz,axisBx,axisBy,axisBz) // needs a lot of polish to be easily usable
	{
		if (!this.inst.pActive)
			return;
		
		var pBod_B = B2.getFirstPicked();
		var pBod_A
		
		if(!pBod_B || !pBod_B.pBod) return; // you can't joint to no picked objects, or to an object without a physics body
		
		pBod_B = pBod_B.pBod; // attach the proper refernce to the var
		pBod_A = this.inst.pBod;
		
		var obj = {};
		obj.type = "jointWheel"

		//obj.limit = [min,max];
		obj.spring = [freq,damp];
		
		obj.pos1 = [Ax,Ay,Az];
		obj.pos2 = [Bx,By,Bz];
		
		obj.axe1 = [axisAx,axisAy,axisAz];
		obj.axe2 = [axisBx,axisBy,axisBz];
		
		obj.body1 = pBod_A.body;
		obj.body2 = pBod_B.body;
		obj.world = this.runtime.QPhys.world;
		
		obj.collision = (allowcol === 1);
		
		var newlink = new OIMO.Link(obj);
		
		// store named references to this link (?) in some sort of dictionary (?)
		
		// allow for overwriting of joint names, you lose the ability to reference the older joints if you do this though, but its still better than how C2 just forces you to destroy all joints and recreate them to make any changes....
		var linkpair = [pBod_A,pBod_B,newlink]
		pBod_A.linkDic[jname] = linkpair;
		pBod_B.linkDic[jname] = linkpair;		
		
	};
	
	Acts.prototype.RemoveJoint = function(jname){
		
		if (!this.inst.pActive)
			return;
		
		var pBod_A = this.inst.pBod;
		
		if(!pBod_A.linkDic.hasOwnProperty(jname)) return; // this object has no link with this name;
		
		var link = pBod_A.linkDic[jname]
		
		// get rid of name references to this link
		
		// first check that the joint being deleted is the same one that jname picked on this object, reference ties can mess up with overwriting, so this is critical if we don't want to accidentally dereference the wrong joint on the other object. deleting was taken care of by the overwrite in that case.
		if(link[0].linkDic[jname] === pBod_A.linkDic[jname]){ delete link[0].linkDic[jname]}
		if(link[1].linkDic[jname] === pBod_A.linkDic[jname]){ delete link[1].linkDic[jname]}
		
		link[2].remove(); // remove the joint from physics simulation
		
		// not sure what could potentially go wrong? Overwriting joint name means one object is left with a dangling reference to something that doesn't exist (?), and it'll end up deleting the wrong thing later (?) cause the other object still references another joint.
		// how should i handle this? delete the references link rather than the named link? is this possible ? i think above code handles the issue okay, although it leaves behind old references.
		// what if one object gets deleted, will it still hold a reference and mess things up?
	};
	
	Acts.prototype.RemoveAllJoints = function(){
		
		if (!this.inst.pActive)
			return;
		
		//var pBod_A = this.inst.pBod;
		
	// is it okay to leave dangling references to named joints in the other objects jointlink stuff? hmm..... sounds leaky, maybe i should just iterate lazily through the entire list... but that's gross and slow for everything except this :/ do i really want this to be the fastest (?), might slow down destruction too though. 
	// unique joint names accumulating due to this / destroys seems like a small issue that only fringe cases will run into. if someone complains about a legitimate issue due to it i'll fix it.
	// maybe I should just bite the one time cost in this function and clean up... but I won't do it in other cases so forget about it.
	// bahhhh seems like changing the other thing to use the linked list is probably the best idea, objects wont have a ridiculous number of joints anyway.
	
		var js = this.inst.pBod.body.jointLink;
	    while(js!=null){
	        var joint=js.joint;
	        js=js.next;
	        this.runtime.QPhys.world.removeJoint(joint);
        };
		
	};
	
///////////////////////////////////////////////////////////////////////////////////////////
	Acts.prototype.ShapesAddBox = function (name,width,height,depth)
	{
	
		if (!this.inst.pActive)
			return;
			
		//if(this.inst.pBod.shapeDic.hasOwnProperty(name)){alert("cannot create two shapes with the same name"); return;}// don't allow for overwrites (should probably stop this from being possible for joints too);
		
		var shape =  new OIMO.BoxShape(new OIMO.ShapeConfig(), width* OIMO.INV_SCALE, height* OIMO.INV_SCALE, depth* OIMO.INV_SCALE);
		
		this.inst.pBod.shapeDic[name] = shape;
		
		this.inst.pBod.body.addShape(shape);
		
		if(this.inst.pBod.debugEnabled){
			
			//	this.initDebugShapes(); // kind of overkill
			
			var debug = new THREE.Mesh( boxGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
			
			debug.matrixAutoUpdate = false;
			
			// the objs scene
			this.inst.toplevelparent.parent.add(debug);
			
			this.inst.pBod.debugShapes.push([debug,shape]);
			
		};
		// not sure if it should do this auto, or only as needed, but this seems ok for now.
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
		//this.inst.pBod.body.setupMass(this.inst.pBod.body.type)
	};
	
	Acts.prototype.ShapesAddSphere = function (name,radius)
	{
	
		if (!this.inst.pActive)
			return;
		
		//if(this.inst.pBod.shapeDic.hasOwnProperty(name)){alert("cannot create two shapes with the same name"); return;}
		
		var shape =  new OIMO.SphereShape(new OIMO.ShapeConfig(), radius* OIMO.INV_SCALE);
		
		this.inst.pBod.shapeDic[name] = shape;
		
		this.inst.pBod.body.addShape(shape);
		
		if(this.inst.pBod.debugEnabled){
			
			//	this.initDebugShapes(); // kind of overkill
			
			var debug = new THREE.Mesh( sphGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
			
			debug.matrixAutoUpdate = false;
			
			// the objs scene
			this.inst.toplevelparent.parent.add(debug);
			
			this.inst.pBod.debugShapes.push([debug,shape]);
			
		};
		
		// not sure if it should do this auto, or only as needed, but this seems ok for now.
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
		//this.inst.pBod.body.setupMass(this.inst.pBod.body.type)
	};
	
	Acts.prototype.ShapesAddCylinder = function (name,radius,height)
	{
	
		if (!this.inst.pActive)
			return;
		
		//if(this.inst.pBod.shapeDic.hasOwnProperty(name)){alert("cannot create two shapes with the same name"); return;}
		
		var shape =  new OIMO.CylinderShape(new OIMO.ShapeConfig(), radius* OIMO.INV_SCALE, height* OIMO.INV_SCALE);
		
		this.inst.pBod.shapeDic[name] = shape;
		
		this.inst.pBod.body.addShape(shape);
		
		if(this.inst.pBod.debugEnabled){
			
			//	this.initDebugShapes(); // kind of overkill
			
			var debug = new THREE.Mesh( cylGeom , new THREE.MeshPhongMaterial({color : Math.random()*0xffffffff, emissive : Math.random()*0x22222222}));
			
			debug.matrixAutoUpdate = false;
			
			// the objs scene
			this.inst.toplevelparent.parent.add(debug);
			
			this.inst.pBod.debugShapes.push([debug,shape]);
			
		};
		
		// not sure if it should do this auto, or only as needed, but this seems ok for now.
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
		//this.inst.pBod.body.setupMass(this.inst.pBod.body.type)
	};
	
	Acts.prototype.ShapesSetRelPos = function (name,x,y,z)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.relativePosition.x = x* OIMO.INV_SCALE
		shape.relativePosition.y = y* OIMO.INV_SCALE
		shape.relativePosition.z = z* OIMO.INV_SCALE
		
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
	
	};
	
	Acts.prototype.ShapesSetRelRotE = function (name,x,y,z)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.relativeRotation = OIMO.EulerToMatrix(x*THREE.Deg2Rad, y*THREE.Deg2Rad, z*THREE.Deg2Rad);
		
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
	
	};
	
	Acts.prototype.ShapesSetRelRotM = function (name,e00,e01,e02,e10,e11,e12,e20,e21,e22)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.relativeRotation.init(e00,e01,e02,e10,e11,e12,e20,e21,e22);

		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
	};
	
	Acts.prototype.ShapesSetSize = function (name,x,y,z)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
						
		if(shape.type === OIMO.SHAPE_BOX){
			
			shape.width = x* OIMO.INV_SCALE;
			shape.height = y* OIMO.INV_SCALE;
			shape.depth = z* OIMO.INV_SCALE;
			
			shape.halfWidth = shape.width*0.5;
			shape.halfHeight = shape.height*0.5;
			shape.halfDepth = shape.depth*0.5;

		}else if(shape.type === OIMO.SHAPE_SPHERE){
			
			shape.radius = x*2* OIMO.INV_SCALE;

		}else if(shape.type === OIMO.SHAPE_CYLINDER){
			
			shape.radius = x*2* OIMO.INV_SCALE;
			shape.height = y* OIMO.INV_SCALE;
	
			shape.halfHeight = shape.height*0.5;

		};
		
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
	
	};
	
	Acts.prototype.ShapesSetDensity = function (name,density)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.density = density;
		
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
	
	};
	
	Acts.prototype.ShapesSetFriction = function (name,friction)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.friction = friction;
	
	};
	
	Acts.prototype.ShapesSetElasticity = function (name,e)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		shape.restitution = e;
	
	};
	
	Acts.prototype.ShapesCollisionsSlotOp = function (name,mg,op,slot)
	{
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var p = this.inst.pBod;
		var m
		
		var shape = this.inst.pBod.shapeDic[name];
		
				if(mg === 0) m = shape.belongsTo;
				else  m = shape.collidesWith;
				
				// bitwise js helper
				//http://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascript
				
				var mask = 1 << slot; // pushes 1 by "slot" to the right, grabbing the "slot" bit, so 0 shifts 1 by 0 to the right, 1 by etc, so 31 would be the max allowable slot
				
				if(op === 0){ // remove
				
					m &= ~mask; // clear the bit
					
				}else if(op === 1){ // add
					
					m |= mask; // set the bit
					
				}else if(op === 2){ // set only
					
					m = mask; // just use the mask as the only bit
					
				}else if(op === 3){ // add to everything except slot
				
					m = ~mask // invert the mask
				
				}else if(op === 4){
				
					m =  0xffffffff; // all bits are set
				
				}else if(op === 5){
					
					m = 0x00000000; // no bits are set
				
				};
				
				//pass m back in (because its an int, its passed by value not ref)
				
				if(mg === 0) shape.belongsTo = m;
				else shape.collidesWith = m;
		
		// do this to make sure objects dont still collider when they shouldn't since they're still "in contact"
		
		this.stripContacts(this.inst.pBod.body.contactLink)
		
	};
	
	Acts.prototype.ShapesRemove = function (name)
	{
	
		if (!this.inst.pActive || !this.inst.pBod.shapeDic.hasOwnProperty(name))
		return;
		
		var shape = this.inst.pBod.shapeDic[name];
		
		if(this.inst.pBod.debugEnabled){
			
			var i,L,b;
			for(i=0,L= this.inst.pBod.debugShapes.length; i<L;i++){
				if(this.inst.pBod.debugShapes[i][1] === shape){
				b = this.inst.pBod.debugShapes[i][0];
				b.parent.remove(b);
				break;
				}
			};
			// loop breaks when it reaches the element it needs to get rid of, we use i at this break;
			this.inst.pBod.debugShapes.splice(i,1)
			
		}
		
		this.inst.pBod.body.removeShape(shape);
		this.inst.pBod.shapeDic[name] = null;
		delete this.inst.pBod.shapeDic[name]
		//this.inst.pBod.body.shapes = this.inst.pBod.body.shapes.prev;
		this.inst.pBod.needsSync = true;
		this.inst.pBod.shapeScaled = true;
		
		// objects just float around if i dont do this ???
		//this.stripContacts(this.inst.pBod.body.contactLink)
		//this.inst.pBod.body.syncShapes()
		//this.inst.pBod.body.setupMass(this.inst.pBod.body.type,false)
		//this.inst.pBod.body.awake();
		this.stripContacts(this.inst.pBod.body.contactLink)
		
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	//Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	//{
	//	ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	//};
	
	Exps.prototype.velX = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.linearVelocity.x : 0);
	};

	Exps.prototype.velY = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.linearVelocity.y : 0);
	};
	
	Exps.prototype.velZ = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.linearVelocity.z : 0);
	};
	
	Exps.prototype.angvelX = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.angularVelocity.x*THREE.Rad2Deg : 0);
	};

	Exps.prototype.angvelY = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.angularVelocity.y*THREE.Rad2Deg : 0);
	};
	
	Exps.prototype.angvelZ = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.angularVelocity.z*THREE.Rad2Deg : 0);
	};
	
	Exps.prototype.Mass = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.mass : 0);
	};
	
	Exps.prototype.invMass = function (ret)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.inverseMass : 0);
	};
	
	Exps.prototype.Tensor = function (ret,e)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.localInertia.elements[e] : 0);
	};
	
	Exps.prototype.invTensor = function (ret,e)
	{
		ret.set_float(this.inst.pActive ? this.inst.pBod.body.inverseLocalInertia.elements[e] : 0);
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());