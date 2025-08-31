﻿"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.ShukovsSprite = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.ShukovsSprite.prototype;
		
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{		
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
										 0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		
		return this.datauri;
	};

	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
			
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		
		this.all_frames = [];
		this.has_loaded_textures = false;
		
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.frames = [];
			
			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameobj = {};
				frameobj.texture_file = frame[0];
				frameobj.texture_filesize = frame[1];
				frameobj.offx = frame[2];
				frameobj.offy = frame[3];
				frameobj.width = frame[4];
				frameobj.height = frame[5];
				frameobj.duration = frame[6];
				frameobj.hotspotX = frame[7];
				frameobj.hotspotY = frame[8];
				frameobj.image_points = frame[9];
				frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";
				frameobj.getDataUri = frame_getDataUri;
				
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				
				frameobj.webGL_texture = null;
				
				wt = this.runtime.findWaitingTexture(frame[0]);
				
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img.cr_src = frame[0];
					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			
			cr.seal(animobj);
			this.animations[i] = animobj;
		}
	};
	
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		var i, len, frame;
		
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		
		this.has_loaded_textures = false;
		
		this.updateAllCurrentTexture();
	};
	
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
			
		var i, len, frame;
		
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		
		this.updateAllCurrentTexture();
	};
	
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
			
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		
		this.has_loaded_textures = true;
	};
	
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.has_loaded_textures)
			return;
			
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			
			this.runtime.glwrap.deleteTexture(frame.webGL_texture);
			frame.webGL_texture = null;
		}
		
		this.has_loaded_textures = false;
	};
	
	var already_drawn_images = [];
	
	typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		cr.clearArray(already_drawn_images);
		
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
				
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		var poly_pts = this.type.animations[0].frames[0].poly_pts;
		
		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);
		this.isTicking = false;
		this.inAnimTrigger = false;
		this.collisionsEnabled = (this.properties[5] !== 0);
		
		this.cur_animation = this.getAnimationByName(this.properties[3]) || this.type.animations[0];
		this.cur_frame = this.properties[4];
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
			
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;
			
		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;
		
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.cur_anim_speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();
		
		this.frameStart = this.getNowTime();
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";
		
		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;
		
		this.type.loadTextures();
		
		var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;

					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}
		
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		
		// Mesh
		this.meshCols = this.properties[6];
		this.meshRows = this.properties[7];
		this.deformedVertices = {};
		this.deformationHandles = {};
	};
	
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto,
			"mc": this.meshCols,
			"mr": this.meshRows,
			"dv": this.deformedVertices,
			"dh": this.deformationHandles
		};
		
		if (!this.animPlaying)
			o["ap"] = this.animPlaying;
			
		if (!this.animForwards)
			o["af"] = this.animForwards;
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		var anim = this.getAnimationBySid(o["a"]);
		
		if (anim)
			this.cur_animation = anim;
		
		this.cur_frame = o["f"];
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		
		this.cur_anim_speed = o["cas"];
		this.frameStart = o["fs"];
		this.animRepeats = o["ar"];
		this.animTimer.reset();
		this.animTimer.sum = o["at"];
		this.animPlaying = o.hasOwnProperty("ap") ? o["ap"] : true;
		this.animForwards = o.hasOwnProperty("af") ? o["af"] : true;
		
		if (o.hasOwnProperty("rt"))
			this.cur_anim_repeatto = o["rt"];
		else
			this.cur_anim_repeatto = this.cur_animation.repeatto;
			
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.collision_poly.set_pts(this.curFrame.poly_pts);
		this.hotspotX = this.curFrame.hotspotX;
		this.hotspotY = this.curFrame.hotspotY;
		
		this.meshCols = o["mc"];
		this.meshRows = o["mr"];
		this.deformedVertices = o["dv"];
		this.deformationHandles = o["dh"];
	};
	
	instanceProto.animationFinish = function (reverse)
	{
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		
		this.animTriggerName = this.cur_animation.name;
		
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.ShukovsSprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.ShukovsSprite.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;
			
		this.animRepeats = 0;
	};
	
	instanceProto.getNowTime = function()
	{
		return this.animTimer.sum;
	};
	
	instanceProto.tick = function()
	{
		this.animTimer.add(this.runtime.getDt(this));
		
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();
		
		var now = this.getNowTime();
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;
		
		if (this.animPlaying && now >= this.frameStart + cur_frame_time)
		{			
			if (this.animForwards)
			{
				this.cur_frame++;
			}
			else
			{
				this.cur_frame--;
			}
				
			this.frameStart += cur_frame_time;
			
			if (this.cur_frame >= cur_animation.frames.length)
			{
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
				}
				else if (cur_animation.loop)
				{
					this.cur_frame = this.cur_anim_repeatto;
				}
				else
				{					
					this.animRepeats++;
					
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						this.animationFinish(false);
					}
					else
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
				}
			}
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					
					if (!cur_animation.loop)
					{
						this.animRepeats++;
							
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
					}
				}
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
					else
					{
						this.animRepeats++;
						
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
						else
						{
							this.cur_frame = this.cur_anim_repeatto;
						}
					}
				}
			}
			
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
				
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				this.frameStart = now;
			}
				
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
				
			this.runtime.redraw = true;
		}
	};
	
	instanceProto.getAnimationByName = function (name_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			
			if (cr.equals_nocase(a.name, name_))
				return a;
		}
		
		return null;
	};
	
	instanceProto.getAnimationBySid = function (sid_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			
			if (a.sid === sid_)
				return a;
		}
		
		return null;
	};
	
	instanceProto.doChangeAnim = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		
		var anim = this.getAnimationByName(this.changeAnimName);
		
		this.changeAnimName = "";
		
		if (!anim)
			return;
			
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
			
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		this.cur_anim_repeatto = anim.repeatto;
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
			
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
			
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		
		this.runtime.redraw = true;
	};
	
	instanceProto.doChangeAnimFrame = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var prev_frame_number = this.cur_frame;
		
		this.cur_frame = cr.floor(this.changeAnimFrame);
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
			
		if (prev_frame_number !== this.cur_frame)
		{
			this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
			this.frameStart = this.getNowTime();
			this.runtime.redraw = true;
		}
		
		this.changeAnimFrame = -1;
	};
	
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
			
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();
		
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		
		this.runtime.trigger(cr.plugins_.ShukovsSprite.prototype.cnds.OnFrameChanged, this);
	};

	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
			
		// The current animation frame to draw
		var cur_frame = this.curFrame;
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		
		// Object not rotated: can draw without transformation.
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 myx, myy, w, h);
			}
			else
			{
				ctx.drawImage(cur_image, myx, myy, w, h);
			}
		}
		else
		{
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
			
			var drawx = 0 - (this.hotspotX * cr.abs(w))
			var drawy = 0 - (this.hotspotY * cr.abs(h));
			
			// Draw the object; canvas origin is at hot spot.
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 drawx, drawy, cr.abs(w), cr.abs(h));
			}
			else
			{
				ctx.drawImage(cur_image, drawx, drawy, cr.abs(w), cr.abs(h));
			}
			
			// Restore previous state.
			ctx.restore();
		}
			
		// TODO: support mesh deformation in canvas2D if possible
	};
	
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	
	instanceProto.getMeshVertex = function(c, r, hsX, hsY, absW, absH)
	{
		var default_u = c / this.meshCols;
		var default_v = r / this.meshRows;
		var delta_u = 0;
		var delta_v = 0;
		
		for (var key in this.deformedVertices)
		{
			if (this.deformedVertices.hasOwnProperty(key))
			{
				var def = this.deformedVertices[key];
				var parts = key.split("-");
				var h_c = parseInt(parts[0], 10);
				var h_r = parseInt(parts[1], 10);
				var dist_sq = (c - h_c) * (c - h_c) + (r - h_r) * (r - h_r);
				var w = def.weight;
				var influence;
				if (dist_sq === 0)
					influence = 1;
				else
					influence = w / (w + dist_sq);
				
				delta_u += influence * (def.u - def.def_u);
				delta_v += influence * (def.v - def.def_v);
			}
		}
		
		var u = default_u + delta_u;
		var v = default_v + delta_v;
		
		var x = (u - hsX) * absW;
		var y = (v - hsY) * absH;
		return {x: x, y: y};
	};
	
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		
		var cur_frame = this.curFrame;
		
		var hsX = this.hotspotX;
		var hsY = this.hotspotY;
		var absW = Math.abs(this.width);
		var absH = Math.abs(this.height);
		var signX = (this.width >= 0 ? 1 : -1);
		var signY = (this.height >= 0 ? 1 : -1);
		var angle = this.angle;
		var cosA = Math.cos(angle);
		var sinA = Math.sin(angle);
		var cols = this.meshCols;
		var rows = this.meshRows;
		
		var fullTex = cur_frame.sheetTex;
		if (!fullTex)
			fullTex = new cr.rect(0, 0, 1, 1);
		
		var texW = fullTex.right - fullTex.left;
		var texH = fullTex.bottom - fullTex.top;
		
		for (var row = 0; row < rows; row++)
		{
			for (var col = 0; col < cols; col++)
			{
				var v00 = this.getMeshVertex(col, row, hsX, hsY, absW, absH);
				var v10 = this.getMeshVertex(col + 1, row, hsX, hsY, absW, absH);
				var v11 = this.getMeshVertex(col + 1, row + 1, hsX, hsY, absW, absH);
				var v01 = this.getMeshVertex(col, row + 1, hsX, hsY, absW, absH);
				
				v00.x *= signX;
				v00.y *= signY;
				v10.x *= signX;
				v10.y *= signY;
				v11.x *= signX;
				v11.y *= signY;
				v01.x *= signX;
				v01.y *= signY;
				
				var wx00 = cosA * v00.x - sinA * v00.y + this.x;
				var wy00 = sinA * v00.x + cosA * v00.y + this.y;
				var wx10 = cosA * v10.x - sinA * v10.y + this.x;
				var wy10 = sinA * v10.x + cosA * v10.y + this.y;
				var wx11 = cosA * v11.x - sinA * v11.y + this.x;
				var wy11 = sinA * v11.x + cosA * v11.y + this.y;
				var wx01 = cosA * v01.x - sinA * v01.y + this.x;
				var wy01 = sinA * v01.x + cosA * v01.y + this.y;
				
				var subL = fullTex.left + texW * (col / cols);
				var subT = fullTex.top + texH * (row / rows);
				var subR = fullTex.left + texW * ((col + 1) / cols);
				var subB = fullTex.top + texH * ((row + 1) / rows);
				
				var rcTex = new cr.rect(subL, subT, subR, subB);
				
				glw.quadTex(wx00, wy00, wx10, wy10, wx11, wy11, wx01, wy01, rcTex);
			}
		}
	};
	
	instanceProto.set_bbox_changed = function ()
	{
		this.bbox_changed = true;
		this.type.any_instance_parallaxed = true;
		this.runtime.redraw = true;
		
		// Recalculate bbox based on deformed vertices
		var minx = Infinity;
		var miny = Infinity;
		var maxx = -Infinity;
		var maxy = -Infinity;
		
		var hsX = this.hotspotX;
		var hsY = this.hotspotY;
		var absW = Math.abs(this.width);
		var absH = Math.abs(this.height);
		var signX = (this.width >= 0 ? 1 : -1);
		var signY = (this.height >= 0 ? 1 : -1);
		var cosA = Math.cos(this.angle);
		var sinA = Math.sin(this.angle);
		
		for (var row = 0; row <= this.meshRows; row++)
		{
			for (var col = 0; col <= this.meshCols; col++)
			{
				var v = this.getMeshVertex(col, row, hsX, hsY, absW, absH);
				v.x *= signX;
				v.y *= signY;
				var wx = cosA * v.x - sinA * v.y + this.x;
				var wy = sinA * v.x + cosA * v.y + this.y;
				
				if (wx < minx) minx = wx;
				if (wx > maxx) maxx = wx;
				if (wy < miny) miny = wy;
				if (wy > maxy) maxy = wy;
			}
		}
		
		this.bbox.set(minx, miny, maxx, maxy);
		this.bquad.set_from_rect(this.bbox);
		
		if (this.collisionsEnabled)
			this.type.update_colls(this);
	};

	var arrCache = [];
	
	function allocArr()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [0, 0, 0];
	};
	
	function freeArr(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache.push(a);
	};
	
	function makeCollKey(a, b)
	{
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	
	function collmemory_add(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;

		var key = makeCollKey(a_uid, b_uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			collmemory[key][2] = tickcount;
			return;
		}
		
		var arr = allocArr();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	
	function collmemory_remove(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			freeArr(collmemory[key]);
			delete collmemory[key];
		}
	};
	
	function collmemory_removeInstance(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	
	var last_coll_tickcount = -2;
	
	function collmemory_has(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount = -2;
			return false;
		}
	};
	
	var candidates1 = [];
	
	function Cnds() {};

	Cnds.prototype.OnCollision = function (rtype)
	{	
		if (!rtype)
			return false;
			
		var runtime = this.runtime;
			
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		var collmemory = null;
		
		if (cnd.extra["collmemory"])
		{
			collmemory = cnd.extra["collmemory"];
		}
		else
		{
			collmemory = {};
			cnd.extra["collmemory"] = collmemory;
		}
		
		if (!cnd.extra["spriteCreatedDestroyCallback"])
		{
			cnd.extra["spriteCreatedDestroyCallback"] = true;
			
			runtime.addDestroyCallback(function(inst) {
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}
		
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		
		var l, linst, r, rinst;
		var curlsol, currsol;
		
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			
			if (rsol.select_all)
			{
				linst.update_bbox();
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
				
				this.runtime.addRegisteredCollisionCandidates(linst, rtype, rinstances);
			}
			else
			{
				rinstances = rsol.getObjects();
			}
			
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));
					
					collmemory_add(collmemory, linst, rinst, tickcount);
					
					if (run)
					{						
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					collmemory_remove(collmemory, linst, rinst);
				}
			}
			
			cr.clearArray(candidates1);
		}
		
		return false;
	};
	
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	
	var candidates2 = [];
	var temp_bbox = new cr.rect(0, 0, 0, 0);
	
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
			
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		
		if (rsol.select_all)
		{
			this.update_bbox();
			
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
				rinstances = rsol.instances;
			else
				rinstances = rsol.else_instances;
		}
		else
		{
			rinstances = rsol.instances;
		}
		
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				
				if (inverted)
					break;
					
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		
		cr.clearArray(candidates2);
		return ret;
	};
	
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			
			if (sol.select_all)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);
			
				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}
				
				if (orblock)
				{
					cr.clearArray(sol.else_instances);
					
					for (i = 0, len = rpicktype.instances.length; i < len; ++i)
					{
						inst = rpicktype.instances[i];
						
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
				
					for (i = 0, len = topick.length; i < len; ++i)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			
			rpicktype.applySolToContainer();
		}
		
		rtopick.clear();
		needscollisionfinish = false;
	};
	
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	
	Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};
	
	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};
	
	Cnds.prototype.CompareFrame = function (cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};
	
	Cnds.prototype.CompareAnimSpeed = function (cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnFrameChanged = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsMirrored = function ()
	{
		return this.width < 0;
	};
	
	Cnds.prototype.IsFlipped = function ()
	{
		return this.height < 0;
	};
	
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};
	
	pluginProto.cnds = new Cnds();

	function Acts() {};

	Acts.prototype.Spawn = function (obj, layer, imgpt)
	{
		if (!obj || !layer)
			return;
			
		var inst = this.runtime.createInstance(obj, layer, this.getImagePoint(imgpt, true), this.getImagePoint(imgpt, false));
		
		if (!inst)
			return;
		
		if (typeof inst.angle !== "undefined")
		{
			inst.angle = this.angle;
			inst.set_bbox_changed();
		}
		
		this.runtime.isInOnDestroy++;
		
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		
		this.runtime.isInOnDestroy--;
		
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;
		
		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}
		
		var sol;
		
		if (obj != this.type)
		{
			sol = obj.getCurrentSol();
			sol.select_all = false;
			
			if (reset_sol)
			{
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
			}
			else
				sol.instances.push(inst);
				
			if (inst.is_contained)
			{
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					
					if (reset_sol)
					{
						cr.clearArray(sol.instances);
						sol.instances[0] = s;
					}
					else
						sol.instances.push(s);
				}
			}
		}
	};
	
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	
	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
	};
	
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	
	Acts.prototype.SetAnim = function (animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;
		
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	
	Acts.prototype.SetAnimRepeatToFrame = function (s)
	{
		s = Math.floor(s);
		
		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;
		
		this.cur_anim_repeatto = s;
	};
	
	Acts.prototype.SetMirrored = function (m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);
		
		if (this.width === neww)
			return;
			
		this.width = neww;
		this.set_bbox_changed();
	};
	
	Acts.prototype.SetFlipped = function (f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);
		
		if (this.height === newh)
			return;
			
		this.height = newh;
		this.set_bbox_changed();
	};
	
	Acts.prototype.SetScale = function (s)
	{
		var cur_frame = this.curFrame;
		var mirror_factor = (this.width < 0 ? -1 : 1);
		var flip_factor = (this.height < 0 ? -1 : 1);
		var new_width = cur_frame.width * s * mirror_factor;
		var new_height = cur_frame.height * s * flip_factor;
		
		if (this.width !== new_width || this.height !== new_height)
		{
			this.width = new_width;
			this.height = new_height;
			this.set_bbox_changed();
		}
	};
	
	Acts.prototype.LoadURL = function (url_, resize_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		
		img.onload = function ()
		{
			if (curFrame_.texture_img.src === img.src)
			{
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				
				if (resize_ === 0)
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}
				
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.ShukovsSprite.prototype.cnds.OnURLLoaded, self);
			
				return;
			}
			
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;
			
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);
					
				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				
				self.type.updateAllCurrentTexture();
			}
			
			if (resize_ === 0)
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.ShukovsSprite.prototype.cnds.OnURLLoaded, self);
		};
		
		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img["crossOrigin"] = "anonymous";
		
		this.runtime.setImageSrc(img, url_);
	};
	
	Acts.prototype.SetCollisions = function (set_)
	{
		if (this.collisionsEnabled === (set_ !== 0))
			return;
		
		this.collisionsEnabled = (set_ !== 0);
		
		if (this.collisionsEnabled)
			this.set_bbox_changed();
		else
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);
			
			this.collcells.set(0, 0, -1, -1);
		}
	};
	
	Acts.prototype.SetMeshGrid = function (cols, rows)
	{
		cols = Math.max(1, Math.floor(cols));
		rows = Math.max(1, Math.floor(rows));
		
		if (this.meshCols === cols && this.meshRows === rows)
			return;
		
		this.meshCols = cols;
		this.meshRows = rows;
		this.deformedVertices = {};
		this.deformationHandles = {};
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.CreateDeformPoint = function (index, wx, wy)
	{
		var dx = wx - this.x;
		var dy = wy - this.y;
		var a = this.angle;
		var ca = Math.cos(-a);
		var sa = Math.sin(-a);
		var lx = ca * dx - sa * dy;
		var ly = sa * dx + ca * dy;
		
		if (this.width < 0) lx = -lx;
		if (this.height < 0) ly = -ly;
		
		var absW = Math.abs(this.width);
		var absH = Math.abs(this.height);
		var u = (lx / absW) + this.hotspotX;
		var v = (ly / absH) + this.hotspotY;
		
		u = cr.clamp(u, 0, 1);
		v = cr.clamp(v, 0, 1);
		
		var grid_col = Math.round(u * this.meshCols);
		var grid_row = Math.round(v * this.meshRows);
		
		grid_col = cr.clamp(grid_col, 0, this.meshCols);
		grid_row = cr.clamp(grid_row, 0, this.meshRows);
		
		var def_u = grid_col / this.meshCols;
		var def_v = grid_row / this.meshRows;
		
		var gridKey = grid_col + "-" + grid_row;
		
		this.deformedVertices[gridKey] = {u: def_u, v: def_v, def_u: def_u, def_v: def_v, weight: 1};
		this.deformationHandles[index] = gridKey;
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.MoveDeformPoint = function (index, wx, wy)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
			return;
		
		var gridKey = this.deformationHandles[index];
		
		var dx = wx - this.x;
		var dy = wy - this.y;
		var a = this.angle;
		var ca = Math.cos(-a);
		var sa = Math.sin(-a);
		var lx = ca * dx - sa * dy;
		var ly = sa * dx + ca * dy;
		
		if (this.width < 0) lx = -lx;
		if (this.height < 0) ly = -ly;
		
		var absW = Math.abs(this.width);
		var absH = Math.abs(this.height);
		var u = (lx / absW) + this.hotspotX;
		var v = (ly / absH) + this.hotspotY;
		
		this.deformedVertices[gridKey].u = u;
		this.deformedVertices[gridKey].v = v;
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.DeleteDeformPoint = function (index)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
			return;
		
		var gridKey = this.deformationHandles[index];
		delete this.deformedVertices[gridKey];
		delete this.deformationHandles[index];
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.DeleteAllDeformPoints = function ()
	{
		this.deformedVertices = {};
		this.deformationHandles = {};
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.ResetDeformPoints = function ()
	{
		var key;
		for (key in this.deformedVertices)
		{
			if (this.deformedVertices.hasOwnProperty(key))
			{
				var def = this.deformedVertices[key];
				def.u = def.def_u;
				def.v = def.def_v;
			}
		}
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	Acts.prototype.SetDeformPointWeight = function (index, weight)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
			return;
		
		var gridKey = this.deformationHandles[index];
		this.deformedVertices[gridKey].weight = Math.max(weight, 0.001);
		
		this.set_bbox_changed();
		this.runtime.redraw = true;
	};
	
	pluginProto.acts = new Acts();
	
	function Exps() {};
	
	Exps.prototype.AnimationFrame = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	
	Exps.prototype.AnimationFrameCount = function (ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};
	
	Exps.prototype.AnimationName = function (ret)
	{
		ret.set_string(this.cur_animation.name);
	};
	
	Exps.prototype.AnimationSpeed = function (ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};
	
	Exps.prototype.ImagePointX = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};
	
	Exps.prototype.ImagePointY = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};
	
	Exps.prototype.ImagePointCount = function (ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};
	
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.curFrame.width);
	};
	
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.curFrame.height);
	};
	
	Exps.prototype.DeformPointX = function (ret, index)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
		{
			ret.set_float(0);
			return;
		}
		
		var gridKey = this.deformationHandles[index];
		var def = this.deformedVertices[gridKey];
		var u = def.u;
		var v = def.v;
		var lx = (u - this.hotspotX) * Math.abs(this.width);
		var ly = (v - this.hotspotY) * Math.abs(this.height);
		if (this.width < 0) lx = -lx;
		if (this.height < 0) ly = -ly;
		var cos_ = Math.cos(this.angle);
		var sin_ = Math.sin(this.angle);
		var wx = cos_ * lx - sin_ * ly + this.x;
		ret.set_float(wx);
	};
	
	Exps.prototype.DeformPointY = function (ret, index)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
		{
			ret.set_float(0);
			return;
		}
		
		var gridKey = this.deformationHandles[index];
		var def = this.deformedVertices[gridKey];
		var u = def.u;
		var v = def.v;
		var lx = (u - this.hotspotX) * Math.abs(this.width);
		var ly = (v - this.hotspotY) * Math.abs(this.height);
		if (this.width < 0) lx = -lx;
		if (this.height < 0) ly = -ly;
		var cos_ = Math.cos(this.angle);
		var sin_ = Math.sin(this.angle);
		var wy = sin_ * lx + cos_ * ly + this.y;
		ret.set_float(wy);
	};
	
	Exps.prototype.DeformPointCount = function (ret)
	{
		ret.set_int(Object.keys(this.deformationHandles).length);
	};
	
	Exps.prototype.DeformPointWeight = function (ret, index)
	{
		if (!this.deformationHandles.hasOwnProperty(index))
		{
			ret.set_float(0);
			return;
		}
		
		var gridKey = this.deformationHandles[index];
		var def = this.deformedVertices[gridKey];
		ret.set_float(def.weight);
	};
	
	pluginProto.exps = new Exps();

}());