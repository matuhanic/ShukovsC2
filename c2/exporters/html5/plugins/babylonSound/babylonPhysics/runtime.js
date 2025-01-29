// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.babylonPhysics = function (runtime) {
	this.runtime = runtime;
};

(function () {
	var behaviorProto = cr.behaviors.babylonPhysics.prototype;

	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function (behavior, meshtype) {
		this.behavior = behavior;
		this.meshtype = meshtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function () {};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst; // associated meshect instance to modify
		this.runtime = type.runtime;
		this.done = false;
	};

	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function () {
		if (this.inst.mytype == "_mesh") {
			this.meshname = this.inst.properties[0];
		} else if (this.inst.mytype == "_newmesh") {
			this.meshname = "mesh" + this.inst.uid;
		}
	};

	behinstProto.postCreate = function () {};

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
		xyz[1] =  - (xyz[1] - (inst.runtime.canvas.height / 2));
		xyz[2] = xyz[2];
		return xyz;
	}

	behinstProto.saveToJSON = function () {};

	behinstProto.loadFromJSON = function (o) {};

	behinstProto.tick = function () {
		if (!this.done) {
			if (this.runtime.scenes[this.inst.properties[1]] && this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname)) {
				if (!this.runtime.scenes[this.inst.properties[1]].getPhysicsEngine()) {
					var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
					var physicsPlugin = new BABYLON.CannonJSPlugin();
					this.runtime.scenes[this.inst.properties[1]].enablePhysics(gravityVector, physicsPlugin);
					this.runtime.scenes[this.inst.properties[1]].getPhysicsEngine().setTimeStep(1 / 30);
				}
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
				if (mesh.physicsImpostor) {
					mesh.physicsImpostor.dispose();
				}
				if (this.properties[0] == 0) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
				}
				if (this.properties[0] == 1) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
				}
				if (this.properties[0] == 2) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
				}
				if (this.properties[0] == 3) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.CylinderImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
				}
				if (this.properties[0] == 4) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
				}
				if (this.properties[0] == 5) {
					mesh.setPhysicsState(BABYLON.PhysicsEngine.HeightmapImpostor, {
						mass: this.properties[1],
						friction: this.properties[2],
						restitution: this.properties[3]
					});
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
	Cnds.prototype.OnCollide = function () {
		return true;
	};
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.MeshAppImpu = function (id, xf, yf, zf, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);

					mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));
		}

	};
	Acts.prototype.MeshAppImpuTowardsPos = function (id, x, y, z, st) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);

					var target = new BABYLON.Vector3(x, y, z);
					var direction = target.subtract(mesh.position).normalize();
					var impulse = direction.scale(st);
					mesh.applyImpulse(impulse, mesh.getAbsolutePosition());

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				var target = new BABYLON.Vector3(x, y, z);
				var direction = target.subtract(mesh.position).normalize();
				var impulse = direction.scale(st);
				mesh.applyImpulse(impulse, mesh.getAbsolutePosition());
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			var target = new BABYLON.Vector3(x, y, z);
			var direction = target.subtract(mesh.position).normalize();
			var impulse = direction.scale(st);
			mesh.applyImpulse(impulse, mesh.getAbsolutePosition());
		}

	};
	Acts.prototype.MeshAppForc = function (id, xf, yf, zf, x, y, z) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.applyForce(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.applyForce(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.applyForce(new BABYLON.Vector3(xf, yf, zf), new BABYLON.Vector3(mesh.getAbsolutePosition().x + x, mesh.getAbsolutePosition().y + y, mesh.getAbsolutePosition().z + z));
		}

	};
	Acts.prototype.MeshAppLiVel = function (id, xv, yv, zv) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xv, yv, zv));

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xv, yv, zv));
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xv, yv, zv));
		}

	};
	Acts.prototype.MeshAppAngVel = function (id, xv, yv, zv) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(xv, yv, zv));

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(xv, yv, zv));
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(xv, yv, zv));
		}

	};
	Acts.prototype.MeshSetMass = function (id, mass) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.setMass(mass);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.setMass(mass);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.setMass(mass);
		}

	};
	Acts.prototype.MeshSleep = function (id) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.sleep();

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.sleep();
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.sleep();
		}

	};
	Acts.prototype.MeshWakeup = function (id) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.wakeUp();

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.wakeUp();
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.wakeUp();
		}

	};
	Acts.prototype.MeshForceUpd = function (id) {
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.forceUpdate();

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.forceUpdate();
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.forceUpdate();
		}

	};
	Acts.prototype.MeshAddSpringJoint = function (id, n, l, s, d) {
		if (this.inst.mytype == "_newmesh") {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + n.getFirstPicked().uid);
		} else {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(n.getFirstPicked().properties[0]);
		}
		var springJoing = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.SpringJoint, {
				length: l,
				stiffness: s,
				damping: d
			});
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, springJoing);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, springJoing);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, springJoing);
		}

	};
	Acts.prototype.MeshAddDistJoint = function (id, n, mD) {
		if (this.inst.mytype == "_newmesh") {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + n.getFirstPicked().uid);
		} else {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(n.getFirstPicked().properties[0]);
		}
		var distJoint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.DistanceJoint, {
				maxDistance: mD
			});
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, distJoint);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, distJoint);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, distJoint);
		}

	};
	Acts.prototype.MeshAddHingeJoint = function (id, n, mainP, mainA, conP, conA, maxF, coll) {
		if (this.inst.mytype == "_newmesh") {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + n.getFirstPicked().uid);
		} else {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(n.getFirstPicked().properties[0]);
		}
		var mP = mainP.split(",");
		var mA = mainA.split(",");
		var cP = conP.split(",");
		var cA = conA.split(",");
		var hingeJoint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.HingeJoint, {
				mainPivot: new BABYLON.Vector3(mP[0], mP[1], mP[2]),
				connectedPivot: new BABYLON.Vector3(cP[0], cP[1], cP[2]),
				mainAxis: new BABYLON.Vector3(mA[0], mA[1], mA[2]),
				connectedAxis: new BABYLON.Vector3(cA[0], cA[1], cA[2]),
				maxForce: maxF,
				collideConnected: coll
			});
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, hingeJoint);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, hingeJoint);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, hingeJoint);
		}

	};
	Acts.prototype.MeshAddLockJoint = function (id, n, mainP, mainA, conP, conA, maxF, coll) {
		if (this.inst.mytype == "_newmesh") {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + n.getFirstPicked().uid);
		} else {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(n.getFirstPicked().properties[0]);
		}
		var mP = mainP.split(",");
		var mA = mainA.split(",");
		var cP = conP.split(",");
		var cA = conA.split(",");
		var lockJoint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.LockJoint, {
				mainPivot: new BABYLON.Vector3(mP[0], mP[1], mP[2]),
				connectedPivot: new BABYLON.Vector3(cP[0], cP[1], cP[2]),
				mainAxis: new BABYLON.Vector3(mA[0], mA[1], mA[2]),
				connectedAxis: new BABYLON.Vector3(cA[0], cA[1], cA[2]),
				maxForce: maxF,
				collideConnected: coll
			});
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);
		}

	};

	Acts.prototype.MeshAddPTPJoint = function (id, n, mainP, mainA, conP, conA, maxF, coll) {
		if (this.inst.mytype == "_newmesh") {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + n.getFirstPicked().uid);
		} else {
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(n.getFirstPicked().properties[0]);
		}
		var mP = mainP.split(",");
		var mA = mainA.split(",");
		var cP = conP.split(",");
		var cA = conA.split(",");
		var lockJoint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.PointToPointJoint, {
				mainPivot: new BABYLON.Vector3(mP[0], mP[1], mP[2]),
				connectedPivot: new BABYLON.Vector3(cP[0], cP[1], cP[2]),
				mainAxis: new BABYLON.Vector3(mA[0], mA[1], mA[2]),
				connectedAxis: new BABYLON.Vector3(cA[0], cA[1], cA[2]),
				maxForce: maxF,
				collideConnected: coll
			});
		if (this.inst.mytype == "_meshes") {
			if (id == -1) // Loop throu all
			{

				for (var i = this.inst.properties[3]; i < this.inst.properties[4] + 1; i++) {
					var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + i);
					mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);

				}
			} else //
			{
				var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
				mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			mesh.physicsImpostor.addJoint(mesh2.physicsImpostor, lockJoint);
		}

	};

	Acts.prototype.RegisterColli = function (m) {
		if (this.inst.mytype == "_newmesh") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid);
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + m.getFirstPicked().uid);
			var behav = this;
			mesh.physicsImpostor.registerOnPhysicsCollide(mesh2.physicsImpostor, function (main, collided) {
				behav.runtime.trigger(cr.behaviors.babylonPhysics.prototype.cnds.OnCollide, behav.inst);
			});
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0]);
			var mesh2 = this.runtime.scenes[this.inst.properties[1]].getMeshByName(m.getFirstPicked().properties[0]);
			var behav = this;
			mesh.physicsImpostor.registerOnPhysicsCollide(mesh2.physicsImpostor, function (main, collided) {
				behav.runtime.trigger(cr.behaviors.babylonPhysics.prototype.cnds.OnCollide, behav.inst);
			});
		}
	}

	Acts.prototype.SetAsRaycastChassis = function () {
		if (this.inst.mytype == "_newmesh") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName("mesh" + this.inst.uid);
			var world = this.runtime.scenes[this.inst.properties[1]].getPhysicsEngine().getPhysicsPlugin().world;
			var scene = this.runtime.scenes[this.inst.properties[1]];
			// Create the vehicle
			 var options = {
                radius: 1,
                directionLocal: new CANNON.Vec3(0, 0, -0.2),
                //suspensionStiffness: 30,
                //suspensionRestLength: 0.3,
                //frictionSlip: 5,
                //dampingRelaxation: 2.3,
                //dampingCompression: 4.4,
                //maxSuspensionForce: 100000,
                //rollInfluence:  0.01,
                axleLocal: new CANNON.Vec3(0, 1, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0)
                //maxSuspensionTravel: 0.3,
                //customSlidingRotationalSpeed: -30,
                //useCustomSlidingRotationalSpeed: true
            };

			var vehicle = new CANNON.RaycastVehicle({
					chassisBody: mesh.physicsImpostor.physicsBody
				});

			options.chassisConnectionPointLocal.set(1, 1, -1);
            vehicle.addWheel(options);
            options.chassisConnectionPointLocal.set(1, -1, -1);
            vehicle.addWheel(options);
            options.chassisConnectionPointLocal.set(-1, 1, -1);
            vehicle.addWheel(options);
            options.chassisConnectionPointLocal.set(-1, -1, -1);
            vehicle.addWheel(options);

			vehicle.addToWorld(world);

			var wheelBodies = [];
			var cylinderShapes = [];
			for (var i = 0; i < vehicle.wheelInfos.length; i++) {
				var wheel = vehicle.wheelInfos[i];
				//var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
				cylinderShapes[i] = BABYLON.Mesh.CreateCylinder("wheel"+i + this.inst.uid, wheel.radius / 2, wheel.radius, wheel.radius, 10, 1, scene, false);
				cylinderShapes[i].physicsImpostor = new BABYLON.PhysicsImpostor(cylinderShapes[i], BABYLON.PhysicsImpostor.SphereImpostor, {
						mass: 0
					}, scene);
				//cylinderShapes[i].parent = mesh;
				//cylinderShapes[i].position = new BABYLON.Vector3(wheel.chassisConnectionPointLocal.x, wheel.chassisConnectionPointLocal.y, wheel.chassisConnectionPointLocal.z);

				var wheelBody = cylinderShapes[i].physicsImpostor.physicsBody;
				wheelBody.type = CANNON.Body.KINEMATIC;
				wheelBody.collisionFilterGroup = 0; // turn off collisions
				wheelBodies.push(wheelBody);
				world.addBody(wheelBody);

			}
			// Update wheels
			world.addEventListener('postStep', function () {
				for (var i = 0; i < vehicle.wheelInfos.length; i++) {
					vehicle.updateWheelTransform(i);
					var t = vehicle.wheelInfos[i].worldTransform;
					cylinderShapes[i].position.copyFrom(t.position);
					cylinderShapes[i].rotationQuaternion.copyFrom(t.quaternion);
					//cylinderShapes[i].physicsImpostor.forceUpdate();
				}
			});

			document.onkeydown = handler;
			document.onkeyup = handler;

			var maxSteerVal = 0.5;
			var maxForce = 1000;
			var brakeForce = 1000000;
			function handler(event) {
				var up = (event.type == 'keyup');
				if (!up && event.type !== 'keydown') {
					return;
				}
				vehicle.setBrake(0, 0);
				vehicle.setBrake(0, 1);
				vehicle.setBrake(0, 2);
				vehicle.setBrake(0, 3);
				switch (event.keyCode) {
				case 38: // forward
					vehicle.applyEngineForce(up ? 0 : maxForce, 2);
					vehicle.applyEngineForce(up ? 0 : maxForce, 3);
					
					break;
				case 40: // backward
					vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
					vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
					break;
				case 66: // b
					vehicle.setBrake(brakeForce, 0);
					vehicle.setBrake(brakeForce, 1);
					vehicle.setBrake(brakeForce, 2);
					vehicle.setBrake(brakeForce, 3);
					break;
				case 39: // right
					vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0);
					vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1);
					
					break;
				case 37: // left
					vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0);
					vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1);
					
					break;
				}
			}

		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0]);

		}
	}

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	Exps.prototype.Mass = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getParam("mass"));
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getParam("mass"));
		}

	};
	Exps.prototype.Friction = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getParam("friction"));
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getParam("friction"));
		}
	};
	Exps.prototype.Restitution = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getParam("restitution"));
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getParam("restitution"));
		}
	};
	Exps.prototype.AngularVelX = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().x);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().x);
		}

	};
	Exps.prototype.AngularVelY = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().y);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().y);
		}
	};
	Exps.prototype.AngularVelZ = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().z);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getAngularVelocity().z);
		}
	};
	Exps.prototype.LinearVelX = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().x);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().x);
		}

	};
	Exps.prototype.LinearVelY = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().y);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().y);
		}
	};
	Exps.prototype.LinearVelZ = function (ret, id) {
		if (this.inst.mytype == "_meshes") {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.inst.properties[0] + id);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().z);
		} else {
			var mesh = this.runtime.scenes[this.inst.properties[1]].getMeshByName(this.meshname);
			ret.set_float(mesh.getPhysicsImpostor().getLinearVelocity().z);
		}
	};
	behaviorProto.exps = new Exps();

}
	());
