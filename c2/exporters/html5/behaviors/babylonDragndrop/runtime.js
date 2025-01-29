// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonDragndrop = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonDragndrop.prototype;

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
		if(this.inst.mytype == "_mesh")
		{
			this.meshname = this.inst.properties[0];
		}
		else if(this.inst.mytype == "_newmesh")
		{
			this.meshname = "mesh"+this.inst.uid;
		}
		
	};

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		
		if(!this.done)
		{
		if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname)) {

			var startingPoint;
			var currentMesh;
			var scene = this.runtime.scenes[this.inst.properties[1]];
			scene.getMeshByName(this.meshname).isPickable = true;
			var getGroundPosition = function () {
				// Use a predicate to get position on the ground
				var pickinfo = scene.pick(scene.pointerX, scene.pointerY);
				if (pickinfo.hit) {
					return pickinfo.pickedPoint;
				}

				return null;
			}

			var onPointerDown = function (evt) {
				if (evt.button !== 0) {
					return;
				}

				// check if we are under a mesh

				var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
				//alert(pickInfo.pickedMesh);
				if (pickInfo.hit) {
					currentMesh = pickInfo.pickedMesh;
					startingPoint = getGroundPosition();

					if (startingPoint) {
						setTimeout(function () {
							scene.activeCamera.detachControl(scene.canvas);
						}, 0);
					}
				}
			}

			var onPointerUp = function () {
				if (startingPoint) {
					scene.activeCamera.attachControl(scene.canvas, true);
					startingPoint = null;
					return;
				}
			}

			var onPointerMove = function (evt) {
				if (!startingPoint) {
					return;
				}

				var current = getGroundPosition();

				if (!current) {
					return;
				}

				var diff = current.subtract(startingPoint);

				if (currentMesh.name == this.meshname) // We dragged the current mesh
				{
					currentMesh.position.z += diff.z;
					currentMesh.position.y += diff.y;
				}

				startingPoint = current;

			}

			scene.canvas.addEventListener("pointerdown", onPointerDown, false);
			scene.canvas.addEventListener("pointerup", onPointerUp, false);
			scene.canvas.addEventListener("pointermove", onPointerMove, false);
			this.done = true;
			scene.onDispose = function () {
				scene.canvas.removeEventListener("pointerdown", onPointerDown);
				scene.canvas.removeEventListener("pointerup", onPointerUp);
				scene.canvas.removeEventListener("pointermove", onPointerMove);
			}
		}
		}
	};

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

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	behaviorProto.exps = new Exps();

}
	());
