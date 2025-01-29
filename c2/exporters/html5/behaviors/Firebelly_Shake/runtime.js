// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.shake = function(runtime)
{
	this.runtime = runtime;
	
	this.shakeMag = 0;
	this.shakeStart = 0;
	this.shakeEnd = 0;
	this.shakeMode = 0;
};

(function ()
{
	var behaviorProto = cr.behaviors.shake.prototype;
	var runShake = false;
	var xOffset = 0;
	var yOffset = 0;
	
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
		xOffset = this.properties[0];
		yOffset  = this.properties[1];
	};

	behinstProto.saveToJSON = function ()
	{
		return {
			"smg": this.behavior.shakeMag,
			"ss": this.behavior.shakeStart,
			"se": this.behavior.shakeEnd,
			"smd": this.behavior.shakeMode
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.behavior.shakeMag = o["smg"];
		this.behavior.shakeStart = o["ss"];
		this.behavior.shakeEnd = o["se"];
		this.behavior.shakeMode = o["smd"];
	};
	
	behinstProto.tick = function ()
	{
		// Do work in tick2 instead, to eliminate one-frame lag if object position changes in events
	};
	
	behinstProto.tick2 = function ()
	{
		if(runShake){
			// Get all instances with this behavior
			var all = this.behavior.my_instances.values();
			var sumx = 0, sumy = 0;
			var i, len;
			
			for (i = 0, len = all.length; i < len; i++)
			{
				sumx += all[i].x;
				sumy += all[i].y;
			}
			
			var layout = this.inst.layer.layout;
			
			// Is in a shake?
			var now = this.runtime.kahanTime.sum;
			var offx = 0, offy = 0;
			
			if (now >= this.behavior.shakeStart && now < this.behavior.shakeEnd)
			{
				var mag = this.behavior.shakeMag * Math.min(this.runtime.timescale, 1);
				
				// Mode 0 - reducing magnitude - lerp to zero
				if (this.behavior.shakeMode === 0)
					mag *= 1 - (now - this.behavior.shakeStart) / (this.behavior.shakeEnd - this.behavior.shakeStart);
					
				var a = Math.random() * Math.PI * 2;
				var d = Math.random() * mag;
				offx = Math.cos(a) * d;
				offy = Math.sin(a) * d;
			}
			
			layout.scrollToX((sumx / all.length + offx)+xOffset);
			layout.scrollToY((sumy / all.length + offy)+yOffset);		
		}

	};
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Shake = function (mag, dur, mode)
	{
		runShake=true;
		this.behavior.shakeMag = mag;
		this.behavior.shakeStart = this.runtime.kahanTime.sum;
		this.behavior.shakeEnd = this.behavior.shakeStart + dur;
		this.behavior.shakeMode = mode;
	};
	
	behaviorProto.acts = new Acts();
	
}());