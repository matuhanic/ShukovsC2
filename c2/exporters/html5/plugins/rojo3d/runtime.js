"use strict";
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

//////// Plugin class ////////
cr.plugins_.rojo3d = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	//////// Object type class ////////
	var pluginProto = cr.plugins_.rojo3d.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()	{};
	typeProto.onLostWebGLContext = function (){};  //todo: look at later
	typeProto.onRestoreWebGLContext = function (){};

	//////// Instance class ////////
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.gl = this.runtime.glwrap.gl;		
		this.width = this.drawWidth = this.runtime.original_width;
		this.height = this.drawHeight = this.runtime.original_height;
		this.textureBank={};
		this.textureBank[""] = {tex:this.loadTexture(null, false, 1), isSprite:false, rect:[0,0,1,1]};
		this.meshBank={};
		this.vcolor = [1.0, 1.0, 1.0, 1.0];
		this.vData = {xyz:[], norm:[],  uv:[], rgba:[], count:0};
		this.objs = {};
		this.scene = [];
		
		this.runtime.tickMe(this); //always position on screen
		
		//// fog ////
		this.fog = {enabled:true, near:500, far:1000, color:[1,1,1]}
		
		//// world ////
		this.createObj("");
		
		//// shadow ////
		let shadow = this.shadow = this.createShadowBuffer(1024);
		shadow.lightSpaceMat = mat4.create();
		shadow.maxfar = Infinity;
		shadow.projMatClipped = mat4.create();
		shadow.bias = 0.005;
		shadow.color = [0,0,0,0.5];
		shadow.autoFrustum = true;

		//// light ////
		let light = this.createObj("light");
		light.projMat = mat4.create(); // will be setup in drawgl
		light.scale = [1000,1000,1000];
		
		//// camera ////
		let camera = this.createObj("camera");
		camera.projMat = mat4.create();
		camera.inv_projMat = mat4.create();
		this.setupView(false, 45, 0.1, 1000);
		//scroll to center of layout
		let l = this.runtime.running_layout;
		vec3.set([l.scrollX, l.scrollY, this.camz], camera.pos); //source,dest //default camera matches layout
		
		// init 3d
		this.shaders = {};
		this.createShaders();
		this.renderTarget = this.createRenderTarget(this.width, this.height, true);
		
		//debug
		//console.log(shadow);
		//console.log(this.scene);
	};

	/////// 3d stuff //////
	instanceProto.createObj = function(tag, copyfrom)
	{
		if(tag in this.objs)
		{
			console.log("error: can't create \""+tag+"\", object already exists.");
			return;
		}
		let other = null;
		if(copyfrom && copyfrom!="" && (copyfrom in this.objs))
		{
			other = this.objs[copyfrom];
		}
		
		var obj = {};
		obj.tag = tag;
		obj.enabled = other?other.enabled:true;
		
		obj.pos = vec3.create(other?other.pos:[0,0,0]);
		//obj.center = vec3.create(other?other.center:[0,0,0]);
		obj.scale = vec3.create(other?other.scale:[1,1,1]);
		obj.orient = other?mat4.create(other.orient):mat4.identity(mat4.create());
		
		obj.color = other?other.color.slice():[1,1,1,1];
		obj.texTag = other?other.texTag:"";
		obj.texture = this.textureBank[obj.texTag].tex;
		obj.texRect = other?other.texRect.slice():[0,0,1,1];
		obj.texSubRect = other?other.texRect.slice():[0,0,1,1];
		
		obj.meshTag = other?other.meshTag:"";
		obj.mesh = other?other.mesh:null;
		
		obj.mat = mat4.create();
		obj.inv_mat = mat4.create();
		obj.updatedMat = false;
		
		obj.flags = {};
		obj.flags.shadow = other?other.flags.shadow:true;
		obj.flags.shading = other?other.flags.shading:true;
		obj.flags.fog = other?other.flags.fog:true;
		obj.flags.transparent = other?other.flags.transparent:0.0;
		
		this.scene.push(obj);
		this.objs[tag]=obj;
		
		return obj;
	};
	
	instanceProto.destroyObj = function(tag)
	{
		if(tag=="" || tag=="camera" || tag=="light" || !(tag in this.objs))
		{
			console.log("error: can't destroy \""+tag+"\".");
			return;
		}
		var obj = this.objs[tag], scene=this.scene;
		
		scene.splice(scene.indexOf(obj), 1);
		delete this.objs[tag];
	};

	instanceProto.setupView = function(orthographic, fov, near, far)
	{
		this.orthographic = orthographic;
		this.fov = fov;
		this.near = near;
		this.far = far;
		let camera = this.objs["camera"];
		let shadow = this.shadow;

		if(orthographic)
		{
			mat4.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2, near, far, camera.projMat);
			mat4.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2, near, Math.min(far, shadow.maxfar), shadow.projMatClipped);
		}
		else
		{
			mat4.perspective(fov, this.width / this.height, near, far, camera.projMat);
			mat4.perspective(fov, this.width / this.height, near, Math.min(far, shadow.maxfar), shadow.projMatClipped);
		}
		
		this.camz = this.height/2/Math.tan(fov*Math.PI/360);
		//console.log(this.camz); //debug
	};
	
	instanceProto.loadTexture = function(url, filtering, repeat)
	{
		var gl = this.gl;
		switch(repeat)
		{
			case 0: repeat=gl.CLAMP_TO_EDGE; break;
			case 1: repeat=gl.REPEAT; break;
			case 2: repeat=gl.gl.MIRRORED_REPEAT; break;
		}		
		var oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeat);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeat);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering?gl.LINEAR:gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering?gl.LINEAR:gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, oldTex);

		if(url == null)
			return texture; // for default texture
		
		const image = new Image();
		var self = this;
		image.onload = function() {
			if(!gl.isTexture(texture))  //was deleted before loading
				return;
			oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			
			gl.bindTexture(gl.TEXTURE_2D, oldTex);
			self.runtime.redraw = true;
		};
		image.src = url;
		return texture;
	};
	
	instanceProto.buildShader = function(vs_source, fs_source)
	{	
		//console.log(vs_source);
		let gl = this.gl;
		let vs = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vs, vs_source);
		gl.compileShader(vs);
		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
			console.log(gl.getShaderInfoLog(vs));

		let fs = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fs, fs_source);
		gl.compileShader(fs);
		if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
			console.log(gl.getShaderInfoLog(fs));

		let shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vs);
		gl.attachShader(shaderProgram, fs);
		gl.linkProgram(shaderProgram);
		if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
			console.log(gl.getProgramInfoLog(shaderProgram));
		
		let shader = {};
		shader.program = shaderProgram;
		
		let count, name;
		
		count = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
		for(let i=0; i<count; i++)
		{
			name = gl.getActiveAttrib(shaderProgram, i).name;
			shader[name] = gl.getAttribLocation(shaderProgram, name);
		}
		
		count = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
		for(let i=0; i<count; i++)
		{
			name = gl.getActiveUniform(shaderProgram, i).name;
			shader[name] = gl.getUniformLocation(shaderProgram, name);
		}

		return shader;
	};
	
	instanceProto.createShaders = function()
	{	
		this.shaders.shadow = this.buildShader(
			// vertexShader
			"attribute vec3 aPos;"+
			"uniform mat4 uProj;"+
			"uniform mat4 uView;"+
			"uniform mat4 uModel;"+
			"void main(void) "+
			"{"+
			"	gl_Position = uProj*uView*uModel*vec4(aPos, 1.0);"+
			"}", 
			// fragmentShader
			"precision mediump float;"+
			"void main(void) {"+
			"	gl_FragColor = vec4(1.0,1.0,1.0,1.0);"+
			"}"
		);
		
		this.shaders.shadowTransparent = this.buildShader(
			// vertexShader
			"attribute vec3 aPos;"+
			"attribute vec2 aTex;"+
			"varying vec2 vTex;"+
			"uniform mat4 uProj;"+
			"uniform mat4 uView;"+
			"uniform mat4 uModel;"+
			"uniform vec4 uTexRect;"+
			"void main(void) "+
			"{"+
			"	vTex = vec2(mix(uTexRect.x, uTexRect.z, aTex.x), mix(uTexRect.y, uTexRect.w, aTex.y));"+
			"	gl_Position = uProj*uView*uModel*vec4(aPos, 1.0);"+
			"	"+
			"}", 
			// fragmentShader
			"precision mediump float;"+
			"varying vec2 vTex;"+
			"uniform sampler2D uSampler;"+
			"void main(void) {"+
			"	if(texture2D(uSampler, vTex).a < 0.5)"+
			"		discard;"+
			"	gl_FragColor = vec4(1.0,1.0,1.0,1.0);"+
			"}"
		);
		
		this.shaders.standard = this.buildShader(
			// vertexShader
			"attribute vec3 aPos;"+
			"attribute vec2 aTex;"+
			"attribute vec3 aNorm;"+
			"attribute vec4 aColor;"+
			""+
			"varying vec3 vPosition;"+ //for fog
			"varying vec2 vTex;"+
			"varying vec4 vColor;"+
			"varying vec3 vNorm;"+
			"varying vec4 vLightPos;"+ //for shadow
			""+
			"uniform mat4 uProj;"+
			"uniform mat4 uView;"+
			"uniform mat4 uModel;"+
			"uniform mat4 uModelInvTra;"+
			"uniform mat4 uLightSpace;"+ //for shadow
			"uniform vec4 uColor;"+
			"uniform vec4 uTexRect;"+
			"void main(void)"+
			"{"+
			"	vec4 worldPos = uModel*vec4(aPos, 1.0);"+
			"	gl_Position = uProj*uView*worldPos;"+
			"	vTex = vec2(mix(uTexRect.x, uTexRect.z, aTex.x), mix(uTexRect.y, uTexRect.w, aTex.y));"+
			//"	vTex = aTex;"+
			"	vNorm = (uModelInvTra*vec4(aNorm, 0.0)).xyz;"+
			"	vLightPos = uLightSpace*worldPos;"+ //for shadow
			"	vColor = aColor*uColor;"+
			"	vPosition = (uView*worldPos).xyz;"+ //for fog
			"}",
			// fragmentShader
			"precision mediump float;"+
			"varying vec2 vTex;"+
			"varying vec4 vColor;"+
			"varying vec3 vNorm;"+
			"varying vec3 vPosition;"+
			"varying vec4 vLightPos;"+
			""+
			"uniform vec4 uShadowColor;"+
			"uniform vec3 uLightColor;"+
			"uniform vec3 uLightDir;"+
			"uniform float uBias;"+
			""+
			"uniform vec3 uFogColor;"+
			"uniform float uFogNear;"+
			"uniform float uFogFar;"+
			""+
			"uniform float uFlagShading;"+
			"uniform float uFlagShadow;"+
			"uniform float uFlagFog;"+
			""+
			"uniform sampler2D uShadowMap;"+
			"uniform sampler2D uSampler;"+
			""+
			"void main(void) {"+
			"	vec3 normal = normalize(vNorm);	"+
			"	vec4 color = vColor*texture2D(uSampler, vTex);"+
			"	color*=color.a;"+
			"	"+
				//light
			"	float light = max(0.0, dot(uLightDir, normal));"+
			"	light = (uFlagShading==1.0)? light : (light>0.0?1.0:1.0-uFlagShadow);"+
			"	vec3 diffuse = light*uLightColor.rgb;"+
			"	"+
				//shadow
			"	vec3 shadowCoord = vLightPos.xyz/vLightPos.w;"+
			"	shadowCoord = shadowCoord*0.5 + 0.5;"+
			"	bool inRange = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;"+
			"	float bias = max(uBias*0.1, uBias*(1.0-dot(uLightDir, normal)));"+
			"	float shadow = (inRange && shadowCoord.z-bias > texture2D(uShadowMap, shadowCoord.xy).r)  ? uFlagShadow : 0.0;"+
			"	"+
			//"	color = vec4(diffuse*(1.0-shadow)*color.rgb, color.a);"+
			"	color = vec4(mix(uShadowColor.rgb, uLightColor.rgb, max(light*(1.0-shadow),1.0-uShadowColor.a))*color.rgb, color.a);"+
			"	"+
			"	float fogDistance = length(vPosition);"+
			"	float fogAmount = smoothstep(uFogNear, uFogFar, fogDistance);"+
			"	gl_FragColor = (uFlagFog==1.0) ? vec4(mix(color.rgb, uFogColor, fogAmount*color.a), color.a) : color;"+
			"}"
		);		
				
		this.shaders.simple = this.buildShader(
			// vertexShader
			"attribute vec3 aPos;"+
			"attribute vec2 aTex;"+
			"varying vec2 vTex;"+
			"void main(void) "+
			"{"+
			"    gl_Position = vec4(aPos, 1.0);"+
			"    vTex = aTex;"+
			"}", 
			// fragmentShader
			"precision mediump float;"+
			"varying vec2 vTex;"+
			"uniform sampler2D uSampler;"+
			"void main(void) {"+
			"	gl_FragColor = texture2D(uSampler, vTex);"+
			"}"
		);
	}

	instanceProto.createRenderTarget = function(width,height,filtering)
	{
		let gl = this.gl;
		let target = {};

		//save
		var oldFb = gl.getParameter(gl.FRAMEBUFFER_BINDING),
			oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D),
			oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		//var oldRB = gl.getParameter(gl.RENDERBUFFER_BINDING);

		// mesh
		let mesh = target.mesh = {count:6};
		mesh.xyz = [-1,-1, //tri 1
					 1,-1,
					 1, 1,
					-1,-1, //tri 2
					 1, 1,
					-1, 1];
		mesh.uv = [	0, 0, //tri 1
					1, 0,
					1, 1,
					0, 0, //tri 2
					1, 1,
					0, 1];

		let xyz_buffer = mesh.xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.xyz), gl.STATIC_DRAW);
		
		let uv_buffer = mesh.uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uv), gl.STATIC_DRAW);

		//color texture
		let texture = target.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering?gl.LINEAR:gl.NEAREST);

		// framebuffer
		let fb = target.fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		//add depth
		let depthbuf = target.depthbuf = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuf);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuf);

		//restore state
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		gl.bindFramebuffer(gl.FRAMEBUFFER, oldFb);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);
		//gl.bindRenderbuffer(gl.RENDERBUFFER, oldRB);
		
		return target;
	};
	
	instanceProto.createShadowBuffer = function(size)
	{
		var gl = this.gl;

		//save
		var oldFb = gl.getParameter(gl.FRAMEBUFFER_BINDING),
			oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D),
			oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		//var oldRB = gl.getParameter(gl.RENDERBUFFER_BINDING);		

		var color_buffer, depth_buffer, frame_buffer;
		if(gl.getExtension("WEBGL_depth_texture"))  //true if webgl 1, and if available)
		{
			// color texture
			color_buffer = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, color_buffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			
			// depth texture
			depth_buffer = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, depth_buffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			frame_buffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_buffer, 0);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,  gl.TEXTURE_2D, depth_buffer, 0);
		}
		else
		{
			depth_buffer = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, depth_buffer);
			gl.texImage2D(gl.TEXTURE_2D, 0,	gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT,	null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			frame_buffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER,	gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D,	depth_buffer, 0);       
		}

		//restore state
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		gl.bindFramebuffer(gl.FRAMEBUFFER, oldFb);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);
		//gl.bindRenderbuffer(gl.RENDERBUFFER, oldRB);
		
		this.textureBank["shadowmap"] = {tex:depth_buffer, isSprite:false, rect:[0,0,1,1]}; // debug
		return {size:size, fb:frame_buffer, texture:depth_buffer};
	};

	instanceProto.onDestroy = function ()
	{
		// todo: cleanup?
	};

	instanceProto.tick = function()
	{
		//always make on screen
		var l = this.runtime.running_layout;
		if (this.x !== l.scrollX || this.y !== l.scrollY)
		{
			this.x = l.scrollX;
			this.y = l.scrollY;
			this.set_bbox_changed();
			//this.objs["camera"].updatedMat=false;
		}
	};

	instanceProto.draw = function(ctx){};
	instanceProto.sortScene = function(axis)
	{
		let shouldSort = false;
		
		
		for(let i in this.scene)
		{
			let obj = this.scene[i];
			if ( obj.flags.transparent)
			{
				obj.sortValue = vec3.dot(obj.pos, axis);
				shouldSort = true;
			}
		}
		
		if( shouldSort )
			this.scene.sort(function(a,b){
				let c = (a.flags.transparent>0) - (b.flags.transparent>0);
				if(c == 0)
					return a.sortValue-b.sortValue;
				else
					return c;
			});
	}
	
	instanceProto.drawGL = function(glw)
	{
		glw.endBatch();
		let gl=glw.gl;
		
		let camera = this.objs["camera"];
		let light = this.objs["light"];
		let shadow = this.shadow;
		
		let updateBB = false;
		//update matricies
		for(let i in this.scene)
		{
			let obj = this.scene[i];

			if( obj.flags.transparent == 2) //bilboard
				obj.updatedMat = false;
				
			if(obj.updatedMat)
				continue;
			
			if (obj.tag == "light")
			{
				updateBB = true;
				continue;
			}
			
			let m = obj.mat;
			if(obj.tag == "camera")
			{
				updateBB = true;
				mat4.identity(m);
				mat4.translate(m, obj.pos);
				mat4.multiply(m, obj.orient);
				mat4.scale(m, [1,-1,1]);  //flip y
				mat4.inverse(m, obj.inv_mat);
			}
			else
			{
				mat4.identity(m);
				mat4.translate(m, obj.pos);
				if( obj.flags.transparent == 2) //bilboard
					mat4.multiply(m, camera.orient);
				else
					mat4.multiply(m, obj.orient);
				mat4.scale(m, obj.scale);
				//mat4.translate(m, obj.center);  //shift center?
				mat4.inverse(m, obj.inv_mat);
				mat4.transpose(obj.inv_mat);
			}
			obj.updatedMat=true;
		}
		
		if(updateBB)  // find corners of view frustum, find obb in lightspace, update light frustum.
		{			
			if(shadow.autoFrustum)
			{
				let inv_proj = camera.inv_projMat;
				mat4.inverse(shadow.projMatClipped, inv_proj);
				mat4.inverse(light.orient, light.inv_mat);
				
				let obbxmin=Infinity, obbymin=Infinity, obbzmin=Infinity;
				let obbxmax=-Infinity, obbymax=-Infinity, obbzmax=-Infinity;
				
				let corners = [
					[-1,-1,-1, 1], [ 1,-1,-1, 1], [ 1, 1,-1, 1], [-1, 1,-1, 1],
					[-1,-1, 1, 1], [ 1,-1, 1, 1], [ 1, 1, 1, 1], [-1, 1, 1, 1]
				];
				
				let min = Math.min, max = Math.max;
				for(let i in corners)
				{
					let v = corners[i];
					
					mat4.multiplyVec4(inv_proj, v);
					v[0]/=v[3]; v[1]/=v[3]; v[2]/=v[3]; v[3]=1;
					mat4.multiplyVec4(camera.mat, v);
					mat4.multiplyVec4(light.inv_mat, v);
					
					obbxmin = min(obbxmin, v[0]);
					obbxmax = max(obbxmax, v[0]);
					obbymin = min(obbymin, v[1]);
					obbymax = max(obbymax, v[1]);
					obbzmin = min(obbzmin, v[2]);
					obbzmax = max(obbzmax, v[2]);
				}
				let s = 1;
				let sx=(obbxmax-obbxmin)*s, sy=(obbymax-obbymin)*s, sz=(obbzmax-obbzmin)*s*1.125;  //todo: seems like a fiddly solution
				let cx=(obbxmax+obbxmin)/2, cy=(obbymax+obbymin)/2, cz=(obbzmax+obbzmin)/2;
				
				//mat4.ortho(obbxmin, obbxmax, obbymin, obbymax, obbzmin, obbzmax, light.projMat);
				mat4.ortho(-sx/2, sx/2, -sy/2, sy/2, -sz/2, sz/2, light.projMat);
				
				let m = light.mat;
				mat4.identity(m);
				mat4.translate(m, mat4.multiplyVec3(light.orient, [cx,cy,cz]));
				mat4.multiply(m, light.orient);
				mat4.scale(m, [1,-1,1]);  //flip y
				mat4.inverse(m, light.inv_mat);
			}
			else //manual
			{
				let sx=light.scale[0], sy=light.scale[1], sz=light.scale[2];
				mat4.ortho(-sx/2, sx/2, -sy/2, sy/2, -sz/2, sz/2, light.projMat);
				
				let m = light.mat;
				mat4.identity(m);
				mat4.translate(m, light.pos);
				mat4.multiply(m, light.orient);
				mat4.scale(m, [1,-1,1]);  //flip y
				mat4.inverse(m, light.inv_mat);
			}
			light.updatedMat=true;
		}

		// update mesh and textures from tag.   // todo: only needs to be done when mesh is loaded/replaced or teture is replaced 
		for(let i in this.scene)
		{
			let obj = this.scene[i];
			if(obj.meshTag !="")
				obj.mesh = (obj.meshTag in this.meshBank)?this.meshBank[obj.meshTag]:null;
				
			if(obj.mesh == null)// todo: some additional culling
				continue;
			
			//if(obj.texTag !="") //todo: only needed when textures are deleted
			
			if(obj.texTag in this.textureBank)
			{
				let texSlot=this.textureBank[obj.texTag];
				
				obj.texture = texSlot.tex;
				let a = texSlot.rect
				let b = obj.texSubRect;
				obj.texRect = [ cr.lerp(a[0], a[2], b[0]),
								cr.lerp(a[1], a[3], b[1]),
								cr.lerp(a[0], a[2], b[2]),
								cr.lerp(a[1], a[3], b[3])];
			}
			else
				obj.texture = null;
		}
		
		//save old renderer state
		let oldProgram = gl.getParameter(gl.CURRENT_PROGRAM),
			oldActive = gl.getParameter(gl.ACTIVE_TEXTURE),
			oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D),
			oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING),
			oldFb = gl.getParameter(gl.FRAMEBUFFER_BINDING),
			oldViewport = gl.getParameter(gl.VIEWPORT);

		//gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		//gl.depthMask(true);
		//gl.disable(gl.BLEND);
		//gl.depthFunc(gl.LEQUAL);  

		let shader;
		///////////////////////////
		//// draw to shadowmap ////
		///////////////////////////
		this.sortScene(light.orient.slice(8,11));
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, shadow.fb);
		gl.viewport(0, 0, shadow.size, shadow.size);
		gl.clearColor(0,0,0,0);
		gl.colorMask(false, false, false, false);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		//draw opaque shadows
		shader = this.shaders.shadow;	
		gl.useProgram(shader.program);
		gl.uniformMatrix4fv(shader.uProj, false, light.projMat); 
		gl.uniformMatrix4fv(shader.uView, false, light.inv_mat);
		gl.enableVertexAttribArray(shader.aPos);
		let ii=0;
		for(ii in this.scene) // draw scene
		{
			let obj = this.scene[ii];
			if(obj.mesh == null || !obj.flags.shadow)
				continue;
			if(obj.flags.transparent)
				break;
			
			gl.uniformMatrix4fv(shader.uModel, false, obj.mat);
			
			//select buffers from mesh and draw triangles
			let mesh = obj.mesh;
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
			gl.vertexAttribPointer(shader.aPos, 3, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
		}
		
		// draw shadows with transparency.  just on/off
		shader = this.shaders.shadowTransparent;	
		gl.useProgram(shader.program);
		gl.uniformMatrix4fv(shader.uProj, false, light.projMat); 
		gl.uniformMatrix4fv(shader.uView, false, light.inv_mat);
		gl.enableVertexAttribArray(shader.aPos);
		gl.enableVertexAttribArray(shader.aTex);
		for( ; ii<this.scene.length; ii++)
		{
			let obj = this.scene[ii];
			if(obj.mesh == null || !obj.flags.shadow)
				continue;
			
			gl.bindTexture(gl.TEXTURE_2D, obj.texture);
			gl.uniform4fv(shader.uTexRect, obj.texRect);
			gl.uniformMatrix4fv(shader.uModel, false, obj.mat);
			
			//select buffers from mesh and draw triangles
			let mesh = obj.mesh;
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
			gl.vertexAttribPointer(shader.aPos, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
			gl.vertexAttribPointer(shader.aTex, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
		}
		
		gl.colorMask(true, true, true, true);
		
		/////////////////////////////
		//// draw to framebuffer ////
		/////////////////////////////
		this.sortScene(camera.orient.slice(8,11));
		
		let target = this.renderTarget;
		gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
		//update framebuffer texture and depth buffer size as needed.
		if(this.drawWidth !== glw.width && this.drawHeight !== glw.height)
		{
			this.drawWidth = glw.width;
			this.drawHeight = glw.height;
			gl.bindTexture(gl.TEXTURE_2D, target.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.drawWidth, this.drawHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, target.depthbuf);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.drawWidth, this.drawHeight);
		}
		gl.viewport(0, 0, this.drawWidth, this.drawHeight);
		shader = this.shaders.standard;	
		gl.useProgram(shader.program);
		
		let fog = this.fog;
		gl.clearColor(0,0,0,0);		// todo: make this toggleable?
		//gl.clearColor(fog.color[0],fog.color[1],fog.color[2],1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniform3fv(shader.uFogColor, fog.color);
		gl.uniform1f(shader.uFogNear, fog.near);
		gl.uniform1f(shader.uFogFar, fog.far);
		
		gl.uniformMatrix4fv(shader.uProj, false, camera.projMat);
		gl.uniformMatrix4fv(shader.uView, false, camera.inv_mat);
		
		let lightSpaceMat = shadow.lightSpaceMat;
		mat4.set(light.projMat, lightSpaceMat); //source, dest
		mat4.multiply(lightSpaceMat, light.inv_mat);
		gl.uniformMatrix4fv(shader.uLightSpace, false, lightSpaceMat);
		
		gl.uniform1f(shader.uBias, shadow.bias);
		gl.uniform4fv(shader.uShadowColor, shadow.color);
		gl.uniform3f(shader.uLightColor, light.color[0], light.color[1], light.color[2]);
		
		gl.uniform3fv(shader.uLightDir, light.mat.slice(8, 11));
		
		gl.enableVertexAttribArray(shader.aPos);
		gl.enableVertexAttribArray(shader.aTex);
		gl.enableVertexAttribArray(shader.aColor);
		gl.enableVertexAttribArray(shader.aNorm);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.uniform1i(shader.uShadowMap, 1);
		gl.bindTexture(gl.TEXTURE_2D, shadow.texture);
		gl.activeTexture(gl.TEXTURE0);
		
		for(let i in this.scene) // draw scene
		{
			let obj = this.scene[i];
			if(obj.mesh == null)
				continue;
			
			gl.uniform1f(shader.uFlagShading, obj.flags.shading);
			gl.uniform1f(shader.uFlagShadow, obj.flags.shadow);
			gl.uniform1f(shader.uFlagFog, obj.flags.fog);

			gl.bindTexture(gl.TEXTURE_2D, obj.texture);
			gl.uniform4fv(shader.uTexRect, obj.texRect);
			gl.uniform4fv(shader.uColor, obj.color);
			gl.uniformMatrix4fv(shader.uModel, false, obj.mat);
			gl.uniformMatrix4fv(shader.uModelInvTra, false, obj.inv_mat);
			
			//select buffers from mesh and draw triangles
			let mesh = obj.mesh;
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
			gl.vertexAttribPointer(shader.aPos, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.rgba_buffer);
			gl.vertexAttribPointer(shader.aColor, 4, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
			gl.vertexAttribPointer(shader.aTex, 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.norm_buffer);
			gl.vertexAttribPointer(shader.aNorm, 3, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
		}
		gl.disableVertexAttribArray(shader.aColor);
		gl.disableVertexAttribArray(shader.aNorm);
		
		//////////////////////////////
		//// draw fbtex to screen ////
		//////////////////////////////
		gl.bindFramebuffer(gl.FRAMEBUFFER, oldFb);
		gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
				
		shader = this.shaders.simple;	
		gl.useProgram(shader.program);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, target.texture);//target.texture);
		
		let mesh = target.mesh;
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
		gl.vertexAttribPointer(shader.aPos, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
		gl.vertexAttribPointer(shader.aTex, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, mesh.count);

		//gl.disable(gl.CULL_FACE);
		gl.disable(gl.DEPTH_TEST);
		
		//// restore renderer state ////
		gl.useProgram(oldProgram);
		gl.activeTexture(oldActive);
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);
	};

	function Cnds() {};
	function Acts() {};
	function Exps() {};

	//////// Conditions ////////


	//////// Actions ////////
	
	Acts.prototype.setupCamera = function (mode, fov, near, far)
	{
		this.setupView(mode, fov, near, far);
		this.runtime.redraw = true;
	};
	Acts.prototype.setupFog = function (near, far, r, g, b)
	{
		var fog=this.fog;
		fog.near = near;
		fog.far = far;
		fog.color[0] = r;
		fog.color[1] = g;
		fog.color[2] = b;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setupShadow = function (mapsize, maxfar, bias)
	{
		let shadow = this.shadow;
		let gl = this.gl;
		
		if( shadow.size != mapsize)
		{
			//cleanup old
			gl.deleteFramebuffer(shadow.fb);
			gl.deleteTexture(shadow.texture); //todo: cleanup other texture...
			
			//create new one
			let n = this.createShadowBuffer(mapsize);
			shadow.size = n.size;
			shadow.fb = n.fb;
			shadow.texture = n.texture;
		}
		
		shadow.maxfar = maxfar;
		this.setupView(this.orthographic, this.fov, this.near, this.far);
		shadow.bias = bias;
		
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setShadowColor = function (r, g, b, a)
	{
		this.shadow.color = [r,g,b,a];
		
		this.runtime.redraw = true;
	};
	
	Acts.prototype.createObject = function (tag, copyfrom) {this.createObj(tag, copyfrom)};
	Acts.prototype.destroyObject = function (tag) {this.destroyObj(tag)};
	
	instanceProto.applyRelAng = function(v,rel)
	{
		if(rel != "" && (rel in this.objs))
		{
			let obj = this.objs[rel]
			mat4.multiplyVec3(obj.orient, v);
		}
		return v;
	};
	instanceProto.applyRelAngPos = function(v,rel)
	{
		if(rel != "" && (rel in this.objs))
		{
			let obj = this.objs[rel]
			mat4.multiplyVec3(obj.orient, v);
			vec3.add(v, obj.pos);
		}
		return v;
	};
	
	Acts.prototype.setPosition = function (tag, x,y,z, rel)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		vec3.set(this.applyRelAngPos([x,y,z],rel), obj.pos); //source,dest
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setScale = function (tag, x,y,z, rel)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var v = [x,y,z];
		if(rel != "" && (rel in this.objs))
		{
			let os = this.objs[rel].scale;
			v[0]*=os[0]; v[1]*=os[1]; v[2]*=os[2];
		}
		vec3.set(v, obj.scale); //source,dest
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	Acts.prototype.setOrientationEuler = function (tag, x,y,z, rel)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var m = obj.orient;
		var rad = Math.PI/180;
		
		if(rel != "" && (rel in this.objs))
			mat4.set(this.objs[rel].orient, m); //source, dest
		else
			mat4.identity(m);
		mat4.rotateX(m, x*rad);
		mat4.rotateY(m, -y*rad);
		mat4.rotateZ(m, z*rad);
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	function targetTo(out, eye, target, up) 
	{
		let eyex = eye[0],	eyey = eye[1],	eyez = eye[2],
			upx = up[0],	upy = up[1],	upz = up[2];
		let z0 = eyex - target[0],
			z1 = eyey - target[1],
			z2 = eyez - target[2];
		let len = z0 * z0 + z1 * z1 + z2 * z2;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
			z0 *= len;	z1 *= len;	z2 *= len;
		}
		let x0 = upy * z2 - upz * z1,
			x1 = upz * z0 - upx * z2,
			x2 = upx * z1 - upy * z0;
		len = x0 * x0 + x1 * x1 + x2 * x2;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
			x0 *= len;	x1 *= len;	x2 *= len;
		}
		out[0] = x0;
		out[1] = x1;
		out[2] = x2;
		out[3] = 0;
		out[4] = z1 * x2 - z2 * x1;
		out[5] = z2 * x0 - z0 * x2;
		out[6] = z0 * x1 - z1 * x0;
		out[7] = 0;
		out[8] = z0;
		out[9] = z1;
		out[10] = z2;
		out[11] = 0;
		out[12] = eyex;
		out[13] = eyey;
		out[14] = eyez;
		out[15] = 1;
		return out;
	}
	
	Acts.prototype.lookAt = function (tag, x,y,z, rel, upx,upy,upz, rel2)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var p = obj.pos;
		var v = this.applyRelAngPos([x,y,z],rel);
		//mat4.lookAt([0,0,0], [x-p[0],y-p[1],z-p[2]], [upx,upy,upz], obj.orient); //?????
		targetTo(obj.orient, [0,0,0], [v[0]-p[0],v[1]-p[1],v[2]-p[2]], this.applyRelAng([upx,upy,upz], rel2)); 
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setColor = function (tag, r,g,b,a)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var c = this.objs[tag].color;
		c[0]=r;c[1]=g;c[2]=b;c[3]=a;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setTexture = function (tag, texTag)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		obj.texTag = texTag;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setTexRect = function (tag, left, top, right, bottom)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var rect = this.objs[tag].texSubRect;
		rect[0] = left;
		rect[1] = top;
		rect[2] = right;
		rect[3] = bottom;
		
		this.runtime.redraw = true;
	};
	
	Acts.prototype.setMesh = function (tag, meshTag)
	{
		if(tag == "" || !(tag in this.objs) || tag=="camera" || tag=="light")
			return;
		var obj = this.objs[tag];
		obj.meshTag = meshTag;		
		this.runtime.redraw = true;
	};
	
	/*Acts.prototype.setGroup = function (tag, group)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		//todo
	};*/
	
	Acts.prototype.setObjSettings = function (tag, shadow, shading, fog, transparent)
	{
		if(tag == "" || tag == "camera" || tag == "light" || !(tag in this.objs))
			return;
		let obj = this.objs[tag];
		
		obj.flags.shadow = (shadow==1);
		obj.flags.shading = (shading==1);
		obj.flags.fog = (fog==1);
		obj.flags.transparent = transparent;
		
		this.runtime.redraw = true;
	};
	
	Acts.prototype.translate = function (tag, x,y,z, rel)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var pos = obj.pos;
		
		vec3.add(pos, this.applyRelAng([x,y,z], rel));
		
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.rotateAxis = function (tag, x,y,z, rel, angle)//, after)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		//todo:handle after?
		mat4.rotate(obj.orient, angle*Math.PI/180, this.applyRelAng([x,y,z], rel));
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.rotateAxisAroundCenter = function (tag, x,y,z, rel, angle, cx,cy,cz, rel2)//, after)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var center = this.applyRelAngPos([cx,cy,cz], rel2);
		var rotMat = mat4.identity(mat4.create());
		mat4.rotate(rotMat, angle*Math.PI/180, this.applyRelAng([x,y,z], rel));
		mat4.multiply(obj.orient, rotMat);
		vec3.subtract(obj.pos, center);
		mat4.multiplyVec3(rotMat, obj.pos);
		vec3.add(obj.pos, center);
		
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.scale = function (tag, x,y,z)
	{
		if(tag == "" || !(tag in this.objs))
			return;
		var obj = this.objs[tag];
		var scale = obj.scale;
		scale[0]*=x; scale[1]*=y; scale[2]*=z;
		
		obj.updatedMat=false;
		this.runtime.redraw = true;
	};

	Acts.prototype.setVColor = function (r,g,b,a)
	{
		var c = this.vcolor;
		c[0]=r; c[1]=g; c[2]=b; c[3]=a;
	};
	
	Acts.prototype.addVertex = function (x,y,z, rel, u,v)
	{
		var vert = this.applyRelAngPos([x,y,z],rel);
		var data = this.vData;
		data.xyz.push(vert[0],vert[1],vert[2]); 
		data.uv.push(u,v);
		var c = this.vcolor;
		data.rgba.push(c[0],c[1],c[2],c[3]);
		data.count += 1;
		
		if(data.count%3 == 0)  // calculate normal for each triangle
		{
			let xyz = data.xyz;
			let n = [0,0,0];
			let len = xyz.length;
			let v1 = [xyz[len-9],xyz[len-8],xyz[len-7]];
			let v2 = [xyz[len-6],xyz[len-5],xyz[len-4]];
			let v3 = [xyz[len-3],xyz[len-2],xyz[len-1]];
			vec3.subtract(v2, v1);
			vec3.subtract(v3, v1);
			vec3.cross(v2, v3, n);
			
			data.norm.push(n[0], n[1], n[2]);
			data.norm.push(n[0], n[1], n[2]);
			data.norm.push(n[0], n[1], n[2]);
		}
	};
	
	Acts.prototype.saveMesh = function (tag)
	{
		var gl = this.gl;
		var data = this.vData;

		var mesh = {};
		mesh.count = data.count - data.count%3;
		mesh.xyz = data.xyz.slice(0, mesh.count*3);
		mesh.uv = data.uv.slice(0, mesh.count*2);
		mesh.rgba = data.rgba.slice(0, mesh.count*4);
		mesh.norm = data.norm.slice(0, mesh.count*3);

		var oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		mesh.xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.xyz), gl.STATIC_DRAW);

		mesh.rgba_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.rgba_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.rgba), gl.STATIC_DRAW);

		mesh.uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.uv), gl.STATIC_DRAW);
		
		mesh.norm_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.norm_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.norm), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);

		//reset data
		data.count=0;
		data.xyz.length=0;
		data.uv.length=0;
		data.rgba.length=0;
		data.norm.length=0;

		if(tag in this.meshBank)
		{
			console.log("warning: mesh tag '"+tag+"' already used");
			let mesh = this.meshBank[tag];
			gl.deleteBuffer(mesh.xyz_buffer);
			gl.deleteBuffer(mesh.uv_buffer);
			gl.deleteBuffer(mesh.rgba_buffer);
			gl.deleteBuffer(mesh.norm_buffer);
		}
		this.meshBank[tag] = mesh;
	};
	
	instanceProto.parseObjFile = function(data, tag)
	{
		let v=[], vt=[], vn=[];
		let xyz=[], uv=[], rgba=[], norm=[], count=0;

		let lines = data.split("\n");
		let indexes, tri = [1,2,3], quad = [1,2,3,1,3,4];
		for(let ii in lines)
		{
			let tokens = lines[ii].split(" ");
			switch(tokens[0])
			{
				case "v":
					v.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
					break;
				case "vn":
					vn.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
					break;
				case "vt":
					vt.push([parseFloat(tokens[1]), 1-parseFloat(tokens[2])]);
					break;
				case "f":
					indexes = (tokens.length==4)?tri:quad;
					let f = [0,0,0];
					for(let i in indexes)
					{
						let elem = tokens[indexes[i]].split('/');
						let i0 = parseInt(elem[0])-1; //vert
						xyz.push(v[i0][0], v[i0][1], v[i0][2]);
						if(i<3)
							f[i] = v[i0];
						
						if(elem.length>=2) //if has uvs
						{
							let i1 = parseInt(elem[1])-1;
							uv.push(vt[i1][0], vt[i1][1]);
						}
						else
							uv.push(0, 0);
						
						if(elem.length>=3) //if has norm
						{
							let i1 = parseInt(elem[2])-1;
							norm.push(vn[i1][0], vn[i1][1], vn[i1][2]);
						}
						else if(i == indexes.length-1) // generate normal
						{
							let veca = vec3.create();
							let vecb = vec3.create();
							let n = vec3.create();
							
							vec3.subtract(f[1], f[0], veca);
							vec3.subtract(f[2], f[0], vecb);
							vec3.cross(veca, vecb, n);
							
							for(let j in indexes)
								norm.push(n[0], n[1], n[2]);
						}
						count++;
					}
					break;
				default:
					continue;
			}
		}

		let mesh = {};
		mesh.count = count;
		mesh.xyz = xyz;
		mesh.uv = uv;
		mesh.norm = norm;
		mesh.rgba = rgba;

		let gl = this.gl;
		let oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		mesh.xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(xyz), gl.STATIC_DRAW);

		mesh.rgba_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.rgba_buffer);
		let arr = new Float32Array(count*4);
		for(let i in arr)
			arr[i]=1;
		gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

		mesh.uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
		
		mesh.norm_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.norm_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);

		if(tag in this.meshBank)
		{
			console.log("warning: mesh tag '"+tag+"' already used");
			let mesh = this.meshBank[tag];
			gl.deleteBuffer(mesh.xyz_buffer);
			gl.deleteBuffer(mesh.uv_buffer);
			gl.deleteBuffer(mesh.rgba_buffer);
			gl.deleteBuffer(mesh.norm_buffer);
		}
		this.meshBank[tag] = mesh;
		this.runtime.redraw = true;
		//return mesh;
	};
	
	Acts.prototype.loadObjFile = function (url, tag)
	{
		var self = this;
		var request = new XMLHttpRequest();
		request.onreadystatechange = function(){
			if(this.readyState==4)
			{
				if(this.status==200)
					self.parseObjFile(this.responseText, tag);
				else
					console.log("error: can't load '"+url+"'.")
			}};
		request.open("GET", url, true);
		request.send();
	};
	
	Acts.prototype.loadTextureSprite = function (sprite, texTag)
	{
		if(texTag == "")
			console.log("Need to set a tag when loading a texture.");
		else
		{
			let obj = sprite.getFirstPicked();
			
			if (obj.curWebGLTexture && obj.curFrame && obj.curFrame.sheetTex)
			{
				let bank = this.textureBank;
				if(texTag in bank && !bank[texTag].isSprite)
					this.gl.deleteTexture(bank[texTag].tex);
				
				let rect = obj.curFrame.sheetTex;
				bank[texTag] = {tex:obj.curWebGLTexture, isSprite:true, rect:[rect.left, rect.top, rect.right, rect.bottom]};
				this.runtime.redraw = true;
			}
			else
				console.log("Type isn't a sprite.");
			
		}
	};
	
	Acts.prototype.loadTextureFile = function (url, texTag, filtering, repeat)
	{
		if(texTag == "")
			console.log("Need to set a tag when loading a texture.");
		else
		{
			var tex = this.loadTexture(url, filtering, repeat);
			var bank = this.textureBank;
			if(texTag in bank && !bank[texTag].isSprite)
				this.gl.deleteTexture(bank[texTag].tex);
			
			this.textureBank[texTag] = {tex:tex, isSprite:false, rect:[0,0,1,1]};
		}
	};

	Acts.prototype.unloadTexture = function (texTag)
	{
		var bank = this.textureBank;
		if(texTag != "" && texTag in bank && !bank[texTag].isSprite)
		{
			this.gl.deleteTexture(bank[textag].tex);
			delete bank[textag];
		}
		else
			console.log("Can't unload '" +texTag+ "' texture");
	};

	//////// Expressions ////////

	Exps.prototype.posX = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].pos[0]:0);};
	Exps.prototype.posY = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].pos[1]:0);};
	Exps.prototype.posZ = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].pos[2]:0);};
	
	Exps.prototype.scaleX = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].scale[0]:0);};
	Exps.prototype.scaleY = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].scale[1]:0);};
	Exps.prototype.scaleZ = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].scale[2]:0);};
	
	Exps.prototype.orientXX = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[0]:0);}; //todo: verify
	Exps.prototype.orientXY = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[1]:0);};
	Exps.prototype.orientXZ = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[2]:0);};
	Exps.prototype.orientYX = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[4]:0);};
	Exps.prototype.orientYY = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[5]:0);};
	Exps.prototype.orientYZ = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[6]:0);};
	Exps.prototype.orientZX = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[8]:0);};
	Exps.prototype.orientZY = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[9]:0);};
	Exps.prototype.orientZZ = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].orient[10]:0);};
	
	Exps.prototype.colorR = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].color[0]:0);};
	Exps.prototype.colorG = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].color[1]:0);};
	Exps.prototype.colorB = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].color[2]:0);};
	Exps.prototype.colorA = function (ret, tag) {ret.set_float((tag in this.objs)?this.objs[tag].color[3]:0);};
	
	Exps.prototype.meshTag = function (ret, tag) {ret.set_string((tag in this.objs)?this.objs[tag].meshTag:"");};
	Exps.prototype.textureTag = function (ret, tag) {ret.set_string((tag in this.objs)?this.objs[tag].texTag:"");};
	//Exps.prototype.group = function (ret, tag) {ret.set_string((tag in this.objs)?this.objs[tag].group:"");};

	pluginProto.cnds = new Cnds();
	pluginProto.acts = new Acts();
	pluginProto.exps = new Exps();
}());