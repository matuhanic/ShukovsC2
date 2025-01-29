// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Quazi3D = function(runtime)
{
	this.runtime = runtime;
	this.runtime.forceCanvasAlpha = true;
	this.runtime.Q3D = {};
	this.runtime.Q3D.modelPoolList = [];
	this.runtime.Q3D.Q3DTypesList = []; //used for pick children condition;
	
	THREE.Q3D.Runtime = runtime; // force a reference into THREE of the runtime object as early as possible, for skinned-meshes to properly function with the object hook
	
	THREE.TJS = {}; // store all three.js objects in this, just to prevent name conflicts (?) , needs this to work (?)
	// these act as global reusable objects for calculation purposes to save on news
	THREE.TSH.vec0 = new THREE.Vector3(0,0,0);
	THREE.TSH.vec1 = new THREE.Vector3(-1,-1,-1);
	THREE.TSH.vec2 = new THREE.Vector3(0,0,0);
	// 3x3 arrays used by OBB intersect code
	THREE.TSH.arr0 = [[0,0,0],[0,0,0],[0,0,0]];
	THREE.TSH.arr1 = [[0,0,0],[0,0,0],[0,0,0]];
	THREE.TSH.arr2 = [[0,0,0],[0,0,0],[0,0,0]];
	// sphere and box used by OBB sphere intersect code
	THREE.TSH.sph0 = new THREE.Sphere();
	THREE.TSH.box0 = new THREE.Box3();
	THREE.TSH.mtx0 = new THREE.Matrix4();
	THREE.TSH.mtx1 = new THREE.Matrix4();
	THREE.TSH.mtx30 = new THREE.Matrix3();
	THREE.TSH.mtx31 = new THREE.Matrix3();
	THREE.TSH.Bgeom = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
	//THREE.TSH.tmprc3D = new cr.rect(0, 0, 0, 0);
	THREE.TSH.tmprc3Dt = new THREE.Box3();
	THREE.TSH.color0 = new THREE.Color();
	THREE.TSH.color1 = new THREE.Color();
	
	THREE.TSH.TestString1 = "test string 1";
	
	// constant, do not modify
	THREE.TSH.sphere =  new THREE.Sphere( new THREE.Vector3(0,0,0), 0.5);
	////////////////////////////////////////////////////////
	this.runtime.Q3D.boneTypesIndex = 0; // because names can't be used (they're changed after export) I need to force the association by index for skeleton -> bone.
	this.runtime.Q3D.boneTypes = {}; // create a global map of all the bone type names for fast referencing in controller.
	
	///////////////////////////////////////////////////////
	var runproto = Object.getPrototypeOf(runtime)
	var oldfunc = runproto.DestroyInstance
	
	runproto.DestroyInstance = function(inst){

		if(inst.Q3Dobject){
		
			for ( var i = inst.obj.children.length-1; i > 0; i -- ) { //iterate backwards or remove messes up!
			
				if(inst.obj.children[ i ].userData.inst){ 
					this.DestroyInstance(inst.obj.children[ i ].userData.inst); //recursively destroy all Q3D type objects with the userData.inst flag/ref
				}

			};
		
		if(inst.Q3Dboned){ // special handling needed for bones since they're children of the model
		
			inst.model.destroyC2Bones();
			inst.Q3Dboned = false // or else bugs with resetmodelandmap? need to test this a bit
		}
		
		};
	
		oldfunc.call(this,inst)
	
	}
	
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Quazi3D.prototype;
		
	function isFlippedTexture()
	{
		//alert('testing lfip');
	   var canvas = document.createElement('canvas');
	   canvas.width = 1;
	   canvas.height = 2;
	   var gl = canvas.getContext("experimental-webgl");
	   gl.clearColor(1, 1, 1, 1);
	   gl.clear(gl.COLOR_BUFFER_BIT);

	   var prog = gl.createProgram();
		  
	   var vss = gl.createShader(gl.VERTEX_SHADER);
	   gl.shaderSource(vss, "attribute vec3 pos;void main() {gl_Position = vec4(pos, 1.0);}");
	   gl.compileShader(vss);
	   gl.attachShader(prog, vss);
	   
	   var fss = gl.createShader(gl.FRAGMENT_SHADER);
	   gl.shaderSource(fss, "void main() {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}");
	   gl.compileShader(fss);
	   gl.attachShader(prog, fss);
	   
	   gl.linkProgram(prog);
	   gl.useProgram(prog);

	   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, -1, 0, 0,   1, 0, 0]), gl.STATIC_DRAW);
	   var attr = gl.getAttribLocation(prog, "pos");
	   gl.enableVertexAttribArray(attr);
	   gl.vertexAttribPointer(attr, 3, gl.FLOAT, false, 0, 0);
	   
	   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	   
	   var tex_small = gl.createTexture();
	   gl.bindTexture(gl.TEXTURE_2D, tex_small);
	   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gl.canvas);
	   gl.bindTexture(gl.TEXTURE_2D, null);
	   
	   var fbo = gl.createFramebuffer();
	   gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex_small, 0);
	   
	   var pixels = new Uint8Array(1 * 2 * 4);
	   gl.readPixels( 0, 0, 1, 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	   gl.deleteTexture(tex_small);
	   
	   return pixels[0] !== 0;
	}
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{	
		
		
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		
		var Q3Dref = this.runtime.Q3D;
		var _thisRuntime = this.runtime;

		// test for flipping mode
		Q3Dref.isFlippedTexture = isFlippedTexture();
		
		Q3Dref.geometry = {};
		Q3Dref.geomCallbacks = {};
		Q3Dref.material = {};
		Q3Dref.texture = {};
		Q3Dref.rendererSettings = {};
		
		Q3Dref.sceneDic = {};
		Q3Dref.cameraDic = {};
		
		Q3Dref.viewports = {};
		Q3Dref.viewportZarray = [];
		
		Q3Dref.loadQueue = {};
		Q3Dref.loadAddList = [];
		
		Q3Dref.pickedobj = null;
		
		Q3Dref.Vector3 = new THREE.Vector3(0,0,0);
		
		Q3Dref.viewports.Default = [0, 0, 1, 1,"Default","Default",0];
		
		Q3Dref.canvas = document.createElement('canvas');  // Create a canvas to render
		

		
		Q3Dref.projector = new THREE.Projector(); // initialize since i think this is slow
		
			Q3Dref.Ray_numObj = 0;
			
			Q3Dref.Ray_index = -1;
			
			Q3Dref.Ray_originX = 0;
			Q3Dref.Ray_originY = 0;
			Q3Dref.Ray_originZ = 0;
			
			Q3Dref.Ray_dirX = 0;
			Q3Dref.Ray_dirY = 0;
			Q3Dref.Ray_dirZ = 0;
			
			Q3Dref.Ray_nX = 0;
			Q3Dref.Ray_nY = 0;
			Q3Dref.Ray_nZ = 1;
			
			Q3Dref.Ray_idPicked = -1;
			Q3Dref.Ray_distance = 0;
			
			Q3Dref.Ray_pointX = 0;
			Q3Dref.Ray_pointY = 0;
			Q3Dref.Ray_pointZ = 0;


		Q3Dref.sceneName = "Default";
		Q3Dref.sceneDic.Default = [new THREE.Scene(),0,0,false];
		Q3Dref.sceneDic.Default[0].userData.master = true;
		Q3Dref.sceneDic.Default[0].name = "Default"
		
		Q3Dref.scene = Q3Dref.sceneDic.Default[0];
		Q3Dref.sceneForRender = Q3Dref.sceneDic.Default;

		Q3Dref.cameraName = "Default";
		Q3Dref.cameraDic.Default = new THREE.CombinedCamera();   //ADD THESE FOR NOW TO TEST
		Q3Dref.camera = Q3Dref.cameraDic.Default;
		Q3Dref.cameraForRender = Q3Dref.cameraDic.Default;

		// custom loading manager cause the current three.js one seems a bit sucky with json loader...
		
		Q3Dref.loadMaster = {}
		Q3Dref.loadMaster.loadStack = []; // new load tasks are pushed on.
		Q3Dref.loadMaster.loadTotal = 0; // some kind of value that lets you know how tall the stack once was?
		Q3Dref.loadMaster.loadIndex = 0;
		Q3Dref.loadMaster.allLoaded = true; // value telling you if everything that must be loaded is?
		Q3Dref.loadMaster.loadingFilename = "";
		
		Q3Dref.manager = new THREE.LoadingManager();
			Q3Dref.manager.ItemTotal = 0;
			Q3Dref.manager.ItemLoaded = 0;
			Q3Dref.manager.ItemLoadComplete = 1;
			Q3Dref.manager.ItemJSONList = [];
			Q3Dref.manager.ItemTempLoaded = 1;
			
			Q3Dref.manager.onProgress = function ( item, loaded, total ) {

				//console.log( item, loaded, total );
				//alert('test');
				Q3Dref.manager.ItemTotal = total;
				Q3Dref.manager.ItemLoaded = total;//loaded;
				console.log( item, loaded, total );
			
			};
			
			Q3Dref.manager.onLoad = function () {

				//Q3Dref.manager.ItemLoadComplete = 1;
				Q3Dref.manager.ItemTempLoaded = 1;
				//alert('test')
				if(Q3Dref.manager.ItemJSONList.length == 0) Q3Dref.manager.ItemLoadComplete = 1;
				console.log("load");
			};
			
			Q3Dref.manager.onError = function () {

				//Q3Dref.manager.ItemLoadComplete = -1;
				alert("error loading object, please make sure its a valid file / name");
				return;
			
			};		

		Q3Dref.loadedTextures = {};
		Q3Dref.loadedShaders = {};
		Q3Dref.loadedObjects = {};
		Q3Dref.objectProtos = {};
		Q3Dref.loadedObjectsInfo = {};
		Q3Dref.loadedFonts = {};
		/////////////////////////////////////////////////////////////////////////////////////// replace this with a flag that calls this loop traverse thing once before draw instead? (might be unnecessary optimization)
		
		Q3Dref.UpdateAllMaterials = function () {
		//Q3Dref.UpdateAllMaterialsFlag = true;
		Q3Dref.sceneDic[Q3Dref.sceneName][3] = true; //flag current scene for update
		};
		
		Q3Dref.UpdateAllMaterialsCallBack = function ( child ) { // called in traverse

			if ( child.material ) {
				if(child.material.materials){
					for (var i=0,L=child.material.materials.length; i<L ; i++){
						child.material.materials[i].needsUpdate = true;
					}
				}else{
					child.material.needsUpdate = true;
				};
			};

		};
		
		Q3Dref.UpdateAllMaterialsDO = function (SelScene) {
			var i , L , namekey ,bitkey , i2, L2;
		
			SelScene.traverse( Q3Dref.UpdateAllMaterialsCallBack );
			
			/*for(i = 0, L = Q3Dref.modelPoolList.length; i < L ; i++){
			
				for(namekey in Q3Dref.modelPoolList[i]){ // deep loop flag updates for everything in pools;
					for(bitkey in Q3Dref.modelPoolList[i][namekey]){
						for(i2 = 0, L2 = Q3Dref.modelPoolList[i][namekey][bitkey].length; i2<L2 ; i2++){
							Q3Dref.modelPoolList[i][namekey][bitkey][i2].traverse( Q3Dref.UpdateAllMaterialsCallBack );
						};
					};
				};
			};*/
			
			for(i = Q3Dref.modelPoolList.length-1; i > -1 ; i--){
			
				for(namekey in Q3Dref.modelPoolList[i]){ // deep loop flag updates for everything in pools;
				
				delete Q3Dref.modelPoolList[i][namekey]; // get rid of all the pools; slow and garbage collecty but necessary... trying to update everything any other way just wasn't working
				
				};
			};
			
		};
		
		Q3Dref.orderViewportZarraySort = function(a, b){ return a[6]-b[6]};
		Q3Dref.viewportZarray = [];
		
		Q3Dref.orderViewportZarray = function () {
			Q3Dref.viewportZarray.length = 0;
			for (var key in Q3Dref.viewports) {
				
				if(Q3Dref.viewports[key][7])	Q3Dref.viewportZarray.push(Q3Dref.viewports[key]); // only add if visible

			};
		 
			Q3Dref.viewportZarray.sort(Q3Dref.orderViewportZarraySort);
		 
		 //alert(Q3Dref.viewportZarray);
		};
		
		Q3Dref.InitializeRenderer = function (ref) {
				if (/*THREE.Detector.webgl*/ _thisRuntime.glwrap) // if webgl mode , uhh IE bricks this for some reason, i have to add some kind o detector
				{
	
				// max lights is useless i can remove it..
				if(ref.properties[6] === 0){
				
					Q3Dref.renderer = new THREE.WebGLRenderer({canvas: Q3Dref.canvas , alpha: true, antialias: Q3Dref.rendererSettings.AntiAlias });
				
				}else if( ref.properties[6] === 1){
				
					var RENDERER =  new THREE.WebGLRenderer({canvas: Q3Dref.canvas , alpha: true, antialias: Q3Dref.rendererSettings.AntiAlias });

					var SCALE = 1;

					var WIDTH = Q3Dref.canvas.width;
					var HEIGHT = Q3Dref.canvas.height;
					
					Q3Dref.renderer = new THREE.WebGLDeferredRenderer( { width : WIDTH, height : HEIGHT, renderer: RENDERER, antialias: true, tonemapping: THREE.FilmicOperator, brightness: 2.5 } );
					//var bloomEffect = new THREE.BloomPass( 0.65 );
					//Q3Dref.renderer.addEffect( bloomEffect );
				};
				//Q3Dref.renderer.shadowMapDebug = true;
				//Q3Dref.renderer.shadowMapCascade = true;
				
				Q3Dref.renderer.shadowMapEnabled = Q3Dref.rendererSettings.shadowMap;
				//Q3Dref.DPR = Q3Dref.renderer.devicePixelRatio; // peoples rebuplic so firefox works
				//alert(Q3Dref.DPR)
				//alert(window.devicePixelRatio)
				Q3Dref.renderer.setPixelRatio( window.devicePixelRatio ); // ? needed ?
				Q3Dref.DPR = 1 / Q3Dref.renderer.getPixelRatio();
				
				}
				else{
					console.log("This only works with WebGL, Consider a new browser")
				};
		};

				
		Q3Dref.recursiveLoop = function (obj,this_)
		{
			var len = obj.children.length;
				for (var i = 0; i < len; i++) {
				Q3Dref.idPicked = obj.children[i].id;
				this_.runtime.getCurrentEventStack().current_event.retrigger();
				Q3Dref.recursiveLoop(obj.children[i],this_);
				};
		};
		
		Q3Dref.recursiveLoopPick = function (obj,arr)
		{
			var len = obj.children.length;
				for (var i = 0; i < len; i++) {
				//Q3Dref.idPicked = obj.children[i].id;
				arr.push(obj.children[i].id);
				Q3Dref.recursiveLoopPick(obj.children[i],arr);
				};
		};
		
		Q3Dref.EpickById = function (id) // try to make picking more effecient so objects aren't constantly repicked. a rotating buffer of commonly picked objects might be a good idea;
		{
			var temp
				if(Q3Dref.pickedobj&&Q3Dref.pickedobj.id === id) return Q3Dref.pickedobj;
				temp = Q3Dref.scene.getObjectById( id,true);
				if(!temp) return;
				if(temp.userData.master) Q3Dref.pickedobj = temp
				else throw('Q3D [ You are attempting to modify an invalid ID (value of id = '+id+" ) ]");

				return Q3Dref.pickedobj;
				
		};
				//alert("window created")
		
	
	Q3Dref.GenerateLoadedObjectsInfo = function(fname){ //seems to be a bug where this causes trouble
		var i , L ;
			//if(!Q3Dref.loadedObjects[fname]) return
			
			Q3Dref.objectProtos[fname] = {};
		
			Q3Dref.loadedObjectsInfo[fname] = {};
		
		Q3Dref.loadedObjectsInfo[fname].morphTargets = false;
		Q3Dref.loadedObjectsInfo[fname].morphNormals = false;
		Q3Dref.loadedObjectsInfo[fname].skinning = false;
		
		if(Q3Dref.loadedObjects[fname].geometry){ // check for animation properties
			if(Q3Dref.loadedObjects[fname].geometry.morphTargets && Q3Dref.loadedObjects[fname].geometry.morphTargets.length>0) Q3Dref.loadedObjectsInfo[fname].morphTargets = true;
			if(Q3Dref.loadedObjects[fname].geometry.morphNormals && Q3Dref.loadedObjects[fname].geometry.morphNormals.length>0) Q3Dref.loadedObjectsInfo[fname].morphNormals = true;
			if(Q3Dref.loadedObjects[fname].geometry.bones){
				
				Q3Dref.loadedObjectsInfo[fname].skinning = true;
				
				// parse the animations on processing a freshly load, streaming them in isn't really going to have any advantages will it?
				// are there any issues? as long as i pass in the referenced animation rather than the geometries it should be fine right?
				if(Q3Dref.loadedObjects[fname].geometry.animation || Q3Dref.loadedObjects[fname].geometry.animations){
					Q3Dref.loadedObjectsInfo[fname].Sanims = {} // Skinned animation by name reference
					var animobj = Q3Dref.loadedObjectsInfo[fname].Sanims
			
				}
				// i guess i should check both, not sure if it's possible to have both or if one is deprecated but might as well cover all bases.
				if(Q3Dref.loadedObjects[fname].geometry.animation){
					THREE.AnimationHandler.init(Q3Dref.loadedObjects[fname].geometry.animation);
					animobj[Q3Dref.loadedObjects[fname].geometry.animation.name] = Q3Dref.loadedObjects[fname].geometry.animation;					
				}
				if(Q3Dref.loadedObjects[fname].geometry.animations){
					for(i =0, L = Q3Dref.loadedObjects[fname].geometry.animations.length ; i<L; i++){
						THREE.AnimationHandler.init(Q3Dref.loadedObjects[fname].geometry.animations[i]);
						animobj[Q3Dref.loadedObjects[fname].geometry.animations[i].name] = Q3Dref.loadedObjects[fname].geometry.animations[i];			
					}
				}
			
			}
		};
		
		if(Q3Dref.loadedObjectsInfo[fname].morphTargets){ // need special handling for morphTargets, to properly parse them into a string for controller to use
			if(!Q3Dref.loadedObjectsInfo[fname].morphNormals){
				Q3Dref.loadedObjects[fname].geometry.computeMorphNormals();
				Q3Dref.loadedObjectsInfo[fname].morphNormals = true
			};
			Q3Dref.loadedObjectsInfo[fname].Manims = {};
			var animobj = Q3Dref.loadedObjectsInfo[fname].Manims
			var animname = "";
			//var str = "";
			//var str2 = [];
			var rexp = /[0-9]+$/ //rip out digits at end of string, works !
				for( i = 0, L = Q3Dref.loadedObjects[fname].geometry.morphTargets.length; i<L;i++){
				
				animname = Q3Dref.loadedObjects[fname].geometry.morphTargets[i].name.replace(rexp,"");
				if(!animobj[animname]){ 
				animobj[animname] = {};
				animobj[animname].frames = [];
				animobj[animname].animlen = 0;
				//str2.push(animobj[animname]);
				//alert("push it to the limit")
				}
				animobj[animname].frames.push(i); // push morph target indexes of individual frames

				//str = str+"[ "+animname+" ],\n"
			// scan for animation names
				};		
				//alert(str);
				//alert(str2.length);
			for ( i in animobj){
			animobj[i].animlen = animobj[i].frames.length; // store length of animation so you dont have to call length often.
			//alert(animobj[i].animlen);
			};
		};
		
	  var minX = 0,
			minY = 0,
			minZ = 0,
			maxX = 0,
			maxY = 0,
			maxZ = 0;

		Q3Dref.loadedObjects[fname].traverse(function(mesh)
		{
			if (mesh instanceof THREE.Mesh)
			{
				mesh.geometry.computeBoundingBox();
				var bBox = mesh.geometry.boundingBox;

				// compute overall bbox
				minX = Math.min(minX, bBox.min.x);
				minY = Math.min(minY, bBox.min.y);
				minZ = Math.min(minZ, bBox.min.z);
				maxX = Math.max(maxX, bBox.max.x);
				maxY = Math.max(maxY, bBox.max.y);
				maxZ = Math.max(maxZ, bBox.max.z);
			}
		});

		var bBox_min = new THREE.Vector3(minX, minY, minZ);
		var bBox_max = new THREE.Vector3(maxX, maxY, maxZ);

		Q3Dref.loadedObjectsInfo[fname].box = new THREE.Box3(bBox_min, bBox_max);
		Q3Dref.loadedObjectsInfo[fname].size = Q3Dref.loadedObjectsInfo[fname].box.size();
		Q3Dref.loadedObjectsInfo[fname].center = Q3Dref.loadedObjectsInfo[fname].box.center();
		Q3Dref.loadedObjectsInfo[fname].nSize = new THREE.Vector3(1 / Q3Dref.loadedObjectsInfo[fname].size.x, 1 / Q3Dref.loadedObjectsInfo[fname].size.y, 1 / Q3Dref.loadedObjectsInfo[fname].size.z);
		Q3Dref.loadedObjectsInfo[fname].nPos = new THREE.Vector3(Q3Dref.loadedObjectsInfo[fname].center.x / Q3Dref.loadedObjectsInfo[fname].size.x * -1, Q3Dref.loadedObjectsInfo[fname].center.y / Q3Dref.loadedObjectsInfo[fname].size.y * -1, Q3Dref.loadedObjectsInfo[fname].center.z / Q3Dref.loadedObjectsInfo[fname].size.z * -1);
		
		var cbobj;
		for ( i = Q3Dref.loadAddList.length - 1; i >= 0; i--)
		{ // iterate backwards since you're removing elements, then call the callback functions in the array which match the loaded name
			cbobj = Q3Dref.loadAddList[i]
			if (cbobj.modelFile === fname &&( !cbobj.shaderFile || Q3Dref.loadedShaders[cbobj.shaderFile] ) ) //need to account for both the shader and model being loaded for callback now.
			{
				//alert(Q3Dref.loadAddList);
				//alert("creating from callback");
				//alert(Q3Dref.loadAddList[i][2])
				//Q3Dref.loadAddList[i][0](Q3Dref.loadAddList[i][1]);
				THREE.TSH.ModelFit(cbobj);
				Q3Dref.loadAddList.splice(i, 1);
			};
		};
	
	};
	
	Q3Dref.stackShift = function(){
			
		var loadStackLength = Q3Dref.loadMaster.loadStack.length;
			
		//if(Q3Dref.loadMaster.flagLoading){ // use this so users have frames to update a loading bar or something easily.
		
			if(!Q3Dref.loadMaster.inCallback && loadStackLength > 0){ // initiate loading next frame.
			
				//Q3Dref.loadMaster.flagLoading = false;
				Q3Dref.loadMaster.loadStack[0][0](); // trigger next load;
				Q3Dref.loadMaster.loadStack.shift(); // once triggered, shift it off stack (shift instead of pop so models load in order specified).
			
			};
			
			if(loadStackLength === 0){
				//Q3Dref.loadMaster.flagLoading = false;
				Q3Dref.loadMaster.allLoaded = true;			// nothing left to do. 
			};
		//};
	};
	
	Q3Dref.LoadFile = function(fname,imageload){
		
		var i , L;
		
		if( Q3Dref.loadQueue[fname] || Q3Dref.loadedObjects[fname] || Q3Dref.loadedTextures[fname] || Q3Dref.loadedShaders[fname] ) return; // early out to prevent multiple loading of the same filename
		//alert("Loading File")
		
		/*var flag;
		
		$.ajax({ // broken i think?
			type: 'HEAD',
			url: fname,
			success: function() {
				return;//alert('Page found.');
			},  
			error: function() {
				alert("LoadFile: You are attempting to load ["+fname+"], which can not be reached, there is something preventing the loading. The file may not exist");
				flag = true;
			}
		});
		
		if(flag) return; //exit if someone loaded a fake;*/
		
		var filetype = fname.split('.').pop();
		
		if(filetype === "obj"){
                
				Q3Dref.loadMaster.allLoaded = false;
				
				var loadobj = function() { // call this when popping through the load array
				
					Q3Dref.loader = new THREE.OBJLoader();
					Q3Dref.loadMaster.inCallback = true;
					Q3Dref.loadMaster.loadingFilename = fname;
					Q3Dref.loader.load(fname, function(object)
					{
						
						// need to fuse geometry, having them separate is a big waste at the moment, since users can't control them individually (they shouldn't be able to, this isn't how Q3D was designed to work).
						
						var geometry = new THREE.Geometry();
						var geometry2
						var matrix
						var mat = new THREE.MeshFaceMaterial();
						var Nmat
						
						object.traverse( function ( child ) {

							if ( child instanceof THREE.Mesh ) {

								child.matrixAutoUpdate && child.updateMatrix(); // don't know what && is doing, but updates all matrices, traverse ensures it happens in right order (I hope)?

								matrix = child.matrix;
								geometry2 = child.geometry;

								Nmat = new THREE.MeshLambertMaterial();
								Nmat.color.setHex(Math.random()*255*255*255);
								mat.materials.push(Nmat);
								geometry.merge( geometry2, matrix, mat.materials.length-1 ); // 0 is material index offset, defer fixing this to work properly till mtl loader is in.
							
							}
							
						} );
						
						//do general handling of loading now
						
						object = new THREE.Mesh(geometry,mat);					

						Q3Dref.loadedObjects[fname] = object;
						Q3Dref.loadQueue[fname] = false; // necessary? why would you want to reload, and safeguards already in place
						Q3Dref.GenerateLoadedObjectsInfo(fname);
						Q3Dref.loadMaster.inCallback = false;
						//Q3Dref.loadMaster.flagLoading = true;
						Q3Dref.loadMaster.loadIndex ++
						Q3Dref.stackShift();
						//console.log(fname)
					
					});
				
				};
				
				Q3Dref.loadMaster.loadStack.push([loadobj,fname])
				Q3Dref.loadMaster.loadTotal ++
				Q3Dref.loadQueue[fname] = true;
				
		}else if(filetype === "js" || filetype === "json"){
		
                Q3Dref.loadMaster.allLoaded = false;
				
				var loadobj = function() { // call this when popping through the load array
				
					Q3Dref.loader = new THREE.JSONLoader();
					
					//Q3Dref.loader.withCredentials = true
					
					Q3Dref.loadMaster.inCallback = true;
					Q3Dref.loadMaster.loadingFilename = fname;
					Q3Dref.loader.load(fname, function(geometry, materials)
					{	
						
						var mat,m,set
						if(materials !== undefined && materials.length >= 1){ 
						
							mat = new THREE.MeshFaceMaterial(materials); // if materials are defined

							if( !_thisRuntime.linearSampling ){
								//alert('test')
								set = THREE.NearestFilter;
								for( i = 0, L = mat.materials.length; i < L ; i++){
								
								m = mat.materials[i]
								
									if(m.map){ 
									
										m.map.minFilter = set
										m.map.magFilter = set
									
									}
									if(m.specularMap){

										m.specularMap.minFilter = set
										m.specularMap.magFilter = set
									
									}
									if(m.lightMap){
									
										m.lightMap.minFilter = set
										m.lightMap.magFilter = set
									
									}
									if(m.normalMap){
									
										m.normalMap.minFilter = set
										m.normalMap.magFilter = set
									
									}
									if(m.bumpMap){
									
										m.bumpMap.minFilter = set
										m.bumpMap.magFilter = set
									
									}
									if(m.envMap){
									
										m.envMap.minFilter = set
										m.envMap.magFilter = set									
									
									}
								
								
								};						
							}
						}
						else mat = new THREE.MeshPhongMaterial();

						if(geometry.bones !== undefined){
							Q3Dref.loadedObjects[fname] = new THREE.SkinnedMesh(geometry, mat)
						}else Q3Dref.loadedObjects[fname] = new THREE.Mesh(geometry, mat); // right now animated meshes aren't supported;
						
						Q3Dref.loadQueue[fname] = false;
						Q3Dref.GenerateLoadedObjectsInfo(fname); //seems to work for walt head model
						Q3Dref.loadMaster.inCallback = false;
						//Q3Dref.loadMaster.flagLoading = true;
						Q3Dref.loadMaster.loadIndex ++
						Q3Dref.stackShift();
						//console.log(fname)
						
					});
				
				};
				
				Q3Dref.loadMaster.loadStack.push([loadobj,fname])
				Q3Dref.loadMaster.loadTotal ++
				Q3Dref.loadQueue[fname] = true;
				

        }else if(imageload){ // type checking would be annoying for images, let the loader do it.
		
			Q3Dref.loadMaster.allLoaded = false;
			
			var loadobj = function() { // call this when popping through the load array
			
				Q3Dref.loader = new THREE.ImageLoader();
				Q3Dref.loadMaster.inCallback = true;
				Q3Dref.loadMaster.loadingFilename = fname;
				Q3Dref.loader.load( fname , function ( image ) {
				
					Q3Dref.loadedTextures[fname] = image;
					Q3Dref.loadQueue[fname] = false;
					//this.runtime.Q3D.loadedTextures[fname].needsUpdate = true;  /////////////////////// TEST WHY YOU NEED THIS?
					Q3Dref.loadMaster.inCallback = false;
					//Q3Dref.loadMaster.flagLoading = true;
					Q3Dref.loadMaster.loadIndex ++
					Q3Dref.stackShift();
					//console.log(fname)
				
				} )	
				
			};
			
			Q3Dref.loadMaster.loadStack.push([loadobj,fname])
			Q3Dref.loadMaster.loadTotal ++
			Q3Dref.loadQueue[fname] = true;
		
		}else if( filetype === "qfx" ){
		
			Q3Dref.loadMaster.allLoaded = false;
				
			var loadobj = function() { // call this when popping through the load array
			
				Q3Dref.loader = new THREE.Q3D_qfxLoader();
				Q3Dref.loadMaster.inCallback = true;
				Q3Dref.loadMaster.loadingFilename = fname;
				Q3Dref.loader.load(fname, function(shader)
				{	
					
					Q3Dref.loadedShaders[fname] = shader; // save the shader returned in callback
					Q3Dref.loadQueue[fname] = false;
					
					///////////////////////////////////////////////////// trigger callback if it was waiting on shaderload
							var cbobj;
							for (var i = Q3Dref.loadAddList.length - 1; i >= 0; i--)
							{ // iterate backwards since you're removing elements, then call the callback functions in the array which match the loaded name
								cbobj = Q3Dref.loadAddList[i]
								if (cbobj.shaderFile === fname &&( !cbobj.modelFile || Q3Dref.loadedObjects[cbobj.modelFile] ) )
								{
									THREE.TSH.ModelFit(cbobj);
									Q3Dref.loadAddList.splice(i, 1);
								};
							};
					//////////////////////////////////////////////////////
					
					Q3Dref.loadMaster.inCallback = false;
					//Q3Dref.loadMaster.flagLoading = true;
					Q3Dref.loadMaster.loadIndex ++
					Q3Dref.stackShift();
					//console.log(fname)
					
				});
			
			};
			
			Q3Dref.loadMaster.loadStack.push([loadobj,fname])
			Q3Dref.loadMaster.loadTotal ++
			Q3Dref.loadQueue[fname] = true;
		
		}else if( filetype === "geom" ){
		
			

			var geometry =	Q3Dref.geometry[fname.split('.')[0]];
			if(geometry){
			var mat,Nmat //= new THREE.MeshPhongMaterial();
			//alert(geometry)
			Q3Dref.loadedObjects[fname] = new THREE.Mesh(geometry, mat); // right now animated meshes aren't supported
			//Q3Dref.loadQueue[fname] = false;
			Q3Dref.GenerateLoadedObjectsInfo(fname); //seems to work for walt head model
			}else{
				Q3Dref.geomCallbacks[fname.split('.')[0]] = function(){
				
					// just so it works with "model materials", kinda dumb / useless
					mat = new THREE.MeshFaceMaterial();
					Nmat = new THREE.MeshLambertMaterial();
					Nmat.color.setHex(Math.random()*255*255*255);
					mat.materials.push(Nmat);
					

					Q3Dref.loadedObjects[fname] = new THREE.Mesh(Q3Dref.geometry[fname.split('.')[0]], mat);
					Q3Dref.GenerateLoadedObjectsInfo(fname);
				
				};
			}
			//Q3Dref.loadMaster.inCallback = false;
			//Q3Dref.loadMaster.flagLoading = true;
			//Q3Dref.loadMaster.loadIndex ++
			//Q3Dref.stackShift();
			//console.log(fname)
					
			
			//Q3Dref.loadMaster.loadStack.push([loadobj,fname])
			//Q3Dref.loadMaster.loadTotal ++
			//Q3Dref.loadQueue[fname] = true;
		
		
		};
		
		var loadStackLength = Q3Dref.loadMaster.loadStack.length
		
		if(!Q3Dref.loadMaster.inCallback && loadStackLength > 0){ // initiate loading next frame.
		
			//Q3Dref.loadMaster.flagLoading = true;
			Q3Dref.stackShift();
		
		};
		
		
	};
		

/////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////
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
		
		// any other properties you need, e.g...
		// this.myValue = 0;
		
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.snapshot_data = "";
	
		var Q3Dref = this.runtime.Q3D
		
		this.ticker = 0;
		this.frameskip = this.properties[13];
		//this.test3Dgrid = new  Q3Dref.SparseGrid3D(10,10);
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;

		this.visible = (this.properties[0] === 0); // set  0=visible, 1=invisible (this.visible is part of the objects default properties like this.x,.y,etc.)
		
		this.properties[4] === 0 ? Q3Dref.rendererSettings.AntiAlias = false : Q3Dref.rendererSettings.AntiAlias = true;
		this.properties[5] === 0 ? Q3Dref.rendererSettings.shadowMap = false : Q3Dref.rendererSettings.shadowMap = true;
		//Q3Dref.rendererSettings.ClearColor = this.properties[7];
		//Q3Dref.rendererSettings.ClearAlpha = this.properties[8];
		//alert(this.properties[7]);
		
		//Q3Dref.DPR = (window.devicePixelRatio) ? self.devicePixelRatio : 1;
		this.testlastchanged = 1;
		this.widthlast = this.width;
		this.heightlast = this.height;
		
		this.anglelast = this.angle;
		this.xlast = this.x;
		this.ylast = this.y;
		
		Q3Dref.idLast = 0;
		Q3Dref.matLast = 0;
		Q3Dref.idPicked = 0;
		
		Q3Dref.viewportsEnabled = false;
		

		

		//Q3Dref.ctx = Q3Dref.canvas.getContext("webgl") || Q3Dref.canvas.getContext("experimental-webgl"); // if it fails fallback?
		Q3Dref.Rmode = this.properties[2];
		Q3Dref.Smode = this.properties[3];
		Q3Dref.RESmode = this.properties[14];
		//Q3Dref.RESmode = this.properties[4];
		//THREE.TJS.ResizeFlag = 2;
	
		if(Q3Dref.Rmode === 0 || Q3Dref.Rmode === 2){		
		//Q3Dref.MainDiv = document.getElementById("c2canvasdiv");
		Q3Dref.MainDiv = this.runtime.canvas.parentNode;
		Q3Dref.MainDivRect = Q3Dref.MainDiv.getBoundingClientRect();
		Q3Dref.MainDiv.appendChild(Q3Dref.canvas);
		//alert(Q3Dref.MainDiv.className);
					Q3Dref.canvas.addEventListener('contextmenu', function(e) { //disable right clicks http://stackoverflow.com/questions/8370213/block-right-clicks-in-canvas-with-webgl-context ///// hi ashley
						  if (e.button === 2) {
						   e.preventDefault();
							return false;
						  }
						}, false);
		Q3Dref.canvas.style.position="absolute";
			if(Q3Dref.Smode === 0){
				Q3Dref.canvas.style.top = Q3Dref.MainDivRect.top+"px";
				Q3Dref.canvas.style.left = Q3Dref.MainDivRect.left+"px";
				Q3Dref.canvas.style.width = this.runtime.width + "px"//(Q3Dref.MainDivRect.right-Q3Dref.MainDivRect.left)+"px";
				Q3Dref.canvas.style.height = this.runtime.height + "px"//(Q3Dref.MainDivRect.bottom-Q3Dref.MainDivRect.top)+"px";
				//Q3Dref.canvas.width=this.runtime.width;
				//Q3Dref.canvas.height=this.runtime.height;
			//alert(Q3Dref.MainDivRect.right-Q3Dref.MainDivRect.left);
			}
			else{
				Q3Dref.canvas.style.top = Q3Dref.MainDivRect.top+this.y+"px";
				Q3Dref.canvas.style.left = Q3Dref.MainDivRect.left+this.x+"px";
				//Q3Dref.canvas.width=this.width;
				//Q3Dref.canvas.height=this.height;

			};

        Q3Dref.canvas.width=this.width;
        Q3Dref.canvas.height=this.height;
		if(Q3Dref.Rmode === 2){	
		Q3Dref.canvas.style.zIndex = "0"; 
		this.runtime.canvas.style.position="absolute";
		this.runtime.canvas.style["pointer-events"] = "none"; // allows click to bleed through the construct canvas so css stuff works, not sure if i should actually have this though... remove if complaints come in? POSSIBLE BUG BUGGY
		this.runtime.canvas.style.zIndex = "1";
		};
		
		};
		
		if(Q3Dref.Rmode === 1){
		Q3Dref.canvas.width=this.width;
        Q3Dref.canvas.height=this.height;
			if(Q3Dref.Smode === 0){
				this.width = this.runtime.width;
				this.height = this.runtime.height;
				this.x = 0;
				this.y = 0;
				//this.update_bbox();
			};
		};
		
		if(Q3Dref.RESmode === 0){
			if(Q3Dref.Smode === 0){
				this.width = this.runtime.width;
				this.height = this.runtime.height;
				Q3Dref.canvas.width= this.runtime.width;
				Q3Dref.canvas.height= this.runtime.height;
				this.x = 0;
				this.y = 0;
				//this.update_bbox();
			};
		};
	
		this.update_bbox();	
		
		// THESE ARE RESET (not needed anymore since you can't create viewports with the legacy actions in master)
		
		//Q3Dref.viewports = {};
		//Q3Dref.viewportZarray = [];
		//Q3Dref.viewports.Default = [0, 0, 1, 1,"Default","Default",0];
		
		Q3Dref.Vector3 = new THREE.Vector3(0,0,0);
		

		
		Q3Dref.sceneName = "Default";
		Q3Dref.sceneDic.Default = [Q3Dref.sceneDic.Default[0],this.properties[7],this.properties[8],false];
		Q3Dref.scene = Q3Dref.sceneDic.Default[0];
		Q3Dref.sceneForRender = Q3Dref.sceneDic.Default;
		
		Q3Dref.cameraName = "Default";
		Q3Dref.cameraDic.Default = new THREE.CombinedCamera();   //ADD THESE FOR NOW TO TEST
		// setup frustum properly at layout start...
		

		Q3Dref.camera = Q3Dref.cameraDic.Default;
		Q3Dref.cameraForRender = Q3Dref.cameraDic.Default;
		

		if(this.properties[9] === 1){
			var axisHelper = new THREE.AxisHelper( 50 );
			axisHelper.position.x += 1;
			Q3Dref.scene.add( axisHelper );
			
		}
		
		if(this.properties[10] === 1){ 
			var gridHelper = new THREE.GridHelper( 100, 10 );
			gridHelper.position.x +=110;
			gridHelper.position.y +=110;
			gridHelper.setColors(new THREE.Color("rgb(30,30,30)"), new THREE.Color("rgb(30,30,30)"));
			gridHelper.rotation.x = Math.PI/2;
			Q3Dref.scene.add(gridHelper);
		};
		
		if(this.properties[12] === 0){ 
			var light = new THREE.DirectionalLight();
			light.position.set(-23,-29,-31)
			light.name = "dir<>light"
			Q3Dref.scene.add(light);
		};
		
		
		Q3Dref.UpdateAllMaterials(); // need to clear buffers and leftover models for this scene;
		Q3Dref.UpdateAllMaterialsDO(Q3Dref.scene);
		
		Q3Dref.orderViewportZarray();
		
		if (Q3Dref.Rmode === 1){
		if( this.runtime.glwrap)	this.webGL_texture = this.runtime.glwrap.createEmptyTexture(Q3Dref.canvas.width, Q3Dref.canvas.height, this.runtime.linearSampling)
		else console.log("Inside mode only works with WebGL enabled for the construct canvas, canvas 2D is being used instead, so the Q3D canvas texture cannot be passed in.");
		};
		
		if(!Q3Dref.renderer) Q3Dref.InitializeRenderer(this);
		// set init values
		Q3Dref.camera.fov = 70
		Q3Dref.camera.near = 0.1
		Q3Dref.camera.far = 10000;
		Q3Dref.camera.width =  this.widthlast;
		Q3Dref.camera.height =  this.heightlast;
		Q3Dref.camera.aspect =   this.widthlast/this.heightlast;
		
		Q3Dref.camera.position.x = this.widthlast/2;
		Q3Dref.camera.position.y = this.heightlast/2;

		Q3Dref.camera.position.z = -1*(this.heightlast/2)/Math.tan((Q3Dref.camera.fov/2)*(THREE.Deg2Rad)); // set cam position so that z = 0 plane is the scale of the construct z=0 plane
		Q3Dref.camera.up = new THREE.Vector3(0,-1,0);
		Q3Dref.camera.lookAt(new THREE.Vector3( this.widthlast/2,this.heightlast/2,0));
		
	//	if( this.properties[11] === 0) Q3Dref.camera.toOrthographic();
		
		//Q3Dref.camera.cameraP.near= 0.1;
		//Q3Dref.camera.cameraP.far= 10000;
		
		//Q3Dref.camera.cameraP.fov= 70;
		//Q3Dref.camera.fov= 70;
		
		//Q3Dref.camera.cameraP.aspect=  this.widthlast/this.heightlast;
		//Q3Dref.camera.aspect=  this.widthlast/this.heightlast;
		
		//Q3Dref.camera.cameraO.near= 0.1;
		//Q3Dref.camera.cameraO.far= 10000;	
		//Q3Dref.camera.cameraO.left=  this.widthlast/(-2);	
		//Q3Dref.camera.cameraO.right=  this.widthlast/(2);	
		//Q3Dref.camera.cameraO.top= this.heightlast/(2);	
		//Q3Dref.camera.cameraO.bottom= this.heightlast/(-2);

		//Q3Dref.camera.cameraP.updateProjectionMatrix();
		//Q3Dref.camera.cameraO.updateProjectionMatrix();
		

		Q3Dref.camera.toPerspective();
		if( this.properties[11] === 0) Q3Dref.camera.toOrthographic();
		
		this.changedRes = true;
		this.CSSsetup();
		this.runtime.tick2Me(this)
		this.runtime.tickMe(this)
			
	};
	
