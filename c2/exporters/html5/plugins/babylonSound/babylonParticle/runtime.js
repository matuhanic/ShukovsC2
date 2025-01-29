// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonParticle = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonParticle.prototype;

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

	behinstProto.postCreate = function () {};

	function hex2rgb(hex) {
		return {
			r : hex & 0xff,
			g : (hex >> 8) & 0xff,
			b : (hex >> 16) & 0xff
		};
	}

	function vector(vec) {
		var v = vec.split(",");
		return {
			x : v[0],
			y : v[1],
			z : v[2]
		}
	}

	function getXYZ(c2xyz, inst) {
		var xyz = c2xyz;
		xyz = xyz.split(",");
		xyz[0] = xyz[0] - (inst.runtime.canvas.width / 2);
		xyz[1] =  - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname)) {
					var particleSystem = new BABYLON.ParticleSystem(this.inst.properties[0] + "Particle", this.properties[0], this.runtime.scenes[this.inst.properties[1]]);
					particleSystem.particleTexture = new BABYLON.Texture(this.properties[1], this.runtime.scenes[this.inst.properties[1]]);
					particleSystem.particleTexture.hasAlpha = true;
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
					var emitter = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
					particleSystem.emitter = emitter;
					particleSystem.minEmitBox = new BABYLON.Vector3(vector(this.properties[2]).x, vector(this.properties[2]).y, vector(this.properties[2]).z);
					particleSystem.maxEmitBox = new BABYLON.Vector3(vector(this.properties[3]).x, vector(this.properties[3]).y, vector(this.properties[3]).z);
					particleSystem.direction1 = new BABYLON.Vector3(vector(this.properties[4]).x, vector(this.properties[4]).y, vector(this.properties[4]).z);
					particleSystem.direction2 = new BABYLON.Vector3(vector(this.properties[5]).x, vector(this.properties[5]).y, vector(this.properties[5]).z);
					particleSystem.color1 = new BABYLON.Color3(hex2rgb(this.properties[6]).r, hex2rgb(this.properties[6]).g, hex2rgb(this.properties[6]).b);
					
					particleSystem.color2 = new BABYLON.Color3(hex2rgb(this.properties[7]).r, hex2rgb(this.properties[7]).g, hex2rgb(this.properties[7]).b);
					particleSystem.colorDead = new BABYLON.Color3(hex2rgb(this.properties[8]).r, hex2rgb(this.properties[8]).g, hex2rgb(this.properties[8]).b);
					particleSystem.minLifeTime = this.properties[9];
					particleSystem.maxLifeTime = this.properties[10];
					particleSystem.minSize = this.properties[11];
					particleSystem.maxSize = this.properties[12];
					particleSystem.emitRate = this.properties[13];
					particleSystem.minAngularSpeed = this.properties[14] * (Math.PI / 180);
					particleSystem.maxAngularSpeed = this.properties[15] * (Math.PI / 180);
					particleSystem.minEmitPower = this.properties[16];
					particleSystem.maxEmitPower = this.properties[17];
					particleSystem.updateSpeed = this.properties[18];
					particleSystem.gravity = new BABYLON.Vector3(vector(this.properties[19]).x, vector(this.properties[19]).y, vector(this.properties[19]).z);
					if(this.properties[20] == 1)
					{
						particleSystem.start();
					}
					
				this.done = true;
			}

		}
	}

	behinstProto.doStart = function () {}

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

	Acts.prototype.ParticleSetTex = function (id, tex) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var particleName = this.inst.properties[0] + i + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.particleTexture = new BABYLON.Texture(tex, this.runtime.scenes[this.inst.properties[1]]);
				}
			} else {
				var particleName = this.inst.properties[0] + id + "Particle";
				var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
				particleSystem.particleTexture = new BABYLON.Texture(tex, this.runtime.scenes[this.inst.properties[1]]);
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.particleTexture = new BABYLON.Texture(tex, this.runtime.scenes[this.inst.properties[1]]);
		}

	};
	Acts.prototype.ParticleSetStartOffs = function (id, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var particleName = this.inst.properties[0] + i + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.minEmitBox = new BABYLON.Vector3(x, y, z);
				}
			} else {
				var particleName = this.inst.properties[0] + id + "Particle";
				var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
				particleSystem.minEmitBox = new BABYLON.Vector3(x, y, z);
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.minEmitBox = new BABYLON.Vector3(x, y, z);
		}
	};
	Acts.prototype.ParticleSetEndOffs = function (id, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {

					var particleName = this.inst.properties[0] + i + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.maxEmitBox = new BABYLON.Vector3(x, y, z);
				}
			} else {
				var particleName = this.inst.properties[0] + id + "Particle";
				var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
				particleSystem.maxEmitBox = new BABYLON.Vector3(x, y, z);

			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.maxEmitBox = new BABYLON.Vector3(x, y, z);
		}
	};
	Acts.prototype.ParticleSetStartColor = function (id, r, g, b) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.color1 = new BABYLON.Color3.FromInts(r, g, b);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.color1 = new BABYLON.Color3.FromInts(r, g, b);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.color1 = new BABYLON.Color3.FromInts(r, g, b);
		}
	};
	Acts.prototype.ParticleSetMidColor = function (id, r, g, b) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.color2 = new BABYLON.Color3.FromInts(r, g, b);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.color2 = new BABYLON.Color3.FromInts(r, g, b);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.color2 = new BABYLON.Color3.FromInts(r, g, b);
		}
	};
	Acts.prototype.ParticleSetEndColor = function (id, r, g, b) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.colorDead = new BABYLON.Color3.FromInts(r, g, b);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.colorDead = new BABYLON.Color3.FromInts(r, g, b);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.colorDead = new BABYLON.Color3.FromInts(r, g, b);
		}
	};
	Acts.prototype.ParticleSetMinLife = function (id, minl) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.minLifeTime = minl;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.minLifeTime = minl;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.minLifeTime = minl;
		}
	};
	Acts.prototype.ParticleSetMaxLife = function (id, maxl) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.maxLifeTime = maxl;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.maxLifeTime = maxl;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.maxLifeTime = maxl;
		}
	};
	Acts.prototype.ParticleSetMinSize = function (id, mins) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.minSize = mins;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.minSize = mins;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.minSize = mins;
		}
	};
	Acts.prototype.ParticleSetMaxSize = function (id, maxs) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.maxSize = maxs;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.maxSize = maxs;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.maxSize = maxs;
		}
	};
	Acts.prototype.ParticleSetEmitRate = function (id, rate) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.emitRate = rate;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.emitRate = rate;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.emitRate = rate;
		}
	};
	Acts.prototype.ParticleSetDirectA = function (id, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.direction1 = new BABYLON.Vector3(x, y, z);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.direction1 = new BABYLON.Vector3(x, y, z);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.direction1 = new BABYLON.Vector3(x, y, z);
		}
	};
	Acts.prototype.ParticleSetDirectB = function (id, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.direction2 = new BABYLON.Vector3(x, y, z);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.direction2 = new BABYLON.Vector3(x, y, z);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.direction2 = new BABYLON.Vector3(x, y, z);
		}
	};
	Acts.prototype.ParticleSetMinAngSpeed = function (id, s) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.minAngularSpeed = s * (Math.PI / 180);
					}
				}
			} else {
			 {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.minAngularSpeed = s * (Math.PI / 180);
			}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.minAngularSpeed = s * (Math.PI / 180);
		}
	};
	Acts.prototype.ParticleSetMaxAngSpeed = function (id, s) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { 
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.maxAngularSpeed = s * (Math.PI / 180);
					}
			} else { 
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.maxAngularSpeed = s * (Math.PI / 180);
				
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.maxAngularSpeed = s * (Math.PI / 180);
		}
	};
	Acts.prototype.ParticleSetMinPower = function (id, p) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.minEmitPower = p;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.minEmitPower = p;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.minEmitPower = p;
		}
	};
	Acts.prototype.ParticleSetMaxPower = function (id, p) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + id + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.maxEmitPower = p;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.maxEmitPower = p;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.maxEmitPower = p;
		}
	};
	Acts.prototype.ParticleSetUpdateSpeed = function (id, s) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + id + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.updateSpeed = s;
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.updateSpeed = s;
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.updateSpeed = s;
		}
	};
	Acts.prototype.ParticleStart = function (id) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + id + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.start();
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.start();
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.start();
		}
	};
	Acts.prototype.ParticleStop = function (id) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + i + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.stop();
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.stop();
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.stop();
		}
	};
	Acts.prototype.ParticleSetGravity = function (id, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) {
				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) { {
						var particleName = this.inst.properties[0] + id + "Particle";
						var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
						particleSystem.gravity = new BABYLON.Vector3(x, y, z);
					}
				}
			} else { {
					var particleName = this.inst.properties[0] + id + "Particle";
					var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(particleName);
					particleSystem.gravity = new BABYLON.Vector3(x, y, z);
				}
			}
		} else {
			var particleSystem = this.runtime.scenes[this.inst.properties[1]].getParticleSystemByName(this.inst.properties[0] + "Particle");
			particleSystem.gravity = new BABYLON.Vector3(x, y, z);
		}
	};
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behaviorProto.exps = new Exps();

}
	());
