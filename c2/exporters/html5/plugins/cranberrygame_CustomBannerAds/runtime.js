// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CustomBannerAds = function(runtime)
{
	this.runtime = runtime;
	Type
		onCreate
	Instance
		onCreate
		draw
		drawGL		
	cnds
		//MyCondition
		//TriggerCondition
	acts
		//MyAction
		//TriggerAction
	exps
		//MyExpression
};		
//cranberrygame end: structure
*/

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.cranberrygame_CustomBannerAds = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CustomBannerAds.prototype;
		
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
		
/*			
		//cranberrygame
		var newScriptTag=document.createElement('script');
		newScriptTag.setAttribute("type","text/javascript");
		newScriptTag.setAttribute("src", "mylib.js");
		document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		//cranberrygame
		var scripts=document.getElementsByTagName("script");
		var scriptExist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				scriptExist=true;
				break;
			}
		}
		if(!scriptExist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
//cranberrygame end		
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
		// this.myValue = 0;
		
/*
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CustomBannerAds.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		//if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
		//	return;

		this.iframeSrc = this.properties[0];		
		this.iframeStyle = this.properties[1];		
		this.iframeScrolling = this.properties[2];		
		this.initialVisibility = this.properties[3];
		//
		if(this.runtime.isCordova){
			if(this.iframeSrc.indexOf("?")==-1){
				this.iframeSrc += "?platform=cordova";
			}
			else{
				this.iframeSrc += "&platform=cordova";
			}
			
		}
		
		if (this.iframeSrc == "")
			return;		
		
		//this.newDivTag
		//this.hiddenInputTag		 
		//this.visible
	
		//
		this.newDivTag = document.createElement('iframe');			
		var language = window.navigator.userLanguage || window.navigator.language;//IE//firefox/opera/safari
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var w = Math.round(right - left);
		var h = Math.round(bottom - top);
		
		this.newDivTag.setAttribute("src", this.iframeSrc);
		this.newDivTag.setAttribute("id", "ap_iframe");
		this.newDivTag.setAttribute("name", "ap_iframe");
		this.newDivTag.setAttribute("frameborder", "0");
		this.newDivTag.setAttribute("allowtransparency", "true");
		var scrolling = "";
		if(this.iframeScrolling == 0)
			scrolling = "auto";
		if(this.iframeScrolling == 1)
			scrolling = "yes";
		if(this.iframeScrolling == 2)
			scrolling = "no";
		//if(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
		if(this.runtime.isiOS){
			scrolling = "no";
		}
		//this.newDivTag.setAttribute("scrolling", "no");
		this.newDivTag.setAttribute("scrolling", scrolling);
		//this.newDivTag.setAttribute("style","left: "+this.x+"px; top: "+this.y+"px; position: absolute; z-index: 1; width: "+this.width+"px; height: "+this.height+"px; "+this.iframeStyle);
		this.newDivTag.setAttribute("style","left: "+left+"px; top: "+top+"px; position: absolute; z-index: 1; width: "+Math.round(right - left)+"px; height: "+Math.round(bottom - top)+"px; "+this.iframeStyle);
		document.getElementsByTagName("body")[0].appendChild(this.newDivTag);

/*		
		//
		var self = this;
		$(self.newDivTag).load(function () {
					
			try{				
				var itemAd = jQuery(self.newDivTag.contentDocument.getElementsByTagName("div")[0]).find('a');
				//itemAd.on('click', function() { //ok
				itemAd.click(function() { //ok
					var url = itemAd.attr('href');
					console.log("url:" +url);
					//window.open(url, '_blank', 'location=yes');		
					window.open(url, '_blank', 'location=no');		

					return false;
				});						
			}
			catch(e){
				console.log(e.message);	//Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://localhost:50000" from accessing a cross-origin frame.
			}
		});
*/
/*
		var self = this;
		$(self.newDivTag).load(function () {
			
			//if (!this.runtime.isNWjs)
			if (!self.runtime.isNWjs)
				return;
				
			var child_process = require("child_process");				
			var process = window["process"] || nw["process"];
			var path = require("path");
				
			try{
				var itemAd = jQuery(self.newDivTag.contentDocument.getElementsByTagName("div")[0]).find('a');
				itemAd.click(function() { //ok
					var url = itemAd.attr('href');
					console.log("url:" +url);
					//window.open(url, '_blank', 'location=no');
					////////////
					var opener;
					
					switch (process.platform) {
					case "win32":
						opener = 'start ""';
						break;
					case "darwin":
						opener = 'open';
						break;
					default:
						opener = path["join"](__dirname, "../vendor/xdg-open");
						break;
					}
	
					child_process["exec"](opener + ' "' + url.replace(/"/, '\\\"') + '"');					
					//////////
					return false;
				});
			}
			catch(e){			
				console.log(e.message);	//Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://localhost:50000" from accessing a cross-origin frame.
			}
		});
*/
		var self = this;
		$(self.newDivTag).load(function () {
			
			//if (!this.runtime.isNWjs)
			if (!self.runtime.isNWjs)
				return;
				
			var child_process = require("child_process");				
			var process = window["process"] || nw["process"];
			var path = require("path");
				
			try{
				var as = self.newDivTag.contentDocument.getElementsByTagName("div")[0].getElementsByTagName("a");
				for (var i = 0; i < as.length; i++) { 
					
					jQuery(as[i]).click(function() { //ok
											
						var url = $(this).attr('href');
						console.log("url:" +url);
						//window.open(url, '_blank', 'location=no');
						////////////
						var opener;
						
						switch (process.platform) {
						case "win32":
							opener = 'start ""';
							break;
						case "darwin":
							opener = 'open';
							break;
						default:
							opener = path["join"](__dirname, "../vendor/xdg-open");
							break;
						}
		
						child_process["exec"](opener + ' "' + url.replace(/"/, '\\\"') + '"');					
						//////////
						return false;
					});
					
				}


			}
			catch(e){			
				console.log(e.message);	//Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "http://localhost:50000" from accessing a cross-origin frame.
			}
		});
		
		this.updatePosition();		
		this.runtime.tickMe(this);	
		
		var isVisible = this.initialVisibility === 0 ? false : true;
		if (!isVisible) {
			jQuery(this.newDivTag).hide();
			this.visible = false;
		}
//cranberrygame end			
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

/*
	instanceProto.at = function (x)
	{
		return this.arr[x];
	};
	
	instanceProto.set = function (x, val)
	{
		this.arr[x] = val;
	};
*/	
//cranberrygame start
	instanceProto.tick = function () {
		this.updatePosition();
	};
	instanceProto.updatePosition = function () {
	
		if (this.iframeSrc == "")
			return;	
			
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var w = Math.round(right - left);
		var h = Math.round(bottom - top);
				
		// Is entirely offscreen or invisible: hide
		//if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height) {
		//	jQuery(this.newDivTag).hide();
		//	return;
		//}

		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.newDivTag).offset({left: offx, top: offy});		
		jQuery(this.newDivTag).width(Math.round(right - left));
		jQuery(this.newDivTag).height(Math.round(bottom - top));

		if (this.autoFontSize)
			jQuery(this.newDivTag).css("font-size", (this.layer.getScale() - 0.2) + "em");

		jQuery(this.newDivTag).show();				
	};
		
	instanceProto.onDestroy = function () {
		//if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
		//	return;
			
		if (this.iframeSrc == "")
			return;	
			
		if (this.runtime.isDomFree)
			return;
	
		jQuery(this.newDivTag).remove();
		this.newDivTag = null;
		
		jQuery(this.hiddenInputTag).remove();
		this.hiddenInputTag = null;
	};	
//cranberrygame end
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

/*
	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};

	//cranberrygame
	Cnds.prototype.TriggerCondition = function ()
	{
		return true;
	};
*/
	
//cranberrygame start
	Cnds.prototype.IsVisible = function ()
	{
		return this.visible;
	};	
//cranberrygame end
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

/*
	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CustomBannerAds.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.SetVisible = function (vis) {
		//if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
		//	return;
			
		if (this.iframeSrc == "")
			return;	
			
		if (vis) {
			jQuery(this.newDivTag).show();
			this.visible = true;
		}
		else {
			jQuery(this.newDivTag).hide();
			this.visible = false;
		}
	};
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Text = function (ret, param) //cranberrygame
	{     
		ret.set_string("Hello");		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};	
*/
	
//cranberrygame start
	Exps.prototype.Visible = function( ret ) {
		//ret.set_int( ( this.advertisement && this.advertisement['visible'] ) ? 1 : 0 );
		ret.set_int(this.visible ? 1 : 0);
	}
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());