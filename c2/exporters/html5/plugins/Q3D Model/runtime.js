// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3Dobj = function(runtime)
{
	this.runtime = runtime;
	//this.garbagephong = new THREE.MeshPhongMaterial(); legacy, materials are actually not async with models anymore, so you can modify them beforehand
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3Dobj.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		this.runtime.Q3D.Q3DTypesList.push(this);
		/**PREVIEWONLY**///this.gridCellDebug = false;
	};

	var typeProto = pluginProto.Type.prototype;
	
	////////////////////////////////////////////////////////////////////////// modified animation system code from sprite;
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
	///////////////////////////////////////////////////////////////////////////////
	

	// called on startup for each object type
	typeProto.onCreate = function()
	{

	if (this.is_family)
	return;
	// make the grid small for testing purpose
	//this.collision_grid3D = new THREE.TSH.SparseGrid3D(10, 10, 10);
	
	//this.collision_grid3D = new THREE.TSH.SparseGrid3D(this.runtime.original_width/2, this.runtime.original_height,1000);

	this.collision_grid3D = new THREE.TSH.SparseGrid3D(1000, 1000, 1000, this);
	
	this.any_cell3D_changed = true; // initialize the grid.
	
	//this.sharedMaterial = new THREE.MeshPhongMaterial();
	this.sharedMaterial = {};
	this.modelPool = {};
	this.runtime.Q3D.modelPoolList.push(this.modelPool);
	
	this.DefaultAnims=[null,null,null,null,null,null];
	/////////////////////////////////////////////////////////////////////////////// animation system code, copied from sprite
	
	var i, leni, j, lenj , wt;
		var anim, frame, animobj, frameobj, strarray;// , wt, uv;
		
		this.matFlags = {};
		this.all_frames = [];
		this.has_loaded_textures = false;
		
		// Load all animation frames (aspects relating to sprites sheets are commented out for now, not sure if they actually will be used)
		
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.index = i;
			
			animobj.frames = [];
			//animobj.textureframes = []; moved into check for envmap
			
			strarray = [];
			strarray = animobj.name.split('_');
			
			switch (strarray[1]){
			case undefined :
			animobj.texturetype = 0;
			//alert("Tex")
			break;
			case "ENVReflect" :
			animobj.texturetype = 1;
			animobj.mapping = THREE.CubeReflectionMapping;
			animobj.textureframes = [];
			break;
			case "ENVRefract" :
			animobj.texturetype = 1;
			animobj.mapping = THREE.CubeRefractionMapping;
			animobj.textureframes = [];
			//alert("ENV")
			break;
			};
			 
			 //animobj.parsedname = 0;
			 
			 switch (strarray[0]){
			 /*case "Default" :
				if(animobj.texturetype === 0){ 
				animobj.parsedname = 1;
				this.matFlags.DiffuseMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Diffuse Map. Please eliminate any texture type indicators after the underscore.");
			 break;*/
			 case "DiffuseMap" :
				if(animobj.texturetype === 0){
				//animobj.parsedname = 1;
				this.DefaultAnims[0] = animobj;
				this.matFlags.DiffuseMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Diffuse Map. Please eliminate any texture type indicators after the underscore.");
			 break;
			 case "SpecularMap" :
				if(animobj.texturetype === 0){
				//animobj.parsedname = 2;
				this.DefaultAnims[1] = animobj;
				this.matFlags.SpecularMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Specular Map. Please eliminate any texture type indicators after the underscore.");
			 break;
			 case "LightMap" :
				if(animobj.texturetype === 0){
				//animobj.parsedname = 3;
				this.DefaultAnims[2] = animobj;
				this.matFlags.LightMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Light Map. Please eliminate any texture type indicators after the underscore.");
			 break;
			 case "EnvironmentMap" :
				if(animobj.texturetype === 1){
				//animobj.parsedname = 4;
				this.DefaultAnims[3] = animobj;
				this.matFlags.EnvironmentMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as an Environment Map. Please use the texture type indicator _ENVRefract or _ENVReflect after the animation name so that a cubemap is generated. For example rename the animation ''Environment Map_ENVReflect''.");
			 break;
			 case "NormalMap" :
				if(animobj.texturetype === 0){
				//animobj.parsedname = 5;
				this.DefaultAnims[4] = animobj;
				this.matFlags.NormalMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Normal Map. Please eliminate any texture type indicators after the underscore.");
			 break;
			 case "BumpMap" :
				if(animobj.texturetype === 0){
				//animobj.parsedname = 6;
				this.DefaultAnims[5] = animobj;
				this.matFlags.BumpMap = true;
				}
				else alert("Animation ''"+animobj.name+"'' is not of the right type to be used as a Bump Map. Please eliminate any texture type indicators after the underscore.");
			 break;			 
			 };
			
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
				
				/*uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;*/
				
				frameobj.webGL_texture = null;
				
				// Sprite sheets may mean multiple frames reference one image
				// Ensure image is not created in duplicate
				// pretty sure I still want this, even though I need to rip apart the sprite sheet.
				wt = this.runtime.findWaitingTexture(frame[0]);
				
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img["idtkLoadDisposed"] = true;
					
					frameobj.texture_img.src = frame[0];
					frameobj.texture_img.cr_src = frame[0];

					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					
					// Tell runtime to wait on this texture
					this.runtime.waitForImageLoad(frameobj.texture_img);
				}
				
				//cr.seal(frameobj);
				this.all_frames.push(frameobj);
				
				if(animobj.texturetype === 0){
				animobj.frames.push(frameobj);
				};
				if(animobj.texturetype === 1){ 
				animobj.textureframes.push(frameobj); // we still need the actual images from all the other frames, so theres no way around making a new object to store them.
				if(j%6 === 0)	animobj.frames.push(frameobj); // only add every 6th frame for env map to work properly
				};
			};
			
			//cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	
	//////////////////////////////////////////////////////////////////////////////
	
	};

	////////////////////////////////////////////////////////////////////////////// copied sprite animation system functions
	
	// Could probably do without this function, since its meant to work within the context of construct.
	
	/*typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};*/
	
	// Don't need, i think three.js handles this already
	
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
	};*/
	
	// don't need this
	
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
	};*/
	
	typeProto.loadTextures3D = function ()
	{
		//if(this.runtime.Q3D.loadedTextures["UV_Grid_Sm.jpg"])
		//alert(this.runtime.Q3D.loadedTextures["UV_Grid_Sm.jpg"].src)
		
		//if (this.is_family || this.has_loaded_textures /*|| !this.runtime.glwrap*/ || !THREE.Detector.webgl)
			//return;

		if (this.is_family || this.has_loaded_textures /*|| !this.runtime.glwrap*/ || !THREE.Detector.webgl) 
		return;
			
			var i, leni, j, lenj;
			var anim, frame;
			
			for (i = 0, leni = this.all_frames.length; i < leni; ++i)
			{
				frame = this.all_frames[i];
				
				if(frame.spritesheeted) // break spritesheet into constituent images or else very weird stuff happens because of UV mapping
				{
					frame.texture_img =  frame.getDataUri();//.src = frame.getDataUri();
					//frame.texture_img.cr_src = frame.texture_img.src;
				};
					//frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
					
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
					
					if(this.animations[i].texturetype === 0)
					{
					frame.webGL_texture = new THREE.Texture()
					frame.webGL_texture.image = frame.texture_img
					frame.webGL_texture.needsUpdate = true;
					};
					
					// build envmap type textures
					
					if(this.animations[i].texturetype === 1)
					{
					frame.webGL_texture = new THREE.Texture()
					frame.webGL_texture.image = [
					anim.textureframes[Math.min(j*6+0,anim.textureframes.length-1)].texture_img,
					anim.textureframes[Math.min(j*6+1,anim.textureframes.length-1)].texture_img,
					anim.textureframes[Math.min(j*6+2,anim.textureframes.length-1)].texture_img,
					anim.textureframes[Math.min(j*6+3,anim.textureframes.length-1)].texture_img,
					anim.textureframes[Math.min(j*6+4,anim.textureframes.length-1)].texture_img,
					anim.textureframes[Math.min(j*6+5,anim.textureframes.length-1)].texture_img
					]
					frame.webGL_texture.mapping = this.animations[i].mapping;
					frame.webGL_texture.needsUpdate = true;
					};
					
					if(!this.runtime.linearSampling){
						frame.webGL_texture.magFilter = THREE.NearestFilter;
						frame.webGL_texture.minFilter = THREE.NearestFilter;
					};					

				};
			};
			
			this.has_loaded_textures = true;
	
	};
	
	/*typeProto.unloadTextures = function ()
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
	
	//////////////////////////////////////////////////////////////////////////////
	
	
	
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		this.update_collision_cell3D = THREE.TSH.update_collision_cell3D;
		//this.set_bbox3D_changed  = THREE.TSH.set_bbox3D_changed;
		this.update_bbox3D = THREE.TSH.update_bbox3D;
		//this.fastWorldUpdate = THREE.TSH.fastWorldUpdate;
		
		//if(this.recycled) alert("recycled ctor");
		//this.update_bbox = THREE.TSH.update_bbox3D; // this doesn't work, things remain broken.
		//alert("instaneclass creating function")

		//alert("this is added now");
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	

	THREE.TSH.ModelFit = function(_this,materialFlag){		
		
		var Q3Dref = _this.runtime.Q3D
		
		if(_this.destroyFlag) return; // incase object is garbage collected / purged from object pool / deleted early, don't, don't do anything! crash will happen without this!
		
		
		var obj, oP,i,L,UVflag = false;
		var flg = _this.type.matFlags
		var objF = Q3Dref.loadedObjects[_this.modelFile];
		var bithash;
		
		if (!objF)
		{
			alert("THE MODEL FILE : [ "+_this.modelFile+" ] THAT YOU ARE TRYING TO USE HAS NOT BEEN ADDED TO THE FILES FOLDER / ISNT VALID");
			return;
		};
		
		_this.callback = false;
		_this.modelProto = undefined;
		
		//_this.matType = _this.properties[39];
		//if(_this.properties[35]===0) _this.matType = -1;
		//if(_this.matType === -1 && _this.modelFile.split('.').pop() === "obj") _this.matType = 0;
		
		if(_this.matType !== -1){		//_this.properties[35]===1){
		
			// set integer to make a faux bithash key to ensure proper texture permutations are associated with the geometry to create/recycle
		
			bithash = 0;
			if(flg.DiffuseMap) bithash += 1;
			if(flg.SpecularMap) bithash += 2;
			if(flg.EnvironmentMap) bithash += 4;
			if(flg.LightMap) bithash += 8;
			if(flg.NormalMap) bithash += 16;
			if(flg.BumpMap) bithash += 32;
			
			/*if(_this.properties[36]===1){ //if unique material or not;
			bithash += 64; 
			_this.mat = _this.type.sharedMaterial;
			//_this.mat.needsUpdate = true;
			};*/
			
			if(_this.properties[38]===0){
				bithash += 128;
				UVflag = true;
				//alert(UVflag);
			};
			
			if(_this.properties[42]===1) bithash += 256; //shading
			if(_this.properties[43]===1) bithash += 512; //morph normals
			
			// if geometry has not been created for given bithash, do that now
			if(!Q3Dref.objectProtos[_this.modelFile][_this.matType]) Q3Dref.objectProtos[_this.modelFile][_this.matType] = {};
			oP = Q3Dref.objectProtos[_this.modelFile][_this.matType][bithash];
		
			if(!oP){
				Q3Dref.objectProtos[_this.modelFile][_this.matType][bithash] = THREE.DeepClone(objF, new THREE.MeshPhongMaterial() , UVflag );
				oP = Q3Dref.objectProtos[_this.modelFile][_this.matType][bithash];
			};
			
			// place this afterwards, so that unique material doesn't mess up cloning of proto (this being here shouldn't really change anything anymore)
			
			if(_this.properties[36]===1){ //if unique material or not, the actual proto can be the same so this bithash event is afterwards (although this is a confusing optimization);
			bithash += 64; 
			//_this.mat = _this.type.sharedMaterial;
					
				if(!_this.type.sharedMaterial[_this.matType]){ // shared material has been created
					if(_this.matType===0){
						_this.type.sharedMaterial[0] = new THREE.MeshPhongMaterial();
					}else if(_this.matType===1){
						_this.type.sharedMaterial[1] = new THREE.MeshLambertMaterial();
					}else if(_this.matType===2){
						_this.type.sharedMaterial[2] = new THREE.MeshBasicMaterial();
					}else if(_this.matType===3){
						_this.type.sharedMaterial[3] = new THREE.MeshNormalMaterial();
					}else if(_this.matType===4){
						_this.type.sharedMaterial[4] = new THREE.MeshDepthMaterial();
					}else{
						_this.type.sharedMaterial[_this.matType] = Q3Dref.loadedShaders[_this.matType].clone();
					}
				};
				
				_this.mat = _this.type.sharedMaterial[_this.matType];
				
			
			};
			
			if(!_this.type.modelPool[_this.modelFile]) _this.type.modelPool[_this.modelFile] = {};
			
			if(!_this.type.modelPool[_this.modelFile][_this.matType]) _this.type.modelPool[_this.modelFile][_this.matType] = {};
			
			if(!_this.type.modelPool[_this.modelFile][_this.matType][bithash]) _this.type.modelPool[_this.modelFile][_this.matType][bithash] = [];
			
			// if length is non-zero use model from pool
			
			if(_this.type.modelPool[_this.modelFile][_this.matType][bithash].length){
			
			_this.model = _this.type.modelPool[_this.modelFile][_this.matType][bithash].pop();
			_this.model.scale.set(1,1,1);
			_this.mat = _this.model.material;
			//_this.mat.needsUpdate = true;
			
			}else{ // if length is zero create new object instead
					
			if(!_this.mat /*_this.properties[36]===0*/){  // if not using shared type material, create new one;
			// if the material hasn't been created yet for whatever reason, create it.
				
				if(_this.matType===0){ // select the type of material here.
					_this.mat = new THREE.MeshPhongMaterial();
				}else if(_this.matType===1){
					_this.mat = new THREE.MeshLambertMaterial();
				}else if(_this.matType===2){
					_this.mat = new THREE.MeshBasicMaterial();
				}else if(_this.matType===3){
					_this.mat = new THREE.MeshNormalMaterial();
				}else if(_this.matType===4){
					_this.mat = new THREE.MeshDepthMaterial();
				}else{
					_this.mat = Q3Dref.loadedShaders[_this.matType].clone();
				};
			
			};
			
			_this.mat.morphTargets = Q3Dref.loadedObjectsInfo[_this.modelFile].morphTargets;
			_this.mat.skinning = Q3Dref.loadedObjectsInfo[_this.modelFile].skinning;
			
			if(_this.properties[43]===0){
				_this.mat.morphNormals = Q3Dref.loadedObjectsInfo[_this.modelFile].morphNormals;
			}else{
				_this.mat.morphNormals = false;
			};
			
			if(_this.properties[42]===1){
				_this.mat.shading = THREE.FlatShading;
			};
			
			_this.model = THREE.SharedGeomClone(oP,_this.mat);
			
			};
			
		}else{ // this is for using loaded model materials
		
			// set integer to make a faux bithash key to ensure proper texture permutations are associated with the geometry to create/recycle
		
			bithash = -1; // have to reset bithash, oops...
			if(_this.properties[36]===0) bithash += -2; // if unique, -2
			
			if(_this.properties[42]===1) bithash += -256; //shading
			if(_this.properties[43]===1) bithash += -512; //morph normals

			
			// if geometry has not been created for given bithash, do that now
			if(!Q3Dref.objectProtos[_this.modelFile][-1]) Q3Dref.objectProtos[_this.modelFile][-1] = {};
			oP = Q3Dref.objectProtos[_this.modelFile][-1][bithash];

			if(!oP){
				Q3Dref.objectProtos[_this.modelFile][-1][bithash] = THREE.DeepCloneModel(objF); // model clone, references materials;
				oP = Q3Dref.objectProtos[_this.modelFile][-1][bithash];
			};
			
			//build objects/array pools if they haven't already been built;

			if(!_this.type.modelPool[_this.modelFile]) _this.type.modelPool[_this.modelFile] = {};
			
			if(!_this.type.modelPool[_this.modelFile][-1]) _this.type.modelPool[_this.modelFile][-1] = {};
			
			if(!_this.type.modelPool[_this.modelFile][-1][bithash]) _this.type.modelPool[_this.modelFile][-1][bithash] = [];
			
			// if length is non-zero use model from pool
			
			if(_this.type.modelPool[_this.modelFile][-1][bithash].length){
			
				_this.model = _this.type.modelPool[_this.modelFile][-1][bithash].pop();
				_this.modelProto = oP;
				_this.model.scale.set(1,1,1);
			
			/*for(i=0,L=_this.model.material.materials.length; i<L; i++){
				_this.model.material.materials[i].needsUpdate = true;
			};*/
			//_this.mat = _this.model.material;
			
			}else{ // if length is zero create new object instead
					
				if(_this.properties[36]===0){ //unique material
					_this.model = THREE.SharedGeomCloneModel(oP);
					_this.modelProto = oP;
				}else{ //shared material, kinda works shoddily
					_this.model = THREE.SharedGeomMaterialCloneModel(oP);
					
					/*for(i=0,L=_this.model.material.materials.length; i<L; i++){
						_this.model.material.materials[i].needsUpdate = true;
					};*/
					
				};
			
				for(i=0,L=_this.model.material.materials.length; i<L; i++){
					
					_this.model.material.materials[i].morphTargets = Q3Dref.loadedObjectsInfo[_this.modelFile].morphTargets;
					_this.model.material.materials[i].skinning = Q3Dref.loadedObjectsInfo[_this.modelFile].skinning;
					
					//_this.model.material.materials[i].morphNormals = Q3Dref.loadedObjectsInfo[_this.modelFile].morphNormals;
					if(_this.properties[43]===0){
						_this.model.material.materials[i].morphNormals = Q3Dref.loadedObjectsInfo[_this.modelFile].morphNormals;
					}else{
						_this.model.material.materials[i].morphNormals = false;
					};
					
					if(_this.properties[42]===1){
						_this.model.material.materials[i].shading = THREE.FlatShading;
					};
					
					_this.model.material.materials[i].needsUpdate = true;
					
				};
			
			};
			
		};
		
		obj = _this.model;
		//obj.userData.model = true;

		_this.Q3Dboned = false; // incase of model changes	do this here?
		if(Q3Dref.loadedObjectsInfo[_this.modelFile].skinning && ! _this.usesSkinController) alert('You are attempting to use the model [ '+_this.modelFile+' ] which has skinning information on Q3D Model [ '+_this.type.name+' ], but without the behaviour Q3D Skin Controller applied, this will lead to a fatal error, consider adding the behaviour, or removing the bones from the exported file if they are uneeded')
		
		if(Q3Dref.loadedObjectsInfo[_this.modelFile].skinning && _this.usesSkinController){
			
			
			_this.Q3Dboned = true;
			
			obj.initC2Bones(_this);
			
			for(var i = 0, L = obj.boneInstances.length; i < L ; i++){
				obj.boneInstances[i].set_bbox3D_changed(); // notify the individual bone instances of their animation updated state.
			};
			
			//alert('test')
			
			//alert(obj.geometry.animation.name)
			/*if(obj.geometry.animation){
			alert('animation')
			_this.skinanimation = new THREE.Animation( obj, obj.geometry.animation );
			}else if(obj.geometry.animations){
			alert('animationSSS')
			_this.skinanimation = new THREE.Animation( obj, obj.geometry.animations[Math.round(Math.random()*(obj.geometry.animations.length-1))] );
			}
			_this.skinanimation.play();*/
			
			
			//_this.skinanimation.resetBlendWeights();
			//_this.skinanimation.update(Math.random()*2);
			/*for(var i = 0, L = obj.geometry.bones.length ; i< L ; i++){
				//obj.skeleton.bones[i].rotation.set(obj.skeleton.bones[i].rotation.x-(0.5-Math.random())*0.5,obj.skeleton.bones[i].rotation.y-(0.5-Math.random())*0.5,obj.skeleton.bones[i].rotation.z-(0.5-Math.random())*0.5)
				
				var bonebox = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1))
				if(obj.skeleton.bones[i].parent !== obj){ // this way, multiple boxes get created per parent bone if it has multiple children. Should probably grab and merge colliders somehow. 
				obj.skeleton.bones[i].parent.add(bonebox)
				bonebox.position.copy(obj.skeleton.bones[i].position)
				bonebox.scale.set(cr.max(obj.skeleton.bones[i].position.x,1),cr.max(obj.skeleton.bones[i].position.y,1),cr.max(obj.skeleton.bones[i].position.z,1))
				bonebox.position.multiplyScalar ( 0.5 )
				//bonebox.visible = false;
				}else{
				obj.skeleton.bones[i].add(bonebox) // can't make any "smart" assumptions about objects with parents attached to the main objects (e.g sword in knight.js) so just create a fixed collider.
				//bonebox.position.copy(obj.skeleton.bones[i].position)
				//bonebox.scale.set(cr.max(obj.skeleton.bones[i].position.x,1),cr.max(obj.skeleton.bones[i].position.y,1),cr.max(obj.skeleton.bones[i].position.z,1))
				//bonebox.position.multiplyScalar ( 0.5 )
				}
			};*/
			//_this.skinanimation.resetBlendWeights();
			//_this.skinanimation.update(0.5);
		};
				
		
		_this.bithash = bithash;

		/////////////////////////////////////////////////////
		
		_this.obj.add(obj);
		//_this.obj.modelAddedFlag = obj;
		var size = Q3Dref.loadedObjectsInfo[_this.modelFile].size;
		var center = Q3Dref.loadedObjectsInfo[_this.modelFile].center;

		switch (_this.properties[13])
		{
			case 0:
				obj.scale.copy(Q3Dref.loadedObjectsInfo[_this.modelFile].nSize);
				break;
			case 1:
				obj.scale.set(1 / size.x, 1 / size.x, 1 / size.x);
				break;
			case 2:
				obj.scale.set(1 / size.y, 1 / size.y, 1 / size.y);
				break;
			case 3:
				obj.scale.set(1 / size.z, 1 / size.z, 1 / size.z);
				break;
		};
		
		if (_this.properties[12] === 0)
		{

			obj.position.sub(Q3Dref.loadedObjectsInfo[_this.modelFile].center);
			obj.position.multiply(obj.scale);

		};
		
		//obj.position.multiplyScalar(_this.properties[fifteen]);
		//obj.position.add(new THREE.Vector3(_this.properties[14], _this.properties[15], _this.properties[16]));
		//obj.scale.multiplyScalar(_this.properties[fifteen]);
		//obj.rotation.set(_this.properties[17], _this.properties[18], _this.properties[19]);
		// modified from a 1D model scale to a 3D model scale
		obj.position.set(obj.position.x*_this.properties[20],obj.position.y*_this.properties[21],obj.position.z*_this.properties[22]);
		
		THREE.TSH.vec0.set(_this.properties[14], _this.properties[15], _this.properties[16]);
		obj.position.add(THREE.TSH.vec0);
		
		obj.scale.set(obj.scale.x*_this.properties[20],obj.scale.y*_this.properties[21],obj.scale.z*_this.properties[22]);
		obj.rotation.set(_this.properties[17]*THREE.Deg2Rad, _this.properties[18]*THREE.Deg2Rad, _this.properties[19]*THREE.Deg2Rad);
		
		if (_this.properties[24] === 1)
		{

			obj.add(_this.col);
		   
		   //_this.col.addedToObj = obj;
		   _this.col.position.copy(center);
			_this.col.scale.copy(size);
			THREE.TSH.vec0.set(_this.properties[31], _this.properties[32], _this.properties[33]);
			_this.col.scale.multiply(THREE.TSH.vec0);
			THREE.TSH.vec0.set(_this.properties[25] * size.x, _this.properties[26] * size.y, _this.properties[27] * size.z);
			_this.col.position.add(THREE.TSH.vec0);

		};

	_this.set_bbox3D_changed();
	
	if(_this.properties[41]>0){
	
		_this.traversingResetFlag = true;
	
		_this.model.traverse( function ( child ) { // i think creating this anonymous function here is slow, but it's good enough for now, it might be faster than whats necessary to work around creating it.

			if ( child.geometry ) {

				child.castShadow = _this.properties[41] === 1 ||  _this.properties[41] === 3;
				child.receiveShadow = _this.properties[41] === 2 ||  _this.properties[41] === 3;
							
			}
		} );
	};
	
	
		//_this.update_bbox3D();
	//if(_this.matType !== -1 && _this.mat) _this.mat.transparent = ( _this.properties[34] === 0 );
	//_this.InitAnimSystem();
	
	// material loading system, pretty bloated :/ but i need it eventually to support save/load properly anyway, might as well do it right
	if(_this.savedMat && _this.matType !== -1){
		
		var key;
		
		for( key in _this.savedMat ){ // any type -> any type
			if(_this.mat.hasOwnProperty(key) && key !== 'uniforms'){ // need to skip copying of uniforms object
				 
				 _this.mat[key] =  _this.savedMat[key];
				 
			};
			// add code to update "special" uniforms if passing from regular -> shader and shader -> regular
		};
		
		if(_this.mat.hasOwnProperty('uniforms') && _this.savedMat.hasOwnProperty('uniforms')){ // shader -> shader
		
			var k
		
			for(k in _this.mat.uniforms){
				//alert(_this.savedMat.uniforms[k].type)
				if(_this.savedMat.uniforms[k] && ( _this.mat.uniforms[k].type === _this.savedMat.uniforms[k].type) ){
					
					_this.mat.uniforms[k].value = _this.savedMat.uniforms[k].value;
					
					//alert("test")
				};
				
			};
		
		};
		
		if(_this.mat.hasOwnProperty('uniforms') ){
		
			for(k in _this.mat.uniforms){
				
				if(_this.savedMat.hasOwnProperty(k)){
				
					_this.mat.uniforms[k].value = _this.savedMat[k];
				
				};
			
			};
		
		};
		
		if(_this.savedMat.hasOwnProperty('uniforms')){
		
			for( k in _this.savedMat.uniforms ){
			
				if(_this.mat.hasOwnProperty(k)){
				
					_this.mat[k] = _this.savedMat.uniforms[k].value;
				
				};
			
			};
		
		};
		
	}else if(_this.savedMatGroup && _this.matType === -1){
		
		var m = _this.savedMatGroup
		var n = _this.model.material.materials
		var i
		var len
		var key
		
		for(i = 0, len = cr.min(n.length,m.length) ; i < len ; i++){ // use min of lengths, because you don't want to over iterate or under iterate over materials in list
			
			for( key in m[i] ){
				if(n[i].hasOwnProperty(key)){
				 n[i][key] =  m[i][key];
				};	
			};
		
		};
	};
	
	_this.applyTextures();
	
	if(!materialFlag){
	
		//_this.InitAnimSystem();
	
		for(L = _this.modelLoadCallbacks.length-1; L>-1;L--){
		_this.modelLoadCallbacks[L](); // for morph stuff to work if model is changed
		};
	
	
		_this.runtime.trigger(cr.plugins_.Q3Dobj.prototype.cnds.OnModelCreated, _this); //callback to trigger condition if model is being loaded in;
	
	}else{
		
		if(_this.runtime.Q3D.loadedObjectsInfo[_this.modelFile].morphTargets){
			for( i = 0, L = _this.savedMinf.length ; i < L ; i++){
				_this.model.morphTargetInfluences[i] = _this.savedMinf[i];
			};
		};
	
	};
	
};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.setupModel = function (autoloadFlag,materialFlag)   
	{
		if (this.runtime.Q3D.loadedObjects[this.modelFile] &&( !this.shaderFile || this.runtime.Q3D.loadedShaders[this.shaderFile]))
		{
			//alert(this.modelFile)
			THREE.TSH.ModelFit(this,materialFlag); // does all the stuff needed to follow settings in properties.
			//this.InitAnimSystem();
		   
		}
		else
		{
			if(this.properties[36]===0){
			
				if(this.matType===0){ // select the type of material here.
					this.mat = new THREE.MeshPhongMaterial();
				}else if(this.matType===1){
					this.mat = new THREE.MeshLambertMaterial();
				}else if(this.matType===2){
					this.mat = new THREE.MeshBasicMaterial();
				}else if(this.matType===3){
					this.mat = new THREE.MeshNormalMaterial();
				}else if(this.matType===4){
					this.mat = new THREE.MeshDepthMaterial();
				}else if(this.runtime.Q3D.loadedShaders[this.matType]){
					this.mat = this.runtime.Q3D.loadedShaders[this.matType].clone();
				};
			
			}else{ //if shared material, generate it here
					
				if(!this.type.sharedMaterial[this.matType]){ // shared material has been created
					if(this.matType===0){
						this.type.sharedMaterial[0] = new THREE.MeshPhongMaterial();
					}else if(this.matType===1){
						this.type.sharedMaterial[1] = new THREE.MeshLambertMaterial();
					}else if(this.matType===2){
						this.type.sharedMaterial[2] = new THREE.MeshBasicMaterial();
					}else if(this.matType===3){
						this.type.sharedMaterial[3] = new THREE.MeshNormalMaterial();
					}else if(this.matType===4){
						this.type.sharedMaterial[4] = new THREE.MeshDepthMaterial();
					}else if(this.runtime.Q3D.loadedShaders[this.matType]){
						this.type.sharedMaterial[this.matType] = this.runtime.Q3D.loadedShaders[this.matType].clone();
					}
				};
				
				if(this.type.sharedMaterial[this.matType])	this.mat = this.type.sharedMaterial[this.matType]
				
			};
			
			//this.InitAnimSystem();
		
			if(!this.callback){
			this.runtime.Q3D.loadAddList.push( this ); //fixed so no anonymous functions are created
			this.callback = true;
			};
			
			if(!this.runtime.Q3D.loadQueue[this.modelFile] && autoloadFlag) this.runtime.Q3D.LoadFile(this.modelFile); // this should be at end to prevent bugs on fast systems where file loads before qeue callback is made

		};
	
	};
	
	instanceProto.InitAnimSystem = function ()   
	{
		var i, leni, anim ;	/////////////////////////////////////////////////////////////////////////////////////////////////////////// Animation system code
		
		if(!(
		this.type.DefaultAnims[0]||
		this.type.DefaultAnims[1]||
		this.type.DefaultAnims[2]||
		this.type.DefaultAnims[3]||
		this.type.DefaultAnims[4]||
		this.type.DefaultAnims[5]) ) return; //nothing to animate, plz dont animate this type ever
		
		if (this.mapanim)
		{
			for ( i = 0 ; i < 6; i++)
			{
				this.mapanim[i].animTimer.reset();
			};
		}
		else
		{
			this.mapanim = [];
			for ( i = 0 ; i < 6; i++)
			{
				this.mapanim[i] = {}
				this.mapanim[i].animTimer = new cr.KahanAdder();

			};
			// creating new anonymous functions for every object here might be a "bad" idea though, even though the functions are recycled, will need to investigate
			// i think this is the fastest way to do this, javascript doesn't allow pointers so i have to make functions that point to the maps instead, JIT compiler should optimize this?
			this.mapanim[0].setMap = THREE.setThisMap;
			this.mapanim[1].setMap = THREE.setThisSpecularMap;
			this.mapanim[2].setMap =THREE.setThisLightMap;
			this.mapanim[3].setMap =THREE.setThisEnvMap;
			this.mapanim[4].setMap = THREE.setThisNormalMap;
			this.mapanim[5].setMap = THREE.setThisBumpMap;
		};
		

		
		// going to have to make multiple animation controllers for each map type, i guess a fixed structure would be best
		
		//if(this.properties[35]===0) return;

		//Set all animation controllers to a null value to begin
		this.mapanim[0].cur_animation = null;
		this.mapanim[1].cur_animation = null;
		this.mapanim[2].cur_animation = null;
		this.mapanim[3].cur_animation = null;
		this.mapanim[4].cur_animation = null;
		this.mapanim[5].cur_animation = null;
		
		this.mapanim[0].inAnimTrigger = false;
		this.mapanim[1].inAnimTrigger = false;
		this.mapanim[2].inAnimTrigger = false;
		this.mapanim[3].inAnimTrigger = false;
		this.mapanim[4].inAnimTrigger = false;
		this.mapanim[5].inAnimTrigger = false;
		
		
		// populate controllers with initial values based on animation names. A bit of a hacky use of the c2 animation system but the best way to ensure things are bug free i'd think.

		//old code was replaced with this, value is preprocessed instead now.
		for ( i = 0 ; i < 6; i++){
		this.mapanim[i].cur_animation = this.type.DefaultAnims[i];
		};
		
		if (
		!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && 
		   (this.mapanim[0].cur_animation && this.mapanim[0].cur_animation.speed !== 0)
		|| (this.mapanim[1].cur_animation && this.mapanim[1].cur_animation.speed !== 0)
		|| (this.mapanim[2].cur_animation && this.mapanim[2].cur_animation.speed !== 0)
		|| (this.mapanim[3].cur_animation && this.mapanim[3].cur_animation.speed !== 0)
		|| (this.mapanim[4].cur_animation && this.mapanim[4].cur_animation.speed !== 0)
		|| (this.mapanim[5].cur_animation && this.mapanim[5].cur_animation.speed !== 0)	   )  // make sure to only tick if this needs to be ticked
		{
			//alert("ticking")
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	// textures must be processed and parsed first, even if unique is specified, i could probably move this out of the oncreate but w/e
	this.type.loadTextures3D();
	this.texturebank = this.type.animations;
	// block for loading unique textures;
	if(this.properties[37] === 0){
		if(this.properties[36] === 0){ 
		this.loadUniqueTextures3D(); // specify to load textures per instance by passing instance into function
		this.texturebank = this.uniqueAnimations;
		}
		else{
		alert("Unique Materials must be enabled to enable Unique Textures") //alert to help users?
		};
	};

		
	for ( i = 0 ; i < 6; i++){
		if(this.mapanim[i].cur_animation){

			this.mapanim[i].cur_frame = 0; 
			
			this.mapanim[i].cur_anim_speed = this.mapanim[i].cur_animation.speed;
			

			
			this.mapanim[i].frameStart = this.getNowTime(this.mapanim[i]);
			this.mapanim[i].animPlaying = true;
			this.mapanim[i].animRepeats = 0;
			this.mapanim[i].animForwards = true;
			this.mapanim[i].animTriggerName = "";
			
			this.mapanim[i].changeAnimName = "";
			this.mapanim[i].changeAnimFrom = 0;
			this.mapanim[i].changeAnimFrame = -1;
			
			this.mapanim[i].curFrame = this.texturebank[this.mapanim[i].cur_animation.index].frames[this.mapanim[i].cur_frame];

			this.mapanim[i].setMap(this.mapanim[i].curFrame.webGL_texture,this);
			
		};
	};
	
	};
	
	instanceProto.applyTextures = function()   
	{
		for (var i = 0 ; i < 6; i++){
			if(this.mapanim && this.mapanim[i].cur_animation){
				//this.mapanim[i].curFrame = this.texturebank[this.mapanim[i].cur_animation.index].frames[this.mapanim[i].cur_frame];
				this.mapanim[i].setMap(this.mapanim[i].curFrame.webGL_texture,this);
			}
		};
	};
	
	/*instanceProto.updateObjMaterial = function ()   
	{
			var _this = this; //changing material at runtime not working properly, will have to clone current object, change material, re-add to scene, or else dummy textures/phong needed...
			
			this.mat.needsUpdate = true;
			
		if(this.obj.hasOwnProperty('material'))  this.obj.material = this.mat;
		

			this.obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						if(child.hasOwnProperty('material'))  child.material = _this.mat;
									
					}

			} );
			
	//if(this.colDebug) this.colDebug.material = this.mat;
			
	};*/
	
	//function used for unique textures to be created on demand and cached for fast loading
	instanceProto.loadUniqueTextures3D = function ()
	{
		if(this.has_loaded_textures) return;
		this.uniqueAnimations = [];
		
		var i, leni, j, lenj;
		var anim, anim2, frame, frame2;
		
		/*for (i = 0, leni = this.type.all_frames.length; i < leni; ++i)
		{
			frame = this.type.all_frames[i];
			
			if(frame.spritesheeted) // break spritesheet into constituent images or else very weird stuff happens because of UV mapping
			{
				frame.texture_img.src = frame.getDataUri();
				frame.texture_img.cr_src = frame.texture_img.src;
			};
				//frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
				
				frame.width = frame.texture_img.width;
				frame.height = frame.texture_img.height;
		};*/		
		
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			this.uniqueAnimations[i] = {frames : []};
			//this.uniqueAnimations[i].frames = [];
			anim2 = this.uniqueAnimations[i];
			
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				//alert( this.uniqueAnimations[i].frames);
				frame = anim.frames[j];
				this.uniqueAnimations[i].frames[j] = {}
				frame2 = anim2.frames[j];
				//frame2 = {};
				
				// build normal type textures
				
				if(this.type.animations[i].texturetype === 0)
				{
				frame2.webGL_texture = new THREE.Texture()
				frame2.webGL_texture.image = frame.texture_img
				frame2.webGL_texture.needsUpdate = true;
				};
				
				// build envmap type textures
				
				if(this.type.animations[i].texturetype === 1)
				{
				frame2.webGL_texture = new THREE.Texture()
				frame2.webGL_texture.image = [
				anim.textureframes[Math.min(j*6+0,anim.textureframes.length-1)].texture_img,
				anim.textureframes[Math.min(j*6+1,anim.textureframes.length-1)].texture_img,
				anim.textureframes[Math.min(j*6+2,anim.textureframes.length-1)].texture_img,
				anim.textureframes[Math.min(j*6+3,anim.textureframes.length-1)].texture_img,
				anim.textureframes[Math.min(j*6+4,anim.textureframes.length-1)].texture_img,
				anim.textureframes[Math.min(j*6+5,anim.textureframes.length-1)].texture_img
				]
				frame2.webGL_texture.mapping = this.type.animations[i].mapping;
				frame2.webGL_texture.needsUpdate = true;
				};
				
				if(!this.runtime.linearSampling){
					frame2.webGL_texture.magFilter = THREE.NearestFilter;
					frame2.webGL_texture.minFilter = THREE.NearestFilter;
				};
				

			};
		};
		
		this.has_loaded_textures = true;
	
	};

	instanceProto.setupCollider = function(colliderType)
	{

		this.collisionsEnabled  = true;
		this.col.type.sphere = false;
		this.col.type.AABB = false;
		this.col.type.OBB = false;
		this.col.type.colliderType = colliderType;
		
		switch(colliderType)
			{
			case 0: //none
				this.collisionsEnabled  = false;
				
				break;
			case 1: //sphere
				this.col.type.sphere = true;
				
				break;
			case 2: //AABB
				this.col.type.AABB = true;
				
				break;
			case 3: // Box
				this.col.type.OBB = true;
				
				break;
			case 4: //ellipsoid

				break;
			};
		
		// mesh used if debug is enabled
		//this.colDebug = null;
		
		// if collider debug enabled
		if(this.properties[8] === 0){
		var maty;
		//this.col.visible = true;
		if(this.properties[6]===1 || this.properties[6]===2) maty = new THREE.MeshPhongMaterial({color : 0xC8C8C8, emissive: 0x111111});
		else	maty = new THREE.MeshBasicMaterial({wireframe: true , color : 0xC8C8C8});
		
		this.runtime.tick2Me(this);
		
			switch(colliderType)
			{
			case 0: //none
				//this.col = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshPhongMaterial({shading: THREE.FlatShading}));
				//this.collisionsEnabled  = false;
				break;
			case 1: //sphere
				this.colDebug = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), maty);
				this.scene.add(this.colDebug);
				//this.obj.colDebugAddedFlag = true;
				break;
			case 2: //AABB
				this.colDebug = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1), maty);
				this.scene.add(this.colDebug);
				//this.obj.colDebugAddedFlag = true;
				break;
			case 3: //Box
				this.colDebug = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1), maty);
				this.col.add(this.colDebug);
				//this.col.colDebugAddedFlag = true;
				break;
			case 4://Ellipsoid
				this.colDebug = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), maty);
				this.col.add(this.colDebug);
				//this.col.colDebugAddedFlag = true;
				break;
			};					
			
		};
		
		/*if(this.colDebug){
			this.colDebug.castShadow = _this.properties[39] === 1 ||  _this.properties[39] === 3;
			this.colDebug.receiveShadow = _this.properties[39] === 2 ||  _this.properties[39] === 3;
		};*/
		//it's confusing to have this... just make it affect models. debugs aren't meant to be used this way, im likely to make them previewonly when geom object is out.
	
	};
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.setupObj(true); 
		this.Q3Dboned = false; // special flag to check if model with bones is present
		//alert("onCreate");
		this.modelFile = null;
		//this.scene = this.runtime.Q3D.scene
		//this.autoUpdateFlag = true;
		this.visible = false // force renderer to early out of drawing, only known override i can do :< ;
		//this.layer = null;
		//alert("oncreate")
		this.destroyFlag = false;
		
		//this.update_bbox = THREE.TSH.update_bbox3D; // Annoying override has to be performed, because other systems in construct don't like to play nice with the 3D stuff e.g. mouse over
		// the override may be super buggy, i haven't really tested it. i can't really expect something so different to work with construct built in behaviours can i?
		//this.mat = this.type.plugin.garbagephong; // placeholder until actual material associated to model is loaded;
		this.mat = undefined;
		
		// set up animation system object (one time initialization);
		
		if(this.recycled){


			this.collcells3Dt.min.set(0,0,0);
			this.collcells3Dt.max.set(-1,-1,-1);

			this.modelLoadCallbacks.length = 0;
		}
		else{
		
			this.savedMinf = [];
			this.modelLoadCallbacks = [];

			this.has_loaded_textures = false;
			
			this.col.geometry = new THREE.BoxGeometry(1,1,1,1,1,1)
			this.collcells3Dt = new THREE.Box3( new THREE.Vector3(0,0,0) , new THREE.Vector3(-1,-1,-1));
			this.col.geometry.boundingSphere = new THREE.Sphere();
			this.col.geometry.boundingBox = new THREE.Box3();
			this.col.type = {}; // create new object
			this.col.AbsRotationMatrix = new THREE.Matrix4();
			this.col.InverseMatrix = new THREE.Matrix3();
			this.col.AbsPosition = new THREE.Vector3();
			this.col.AbsScale = new THREE.Vector3();
			this.col.decompose = THREE.TSH.decompose;
		
		};
		
		//this.toplevelparent = this.obj; // this is to make sure excessive updates aren't called for collision updatematrixworld stuff;
		//this.traversingResetFlag = false;
		//this.obj.colDebugAddedFlag = false;
		//this.obj.debugAddedFlag = false;
		//this.obj.modelAddedFlag = false;

		//this.col.colDebugAddedFlag = false;
		//this.col.addedToObj = false;

		this.setupCollider(this.properties[23]);
		
		// choosing scenes is necessary, use the global scene object.
		
		this.obj.add(this.col); // might want to make this a one time only thing, its never removed as is. (perhaps necessary for col changes, i forgot if thats why this is like this >_>)
		//this.obj.add(this.col);
		//this.col.addedToObj = this.obj;
		
		THREE.TSH.vec0.set(this.properties[31],this.properties[32],this.properties[33]);		
		this.col.scale.multiply(THREE.TSH.vec0);
		this.col.position.set(this.properties[25],this.properties[26],this.properties[27]);
		this.col.rotation.set(this.properties[28]*(THREE.Deg2Rad),this.properties[29]*(THREE.Deg2Rad),this.properties[30]*(THREE.Deg2Rad));
		
		
		this.obj.position.set(this.x,this.y,this.properties[1])
	
		this.obj.scale.set(this.width,this.height,this.properties[5]);
		
		this.obj.rotation.order = this.properties[2];
		this.obj.rotation.set(this.properties[3]*(THREE.Deg2Rad),this.properties[4]*(THREE.Deg2Rad),this.angle);
		
		this.obj.visible = this.properties[0] === 0;
		
		///// if debug is enabled
					if(this.properties[7] === 0){
					
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
					
					this.runtime.tick2Me(this);
					//this.box.visible = this.properties[0] === 0;
					//this.axis.visible = this.properties[0] === 0;
					
					};
		
		
		// shader loading (hacked in right now, clean this UP BUGGY)
		this.shaderFile = false;
		if(this.properties[39] === 5){
		this.shaderFile = this.properties[40]
		this.runtime.Q3D.LoadFile(this.shaderFile);		
		}
		
		// use properties to set material type;
		if(this.properties[35]===0){
			this.matType = -1;
		}else if(this.properties[39]===5){
			this.matType = this.properties[40];
		}else{
			this.matType = this.properties[39];
		};
		
		//// model loading
		this.runtime.Q3D.scene.add(this.obj); // this should be "last" before anim stuff; but also before modelsetup, or else model created trigger wont know what scene model is in, and then anything that looks for the parent in the form of the scene will become confused.
		
		if (this.properties[9] === 0) // if use model is selected;
		{
			this.modelFile = this.properties[10]
			this.setupModel(this.properties[11]===0)
		};
		
		this.InitAnimSystem(); // material should exist by now, and if it doesn't then its a loading shaderMaterial, and model fit will handle the update
		
		if(this.matType !== -1 && this.mat) this.mat.transparent = ( this.properties[34] === 0 );
		
