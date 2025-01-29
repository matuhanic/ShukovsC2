// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.SkinCont1 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.SkinCont1.prototype;
		
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

	behinstProto.onCreate = function()
	{
		this.inst.usesSkinController = true; // flag so that skinning/bones aren't activated on objects using models with skinning possible, but without this behaviour to control anything
		this.inst.boneType = this.runtime.Q3D.boneTypes[this.properties[0]];
		this.inst.boneColTrans = this.properties[2];
		
	//	if(this.inst.boneType === undefined) alert('The Q3D Bone [ '+this.properties[0]+' ] you have specified for the Q3D skin controller of [ '+this.inst.type.name+' ] does not exist, this will likely lead to a fatal error as instances of a non-existant object type will attempt to be created if bones are needed by a skinned model. Add a Q3D Bone with this name, change the specfied name to a bone that exists, rename an existing bone to this name, or remove Q3D Skin Controller from this object if its uneeded')
		if(this.inst.boneType === undefined) alert('The Q3D Bone [ '+this.properties[0]+' ] you have specified for the Q3D skin controller of [ '+this.inst.type.name+' ] does not exist, this will likely lead to a fatal error as instances of a non-existant object type will attempt to be created if bones are needed by a skinned model. Add a Q3D Bone with this index, change the specfied index to a bone that exists, or remove Q3D Skin Controller from this object if its uneeded')
	
		this.uidinc = 0;
		//this.t = 0;
		//this.len = 0;
		//this.frameFwd = 0;
		//this.frameBwd = 0;
		// anims in anim arr mean [animkey , t val , bwd frame , fwd frame, scaling, speed]
		this.anims = {};
		this.transfs = {};
		//this.activeAnims = {};
		//this.activeTransf = [];
		this.modelFile = this.inst.modelFile //this doesn't actually do anything...
		//this.actAnimArr = [];
		//this.Anim.none = -1; // none is the default animation?
		
		
		//this.actAnimArr = [[0,"stand",0,0,0,1,0.2]]; //need an array for tweening b/w anims and to have multiple active?
		//this.actAnim.stand = 0;



	};
	
	behinstProto.postCreate = function()
	{
		var _this = this// keep scope
		this.inst.modelLoadCallbacks.push(
		
		function(){
		//if(_this.modelFile === _this.inst.modelFile) return;
			_this.anims = {};
			_this.transfs = {};
			//_this.activeAnims = [];
			//_this.activeTransf = [];
		}		
		
		);
	};
	
	behinstProto.onDestroy = function ()
	{
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
	///////////////////////////////////////// stuff for custom ticking function, modified from THREE.Animation.update
								var points = [];
								var target = new THREE.Vector3();
								var newVector = new THREE.Vector3();
								var newQuat = new THREE.Quaternion();

								// Catmull-Rom spline

								var interpolateCatmullRom = function ( points, scale ) {

									var c = [], v3 = [],
									point, intPoint, weight, w2, w3,
									pa, pb, pc, pd;

									point = ( points.length - 1 ) * scale;
									intPoint = Math.floor( point );
									weight = point - intPoint;

									c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
									c[ 1 ] = intPoint;
									c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
									c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

									pa = points[ c[ 0 ] ];
									pb = points[ c[ 1 ] ];
									pc = points[ c[ 2 ] ];
									pd = points[ c[ 3 ] ];

									w2 = weight * weight;
									w3 = weight * w2;

									v3[ 0 ] = interpolate( pa[ 0 ], pb[ 0 ], pc[ 0 ], pd[ 0 ], weight, w2, w3 );
									v3[ 1 ] = interpolate( pa[ 1 ], pb[ 1 ], pc[ 1 ], pd[ 1 ], weight, w2, w3 );
									v3[ 2 ] = interpolate( pa[ 2 ], pb[ 2 ], pc[ 2 ], pd[ 2 ], weight, w2, w3 );

									return v3;

								};

								var interpolate = function ( p0, p1, p2, p3, t, t2, t3 ) {

									var v0 = ( p2 - p0 ) * 0.5,
										v1 = ( p3 - p1 ) * 0.5;

									return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

								};
	/////////////////////////////////////////////
	
	behinstProto.tick = function ()
	{
		var i,L ,t,s;
		var dt = this.runtime.getDt(this.inst);

		if(!(this.inst.model && this.inst.model.geometry && this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims)) return; // return if theres no morph target to animate...
		
		var Sanims =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims;
									//var inf = this.inst.model.morphTargetInfluences;
		//var activeanims // need some sort of container for the animations that are active.
		
		var Ma;
		var a;
		
		//for(i = this.activeAnims.length-1; i>-1; i--){ // need to go backwards or splice can cause error for stopping anim.
		for(i in this.anims){
			if(!this.anims[i].playing) continue;
			a = this.anims[i];
			a.resetBlendWeights();
		}
		
		for(i in this.anims){
			if(!this.anims[i].playing) continue; // not playing, onto the next
			
			a = this.anims[i];
			//Sa = Sanims[a.name];
		
			//if ( this.isPlaying === false ) return;

				a.t += dt*(a.speed); //delta * this.timeScale;

				//if ( this.weight === 0 )
				//	return;
				a.updateToCurrPos();
				
				/*if(a.s === 0) continue;

				//

				var duration = a.data.length; //this.data.length;

				if ( a.t > duration || a.t < 0 ) {

					if ( a.looping ) {

						a.t %= duration;

						if (a.t < 0 )
							a.t += duration;

						a.reset();

					} else {

						//a.stop();
						
						a.playing = false;

					}

				}

				for ( var h = 0, hl = a.hierarchy.length; h < hl; h ++ ) {

					var object = a.hierarchy[ h ];
					//alert(object)
					var animationCache = object.animationCache.animations[a.name];
					var blending = object.animationCache.blending;

					// loop through pos/rot/scl

					for ( var t = 0; t < 3; t ++ ) {

						// get keys

						var type    = a.keyTypes[ t ];
						var prevKey = animationCache.prevKey[ type ];
						var nextKey = animationCache.nextKey[ type ];

						if ( ( a.speed > 0 && nextKey.time <= a.t ) ||
							( a.speed < 0 && prevKey.time >= a.t ) ) {

							prevKey = a.data.hierarchy[ h ].keys[ 0 ];
							nextKey = a.getNextKeyWith( type, h, 1 );

							while ( nextKey.time < a.t && nextKey.index > prevKey.index ) {

								prevKey = nextKey;
								nextKey = a.getNextKeyWith( type, h, nextKey.index + 1 );

							}

							animationCache.prevKey[ type ] = prevKey;
							animationCache.nextKey[ type ] = nextKey;

						}

						var scale = (a.t - prevKey.time ) / ( nextKey.time - prevKey.time );

						var prevXYZ = prevKey[ type ];
						var nextXYZ = nextKey[ type ];

						if ( scale < 0 ) scale = 0;
						if ( scale > 1 ) scale = 1;

						// interpolate

						if ( type === "pos" ) {

							if ( a.interpolationType === THREE.AnimationHandler.LINEAR ) {

								newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
								newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
								newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

								// blend
								var proportionalWeight = a.s / ( a.s + blending.positionWeight );
								object.position.lerp( newVector, proportionalWeight );
								blending.positionWeight += a.s;

							} else if ( a.interpolationType === THREE.AnimationHandler.CATMULLROM ||
										a.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

								points[ 0 ] = a.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
								points[ 1 ] = prevXYZ;
								points[ 2 ] = nextXYZ;
								points[ 3 ] = a.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

								scale = scale * 0.33 + 0.33;

								var currentPoint = interpolateCatmullRom( points, scale );
								var proportionalWeight = a.s / ( a.s + blending.positionWeight );
								blending.positionWeight += a.s;

								// blend

								var vector = object.position;

								vector.x = vector.x + ( currentPoint[ 0 ] - vector.x ) * proportionalWeight;
								vector.y = vector.y + ( currentPoint[ 1 ] - vector.y ) * proportionalWeight;
								vector.z = vector.z + ( currentPoint[ 2 ] - vector.z ) * proportionalWeight;

								if ( a.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

									var forwardPoint = interpolateCatmullRom( points, scale * 1.01 );

									target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
									target.sub( vector );
									target.y = 0;
									target.normalize();

									var angle = Math.atan2( target.x, target.z );
									object.rotation.set( 0, angle, 0 );

								}

							}

						} else if ( type === "rot" ) {

							THREE.Quaternion.slerp( prevXYZ, nextXYZ, newQuat, scale );

							// Avoid paying the cost of an additional slerp if we don't have to
							if ( blending.quaternionWeight === 0 ) {

								object.quaternion.copy(newQuat);
								blending.quaternionWeight = a.s;

							} else {

								var proportionalWeight = a.s / ( a.s + blending.quaternionWeight );
								THREE.Quaternion.slerp( object.quaternion, newQuat, object.quaternion, proportionalWeight );
								blending.quaternionWeight += a.s;

							}

						} else if ( type === "scl" ) {

							newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
							newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
							newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

							var proportionalWeight = a.s / ( a.s + blending.scaleWeight );
							object.scale.lerp( newVector, proportionalWeight );
							blending.scaleWeight += a.s;

						}

					}

				}*/

			//return true;
		};
		
		
		//////////////////////////////// start of morph controller stuff;
		/*var Ma;
		var a;
		
		//for(i = this.activeAnims.length-1; i>-1; i--){ // need to go backwards or splice can cause error for stopping anim.
		for(i in this.anims){
			if(!this.anims[i].playing) continue; // not playing, onto the next
			//Ma = Manims[this.activeAnims[i]];
			//if(!Ma) continue;
			//a = this.anims[this.activeAnims[i]];
			
			a = this.anims[i];
			Ma = Sanims[a.name];
			
			a.fwdLast = a.fwd; //store last fwd frame effected before updating frames;
			a.bwdLast = a.bwd; // store last bwd frame effected before update frames;
			
			inf[Ma.frames[a.bwd]] = 0;
			inf[Ma.frames[a.fwd]] = 0;
			
			if(a.looping){
				a.bwd = cr.floor(a.t)
				a.bwd = cr.floor((a.bwd%Ma.animlen+Ma.animlen)%Ma.animlen) // ensure proper looping
				
				a.fwd = cr.ceil(a.t)
				a.fwd = cr.floor((a.fwd%Ma.animlen+Ma.animlen)%Ma.animlen) // ensure proper looping
				
				t = (a.t%1+1)%1;

				//console.log(a.fwd +" , "+a.bwd);
				
				inf[Ma.frames[a.fwd]] = (t)*a.s;
				inf[Ma.frames[a.bwd]] = (1-t)*a.s;
				
				//a.t=((a.t+a.speed*(dt))%Ma.animlen+Ma.animlen)%Ma.animlen;
				//a.t = a.t+a.speed*(dt)
				if (a.pingpong){
				
					a.t = a.t+a.speed*(dt)
					if(a.t > Ma.animlen-1){
					a.t = Ma.animlen-1
					a.speed = a.speed*-1
					a.pong = -1;
					}else if( a.t < 0){
					a.t = 0
					a.speed = a.speed*-1
					};
				
				}else{

					a.t=((a.t+a.speed*(dt))%Ma.animlen+Ma.animlen)%Ma.animlen;
				
				}
				
			}else{
			
				a.t = cr.clamp(a.t, 0 , Ma.animlen-1);
				
				a.bwd = cr.floor(a.t)
				a.bwd = cr.floor((a.bwd%Ma.animlen+Ma.animlen)%Ma.animlen) // ensure proper looping
				
				a.fwd = cr.ceil(a.t)
				a.fwd = cr.floor((a.fwd%Ma.animlen+Ma.animlen)%Ma.animlen) // ensure proper looping
				
				t = (a.t%1+1)%1;

				inf[Ma.frames[a.fwd]] = (t)*a.s;
				inf[Ma.frames[a.bwd]] = (1-t)*a.s;
				
				if(a.pingpong){
					a.t=a.t+a.speed*(dt);
					if(a.t > Ma.animlen-1){
						a.speed = a.speed*-1;
						a.pong = a.pong*-1
					}else if(a.t < 0){
						this.animTriggerName = a.name;
						a.playing = false;
						this.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnyAnimFinished, this.inst);
						this.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnimFinished, this.inst);
						a.t = 0;
						//this.activeAnims.splice(a.playingIndex,1)
						//a.playingIndex = -1;
						
					};
				}else{
					a.t=a.t+a.speed*(dt);
					if(a.t > Ma.animlen-1 || a.t < 0){
						this.animTriggerName = a.name;
						a.playing = false;
						this.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnyAnimFinished, this.inst);
						this.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnimFinished, this.inst);
						a.t = cr.clamp(a.t, 0 , Ma.animlen-1);
						//this.activeAnims.splice(a.playingIndex,1)
						//a.playingIndex = -1;
						
					};
				};
			
			};		
		};*/
		
	
	///////////////////// anim transfer code
	
	var a0flag
	var a1flag
	//var count = 0;
	for(var key in this.transfs){
		//console.log(key);
		a = this.transfs[key];
		//count++
		if(!a[0].playing && !a[1].playing){ // both animations are not playing, user stopped them some other way, kill the transfer, move onto next one
		
		delete this.transfs[key];
		continue;
		
		}
		
		a0flag = false;
		a1flag = false;
		
		a[3] += a[4]*a[2]*dt; //adjust t value for transfer
		
		if(a[3] < 0){ // transfer running backwards, hit end, a[1] ---> a[0]
			//a[1].playing = false // will also delete transfer with later check
			a1flag = true;
			a[3] = 0;
		};
		
		if(a[3] > 1){ // transfer running forwards, hit end, a[0] ---> a[1]
			//a[0].playing = false; // will also delete transfer with later check
			a0flag = true;
			a[3] = 1;
		};
		
		if(a[0].playing){ // or else influences will be modified if animations is stopped, which is really bad
			Ma = Sanims[a[0].name];
			//if(a[0].bwd !== a[0].fwd) inf[Ma.frames[a[0].bwd]] *= 1-a[3]; // need this or possible multiple scaling occurs
			//inf[Ma.frames[a[0].fwd]] *= 1-a[3];
			a[0].s = 1-a[3]			
		};
		
		if(a[1].playing){ // or else influences will be modified if animation is stopped, which is really bad
			Ma = Sanims[a[1].name];
			//if(a[1].bwd !== a[1].fwd)	inf[Ma.frames[a[1].bwd]] *= a[3];  // need this or possible multiple scaling occurs
			//inf[Ma.frames[a[1].fwd]] *= a[3];
			a[1].s = a[3]
		};
		
		if(a0flag){ 
			a[0].playing = false; 
			//alert(this.activeAnims)
			//this.activeAnims.splice(a[0].playingIndex,1)
			//alert(this.activeAnims)
			//a[0].playingIndex = -1;
		};
		if(a1flag){
			a[1].playing = false; 
			//alert(this.activeAnims)
			//this.activeAnims.splice(a[1].playingIndex,1)
			//alert(this.activeAnims)
			//a[1].playingIndex = -1;
		};
		
		if(!a[0].playing || !a[1].playing){ // if one or the other is not playing, delete the animation transfer, helps cut down on ifs and works if user kills an animation on their own, transfer is then invalidated.
			delete this.transfs[key];
			//alert("transfer complete");
		};
	};
	
	//console.log(count);
	
	};
	
	/*behinstProto.tick2= function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};*/
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		/*propsections.push({
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
		});*/
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
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

	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname])) return false; // can't start an animation that doesn't exist
		
		//var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		}
		
		return this.anims[animname].playing
		
	};
	
	Cnds.prototype.CompareFrame = function (animname,cmp, framenum)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname])) return false; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		}
		
		return cr.do_cmp(this.anims[animname].t, cmp, framenum);
	};
	
	Cnds.prototype.CompareAnimSpeed = function (animname ,cmp, x)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname])) return false; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		}
		
		var s = this.anims[animname].speed; //mult X this.anims[animname].pong // this is how sprite does it sorta so... why not follow weird standard
		return cr.do_cmp(s, cmp, x);
	};
	
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	
	// if these two with maptriggering are causing strange bugs when the thing that triggers them is happenening when they're triggered, bug is likely caused because they dont have something like mapanim[map].inanimtrigger
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	
	Cnds.prototype.PickBones = function (type)
	{
		if(!this.inst.model || type !== this.inst.boneType) return;
		
		var sol = type.getCurrentSol(); // may need to pass in the type, not sure if just having one is a legal move in the c2 engine, I think it isn't.

		sol.select_all = false // we want to provide a custom list of instances, not use the list of all instances
		
		sol.instances = this.inst.model.boneInstances.slice(); // this is a list of all the C2 bones this object has, need to make a clone with concat()/slice() cause further things could modify/narrow sol. Use concat() or slice(0)
		// js perf indicated slice() is faster in most browsers http://jsperf.com/duplicate-array-slice-vs-concat/3 
		
		return true // that should be all, return true so this condition fires 
		
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.SkinTransf = function (animname0,animname1,dur)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname0] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname1] 
		&& animname0 !== animname1)) return; // can't start an animation that doesn't exist
		
		
		
		
		if(!this.anims[animname0]){
			this.anims[animname0] = new SkinAnimObject(this.uidinc++,animname0,this);
		};
		if(!this.anims[animname1]){
			this.anims[animname1] = new SkinAnimObject(this.uidinc++,animname1,this);
		};
		
		var a0,a1,durnorm
		if(dur<0){ // more useful for controllers
		a0 = this.anims[animname1];
		a1 = this.anims[animname0];
		durnorm = dur*-1
		}else{
		a0 = this.anims[animname0];
		a1 = this.anims[animname1];
		durnorm = dur
		}
		
		if(a1.playing && !a0.playing) return; // the animation is already fully transferred, exit.
		
		if(!a0.playing){
			//a0.playingIndex = this.activeAnims.push(animname0) - 1
			a0.playing = true;
		};
		if(!a1.playing){
			//a1.playingIndex = this.activeAnims.push(animname1) - 1
			a1.playing = true;
		};
		
		if(a0.uid < a1.uid){
		var key = ""+a0.uid+","+a1.uid
		}else{
		var key = ""+a1.uid+","+a0.uid
		};
		
		var moddur = 1/durnorm;
		
		if(this.transfs.hasOwnProperty(key)){

			this.transfs[key][2] = moddur;
			
			if(a0.uid < a1.uid){
				//this.transfs[key][0] = a0;
				//this.transfs[key][1] = a1;
				//[3] isn't modified, theres already a transfer in progress so dont interrupt it, just change direction/duration
				this.transfs[key][4] = 1; // set the direction
			}else{
				//this.transfs[key][0] = a1;
				//this.transfs[key][1] = a0;
				//[3] isn't modified, theres already a transfer in progress so dont interrupt it, just change direction/duration
				this.transfs[key][4] = -1; // set the direction
			};
			
		}else{
			if(a0.uid < a1.uid){
				this.transfs[key] = [a0,a1,moddur,0,1]; //start from the beginning, go forwards
			}else{
				this.transfs[key] = [a1,a0,moddur,1,-1]; //start from the end, go backwards
			};
		}
		
	
	};
	
	Acts.prototype.AlertSkin = function ()
	{
	if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile])) return alert("Skin anim info alert : model not loaded");
	if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims)) return alert("Skin anim info alert : no skinned animations in this model"); // can't start an animation that doesn't exist
		
	
	var str = "",key
	for(key in this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims){
	str = str+"ANIM NAME : [ "+key+" ]  ANIM LENGTH : [ "+this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[key].length+" ] , \n"
	};
	alert(str);
	
	};
	// need to rename functions... i should be able to just modify the player from the controller shouldn't I ?
	Acts.prototype.PlaySkinAnim = function (animname,Poption)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname])) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		}
		a = this.anims[animname]
		if(Poption === 1){
			a.t = 0;
			//a.pong = 1; //reset bounce as well.
			a.reset();
		}		
		if(a.playing){
		return;
		}
				
		//a.playingIndex = this.activeAnims.push(animname) - 1 //get index in playingarray for easy removal
		a.playing = true;
	};
	
	Acts.prototype.StopSkinAnim = function (animname)
	{
		if(!this.anims[animname] || !this.anims[animname].playing) return
		
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims )) return; // can't start an animation that doesn't exist
		
		var a = this.anims[animname];
		//this.activeAnims.splice(a.playingIndex,1)
		//a.playingIndex = -1;
		a.playing = false;
		
	};
	
	Acts.prototype.StopAllSkinAnim = function ()
	{	
		
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims)) return; // can't start an animation that doesn't exist
		
		var L,a;
		
		//var inf = this.inst.model.morphTargetInfluences;
		var Ma =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims;
		//var bool = reset === 0;
		
		/*for(L = this.activeAnims.length-1;L>-1;L--){
		a = this.anims[this.activeAnims[L]];
		a.playingIndex = -1;
		a.playing = false;
		};*/
		
		for(L in this.anims){
			a = this.anims[L];
			a.playing = false;
			//this.inst.model.pose();
			//this.inst.model.skeleton.update();
		};		
		
		/*if(bool){ // need special treatment to reset ALL influences, not just those of animations that are playing (weird behaviour if it did that)
			for(L in this.anims){
				a = this.anims[L];
				inf[Ma[L].frames[a.bwd]] = 0;
				inf[Ma[L].frames[a.fwd]] = 0;
				//alert('test')
			};
		}*/
		
		/*if(this.animTriggerName){
		this.resetAllanims = true;
		this.bool = bool;
		}else{
		this.activeAnims.length = 0;
		};*/
		
	};
	
	Acts.prototype.SetSkinScale = function (animname,scale)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);		
		};
		
		this.anims[animname].s = scale;
		
	};
	
	Acts.prototype.SetSkinSpeed = function (animname,speed)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);	
		};
		
		this.anims[animname].speed = speed;
		
	};
	
	Acts.prototype.SetSkinFrame = function (animname,framet)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		};
		
		var Ma = this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname];
		//var inf = this.inst.model.morphTargetInfluences;
		a =  this.anims[animname];
		var newT = cr.clamp(framet,0,Ma.length);
		if(newT !== a.t){
			a.t = newT 
			a.reset(); // doesn't update influences
			a.resetBlendWeights();
			a.updateToCurrPos();
			// update the animation live in the action instead of next frame
		}

		/*var t = (a.t%1+1)%1;
		inf[Ma.frames[a.fwd]] = (t)*a.s;
		inf[Ma.frames[a.bwd]] = (1-t)*a.s;*/
		
		//this.updateInfluences();
	};
	
	Acts.prototype.SetSkinTween = function (animname0,animname1,tween)
	{
	
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname0] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname1] )) return; // can't start an animation that doesn't exist
		
		if(!this.anims[animname0]){
			this.anims[animname0] = new SkinAnimObject(this.uidinc++,animname0,this);
		};
		if(!this.anims[animname1]){
			this.anims[animname1] = new SkinAnimObject(this.uidinc++,animname1,this);
		};
		
		this.anims[animname0].s = 1-tween;
		this.anims[animname1].s = tween;
		

	};
	
	Acts.prototype.SkinSettings = function (animname,loop,pingpong)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname] )) return; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		};
	
		this.anims[animname].looping = loop === 0;
		this.anims[animname].pingpong = pingpong === 0;
	};
	
	Acts.prototype.SetSkinInterpolation = function (animname,intType)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname] )) return; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new SkinAnimObject(this.uidinc++,animname,this);
		};
	
		this.anims[animname].interpolationType = intType // 0 = linear, 1 = catmullrom, 2 = catmullrom forward. Updating three.js versions might break this and the default property.
	};
	
	//constructor for object used to represent each skin animation
	function SkinAnimObject(uid,animname,behav) {
		this.speed = 1; // should probably control the default speed through some means. // inst.runtime.Q3D.loadedObjectsInfo[ inst.modelFile].Sanims[animname].fps assume animation length gives the initial speed
		this.t = 0;
		//this.fwd = 0;
		//this.bwd = 0;
		//this.fwdLast = 0;
		//this.bwdLast = 0;
		this.s = 1;
		this.playing = false;
		//this.playingIndex = -1;
		this.looping = true;
		this.pingpong = false;
		//this.pong = 1;
		this.uid = uid;
		this.name = animname;
		this.behav = behav
		
		this.interpolationType = this.behav.properties[1];//THREE.AnimationHandler.LINEAR;
		this.data = behav.runtime.Q3D.loadedObjectsInfo[ behav.inst.modelFile].Sanims[animname];
		if( behav.inst.model ) this.hierarchy = THREE.AnimationHandler.parse( behav.inst.model );
		
		// is this a good place? i think so, need to grab ref to prev and next key for timing stuff right at the beginning and on any hard time change/set.
		this.reset();
		
	};
	
	SkinAnimObject.prototype = {
	
			keyTypes:  [ "pos", "rot", "scl" ],
			
			updateToCurrPos : function(){
			
			if(this.s === 0) return;

				var duration = this.data.length; //this.data.length;

				if ( this.t > duration || this.t < 0 ) {

					if ( this.looping ) {

						if (this.pingpong){
						
							if(this.t < 0){
								this.t = 0;
								this.speed = Math.abs(this.speed);
							}else{
								this.t = duration;
								this.speed = Math.abs(this.speed)*-1;
							}
						
						}else{
						
						this.t %= duration;

						if (this.t < 0 )
							this.t += duration;
							
						};

						this.reset();

					} else {

						//a.stop();
						if (this.pingpong){
							
							if(this.t < 0){
								this.t = 0;
								this.speed = Math.abs(this.speed);
								this.playing = false;
								
								this.behav.animTriggerName = this.name;
								this.behav.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnyAnimFinished, this.behav.inst);
								this.behav.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnimFinished, this.behav.inst);
								
							}else{
								this.t = duration;
								this.speed = Math.abs(this.speed)*-1;
							}
						
						}else{
						
							this.playing = false;
							
							this.behav.animTriggerName = this.name;
							this.behav.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnyAnimFinished, this.behav.inst);
							this.behav.runtime.trigger(cr.behaviors.SkinCont1.prototype.cnds.OnAnimFinished, this.behav.inst);
							
						};

					}

				}

				for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

					var object = this.hierarchy[ h ];
					//alert(object)
					var animationCache = object.animationCache.animations[this.name];
					var blending = object.animationCache.blending;

					// loop through pos/rot/scl

					for ( var t = 0; t < 3; t ++ ) {

						// get keys

						var type    = this.keyTypes[ t ];
						var prevKey = animationCache.prevKey[ type ];
						var nextKey = animationCache.nextKey[ type ];

						if ( ( this.speed > 0 && nextKey.time <= this.t ) ||
							( this.speed < 0 && prevKey.time >= this.t ) ) {

							prevKey = this.data.hierarchy[ h ].keys[ 0 ];
							nextKey = this.getNextKeyWith( type, h, 1 );

							while ( nextKey.time < this.t && nextKey.index > prevKey.index ) {

								prevKey = nextKey;
								nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

							}

							animationCache.prevKey[ type ] = prevKey;
							animationCache.nextKey[ type ] = nextKey;

						}

						var scale = (this.t - prevKey.time ) / ( nextKey.time - prevKey.time );

						var prevXYZ = prevKey[ type ];
						var nextXYZ = nextKey[ type ];

						if ( scale < 0 ) scale = 0;
						if ( scale > 1 ) scale = 1;

						// interpolate

						if ( type === "pos" ) {

							if ( this.interpolationType === THREE.AnimationHandler.LINEAR ) {

								newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
								newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
								newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

								// blend
								var proportionalWeight = this.s / ( this.s + blending.positionWeight );
								object.position.lerp( newVector, proportionalWeight );
								blending.positionWeight += this.s;

							} else if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
										this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

								points[ 0 ] = this.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
								points[ 1 ] = prevXYZ;
								points[ 2 ] = nextXYZ;
								points[ 3 ] = this.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

								scale = scale * 0.33 + 0.33;

								var currentPoint = interpolateCatmullRom( points, scale );
								var proportionalWeight = this.s / ( this.s + blending.positionWeight );
								blending.positionWeight += this.s;

								// blend

								var vector = object.position;

								vector.x = vector.x + ( currentPoint[ 0 ] - vector.x ) * proportionalWeight;
								vector.y = vector.y + ( currentPoint[ 1 ] - vector.y ) * proportionalWeight;
								vector.z = vector.z + ( currentPoint[ 2 ] - vector.z ) * proportionalWeight;

								if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

									var forwardPoint = interpolateCatmullRom( points, scale * 1.01 );

									target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
									target.sub( vector );
									target.y = 0;
									target.normalize();

									var angle = Math.atan2( target.x, target.z );
									object.rotation.set( 0, angle, 0 );

								}

							}

						} else if ( type === "rot" ) {

							THREE.Quaternion.slerp( prevXYZ, nextXYZ, newQuat, scale );

							// Avoid paying the cost of an additional slerp if we don't have to
							if ( blending.quaternionWeight === 0 ) {

								object.quaternion.copy(newQuat);
								blending.quaternionWeight = this.s;

							} else {

								var proportionalWeight = this.s / ( this.s + blending.quaternionWeight );
								THREE.Quaternion.slerp( object.quaternion, newQuat, object.quaternion, proportionalWeight );
								blending.quaternionWeight += this.s;

							}

						} else if ( type === "scl" ) {

							newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
							newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
							newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

							var proportionalWeight = this.s / ( this.s + blending.scaleWeight );
							object.scale.lerp( newVector, proportionalWeight );
							blending.scaleWeight += this.s;

						}

					}

				}
			
				var binsts = this.behav.inst.model.boneInstances
				
				for(var i = 0, L = binsts.length; i < L ; i++){
					binsts[i].set_bbox3D_changed(); // notify the individual bone instances of their animation updated state.
				};
			
			},
			
			resetBlendWeights: function () {

				for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

					var object = this.hierarchy[ h ];
					var animationCache = object.animationCache;

					if ( animationCache !== undefined ) {

						var blending = animationCache.blending;

						blending.positionWeight = 0.0;
						blending.quaternionWeight = 0.0;
						blending.scaleWeight = 0.0;

					}

				}

			},
			
			reset: function () {

			for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

					var object = this.hierarchy[ h ];

					if ( object.animationCache === undefined ) {

						object.animationCache = {
							animations: {},
							blending: {
								positionWeight: 0.0,
								quaternionWeight: 0.0,
								scaleWeight: 0.0
							}
						};
					}

					var name = this.name;
					var animations = object.animationCache.animations;
					var animationCache = animations[ name ];

					if ( animationCache === undefined ) {

						animationCache = {
							prevKey: { pos: 0, rot: 0, scl: 0 },
							nextKey: { pos: 0, rot: 0, scl: 0 },
							originalMatrix: object.matrix
						};

						animations[ name ] = animationCache;

					}

					// Get keys to match our current time

					for ( var t = 0; t < 3; t ++ ) {

						var type = this.keyTypes[ t ];

						var prevKey = this.data.hierarchy[ h ].keys[ 0 ];
						var nextKey = this.getNextKeyWith( type, h, 1 );

						while ( nextKey.time < this.t && nextKey.index > prevKey.index ) {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						}

						animationCache.prevKey[ type ] = prevKey;
						animationCache.nextKey[ type ] = nextKey;

					}

				}

			},
			
			getNextKeyWith: function ( type, h, key ) {

			var keys = this.data.hierarchy[ h ].keys;

			if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
				 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

				key = key < keys.length - 1 ? key : keys.length - 1;

			} else {

				key = key % keys.length;

			}

			for ( ; key < keys.length; key ++ ) {

				if ( keys[ key ][ type ] !== undefined ) {

					return keys[ key ];

				}

			}

			return this.data.hierarchy[ h ].keys[ 0 ];

		},

		getPrevKeyWith: function ( type, h, key ) {

			var keys = this.data.hierarchy[ h ].keys;

			if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
				this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

				key = key > 0 ? key : 0;

			} else {

				key = key >= 0 ? key : key + keys.length;

			}


			for ( ; key >= 0; key -- ) {

				if ( keys[ key ][ type ] !== undefined ) {

					return keys[ key ];

				}

			}

			return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

		}
	};

	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	
	Exps.prototype.AnimTime = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.anims[animname]) set = this.anims[animname].t
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.AnimLength = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile]
		&&this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims
		&&this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname]) set = this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Sanims[animname].length;
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.AnimSpeed = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 1;
		if(this.anims[animname]) set = this.anims[animname].speed
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.AnimWeight = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 1;
		if(this.anims[animname]) set = this.anims[animname].s
		ret.set_float(set);			// for returning floats
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());;