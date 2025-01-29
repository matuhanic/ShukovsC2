// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.pix_jmatch3 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.pix_jmatch3.prototype;
		
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
		// this.myValue = 0;
		this.cx = this.properties[0];
		this.cy = this.properties[1];
		this.gv = this.properties[2];
		//this.gs;
		
		this.log = {};
		this.adjDir = -1;
		
		if (this.gv == 0){
			this.gs = "right";
		} else if (this.gv == 1){
			this.gs = "down";
		} else if (this.gv == 2){
			this.gs = "left";
		} else {
			this.gs = "up";
		}
		
		this.grid = new jMatch3["Grid"]({
			width: this.cx,
			height: this.cy,
			gravity: this.gs
		});
		
		console.log(this.grid);
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
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
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	

	
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.CoordsInGrid = function (myparam, myparam1)
	{
		// return true if number is positive
		return this.grid["coordsInWorld"]({ x: myparam, y: myparam1 });
		//return myparam >= 0;
	};
	
	instanceProto.doForEachTrigger = function (current_event)
	{
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
	};
	
	Cnds.prototype.ForEachPiece = function()
	{
		var current_event = this.runtime.getCurrentEventStack().current_event;
		
		this.forX = 0;
		this.forY = 0;
		
		for (this.forX = 0; this.forX < this.cx; this.forX++) {
            for (this.forY = 0; this.forY < this.cy; this.forY++) {
                this.doForEachTrigger(current_event);
            }
		}
		// return true if number is positive
		//this.grid["forEachPiece"](this.doForEachTrigger(current_event));
		//return myparam >= 0;
		this.forX = 0;
		this.forY = 0;
		
		return false;
	};
	
	Cnds.prototype.ForEachMatch = function()
	{
		var current_event = this.runtime.getCurrentEventStack().current_event;
		
		this.forX = 0;
		this.forY = 0;
		
		var matches = this.grid["getMatches"]();
		if (matches) {
            for (var i in matches) {
                var match = matches[i];
                this.curMatchLength = match.length;
				this.curMatchType = match[0].object.type;
				
				for (var j in match){
				
					this.forX = match[j].x;
					this.forY = match[j].y;
					//console.log(match[j].x);
				
					this.doForEachTrigger(current_event);
					//callback(match, match[0].object.type);
				}
            }
        }
		
		this.forX = 0;
		this.forY = 0;
		
		return false;
	};
	
	Cnds.prototype.isAdjacent = function(myparam,myparam1,myparam2,myparam3)
	{
		var piece = this.grid["getPiece"]({ x: myparam, y: myparam1 });
		var select = this.grid["getPiece"]({ x: myparam2, y: myparam3 });
		
		//neighbour methods not working?
		var adjLeft = this.grid["getPiece"]({ x: myparam2-1, y: myparam3 });
		var adjRight = this.grid["getPiece"]({ x: myparam2+1, y: myparam3 });
		var adjUp = this.grid["getPiece"]({ x: myparam2, y: myparam3-1 });
		var adjDown = this.grid["getPiece"]({ x: myparam2, y: myparam3+1 });
		
		//console.log(adjLeft);
		//console.log(adjRight);
		//console.log(adjUp);
		//console.log(adjDown);
		//console.log(select);
		
		if (piece["x"] == adjLeft["x"] && piece["y"] == adjLeft["y"]){
					this.adjDir = 2;
					return true;
		} else if (piece["x"] == adjRight["x"] && piece["y"] == adjRight["y"]){
					this.adjDir = 0;
					return true;
		} else if (piece["x"] == adjUp["x"] && piece["y"] == adjUp["y"]){
					this.adjDir = 3;
					return true;
		} else if (piece["x"] == adjDown["x"] && piece["y"] == adjDown["y"]){
					this.adjDir = 1;
					return true;
		} else {
			//this.adjDir = adjLeft.X;
			return false;
		}
	};
	
	Cnds.prototype.MatchAvail = function ()
	{
		// return true if number is positive
		return this.grid["getMatches"]();
		//return myparam >= 0;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.DebugConsole = function ()
	{
		// alert the message
		//alert(myparam);
		this.grid["debug"](this.log);
	};
	
	Acts.prototype.SetPieceType = function (myparam,myparam1,myparam2)
	{
		var piece = this.grid["getPiece"]({ x: myparam, y: myparam1 });
		piece["object"] = { type: myparam2 };
	};
	
	Acts.prototype.ClearPiece = function (myparam,myparam1)
	{
		var piece = this.grid["getPiece"]({ x: myparam, y: myparam1 });
		piece["clear"]();
	};
	
	Acts.prototype.ClearMatches = function ()
	{
		this.grid["clearMatches"]();
	};
	
	Acts.prototype.ApplyGravity = function ()
	{
		var fallingPieces = this.grid["applyGravity"]();
		//this.grid['pieces'] = fallingPieces;
	};
	
	Acts.prototype.SwapPieces = function (myparam, myparam1, myparam2, myparam3)
	{
		var piece1 = this.grid["getPiece"]({ x: myparam, y: myparam1});
		var piece2 = this.grid["getPiece"]({ x: myparam2, y: myparam3});

		this.grid["swapPieces"](piece1, piece2);
	
	};
	
	Acts.prototype.LogSymbol = function (type, symbol)
	{
		this.log[type] = symbol;
	};
	
	Acts.prototype.SetGravity = function (myparam)
	{
		this.gv = myparam;
		
		if (this.gv == 0){
			this.gs = "right";
		} else if (this.gv == 1){
			this.gs = "down";
		} else if (this.gv == 2){
			this.gs = "left";
		} else {
			this.gs = "up";
		}
		
		
		this.grid['gravity'] = this.gs;
		console.log(this.grid);
	};
	
	
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.Width = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.cx);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Height = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.cy);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Gravity = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.gs);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.GravityNumber = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.gv);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Piece = function (ret, x, y)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var piece = this.grid["getPiece"]({ x: x, y: y});
		ret.set_string(piece["object"]['type']);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.CurX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.forX);
	};
	
	Exps.prototype.CurY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.forY);
	};
	
	Exps.prototype.CurPiece = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var piece = this.grid["getPiece"]({ x: this.forX, y: this.forY});
		ret.set_string(piece["object"]['type']);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.CurMatchLength = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.curMatchLength);
	};
	
	Exps.prototype.CurMatchType = function (ret)
	{
		ret.set_string(this.curMatchType);
	};
	
	Exps.prototype.AdjDir = function (ret)
	{
		ret.set_any(this.adjDir);
	};
	
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());