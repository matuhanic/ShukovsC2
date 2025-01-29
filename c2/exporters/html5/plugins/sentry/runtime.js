// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Sentry = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Sentry.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		this.rayPoints = [];
		this.rawPoints = [];
		this.blockades = [];
		this.blockPoints = [];
		this.numRays = this.properties[2];
		this.AoV = cr.to_radians(this.properties[0]);
		this.rayLength = this.properties[1];
	};
	
	instanceProto.calculateRaws = function()
	{
		for (var i = 0; i < this.rawPoints.length; i++)
			delete this.rawPoints[i];
		this.rawPoints.splice(0, this.rawPoints.length);
		
		if (this.numRays > 1) {
			var angleDif = this.AoV/(this.numRays-1);
			
			for (var i = 0; i < this.numRays; i++) {
				var s = Math.sin( angleDif*i - this.AoV/2 );
				var c = Math.cos( angleDif*i - this.AoV/2 );
				var px = c * this.rayLength; 
				var py = s * this.rayLength;
				this.rawPoints[i] = new cr.vector2(px, py);
				//alert(", sin: "+s+", cos: "+c+", px: "+px+", py: "+py+", AoV: "+this.AoV+", rayLength: "+this.rayLength);
			}
		}
		else {
			var px = this.rayLength; 
			var py = 0;
			this.rawPoints[0] = new cr.vector2(px, py);
		}
		
		this.width = this.rayLength;
		this.height = 2 * this.rayLength * Math.sin(this.AoV/2);
		this.set_bbox_changed();
	};
	
	instanceProto.calculateRays = function()
	{
		for (var i = 0; i < this.rayPoints.length; i++)
			delete this.rayPoints[i];
		this.rayPoints.splice(0, this.rayPoints.length);
		
		var a = this.angle;
		var s = Math.sin( a );
		var c = Math.cos( a );
		
		for(var i = 0; i < this.rawPoints.length; i++) {
			var px = this.rawPoints[i].x * c - this.rawPoints[i].y * s; 
			var py = this.rawPoints[i].x * s + this.rawPoints[i].y * c;
			this.rayPoints[i] = new cr.vector2(px, py);
			this.rayPoints[i].offset(this.x, this.y);
		}
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.SeeObject = function (rtype)
	{
		if (!rtype)
			return false;			
		
		var rsol = rtype.getCurrentSol();
		var rinstances = rsol.getObjects();
		var ret = false;
		
		for (var i = 0; i < rinstances.length; i++) {
			var rinst = rinstances[i];
			
			if (seen.apply(this, [rinst])) {
				ret = true;
				
				console.log("seen!");
				
				rsol.ensure_picked(rinst);
			}
		}
		return ret;
	};
	
	function seen(rinst) {
		if (this.runtime.testOverlap(this, rinst)) {
			//console.log("overlapped!");
			
			rinst.update_bbox();
			var points = [];
			
			points.push(new cr.vector2(rinst.bquad.tlx, rinst.bquad.tly)); //top left
			points.push(new cr.vector2(rinst.bquad.trx, rinst.bquad.try_)); //top right
			points.push(new cr.vector2(rinst.bquad.brx, rinst.bquad.bry)); //bottom right
			points.push(new cr.vector2(rinst.bquad.blx, rinst.bquad.bly)); //bottom left
			var x1 = this.x;
			var y1 = this.y;
			
			for (var k = 0; k < this.rayPoints.length; k++) {
				var intersections = [];
				var x2 = this.rayPoints[k].x;
				var y2 = this.rayPoints[k].y;
				
				//finding intersections between this ray and rinst bounding box
				for (var l = 0; l < points.length; l++) {
					var x3 = points[l].x;
					var y3 = points[l].y;
					var x4 = 0, y4 = 0;
					if (l == points.length - 1) {
						x4 = points[0].x;
						y4 = points[0].y;
					}
					else {
						x4 = points[l+1].x;
						y4 = points[l+1].y;
					}
					
					var ua = (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3);
					ua /= (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
					var ub = (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3);
					ub /= (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
					
					if (ua <= 1 && ua >= 0 && ub <= 1 && ub >= 0) {
						var x = x1 + ua * (x2-x1);
						var y = y1 + ua * (y2-y1);
						intersections.push(new cr.vector2(x, y));
					}
				}
				
				if (intersections.length > 0) {
					var contactPoint = new cr.vector2(intersections[0].x, intersections[0].y);
					if (intersections.length > 1) {
						var dist1 = (intersections[0].x-x1)*(intersections[0].x-x1)+
											(intersections[0].y-y1)*(intersections[0].y-y1);
						var dist2 = (intersections[1].x-x1)*(intersections[1].x-x1)+
											(intersections[1].y-y1)*(intersections[1].y-y1);
						
						if (dist2 < dist1) {
							contactPoint.x = intersections[1].x;
							contactPoint.y = intersections[1].y;
						}
					}
					
					if ( this.blockPoints[k] ) {
						var dist1 = (contactPoint.x-x1)*(contactPoint.x-x1)+(contactPoint.y-y1)*(contactPoint.y-y1);
						var dist2 = (this.blockPoints[k].x-x1)*(this.blockPoints[k].x-x1)+
											(this.blockPoints[k].y-y1)*(this.blockPoints[k].y-y1);
						if (dist2 > dist1)
							return true;
					}
					else return true;
				}
			}
		}
		return false;
	}
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	acts.Initialize = function()
	{
		this.calculateRaws();
		this.calculateRays();
	};

	// the example action
	acts.SetAngle = function (angle)
	{
		if (angle)
			this.AoV = cr.to_radians(angle);
		this.calculateRaws();
		this.calculateRays();
	};
	
	acts.SetLength = function(length)
	{
		if (length)
			this.rayLength = length;
		this.calculateRaws();
		this.calculateRays();
	};
	
	acts.SetNumRays = function(num)
	{
		if (num)
			this.numRays = num;
		this.calculateRaws();
		this.calculateRays();
	};
	
	acts.RecalculateRays = function()
	{
		this.calculateRays();
	};
	
	acts.AddBlockade = function(t)
	{
		var act = this.runtime.getCurrentAction();
		var ltype = act.type;
		
		if (ltype === t) //don't really want sentry to be blocked by each other view now.
			return;
			
		this.blockades.push(t);
	};
	
	acts.SearchBlockade = function()
	{
		if (this.blockades.length <= 0)
			return;
		
		for (var i = 0; i < this.rayPoints.length; i++)
			this.blockPoints[i] = null;
		
		var act = this.runtime.getCurrentAction();
		var ltype = act.type;
		
		for (var i = 0; i < this.blockades.length; i++) {
			var rtype = this.blockades[i];
			var rsol = rtype.getCurrentSol();
			var rinstances = rsol.getObjects();
			
			for (var j = 0; j < rinstances.length; j++) {
				var rinst = rinstances[j];
				
				if (this.runtime.testOverlap(this, rinst)) {
					//console.log("collided!");
					rinst.update_bbox();
					var points = [];
					
					points.push(new cr.vector2(rinst.bquad.tlx, rinst.bquad.tly)); //top left
					points.push(new cr.vector2(rinst.bquad.trx, rinst.bquad.try_)); //top right
					points.push(new cr.vector2(rinst.bquad.brx, rinst.bquad.bry)); //bottom right
					points.push(new cr.vector2(rinst.bquad.blx, rinst.bquad.bly)); //bottom left
					var x1 = this.x;
					var y1 = this.y;
					
					for (var k = 0; k < this.rayPoints.length; k++) {
						var intersections = [];
						var x2 = this.rayPoints[k].x;
						var y2 = this.rayPoints[k].y;
						
						//finding intersections between this ray and rinst bounding box
						for (var l = 0; l < points.length; l++) {
							var x3 = points[l].x;
							var y3 = points[l].y;
							var x4 = 0, y4 = 0;
							if (l == points.length - 1) {
								x4 = points[0].x;
								y4 = points[0].y;
							}
							else {
								x4 = points[l+1].x;
								y4 = points[l+1].y;
							}
							
							var ua = (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3);
							ua /= (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
							var ub = (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3);
							ub /= (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
							
							console.log("ua: "+ua);
							console.log("ub: "+ub);
							
							if (ua <= 1 && ua >= 0 && ub <= 1 && ub >= 0) {
								var x = x1 + ua * (x2-x1);
								var y = y1 + ua * (y2-y1);
								intersections.push(new cr.vector2(x, y));
							}
						}
						
						if (intersections.length > 0) {
							this.blockPoints[k] = new cr.vector2(intersections[0].x, intersections[0].y);
							if (intersections.length > 1) {
								var dist1 = (intersections[0].x-x1)*(intersections[0].x-x1)+
													(intersections[0].y-y1)*(intersections[0].y-y1);
								var dist2 = (intersections[1].x-x1)*(intersections[1].x-x1)+
													(intersections[1].y-y1)*(intersections[1].y-y1);
								
								if (dist2 < dist1) {
									this.blockPoints[k].x = intersections[1].x;
									this.blockPoints[k].y = intersections[1].y;
								}
							}
						}
					}
				}
			}
		}
		
		/**
		var count = 0;
		for (var i = 0; i < this.rayPoints.length; i++) {
			if (this.blockPoints[i] != null) {
				count++;
				console.log("    ray "+i+" x: "+this.blockPoints[i].x+" y: "+this.blockPoints[i].y);
			}
		}
		if (count > 0)
			console.log("total count: "+count);
		*/
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());