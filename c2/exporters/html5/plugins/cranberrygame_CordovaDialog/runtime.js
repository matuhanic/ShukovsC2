﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaDialog = function(runtime)
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
cr.plugins_.cranberrygame_CordovaDialog = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaDialog.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
/*
	//for example
	var fbAppID = "";
	var fbAppSecret = "";
*/
//cranberrygame start
	var curTag = "";
	var title = "";
	var promptInput = "";
//cranberrygame end

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
		if(this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
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
		}
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaDialog.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;	
        if (typeof navigator["notification"] == 'undefined')
            return;
		
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
	Cnds.prototype.OnConfirmYesClicked = function (tag)
	{	
		return cr.equals_nocase(tag, curTag);
	};	
	Cnds.prototype.OnConfirmNoClicked = function (tag)
	{	
		return cr.equals_nocase(tag, curTag);
	};
	Cnds.prototype.OnPromptOkClicked = function (tag)
	{	
		return cr.equals_nocase(tag, curTag);
	};	
	Cnds.prototype.OnPromptCancelClicked = function (tag)
	{	
		return cr.equals_nocase(tag, curTag);
	};
	Cnds.prototype.TitleIs = function (title_)
	{
		return title == title_;
	};	
//cranberrygame end
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

//cranberrygame start
	Acts.prototype.Confirm = function (title_, message, yesButton, noButton, tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;	
        if (typeof navigator["notification"] == 'undefined')
            return;
			
		var self = this;

		if (yesButton == "")
			yesButton = "Yes";
		if (noButton == "")
			noButton = "No";
		
		navigator["notification"]["confirm"](
			message,
			function (buttonIndex){
				if (buttonIndex==1) 
				{
					//alert("a");
					title = title_;
					curTag = tag;
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaDialog.prototype.cnds.OnConfirmYesClicked, self); 
				}
				//else if (buttonIndex==2) {
				else {
					//alert("b");
					title = title_;
					curTag = tag;
					self.runtime.trigger(cr.plugins_.cranberrygame_CordovaDialog.prototype.cnds.OnConfirmNoClicked, self); 
				};             	
			},
			title_,
			//['OK','Cancel']
			//['Yes','No']
			[yesButton,noButton]
		);
	};
	Acts.prototype.Prompt = function (title_, message, tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;	
        if (typeof navigator["notification"] == 'undefined')
            return;
			
		var self = this;
		
		function onPrompt(result) {
			var buttonIndex = result['buttonIndex'];
			var input1 = result['input1'];
			//alert("You selected button number " + buttonIndex + " and entered " + input1);
			//alert(Object.keys(result));//buttonIndex,input1
			//alert(buttonIndex);//undefined//not expected
			//alert(input1);//undefined//not expected
			if (buttonIndex == 1){
				title = title_;
				promptInput = input1;
				curTag = tag;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaDialog.prototype.cnds.OnPromptOkClicked, self);
			}
			//else if (buttonIndex == 2){
			else {
				title = title_;
				curTag = tag;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaDialog.prototype.cnds.OnPromptCancelClicked, self);
			}
		}

		navigator["notification"]["prompt"](
			message,  // message
			onPrompt,                  // callback to invoke
			title_,            // title
			['Ok','Cancel'],             // buttonLabels
			''                 // defaultText
		);
	}
	Acts.prototype.Beep = function (count)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;	
        if (typeof navigator["notification"] == 'undefined')
            return;
			
		navigator["notification"]["beep"](count);
	}
	Acts.prototype.Alert = function (title_, message)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;	
        if (typeof navigator["notification"] == 'undefined')
            return;
			
		function alertDismissed() {
			// do something
		}

		navigator["notification"]["alert"](
			message,  // message
			alertDismissed,         // callback
			title_,            // title
			'OK'                  // buttonName
		);
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
	Exps.prototype.PromptInput = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(promptInput);				// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());