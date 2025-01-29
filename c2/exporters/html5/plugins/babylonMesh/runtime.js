// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonMeshSLE = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonMeshSLE.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;

	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () { };

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
		this.mytype = "_mesh";
		this.done = false;
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {
		//this.runtime.tickMe(this);
		this.runtime.tick2Me(this);
	};

	instanceProto.tick2 = function () {

		if (this.properties[2] == 1) // Construct 2 is taking the wheel
		{

			if (this.runtime.scenes[this.properties[1]] && this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0])) {
				
				if (!this.done) {

					var xscale = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).scaling.z;
					var yscale = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).scaling.y;
					this.width = (this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.z * xscale) * 2;
					this.height = (this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
					this.x = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).position.z;
					this.y = -this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).position.y;
					this.angle = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).rotation.x;
					this.set_bbox_changed();

					this.done = true;
					this.hotspotX = 0.5;
					this.hotspotY = 0.5;
					this.update_bbox();
				} else {
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).rotation.x = this.angle; // Euler
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).position.z = this.x;
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).position.y = -this.y;
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).isVisible = this.visible;
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).visibility = this.opacity;
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).scaling.z = this.width / (this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.z * 2);
					this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).scaling.y = this.height / (this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]).getBoundingInfo().boundingBox.extendSize.y * 2);

				}

			}

		}

	};

	instanceProto.tick = function () { };

	function getRGB(color) {
		var c2rgb = color.split(",");
		var r = c2rgb[0].split("(");
		var g = c2rgb[1];
		var b = c2rgb[2].split(")");
		r = r[1];
		g = g;
		b = b[0];
		return {
			r: r,
			g: g,
			b: b
		};
		return rgb;
	}

	function hex2rgb(hex) {
		return {
			r: hex & 0xff,
			g: (hex >> 8) & 0xff,
			b: (hex >> 16) & 0xff
		};
	}

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () { };

	// called when saving the full state of the game
	instanceProto.saveToJSON = function () {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	// only called if a layout object - draw to a this.babylon.canvas 2D context
	instanceProto.draw = function (ctx) { };

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) { };

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
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
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value) {
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
Cnds.prototype.IsChildOff = function (p) {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		var fat = this.runtime.scenes[this.properties[1]].getMeshByName(t.getFirstPicked().properties[0]);
		return mesh.isDescendantOf(fat);
	} else {
		return false;
	}

};
Cnds.prototype.IsDisposed = function () {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		return mesh.isDisposed();
	} else {
		return false;
	}

};
Cnds.prototype.IsInFrustum = function (a, b, c, d) {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		return mesh.isInFrustum(new BABYLON.Plane(a, b, c, d));
	} else {
		return false;
	}
};
Cnds.prototype.MeshOnReady = function () {
	return true;
};
Cnds.prototype.MeshIsBlocked = function () {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		return mesh.IsBlocked;
	} else {
		return false;
	}
};
Cnds.prototype.MeshIsReady = function () {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		return mesh.isReady();
	} else {
		return false;
	}
};
Cnds.prototype.IntersWithMesh = function (t) {
	if (this.runtime.scenes[this.properties[1]] && this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0])) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		var targ = this.runtime.scenes[this.properties[1]].getMeshByName(t.getFirstPicked().properties[0]);
		return mesh.intersectsMesh(targ, true);
	} else {
		return false;
	}
};
Cnds.prototype.IntersWithPoint = function (x, y, z) {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		return mesh.intersectsPoint(new BABYLON.Vector3(x, y, z));
	} else {
		return false;
	}
};
Cnds.prototype.IsPicked = function () {
	if (this.runtime.scenes[this.properties[1]]) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
		var pickResult;
		var res;

		pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);

		if (pickResult.hit && pickResult.pickedMesh == mesh) {
			res = true;
		}
		return res;
	} else {
		return false;
	}

};

// For the collision memory in 'On collision'.
var arrCache = [];

function allocArr() {
	if (arrCache.length)
		return arrCache.pop();
	else
		return [0, 0, 0];
};

function freeArr(a) {
	a[0] = 0;
	a[1] = 0;
	a[2] = 0;
	arrCache.push(a);
};

