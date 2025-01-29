// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.Grid = function(runtime)
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
cr.plugins_.Grid = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Grid.prototype;
		
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
		var exist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				exist=true;
				break;
			}
		}
		if(!exist){
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
			self.runtime.trigger(cr.plugins_.Grid.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start		
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
		self.runtime.trigger(cr.plugins_.Grid.prototype.cnds.TriggerCondition, self);	
	};	
*/
	
//cranberrygame start
	Acts.prototype.SetCellWidth = function (cellWidth)
	{
		this.properties[0]=cellWidth;
	};
	Acts.prototype.SetCellHeight = function (cellHeight)
	{
		this.properties[1]=cellHeight;
	};
	Acts.prototype.SetCellSize = function (cellWidth,cellHeight)
	{
		this.properties[0]=cellWidth;		
		this.properties[1]=cellHeight;
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
	Exps.prototype.CellWidth = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.properties[0]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.CellHeight = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.properties[1]);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.XIndex2X = function (ret, xIndex)
	{ 
		var cellWidth=this.properties[0];
		
		var cellStartX=0;
		//Hotspot
		//Hotspot: Center
		if (this.properties[3] == 0)
			cellStartX=this.x-this.width/2+(this.properties[0]/2);
		//Hotspot: Top-left
		else
			cellStartX=this.x+(this.properties[0]/2);
		//Cell origin
		//Cell origin: Top-left
		if (this.properties[2] != 0)		
			cellStartX=cellStartX-(this.properties[0]/2);
				    
		var x=Math.round(cellStartX + cellWidth * xIndex);
					
		ret.set_int(x);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.YIndex2Y = function (ret, yIndex)
	{ 
		var cellHeight=this.properties[1];

		var cellStartY=0;
		//Hotspot
		//Hotspot: Center
		if (this.properties[3] == 0)
			cellStartY=this.y-this.height/2+(this.properties[1]/2);
		//Hotspot: Top-left
		else
			cellStartY=this.y+(this.properties[1]/2);
		//Cell origin
		//Cell origin: Top-left
		if (this.properties[2] != 0)		
			cellStartY=cellStartY-(this.properties[1]/2);
										    
		var y=Math.round(cellStartY + cellHeight * yIndex);
					
		ret.set_int(y);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.X2XIndex = function (ret, originalX)
	{ 
		var cellWidth=this.properties[0];

		var cellStartX=0;
		//Hotspot
		//Hotspot: Center
		if (this.properties[3] == 0)
			cellStartX=this.x-this.width/2+(this.properties[0]/2);
		//Hotspot: Top-left
		else
			cellStartX=this.x+(this.properties[0]/2);
		//Cell origin
		//Cell origin: Top-left
		if (this.properties[2] != 0)		
			cellStartX=cellStartX-(this.properties[0]/2);
					
		var cellX=cellStartX + cellWidth * ((originalX-cellStartX)/cellWidth);
						
		var xIndex=Math.round((cellX-cellStartX)/cellWidth);
					
		ret.set_int(xIndex);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.Y2YIndex = function (ret, originalY)
	{ 
		var cellHeight=this.properties[1];

		var cellStartY=0;
		//Hotspot
		//Hotspot: Center
		if (this.properties[3] == 0)
			cellStartY=this.y-this.height/2+(this.properties[1]/2);
		//Hotspot: Top-left
		else
			cellStartY=this.y+(this.properties[1]/2);
		//Cell origin
		//Cell origin: Top-left
		if (this.properties[2] != 0)		
			cellStartY=cellStartY-(this.properties[1]/2);
			
		var cellY=cellStartY + cellHeight * ((originalY-cellStartY)/cellHeight);
				
		var yIndex=Math.round((cellY-cellStartY)/cellHeight);
					
		ret.set_int(yIndex);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.XCount = function (ret)
	{ 
		var cellWidth=this.properties[0];
		
		var xCount=Math.round(this.width/cellWidth);
					
		ret.set_int(xCount);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.YCount = function (ret)
	{ 
		var cellHeight=this.properties[1]; 
		
		var yCount=Math.round(this.height/cellHeight);
					
		ret.set_int(yCount);				// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};			
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());