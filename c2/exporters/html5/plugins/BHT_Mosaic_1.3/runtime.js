// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.bht_mosaic = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.bht_mosaic.prototype;
		
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

	var kFrontTextureIndex = 0;
	var kBackTextureIndex = 1;

	var kRotationOnXaxis = 1;
	var kRotationOnYaxis = 2;
	var kRotationOnXYaxis = 3;	// not supported yet

	var kZcamMin = 0.1;

	// called whenever an instance is created
	instanceProto.onCreate = function ()
	{
	    // Pull in properties from the IDE.
	    this.columns = (this.properties[0]);			// the number of columns in the mosaic, default = 1
	    this.rows = (this.properties[1]);				// the number of rows in the mosaic, default = 1
	    this.visible = (this.properties[2] === 0);		// 0=visible, 1=invisible
	    this.showgrid = (this.properties[3] === 0);		// 0=show, 1=hide
	    this.Zcam = (this.properties[4]);				// 0.1 to inf.
	    this.cameraWidth = (this.properties[5]);		// The width of the actual default texture display. Rotations will rotate beyond this value.
	    this.cameraHeight = (this.properties[6]);		// The height of the actual default texture display. Rotations will rotate beyond this value.

	    if (this.Zcam < kZcamMin)
	    {
	        this.Zcam = kZcamMin;
	    }

	    // Setup to receive ticks. TURN OFF when not needed.
	    this.runtime.tickMe(this);
	    this.isTicking = true;

	    var glw = this.runtime.glwrap;

	    if (glw != null)
	    {
	        // property(array): The array of 'sides'/textures of the mosaic. Starts at 2 (front & back).
	        this.sides = new Array(2);
	        this.sides[kFrontTextureIndex] = glw.createEmptyTexture(this.width, this.height, this.runtime.linearSampling, false);
	        this.sides[kBackTextureIndex] = glw.createEmptyTexture(this.width, this.height, this.runtime.linearSampling, false);

	        // property(Texture): Make a one-pixel coloured texture, for drawing lines on the underlying texture, to display the grid.
	        this.quadtex = glw.createEmptyTexture(1, 1, this.runtime.linearSampling, false);
	        glw.setTexture(null);
	        glw.setRenderingToTexture(this.quadtex);
	        glw.clear(1, 0, 0, 1);						// RED
	        glw.setRenderingToTexture(null);

	        // property(texture): the current texture being displayed, with all animations applied.
	        this.currentTexture = glw.createEmptyTexture(this.width, this.height, this.runtime.linearSampling, false);
	    }
	    else
	    {
	        this.sides = new Array(0);
            console.warn("Sorry, 'BHT Mosaic' requires WebGL.")
	    }
	    this.cells = new Array(this.rows);
	    for (var y = 0; y < this.rows; y++)
	    {
	        this.cells[y] = new Array(this.columns);
	        for (var x = 0; x < this.columns; x++)
	        {
	            this.cells[y][x] = new CellData();
	        }
	    }

	    this.somethingtoprocess = false;
	    this.runAnimation = false;

	    this.qgrid = new cr.quad();
	};

	instanceProto.onDestroy = function ()
	{
	    if (this.runtime.glwrap == null)
	        return;

	    for (var y = 0; y < this.rows; y++)
	    {
	        for (var x = 0; x < this.columns; x++)
	        {
	            for(var i=0; i<this.cells[y][x].Sides.length; i++)
	            {
	                if(this.cells[y][x].Sides[i] != null)
	                {
	                    this.runtime.glwrap.deleteTexture(this.cells[y][x].Sides[i]);
	                }
	            }
	            delete this.cells[y][x];
	        }
	        delete this.cells[y];
	    }
	    delete this.cells;

	    for (var i = 0; i < this.sides.length; i++)
	    {
	        this.runtime.glwrap.deleteTexture(this.sides[i]);
	        delete this.sides[i];
	    }
	    delete this.sides;
	    this.runtime.glwrap.deleteTexture(this.currentTexture);
	    this.currentTexture = null;
	    console.log("Mosaic destroyed.");
	};

	/*
		Rotations:
			X-axis:
					Ynew = Yoriginal * cos(theta) - Zoriginal * cos(theta)
					Znew = Yoriginal * sin(theta) + Zoriginal * sin(theta)
			Y-axis:
					Xnew = Xoriginal * cos(theta) - Zoriginal * sin(theta)
					Znew = Xoriginal * sin(theta) + Zoriginal * cos(theta)
			Z-axis:
					Xnew = Xoriginal * cos(theta) - Yoriginal * sin(theta)
					Ynew = Xoriginal * sin(theta) + Yoriginal * cos(theta)

		My guess on rotate-around-two-opposing-points on a rectangle:
		(draw line between points) Rotate(Z) so hypotenuse is on X. Rotate(X). Reverse-rotate(Z).
	*/
	instanceProto.tick = function()
	{
		if(this.somethingtoprocess)
		{
			var dt = this.runtime.getDt(this);
			//
			//
			//
///			console.log("process...");

			//
			var glw = this.runtime.glwrap;

			if (!glw)
			    return;

			var old_width = glw.width;
			var old_height = glw.height;
			glw.setTexture(null);
			glw.setRenderingToTexture(this.currentTexture);

			glw.clear(0,0,0,0);

			var cellWidth = Math.floor(this.cameraWidth/this.columns);
			var cellHeight = Math.floor(this.cameraHeight/this.rows);

			var cellWidthPad = this.cameraWidth - cellWidth*this.columns;
			var cellHeightPad = this.cameraHeight - cellHeight*this.rows;

			var q = this.bquad;

			var x1,x2,x3,x4;
			var y1,y2,y3,y4;
			var z1,z2,z3,z4;

			glw.setSize(this.width, this.height);
			glw.resetModelView();
			glw.scale(1, -1);
			glw.translate(this.cameraWidth/-2, this.cameraHeight/-2);
			glw.updateModelView();

			var cellCenterX = cellWidth/2;
			var cellCenterY = cellHeight/2;
			var unitX = cellCenterX/cellHeight;
			var unitY = cellCenterY/cellHeight;
			var rotCOS = 0;	// radians
			var rotSIN = 0;

			var zcam = this.Zcam;

			var done = true;
			var rotDir = 1;

			var cellWidthPrimary = Math.floor(this.cameraWidth/this.columns);
			var cellHeightPrimary = Math.floor(this.cameraHeight/this.rows);

			for(var x=0; x<this.columns;x++)
			{
				for(var y=0; y<this.rows;y++)
				{
			cellWidth = Math.floor(this.cameraWidth/this.columns);
			cellHeight = Math.floor(this.cameraHeight/this.rows);

					if(x == this.columns-1)
					{
						cellWidth = cellWidth + cellWidthPad;
					}
					else
					{
						cellWidth = cellWidth;
					}
					if(y == this.rows-1)
					{
						cellHeight = cellHeight + cellHeightPad;
					}
					else
					{
						cellHeight = cellHeight;
					}

			cellCenterX = cellWidth/2;
			cellCenterY = cellHeight/2;
			unitX = cellCenterX/cellHeight;
			unitY = cellCenterY/cellHeight;
					if(this.cells[y][x].RotationAxis == kRotationOnXaxis)
					{
						if(this.cells[y][x].Delay==0 && this.cells[y][x].stateAngleHorz < this.cells[y][x].Target)
						{
							this.cells[y][x].stateAngleHorz += this.cells[y][x].Rate * dt;
							if(this.cells[y][x].stateAngleHorz >= this.cells[y][x].Target)
							{
								this.cells[y][x].stateAngleHorz = this.cells[y][x].Target;
							}
						}
						rotDir = this.cells[y][x].stateAngleHorz * this.cells[y][x].stateDirection;
						rotCOS = Math.cos(rotDir);
						rotSIN = Math.sin(rotDir);
///						console.log(rotDir);

						// Rotate in Y
						// TL
						x1 = -unitX * rotCOS;
						y1 = -unitY;
						z1 = -unitX * rotSIN;

						// TR
						x2 = unitX * rotCOS;
						y2 = -unitY;
						z2 = unitX * rotSIN;

						// BR
						x3 = unitX * rotCOS;
						y3 = unitY;
						z3 = unitX * rotSIN;

						// BL
						x4 = -unitX * rotCOS;
						y4 = unitY;
						z4 = -unitX * rotSIN;
						done &= this.cells[y][x].stateAngleHorz >= this.cells[y][x].Target;
					}
					else if(this.cells[y][x].RotationAxis == kRotationOnYaxis)
					{               
						if(this.cells[y][x].Delay==0 && this.cells[y][x].stateAngleVert < this.cells[y][x].Target)
						{
							this.cells[y][x].stateAngleVert += this.cells[y][x].Rate * dt;
							if(this.cells[y][x].stateAngleVert >= this.cells[y][x].Target)
							{
								this.cells[y][x].stateAngleVert = this.cells[y][x].Target;
							}
						}
						rotCOS = Math.cos(this.cells[y][x].stateAngleVert);
						rotSIN = Math.sin(this.cells[y][x].stateAngleVert);

						// Rotate in X
						// TL
						x1 = -unitX;
						y1 = -unitY * rotCOS;
						z1 = -unitY * rotSIN;

						// TR
						x2 = unitX;
						y2 = -unitY * rotCOS;
						z2 = -unitY * rotSIN;

						// BR
						x3 = unitX;
						y3 = unitY * rotCOS;
						z3 = unitY * rotSIN;

						// BL
						x4 = -unitX;
						y4 = unitY * rotCOS;
						z4 = unitY * rotSIN;
						done &= this.cells[y][x].stateAngleVert >= this.cells[y][x].Target;
					}

					// TL
					x1 = x1 * zcam / (z1 + zcam)
					y1 = y1 * zcam /(z1 + zcam);

					// TR
					x2 = x2 * zcam / (z2 + zcam)
					y2 = y2 * zcam /(z2 + zcam);

					// BR
					x3 = x3 * zcam / (z3 + zcam)
					y3 = y3 * zcam /(z3 + zcam);

					// BL
					x4 = x4 * zcam / (z4 + zcam)
					y4 = y4 * zcam /(z4 + zcam);

					var normal = (y1-y4) * (x1-x2);

					if(normal < 0)
					{
						this.cells[y][x].stateCurrentSide = this.cells[y][x].SideIndexBack;

						if(this.cells[y][x].RotationAxis == kRotationOnXaxis)
						{
							var temp = x1;
							x1 = x2;
							x2 = temp;
							temp = y1;
							y1 = y2;
							y2 = temp;
							temp = x3;
							x3 = x4;
							x4 = temp;
							temp = y3;
							y3 = y4;
							y4 = temp;
						}
						else if(this.cells[y][x].RotationAxis == kRotationOnYaxis)
						{
							var temp = x1;
							x1 = x4;
							x4 = temp;
							temp = y1;
							y1 = y4;
							y4 = temp;
							temp = x3;
							x3 = x2;
							x2 = temp;
							temp = y3;
							y3 = y2;
							y2 = temp;
						}
					}
					else
					{
						this.cells[y][x].stateCurrentSide = this.cells[y][x].SideIndexFront;
					}

					glw.setTexture(this.cells[y][x].Sides[this.cells[y][x].stateCurrentSide]);

					x1 = x1*cellHeight + x*cellWidthPrimary + cellCenterX;
					y1 = y1*cellHeight + y*cellHeightPrimary + cellCenterY;
					x2 = x2*cellHeight + x*cellWidthPrimary + cellCenterX;
					y2 = y2*cellHeight + y*cellHeightPrimary + cellCenterY;
					x3 = x3*cellHeight + x*cellWidthPrimary + cellCenterX;
					y3 = y3*cellHeight + y*cellHeightPrimary + cellCenterY;
					x4 = x4*cellHeight + x*cellWidthPrimary + cellCenterX;
					y4 = y4*cellHeight + y*cellHeightPrimary + cellCenterY;
					glw.quad(x1,y1,x2,y2,x3,y3,x4,y4);
					
					if(this.cells[y][x].Delay!=0)
					{
						this.cells[y][x].Delay -= dt*1000;
						if(this.cells[y][x].Delay < 0)
						{
							this.cells[y][x].Delay = 0;
						}
					}
				}
			}
			glw.setRenderingToTexture(null);
			glw.setSize(old_width, old_height);

			//
			this.runtime.redraw = true;

			this.somethingtoprocess = this.runAnimation;
			if(done)
			{
				this.runAnimation = false;
				this.somethingtoprocess = false;
				this.runtime.trigger(cr.plugins_.bht_mosaic.prototype.cnds.OnAllFinished, this);
			}
		}
	}

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
/*		console.log("drawGL-IN");
console.log("Width:"+this.width);
console.log("Height:"+this.height);
console.log("tWidth:"+this.currentTexture.c2width);
console.log("tHeight:"+this.currentTexture.c2height);
console.log("sWidth:"+this.sides[0].c2width);
console.log("sHeight:"+this.sides[0].c2height);*/

	    //glw.setBlend(this.srcBlend, this.destBlend);
	    glw.setTexture(this.currentTexture);
	    glw.setOpacity(this.opacity);

		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = ((this.x + 0.5) | 0) - this.x;
			var oy = ((this.y + 0.5) | 0) - this.y;
			
			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}

		if(this.showgrid)
		{
			glw.setTexture(this.quadtex);
			var linewidth = 1;

			var qgrid = this.qgrid;

			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.trx, q.try_ + linewidth, q.tlx, q.tly + linewidth);
			glw.quad(q.tlx, q.tly, q.tlx+linewidth, q.tly, q.blx+linewidth, q.bly, q.blx, q.bly);

			glw.quad(q.trx-linewidth, q.try_, q.trx, q.try_, q.brx, q.bry, q.brx-linewidth, q.bry);
			glw.quad(q.blx, q.bly - linewidth, q.brx, q.bry - linewidth, q.brx, q.bry, q.blx, q.bly);

			qgrid.tlx = q.tlx;
			qgrid.tly = q.tly;
			qgrid.trx = qgrid.tlx + this.cameraWidth;
			qgrid.try_ = qgrid.tly;
			qgrid.brx = qgrid.trx;
			qgrid.bry = qgrid.try_ + this.cameraHeight;
			qgrid.blx = qgrid.tlx;
			qgrid.bly = qgrid.bry;


			var gridWidth = this.cameraWidth;
			var cellWidth = Math.floor(gridWidth/this.columns);
			var gridHeight = this.cameraHeight;
			var cellHeight = Math.floor(gridHeight/this.rows);

			qgrid.offset((this.width-this.cameraWidth)/2, (this.height-this.cameraHeight)/2);

			for(var x=0; x<this.columns;x++)
			{
				glw.quad(qgrid.tlx + (x*cellWidth), qgrid.tly, qgrid.tlx+linewidth + (x*cellWidth), qgrid.tly, qgrid.tlx+linewidth + (x*cellWidth), qgrid.bly, qgrid.tlx + (x*cellWidth), qgrid.bly);
			}
			glw.quad(qgrid.trx - linewidth, qgrid.tly, qgrid.trx, qgrid.tly, qgrid.trx, qgrid.bly, qgrid.trx - linewidth, qgrid.bly);

			for(var y=0; y<this.rows; y++)
			{
				glw.quad(qgrid.tlx, qgrid.tly + (y*cellHeight), qgrid.trx, qgrid.try_ + (y*cellHeight), qgrid.trx, qgrid.try_+linewidth + (y*cellHeight), qgrid.tlx, qgrid.try_+linewidth + (y*cellHeight));
			}
			glw.quad(qgrid.blx, qgrid.bly - linewidth, qgrid.brx, qgrid.bly - linewidth, qgrid.brx, qgrid.bly, qgrid.blx, qgrid.bly);


		}

