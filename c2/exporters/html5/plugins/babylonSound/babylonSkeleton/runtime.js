// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonSkeleton = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonSkeleton.prototype;

	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function (behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function () { };

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst; // associated object instance to modify
		this.runtime = type.runtime;
		if (this.inst.mytype == "_mesh") {
			this.meshname = this.inst.properties[0];
		}
		else {
			this.meshname = "mesh" + this.inst.uid;
		}
	};

	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function () { };

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
	Acts.prototype.BoneRotate = function (id, x, y, z) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			var bone = this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id];
		}
		else {
			var bone = mesh.skeleton.bones[id];
		}
		var initMat = bone.getLocalMatrix().clone();
		var mat = bone.getLocalMatrix().copyFrom(initMat);
		mat.multiplyToRef(BABYLON.Matrix.RotationX(x * (Math.PI / 180)), mat);
		mat.multiplyToRef(BABYLON.Matrix.RotationY(y * (Math.PI / 180)), mat);
		mat.multiplyToRef(BABYLON.Matrix.RotationZ(z * (Math.PI / 180)), mat);

	};
	Acts.prototype.BoneScale = function (id, x, y, z) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			var bone = this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id];
		}
		else {
			var bone = mesh.skeleton.bones[id];
		}
		var initMat = bone.getLocalMatrix().clone();
		var mat = bone.getLocalMatrix().copyFrom(initMat);
		mat.multiplyToRef(BABYLON.Matrix.Scaling(x, y, z), mat);
	};
	Acts.prototype.BoneTranslate = function (id, x, y, z) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			var bone = this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id];
		}
		else {
			var bone = mesh.skeleton.bones[id];
		}
		var initMat = bone.getLocalMatrix().clone();
		var mat = bone.getLocalMatrix().copyFrom(initMat);
		mat.multiplyToRef(BABYLON.Matrix.Translation(x, y, z), mat);
	};
	Acts.prototype.SkeletonEnableBlending = function (speed) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].enableBlending(speed);
		}
		else {
			mesh.skeleton.enableBlending(speed);
		}
	};
	Acts.prototype.SkeletonCreateAnimRange = function (animName, fro, to) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].createAnimationRange(animName, fro, to);
		}
		else {
			mesh.skeleton.createAnimationRange(animName, fro, to);
		}

	};
	Acts.prototype.SkeletonBeginAnimation = function (animName, loop, speed) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].beginAnimation(animName, loop, speed);
		}
		else {
			mesh.skeleton.beginAnimation(animName, loop, speed);
			
		}
	};
	Acts.prototype.SkeletonStopAnimation = function () {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].stopAnimation(mesh.skeleton);
		}
		else {
			this.runtime.scenes[this.inst.properties[1]].stopAnimation(mesh.skeleton);
		}
	};
	Acts.prototype.BoneBeginAnimation = function (id, animName, loop, speed) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].beginAnimation(animName, loop, speed);
		}
		else {
			mesh.skeleton.bones[id].beginAnimation(animName, loop, speed);
			
		}
	};
	Acts.prototype.BoneStopAnimation = function (id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].stopAnimation(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id]);
		}
		else {
			this.runtime.scenes[this.inst.properties[1]].stopAnimation(mesh.skeleton.bones[id]);
		}
	};

	Acts.prototype.GoToFrame = function (id,frame) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (!mesh.skeleton) {
			this.runtime.scenes[this.inst.properties[1]].skeletons[0].getAnimatables()[id].animations[0].goToFrame(frame);
		}else {
			mesh.skeleton.getAnimatables()[id].animations[0].goToFrame(frame);
		}
	};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() { };

	Exps.prototype.BoneID = function (ret, name) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_string(mesh.skeleton.getBoneIndexByName(name));
		}
		else {
			ret.set_string(this.runtime.scenes[this.inst.properties[1]].skeletons[0].getBoneIndexByName(name));
		}

	};

	Exps.prototype.BonesCount = function (ret) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_int(mesh.skeleton.bones.length);
		}
		else {
			ret.set_int(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones.length);
		}

	};

	Exps.prototype.BoneXPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getPosition().x);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getPosition().x);
		}

	};

	Exps.prototype.BoneYPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getPosition().y);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getPosition().y);
		}

	};

	Exps.prototype.BoneZPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getPosition().z);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getPosition().z);
		}

	};


	Exps.prototype.BoneAbsXPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getAbsolutePosition().x);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getAbsolutePosition().x);
		}

	};

	Exps.prototype.BoneAbsYPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getAbsolutePosition().y);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getAbsolutePosition().y);
		}

	};

	Exps.prototype.BoneAbsZPos = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getAbsolutePosition().z);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getAbsolutePosition().z);
		}

	};


	Exps.prototype.BoneXRot = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getRotation().x);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getRotation().x);
		}

	};

	Exps.prototype.BoneYRot = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getRotation().y);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getRotation().y);
		}

	};

	Exps.prototype.BoneZRot = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getRotation().z);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getRotation().z);
		}

	};


	Exps.prototype.BoneXScale = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getScale().x);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getScale().x);
		}

	};

	Exps.prototype.BoneYScale = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getScale().y);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getScale().y);
		}

	};

	Exps.prototype.BoneZScale = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_float(mesh.skeleton.bones[id].getScale().z);
		}
		else {
			ret.set_float(this.runtime.scenes[this.inst.properties[1]].skeletons[0].bones[id].getScale().z);
		}

	};

	Exps.prototype.CurrentFrame = function (ret, id) {
		var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
		if (mesh.skeleton) {
			ret.set_int(mesh.skeleton.getAnimatables()[id].animations[0].currentFrame);
		}
		else {
			ret.set_int(this.runtime.scenes[this.inst.properties[1]].skeletons[0].getAnimatables()[id].animations[0].currentFrame);
		}

	};
	behaviorProto.exps = new Exps();

}
	());
