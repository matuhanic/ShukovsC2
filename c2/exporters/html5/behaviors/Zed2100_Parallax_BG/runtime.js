// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.ParallaxBG = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.ParallaxBG.prototype;
		
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
		// setting properties
		this.parallaxX = this.properties[0];
		this.parallaxY = this.properties[1];
		
		this.enabled = (this.properties[2] == 0)?true:false;
		this.onlyWarp = (this.properties[3] == 0)?true:false;
		
		this.resetY();
	};
	
	behinstProto.resetY = function()
	{
		this.initY = this.inst.y;
	};
	
	behinstProto.onDestroy = function ()
	{
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"px": this.parallaxX,
			"py": this.parallaxY,
			"e": this.enabled,
			"iy": this.initY,
			"ow": this.onlyWarp
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.parallaxX = o["px"];
		this.parallaxY = o["py"];
		this.enabled = o["e"];
		this.initY = o["iy"];
		this.onlyWarp = o["ow"];
	};

	behinstProto.tick = function ()
	{
		// we do nothing here, everything is done in tick2 to avoid the one frame lag
	};
	
	behinstProto.tick2 = function()
	{
		// do not do anything if behavior is disabled
		if (this.enabled == false)
		{
			return;
		}
		
		var inst = this.inst;
		var layer = inst.layer;
		var layout = layer.layout;
		
		// viewport
		var viewWidth = Math.abs(layer.viewRight - layer.viewLeft);
		var viewHeight = Math.abs(layer.viewBottom - layer.viewTop);
		
		// layout scroll values
		var scrollX = layout.scrollX;
		var scrollY = layout.scrollY;
		
		// image properties
		var imageWidth = inst.texture_img.width;
		var imageHeight = inst.texture_img.height;
		
		// scroll values from bottom-right
		//var scrollPointX = scrollX - viewWidth * 0.5; // version that is centered at bottom-right corner
		var scrollPointX = scrollX; // the effect looks better when x is centered relative to screen
		var scrollPointY = layout.height - (scrollY + viewHeight * 0.5);
		
		// setting width
		inst.width = Math.ceil(viewWidth/imageWidth + 2) * imageWidth;  
		
		// wrapping horizontally
		var parallaxFactorX = Math.abs(1.0 - this.parallaxX/100.0);
		
		if (this.parallaxX > 100)
		{
			parallaxFactorX = -Math.abs(this.parallaxX/100.0);
		}
		
		var posX = scrollPointX * parallaxFactorX;
		
		
		if (this.onlyWarp == true)
		{
			var posX = inst.x; // when only warping, we ignore the parallax X attribute
		}
				
		while ((posX + imageWidth*0.5) > layer.viewLeft)
		{
			posX -= imageWidth;
		}
		
		while ((posX + inst.width - imageWidth*0.5) < layer.viewRight)
		{
			posX += imageWidth;
		}
		
		inst.x = posX;
		
		// setting Y
		var parallaxFactorY = Math.abs(100.0 - this.parallaxY) / 100.0;
		
		if (this.parallaxY > 100)
		{
			parallaxFactorY = - Math.abs(this.parallaxY/100.0);
		}
		
		inst.y = this.initY - scrollPointY * parallaxFactorY;
		
		// updating bounding box
		inst.set_bbox_changed();
		
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Parallax X", "value": this.parallaxX},
				{"name": "Parallax Y", "value": this.parallaxY},
				{"name": "OnlyWrap", "value": this.onlyWarp},
				{"name": "Enabled", "value": this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		if      (name === "Parallax X") this.parallaxX = value;
		else if (name === "Parallax Y") this.parallaxY = value;
		else if (name === "Enabled") this.enabled = value;
		else if (name === "OnlyWrap") this.onlyWarp = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ResetY = function()
	{
		this.resetY();
	};
	
	Acts.prototype.SetParallaxX = function(v)
	{
		this.parallaxX = v;
	};
	
	Acts.prototype.SetParallaxY = function(v)
	{
		this.parallaxY = v;
	};
	
	Acts.prototype.SetOnlyWrap = function(v)
	{
		this.onlyWarp = (v === 1);
	};
	
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.ParallaxX = function(ret)
	{
		ret.set_int(this.parallaxX);
	};
	
	Exps.prototype.ParallaxY = function(ret)
	{
		ret.set_int(this.parallaxY);
	};
	
	behaviorProto.exps = new Exps();


}());
