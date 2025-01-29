// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.BHT_Smart_Random = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.BHT_Smart_Random.prototype;
		
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
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		
		this.StartValue = this.properties[0];
		this.EndValue = this.properties[1];
		this.Threshold = this.properties[2];
		
		this.DataWidth = (this.EndValue - this.StartValue)+1;
		
		if(this.Threshold >= this.DataWidth)
		{
			// It isn't possible to have a threshold >= the data-width, so we will just ignore the value.
			console.log("Threshold is illegal. Ignoring it!");
			this.Threshold = 0;
		}
		
		this.DataArray = new Array(this.DataWidth);			// The actual randomized data
		this.TempArray = new Array(this.DataWidth);			// The initial sequential data that we randomly pull from.
		this.ThresholdArray = new Array(this.Threshold);	// A copy of the last data array so we can eliminate "threshold" duplicates.
		
		this.CurrentIndex = 0;
		
		this.Regenerate(true);
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
		var save = {
			"start": this.StartValue,
			"end": this.EndValue,
			"threshold": this.Threshold,
			"currentindex": this.CurrentIndex,
			"data": {}
		};
		
		for(var i=0; i<this.DataArray.length; i++)
		{
			save["data"][i] = this.DataArray[i];
		}
		
		return save;
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
		//console.log("load...");
		
		this.StartValue = o["start"];
		this.EndValue = o["end"];
		this.Threshold = o["threshold"];
		this.CurrentIndex = o["currentindex"];
		
		this.DataWidth = (this.EndValue - this.StartValue)+1;

		this.DataArray = [];
		for(var dt in o["data"])
		{
			this.DataArray[dt] = o["data"][dt];
			//console.log(this.DataArray[dt]);
		}
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
	
	instanceProto.Regenerate=function(firstTime)
	{
		var index = 0;
		
		if(this.Threshold == 0)
		{
			firstTime = true;
		}
		// If this is our first time generating the data, or we don't have a threshold, just generate the full data range.
		if(!firstTime)
		{
			// We need to skip the last "threshold" number of entries.
			for(var i=0;i<this.Threshold;i++)
			{
				this.ThresholdArray[i] = this.DataArray[(this.DataWidth - this.Threshold) + i];
			}
		}
		
		// Start with every number in the range.
		for(var i=0;i<this.DataWidth;i++)
		{
			this.TempArray[i] = i;
		}
		// Now randomly pull them out so that the final sequence is random.
		for(var i=0;i<this.DataWidth;i++)
		{
			index = Math.floor(Math.random() * this.TempArray.length);
			this.DataArray[i] = this.TempArray[index];
			this.TempArray.splice(index,1);
		}
		
		// Test against the previous data and swap duplicates beyond the threshold index.
		if(!firstTime)
		{
			var swapIndex = -1;

			for(var i=0;i<this.ThresholdArray.length;i++)
			{
				for(var j=0; j<this.ThresholdArray.length;j++)
				{
					if(this.DataArray[j] == this.ThresholdArray[i])
					{
						// Now find a non-duplicate value beyond our threshold range.
						var swapIndex = -1;
						for(var k=this.ThresholdArray.length;k<this.DataArray.length && swapIndex == -1;k++)
						{
							var skip = 0;
							for(var l=0; l<this.ThresholdArray.length && swapIndex == -1;l++)
							{
								if(this.DataArray[k] == this.ThresholdArray[l])
								{
									// This K value is in the Threshold array, skip it.
									l = this.ThresholdArray.length;
									skip = 1;
								}
							}
							if(skip==0)
							{
								swapIndex = k;
							}
						}
						if(swapIndex != -1)
						{
							//
							var tempData = this.DataArray[j];
							this.DataArray[j] = this.DataArray[swapIndex];
							this.DataArray[swapIndex] = tempData;
						}
					}
				}
			}
		}
		
		this.CurrentIndex = 0;
		
		/*console.log("regen->");
		for(var i=0;i<this.DataWidth;i++)
		{
			console.log(i + ":" + this.DataArray[i]);
		}*/
	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.Randomize = function ()
	{
		this.Regenerate(true);
	};
	
	Acts.prototype.New = function (start, end, threshold)
	{
		this.StartValue = start;
		this.EndValue = end;
		this.Threshold = threshold;

		this.DataWidth = (this.EndValue - this.StartValue)+1;
		
		if(this.Threshold >= this.DataWidth)
		{
			// It isn't possible to have a threshold >= the data-width, so we will just ignore the value.
			console.log("Threshold is illegal. Ignoring it!");
			this.Threshold = 0;
		}
		
		this.DataArray = new Array(this.DataWidth);			// The actual randomized data
		this.TempArray = new Array(this.DataWidth);			// The initial sequential data that we randomly pull from.
		this.ThresholdArray = new Array(this.Threshold);	// A copy of the last data array so we can eliminate "threshold" duplicates.
		
		this.CurrentIndex = 0;

		this.Regenerate(true);
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Next = function (ret)
	{
		var result = this.DataArray[this.CurrentIndex];
		this.CurrentIndex++;
		ret.set_int(result + this.StartValue);
		
		//console.log("Next="+(result + this.StartValue));
		
		if(this.CurrentIndex >= this.DataWidth)
		{
			this.Regenerate(false);
		}
	};
	
	Exps.prototype.Start = function (ret)
	{
		ret.set_int(this.StartValue);
	}
	Exps.prototype.End = function (ret)
	{
		ret.set_int(this.EndValue);
	}
	Exps.prototype.Threshold = function (ret)
	{
		ret.set_int(this.Threshold);
	}
	Exps.prototype.Peek = function (ret)
	{
		ret.set_int(this.DataArray[this.CurrentIndex] + this.StartValue);
	}
	
	pluginProto.exps = new Exps();

}());