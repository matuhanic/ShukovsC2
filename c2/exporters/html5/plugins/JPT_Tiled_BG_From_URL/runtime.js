// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.tiledbgFromURL = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.tiledbgFromURL.prototype;
		
	var image_url_Runtime = null;
	var image_url_Inst = null;
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
		// Create the texture
		this.texture_img = new Image();
		this.texture_img.src = this.texture_file;
		this.texture_img.cr_filesize = this.texture_filesize;
		
		// Tell runtime to wait for this to load
		this.runtime.wait_for_textures.push(this.texture_img);
		
		this.pattern = null;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.effectToCompositeOp = function(effect)
	{
		// (none) = source-over
		if (effect <= 0 || effect >= 11)
			return "source-over";
			
		// (none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop
		return ["lighter",
				"xor",
				"copy",
				"destination-over",
				"source-in",
				"destination-in",
				"source-out",
				"destination-out",
				"source-atop",
				"destination-atop"][effect - 1];	// not including "none" so offset by 1
	};

	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.compositeOp = this.effectToCompositeOp(this.properties[1]);
	};

	instanceProto.draw = function(ctx)
	{
		// Create the pattern if the type doesn't have one yet
		if (!this.type.pattern)
			this.type.pattern = ctx.createPattern(this.type.texture_img, "repeat");
			
		ctx.save();
		
		ctx.globalAlpha = this.opacity;
		ctx.globalCompositeOperation = this.compositeOp;
		ctx.fillStyle = this.type.pattern;
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		// Patterns tile from the origin no matter where you draw from.
		// Translate the canvas to align with the draw position, then offset the draw position as well.
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		
		var offX = drawX % this.type.texture_img.width;
		var offY = drawY % this.type.texture_img.height;
		
		ctx.translate(myx + offX, myy + offY);

		if (this.angle !== 0)
			ctx.rotate(this.angle);
		
		// Draw the object; canvas origin is at hot spot.
		ctx.fillRect(-offX - (this.hotspotX * this.width),
					 -offY - (this.hotspotY * this.height),
					 this.width,
					 this.height);
		
		ctx.restore();
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	cnds.OnURLLoaded = function ()
	{
		return true;
	};
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetEffect = function (effect)
	{	
		this.compositeOp = this.effectToCompositeOp(effect);
		this.runtime.redraw = true;
	};
	
	acts.LoadURL = function (myparam)
	{
		this.type.texture_img.src = myparam;
		this.runtime.redraw = true;
		var image_url_runtime = this.runtime;
		var image_url_instance = this;
		$(this.type.texture_img).load(function() {
			//console.log("IMAGE LOADED");
			image_url_runtime.trigger(cr.plugins_.tiledbgFromURL.prototype.cnds.OnURLLoaded, image_url_instance );
		});
		
	};
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

}());