function makeCollKey(a, b) {
	// comma separated string with lowest value first
	if (a < b)
		return "" + a + "," + b;
	else
		return "" + b + "," + a;
};

function collmemory_add(collmemory, a, b, tickcount) {
	var a_uid = a.uid;
	var b_uid = b.uid;

	var key = makeCollKey(a_uid, b_uid);

	if (collmemory.hasOwnProperty(key)) {
		// added already; just update tickcount
		collmemory[key][2] = tickcount;
		return;
	}

	var arr = allocArr();
	arr[0] = a_uid;
	arr[1] = b_uid;
	arr[2] = tickcount;
	collmemory[key] = arr;
};

function collmemory_remove(collmemory, a, b) {
	var key = makeCollKey(a.uid, b.uid);

	if (collmemory.hasOwnProperty(key)) {
		freeArr(collmemory[key]);
		delete collmemory[key];
	}
};

function collmemory_removeInstance(collmemory, inst) {
	var uid = inst.uid;
	var p,
	entry;
	for (p in collmemory) {
		if (collmemory.hasOwnProperty(p)) {
			entry = collmemory[p];

			// Referenced in either UID: must be removed
			if (entry[0] === uid || entry[1] === uid) {
				freeArr(collmemory[p]);
				delete collmemory[p];
			}
		}
	}
};

var last_coll_tickcount = -2;

function collmemory_has(collmemory, a, b) {
	var key = makeCollKey(a.uid, b.uid);

	if (collmemory.hasOwnProperty(key)) {
		last_coll_tickcount = collmemory[key][2];
		return true;
	} else {
		last_coll_tickcount = -2;
		return false;
	}
};

var candidates1 = [];

Cnds.prototype.OnCollision = function (rtype) {
	if (!rtype)
		return false;

	var runtime = this.runtime;

	// Static condition: perform picking manually.
	// Get the current condition.  This is like the 'is overlapping' condition
	// but with a built in 'trigger once' for the l instances.
	var cnd = runtime.getCurrentCondition();
	var ltype = cnd.type;
	var collmemory = null;

	// Create the collision memory, which remembers pairs of collisions that
	// are already overlapping
	if (cnd.extra["collmemory"]) {
		collmemory = cnd.extra["collmemory"];
	} else {
		collmemory = {};
		cnd.extra["collmemory"] = collmemory;
	}

	// Once per condition, add a destroy callback to remove destroyed instances from collision memory
	// which helps avoid a memory leak. Note the spriteCreatedDestroyCallback property is not saved
	// to savegames, so loading a savegame will still cause a callback to be created, as intended.
	if (!cnd.extra["spriteCreatedDestroyCallback"]) {
		cnd.extra["spriteCreatedDestroyCallback"] = true;

		runtime.addDestroyCallback(function (inst) {
			collmemory_removeInstance(cnd.extra["collmemory"], inst);
		});
	}

	// Get the currently active SOLs for both objects involved in the overlap test
	var lsol = ltype.getCurrentSol();
	var rsol = rtype.getCurrentSol();
	var linstances = lsol.getObjects();
	var rinstances;

	// Iterate each combination of instances
	var l,
	linst,
	r,
	rinst;
	var curlsol,
	currsol;

	var tickcount = this.runtime.tickcount;
	var lasttickcount = tickcount - 1;
	var exists,
	run;

	var current_event = runtime.getCurrentEventStack().current_event;
	var orblock = current_event.orblock;

	// Note: don't cache lengths of linstances or rinstances. They can change if objects get destroyed in the event
	// retriggering.
	for (l = 0; l < linstances.length; l++) {
		linst = linstances[l];

		if (rsol.select_all) {
			linst.update_bbox();
			this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
			rinstances = candidates1;
		} else
			rinstances = rsol.getObjects();

		for (r = 0; r < rinstances.length; r++) {
			rinst = rinstances[r];

			if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst)) {
				exists = collmemory_has(collmemory, linst, rinst);
				run = (!exists || (last_coll_tickcount < lasttickcount));

				// objects are still touching so update the tickcount
				collmemory_add(collmemory, linst, rinst, tickcount);

				if (run) {
					runtime.pushCopySol(current_event.solModifiers);
					curlsol = ltype.getCurrentSol();
					currsol = rtype.getCurrentSol();
					curlsol.select_all = false;
					currsol.select_all = false;

					// If ltype === rtype, it's the same object (e.g. Sprite collides with Sprite)
					// In which case, pick both instances
					if (ltype === rtype) {
						curlsol.instances.length = 2; // just use lsol, is same reference as rsol
						curlsol.instances[0] = linst;
						curlsol.instances[1] = rinst;
						ltype.applySolToContainer();
					} else {
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
			} else {
				// Pair not overlapping: ensure any record removed (mainly to save memory)
				collmemory_remove(collmemory, linst, rinst);
			}
		}

		cr.clearArray(candidates1);
	}

	// We've aleady run the event by now.
	return false;
};