instanceProto.tick = function () // for physics and stuff
{
	if(this.runtime.QPhys){
		
		//var dt = this.runtime.QPhys.world.timeStep // (does this make time-scale/dt work? i think so)
		
		if (this.runtime.QPhys.steppingMode === 0){		// fixed
			this.runtime.QPhys.world.timeStep = this.runtime.timescale / 60;
			//alert('s')
		}else{ // use timedelta
			
			this.runtime.QPhys.world.timeStep = this.runtime.dt//this.runtime.getDt(this.inst);
			
			// Cap step at 30 FPS, otherwise instability can result
			if (this.runtime.QPhys.world.timeStep > 1 / 30)
				this.runtime.QPhys.world.timeStep= 1 / 30;
		}
		
		this.runtime.QPhys.stepPhys(); // should i have this here? or in the behaviour.tick? it seems like the extra checking in behaviour tick C2 phys uses is a bit dumb, this seems better, not sure tho.
		
	};
};
	
	instanceProto.tick2 = function ()
	{
		var Q3Dref = this.runtime.Q3D
	
		/*var loadStackLength = Q3Dref.loadMaster.loadStack.length
		
		//if(!Q3Dref.loadMaster.inCallback && loadStackLength > 0){ // initiate loading next frame.
		if(Q3Dref.loadMaster.flagLoading){ // use this so users have frames to update a loading bar or something easily.
		
			if(!Q3Dref.loadMaster.inCallback && loadStackLength > 0){ // initiate loading next frame.
			
				Q3Dref.loadMaster.flagLoading = false;
				Q3Dref.loadMaster.loadStack[0][0](); // trigger next load;
				Q3Dref.loadMaster.loadStack.shift(); // once triggered, shift it off stack (shift instead of pop so models load in order specified).
			
			};
			
			if(loadStackLength === 0){
				Q3Dref.loadMaster.flagLoading = false;
				Q3Dref.loadMaster.allLoaded = true;			// nothing left to do. 
			};
		};*/
	
		this.runtime.redraw = true; //for canvas...
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	
		if(this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
		}
		
		if(this.runtime.Q3D.Rmode === 0 || this.runtime.Q3D.Rmode === 2){
		this.runtime.Q3D.canvas.parentNode.removeChild(this.runtime.Q3D.canvas);
		};
		
		this.runtime.Q3D.sceneDic.Default = [new THREE.Scene(),0,0,false]; // create new scene here, or else Q3D objects are busted
		this.runtime.Q3D.sceneDic.Default[0].userData.master = true;
		this.runtime.Q3D.sceneDic.Default[0].name = "Default"
		
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

	};
	
	// only called if a layout object - draw to a canvas 2D context

	instanceProto.CSSsetup = function(){
			
		this.testlastchanged = 1;
	    if (this.widthlast == this.width && this.heightlast == this.height && this.anglelast == this.angle && this.xlast == this.x && this.ylast == this.y) this.testlastchanged = 0; // check if the position of the display box has changed

	    if (THREE.TJS.ResizeFlag > 0 || this.testlastchanged === 1 || this.changedRes)
	    {
			this.changedRes = false;
			if(this.runtime.Q3D.RESmode === 0 && THREE.TJS.ResizeFlag > 0){
				this.runtime.Q3D.renderer.setSize( this.runtime.width,  this.runtime.height );
			};
	       //THREE.TJS.ResizeFlag -= 1;
	        if (this.runtime.Q3D.Rmode === 0 || this.runtime.Q3D.Rmode === 2)
	        {
	            //this.runtime.Q3D.MainDiv = document.getElementById("c2canvasdiv");
	            this.runtime.Q3D.MainDiv = this.runtime.canvas.parentNode;
	            this.runtime.Q3D.MainDivRect = this.runtime.Q3D.MainDiv.getBoundingClientRect();
	            this.runtime.Q3D.MainDiv.appendChild(this.runtime.Q3D.canvas);
	            this.runtime.Q3D.canvas.style.position = "absolute";
	            if (this.runtime.Q3D.Smode === 0)
	            {
	                this.runtime.Q3D.canvas.style.top = this.runtime.Q3D.MainDivRect.top + "px";
	                this.runtime.Q3D.canvas.style.left = this.runtime.Q3D.MainDivRect.left + "px";
	                this.runtime.Q3D.canvas.style.width = (this.runtime.Q3D.MainDivRect.right - this.runtime.Q3D.MainDivRect.left) + "px";
	                this.runtime.Q3D.canvas.style.height = (this.runtime.Q3D.MainDivRect.bottom - this.runtime.Q3D.MainDivRect.top) + "px";
					
		
					
	            }
	            else
	            {

				
	                this.runtime.Q3D.canvas.style.width = this.width + "px";
	                this.runtime.Q3D.canvas.style.height = this.height + "px";

	                this.xlast = (this.hotspotX - 0.5) * Math.cos(this.angle) - (this.hotspotY - 0.5) * Math.sin(this.angle) - (this.hotspotX - 0.5);
	                this.ylast = (this.hotspotX - 0.5) * Math.sin(this.angle) + (this.hotspotY - 0.5) * Math.cos(this.angle) - (this.hotspotY - 0.5);


	                this.runtime.Q3D.canvas.style.top = this.runtime.Q3D.MainDivRect.top + this.y - (this.hotspotY + this.ylast) * this.height + "px"; // DONT KNOW HOW TO GET WINDOW HEIGHT/WIDTH????
	                this.runtime.Q3D.canvas.style.left = this.runtime.Q3D.MainDivRect.left + this.x - (this.hotspotX + this.xlast) * this.width + "px";



	                this.runtime.Q3D.canvas.style.webkitTransform = "rotate(" + this.angle * (THREE.Rad2Deg) + "deg)";
	                this.runtime.Q3D.canvas.style.MozTransform = "rotate(" + this.angle * (THREE.Rad2Deg) + "deg)";
	                this.runtime.Q3D.canvas.style.msTransform = "rotate(" + this.angle * (THREE.Rad2Deg) + "deg)";
	                this.runtime.Q3D.canvas.style.OTransform = "rotate(" + this.angle * (THREE.Rad2Deg) + "deg)";
	                this.runtime.Q3D.canvas.style.transform = "rotate(" + this.angle * (THREE.Rad2Deg) + "deg)";

	                this.runtime.Q3D.canvas.style.opacity = this.opacity; //"0.9";
	                this.runtime.Q3D.canvas.style.filter = 'alpha(opacity=' + this.opacity * 100 + ')'; // IE fallback

	            };

	        };

	    };
		
		if(this.runtime.Q3D.Rmode === 1){
			if(this.runtime.Q3D.Smode === 0){
				  
				  var q = this.bquad;
				  q.tlx = 0;
				  q.tly = 0;
				  q.trx = this.runtime.width
				  q.try_ = 0;
				  q.blx = 0;
				  q.bly = this.runtime.height;
				  q.brx = this.runtime.width;
				  q.bry = this.runtime.height;
				
				this.runtime.Q3D.Ca = 0;
				this.runtime.Q3D.Ctrx = this.runtime.width // ?
				this.runtime.Q3D.Ctry = 0;
				this.runtime.Q3D.Cblx = 0;
				this.runtime.Q3D.Cbly = this.runtime.height // ?
				
			}else{		
			
				this.runtime.Q3D.Ca = this.angle;
				this.runtime.Q3D.Ctrx = (this.x+(1-this.hotspotX)*this.width);
				this.runtime.Q3D.Ctry = (this.y-this.hotspotY*this.height);
				this.runtime.Q3D.Cblx = (this.x-this.hotspotX*this.width);
				this.runtime.Q3D.Cbly = (this.y+(1-this.hotspotY)*this.height);
			};		
		}else{
		
			if(this.runtime.Q3D.Smode === 0){
				this.runtime.Q3D.Ca = 0;
				this.runtime.Q3D.Ctrx = this.runtime.Q3D.MainDivRect.right-this.runtime.Q3D.MainDivRect.left;
				this.runtime.Q3D.Ctry = 0;
				this.runtime.Q3D.Cblx = 0;
				this.runtime.Q3D.Cbly = this.runtime.Q3D.MainDivRect.bottom-this.runtime.Q3D.MainDivRect.top;
		
			}else{	
		
				this.runtime.Q3D.Ca = this.angle;
				this.runtime.Q3D.Ctrx = (this.x+(1-this.hotspotX)*this.width);
				this.runtime.Q3D.Ctry = (this.y-this.hotspotY*this.height);
				this.runtime.Q3D.Cblx = (this.x-this.hotspotX*this.width);
				this.runtime.Q3D.Cbly = (this.y+(1-this.hotspotY)*this.height);
				
			};
		};

	    this.widthlast = this.width;
	    this.heightlast = this.height;
	    this.anglelast = this.angle;
	    this.xlast = this.x;
	    this.ylast = this.y;
		
	};
	
	instanceProto.Draw3D = function(){ // Use this since we draw webGL regardless of if the renderer is canvas 2D or not, three.js canvas renderer is just too slow to be worth supporting.
		
		//THREE.AnimationHandler.update( this.runtime.dt);
		//this.runtime.QPhys.World.step();
		
		this.CSSsetup();
		
		// this stuff is so zooming etc. doesn't mess up the way things are positioned / rendered ?
		this.runtime.Q3D.renderer.setPixelRatio( window.devicePixelRatio )
		//console.log(this.runtime.Q3D.renderer.getPixelRatio())
	    this.runtime.Q3D.DPR = 1 / this.runtime.Q3D.renderer.getPixelRatio();//this.runtime.Q3D.renderer.devicePixelRatio; // no clue why but this works? bug in viewport code for three.js?

	    if (this.runtime.Q3D.viewportsEnabled)
	    {
	        this.runtime.Q3D.renderer.autoClear = false;
			if(this.runtime.Q3D.Rmode === 1){ // if the canvas isn't part of the DOM, the buffer is not automatically cleared.
				this.runtime.Q3D.renderer.enableScissorTest(false);
				this.runtime.Q3D.renderer.setClearColor(0,0);
				this.runtime.Q3D.renderer.clear(true, true, true);
			};
			this.runtime.Q3D.renderer.enableScissorTest(true);
			
	        var len = this.runtime.Q3D.viewportZarray.length;
			//var renderCheck = 0;
			
			//this.runtime.Q3D.renderer.enableScissorTest(true);
			
			for (var i = 0; i < len; i++)
	        {

	            var viewportScene = this.runtime.Q3D.viewportZarray[i][4];
	            var viewportCamera = this.runtime.Q3D.viewportZarray[i][5];
	           
				if(!this.runtime.Q3D.sceneDic[viewportScene]) continue; //nothing to render, so don't;
				if(!this.runtime.Q3D.cameraDic[viewportCamera]) continue; // nothing to render, so don't;
				//renderCheck ++;
				
			   var vl = this.runtime.Q3D.viewportZarray[i][0];
	            var vb = this.runtime.Q3D.viewportZarray[i][1];
	            var vr = (this.runtime.Q3D.viewportZarray[i][2] - vl);
	            var vt = (this.runtime.Q3D.viewportZarray[i][3] - vb);


	            this.runtime.Q3D.renderer.setScissor(vl * this.runtime.Q3D.canvas.width * this.runtime.Q3D.DPR, vb * this.runtime.Q3D.canvas.height * this.runtime.Q3D.DPR, vr * this.runtime.Q3D.canvas.width * this.runtime.Q3D.DPR, vt * this.runtime.Q3D.canvas.height * this.runtime.Q3D.DPR);
	            this.runtime.Q3D.renderer.setViewport(vl * this.runtime.Q3D.canvas.width * this.runtime.Q3D.DPR, vb * this.runtime.Q3D.canvas.height * this.runtime.Q3D.DPR, vr * this.runtime.Q3D.canvas.width * this.runtime.Q3D.DPR, vt * this.runtime.Q3D.canvas.height * this.runtime.Q3D.DPR);
	            this.runtime.Q3D.renderer.setClearColor(this.runtime.Q3D.sceneDic[viewportScene][1], this.runtime.Q3D.sceneDic[viewportScene][2])

	            if (this.runtime.Q3D.sceneDic[viewportScene][2] < 0.999) this.runtime.Q3D.renderer.clear(false, true, true)
	            else this.runtime.Q3D.renderer.clear(true, true, true);
				
				if (this.runtime.Q3D.sceneDic[viewportScene][3]) this.runtime.Q3D.UpdateAllMaterialsDO( this.runtime.Q3D.sceneDic[viewportScene][0] ); // possible bug where changing the scene will cause this to update the wrong thing.
				this.runtime.Q3D.sceneDic[viewportScene][3] = false;
				
	            this.runtime.Q3D.renderer.render(this.runtime.Q3D.sceneDic[viewportScene][0], this.runtime.Q3D.cameraDic[viewportCamera]);

	        };
			
			/*if(renderCheck === 0){
			this.runtime.Q3D.renderer.setClearColor(0,0);
			this.runtime.Q3D.renderer.clear(true, true, true);
			};*/
	    }
	    else
	    { //normal mode where everything is rendered based on which scene/camera is selected



	        //this.runtime.Q3D.renderer.setScissor( vl*this.runtime.Q3D.canvas.width , vb*this.runtime.Q3D.canvas.height , vr*this.runtime.Q3D.canvas.width, vt*this.runtime.Q3D.canvas.height );
	        
			//disable for deferred test.
			
			if(this.properties[6] === 0){
				
				this.runtime.Q3D.renderer.autoClear = true;
				this.runtime.Q3D.renderer.enableScissorTest(false);		
				this.runtime.Q3D.renderer.setViewport(0, 0, this.runtime.Q3D.canvas.width * this.runtime.Q3D.DPR, this.runtime.Q3D.canvas.height * this.runtime.Q3D.DPR);
				this.runtime.Q3D.renderer.setClearColor(this.runtime.Q3D.sceneForRender[1], this.runtime.Q3D.sceneForRender[2])
				
	        }else if(this.properties[6] === 1){

				this.runtime.Q3D.renderer.renderer.autoClear = false;
				this.runtime.Q3D.renderer.renderer.setClearColor(this.runtime.Q3D.sceneForRender[1], this.runtime.Q3D.sceneForRender[2])
				this.runtime.Q3D.renderer.renderer.clear(false, true, true);
			
			};
			
			if (this.runtime.Q3D.sceneForRender[3]) this.runtime.Q3D.UpdateAllMaterialsDO( this.runtime.Q3D.sceneForRender[0] ); // possible bug where changing the scene will cause this to update the wrong thing.
			this.runtime.Q3D.sceneForRender[3] = false;
			
			this.runtime.Q3D.renderer.render(this.runtime.Q3D.sceneForRender[0], this.runtime.Q3D.cameraForRender); // renders to canvas
			
	    };

	};
	
	window.onresize=function(){ if(THREE.TJS){THREE.TJS.ResizeFlag=4;setTimeout(function(){THREE.TJS.ResizeFlag=0}, 300);};};  //set a timer so that the glitchiness that results from doing things ONLY when resize is called is fixed (in most cases this seemed to work, dont know a better way)
	
	instanceProto.draw = function(ctx) // uhh, i just copied the webgl drawing code, this is gonna be buggy glitchy etc, fix it later, IE is forcing me to do this
	{		
		/*this.runtime.Q3D.canvas.style.visibility = this.visible ? "visible" : "hidden"; // CONTROL CSS STYLING
		this.ticker += this.frameskip // (control the framerate skip to control framerate, so 0 equals nothing, 0.1 is 6fps, 0.5 is 30 fps, 1.0 is 60 fps)
		if(this.ticker >= 1)
		this.Draw3D();
		this.ticker = this.ticker%1*/
		this.runtime.Q3D.canvas.style.visibility = "hidden";
	};
	
	instanceProto.drawGL = function (glw)
	{
		this.runtime.Q3D.canvas.style.visibility = this.visible ? "visible" : "hidden"; // CONTROL CSS STYLING
		this.ticker += this.frameskip // (control the framerate skip to control framerate, so 0 equals nothing, 0.1 is 6fps, 0.5 is 30 fps, 1.0 is 60 fps)
		if(this.ticker >= 1)
		this.Draw3D();
		this.ticker = this.ticker%1

		if (this.runtime.Q3D.Rmode === 1)
	    {
		//this.webGL_texture = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
	        this.runtime.glwrap.videoToTexture(this.runtime.Q3D.canvas, this.webGL_texture);
	        glw.setTexture(this.webGL_texture);
	        glw.setOpacity(this.opacity);
	        var q = this.bquad;
			var tlx = this.layer.canvasToLayer(q.tlx,q.tly,true);
			var tly = this.layer.canvasToLayer(q.tlx,q.tly,false);
			var trx = this.layer.canvasToLayer(q.trx,q.try_,true);
			var try_ = this.layer.canvasToLayer(q.trx,q.try_,false);
			var blx = this.layer.canvasToLayer(q.blx,q.bly,true);
			var bly = this.layer.canvasToLayer(q.blx,q.bly,false);
			var brx = this.layer.canvasToLayer(q.brx,q.bry,true);
			var bry = this.layer.canvasToLayer(q.brx,q.bry,false);
			//have to flip quad in some browsers because videoToTexture is broken...
			//if(this.runtime.isIE||this.runtime.isFirefox){ // these two browsers are upside down in inside mode, but this fix might become outdated which makes me uncomfortable using it. should somehow detect how browser looks flipped instead.
			if(this.runtime.Q3D.isFlippedTexture){ // thanks rojo!
				glw.quad(blx, tly, brx, try_, trx, bry, tlx, bly);
			}else{
				glw.quad(blx, bly, brx, bry, trx, try_, tlx, tly);
			};
	   
	   };		
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

	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		
		
		// return true if number is positive
		return myparam >= 0;
	};
	
	/*instanceProto.recursiveLoop = function (obj,this_)
	{
		var len = obj.children.length;
			for (var i = 0; i < len; i++) {
			this_.runtime.getCurrentEventStack().current_event.retrigger();
			this_.recursiveLoop(obj.children.[i]);
			};
	};*/
	
	Cnds.prototype.ForEachObject = function (id,recursive,pick)
	{
		//alert(this.runtime.Q3D.scene.children)
		var obj = this.runtime.Q3D.EpickById(id);
		//if(! obj && id != this.runtime.Q3D.scene.id) return false;
		
		if(!obj){
		if( id == this.runtime.Q3D.scene.id){  //choose the scene if the id corresponds to it, getobjectbyiddoesn't work.
		obj = this.runtime.Q3D.scene;
		}
		else return false;
		};
		
		if(pick==0&&obj!=this.runtime.Q3D.scene){
		this.runtime.Q3D.idPicked = id;
		this.runtime.getCurrentEventStack().current_event.retrigger();
		};
		
		var pickarr = [];
		
		if(recursive==0){ //fixed so that dereferencing from deletion doesn't occur (possibly slower now though)
		
		//obj.children
			/*var len = obj.children.length;
			for (var i = 0; i < len; i++) {
			this.runtime.Q3D.idPicked = obj.children[i].id;
			this.runtime.getCurrentEventStack().current_event.retrigger();
			this.runtime.Q3D.recursiveLoop(obj.children[i],this);
			//Do something */
			
			var len = obj.children.length;
			for (var i = 0; i < len; i++) {
			//this.runtime.Q3D.idPicked = obj.children[i].id;
			pickarr.push(obj.children[i].id);
			//this.runtime.getCurrentEventStack().current_event.retrigger();
			this.runtime.Q3D.recursiveLoopPick(obj.children[i],pickarr);
			//Do something
			};
			
			var len = pickarr.length;
			for (var i = 0; i < len; i++) {
			this.runtime.Q3D.idPicked = pickarr[i];
			this.runtime.getCurrentEventStack().current_event.retrigger();
			//this.runtime.Q3D.recursiveLoopPick(obj.children[i],pickarr);
			//Do something
			};
		
		}
		else{
		
			/*var len = obj.children.length;
			for (var i = 0; i < len; i++) {
			//obj.children.[i];
			this.runtime.Q3D.idPicked = obj.children[i].id;
			this.runtime.getCurrentEventStack().current_event.retrigger();
			//Do something
			};*/
			
			var len = obj.children.length;
			for (var i = 0; i < len; i++) {
			//this.runtime.Q3D.idPicked = obj.children[i].id;
			pickarr.push(obj.children[i].id);
			//this.runtime.getCurrentEventStack().current_event.retrigger();
			//Do something
			};
			
			var len = pickarr.length;
			for (var i = 0; i < len; i++) {
			this.runtime.Q3D.idPicked = pickarr[i];
			this.runtime.getCurrentEventStack().current_event.retrigger();
			//this.runtime.Q3D.recursiveLoopPick(obj.children[i],pickarr);
			//Do something
			};
		
		};
		return false;
	};
	
	
	Cnds.prototype.ProjectCoords = function (id,recursive,cam,x,y,precision)
	{
		//alert(this.runtime.Q3D.scene.children)
		var obj = this.runtime.Q3D.EpickById(id);
		//if(! obj && id != this.runtime.Q3D.scene.id) return false;
		
		if(!obj){
		if( id == this.runtime.Q3D.scene.id){  //choose the scene if the id corresponds to it, getobjectbyiddoesn't work.
		obj = this.runtime.Q3D.scene;
		}
		else return false;
		};
		
		if(!this.runtime.Q3D.cameraDic[cam]){
		alert ("you have chosen a camera which doesn't exist for projecting coordinates");
		return false;
		};
		
		var ray = this.runtime.Q3D.projector.pickingRay( new THREE.Vector3(x,y,0), this.runtime.Q3D.cameraDic[cam] );
		ray.precision = precision;
		
		var cross;
		
		if(recursive==0){
		
		cross = ray.intersectObject( obj, true );
		
		}
		else{
		
		cross = ray.intersectObject( obj, false );
		
		};
		
			var len = cross.length;
			
			this.runtime.Q3D.Ray_numObj = len;
			
			this.runtime.Q3D.Ray_index = -1;
			
			this.runtime.Q3D.Ray_originX = ray.ray.origin.x;
			this.runtime.Q3D.Ray_originY = ray.ray.origin.y;
			this.runtime.Q3D.Ray_originZ = ray.ray.origin.z;
			
			this.runtime.Q3D.Ray_dirX = ray.ray.direction.x;
			this.runtime.Q3D.Ray_dirY = ray.ray.direction.y;
			this.runtime.Q3D.Ray_dirZ = ray.ray.direction.z;
			//alert("ray")
			for (var i = 0; i < len; i++) {
			
			this.runtime.Q3D.Ray_index = i;
			this.runtime.Q3D.Ray_idPicked = cross[i].object.id;
			this.runtime.Q3D.Ray_distance = cross[i].distance;
			
			this.runtime.Q3D.Ray_pointX = cross[i].point.x;
			this.runtime.Q3D.Ray_pointY = cross[i].point.y;
			this.runtime.Q3D.Ray_pointZ = cross[i].point.z;
			
			var normalMatrix = new THREE.Matrix3().getNormalMatrix( cross[i].object.matrixWorld );
			if(cross[i].face){
			var worldNormal = cross[i].face.normal.clone().applyMatrix3( normalMatrix ).normalize();
			
			this.runtime.Q3D.Ray_nX = worldNormal.x;
			this.runtime.Q3D.Ray_nY = worldNormal.y;
			this.runtime.Q3D.Ray_nZ = worldNormal.z;
			};
			this.runtime.getCurrentEventStack().current_event.retrigger();
			//Do something
			};
		
		
		return false;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// the example action
	
	Acts.prototype.CollGridSettings = function (stype,debug,xs,ys,zs)
	{

		/**BEGIN-PREVIEWONLY**/		
		if(debug === 0){
		stype.collision_grid3D.gridCellDebug = true;
		//stype.gridCellDebug = true;
		stype.collision_grid3D.fillCellDebug = true;
		stype.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		};
		if(debug === 1){
		stype.collision_grid3D.gridCellDebug = true;
		//stype.gridCellDebug = true;
		stype.collision_grid3D.fillCellDebug = false;
		stype.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		}
		if(debug === 2){
		stype.collision_grid3D.gridCellDebug = false;
		//stype.gridCellDebug = false;
		stype.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),true);
		return;
		}
		/**END-PREVIEWONLY**/
		
		stype.collision_grid3D.Wipe(Math.ceil(Math.abs(xs)),Math.ceil(Math.abs(ys)),Math.ceil(Math.abs(zs)),false);
		return;
	
	};	
	
	Acts.prototype.SetFrameSkip = function (val)
	{
		
		this.frameskip = val;
		var str = ""
		var key
		
		for( key in Acts.prototype) str += key+"\n"
		
		//alert(Acts.prototype.SetFrameSkip)
		
		alert(str);
		console.log(str);
	
	};
	
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
/*var obj = this.runtime.Q3D.scene.getObjectByName( myparam );
		
		alert(obj.name);		
				alert(obj.id);	
		alert(obj.getDescendants());*/
		
		//this.runtime.Q3D.renderer.initWebGLObjects( this.runtime.Q3D.scene );
		
		/*this.runtime.Q3D.scene.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
			
					child.material.needsUpdate = true;
								
				}

			} );*/
	
		this.runtime.Q3D.UpdateAllMaterials(); // THIS WORKS?!!!
	
	};
	
	Acts.prototype.ViewportsEnable = function (ena)
	{
	this.runtime.Q3D.viewportsEnabled = (ena == 0);
	};
	
	Acts.prototype.ViewportsAddEdit = function (name,scene,camera,left,right,top,bottom,z)
	{
	if(!this.runtime.Q3D.sceneDic[scene]){alert("scene: ''"+scene+"'' doesn't exist, create it with 'add scene'") ;return;}
	if(!this.runtime.Q3D.cameraDic[camera]){alert("camera: ''"+camera+"'' doesn't exist, create it with 'add camera'") ;return;}
	this.runtime.Q3D.viewports[name] = [left, bottom, right, top,scene,camera,z];
	this.runtime.Q3D.orderViewportZarray();	
	};

	Acts.prototype.ViewportsRemove = function (name)
	{
	delete this.runtime.Q3D.viewports[name];
	this.runtime.Q3D.orderViewportZarray();	
	};
	
	Acts.prototype.SceneChange = function (Sname)
	{
		if(!this.runtime.Q3D.sceneDic[Sname]){ alert("scene: ''"+Sname+"'' does not exist, create it with 'add scene'"); return;};
		this.runtime.Q3D.sceneName = Sname;
		this.runtime.Q3D.scene = this.runtime.Q3D.sceneDic[Sname][0];
		//this.runtime.Q3D.scene.name = Sname;
	};
	
	Acts.prototype.SetRenderScene = function (Sname)
	{
		if(!this.runtime.Q3D.sceneDic[Sname]){ alert("scene: ''"+Sname+"'' does not exist, create it with 'add scene'"); return;};
		//this.runtime.Q3D.sceneName = Sname;
		this.runtime.Q3D.sceneForRender = this.runtime.Q3D.sceneDic[Sname];
		//this.runtime.Q3D.scene.name = Sname;
	};
	
	Acts.prototype.SetRenderCamera = function (Sname)
	{
		if(!this.runtime.Q3D.cameraDic[Sname]){ alert("camera: ''"+Sname+"'' does not exist, create it with 'add camera'"); return;};
		//this.runtime.Q3D.cameraName = Sname;
		this.runtime.Q3D.cameraForRender = this.runtime.Q3D.cameraDic[Sname];
		//this.runtime.Q3D.camera.name = Sname;
	};
	
	Acts.prototype.SceneAdd = function (Sname)
	{
		this.runtime.Q3D.sceneDic[Sname] = [new THREE.Scene(),this.properties[7],this.properties[8],false];
		this.runtime.Q3D.sceneDic[Sname][0].userData.master = true;
		/*this.runtime.Q3D.sceneName = Sname;
		this.runtime.Q3D.scene = this.runtime.Q3D.sceneDic[Sname][0];*/
		this.runtime.Q3D.sceneDic[Sname][0].name = Sname;
	};
	
	Acts.prototype.CameraChange = function (Sname)
	{
		if(!this.runtime.Q3D.cameraDic[Sname]){ alert("camera: ''"+Sname+"'' does not exist, create it with 'add camera'"); return;};
		this.runtime.Q3D.cameraName = Sname;
		this.runtime.Q3D.camera = this.runtime.Q3D.cameraDic[Sname];
		this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
		//this.runtime.Q3D.camera.name = Sname;
	};

	Acts.prototype.CameraAdd = function (Sname)
	{
		var Q3Dref = this.runtime.Q3D
	
		Q3Dref.cameraDic[Sname] = new THREE.CombinedCamera();
		
		var CamRef = Q3Dref.cameraDic[Sname];
		
		CamRef.fov = 70
		CamRef.near = 0.1
		CamRef.far = 10000;
		CamRef.width =  this.width;
		CamRef.height =  this.height;
		CamRef.aspect =   this.width/this.height;
		
		CamRef.toPerspective();
		/*this.runtime.Q3D.cameraName = Sname;
		this.runtime.Q3D.camera = this.runtime.Q3D.cameraDic[Sname];*/
		//this.runtime.Q3D.camera.name = Sname;
		CamRef.matrixWorldNeedsUpdate = true;
	};

	Acts.prototype.LoadFileObj = function (fname)
	{
	
				/*this.runtime.Q3D.manager.ItemLoadComplete = 0;
				this.runtime.Q3D.manager.ItemTempLoaded = 0;
				
				this.runtime.Q3D.loadQueue[fname] = true;
				
				this.runtime.Q3D.loader = new THREE.OBJLoader( this.runtime.Q3D.manager );
				this.runtime.Q3D.loader.load( fname, function ( object ) {

					this.runtime.Q3D.loadedObjects[fname] = object;
					this.runtime.Q3D.loadQueue[fname] = false;

				} );*/
		
		this.runtime.Q3D.LoadFile(fname);  //deprecate the old load action and localise it all to one function
		
	};
	
	Acts.prototype.LoadFileJSON = function (fname)
	{
	
				/*this.runtime.Q3D.manager.ItemLoadComplete = 0;
				this.runtime.Q3D.loadQueue[fname] = true;
				this.runtime.Q3D.manager.ItemJSONList.push(fname);
				
				this.runtime.Q3D.loader = new THREE.JSONLoader( false );
				this.runtime.Q3D.loader.load( fname, function ( geometry , materials ) {
					var mat= new THREE.MeshFaceMaterial( materials );
					this.runtime.Q3D.loadedObjects[fname] = new THREE.Mesh( geometry, mat); // im not sure if i should use "skinned mesh" or not, i don't really know the exten to which JSON loader is useful yet.
					this.runtime.Q3D.loadQueue[fname] = false;
					
					this.runtime.Q3D.manager.ItemJSONList.splice(this.runtime.Q3D.manager.ItemJSONList.indexOf(fname),1); // keep track of json files being loaded, so that when callback occurs if none are left
					
					if(this.runtime.Q3D.manager.ItemJSONList.length == 0 && this.runtime.Q3D.manager.ItemTempLoaded == 1) this.runtime.Q3D.manager.ItemLoadComplete = 1; //? load is complete, update the user test value;
					
					//this.runtime.Q3D.geometry[fname]  = geometry;

				} );*/
				
		this.runtime.Q3D.LoadFile(fname); //deprecate the old load action and localise it all to one function
		
	};
	
	Acts.prototype.LoadFileImage = function (fname)
	{
	
				/*this.runtime.Q3D.manager.ItemLoadComplete = 0;
				this.runtime.Q3D.manager.ItemTempLoaded = 0;
				this.runtime.Q3D.loader = new THREE.ImageLoader( this.runtime.Q3D.manager );
				var Q3Dref = this.runtime.Q3D
				this.runtime.Q3D.loader.load( fname , function ( image ) {
					
					Q3Dref.loadedTextures[fname] = image;
					//this.runtime.Q3D.loadedTextures[fname].needsUpdate = true;  /////////////////////// TEST WHY YOU NEED THIS?

				} )*/
		
		this.runtime.Q3D.LoadFile(fname,true);
	};
	
	Acts.prototype.MyHugeAnnoyingTest1 = function ()
	{
		return true;
	};
	
	Acts.prototype.LoadFileFont = function (fname)
	{
	
				this.runtime.Q3D.manager.ItemLoadComplete = 0;
				this.runtime.Q3D.manager.ItemTempLoaded = 0;
				this.runtime.Q3D.loader = new THREE.OBJLoader( this.runtime.Q3D.manager );
				this.runtime.Q3D.loader.load( fname, function ( object ) {

					this.runtime.Q3D.loadedObjects[fname] = object;

				} );	
	};
	//alert('start of creat from filename')
	Acts.prototype.CreateObjFromFilename = function (name,fname,mat,cmode)
	{
		var obj = this.runtime.Q3D.loadedObjects[fname];
		var material = this.runtime.Q3D.material[mat];
		if(! obj ){ alert("THE MODEL FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, OBJECT NOT CREATED"); return; }
		
		
		
		obj = obj.clone();
		var matclone;
		if(material){
		
			cmode == 0 ? matclone = material.clone() : matclone = material;
			obj.material = matclone; //not sure if needed // do this regardless of if property 
			
			obj.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
			
					child.material = matclone;
								
				}

			} );
		}
		
		// so this works
		
	
		obj.userData.master = true;
		this.runtime.Q3D.scene.add( obj );
		this.runtime.Q3D.idLast = obj.id;
		obj.name = name;
		
	};
	
	//alert('create from clone')
	
	Acts.prototype.MyHugeAnnoyingTest2 = function ()
	{
		return true;
	};
	
	Acts.prototype.CreateObjFromClone = function (name,id)
	{
		var idobj = this.runtime.Q3D.EpickById(id);
		if(! idobj ) return;
		
		var obj = idobj.clone();
		obj.userData.master = true;
		this.runtime.Q3D.scene.add( obj );
		this.runtime.Q3D.idLast = obj.id;
		obj.name = name;
	};
	//alert('1')
	Acts.prototype.CreateTexFromFilename = function (name,fname)
	{
		var texture = this.runtime.Q3D.loadedTextures[fname];
		if(! texture ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		this.runtime.Q3D.texture[name] = new THREE.Texture();
		this.runtime.Q3D.texture[name].image = texture;
		//this.runtime.Q3D.texture[name].format = THREE.LuminanceFormat;
		////this.runtime.Q3D.texture[name].mapping = new THREE.SphericalReflectionMapping(); DOESNT WORK :<
		this.runtime.Q3D.texture[name].needsUpdate = true; // DO YOU NEED THIS? (YES)
	};
	//alert('2')
	Acts.prototype.TexturesSetImage = function (name,fname)
	{
		var image = this.runtime.Q3D.loadedTextures[fname];
		if(! image ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL"); return; }
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		texture.image = image;
		texture.needsUpdate = true;
	};
	
	Acts.prototype.TexturesSetWrap = function (name,wrapS,wrapT)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
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
		
		texture.needsUpdate = true;
	};
	
	Acts.prototype.TexturesSetRepeat = function (name,ru,rv)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
		texture.repeat.set(ru,rv);
		
		texture.needsUpdate = true; //(i don't think this is needed) if bottleneck investigate
	};
	
	Acts.prototype.TexturesSetOffset = function (name,ru,rv)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
		texture.offset.set(ru,rv);
		
		texture.needsUpdate = true; //(i don't think this is needed)) if bottleneck investigate
	};
	
	Acts.prototype.TexturesSetFlipY = function (name,flipy)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
		flipy == 0 ? texture.flipY = false : texture.flipY = true;
		
		texture.needsUpdate = true; //(i don't think this is needed)) if bottleneck investigate
	};
	
	Acts.prototype.TexturesSetGenerateMipMaps = function (name,gen)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
		gen == 0 ? texture.generateMipmaps = false : texture.generateMipmaps = true;
		
		texture.needsUpdate = true; //(i don't think this is needed)) if bottleneck investigate
	};
	//alert('3')
	Acts.prototype.TexturesSetFiltering = function (name,mag,min)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
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
		
		texture.needsUpdate = true;
	};
	
	Acts.prototype.TexturesSetAnisotropy = function (name,aniso)
	{
		var texture = this.runtime.Q3D.texture[name];
		if(! texture) return;
		
		texture.anisotropy = aniso;
		
		texture.needsUpdate = true;
	};
	
	Acts.prototype.CreateCubeTexFromFilename = function (name,fnamePx,fnameNx,fnamePy,fnameNy,fnamePz,fnameNz,mapping)
	{
		var texture1 = this.runtime.Q3D.loadedTextures[fnamePx];
		if(! texture1 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		var texture2 = this.runtime.Q3D.loadedTextures[fnameNx];
		if(! texture2 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		var texture3 = this.runtime.Q3D.loadedTextures[fnamePy];
		if(! texture3 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		var texture4 = this.runtime.Q3D.loadedTextures[fnameNy];
		if(! texture4 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		var texture5 = this.runtime.Q3D.loadedTextures[fnamePz];
		if(! texture5 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		var texture6 = this.runtime.Q3D.loadedTextures[fnameNz];
		if(! texture6 ){ alert("THE IMAGE FILE YOU ARE TRYING TO USE HAS NOT BEEN LOADED YET (THIS TAKES SOME TIME AFTER LOAD ACTION) OR DOES NOT EXIST AT ALL, TEXTURE NOT CREATED"); return; }
		this.runtime.Q3D.texture[name] = new THREE.Texture();
		mapping == 0 ? this.runtime.Q3D.texture[name].mapping = new THREE.CubeReflectionMapping() : this.runtime.Q3D.texture[name].mapping = new THREE.CubeRefractionMapping();
		this.runtime.Q3D.texture[name].image = [texture1,texture2,texture3,texture4,texture5,texture6]; //FOR CUBE MAP SHIT
		this.runtime.Q3D.texture[name].needsUpdate = true; // DO YOU NEED THIS?
	};
	
	Acts.prototype.CubeCamera = function (name,cname,near,far,res,mapping)
	{
		
		var obj = new THREE.CubeCamera( near, far, res );

		obj.userData.master = true;
		this.runtime.Q3D.scene.add(obj);
		this.runtime.Q3D.idLast = obj.id;
		obj.name = cname;
		
		this.runtime.Q3D.texture[name] = obj.renderTarget; //new THREE.Texture();
		mapping == 0 ? this.runtime.Q3D.texture[name].mapping = new THREE.CubeReflectionMapping() : this.runtime.Q3D.texture[name].mapping = new THREE.CubeRefractionMapping();
		//this.runtime.Q3D.texture[name].image = [texture1,texture2,texture3,texture4,texture5,texture6]; //FOR CUBE MAP SHIT
		this.runtime.Q3D.texture[name].needsUpdate = true; // DO YOU NEED THIS?
	};

	Acts.prototype.CubeCameraUpdate = function (id,scn)
	{
		
		var obj = this.runtime.Q3D.EpickById(id);
		if(! obj) return;
		if(! obj.hasOwnProperty('renderTarget')) return;
		this.runtime.Q3D.renderer.autoClear;
		this.runtime.Q3D.renderer.setClearColor( this.runtime.Q3D.sceneDic[scn][1] , this.runtime.Q3D.sceneDic[scn][2] );
		obj.updateCubeMap(this.runtime.Q3D.renderer, this.runtime.Q3D.sceneDic[scn][0]);
		//obj.renderTarget.needsUpdate = true;
	
	};	
	
	// renders scene using renderer (unneeded?)
	Acts.prototype.Render = function ()
	{
		
		this.Draw3D();
		
	};
	
		// sets the resolution of the rendering area/canvas
	Acts.prototype.SetResXY = function (x,y)
	{
		if(this.runtime.Q3D.canvas.width!==Math.abs(x)&&this.runtime.Q3D.canvas.height!==Math.abs(y)&&this.runtime.Q3D.RESmode === 1)  // doing this isn't working???
		{

			this.runtime.Q3D.renderer.setSize( Math.abs(x), Math.abs(y) );
			this.changedRes = true;

		};
		
	};
	
	Acts.prototype.MaterialsUpdateAll = function ()
	{
	this.runtime.Q3D.UpdateAllMaterials()
	};
	
	Acts.prototype.SetFog = function (type,color,near,far,density)
	{
	//this.runtime.Q3D.UpdateAllMaterials()
	
	var flag = true;
	
		switch(type)
		{
		case 0:
			
			if (! this.runtime.Q3D.scene.fog ) flag = false; // this is so that we know the materials do not need updates because of this junk
			else this.runtime.Q3D.scene.fog = null;
			
			//this.runtime.Q3D.renderer.initWebGLObjects( this.runtime.Q3D.scene );
			
			break;
		case 1:
			
			if ( this.runtime.Q3D.scene.fog instanceof THREE.Fog ) flag = false;
			else this.runtime.Q3D.scene.fog = new THREE.Fog;
			this.runtime.Q3D.scene.fog.color.setHexR(color);
			this.runtime.Q3D.scene.fog.near = near;
			this.runtime.Q3D.scene.fog.far = far;
			
			break;
		case 2:
		
			if ( this.runtime.Q3D.scene.fog instanceof THREE.FogExp2 ) flag = false;
			else this.runtime.Q3D.scene.fog = new THREE.FogExp2;
			this.runtime.Q3D.scene.fog.color.setHexR(color);
			this.runtime.Q3D.scene.fog.density = density;
			
			break;
		}
		
	if(flag) this.runtime.Q3D.UpdateAllMaterials(); //if the fog type has changed, update all materials so fog change shows
		
	};
	
	Acts.prototype.SetClearColor = function (color,alpha)
	{
	
	this.runtime.Q3D.sceneDic[this.runtime.Q3D.sceneName][1] = color;
	this.runtime.Q3D.sceneDic[this.runtime.Q3D.sceneName][2] = alpha;
	
	};
	
	Acts.prototype.SetAntialias = function (yes)
	{
	
	yes == 0 ? this.runtime.Q3D.rendererSettings.AntiAlias = false : this.runtime.Q3D.rendererSettings.AntiAlias = true;
	
	this.runtime.Q3D.InitializeRenderer(this);
	
	};
	
	Acts.prototype.SetShadowType = function (type)
	{

		switch(type)
		{
		case 0:
			
			this.runtime.Q3D.renderer.shadowMapType = THREE.BasicShadowMap;
			
			break;
		case 1:
			
			this.runtime.Q3D.renderer.shadowMapType = THREE.PCFShadowMap;
		
			break;
		case 2:
		
			this.runtime.Q3D.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		
			break;
		}
		
		//cascade == 0 ? this.runtime.Q3D.renderer.shadowMapCascade == false : this.runtime.Q3D.renderer.shadowMapCascade == true ;
		
		this.runtime.Q3D.UpdateAllMaterials();
	};
	
	Acts.prototype.SetShadowMaps = function (on)
	{
	
	on == 0 ? this.runtime.Q3D.rendererSettings.shadowMap = false : this.runtime.Q3D.rendererSettings.shadowMap = true;
	
	this.runtime.Q3D.renderer.shadowMapEnabled = this.runtime.Q3D.rendererSettings.shadowMap;
	
	this.runtime.Q3D.UpdateAllMaterials();
	
	};
	
	Acts.prototype.SetAutoupdateShadows = function (yes)
	{
	
	yes == 0 ? this.runtime.Q3D.renderer.shadowMapAutoUpdate = false : this.runtime.Q3D.renderer.shadowMapAutoUpdate = true;
	
	};
	
	Acts.prototype.SetUpdateShadows = function (yes)
	{
	
	this.runtime.Q3D.renderer.updateShadowMap( this.runtime.Q3D.scene, this.runtime.Q3D.camera );
	
	};
	
	
			// CAMERA STUFF
	Acts.prototype.SetCamPerspective = function ()
	{

	this.runtime.Q3D.camera.toPerspective();
		
	};
	
	Acts.prototype.SetCamOrthographic = function ()
	{

	this.runtime.Q3D.camera.toOrthographic();
	
	//alert(this.runtime.Q3D.camera.fov)
		
	};
	
	Acts.prototype.SetCamFrustum = function (ttfov,ttwidth,ttheight,ttnear,ttfar)
	{
	
	this.runtime.Q3D.camera.near = ttnear;
	this.runtime.Q3D.camera.far = ttfar;
	this.runtime.Q3D.camera.width = ttwidth;
	this.runtime.Q3D.camera.height = ttheight;
	this.runtime.Q3D.camera.aspect = ttwidth/ttheight;
	this.runtime.Q3D.camera.fov = ttfov;
	
	this.runtime.Q3D.camera.cameraP.near= ttnear;
	this.runtime.Q3D.camera.cameraP.far= ttfar;
	this.runtime.Q3D.camera.cameraP.fov= ttfov;
	this.runtime.Q3D.camera.cameraP.aspect= ttwidth/ttheight;
	this.runtime.Q3D.camera.cameraO.near= ttnear;
	this.runtime.Q3D.camera.cameraO.far= ttfar;	
	this.runtime.Q3D.camera.cameraO.left= ttwidth/(-2);	
	this.runtime.Q3D.camera.cameraO.right= ttwidth/(2);	
	this.runtime.Q3D.camera.cameraO.top= ttheight/(2);	
	this.runtime.Q3D.camera.cameraO.bottom= ttheight/(-2);	

	this.runtime.Q3D.camera.cameraP.updateProjectionMatrix();
	this.runtime.Q3D.camera.cameraO.updateProjectionMatrix();
	
	};
	
		Acts.prototype.SetCamPosition = function (camx,camy,camz)
	{
	
	this.runtime.Q3D.camera.position.x = camx;
	this.runtime.Q3D.camera.position.y = camy;	
	this.runtime.Q3D.camera.position.z = camz;
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	
	Acts.prototype.SetCamUp = function (camx,camy,camz)   // DOES THIS DO ANYTHING (?) take from Stackoverflow thing, might be bunk, yo.
	{
	
	this.runtime.Q3D.camera.up = new THREE.Vector3(camx,camy,camz);
	
	//alert(Acts.prototype.GeomCreateCube)
	
	};

	Acts.prototype.SetCamLook = function (camx,camy,camz)
	{
	
	this.runtime.Q3D.camera.lookAt(new THREE.Vector3(camx,camy,camz));
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	
	/////////// geometry
	instanceProto.geomCreateDo = function(name){
		
		if(this.runtime.Q3D.geomCallbacks[name]){
			this.runtime.Q3D.geomCallbacks[name]();
			delete this.runtime.Q3D.geomCallbacks[name];
		};
		
	};
	
	Acts.prototype.GeomCreateCube = function (name,width,height,depth,widthsegs,heightsegs,depthsegs)
	{
	//steastsat
	
	this.runtime.Q3D.geometry[name] = new THREE.BoxGeometry(width, height, depth, widthsegs, heightsegs, depthsegs);
	this.geomCreateDo(name);
	
	};
	//alert('4')
	Acts.prototype.GeomCreateCircle = function (name,radius,segs,start,arc)
	{
	this.runtime.Q3D.geometry[name] = new THREE.CircleGeometry(radius, segs, start*(THREE.Deg2Rad), arc*(THREE.Deg2Rad));
	this.geomCreateDo(name);
	};
	
	Acts.prototype.GeomCreateCylinder = function (name,radiusTop,radiusBottom,height,rsegs,hsegs,ends)
	{
	
	ends == 1 ? 
	this.runtime.Q3D.geometry[name] = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, rsegs, hsegs, true):
	this.runtime.Q3D.geometry[name] = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, rsegs, hsegs, false);
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateIcosa = function (name,radius,detail)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.IcosahedronGeometry(radius, detail);
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateOcta = function (name,radius,detail)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.OctahedronGeometry(radius, detail);
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateTetra = function (name,radius,detail)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.TetrahedronGeometry(radius, detail);
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreatePlane = function (name,width,height,wsegs,hsegs)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.PlaneGeometry(width,height,wsegs,hsegs);
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateRing = function (name,irad,orad,tseg,pseg,start,arc)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.RingGeometry(irad, orad, tseg,pseg, start*(THREE.Deg2Rad), arc*(THREE.Deg2Rad));
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateSphere = function (name,radius,widthseg,heightseg,pstart,parc,tstart, tend)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.SphereGeometry(radius,widthseg,heightseg,pstart*(THREE.Deg2Rad),parc*(THREE.Deg2Rad),tstart*(THREE.Deg2Rad), tend*(THREE.Deg2Rad));
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.GeomCreateTorus = function (name,radius, tube, radialSegments, tubularSegments, arc)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc*(THREE.Deg2Rad));
	this.geomCreateDo(name);	
	
	};
	
	Acts.prototype.GeomCreateKnot = function (name, radius, tube, radialSegments, tubularSegments, p, q, heightScale)
	{
	
	this.runtime.Q3D.geometry[name] = new THREE.TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q, heightScale)
	this.geomCreateDo(name);
	
	};
	
	Acts.prototype.FontInclude = function (fontURL)
	{
	
	var my_awesome_script = document.createElement('script');   // http://stackoverflow.com/questions/13121948/dynamically-add-script-tag-with-src-that-may-include-document-write

	my_awesome_script.setAttribute("src", fontURL );

	document.head.appendChild(my_awesome_script);
	
	};
	
	Acts.prototype.GeomCreateText = function (name,text,size,height,curveSegments,font,style,bevel,bevelthick,bevelsize)
	{
	
	var param ={};
	
	param.size = size;
	param.height = height;
	param.curveSegments = curveSegments;
	param.font = "Helvetiker";//font;
	param.bevelThickness = bevelthick;
	param.bevelSize = bevelsize;
	
	if(style == 0) { param.style = "normal"; param.weight = "normal"; };
	if(style == 1) { param.style = "italics"; param.weight = "normal"; };
	if(style == 2) { param.style = "normal"; param.weight = "Bold"; };
	if(style == 3) { param.style = "italics"; param.weight = "Bold"; };
	
	bevel == 0 ? param.bevelEnabled = false : param.bevelEnabled = true;
	
		
	this.runtime.Q3D.geometry[name] = new THREE.TextGeometry( text , param);
		
	};
	
	//// JSON LOADER TEST PROGRAM http://code.tutsplus.com/tutorials/webgl-with-threejs-models-and-animation--net-35993
	//http://threejs.org/examples/webgl_loader_obj_mtl.html
	
	////////// Materials
	//alert('5')
	Acts.prototype.MaterialsCreateMeshBasic = function (name,Dcolor,wireframe,shade,Dmap,Lmap,Smap,Emap,comb,reflec,refrac)
	{
	
		this.runtime.Q3D.material[name] = new THREE.MeshBasicMaterial();
		this.runtime.Q3D.material[name].color.setHexR(Dcolor);
		this.runtime.Q3D.material[name].reflectivity = reflec;
		this.runtime.Q3D.material[name].refractionRatio = refrac;
		wireframe == 0 ? this.runtime.Q3D.material[name].wireframe = false : this.runtime.Q3D.material[name].wireframe = true;
		//fog == 0 ? this.runtime.Q3D.material[name].fog = false : this.runtime.Q3D.material[name].fog = true;
		//skin == 0 ? this.runtime.Q3D.material[name].skinning = false : this.runtime.Q3D.material[name].skinning = true;
		//morph == 0 ? this.runtime.Q3D.material[name].morphTargets = false : this.runtime.Q3D.material[name].morphTargets = true;
		this.runtime.Q3D.material[name].map = this.runtime.Q3D.texture[Dmap];
		this.runtime.Q3D.material[name].envMap = this.runtime.Q3D.texture[Emap];
		this.runtime.Q3D.material[name].specularMap = this.runtime.Q3D.texture[Smap];
		this.runtime.Q3D.material[name].lightMap = this.runtime.Q3D.texture[Lmap]; 
		
		switch(shade)
		{
		case 0:
			this.runtime.Q3D.material[name].shading = THREE.SmoothShading;
			break;
		case 1:
			this.runtime.Q3D.material[name].shading = THREE.FlatShading;
			break;
		case 2:
			this.runtime.Q3D.material[name].shading = THREE.NoShading;
			break;
		}
		
		/*switch(vcolor)
		{
		case 0:
			this.runtime.Q3D.material[name].vertexColors = THREE.NoColors;
			break;
		case 1:
			this.runtime.Q3D.material[name].vertexColors = THREE.VertexColors;
			break;
		case 2:
			this.runtime.Q3D.material[name].vertexColors = THREE.FaceColors;
			break;
		}*/
		
		switch(comb)
		{
		case 0:
			this.runtime.Q3D.material[name].combine = THREE.Multiply;
			break;
		case 1:
			this.runtime.Q3D.material[name].combine =  THREE.MixOperation;
			break;
		case 2:
			this.runtime.Q3D.material[name].combine = THREE.AddOperation;
			break;
		}
	

	};
	//alert('end of basic')
	Acts.prototype.MaterialsCreateMeshDepth = function (name,wireframe)
	{
		this.runtime.Q3D.material[name] = new THREE.MeshDepthMaterial();
		wireframe == 0 ? this.runtime.Q3D.material[name].wireframe = false : this.runtime.Q3D.material[name].wireframe = true;
		//fog == 0 ? this.runtime.Q3D.material[name].fog = false : this.runtime.Q3D.material[name].fog = true;
		//skin == 0 ? this.runtime.Q3D.material[name].skinning = false : this.runtime.Q3D.material[name].skinning = true;
		//morph == 0 ? this.runtime.Q3D.material[name].morphTargets = false : this.runtime.Q3D.material[name].morphTargets = true;
		
	};
	//alert('depth')
	Acts.prototype.MaterialsCreateMeshNormal = function (name,wireframe,shade)
	{
	
		this.runtime.Q3D.material[name] = new THREE.MeshNormalMaterial();
		wireframe == 0 ? this.runtime.Q3D.material[name].wireframe = false : this.runtime.Q3D.material[name].wireframe = true;
		//morph == 0 ? this.runtime.Q3D.material[name].morphTargets = false : this.runtime.Q3D.material[name].morphTargets = true;
		
		switch(shade)
		{
		case 0:
			this.runtime.Q3D.material[name].shading = THREE.SmoothShading;
			break;
		case 1:
			this.runtime.Q3D.material[name].shading = THREE.FlatShading;
			break;
		case 2:
			this.runtime.Q3D.material[name].shading = THREE.NoShading;
			break;
		}
		
	};
	
	Acts.prototype.MaterialsCreateMeshLambert = function (name,Dcolor,Acolor,Ecolor,wireframe,shade,Dmap,Lmap,Smap,Emap,comb,reflec,refrac)
	{
	
		this.runtime.Q3D.material[name] = new THREE.MeshLambertMaterial();
		this.runtime.Q3D.material[name].color.setHexR(Dcolor);
		this.runtime.Q3D.material[name].ambient.setHexR(Acolor);
		this.runtime.Q3D.material[name].emissive.setHexR(Ecolor);
		this.runtime.Q3D.material[name].reflectivity = reflec;
		this.runtime.Q3D.material[name].refractionRatio = refrac;
		wireframe == 0 ? this.runtime.Q3D.material[name].wireframe = false : this.runtime.Q3D.material[name].wireframe = true;
		//fog == 0 ? this.runtime.Q3D.material[name].fog = false : this.runtime.Q3D.material[name].fog = true;
		//skin == 0 ? this.runtime.Q3D.material[name].skinning = false : this.runtime.Q3D.material[name].skinning = true;
		//morph == 0 ? this.runtime.Q3D.material[name].morphTargets = false : this.runtime.Q3D.material[name].morphTargets = true;
		//morphN == 0 ? this.runtime.Q3D.material[name].morphNormals = false : this.runtime.Q3D.material[name].morphNormals = true;
		//wrapA == 0 ? this.runtime.Q3D.material[name].wrapAround = false : this.runtime.Q3D.material[name].wrapAround = true;
		this.runtime.Q3D.material[name].map = this.runtime.Q3D.texture[Dmap];
		this.runtime.Q3D.material[name].envMap = this.runtime.Q3D.texture[Emap];
		this.runtime.Q3D.material[name].specularMap = this.runtime.Q3D.texture[Smap];
		this.runtime.Q3D.material[name].lightMap = this.runtime.Q3D.texture[Lmap]; 
		
		//this.runtime.Q3D.material[name].wrapRGB.set(RGBx,RGBy,RGBz);
		
		switch(shade)
		{
		case 0:
			this.runtime.Q3D.material[name].shading = THREE.SmoothShading;
			break;
		case 1:
			this.runtime.Q3D.material[name].shading = THREE.FlatShading;
			break;
		case 2:
			this.runtime.Q3D.material[name].shading = THREE.NoShading;
			break;
		}
		
		/*switch(vcolor)
		{
		case 0:
			this.runtime.Q3D.material[name].vertexColors = THREE.NoColors;
			break;
		case 1:
			this.runtime.Q3D.material[name].vertexColors = THREE.VertexColors;
			break;
		case 2:
			this.runtime.Q3D.material[name].vertexColors = THREE.FaceColors;
			break;
		}*/
		
		switch(comb)
		{
		case 0:
			this.runtime.Q3D.material[name].combine = THREE.Multiply;
			break;
		case 1:
			this.runtime.Q3D.material[name].combine =  THREE.MixOperation;
			break;
		case 2:
			this.runtime.Q3D.material[name].combine = THREE.AddOperation;
			break;
		}
	

	};
	
	Acts.prototype.MaterialsCreateMeshPhong = function (name,Dcolor,Acolor,Ecolor,Scolor,shiny,wireframe,shade,Dmap,Lmap,Smap,Emap,comb,reflec,refrac,metal)
	{
	
		this.runtime.Q3D.material[name] = new THREE.MeshPhongMaterial();
		this.runtime.Q3D.material[name].color.setHexR(Dcolor);
		this.runtime.Q3D.material[name].ambient.setHexR(Acolor);
		this.runtime.Q3D.material[name].emissive.setHexR(Ecolor);
		this.runtime.Q3D.material[name].specular.setHexR(Scolor);
		this.runtime.Q3D.material[name].shininess = shiny;
		this.runtime.Q3D.material[name].reflectivity = reflec;
		this.runtime.Q3D.material[name].refractionRatio = refrac;
		wireframe == 0 ? this.runtime.Q3D.material[name].wireframe = false : this.runtime.Q3D.material[name].wireframe = true;
		metal == 0 ? this.runtime.Q3D.material[name].metal = false : this.runtime.Q3D.material[name].metal = true;
		//fog == 0 ? this.runtime.Q3D.material[name].fog = false : this.runtime.Q3D.material[name].fog = true;
		//skin == 0 ? this.runtime.Q3D.material[name].skinning = false : this.runtime.Q3D.material[name].skinning = true;
		//morph == 0 ? this.runtime.Q3D.material[name].morphTargets = false : this.runtime.Q3D.material[name].morphTargets = true;
		//morphN == 0 ? this.runtime.Q3D.material[name].morphNormals = false : this.runtime.Q3D.material[name].morphNormals = true;
		//wrapA == 0 ? this.runtime.Q3D.material[name].wrapAround = false : this.runtime.Q3D.material[name].wrapAround = true;
		this.runtime.Q3D.material[name].map = this.runtime.Q3D.texture[Dmap];
		this.runtime.Q3D.material[name].envMap = this.runtime.Q3D.texture[Emap];
		this.runtime.Q3D.material[name].specularMap = this.runtime.Q3D.texture[Smap];
		this.runtime.Q3D.material[name].lightMap = this.runtime.Q3D.texture[Lmap];
		/*this.runtime.Q3D.material[name].bumpMap = this.runtime.Q3D.texture[Bmap];
		this.runtime.Q3D.material[name].normalMap = this.runtime.Q3D.texture[Nmap];
		this.runtime.Q3D.material[name].bumpScale = Bscale;
		this.runtime.Q3D.material[name].normalScale.set(Nscalex,Nscaley);*/
		
		
		//this.runtime.Q3D.material[name].wrapRGB.set(RGBx,RGBy,RGBz);
		
		switch(shade)
		{
		case 0:
			this.runtime.Q3D.material[name].shading = THREE.SmoothShading;
			break;
		case 1:
			this.runtime.Q3D.material[name].shading = THREE.FlatShading;
			break;
		case 2:
			this.runtime.Q3D.material[name].shading = THREE.NoShading;
			break;
		}
		
		/*switch(vcolor)
		{
		case 0:
			this.runtime.Q3D.material[name].vertexColors = THREE.NoColors;
			break;
		case 1:
			this.runtime.Q3D.material[name].vertexColors = THREE.VertexColors;
			break;
		case 2:
			this.runtime.Q3D.material[name].vertexColors = THREE.FaceColors;
			break;
		}*/
		
		switch(comb)
		{
		case 0:
			this.runtime.Q3D.material[name].combine = THREE.Multiply;
			break;
		case 1:
			this.runtime.Q3D.material[name].combine =  THREE.MixOperation;
			break;
		case 2:
			this.runtime.Q3D.material[name].combine = THREE.AddOperation;
			break;
		}
	

	};
	
	///////////////////////////// mat settings
	
	Acts.prototype.MaterialsSetMeshPhongNormalMap = function (name,Nmap)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		var tex = this.runtime.Q3D.texture[Nmap]
		if(! tex ) return;
		this.runtime.Q3D.material[name].normalMap = tex;
		
	};
	
	Acts.prototype.MaterialsSetMeshPhongBumpMap = function (name,Bmap)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		var tex = this.runtime.Q3D.texture[Bmap]
		if(! tex ) return;
		this.runtime.Q3D.material[name].bumpMap = tex;
		
	};
	
	Acts.prototype.MaterialsSetMeshPhongNormalMapScale = function (name,Nmapx,Nmapy)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		this.runtime.Q3D.material[name].normalScale.set(Nmapx,Nmapy);
		
	};
	
	Acts.prototype.MaterialsSetMeshPhongBumpMapScale = function (name,BmapS)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		this.runtime.Q3D.material[name].bumpScale = BmapS;
		
	};
	
	Acts.prototype.MaterialsSetSpecular = function (name,color)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('specular')) return;
	mat.specular.setHexR(color);

	};
	
	Acts.prototype.MaterialsSetShininess = function (name,shine)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('shininess')) return;
	mat.shininess = shine;

	};
	
	Acts.prototype.MaterialsSetMetal = function (name,metal)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('metal')) return;
	metal == 0 ? mat.metal = false : mat.metal = true;

	};
	
	Acts.prototype.MaterialsDepthSettings = function (name,dtest,dwrite)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	dtest == 0 ? mat.depthTest = false : mat.depthTest = true;
	dwrite == 0 ? mat.depthWrite = false : mat.depthWrite = true;
	
	};
	
	Acts.prototype.MaterialsPolygonOffset = function (name,poffset,factor,unit)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	poffset == 0 ? mat.polygonOffset = false : mat.polygonOffset = true;
	mat.polygonOffsetFactor = factor;
	mat.polygonOffsetUnits = unit;
	
	};
	
	
	Acts.prototype.MaterialsAlphaTest = function (name,alphatest)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	mat.alphaTest = alphatest;
	
	};
	
	Acts.prototype.MaterialsOverdraw = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	yes == 0 ? mat.overdraw = false : mat.overdraw = true;
	
	};
	
	Acts.prototype.MaterialsVisible = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	yes == 0 ? mat.visible = false : mat.visible = true;
	
	};
	
	Acts.prototype.MaterialsDrawSide = function (name,side)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	switch(side){
		case 0:
			mat.side = THREE.FrontSide;
			break;
		case 1:
			mat.side = THREE.BackSide;
			break;
		case 2:
			mat.side = THREE.DoubleSide;
			break;
		}
	};
	
	Acts.prototype.MaterialsUpdate = function (name)
	{
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	mat.needsUpdate = true;
	};
	
	Acts.prototype.MaterialsClone = function (name,source)   // deprecated, buggy for some reason (reference is being passed instead of clone?)
	{
	var mat = this.runtime.Q3D.material[source];
	if(! mat) return;
	//this.runtime.Q3D.material[name] = new THREE.Material();
	this.runtime.Q3D.material[name] = mat.clone();
	};
	
	Acts.prototype.MaterialsSetColor = function (name,color)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('color')) return;
	mat.color.setHexR(color);

	};
	
	Acts.prototype.MaterialsSetAmbient = function (name,color)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('ambient')) return;
	mat.ambient.setHexR(color);

	};

	Acts.prototype.MaterialsSetEmissive = function (name,color)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('emissive')) return;
	mat.emissive.setHexR(color);

	};

	Acts.prototype.MaterialsSetWireframe = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('wireframe')) return;
	yes == 0 ? mat.wireframe = false : mat.wireframe = true ;

	};

	Acts.prototype.MaterialsSetShading = function (name,mode)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('shading')) return;
		switch(mode)
		{
		case 0:
			mat.shading = THREE.SmoothShading;
			break;
		case 1:
			mat.shading = THREE.FlatShading;
			break;
		case 2:
			mat.shading = THREE.NoShading;
			break;
		}

	};

	Acts.prototype.MaterialsSetFog = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('fog')) return;
	yes == 0 ? mat.fog = false : mat.fog = true ;

	};
	
	Acts.prototype.MaterialsSetVertexColors = function (name,mode)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('vertexColors')) return;
		switch(mode)
		{
		case 0:
			mat.vertexColors = THREE.NoColors;
			break;
		case 1:
			mat.vertexColors =  THREE.VertexColors;
			break;
		case 2:
			mat.vertexColors = THREE.FaceColors;
			break;
		}

	};

	Acts.prototype.MaterialsSetMaps = function (name,map,texture)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	var tex = this.runtime.Q3D.texture[texture];
	if(! tex) tex = null;
		switch(map)
		{
		case 0:
			if(! mat.hasOwnProperty('map')) return;
			mat.map = tex;
			break;
		case 1:
			if(! mat.hasOwnProperty('specularMap')) return;
			mat.specularMap = tex;
			break;
		case 2:
			if(! mat.hasOwnProperty('envMap')) return;
			mat.envMap = tex;
			break;
		case 3:
			if(! mat.hasOwnProperty('lightMap')) return;
			mat.lightMap = tex;
			break;
		}

	};
	
	Acts.prototype.MaterialsEnvSettings = function (name,comb,amount,ratio)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('combine')) return;
		switch(comb)
		{
		case 0:
			mat.combine = THREE.Multiply;
			break;
		case 1:
			mat.combine =  THREE.MixOperation;
			break;
		case 2:
			mat.combine = THREE.AddOperation;
			break;
		}
	mat.reflectivity = amount;
	mat.refractionRatio = ratio;

	};
	
	Acts.prototype.MaterialsSetSkinning = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('skinning')) return;
	yes == 0 ? mat.skinning = false : mat.skinning = true ;

	};
	
	Acts.prototype.MaterialsSetMorphTargets = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('morphTargets')) return;
	yes == 0 ? mat.morphTargets = false : mat.morphTargets = true ;

	};

	Acts.prototype.MaterialsSetMorphNormals = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('morphNormals')) return;
	yes == 0 ? mat.morphNormals = false : mat.morphNormals = true ;

	};
	
	Acts.prototype.MaterialsSetWrapAround = function (name,yes)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('wrapAround')) return;
	yes == 0 ? mat.wrapAround = false : mat.wrapAround = true ;

	};
	
	Acts.prototype.MaterialsSetWrapRGB = function (name,R,G,B)
	{
	
	var mat = this.runtime.Q3D.material[name];
	if(! mat) return;
	if(! mat.hasOwnProperty('wrapRGB')) return;
	mat.wrapRGB.set(R,G,B);

	};
	
	Acts.prototype.MaterialsObjReference = function (name,id)
	{
		var obj = this.runtime.Q3D.EpickById(id);
		if(! obj ) return;
		if(obj.hasOwnProperty('material')) this.runtime.Q3D.material[name] = obj.material;
	};
	
	Acts.prototype.MaterialsSetOpacity = function (name,Trans,Opacity)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		Trans == 0 ? mat.transparent = false : mat.transparent = true;
		mat.opacity = Opacity;
		
	};
	
	Acts.prototype.MaterialsSetBlending = function (name,blend,source,dest,eqn)
	{
		var mat = this.runtime.Q3D.material[name];
		if(! mat ) return;
		switch(blend)
		{
		case 0:
			mat.blending = THREE.NoBlending;
			break;
		case 1:
			mat.blending =  THREE.NormalBlending;
			break;
		case 2:
			mat.blending = THREE.AdditiveBlending;
			break;
		case 3:
			mat.blending = THREE.SubtractiveBlending;
			break;
		case 4:
			mat.blending = THREE.MultiplyBlending;
			break;
		case 5:
			mat.blending = THREE.CustomBlending;
			switch(source)
			{
			case 0:
				mat.blendSrc = THREE.SrcAlphaFactor;
				break;
			case 1:
				mat.blendSrc = THREE.OneMinusSrcAlphaFactor;
				break;
			case 2:
				mat.blendSrc = THREE.DstAlphaFactor;
				break;
			case 3:
				mat.blendSrc = THREE.OneMinusDstAlphaFactor;
				break;
			case 4:
				mat.blendSrc = THREE.ZeroFactor;
				break;
			case 5:
				mat.blendSrc = THREE.OneFactor;
				break;
			case 6:
				mat.blendSrc = THREE.DstColorFactor;
				break;
			case 7:
				mat.blendSrc = THREE.OneMinusDstColorFactor;
				break;
			case 8:
				mat.blendSrc = THREE.SrcAlphaSaturateFactor;
				break;
			}
			
			switch(dest)
			{
			case 0:
				mat.blendDst = THREE.SrcAlphaFactor;
				break;
			case 1:
				mat.blendDst = THREE.OneMinusSrcAlphaFactor;
				break;
			case 2:
				mat.blendDst = THREE.DstAlphaFactor;
				break;
			case 3:
				mat.blendDst = THREE.OneMinusDstAlphaFactor;
				break;
			case 4:
				mat.blendDst = THREE.ZeroFactor;
				break;
			case 5:
				mat.blendDst = THREE.OneFactor;
				break;
			case 6:
				mat.blendDst = THREE.SrcColorFactor;
				break;
			case 7:
				mat.blendDst = THREE.OneMinusSrcColorFactor;
				break;
			}
			
			switch(eqn)
			{
			case 0:
				mat.blendEquation = THREE.AddEquation;
				break;
			case 1:
				mat.blendEquation = THREE.SubtractEquation;
				break;
			case 2:
				mat.blendEquation = THREE.ReverseSubtractEquation;
				break;
			}
			
			break;
		}
		
	};
	
	////////// sprites
	
	Acts.prototype.SpriteCreate = function (name,mat,cmode)
	{
	
	var obj;
	cmode == 0 ? obj = new THREE.Sprite(this.runtime.Q3D.material[mat].clone()) :  obj =  new THREE.Sprite(this.runtime.Q3D.material[mat]) ;
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;
	
	};
	
	Acts.prototype.SpriteMaterial = function (name,Dmap,Dcolor,rot)
	{
	
		this.runtime.Q3D.material[name] = new THREE.SpriteMaterial();
		this.runtime.Q3D.material[name].fog = true;
		this.runtime.Q3D.material[name].color.setHexR(Dcolor);
		//this.runtime.Q3D.material[name].uvScale.set(Uscale,Vscale);
		//this.runtime.Q3D.material[name].uvOffset.set(Uoffs,Voffs);
		//this.runtime.Q3D.material[name].alignment.set(alignX,alignY);
		this.runtime.Q3D.material[name].rotation = rot*(THREE.Deg2Rad);
		/*satt == 0 ? this.runtime.Q3D.material[name].sizeAttenuation = false : this.runtime.Q3D.material[name].sizeAttenuation = true;
		scoor == 0 ? this.runtime.Q3D.material[name].useScreenCoordinates = false : this.runtime.Q3D.material[name].useScreenCoordinates = true;
		SbV == 0 ? this.runtime.Q3D.material[name].scaleByViewport = false : this.runtime.Q3D.material[name].scaleByViewport = true;*/
		this.runtime.Q3D.material[name].map = this.runtime.Q3D.texture[Dmap];
		
	};
	
	//////////// helpers
	
	Acts.prototype.ObjHelperCreateArrow = function (name,len,col,hlen,hwid)
	{
	
	var obj = new THREE.ArrowHelper( new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), len, col ,hlen,hwid);
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;
	
	};
	
	Acts.prototype.ObjHelperCreateAxis = function (name,size)
	{
	
	var obj = new THREE.AxisHelper( size );
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;
	
	};
	
	Acts.prototype.ObjHelperCreateGrid = function (name,size,step,col1,col2)
	{
	
	var obj = new THREE.GridHelper( size, step );
	obj.setColors(col1, col2);
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;
	
	};

	Acts.prototype.ObjHelperCreateBox = function (name,id,col)
	{
	var idobj = this.runtime.Q3D.EpickById(id);
	if(! idobj ) return;
	var obj = new THREE.BoundingBoxHelper(idobj, col);
	obj.update();
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;
	
	};
	
	Acts.prototype.ObjHelperUpdateBox = function (id)
	{
	var obj = this.runtime.Q3D.EpickById(id);
	if(! obj ) return;
	if(obj instanceof THREE.BoundingBoxHelper ) obj.update();
	};
		
	////////// objects 
	Acts.prototype.ObjCreate = function (name,geom,mat,cmode)
	{
	var obj;
	var geometry = this.runtime.Q3D.geometry[geom].clone();
	
	if(! geometry) return;
	var material = this.runtime.Q3D.material[mat];
	if( material ){ 
	cmode == 0 ? obj = new THREE.Mesh(geometry, material.clone()) : obj = new THREE.Mesh(geometry, material);
	}
	else obj = new THREE.Mesh(geometry);
	obj.name = name;
	obj.userData.master = true;
	this.runtime.Q3D.scene.add(obj);
	this.runtime.Q3D.idLast = obj.id;

	
	};
	
	Acts.prototype.ObjSetPos = function (name,xpos,ypos,zpos)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.position.x = xpos;
	obj.position.y = ypos;
	obj.position.z= zpos;

	};
	
	Acts.prototype.ObjSetScale = function (name,x,y,z)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.scale.x = x;
	obj.scale.y = y;
	obj.scale.z= z;

	};
	
	Acts.prototype.ObjSetRot = function (name,order,xrot,yrot,zrot)
	{
	
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.rotation.order= order;
	obj.rotation.x = xrot*(THREE.Deg2Rad);
	obj.rotation.y = yrot*(THREE.Deg2Rad);
	obj.rotation.z= zrot*(THREE.Deg2Rad);

	};
	
	Acts.prototype.CamSetRot = function (order,xrot,yrot,zrot)
	{
	
	var obj = this.runtime.Q3D.camera;

	obj.rotation.order= order;
	obj.rotation.x = xrot*(THREE.Deg2Rad);
	obj.rotation.y = yrot*(THREE.Deg2Rad);
	obj.rotation.z= zrot*(THREE.Deg2Rad);
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;

	};
	
	Acts.prototype.ObjSetRotAxisAngle = function (name,xax,yax,zax,angle)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(xax,yax,zax);
	vec.normalize();
	obj.setRotationFromAxisAngle(vec,angle*(THREE.Deg2Rad));

	};
	
	Acts.prototype.CamSetRotAxisAngle = function (xax,yax,zax,angle)
	{
	
	var obj = this.runtime.Q3D.camera;

	var vec = new THREE.Vector3(xax,yax,zax);
	vec.normalize();
	obj.setRotationFromAxisAngle(vec,angle*(THREE.Deg2Rad));
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;

	};
	
	Acts.prototype.ObjLookAt = function (name,xpos,ypos,zpos)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.lookAt(new THREE.Vector3(xpos,ypos,zpos));

	};
	
	Acts.prototype.ObjMoveAxis = function (name,vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(vecx,vecy,vecz);

	vec.normalize();
	//vec.add(obj.position);  // (doesn't work properly without this), cause it gets converted weirdly  (if object is at the "vector" position it converts to 0)
	//obj.worldToLocal(vec); 
	//obj.translateOnAxis(vec, amount);
	
	obj.position.x+=vec.x*amount;
	obj.position.y+=vec.y*amount;
	obj.position.z+=vec.z*amount;
	
	};
	
	Acts.prototype.CamMoveAxis = function (vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.camera;

	var vec = new THREE.Vector3(vecx,vecy,vecz);

	vec.normalize();
	//vec.add(obj.position);  // (doesn't work properly without this), cause it gets converted weirdly  (if object is at the "vector" position it converts to 0)
	//obj.worldToLocal(vec); 
	//obj.translateOnAxis(vec, amount);
	
	obj.position.x+=vec.x*amount;
	obj.position.y+=vec.y*amount;
	obj.position.z+=vec.z*amount;
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	
	Acts.prototype.CamMoveAxisLocal = function (vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.camera;
	var vec = new THREE.Vector3(vecx,vecy,vecz);

	vec.normalize();
	obj.translateOnAxis(vec, amount);
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	
	Acts.prototype.ObjRotAxis = function (name,vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(vecx,vecy,vecz);
	vec.normalize();
	vec.add(obj.position); // (doesn't work properly without this), cause it gets converted weirdly   (if object is at the "vector" position it converts to 0)
	obj.worldToLocal(vec);
	obj.rotateOnAxis(vec, amount*(THREE.Deg2Rad));
	
	};
	
	Acts.prototype.CamRotAxis = function (vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.camera;
	this.runtime.Q3D.camera.updateMatrixWorld();
	var vec = new THREE.Vector3(vecx,vecy,vecz);
	vec.add(obj.position); // (doesn't work properly without this), cause it gets converted weirdly   (if object is at the "vector" position it converts to 0)
	obj.worldToLocal(vec);
	vec.normalize();
	obj.rotateOnAxis(vec, amount*(THREE.Deg2Rad));
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	///////////////// same but local
		Acts.prototype.ObjMoveAxisLocal = function (name,vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(vecx,vecy,vecz);

	vec.normalize();
	obj.translateOnAxis(vec, amount);
	
	};
	
	Acts.prototype.ObjRotAxisLocal = function (name,vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(vecx,vecy,vecz);
	vec.normalize();
	obj.rotateOnAxis(vec, amount*(THREE.Deg2Rad));
	
	};
	
	Acts.prototype.CamRotAxisLocal = function (vecx,vecy,vecz,amount)
	{
	
	var obj = this.runtime.Q3D.camera;

	var vec = new THREE.Vector3(vecx,vecy,vecz);
	vec.normalize();
	obj.rotateOnAxis(vec, amount*(THREE.Deg2Rad));
	this.runtime.Q3D.camera.matrixWorldNeedsUpdate = true;
	
	};
	
	//////////////////////////////// set object properties
	Acts.prototype.ObjSetUpVec = function (name,vecx,vecy,vecz)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	var vec = new THREE.Vector3(vecx,vecy,vecz);
	vec.normalize();
	obj.up = vec;
	
	};
	
	Acts.prototype.ObjSetOverrideDepth = function (name,depth)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.renderDepth = depth;

	};
	
	Acts.prototype.ObjSetUseDepth = function (name)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.renderDepth = null;

	};
	
	Acts.prototype.ObjSetVisible = function (name,vis,affchild)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	var set;
	if(! obj ) return;
	vis == 0 ? set =  true : set = false ;
	
	obj.visible = set;
			
		if(affchild == 0){
			obj.traverse( function ( child ) {

					if ( child instanceof THREE.Object3D ) {

						child.visible = set;
									
					}

			} );
		};

	};
	
	Acts.prototype.ObjSetCastShadow = function (name,vis,affchild)
	{
	
		var obj = this.runtime.Q3D.EpickById(name);
		if(! obj ) return;

		var set;
		
		vis == 0 ? set =  false : set = true ;

		obj.castShadow = set;
		
		if(affchild == 0){
			obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.castShadow = set;
									
					}

			} );
		}
	};
	
	Acts.prototype.ObjSetReceiveShadow = function (name,vis,affchild)
	{
	
		var obj = this.runtime.Q3D.EpickById(name);
		if(! obj ) return;

		var set;
		
		vis == 0 ? set =  false : set = true ;

		obj.receiveShadow = set;
		
		if(affchild == 0){
			obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.receiveShadow = set;
									
					}

			} );
		}
	
	};
	
	Acts.prototype.ObjSetMaterial = function (name,material,affchild)
	{
	
		var obj = this.runtime.Q3D.EpickById(name);
		if(! obj ) return;
		var mat = this.runtime.Q3D.material[material];
		if(! mat) return;
		var matclone = mat.clone();
		if(obj.hasOwnProperty('material'))  obj.material = matclone;
		
		if(affchild == 0){
			obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						if(child.hasOwnProperty('material'))  child.material = matclone;
									
					}

			} );
		}
	
	};
	
	Acts.prototype.ObjSetFrustumCulled = function (name,vis,affchild)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	var set;
	if(! obj ) return;
	vis == 0 ? set =  true : set = false ;
	
	obj.frustumCulled = set;
	
			if(affchild == 0){
			obj.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.frustumCulled = set;
									
					}

			} );
		};

	};
	
	Acts.prototype.ObjSetMatrixAutoUpdate = function (name,vis)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	vis == 0 ? obj.matrixAutoUpdate =  true : obj.matrixAutoUpdate = false ;

	};
	
	Acts.prototype.ObjSetMatrixUpdate = function (name)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.updateMatrix();

	};
	
	Acts.prototype.ObjSetVariable = function (name,valname,val)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.userData['$'+valname] = val; //$ to prevent overwriting legitimate uses of userdata by plugin code

	};
	
	Acts.prototype.ObjSetMatrix = function (name,Xx,Xy,Xz,Xw,Yx,Yy,Yz,Yw,Zx,Zy,Zz,Zw,Wx,Wy,Wz,Ww)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.matrix = new THREE.Matrix4( Xx,Yx,Zx,Wx,Xy,Yy,Zy,Wy,Xz,Yz,Zz,Wz,Xw,Yw,Zw,Ww );
	//this.obj.matrix.set( Xx,Yx,Zx,Wx,Xy,Yy,Zy,Wy,Xz,Yz,Zz,Wz,Xw,Yw,Zw,Ww );
	obj.matrixWorldNeedsUpdate = true;
	
	};
	
		Acts.prototype.ObjSetMatrixWorldUpdate = function (name)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj ) return;
	obj.matrixWorldNeedsUpdate = true;
	
	};
	
	Acts.prototype.ObjChangeParent = function (parent,child)
	{
	
	var Pobj = this.runtime.Q3D.EpickById( parent);
	var Cobj = this.runtime.Q3D.EpickById( child );
	if(! Cobj) return;
	if(! Pobj){
		if( parent == this.runtime.Q3D.scene.id) this.runtime.Q3D.scene.add(Cobj);
		return;
	};
	//if(! Pobj || !Cobj) return;
	Pobj.add(Cobj);
	
	};
	
	Acts.prototype.ObjDelete = function (name)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	
	if ( obj instanceof THREE.Light ) this.runtime.Q3D.UpdateAllMaterials();
	
	obj.parent.remove(obj);
	
	};
	
	//////////////////////// lights
	
	Acts.prototype.AmbLightCreate = function (name,color)
	{
	
	var light = new THREE.AmbientLight( color );
	light.color.setHexR(color);
	
	light.name = name;
	light.userData.master = true;
	this.runtime.Q3D.scene.add(light);
	this.runtime.Q3D.idLast = light.id;
	
	//this.runtime.Q3D.UpdateAllMaterials(); //amb light doesn't need this

	};
	
	Acts.prototype.HemLightCreate = function (name,scolor,gcolor,intensity,Dchoice)
	{
	//THREE.TSH.color0.setHexR(scolor)
	//THREE.TSH.color1.setHexR(gcolor)
	
	var light = new THREE.HemisphereLight( scolor,gcolor,intensity);
	light.color.setHexR(scolor);
	light.groundColor.setHexR(gcolor);
	
	light.name = name;
	light.userData.master = true;
	this.runtime.Q3D.scene.add(light);
	this.runtime.Q3D.idLast = light.id;
	
	if (Dchoice == 1) {
	var pointLightHelper = new THREE.HemisphereLightHelper(light, 50, 5, 200);
	this.runtime.Q3D.scene.add( pointLightHelper );
	
	}

	this.runtime.Q3D.UpdateAllMaterials();
	
	};
	
	Acts.prototype.PLightCreate = function (name,color,intensity,distance,Dchoice)
	{
	
	var light = new THREE.PointLight( color,intensity,distance);
	light.color.setHexR(color);
	
	light.name = name;
	light.userData.master = true;
	this.runtime.Q3D.scene.add(light);
	this.runtime.Q3D.idLast = light.id;
	
	if (Dchoice == 1) {
	var sphereSize;
	distance == 0 ? sphereSize = 1 : sphereSize = distance;
	var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
	this.runtime.Q3D.scene.add( pointLightHelper );
	};
	
	this.runtime.Q3D.UpdateAllMaterials();
	
	};
	
	Acts.prototype.DirLightCreate = function (name,color,intensity,Tx,Ty,Tz,Cchoice,Schoice,near,far,left,right,top,bottom,Dchoice,dark,bias,Mw,Mh)
	{
	
	var light = new THREE.DirectionalLight( color, intensity );
	light.color.setHexR(color);
	light.name = name;
	//alert(	light.castShadow );
	Cchoice == 1 ? light.castShadow = true :  light.castShadow = false;
	Schoice == 1 ? light.onlyShadow = true : light.onlyShadow = false;
	light.target.position.set(Tx,Ty,Tz);
	light.target.updateMatrixWorld();
	light.shadowCameraNear = near;
	light.shadowCameraFar = far;
	light.shadowCameraLeft = left;
	light.shadowCameraRight = right;
	light.shadowCameraTop = top;
	light.shadowCameraBottom = bottom;
	Dchoice == 1 ? light.shadowCameraVisible = true : light.shadowCameraVisible = false;
	//alert(	light.shadowCameraVisible )
	light.shadowBias = bias;
	light.shadowDarkness = dark;
	light.shadowMapWidth = Mw;
	light.shadowMapHeight = Mh;
	
	light.userData.master = true;
		this.runtime.Q3D.scene.add(light);
			this.runtime.Q3D.idLast = light.id;
	
	this.runtime.Q3D.UpdateAllMaterials();
	
	};
	
	Acts.prototype.SLightCreate = function (name,color,intensity,distance,angle,exponent,Tx,Ty,Tz,Cchoice,Schoice,near,far,fov,Dchoice,dark,bias,Mw,Mh)
	{
	
	var light = new THREE.SpotLight( color, intensity,distance,angle*(THREE.Deg2Rad),exponent );
	light.color.setHexR(color);
	light.name = name;
	//alert(	light.castShadow );
	Cchoice == 1 ? light.castShadow = true :  light.castShadow = false;
	light.target.position.set(Tx,Ty,Tz);
	light.target.updateMatrixWorld();
	Schoice == 1 ? light.onlyShadow = true : light.onlyShadow = false;
	light.shadowCameraNear = near;
	light.shadowCameraFar = far;
	light.shadowCameraFov = fov;
	Dchoice == 1 ? light.shadowCameraVisible = true : light.shadowCameraVisible = false;
	//alert(	light.shadowCameraVisible )
	light.shadowBias = bias;
	light.shadowDarkness = dark;
	light.shadowMapWidth = Mw;
	light.shadowMapHeight = Mh;
	
	light.userData.master = true;
		this.runtime.Q3D.scene.add(light);
			this.runtime.Q3D.idLast = light.id;
	
	this.runtime.Q3D.UpdateAllMaterials();
	
	};
	//////// change light properties
	
	Acts.prototype.LightSetColor = function (name,color)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('color')) return;
	obj.color.setHexR(color);

	};
	
	Acts.prototype.LightSetIntensity = function (name,intensity)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('intensity')) return;
	obj.intensity = intensity;

	};
	
	Acts.prototype.LightSetDistance = function (name,distance)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('distance')) return;
	obj.distance = distance;

	};
	
	Acts.prototype.LightSetTarget = function (name,Tx,Ty,Tz)
	{

	var obj = this.runtime.Q3D.EpickById(name);
	
	if(! obj) return;

	if(! obj.hasOwnProperty('target')) return;
			//alert("test");

	obj.target.position.set(Tx,Ty,Tz);
	obj.target.updateMatrixWorld();

	};
	
	Acts.prototype.LightSetShadow = function (name,Cchoice)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('castShadow')) return;
	//Cchoice == 1 ? obj.castShadow = true :  obj.castShadow = false;
	if(Cchoice == 1){
	if(!obj.castShadow){obj.castShadow = true;this.runtime.Q3D.UpdateAllMaterials();};
	}
	else{
	if(obj.castShadow){obj.castShadow = false;this.runtime.Q3D.UpdateAllMaterials();};
	};

	};
	
	Acts.prototype.LightSetOnlyShadow = function (name,Schoice)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('onlyShadow')) return;
	Schoice == 1 ? obj.onlyShadow = true : obj.onlyShadow = false;

	};
	
	Acts.prototype.LightSetShadowDark = function (name,dark)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('shadowDarkness')) return;
	obj.shadowDarkness = dark;

	};
	
	Acts.prototype.LightSetShadowBias = function (name,bias)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('shadowBias')) return;
	obj.shadowBias = bias;

	};
	
	Acts.prototype.LightSetShadowMapSize = function (name,Mw,Mh)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('shadowMapWidth')) return;
	
	obj.shadowMapWidth = Mw;
	obj.shadowMapHeight = Mh;
	this.runtime.Q3D.UpdateAllMaterials(); // THIS DOESNT WORK, i don't know how to fix this crap without cloning the light, so ill just leave it up to users who need this weird functionality to create and destroy their lights.
	//this.runtime.Q3D.renderer.updateShadowMap( this.runtime.Q3D.scene, this.runtime.Q3D.camera );
	//this.runtime.Q3D.scene.remove

	};
	
	Acts.prototype.HemLightSettings = function (name,scolor,gcolor,intensity)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('groundColor')) return;
	obj.color.setHexR(scolor);
	obj.groundColor.setHexR(gcolor);
	obj.intensity = intensity;

	};
	
	Acts.prototype.SLightSettings = function  (name,color,intensity,distance,angle,exponent)
	{
	
	var obj = this.runtime.Q3D.EpickById(name);
	if(! obj) return;
	if(! obj.hasOwnProperty('shadowCameraFov')) return; //pretty certain only spotlight has this
	obj.color.setHexR(color);
	obj.intensity = intensity;
	obj.distance = distance;
	obj.angle = angle*(THREE.Deg2Rad);
	obj.exponent = exponent;

	};
	
	Acts.prototype.Snapshot = function (format_, quality_)
	{
		//if (this.video_active && this.video_ready)
		//{
			//var tmpcanvas = document.createElement("canvas");
			//tmpcanvas.width = this.v.videoWidth;
			//tmpcanvas.height = this.v.videoHeight;
			//var tmpctx = tmpcanvas.getContext("2d");
			//tmpctx.drawImage(this.v, 0, 0, this.v.videoWidth, this.v.videoHeight);
			this.Draw3D(); // need to do this or else preserveDrawingBuffer has to be true, which has a performance hit 100% of the time vs only when this action is called.
			this.snapshot_data = this.runtime.Q3D.canvas.toDataURL(format_ === 0 ? "image/png" : "image/jpeg", quality_ / 100);
		//}
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.SnapshotURL = function (ret)
	{
		ret.set_string(this.snapshot_data);
	};
	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
	};
	
		// the example expression
	Exps.prototype.objV = function (ret,objname,val)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{		
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = "undefined";
		if(obj&&(obj.userData['$'+val] !== undefined)) set = obj.userData['$'+val];
		ret.set_any(set);			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.idLast = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		 ret.set_float(this.runtime.Q3D.idLast);			// for returning floats

	};
	
	Exps.prototype.idScene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		 ret.set_float(this.runtime.Q3D.scene.id);		// for returning floats

	};
	
	Exps.prototype.idCamera = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		

		 ret.set_float(this.runtime.Q3D.camera.id);		// for returning floats

	};
	
	Exps.prototype.idPicked = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		

		 ret.set_float(this.runtime.Q3D.idPicked);		// for returning floats

	};
	
	Exps.prototype.id = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj ;
		if(this.runtime.Q3D.pickedobj&&this.runtime.Q3D.pickedobj.name === objname ){ obj = this.runtime.Q3D.pickedobj;}
		else{ 
		obj = this.runtime.Q3D.scene.getObjectByName( objname,true );
		this.runtime.Q3D.pickedobj = obj;
		};
		
		var set = -1;
		if(obj && obj.userData.master) set = obj.id;

		 ret.set_float(set);			// for returning floats

	};
	
	Exps.prototype.objName = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = "undefined";
		if(obj) set = obj.name;

		 ret.set_string(set);		// for ef_return_string

	};
	
	Exps.prototype.objX = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.position.x;
		 ret.set_float(set);			// for returning floats
	};
	Exps.prototype.objY = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.position.y;
		 ret.set_float(set);			// for returning floats
	};
	Exps.prototype.objZ = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.position.z;
		 ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.objXw = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj){ //set = obj.position.x;
		this.runtime.Q3D.Vector3 = this.runtime.Q3D.Vector3.copy(obj.position);
		this.runtime.Q3D.Vector3.setFromMatrixPosition( obj.matrixWorld );
		set = this.runtime.Q3D.Vector3.x;
		}
		 ret.set_float(set);			// for returning floats
	};
	Exps.prototype.objYw = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj){ //set = obj.position.x;
		this.runtime.Q3D.Vector3 = this.runtime.Q3D.Vector3.copy(obj.position);
		this.runtime.Q3D.Vector3.setFromMatrixPosition( obj.matrixWorld );
		set = this.runtime.Q3D.Vector3.y;
		}
		 ret.set_float(set);			// for returning floats
	};
	Exps.prototype.objZw = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj){ //set = obj.position.x;
		this.runtime.Q3D.Vector3 = this.runtime.Q3D.Vector3.copy(obj.position);
		this.runtime.Q3D.Vector3.setFromMatrixPosition( obj.matrixWorld );
		set = this.runtime.Q3D.Vector3.z;
		}
		 ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.camX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.camera.position.x);			// for returning floats
	};
	Exps.prototype.camY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.runtime.Q3D.camera.position.y);
	};
	Exps.prototype.camZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.runtime.Q3D.camera.position.z);
	};
	
	Exps.prototype.camVecX = function (ret)
	{
		this.runtime.Q3D.camera.updateMatrixWorld ();
		 ret.set_float(this.runtime.Q3D.camera.matrixWorld.elements[8]*-1);
	};
	Exps.prototype.camVecY = function (ret)
	{	
		this.runtime.Q3D.camera.updateMatrixWorld ();
		 ret.set_float(this.runtime.Q3D.camera.matrixWorld.elements[9]*-1);
	};
	Exps.prototype.camVecZ = function (ret)
	{
		this.runtime.Q3D.camera.updateMatrixWorld ();
		 ret.set_float(this.runtime.Q3D.camera.matrixWorld.elements[10]*-1);
	};
	
	Exps.prototype.camRotX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.camera.rotation.x*(THREE.Rad2Deg));			// for returning floats
	};
	Exps.prototype.camRotY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.camera.rotation.y*(THREE.Rad2Deg));			// for returning floats
	};
	
	Exps.prototype.camRotZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.camera.rotation.z*(THREE.Rad2Deg));			// for returning floats
	};
	
	Exps.prototype.camRotO = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_string(this.runtime.Q3D.camera.rotation.order);			// for returning floats
	};
	
	Exps.prototype.objRotX = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.rotation.x*(THREE.Rad2Deg);
		 ret.set_float(set);			// for returning floats
	};
	Exps.prototype.objRotY = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.rotation.y*(THREE.Rad2Deg);
		 ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.objRotZ = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.rotation.z*(THREE.Rad2Deg);
		 ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.objRotO = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = "XYZ";
		if(obj) set = obj.rotation.order;
		 ret.set_string(set);			// for returning floats
	};
	
	Exps.prototype.objM = function (ret, objname,x,y)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = 0;
		if(obj) set = obj.matrix.elements[x%4+y*4];
		 ret.set_float(set);			// for returning floats
	};
	
	Exps.prototype.idParent = function (ret, objname)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var obj =this.runtime.Q3D.EpickById(objname);
		var set = -1;
		if(obj) set = obj.parent.id;

		 ret.set_float(set);			// for returning floats

	};
	
	Exps.prototype.LoadedItems = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		var set = (this.runtime.Q3D.manager.ItemLoaded);
		
		ret.set_int(set);				// return our value

	};
	
	Exps.prototype.LoadStatus = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = this.runtime.Q3D.loadMaster.allLoaded ? 1 : 0 ;
		//alert(set);
		ret.set_int(set);				// return our value

	};
	
	Exps.prototype.LoadedItems = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = (this.runtime.Q3D.loadMaster.loadIndex);
		//alert(set);
		ret.set_int(set);				// return our value
	};
	
	Exps.prototype.LoadTotal = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = (this.runtime.Q3D.loadMaster.loadTotal);
		//alert(set);
		ret.set_int(set);				// return our value
	};
	
	Exps.prototype.LoadingFilename = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	

		ret.set_string(this.runtime.Q3D.loadMaster.loadingFilename);				// return our value

	};
	
	Exps.prototype.scene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		ret.set_string(this.runtime.Q3D.sceneName);		// for ef_return_string

	};
	
	Exps.prototype.cameraName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		ret.set_string(this.runtime.Q3D.cameraName);		// for ef_return_string

	};
	
	Exps.prototype.Ray_originX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_originX);			// for returning floats
	};
	
	Exps.prototype.Ray_originY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_originY);			// for returning floats
	};
	
	Exps.prototype.Ray_originZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_originZ);			// for returning floats
	};
	
	Exps.prototype.Ray_dirX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_dirX);			// for returning floats
	};
	
	Exps.prototype.Ray_dirY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_dirY);			// for returning floats
	};
	
	Exps.prototype.Ray_dirZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_dirZ);			// for returning floats
	};
	
	Exps.prototype.Ray_nX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_nX);			// for returning floats
	};
	
	Exps.prototype.Ray_nY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_nY);			// for returning floats
	};
	
	Exps.prototype.Ray_nZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_nZ);			// for returning floats
	};
	
	Exps.prototype.Ray_pointX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_pointX);			// for returning floats
	};
	
	Exps.prototype.Ray_pointY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_pointY);			// for returning floats
	};
	
	Exps.prototype.Ray_pointZ = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_pointZ);			// for returning floats
	};
	
	Exps.prototype.Ray_distance = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_float(this.runtime.Q3D.Ray_distance);			// for returning floats
	};
	
	Exps.prototype.Ray_idPicked = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.runtime.Q3D.Ray_idPicked);			// for returning floats
	};
	
	Exps.prototype.Ray_numObj = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.runtime.Q3D.Ray_numObj);			// for returning floats
	};
	
	Exps.prototype.Ray_index = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 ret.set_int(this.runtime.Q3D.Ray_index);			// for returning floats
	};
	
	// Used for debugging stuff, so i don't have to use alerts that pause execution.
	
	Exps.prototype.TestString1 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		 //console.log(Object.keys(window).length)
		 var str = "";
		 for(var key in window) str+=key+", \n";
		 alert(str);
		 ret.set_any(THREE.TSH.TestString1);			// for returning any
	};
	
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());