/*		
		if (this.properties[9] === 0)
		{
		    if (this.runtime.Q3D.loadedObjects[this.properties[10]])
		    {

				THREE.TSH.ModelFit(this); // does all the stuff needed to follow settings in properties.
			   
		    }
		    else
		    {
				
				this.runtime.Q3D.loadAddList.push([THREE.TSH.ModelFit,this,this.properties[10]]); //fixed so no anonymous functions are created

		        if (!this.runtime.Q3D.loadQueue[this.properties[10]] && this.properties[11] === 0) this.runtime.Q3D.LoadFile(this.properties[10]); // this should be at end to prevent bugs on fast systems where file loads before qeue callback is made

		    };
		};*/
		
		// ticking is only necessary if things actually have aspects that need to be adjusted
		this.isTicking = false;

		//alert(this.axis);
		
		this.set_bbox3D_changed();
		this.update_bbox3D();

		if(this.box){ 
			this.box.matrixAutoUpdate = false; // this looks nicer, parenting doesn't mess up the axial scaling, as the tree updates but not the bbox
			this.axis.matrixAutoUpdate = false;
		};
		
		/*if(this.properties[38] === 0){
		this.obj.matrixAutoUpdate = false;
		this.col.matrixAutoUpdate = false;
		if(this.model) this.model.matrixAutoUpdate = false;
		//if(this.box) this.box.matrixAutoUpdate = false;
		//if(this.axis) this.axis.matrixAutoUpdate = false;
		};*/
		
		/**BEGIN-PREVIEWONLY**/		
		/*if(!this.type.collision_grid3D.gridCellDebug){
			if( this.properties[34] !== 2)
			{

				this.type.collision_grid3D.gridCellDebug = true;
				if(this.properties[34] === 0) this.type.collision_grid3D.fillCellDebug = true;
				this.type.gridCellDebug = true;
				//alert("activated");
			};
			this.type.collision_grid3D.Wipe(this.properties[20],this.properties[21],this.properties[22],true);
		}else if (this.properties[34] === 0 && !this.type.collision_grid3D.fillCellDebug) this.type.collision_grid3D.Wipe(this.properties[20],this.properties[21],this.properties[22],true)
		else if (this.properties[34] === 1 && this.type.collision_grid3D.fillCellDebug) this.type.collision_grid3D.Wipe(this.properties[20],this.properties[21],this.properties[22],true);*/
		/**END-PREVIEWONLY**/	
		
		//this.type.collision_grid3D.Wipe(this.properties[20],this.properties[21],this.properties[22],false); //resize grid based on insertion props.

	///////////////////////////////////////// physics
	
	};
	
	//////////////////////////////////////////////////////////////////////////////// Animation system functions
	
	instanceProto.animationFinish = function (reverse,mapanim)
	{
		// stop
		mapanim.cur_frame = reverse ? 0 : mapanim.cur_animation.frames.length - 1;
		mapanim.animPlaying = false;
		
		// trigger finish events
		mapanim.animTriggerName = mapanim.cur_animation.name;
		this.mapTriggering = mapanim; 
		
		mapanim.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Q3Dobj .prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Q3Dobj .prototype.cnds.OnAnimFinished, this);
		mapanim.inAnimTrigger = false;
			
		mapanim.animRepeats = 0;
	};
	
	instanceProto.getNowTime = function(mapanim)
	{
		return mapanim.animTimer.sum;
	};
	
	///////////////////////////////////////////////////////////////////////////////// Animation system functions end
	//

	instanceProto.tick2 = function () //called after events
	{
		/*if(this.mat&&this.mat.uniforms)
		this.mat.uniforms.time.value = this.runtime.tickcount*0.01;*/
		
		// morph debnugging
		//this.mat.morphTargets = true//this.runtime.tickcount%2 === 0
		//if(this.model) this.model.morphTargetInfluences[2] = (Math.sin(this.runtime.tickcount/10)+1)*0.5*5;
	
		if(this.colDebug){
			
			if(this.col.type.sphere){ //sphere

			this.update_bbox3D();
			
			this.colDebug.position.copy(this.col.geometry.boundingSphere.center);
			this.colDebug.scale.set(this.col.geometry.boundingSphere.radius,this.col.geometry.boundingSphere.radius,this.col.geometry.boundingSphere.radius);

			};
			
			if(this.col.type.AABB){ //AABB

			this.update_bbox3D();
			
			this.colDebug.position.set((this.col.geometry.boundingBox.min.x+this.col.geometry.boundingBox.max.x)/2,(this.col.geometry.boundingBox.min.y+this.col.geometry.boundingBox.max.y)/2,(this.col.geometry.boundingBox.min.z+this.col.geometry.boundingBox.max.z)/2)
			this.colDebug.scale.copy( this.col.geometry.boundingBox.size() );

			};
		
		};
		
		if(this.axis) this.axis.scale.set(50/this.obj.scale.x,50/this.obj.scale.y,50/this.obj.scale.z);		
	};
	
	instanceProto.tick = function () //called before events
	{
		///////////////////////////////////////////////////////////////////////////// animation system tick stuff
	
	var i ;
	if(this.mapanim){
		for ( i = 0 ; i < 6; i++){

			if(this.mapanim[i].cur_animation){
						//alert("test")
				this.mapanim[i].animTimer.add(this.runtime.getDt(this));

				// Change any animation or frame that was queued
				if (this.mapanim[i].changeAnimName.length)
					this.doChangeAnim(this.mapanim[i]);
				if (this.mapanim[i].changeAnimFrame >= 0)
					this.doChangeAnimFrame(this.mapanim[i]);
				
				var now = this.getNowTime(this.mapanim[i]);
				var cur_animation = this.mapanim[i].cur_animation;
				var prev_frame = cur_animation.frames[this.mapanim[i].cur_frame];
				var next_frame;
				var cur_frame_time = prev_frame.duration / this.mapanim[i].cur_anim_speed;
				
				if (this.mapanim[i].animPlaying && now >= this.mapanim[i].frameStart + cur_frame_time)
				{			
					// Next frame
					if (this.mapanim[i].animForwards)
					{
						this.mapanim[i].cur_frame++;
						//log("Advancing animation frame forwards");
					}
					else
					{
						this.mapanim[i].cur_frame--;
						//log("Advancing animation frame backwards");
					}
						
					this.mapanim[i].frameStart += cur_frame_time;
					
					// Reached end of frames
					if (this.mapanim[i].cur_frame >= cur_animation.frames.length)
					{
						//log("At end of frames");
						
						if (cur_animation.pingpong)
						{
							this.mapanim[i].animForwards = false;
							this.mapanim[i].cur_frame = cur_animation.frames.length - 2;
							//log("Ping pong looping from end");
						}
						// Looping: wind back to repeat-to frame
						else if (cur_animation.loop)
						{
							this.mapanim[i].cur_frame = cur_animation.repeatto;
						}
						else
						{					
							this.mapanim[i].animRepeats++;
							
							if (this.mapanim[i].animRepeats >= cur_animation.repeatcount)
							{
								//log("Number of repeats reached; ending animation");
								
								this.animationFinish(false,this.mapanim[i]);
							}
							else
							{
								//log("Repeating");
								this.mapanim[i].cur_frame = cur_animation.repeatto;
							}
						}
					}
					// Ping-ponged back to start
					if (this.mapanim[i].cur_frame < 0)
					{
						if (cur_animation.pingpong)
						{
							this.mapanim[i].cur_frame = 1;
							this.mapanim[i].animForwards = true;
							//log("Ping ponging back forwards");
							
							if (!cur_animation.loop)
							{
								this.mapanim[i].animRepeats++;
									
								if (this.mapanim[i].animRepeats >= cur_animation.repeatcount)
								{
									//log("Number of repeats reached; ending animation");
									
									this.animationFinish(true,this.mapanim[i]);
								}
							}
						}
						// animation running backwards
						else
						{
							if (cur_animation.loop)
							{
								this.mapanim[i].cur_frame = cur_animation.repeatto;
							}
							else
							{
								this.mapanim[i].animRepeats++;
								
								// Reached number of repeats
								if (this.mapanim[i].animRepeats >= cur_animation.repeatcount)
								{
									//log("Number of repeats reached; ending animation");
									
									this.animationFinish(true,this.mapanim[i]);
								}
								else
								{
									//log("Repeating");
									this.mapanim[i].cur_frame = cur_animation.repeatto;
								}
							}
						}
					}
					
					// Don't go out of bounds
					if (this.mapanim[i].cur_frame < 0)
						this.mapanim[i].cur_frame = 0;
					else if (this.mapanim[i].cur_frame >= cur_animation.frames.length)
						this.mapanim[i].cur_frame = cur_animation.frames.length - 1;
						
					// If frameStart is still more than a whole frame away, we must've fallen behind.  Instead of
					// going catch-up (cycling one frame per tick), reset the frame timer to now.
					if (now > this.mapanim[i].frameStart + (cur_animation.frames[this.mapanim[i].cur_frame].duration / this.mapanim[i].cur_anim_speed))
					{
						//log("Animation can't keep up, resetting timer");
						this.mapanim[i].frameStart = now;
					}
						
					//next_frame = cur_animation.frames[this.mapanim[i].cur_frame];
					next_frame = this.texturebank[cur_animation.index].frames[this.mapanim[i].cur_frame];
					this.OnFrameChanged(next_frame,this.mapanim[i]);
						
					//this.runtime.redraw = true;
					
					//this.mat.map = this.curWebGLTexture;
					//this.updateObjMaterial();
				}
				
			};
		};
	};
	
	/*if(this.mapanim[0].cur_animation) this.mat.map = this.mapanim[0].curWebGLTexture;
	if(this.mapanim[1].cur_animation) this.mat.specularMap = this.mapanim[1].curWebGLTexture;
	if(this.mapanim[2].cur_animation) this.mat.lightMap = this.mapanim[2].curWebGLTexture;
	if(this.mapanim[3].cur_animation) this.mat.envMap = this.mapanim[3].curWebGLTexture;
	if(this.mapanim[4].cur_animation) this.mat.normalMap = this.mapanim[4].curWebGLTexture;
	if(this.mapanim[5].cur_animation) this.mat.bumpMap = this.mapanim[5].curWebGLTexture;*/
	
		////////////////////////////////////////////////////////////////////////////// animation system tick stuff end

		
	};
	
	////////////////////////////////////////////////////////////// animation system functions start
	
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
	
	instanceProto.doChangeAnim = function (mapanim)
	{
		var prev_frame = mapanim.cur_animation.frames[mapanim.cur_frame];
		
		// Find the animation by name
		var anim = this.getAnimationByName(mapanim.changeAnimName);
		
		this.changeAnimName = "";
		
		// couldn't find by name
		if (!anim)
			return;
			
		// don't change if setting same animation and the animation is already playing
		if (cr.equals_nocase(anim.name, mapanim.cur_animation.name) && mapanim.animPlaying)
			return;
			
		mapanim.cur_animation = anim;
		mapanim.cur_anim_speed = anim.speed;
		
		if (mapanim.cur_frame < 0)
			mapanim.cur_frame = 0;
		if (mapanim.cur_frame >= mapanim.cur_animation.frames.length)
			mapanim.cur_frame = mapanim.cur_animation.frames.length - 1;
			
		// from beginning
		if (mapanim.changeAnimFrom === 1)
			mapanim.cur_frame = 0;
			
		mapanim.animPlaying = true;
		mapanim.frameStart = this.getNowTime(mapanim);
		mapanim.animForwards = true;
		
		this.OnFrameChanged( this.texturebank[mapanim.cur_animation.index].frames[mapanim.cur_frame] ,mapanim);
		
		//this.runtime.redraw = true;
	};
	
	instanceProto.doChangeAnimFrame = function (mapanim)
	{
		var prev_frame = mapanim.cur_animation.frames[mapanim.cur_frame];
		var prev_frame_number = mapanim.cur_frame;
		
		mapanim.cur_frame = cr.floor(mapanim.changeAnimFrame);
		
		if (mapanim.cur_frame < 0)
			mapanim.cur_frame = 0;
		if (mapanim.cur_frame >= mapanim.cur_animation.frames.length)
			mapanim.cur_frame = mapanim.cur_animation.frames.length - 1;
			
		if (prev_frame_number !== mapanim.cur_frame)
		{

			this.OnFrameChanged( this.texturebank[mapanim.cur_animation.index].frames[mapanim.cur_frame],mapanim);
			
			mapanim.frameStart = this.getNowTime(mapanim);
			//this.runtime.redraw = true;
		}
		
		mapanim.changeAnimFrame = -1;
	};
	
	instanceProto.OnFrameChanged = function ( next_frame,mapanim)
	{
		// Has the frame size changed?  Resize the object proportionally
		/*var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);*/
			
		// Update hotspot, collision poly and bounding box
		//this.hotspotX = next_frame.hotspotX;
		//this.hotspotY = next_frame.hotspotY;
		//this.collision_poly.set_pts(next_frame.poly_pts);
		//this.set_bbox_changed();
		
		// Update webGL texture if any
		mapanim.curFrame = next_frame;
		//mapanim.curWebGLTexture = next_frame.webGL_texture;
		mapanim.setMap(next_frame.webGL_texture,this); //mapanim.curWebGLTexture)
		
		// Notify behaviors
		/*var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}*/
		
		// Trigger 'on frame changed'
		this.mapTriggering = mapanim;
		this.runtime.trigger(cr.plugins_.Q3Dobj .prototype.cnds.OnFrameChanged, this);
	};
	
	////////////////////////////////////////////////////////////// animation system functions end
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.resetModelAndMap = function ()
	{
		var prot,cur;
		if(this.properties[36]===0 && this.model){
		
			if(this.matType === -1){

				for ( var i = 0, l = this.model.material.materials.length; i < l; i ++ ) {
					prot = this.modelProto.material.materials[i];
					cur = this.model.material.materials[i];
					
					// i don't know a better way to do this, sadly... might be a performance problem will have to test ways to accelerate if thats the case;
					
					if(prot.color) cur.color.copy(prot.color);
					//if(prot.ambient) cur.ambient.copy(prot.ambient);
					if(prot.emissive) cur.emissive.copy(prot.emissive);
					if(prot.specular) cur.specular.copy(prot.specular);
					if(prot.shininess) cur.shininess = prot.shininess;
					if(prot.metal) cur.metal = prot.metal;
					if(prot.map ) cur.map = prot.map;
					if(prot.lightMap) cur.lightMap = prot.lightMap;
					if(prot.bumpMap) cur.bumpMap = prot.bumpMap;
					if(prot.envMap) cur.envMap = prot.envMap;
					if(prot.specularMap) cur.specularMap = prot.specularMap;
					if(prot.normalMap) cur.normalMap = prot.normalMap;
					if(prot.bumpScale) cur.bumpScale = prot.bumpScale;
					if(prot.normalScale) cur.normalScale.copy( prot.normalScale );
					if(prot.combine) cur.combine = prot.combine
					if(prot.reflectivity) cur.reflectivity = prot.reflectivity;
					if(prot.refractionRatio) cur.refractionRatio = prot.refractionRatio;
					if(prot.fog) cur.fog = prot.fog;
					if(prot.wireframe) cur.wireframe = prot.wireframe;
					if(prot.opacity) cur.opacity = prot.opacity;
					if(prot.transparent) cur.transparent = prot.transparent;
					if(prot.blending) cur.blending = prot.blending;
					if(prot.blendSrc) cur.blendSrc = prot.blendSrc;
					if(prot.blendDst) cur.blendDst = prot.blendDst;
					if(prot.blendEquation) cur.blendEquation = prot.blendEquation;
					if(prot.depthTest) cur.depthTest = prot.depthTest;
					if(prot.depthWrite) cur.depthWrite = prot.depthWrite;
					if(prot.polygonOffset) cur.polygonOffset = prot.polygonOffset;
					if(prot.polygonOffsetFactor) cur.polygonOffsetFactor = prot.polygonOffsetFactor;
					if(prot.polygonOffsetUnits) cur.polygonOffsetUnits = prot.polygonOffsetUnits;
					if(prot.side) cur.side = prot.side;
					//if(prot.alphaTest) cur.alphaTest = prot.alphaTest;
					//if(prot.overdraw) cur.overdraw = prot.overdraw;				
				
				};
			}else{
				if(this.matType === 0){ // phong
					this.mat.color.set( 0xffffff );
					//this.mat.ambient.set( 0xffffff );
					this.mat.emissive.set( 0x000000);
					this.mat.specular.set( 0x111111);
					this.mat.shininess = 30;
					this.mat.metal = false;
					this.mat.bumpScale = 1;
					this.mat.normalScale.set( 1, 1 );
					this.mat.combine = THREE.MultiplyOperation;
					this.mat.reflectivity = 1;
					this.mat.refractionRatio = 0.98;
					this.mat.fog = true;
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
					//this.mat.overdraw = 0;
				}else if(this.matType === 1){ // lambert
					this.mat.color.set( 0xffffff );
					//this.mat.ambient.set( 0xffffff );
					this.mat.emissive.set( 0x000000);
					this.mat.combine = THREE.MultiplyOperation;
					this.mat.reflectivity = 1;
					this.mat.refractionRatio = 0.98;
					this.mat.fog = true;
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
				}else if(this.matType === 2){ // basic
					this.mat.color.set( 0xffffff );
					this.mat.combine = THREE.MultiplyOperation;
					this.mat.reflectivity = 1;
					this.mat.refractionRatio = 0.98;
					this.mat.fog = true;
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
				}else if(this.matType === 3){ // normal
					this.mat.combine = THREE.MultiplyOperation;
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
				}else if(this.matType === 4){ // depth
					this.mat.combine = THREE.MultiplyOperation;
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
				}else{
					this.mat.wireframe = false;
					this.mat.opacity = 1;
					this.mat.transparent = false;
					this.mat.blending = THREE.NormalBlending;
					this.mat.blendSrc = THREE.SrcAlphaFactor;
					this.mat.blendDst = THREE.OneMinusSrcAlphaFactor;
					this.mat.blendEquation = THREE.AddEquation;
					this.mat.depthTest = true;
					this.mat.depthWrite = true;
					this.mat.polygonOffset = false;
					this.mat.polygonOffsetFactor = 0;
					this.mat.polygonOffsetUnits = 0;
					this.mat.side = THREE.FrontSide;
					//this.mat.alphaTest = 0;
					
					// reset uniforms to defaults in file
					for(var key in this.mat.uniforms){
					
						if(this.mat.uniforms[key].value.copy){ // need to use copy function to copy vec2/color/etc by value
							this.mat.uniforms[key].value.copy(this.runtime.Q3D.loadedShaders[this.matType].uniforms[key].value);
						}else{ // else can just directly set since js will copy numbers by value
							this.mat.uniforms[key].value = this.runtime.Q3D.loadedShaders[this.matType].uniforms[key].value;
						};
					
					};
					
				};
			};
		};
		
		if(this.model){
			if(this.Q3Dboned){ //clean up the models skeleton in case this wasn't done.
				this.model.destroyC2Bones();
				this.Q3Dboned = false; // automatically done but do it here just in-case
			};
			if(this.runtime.Q3D.loadedObjectsInfo[this.modelFile].morphTargets){
				for(var L = this.model.morphTargetInfluences.length-1 ; L > -1 ; L--){
					 this.model.morphTargetInfluences[L] = 0;
				};
			};
			if(this.type.modelPool[this.modelFile]) this.type.modelPool[this.modelFile][this.matType][this.bithash].push(this.model);
			this.model.parent.remove(this.model);
			this.model = null;
			this.mat = undefined;//this.type.plugin.garbagephong;
		};	
	};

	instanceProto.onDestroy = function ()
	{
	//if(this.skinanimation) this.skinanimation.stop();
	
	this.savedMat = false;
	
	if(this.destroyFlag) return; // not sure if i should have this but meh;
	// is this all thats needed? or do i have to do some mem clearing ... would implementing recycling somehow be a good idea?
	this.destroyFlag = true; // prevent wonkiness with model callback firing after object is destroyed
	//this.runtime.Q3D.scene.remove(this.obj);
	//if(this.isTicking)	this.runtime.untickMe(this); //this is likely slightly faster than letting untick check its array
	if(this.obj.parent !== undefined) this.obj.parent.remove(this.obj);
	//alert(1)
	//clean up the object so it can recycle better
	if(this.box){
	this.obj.remove(this.box);
	this.obj.remove(this.axis);
	this.box = null;
	this.axis = null;
	};
	
	// unneeded
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
	
	/*if(this.obj.colDebugAddedFlag)
	this.obj.remove(this.colDebug);
	
	if(this.obj.modelAddedFlag)
	this.obj.remove(this.obj.modelAddedFlag);
	
	//clean up col so it can recycle properly
	if(this.col.addedToObj)
	this.col.addedToObj.remove(this.col);
	
	if(this.col.colDebugAddedFlag)
	this.col.remove(this.colDebug);*/
	
	if(this.colDebug) this.colDebug.parent.remove(this.colDebug);
	
	this.col.parent.remove(this.col);
	
	this.colDebug = null;
	
	//alert(this+" : "+0)
	// Recursively destroy Q3DObject children
	// 189 broke this......... need to do something new but not sure what
	/*for ( var i = this.obj.children.length-1; i > 0; i -- ) { //iterate backwards or remove messes up!
		
		if(this.obj.children[ i ].userData.inst){ 
		//alert("called DestroyInstance : "+this )
		//this.runtime.DestroyInstance(this.obj.children[ i ].userData.inst); //recursively destroy all Q3D type objects with the userData.inst flag/ref
		//this.obj.remove(this.obj.children[ i ]);
		//this.runtime.ClearDeathRowForSingleInstance(this.obj.children[ i ].userData.inst,this.obj.children[ i ].userData.inst.type);
		//this.obj.children[ i ].userData.inst.OnDestroy();
		//this.runtime.ClearDeathRow();
		}//else this.obj.remove(this.obj.children[ i ]);

	};*/
	//alert('ondestroy')
	//alert(this+" : "+1)
	
	////////
	/////////// override this crap
	//this.obj.matrixAutoUpdate = true;
	//this.col.matrixAutoUpdate = true;
	//if(this.model) this.model.matrixAutoUpdate = true;
	//reset material stuff to defaults
	/*if(this.runtime.Q3D.loadedObjectsInfo[this.modelFile].skinning){
		//alert('tt')
		this.model.destroyC2Bones();
	
	}*/
	////////////////////////////this.visible = true; // reset in on create based on property.
	this.resetModelAndMap();
	// Remove from collision cells
	
	// no new range provided - will remove only (PREVIEW.JS CODE DOES THIS ON CLEARDEATHROW)
	this.type.collision_grid3D.update(this, this.collcells3Dt, null);

	
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		
		alert("saveToJSON not supported");
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
	
		alert("loadFromJSON  not supported");
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	
	// nothing draws
	
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	alert("Draw GL called, please report this bug to the plugin developer");
	// nothing draws
	
	/////////////////////////////////////////////////////////////////////// just here to test animation system
	
	/*glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		var cur_frame = this.curFrame;
		
		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = ((this.x + 0.5) | 0) - this.x;
			var oy = ((this.y + 0.5) | 0) - this.y;
			
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
			else
				glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
			else
				glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}*/
	
	
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

// this works only in node webkit preview but not export, very weird.	
	
/*	instanceProto.updateObjMaterial = function ()   
	{
			var _this = this; //changing material at runtime not working properly, will have to clone current object, change material, re-add to scene, or else dummy textures/phong needed...
			
			this.mat.needsUpdate = true;
			
		if(this.obj.hasOwnProperty('material'))  this.obj.material = this.mat;
		

			this.obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						if(child.hasOwnProperty('material'))  child.material = _this.mat;
									
					}

			} );
			
	}; */
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		//(if (name === "My property")
			//this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	
	
	function Cnds() {};
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// stolen collision stuff from sprite, modified for 3D using modified sparsegrid stuff

	// For the collision memory in 'On collision'.
	var arrCache3D = [];
	
	function allocArr3D()
	{
		if (arrCache3D.length)
			return arrCache3D.pop();
		else
			return [0, 0, 0];
	};
	
	function freeArr3D(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache3D.push(a);
	};
	
	function makeCollKey3D(a, b)
	{
		// comma separated string with lowest value first
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	
	function collmemory_add3D(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;

		var key = makeCollKey3D(a_uid, b_uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			// added already; just update tickcount
			collmemory[key][2] = tickcount;
			return;
		}
		
		var arr = allocArr3D();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	
	function collmemory_remove3D(collmemory, a, b)
	{
		var key = makeCollKey3D(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			freeArr3D(collmemory[key]);
			delete collmemory[key];
		}
	};
	
	function collmemory_removeInstance3D(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				
				// Referenced in either UID: must be removed
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr3D(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	
	var last_coll_tickcount3D = -2;
	
	function collmemory_has3D(collmemory, a, b)
	{
		var key = makeCollKey3D(a.uid, b.uid);
		
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount3D = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount3D = -2;
			return false;
		}
	};
	
	var candidates3D = [];
	
	Cnds.prototype.OnCollision = function (rtype)
	{	
		if (!rtype)
			return false;
			
		var runtime = this.runtime;
			
		// Static condition: perform picking manually.
		// Get the current condition.  This is like the 'is overlapping' condition
		// but with a built in 'trigger once' for the l instances.
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		
		// Create the collision memory, which remembers pairs of collisions that
		// are already overlapping
		if (!cnd.extra.collmemory)
		{
			cnd.extra.collmemory = {};
			
			// Since this is one-time initialisation, also add a destroy callback
			// to remove any instance references from memory
			runtime.addDestroyCallback((function (collmemory) {
				return function(inst) {
					collmemory_removeInstance3D(collmemory, inst);
				};
			})(cnd.extra.collmemory));
		}
		
		var collmemory = cnd.extra.collmemory;
		
		// Get the currently active SOLs for both objects involved in the overlap test
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		
		// Iterate each combination of instances
		var l, linst, r, rinst;
		var curlsol, currsol;
		
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		
		// Note: don't cache lengths of linstances or rinstances. They can change if objects get destroyed in the event
		// retriggering.
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			
			if (rsol.select_all)
			{
				linst.update_bbox();
				//this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates);
				THREE.TSH.getCollisionCandidates(rtype, linst.col.geometry.boundingBox , candidates3D);
				rinstances = candidates3D;
			}
			else
				rinstances = rsol.getObjects();
			
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				
				if (THREE.TSH.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has3D(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount3D < lasttickcount));
					
					// objects are still touching so update the tickcount
					collmemory_add3D(collmemory, linst, rinst, tickcount);
					
					if (run)
					{						
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						
						// If ltype === rtype, it's the same object (e.g. Sprite collides with Sprite)
						// In which case, pick both instances
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							// Pick each instance in its respective SOL
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
					// Pair not overlapping: ensure any record removed (mainly to save memory)
					collmemory_remove3D(collmemory, linst, rinst);
				}
			}
			
			candidates3D.length = 0;
		}
		
		// We've aleady run the event by now.
		return false;
	};
	
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	
	function DoOverlapCondition3D(rtype, do_offset, oldx,oldy,oldz)
	{
		if (!rtype)
			return false;
			
		//var do_offset = (offx !== 0 || offy !== 0 || offz !== 0);
		var ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		
		if (rsol.select_all)
		{
			this.update_bbox3D();
			// this function works by using the current objects bbox to find the rtypes which are in the spatial locations that bbox crosses, i must modify it to work in 3D.
			
			THREE.TSH.getCollisionCandidates(rtype, this.col.geometry.boundingBox , candidates3D);
			rinstances = candidates3D;
			
			
			//rinstances = rtype.instances; // This is basically un-optimized, very slow n^2 test.
		}
		else if (orblock)
			rinstances = rsol.else_instances;
		else
			rinstances = rsol.instances;
		
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		
		/*if (do_offset)
		{
			//oldx = this.obj.position.x;
			//oldy = this.obj.position.y;
			//oldz = this.obj.position.z;
			//this.x += offx;
			//this.y += offy;
			//this.obj.position.set(this.obj.position.x+offx,this.obj.position.y+offy,this.obj.position.z+offz)
			this.set_bbox3D_changed();
		}*/
		
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			
			// objects overlap: true for this instance, ensure both are picked
			// (if ltype and rtype are same, e.g. "Sprite overlaps Sprite", don't pick the other instance,
			// it will be picked when it gets iterated to itself)
			if (THREE.TSH.testOverlap(this, rinst)) 								 /////// modified testOverlap function for 3D objects.
			{
				ret = true;
				
				// Inverted condition: just bail out now, don't pick right hand instance -
				// also note we still return true since the condition invert flag makes that false
				if (inverted)
					break;
					
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		
		if (do_offset)
		{
			//this.x = oldx;
			//this.y = oldy;
			this.obj.position.set(oldx,oldy,oldz);
			this.set_bbox3D_changed();
		}
		
		candidates3D.length = 0;
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
				// All selected: filter down to just those in topick
				sol.select_all = false;
				sol.instances.length = topick.length;
			
				for (i = 0, len = topick.length; i < len; i++)
				{
					sol.instances[i] = topick[i];
				}
				
				// In OR blocks, else_instances must also be filled with objects not in topick
				if (orblock)
				{
					sol.else_instances.length = 0;
					
					for (i = 0, len = rpicktype.instances.length; i < len; i++)
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
					sol.instances.length = initsize + topick.length;
				
					for (i = 0, len = topick.length; i < len; i++)
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
		return DoOverlapCondition3D.call(this, rtype, false);//, 0, 0, 0);
	};
	
	Cnds.prototype.IsOverlappingOffsetParent = function (rtype, offx, offy, offz)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		this.obj.position.set(this.obj.position.x+offx,this.obj.position.y+offy,this.obj.position.z+offz);
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	Cnds.prototype.IsOverlappingOffsetLocal = function (rtype, vecx, vecy, vecz, amount)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		this.fastWorldUpdate();
		THREE.TSH.vec1.set(vecx,vecy,vecz);
		THREE.TSH.vec1.normalize();
		this.obj.translateOnAxis(THREE.TSH.vec1, amount);
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	// this isn't working right now, need to do some matrix magic i haven't worked out yet
	Cnds.prototype.IsOverlappingOffsetWorld = function (rtype, vecx, vecy, vecz)
	{
		var oldx = this.obj.position.x;
		var oldy = this.obj.position.y;
		var oldz = this.obj.position.z;
		
		if(this.hasQ3DObjParent){
			this.fastWorldUpdate();
			var m1 = THREE.TSH.mtx0;
			var e = this.obj.matrixWorld.elements;
			m1.getInverse(this.obj.parent.matrixWorld);
			THREE.TSH.vec0.set(e[12]+vecx,e[13]+vecy,e[14]+vecz);
			THREE.TSH.vec0.applyMatrix4(m1);
		}
		else{ //parent is scene, or someone glitched everything (hopefully my fail-safes suffice)
			THREE.TSH.vec0.set( this.obj.position.x+vecx, this.obj.position.y+vecy, this.obj.position.z+vecz);
		};
		this.obj.position.copy(THREE.TSH.vec0)
		//alert("test")
		this.set_bbox3D_changed();
		return DoOverlapCondition3D.call(this, rtype, true, oldx, oldy, oldz);
	};
	
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};

	/*Cnds.prototype.ObjIsVisible = function ()
	{
				return this.obj.visible;
	};*/
//////////////////////////////////////////////////////////////////////

	Cnds.prototype.IsAnimPlaying = function (animname,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return false;
		// If awaiting a change of animation to really happen next tick, compare to that now
		if (this.mapanim[map].changeAnimName.length)
			return cr.equals_nocase(this.mapanim[map].changeAnimName, animname);
		else
			return cr.equals_nocase(this.mapanim[map].cur_animation.name, animname);
	};
	
	Cnds.prototype.CompareFrame = function (cmp, framenum,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return false;
		return cr.do_cmp(this.mapanim[map].cur_frame, cmp, framenum);
	};
	
	Cnds.prototype.CompareAnimSpeed = function (cmp, x,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return false;
		var s = (this.mapanim[map].animForwards ? this.mapanim[map].cur_anim_speed : -this.mapanim[map].cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	
	Cnds.prototype.OnAnimFinished = function (animname,map)
	{
		return cr.equals_nocase(this.mapanim[map].animTriggerName, animname);
	};
	
	// if these two with maptriggering are causing strange bugs when the thing that triggers them is happenening when they're triggered, bug is likely caused because they dont have something like mapanim[map].inanimtrigger
	Cnds.prototype.OnAnyAnimFinished = function (map)
	{
		//return true;
		return this.mapTriggering === this.mapanim[map];
	};
	
	Cnds.prototype.OnFrameChanged = function (map)
	{
		//if(this.mapTriggering = )
		//return true;
		//alert("triggering")
		return this.mapTriggering === this.mapanim[map];
	};
	
	Cnds.prototype.OnModelCreated = function ()
	{
		return true;
	};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// end collision stuff

	// the example condition
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
/*	instanceProto.recursiveWipeSol = function()
	{		
		for(var i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				sol.select_all = false
				sol.instances.length = 0;
				this.obj.children[i].userData.inst.recursiveWipeSol();
			};
		};
	};
	
	instanceProto.recursivePickSol = function()
	{
		for(var i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				sol.instances.push(this.obj.children[i].userData.inst);
				this.obj.children[i].userData.inst.recursivePickSol();
			};
		};
	};
	
	Cnds.prototype.PickChildren = function (recursive)
	{
		var sol,i;
		var this_sol = this.type.getCurrentSol(); // can't overwrite original selected object list for this type
		this_sol.select_all = false
		this_sol.instances.length = 0;
		
		for( i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
			var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				if(sol !== this_sol){ // can't overwrite original selected object list for this type, or you'll lose what's calling this condition;
					sol.select_all = false
					sol.instances.length = 0;
					if(recursive === 0) this.obj.children[i].userData.inst.recursiveWipeSol();
				};
			};
		};
		
		//alert(this.obj.children.length);
		
		for( i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				sol = this.obj.children[i].userData.inst.type.getCurrentSol();
					sol.instances.push(this.obj.children[i].userData.inst);
							//alert(this.obj.children[i].userData.inst);
					if(recursive === 0) this.obj.children[i].userData.inst.recursivePickSol();
			};
		};
		
		this_sol.instances.push(this);
		//alert(this);
		
		return true;
	};*/
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	/*Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	
	// ... other actions here ...ChangeCollider

	Acts.prototype.MorphInf = function (name,influence)
	{
		if(!(this.model && this.model.morphTargetInfluences)) return;
		// this.model.morphTargetInfluences[2] = (Math.sin(this.runtime.tickcount/10)+1)*0.5*5;
				//alert(this.model.morphTargetDictionary[ name ])
		if(!this.model.morphTargetDictionary[ name ]) return
		//alert("test")

		this.model.morphTargetInfluences[this.model.morphTargetDictionary[ name ]] = influence;
		
	};	

instanceProto.saveMaterial = function()
{
	//if(!this.mat) return;
	if(!this.savedMat) this.savedMat = {}
	if(!this.savedMatGroup) this.savedMatGroup = [];

	if(this.matType === -1 && this.model){ //need to handle model materials (mesh face materials) differently
		
		var m =  this.model.material.materials
		var len
		var i
		
		for(i = 0, len = m.length; i<len ; i++){

			if(!this.savedMatGroup[i]) this.savedMatGroup[i] = {};
			
			for(var key in m[i]){
				if(key !== 'uuid' && key !== 'type' && key !== 'shading' && key !== 'morphNormals' && m[i][key] && typeof m[i][key] !== 'function'){
					if(m[i][key].clone){
					
						this.savedMatGroup[i][key] = m[i][key].clone();
						
					}else if( typeof m[i][key] !== 'object'){
					
						this.savedMatGroup[i][key] = m[i][key];
						
					};
				};
			};
			
		};
		
	}else if(this.mat){
		
		var k
	
		for(var key in this.mat){
			if(key !== 'uuid' && key !== 'type' && key !== 'shading' && key !== 'morphNormals' && this.mat[key] && typeof this.mat[key] !== 'function'){
				if(this.mat[key].clone){
				
					//alert(key+"\n"+this.mat[key]);
					this.savedMat[key] = this.mat[key].clone();
					
				}else if( typeof this.mat[key] !== 'object'){
				
					//alert(key+"\n"+this.mat[key]);
					this.savedMat[key] = this.mat[key];
					
				}else if(key === 'uniforms'){
					
					//alert(k+"\n"+this.mat.uniforms[k]);			
					if(!this.savedMat.uniforms ) this.savedMat.uniforms = {};
					
					for( k in this.mat.uniforms){
						
						if(!this.savedMat.uniforms[k] ) this.savedMat.uniforms[k] = {};
						this.savedMat.uniforms[k].type = this.mat.uniforms[k].type;
						
						if(!this.savedMat.uniforms[k]) this.savedMat.uniforms[k] = {value : 0, type : ""}
						
						if(this.mat.uniforms[k].value.clone){ // need to use clone function to make a saved ref
							
							this.savedMat.uniforms[k].value = this.mat.uniforms[k].value.clone();
							
						}else{ // else can just directly set since js will copy numbers by value
						
							this.savedMat.uniforms[k].value =  this.mat.uniforms[k].value;
							
						};		
					};					
				};
				
			};
		};
	};
	
};

instanceProto.wipeMatSave = function()
{
		
	this.savedMat = false;
	this.savedMatGroup = false;

};

instanceProto.morphSave = function()
{
		
	if(this.model && this.runtime.Q3D.loadedObjectsInfo[this.modelFile].morphTargets){
		this.savedMinf.length = 0;
		for(var i = 0, L = this.model.morphTargetInfluences.length ; i < L ; i++){
			this.savedMinf[i] = this.model.morphTargetInfluences[i];
		};
	};

};

	Acts.prototype.ChangeModel = function (filename,autoload,savemat)
	{

		if(this.modelFile === filename) return;
		
		//save all the materials properties
		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
			if(this.model){
				//this.model.parent.remove(this.model);
				this.resetModelAndMap();
			};
			this.modelFile = filename;
			this.setupModel(autoload===0);

	
	};
	
	Acts.prototype.ChangeMaterialType = function (type,savemat)
	{
		//early out if someones doing something stupid
		if(type === this.matType) return;
		
		//save all the materials properties
		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
		this.morphSave();
		
		this.shaderFile = false;
		
		
		//if(this.modelFile !== filename){
			if(this.model){
			
				this.resetModelAndMap();
				this.matType = type;
				this.setupModel(false,true);
			
			}else{
			
			this.matType = type;
			this.setupModel(false,true);
			
			};
			//this.modelFile = filename;
			//this.setupModel(autoload===0);
		//};
	};
	
	Acts.prototype.changeToModelMats = function (savemat)
	{
		//early out if someones doing something stupid
		if(-1 === this.matType) return;
		
		//save all the materials properties
		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
		this.morphSave();
		
		this.shaderFile = false;
		
		
		//if(this.modelFile !== filename){
			if(this.model){
			
				this.resetModelAndMap();
				this.matType = -1;
				this.setupModel(false,true);
			
			}else{
			
			this.matType = -1;
			this.setupModel(false,true);
			
			};
			//this.modelFile = filename;
			//this.setupModel(autoload===0);
		//};
	};
	
	Acts.prototype.changeShading = function (shading,savemat)
	{
		//early out if someones doing something stupid
		if(shading === this.properties[42]) return;

		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
		this.morphSave();
		
		this.properties[42] = shading;
		
		
		if(this.model){
			
				this.resetModelAndMap();
				this.setupModel(false,true);
			
		}else{
			
		this.setupModel(false,true);
			
		};

	};
	
	Acts.prototype.changeMorphNormals = function (choice,savemat)
	{
		//early out if someones doing something stupid
		if(choice === this.properties[43]) return;

		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
		this.morphSave();
		
		this.properties[43] = choice;
		
		
		if(this.model){
			
				this.resetModelAndMap();
				this.setupModel(false,true);
			
		}else{
			
		this.setupModel(false,true);
			
		};

	};
	
	Acts.prototype.ChangeToShader = function (shader,savemat)
	{
		//early out if someones doing something stupid
		if(shader === this.matType) return;
	
		//save all the materials properties
		if(savemat === 0) this.saveMaterial()
		else this.wipeMatSave();
		
		this.morphSave();
		
		this.shaderFile = shader;
		this.runtime.Q3D.LoadFile(shader);	

			if(this.model){
			
				this.resetModelAndMap();
				this.matType = shader;
				this.setupModel(false,true);
			
			}else{
			
			this.matType = shader;
			this.setupModel(false,true);
			
			};

	};	
	
	Acts.prototype.setUniformNum = function (uniform,val0)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform]  && typeof this.mat.uniforms[uniform].value === 'number')
		this.mat.uniforms[uniform].value = val0;
	};
	
	Acts.prototype.setUniformVec2 = function (uniform,val0,val1)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'v2'){
		
		this.mat.uniforms[uniform].value.set(val0,val1);
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformVec3 = function (uniform,val0,val1,val2)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'v3'){
		
		this.mat.uniforms[uniform].value.set(val0,val1,val2);
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformVec4 = function (uniform,val0,val1,val2,val3)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'v4'){
		
		this.mat.uniforms[uniform].value.set(val0,val1,val2,val3);
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformColor = function (uniform,val0)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'c'){
		
		this.mat.uniforms[uniform].value.setHexR(val0); 
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformMat3 = function (uniform,val0,val1,val2  ,val3,val4,val5  ,val6,val7,val8)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'm3'){
		
		this.mat.uniforms[uniform].value.set(val0,val1,val2,  val3,val4,val5,  val6,val7,val8);
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformMat4 = function (uniform,   val0,val1,val2,val3,  val4,val5,val6,val7,   val8,val9,val10,val11,  val12,val13,val14,val15)
	{
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 'm4'){
		
		this.mat.uniforms[uniform].value.set(val0,val1,val2,val3,  val4,val5,val6,val7,  val8,val9,val10,val11,  val12,val13,val14,val15);
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		}
	};
	
	Acts.prototype.setUniformTexture = function (uniform,   name)
	{
		var texture = this.runtime.Q3D.texture[name];
	
		if(this.mat&&this.mat.uniforms&&this.mat.uniforms[uniform] && this.mat.uniforms[uniform].type === 't' && texture){
		
		this.mat.uniforms[uniform].value = texture;
		
		//alert(this.runtime.Q3D.loadedShaders[this.matType].uniforms[uniform].value.x)
		
		};
	};
	
	Acts.prototype.ChangeCollider = function (colliderType)
	{
		if(this.col.type.colliderType === colliderType) return; //don't waste time reseting to same collider.
		//alert(this.colDebug)
		if(this.colDebug){
		this.colDebug.parent.remove(this.colDebug);
		this.colDebug = null;
		}
		this.setupCollider(colliderType);
		this.set_bbox3D_changed();		
		//return;
	};	
	
	Acts.prototype.SelectModelMaterial = function (index)
	{
		//var _this=this
		//this.mat = this.model
		if(this.properties[35]===0 && this.model && this.model.material && this.model.material.materials){
		if(this.model.material.materials[index]) this.mat = this.model.material.materials[index];
		else alert("Index was not valid, please select an index from [ 0 to "+(this.model.material.materials.length-1)+" ] for this particular model");
		};
		//return;
	};	
	
	
	Acts.prototype.CollGridSettings = function (debug,xs,ys,zs)
	{

		/**BEGIN-PREVIEWONLY**/		
		if(debug === 0){
		this.type.collision_grid3D.gridCellDebug = true;
		//this.type.gridCellDebug = true;
		this.type.collision_grid3D.fillCellDebug = true;
		this.type.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		};
		if(debug === 1){
		this.type.collision_grid3D.gridCellDebug = true;
		//this.type.gridCellDebug = true;
		this.type.collision_grid3D.fillCellDebug = false;
		this.type.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		}
		if(debug === 2){
		this.type.collision_grid3D.gridCellDebug = false;
		//this.type.gridCellDebug = false;
		this.type.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		}
		/**END-PREVIEWONLY**/
		
		this.type.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),false);
		//return;
	
	};	
	
/*	Acts.prototype.ObjSetPosParent = function (xpos,ypos,zpos)
	{
	//var obj = this.runtime.Q3D.EpickById(name);
	//if(! obj ) return;
	//this.obj.position.x = xpos;
	//this.obj.position.y = ypos;
	//this.obj.position.z= zpos;
	
	this.obj.position.set(xpos,ypos,zpos)
	
	//this.x = xpos;
	//this.y = ypos;
	//this.properties[1] = zpos;
	this.set_bbox3D_changed();

	};*/
	
	/*Acts.prototype.ObjSetPosLocal = function (xpos,ypos,zpos)
	{
	
	this.fastWorldUpdate();
	var e = this.obj.matrix.elements
	THREE.TSH.vec0.set(xpos*e[0]+ypos*e[4]+zpos*e[8],xpos*e[1]+ypos*e[5]+zpos*e[9],xpos*e[2]+ypos*e[6]+zpos*e[10]);
	this.obj.position.add(THREE.TSH.vec0);

	this.set_bbox3D_changed();

	};*/
	
	/*Acts.prototype.ObjSetPosWorld = function (xpos,ypos,zpos)
	{
	
	if(this.obj.parent.userData.inst){
		this.fastWorldUpdate();
		var m1 = THREE.TSH.mtx0;
		m1.getInverse(this.obj.parent.matrixWorld);
		THREE.TSH.vec0.set(xpos,ypos,zpos);
		THREE.TSH.vec0.applyMatrix4(m1);
	}
	else{
		THREE.TSH.vec0.set(xpos,ypos,zpos)
	};
	this.obj.position.copy(THREE.TSH.vec0)
	
	this.set_bbox3D_changed();

	};*/
	
	/*Acts.prototype.ObjSetRot = function (order,xrot,yrot,zrot)
	{
	

	this.obj.rotation.order= order;

	this.obj.rotation.set(xrot*(THREE.Deg2Rad),yrot*(THREE.Deg2Rad),zrot*(THREE.Deg2Rad))
	
	this.set_bbox3D_changed();

	};*/
	
	/*Acts.prototype.ObjLookAtLocal = function (xpos,ypos,zpos)
	{
	
	THREE.TSH.vec0.set(xpos,ypos,zpos);
	
	this.obj.lookAt( THREE.TSH.vec0 );

	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjLookAtWorld = function (xpos,ypos,zpos)
	{

		var m2 = THREE.TSH.mtx1;

	//optimizations could go a long way in speeding this up.
		if(this.obj.parent.userData.inst){
			
			this.fastWorldUpdate();
			
			var m1 = THREE.TSH.mtx0;
			
			var e = this.obj.parent.matrixWorld.elements

			m2.copy(this.obj.parent.matrixWorld);
			
			var e2 = m2.elements;
			e2[12]=0;
			e2[13]=0;
			e2[14]=0;
			m1.getInverse(m2);
			
			//this.obj.parent.userData.inst.m3inverse();
			
			THREE.TSH.vec0.set(xpos,ypos,zpos);
			THREE.TSH.vec0.applyMatrix4(m1);
			THREE.TSH.vec1.copy(this.obj.up);
			THREE.TSH.vec1.applyMatrix4(m1);
			THREE.TSH.vec2.set(this.obj.matrixWorld.elements[12],this.obj.matrixWorld.elements[13],this.obj.matrixWorld.elements[14]);
			THREE.TSH.vec2.applyMatrix4(m1);
			
			m2.lookAt( THREE.TSH.vec0 , THREE.TSH.vec2, THREE.TSH.vec1 );
		
		}else{ // incase users use this badly on an object parented to scene, speed it up, IF is cheaper than a huge mistake.
			
			THREE.TSH.vec0.set(xpos,ypos,zpos);
			m2.lookAt( THREE.TSH.vec0 , this.obj.position, this.obj.up );
		
		};

		this.obj.quaternion.setFromRotationMatrix( m2 );
	
		this.set_bbox3D_changed();

	
	};*/
	
	/*Acts.prototype.ObjMoveAxisLocal = function (vecx,vecy,vecz,amount)
	{
	
	THREE.TSH.vec0.set(vecx,vecy,vecz);

	THREE.TSH.vec0.normalize();
	this.obj.translateOnAxis(THREE.TSH.vec0, amount);
	
	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjRotAxisLocal = function (vecx,vecy,vecz,amount)
	{
	// ohhhhhhhhhhhhhhhhhhh please come to the principles office

	THREE.TSH.vec0.set(vecx,vecy,vecz);
	THREE.TSH.vec0.normalize();
	
	this.obj.rotateOnAxis(THREE.TSH.vec0, amount*(THREE.Deg2Rad));
	
	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjSetUpVec = function (vecx,vecy,vecz)
	{
	
	THREE.TSH.vec0.set(vecx,vecy,vecz);
	THREE.TSH.vec0.normalize();
	
	this.obj.up.copy(THREE.TSH.vec0);
	
	this.Uw.needsUpdate = true;
	
	};*/
	
	/*Acts.prototype.ObjRotAxisWorld = function (vecx,vecy,vecz,amount)
	{
	// optimizable optimize performance

	this.fastWorldUpdate();
	
	THREE.TSH.vec0.set(vecx,vecy,vecz);

	var m1 = THREE.TSH.mtx0;
	var m2 = THREE.TSH.mtx1;
	m2.copy(this.obj.matrixWorld);
	m2.elements[12]=0;
	m2.elements[13]=0;
	m2.elements[14]=0;
	m1.getInverse(m2);

	THREE.TSH.vec0.applyMatrix4(m1);

	THREE.TSH.vec0.normalize();
	this.obj.rotateOnAxis(THREE.TSH.vec0, amount*(THREE.Deg2Rad));

	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjSetRotAxisAngle = function (xax,yax,zax,angle)
	{

	THREE.TSH.vec0.set(xax,yax,zax);
	THREE.TSH.vec0.normalize();
	this.obj.setRotationFromAxisAngle(THREE.TSH.vec0,angle*(THREE.Deg2Rad));

	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjSetScale = function (x,y,z)
	{
	
	this.obj.scale.set(x,y,z);

	this.set_bbox3D_changed();
	
	};*/
	
	/*Acts.prototype.ObjSetVisible = function (vis)
	{
	
	this.obj.visible = (vis === 0);//set;
			
	};*/

	/*Acts.prototype.ObjSetCastShadow = function (vis)
	{
	
		if(!this.model) return;
		var set;
		
		vis == 0 ? set =  false : set = true ;
		// you learn something new sometimes
		this.traversingResetFlag = true;
		
		this.model.castShadow = set;
		
		
			this.model.traverse( function ( child ) {
					// wont work well with skinned-meshes?
					if ( child instanceof THREE.Mesh ) {

						child.castShadow = set;
									
					}

			} );
		
	};*/
	
	/*Acts.prototype.ObjSetReceiveShadow = function (vis)
	{
	
		if(!this.model) return;
		var set;
		
		this.traversingResetFlag = true;
		
		vis == 0 ? set =  false : set = true ;

		this.model.receiveShadow = set;
		
	
			this.model.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.receiveShadow = set;
									
					}

			} );
		
	
	};*/
	
	/*Acts.prototype.ObjSetFrustumCulled = function (vis)
	{
	
	var set;

	set = vis == 0;
	
	this.traversingResetFlag = true;
	
	this.obj.frustumCulled = set;
	

			this.obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.frustumCulled = set;
									
					}

			} );


	};*/
	
	/*Acts.prototype.ObjSetMatrixAutoUpdate = function (vis)
	{
	
	this.autoUpdateFlag = vis === 0; // need this because i modify matrixAutoUpdate as optimization, this fixes it so optimization never occurs in bboxchanged;

	};*/
	
	/*Acts.prototype.ObjSetMatrixUpdate = function ()
	{
	
	//var obj = this.runtime.Q3D.EpickById(name);
	//if(! obj ) return;
	this.obj.updateMatrix();

	};*/
	
	/*Acts.prototype.ObjSetMatrix = function (Xx,Xy,Xz,Xw,Yx,Yy,Yz,Yw,Zx,Zy,Zz,Zw,Wx,Wy,Wz,Ww)
	{
	
	//var obj = this.runtime.Q3D.EpickById(name);
	//if(! obj ) return;
	//this.obj.matrix.set( Xx,Xy,Xz,Xw,Yx,Yy,Yz,Yw,Zx,Zy,Zz,Zw,Wx,Wy,Wz,Ww )
	this.obj.matrix.set( Xx,Yx,Zx,Wx,Xy,Yy,Zy,Wy,Xz,Yz,Zz,Wz,Xw,Yw,Zw,Ww );
	//this.obj.matrixWorldNeedsUpdate = true;
	
	this.set_bbox3D_changed();
	
	};*/
	
	// Material Settings (i upgraded them to work with multiple materials, and with shader materials that use similarly named uniforms)
	
	Acts.prototype.MaterialsSetMeshPhongBumpMapScale = function (BmapS)
	{
		//var mat = this.runtime.Q3D.material[name];
		if(! this.mat ) return;
		if(this.mat.hasOwnProperty('bumpScale')) this.mat.bumpScale = BmapS
		else if(this.mat.uniforms && this.mat.uniforms.bumpScale) this.mat.uniforms.bumpScale.value = BmapS
	
	};
	
	Acts.prototype.MaterialsSetSpecular = function (color)
	{
	
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('specular')) return;
	//this.mat.specular.setHexR(color);
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('specular')) this.mat.specular.setHexR(color)
	else if(this.mat.uniforms && this.mat.uniforms.specular) this.mat.uniforms.specular.value.setHexR(color)

	};
	
	Acts.prototype.MaterialsSetShininess = function (shine)
	{
	
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('shininess')) return;
	//this.mat.shininess = shine;
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('shininess')) this.mat.shininess = shine
	else if(this.mat.uniforms && this.mat.uniforms.shininess) this.mat.uniforms.shininess.value = shine

	};
	
	Acts.prototype.MaterialsSetMeshPhongNormalMapScale = function (X,Y)
	{
	
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('shininess')) return;
	//this.mat.normalScale.set(X,Y);
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('normalScale')) this.mat.normalScale.set(X,Y)
	else if(this.mat.uniforms && this.mat.uniforms.normalScale) this.mat.uniforms.normalScale.value.set(X,Y)

	};
	
	Acts.prototype.MaterialsSetMetal = function (metal)
	{
	
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('metal')) return;
	//metal == 0 ? this.mat.metal = false : this.mat.metal = true;
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('metal')){ this.mat.metal = metal === 1 ;}
	// can't really have a boolean unifrom
	
	};
	
	Acts.prototype.MaterialsSetOpacity = function (Trans,Opacity)
	{
		//var mat = this.runtime.Q3D.material[name];
		if(! this.mat ) return;
		//Trans == 0 ? this.mat.transparent = false : this.mat.transparent = true;
		this.mat.transparent = Trans === 1;
		this.mat.opacity = Opacity;
		if(this.mat.uniforms && this.mat.uniforms.opacity) this.mat.uniforms.opacity.value = Opacity;
		
	};
	
	Acts.prototype.MaterialsSetBlending = function (blend,source,dest,eqn)
	{
		//var mat = this.runtime.Q3D.material[name];
		//if(! mat ) return;
		if(! this.mat ) return;
		
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
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//dtest == 0 ? this.mat.depthTest = false : this.mat.depthTest = true;
	this.mat.depthTest = dtest === 1;
	//dwrite == 0 ? this.mat.depthWrite = false : this.mat.depthWrite = true;
	this.mat.depthWrite = dwrite === 1;
	
	};
	
	Acts.prototype.MaterialsPolygonOffset = function (poffset,factor,unit)
	{
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//poffset == 0 ? this.mat.polygonOffset = false : this.mat.polygonOffset = true;
	this.mat.polygonOffset = poffset === 1;
	this.mat.polygonOffsetFactor = factor;
	this.mat.polygonOffsetUnits = unit;
	
	};
	
	
	Acts.prototype.MaterialsAlphaTest = function (alphatest)
	{
	
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	if((this.mat.alphatest) !== alphatest) this.mat.needsUpdate = true;
	this.mat.alphatest = alphatest;
	this.mat.needsUpdate;
	
	};
	
	Acts.prototype.MaterialsOverdraw = function (yes)
	{
	
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//yes == 0 ? this.mat.overdraw = false : this.mat.overdraw = true;
	this.mat.overdraw = yes === 1;
	
	};
	
	Acts.prototype.MaterialsDrawSide = function (side)
	{
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	switch(side){
		case 0:
			this.mat.side = THREE.FrontSide;
			break;
		case 1:
			this.mat.side = THREE.BackSide;
			break;
		case 2:
			this.mat.side = THREE.DoubleSide;
			break;
		}
	};
	
	/*Acts.prototype.MaterialsUpdate = function ()
	{
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	this.mat.needsUpdate = true;
	};*/
	
	Acts.prototype.MaterialsSetColor = function (color)
	{
	
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('color')) return;
	//this.mat.color.setHexR(color);
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('color')) this.mat.color.setHexR(color)
	else if(this.mat.uniforms && this.mat.uniforms.color) this.mat.uniforms.color.value.setHexR(color)
	

	};
	
	Acts.prototype.MaterialsSetAmbient = function (color)
	{
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('ambient')) return;
	//this.mat.ambient.setHexR(color);
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('ambient')) this.mat.ambient.setHexR(color)
	else if(this.mat.uniforms && this.mat.uniforms.ambient) this.mat.uniforms.ambient.value.setHexR(color)

	};
	
	Acts.prototype.MaterialsSetEmissive = function (color)
	{
	//if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('emissive')) return;
	//this.mat.emissive.setHexR(color);
	
	if(! this.mat ) return;
	if(this.mat.hasOwnProperty('emissive')) this.mat.emissive.setHexR(color)
	else if(this.mat.uniforms && this.mat.uniforms.emissive) this.mat.uniforms.emissive.value.setHexR(color)
	
	};
	
	Acts.prototype.MaterialsSetWireframe = function (yes)
	{
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('wireframe')) return;
	//yes == 0 ? this.mat.wireframe = false : this.mat.wireframe = true ;
	this.mat.wireframe = yes === 1;

	};
	
	Acts.prototype.MaterialsSetFog = function (yes)
	{
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('fog')) return;
	if((this.mat.fog) === (yes === 0)) this.mat.needsUpdate = true; // prevent redundant expensive updates ? fog setting should need a model rebuild, or it'll lead to materials not reseting.
	this.mat.fog = yes === 1 ;


	};
	
	/*Acts.prototype.MaterialsSetMaps = function (map,texture)
	{
	if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	var tex = this.runtime.Q3D.texture[texture];
	if(! tex) tex = null;
		switch(map)
		{
		case 0:
			if(! this.mat.hasOwnProperty('map')) return;
			this.mat.map = tex;
			break;
		case 1:
			if(! this.mat.hasOwnProperty('specularMap')) return;
			this.mat.specularMap = tex;
			break;
		case 2:
			if(! this.mat.hasOwnProperty('envMap')) return;
			this.mat.envMap = tex;
			break;
		case 3:
			if(! this.mat.hasOwnProperty('lightMap')) return;
			this.mat.lightMap = tex;
			break;
		}

	};*/
	
	Acts.prototype.MaterialsEnvSettings = function (comb,amount,ratio)
	{
	
		if(! this.mat ) return;
	//var mat = this.runtime.Q3D.material[name];
	//if(! mat) return;
	//if(! this.mat.hasOwnProperty('combine')) return;
		if(this.mat.hasOwnProperty('envMap')){
			switch(comb)
			{
			case 0:
				this.mat.combine = THREE.Multiply;
				break;
			case 1:
				this.mat.combine =  THREE.MixOperation;
				break;
			case 2:
				this.mat.combine = THREE.AddOperation;
				break;
			}
		
			this.mat.reflectivity = amount;
			this.mat.refractionRatio = ratio;
		}else if(this.mat.uniforms){
			if(this.mat.uniforms.combine){
				switch(comb)
				{
				case 0:
					this.mat.uniforms.combine.value = THREE.Multiply;
					break;
				case 1:
					this.mat.uniforms.combine.value =  THREE.MixOperation;
					break;
				case 2:
					this.mat.uniforms.combine.value = THREE.AddOperation;
					break;
				}
			}
			
			if(this.mat.uniforms.reflectivity) this.mat.uniforms.reflectivity.value = amount;
			if(this.mat.uniforms.refractionRatio) this.mat.uniforms.refractionRatio.value = ratio;
		
		}
	
	};
	
	/////////////////////////////////////////////////// animation stuff
	
	Acts.prototype.StopAnim = function (map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return;
		
		this.mapanim[map].animPlaying = false
		//this.animPlaying = false;
		//log("Stopping animation");
	};
	
	Acts.prototype.StartAnim = function (from,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return;
		
		this.mapanim[map].animPlaying = true;
		this.mapanim[map].frameStart = this.getNowTime(this.mapanim[map]);
		//log("Starting animation");
		
		// from beginning
		if (from === 1 && this.mapanim[map].cur_frame !== 0)
		{
			this.mapanim[map].changeAnimFrame = 0;
			
			if (!this.mapanim[map].inAnimTrigger)
				this.doChangeAnimFrame(this.mapanim[map]);
		}
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	
	Acts.prototype.SetAnim = function (animname, from,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return;
		
		this.mapanim[map].changeAnimName = animname;
		this.mapanim[map].changeAnimFrom = from;
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		// not in trigger: apply immediately
		if (!this.mapanim[map].inAnimTrigger){
			//if(animname is compatible with map)
			this.doChangeAnim(this.mapanim[map]);
			//else alert not compatible add flag
		};
	};
	
	Acts.prototype.SetAnimFrame = function (framenumber,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return;
	
		this.mapanim[map].changeAnimFrame = framenumber;
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		
		// not in trigger: apply immediately
		if (!this.mapanim[map].inAnimTrigger)
			this.doChangeAnimFrame(this.mapanim[map]);
	};
	
	Acts.prototype.SetAnimSpeed = function (s,map)
	{
		if(!(this.mapanim && this.mapanim[map].cur_animation)) return;
	
		this.mapanim[map].cur_anim_speed = cr.abs(s);
		this.mapanim[map].animForwards = (s >= 0);
		
		//this.frameStart = this.runtime.kahanTime.sum;
		
		// start ticking if not already
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	
	///////////////////////////////////////////////////// texture properties
	
	Acts.prototype.TexturesSetWrap = function (wrapS,wrapT,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;		
		
		switch(wrapS)
		{
		case 0:	
			break;
		case 1:
			texture.wrapS = THREE.ClampToEdgeWrapping;
			break;
		case 2:
			texture.wrapS = THREE.RepeatWrapping;
			break;
		case 3:
			texture.wrapS = THREE.MirroredRepeatWrapping;
			break;
		};
		
		switch(wrapT)
		{
		case 0:	
			break;
		case 1:
			texture.wrapT = THREE.ClampToEdgeWrapping;
			break;
		case 2:
			texture.wrapT = THREE.RepeatWrapping;
			break;
		case 3:
			texture.wrapT = THREE.MirroredRepeatWrapping;
			break;
		};
		
		texture.needsUpdate = true;*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		var setwS,setwT
		
		switch(wrapS)
		{
		case 0:	
			break;
		case 1:
			setwS = THREE.ClampToEdgeWrapping;
			break;
		case 2:
			setwS = THREE.RepeatWrapping;
			break;
		case 3:
			setwS = THREE.MirroredRepeatWrapping;
			break;
		};
		
		switch(wrapT)
		{
		case 0:	
			break;
		case 1:
			setwT = THREE.ClampToEdgeWrapping;
			break;
		case 2:
			setwT = THREE.RepeatWrapping;
			break;
		case 3:
			setwT = THREE.MirroredRepeatWrapping;
			break;
		};		
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					if(setwS) texture.wrapS = setwS;
					if(setwT) texture.wrapT = setwT;
					texture.needsUpdate = true;
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				if(setwS) texture.wrapS = setwS;
				if(setwT) texture.wrapT = setwT;
				texture.needsUpdate = true;
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						if(setwS) texture.wrapS = setwS;
						if(setwT) texture.wrapT = setwT;
						texture.needsUpdate = true;
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					if(setwS) texture.wrapS = setwS;
					if(setwT) texture.wrapT = setwT;
					texture.needsUpdate = true;
				}
			}		
		}		
		
	};
	
	Acts.prototype.TexturesSetRepeat = function (ru,rv,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;
		
		texture.repeat.set(ru,rv);*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					texture.repeat.set(ru,rv);
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				texture.repeat.set(ru,rv);
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						texture.repeat.set(ru,rv);
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					texture.repeat.set(ru,rv);
				}
			}		
		}
		
	};
	
	Acts.prototype.TexturesSetOffset = function (ru,rv,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		//if(!this.mat) return;
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;
		
		texture.offset.set(ru,rv);*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					texture.offset.set(ru,rv);
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				texture.offset.set(ru,rv);
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						texture.offset.set(ru,rv);
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					texture.offset.set(ru,rv);
				}
			}		
		}
		

	};
	
	Acts.prototype.TexturesSetFlipY = function (flipy,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		//var texture = this.mat[THREE.Q3Da[map]];
		//if(!texture) return;
		
		//flipy == 0 ? texture.flipY = false : texture.flipY = true;
		//texture.flipY = flipy === 1;
		//texture.needsUpdate = true; //needed
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		var set = flipy === 1;
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					texture.flipY = set;
					texture.needsUpdate = true;
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				texture.flipY = set;
				texture.needsUpdate = true;
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						texture.flipY = set;
						texture.needsUpdate = true;
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					texture.flipY = set;
					texture.needsUpdate = true;
				}
			}		
		}
		
	};
	
	Acts.prototype.TexturesSetGenerateMipMaps = function (gen,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;
		
		gen == 0 ? texture.generateMipmaps = false : texture.generateMipmaps = true;
		
		texture.needsUpdate = true; //(i don't think this is needed)) if bottleneck investigate*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		var set = gen === 1;
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					texture.generateMipmaps = set;
					texture.needsUpdate = true;
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				texture.generateMipmaps = set;
				texture.needsUpdate = true;
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						texture.generateMipmaps = set;
						texture.needsUpdate = true;
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					texture.generateMipmaps = set;
					texture.needsUpdate = true;
				}
			}		
		}
		
	};
	
	Acts.prototype.TexturesSetFiltering = function (mag,min,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;
		
		switch(mag)
		{
		case 0:	
			break;
		case 1:
			texture.magFilter = THREE.LinearFilter;
			break;
		case 2:
			texture.magFilter = THREE.NearestFilter;
			break;
		};
		
		switch(min)
		{
		case 0:	
			break;
		case 1:
			texture.minFilter = THREE.LinearMipMapLinearFilter;
			break;
		case 2:
			texture.minFilter = THREE.NearestFilter;
			break;
		case 3:
			texture.minFilter = THREE.NearestMipMapNearestFilter;
			break;
		case 4:
			texture.minFilter = THREE.NearestMipMapLinearFilter;
			break;
		case 5:
			texture.minFilter = THREE.LinearFilter;
			break;
		case 6:
			texture.minFilter = THREE.LinearMipMapNearestFilter;
			break;
		};
		
		texture.needsUpdate = true;*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		var setmag,setmin
		
		switch(mag)
		{
		case 0:	
			break;
		case 1:
			setmag = THREE.LinearFilter;
			break;
		case 2:
			setmag = THREE.NearestFilter;
			break;
		};
		
		switch(min)
		{
		case 0:	
			break;
		case 1:
			setmin = THREE.LinearMipMapLinearFilter;
			break;
		case 2:
			setmin = THREE.NearestFilter;
			break;
		case 3:
			setmin = THREE.NearestMipMapNearestFilter;
			break;
		case 4:
			setmin = THREE.NearestMipMapLinearFilter;
			break;
		case 5:
			setmin = THREE.LinearFilter;
			break;
		case 6:
			setmin = THREE.LinearMipMapNearestFilter;
			break;
		};
		
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					if(setmin) texture.minFilter = setmin;
					if(setmag) texture.magFilter = setmag;
					texture.needsUpdate = true;
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				if(setmin) texture.minFilter = setmin;
				if(setmag) texture.magFilter = setmag;
				texture.needsUpdate = true;
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						if(setmin) texture.minFilter = setmin;
						if(setmag) texture.magFilter = setmag;
						texture.needsUpdate = true;
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					if(setmin) texture.minFilter = setmin;
					if(setmag) texture.magFilter = setmag;
					texture.needsUpdate = true;
				}
			}		
		}		
	
	};
	
	Acts.prototype.TexturesSetAnisotropy = function (aniso,map,affect)
	{
		//var texture = this.runtime.Q3D.texture[name];
		//if(! texture) return;
		//if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
		//var texture =  this.texturebank[this.mapanim[map].cur_animation.index].frames[this.mapanim[map].cur_frame].webGL_texture;
		
		/*var texture = this.mat[THREE.Q3Da[map]];
		if(!texture) return;
		
		texture.anisotropy = aniso;
		
		texture.needsUpdate = true;*/
		
		var i,k;
		var t;
		var texture;
		if(!this.mat) return;
		
		if(map<6){
			if(affect === 0){
				if(!(this.mapanim && this.mapanim[map] && this.mapanim[map].cur_animation)) return;
				t = this.texturebank[this.mapanim[map].cur_animation.index].frames
				for(i = t.length-1 ; i > -1 ; i--){
					texture =  t[i].webGL_texture;
					texture.anisotropy = aniso;
					texture.needsUpdate = true;
				}				
			}else{
				texture = this.mat[THREE.Q3Da[map]];
				if(!texture) return;
				texture.anisotropy = aniso;
				texture.needsUpdate = true;
			}			
		}else{
			if(affect === 0){
				for(k = this.texturebank.length-1 ; k > -1 ; k--){
					t = this.texturebank[k].frames
					for(i = t.length-1 ; i > -1 ; i--){
						texture =  t[i].webGL_texture;
						texture.anisotropy = aniso;
						texture.needsUpdate = true;
					}
				}
			}else{
				for(i = 0 ; i < 6 ; i++){
					texture = this.mat[THREE.Q3Da[i]];
					if(!texture) continue;
					texture.anisotropy = aniso;
					texture.needsUpdate = true;
				}
			}		
		}		
	
	};
	
	Acts.prototype.TexturesAdvancedSwap = function (name,map)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;

		this.mapanim[map].setMap(texture,this); // overrides current texture in use until set map is next called.
	};
	
	///////////////////////////////////////////////////////// parenting control
	
	/*Acts.prototype.ObjChangeParent = function (parent,transf)
	{
	
		var p = parent.getFirstPicked()
		if (!p) return;
		if(transf === 0){ //if yes
		this.fastWorldUpdate();
		p.fastWorldUpdate();
		var m = THREE.TSH.mtx0;
		m.getInverse(p.obj.matrixWorld);
		m.multiply(this.obj.matrixWorld);
		m.decompose ( this.obj.position,  this.obj.quaternion,  this.obj.scale );
		//this.obj.quaternion.normalize();
		};
		p.obj.add(this.obj);
		this.toplevelparent = p.toplevelparent;
		this.set_bbox3D_changed();
		
	};
	
	Acts.prototype.ObjAddChild = function (childtype,transf)
	{
	
		var inst = childtype.getCurrentSol().getObjects();
		var i, leni;

		if(transf === 0){
			this.fastWorldUpdate();
			var m0 = THREE.TSH.mtx0;
			var m1 = THREE.TSH.mtx1;
			m0.getInverse(this.obj.matrixWorld);
			
			for (i = 0, leni = inst.length; i < leni; i++)
			{
				inst[i].fastWorldUpdate();
				m1.multiplyMatrices( m0, inst[i].obj.matrixWorld );
				m1.decompose( inst[i].obj.position,  inst[i].obj.quaternion,  inst[i].obj.scale );
				//inst[i].obj.quaternion.normalize();
			
				this.obj.add(inst[i].obj);
				inst[i].toplevelparent = this.toplevelparent;
				inst[i].set_bbox3D_changed();
			};
		}else{			
			for (i = 0, leni = inst.length; i < leni; i++)
			{
				this.obj.add(inst[i].obj);
				inst[i].toplevelparent = this.toplevelparent;
				inst[i].set_bbox3D_changed();
			};
		};
	};
	
	Acts.prototype.ObjParentScene = function (transf)
	{
	
	if(transf === 0){ //if yes
	this.fastWorldUpdate();
	//p.fastWorldUpdate();
	//var m = THREE.TSH.mtx0.copy();
	//m.getInverse(p.obj.matrixWorld);
	//m.multiply(this.obj.matrixWorld);
	this.obj.matrixWorld.decompose ( this.obj.position,  this.obj.quaternion,  this.obj.scale );
	//this.obj.quaternion.normalize();
	};
	
	if(this.colDebug && this.col.type.sphere || this.col.type.AABB) this.runtime.Q3D.scene.add(this.colDebug); // debug body wont transfer to new scene without this, i think
	
	this.runtime.Q3D.scene.add(this.obj);
	this.toplevelparent = this.obj;
	this.scene = this.runtime.Q3D.scene;
	this.set_bbox3D_changed();
	
	};*/
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	
/*	Exps.prototype.x = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.x);				// return our value
	};
	
	Exps.prototype.y = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.y);				// return our value
	};
	
	Exps.prototype.z = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.z);				// return our value
	};
	
	Exps.prototype.xw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.obj.parent.userData.inst){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[12]
		}
		else{
		set = this.obj.position.x
		};
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.yw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.obj.parent.userData.inst){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[13]
		}
		else{
		set = this.obj.position.y
		};
	
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.zw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.obj.parent.userData.inst){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[14]
		}
		else{
		set = this.obj.position.z
		};
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.Rx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.x);				// return our value
	};
	
	Exps.prototype.Ry = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.y);				// return our value
	};
	
	Exps.prototype.Rz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.z);				// return our value
	};
	
	Exps.prototype.Ro = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.obj.rotation.order);				// return our value
	};
	
	Exps.prototype.Sx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.x);				// return our value
	};
	
	Exps.prototype.Sy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.y);				// return our value
	};
	
	Exps.prototype.Sz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.z);				// return our value
	};
////////////////////////////////////////////////////////////////////////////

	instanceProto.updateTNB = function ()   
	{
		if(!this.TNB.needsUpdate) return;
		
			this.TNB.needsUpdate = false;
			this.fastWorldUpdate();
			var inv, e = this.obj.matrixWorld.elements;
			
			this.TNB.Td = Math.sqrt(e[8]*e[8] + e[9]*e[9] + e[10]*e[10]); // local z
			this.TNB.Nd = Math.sqrt(e[4]*e[4] + e[5]*e[5] + e[6]*e[6]); // local y
			this.TNB.Bd = Math.sqrt(e[0]*e[0] + e[1]*e[1] + e[2]*e[2]); // local x	

			inv = 1/this.TNB.Td
			this.TNB.T.set(e[8]*inv,e[9]*inv,e[10]*inv);
			inv = 1/this.TNB.Nd
			this.TNB.N.set(e[4]*inv,e[5]*inv,e[6]*inv);
			inv = 1/this.TNB.Bd
			this.TNB.B.set(e[0]*inv,e[1]*inv,e[2]*inv);
	
	};
	
	Exps.prototype.nTx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.x);				// return our value
	};
	
	Exps.prototype.nTy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.y);				// return our value
	};
	
	Exps.prototype.nTz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.z);				// return our value
	};
	
	Exps.prototype.Td = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Td);				// return our value
	};
	
	Exps.prototype.nNx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.x);				// return our value
	};
	
	Exps.prototype.nNy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.y);				// return our value
	};
	
	Exps.prototype.nNz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.z);				// return our value
	};
	
	Exps.prototype.Nd = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Nd);				// return our value
	};
	
	Exps.prototype.nBx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.x);				// return our value
	};
	
	Exps.prototype.nBy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.y);				// return our value
	};
	
	Exps.prototype.nBz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.z);				// return our value
	};
	
	Exps.prototype.Bd = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Bd);				// return our value
	};
//////////////////////////////////////////////////////////////////
	
	Exps.prototype.Ux = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.x);				// return our value
	};
	
	Exps.prototype.Uy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.y);				// return our value
	};
	
	Exps.prototype.Uz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.z);				// return our value
	};

	instanceProto.updateUw = function ()   
	{
		if(!this.Uw.needsUpdate) return;
		
			this.Uw.needsUpdate = false;
			this.fastWorldUpdate();
			THREE.TSH.mtx0.copy(this.obj.parent.matrixWorld)
			THREE.TSH.mtx0.elements[12] = 0;
			THREE.TSH.mtx0.elements[13] = 0;
			THREE.TSH.mtx0.elements[14] = 0;
			
			this.Uw.up.copy(this.obj.up);
			this.Uw.up.applyMatrix4(THREE.TSH.mtx0);
	
	};
	
	Exps.prototype.Uxw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.x);				// return our value
	};
	
	Exps.prototype.Uyw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.y);				// return our value
	};
	
	Exps.prototype.Uzw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.z);				// return our value
	};

//////////////////////////////////////////////////////////////////////////////

	Exps.prototype.Puid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = -1
		
		if(this.obj.parent.userData.inst) set = this.obj.parent.userData.inst.uid;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TOPuid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = -1
		
		if(this.toplevelparent.userData.inst.uid !== this.uid) set = this.toplevelparent.userData.inst.uid;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.scene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.scene.name);				// return our value
	};
	
	Exps.prototype.mM = function (ret,i)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		i = cr.clamp(i, 0, 15)
		ret.set_float(this.obj.matrix.elements[i]);				// return our value
	};
	
	Exps.prototype.mW = function (ret,i)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.fastWorldUpdate();
		i = cr.clamp(i, 0, 15)
		ret.set_float(this.obj.matrixWorld.elements[i]);				// return our value
	};*/