var rpicktype = null;
var rtopick = new cr.ObjectSet();
var needscollisionfinish = false;

var candidates2 = [];
var temp_bbox = new cr.rect(0, 0, 0, 0);

function DoOverlapCondition(rtype, offx, offy) {
	if (!rtype)
		return false;

	var do_offset = (offx !== 0 || offy !== 0);
	var oldx,
	oldy,
	ret = false,
	r,
	lenr,
	rinst;
	var cnd = this.runtime.getCurrentCondition();
	var ltype = cnd.type;
	var inverted = cnd.inverted;
	var rsol = rtype.getCurrentSol();
	var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
	var rinstances;

	if (rsol.select_all) {
		this.update_bbox();

		// Make sure queried box is offset the same as the collision offset so we look in
		// the right cells
		temp_bbox.copy(this.bbox);
		temp_bbox.offset(offx, offy);
		this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
		rinstances = candidates2;
	} else if (orblock) {
		// Normally the instances to process are in the else_instances array. However if a parent normal block
		// already picked from rtype, it will have select_all off, no else_instances, and just some content
		// in 'instances'. Look for this case in the first condition only.
		if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
			rinstances = rsol.instances;
		else
			rinstances = rsol.else_instances;
	} else {
		rinstances = rsol.instances;
	}

	rpicktype = rtype;
	needscollisionfinish = (ltype !== rtype && !inverted);

	if (do_offset) {
		oldx = this.x;
		oldy = this.y;
		this.x += offx;
		this.y += offy;
		this.set_bbox_changed();
	}

	for (r = 0, lenr = rinstances.length; r < lenr; r++) {
		rinst = rinstances[r];

		// objects overlap: true for this instance, ensure both are picked
		// (if ltype and rtype are same, e.g. "Sprite overlaps Sprite", don't pick the other instance,
		// it will be picked when it gets iterated to itself)
		if (this.runtime.testOverlap(this, rinst)) {
			ret = true;

			// Inverted condition: just bail out now, don't pick right hand instance -
			// also note we still return true since the condition invert flag makes that false
			if (inverted)
				break;

			if (ltype !== rtype)
				rtopick.add(rinst);
		}
	}

	if (do_offset) {
		this.x = oldx;
		this.y = oldy;
		this.set_bbox_changed();
	}

	cr.clearArray(candidates2);
	return ret;
};

typeProto.finish = function (do_pick) {
	if (!needscollisionfinish)
		return;

	if (do_pick) {
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var sol = rpicktype.getCurrentSol();
		var topick = rtopick.valuesRef();
		var i,
		len,
		inst;

		if (sol.select_all) {
			// All selected: filter down to just those in topick
			sol.select_all = false;
			cr.clearArray(sol.instances);

			for (i = 0, len = topick.length; i < len; ++i) {
				sol.instances[i] = topick[i];
			}

			// In OR blocks, else_instances must also be filled with objects not in topick
			if (orblock) {
				cr.clearArray(sol.else_instances);

				for (i = 0, len = rpicktype.instances.length; i < len; ++i) {
					inst = rpicktype.instances[i];

					if (!rtopick.contains(inst))
						sol.else_instances.push(inst);
				}
			}
		} else {
			if (orblock) {
				var initsize = sol.instances.length;

				for (i = 0, len = topick.length; i < len; ++i) {
					sol.instances[initsize + i] = topick[i];
					cr.arrayFindRemove(sol.else_instances, topick[i]);
				}
			} else {
				cr.shallowAssignArray(sol.instances, topick);
			}
		}

		rpicktype.applySolToContainer();
	}

	rtopick.clear();
	needscollisionfinish = false;
};

