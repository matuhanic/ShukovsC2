// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Q3Dlight = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Q3Dlight.prototype;
		
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
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.parseTargetProperty = function(){
	
		var i,len;
		var txt,chr;
		var csvi;
		var count;
		var val1,val2,val3
		var regexp;	
	   
		txt = this.properties[11];
		csvi = [];
		count = 0;
		regexp = /\s+/g
		txt = txt.replace(regexp, '')
		//alert(txt);
		
		for (i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
			if(chr === ","){
			csvi.push(i)
			count ++
			};
		
		if(count === 2) break;
		};
		
		if(count === 0){
		val1 = Number(txt);
		val2 = 0;
		val3 = 0;
		}else if(count === 1){
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		val3 = 0;
		}else{
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		val3 =  Number(txt.substring(csvi[1]+1,len));
		};
		
		if(isNaN(val1)) val1 = 0;
		if(isNaN(val2)) val2 = 0;
		if(isNaN(val3)) val3 = 0;
		
		this.targetx = val1;
		this.targety = val2;
		this.targetz = val3;
	
	};

	instanceProto.parseShadowMapSize = function(){
	
		var i,len;
		var txt,chr;
		var csvi;
		var count;
		var val1,val2,val3
		var regexp;	
	   
		txt = this.properties[22];
		csvi = [];
		count = 0;
		regexp = /\s+/g
		txt = txt.replace(regexp, '')
		//alert(txt);
		
		for (i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
			if(chr === ","){
			csvi.push(i)
			count ++
			};
		
		if(count === 1) break;
		};
		
		if(count === 0){
		val1 = Number(txt);
		val2 = 0;
		}else if(count === 1){
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		};
		
		if(isNaN(val1)) val1 = 0;
		if(isNaN(val2)) val2 = 0;
		
		this.shadmapx = val1;
		this.shadmapy = val2;
		
	};
	
	instanceProto.parseShadowCamSize = function(){
	
		var i,len;
		var txt,chr;
		var csvi;
		var count;
		var val1,val2,val3
		var regexp;	
	   
		txt = this.properties[19];
		csvi = [];
		count = 0;
		regexp = /\s+/g
		txt = txt.replace(regexp, '')
		//alert(txt);
		
		for (i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
			if(chr === ","){
			csvi.push(i)
			count ++
			};
		
		if(count === 1) break;
		};
		
		if(count === 0){
		val1 = Number(txt);
		val2 = 0;
		}else if(count === 1){
		val1 =  Number(txt.substring(0,csvi[0]));
		val2 =  Number(txt.substring(csvi[0]+1,csvi[1]));
		};
		
		if(isNaN(val1)) val1 = 0;
		if(isNaN(val2)) val2 = 0;
		
		this.shadcamx = val1;
		this.shadcamy = val2;
		
	};
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.setupObj(true);
		
		this.visible = false // force renderer to early out of drawing;
		//this.obj.debugAddedFlag = false;
		
		this.obj.position.set(this.x,this.y,this.properties[1])
		this.obj.scale.set(this.width,this.height,this.properties[5]);
		this.obj.rotation.order = this.properties[2];
		this.obj.rotation.set(this.properties[3]*(THREE.Deg2Rad),this.properties[4]*(THREE.Deg2Rad),this.angle);
		this.obj.visible = this.properties[0] === 0;
		
		//if(!this.recycled)	this.col = new THREE.Object3D();
		
		if(this.properties[7]=== 0){ // ambient
		
			this.light = new THREE.AmbientLight();
			this.light.color.setStyle(this.properties[8]);
			// ambient light doesn't need to re-update materials.
			
		}else if(this.properties[7]=== 1){ // hemisphere
			//alert("test")
			this.light = new THREE.HemisphereLight();
			this.light.color.setStyle(this.properties[8]);
			this.light.groundColor.setStyle(this.properties[12]);
			this.light.intensity = this.properties[9]
			
			this.runtime.Q3D.UpdateAllMaterials();
			
		}else if(this.properties[7]=== 2){ // point
		
			this.light = new THREE.PointLight();
			this.light.color.setStyle(this.properties[8]);
			this.light.intensity = this.properties[9];
			this.light.distance = this.properties[10];

			this.runtime.Q3D.UpdateAllMaterials();
		
		}else if(this.properties[7]=== 3){ // directional
		
			this.light = new THREE.DirectionalLight();
			this.light.color.setStyle(this.properties[8]);
			this.light.intensity = this.properties[9];

			//this.parseTargetProperty();
			//this.light.target.position.set(this.targetx,this.targety,this.targetz);
			//this.light.target.updateMatrixWorld();
			
			this.runtime.Q3D.UpdateAllMaterials();
		
		}else if(this.properties[7]=== 4){ // spot
		
			this.light = new THREE.SpotLight();
			this.light.color.setStyle(this.properties[8]);
			this.light.intensity = this.properties[9];
			this.light.distance = this.properties[10];
			this.light.angle = this.properties[13]*THREE.Deg2Rad*0.5;
			this.light.exponent = this.properties[14];

			//this.parseTargetProperty();
			//this.light.target.position.set(this.targetx,this.targety,this.targetz);
			//this.light.target.updateMatrixWorld();
			
			this.runtime.Q3D.UpdateAllMaterials();
		
		};
		
		// for some odd reason light is sometimes spawned offset.
		this.light.position.set(0,0,0);
		
		if(this.light.hasOwnProperty('shadowCamera')){
			
			this.light.add(this.light.target);
			this.light.target.position.set(0,0,10);
			this.parseTargetProperty();
			//this.light.target.matrixAutoUpdate = true;
			THREE.TSH.vec0.set(this.targetx,this.targety,this.targetz);
			this.obj.lookAt(THREE.TSH.vec0);
		
		
		this.light.castShadow = this.properties[15]===0;
		
		if(this.light.castShadow){
			//this.light.castShadow = this.properties[15]===0;
			this.light.onlyShadow = this.properties[16]===0;
			this.light.shadowCameraNear = this.properties[17];
			this.light.shadowCameraFar = this.properties[18];
			
			this.parseShadowCamSize();
			if(this.properties[7]=== 3){
				this.light.shadowCameraLeft = this.shadcamx*-0.5;
				this.light.shadowCameraRight = this.shadcamx*0.5;
				this.light.shadowCameraBottom = this.shadcamy*-0.5;
				this.light.shadowCameraTop = this.shadcamy*0.5;
			}else if(this.properties[7]=== 4){
				this.light.shadowCameraFov = this.shadcamx;				
			}
			
			this.light.shadowBias = this.properties[20];
			this.light.shadowDarkness = this.properties[21];
			
			this.parseShadowMapSize();
			this.light.shadowMapWidth = this.shadmapx;
			this.light.shadowMapHeight = this.shadmapy;
			
			this.runtime.tick2Me(this);			
		};
		
		};
		
		this.obj.add(this.light);
		
		
		if(this.properties[6] === 0){
		
			// box for visualization
			//this.box = new THREE.OldBoxHelper();
			var t = this.properties[7];
			var t2 = 0;
			
			var geometry = new THREE.SphereGeometry( 1, 4, 2 );
			var material = new THREE.MeshBasicMaterial( { wireframe: true, fog: false } );
			var material2 = new THREE.MeshBasicMaterial( { color:  this.light.color , fog: false } );
			material2.color = this.light.color
			material2.polygonOffset = true;
			material2.polygonOffsetFactor = 1;
			material2.polygonOffsetUnits = 1;
			
			if(t === 0){
			var geometryamb = new THREE.SphereGeometry( 1, 10, 8 )
			this.box = new THREE.Mesh(geometryamb,material);
			this.box2 = new THREE.Mesh(geometryamb,material2);
			t2 = 0
			}else if(t === 1){
			var geomhemi =  new THREE.SphereGeometry( 1, 5, 2 , 0, Math.PI*2,Math.PI/2,Math.PI/2);
			var geomfull =  new THREE.SphereGeometry( 1, 5, 4 )
			this.box = new THREE.Mesh(geomfull,material);
			this.box2 = new THREE.Mesh(geomhemi,material2);
			var material2h = new THREE.MeshBasicMaterial( { color:  this.light.groundColor , fog: false } );
			material2h.color = this.light.groundColor;
			material2h.polygonOffset = true;
			material2h.polygonOffsetFactor = 1;
			material2h.polygonOffsetUnits = 1;
			this.box2h = new THREE.Mesh(geomhemi,material2h);
			this.box.add(this.box2h)
			this.box2h.rotation.set(Math.PI,0,0);
			this.box.rotation.set(Math.PI/2,0,0)
			t2 = 0
			}else if(t === 2){
			this.box = new THREE.Mesh(geometry,material);
			this.box2 = new THREE.Mesh(geometry,material2);
			t2 = 0
			}else if(t === 3){
			
			var geometry2 = new THREE.BoxGeometry( 2, 2, 2, 1,1,1 );
			var geometry3 = new THREE.BoxGeometry( 2, 2, 2, 1,1,1 );
			
			//var matrix = new THREE.Matrix4().makeRotationX( Math.PI/2 );
			
			//geometry2.applyMatrix ( matrix )
			//geometry3.applyMatrix ( matrix )
			
			this.box = new THREE.Mesh(geometry3,material);
			this.box2 = new THREE.Mesh(geometry2,material2);
			
			}else if(t === 4){
			var geometry2 = new THREE.CylinderGeometry(1, 1, 2, 12 );
			var geometry3 = new THREE.CylinderGeometry( 1, 1, 2, 12,1, true );
			
			var matrix = new THREE.Matrix4().makeRotationX( Math.PI/2 );
			
			geometry2.applyMatrix ( matrix )
			geometry3.applyMatrix ( matrix )
			
			this.box = new THREE.Mesh(geometry3,material);
			this.box2 = new THREE.Mesh(geometry2,material2);
			t2 = 1;
			};
			
			if(this.light.hasOwnProperty('distance')){
			
			var material3 = new THREE.MeshBasicMaterial( { fog: false } );
			material3.color.setRGB( 255, 255, 255 );
			material3.transparent = true;
			material3.blending = THREE.AdditiveBlending
			material3.depthWrite = false;
			material3.opacity = 0.1;
			material3.side = THREE.DoubleSide;
			
			if(t===4){
			var geomcone = new THREE.CylinderGeometry( 0, 0.5, 1, 32 , 1, true );
			var matrix = new THREE.Matrix4().makeRotationX( Math.PI/-2 );
			matrix.elements[14] = 0.5;
			geomcone.applyMatrix ( matrix )
			matrix.elements[14] = 0;
			var geomsphere = new THREE.SphereGeometry(0.5, 32, 12, 0, Math.PI*2,Math.PI/2,Math.PI/2);
			geomsphere.applyMatrix ( matrix )
			//geomcone.merge(geomsphere);
			
			this.box3 = new THREE.Mesh(geomcone, material3);
			this.box4 = new THREE.Mesh(geomsphere, material3);
			this.runtime.Q3D.scene.add(this.box3);
			this.runtime.Q3D.scene.add(this.box4);
			
			//this.obj.add(box3);
			//var s = this.properties[10]*2;
			//box3.scale.set(s/this.obj.scale.x,s/this.obj.scale.y,s/this.obj.scale.z)
			}else{
			this.box3 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1),material3);
			this.runtime.Q3D.scene.add(this.box3);
			//this.box.add(box3);
			//var s = this.properties[10]*2;
			//box3.scale.set(s/this.obj.scale.x,s/this.obj.scale.y,s/this.obj.scale.z)
			};
			
			};
			
			if(this.light.target){
			
			this.light.shadowCameraVisible = true;
			var material3 = new THREE.MeshBasicMaterial( {  wireframe: false, fog: false } );
			material3.color.setRGB( 255, 255, 255 );
			this.targetdebug = new THREE.Mesh(geometry , material3);
			//this.toplevelparent.parent.add(this.targetdebug);
			this.runtime.Q3D.scene.add(this.targetdebug);
			
			//this.targetdebug.position.copy(this.light.target.position);
			this.targetdebug.scale.set(10,10,10);
			
			var geometryline = new THREE.Geometry();
			geometryline.vertices.push(new THREE.Vector3(0, 0, 0));
			geometryline.vertices.push(new THREE.Vector3(0, 0, 1));
			var materialline = new THREE.LineBasicMaterial({color: 0xFFFFFF});
			materialline.color = this.light.color;
			this.lineDebug = new THREE.Line(geometryline, materialline);
			//this.toplevelparent.parent.add(this.lineDebug);
			this.runtime.Q3D.scene.add(this.lineDebug);
			
			//this.runtime.tick2Me(this);
			//this.lineDebugCast = false;
			
			};

			this.box.add(this.box2);
			
			//this.box.scale.set(1/2,1/2,1/2);
			this.box.material.color.setRGB( 0, 0, 0 );
			if(t2 === 0){ 
			
			this.obj.add(this.box);
			this.box.scale.set(1/2,1/2,1/2);
			
			}
			else if(t2 === 1){
			
			//this.box.scale.set(50,50,50);
			//this.box.position.copy(this.obj.position)
			//this.runtime.Q3D.scene.add(this.box);
			
			this.obj.add(this.box);
			this.box.scale.set(1/2,1/2,1/2);
			
			}
			
			// axis helper for visualization
			this.axis = new THREE.AxisHelper(1);
			this.obj.add(this.axis);
			this.axis.scale.set(50/this.obj.scale.x+0.5,50/this.obj.scale.y+0.5,50/this.obj.scale.z+0.5);
			
			//this.obj.debugAddedFlag = true;
			
			this.runtime.tick2Me(this);
		
		};
		
		this.runtime.Q3D.scene.add(this.obj);
		this.set_bbox3D_changed();
		this.fastWorldUpdate();
		
		if(this.box){ 
			//this.box.matrixAutoUpdate = false; // this looks nicer, parenting doesn't mess up the axial scaling, as the tree updates but not the bbox
			if(this.axis) this.axis.matrixAutoUpdate = false;
		};// this too
		
	};

	instanceProto.tick2 = function () //called after events
	{
		/*if( this.light.hasOwnProperty('shadowCamera') && this.light.shadowCamera){
		this.light.shadowCamera.fov = this.shadcamx*2+Math.sin(this.runtime.tickcount*0.1)*20;
		//alert(this.light.shadowCameraFov);
		if(this.light.shadowCamera)	this.light.shadowCamera.updateProjectionMatrix();
		//this.light.shadowCameraVisible = Math.sin(this.runtime.tickcount) > 0;
		};*/
		/*if(this.box){
		
			this.box2.material.color =
		
		};*/
		if(this.light.shadowCamera){
		var e = this.light.matrixWorld.elements;
		this.light.shadowCamera.up.set(e[4],e[5],e[6]);
		};
		
		if(this.box){
			if(this.axis) this.axis.scale.set(50/this.obj.scale.x,50/this.obj.scale.y,50/this.obj.scale.z);

			if(this.box3){
				if(this.box3.parent !== this.toplevelparent.parent){
						this.toplevelparent.parent.add(this.box3);
				};
				if(this.box4){
					if(this.box4.parent !== this.toplevelparent.parent){
							this.toplevelparent.parent.add(this.box4);
					};		
				}		
			}
			
			if(this.targetdebug){
			
				if(this.targetdebug.parent !== this.toplevelparent.parent){
					this.toplevelparent.parent.add(this.targetdebug);
					this.toplevelparent.parent.add(this.lineDebug);
				};
				
				if(this.light.castShadow &&  this.light.cameraHelper && this.light.cameraHelper.parent !== this.toplevelparent.parent){
					this.toplevelparent.parent.add(this.light.cameraHelper);
				};
				
				this.obj.updateMatrixWorld();
				
				var e2 = this.obj.matrixWorld.elements
			
				this.lineDebug.position.set(e2[12],e2[13],e2[14]);
				this.light.target.updateMatrixWorld();
				var e = this.light.target.matrixWorld.elements;
				THREE.TSH.vec0.set(e[12],e[13],e[14]);
				THREE.TSH.vec0.sub(this.lineDebug.position);
				this.lineDebug.scale.set(1,1,THREE.TSH.vec0.length(),0);
				this.targetdebug.position.set(e[12],e[13],e[14]);
				
				this.lineDebug.lookAt ( this.targetdebug.position );
				
				this.lineDebug.visible = this.obj.visible;
				this.targetdebug.visible = this.obj.visible;
					
				//this.box.position.copy(this.obj.position);
				//this.box.quaternion.copy(this.lineDebug.quaternion);
				//this.light.angle=(Math.sin(this.runtime.tickcount*0.1)*0.5+0.5)*Math.PI/2
				if(this.box3){
				//alert('test');
				var cosd = Math.cos(this.light.angle)*this.light.distance
				var sind = Math.sin(this.light.angle)*this.light.distance
				this.box3.position.copy(this.lineDebug.position);
				this.box3.quaternion.copy(this.lineDebug.quaternion);
				this.box3.scale.set( sind*2 , sind*2 ,cosd)
				this.box3.updateMatrixWorld();
				var e3 = this.box3.matrixWorld.elements
				var s = this.box3.scale
				this.box4.position.set(e3[12]+e3[8],e3[13]+e3[9],e3[14]+e3[10])
				this.box4.quaternion.copy(this.box3.quaternion);
				this.box4.scale.set( sind*2 , sind*2 ,(this.light.distance-cosd)*2)			
				};

			}else if(this.box3){
				this.light.updateMatrixWorld();
				var e = this.light.matrixWorld.elements;
				this.box3.position.set(e[12],e[13],e[14]);
				this.box3.scale.set(this.light.distance,this.light.distance,this.light.distance)	
			}else if(this.box2h){
				this.obj.lookAt(this.box2h.position);
				this.box.rotation.set(Math.PI/2,0,0)
				this.set_bbox3D_changed();
				this.fastWorldUpdate();
			}
		};
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
		this.obj.parent.remove(this.obj);

		this.obj.remove(this.light);
		
		if( this.light.cameraHelper) this.light.cameraHelper.parent.remove(this.light.cameraHelper);
		if( this.light.shadowCamera) this.light.shadowCamera.parent.remove(this.light.shadowCamera);
		
		if(! this.light instanceof THREE.AmbientLight) this.runtime.Q3D.UpdateAllMaterials();

		if(this.box){
			
			this.box.parent.remove(this.box);
			this.box = null;
			
			if(this.axis){
			this.axis.parent.remove(this.axis);
			this.axis = null;
			};
			
			if(this.targetdebug){
				this.targetdebug.parent.remove(this.targetdebug);
				this.lineDebug.parent.remove(this.lineDebug);
				this.targetdebug = false;
				this.lineDebug = false;
			};
			
			if(this.box3){
				this.box3.parent.remove(this.box3);
				this.box3 = null;
			};
			
			if(this.box4){
				this.box4.parent.remove(this.box4);
				this.box4 = null;
			};
			
			this.box2 = null;
			this.box2h = null;
		
		};
	
	//if(this.)
	
	// these don't really do anything
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
	Cnds.prototype.TestOnlyShadow = function ()
	{
	
		return (this.light.onlyShadow);

	};
	
	Cnds.prototype.TestCastShadow = function ()
	{
	
		return (this.light.castShadow);

	};
		
	Cnds.prototype.TestType = function (TestType)
	{
	
		return (this.properties[7] === TestType);

	};
		
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// ... other actions here ...
	
	Acts.prototype.LightSetColor = function (color)
	{
	
		this.light.color.setHexR(color);

	};
	
	Acts.prototype.LightSetGroundColor = function (color)
	{
		if(this.light.hasOwnProperty('groundColor')) this.light.groundColor.setHexR(color);
	};
	
	Acts.prototype.LightSetIntensity = function (val)
	{
		if(this.light.hasOwnProperty('intensity')) this.light.intensity = val;
	};
	
	Acts.prototype.LightSetDistance = function (val)
	{
		if(this.light.hasOwnProperty('distance')) this.light.distance = val;
	};
	
	Acts.prototype.LightSetAngle = function (val)
	{
		if(this.light.hasOwnProperty('angle')) this.light.angle = val*THREE.Deg2Rad*0.5;
	};
	
	Acts.prototype.LightSetExponent = function (val)
	{
		if(this.light.hasOwnProperty('exponent')) this.light.exponent = val;
	};
	
	Acts.prototype.SetShadowCamFrustum = function (ttfov,ttwidth,ttheight,ttnear,ttfar)
	{
	
		if(this.light.hasOwnProperty('shadowCamera')){
				
			if(this.properties[7]=== 3){
				this.light.shadowCameraLeft = ttwidth*-0.5;
				this.light.shadowCameraRight = ttwidth*0.5;
				this.light.shadowCameraBottom = ttheight*-0.5;
				this.light.shadowCameraTop = ttheight*0.5;
			}else if(this.properties[7]=== 4){
				this.light.shadowCameraFov = ttfov;				
			}
			this.light.shadowCameraNear = ttnear;
			this.light.shadowCameraFar = ttfar;
		
			if(this.light.shadowCamera){
			var c = this.light.shadowCamera
				if(c instanceof THREE.PerspectiveCamera){
					
				c.fov = ttfov;
				
				}else if(c instanceof THREE.OrthographicCamera){
				
				c.left = ttwidth*-0.5
				c.right = ttheight*0.5
				c.bottom = ttheight*-0.5
				c.top = ttheight*0.5
				
				};
				
				c.near = ttnear;
				c.far = ttfar;
				c.updateProjectionMatrix();
			};
		};
	
	};
	
	Acts.prototype.SetShadowMapSize = function (w,h)
	{
		if(this.light.hasOwnProperty('shadowMap')){
			this.light.shadowMapWidth = w;
			this.light.shadowMapHeight = h;
		
			if(this.light.shadowMap){ // get rid of shadowMap if it exists
				this.light.shadowMap.dispose();
				this.light.shadowMap = null;
			};
		};	
	};
	
	
	Acts.prototype.SetOnlyShadow = function (choice)
	{
		if(this.light.hasOwnProperty('shadowMap')){
			this.light.onlyShadow = choice === 1;
			this.runtime.Q3D.UpdateAllMaterials();
		};	
	};
	
	Acts.prototype.SetShadowBias = function (val)
	{
		if(this.light.hasOwnProperty('shadowMap')){
			this.light.shadowBias = val;
		};	
	};
	
	Acts.prototype.SetShadowDark = function (val)
	{
		if(this.light.hasOwnProperty('shadowMap')){
			this.light.shadowDarkness = val;
		};	
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// ... other expressions here ...
	
	Exps.prototype.color = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{

		ret.set_float(this.light.color.getHexR());				// return our value

	};
	
	Exps.prototype.groundColor = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.groundColor) set = this.light.groundColor.getHexR();
		
		ret.set_float(set);				// return our value

	};
	
	Exps.prototype.distance = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('distance')) set = this.light.distance;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.intensity = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('intensity')) set = this.light.intensity;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.coneAngle = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('angle')) set = this.light.angle*THREE.Rad2Deg*2;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.exponent = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('exponent')) set = this.light.exponent;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.darkness = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowDarkness')) set = this.light.shadowDarkness;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.bias = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowBias')) set = this.light.shadowBias;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SMapX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowMapWidth')) set = this.light.shadowMapWidth;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SMapY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowMapHeight')) set = this.light.shadowMapHeight;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SCamAngle = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowCameraFov')) set = this.light.shadowCameraFov;
		
		ret.set_float(set);				// return our value
	};

	Exps.prototype.SCamX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowCameraRight')) set = this.light.shadowCameraRight*2;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SCamY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowCameraTop')) set = this.light.shadowCameraTop*2;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SCamNear = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowCameraNear')) set = this.light.shadowCameraNear;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.SCamFar = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = 0;
		if(this.light.hasOwnProperty('shadowCameraFar')) set = this.light.shadowCameraFar;
		
		ret.set_float(set);				// return our value
	};
	
	pluginProto.exps = new Exps();
	
	THREE.TSH.commonACEappend(Cnds,Acts,Exps,instanceProto,typeProto,pluginProto);

}());