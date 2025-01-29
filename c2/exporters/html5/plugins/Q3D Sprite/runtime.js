// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3Dsprite = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3Dsprite.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	
	/*function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{		
			// Get Sprite image as data URI
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
	};*/
	
	function frame_getDataUri()
	{
	//alert("called")
	
		if (this.datauri.length === 0)
		{		
		
			// Get Sprite image as data URI
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
			
			//this.datauri = tmpcanvas.toDataURL("image/png");
		}
		
		return tmpcanvas//this.datauri; // dataUri stuff uneeded, just pass the canvas itself.
	};

	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
			
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		
		this.all_frames = [];
		this.has_loaded_textures = false;
		
		// Load all animation frames
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
				//frameobj.hotspotX = frame[7];
				//frameobj.hotspotY = frame[8];
				//frameobj.image_points = frame[9];
				//frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";		// generated on demand and cached
				frameobj.getDataUri = frame_getDataUri;
				
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				
				frameobj.webGL_texture = null;
				
				// Sprite sheets may mean multiple frames reference one image
				// Ensure image is not created in duplicate
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
					
					// Tell runtime to wait on this texture
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			
			cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	};
	
	// for now, im not going to handle lost contexts, its too much trouble with everything else and really difficult to test
	
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	
	/*typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		var i, len, frame;
		
		// Release all animation frames
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		
		this.has_loaded_textures = false;
		
		this.updateAllCurrentTexture();
	};*/
	
	/*typeProto.onRestoreWebGLContext = function ()
	{
		// No need to create textures if no instances exist, will create on demand
		if (this.is_family || !this.instances.length)
			return;
			
		var i, len, frame;
		
		// Re-load all animation frames
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		
		this.updateAllCurrentTexture();
	}; */
	
	/*typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
			
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			
			frame.webGL_texture = new THREE.Texture()//this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
			frame.webGL_texture.image = frame.texture_img;
			frame.webGL_texture.needsUpdate = true;
		}
		
		this.has_loaded_textures = true;
	};*/
	
		typeProto.loadTextures3D = function ()
	{
		if (this.is_family || this.has_loaded_textures /*|| !this.runtime.glwrap*/ || !THREE.Detector.webgl) 
		return;
			
			var i, leni, j, lenj;
			var anim, frame;
			
			for (i = 0, leni = this.all_frames.length; i < leni; ++i)
			{
				frame = this.all_frames[i];
				
				if(frame.spritesheeted) // break spritesheet into constituent images or else very weird stuff happens because of UV mapping
				{
					// this override is abit dumb, im not sure what uses getDataUri yet i abused it :< should probably change it
					frame.texture_img =  frame.getDataUri();//.src = frame.getDataUri();
					//frame.texture_img.cr_src = frame.texture_img.src;
				};
					//frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
					//necessary? yea if i remove other stuff in oncreate
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
			};
			
			for (i = 0, leni = this.animations.length; i < leni; i++)
			{
				anim = this.animations[i];
				
				for (j = 0, lenj = anim.frames.length; j < lenj; j++)
				{
					
					frame = anim.frames[j];
					
					// build normal type textures
					
					frame.webGL_texture = new THREE.Texture()
					frame.webGL_texture.image = frame.texture_img
					frame.webGL_texture.needsUpdate = true;
					
					if(!this.runtime.linearSampling){
						frame.webGL_texture.magFilter = THREE.NearestFilter;
						frame.webGL_texture.minFilter = THREE.NearestFilter;
					};					

				};
			};
			
			this.has_loaded_textures = true;
	
	};
	
	/*typeProto.unloadTextures = function () // can leverage this to have proper texture/geometry disposal for Q3D sprites and models (?)
	{
		// Don't release textures if any instances still exist, they are probably using them
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
	};*/
	
	//var already_drawn_images = [];
	
	/*typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		already_drawn_images.length = 0;
		
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
				
			// draw to preload, browser should lazy load the texture
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};*/

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
		this.setupObj(false);
		//this.SFLAG = false;
		
		this.visible = false // force renderer to early out of drawing;
		//this.obj.debugAddedFlag = false;
		
		// this is different than most, since angle and width/height are used to define sprite.
		
		this.obj.position.set(this.x,this.y,this.properties[1])
		this.obj.scale.set(this.properties[6],this.properties[7],this.properties[8]);
		this.obj.rotation.order = this.properties[2];
		this.obj.rotation.set(this.properties[3]*(THREE.Deg2Rad),this.properties[4]*(THREE.Deg2Rad),this.properties[5]*(THREE.Deg2Rad));
		this.obj.visible = this.properties[0] === 0;
		
		//if(!this.recycled)	this.col = new THREE.Object3D();
		
		if(this.properties[9] === 0){
		
			// box for visualization
			this.box = new THREE.OldBoxHelper();
			this.box.scale.set(1/2,1/2,1/2);
			this.box.material.color.setRGB( 1, 1, 1 );

			this.obj.add(this.box);
			
			// axis helper for visualization
			this.axis = new THREE.AxisHelper(1);

			this.obj.add(this.axis);
			this.axis.scale.set(50/this.obj.scale.x+0.5,50/this.obj.scale.y+0.5,50/this.obj.scale.z+0.5);
			
			//this.obj.debugAddedFlag = true;
			
			//this.runtime.tick2Me(this);
			//this.box.visible = this.properties[0] === 0;
			//this.axis.visible = this.properties[0] === 0;
		
		};
		
		//new THREE.SpriteMaterial({uvOffset: new THREE.Vector2(0.5,0),uvScale: new THREE.Vector2(1,1)})
		if(! this.recycled) this.sprite = new THREE.Sprite();
		
		this.sprite.scale.set(this.width,this.height,1);
		//for(var key in this.sprite.material) alert(key)
		//alert(this.angle);
		this.mat = this.sprite.material;
		
		this.mat.rotation = this.angle*-1; //Math.PI/4;
		//alert(this.angle)
		this.mat.opacity = this.properties[11]; //Math.PI/4;
		this.mat.color.setStyle(this.properties[10])
		
		this.obj.add(this.sprite);
		//this.sprite.updateMatrixWorld();
		//alert(this.sprite.material.rotation)
		
		// need this to update rotation and stuff;
		this.runtime.tick2Me(this);
		
		
		
		
		
		
		
		
		
		
		//var w = this.width, h = this.height, a = this.angle;
		
		this.runtime.Q3D.scene.add(this.obj);
		this.set_bbox3D_changed();
		this.fastWorldUpdate();
		/*
		this.width = w;
		this.height = h;
		this.angle = a;
		*/
		if(this.box){ 
			this.box.matrixAutoUpdate = false; // this looks nicer, parenting doesn't mess up the axial scaling, as the tree updates but not the bbox
			this.axis.matrixAutoUpdate = false;
		};// this too
	
	///////////////////////////////////////////////////////////////////////////////////////////// cloned sprite animation stuff
	
		this.isTicking = false;
		this.inAnimTrigger = false;
		//this.collisionsEnabled = (this.properties[3] !== 0);
		
		// Tick this object to change animation frame, but never tick single-animation, single-frame objects.
		// Also don't tick zero speed animations until the speed or animation is changed, which saves ticking
		// on tile sprites.
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.type.animations[0].speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		// havent decided where properties will be yet, i'll do it later
		this.cur_animation = this.getAnimationByName(this.properties[12]) || this.type.animations[0];
		//this.cur_animation = this.type.animations[0];
		this.cur_frame = this.properties[13];
		//this.cur_frame = 0;
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
			
		// Update poly and hotspot for the starting frame.
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		//this.collision_poly.set_pts(curanimframe.poly_pts);
		//this.hotspotX = curanimframe.hotspotX;
		//this.hotspotY = curanimframe.hotspotY;
			
		this.cur_anim_speed = this.cur_animation.speed;
		
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
		
		// Ensure type has textures loaded
		this.type.loadTextures3D();
		
		// Iterate all animations and frames ensuring WebGL textures are loaded and sizes are set
		/*var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				
				// If size is zero, image is not on a sprite sheet.  Determine size now.
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				
				// If frame is spritesheeted update its uv coords
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;

					// Check if frame is in fact a complete-frame spritesheet
					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}*/
		
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
	
	};

	instanceProto.tick2 = function () //called after events
	{	
		// keep sprite up to date
		this.sprite.scale.set(this.width,this.height)
		this.sprite.material.rotation = this.angle*-1
		this.sprite.material.map = this.curWebGLTexture;

		if(this.axis) this.axis.scale.set(50/this.obj.scale.x,50/this.obj.scale.y,50/this.obj.scale.z);		
	};
	
	////////////////////////////////////////////////////// copied+modified sprite animation stuff
	
	instanceProto.animationFinish = function (reverse)
	{
		// stop
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		
		// trigger finish events
		this.animTriggerName = this.cur_animation.name;
		
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Q3Dsprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Q3Dsprite.prototype.cnds.OnAnimFinished, this);
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
		
		// Change any animation or frame that was queued
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
			// Next frame
			if (this.animForwards)
			{
				this.cur_frame++;
				//log("Advancing animation frame forwards");
			}
			else
			{
				this.cur_frame--;
				//log("Advancing animation frame backwards");
			}
				
			this.frameStart += cur_frame_time;
			
			// Reached end of frames
			if (this.cur_frame >= cur_animation.frames.length)
			{
				//log("At end of frames");
				
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
					//log("Ping pong looping from end");
				}
				// Looping: wind back to repeat-to frame
				else if (cur_animation.loop)
				{
					this.cur_frame = cur_animation.repeatto;
				}
				else
				{					
					this.animRepeats++;
					
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						//log("Number of repeats reached; ending animation");
						
						this.animationFinish(false);
					}
					else
					{
						//log("Repeating");
						this.cur_frame = cur_animation.repeatto;
					}
				}
			}
			// Ping-ponged back to start
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					//log("Ping ponging back forwards");
					
					if (!cur_animation.loop)
					{
						this.animRepeats++;
							
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							//log("Number of repeats reached; ending animation");
							
							this.animationFinish(true);
						}
					}
				}
				// animation running backwards
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = cur_animation.repeatto;
					}
					else
					{
						this.animRepeats++;
						
						// Reached number of repeats
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							//log("Number of repeats reached; ending animation");
							
							this.animationFinish(true);
						}
						else
						{
							//log("Repeating");
							this.cur_frame = cur_animation.repeatto;
						}
					}
				}
			}
			
			// Don't go out of bounds
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
				
			// If frameStart is still more than a whole frame away, we must've fallen behind.  Instead of
			// going catch-up (cycling one frame per tick), reset the frame timer to now.
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				//log("Animation can't keep up, resetting timer");
				this.frameStart = now;
			}
				
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
				
			//this.runtime.redraw = true;
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
		
		// Find the animation by name
		var anim = this.getAnimationByName(this.changeAnimName);
		
		this.changeAnimName = "";
		
		// couldn't find by name
		if (!anim)
			return;
			
		// don't change if setting same animation and the animation is already playing
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
			
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
			
		// from beginning
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
			
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		
		//this.runtime.redraw = true;
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
			//this.runtime.redraw = true;
		}
		
		this.changeAnimFrame = -1;
	};
	
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		// Has the frame size changed?  Resize the object proportionally
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
			
		// Update hotspot, collision poly and bounding box
		//this.hotspotX = next_frame.hotspotX;
		//this.hotspotY = next_frame.hotspotY;
		//this.collision_poly.set_pts(next_frame.poly_pts);
		//this.set_bbox_changed();
		
		// Update webGL texture if any
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		
		// Notify behaviors
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		
		// Trigger 'on frame changed'
		this.runtime.trigger(cr.plugins_.Q3Dsprite.prototype.cnds.OnFrameChanged, this);
	};	
	
	//////////////////////////////////////////////////////
	
	instanceProto.resetMap = function ()
	{
			//this.mat.color.set( 0xffffff );
			//this.mat.ambient.set( 0xffffff );
			//this.mat.emissive.set( 0x000000);
			//this.mat.specular.set( 0x111111);
			//this.mat.shininess = 30;
			//this.mat.metal = false;
			//this.mat.bumpScale = 1;
			//this.mat.normalScale.set( 1, 1 );
			//this.mat.combine = THREE.MultiplyOperation;
			//this.mat.reflectivity = 1;
			//this.mat.refractionRatio = 0.98;
			//this.mat.fog = true;
			//this.mat.wireframe = false;
			//this.mat.opacity = 1;
			//this.mat.transparent = false;
			this.mat.blending = THREE.NormalBlending;
			this.mat.blendSrc = THREE.SrcAlphaFactor;
			this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
			this.mat.blendEquation = THREE.AddEquation;
			this.mat.depthTest = true;
			this.mat.depthWrite = true;
			this.mat.polygonOffset = false;
			this.mat.polygonOffsetFactor = 0;
			this.mat.polygonOffsetUnits = 0;
			//this.mat.side = THREE.FrontSide;
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	
	this.obj.parent.remove(this.obj);
	
	if(this.box){
		this.obj.remove(this.box);
		this.obj.remove(this.axis);
		this.box = null;
		this.axis = null;
	};
	
	this.obj.frustumCulled = true;
	
	/*if(this.traversingResetFlag){
	
		this.obj.frustumCulled = true;
		
		this.obj.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.frustumCulled = true;
				child.castShadow = false;
				child.receiveShadow = false;
							
			}
		} );
	};*/
	
	/*for ( var i = this.obj.children.length-1; i > 0; i -- ) { //iterate backwards or remove messes up!
		
		if(this.obj.children[ i ].userData.inst){ 
		//alert("called DestroyInstance : "+this )
		this.runtime.DestroyInstance(this.obj.children[ i ].userData.inst); //recursively destroy all Q3D type objects with the userData.inst flag/ref
		}

	};*/
	
	this.resetMap();
	
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
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
		/*propsections.push({
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
		});*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		/*if (name === "My property")
			this.myProperty = value;*/
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

		// ... other conditions here ...

///////////////////////////////////////////////////////////////////////////////////////////////////////////// stolen sprite animation stuff
		
		Cnds.prototype.IsAnimPlaying = function (animname)
	{
		// If awaiting a change of animation to really happen next tick, compare to that now
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
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// ... other actions here ...

///////////////////////////////////////////////////////////////////////////////////////////////////////////// stolen sprite anim stuff

	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
		//log("Stopping animation");
	};
	
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		//log("Starting animation");
		
		// from beginning
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		
		// start ticking if not already
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
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		// not in trigger: apply immediately
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		// not in trigger: apply immediately
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		
		//this.frameStart = this.runtime.kahanTime.sum;
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
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
	
	Acts.prototype.LoadURL = function (url_, resize_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		
		img.onload = function ()
		{
			// If this action was used on multiple instances, they will each try to create a
			// separate image or texture, which is a waste of memory. So if the same image has
			// already been loaded, ignore this callback.
			//alert('test');
			
			if (curFrame_.texture_img.src === img.src)
			{
				// Still may need to switch to using the image's texture in WebGL renderer
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				
				// Still need to trigger 'On loaded'
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.Q3Dsprite.prototype.cnds.OnURLLoaded, self);
			
				return;
			}
			
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;	// reset to RGBA, since we don't know what type of image will have come in
										// and it could be different to what the exporter set for the original image
			
			// WebGL renderer: need to create texture (canvas2D just draws with img directly)
			if (self.runtime.glwrap)
			{
				/*if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);*/
					
				//curFrame_.webGL_texture = //self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				
				curFrame_.webGL_texture = new THREE.Texture()
				curFrame_.webGL_texture.image = img;
				//alert('test')
				curFrame_.webGL_texture.needsUpdate = true;
				
				if(!self.runtime.linearSampling){
					curFrame_.webGL_texture.magFilter = THREE.NearestFilter;
					curFrame_.webGL_texture.minFilter = THREE.NearestFilter;
				};			
				
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				
				// Need to update other instance's curWebGLTexture
				self.type.updateAllCurrentTexture();
			
			};
			
			// Set size if necessary
			if (resize_ === 0)		// resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			
			//self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.Q3Dsprite.prototype.cnds.OnURLLoaded, self);
		};
		
		if (url_.substr(0, 5) !== "data:")
			img["crossOrigin"] = "anonymous";
		
		img.src = url_;
	};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Acts.prototype.MaterialsSetOpacity = function (Opacity)
	{
		//var mat = this.runtime.Q3D.material[name];
		//if(! this.mat ) return;
		//Trans == 0 ? this.mat.transparent = false : this.mat.transparent = true;
		//this.mat.transparent = Trans === 1;
		this.mat.opacity = Opacity;
		//if(this.mat.uniforms && this.mat.uniforms.opacity) this.mat.uniforms.opacity.value = Opacity;
	};
	
	Acts.prototype.MaterialsSetBlending = function (blend,source,dest,eqn)
	{
		//var mat = this.runtime.Q3D.material[name];
		//if(! mat ) return;
		//if(! this.mat ) return;
		
		switch(blend)
		{
		case 0:
			this.mat.blending = THREE.NoBlending;
			break;
		case 1:
			this.mat.blending =  THREE.NormalBlending;
			break;
		case 2:
			this.mat.blending = THREE.AdditiveBlending;
			break;
		case 3:
			this.mat.blending = THREE.SubtractiveBlending;
			break;
		case 4:
			this.mat.blending = THREE.MultiplyBlending;
			break;
		case 5:
			this.mat.blending = THREE.CustomBlending;
			switch(source)
			{
			case 0:
				this.mat.blendSrc = THREE.SrcAlphaFactor;
				break;
			case 1:
				this.mat.blendSrc = THREE.OneMinusSrcAlphaFactor;
				break;
			case 2:
				this.mat.blendSrc = THREE.DstAlphaFactor;
				break;
			case 3:
				this.mat.blendSrc = THREE.OneMinusDstAlphaFactor;
				break;
			case 4:
				this.mat.blendSrc = THREE.ZeroFactor;
				break;
			case 5:
				this.mat.blendSrc = THREE.OneFactor;
				break;
			case 6:
				this.mat.blendSrc = THREE.DstColorFactor;
				break;
			case 7:
				this.mat.blendSrc = THREE.OneMinusDstColorFactor;
				break;
			case 8:
				this.mat.blendSrc = THREE.SrcAlphaSaturateFactor;
				break;
			}
			
			switch(dest)
			{
			case 0:
				this.mat.blendDst = THREE.SrcAlphaFactor;
				break;
			case 1:
				this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
				break;
			case 2:
				this.mat.blendDst = THREE.DstAlphaFactor;
				break;
			case 3:
				this.mat.blendDst = THREE.OneMinusDstAlphaFactor;
				break;
			case 4:
				this.mat.blendDst = THREE.ZeroFactor;
				break;
			case 5:
				this.mat.blendDst = THREE.OneFactor;
				break;
			case 6:
				this.mat.blendDst = THREE.SrcColorFactor;
				break;
			case 7:
				this.mat.blendDst = THREE.OneMinusSrcColorFactor;
				break;
			}
			
			switch(eqn)
			{
			case 0:
				this.mat.blendEquation = THREE.AddEquation;
				break;
			case 1:
				this.mat.blendEquation = THREE.SubtractEquation;
				break;
			case 2:
				this.mat.blendEquation = THREE.ReverseSubtractEquation;
				break;
			}
			
			break;
		}
		
	};
	
	Acts.prototype.MaterialsDepthSettings = function (dtest,dwrite)
	{
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//dtest == 0 ? this.mat.depthTest = false : this.mat.depthTest = true;
	this.mat.depthTest = dtest === 1;
	//dwrite == 0 ? this.mat.depthWrite = false : this.mat.depthWrite = true;
	this.mat.depthWrite = dwrite === 1;
	
	};
	
	Acts.prototype.MaterialsPolygonOffset = function (poffset,factor,unit)
	{
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//poffset == 0 ? this.mat.polygonOffset = false : this.mat.polygonOffset = true;
	this.mat.polygonOffset = poffset === 1;
	this.mat.polygonOffsetFactor = factor;
	this.mat.polygonOffsetUnits = unit;
	
	};
	
	Acts.prototype.MaterialsSetColor = function (color)
	{
	
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('color')) return;
	//this.mat.color.setHexR(color);
	
	//if(! this.mat ) return;
	//if(this.mat.hasOwnProperty('color')) this.mat.color.setHexR(color)
	//else if(this.mat.uniforms && this.mat.uniforms.color) this.mat.uniforms.color.value.setHexR(color)
	
	this.mat.color.setHexR(color)

	};
	
	Acts.prototype.MaterialsSetFog = function (yes)
	{
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('fog')) return;
	if((this.mat.fog) === (yes === 0)) this.mat.needsUpdate = true; // prevent redundant expensive updates ? fog setting should need a model rebuild, or it'll lead to materials not reseting.
	this.mat.fog = yes === 1 ;

	};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// ... other expressions here ...
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////// stolen sprite stuff

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
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////	material stuff similar to models

	Exps.prototype.pOffsetFactor = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.mat.polygonOffsetFactor);				// return our value
	};
	
	Exps.prototype.pOffsetUnits = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.mat.polygonOffsetUnits);				// return our value
	};

	Exps.prototype.Diffuse = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//var set = 0;
		
		//set = this.mat.color.getHexR() // for regular materials
		
		//ret.set_float(set);				// return our value
		
		ret.set_float(this.mat.color.getHexR());				// return our value
	};
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	pluginProto.exps = new Exps();
	
	//////////////////////// modified common ace stuff from c2
	
			Cnds.prototype.CompareWidth = function (cmp, w)
			{
				return cr.do_cmp(this.width, cmp, w);
			};

			Cnds.prototype.CompareHeight = function (cmp, h)
			{
				return cr.do_cmp(this.height, cmp, h);
			};

			Acts.prototype.SetWidth = function (w)
			{
				if (this.width !== w)
				{
					this.width = w;
					this.set_bbox_changed();
				}
			};

			Acts.prototype.SetHeight = function (h)
			{
				if (this.height !== h)
				{
					this.height = h;
					this.set_bbox_changed();
				}
			};

			Acts.prototype.SetSize = function (w, h)
			{
				if (this.width !== w || this.height !== h)
				{
					this.width = w;
					this.height = h;
					this.set_bbox_changed();
				}
			};

			Exps.prototype.Width = function (ret)
			{
				ret.set_float(this.width);
			};

			Exps.prototype.Height = function (ret)
			{
				ret.set_float(this.height);
			};

			Cnds.prototype.AngleWithin = function (within, a)
			{
				return cr.angleDiff(this.angle, cr.to_radians(a)) <= cr.to_radians(within);
			};

			Cnds.prototype.IsClockwiseFrom = function (a)
			{
				return cr.angleClockwise(this.angle, cr.to_radians(a));
			};
			
			Cnds.prototype.IsBetweenAngles = function (a, b)
			{
				var lower = cr.to_clamped_radians(a);
				var upper = cr.to_clamped_radians(b);
				var angle = cr.clamp_angle(this.angle);
				var obtuse = (!cr.angleClockwise(upper, lower));
				
				// Handle differently when angle range is over 180 degrees, since angleClockwise only tests if within
				// 180 degrees clockwise of the angle
				if (obtuse)
					return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
				else
					return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
			};

			Acts.prototype.SetAngle = function (a)
			{
				var newangle = cr.to_radians(cr.clamp_angle_degrees(a));

				if (isNaN(newangle))
					return;

				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};

			Acts.prototype.RotateTowardAngle = function (amt, target)
			{
				var newangle = cr.angleRotate(this.angle, cr.to_radians(target), cr.to_radians(amt));

				if (isNaN(newangle))
					return;

				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};

			Exps.prototype.Angle = function (ret)
			{
				ret.set_float(cr.to_clamped_degrees(this.angle));
			};
	
	////////////////////////
	
	THREE.TSH.commonACEappend(Cnds,Acts,Exps,instanceProto,typeProto,pluginProto);

}());