// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.hmmg_starsratesystem = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.hmmg_starsratesystem.prototype;
		
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
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Not supported in directCanvas
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Button plugin not supported on this platform - the object will not be created");
			return;
		}
		
		this.isCheckbox = (this.properties[0] === 1);
		
		this.inputElem = document.createElement("div");
		this.elem = this.inputElem;
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		
		//$(this.elem).attr("id","");
		

		
		this.app =
		{
			score 				: this.properties[0],
			starsNumber 		: this.properties[1],
			maxStarsNumber 	: this.properties[2],
			starsHint				: this.properties[3].split(":"),
			
			cancel 				: this.properties[4] == 0 ? false : true,
			cancelAlignement	: this.properties[5] == 0 ? "left" : "right",
			cancelHint			: this.properties[6],
			
			starsOff 				: $.trim(this.properties[7]).length  >0 ? this.properties[7]   : "star-off.png",
			starsOn 				: $.trim(this.properties[8]).length  >0 ? this.properties[8]   : "star-on.png",
			starsHalf				: $.trim(this.properties[9]).length  >0 ? this.properties[9]   : "star-half.png",
			cancelOff			: $.trim(this.properties[10]).length>0 ? this.properties[10] : "cancel-off.png",
			cancelOn 			: $.trim(this.properties[11]).length>0 ? this.properties[11] : "cancel-on.png",
			id 						: this.properties[12],
			halfShow			: this.properties[13] == 0 ? false : true,
			readOnly			: this.properties[14] == 0 ? false : true,
			targetID 				: $.trim(this.properties[15]).length > 0 ? "#"+this.properties[15] : null ,
			targetType			: this.properties[16] == 0 ? "score" : "hint",
			targetKeep			: this.properties[17] == 0 ? false : true,
			showSpace			: this.properties[18] == 0 ? false : true,
			single					: this.properties[19] == 0 ? false : true
		};
		
		$(this.elem).attr("id",this.app.id);
		
		var self = this ;
		
		
		$(self.elem).raty(
		{
			score						:this.app.score,
			number					:this.app.starsNumber,
			numberMax 			:this.app.maxStarsNumber,
			hints						:this.app.starsHint,
			cancel					:this.app.cancel,
			cancelPlace 			:this.app.cancelAlignement,
			cancelHint 				:this.app.cancelHint,
			starOff 					:this.app.starsOff,
			starOn 					:this.app.starsOn,
			starHalf 					:this.app.starsHalf,
			cancelOff 				:this.app.cancelOff,
			cancelOn				:this.app.cancelOn,
			halfShow 				:this.app.halfShow,
			readOnly				:this.app.readOnly,
			target 					:this.app.targetID,
			targetType 				:this.app.targetType,
			targetKeep 				:this.app.targetKeep,
			space					:this.app.showSpace,
			single						:this.app.single,
			click						:function(score)
			{
				self.app.score = score ;
			}
		});
		
		
		
		this.refresh = function()
		{
			$(this.elem).raty('destroy').raty(
			{
				score						:self.app.score,
				number					:self.app.starsNumber,
				numberMax 			:self.app.maxStarsNumber,
				hints						:self.app.starsHint,
				cancel					:self.app.cancel,
				cancelPlace 			:self.app.cancelAlignement,
				cancelHint 				:self.app.cancelHint,
				starOff 					:self.app.starsOff,
				starOn 					:self.app.starsOn,
				starHalf 					:self.app.starsHalf,
				cancelOff 				:self.app.cancelOff,
				cancelOn				:self.app.cancelOn,
				halfShow 				:self.app.halfShow,
				readOnly				:self.app.readOnly,
				target 					:self.app.targetID,
				targetType 				:self.app.targetType,
				targetKeep 				:self.app.targetKeep,
				space					:self.app.showSpace,
				single						:self.app.single,
				click						:function(score)
				{
					self.app.score = score ;
				}
			});
		}

		// Prevent touches reaching the canvas
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		
		// Prevent clicks being blocked
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		
		// Prevent key presses being blocked by the Keyboard object
		jQuery(this.elem).keydown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).keyup(function (e) {
			e.stopPropagation();
		});
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
			
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	var last_canvas_offset = null;
	var last_checked_tick = -1;
	
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			
			this.element_hidden = true;
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};

	Cnds.prototype.isReadOnly = function ()
	{
		return this.app.readOnly ;
	};


	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetScore = function (score)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.app.score = score ;
		this.refresh();
	};
	
	Acts.prototype.SetStarsNumber = function (StarsNumber)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.app.number = StarsNumber ;
		this.refresh();
	};
	
	Acts.prototype.SetReadOnly = function (value)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.app.readOnly = value == 0 ? false : true ;
		this.refresh();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	
	Exps.prototype.GetScore = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.app.score);
	};
	
	
	
	
	
	
	
	
	
	
	
	
	pluginProto.exps = new Exps();

}());