Cnds.prototype.IsOverlapping = function (rtype) {
	return DoOverlapCondition.call(this, rtype, 0, 0);
};

Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy) {
	return DoOverlapCondition.call(this, rtype, offx, offy);
};

pluginProto.cnds = new Cnds();

function Acts() {};
Acts.prototype.MeshSetFogEnabled = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.applyFog = true;
	} else {
		mesh.applyFog = false;
	}
};
Acts.prototype.MeshSetFacingForward = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.definedFacingForward = true;
	} else {
		mesh.definedFacingForward = false;
	}
};
Acts.prototype.MeshCheckColl = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.checkCollisions = true;
	} else {
		mesh.checkCollisions = false;
	}
}
Acts.prototype.MeshUseBones = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.useBones = true;
	} else {
		mesh.useBones = false;
	}
};
Acts.prototype.MeshInfinDist = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.infiniteDistance = true;
	} else {
		mesh.infiniteDistance = false;
	}
};
Acts.prototype.MeshReceiveShadow = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.receiveShadows = true;
	} else {
		mesh.receiveShadows = false;
	}
};
Acts.prototype.MeshAddLOD = function (lod, dist) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var lodmesh = this.runtime.scenes[this.properties[1]].getMeshByName(lod.getFirstPicked().properties[0]);
	mesh.addLODLevel(dist, lodmesh);
};
Acts.prototype.MeshDisplMap = function (map, min, max) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var lodmesh = this.runtime.scenes[this.properties[1]].getMeshByName(lod);
	mesh.applyDisplacementMap(map, min, max);
};