/////////////////////////////////////////////////////////////////////////

	Exps.prototype.EnvAmount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('reflectivity')) set = this.mat.reflectivity // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.reflectivity) set = this.mat.uniforms.reflectivity.value // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
	};
	
	Exps.prototype.RefractRatio = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('refractionRatio')) set = this.mat.refractionRatio // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.refractionRatio) set = this.mat.uniforms.refractionRatio.value // for shader materials
		}
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.pOffsetFactor = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.mat.polygonOffsetFactor);				// return our value
	};
	
	Exps.prototype.pOffsetUnits = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.mat.polygonOffsetUnits);				// return our value
	};
	
	Exps.prototype.AlphaTest = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.mat.alphaTest);				// return our value
	};
	
	Exps.prototype.BumpScale = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_float(this.mat.bumpScale);				// return our value
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('bumpScale')) set = this.mat.bumpScale // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.bumpScale) set = this.mat.uniforms.bumpScale.value // for shader materials
		}
		
		ret.set_float(set);				// return our value
	};

	Exps.prototype.Diffuse = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('color')) set = this.mat.color.getHexR() // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.color) set = this.mat.uniforms.color.value.getHexR() // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
		//ret.set_float(this.mat.color.getHexR());				// return our value
	};
	
	Exps.prototype.Ambient = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{		
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('ambient')) set = this.mat.ambient.getHexR() // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.ambient) set = this.mat.uniforms.ambient.value.getHexR() // for shader materials
		}
		
		ret.set_float(set);				// return our value
	
	
		//ret.set_float(this.mat.ambient.getHexR());				// return our value
	};
	
	Exps.prototype.Emissive = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('emissive')) set = this.mat.emissive.getHexR() // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.emissive) set = this.mat.uniforms.emissive.value.getHexR() // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
		//ret.set_float(this.mat.emissive.getHexR());				// return our value
	};
	
	Exps.prototype.Specular = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('specular')) set = this.mat.specular.getHexR() // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.specular) set = this.mat.uniforms.specular.value.getHexR() // for shader materials
		}
		
		ret.set_float(set);				// return our value
	
		//ret.set_float(this.mat.specular.getHexR());				// return our value
	};
	
	Exps.prototype.NormalScaleX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('normalScale')) set = this.mat.normalScale.x // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.normalScale) set = this.mat.uniforms.normalScale.value.x // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
		//ret.set_float(this.mat.normalScale.x);				// return our value
	};
	
	Exps.prototype.NormalScaleY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('normalScale')) set = this.mat.normalScale.y // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.normalScale) set = this.mat.uniforms.normalScale.value.y // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
		//ret.set_float(this.mat.normalScale.y);				// return our value
	};
	
	Exps.prototype.Opacity = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		set = this.mat.opacity // for regular materials
		if(this.mat.uniforms && this.mat.uniforms.opacity) set = this.mat.uniforms.opacity.value // for shader materials
		}
		
		ret.set_float(set);				// return our value
		
		//ret.set_float(this.mat.opacity);				// return our value
	};
	
	Exps.prototype.Shininess = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		
		if(this.mat){
		if(this.mat.hasOwnProperty('shininess')) set = this.mat.shininess // for regular materials
		else if(this.mat.uniforms && this.mat.uniforms.shininess) set = this.mat.uniforms.shininess.value // for shader materials
		}
		
		ret.set_float(set);				// return our value
	
		//ret.set_float(this.mat.shininess);				// return our value
	};
	
