// ECMAScript 5 strict mode
"use strict";
// Dropbox , Grey , Bootstap Theme dont have Sort icons
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Listview = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Listview.prototype;
		
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
		// Not supported in DC
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] List plugin not supported on this platform - the object will not be created");
			return;
		}
		this.last_clicked_cell = 0;
		this.elem = document.createElement("div");
		this.elem.table = document.createElement("table");
		this.elem.id = this.properties[4];
		if($.trim(this.elem.id) <= 0)
		{
			this.elem.id = makeid();
		}
		this.lastSelection = -1 ;

		$(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		if(this.properties[16] == 0)
			$(this.elem).addClass("scrollable-area").append($(this.elem.table)).css("overflow-y","auto").css("padding","0px").css("margin","0px");
		else if(this.properties[16] == 1)
			$(this.elem).addClass("scrollable-area").append($(this.elem.table)).css("overflow-y","scroll").css("padding","0px").css("margin","0px");
		else if(this.properties[16] == 2)
			$(this.elem).addClass("scrollable-area").append($(this.elem.table)).css("overflow-y","hidden").css("padding","0px").css("margin","0px");
		
		
		var self = this;
		var header	= [];
		var ligne 		= [];
		var lenCol		= [];
		var align = "";
		var valign = "";
		var theme = "";
		
		var selectedColor = self.properties[17];
		var selectedTextColor = self.properties[18];
		var hoverColor = self.properties[19];
		var hoverTextColor = self.properties[20];
		
		if($.trim(self.properties[0]).length>0)
		{
			if(self.properties[0][self.properties[0].length-1] == ":")
				self.properties[0]= self.properties[0].slice(0,-1);
			header=self.properties[0].split(":");
		}
		
		if($.trim(self.properties[1]).length>0)
		{
			if(self.properties[1][self.properties[1].length-1] == ";")
				self.properties[1]= self.properties[1].slice(0,-1);
			ligne=self.properties[1].split(";");
		}
		
		if($.trim(self.properties[2]).length>0)
		{
			if(self.properties[2][self.properties[2].length-1] == ":")
				self.properties[2]= self.properties[2].slice(0,-1);
			lenCol=self.properties[2].split(":");
		}
		
		var css_hover = "#"+this.elem.id+" tbody tr:hover{";
		var css_selected = "#"+this.elem.id+" tbody tr.selected{";
		
		if(selectedColor.trim().toLowerCase().length > 0)
			css_selected+="background-color:"+selectedColor+" !important;";
		if(selectedTextColor.trim().toLowerCase().length > 0)
			css_selected+="color:"+selectedTextColor+" !important;";
		
		if(hoverColor.trim().toLowerCase().length > 0)
			css_hover+="background-color:"+hoverColor+" !important;";
		if(hoverTextColor.trim().toLowerCase().length > 0)
			css_hover+="color:"+hoverTextColor+" !important;";
		
		
		css_hover += "}";
		css_selected += "}";
		
		$("head").append(
			
			'<style>'+css_hover+' '+css_selected+'</style>'
			
			);
		console.log("added ",'<style>'+css_hover+' '+css_selected+'</style>');
		
		switch(self.properties[8])
		{
			case 0 : align="left";break;
			case 1 : align="center";break;
			case 2 : align="right";break;
			default : align="center";break;
		}
		switch(self.properties[9])
		{
			case 0 : valign="top";break;
			case 1 : valign="center";break;
			case 2 : valign="bottom";break;
			default : valign="center";break;
		}
		
		
		this.align = align;
		this.valign = valign;
		//$(self.elem.table).addClass("tablesorter");
		
		
		$(self.elem.table).attr({
							"border":self.properties[10],
							"cellpadding":"0px",
							"cellspacing":"0px",
							"width":"100%"
		}).css("color","black");

		if(header.length>0)
		{	
			$(self.elem.table).append("<thead><tr></tr></thead>");
			for(var i=0 ; i<header.length ; i++)
			{
				$(this.elem.table).find("thead tr").append("<th width='"+lenCol[i]+"' colNum='"+i+"' align='"+align+"' valign='"+valign+"' >"+header[i]+"</th>");
			}
		}
		

		$(self.elem.table).append("<tbody></tbody>");
		if(ligne.length>0)
		{
			for(var i=0 ; i<ligne.length ; i++)
			{
				var rowId = "";
				do
				{
					rowId = makeid();
				}while( $("#"+rowId).length);
				var LigneToAdd = $("<tr id-row='"+rowId+"'></tr>");
				var a = ligne[i].split(":");
				for(var j=0 ; j<a.length ; j++)
				{
					if($.trim(self.properties[7]).length >0)
						LigneToAdd.append("<td align='"+align+"' valign='"+valign+"' style='"+self.properties[7]+"'>"+a[j]+"</td>");
					else
						LigneToAdd.append("<td align='"+align+"' valign='"+valign+"'>"+a[j]+"</td>");
				}
				$(self.elem.table).find("tbody").append(LigneToAdd);
			}
		}

		if($.trim(self.properties[5]).length >0)
			$(self.elem.table).find("thead tr").attr("style",self.properties[5]);
		if($.trim(self.properties[6]).length >0)
			$(self.elem.table).find("tbody tr").attr("style",self.properties[6]);
		
		
		
		
		
		if( self.properties[14] == 1)
		{
			if(self.properties[15] > 0)
			{
				switch(self.properties[15])
				{
					case 0 : theme="none";break;
					case 1 : theme="blackice";break;
					case 2 : theme="blue";break;
					case 3 : theme="bootstrap";break;
					case 4 : theme="bootstrap_2";break;
					case 5 : theme="dark";break;
					case 6 : theme="default";break;
					case 7 : theme="dropbox";break;
					case 8 : theme="green";break;
					case 9 : theme="grey";break;
					case 10 : theme="ice";break;
					case 11 : theme="jui";break;
					default : theme="default";break;
				}
				$(self.elem.table).tablesorter(
				{
					theme:theme
				});
			}
			else
			{
				$(self.elem.table).tablesorter().removeClass("tablesorter-default");
			}
		}
		else
		{
			if(self.properties[15] > 0)
			{
				switch(self.properties[15])
				{
					case 0 : theme="none";break;
					case 1 : theme="blackice";break;
					case 2 : theme="blue";break;
					case 3 : theme="bootstrap";break;
					case 4 : theme="bootstrap_2";break;
					case 5 : theme="dark";break;
					case 6 : theme="default";break;
					case 7 : theme="dropbox";break;
					case 8 : theme="green";break;
					case 9 : theme="grey";break;
					case 10 : theme="ice";break;
					case 11 : theme="jui";break;
					default : theme="default";break;
				}
				$(self.elem.table).addClass("tablesorter-"+theme);
			}
		}
		if( self.properties[13] == 1)
			$(self.elem.table).stickyTableHeaders({ scrollableArea: $(".scrollable-area")[0] })
		
		

		var sorterAlign = 2;
		var sorterVisib = "initial";

		switch(self.properties[12])
		{
			case 0 : sorterAlign="left";break;
			case 1 : sorterAlign="center";break;
			case 2 : sorterAlign="right";break;
			default : sorterVisib="right";break;
		}

				
		$(self.elem.table).find("thead tr .header").css(
		{
			"background-position":"center "+sorterAlign
		});	
		if( self.properties[11] == 0)
		{
			$(self.elem.table).find("thead tr .header").css(
			{
				"background-image":"none"
			});
		}
		
		
		
		
		
		
		$(this.elem.table).find("tbody").on('click' , 'tr', function(e) 
		{
			if( parseInt($(this).index()) != self.lastSelection)
			{
				self.lastSelection = parseInt($(this).index());
				$(self.elem.table).find("tbody tr.selected").removeClass("selected");
				$(this).addClass("selected");
				self.runtime.trigger(cr.plugins_.Listview.prototype.cnds.OnSelectionChanged, self);
						
				
			}
			self.runtime.trigger(cr.plugins_.Listview.prototype.cnds.OnClicked, self);
		});
		
		$(this.elem.table).find("tbody").on('mouseover' , 'tr', function() 
		{
			self.runtime.trigger(cr.plugins_.Listview.prototype.cnds.OnHover, self);
		});
		$(this.elem.table).find("tbody").on('mousedown','td',function()
		{
			console.log("clicked td " ,$(this).index());
			self.last_clicked_cell = $(this).index();
		});
		
	
		
		this.elem.ondblclick = function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.Listview.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		
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
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.isVisible = true;
		
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"items": [],
			"sel": []
		};
		
		var i, len;
		var itemsarr = o["items"];
		
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			itemsarr.push(this.elem.options[i].text);
		}
		
		var selarr = o["sel"];
		
		if (this.elem["multiple"])
		{
			for (i = 0, len = this.elem.length; i < len; i++)
			{
				if (this.elem.options[i].selected)
					selarr.push(i);
			}
		}
		else
		{
			selarr.push(this.elem["selectedIndex"]);
		}
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		
		var itemsarr = o["items"];
		
		// Clear the list
		while (this.elem.length)
			this.elem.remove(this.elem.length - 1);
			
		var i, len, opt;
		for (i = 0, len = itemsarr.length; i < len; i++)
		{
			opt = document.createElement("option");
			opt.text = itemsarr[i];
			this.elem.add(opt);
		}
		
		var selarr = o["sel"];
		
		if (this.elem["multiple"])
		{
			for (i = 0, len = selarr.length; i < len; i++)
			{
				if (selarr[i] < this.elem.length)
					this.elem.options[selarr[i]].selected = true;
			}
		}
		else if (selarr.length >= 1)
		{
			this.elem["selectedIndex"] = selarr[0];
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
			if (this.isVisible)
				jQuery(this.elem).hide();
			
			this.isVisible = false;
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
			if (!this.isVisible)
			{
				jQuery(this.elem).show();
				this.isVisible = true;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (!this.isVisible)
		{
			jQuery(this.elem).show();
			this.isVisible = true;
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
			"title": "List",
			"properties": [
				{"name": "Item count", "value": this.elem.length, "readonly": true},
				{"name": "Enabled", "value": !this.elem.disabled},
				{"name": "Tooltip", "value": this.elem.title},
				{"name": "Selected index", "value": this.elem.selectedIndex}
			]
		});
		
		var props = [], i, len;
		for (i = 0, len = this.elem.length; i < len; ++i)
		{
			props.push({"name": i.toString(), "value": this.elem.options[i].text});
		}
		
		propsections.push({
			"title": "Items",
			"properties": props
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		if (header === "List")
		{
			switch (name) {
			case "Enabled":
				this.elem.disabled = !value;
				break;
			case "Tooltip":
				this.elem.title = value;
				break;
			case "Selected index":
				this.elem.selectedIndex = value;
				break;
			}
		}
		else if (header === "Items")
		{
			this.elem.options[parseInt(name, 10)].text = value;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnSelectionChanged = function ()
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
	
	Cnds.prototype.OnHover = function ()
	{
		return true;
	};
	
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SelectedRow = function (i)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.lastSelection = i;
		if($(this.elem.table).find("tbody tr.selected"))
			$(this.elem.table).find("tbody tr.selected").removeClass("selected");
		$(this.elem.table).find("tbody tr").eq(i).addClass("selected");
		
	};
	
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.table.focus();
	};
	
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.table.blur();
	};

	
	Acts.prototype.AddRow = function (text_)
	{
		if (this.runtime.isDomFree)
			return;

		var rowId = "";
		do
		{
			rowId = makeid();
		}while( $("#"+rowId).length);
		
		
		var LigneToAdd = $("<tr id-row='"+rowId+"'></tr>");
		var a = text_.split(":");
		for(var j=0 ; j<a.length ; j++)
		{
			LigneToAdd.append("<td align='"+this.align+"' valign='"+this.valign+"' style='"+this.properties[7]+"'>"+a[j]+"</td>");
		}
		$(this.elem.table).find("tbody").append(LigneToAdd);

		if( this.properties[14] == 1)
		{
			
			$(this.elem.table).trigger('update');     
			$(this.elem.table).trigger("sorton",[$(this.elem.table).get(0).config.sortList]); 
		}
		
		
	};
	
	Acts.prototype.AddRowAt = function (index_, text_)
	{
		if (this.runtime.isDomFree)
			return;

		var rowId = "";
		do
		{
			rowId = makeid();
		}while( $("#"+rowId).length);
		
		
		var LigneToAdd = $("<tr id-row='"+rowId+"'></tr>");
		var a = text_.split(":");
		for(var j=0 ; j<a.length ; j++)
		{
			LigneToAdd.append("<td align='"+this.align+"' valign='"+this.valign+"' style='"+this.properties[7]+"'>"+a[j]+"</td>");
		}
		
		if(index_ > 0)
			LigneToAdd.insertBefore($(this.elem.table).find("tbody tr").eq(index_));
		else
			LigneToAdd.appendTo($(this.elem.table).find("tbody"));
		
		if( this.properties[14] == 1 )
		{
			$(this.elem.table).trigger('update');
			$(this.elem.table).trigger("sorton",[$(this.elem.table).get(0).config.sortList]); 
		}
	};
	
	Acts.prototype.RemoveAt = function (index_)
	{
		if (this.runtime.isDomFree)
			return;
		
		if(index_ == this.lastSelection)
				this.lastSelection = -1 ;

		$(this.elem.table).find("tbody tr").eq(index_).remove();
	};

	Acts.prototype.ChangeRowCssAt = function (index_,css)
	{
		if (this.runtime.isDomFree)
			return;
		
		var item = $(this.elem.table).find("tbody tr").eq(index_);
		if(item.is("[style]"))
			item.attr("style",item.attr("style")+css);
		else
			item.attr("style",css);
	};
	
	Acts.prototype.ChangeCellCssAt = function (index_,index_2,css)
	{
		if (this.runtime.isDomFree)
			return;

		var item = $(this.elem.table).find("tbody tr").eq(index_).find("td").eq(index_2);
		if(item.is("[style]"))
			item.attr("style",item.attr("style")+css);
		else
			item.attr("style",css);
	};
	
	Acts.prototype.StoreValueAt = function (index_,key,val)
	{
		if (this.runtime.isDomFree)
			return;

		$(this.elem.table).find("tbody tr").eq(index_).attr(key,val);
	};
	
	Acts.prototype.sortColumn = function (index_,val)
	{
		if (this.runtime.isDomFree)
			return;
		$("table").trigger("sorton",[ [[index_,val]] ]);
		
	};
	
	Acts.prototype.filterBy = function(text,index_,sensitive)
	{
		if (this.runtime.isDomFree)
			return;
		
		$(this.elem.table).find("tbody tr").each(function()
		{
			if(index_ === -1)
			{
				var should_remove_it = true;
				$(this).find("td").each(function()
				{
					if(sensitive == 0)
					{
						if($(this).text().indexOf(text) !== -1)
							should_remove_it = false;
					}
					else
					{
						if($(this).text().toLowerCase().indexOf(text.toLowerCase()) !== -1)
							should_remove_it = false;
					}
				});
				if(should_remove_it)
					$(this).remove();
			}
			else
			{
				if(sensitive == 0)
				{
					if($(this).eq(index_).text().indexOf(text) === -1)
						$(this).remove();
				}
				else
				{
					if($(this).eq(index_).text().toLowerCase().indexOf(text.toLowerCase()) === -1)
						$(this).remove();
				}
			}
			
		});
	};
	
	
	
	
	Acts.prototype.Clear = function ()
	{
		$(this.elem.table).find("tbody tr").remove();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.RowsCount = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		
		ret.set_int($(this.elem.table).find("tbody tr").length);
	};
	
	Exps.prototype.SelectedRowIndex = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.lastSelection);
	};
	
	Exps.prototype.SubTextSelectedRow = function (ret,SubTextIndex)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string($(this.elem.table).find("tbody tr").eq(this.lastSelection).find("td").eq(SubTextIndex).text());
	};
	
	Exps.prototype.SelectedCellIndex = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.last_clicked_cell);
	};
	
	
	Exps.prototype.SubTextAt = function (ret,LigneIndex , SubTextIndex)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string($(this.elem.table).find("tbody tr").eq(LigneIndex).find("td").eq(SubTextIndex).text() );
	};
	
	
	Exps.prototype.getValueOfKeyAt = function (ret,RowIndex , Key)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string($(this.elem.table).find("tbody tr").eq(RowIndex).attr(Key) );
	};
	pluginProto.exps = new Exps();

}());


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function createCSSSelector(selector, style) 
{
	var cssrules =  $("<style type='text/css'> </style>").appendTo("head");
	cssrules.append(selector+"{ "+style+" }"); 
}