Acts.prototype.MeshAttachToBone = function (skin, bonename) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var skel = this.runtime.scenes[this.properties[1]].getMeshByName(skin.getFirstPicked().properties[0]);
	var scal = mesh.scaling;
	for (var i = 0; i < skel.skeleton.bones.length; i++) {

		if (skel.skeleton.bones[i].name.trim() === bonename.trim()) {

			mesh.attachToBone(skel.skeleton.bones[i], skel);
			mesh.scaling = new BABYLON.Vector3(scal.x / 10, scal.y / 10, scal.z / 10);
			mesh.position = new BABYLON.Vector3(0, 0, 0);
			break;
		}
	}

};
Acts.prototype.MeshSetFlatShaded = function () {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.convertToFlatShadedMesh();
};
Acts.prototype.MeshDetachFromBone = function () {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.detachFromBone();
};
Acts.prototype.MeshEdgeColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.outlineColor.r = r;
	mesh.outlineColor.g = g;
	mesh.outlineColor.b = b;
};
Acts.prototype.MeshEdgeWidth = function (w) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.outlineWidth = w;
};
Acts.prototype.MeshEllipsoid = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.ellipsoid = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshSetEdgeRend = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.renderOutline = true;
	} else {
		mesh.renderOutline = false;
	}

};
Acts.prototype.MeshFlipFaces = function () {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.flipFaces(true);
};
Acts.prototype.MeshTranslLocaly = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.locallyTranslate(new BABYLON.Vector3(x, y, z));
};
Acts.prototype.MeshLookAt = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.lookAt(new BABYLON.Vector3(x, y, z), 0, 0, 0);
};
Acts.prototype.MeshMoveColl = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var velocity = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(x, y, z), mesh.computeWorldMatrix());
	//mesh.computeWorldMatrix(true);
	mesh.moveWithCollisions(velocity);
};
Acts.prototype.MeshCreateBox = function (z, y, x, s) {
	var mesh = BABYLON.Mesh.CreateBox(this.properties[0], s, this.runtime.scenes[this.properties[1]], true);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshCreateLine = function (z, y, x, x2, y2, z2) {
	var mesh = BABYLON.Mesh.CreateLines(this.properties[0], [new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(x2, y2, z2)], this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MeshCreateSphere = function (z, y, x, s, sg) {
	var mesh = BABYLON.Mesh.CreateSphere(this.properties[0], sg, s, this.runtime.scenes[this.properties[1]], true);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshCreatePlane = function (z, y, x, s) {
	var mesh = BABYLON.Mesh.CreatePlane(this.properties[0], s, this.runtime.scenes[this.properties[1]], true);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshCreateCylinder = function (z, y, x, h, t, b, ts, sub) {
	var mesh = BABYLON.Mesh.CreateCylinder(this.properties[0], h, t, b, ts, sub, this.runtime.scenes[this.properties[1]], true);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshCreateTorus = function (z, y, x, d, th, tes) {
	var mesh = BABYLON.Mesh.CreateTorus(this.properties[0], d, th, tes, this.runtime.scenes[this.properties[1]], true);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshClone = function (cname, z, y, x) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var mesh = obj.clone(cname);
	mesh.position = new BABYLON.Vector3(x, y, z);

};

Acts.prototype.MeshCreateHeightMap = function (map, w, h, s, min, hei) {
	var heightMesh = BABYLON.Mesh.CreateGroundFromHeightMap(map, w, h, s, min, hei, this.runtime.scenes[this.properties[1]], true);
};
Acts.prototype.MeshPutAtCursor = function (kY) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
	if (pickResult.hit) {
		mesh.position.x = pickResult.pickedPoint.x;
		if (kY == 0) {
			mesh.position.y = pickResult.pickedPoint.y;
		}
		mesh.position.z = pickResult.pickedPoint.z;
	}
};

Acts.prototype.MeshMorphVertices = function (sI, eI, z, y, x) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var vPositions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var vIndices = mesh.getIndices();
	//var vModel = vPositions.slice();
	var normals = [];

	for (var idx = sI; idx < eI; idx += 1) {
		vPositions[idx * 3] += x; //x
		vPositions[idx * 3 + 1] += y; //y
		vPositions[idx * 3 + 2] += z; //z
		mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vPositions, false, false);
		BABYLON.VertexData.ComputeNormals(vPositions, vIndices, normals);
		mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, false, false);
	}

};
Acts.prototype.MeshSetLineColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.color = new BABYLON.Color3.FromInts(r, g, b);

};
Acts.prototype.MeshVisiblity = function (v) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.visibility = v;
};
Acts.prototype.MeshSetParent = function (ptype, p) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (ptype == 0) {
		var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p.getFirstPicked().properties[0]);
	} else if (ptype == 1) {
		var parnt = this.runtime.scenes[this.properties[1]].getLightByName(p.getFirstPicked().properties[0]);
	} else {
		var parnt = this.runtime.scenes[this.properties[1]].getCameraByName(p.getFirstPicked().properties[0]);
	}
	var fix = mesh.getAbsolutePosition();
	mesh.parent = parnt;
	mesh.setAbsolutePosition(fix);
	mesh.rotation = new BABYLON.Vector3(0, 0, 0);
	mesh.scaling = new BABYLON.Vector3(1, 1, 1);

};
Acts.prototype.MeshSetPosition = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.position = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.MeshSetRotation = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.rotation.x = cr.to_radians(x);
	mesh.rotation.y = cr.to_radians(y);
	mesh.rotation.z = cr.to_radians(z);
};
Acts.prototype.MeshSetScaling = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.scaling = new BABYLON.Vector3(x, y, z);
};
Acts.prototype.TranslateMeshBy = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.position = new BABYLON.Vector3(mesh.position.x + x, mesh.position.y + y, mesh.position.z + z);
};
Acts.prototype.RotateMeshBy = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.rotation.x += cr.to_radians(x);
	mesh.rotation.y += cr.to_radians(y);
	mesh.rotation.z += cr.to_radians(z);
};
Acts.prototype.ScaleMeshBy = function (x, y, z) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.scaling = new BABYLON.Vector3(mesh.scaling.x + x, mesh.scaling.y + y, mesh.scaling.z + z);
};

