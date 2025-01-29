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


function GetPluginSettings()
{
	// Generting dependency string;
	var dependency_str = "";

	return {
		"name":			"Valeryppoff Layouter",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"ValerypopoffLayouterPlugin",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.5.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Layouter on steroids.",
		"author":		"Valera Popov",
		"help url":		"http://valerypopoff.ru/construct/layouter-plugin",
		"category":		"Other",				// Prefer to re-use existing categories, but you can set anything here


		// Ignore this: yes			
		"type":			"world",

		"flags":		pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_zorder_aces						
					// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
		,"rotatable":	true					// only used when "type" is "world".  Enables an angle property on the object.
		,"dependency":	dependency_str
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddStringParam("Message", "Enter a string to alert.");
//AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");


// Actions
//-------------------------------------------------

AddObjectParam("Object", "Object type to spawn."
);	

AddComboParamOption("Don't match");
AddComboParamOption("Match");
AddComboParam("Match size", "Match instances size to the cells."
, 1
);	

AddComboParamOption("Don't match");
AddComboParamOption("Match");
AddComboParam("Match angle", "Match instances angle to the cells."
, 1
);	

AddNumberParam("Index var #", "Instance variable number for storing spawned instance's index. Any negative number to not store it."
, "-1"
);	

AddNumberParam("Width scale var #", "Instance variable number for storing spawned instance's width scale. Any negative number to not store it."
, "-1"
);	

AddNumberParam("Height scale var #", "Instance variable number for storing spawned instance's height scale. Any negative number to not store it."
, "-1"
);	

AddAction(0, af_none, "Spawn object instances at every cell", "General: Spawn", "Spawn {0} instances. Size: {1}, angle: {2}. Index goes in var #{3}, width scale in var #{4}, height scale in var #{5}", "Spawn object instances at every cell.", "SpawnAll");


AddObjectParam("Object", "Object type to spawn."
);	

AddNumberParam("Cell index", "Cell index."
, "0"
);	

AddComboParamOption("Don't match");
AddComboParamOption("Match");
AddComboParam("Match size", "Match instance size to the cell."
, 1
);	

AddComboParamOption("Don't match");
AddComboParamOption("Match");
AddComboParam("Match angle", "Match instance angle to the cell."
, 1
);	

AddNumberParam("Index var #", "Instance variable number for storing spawned instance's index. Any negative number to not store it."
, "-1"
);	

AddNumberParam("Width scale var #", "Instance variable number for storing spawned instance's width scale. Any negative number to not store it."
, "-1"
);	

AddNumberParam("Height scale var #", "Instance variable number for storing spawned instance's height scale. Any negative number to not store it."
, "-1"
);	

AddAction(16, af_none, "Spawn one object instance at cell index", "General: Spawn", "Spawn {0} instance at {1} cell. Size: {2}, angle: {3}. Index goes in var #{4}, width scale in var #{5}, height scale in var #{6}", "Spawn object instances at every cell.", "SpawnOne");


AddNumberParam("Number", "Number of cells."
, "10"
);	

AddAction(1, af_none, "Set cells number", "General: Setters", "Set {0} cells", "Set cells number.", "setCellsNumber");


AddNumberParam("Cell width", "Cell width."
, "30"
);	

AddAction(2, af_none, "Set cell width", "General: Setters", "Set cell width to {0}", "Set cell width.", "setCellWidth");


AddNumberParam("Cell height", "Cell height."
, "50"
);	

AddAction(3, af_none, "Set cell height", "General: Setters", "Set cell height to {0}", "Set cell height.", "setCellHeight");


AddNumberParam("Width spacing", "Width spacing."
, "10"
);	

AddAction(4, af_none, "Set width spacing", "General: Setters", "Set width spacing to {0}", "Set width spacing.", "setWidthSpacing");


AddNumberParam("Height spacing", "Height spacing."
, "10"
);	

AddAction(5, af_none, "Set height spacing", "General: Setters", "Set height spacing to {0}", "Set height spacing.", "setHeightSpacing");


AddComboParamOption("Fixed number");
AddComboParamOption("As many as the viewport fits");
AddComboParam("Columns mode", "Columns mode."
, 0
);	

AddAction(6, af_none, "Set columns mode", "General: Setters", "Set columns mode to {0}", "Set columns mode.", "setColumnsMode");


AddNumberParam("Number of columns", "Number of columns."
, "3"
);	

AddAction(7, af_none, "Set number of columns", "General: Setters", "Set number of columns to {0}", "Set number of columns.", "setThreadsNumber");


AddComboParamOption("None");
AddComboParamOption("Stretch");
AddComboParamOption("Space");
AddComboParam("Fill width mode", "Fill width mode."
, 0
);	

AddAction(8, af_none, "Set fill width mode", "General: Setters", "Set fill width mode to {0}", "Set fill width mode.", "setFillWidthMode");


AddComboParamOption("None");
AddComboParamOption("Stretch");
AddComboParamOption("Space");
AddComboParam("Fill height mode", "Fill height mode."
, 0
);	

AddAction(9, af_none, "Set fill height mode", "General: Setters", "Set fill height mode to {0}", "Set fill height mode.", "setFillHeightMode");


AddComboParamOption("Don't keep cells ratio");
AddComboParamOption("Keep cells ratio");
AddComboParam("Keep ratio", "Keep ratio."
, 1
);	

AddAction(10, af_none, "Set keep cells ratio", "General: Setters", "Set {0}", "Set keep cells ratio.", "setKeepRatio");


AddComboParamOption("Left");
AddComboParamOption("Center");
AddComboParamOption("Right");
AddComboParam("Horizontal float", "Horizontal float."
, 0
);	

AddAction(11, af_none, "Set horizontal float", "General: Setters", "Set horizontal float to {0}", "Set horizontal float.", "setHorizontalFloat");


AddComboParamOption("Top");
AddComboParamOption("Center");
AddComboParamOption("Bottom");
AddComboParam("Vertical float", "Vertical float."
, 0
);	

AddAction(12, af_none, "Set vertical float", "General: Setters", "Set vertical float to {0}", "Set vertical float.", "setVerticalFloat");


AddComboParamOption("Vertical");
AddComboParamOption("Horizontal");
AddComboParam("Flow", "Flow."
, 0
);	

AddAction(13, af_none, "Set flow", "General: Setters", "Set flow to {0}", "Set flow.", "setFlow");


AddComboParamOption("Straight");
AddComboParamOption("Reversed");
AddComboParam("Main axis direction", "Main axis direction."
, 0
);	

AddAction(14, af_none, "Set main axis direction", "General: Setters", "Set main axis direction to {0}", "Set main axis direction.", "setMainAxisDirection");


AddComboParamOption("Straight");
AddComboParamOption("Reversed");
AddComboParam("Cross axis direction", "Cross axis direction."
, 0
);	

AddAction(15, af_none, "Set cross axis direction", "General: Setters", "Set cross axis direction to {0}", "Set cross axis direction.", "setCrossAxisDirection");


// Conditions
//-------------------------------------------------

// Expressions
//-------------------------------------------------

AddExpression(0, ef_return_number, "Cells number", "General: cells", "getCellsNumber", "Cells number.");

AddNumberParam("Cell index", "Cell index."
, "0"
);	

AddExpression(1, ef_return_number, "Cell's X position", "General: cells", "getCellX", "Cell's X position at index.");

AddNumberParam("Cell index", "Cell index."
, "0"
);	

AddExpression(2, ef_return_number, "Cell's Y position", "General: cells", "getCellY", "Cell's Y position at index.");

AddExpression(3, ef_return_number, "Cell's size: width", "General: cells", "getCellWidth", "Cell's size: width.");

AddExpression(4, ef_return_number, "Cell's size: height", "General: cells", "getCellHeight", "Cell's size: height.");

AddExpression(5, ef_return_number, "Cell's scale: horizontal", "General: cells", "getCellHorizontalScale", "Cell's scale: horizontal.");

AddExpression(6, ef_return_number, "Cell's scale: vertical", "General: cells", "getCellVerticalScale", "Cell's scale: vertical.");




ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click


var property_list = [
new cr.Property(ept_integer, "Initially visible"
	, 1
	, "Choose whether the object is visible when the layout starts."
	,[
	].join("|")
	),
new cr.Property(ept_section, "Properties: cells and spacing"
	, "Properties: cells and spacing."
	,[
	].join("|")
	),
new cr.Property(ept_integer, "Cells"
	, 7
	, "Number of cells."
	,[
	].join("|")
	),
new cr.Property(ept_integer, "Cell width"
	, 50
	, "Cell width."
	,[
	].join("|")
	),
new cr.Property(ept_integer, "Cell height"
	, 30
	, "Cell height."
	,[
	].join("|")
	),
new cr.Property(ept_integer, "Width spacing"
	, 10
	, "Width spacing between cells."
	,[
	].join("|")
	),
new cr.Property(ept_integer, "Height spacing"
	, 10
	, "Height spacing between cells."
	,[
	].join("|")
	),
new cr.Property(ept_section, "Properties: columns and fill"
	, "Properties: columns and fill."
	,[
	].join("|")
	),
new cr.Property(ept_combo, "Columns mode"
	, "Fixed number of columns"
	, "Columns mode."
	,[
				"Fixed number of columns",
				"As many as the viewport fits"
	].join("|")
	),
new cr.Property(ept_integer, "Columns"
	, 3
	, "The number of columns."
	,[
	].join("|")
	),
new cr.Property(ept_combo, "Fill width mode"
	, "None"
	, "Choose 'Stretch' to proportionally stretch cells and spaces. Choose 'Space' to add space in between cells."
	,[
				"None",
				"Stretch",
				"Space"
	].join("|")
	),
new cr.Property(ept_combo, "Fill height mode"
	, "None"
	, "Choose 'Stretch' to proportionally stretch cells and spaces. Choose 'Space' to add space in between cells."
	,[
				"None",
				"Stretch",
				"Space"
	].join("|")
	),
new cr.Property(ept_integer, "Keep cells ratio"
	, 1
	, "TIP: if 'Keep cells ratio' is set and both 'Fill width' and 'Fil height' are set to 'stretch', it will stretch cells in such a way that all cells fit in the viewport."
	,[
	].join("|")
	),
new cr.Property(ept_section, "Properties: float and flow"
	, "Properties: float and flow."
	,[
	].join("|")
	),
new cr.Property(ept_combo, "Horizontal float"
	, "Left"
	, "Only applied when 'Fill width' is not set."
	,[
				"Left",
				"Center",
				"Right"
	].join("|")
	),
new cr.Property(ept_combo, "Vertical float"
	, "Top"
	, "Only applied when 'Fill height' is not set."
	,[
				"Top",
				"Center",
				"Bottom"
	].join("|")
	),
new cr.Property(ept_combo, "Flow"
	, "Vertical"
	, "Flow direction."
	,[
				"Vertical",
				"Horizontal"
	].join("|")
	),
new cr.Property(ept_combo, "Main axis direction"
	, "Straight"
	, "Main axis direction."
	,[
				"Straight",
				"Reversed"
	].join("|")
	),
new cr.Property(ept_combo, "Cross axis direction"
	, "Straight"
	, "Cross axis direction."
	,[
				"Straight",
				"Reversed"
	].join("|")
	)
	];
	
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
		var rend_type = "c2renderer";
	var context = renderer;

	/*
	this.el_count 		= this.properties["Cells"];
	this.el_width 		= this.properties["Cell width"];
	this.el_height 		= this.properties["Cell height"];
	this.space_width 	= this.properties["Width spacing"];
	this.space_height	= this.properties["Height spacing"];


	this.threads_mode = this.properties["Columns mode"];

	this.threads = this.properties["Columns"];


	this.fill_mode_width = this.properties["Fill width mode"];
	this.fill_mode_height = this.properties["Fill height mode"];

	this.keep_ratio = this.properties["Keep cells ratio"] == false ? 0 : 1;

	this.float_horiz = this.properties["Horizontal float"];
	this.float_vert = this.properties["Vertical float"];
	
	this.flow = this.properties["Flow"];
	
	this.main_axis_dir = this.properties["Main axis direction"];
	this.cross_axis_dir = this.properties["Cross axis direction"];
	*/

	



	this.el_count 		= this.properties["Cells"];
	this.el_width 		= this.properties["Cell width"];
	this.el_height 		= this.properties["Cell height"];
	this.space_width 	= this.properties["Width spacing"];
	this.space_height	= this.properties["Height spacing"];


	if( this.properties["Columns mode"] == "Fixed number of columns") this.threads_mode = 0;
	if( this.properties["Columns mode"] == "As many as the viewport fits") this.threads_mode = 1;

	this.threads = this.properties["Columns"];


	if( this.properties["Fill width mode"] == "None") this.fill_mode_width = 0;
	if( this.properties["Fill width mode"] == "Stretch") this.fill_mode_width = 1;
	if( this.properties["Fill width mode"] == "Space") this.fill_mode_width = 2;

	if( this.properties["Fill height mode"] == "None") this.fill_mode_height = 0;
	if( this.properties["Fill height mode"] == "Stretch") this.fill_mode_height = 1;
	if( this.properties["Fill height mode"] == "Space") this.fill_mode_height = 2;

	this.keep_ratio = this.properties["Keep cells ratio"] == false ? 0 : 1;

	if( this.properties["Horizontal float"] == "Left" ) this.float_horiz = 0;
	if( this.properties["Horizontal float"] == "Center" ) this.float_horiz = 1;
	if( this.properties["Horizontal float"] == "Right" ) this.float_horiz = 2;

	if( this.properties["Vertical float"] == "Top" ) this.float_vert = 0;
	if( this.properties["Vertical float"] == "Center" ) this.float_vert = 1;
	if( this.properties["Vertical float"] == "Bottom" ) this.float_vert = 2;		
	
	if( this.properties["Flow"] == "Vertical" ) this.flow = 0;
	if( this.properties["Flow"] == "Horizontal" ) this.flow = 1;
	
	if( this.properties["Main axis direction"] == "Straight" ) this.main_axis_dir = 0;
	if( this.properties["Main axis direction"] == "Reversed" ) this.main_axis_dir = 1;

	if( this.properties["Cross axis direction"] == "Straight" ) this.cross_axis_dir = 0;
	if( this.properties["Cross axis direction"] == "Reversed" ) this.cross_axis_dir = 1;
	


	updateElements(this);
	redrawElements(this, rend_type, context, this.instance.GetOpacity());

	//redrawElements(this, rend_type, context, this.instance.GetOpacity());
	var q = new cr.quad();

}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}