// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Turret = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Turret.prototype;
	
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
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.head = this.properties[0]+180; 				//Heading + 180 degrees to correct for how angles are represented in sprites
		this.arc = this.properties[1]; 						//Arc
		this.maxRange = this.properties[2]; 				//Maximum Range
		this.minRange = this.properties[3];					//Minimum Range
		this.turnRate = cr.to_radians(this.properties[4]);	//Turning Rate
		this.notAim = this.properties[5]; 					//When not aiming
		
		this.targetX=0;
		this.targetY=0;
		this.hasTarget = false;
		this.targetUID = null;
	};

	
	behinstProto.withinAngle = function(x,y){
		var angl = cr.to_clamped_degrees(Math.atan2(y-this.inst.y,this.inst.x-x));
		var rarc = cr.clamp_angle_degrees(this.head-(this.arc/2));
		var larc = cr.clamp_angle_degrees(this.head+(this.arc/2));
		
		if(this.arc >= 180){ //if the arc is greater than 180º, you want to check if the angle is between the greater difference of angles, not the smallest
			if(rarc < larc){
				return !(rarc <= angl && angl <= larc);
			}
			return !(0 <= angl && angl <= larc || rarc <= angl && angl < 360);
		}
		else{
			if(rarc < larc){
				return (rarc <= angl && angl <= larc);
			}
			return (0 <= angl && angl <= larc || rarc <= angl && angl < 360);
		}
	};
	
	behinstProto.withinRange = function(x,y){
		var range = Math.sqrt(Math.pow(this.inst.x-x,2)+Math.pow(this.inst.y-y,2));
		if((range < this.maxRange) && (range > this.minRange))
		{
			return range;
		}
		else
		{
			return false;
		}
	};
	
		behinstProto.linedUp = function(tolerance){
		var angl = cr.to_clamped_degrees(this.inst.angle);
		var myAngle = cr.to_clamped_degrees(Math.atan2(this.inst.y-this.targetY,this.inst.x-this.targetX))+180;
		var rarc = cr.clamp_angle_degrees(myAngle-tolerance);
		var larc = cr.clamp_angle_degrees(myAngle+tolerance);
		if(tolerance*2 >= 180){ //if the arc is greater than 180º, you want to check if the angle is between the greater difference of angles, not the smallest
			if(rarc < larc){
				return !(rarc <= angl && angl <= larc);
			}
			return !(0 <= angl && angl <= larc || rarc <= angl && angl < 360);
		}
		else{
			if(rarc < larc){
				return (rarc <= angl && angl <= larc);
			}
			return (0 <= angl && angl <= larc || rarc <= angl && angl < 360);
		}
	};
	
	behinstProto.tick = function (){
		var dt = this.runtime.getDt(this.inst);
		
		/**if(this.hasTarget === true){
			//get angle to target
			var angl = Math.atan2(this.targetY-this.inst.y,this.inst.x-this.targetX);
			//check if should rotate clockwise or counter-clockwise and rotate
			if(cr.angleClockwise(this.inst.angle,angl)){
				this.inst.angle += this.turnRate*dt;
				this.inst.set_bbox_changed();
			}
			else{
				this.inst.angle -= this.turnRate*dt;
				this.inst.set_bbox_changed();
			}
		}*/
		if(this.hasTarget === true)
		{
			var angl = Math.atan2(this.targetY-this.inst.y,this.inst.x-this.targetX);
			if(this.withinRange(this.targetX,this.targetY) && this.withinAngle(this.targetX,this.targetY))
			{
				if(cr.angleClockwise(cr.to_radians(360)-this.inst.angle,angl)){
					this.inst.angle -= this.turnRate*dt;
					this.inst.set_bbox_changed();
				}
				else{
					this.inst.angle += this.turnRate*dt;
					this.inst.set_bbox_changed();
				}
			}
		}
	};

	//////////////////////////////////////
	// Conditions
	
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	cnds.IsRotating = function ()
	{
		//return this.velX != 0 || this.velY != 0;
	};
	
	cnds.PtWithinArc = function (x, y)
	{
		return this.withinAngle(x,y);
	};
	
	cnds.PtWithinRange = function (x, y)
	{
		return this.withinRange(x,y);
	};
	
	cnds.PtCanFire = function (x, y)
	{
		return (this.withinRange(x,y) && this.withinAngle(x,y));
	};
	
	cnds.ObjWithinArc = function (type)
	{
		if (!type){
			return false;
		}
		/********************************
		 *	  MODIFYING SOL		*
		 ********************************/
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();

		var picked = []; //instances to pick when done
		var obj; //this will hold the object during the iteration loop
		
		var cnd_inverted = this.runtime.getCurrentCondition().inverted; //check if condition is inverted
		
		for(var i = 0, len=instances.length; i < len; i++){ //iterate through instances
			obj = instances[i]; //current instance
			
			// 'xor' handles the invert flag
			if (cr.xor(this.withinAngle(obj.x, obj.y), cnd_inverted))
			{
				picked.push(obj);
			}
		}
		
		if(picked.length){ //if we have objects picked
			sol.select_all = false;
			sol.instances = picked;
			return !cnd_inverted;  // C2 inverts the result
		}
		else
		{
			return cnd_inverted;  // C2 inverts the result
		}
	};
	
	cnds.ObjWithinRange = function (type){
		if (!type){
			return false;
		}
		//get sol
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		
		var picked = []; //instances to pick when done
		var obj; //this will hold the object during the iteration loop
		
		var cnd_inverted = this.runtime.getCurrentCondition().inverted; //check if condition is inverted
		
		for(var i = 0, len=instances.length; i < len; i++){ //iterate through instances
			obj = instances[i]; //current instance
			
			// 'xor' handles the invert flag
			if (cr.xor(this.withinRange(obj.x,obj.y), cnd_inverted))
			{
				picked.push(obj);
			}
		}
		
		if(picked.length){ //if we have objects picked
			sol.select_all = false;
			sol.instances = picked;
			return !cnd_inverted;  // C2 inverts the result
		}
		else
		{
			return cnd_inverted;  // C2 inverts the result
		}
	};
	
	cnds.ObjCanFire = function (type)
	{
		if (!type){
			return false;
		}
		
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		
		var picked = []; //instances to pick when done
		var obj; //this will hold the object during the iteration loop
		
		var cnd_inverted = this.runtime.getCurrentCondition().inverted; //check if condition is inverted
		
		for(var i = 0, len=instances.length; i < len; i++){ //iterate through instances
			obj = instances[i]; //current instance
			
			// 'xor' handles the invert flag
			if (cr.xor((this.withinRange(obj.x,obj.y) && this.withinAngle(obj.x,obj.y)), cnd_inverted))
			{
				picked.push(obj);
			}
		}
		
		if(picked.length){ //if we have objects picked
			sol.select_all = false;
			sol.instances = picked;
			return !cnd_inverted;  // C2 inverts the result
		}
		else
		{
			return cnd_inverted;  // C2 inverts the result
		}
	};
	
	cnds.ObjPickClosest = function (type)
	{
		if (!type){
			return false;
		}
		
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		
		var picked = []; //instances to pick when done
		var obj; //this will hold the object during the iteration loop
		
		var closest; //closest object
		var currentDistance; //store the distance so we don't have to check twice
		var lowestDistance = 0; //stores the highest distance found
		
		var cnd_inverted = this.runtime.getCurrentCondition().inverted; //check if condition is inverted
		
		for(var i = 0, len=instances.length; i < len; i++){ //iterate through instances
			obj = instances[i]; //current instance
			
			currentDistance = this.withinRange(obj.x,obj.y);
			// 'xor' handles the invert flag
			if (currentDistance && this.withinAngle(obj.x,obj.y))
			{
				if(lowestDistance === 0)
				{
					lowestDistance = currentDistance;
					closest = obj;	
				}
				if(currentDistance < lowestDistance)
				{
					lowestDistance = currentDistance;
					closest = obj;
				}
			}
		}
		picked.push(closest);

		if(closest){ //if we have objects picked
			sol.select_all = false;
			sol.instances = picked;
			
			this.targetX=closest.x;
			this.targetY=closest.y;
			this.hasTarget = true;
			this.targetUID = closest.uid;
			return true;
		}
		else
		{
			return false;
		}
	};
	
	cnds.hasTarget = function ()
	{
		return this.hasTarget;
	};
	
	cnds.ready = function (tolerance)
	{
		return this.linedUp(tolerance);
	};

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;
	
	acts.SetTurnRate = function(tr)
	{
		this.turnRate = cr.to_radians(tr);
	}
	
	acts.PtSetTarget = function(x,y)
	{
		this.targetX = x;
		this.targetY = y;
		this.hasTarget = true;
	}
	acts.ClearTarget = function()
	{
		this.hasTarget = false;
	}

	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	exps.TurnRate = function (ret)
	{
		ret.set_float(this.turnRate);
	};
	
	exps.targetX = function (ret)
	{
		ret.set_float(this.targetX);
	};
	exps.targetY = function (ret)
	{
		ret.set_float(this.targetY);
	};
	
	exps.targetUID = function (ret)
	{
		if(this.hasTarget === true){
			ret.set_float(this.targetUID);
		}
		else{
			return false;
		}
	};
	
}());