Acts.prototype.MeshBeginAnim = function (animName, start, end, loop, speed) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	this.runtime.scenes[this.properties[1]].beginDirectAnimation(mesh, [mesh.getAnimationByName(animName)], start, end, loop, speed);

};

Acts.prototype.MeshStopAnim = function (name) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	this.runtime.scenes[this.properties[1]].stopAnimation(mesh);
};

Acts.prototype.MeshCreateAnim = function (animName, param, start, mid, end, fps) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);

	start = start.split(",");
	mid = mid.split(",");
	end = end.split(",");

	var anim = new BABYLON.Animation(animName, param, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE, true);
	anim.blendingSpeed = 0.5;
	// An array with all animation keys
	var keys = [];

	//At the animation key 0, the value of scaling is "1"
	start[0] = parseInt(start[0]);
	start[1] = parseFloat(start[1]);
	mid[0] = parseInt(mid[0]);
	mid[1] = parseFloat(mid[1]);
	end[0] = parseInt(end[0]);
	end[1] = parseFloat(end[1]);

	if (param == "rotation.x" || param == "rotation.y" || param == "rotation.z") {
		start[1] *= (Math.PI / 180);
		mid[1] *= (Math.PI / 180);
		end[1] *= (Math.PI / 180);
	}

	keys.push({
		frame: start[0],
		value: start[1]
	});

	//At the animation key 20, the value of scaling is "0.2"
	keys.push({
		frame: mid[0],
		value: mid[1]
	});

	//At the animation key 100, the value of scaling is "1"
	keys.push({
		frame: end[0],
		value: end[1]
	});

	anim.setKeys(keys);
	mesh.animations.push(anim);

};

Acts.prototype.MeshPauseAnim = function () {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).pause();
};

Acts.prototype.MeshRestartAnim = function () {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).restart();
};
Acts.prototype.MeshSetEnabled = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (state == 0) {
		mesh.setEnabled(true);
	} else {
		mesh.setEnabled(false);
	}
};

Acts.prototype.MeshSetPickable = function (pickable) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (pickable == 0) {
		mesh.isPickable = true;
	} else {
		mesh.isPickable = false;
	}
};
Acts.prototype.MeshDestroy = function (type) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.dispose();
};
Acts.prototype.MeshBlockLens = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	mesh.isBlocker = state;
};

Acts.prototype.MeshSetTextuFrame = function (frm) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var filenameDiffuse = getAnimTextureFileByName(this, "diffuse", frm);
	var filenameBump = getAnimTextureFileByName(this, "bump", frm);
	var filenameSpecular = getAnimTextureFileByName(this, "specular", frm);
	var filenameEmissive = getAnimTextureFileByName(this, "emissive", frm);
	var filenameAmbient = getAnimTextureFileByName(this, "ambient", frm);
	if (filenameDiffuse != "null") {
		mesh.material.diffuseTexture = new BABYLON.Texture(filenameDiffuse, scene);
	}
	if (filenameBump != "null") {
		mesh.material.bumpTexture = new BABYLON.Texture(filenameBump, scene);
	}
	if (filenameSpecular != "null") {
		mesh.material.specularTexture = new BABYLON.Texture(filenameSpecular, scene);
	}
	if (filenameEmissive != "null") {
		mesh.material.emissiveTexture = new BABYLON.Texture(filenameEmissive, scene);
	}
	if (filenameAmbient != "null") {
		mesh.material.ambientTexture = new BABYLON.Texture(filenameAmbient, scene);
	}
};
Acts.prototype.MeshSetTextuUVScale = function (u, v) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (mesh.material.diffuseTexture) {
		mesh.material.diffuseTexture.uScale = u; //Repeat 5 times on the Vertical Axes
		mesh.material.diffuseTexture.vScale = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.ambientTexture) {
		mesh.material.ambientTexture.uScale = u; //Repeat 5 times on the Vertical Axes
		mesh.material.ambientTexture.vScale = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.reflectionTexture) {
		mesh.material.reflectionTexture.uScale = u; //Repeat 5 times on the Vertical Axes
		mesh.material.reflectionTexture.vScale = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.bumpTexture) {
		mesh.material.bumpTexture.uScale = u; //Repeat 5 times on the Vertical Axes
		mesh.material.bumpTexture.vScale = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.specularTexture) {
		mesh.material.specularTexture.uScale = u; //Repeat 5 times on the Vertical Axes
		mesh.material.specularTexture.vScale = v; //Repeat 5 times on the Horizontal Axes
	}
};
Acts.prototype.MeshSetTextuUVOffset = function (u, v) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (mesh.material.diffuseTexture) {
		mesh.material.diffuseTexture.uOffset = u; //Repeat 5 times on the Vertical Axes
		mesh.material.diffuseTexture.vOffset = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.ambientTexture) {
		mesh.material.ambientTexture.uOffset = u; //Repeat 5 times on the Vertical Axes
		mesh.material.ambientTexture.vOffset = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.reflectionTexture) {
		mesh.material.reflectionTexture.uOffset = u; //Repeat 5 times on the Vertical Axes
		mesh.material.reflectionTexture.vOffset = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.bumpTexture) {
		mesh.material.bumpTexture.uOffset = u; //Repeat 5 times on the Vertical Axes
		mesh.material.bumpTexture.vOffset = v; //Repeat 5 times on the Horizontal Axes
	}
	if (mesh.material.specularTexture) {
		mesh.material.specularTexture.uOffset = u; //Repeat 5 times on the Vertical Axes
		mesh.material.specularTexture.vOffset = v; //Repeat 5 times on the Horizontal Axes
	}
};

