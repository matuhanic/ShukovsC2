// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.FlatButton = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.FlatButton.prototype;
		
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
		
		this.inputElem = document.createElement("button");
		this.elem = this.inputElem;
			
		this.labelText = null;
		
		this.inputElem.type = "button";
		this.inputElem.id = this.properties[4];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
			var text =  this.properties[0] ;
			if( this.properties[5]  > 0)
			{
				var theme = "Default";
				var icon = "" ;
				var iconPosition = "left" ;
				
				switch ( this.properties[5] )
				{
					case 0 : theme = "Default";break;
					case 1 : theme = "a";break;
					case 2 : theme = "b";break;
					case 3 : theme = "c";break;
					case 4 : theme = "d";break;
					case 5 : theme = "e";break;
					case 6 : theme = "f";break;
					case 7 : theme = "g";break;
					default : theme = "Default";break;
				}
				
				if(this.properties[6]  > 0)
				{
					switch( this.properties[6])
					{
						case 0 : 	icon = "";break;
						case 1 : 	icon = "action";break;
						case 2 : 	icon = "alert";break;
						case 3 : 	icon = "arrow-d";break;
						case 4 : 	icon = "arrow-d-l";break;
						case 5 : 	icon = "arrow-d-r";break;
						case 6 : 	icon = "arrow-l";break;
						case 7 : 	icon = "arrow-r";break;
						case 8 : 	icon = "arrow-u";break;
						case 9 : 	icon = "arrow-u-l";break;
						case 10 : icon = "arrow-u-r";break;
						case 11 : icon = "audio";break;
						case 12: 	icon = "back";break;
						case 13 : icon = "bars";break;
						case 14 : icon = "bullets";break;
						case 15: 	icon = "calendar";break;
						case 16:	icon = "camera";break;
						case 17 : icon = "carat-d";break;
						case 18 : icon = "carat-l";break;
						case 19 : icon = "carat-r";break;
						case 20 : icon = "carat-u";break;
						case 21 : icon = "check";break;
						case 22 : icon = "clock";break;
						case 23 : icon = "cloud";break;
						case 24 : icon = "comment";break;
						case 25 : icon = "delete";break;
						case 26 : icon = "edit";break;
						case 27 : icon = "eye";break;
						case 28 : icon = "forbidden";break;
						case 29 : icon = "forward";break;
						case 30 : icon = "gear";break;
						case 31 : icon = "grid";break;
						case 32 : icon = "heart";break;
						case 33 : icon = "home";break;
						case 34 : icon = "info";break;
						case 35 : icon = "location";break;
						case 36 : icon = "lock";break;
						case 37 : icon = "mail";break;
						case 38 : icon = "minus";break;
						case 39 : icon = "navigation";break;
						case 40 : icon = "phone";break;
						case 41 : icon = "plus";break;
						case 42 : icon = "power";break;
						case 43 : icon = "recycle";break;
						case 44 : icon = "refresh";break;
						case 45 : icon = "search";break;
						case 46 : icon = "shop";break;
						case 47 : icon = "star";break;
						case 48 : icon = "tag";break;
						case 49 : icon = "user";break;
						case 50 : icon = "video";break;
						default : icon = "";break;
					}
				}
				
				switch ( this.properties[7] )
				{
					case 0 : iconPosition = "left";break;
					case 1 : iconPosition = "right";break;
					case 2 : iconPosition = "top";break;
					case 3 : iconPosition = "bottom";break;
					case 4 : iconPosition = "notext";break;
					default : iconPosition = "left";break;
				}
				var str = 'ui-btn-hidden ui-btn ui-btn-'+theme+' ui-shadow ' ;
				
				if(this.properties[8] > 0)
					str += 'ui-corner-all '; 
				if(this.properties[6] > 0)
				{
					str += 'ui-icon-'+icon+' ui-btn-icon-'+iconPosition ;
				}
				
				
				$(this.elem).addClass(str).attr("data-theme",theme).attr("data-icon",icon).attr("data-disabled","false");
				
				
				$(this.elem).css({
										"padding":"0px",
										"margin":"0px"
				});
				
				if(this.properties[9] == 0)
				{
					$(this.elem).css("text-align","left");
				}
				else if(this.properties[9] == 1)
				{
					$(this.elem).css("text-align","center");
				}
				else if(this.properties[9] == 2)
				{
					$(this.elem).css("text-align","right");
				}
				
				
				
				if($.trim(this.properties[10]).length > 0)
				{
					$(this.elem).attr("style", $(this.elem).attr("style")+" "+this.properties[10]) ;
					
				}
				
				$(this.elem).text(text);
			}
			else
			{
				$(this.elem).text(text);
				$(this.elem).attr("data-role","none");
			}
	
		
		
		
		this.elem.title = this.properties[1];
		
		
		if(this.properties[3] == 0)
			$(this.elem).addClass('ui-disabled');
		else
			$(this.elem).removeClass('ui-disabled');
		
		this.element_hidden = false;
		
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
		}
		
		this.inputElem.onclick = (function (self) 
		{
			return function(e) {
				e.stopPropagation();
				
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.FlatButton.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		
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
	
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"tooltip": this.elem.title,
			"disabled": !!this.inputElem.disabled
		};
			
		o["text"] = this.elem.value;
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.inputElem.disabled = o["disabled"];
		
		this.elem.value = o["text"];
		
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

	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "Button",
			"properties": [
				{"name": "Text", "value": this.elem.value}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		this.elem.value = value;

	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnClicked = function ()
	{
		if(!$(this.elem).hasClass("ui-disabled"))
			return true;
	};
	Cnds.prototype.IsEnabled = function ()
	{
		return !$(this.elem).hasClass("ui-disabled");
	};
	Cnds.prototype.IsVisible = function ()
	{
		return  $(this.elem).is(":visible") ;
	};
	

	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		$(this.elem).text(text);
	};
	
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.title = text;
	};
	
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;

		if(vis == 1)
			$(this.elem).show();
		else
			$(this.elem).hide();
	};
	
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		
		if(en==0)
			$(this.elem).addClass('ui-disabled');
		else
			$(this.elem).removeClass('ui-disabled');
			
	};
	
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.inputElem.focus();
	};
	
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.inputElem.blur();
	};
	
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
			
		jQuery(this.elem).css(p, v);
	};
	
	Acts.prototype.SetChecked = function (c)
	{
		if (this.runtime.isDomFree || !this.isCheckbox)
			return;
			
		this.inputElem.checked = (c === 1);
	};
	
	Acts.prototype.ToggleChecked = function ()
	{
		if (this.runtime.isDomFree || !this.isCheckbox)
			return;
			
		this.inputElem.checked = !this.inputElem.checked;
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());