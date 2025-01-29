// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv


cr.plugins_.babylonMeshArraySLE = function (runtime) {
	this.runtime = runtime;

};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.babylonMeshArraySLE.prototype;

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
		this.mytype = "_meshes";
		this.done = false;
		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;


	var xscale = [];
	var yscale = [];
	var xpos = [];
	var ypos = [];
	var xextsize = [];
	var yextsize = [];
	// called whenever an instance is created
	instanceProto.onCreate = function () {

	
			//inst[1] = this.runtime.createInstance(this.type, this.layer);
		
		//this.runtime.tickMe(this);
		this.runtime.tick2Me(this);
	};

	instanceProto.tick = function () {};

	instanceProto.tick2 = function () {
		if (this.properties[2] == 1) // Construct 2 is taking the wheel
		{
			
			if (this.runtime.scenes[this.properties[1]] && this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0]+this.properties[3])) {
				if (!this.done) {
					for (var i = this.properties[3]; i < this.properties[4] + 1; i++) {
						xscale[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).scaling.z;
						yscale[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).scaling.y;
						xextsize[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).getBoundingInfo().boundingBox.extendSize.z;
						yextsize[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).getBoundingInfo().boundingBox.extendSize.y;
						xpos[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).position.z;
						ypos[i] = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).position.y;
						this.width = (xextsize[i] * xscale[i]) * 2;
						this.height = (yextsize[i] * yscale[i]) * 2;
						this.x = xpos[i];
						this.y = -ypos[i];
						this.angle = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).rotation.x;
						this.set_bbox_changed();

						this.hotspotX = 0.5;
						this.hotspotY = 0.5;
						this.update_bbox();
						if (i == this.properties[4]) // End of for loop
						{
							this.done = true;
						}

					}
				} else {
					
					for (var i = this.properties[3]; i < this.properties[4] + 1; i++) {
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).rotation.x = this.angle; // Euler
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).position.z = this.x;
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).position.y = -this.y;
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).isVisible = this.visible;
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).visibility = this.opacity;
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).scaling.z = this.width / (xextsize[i] * 2);
						this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + i).scaling.y = this.height / (yextsize[i] * 2);
					}
				}

			}

		} 

	};

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
	Cnds.prototype.IsChildOff = function (id, p) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}

			var fat = this.runtime.scenes[this.properties[1]].getMeshByName(p);
			return mesh.isDescendantOf(fat);
		} else {
			return false;
		}

	};
	Cnds.prototype.IsDisposed = function (id) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.isDisposed();
		} else {
			return false;
		}

	};
	Cnds.prototype.IsInFrustum = function (id, a, b, c, d) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.isInFrustum(new BABYLON.Plane(a, b, c, d));
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshOnCollide = function (id, m2) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			var mesh2 = this.runtime.scenes[this.properties[1]].getMeshByName(m2);
			if (mesh.collided == mesh2.name) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshOnReady = function (id) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.isReady();
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshIsBlocked = function (id) {
		if (this.runtime.scenes[this.properties[1]]) { {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.IsBlocked;
		} else {
			return false;
		}
	};
	Cnds.prototype.MeshIsReady = function (id) {
		if (this.runtime.scenes[this.properties[1]]) {
			if (this.properties[5] == 1) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + leftPad(id, 3));
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.isReady();
		} else {
			return false;
		}
	};
	Cnds.prototype.IntersWithMesh = function (id, t) {
		if (this.runtime.scenes[this.properties[1]]) {
			if (this.properties[5] == 1) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + leftPad(id, 3));
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			var targ = this.runtime.scenes[this.properties[1]].getMeshByName(t);
			return mesh.intersectsMesh(targ, true);
		} else {
			return false;
		}
	};
	Cnds.prototype.IntersWithPoint = function (id, x, y, z) {
		if (this.runtime.scenes[this.properties[1]]) {
			if (this.properties[5] == 1) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + leftPad(id, 3));
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}
			return mesh.intersectsPoint(new BABYLON.Vector3(x, y, z));
		} else {
			return false;
		}
	};
	Cnds.prototype.IsObjectPicked = function (id) {
		if (this.runtime.scenes[this.properties[1]]) {
			if (this.properties[5] == 1) {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + leftPad(id, 3));
			} else {
				var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(this.properties[0] + id);
			}

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

	Cnds.prototype.IsVisible = function (id) {
		var meshname = this.properties[0] + id;
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		return obj.isVisible;
	};

	pluginProto.cnds = new Cnds();

	function Acts() {};
	Acts.prototype.MeshSetFogEnabled = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.applyFog = true;
			} else {
				mesh.applyFog = false;
			}
		} else {

			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.applyFog = true;
				} else {
					mesh.applyFog = false;
				}
			}
		}

	};
	Acts.prototype.MeshSetFacingForward = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.definedFacingForward = true;
			} else {
				mesh.definedFacingForward = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.definedFacingForward = true;
				} else {
					mesh.definedFacingForward = false;
				}
			}
		}

	};
	Acts.prototype.MeshCheckColl = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.checkCollisions = true;
			} else {
				mesh.checkCollisions = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.checkCollisions = true;
				} else {
					mesh.checkCollisions = false;
				}
			}
		}

	}
	Acts.prototype.MeshUseBones = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.useBones = true;
			} else {
				mesh.useBones = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.useBones = true;
				} else {
					mesh.useBones = false;
				}
			}
		}

	};
	Acts.prototype.MeshInfinDist = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.infiniteDistance = true;
			} else {
				mesh.infiniteDistance = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.infiniteDistance = true;
				} else {
					mesh.infiniteDistance = false;
				}
			}
		}

	};
	Acts.prototype.MeshReceiveShadow = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.receiveShadows = true;
			} else {
				mesh.receiveShadows = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.receiveShadows = true;
				} else {
					mesh.receiveShadows = false;
				}
			}
		}

	};
	Acts.prototype.MeshAddLOD = function (id, lod, dist) {
		var lodmesh = this.runtime.scenes[this.properties[1]].getMeshByName(lod);
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.addLODLevel(dist, lodmesh);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.addLODLevel(dist, lodmesh);
			}
		}

	};
	Acts.prototype.MeshDisplMap = function (id, map, min, max) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.applyDisplacementMap(map, min, max);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.applyDisplacementMap(map, min, max);
			}
		}
	};
	Acts.prototype.MeshAttachToBone = function (id, bonename) {
		var bone = this.runtime.scenes[this.properties[1]].getBoneByName(bonename);
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.attachToBone(bone);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}

				mesh.attachToBone(bone);
			}
		}

	};
	Acts.prototype.MeshSetFlatShaded = function (id) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.convertToFlatShadedMesh();
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.convertToFlatShadedMesh();
			}
		}

	};
	Acts.prototype.MeshDetachFromBone = function (id) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.detachFromBone();
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.detachFromBone();
			}
		}

	};
	Acts.prototype.MeshEdgeColor = function (id, r, g, b) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.outlineColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.outlineColor = new BABYLON.Color3.FromInts(parseInt(r), parseInt(g), parseInt(b));
			}
		}

	};
	Acts.prototype.MeshEdgeWidth = function (id, w) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.outlineWidth = w;
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.outlineWidth = w;
			}
		}

	};
	Acts.prototype.MeshEllipsoid = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.ellipsoid = new BABYLON.Vector3(x, y, z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.ellipsoid = new BABYLON.Vector3(x, y, z);
			}
		}

	};
	Acts.prototype.MeshSetEdgeRend = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.renderOutline = true;
			} else {
				mesh.renderOutline = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}

				if (state == 0) {
					mesh.renderOutline = true;
				} else {
					mesh.renderOutline = false;
				}
			}
		}
	};
	Acts.prototype.MeshFlipFaces = function (id) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.flipFaces(true);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.flipFaces(true);
			}
		}

	};
	Acts.prototype.MeshTranslLocaly = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.locallyTranslate(new BABYLON.Vector3(x, y, z));
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.locallyTranslate(new BABYLON.Vector3(x, y, z));
			}
		}
	};
	Acts.prototype.MeshLookAt = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.lookAt(new BABYLON.Vector3(x, y, z), 0, 0, 0);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.lookAt(new BABYLON.Vector3(x, y, z), 0, 0, 0);
			}
		}
	};
	Acts.prototype.MeshMoveColl = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.moveWithCollisions(new BABYLON.Vector3(x, y, z));
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.moveWithCollisions(new BABYLON.Vector3(x, y, z));
			}
		}
	};

	Acts.prototype.MeshRegisterEvent = function (id, type) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (type == 0) {
				mesh.onCollide = function (id, col) {
					console.log(col.name);
					this.collided = col.name;
					this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.MeshOnCollide, this);
				}
			} else if (type == 1) {
				mesh.onReady = function (id) {
					this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.MeshOnReady, this);
				}
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (type == 0) {
					mesh.onCollide = function (id, col) {
						console.log(col.name);
						this.collided = col.name;
						this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.MeshOnCollide, this);
					}
				} else if (type == 1) {
					mesh.onReady = function (id) {
						this.runtime.trigger(cr.plugins_.babylonSceneLoader.prototype.cnds.MeshOnReady, this);
					}
				}
			}
		}
	};

	Acts.prototype.MeshMorphVertices = function (id, sI, eI, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
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
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
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
			}
		}
	};
	Acts.prototype.MeshSetLineColor = function (id, r, g, b) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.color = new BABYLON.Color3.FromInts(r, g, b);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.color = new BABYLON.Color3.FromInts(r, g, b);
			}
		}
	};
	Acts.prototype.MeshVisiblity = function (id, v) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.visibility = v;
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.visibility = v;
			}
		}
	};
	Acts.prototype.MeshSetIsVisible = function (id, v) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.isVisible = v;
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
					mesh.isVisible = v;
				}
			}
		}
	};
	Acts.prototype.MeshSetParent = function (id, ptype, p) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (ptype == 0) {
				var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p);
			} else if (ptype == 1) {
				var parnt = this.runtime.scenes[this.properties[1]].getLightByName(p);
			} else {
				var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p);
			}
			var fix = mesh.getAbsolutePosition();
			mesh.parent = parnt;
			mesh.setAbsolutePosition(fix);
			mesh.rotation = new BABYLON.Vector3(0, 0, 0);
			mesh.scaling = new BABYLON.Vector3(1, 1, 1);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (ptype == 0) {
					var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p);
				} else if (ptype == 1) {
					var parnt = this.runtime.scenes[this.properties[1]].getLightByName(p);
				} else {
					var parnt = this.runtime.scenes[this.properties[1]].getMeshByName(p);
				}
				var fix = mesh.getAbsolutePosition();
				mesh.parent = parnt;
				mesh.setAbsolutePosition(fix);
				mesh.rotation = new BABYLON.Vector3(0, 0, 0);
				mesh.scaling = new BABYLON.Vector3(1, 1, 1);
			}
		}
	};
	Acts.prototype.MeshSetPosition = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.position = new BABYLON.Vector3(x, y, z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.position = new BABYLON.Vector3(x, y, z);
			}
		}
	};
	Acts.prototype.MeshSetRotation = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotation.x = x;
			mesh.rotation.y = y;
			mesh.rotation.z = z;
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
					mesh.rotation.x = x;
					mesh.rotation.y = y;
					mesh.rotation.z = z;
				}

			}
		}
	};
	Acts.prototype.MeshSetScaling = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.scaling = new BABYLON.Vector3(x, y, z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.scaling = new BABYLON.Vector3(x, y, z);
			}
		}
	};
	Acts.prototype.TranslateMeshBy = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.position = new BABYLON.Vector3(mesh.position.x + x, mesh.position.y + y, mesh.position.z + z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.position = new BABYLON.Vector3(mesh.position.x + x, mesh.position.y + y, mesh.position.z + z);
			}
		}
	};
	Acts.prototype.RotateMeshBy = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotation = new BABYLON.Vector3(mesh.rotation.x + x, mesh.rotation.y + y, mesh.rotation.z + z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotation = new BABYLON.Vector3(mesh.rotation.x + x, mesh.rotation.y + y, mesh.rotation.z + z);
			}
		}
	};
	Acts.prototype.ScaleMeshBy = function (id, x, y, z) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.scaling = new BABYLON.Vector3(mesh.scaling.x + x, mesh.scaling.y + y, mesh.scaling.z + z);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.scaling = new BABYLON.Vector3(mesh.scaling.x + x, mesh.scaling.y + y, mesh.scaling.z + z);
			}
		}
	};

	Acts.prototype.MeshBeginAnim = function (id, animName, start, end, loop, speed) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			this.runtime.scenes[this.properties[1]].beginDirectAnimation(mesh, [mesh.getAnimationByName(animName)], start, end, loop, speed);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				this.runtime.scenes[this.properties[1]].beginDirectAnimation(mesh, [mesh.getAnimationByName(animName)], start, end, loop, speed);
			}
		}
	};

	Acts.prototype.MeshStopAnim = function (id, name) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			this.runtime.scenes[this.properties[1]].stopAnimation(mesh);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				this.runtime.scenes[this.properties[1]].stopAnimation(mesh);
			}
		}
	};

	Acts.prototype.MeshCreateAnim = function (id, animName, param, start, mid, end, fps) {
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
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.animations.push(anim);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.animations.push(anim);
			}
		}
	};

	Acts.prototype.MeshPauseAnim = function (id) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).pause();
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).pause();
			}
		}
	};

	Acts.prototype.MeshRestartAnim = function (id) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).restart();
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				this.runtime.scenes[this.properties[1]].getAnimatableByTarget(mesh).restart();
			}
		}
	};
	Acts.prototype.MeshSetEnabled = function (id, state) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (state == 0) {
				mesh.setEnabled(true);
			} else {
				mesh.setEnabled(false);
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (state == 0) {
					mesh.setEnabled(true);
				} else {
					mesh.setEnabled(false);
				}
			}
		}
	};
	Acts.prototype.RotateMeshXLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.RotateMeshYLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.RotateMeshZLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.RotateMeshXWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
			}
		}
	};
	Acts.prototype.RotateMeshYWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
			}
		}
	};
	Acts.prototype.RotateMeshZWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.rotate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
			}
		}
	};

	Acts.prototype.TranslateMeshXLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.X, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.TranslateMeshYLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.Y, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.TranslateMeshZLocal = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.Z, angle, BABYLON.Space.LOCAL);
			}
		}
	};
	Acts.prototype.TranslateMeshXWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.X, angle, BABYLON.Space.WORLD);
			}
		}
	};
	Acts.prototype.TranslateMeshYWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.Y, angle, BABYLON.Space.WORLD);
			}
		}
	};
	Acts.prototype.TranslateMeshZWorld = function (id, angle) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.translate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.translate(BABYLON.Axis.Z, angle, BABYLON.Space.WORLD);
			}
		}
	};
	Acts.prototype.MeshSetPickable = function (id, pickable) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			if (pickable == 0) {
				mesh.isPickable = true;
			} else {
				mesh.isPickable = false;
			}
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				if (pickable == 0) {
					mesh.isPickable = true;
				} else {
					mesh.isPickable = false;
				}
			}
		}
	};
	Acts.prototype.MeshDestroy = function (id, type) {
		if (id != -1) {
			var meshname = this.properties[0] + id;
			var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
			mesh.dispose();
		} else {
			for (var i = this.properties[3]; i < this.properties[4] + 1; i++) { {
					var meshname = this.properties[0] + i;
					var mesh = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
				}
				mesh.dispose();
			}
		}
	};

	pluginProto.acts = new Acts();

	function Exps() {};

	Exps.prototype.CenterX = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().x);
	};
	Exps.prototype.CenterY = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().y);
	};
	Exps.prototype.CenterZ = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getPhysicsImpostor().getObjectCenter().z);
	};
	Exps.prototype.TotalVertices = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_int(obj.getTotalVertices());
	};
	Exps.prototype.DistanceToCam = function (ret, id, camname) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		var cam = this.runtime.scenes[this.properties[1]].getCameraByName(camname);
		ret.set_float(obj.getDistanceToCamera(cam));
	};
	Exps.prototype.MeshPosX = function (ret,id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.position.x);
	};
	Exps.prototype.MeshPosY = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.position.y);
	};
	Exps.prototype.MeshPosZ = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.position.z);
	};
	Exps.prototype.MeshAbsoPosX = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getAbsolutePosition().x);
	};
	Exps.prototype.MeshAbsoPosY = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getAbsolutePosition().y);
	};
	Exps.prototype.MeshAbsoPosZ = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.getAbsolutePosition().z);
	};
	Exps.prototype.MeshScaleX = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.scaling.x);
	};
	Exps.prototype.MeshScaleY = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.scaling.y);
	};
	Exps.prototype.MeshScaleZ = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		ret.set_float(obj.scaling.z);
	};
	Exps.prototype.MeshRotX = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		if(obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(obj.rotationQuaternion.x);
		}
		else
		{
			ret.set_float(obj.rotation.x);
		}
		
	};
	Exps.prototype.MeshRotY = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		if(obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(obj.rotationQuaternion.y);
		}
		else
		{
			ret.set_float(obj.rotation.y);
		}
	};
	Exps.prototype.MeshRotZ = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		if(obj.physicsImpostor) // Mesh has physics
		{
			ret.set_float(obj.rotationQuaternion.z);
		}
		else
		{
			ret.set_float(obj.rotation.z);
		}
	};
	Exps.prototype.MeshPickedX = function (ret, id) { {
			var meshname = this.properties[0] + id;
		}
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		var pickResult;
		var res;
		pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
		if (pickResult.hit && pickResult.pickedMesh == obj) { ;
			ret.set_float(pickResult.pickedPoint.x)
		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.MeshPickedY = function (ret, id) {
		var meshname = this.properties[0] + id;
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		var pickResult;
		var res;
		pickResult = this.runtime.scenes[this.properties[1]].pick(this.runtime.scenes[this.properties[1]].pointerX, this.runtime.scenes[this.properties[1]].pointerY);
		if (pickResult.hit && pickResult.pickedMesh == obj) { ;
			ret.set_float(pickResult.pickedPoint.y)
		} else {
			ret.set_float(-1)
		}
	};
	Exps.prototype.MeshCurrentFrame = function (ret, id, name2) {
		var meshname = this.properties[0] + id;
		var obj = this.runtime.scenes[this.properties[1]].getMeshByName(meshname);
		var anim = obj.getAnimationByName(name2);
		ret.set_int(anim.currentFrame)
	};
	Exps.prototype.Name = function (ret, id) {
		ret.set_string(meshname)
	};
	Exps.prototype.SceneUID = function (ret, id) {
		ret.set_int(this.properties[1])
	};

	pluginProto.exps = new Exps();

}
	());