Acts.prototype.MatSetAlpha = function (alp) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.alpha = alp;
};
Acts.prototype.MatSetAlphaMode = function (alpmode) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	material.alphaMode = alpmode;
};
Acts.prototype.MatSetBackFaceCulling = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.backFaceCulling = true;
	} else {
		material.backFaceCulling = false;
	}

};
Acts.prototype.MatSetFillMode = function (fillm) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.fillMode = fillm;
};
Acts.prototype.MatSetSideOrient = function (sor) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.sideOrientation = sor;
};
Acts.prototype.MatSetFogState = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.fogEnabled = true;
	} else {
		material.fogEnabled = false;
	}
};
Acts.prototype.MatSetLightState = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.disableLighting = true;
	} else {
		material.disableLighting = false;
	}
};
Acts.prototype.MatSetParallState = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.useParallax = true;
	} else {
		material.useParallax = false;
	}
};
Acts.prototype.MatSetOccluState = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.useParallaxOcclusion = true;
	} else {
		material.useParallaxOcclusion = false;
	}
};
Acts.prototype.MatSetAlphaFromDif = function (state) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	if (state == 0) {
		material.hasAlpha = true;
		material.useAlphaFromDiffuseTexture = true;
	} else {
		material.hasAlpha = false;
		material.useAlphaFromDiffuseTexture = false;
	}
};
Acts.prototype.MatSetAmbColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.ambientColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
};
Acts.prototype.MatSetDifColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.diffuseColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
};
Acts.prototype.MatSetEmiColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.emissiveColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
};
Acts.prototype.MatSetSpecuColor = function (r, g, b) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.specularColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
};
Acts.prototype.MatSetDifTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.diffuseTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MatSetAmbTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.ambientTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MatSetBumpTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.bumpTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MatSetEmiTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.emissiveTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MatSetLightmapTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.lightmapTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
};
Acts.prototype.MatSetRefleTexture = function (type, texture, pl, rL, lev) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	var plane = pl.split(",");
	if (type == 0) {
		material.reflectionTexture = new BABYLON.CubeTexture(texture, this.runtime.scenes[this.properties[1]]);
		material.reflectionTexture.level = lev;
	} else {
		material.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, this.runtime.scenes[this.properties[1]], true); //Create a mirror texture
		material.reflectionTexture.mirrorPlane = new BABYLON.Plane(plane[0], plane[1], plane[2], plane[3]);
		material.reflectionTexture.level = lev;
		if (rL.is_family) {
			for (var i = 0; i < rL.instances.length; i++) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(rL.instances[i].properties[0]);
				material.reflectionTexture.renderList.push(mesh);
			}
		} else {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(rL.getFirstPicked().properties[0]);
			material.reflectionTexture.renderList.push(mesh);
		}

	}
};
Acts.prototype.MatSetRefraTexture = function (texture) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.refractionTexture = new BABYLON.CubeTexture(texture, this.runtime.scenes[this.properties[1]]);

};
Acts.prototype.MatSetSpecuPower = function (spec) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.specularPower = spec;
};
Acts.prototype.MatSetParallScale = function (para) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.parallaxScaleBias = para;
};
Acts.prototype.MatSetRoughness = function (rough) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var material = mesh.material;
	material.roughness = rough;
};

