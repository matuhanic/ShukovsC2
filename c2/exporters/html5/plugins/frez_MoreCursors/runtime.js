// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.MoreCursors = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.MoreCursors.prototype;
		
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
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		

	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		var self = this;
		
		// Bind mouse events via jQuery.  Not supported in DC
		if (!this.runtime.isDomFree)
		{

							
			
			
		}
	};
	
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "Cursor",
			"properties": [
				{"name": "Current Cursor", "value": lastSetCursor, "readonly": true},
			]
		});		

	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// Either string or sprite animation frame of last set cursor, to skip redundant settings
	var lastSetCursor = null;
	
	Acts.prototype.SetCursor = function (c)
	{
		if (this.runtime.isDomFree)
			return;
		
		var cursor_style = [
							"auto", 
							"pointer", 
							"text", 
							"crosshair", 
							"move", 
							"help", 
							"wait", 
							"none",
							"context-menu",
							"progress",
							"cell",
							"vertical-text",
							"alias",
							"copy",
							"no-drop",
							"not-allowed",
							"all-scroll",
							"col-resize",
							"row-resize",
							"n-resize",
							"e-resize",
							"s-resize",
							"w-resize",
							"ne-resize",
							"nw-resize",
							"se-resize",
							"sw-resize",
							"ew-resize",
							"ns-resize",
							"nesw-resize",
							"nwse-resize",
							"-webkit-zoom-in",
							"-webkit-zoom-out",
							"-webkit-grab",
							"-webkit-grabbing"							
							][c];
		
		if (lastSetCursor === cursor_style)
			return;		// redundant
		
		lastSetCursor = cursor_style;
		document.body.style.cursor = cursor_style;
	};
	
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.CurrentCursor = function (ret)
	{
		ret.set_string(lastSetCursor);
	};
	
	pluginProto.exps = new Exps();
	
}());
