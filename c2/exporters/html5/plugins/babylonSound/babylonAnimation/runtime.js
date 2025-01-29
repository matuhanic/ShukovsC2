// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonAnimation = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonAnimation.prototype;

	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function (behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function () {};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst; // associated object instance to modify
		this.runtime = type.runtime;
		this.done = false;
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () { 
		this.obj = []; // Will hold our object(s)
	};

	behinstProto.postCreate = function () { };

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.canvas.width / 2);
		xyz[1] = - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () { };

	behinstProto.loadFromJSON = function (o) { };

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.inst.mytype == "_mesh" || this.inst.mytype == "_light" || this.inst.mytype == "_camera" || this.inst.mytype == "_meshes") {
				if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0])) {

					var startVal,
						midVal,
						endVal;
					var startFrm,
						midFrm,
						endFrm;
					var param,
						fps,
						animName;

					animName = this.properties[0];
					param = this.properties[1];
					fps = this.properties[2];

					startVal = this.properties[4];
					midVal = this.properties[6];
					endVal = this.properties[8];

					startFrm = this.properties[3];
					midFrm = this.properties[5];
					endFrm = this.properties[7];

					var anim = new BABYLON.Animation(animName, param, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, true);
					anim.blendingSpeed = this.properties[9];

					// An array with all animation keys
					var keys = [];

					if (this.properties[10] == 1) {
						var easingFunction = new BABYLON.BackEase(this.properties[11]);
					}
					if (this.properties[10] == 2) {
						var easingFunction = new BABYLON.BounceEase(this.properties[12], this.properties[13]);
					}
					if (this.properties[10] == 3) {
						var easingFunction = new BABYLON.CubicEase();
					}
					if (this.properties[10] == 4) {
						var easingFunction = new BABYLON.ElasticEase(this.properties[14], this.properties[15]);
					}
					if (this.properties[10] == 5) {
						var easingFunction = new BABYLON.ExponentialEase(this.properties[16]);
					}
					if (this.properties[10] == 6) {
						var easingFunction = new BABYLON.PowerEase(this.properties[17]);
					}
					if (this.properties[10] == 7) {
						var easingFunction = new BABYLON.SineEase();
					}

					if (this.properties[10] != 0) // Not None
					{
						if (this.properties[18] == 0) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
						}
						if (this.properties[18] == 1) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
						}
						if (this.properties[18] == 2) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
						}
						anim.setEasingFunction(easingFunction);
					}

					if (param == "rotation.x" || param == "rotation.y" || param == "rotation.z") {
						startVal *= (Math.PI / 180);
						midVal *= (Math.PI / 180);
						endVal *= (Math.PI / 180);
					}

					keys.push({
						frame: startFrm,
						value: startVal
					});

					//At the animation key 20, the value of scaling is "0.2"
					keys.push({
						frame: midFrm,
						value: midVal
					});

					//At the animation key 100, the value of scaling is "1"
					keys.push({
						frame: endFrm,
						value: endVal
					});

					anim.setKeys(keys);

					if (this.inst.mytype == "_mesh") {
						this.obj[0] = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0]);
						this.obj[0].animations.push(anim);
					} else if (this.inst.mytype == "_light") {
						this.obj[0] = this.runtime.scenes[this.inst.properties[1]].getLightByName(this.inst.properties[0]);
						this.obj[0].animations.push(anim);
					} else if (this.inst.mytype == "_camera") {
						this.obj[0] = this.runtime.scenes[this.inst.properties[1]].getCameraByName(this.inst.properties[0]);
						this.obj[0].animations.push(anim);
					} else if (this.inst.mytype == "_meshes") {
						for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
							{
								var meshname = this.inst.properties[0] + i;
								this.obj[i] = this.runtime.scenes[this.inst.properties[1]].getMeshByName(meshname);
								this.obj[i].animations.push(anim);
							}
						}
					}
					this.done = true;
				}
			}
			if (this.inst.mytype == "_newmesh") {
				if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid)) {

					var startVal,
						midVal,
						endVal;
					var startFrm,
						midFrm,
						endFrm;
					var param,
						fps,
						animName;

					animName = this.properties[0];
					param = this.properties[1];
					fps = this.properties[2];

					startVal = this.properties[4];
					midVal = this.properties[6];
					endVal = this.properties[8];

					startFrm = this.properties[3];
					midFrm = this.properties[5];
					endFrm = this.properties[7];

					var anim = new BABYLON.Animation(animName, param, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, true);
					anim.blendingSpeed = this.properties[9];

					// An array with all animation keys
					var keys = [];

					if (this.properties[10] == 1) {
						var easingFunction = new BABYLON.BackEase(this.properties[11]);
					}
					if (this.properties[10] == 2) {
						var easingFunction = new BABYLON.BounceEase(this.properties[12], this.properties[13]);
					}
					if (this.properties[10] == 3) {
						var easingFunction = new BABYLON.CubicEase();
					}
					if (this.properties[10] == 4) {
						var easingFunction = new BABYLON.ElasticEase(this.properties[14], this.properties[15]);
					}
					if (this.properties[10] == 5) {
						var easingFunction = new BABYLON.ExponentialEase(this.properties[16]);
					}
					if (this.properties[10] == 6) {
						var easingFunction = new BABYLON.PowerEase(this.properties[17]);
					}
					if (this.properties[10] == 7) {
						var easingFunction = new BABYLON.SineEase();
					}

					if (this.properties[10] != 0) // Not None
					{
						if (this.properties[18] == 0) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
						}
						if (this.properties[18] == 1) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
						}
						if (this.properties[18] == 2) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
						}
						anim.setEasingFunction(easingFunction);
					}

					if (param == "rotation.x" || param == "rotation.y" || param == "rotation.z") {
						startVal *= (Math.PI / 180);
						midVal *= (Math.PI / 180);
						endVal *= (Math.PI / 180);
					}

					keys.push({
						frame: startFrm,
						value: startVal
					});

					//At the animation key 20, the value of scaling is "0.2"
					keys.push({
						frame: midFrm,
						value: midVal
					});

					//At the animation key 100, the value of scaling is "1"
					keys.push({
						frame: endFrm,
						value: endVal
					});

					anim.setKeys(keys);

					this.obj[0] = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid);
					this.obj[0].animations.push(anim);

					this.done = true;
				}
			}

			if (this.inst.mytype == "_newlight") {
				
				if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getLightByName("light" + this.inst.uid)) {
					var startVal,
						midVal,
						endVal;
					var startFrm,
						midFrm,
						endFrm;
					var param,
						fps,
						animName;

					animName = this.properties[0];
					param = this.properties[1];
					fps = this.properties[2];

					startVal = this.properties[4];
					midVal = this.properties[6];
					endVal = this.properties[8];

					startFrm = this.properties[3];
					midFrm = this.properties[5];
					endFrm = this.properties[7];

					var anim = new BABYLON.Animation(animName, param, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, true);
					anim.blendingSpeed = this.properties[9];

					// An array with all animation keys
					var keys = [];

					if (this.properties[10] == 1) {
						var easingFunction = new BABYLON.BackEase(this.properties[11]);
					}
					if (this.properties[10] == 2) {
						var easingFunction = new BABYLON.BounceEase(this.properties[12], this.properties[13]);
					}
					if (this.properties[10] == 3) {
						var easingFunction = new BABYLON.CubicEase();
					}
					if (this.properties[10] == 4) {
						var easingFunction = new BABYLON.ElasticEase(this.properties[14], this.properties[15]);
					}
					if (this.properties[10] == 5) {
						var easingFunction = new BABYLON.ExponentialEase(this.properties[16]);
					}
					if (this.properties[10] == 6) {
						var easingFunction = new BABYLON.PowerEase(this.properties[17]);
					}
					if (this.properties[10] == 7) {
						var easingFunction = new BABYLON.SineEase();
					}

					if (this.properties[10] != 0) // Not None
					{
						if (this.properties[18] == 0) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
						}
						if (this.properties[18] == 1) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
						}
						if (this.properties[18] == 2) {
							easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
						}
						anim.setEasingFunction(easingFunction);
					}

					if (param == "rotation.x" || param == "rotation.y" || param == "rotation.z") {
						startVal *= (Math.PI / 180);
						midVal *= (Math.PI / 180);
						endVal *= (Math.PI / 180);
					}

					keys.push({
						frame: startFrm,
						value: startVal
					});

					//At the animation key 20, the value of scaling is "0.2"
					keys.push({
						frame: midFrm,
						value: midVal
					});

					//At the animation key 100, the value of scaling is "1"
					keys.push({
						frame: endFrm,
						value: endVal
					});

					anim.setKeys(keys);
					
					this.obj[0] = this.runtime.scenes[this.inst.properties[1]].getLightByName("light" + this.inst.uid);
					this.obj[0].animations.push(anim);

					this.done = true;
				}
			}
		}

	}

	behinstProto.doStart = function () { }

	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections) { };

	behinstProto.onDebugValueEdited = function (header, name, value) { };
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() { };

	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() { };

	Acts.prototype.Begin = function (fr, to, speed, loop) {
		if (this.inst.mytype == "_meshes") {
			for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
				{
					this.runtime.scenes[this.inst.properties[1]].beginDirectAnimation(this.obj[i], [this.obj[i].getAnimationByName(this.properties[0])], fr, to, loop, speed);
				}
			}
		}
		else
		{
			this.runtime.scenes[this.inst.properties[1]].beginDirectAnimation(this.obj[0], [this.obj[0].getAnimationByName(this.properties[0])], fr, to, loop, speed);
		}

	};
	Acts.prototype.Stop = function () {
		
		if (this.inst.mytype == "_meshes") {
			for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
				{
					this.runtime.scenes[this.inst.properties[1]].stopAnimation(this.obj[i]);
				}
			}
		}
		else
		{
			this.runtime.scenes[this.inst.properties[1]].stopAnimation(this.obj[0]);
		}

	};
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() { };

	behaviorProto.exps = new Exps();

}
	());
