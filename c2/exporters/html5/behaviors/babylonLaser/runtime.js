// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonLaser = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonLaser.prototype;

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

	behinstProto.onCreate = function () {};

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	var Ray2 = BABYLON.Ray;

	Ray2.prototype.showLine = null;
	Ray2.prototype.rayLine = null;

	// Reusing the Ray, so we don't have to create new Objects. ----------
	Ray2.prototype.update = function (origin, direction) {
		this.origin = origin;
		this.direction = direction;
		if (this.showLine)
			this.rayLine = BABYLON.Mesh.CreateLines(null, [this.origin, this.origin.add(this.direction)], null, null, this.rayLine);
	};
	// This solution was suggested by Deltakosh --------------------------
	Ray2.getDirectionFromRotation = function (rot, len, axis) {
		var rotationmatrix = BABYLON.Matrix.RotationYawPitchRoll(rot.y, rot.x, rot.z);
		switch (axis) {
		case 0:
			return BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(len, 0, 0), rotationmatrix);
			break;
		case 1:
			return BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, len, 0), rotationmatrix);
			break;
		case 2:
			return BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, len), rotationmatrix);
			break;
		}

	};

	// This works for objects with their position/scale changed ----------
	Ray2.prototype.intersectsBoxWorld = function (box) {
		return this.intersectsBoxMinMax(box.minimumWorld, box.maximumWorld);
	};

	// Draws a Line and stores the resulting Mesh for reuse. -------------
	Ray2.prototype.showLine = function (scene, r, g, b) {
		this.rayLine = BABYLON.Mesh.CreateLines("rayLine", [this.origin, this.origin.add(this.direction)], scene, true);
		this.rayLine.color.r = r;
		this.rayLine.color.g = g;
		this.rayLine.color.b = b;
		this.showLine = true;
	};

	// Removes the Line. -------------------------------------------------
	Ray2.prototype.removeLine = function () {
		this.showLine = false;
		if (this.rayLine)
			this.rayLine.dispose();
	};

	behinstProto.tick = function () {
		if (this.inst.mytype == "_newmesh") {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid)) {
				if (!this.done) {
					this.holder = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid);
					this.holder.isPickable = false;
					this.scene = this.runtime.scenes[this.inst.properties[1]];
					this.rot = this.holder._rotationQuaternion ? this.holder._rotationQuaternion.toEulerAngles() : this.holder.rotation;
					this.length = this.properties[1]; ;
					this.axis = this.properties[0];
					this.offX = parseFloat(this.properties[3].split(",")[0]);
					this.offY = parseFloat(this.properties[3].split(",")[1]);
					this.offZ = parseFloat(this.properties[3].split(",")[2]);
					this.ray = new Ray2(this.holder.position, Ray2.getDirectionFromRotation(this.rot, this.length, this.axis), this.scene, this.length, true);
					this.ray.showLine(this.scene, hex2rgb(this.properties[2]).r, hex2rgb(this.properties[2]).g, hex2rgb(this.properties[2]).b);
					var behav = this;
					this.scene.registerBeforeRender(function () {
						behav.rot = behav.holder._rotationQuaternion ? behav.holder._rotationQuaternion.toEulerAngles() : behav.holder.rotation;
						behav.ray.update(new BABYLON.Vector3(behav.holder.absolutePosition.x + behav.offX, behav.holder.absolutePosition.y + behav.offY, behav.holder.absolutePosition.z + behav.offZ), Ray2.getDirectionFromRotation(behav.rot, behav.length, behav.axis), behav.length);
					});
					this.done = true;

				}
			}
		} else if (this.inst.mytype == "_mesh") {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0])) {
				if (!this.done) {
					this.holder = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0]);
					this.holder.isPickable = false;
					this.scene = this.runtime.scenes[this.inst.properties[1]];
					this.rot = this.holder._rotationQuaternion ? this.holder._rotationQuaternion.toEulerAngles() : this.holder.rotation;
					this.length = this.properties[1]; ;
					this.axis = this.properties[0];
					this.offX = parseFloat(this.properties[3].split(",")[0]);
					this.offY = parseFloat(this.properties[3].split(",")[1]);
					this.offZ = parseFloat(this.properties[3].split(",")[2]);
					this.ray = new Ray2(this.holder.position, Ray2.getDirectionFromRotation(this.rot, this.length, this.axis), this.scene, this.length, true);
					this.ray.showLine(this.scene, hex2rgb(this.properties[2]).r, hex2rgb(this.properties[2]).g, hex2rgb(this.properties[2]).b);
					var behav = this;
					this.scene.registerBeforeRender(function () {
						behav.rot = behav.holder._rotationQuaternion ? behav.holder._rotationQuaternion.toEulerAngles() : behav.holder.rotation;
						behav.ray.update(new BABYLON.Vector3(behav.holder.absolutePosition.x + behav.offX, behav.holder.absolutePosition.y + behav.offY, behav.holder.absolutePosition.z + behav.offZ), Ray2.getDirectionFromRotation(behav.rot, behav.length, behav.axis), behav.length);
					});
					this.done = true;

				}
			}
		} else if (this.inst.mytype == "_camera") {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getCameraByName(this.inst.properties[0])) {
				if (!this.done) {
					this.holder = this.runtime.scenes[this.inst.properties[1]].getCameraByName(this.inst.properties[0]);
					this.holder.isPickable = false;
					this.scene = this.runtime.scenes[this.inst.properties[1]];
					this.rot = this.holder._rotationQuaternion ? this.holder._rotationQuaternion.toEulerAngles() : this.holder.rotation;
					this.length = this.properties[1]; ;
					this.axis = this.properties[0];
					this.offX = parseFloat(this.properties[3].split(",")[0]);
					this.offY = parseFloat(this.properties[3].split(",")[1]);
					this.offZ = parseFloat(this.properties[3].split(",")[2]);
					this.ray = new Ray2(this.holder.position, Ray2.getDirectionFromRotation(this.rot, this.length, this.axis), this.scene, this.length, true);
					this.ray.showLine(this.scene, hex2rgb(this.properties[2]).r, hex2rgb(this.properties[2]).g, hex2rgb(this.properties[2]).b);
					var behav = this;
					this.scene.registerBeforeRender(function () {
						behav.rot = behav.holder._rotationQuaternion ? behav.holder._rotationQuaternion.toEulerAngles() : behav.holder.rotation;
						behav.ray.update(new BABYLON.Vector3(behav.holder.position.x + behav.offX, behav.holder.position.y + behav.offY, behav.holder.position.z + behav.offZ), Ray2.getDirectionFromRotation(behav.rot, behav.length, behav.axis), behav.length);
					});
					this.done = true;

				}
			}
		}
	};

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections) {};

	behinstProto.onDebugValueEdited = function (header, name, value) {};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetColor = function (r, g, b) {
		this.ray.rayLine.color.r = r;
		this.ray.rayLine.color.g = g;
		this.ray.rayLine.color.b = b;
	};

	Acts.prototype.SetLength = function (l) {
		this.length = l;
	};
	Acts.prototype.Hide = function () {
		this.ray.rayLine.isVisible = false;
	};

	Acts.prototype.Show = function () {
		this.ray.rayLine.isVisible = true;
	};

	Acts.prototype.CreateDecal = function (image, size, zoff) {

		if (this.scene.pickWithRay(this.ray).pickedMesh) {
			this.mat = new BABYLON.StandardMaterial("decalMat" + this.inst.uid, this.scene);
			this.mat.diffuseTexture = new BABYLON.Texture(image, this.scene);
			this.mat.diffuseTexture.hasAlpha = true;
			this.mat.zOffset = zoff;
			this.decalSize = size.split(",");
			this.decalSize = new BABYLON.Vector3(parseFloat(this.decalSize[0]), parseFloat(this.decalSize[1]), parseFloat(this.decalSize[2]));
			this.decal = BABYLON.Mesh.CreateDecal("decal" + this.inst.uid, this.scene.pickWithRay(this.ray).pickedMesh, this.scene.pickWithRay(this.ray).pickedPoint, this.scene.pickWithRay(this.ray).getNormal(true), this.decalSize);
			this.decal.material = this.mat;
		}

	};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.BU = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).bu);
	};

	Exps.prototype.BV = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).bv);
	};

	Exps.prototype.Distance = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).distance);
	};

	Exps.prototype.FaceId = function (ret) {
		ret.set_int(this.scene.pickWithRay(this.ray).faceId);
	};

	Exps.prototype.HasHit = function (ret) {
		ret.set_int(this.scene.pickWithRay(this.ray).hit);
	};

	Exps.prototype.PickedMesh = function (ret) {
		if(this.scene.pickWithRay(this.ray).pickedMesh)
		{
			ret.set_string(this.scene.pickWithRay(this.ray).pickedMesh.name);
		}
		else
		{
			ret.set_string("null");
		}
		
	};

	Exps.prototype.PickedPointX = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).pickedPoint.x);
	};

	Exps.prototype.PickedPointY = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).pickedPoint.y);
	};

	Exps.prototype.PickedPointZ = function (ret) {
		ret.set_float(this.scene.pickWithRay(this.ray).pickedPoint.z);
	};
	Exps.prototype.PickedMeshUID = function (ret) {
		if(this.scene.pickWithRay(this.ray).pickedMesh)
		{
			ret.set_int(parseInt(this.scene.pickWithRay(this.ray).pickedMesh.name.split("mesh")[1]));
		}
		else
		{
			ret.set_int(-1);
		}	
	};
	behaviorProto.exps = new Exps();

}
	());