//////////////////////////////////////////////////////////////////////////////////////////////

	Exps.prototype.TexAnimationFrame = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0

		if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.mapanim[THREE.Q3D[choice]].cur_frame;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexAnimationFrameCount = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0

		if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.mapanim[THREE.Q3D[choice]].cur_animation.frames.length;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexAnimationName = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = "";

		if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.mapanim[THREE.Q3D[choice]].cur_animation.name;
		
		ret.set_string(set);				// return our value
	};
	
	////////////////////////////////////////////////////////////////////////////
	
	Exps.prototype.TexAnisotropy = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		//if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.texturebank[this.mapanim[THREE.Q3D[choice]].cur_animation.index].frames[this.mapanim[THREE.Q3D[choice]].cur_frame].webGL_texture.anisotropy;
		var texture = this.mat[THREE.Q3Da[choice]];
		if(texture) set = this.mat[THREE.Q3Da[choice]].anisotropy;
		
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexOffsetU = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		//if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.texturebank[this.mapanim[THREE.Q3D[choice]].cur_animation.index].frames[this.mapanim[THREE.Q3D[choice]].cur_frame].webGL_texture.offset.x;
		var texture = this.mat[THREE.Q3Da[choice]];
		if(texture) set = this.mat[THREE.Q3Da[choice]].offset.x;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexOffsetV = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		//if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.texturebank[this.mapanim[THREE.Q3D[choice]].cur_animation.index].frames[this.mapanim[THREE.Q3D[choice]].cur_frame].webGL_texture.offset.y;
		var texture = this.mat[THREE.Q3Da[choice]];
		if(texture) set = this.mat[THREE.Q3Da[choice]].offset.y;
				
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexRepeatU = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		//if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.texturebank[this.mapanim[THREE.Q3D[choice]].cur_animation.index].frames[this.mapanim[THREE.Q3D[choice]].cur_frame].webGL_texture.repeat.x;
		var texture = this.mat[THREE.Q3Da[choice]];
		if(texture) set = this.mat[THREE.Q3Da[choice]].repeat.x;
		
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TexRepeatV = function (ret,choice)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		//if(this.mapanim && this.mapanim[THREE.Q3D[choice]] && this.mapanim[THREE.Q3D[choice]].cur_animation) set = this.texturebank[this.mapanim[THREE.Q3D[choice]].cur_animation.index].frames[this.mapanim[THREE.Q3D[choice]].cur_frame].webGL_texture.repeat.y;
		var texture = this.mat[THREE.Q3Da[choice]];
		if(texture) set = this.mat[THREE.Q3Da[choice]].repeat.y;
				
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.modelName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = "undefined";

		if(this.modelFile) set = this.modelFile;
		
		ret.set_string(set);				// return our value
	};
	
	Exps.prototype.MorphInf = function (ret,name)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set;
		
		set = 0;

		if(this.model && this.model.morphTargetDictionary[ name ]) set = this.model.morphTargetInfluences[this.model.morphTargetDictionary[ name ]] ;
		
		ret.set_float(set);				// return our value
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();
	
	THREE.TSH.commonACEappend(Cnds,Acts,Exps,instanceProto,typeProto,pluginProto); // extend this object with common q3d stuff which exists across multiple plugins.

}());