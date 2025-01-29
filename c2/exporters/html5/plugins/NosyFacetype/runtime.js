// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.nosyfacetype = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.nosyfacetype.prototype;
		
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
		

		this.inputElem = document.createElement("div");
		this.elem = this.inputElem;

		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		$(this.elem).addClass("Nosyoutput");
		$(this.elem).css(
		{
			"margin":"0px",
			"padding":"0px",
			"line-height":(this.height/2)+"px",
			"text-align":"left"
		});
		
		
		this.head = 
		{
			Face:
			{
				min:1,
				max:1,
				value:this.properties[0],
				color:this.properties[1],
				text:""
			},
			Ears:
			{
				min:1,
				max:9,
				value:this.properties[2],
				color:this.properties[3],
				text:""
			},
			Skin:
			{
				min:1,
				max:5,
				value:this.properties[4],
				color:this.properties[5],
				text:""
			},
			Mask:
			{
				min:1,
				max:9,
				value:this.properties[6],
				color:this.properties[7],
				text:""
			},
			Glassesalt:
			{
				min:1,
				max:5,
				value:this.properties[8],
				color:this.properties[9],
				text:""
			},
			Eyes:
			{
				min:1,
				max:9,
				value:this.properties[10],
				color:this.properties[11],
				text:""
			},
			Mouth:
			{
				min:1,
				max:9,
				value:this.properties[12],
				color:this.properties[13],
				text:""
			},
			Mouthalt:
			{
				min:1,
				max:9,
				value:this.properties[14],
				color:this.properties[15],
				text:""
			},
			Cheeks:
			{
				min:1,
				max:9,
				value:this.properties[16],
				color:this.properties[17],
				text:""
			},
			Eyebrows:
			{
				min:1,
				max:9,
				value:this.properties[18],
				color:this.properties[19],
				text:""
			},
			Glasses:
			{
				min:1,
				max:5,
				value:this.properties[20],
				color:this.properties[21],
				text:""
			},
			Hair:
			{
				min:1,
				max:9,
				value:this.properties[22],
				color:this.properties[23],
				text:""
			},
			Hat:
			{
				min:1,
				max:9,
				value:this.properties[24],
				color:this.properties[25],
				text:""
			},
			Beard:
			{
				min:1,
				max:5,
				value:this.properties[26],
				color:this.properties[27],
				text:""
			},
			Moustache:
			{
				min:1,
				max:5,
				value:this.properties[28],
				color:this.properties[29],
				text:""
			},
			Nose:
			{
				min:1,
				max:9,
				value:this.properties[30],
				color:this.properties[31],
				text:""
			}
		};
		

		var workingOn = this.head.Face ;
		
		
		
		if( workingOn.value == 0 )
			workingOn.text = "FACE"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "FACE"+workingOn.value ;
		
			
			
		workingOn = this.head.Ears;
		if( workingOn.value == 0 )
			workingOn.text = "EARS"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "EARS"+workingOn.value ;


		workingOn = this.head.Skin;
		if( workingOn.value == 0 )
			workingOn.text = "SKIN"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "SKIN"+workingOn.value ;

		workingOn = this.head.Mask;
		if( workingOn.value == 0 )
			workingOn.text = "MASK"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "MASK"+workingOn.value ;

		workingOn = this.head.Glassesalt;
		if( workingOn.value == 0 )
			workingOn.text = "GLASSESALT"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "GLASSESALT"+workingOn.value ;

		workingOn = this.head.Eyes;
		if( workingOn.value == 0 )
			workingOn.text = "EYES"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "EYES"+workingOn.value ;

		workingOn = this.head.Mouth;
		if( workingOn.value == 0 )
			workingOn.text = "MOUTH"+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "MOUTH"+workingOn.value ;

		workingOn = this.head.Mouthalt;
		if( workingOn.value == 0 )
			workingOn.text = "Mouthalt".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Mouthalt".toUpperCase()+workingOn.value ;

		workingOn = this.head.Cheeks;
		if( workingOn.value == 0 )
			workingOn.text = "Cheeks".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Cheeks".toUpperCase()+workingOn.value ;

		workingOn = this.head.Eyebrows;
		if( workingOn.value == 0 )
			workingOn.text = "Eyebrows".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Eyebrows".toUpperCase()+workingOn.value ;

		workingOn = this.head.Glasses;
		if( workingOn.value == 0 )
			workingOn.text = "Glasses".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Glasses".toUpperCase()+workingOn.value ;

		workingOn = this.head.Hair;
		if( workingOn.value == 0 )
			workingOn.text = "Hair".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Hair".toUpperCase()+workingOn.value ;

		workingOn = this.head.Hat;
		if( workingOn.value == 0 )
			workingOn.text = "Hat".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "SKIN".toUpperCase()+workingOn.value ;

		workingOn = this.head.Beard;
		if( workingOn.value == 0 )
			workingOn.text = "Beard".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Beard".toUpperCase()+workingOn.value ;

		workingOn = this.head.Moustache;
		if( workingOn.value == 0 )
			workingOn.text = "Moustache".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Moustache".toUpperCase()+workingOn.value ;

		workingOn = this.head.Nose;
		if( workingOn.value == 0 )
			workingOn.text = "Nose".toUpperCase()+getRandom(workingOn.min , workingOn.max);
		else if(workingOn.value >= workingOn.max+1 )
			workingOn.text = "None";
		else
			workingOn.text = "Nose".toUpperCase()+workingOn.value ;
		
		
		this.refreshHead = function()
		{
			$(this.elem).empty();
			if(this.head.Face.text != "None")
				$(this.elem).append("<span id='nosyFace' style='color:"+this.head.Face.color+";font-size:"+this.height+"px;'>"+this.head.Face.text+"</span>");
			if(this.head.Ears.text != "None")
				$(this.elem).append("<span  id='nosyEars' style='color:"+this.head.Ears.color+";font-size:"+this.height+"px;'>"+this.head.Ears.text+"</span>");
			if(this.head.Skin.text != "None")
				$(this.elem).append("<span  id='nosySkin' style='color:"+this.head.Skin.color+";font-size:"+this.height+"px;'>"+this.head.Skin.text+"</span>");
			if(this.head.Mask.text != "None")
				$(this.elem).append("<span  id='nosyMask' style='color:"+this.head.Mask.color+";font-size:"+this.height+"px;'>"+this.head.Mask.text+"</span>");
			if(this.head.Glassesalt.text != "None")
				$(this.elem).append("<span  id='nosyGlassesalt' style='color:"+this.head.Glassesalt.color+";font-size:"+this.height+"px;'>"+this.head.Glassesalt.text+"</span>");
			if(this.head.Eyes.text != "None")
				$(this.elem).append("<span  id='nosyEyes' style='color:"+this.head.Eyes.color+";font-size:"+this.height+"px;'>"+this.head.Eyes.text+"</span>");
			if(this.head.Mouth.text != "None")
				$(this.elem).append("<span  id='nosyMouth' style='color:"+this.head.Mouth.color+";font-size:"+this.height+"px;'>"+this.head.Mouth.text+"</span>");
			if(this.head.Mouthalt.text != "None")
				$(this.elem).append("<span  id='nosyMouthalt' style='color:"+this.head.Mouthalt.color+";font-size:"+this.height+"px;'>"+this.head.Mouthalt.text+"</span>");
			if(this.head.Cheeks.text != "None")
				$(this.elem).append("<span  id='nosyCheeks' style='color:"+this.head.Cheeks.color+";font-size:"+this.height+"px;'>"+this.head.Cheeks.text+"</span>");
			if(this.head.Eyebrows.text != "None")
				$(this.elem).append("<span  id='nosyEyebrows' style='color:"+this.head.Eyebrows.color+";font-size:"+this.height+"px;'>"+this.head.Eyebrows.text+"</span>");
			if(this.head.Glasses.text != "None")
				$(this.elem).append("<span  id='nosyGlasses' style='color:"+this.head.Glasses.color+";font-size:"+this.height+"px;'>"+this.head.Glasses.text+"</span>");
			if(this.head.Hair.text != "None")
				$(this.elem).append("<span  id='nosyHair' style='color:"+this.head.Hair.color+";font-size:"+this.height+"px;'>"+this.head.Hair.text+"</span>");
			if(this.head.Hat.text != "None")
				$(this.elem).append("<span  id='nosyHat' style='color:"+this.head.Hat.color+";font-size:"+this.height+"px;'>"+this.head.Hat.text+"</span>");
			if(this.head.Beard.text != "None")
				$(this.elem).append("<span  id='nosyBeard' style='color:"+this.head.Beard.color+";font-size:"+this.height+"px;'>"+this.head.Beard.text+"</span>");
			if(this.head.Moustache.text != "None")
				$(this.elem).append("<span  id='nosyMoustache' style='color:"+this.head.Moustache.color+";font-size:"+this.height+"px;'>"+this.head.Moustache.text+"</span>");
			if(this.head.Nose.text != "None")
				$(this.elem).append("<span  id='nosyNose' style='color:"+this.head.Nose.color+";font-size:"+this.height+"px;'>"+this.head.Nose.text+"</span>");

		};
		

		this.refreshHead() ;
		
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
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
			
		if (this.isCheckbox)
		{
			o["checked"] = !!this.inputElem.checked;
			o["text"] = this.labelText.nodeValue;
		}
		else
		{
			o["text"] = this.elem.value;
		}
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.inputElem.disabled = o["disabled"];
		
		if (this.isCheckbox)
		{
			this.inputElem.checked = o["checked"];
			this.labelText.nodeValue = o["text"];
		}
		else
		{
			this.elem.value = o["text"];
		}
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
				{"name": "Text", "value": this.isCheckbox ? this.labelText.nodeValue : this.elem.value},
				{"name": "Checked", "value": this.isCheckbox ? this.inputElem.checked : false, "readonly": !this.isCheckbox}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "Text")
		{
			if (this.isCheckbox)
				this.labelText.nodeValue = value;
			else
				this.elem.value = value;
		}
		else if (name === "Checked" && this.isCheckbox)
		{
			this.inputElem.checked = value;
		}
	};
	/**END-PREVIEWONLY**/


	function Cnds() {};
	function Acts() {};
	function Exps() {};
	
	var wa = ["Face","Ears","Skin","Mask","Glassesalt","Eyes","Mouth","Mouthalt","Cheeks","Eyebrows","Glasses","Hair","Hat", "Beard","Moustache","Nose"]
	
	$.each(wa,function(i,str)
	{
		Cnds.prototype["is"+str+"Text"] = function (text)
		{
			if(this.head[str].text.toLowerCase() == text.toLowerCase())
				return true;
			else
				return false;
		};
		Cnds.prototype["is"+str+"Color"] = function (color)
		{
			if(this.head[str].color.toLowerCase() == color.toLowerCase())
				return true;
			else
				return false;
		};
		
		
		Acts.prototype[ "set"+str+"Text"] = function (text)
		{
			if (this.runtime.isDomFree)
				return;
			
			if( $.trim(text.toLowerCase()) == "none")	
				this.head[str].text = "None" ;
			else if( $.trim(text.toLowerCase()) == "random")	
				this.head[str].text = str.toUpperCase()+getRandom(this.head[str].min , this.head[str].max);
			else 
				this.head[str].text = text.toUpperCase();
			
			this.refreshHead();
		};
			
		Acts.prototype[ "set"+str+"Color"] = function (color)
		{
			if (this.runtime.isDomFree)
				return;
			
			if($.trim(color.toLowerCase()) == "random")
				this.head[str].color = getRandomColor() ;
			else
				this.head[str].color = color ;
			this.refreshHead();
		};
		
		Exps.prototype[str+"Text"] = function (ret)
		{
			if (this.runtime.isDomFree)
			{
				ret.set_string("");
				return;
			}
			ret.set_string(this.head[str].text.toUpperCase());

		};
		Exps.prototype[str+"Color"] = function (ret)
		{
			if (this.runtime.isDomFree)
			{
				ret.set_string("");
				return;
			}
			ret.set_string(this.head[str].color.toLowerCase());
		};
				
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	pluginProto.cnds = new Cnds();
	pluginProto.acts = new Acts();
	pluginProto.exps = new Exps();

}());

function getRandom(min , max)
{
	return Math.floor((Math.random() * max) + min); 
}

function getRandomColor() 
{
    return "rgb("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+")";
}