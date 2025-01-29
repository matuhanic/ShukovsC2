// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Spaceship = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Spaceship.prototype;
		
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
		
		// Key states
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
		this.ignoreInput = false;
		
		// Simulated controls
		this.simleft = false;
		this.simright = false;
		this.simup = false;
		this.simdown = false;
		
		// Movement

		
		
		this.velX = 0; //x velocity
		this.velY = 0; //y velocity
		
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.mAngle = this.properties[0];	//"Initial Motion Angle
		this.mSpeed = this.properties[1];	//"Initial Speed
		this.acc = this.properties[2];		//"Acceleration
		this.dec = this.properties[3];		//"Deceleration
		this.turnRate = this.properties[4];	//"Turn Rate
		this.maxSpeed = this.properties[5];	//"Maximum Speed
		this.collision = this.properties[6];//On solid collision
		this.defaultControls = (this.properties[7] === 1);	// 0=no, 1=yes
		
		// Only bind keyboard events via jQuery if default controls are in use
		if (this.defaultControls)
		{
			jQuery(document).keydown(
				(function (self) {
					return function(info) {
						self.onKeyDown(info);
					};
				})(this)
			);
		
			jQuery(document).keyup(
				(function (self) {
					return function(info) {
						self.onKeyUp(info);
					};
				})(this)
			);
		}
		
		
		

		
		//Start movement
		if (this.mSpeed > 0)
		{
			if(this.mSpeed > this.maxSpeed)
			{
				this.velX = this.maxSpeed * Math.cos(this.mAngle);
				this.velY = this.maxSpeed * Math.sin(this.mAngle);
			}
			else
			{
				this.velX = this.mSpeed * Math.cos(this.mAngle);
				this.velY = this.mSpeed * Math.sin(this.mAngle);
			}
		}
		else
		{
			this.velX = 0;
			this.velY = 0;
		}
	};

	behinstProto.onKeyDown = function (info)
	{	
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			this.leftkey = true;
			break;
		case 38:	// up
			info.preventDefault();
			this.upkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = true;
			break;
		
		case 40:	// down
			info.preventDefault();
			this.downkey = true;
			break;
		
		}
		
		// Ignoring input: ignore all keys
		if (this.ignoreInput)
		{
			this.leftkey = false;
			this.rightkey = false;
			this.upkey = false;
			this.downkey = false;
		}
	};

	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			break;
		case 38:	// up
			info.preventDefault();
			this.upkey = false;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			break;
		
		case 40:	// down
			info.preventDefault();
			this.downkey = false;
			break;
		
		}
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var up = this.upkey || this.simup;
		var down = this.downkey || this.simdown;
		this.simleft = false;
		this.simright = false;
		this.simup = false;
		this.simdown = false;
		
		
		/************************
		*	MOVEMENT  	* <--- change the behavior when colliding!!!
		************************/
		
		//Save position
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		
		//Reposition ship according to offset
		//X Movement
		this.inst.x += this.velX * dt;
		this.inst.set_bbox_changed();
		//check if overlapping a solid
		if(!(this.collision === "Do Nothing"))
		{
			if (this.runtime.testOverlapSolid(this.inst))
			{
				this.inst.x = oldx;
				this.inst.y = oldy;
				if (this.collision === "Bounce")
				{
					this.velX *= -1;
				}
				else if (this.collision === "Stop")
				{
					this.velX = 0;
					this.velY = 0;
				}
				else if (this.collision === "Reverse")
				{
					this.velX *= -1;
					this.velY *= -1;
				}
				this.inst.set_bbox_changed();
			}
		}
		//Y Movement
		this.inst.y += this.velY * dt;
		this.inst.set_bbox_changed();
		//check if overlapping a solid
		if(!(this.collision === "Do Nothing"))
		{
			if (this.runtime.testOverlapSolid(this.inst))
			{
				this.inst.x = oldx;
				this.inst.y = oldy;
				if (this.collision === "Bounce")
				{
					this.velY *= -1;
				}
				else if (this.collision === "Stop")
				{
					this.velX = 0;
					this.velY = 0;
				}
				else if (this.collision === "Reverse")
				{
					this.velX *= -1;
					this.velY *= -1;
				}
				this.inst.set_bbox_changed();
			}
		}

		
		//Set movement speed
		this.mSpeed = Math.sqrt(Math.pow(this.velX,2)+Math.pow(this.velY,2));
		
		//Apply acceleration
		if(up)
		{
			this.velX += Math.cos(this.inst.angle)* this.acc * dt;
			this.velY += Math.sin(this.inst.angle) * this.acc * dt;
			
			if(speed >this.maxSpeed) //limit max speed
			{
				this.velX *= this.maxSpeed/(speed+this.acc);
				this.velY *= this.maxSpeed/(speed+this.acc);
			}
			
		}
		//Apply deceleration
		if(down)
		{
			this.velX += Math.cos(this.inst.angle+cr.to_clamped_radians(180))* this.dec * dt;
			this.velY += Math.sin(this.inst.angle+cr.to_clamped_radians(180)) * this.dec * dt;
			if(speed >this.maxSpeed) //limit max speed
			{
				this.velX *= this.maxSpeed/(speed+this.dec);
				this.velY *= this.maxSpeed/(speed+this.dec);
			}
		}
		
		
		//Rotate object
		if(left && !right)
		{
			this.inst.angle -= this.turnRate*dt;
			this.inst.set_bbox_changed();
		}
		if(right && !left)
		{
			this.inst.angle +=this.turnRate*dt;
			this.inst.set_bbox_changed();
		}
		
		//Limit max speed
										//<---- 	IMPLEMENT THIS
		var speed = Math.sqrt(Math.pow(this.velX,2)+Math.pow(this.velY,2));
		if(speed >this.maxSpeed)
		{
			this.velX *= this.maxSpeed/speed;
			this.velY *= this.maxSpeed/speed;
		}
		
	};

	//////////////////////////////////////
	// Conditions
	
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	cnds.IsMoving = function ()
	{
		return this.velX != 0 || this.velY != 0;
	};
	
	cnds.CompareSpeed = function (cmp, s)
	{
		var speed = Math.sqrt(Math.pow(this.velX,2) + Math.pow(this.velY,2));
		return cr.do_cmp(speed, cmp, s);
	};
	
	cnds.CompareAngle = function (cmp, a)
	{
		var angle = cr.to_degrees(Math.atan2((this.inst.y+this.velY) - this.inst.y , this.inst.x - (this.inst.x+this.velX)));
		return cr.do_cmp(angle, cmp, a);
	};

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	acts.Stop = function ()
	{
		this.dx = 0;
		this.dy = 0;
		this.velX = 0;
		this.velY = 0;
	};
	
	acts.Reverse = function ()
	{
		this.velX *= -1;
		this.velY *= -1;
	};
	
	acts.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	
	acts.SetMovingAngle = function (angle)
	{
		var speed = Math.sqrt(Math.pow(this.velX,2)+Math.pow(this.velY,2));
		this.velX = Math.cos(angle)*speed;
		this.velY = Math.sin(angle)*speed;
	};
	
	acts.SetSpeed = function (speed)
	{
		if (speed <= 0)
		{
			this.velX = 0;
			this.velY = 0;
		}
		else if (speed > this.maxspeed)
		{
			speed = this.maxspeed;
		}
				
		// Speed is new magnitude of vector of motion
		var a = Math.atan2(this.velY, this.velX);
		this.velX = speed * Math.cos(a);
		this.velY = speed * Math.sin(a);
	};
	
	acts.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		
		if (this.maxspeed < 0)
		{
			this.maxspeed = 0;
		}
	};
	
	acts.SetAcceleration = function (acc)
	{
		this.acc = acc;
		
		if (this.acc < 0)
		{
			this.acc = 0;
		}
	};
	
	acts.SetDeceleration = function (dec)
	{
		this.dec = dec;
		
		if (this.dec < 0)
		{
			this.dec = 0;
		}
	};
	
	acts.SetVectorX = function(xv)
	{
		if(xv > this.maxSpeed)
		{
			xv = this.maxSpeed;
		}
		else if (xv < (-1*this.maxSpeed))
		{
			xv = (-1*this.maxSpeed);
		}
		this.velX = xv;

	};
	
	acts.SetVectorY = function(yv)
	{
		if(yv > this.maxSpeed)
		{
			yv = this.maxSpeed;
		}
		else if (yv < (-1*this.maxSpeed))
		{
			yv = (-1*this.maxSpeed);
		}
		this.velY = yv;
	};
	acts.SetTurnRate = function(tr)
	{
		this.turnRate = tr;
	}
	
	acts.ReverseX = function ()
	{
		this.velX *= -1;
	};
	
	acts.ReverseY = function ()
	{
		this.velY *= -1;
	};
	
	acts.SimulateControl = function (ctrl)
	{
		// 0=left, 1=right, 2=up, 3=down
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simup = true;	break;
		case 3:		this.simdown = true;	break;
		}
	};

	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;
	
	exps.MovingAngle = function (ret)
	{
		if(this.velX == 0 && this.velY ==0)
		{
			ret.set_float(0);
		}
		else
		{
			ret.set_float(cr.to_degrees(Math.atan2((this.inst.y+this.velY) - this.inst.y , this.inst.x - (this.inst.x+this.velX))));
		}
	};
	
	exps.Speed = function (ret)
	{
		ret.set_float(Math.sqrt(Math.pow(this.velX,2)+Math.pow(this.velY,2)));
	};
	
	exps.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxSpeed);
	};
	
	exps.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	
	exps.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	
	exps.VectorX = function (ret)
	{
		ret.set_float(this.velX);
	};
	
	exps.VectorY = function (ret)
	{
		ret.set_float(this.velY);
	};
	exps.TurnRate = function (ret)
	{
		ret.set_float(this.turnRate);
	};
	
}());