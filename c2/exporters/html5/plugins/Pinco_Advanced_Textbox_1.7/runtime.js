// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.AdvTextBox = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.AdvTextBox.prototype;
		
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
	
	var requestedWebFonts = {};		// already requested web fonts have an entry here
	
	var elemTypes = ["text", "password", "email", "number", "tel", "url"];
	
	// IE9 doesn't recognise the last four form types and crashes, so set them to 'text'.
	if (navigator.userAgent.indexOf("MSIE 9") > -1)
	{
		elemTypes[2] = "text";
		elemTypes[3] = "text";
		elemTypes[4] = "text";
		elemTypes[5] = "text";
	}
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		
		// Not supported in DC
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Textbox plugin not supported on this platform - the object will not be created");
			return;
		}
		
		if (this.properties[7] === 6)	// textarea
		{
			this.elem = document.createElement("textarea");
			jQuery(this.elem).css("resize", "none");
		}
		else
		{
			this.elem = document.createElement("input");
			this.elem.type = elemTypes[this.properties[7]];	
		}
					
		this.elem.id = this.properties[9];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem["autocomplete"] = "off";
		this.elem.value = this.properties[0];
		this.elem["placeholder"] = this.properties[1];
		this.elem.title = this.properties[2];
		this.elem.disabled = (this.properties[4] === 0);
		this.elem["readOnly"] = (this.properties[5] === 1);
		this.elem["spellcheck"] = (this.properties[6] === 1);
		
		this.autoFontSize = (this.properties[8] !== 0);
		this.element_hidden = false;
		
		if (this.properties[11] === 1)
			this.elem.style.backgroundColor ="transparent" ;
		else
			this.elem.style.backgroundColor = this.properties[10];
		
		// "[bold|italic] 12pt Arial"
		
		var arr=this.properties[12].split(" ");
		var i;
		for (i = 0; i < arr.length; i++)
		{
			// Ends with 'pt'
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				var ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));	
				
				this.elem.style.fontSize = ptSize + "pt"
				var j;
				var font = "";
				for (j = i+1; j < arr.length; j++)
				{
					if (font !== "")
						font = font + " " + arr[j];
					else
						font = arr[j];
				}	
				this.elem.style.fontFamily = font;

				if (i > 0)
				{
					if ( arr[0] === "bold" ) 
						this.elem.style.fontWeight = "bold";
					else
						this.elem.style.fontStyle = arr[0]
						
					if ( i > 1 ) 
						this.elem.style.fontStyle = arr[1]
				}
					
				break;
			}
		}
		
		this.elem.style.color = this.properties[13];
		
		this.elem.style.border = ["1","0"][this.properties[14]];
		if (this.properties[14] === 1) 
			jQuery(this.elem).css("outline", "none");
			
		
			
		this.elem.style.paddingTop = this.properties[15] + "px";
		this.elem.style.paddingBottom = this.properties[16] + "px";
		this.elem.style.paddingLeft = this.properties[17] + "px";
		this.elem.style.paddingRight = this.properties[18] + "px";
		
		
		switch (this.properties[19]) {
			case 0: this.elem.style.textAlign = "left"; break;
			case 1: this.elem.style.textAlign = "center"; break;
			case 2: this.elem.style.textAlign = "right"; break;
		}
		
				
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}
			
		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.AdvTextBox.prototype.cnds.OnTextChanged, self);
			};
		})(this);
		
		this.elem["oninput"] = onchangetrigger;
		
		// IE doesn't trigger oninput for 'cut'
		if (navigator.userAgent.indexOf("MSIE") !== -1)
			this.elem["oncut"] = onchangetrigger;
		
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.trigger(cr.plugins_.AdvTextBox.prototype.cnds.OnClicked, self);
			};
		})(this);
		
		this.elem.ondblclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.trigger(cr.plugins_.AdvTextBox.prototype.cnds.OnDoubleClicked, self);
			};
		})(this);

		this.elem.onblur = (function (self) {
			return function() {
				if (!self.runtime.changelayout)
					self.runtime.trigger(cr.plugins_.AdvTextBox.prototype.cnds.OnFocusLost, self);
			};
		})(this);
	
		
		this.elem.onfocus = (function (self) {
			return function() {
				if (self.properties[20] === 1)
				{
					self.elem.select();
				}
				self.runtime.trigger(cr.plugins_.AdvTextBox.prototype.cnds.OnFocusGain, self);
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
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		
		jQuery(this.elem).keyup(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
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
		return {
			"text": this.elem.value,
			"placeholder": this.elem.placeholder,
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"readonly": !!this.elem.readOnly,
			"spellcheck": !!this.elem["spellcheck"]
		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.value = o["text"];
		this.elem.placeholder = o["placeholder"];
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		this.elem.readOnly = o["readonly"];
		this.elem["spellcheck"] = o["spellcheck"];
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
	
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
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
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
		
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
			jQuery(this.elem).css("font-size", ((this.layer.getScale() / this.runtime.devicePixelRatio) - 0.2) + "em");
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
			"title": "Textbox",
			"properties": [
				{"name": "Text", "value": this.elem.value},
				{"name": "Placeholder", "value": this.elem["placeholder"]},
				{"name": "Tooltip", "value": this.elem.title},
				{"name": "Enabled", "value": !this.elem.disabled},
				{"name": "Read-only", "value": !!this.elem["readOnly"]},
				{"name": "Spellcheck", "value": !!this.elem["spellcheck"]}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Text":				this.elem.value = value;			break;
		case "Placeholder":			this.elem["placeholder"] = value;	break;
		case "Tooltip":				this.elem.title = value;			break;
		case "Enabled":				this.elem.disabled = !value;		break;
		case "Read-only":			this.elem["readOnly"] = value;		break;
		case "Spellcheck":			this.elem["spellcheck"] = value;	break;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.CompareText = function (text, case_)
	{
		if (this.runtime.isDomFree)
			return false;
		
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.elem.value, text);
		else
			return this.elem.value === text;
	};
	
	Cnds.prototype.OnTextChanged = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnFocusLost = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnFocusGain = function ()
	{
		return true;
	};
	
	Cnds.prototype.GotFocus = function ()
	{
		return document.activeElement == this.elem;
	};
	
	Cnds.prototype.Validate = function ()
	{
		if (this.elem.type == "text" || this.elem.type == "textarea")
		{
			return true;
		}
		else if (this.elem.type == "email")
		{
			this.elem.value = this.elem.value.trim();
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			
			if (!filter.test(this.elem.value)) 
				return false;
			else
				return true;
		}
		else if (this.elem.type == "url")
		{
			this.elem.value = this.elem.value.trim();
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			return regexp.test(this.elem.value);
		}
		else if (this.elem.type == "number")
		{
			var n = this.elem.value;
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		else if (this.elem.type == "tel")
		{
			this.elem.value = this.elem.value.trim();
			var regexp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
			return regexp.test(this.elem.value);
		}
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.ScrollBottom = function ()
	{
        this.elem.scrollTop = this.elem.scrollHeight; 
	};
	
	Acts.prototype.ScrollTop = function ()
	{
        this.elem.scrollTop = 0; 
	};
	
	Acts.prototype.Selectall = function ()
	{
        this.elem.select(); 
	};
	
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		
		var self = this;
		var refreshFunc = (function () {
							self.text_changed = true;
						});

		
		
		// Otherwise start loading the web font now
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
					
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		
		this.elem.style.fontFamily = "'" + familyname_ + "'";
					
		// Another refresh hack
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
		
		log("Requesting web font '" + cssurl_ + "'... (tick " + this.runtime.tickcount.toString() + ")");
	};
	
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.value = text;
	};
	
	Acts.prototype.AppendText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.value = this.elem.value + text;
	};
	
	Acts.prototype.AppendNewlineText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.value = this.elem.value + "\n" + text;
	};
	
	Acts.prototype.SetPlaceholder = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.placeholder = text;
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
		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.disabled = (en === 0);
	};
	
	Acts.prototype.SetReadOnly = function (ro)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.readOnly = (ro === 0);
	};
	
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.focus();
	};
	
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.blur();
	};
	//Addons
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		
		switch (style_) {
		case 1: this.elem.style.fontWeight = "bold"; break;
		case 2: this.elem.style.fontStyle = "italic, oblique"; break;
		case 3: 
			{
				this.elem.style.fontStyle = "italic, oblique";
				this.elem.style.fontWeight = "bold"; 
				break;
			}
		}
		

		this.elem.style.fontFamily = face_;
	};
	
	Acts.prototype.SetFontSize = function (size_)
	{
		this.elem.style.fontSize = size_ + "pt";
	};
	
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";

		this.elem.style.color  = newcolor;
		this.runtime.redraw = true;
	};
	Acts.prototype.SetBGColor = function (rgb)
	{
		this.elem.style.backgroundColor = rgb;
	};
	Acts.prototype.ToggleBorders = function (value)
	{
		if (value == 0)
		{
			this.elem.style.border = "0";
			jQuery(this.elem).css("outline", "none");
		}
		else
		{
			this.elem.style.border = "1";
			jQuery(this.elem).css("outline", "");
		}
		
	};
	
	//
	
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
			
		jQuery(this.elem).css(p, v);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Text = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string(this.elem.value);
	};
	
	Exps.prototype.TextBefore = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
 
        var caretPos = this.elem.selectionStart; // Firefox, Chrome only
        ret.set_string(this.elem.value.substr(0, caretPos));
	};
	
		Exps.prototype.TextAfter = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
        var caretPos = this.elem.selectionStart; // Firefox, Chrome only
        ret.set_string(this.elem.value.substr(caretPos, this.elem.value.length - caretPos));
	};
	
	pluginProto.exps = new Exps();

}());