///		console.log("drawGL-OUT");
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.OnAllFinished = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsAnimationRunning = function ()
	{
		return this.runAnimation;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetZcam = function (Zcam)
	{
		if(Zcam < kZcamMin)
			Zcam = kZcamMin;

		this.Zcam = Zcam;
	}
	
	Acts.prototype.SetCameraSize = function (width, height)
	{
		this.cameraWidth = width;
		this.cameraHeight = height;
	}

	Acts.prototype.RunAnimation = function ()
	{
		this.runAnimation = true;
		this.somethingtoprocess = true;
	}

	Acts.prototype.StopAnimation = function ()
	{
		this.runAnimation = false;
		this.somethingtoprocess = false;
	}

	/*Acts.prototype.ResetAnimation = function ()
	{
		for(var x=0; x<this.columns;x++)
		{
			for(var y=0; y<this.rows;y++)
			{
				this.cells[y][x].stateAngleHorz = this.cells[y][x].stateAngleVert = 0;
			}
		}

		for(var i=0; i<this.sides.length; i++)
		{
			pluginProto.acts._RebuildSideCells.apply(this,[i]);
		}

		this.somethingtoprocess = true;
	}*/

	Acts.prototype.Refresh = function ()
	{
		this.somethingtoprocess = true;
	}

	Acts.prototype._SetTexture = function (object_type, index)
    {
        var obj = object_type.getFirstPicked();
        if(!obj)
            return; //no obj picked
            
        var sprite = obj.curFrame;
        var texture_2d = null;
        var texture_webgl= null;
        if(!sprite)
        {   
            // canvas and paster
            if(obj.canvas)
                texture_2d = obj.canvas;
            if(obj.tex)
                texture_webgl = obj.tex;
            if(obj.texture)
                texture_webgl = obj.texture;
            //tiledbg, particles, 
            if(obj.texture_img)  
            {
                texture_2d = obj.texture_img;
                texture_webgl = obj.webGL_texture;
            }
        }
        
        this.update_bbox();
        var glw = this.runtime.glwrap;
        if(glw && (sprite || texture_webgl))
        {
            glw.setTexture(null);
            glw.setRenderingToTexture(this.sides[index]);

            glw.setOpacity(this.opacity);   // v1.2
            
            var old_width = glw.width;
            var old_height = glw.height;
			glw.setSize(this.sides[index].c2width, this.sides[index].c2height);
            
            glw.resetModelView();
			glw.scale(1, -1);
            glw.translate((this.sides[index].c2width) / -2, (this.sides[index].c2height) / -2);
            glw.updateModelView();
            
			var x1 = 0;
			var y1 = 0;
			var x2 = this.sides[index].c2width;
			var y2 = 0;
			var x3 = x2;
			var y3 = this.sides[index].c2height;
			var x4 = 0;
			var y4 = y3;

            if(sprite)
            {
                glw.setTexture(obj.curWebGLTexture);
                if (sprite.spritesheeted)
                    glw.quadTex(x1,y1,x2,y2,x3,y3,x4,y4, sprite.sheetTex);
                else
                    glw.quad(x1,y1,x2,y2,x3,y3,x4,y4);
            }
            else
            {
                glw.setTexture(texture_webgl);
                glw.quad(x1,y1,x2,y2,x3,y3,x4,y4);
            }
            glw.setRenderingToTexture(null);
            glw.setSize(old_width, old_height);
        }
        
		pluginProto.acts._RebuildSideCells.apply(this,[index]);
	};

	Acts.prototype._SetCellTexture = function (column, row, object_type, index)
	{
	    var obj = object_type.getFirstPicked();
	    if (!obj)
	        return; //no obj picked

	    var sprite = obj.curFrame;
	    var texture_2d = null;
	    var texture_webgl = null;
	    if (!sprite)
	    {
	        // canvas and paster
	        if (obj.canvas)
	            texture_2d = obj.canvas;
	        if (obj.tex)
	            texture_webgl = obj.tex;
	        if (obj.texture)
	            texture_webgl = obj.texture;
	        //tiledbg, particles, 
	        if (obj.texture_img)
	        {
	            texture_2d = obj.texture_img;
	            texture_webgl = obj.webGL_texture;
	        }
	    }

	    this.update_bbox();
	    var glw = this.runtime.glwrap;
	    if (glw && (sprite || texture_webgl))
	    {
	        glw.setTexture(null);

	        var x = column;
	        var y = row;
	        var cellWidth = Math.floor(this.cameraWidth / this.columns);
	        var cellHeight = Math.floor(this.cameraHeight / this.rows);

	        var cellWidthPad = this.cameraWidth - cellWidth * this.columns;
	        var cellHeightPad = this.cameraHeight - cellHeight * this.rows;

	        var actualCellWidth;
	        var actualCellHeight;

	        var colStart = column;
	        var rowStart = row;
	        var colEnd = colStart;
	        var rowEnd = rowStart;

	        if (column == -1)
	        {
	            colStart = 0;
	            colEnd = this.columns - 1;
	        }
	        if (row == -1)
	        {
	            rowStart = 0;
	            rowEnd = this.rows - 1;
	        }
			
			if(colStart < 0 || colStart > this.columns-1 || rowStart < 0 || rowStart > this.rows-1)
			{
				console.warn("SetCellTexture: out of range");
				return;
			}

	        for (row = rowStart; row <= rowEnd && rowEnd >= 0; row++)
	        {
	            for (column = colStart; column <= colEnd & colEnd >= 0; column++)
	            {
	                x = column;
	                y = row;
	                this.runtime.glwrap.deleteTexture(this.cells[y][x].Sides[index]);

	                if (x == this.columns - 1)
	                {
	                    actualCellWidth = cellWidth + cellWidthPad;
	                }
	                else
	                {
	                    actualCellWidth = cellWidth;
	                }
	                if (y == this.rows - 1)
	                {
	                    actualCellHeight = cellHeight + cellHeightPad;
	                }
	                else
	                {
	                    actualCellHeight = cellHeight;
	                }
	                this.cells[y][x].Sides[index] = this.runtime.glwrap.createEmptyTexture(actualCellWidth, actualCellHeight, this.runtime.linearSampling, false);


	                glw.setRenderingToTexture(this.cells[y][x].Sides[index]);

	                glw.setOpacity(this.opacity);   // v1.2

	                var x1 = 0;
	                var y1 = 0;
	                var x2 = obj.width;
	                var y2 = 0;
	                var x3 = x2;
	                var y3 = obj.height;
	                var x4 = 0;
	                var y4 = y3;

	                var old_width = glw.width;
	                var old_height = glw.height;
	                //glw.setSize(this.sides[index].c2width, this.sides[index].c2height);
	                glw.setSize(actualCellWidth, actualCellHeight);

	                glw.resetModelView();
	                glw.scale(1, -1);
	                glw.translate(x2 / -2, y3 / -2);
	                glw.updateModelView();


	                if (sprite)
	                {
	                    glw.setTexture(obj.curWebGLTexture);
	                    if (sprite.spritesheeted)
	                        glw.quadTex(x1, y1, x2, y2, x3, y3, x4, y4, sprite.sheetTex);
	                    else
	                        glw.quad(x1, y1, x2, y2, x3, y3, x4, y4);
	                }
	                else
	                {
	                    glw.setTexture(texture_webgl);
	                    glw.quad(x1, y1, x2, y2, x3, y3, x4, y4);
	                }
	                glw.setRenderingToTexture(null);
	                glw.setSize(old_width, old_height);
	            }
	        }
	    }
	}

	Acts.prototype.Empty = function ()
	{
	    if (!this.runtime.gl)
	        return;

		this.runtime.glwrap.deleteTexture(this.sides[kFrontTextureIndex]);
		this.sides[kFrontTextureIndex] = this.runtime.glwrap.createEmptyTexture(this.cameraWidth, this.cameraHeight, this.runtime.linearSampling, false);

		this.runtime.glwrap.deleteTexture(this.sides[kBackTextureIndex]);
		this.sides[kBackTextureIndex] = this.runtime.glwrap.createEmptyTexture(this.cameraWidth, this.cameraHeight, this.runtime.linearSampling, false);

		this.runtime.glwrap.deleteTexture(this.currentTexture);
		this.currentTexture = this.runtime.glwrap.createEmptyTexture(this.width, this.height, this.runtime.linearSampling, false);

		console.log("Empty()");
console.log("Width:"+this.width);
console.log("Height:"+this.height);
console.log("tWidth:"+this.currentTexture.c2width);
console.log("tHeight:"+this.currentTexture.c2height);
console.log("sWidth:"+this.sides[0].c2width);
console.log("sHeight:"+this.sides[0].c2height);
	};

	Acts.prototype.SetGridDimensions = function (columns, rows)
	{
		if(columns < 0 || rows < 0)
		{
			console.warn("SetGridDimensions: out of range");
			return;
		}
		this.columns = columns;
		this.rows = rows;

		this.cells = new Array(this.columns);
		for(var y=0; y<this.rows; y++)
		{
			this.cells[y] = new Array(this.columns);
			for(var x=0; x<this.columns;x++)
			{
				this.cells[y][x] = new CellData();
			}
		}
	};

	Acts.prototype.SetFrontTexture = function (object_type)
    {
		pluginProto.acts._SetTexture.apply(this,[object_type, kFrontTextureIndex]);
    };

	Acts.prototype.SetBackTexture = function(object_type)
	{
		pluginProto.acts._SetTexture.apply(this,[object_type, kBackTextureIndex]);
	};
	
	// note: rotAxis is index=0, or index=1, translates to 1 or 2!
	Acts.prototype.SetCellParameters = function(column,row,front,back,rate,rotAxis,target,delay)
	{
	    pluginProto.acts.SetCellParametersExplicit.apply(this, [column, row, front, back, rate, rotAxis == 1 ? kRotationOnYaxis : kRotationOnXaxis, target, delay]);
	}

	Acts.prototype.SetCellParametersExplicit = function (column, row, front, back, rate, rotAxis, target, delay)
	{
	    var colStart = column;
	    var rowStart = row;
	    var colEnd = colStart;
	    var rowEnd = rowStart;

	    if (column == -1)
	    {
	        colStart = 0;
	        colEnd = this.columns - 1;
	    }
	    if (row == -1)
	    {
	        rowStart = 0;
	        rowEnd = this.rows - 1;
	    }
		
		if(colStart < 0 || colStart > this.columns-1 || rowStart < 0 || rowStart > this.rows-1)
		{
			console.warn("SetCellParameters: out of range");
			return;
		}

	    for (row = rowStart; row <= rowEnd && rowEnd >= 0; row++)
	    {
	        for (column = colStart; column <= colEnd & colEnd >= 0; column++)
	        {
	            if (target < 0)
	            {
	                this.cells[row][column].stateDirection = -1;
	                this.cells[row][column].Target = (target * Math.PI) / -180;
	            }
	            else
	            {
	                this.cells[row][column].stateDirection = 1;
	                this.cells[row][column].Target = (target * Math.PI) / 180;
	            }
	            this.cells[row][column].SideIndexFront = front;
	            this.cells[row][column].SideIndexBack = back;
	            this.cells[row][column].Rate = (rate * Math.PI) / 180;
	            this.cells[row][column].RotationAxis = rotAxis;
	            this.cells[row][column].Delay = delay;

	            this.cells[row][column].stateAngleHorz = this.cells[row][column].stateAngleVert = 0;
	            this.cells[row][column].stateCurrentSide = front;
	        }
	    }
	}

	Acts.prototype.ResetCell = function (column, row)
	{
	    var colStart = column;
	    var rowStart = row;
	    var colEnd = colStart;
	    var rowEnd = rowStart;

	    if (column == -1)
	    {
	        colStart = 0;
	        colEnd = this.columns - 1;
	    }
	    if (row == -1)
	    {
	        rowStart = 0;
	        rowEnd = this.rows - 1;
	    }

		if(colStart < 0 || colStart > this.columns-1 || rowStart < 0 || rowStart > this.rows-1)
		{
			console.warn("ResetCell: out of range");
			return;
		}
		
	    for (row = rowStart; row <= rowEnd && rowEnd >= 0; row++)
	    {
	        for (column = colStart; column <= colEnd & colEnd >= 0; column++)
	        {
	            this.cells[row][column].stateAngleHorz = this.cells[row][column].stateAngleVert = 0;
	        }
	    }
	}

	Acts.prototype.SetCellFrontTexture = function (column, row, object_type)
	{
	    pluginProto.acts._SetCellTexture.apply(this, [column, row, object_type, kFrontTextureIndex]);
	}

	Acts.prototype.SetCellBackTexture = function (column, row, object_type)
	{
	    pluginProto.acts._SetCellTexture.apply(this, [column, row, object_type, kBackTextureIndex]);
	}


    /*	Acts.prototype.CellDump = function(column,row)
	{
		console.log("("+column + "," + row + "): fr=" + this.cells[row][column].SideIndexFront + ", bk=" + this.cells[row][column].SideIndexBack + ", R=" + this.cells[row][column].Rate + ", A=" + this.cells[row][column].RotationAxis + ", T=" + this.cells[row][column].Target + ", D=" + this.cells[row][column].Delay + ", sAH=" + this.cells[row][column].stateAngleHorz + ", sAV=" + this.cells[row][column].stateAngleVert + ", sCS=" + this.cells[row][column].stateCurrentSide + ", sDr=" + this.cells[row][column].stateDirection);
	}*/

	// Internal action extensions
	Acts.prototype._RebuildSideCells = function (index)
	{
	    var glw = this.runtime.glwrap;
	    if (!glw)
	        return;

		var old_width = glw.width;
		var old_height = glw.height;

		glw.setTexture(null);

		var cellWidth = Math.floor(this.cameraWidth/this.columns);
		var cellHeight = Math.floor(this.cameraHeight/this.rows);

		var cellWidthPad = this.cameraWidth - cellWidth*this.columns;
		var cellHeightPad = this.cameraHeight - cellHeight*this.rows;

		//cellWidthPad = cellHeightPad = 0;

		var q = this.bquad;

		var x1 = 0;
		var y1 = 0;
		var x2 = this.cameraWidth;
		var y2 = 0;
		var x3 = x2;
		var y3 = this.cameraHeight;
		var x4 = 0;
		var y4 = y3;

		var actualCellWidth;
		var actualCellHeight;

		for(var x=0; x<this.columns;x++)
		{
			for(var y=0; y<this.rows;y++)
			{
				if(this.cells[y][x].Sides[index] == null || this.cells[y][x].Sides[index].c2Width != cellWidth || this.cells[y][x].Sides[index].c2Height != cellHeight)
				{
					this.runtime.glwrap.deleteTexture(this.cells[y][x].Sides[index]);

					if(x == this.columns-1)
					{
						actualCellWidth = cellWidth + cellWidthPad;
					}
					else
					{
						actualCellWidth = cellWidth;
					}
					if(y == this.rows-1)
					{
						actualCellHeight = cellHeight + cellHeightPad;
					}
					else
					{
						actualCellHeight = cellHeight;
					}
					this.cells[y][x].Sides[index] = this.runtime.glwrap.createEmptyTexture(actualCellWidth, actualCellHeight, this.runtime.linearSampling, false);
				}
				glw.setRenderingToTexture(this.cells[y][x].Sides[index]);

				glw.setOpacity(this.opacity);   // v1.2

			    // Set the cropping size to the cell size (width&height).
				glw.setSize(actualCellWidth, actualCellHeight);
				glw.resetModelView();
				glw.scale(1, -1);
				glw.translate(-(x*cellWidth + actualCellWidth/2),-(y*cellHeight + actualCellHeight/2));
				glw.updateModelView();

				glw.setTexture(this.sides[index]);
                glw.quad(x1,y1,x2,y2,x3,y3,x4,y4);
			}
		}
		glw.setRenderingToTexture(null);
		glw.setSize(old_width, old_height);
	}

	Acts.prototype.SetGridVisibility = function (index)
	{
		this.showgrid = (index === 0);		// 0=show, 1=hide
		this.runtime.redraw = true;
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Columns = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.columns);		// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.Rows = function (ret)
	{
		ret.set_int(this.rows);
	};

	Exps.prototype.CellTextureIndex = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.cells[row][column].stateCurrentSide);
	};

	Exps.prototype.IsAnimationRunning = function(ret)
	{
		ret.set_int(this.runAnimation ? 1 : 0);
	}
	
	Exps.prototype.Zcam = function(ret)
	{
		ret.set_float(this.Zcam);
	}
	
	Exps.prototype.CameraWidth = function(ret)
	{
		ret.set_float(this.cameraWidth);
	}
	
	Exps.prototype.CameraHeight = function(ret)
	{
		ret.set_float(this.cameraHeight);
	}

	Exps.prototype.IsGridVisible = function(ret)
	{
		ret.set_int(this.showgrid ? 1 : 0);
	}

	// Cell expressions
	
	Exps.prototype.CellTextureFrontIndex = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.cells[row][column].SideIndexFront);
	};

	Exps.prototype.CellTextureBackIndex = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.cells[row][column].SideIndexBack);
	};
	
	Exps.prototype.CellHorzAngle = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_float(Math.round(((this.cells[row][column].stateAngleHorz * 180)/Math.PI * this.cells[row][column].stateDirection)*10)/10);
	}

	Exps.prototype.CellVertAngle = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_float(Math.round(((this.cells[row][column].stateAngleVert * 180)/Math.PI * this.cells[row][column].stateDirection)*10)/10);
	}
	
	Exps.prototype.CellRate = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_float(Math.round(((this.cells[row][column].Rate * 180)/Math.PI)*10)/10);
	}

	Exps.prototype.CellRotationAxis = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.cells[row][column].RotationAxis);
	};

	Exps.prototype.CellTargetAngle = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_float(Math.round(((this.cells[row][column].Target * 180)/Math.PI * this.cells[row][column].stateDirection)*10)/10);
	}

	Exps.prototype.CellDelay = function(ret, column, row)
	{
		if(column < 0 || column > this.columns-1 || row < 0 || row > this.rows-1)
		{
			console.warn("CellTextureIndex: out of range");
			ret.set_int(-1);
			return;
		}
		ret.set_int(this.cells[row][column].Delay);
	};

	Exps.prototype.CellGetColumnByPoint = function(ret, x, y)
	{
		var result = -1;

        this.update_bbox();

		var cellWidth = Math.floor(this.cameraWidth/this.columns);

		var top = this.bbox.top;
		var left = this.bbox.left;
		var bottom = this.bbox.bottom;
		var right = this.bbox.right;

		//console.log("TL:" + top + "," + left + " BR:" + bottom + "," + right);

		top += (this.height-this.cameraHeight)/2;
		left += (this.width-this.cameraWidth)/2;

		bottom = top + this.cameraHeight;
		right = left + this.cameraWidth;

		//console.log("TL':" + top + "," + left + " BR':" + bottom + "," + right);

		if(x >= left && x<=right && y >= top && y <= bottom)
		{
			result = Math.floor((x-left)/cellWidth);

			// deal with odd size on right.
			if(result > this.columns-1)
			{
				result--;
			}
		}

		ret.set_int(result);
	};

	Exps.prototype.CellGetRowByPoint = function(ret, x, y)
	{
		var result = -1;

        this.update_bbox();

		var cellHeight = Math.floor(this.cameraHeight/this.rows);

		var top = this.bbox.top;
		var left = this.bbox.left;
		var bottom = this.bbox.bottom;
		var right = this.bbox.right;

		//console.log("TL:" + top + "," + left + " BR:" + bottom + "," + right);

		top += (this.height-this.cameraHeight)/2;
		left += (this.width-this.cameraWidth)/2;

		bottom = top + this.cameraHeight;
		right = left + this.cameraWidth;

		//console.log("TL':" + top + "," + left + " BR':" + bottom + "," + right);

		if(x >= left && x<=right && y >= top && y <= bottom)
		{
			result = Math.floor((y-top)/cellHeight);

			// deal with odd size on right.
			if(result > this.rows-1)
			{
				result--;
			}
		}

		ret.set_int(result);
	};
	
	pluginProto.exps = new Exps();

}());

function CellData()
{
    // The combination of the angles tels us which face should be showing, front or back.
    this.SideIndexFront = 0;	// The index of the front side of the tile; 0-180deg.
    this.SideIndexBack = 1;		// The index of the back side to show next, as we pass the 180deg angle mark; 181-360deg.
    this.Rate = 2;				// The rate of rotation, in degrees per second.
    this.RotationAxis = 1;		// 0 is none, 1 is Horizontal, 2 is Vertical.
    this.Target = 0;    //1 * Math.PI;	// Target to rotate to, in RADIANS.
    this.Delay = 0;				// ms

    // Get the two initial side textures set up.
    var initialSides = 2;
    this.Sides = new Array(initialSides);
    for (var i = 0; i < initialSides; i++)
    {
        this.Sides[i] = null;
    }

    // states
    this.stateAngleHorz = 0;		// Angle we are at in the horizontal - RADIANS - accumulative value
    this.stateAngleVert = 0;		// Angle we are at in the vertical
    this.stateCurrentSide = 0;      // The current side/index that is showing.
    this.stateDirection = 1;		// 1 for POS rotation, -1 for NEG rotation
}
