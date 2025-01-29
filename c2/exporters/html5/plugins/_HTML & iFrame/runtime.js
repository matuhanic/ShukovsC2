// ECMAScript 5 strict mode
"use strict";
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.HTML_iFrame = function(runtime) {
	this.runtime = runtime;
};

function C2(e) {
	e = e ? e.toString() : "";
	cr.plugins_.HTML_iFrame.prototype.fncs.OnC2(e);
};

/////////////////////////////////////
// Plugin
(function () {
	/////////////////////////////////////
	var pluginProto = cr.plugins_.HTML_iFrame.prototype;
	var html_iframe = [];
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// Called on startup for each object type
	typeProto.onCreate = function() {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type) {
		this.type = type;
		this.runtime = type.runtime;
		/////////////////////////////////////
		this.link = document.createElement("a");
		this.frame = null;
		this.visible = false;
		this.load = 0;
		this.scale = 1.0;
		this.C2 = "";
		this.CSSfilename = "";
		this.url = "";
		/////////////////////////////////////
		html_iframe.push(this);
	};

	var instanceProto = pluginProto.Instance.prototype;

	/////////////////////////////////////
	// Called whenever an instance is created
	instanceProto.onCreate = function() {
		this.elem = document.createElement("div");
		if (this.properties[7]) {
			this.elem.innerHTML = this.properties[9];
			this.frame = this.elem;
		} else {
			this.elem.iframe = document.createElement("iframe");
			this.elem.iframe.style.width = "100%";
			this.elem.iframe.style.height = "100%";
			this.frame = this.elem.iframe;
			/////////////////////////////////////
			if (this.properties[8])
				this.GoToURL(this.properties[8]);
		};

		/////////////////////////////////////
		// Attribute
		this.frame.id = this.properties[0] || this.makeID();
		this.frame.class = this.properties[1];
		this.frame.setAttribute("id", this.frame.id);
		this.frame.setAttribute("class", this.frame.class);

		if (this.properties[3])
			this.frame.setAttribute("title", this.properties[3]);

		// Allow Fullscreen
		this.frame.setAttribute("frameborder", 0);
		this.frame.setAttribute("allowFullScreen", "");
		/////////////////////////////////////

		/////////////////////////////////////
		// Style
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
		this.elem.style.cssText = "-webkit-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416 + "deg);" +
						 		"-moz-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416 + "deg);" +
								"-o-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416 + "deg);" +
								"-ms-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416 + "deg);";

		this.frame.style.background = (this.properties[4]);
		this.frame.style.border = (this.properties[5]);
		this.frame.style.color = (this.properties[10]);

		switch (this.properties[6]) {
			case 0:
				this.frame.setAttribute("scrolling", "no");
				this.frame.style.overflow = "hidden";
				break;
			case 1:
				this.frame.style.overflow = "auto";
				break;
			case 2:
				this.frame.style.overflowX = "auto";
				this.frame.style.overflowY = "hidden";
				break;
			case 3:
				this.frame.style.overflowX = "hidden";
				this.frame.style.overflowY = "auto";
				break;
		};

		/////////////////////////////////////
		// Text selectable
		if(!this.properties[11]) {
			$(this.frame).css("user-select", "none");
			$(this.frame).css("cursor", "default");
		};
		/////////////////////////////////////
		if (this.properties[13])
			this.ImpCSS(this.properties[13].replace(/\s/g, ""));
		/////////////////////////////////////

		/////////////////////////////////////
		// Script
		if (this.properties[14])
			this.ImpJS(this.properties[14].replace(/\s/g, ""));
		/////////////////////////////////////

		/////////////////////////////////////
		$(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		$(this.elem.iframe).appendTo($(this.elem));
		$(this.frame).bind('contextmenu', function(e){ return false; });
		/////////////////////////////////////
		if (!this.properties[2]) {
			jQuery(this.elem).hide();
			this.visible = false;
		};
		/////////////////////////////////////
		this.updatePosition();
		this.runtime.tickMe(this);
	};

	/////////////////////////////////////
	instanceProto.saveToJSON = function () {
		var url = this.properties[7] ? "" : this.elem.iframe.contentWindow.location.href;
		/////////////////////////////////////
		return {
			"id":	this.frame.id,
			"class":this.frame.class,
			"html":	this.elem.innerHTML,
			"css":	this.elem.style.cssText,
			"style":this.frame.style.cssText,
			"url": 	url
		};
	};

	instanceProto.loadFromJSON = function (get) {
		this.frame.id = get["id"];
		this.frame.class = get["class"];
		this.elem.style.cssText = get["css"];
		/////////////////////////////////////
		if (this.properties[7])
			this.elem.innerHTML = get["html"];
		else {
			this.elem.iframe.style.cssText = get["style"];
			this.GoToURL(get["url"]);
		}
	};

	/////////////////////////////////////
	instanceProto.draw = function(ctx) {};
	instanceProto.drawGL = function(glw) {};
	/////////////////////////////////////

	instanceProto.onDestroy = function () {
		html_iframe.splice(html_iframe.indexOf(this), 1);
		jQuery(this.frame).remove();
		this.elem = null;
	};

	instanceProto.tick = function () {
		this.updatePosition();
	};
	/////////////////////////////////////

	/////////////////////////////////////
	instanceProto.updatePosition = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height) {
			jQuery(this.elem).hide();
			return;
		}
		/////////////////////////////////////

		/////////////////////////////////////
		// Truncate to canvas size
		left = left < 1 ? 1 : Math.round(left);
		top = top < 1 ? 1 : Math.round(top);
		right = right >= this.runtime.width ? Math.round(this.runtime.width - 1) : Math.round(right);
		bottom = bottom >= this.runtime.height ? Math.round(this.runtime.height - 1) : Math.round(bottom);
		/////////////////////////////////////

		jQuery(this.elem).show();
		
		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: parseInt(offx), top: parseInt(offy)});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);

		/////////////////////////////////////
		// Rounding position & width to avoid jitter
		this.elem.width = Math.round(this.elem.width);
		this.elem.height = Math.round(this.elem.height);
		this.elem.x = Math.round(this.elem.x);
		this.elem.y = Math.round(this.elem.y);
		/////////////////////////////////////

		/////////////////////////////////////
		// Auto Font Size
		if (this.properties[12] == 1)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
		if (this.properties[12] == 2)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.4) + "em");
		if (this.properties[12] == 3)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.1) + "em");
		if (this.properties[12] == 4)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio)) + "em");
	};

	/////////////////////////////////////
	// Function
	instanceProto.makeID = function() {
	    var id = "", str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    for (var i = 0; i < 10; i++)
	        id += str.charAt(Math.floor(Math.random() * str.length));
	    /////////////////////////////////////
	    return id;
	};

	instanceProto.ImpCSS = function(file_) {
		var obj = file_.replace(/ /gi).split(";");
		for (var i = 0; i < obj.length; i++) {
			var offset = $("link[href='"+obj[i]+"']").offset();
			if (obj[i] != "" && typeof offset === "undefined") {
				this.CSSfilename += (this.CSSfilename.length) ? " "+file_ : file_;
				this.CSSref = document.createElement("link");
				this.CSSref.setAttribute("type", "text/css");
				this.CSSref.setAttribute("rel", "stylesheet");
				this.CSSref.setAttribute("href", obj[i]);
				/////////////////////////////////////
				if (typeof this.CSSref != "undefined")
					document.getElementsByTagName("head")[0].appendChild(this.CSSref);
			};
		};
	};

	instanceProto.ImpJS = function(file_) {
		var obj = file_.replace(/ /gi).split(";");
		for (var i = 0; i < obj.length; i++) {
			var offset = $("script[src='"+obj[i]+"']").offset();
			if (obj[i] != "" && typeof offset === "undefined") {
				this.JSref = document.createElement("script");
				this.JSref.setAttribute("type", "text/javascript");
				this.JSref.setAttribute("async", "async");
				this.JSref.setAttribute("src", obj[i]);
				/////////////////////////////////////
				if (typeof this.JSref != "undefined")
					document.getElementsByTagName("head")[0].appendChild(this.JSref);
			};
		};
	};

	instanceProto.Garbage = function(file_, type_) {
		var rem = document.getElementsByTagName(type_);
		var att = type_ === "script" ? "src" : "href";
		this.CSSfilename = type_ === "script" ? this.CSSfilename : this.CSSfilename.replace(file_, "").replace(/^\s+|\s+$/g, "");
		/////////////////////////////////////
		for (var i = 0; i < rem.length; i++) {
			if (rem[i].getAttribute(att) === file_) {
				rem[i].parentNode.removeChild(rem[i]);
				return;
			};
		};
	};

	instanceProto.GoToURL = function(url_) {
		if (this.properties[7])
			return;
		/////////////////////////////////////
		url_ = url_.indexOf("http") == 0 ? url_ : "http://"+url_;
		var self = this;
		this.url = url_;
		this.load = 1;
		this.elem.iframe.src = this.url;
		this.runtime.trigger(Cnds.prototype.OnGoToURL, this);
		/////////////////////////////////////
		jQuery.ajax({
			context: self,
			dataType: "text",
			type: "GET",
			url: url_,
			success: function() {
				self.frame.onload = (function () {
					return function() {
						self.url = self.frame.contentWindow.location.href;
						self.runtime.trigger(Cnds.prototype.OnLoad, self);
					};
				})(self);
				self.load = 0;
			},
			error: function() {
				self.frame.onload = (function () {
					return function() {
						self.url = self.frame.contentWindow.location.href;
						self.runtime.trigger(Cnds.prototype.OnError, self);
					};
				})(self);
				self.load = 0;
			}
		});
	};

	/////////////////////////////////////
	// Functions
	function Fncs() {};

	Fncs.prototype.OnC2 = function (e) {
		for (var i = 0; i < html_iframe.length; i++) {
			html_iframe[i].C2 = e;
			html_iframe[i].runtime.trigger(Cnds.prototype.OnC2, html_iframe[i]);
		};
	};

	pluginProto.fncs = new Fncs();

	/////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.CompareCSSfilename = function (text) {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return cr.equals_nocase(this.CSSfilename, text);
	};

	Cnds.prototype.CompareCSSstyle = function (text) {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return cr.equals_nocase(this.frame.style.cssText, text);
	};

	//--- Javascript
	Cnds.prototype.OnC2 = function () {
		return true;
	};

	Cnds.prototype.C2value = function (text, case_) {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.C2, text);
		else				// sensitive
			return this.C2 === text;
	};
	
	//--- HTML
	Cnds.prototype.CompareHTML = function (text, case_) {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.frame.innerHTML, text);
		else				// sensitive
			return this.frame.innerHTML === text;
	};

	Cnds.prototype.OnError = function () {
		return true;
	};

	Cnds.prototype.OnLoad = function () {
		return true;
	};

	//--- iFrame
	Cnds.prototype.IsFocused = function () {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return this.frame === document.activeElement;
	};

	Cnds.prototype.IsLoading = function () {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return this.load;
	};

	Cnds.prototype.URL = function (text) {
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return (this.properties[7] ? 0 : (text == this.url));
	};

	Cnds.prototype.OnGoToURL = function () {
		return true;
	};

	pluginProto.cnds = new Cnds();

	/////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetVisible = function (vis) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.visible = (vis !== 0);
	};

	Acts.prototype.SetTooltip = function (text) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.title = text;
	};

	Acts.prototype.ImpCSSfile = function (filename) {
		if (this.runtime.isDomFree || !filename)
			return;
		/////////////////////////////////////
		this.ImpCSS(filename.replace(/\s/g, ""));
	};

	Acts.prototype.RemCSSfile = function (filename) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.Garbage(filename.replace(/\s/g, ""), "link");
	};

	Acts.prototype.SetCSS = function (p, v) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		jQuery(this.frame).css(p, v);
	};

	Acts.prototype.SetScale = function (scale, r) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.elem.style.transform = "scale(" + scale + ")";
		
		if (r) {
			this.width = (this.width * this.scale) / scale;
			this.height = (this.height * this.scale) / scale;
			this.scale = scale;
		};
	};

	Acts.prototype.AddClass = function (class_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		var loop = class_.split(" ");
		for (var i = 0; i < loop.length; i++) {
			if (!this.frame.class.match(loop[i]))
				this.frame.class += (this.frame.class.length) ? " "+loop[i] : loop[i];
		};
		/////////////////////////////////////
		this.frame.setAttribute("class", this.frame.class);
	};

	Acts.prototype.RemClass = function (class_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		var loop = class_.split(" ");
		for (var i = 0; i < loop.length; i++) {
			this.frame.class = this.frame.class.replace(loop[i], "").replace("  ", " ").trim();
		};
		/////////////////////////////////////
		this.frame.setAttribute("class", this.frame.class);
	};
	
	Acts.prototype.TextSelectable = function (selectable_) {
		$(this.frame).css("user-select", selectable_ ? "auto" : "none");
		$(this.frame).css("cursor", selectable_ ? "auto" : "default");
	};

	//--- Javascript
	Acts.prototype.ImpJSfile = function (filename) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.ImpJS(filename.replace(/\s/g, ""));
	};
	/***** Browsers save scripts in memory
	Acts.prototype.RemJSfile = function (filename)
	{
		if (this.runtime.isDomFree || !filename)
			return;

		/////////////////////////////////////
		this.Garbage(filename.replace(/\s/g, ""), "script");
	};
	*****/

	Acts.prototype.ExecJS = function (js_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		try { if (eval) eval(js_); }
		catch(e) {
			if (console && console.error)
				console.error("Error executing Javascript: ", e);
		};
	};

	//--- HTML
	Acts.prototype.SetHTML = function (text) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.innerHTML = text;
	};

	Acts.prototype.AppendHTML = function(param) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.innerHTML += (param);
	};

	Acts.prototype.LoadHTML = function (url_, postdata_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.load = 1;

		if(postdata_.length) {
			jQuery.ajax({
				context: this,
				dataType: "text",
				type: "POST",
				url: url_,
				data: postdata_,
				success: function(data) {
					this.load = 0;
					this.frame.innerHTML = data;
					this.runtime.trigger(Cnds.prototype.OnLoad, this);
				},
				error: function(err) {
					this.load = 0;
					this.frame.innerHTML = err;
					this.runtime.trigger(Cnds.prototype.OnError, this);
				}
			});
		} else {
			jQuery.ajax({
				context: this,
				dataType: "text",
				type: "GET",
				url: url_,
				success: function(data) {
					this.load = 0;
					this.frame.innerHTML = data;
					this.runtime.trigger(Cnds.prototype.OnLoad, this);
				},
				error: function(err) {
					this.load = 0;
					this.frame.innerHTML = err;
					this.runtime.trigger(Cnds.prototype.OnError, this);
				}
			});
		};
	};

	Acts.prototype.ScrollTop = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
        this.frame.scrollTop = 0;
	};

	Acts.prototype.ScrollBottom = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.scrollTop = this.frame.scrollHeight;
	};

	Acts.prototype.ScrollTo = function (to_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		to_ /= 100;
		this.frame.scrollTop = this.frame.scrollHeight;
		this.frame.scrollTop *= to_;
	};

	Acts.prototype.ScrollToPosition = function (to_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.scrollTop = to_;
	};

	Acts.prototype.GetElement = function (elem_, set_, add_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		function NewValue(e) {
			if (!set_.length && add_.length)
				e.innerHTML += add_;
			else
				e.innerHTML = set_;
		};
		/////////////////////////////////////
		if (new RegExp("#").test(elem_))
			NewValue(document.getElementById(elem_.replace("#", "")));
		else {
			var e = document.getElementsByClassName(elem_.replace(".", ""));
			$(e).each(function(i) {
				NewValue(e[i]);
			});
		};
	};

	Acts.prototype.RemoveElement = function (elem_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		$(elem_).remove();
	};

	//--- iFrame
	Acts.prototype.Blur = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.blur();
	};

	Acts.prototype.Focus = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.focus();
	};

	Acts.prototype.GoTo = function (url_) {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.GoToURL(url_);
	};

	Acts.prototype.Backward = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.src = this.frame.contentWindow.history.back();
	};

	Acts.prototype.Forward = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.src = this.frame.contentWindow.history.forward();
	};

	Acts.prototype.Refresh = function () {
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.frame.contentWindow.location.reload();
	};

	pluginProto.acts = new Acts();

	/////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.CSSfilename = function (ret) {
		ret.set_string(this.CSSfilename);
	};

	Exps.prototype.CSS = function (ret) {
		ret.set_string(this.frame.style.cssText);
	};

	//--- Javascript
	Exps.prototype.C2 = function (ret) {
		ret.set_string(this.C2);
	};

	//--- Both
	Exps.prototype.ID = function (ret) {
		ret.set_string(this.frame.id);
	};

	Exps.prototype.Class = function (ret) {
		ret.set_string(this.frame.class);
	};

	//--- HTML
	Exps.prototype.HTML = function (ret) {
		ret.set_string(this.properties[7] ? this.frame.innerHTML : "<html>" + jQuery($(this.frame)).contents().find("*").html() + "</html>");
	};

	Exps.prototype.ScrollPosition = function (ret) {
		ret.set_float(this.frame.scrollTop);
	};

	Exps.prototype.ScrollHeight = function (ret) {
		ret.set_float(this.frame.scrollHeight);
	};

	//--- iFrame
	Exps.prototype.URL = function (ret) {
		ret.set_string(this.url);
	};

	Exps.prototype.Host = function (ret) {
		this.link.href = this.url;
		var host = this.link.hostname.indexOf(".") >= 0 ?
			this.link.hostname.split(".")[0] === "www" ? this.link.hostname.split(".")[1] : this.link.hostname.split(".")[0] :
			this.link.hostname;
		/////////////////////////////////////
		ret.set_string(host);
	};

	Exps.prototype.HostPath = function (ret) {
		this.link.href = this.url;
		var str = this.link.pathname;
		/////////////////////////////////////
		ret.set_string(str.replace(/\//i, ""));
	};

	pluginProto.exps = new Exps();

}());