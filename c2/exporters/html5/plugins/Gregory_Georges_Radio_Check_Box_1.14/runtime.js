// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.RadioCheckButton = function(runtime)
{
	this.runtime = runtime;
	
};

(function ()

{
	var pluginProto = cr.plugins_.RadioCheckButton.prototype;
		
	pluginProto.onCreate = function ()
	{
	};
	
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
		this.array = this.properties[1];
		this.separator = this.properties[2];
		//this.font = ;
		this.color = this.properties[5];
		this.inputType = ["radio","radio","checkbox","checkbox"][this.properties[0]];
		
		this.elem = document.createElement("div");
		this.elem.id = "divRadioButton"+this.uid ;
		this.elem.title = this.properties[3];
		this.elem.style.position = "absolute";
		this.elem.style.width = this.width; 
		this.elem.style.height = this.height; 
		this.elem.style.zIndex = this.properties[6];
		
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		
		var arrayRadioButton = new Array(); 
		arrayRadioButton = this.array.split(this.separator);
		var arrayLength = arrayRadioButton.length;
		
		//create line of radiobutton/checkboxbutton (or lines if it's a list type)
		if(this.properties[0] === 1  || this.properties[0] === 3)
		{
			for (var i = 0; i < arrayLength; i++) 
			{
				this.addRadioButton(this.elem.id , "radioID_"+this.uid+"_"+i , arrayRadioButton[i]);
			}
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2)
		{
				this.addRadioButton(this.elem.id, "radioID_"+this.uid, this.array);
		};
		
	//fix the bug with touch plugin
		this.elem.addEventListener('touchstart', function(e) {
				e.stopPropagation();
				}, false);
		
		this.updatePosition();
		this.runtime.tickMe(this);
	};
	
	// FUNCTION addRadioButton
	instanceProto.addRadioButton = function (ElementParent,id,text) 
	{
		
		if (!ElementParent) {
			return false;
			}
		
		ElementParent = document.getElementById(this.elem.id);
		
			if (ElementParent == null) {
			return false;
			}
	
		//*********************************************************//
		
		var newRadioButton = document.createElement("input");
			newRadioButton.type = this.inputType;
			newRadioButton.id = "input_"+id; 
			newRadioButton.name = "radioButton"+this.uid; 
			newRadioButton.disabled = (this.properties[4] === 0);
		
		
		var newLabel = document.createElement("label");	
			newLabel.htmlFor = id; 
			newLabel.id = id;
		var RadioButtonText = text;	
			newLabel.appendChild(document.createTextNode(RadioButtonText));
			newLabel.setAttribute("STYLE","color:"+this.color+";font-family:Arial;");
			
		var retourLigne = document.createElement("br"); 
	
		
		ElementParent.appendChild(newRadioButton);
		ElementParent.appendChild(newLabel);
		ElementParent.appendChild(retourLigne);
		
		return false;
	};
		
	instanceProto.draw = function (ctx)
	{		
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
	
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
    };
	
	instanceProto.updatePosition = function () 
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
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
			
		jQuery(this.elem).show();
		
	
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left); 
		jQuery(this.elem).height(bottom - top); 
	};
	

	//////////////////////////////////////
	//Actions/////////////////////////////
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	//ACTION set_tooltip
	acts.set_tooltip = function set_tooltip(Text)
	{
		this.elem.title = Text.toString(); 		
	};
	
	//ACTION set_text 
	acts.set_text = function set_text(text, id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			var i = "radioID_"+this.uid+"_"+id.valueOf();
			document.getElementById(i).innerHTML = text.toString();
		}
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			var i = "radioID_"+this.uid;
			document.getElementById(i).innerHTML = text.toString();
		};
	};
	
	//ACTION disabledLine 
	acts.disabledLine = function disabledLine(id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			var i = "input_radioID_"+this.uid+"_"+id.valueOf();
			document.getElementById(i).disabled = true;
		}
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			var i = "input_radioID_"+this.uid;
			document.getElementById(i).disabled = true;
		};
	};
	
	//ACTION enabledLine 
	acts.enabledLine = function enabledLine(id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			var i = "input_radioID_"+this.uid+"_"+id.valueOf();
			document.getElementById(i).disabled = false;
		}
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			var i = "input_radioID_"+this.uid;
			document.getElementById(i).disabled = false;
		};
	};
	
	//ACTION enabledInstance 
	acts.enabledInstance = function enabledInstance()
	{		
		if(this.properties[0] === 1 || this.properties[0] === 3)
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
				{
				document.getElementById("input_radioID_"+this.uid+"_"+i).disabled = false;
				};
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2)
		{
			return false;
		};
	};
	
	//ACTION disabledInstance 
	acts.disabledInstance = function disabledInstance()
	{		
		if(this.properties[0] === 1 || this.properties[0] === 3)
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
				{
				document.getElementById("input_radioID_"+this.uid+"_"+i).disabled = true;
				};
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2)
		{
			return false;
		};
	};
	
	//ACTION checkedLine 
	acts.checkedLine = function checkedLine(id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			var i = "input_radioID_"+this.uid+"_"+id.valueOf();
			document.getElementById(i).checked = true;
		}
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			var i = "input_radioID_"+this.uid;
			document.getElementById(i).checked = true;
		};
	};
	
	//ACTION uncheckedLine 
	acts.uncheckedLine = function uncheckedLine(id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			var i = "input_radioID_"+this.uid+"_"+id.valueOf();
			document.getElementById(i).checked = false;
		}
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			var i = "input_radioID_"+this.uid;
			document.getElementById(i).checked = false;
		};
	};
	
	//ACTION checkedInstance 
	acts.checkedInstance = function checkedInstance()
	{
		if(this.properties[0] === 3)
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
			{
				document.getElementById("input_radioID_"+this.uid+"_"+i).checked = true;
			};
		} 
		else if(this.properties[0] < 3 )
		{
			return false;
		};
	};
	
	//ACTION uncheckedInstance 
	acts.uncheckedInstance = function uncheckedInstance()
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) // List type
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
			{
				document.getElementById("input_radioID_"+this.uid+"_"+i).checked = false;
			};
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2) // Single type
		{
			document.getElementById("input_radioID_"+this.uid).checked = false;
		};
	};
	
	//////////////////////////////////////
	//Conditions/////////////////////////
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
			
	//CONDITION isChecked
	cnds.isChecked = function isChecked(ret)
	{
			var ret = false;
		
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
				{
					if(document.getElementsByName("radioButton"+this.uid).item(i).checked)
					{
					ret = true;
					break;
					}
				}
	
			if(ret)
				{
					return true;
				}
			else
				{
					return false;
				}
	};
	
	//CONDITION isEnabled 
	cnds.isEnabled = function isEnabled()
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) //for List type
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
				{
					if(document.getElementsByName("radioButton"+this.uid).item(i).disabled)
					{
					return false;
					break;
					}
					else
					{
					return true;
					break;
					};
				};
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2) //for Single type
		{
			if(document.getElementById("radioID_"+this.uid).disabled)
			{
				return false;
			}
			else
			{
				return true;
			};
		};
	};
	
	
	//////////////////////////////////////
	//Expressions/////////////////////////
	pluginProto.exps = {};
	var exps = pluginProto.exps;
			
	//EXPRESSION getLabel 
	exps.getLabel = function getLabel(ret,id)
	{
		if(this.properties[0] === 1 || this.properties[0] === 3) //List type
		{
			var idToSelect = document.getElementById("radioID_"+this.uid+"_"+id.valueOf());
			var a = idToSelect.innerHTML;
			ret.set_any(a);
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2) //Single type
		{
			var idToSelect = document.getElementById("radioID_"+this.uid);
			var a = idToSelect.innerHTML;
			ret.set_any(a);
		};
		
		
	};
	
	//EXPRESSION getNumberChecked 
	exps.getNumberChecked = function getNumberChecked(ret)
	{
		var a = 0;
		
		if(this.properties[0] === 1 || this.properties[0] === 3) //List type
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
			{
				if (document.getElementById("input_radioID_"+this.uid+"_"+i).checked == true)
				{ a += 1; };
			};
			ret.set_int(a);
		} 
		else if(this.properties[0] === 0 || this.properties[0] === 2) //Single type
		{
			if (document.getElementById("input_radioID_"+this.uid).checked == true)
				{ a = 1 };
			ret.set_int(a);
		};
	
	};
	
	//EXPRESSION getIDChecked 
	exps.getIDChecked = function getIDChecked(ret)
	{
		var a;
		
		if(this.properties[0] === 0) //for Radio Single
		{
			if (document.getElementById("input_radioID_"+this.uid).checked == true)
			{ 
				a = i;
				ret.set_any(a);
			} 
			else
			{
				ret.set_any("");
			};
		} 
		else if(this.properties[0] === 1) // for Radio List
		{
			for (var i = 0 ; i < document.getElementsByName("radioButton"+this.uid).length ; i++)
			{
				if (document.getElementById("input_radioID_"+this.uid+"_"+i).checked == true)
				{ 
					a = i ;
				};
			};
			ret.set_any(a);
		} 
		else if(this.properties[0] > 1)
		{
			ret.set_any("");
		};
	};
	
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}());