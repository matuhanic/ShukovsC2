// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonOBJ = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonOBJ.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;

	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
		this.mytype = "_newmesh";
		this.done = false;
		this.created = false;
		this.loaded = false;
		this.objmeshes = [];
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
		if (this.runtime.scenes[this.properties[1]]) { // Is scene defined
			if (!this.created) // We didn't create the mesh yet
			{
				var rot = this.properties[5].split(","); //XY rotation
				var xpos = this.x - (this.runtime.original_width / 2);
				var ypos =  - (this.y - (this.runtime.original_height / 2));
				var zpos = this.properties[7];
				var scene = this.runtime.scenes[this.properties[1]];

				var i;
				var inst = this;
				var loader = new BABYLON.AssetsManager(scene);
				loader.useDefaultLoadingScreen = false;
				BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;

				var container = BABYLON.Mesh.CreateBox("mesh" + this.uid, 1, scene);
				container.position = new BABYLON.Vector3(xpos, ypos, zpos);

				container.rotation.z = -inst.angle;
				container.scaling = new BABYLON.Vector3(inst.width, inst.height, inst.properties[6]);

				var posOffs = this.properties[8].split(",");
				var scaOffs = this.properties[9].split(",");
				container.visibility = 0.5;
				container.isVisible = this.properties[10];
				container.isPickable = true;
				container.isBlocker = true;

				if (this.properties[4] == 0) { // OBJ

					var OBJ = loader.addMeshTask("ObjLoader" + this.uid, "", "", this.properties[3] + ".obj");
					OBJ.onSuccess = function (t) {

						t.loadedMeshes.forEach(function (m, i) {

							inst.objmeshes[i] = m;
							inst.objmeshes[i].parent = container;
							inst.objmeshes[i].scaling = new BABYLON.Vector3(container.getBoundingInfo().boundingBox.extendSize.x, container.getBoundingInfo().boundingBox.extendSize.y, container.getBoundingInfo().boundingBox.extendSize.z);
							inst.objmeshes[i].position = new BABYLON.Vector3(posOffs[0], posOffs[1], posOffs[2]);
							inst.objmeshes[i].scaling.x *= scaOffs[0];
							inst.objmeshes[i].scaling.y *= scaOffs[1];
							inst.objmeshes[i].scaling.z *= scaOffs[2];
							inst.objmeshes[i].rotation.x = rot[0] * (Math.PI / 180);
							inst.objmeshes[i].rotation.y = rot[1] * (Math.PI / 180);
							inst.objmeshes[i].rotation.z = rot[2] * (Math.PI / 180);
							inst.objmeshes[i].isPickable = true;

						});
					};

					loader.onFinish = function () {
						inst.loaded = true;

					};
					if (container.isReady) {
						this.runtime.trigger(cr.plugins_.babylonOBJ.prototype.cnds.MeshOnReady, this);
					}
				} else {
					BABYLON.SceneLoader.ImportMesh("", "", this.properties[3] + ".js", scene, function (m, particles, skeletons) {
						for (var i = 0; i < m.length; i++) {
							inst.objmeshes[i] = m[i];
							inst.objmeshes[i].parent = container;
							inst.objmeshes[i].position = new BABYLON.Vector3(posOffs[0], posOffs[1], posOffs[2]);
							inst.objmeshes[i].scaling = new BABYLON.Vector3(scaOffs[0], scaOffs[1], scaOffs[2]);
							inst.objmeshes[i].scaling = new BABYLON.Vector3(container.getBoundingInfo().boundingBox.extendSize.x, container.getBoundingInfo().boundingBox.extendSize.y, container.getBoundingInfo().boundingBox.extendSize.z);
							inst.objmeshes[i].scaling.x *= scaOffs[0];
							inst.objmeshes[i].scaling.y *= scaOffs[1];
							inst.objmeshes[i].scaling.z *= scaOffs[2];
							inst.objmeshes[i].rotation.x = rot[0] * (Math.PI / 180);
							inst.objmeshes[i].rotation.y = rot[1] * (Math.PI / 180);
							inst.objmeshes[i].rotation.z = rot[2] * (Math.PI / 180);
							inst.objmeshes[i].isPickable = true;
						}
						inst.loaded = true;
						if (skeletons[0]) {
							container.skeleton = skeletons[0];
						}

					});
					if (container.isReady) {
						this.runtime.trigger(cr.plugins_.babylonOBJ.prototype.cnds.MeshOnReady, this);
					}
				}

				loader.load();
				this.created = true;
			}

			if (this.loaded) {
				if (this.properties[2] == 1) // Construct 2 is taking the wheel
				{

					if (!this.done) {

						var xscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.x;
						var yscale = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.y;
						this.width = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.x * xscale) * 2;
						this.height = (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.y * yscale) * 2;
						this.x = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).position.x;
						this.y = -this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).position.y;
						this.angle = -this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).rotation.z;
						this.set_bbox_changed();

						this.done = true;
						this.hotspotX = 0.5;
						this.hotspotY = 0.5;
						this.update_bbox();
					} else {
						this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).rotation.z = -this.angle; // Euler
						this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).position.x = this.x;
						this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).position.y = -this.y;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh"+this.uid).isVisible = this.visible;
						//this.runtime.scenes[this.properties[1]].getMeshByName("mesh"+this.uid).visibility = this.opacity;


						this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.x = this.width / (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.x * 2);
						this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).scaling.y = this.height / (this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid).getBoundingInfo().boundingBox.extendSize.y * 2);
					}

				} else // We don't need to check again
				{
					this.runtime.untick2Me(this);
				}
			}
		}

	};

	instanceProto.tick = function () {};

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

	function getAnimName(inst, animID) {
		var animName = inst.type.animations[animID][0]; //DiffuseMap, BumpMap, SpecularMap
		return animName;
	}
	function getAnimTextureFileByName(inst, name, frame) {
		var animID;
		var file = "null";
		for (var i = 0; i < inst.type.animations.length; i++) {
			var frameName = getAnimName(inst, i);

			if (frameName == name) {
				animID = i;
				var anim = inst.type.animations[animID][7];
				var file = anim[frame][0]; // "model-myanim-000.png" "model-myanim-001.png"
				break;
			} else {
				continue;
			}
		}

		return file;

	}

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () {};

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
	instanceProto.draw = function (ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {};

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
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			var fat = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + t.getFirstPicked().uid);
			return mesh.isDescendantOf(fat);
		} else {
			return false;
		}

	};
	Cnds.prototype.IsDisposed = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.isDisposed();
		} else {
			return false;
		}

	};
	Cnds.prototype.IsInFrustum = function (a, b, c, d) {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.isInFrustum(new BABYLON.Plane(a, b, c, d));
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshOnCollide = function (m2) {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			var mesh2 = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + m2.getFirstPicked().uid);
			if (this.collided == mesh2.name) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshOnReady = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.isReady();
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshIsBlocked = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.IsBlocked;
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshIsReady = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.isReady();
		} else {
			return false;
		}
	};
	Cnds.prototype.IntersWithMesh = function (t) {
		if (this.runtime.scenes[this.properties[1]] && this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid)) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			var targ = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + t.getFirstPicked().uid);
			return mesh.intersectsMesh(targ, true);
		} else {
			return false;
		}
	};
	Cnds.prototype.IntersWithPoint = function (x, y, z) {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
			return mesh.intersectsPoint(new BABYLON.Vector3(x, y, z));
		} else {
			return false;
		}
	};
	Cnds.prototype.IsPicked = function () {
		if (this.runtime.scenes[this.properties[1]]) {
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
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

	pluginProto.cnds = new Cnds();

	function Acts() {};
	Acts.prototype.MeshSetFogEnabled = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.applyFog = true;
		} else {
			mesh.applyFog = false;
		}
	};
	Acts.prototype.MeshSetFacingForward = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.definedFacingForward = true;
		} else {
			mesh.definedFacingForward = false;
		}
	};
	Acts.prototype.MeshCheckColl = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.checkCollisions = true;
		} else {
			mesh.checkCollisions = false;
		}
	}
	Acts.prototype.MeshUseBones = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.useBones = true;
		} else {
			mesh.useBones = false;
		}
	};
	Acts.prototype.MeshInfinDist = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.infiniteDistance = true;
		} else {
			mesh.infiniteDistance = false;
		}
	};
	Acts.prototype.MeshReceiveShadow = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.receiveShadows = true;
		} else {
			mesh.receiveShadows = false;
		}
	};
	Acts.prototype.MeshAddLOD = function (lod, dist) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var lodmesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + lod.getFirstPicked().uid);
		mesh.addLODLevel(dist, lodmesh);
	};
	Acts.prototype.MeshDisplMap = function (map, min, max) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var lodmesh = this.runtime.scenes[this.properties[1]].getMeshByName(lod);
		mesh.applyDisplacementMap(map, min, max);
	};

	Acts.prototype.MeshAttachToBone = function (skin, bonename) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var skel = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + skin.getFirstPicked().uid);
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
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.convertToFlatShadedMesh();
	};
	Acts.prototype.MeshDetachFromBone = function () {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.detachFromBone();
	};
	Acts.prototype.MeshEdgeColor = function (r, g, b) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.outlineColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}
	};
	Acts.prototype.MeshEdgeWidth = function (w) {
		for (var i = 0; i < this.objmeshes.length; i++) {

			this.objmeshes[i].outlineWidth = w;

		}
	};
	Acts.prototype.MeshEllipsoid = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.ellipsoid = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshSetEdgeRend = function (state) {
		if (state == 0) {
			for (var i = 0; i < this.objmeshes.length; i++) {

				this.objmeshes[i].renderOutline = true;

			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {

				this.objmeshes[i].renderOutline = false;

			}
		}

	};
	Acts.prototype.MeshFlipFaces = function () {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.flipFaces(true);
	};
	Acts.prototype.MeshTranslLocaly = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.locallyTranslate(new BABYLON.Vector3(x, y, z));
	};
	Acts.prototype.MeshLookAt = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.lookAt(new BABYLON.Vector3(x, y, z), 0, 0, 0);
	};
	Acts.prototype.MeshMoveColl = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var velocity = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(x, y, z), mesh.computeWorldMatrix());
		//mesh.computeWorldMatrix(true);
		mesh.moveWithCollisions(velocity);
	};
	Acts.prototype.MeshCreateBox = function (z, y, x, s) {
		var mesh = BABYLON.Mesh.CreateBox("mesh" + this.uid, s, this.runtime.scenes[this.properties[1]], true);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshCreateLine = function (z, y, x, x2, y2, z2) {
		var mesh = BABYLON.Mesh.CreateLines("mesh" + this.uid, [new BABYLON.Vector3(x, y, z), new BABYLON.Vector3(x2, y2, z2)], this.runtime.scenes[this.properties[1]]);
	};
	Acts.prototype.MeshCreateSphere = function (z, y, x, s, sg) {
		var mesh = BABYLON.Mesh.CreateSphere("mesh" + this.uid, sg, s, this.runtime.scenes[this.properties[1]], true);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshCreatePlane = function (z, y, x, s) {
		var mesh = BABYLON.Mesh.CreatePlane("mesh" + this.uid, s, this.runtime.scenes[this.properties[1]], true);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshCreateCylinder = function (z, y, x, h, t, b, ts, sub) {
		var mesh = BABYLON.Mesh.CreateCylinder("mesh" + this.uid, h, t, b, ts, sub, this.runtime.scenes[this.properties[1]], true);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshCreateTorus = function (z, y, x, d, th, tes) {
		var mesh = BABYLON.Mesh.CreateTorus("mesh" + this.uid, d, th, tes, this.runtime.scenes[this.properties[1]], true);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshClone = function (cname, x, y, z) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var mesh = obj.clone(cname);
		mesh.position = new BABYLON.Vector3(x, y, z);

	};

	Acts.prototype.MeshCreateHeightMap = function (map, w, h, s, min, hei) {
		var heightMesh = BABYLON.Mesh.CreateGroundFromHeightMap(map, w, h, s, min, hei, this.runtime.scenes[this.properties[1]], true);
	};
	Acts.prototype.MeshPutAtCursor = function (kY) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
		if (pickResult.hit) {
			mesh.position.x = pickResult.pickedPoint.x;
			if (kY == 0) {
				mesh.position.y = pickResult.pickedPoint.y;
			}
			mesh.position.z = pickResult.pickedPoint.z;
		}
	};
	Acts.prototype.MeshRegisterEvent = function (type) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var ins = this;
		if (type == 0) {

			mesh.onCollide = function (col) {
				ins.collided = col.name;
				ins.runtime.trigger(cr.plugins_.babylonMeshSLE.prototype.cnds.MeshOnCollide, ins);
			}
		} else if (type == 1) {
			mesh.onReady = function () {
				ins.runtime.trigger(cr.plugins_.babylonMeshSLE.prototype.cnds.MeshOnReady, ins);
			}
		}

	};
	Acts.prototype.MeshMorphVertices = function (sI, eI, x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
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
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.color = new BABYLON.Color3.FromInts(r, g, b);

	};
	Acts.prototype.MeshVisiblity = function (v) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.visibility = v;
	};
	Acts.prototype.MeshSetParent = function (ptype, p) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (ptype == 0) {
			var parnt = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + p.getFirstPicked().uid);
		} else if (ptype == 1) {
			var parnt = this.runtime.scenes[this.properties[1]].getLightByName("light" + p.getFirstPicked().uid);
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
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.position = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.MeshSetRotation = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.rotation.x = cr.to_radians(x);
		mesh.rotation.y = cr.to_radians(y);
		mesh.rotation.z = cr.to_radians(z);
	};
	Acts.prototype.MeshSetScaling = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.scaling = new BABYLON.Vector3(x, y, z);
	};
	Acts.prototype.TranslateMeshBy = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.position = new BABYLON.Vector3(mesh.position.x + x, mesh.position.y + y, mesh.position.z + z);
	};
	Acts.prototype.RotateMeshBy = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.rotation = new BABYLON.Vector3(mesh.rotation.x + cr.to_radians(x), mesh.rotation.y + cr.to_radians(y), mesh.rotation.z + cr.to_radians(z));
	};
	Acts.prototype.ScaleMeshBy = function (x, y, z) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.scaling = new BABYLON.Vector3(mesh.scaling.x + x, mesh.scaling.y + y, mesh.scaling.z + z);
	};

	Acts.prototype.MeshBeginAnim = function (animName, start, end, loop, speed) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		this.runtime.scenes[this.properties[1]].beginDirectAnimation(mesh, [mesh.getAnimationByName(animName)], start, end, loop, speed);

	};

	Acts.prototype.MeshStopAnim = function (name) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		this.runtime.scenes[this.properties[1]].stopAnimation(mesh);
	};

	Acts.prototype.MeshCreateAnim = function (animName, param, start, mid, end, fps) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);

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
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).pause();
	};

	Acts.prototype.MeshRestartAnim = function () {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).restart();
	};
	Acts.prototype.MeshSetEnabled = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (state == 0) {
			mesh.setEnabled(true);
		} else {
			mesh.setEnabled(false);
		}
	};

	Acts.prototype.MeshSetPickable = function (pickable) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (pickable == 0) {
			mesh.isPickable = true;
		} else {
			mesh.isPickable = false;
		}
	};
	Acts.prototype.MeshDestroy = function (type) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.dispose();
	};
	Acts.prototype.MeshBlockLens = function (state) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		mesh.isBlocker = state;
	};

	Acts.prototype.MeshSetTextuFrame = function (frm) {
		var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
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
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.diffuseTexture.uScale = u;
				this.objmeshes[i].material.diffuseTexture.vScale = v;
			}
		}
	};
	Acts.prototype.MeshSetTextuUVOffset = function (u, v) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.diffuseTexture.uOffset = u;
				this.objmeshes[i].material.diffuseTexture.vOffset = v;
			}
		}
	};

	Acts.prototype.MatSetAlpha = function (alp) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.alpha = alp;
			}
		}

	};
	Acts.prototype.MatSetAlphaMode = function (alpmode) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.alphaMode = alpmode;
			}
		}
	};
	Acts.prototype.MatSetBackFaceCulling = function (state) {
		var material = mesh.material;
		if (state == 0) {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.backFaceCulling = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.backFaceCulling = false;
				}
			}
		}

	};
	Acts.prototype.MatSetFillMode = function (fillm) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.fillMode = fillm;
			}
		}
	};
	Acts.prototype.MatSetSideOrient = function (sor) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.sideOrientation = sor;
			}
		}
	};
	Acts.prototype.MatSetFogState = function (state) {
		if (state == 0) {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.fogEnabled = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.fogEnabled = false;
				}
			}
		}
	};
	Acts.prototype.MatSetLightState = function (state) {
		if (state == 0) {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.disableLighting = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.disableLighting = false;
				}
			}
		}
	};
	Acts.prototype.MatSetParallState = function (state) {
		if (state == 0) {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.useParallax = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.useParallax = false;
				}
			}
		}
	};
	Acts.prototype.MatSetOccluState = function (state) {
		if (state == 0) {
			material.useParallaxOcclusion = true;
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.useParallaxOcclusion = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.useParallaxOcclusion = false;
				}
			}
		}
	};
	Acts.prototype.MatSetAlphaFromDif = function (state) {
		if (state == 0) {

			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.hasAlpha = true;
					this.objmeshes[i].useAlphaFromDiffuseTexture = true;
				}
			}
		} else {
			for (var i = 0; i < this.objmeshes.length; i++) {
				if (this.objmeshes[i].material) {
					this.objmeshes[i].material.hasAlpha = false;
					this.objmeshes[i].useAlphaFromDiffuseTexture = false;
				}
			}
		}
	};
	Acts.prototype.MatSetAmbColor = function (r, g, b) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.ambientColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}
	};
	Acts.prototype.MatSetDifColor = function (r, g, b) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.diffuseColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}
	};
	Acts.prototype.MatSetEmiColor = function (r, g, b) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.emissiveColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}
	};
	Acts.prototype.MatSetSpecuColor = function (r, g, b) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.specularColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}
	};
	Acts.prototype.MatSetDifTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.diffuseTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}
	};
	Acts.prototype.MatSetAmbTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.ambientTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}
	};
	Acts.prototype.MatSetBumpTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.bumpTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}
	};
	Acts.prototype.MatSetEmiTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.emissiveTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}
	};
	Acts.prototype.MatSetLightmapTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.lightmapTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}
	};
	Acts.prototype.MatSetRefleTexture = function (type, texture, pl, rL, lev) {
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
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + rL.instances[i].uid);
					for (var i = 0; i < this.objmeshes.length; i++) {
						if (this.objmeshes[i].material) {
							this.objmeshes[i].material.reflectionTexture.renderList.push(mesh);
						}
					}
				}
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + rL.getFirstPicked().uid);
				for (var i = 0; i < this.objmeshes.length; i++) {
					if (this.objmeshes[i].material) {
						this.objmeshes[i].material.reflectionTexture.renderList.push(mesh);
					}
				}
			}

		}
	};
	Acts.prototype.MatSetRefraTexture = function (texture) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.refractionTexture = new BABYLON.Texture(texture, this.runtime.scenes[this.properties[1]]);
			}
		}

	};
	Acts.prototype.MatSetSpecuPower = function (spec) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.specularPower = spec;
			}
		}
	};
	Acts.prototype.MatSetParallScale = function (para) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.parallaxScaleBias = para;
			}
		}
	};
	Acts.prototype.MatSetRoughness = function (rough) {
		for (var i = 0; i < this.objmeshes.length; i++) {
			if (this.objmeshes[i].material) {
				this.objmeshes[i].material.roughness = rough;
			}
		}

	};

	Acts.prototype.MatSetMesh = function (m) {
		var mat = this.runtime.scenes[this.properties[1]].getMaterialByName(m);
		for (var i = 0; i < this.objmeshes.length; i++) {
			this.objmeshes[i].material = mat;
		}
	};

	pluginProto.acts = new Acts();

	function Exps() {};

	Exps.prototype.CenterX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().x);
	};
	Exps.prototype.CenterY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().y);
	};
	Exps.prototype.CenterZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().z);
	};
	Exps.prototype.TotalVertices = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_int(obj.getTotalVertices());
	};
	Exps.prototype.DistanceToCam = function (ret, name, camname) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(camname);
		ret.set_float(obj.getDistanceToCamera(cam));
	};
	Exps.prototype.MeshPosX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.position.x);
	};
	Exps.prototype.MeshPosY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.position.y);
	};
	Exps.prototype.MeshPosZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.position.z);
	};
	Exps.prototype.MeshAbsoPosX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getAbsolutePosition().x);
	};
	Exps.prototype.MeshAbsoPosY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getAbsolutePosition().y);
	};
	Exps.prototype.MeshAbsoPosZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.getAbsolutePosition().z);
	};
	Exps.prototype.MeshScaleX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.scaling.x);
	};
	Exps.prototype.MeshScaleY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.scaling.y);
	};
	Exps.prototype.MeshScaleZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		ret.set_float(obj.scaling.z);
	};
	Exps.prototype.MeshRotX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(cr.to_degrees(obj.rotationQuaternion.x));
		} else {
			ret.set_float(cr.to_degrees(obj.rotation.x));
		}
	};
	Exps.prototype.MeshRotY = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(cr.to_degrees(obj.rotationQuaternion.y));
		} else {
			ret.set_float(cr.to_degrees(obj.rotation.y));
		}
	};
	Exps.prototype.MeshRotZ = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		if (obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(cr.to_degrees(obj.rotationQuaternion.z));
		} else {
			ret.set_float(cr.to_degrees(obj.rotation.z));
		}
	};
	Exps.prototype.MeshPickedX = function (ret) {
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
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
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
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
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName("mesh" + this.uid);
		var anim = obj.getAnimationByName(name2);
		ret.set_int(anim.currentFrame)
	};
	Exps.prototype.Name = function (ret) {
		ret.set_string("mesh" + this.uid)
	};
	Exps.prototype.SceneUID = function (ret) {
		ret.set_int(this.properties[1])
	};
	pluginProto.exps = new Exps();

}
	());
