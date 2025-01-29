// ECMAScript 5 strict mode
"use strict";

	if( window === undefined )
	{
		var window = ("undefined" == typeof window) ? 
						("undefined" == typeof global) ? 
							("undefined" == typeof self) ? 
							this
							:self
						:global
					:window;
	}

	var __CONSTRUCT2_RUNTIME2__ = true;
	var __CONSTRUCT3_RUNTIME2__ = false;
	var __CONSTRUCT3_RUNTIME3__ = false;


assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.ValerypopoffLayouterPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.ValerypopoffLayouterPlugin.prototype;
		
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

	instanceProto.onCreate = function()
	{
			
	// Initial visibility ---------------------------

	this.initiallyVisible = this.properties[0];
	
	if( __CONSTRUCT2_RUNTIME2__ || __CONSTRUCT3_RUNTIME2__ )
	{	
		if( !this.initiallyVisible )
		this.visible = false;
	}

	if( __CONSTRUCT3_RUNTIME3__ )
	{
		if( !this.initiallyVisible )
		this.GetWorldInfo().SetVisible(false);
	}


	// Elements ---------------------------

	this.el_count 			= this.properties[1];
	this.el_width 			= this.properties[2];
	this.el_height 			= this.properties[3];


	this.space_width 		= this.properties[4];
	this.space_height		= this.properties[5];

	this.threads_mode 		= this.properties[6];
	this.threads 			= this.properties[7];

	this.fill_mode_width	= this.properties[8];
	this.fill_mode_height	= this.properties[9];
	this.keep_ratio 		= this.properties[10];
	this.float_horiz 		= this.properties[11];
	this.float_vert 		= this.properties[12];
	this.flow 				= this.properties[13];
	this.main_axis_dir		= this.properties[14];
	this.cross_axis_dir 	= this.properties[15];


	updateElements(this);



	//console.log("INIT BASE: " + JSON.stringify(base))
	//console.log("INIT props: " + JSON.stringify(props))
	//console.log("INIT this.Elements: " + JSON.stringify(this.Elements))

	};
	
	instanceProto.saveToJSON = function ()
	{
			return {}
	};

	instanceProto.loadFromJSON = function (o)
	{
		
	};

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
			ctx.globalAlpha = this.opacity;

	var rend_type = "canvas";
	var context = ctx;


	var w = this.width;
	var h = this.height;
	
	// Object not rotated: can draw without transformation.
	if (this.angle === 0 && w >= 0 && h >= 0)
	{
		redrawElements(this, rend_type, context, this.opacity);
	}
	else
	{
		this.update_bbox(); 
		
		//var inst_q = this.bquad;
		var inst_width = this.width;
		var inst_height = this.height;
		var inst_alpha = this.angle;
		//var inst_opacity = this.opacity;

		var inst_x0 = 0;
		var inst_y0 = 0;

		var myx = this.x;
		var myy = this.y;

		// Only pixel round the x/y position, otherwise objects don't rotate smoothly
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		// Angle applied; we need to transform the canvas.  Save state.
		ctx.save();
		
		var widthfactor = w > 0 ? 1 : -1;
		var heightfactor = h > 0 ? 1 : -1;
		
		// Translate to object's position, then rotate by its angle.
		ctx.translate(myx, myy);
		
		if (widthfactor !== 1 || heightfactor !== 1)
			ctx.scale(widthfactor, heightfactor);
		
		ctx.rotate(this.angle * widthfactor * heightfactor);
		
		var drawx = 0 - (this.hotspotX * Math.abs(w))
		var drawy = 0 - (this.hotspotY * Math.abs(h));
		
		inst_x0 = drawx;
		inst_y0 = drawy;


		var base = {x: inst_x0, y: inst_y0, width: inst_width, height: inst_height, alpha: inst_alpha }
		redrawElements(this, rend_type, context, this.opacity, base);

		ctx.restore();
	}	
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
			glw.setOpacity(this.opacity); 
	glw.setAlphaBlend();	

	var rend_type = "glwrapper";
	var context = glw;

	/*
	this.update_bbox();
	var inst_q = this.bquad;
	var inst_width = this.width;
	var inst_height = this.height;
	var inst_alpha = this.angle;
	var inst_opacity = this.opacity;
	var base = {x: inst_q.tlx, y: inst_q.tly, width: inst_width, height: inst_height, alpha: inst_alpha }
	*/

	redrawElements(this, rend_type, context, this.opacity);

	/*
	var color = {r:0, g:1, b:0, a:inst_opacity}
	DrawRect(rend_type, context, 0, 0, inst_width, inst_height, color, base );

	color = {r:1, g:0, b:0, a:inst_opacity}
	for( var i=0; i<this.Elements.length; i++ )
	{
		DrawRect(rend_type, context, this.Elements[i].virt_x, this.Elements[i].virt_y, this.Elements[i].width, this.Elements[i].height, color, base );
	} */
	};

	instanceProto.tick = function()
	{
		
	}

		function getXY(x, y, base)
	{
		//console.log("alpha: " + alpha);

		var angle = base.alpha == 0 ? 0 : Math.PI*2-base.alpha;

		if( x<0           ) x = 0;
		if( y<0      	  ) y = 0;
		if( x>base.width  ) x = base.width;
		if( y>base.height ) y = base.height;

		return {
					x: Math.sin(angle)*y + Math.cos(angle)*x + base.x,
					y: Math.cos(angle)*y - Math.sin(angle)*x + base.y
				}
	}

	function DrawRect(draw_type, context, x, y, width, height, color, base )
	{
		// console.log( "DrawRect" );
		// console.log( "x: " + x );
		// console.log( "y: " + y );
		// console.log( "width: " + width );
		// console.log( "height: " + height );
		// console.log( "base: " + JSON.stringify(base) );

		// Ignore angle for canvas because the angle is already applied to a canvas
		if( draw_type == "canvas" )
		base.alpha = 0;

		var TL = getXY( x, y, 				base);
		var TR = getXY( x+width, y, 		base);
		var BR = getXY( x+width, y+height,	base);
		var BL = getXY( x, y+height,		base);


		switch( draw_type )
		{
			case "c2renderer":
			{
				var q = new cr.quad();

				q.tlx = TL.x;
				q.tly = TL.y;
				q.trx = TR.x;
				q.try_= TR.y;
				q.brx = BR.x;
				q.bry = BR.y;
				q.blx = BL.x;
				q.bly = BL.y;

				context.Fill(q, cr.RGB(Math.ceil(color.r*255), Math.ceil(color.g*255), Math.ceil(color.b*255)));
			} break;

			case "canvas":
			{
				//console.log("drawing canvas: ", TL.x, TL.y, Math.abs(TR.x - TL.x), Math.abs(BL.y - TL.y))
				context.fillStyle = "rgba(" + color.r*255 + "," + color.g*255 + "," + color.b*255 + "," + color.a + ")";  
				context.fillRect(TL.x, TL.y, Math.abs(TR.x - TL.x), Math.abs(BL.y - TL.y));
			} break;

			case "glwrapper":
			{
				//console.log("drawing webgl: ", TL.x, TL.y, TR.x, TR.y, BR.x, BR.y, BL.x, BL.y)
				context.setColorFillMode(color.r, color.g, color.b, color.a);
				context.quad(TL.x, TL.y, TR.x, TR.y, BR.x, BR.y, BL.x, BL.y);
			} break;

			case "iRenderer":
			case "renderer":
			{
				context.SetColorRgba(color.r, color.g, color.b, color.a);
				context.Quad2(TL.x, TL.y, TR.x, TR.y, BR.x, BR.y, BL.x, BL.y);

				/*
				var text_context = context.CreateWebGLText();
				text_context.SetFontSize(10);
				text_context.SetColorRgb(1, 1, 1);
				text_context.SetText("works");
				text_context.GetTexture();
				console.log("works2");
				text_context.SetTextureUpdateCallback(function(texture)
				{
					console.log("works");
					context.SetTextureFillMode();
					
					context.SetTexture( texture );

					//this._inst.ApplyBlendMode(iRenderer);
					context.SetTexture(texture);
					context.SetColorRgb(1,1,1);
					context.Quad3(new SDK.Quad(TL.x, TL.y, TR.x, TR.y, BR.x, BR.y, BL.x, BL.y), text_context.GetTexRect());

				}) */

			} break;
		}
	}

	function Arrange(base, prop)
	{
		var elements = [];

		/*
		if( runtime_instance !== undefined )
		{
			runtime_instance.elements = []; 
		}

		var color = {r:0, g:1, b:0, a:inst_opacity}
		DrawRect(rend_type, context, 0, 0, inst_width, inst_height, color, base );
		*/



		if( prop.threads <= 0 )
		prop.threads = 1;

		var WidSpace = prop.space_width;
		var HeiSpace = prop.space_height;

		var ThreadsMode = "";
		if( prop.threads_mode == 0 ) ThreadsMode = "fixed-number";
		if( prop.threads_mode == 1 ) ThreadsMode = "viewport-fit";


		var FillModeWid = "";
		if( prop.fill_mode_width == 0) FillModeWid = "none";
		if( prop.fill_mode_width == 1) FillModeWid = "stretch";
		if( prop.fill_mode_width == 2) FillModeWid = "space";
		//var FillModeWid = prop.fill_mode_width;

		var FillModeHei = "";
		if( prop.fill_mode_height == 0 ) FillModeHei = "none";
		if( prop.fill_mode_height == 1 ) FillModeHei = "stretch";
		if( prop.fill_mode_height == 2 ) FillModeHei = "space";
		//var FillModeHei = prop.fill_mode_height;

		 var KeepObjectRatio = prop.keep_ratio == 0 ? false : true;
		//var KeepObjectRatio = prop.keep_ratio;

		var AdjHoriz = "";
		if( prop.float_horiz == 0 ) AdjHoriz = "left";
		if( prop.float_horiz == 1 ) AdjHoriz = "center";
		if( prop.float_horiz == 2 ) AdjHoriz = "right";
		//var AdjHoriz = prop.float_horiz;

		var AdjVert = "";
		if( prop.float_vert == 0 ) AdjVert = "top";
		if( prop.float_vert == 1 ) AdjVert = "center";
		if( prop.float_vert == 2 ) AdjVert = "bottom";
		//var AdjVert = prop.float_vert;

		var MainAxisDirection = "";
		if( prop.main_axis_dir == 0 ) MainAxisDirection = "straight";
		if( prop.main_axis_dir == 1 ) MainAxisDirection = "reversed";
		//var MainAxisDirection = prop.main_axis_dir;

		var CrossAxisDirection = "";
		if( prop.cross_axis_dir == 0 ) CrossAxisDirection = "straight";
		if( prop.cross_axis_dir == 1 ) CrossAxisDirection = "reversed";
		//var CrossAxisDirection = prop.cross_axis_dir;

		var flow = "";
		if( prop.flow == 0 ) flow = "vertical";
		if( prop.flow == 1 ) flow = "horizontal";
		//var flow = prop.flow;


		// Base size -----------------------

		var BaseWid = 0;
		var BaseHei = 0;
		//var BaseX0 = 0;
		//var BaseY0 = 0;

		//BaseX0 = base.x;
		//BaseY0 = base.y;

		// prop.flow vertical
		if( flow == "vertical" )
		{
			BaseWid = base.width;
			BaseHei = base.height;
		} 

		// prop.flow horizontal
		if( flow == "horizontal" )
		{
			BaseWid = base.height;
			BaseHei = base.width;
		} 


		// Cell size -----------------------

		var CellWid = 0;
		var CellHei = 0;

		if( flow == "vertical" )
		{
			CellWid = prop.el_width;
			CellHei = prop.el_height;
		} 
		
		if( flow == "horizontal" )
		{
			CellWid = prop.el_height;
			CellHei = prop.el_width;
		} 








		//if( flow == "vertical" )
		//if( flow == "horizontal" )

		// Columns and rows -----------------------

		if( ThreadsMode == "viewport-fit" )
		{
			var Columns = 0;

			
			if( FillModeWid == "stretch" || FillModeHei == "stretch" )
			{
				var cols = prop.el_count;
				
				var base_rat = BaseWid / BaseHei;				
				var base_sq = BaseWid * BaseHei;


					var wid = CellWid*cols + WidSpace*(cols-1);
					var hei = CellHei;
					var last_rat = wid / hei;
					var k = ( (BaseWid/wid < BaseHei/hei) || (wid>BaseWid && hei<=BaseHei) ) ? BaseWid / wid : BaseHei / hei;

				//var last_sq = wid*hei*k*k;
				var last_sq = (CellWid+WidSpace)*(CellHei+HeiSpace)*prop.el_count*k*k;



				//console.log( "----------------" );

				for( var i=1; i<prop.el_count; i++ )
				{
					//console.log(i);
					var rws = Math.ceil( prop.el_count / i );
					//console.log("rws " + rws);
					var wid = CellWid*i + WidSpace*(i-1);
					//console.log("wid " + wid);
					var hei = CellHei*rws + HeiSpace*(rws-1);
					//console.log("hei " + hei);
					var curr_rat = wid/hei;
					//console.log("curr_rat " + curr_rat);

					var k = ( (BaseWid/wid < BaseHei/hei) || (wid>BaseWid && hei<=BaseHei) ) ? BaseWid / wid : BaseHei / hei;
					//console.log("k " + k);
					//var curr_sq = wid*hei*k*k;
					var curr_sq = (CellWid+WidSpace)*(CellHei+HeiSpace)*prop.el_count*k*k;

					//console.log( "curr_sq: " + curr_sq );



					if( (curr_sq > last_sq) || (curr_sq==last_sq && i>cols) )
					{
						last_sq = curr_sq;
						cols = i;
					} 
				}

				Columns = cols;
				//console.log( "Columns: " + Columns );

			} else 
			{
				Columns = Math.floor( (BaseWid + WidSpace) / (CellWid + WidSpace) );
				/*
				if( flow == "vertical" )
					Columns = Math.floor( (base.width + WidSpace) / (CellWid + WidSpace) );

				if( flow == "horizontal" )
					Columns = Math.floor( (base.height + WidSpace) / (CellWid + WidSpace) );
				*/

			}

			if( Columns <= 0 )
			Columns = 1;
		}

		if( ThreadsMode == "fixed-number" )
		{
			var Columns = prop.threads;
		}


		//var Columns = prop.threads;
		var Rows = Math.ceil(prop.el_count/Columns)
		if( Rows <= 0 ) Rows = 1;


		// Raw dimensions -----------------------

		var RawSumWid = 0;
		var RawSumHei = 0;

		RawSumWid = Columns*CellWid + (Columns-1)*WidSpace;
		RawSumHei = Rows*CellHei + (Rows-1)*HeiSpace;


		// Calculating the scale -----------------------

		var ScaleOfCellWid = 1;
		var ScaleOfWidSpace = 1;

		var ScaleOfCellHei = 1;
		var ScaleOfHeiSpace = 1;

		
		// sizes 

		if( FillModeWid == "stretch" && FillModeHei == "stretch" && KeepObjectRatio )
		{
			if( BaseWid/RawSumWid < BaseHei/RawSumHei )
			{
				ScaleOfCellWid = BaseWid/RawSumWid;
				ScaleOfWidSpace = ScaleOfCellWid;				

				ScaleOfCellHei = ScaleOfCellWid;
				ScaleOfHeiSpace = ScaleOfWidSpace;
			} else
			{
				ScaleOfCellHei = BaseHei/RawSumHei;
				ScaleOfHeiSpace = ScaleOfCellHei;				

				ScaleOfCellWid = ScaleOfCellHei;
				ScaleOfWidSpace = ScaleOfHeiSpace;
			}
		} else
		{
			if( FillModeWid == "stretch" )
			{
				ScaleOfCellWid = BaseWid/RawSumWid;
				ScaleOfWidSpace = ScaleOfCellWid;
			}

			if( FillModeHei == "stretch" )
			{
				ScaleOfCellHei = BaseHei/RawSumHei;
				ScaleOfHeiSpace = ScaleOfCellHei;
			}			
		}




		if( KeepObjectRatio )
		{
			if( FillModeWid == "stretch" && FillModeHei != "stretch" )
			{
				ScaleOfCellHei = ScaleOfCellWid;
				ScaleOfHeiSpace = ScaleOfWidSpace;

			}

			if( FillModeHei == "stretch" && FillModeWid!= "stretch" )
			{
				ScaleOfCellWid = ScaleOfCellHei;
				ScaleOfWidSpace = ScaleOfHeiSpace;
			}
		}
		

		// spaces

		if( FillModeWid == "space" && Columns > 1 )
		{
			var NewRawSumWid = Columns*CellWid*ScaleOfCellWid + (Columns-1)*WidSpace;

			ScaleOfWidSpace = (BaseWid-NewRawSumWid+(Columns-1)*WidSpace) / ((Columns-1)*WidSpace);
		}

		if( FillModeHei == "space" && Rows > 1 )
		{
			var NewRawSumHei = Rows*CellHei*ScaleOfCellHei + (Rows-1)*HeiSpace;
			ScaleOfHeiSpace = (BaseHei-NewRawSumHei+(Rows-1)*HeiSpace) / ((Rows-1)*HeiSpace);
		}




		/*		if( FillModeWid == "stretch" )
		{
			ScaleOfCellWid = BaseWid/RawSumWid;
			ScaleOfWidSpace = ScaleOfCellWid;
		}

		if( FillModeWid == "space" )
		{
			ScaleOfWidSpace = (BaseWid-RawSumWid+(Columns-1)*WidSpace) / ((Columns-1)*WidSpace);
		}

		if( FillModeHei == "stretch" )
		{
			ScaleOfCellHei = BaseHei/RawSumHei;
			ScaleOfHeiSpace = ScaleOfCellHei;
		}

		if( FillModeHei == "space" )
		{
			ScaleOfHeiSpace = (BaseHei-RawSumHei+(Rows-1)*HeiSpace) / ((Rows-1)*HeiSpace);
		}

		if( KeepObjectRatio )
		{
			if( FillModeWid == "stretch" && FillModeHei == "none" )
			ScaleOfCellHei = ScaleOfCellWid;

			if( FillModeHei == "stretch" && FillModeWid == "none" )
			ScaleOfCellWid = ScaleOfCellHei;
		}
		*/


		// Scaling -----------------------

		var ScaledCellWid = 0;
		var ScaledWidSpace = 0;

		var ScaledCellHei = 0;
		var ScaledHeiSpace = 0;

		ScaledCellWid = CellWid * ScaleOfCellWid;
		ScaledWidSpace = WidSpace * ScaleOfWidSpace;

		ScaledCellHei = CellHei * ScaleOfCellHei;
		ScaledHeiSpace = HeiSpace * ScaleOfHeiSpace;


		var ScaledSumWid = 0;
		var ScaledSumHei = 0;
		var ShiftHoriz = 0;
		var ShiftVert = 0;

		ScaledSumWid = Columns*ScaledCellWid + (Columns-1)*ScaledWidSpace;
		ScaledSumHei = Rows*ScaledCellHei + (Rows-1)*ScaledHeiSpace;

		if( AdjHoriz == "left" )
		ShiftHoriz = 0;

		if( AdjHoriz == "center" )
		ShiftHoriz = (BaseWid - ScaledSumWid)/2;

		if( AdjHoriz == "right" )
		ShiftHoriz = BaseWid - ScaledSumWid;


		if( AdjVert == "top" )
		ShiftVert = 0;

		if( AdjVert == "center" )
		ShiftVert = (BaseHei - ScaledSumHei)/2;

		if( AdjVert == "bottom" )
		ShiftVert = BaseHei - ScaledSumHei;


		for( var i=0; i<prop.el_count; i++ )
		{
			var final_width = 0;
			var final_height = 0;

			var final_scale_width = 0;
			var final_scale_height = 0;
				
			if( flow == "vertical" )
			{
				final_width = prop.el_width*ScaleOfCellWid;
				final_height = prop.el_height*ScaleOfCellHei;

				final_scale_width = ScaleOfCellWid;
				final_scale_height = ScaleOfCellHei;
			} 
			
			if( flow == "horizontal" )
			{
				final_width = prop.el_width*ScaleOfCellHei;
				final_height = prop.el_height*ScaleOfCellWid;

				final_scale_width = ScaleOfCellHei;
				final_scale_height = ScaleOfCellWid;
			} 



			// Virtual coordinates -----------------------

			var VirtX = 0;
			var VirtY = 0;

			VirtX = ( ScaledCellWid + ScaledWidSpace ) * (i-Columns*Math.floor(i/Columns));
			VirtY = ( ScaledCellHei + ScaledHeiSpace ) * Math.floor(i/Columns)

			
			var MainAxisVirtX = 0;
			var MainAxisVirtY = 0;

			if( MainAxisDirection == "straight" )
			{
				MainAxisVirtX = VirtX;
				MainAxisVirtY = VirtY;
			}

			if( MainAxisDirection == "reversed" )
			{
				MainAxisVirtX = VirtX;
				MainAxisVirtY = ScaledSumHei - VirtY - ScaledCellHei ;				
			}


			var CrossAxisVirtX = 0;
			var CrossAxisVirtY = 0;

			if( CrossAxisDirection == "straight" )
			{
				CrossAxisVirtX = MainAxisVirtX;
				CrossAxisVirtY = MainAxisVirtY;
			}

			if( CrossAxisDirection == "reversed" )
			{
				CrossAxisVirtX = ScaledSumWid - MainAxisVirtX - ScaledCellWid;
				CrossAxisVirtY = MainAxisVirtY;				
			}


			// Final coordinates -------------------

			var final_x = 0;
			var final_y = 0;

			if( flow == "vertical" )
			{
				final_x = ShiftHoriz + CrossAxisVirtX;
				final_y = ShiftVert + CrossAxisVirtY;
			}

			if( flow == "horizontal" )
			{
				final_x = ShiftVert + CrossAxisVirtY;
				final_y = BaseWid - ShiftHoriz - CrossAxisVirtX - ScaledCellWid;
			}


			// Assign properties ------------------------

			//if( runtime_instance !== undefined )
			{
				//var XY = getXY(final_x, final_y, base);

				elements.push(
				{
					index: i,
					//x: XY.x,
					//y: XY.y,
					virt_x: final_x,
					virt_y: final_y,
					width: final_width,
					height: final_height,
					//angle: base.alpha * 180/Math.PI,
					angle: base.alpha,
					scale_horiz: final_scale_width,
					scale_vert: final_scale_height
				}) 
			}

		}

		return elements;

	}

	function GetBase(this_)
	{
		//console.log("GetBase");

		// C3 Edit time
		if( typeof SDK != "undefined" && SDK.IWorldInstance !== undefined && this_ instanceof SDK.IWorldInstance )
		{
			var base = {x: this_.GetQuad().getTlx(), y: this_.GetQuad().getTly(), width: this_.GetWidth(), height: this_.GetHeight(), alpha: this_.GetAngle() }

			return base;

		} else
		// C2 Edit time
		if( typeof IDEInstance != "undefined" && this_ instanceof IDEInstance )
		{
			var q = this_.instance.GetBoundingQuad();
			var angle = Math.asin( (q.try_-q.tly) / Math.sqrt( Math.pow(q.try_-q.tly,2) + Math.pow(q.trx-q.tlx,2) ) );

			if( q.trx<q.tlx )
				angle = Math.PI/2-angle+Math.PI/2;

			var base = {x: q.tlx, y: q.tly, width: this_.instance.GetSize().x, height: this_.instance.GetSize().y, alpha: angle }

			return base;

		} else
		// C3 runtime, C2 runtime
		{
			if( __CONSTRUCT2_RUNTIME2__ || __CONSTRUCT3_RUNTIME2__ )
			{	
				this_.update_bbox();
				var inst_q = this_.bquad;
				var inst_width = this_.width;
				var inst_height = this_.height;
				var inst_alpha = this_.angle;
				var inst_opacity = this_.opacity;

				//console.log("ANGLE: " + inst_alpha);


				var base = {x: inst_q.tlx, y: inst_q.tly, width: inst_width, height: inst_height, alpha: inst_alpha }	
				return base;

				var inst_x0 = 0;
				var inst_y0 = 0;

				var myx = this_.x;
				var myy = this_.y;
				var w = this_.width;
				var h = this_.height;

				//var was_angle = false;
				
				// Object not rotated: can draw without transformation.
				if (this_.angle === 0 && w >= 0 && h >= 0)
				{
					myx -= this_.hotspotX * w;
					myy -= this_.hotspotY * h;
					
					if (this_.runtime.pixel_rounding)
					{
						myx = Math.round(myx);
						myy = Math.round(myy);
					}
					
					inst_x0 = myx;
					inst_y0 = myy;
				}
				else
				{
					//was_angle = true;

					// Only pixel round the x/y position, otherwise objects don't rotate smoothly
					if (this_.runtime.pixel_rounding)
					{
						myx = Math.round(myx);
						myy = Math.round(myy);
					}
					
					// Angle applied; we need to transform the canvas.  Save state.
					//ctx.save();
					
					//var widthfactor = w > 0 ? 1 : -1;
					//var heightfactor = h > 0 ? 1 : -1;
					
					// Translate to object's position, then rotate by its angle.
					//ctx.translate(myx, myy);
					
					//if (widthfactor !== 1 || heightfactor !== 1)
					//	ctx.scale(widthfactor, heightfactor);
					
					//ctx.rotate(this_.angle * widthfactor * heightfactor);
					
					var drawx = 0 - (this_.hotspotX * Math.abs(w))
					var drawy = 0 - (this_.hotspotY * Math.abs(h));
					
					inst_x0 = drawx;
					inst_y0 = drawy;
				}
				

				var base = {x: inst_x0, y: inst_y0, width: inst_width, height: inst_height, alpha: inst_alpha }		
				return base;
			}

			if( __CONSTRUCT3_RUNTIME3__ )
			{
				var base = {x: this_.GetWorldInfo().GetBoundingQuad().getTlx(), y: this_.GetWorldInfo().GetBoundingQuad().getTly(), width: this_.GetWorldInfo().GetWidth(), height: this_.GetWorldInfo().GetHeight(), alpha: this_.GetWorldInfo().GetAngle() }
				return base;
			}
		}
	}

	function updateElements(this_)
	{
		var base = GetBase(this_);

		var props = 
		{
			el_count: 			this_.el_count, 
			el_width: 			this_.el_width, 
			el_height: 			this_.el_height, 
			threads_mode: 		this_.threads_mode, 
			threads: 			this_.threads, 
			space_width: 		this_.space_width, 
			space_height: 		this_.space_height, 
			fill_mode_width: 	this_.fill_mode_width, 
			fill_mode_height: 	this_.fill_mode_height, 
			keep_ratio: 		this_.keep_ratio, 
			float_horiz: 		this_.float_horiz, 
			float_vert: 		this_.float_vert, 
			flow: 				this_.flow, 
			main_axis_dir: 		this_.main_axis_dir, 
			cross_axis_dir: 	this_.cross_axis_dir
		}

		this_.Elements = [];
		this_.Elements = Arrange(base, props);

		for( var i=0; i<this_.Elements.length; i++ )
		{
			var XY = getXY(this_.Elements[i].virt_x, this_.Elements[i].virt_y, base);	

			this_.Elements[i].x = XY.x;
			this_.Elements[i].y = XY.y;		
		}			
	}

	function redrawElements(this_, rend_type, context, opacity, base)
	{
		if( base === undefined )
		var base = GetBase(this_);

		//console.log(base);


		var color = {r:0.2, g:0.2, b:0.2, a:opacity}
		//var color = {r:0.2, g:0.2, b:0.2, a:1}
		DrawRect(rend_type, context, 0, 0, base.width, base.height, color, base );

		color = {r:0.5, g:0.5, b:0.5, a:opacity}
		//color = {r:0.5, g:0.5, b:0.5, a:1}
		for( var i=0; i<this_.Elements.length; i++ )
		{
			DrawRect(rend_type, context, this_.Elements[i].virt_x, this_.Elements[i].virt_y, this_.Elements[i].width, this_.Elements[i].height, color, base );
		}
	}

	
	var InstanceFunctionsObject = 	{

	}
	for( var k in InstanceFunctionsObject )
	{
		instanceProto[k] = InstanceFunctionsObject[k];
	}


	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	var CndsObject =
	{
	};

	for( var k in CndsObject )
	{
		Cnds.prototype[k] = CndsObject[k];
	}
	
	pluginProto.cnds = new Cnds();


	//////////////////////////////////////
	// Actions
	function Acts() {};

	var ActsObject =
	{
		SpawnAll: function(objectClass, match_size, match_angle, index_num, scale_wid_num, scale_hei_num)
		{
			if( objectClass === undefined || objectClass === null )
			return;

			updateElements(this);

			for( var i=0; i<this.Elements.length; i++ )
			{
				if( __CONSTRUCT2_RUNTIME2__ || __CONSTRUCT3_RUNTIME2__ )
				{	
					var new_inst = this.runtime.createInstance(objectClass, this.layer);
					new_inst.x = this.Elements[i].x;
					new_inst.y = this.Elements[i].y
					
					if( match_size )
					{
						new_inst.width = this.Elements[i].width;
						new_inst.height = this.Elements[i].height;
					}
					
					if( match_angle )
					{
						new_inst.angle = this.Elements[i].angle;
					}

					new_inst.set_bbox_changed();

					
					if( index_num >= 0 )
					{
						if( new_inst.instance_vars[index_num] !== undefined )
						new_inst.instance_vars[index_num] =  this.Elements[i].index;						
					}

					if( scale_wid_num >= 0 )
					{
						if( new_inst.instance_vars[scale_wid_num] !== undefined )
						new_inst.instance_vars[scale_wid_num] =  this.Elements[i].scale_horiz;						
					}

					if( scale_hei_num >= 0 )
					{
						if( new_inst.instance_vars[scale_hei_num] !== undefined )
						new_inst.instance_vars[scale_hei_num] =  this.Elements[i].scale_vert;						
					}
				}

				if( __CONSTRUCT3_RUNTIME3__ )
				{
					var new_inst = this.GetRuntime().CreateInstance(objectClass, this.GetWorldInfo().GetLayer(), this.Elements[i].x, this.Elements[i].y);

					if( match_size )
					{
						new_inst.GetWorldInfo().SetWidth(this.Elements[i].width);
						new_inst.GetWorldInfo().SetHeight(this.Elements[i].height);						
					}

					if( match_angle )
					{
						new_inst.GetWorldInfo().SetAngle(this.Elements[i].angle);
					}

					new_inst.GetWorldInfo().SetBboxChanged();


					if( index_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(index_num, this.Elements[i].index);
					}

					if( scale_wid_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(scale_wid_num, this.Elements[i].scale_horiz);
					}

					if( scale_hei_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(scale_hei_num, this.Elements[i].scale_vert);
					}

				}
			}

		},
		SpawnOne: function(objectClass, index, match_size, match_angle, index_num, scale_wid_num, scale_hei_num)
		{
			if( objectClass === undefined || objectClass === null )
			return;

			updateElements(this)

			var i = index;
			//for( var i=0; i<this.Elements.length; i++ )
			{
				if( __CONSTRUCT2_RUNTIME2__ || __CONSTRUCT3_RUNTIME2__ )
				{	
					var new_inst = this.runtime.createInstance(objectClass, this.layer);
					new_inst.x = this.Elements[i].x;
					new_inst.y = this.Elements[i].y
					
					if( match_size )
					{
						new_inst.width = this.Elements[i].width;
						new_inst.height = this.Elements[i].height;
					}
					
					if( match_angle )
					{
						new_inst.angle = this.Elements[i].angle;
					}

					new_inst.set_bbox_changed();

					
					if( index_num >= 0 )
					{
						if( new_inst.instance_vars[index_num] !== undefined )
						new_inst.instance_vars[index_num] =  this.Elements[i].index;						
					}

					if( scale_wid_num >= 0 )
					{
						if( new_inst.instance_vars[scale_wid_num] !== undefined )
						new_inst.instance_vars[scale_wid_num] =  this.Elements[i].scale_horiz;						
					}

					if( scale_hei_num >= 0 )
					{
						if( new_inst.instance_vars[scale_hei_num] !== undefined )
						new_inst.instance_vars[scale_hei_num] =  this.Elements[i].scale_vert;						
					}
				}

				if( __CONSTRUCT3_RUNTIME3__ )
				{
					var new_inst = this.GetRuntime().CreateInstance(objectClass, this.GetWorldInfo().GetLayer(), this.Elements[i].x, this.Elements[i].y);

					if( match_size )
					{
						new_inst.GetWorldInfo().SetWidth(this.Elements[i].width);
						new_inst.GetWorldInfo().SetHeight(this.Elements[i].height);						
					}

					if( match_angle )
					{
						new_inst.GetWorldInfo().SetAngle(this.Elements[i].angle);
					}

					new_inst.GetWorldInfo().SetBboxChanged();


					if( index_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(index_num, this.Elements[i].index);
					}

					if( scale_wid_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(scale_wid_num, this.Elements[i].scale_horiz);
					}

					if( scale_hei_num >= 0 )
					{
						//if( new_inst.GetInstanceVariableCount() >= 1 )
						new_inst.SetInstanceVariableValue(scale_hei_num, this.Elements[i].scale_vert);
					}

				}
			}

		},
		setCellsNumber: function(num)
		{
			this.el_count = num;

			updateElements(this);
		},
		setCellWidth: function(num)
		{
			this.el_width = num;

			updateElements(this);
		},
		setCellHeight: function(num)
		{
			this.el_height = num;

			updateElements(this);
		},
		setWidthSpacing: function(num)
		{
			this.space_width = num;

			updateElements(this);
		},
		setHeightSpacing: function(num)
		{
			this.space_height = num;

			updateElements(this);
		},
		setColumnsMode: function(num)
		{
			this.threads_mode = num;

			updateElements(this);
		},
		setThreadsNumber: function(num)
		{
			this.threads = num;

			updateElements(this);
		},
		setFillWidthMode: function(num)
		{
			this.fill_mode_width = num;

			updateElements(this);
		},
		setFillHeightMode: function(num)
		{
			this.fill_mode_height = num;

			updateElements(this);
		},
		setKeepRatio: function(num)
		{
			this.keep_ratio = num;

			updateElements(this);
		},
		setHorizontalFloat: function(num)
		{
			this.float_horiz = num;

			updateElements(this);
		},
		setVerticalFloat: function(num)
		{
			this.float_vert = num;

			updateElements(this);
		},
		setFlow: function(num)
		{
			this.flow = num;

			updateElements(this);
		},
		setMainAxisDirection: function(num)
		{
			this.main_axis_dir = num;

			updateElements(this);
		},
		setCrossAxisDirection: function(num)
		{
			this.cross_axis_dir = num;

			updateElements(this);
		}
	};

	for( var k in ActsObject )
	{
		Acts.prototype[k] = ActsObject[k];
	}

	
	pluginProto.acts = new Acts();


	//////////////////////////////////////
	// Expressions
	function Exps() {};

	var ExpsObject =
	{
		getCellsNumber: function(ret) 
		{
			ret.set_any(this.el_count);    	
		},
		getCellX: function(ret, number) 
		{
			updateElements(this);
			ret.set_any(this.Elements[number].x);    	
		},
		getCellY: function(ret, number) 
		{
			updateElements(this);
			ret.set_any(this.Elements[number].y);    	
		},
		getCellWidth: function(ret) 
		{
			updateElements(this);
			ret.set_any(this.Elements[0].width);    	
		},
		getCellHeight: function(ret) 
		{
			updateElements(this);
			ret.set_any(this.Elements[0].height);    	
		},
		getCellHorizontalScale: function(ret) 
		{
			updateElements(this);
			ret.set_any(this.Elements[0].scale_horiz);    	
		},
		getCellVerticalScale: function(ret) 
		{
			updateElements(this);
			ret.set_any(this.Elements[0].scale_vert);    	
		}
	};

	for( var k in ExpsObject )
	{
		Exps.prototype[k] = ExpsObject[k];
	}
	
	pluginProto.exps = new Exps();

	instanceProto.EXPS = pluginProto.exps;
	instanceProto.CNDS = pluginProto.cnds;
	instanceProto.ACTS = pluginProto.acts;
}());