// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.sirg_bg_stars = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.sirg_bg_stars.prototype;
		
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
		if (this.is_family)
			return;
	};
	/////////////////////////////////////
	// Particle class
	function Star(owner)
	{
		this.owner = owner;
		this.x = parseInt(Math.round(Math.random() * this.owner.width));
		this.y = parseInt(Math.round(Math.random() * this.owner.height));
		this.length = parseInt(1 + Math.random() * this.owner.stars_size);
		this.opacity = Math.random();
		this.factor = 1;
		this.increment = Math.random() * this.owner.stars_speed;//0.03

		cr.seal(this);
	};
	
	Star.prototype.draw = function (ctx)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (curopacity === 0){return;}
		// Save the context
		ctx.save();
		
		// move into the middle of the canvas, just to make room
		ctx.translate(this.x, this.y);
		//ctx.translate(this.owner.x, this.owner.y);
		
		// Change the opacity
		if(this.opacity > 1) {
			this.factor = -1;
		} else if(this.opacity <= 0) {
			this.factor = 1;
			
			//this.x = this.owner.x + Math.round(Math.random() * this.owner.width);
			//this.y = this.owner.y + Math.round(Math.random() * this.owner.height);
			this.x = Math.round(Math.random() * this.owner.width);
			this.y = Math.round(Math.random() * this.owner.height);
		}
			
		this.opacity += this.increment * this.factor;
		
		ctx.beginPath()
		for (var i = 5; i--;) {
			ctx.lineTo(0, this.length);
			ctx.translate(0, this.length);
			ctx.rotate((Math.PI * 2 / 10));
			ctx.lineTo(0, - this.length);
			ctx.translate(0, - this.length);
			ctx.rotate(-(Math.PI * 6 / 10));
		}
		ctx.lineTo(0, this.length);
		ctx.closePath();
		ctx.fillStyle = "rgba(" + this.owner.stars_color[0] + ", " + this.owner.stars_color[1] + ", " + this.owner.stars_color[2] + ", " + this.opacity + ")";
		ctx.shadowBlur = this.owner.stars_blur_size;
		ctx.shadowColor = this.owner.stars_blur_color;
		ctx.fill();
		
		ctx.restore();
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{

		this.stars_count	= this.properties[0]; // Total stars count
		this.stars_size		= this.properties[1]; // Size modifier
		this.stars_speed	= this.properties[2]/1000; // Size modifier
		this.stars_color	= this.parseColor(this.properties[3]); // Stars color
		this.stars_blur_size	= this.properties[4]; // Shadow Blur size
		this.stars_blur_color	= this.properties[5]; // Shadow Blur color
		this.stars_autoStart	= this.properties[6]; // Auto start to play animation
		this.stars_animationEnabled = (this.stars_autoStart == 0) ? true : false;
		this.stars = [];

		for (var i = 0; i < this.stars_count; i++){
			this.makeStar();
		}

		if (this.recycled){
			this.rcTex.set(0, 0, 0, 0);
		}else{
			this.rcTex = new cr.rect(0, 0, 0, 0);
		}
		
		if (this.runtime.glwrap)
		{
		  this.viaCanvas = document.createElement("canvas");
		  this.viaCanvas.width = this.width;
		  this.viaCanvas.height = this.height;
		  this.viaCtx = this.viaCanvas.getContext("2d");
		  this.webGL_texture = this.runtime.glwrap.createEmptyTexture(this.width, this.height, this.runtime.linearSampling)
		}

	};
	
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"scc": this.stars_count,
			"ss": this.stars_size,
			"sp": this.stars_speed,
			"sc": this.stars_color,
			"sbz": this.stars_blur_size,
			"sbc": this.stars_blur_color,
			"sas": this.stars_autoStart,
			"sae": this.stars_animationEnabled,
			"p": []
		};
		
		var i, len, p;
		var arr = o["p"];

		for (i = 0, len = this.stars.length; i < len; i++)
		{
			p = this.stars[i];
			arr.push([p.x, p.y, p.length, p.opacity, p.factor, p.increment]);
		}
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.stars_count = o["scc"];
		this.stars_size = o["ss"];
		this.stars_speed = o["sp"];
		this.stars_color = o["sc"];
		this.stars_blur_size = o["sbz"];
		this.stars_blur_color = o["sbc"];
		this.stars_autoStart = o["sas"];
		this.stars_animationEnabled = o["sae"];
		
		// recycle all particles then load by reallocating them
		cr.clearArray(this.stars);
		
		var i, len, p, d;
		var arr = o["p"];
		
		for (i = 0, len = arr.length; i < len; i++)
		{
			p = this.makeStar();
			d = arr[i];
			p.x = d[0];
			p.y = d[1];
			p.length = d[2];
			p.opacity = d[3];
			p.factor = d[4];
			p.increment = d[5];
		}
	};
	
	instanceProto.onDestroy = function ()
	{
		// recycle all particles
		cr.clearArray(this.stars);
	};
	
	instanceProto.makeStar = function ()
	{
		var p = new Star(this);
		this.stars.push(p);
		return p;
	};

	instanceProto.parseColor = function (input)
	{
		var m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if( m) {
			return [m[1],m[2],m[3]];
		} else {
			return [0,0,0];
		}
	};

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function (ctx)
	{
		if(!this.stars_animationEnabled){
			return;
		}

		ctx.globalAlpha = this.opacity;
		ctx.save();
        
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
        if ((myx !== 0) || (myy !== 0)){
		    ctx.translate(myx, myy);
		}
        
        if (this.angle !== 0){
		    ctx.rotate(this.angle);
		}

		var i, len, p, layer = this.layer;
		
		for (i = 0, len = this.stars.length; i < len; i++)
		{
			p = this.stars[i];
			p.draw(ctx);
		}

		ctx.restore();
		this.runtime.redraw = true;
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{

		if(!this.stars_animationEnabled){
			return;
		}

		// If the context does not yet exist, create it.
		if (!this.viaCtx)
		{
			return;
		}
    
		if(this.opacity == 0){return;}
		this.viaCtx.globalAlpha = this.opacity;
        this.viaCtx.clearRect(0, 0, this.width, this.height);


		var i, len, p, layer = this.layer;
		
		for (i = 0, len = this.stars.length; i < len; i++)
		{
			p = this.stars[i];
			p.draw(this.viaCtx);
		}

		glw.videoToTexture(this.viaCanvas, this.webGL_texture);
    
		var videoWidth = this.width;
		var videoHeight = this.height;
		var videoAspect = videoWidth / videoHeight;
		var dispWidth = this.width;
		var dispHeight = this.height;
		var dispAspect = dispWidth / dispHeight;
		var offx = 0;
		var offy = 0;
		var drawWidth = dispWidth;
		var drawHeight = dispWidth / videoAspect;
			offy = Math.floor((dispHeight - drawHeight) / 2);
			
			if (offy < 0)
				offy = 0;
		
		var left = this.x + offx;
		var top = this.y + offy;
		var right = left + drawWidth;
		var bottom = top + drawHeight;
		
		glw.setTexture(this.webGL_texture);
		glw.quad(left, top, right, top, right, bottom, left, bottom);
		glw.setBlend(this.srcBlend, this.destBlend);

		this.runtime.redraw = true;
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return this.stars_animationEnabled;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.StartStars = function ()
	{
		this.stars_animationEnabled = true;
		this.runtime.redraw = true;
	};

	Acts.prototype.StopStars = function ()
	{
		this.stars_animationEnabled = false;
	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
		
	pluginProto.exps = new Exps();

}());