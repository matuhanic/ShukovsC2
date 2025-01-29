// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.MorCont1 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.MorCont1.prototype;
		
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
		this.modelFile = this.inst.modelFile
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
	
	behinstProto.tick = function ()
	{
		var i,L ,t,s;
		var dt = this.runtime.getDt(this.inst);

		if(!(this.inst.model && this.inst.model.geometry && this.inst.model.geometry.morphTargets.length>0)) return; // return if theres no morph target to animate...
		
		var Manims =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims;
		var inf = this.inst.model.morphTargetInfluences;
		//var activeanims // need some sort of container for the animations that are active.
		var Ma;
		var a;
		
		//for(i = this.activeAnims.length-1; i>-1; i--){ // need to go backwards or splice can cause error for stopping anim.
		for(i in this.anims){
			if(!this.anims[i].playing) continue; // not playing, onto the next
			//Ma = Manims[this.activeAnims[i]];
			//if(!Ma) continue;
			//a = this.anims[this.activeAnims[i]];
			
			a = this.anims[i];
			Ma = Manims[a.name];
			
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
						this.runtime.trigger(cr.behaviors.MorCont1.prototype.cnds.OnAnyAnimFinished, this.inst);
						this.runtime.trigger(cr.behaviors.MorCont1.prototype.cnds.OnAnimFinished, this.inst);
						a.t = 0;
						//this.activeAnims.splice(a.playingIndex,1)
						//a.playingIndex = -1;
						
					};
				}else{
					a.t=a.t+a.speed*(dt);
					if(a.t > Ma.animlen-1 || a.t < 0){
						this.animTriggerName = a.name;
						a.playing = false;
						this.runtime.trigger(cr.behaviors.MorCont1.prototype.cnds.OnAnyAnimFinished, this.inst);
						this.runtime.trigger(cr.behaviors.MorCont1.prototype.cnds.OnAnimFinished, this.inst);
						a.t = cr.clamp(a.t, 0 , Ma.animlen-1);
						//this.activeAnims.splice(a.playingIndex,1)
						//a.playingIndex = -1;
						
					};
				};
			
			};		
		};
		
		/*this.animTriggerName = false;
		if(this.resetAllanims){
			if(this.bool){
			//var inf = this.inst.model.morphTargetInfluences;
			//var Ma =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims;
			// need special treatment to reset ALL influences, not just those of animations that are playing (weird behaviour if it did that)
				for(var L in this.anims){
					a = this.anims[L];
					inf[ Manims[L].frames[a.bwd]] = 0;
					inf[ Manims[L].frames[a.fwd]] = 0;
					//alert('test')
				};
			}
			this.activeAnims.length = 0;
			this.resetAllanims = false
		}*/	
	//this.animTriggerName = false;
	
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
			Ma = Manims[a[0].name];
			if(a[0].bwd !== a[0].fwd) inf[Ma.frames[a[0].bwd]] *= 1-a[3]; // need this or possible multiple scaling occurs
			inf[Ma.frames[a[0].fwd]] *= 1-a[3];
			
		};
		
		if(a[1].playing){ // or else influences will be modified if animation is stopped, which is really bad
			Ma = Manims[a[1].name];
			if(a[1].bwd !== a[1].fwd)	inf[Ma.frames[a[1].bwd]] *= a[3];  // need this or possible multiple scaling occurs
			inf[Ma.frames[a[1].fwd]] *= a[3];
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
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname])) return false; // can't start an animation that doesn't exist
		
		//var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		}
		
		return this.anims[animname].playing
		
	};
	
	Cnds.prototype.CompareFrame = function (animname,cmp, framenum)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname])) return false; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		}
		
		return cr.do_cmp(this.anims[animname].t, cmp, framenum);
	};
	
	Cnds.prototype.CompareAnimSpeed = function (animname ,cmp, x)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname])) return false; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		}
		
		var s = this.anims[animname].speed*this.anims[animname].pong // this is how sprite does it sorta so... why not follow weird standard
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
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MorphTransf = function (animname0,animname1,dur)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname0] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname1] 
		&& animname0 !== animname1)) return; // can't start an animation that doesn't exist
		
		
		
		if(!this.anims[animname0]){
			this.anims[animname0] = new MorphAnimObject(this.uidinc++,animname0);
		};
		if(!this.anims[animname1]){
			this.anims[animname1] = new MorphAnimObject(this.uidinc++,animname1);
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
	
	Acts.prototype.AlertMorph = function ()
	{
	if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile])) return alert("Morph anim info alert : model not loaded");
	if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims)) return alert("Morph anim info alert : no morph animations in this model"); // can't start an animation that doesn't exist
		
	
	var str = "",key
	for(key in this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims){
	str = str+"ANIM NAME : [ "+key+" ]  ANIM LENGTH : [ "+this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[key].animlen+" ] , \n"
	};
	alert(str);
	
	};
	
	Acts.prototype.PlayMorphAnim = function (animname,Poption)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname])) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		}
		a = this.anims[animname]
		if(Poption === 1){
			a.t = 0;
			a.pong = 1; //reset bounce as well.
		}		
		if(a.playing){
		return;
		}
				
		//a.playingIndex = this.activeAnims.push(animname) - 1 //get index in playingarray for easy removal
		a.playing = true;
	};
	
	Acts.prototype.StopMorphAnim = function (animname,reset)
	{
		if(!this.anims[animname] || !this.anims[animname].playing) return
		
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims )) return; // can't start an animation that doesn't exist
		
		var a = this.anims[animname];
		//this.activeAnims.splice(a.playingIndex,1)
		//a.playingIndex = -1;
		a.playing = false;
		
		var inf = this.inst.model.morphTargetInfluences;
		var Ma =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname];
		var bool = reset === 0;
		
		if(bool){
			inf[Ma.frames[a.bwd]] = 0;
			inf[Ma.frames[a.fwd]] = 0;
		};

	};
	
	Acts.prototype.StopAllMorphAnim = function (reset)
	{	
		
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims)) return; // can't start an animation that doesn't exist
		
		var L,a;
		
		var inf = this.inst.model.morphTargetInfluences;
		var Ma =  this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims;
		var bool = reset === 0;
		
		/*for(L = this.activeAnims.length-1;L>-1;L--){
		a = this.anims[this.activeAnims[L]];
		a.playingIndex = -1;
		a.playing = false;
		};*/
		
		for(L in this.anims){
			a = this.anims[L];
			a.playing = false;
		};		
		
		if(bool){ // need special treatment to reset ALL influences, not just those of animations that are playing (weird behaviour if it did that)
			for(L in this.anims){
				a = this.anims[L];
				inf[Ma[L].frames[a.bwd]] = 0;
				inf[Ma[L].frames[a.fwd]] = 0;
				//alert('test')
			};
		}
		
		/*if(this.animTriggerName){
		this.resetAllanims = true;
		this.bool = bool;
		}else{
		this.activeAnims.length = 0;
		};*/
		
	};
	
	Acts.prototype.SetMorphScale = function (animname,scale)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);		
		};
		
		this.anims[animname].s = scale;
		
	};
	
	Acts.prototype.SetMorphSpeed = function (animname,speed)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		};
		
		this.anims[animname].speed = speed;
		
	};
	
	Acts.prototype.SetMorphFrame = function (animname,framet)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname] )) return; // can't start an animation that doesn't exist
		
		var a;
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		};
		
		var Ma = this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname];
		var inf = this.inst.model.morphTargetInfluences;
		a =  this.anims[animname];
		
		a.t = cr.clamp(framet,0,Ma.animlen-1); // ((framet)%Ma.animlen+Ma.animlen)%Ma.animlen; 
		
		/*var t = (a.t%1+1)%1;
		inf[Ma.frames[a.fwd]] = (t)*a.s;
		inf[Ma.frames[a.bwd]] = (1-t)*a.s;*/
		
		//this.updateInfluences();
	};
	
	Acts.prototype.SetMorphTween = function (animname0,animname1,tween)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname0] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname1] )) return; // can't start an animation that doesn't exist
		
		if(!this.anims[animname0]){
			this.anims[animname0] = new MorphAnimObject(this.uidinc++,animname0);
		};
		if(!this.anims[animname1]){
			this.anims[animname1] = new MorphAnimObject(this.uidinc++,animname1);
		};
		
		this.anims[animname0].s = 1-tween;
		this.anims[animname1].s = tween;
	};
	
	Acts.prototype.MorphSettings = function (animname,loop,pingpong)
	{
		if(!( this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile] 
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&& this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname] )) return; // can't start an animation that doesn't exist
		
		if(!this.anims[animname]){
			this.anims[animname] = new MorphAnimObject(this.uidinc++,animname);
		};
	
		this.anims[animname].looping = loop === 0;
		this.anims[animname].pingpong = pingpong === 0;
	};
	
	//constructor for object used to represent each morph animation
	function MorphAnimObject(uid,animname) {
		this.speed = 30;
		this.t = 0;
		this.fwd = 0;
		this.bwd = 0;
		this.fwdLast = 0;
		this.bwdLast = 0;
		this.s = 1;
		this.playing = false;
		this.playingIndex = -1;
		this.looping = true;
		this.pingpong = false;
		this.pong = 1;
		this.uid = uid;
		this.name = animname;
	};
	
	behinstProto.updateInfluences = function()
	{
	
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	
	Exps.prototype.MorphFrame = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.anims[animname]) set = this.anims[animname].t
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.MorphLength = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile]
		&&this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims
		&&this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname]) set = this.runtime.Q3D.loadedObjectsInfo[this.inst.modelFile].Manims[animname].animlen;
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.MorphSpeed = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 30;
		if(this.anims[animname]) set = this.anims[animname].speed
		ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.MorphScale = function (ret,animname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 1;
		if(this.anims[animname]) set = this.anims[animname].s
		ret.set_float(set);			// for returning floats
	};
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());;