Acts.prototype.MatSetMesh = function (m) {
	var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var mat = this.runtime.scenes[this.properties[1]].getMaterialByName(m);
	mesh.material = mat;
};

pluginProto.acts = new Acts();

function Exps() {};

Exps.prototype.CenterX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getPhysicsImpostor().getObjectCenter().x);
};
Exps.prototype.CenterY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getPhysicsImpostor().getObjectCenter().y);
};
Exps.prototype.CenterZ = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getPhysicsImpostor().getObjectCenter().z);
};
Exps.prototype.TotalVertices = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_int(obj.getTotalVertices());
};
Exps.prototype.DistanceToCam = function (ret, name, camname) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var cam = this.runtime.scenes[this.properties[1]].getCameraByName(camname);
	ret.set_float(obj.getDistanceToCamera(cam));
};
Exps.prototype.MeshPosX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.position.x);
};
Exps.prototype.MeshPosY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.position.y);
};
Exps.prototype.MeshPosZ = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.position.z);
};
Exps.prototype.MeshAbsoPosX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getAbsolutePosition().x);
};
Exps.prototype.MeshAbsoPosY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getAbsolutePosition().y);
};
Exps.prototype.MeshAbsoPosZ = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.getAbsolutePosition().z);
};
Exps.prototype.MeshScaleX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.scaling.x);
};
Exps.prototype.MeshScaleY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.scaling.y);
};
Exps.prototype.MeshScaleZ = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	ret.set_float(obj.scaling.z);
};
Exps.prototype.MeshRotX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (obj.physicsImpostor) // Mesh has physics
	{
		ret.set_float(cr.to_degrees(obj.rotationQuaternion.x));
	} else {
		ret.set_float(cr.to_degrees(obj.rotation.x));
	}
};
Exps.prototype.MeshRotY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (obj.physicsImpostor) // Mesh has physics
	{
		ret.set_float(cr.to_degrees(obj.rotationQuaternion.y));
	} else {
		ret.set_float(cr.to_degrees(obj.rotation.y));
	}
};
Exps.prototype.MeshRotZ = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	if (obj.physicsImpostor) // Mesh has physics
	{
		ret.set_float(cr.to_degrees(obj.rotationQuaternion.z));
	} else {
		ret.set_float(cr.to_degrees(obj.rotation.z));
	}
};
Exps.prototype.MeshPickedX = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var pickResult;
	var res;
	pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
	if (pickResult.hit && pickResult.pickedMesh == obj) { ;
		ret.set_float(pickResult.pickedPoint.x)
	} else {
		ret.set_float(-1)
	}
};
Exps.prototype.MeshPickedY = function (ret) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var pickResult;
	var res;
	pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
	if (pickResult.hit && pickResult.pickedMesh == obj) { ;
		ret.set_float(pickResult.pickedPoint.y)
	} else {
		ret.set_float(-1)
	}
};
Exps.prototype.MeshCurrentFrame = function (ret, name2) {
	var obj = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]);
	var anim = obj.getAnimationByName(name2);
	ret.set_int(anim.currentFrame)
};
Exps.prototype.Name = function (ret) {
	ret.set_string(this.properties[0])
};
Exps.prototype.SceneUID = function (ret) {
	ret.set_int(this.properties[1])
};
pluginProto.exps = new Exps();

}
());
