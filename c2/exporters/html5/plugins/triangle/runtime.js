"use strict";
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

//////// Plugin class ////////
cr.plugins_.Triangle = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	//////// Object type class ////////
	var pluginProto = cr.plugins_.Triangle.prototype;
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
		var gl = this.gl = this.runtime.glwrap.gl;

		//console.log(this.runtime.running_layout);

		this.textureBank={};
		this.meshBank={};
		this.meshData = {xyz:[], uv:[], rgba:[], count:0};
		this.toDraw = [];
		this.color = [1.0, 1.0, 1.0, 1.0];

		//create default texture
		var defaultTex = gl.createTexture();
		var oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
		gl.bindTexture(gl.TEXTURE_2D, defaultTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		this.textureBank[""] = defaultTex;

		// setup
		this.drawWidth = this.width = this.runtime.original_width;
		this.drawHeight = this.height = this.runtime.original_height;
		this.runtime.tickMe(this); //always position on screen

		this.viewMat = mat4.create();
		this.setupView(false, 45, 10000);
		this.cameraMat = mat4.create();
		//this.modelMat = mat4.create();

		this.camera = {x:0,y:0,z:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
		this.model =  {x:0,y:0,z:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

		// init 3d
		this.createShader();
		this.createFramebuffer();
	};

	/////// 3d stuff //////
	instanceProto.vec3 = function(x,y,z) {var v=this.tmpVec3 || (this.tmpVec3=vec3.create()); v[0]=x; v[1]=y; v[2]=z; return v;};

	instanceProto.vertex = function(x,y,z,u,v)
	{
		var mesh = this.meshData;
		mesh.xyz.push(x,-y,-z);  //to flip y
		mesh.uv.push(u,v);
		var c = this.color;
		mesh.rgba.push(c[0],c[1],c[2],c[3]);
		mesh.count += 1;
	};

	instanceProto.setupView = function(orthographic, fov, far)
	{
		this.orthographic = orthographic;
		this.fov = fov;
		this.far = far;

		if(orthographic)
			mat4.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2, 1, far, this.viewMat);
		else
			mat4.perspective(fov, this.width / this.height, 1, far, this.viewMat);
		this.camz = this.height/2/Math.tan(fov*Math.PI/360);

	};
	instanceProto.loadTexture = function(url)
	{
		var gl = this.gl;
		var texture = gl.createTexture();
		var oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
		gl.bindTexture(gl.TEXTURE_2D, oldTex);

		const image = new Image();
		image.onload = function() {
			oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.bindTexture(gl.TEXTURE_2D, oldTex);
		};
		image.src = url;
		return texture;
	}

	instanceProto.createShader = function()
	{
		var gl = this.gl;

		var vs = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vs, "attribute highp vec3 aPos;"+
							"attribute highp vec4 aColor;"+
							"attribute highp vec2 aTex;"+
							"varying highp vec2 vTex;"+
							"varying highp vec4 vColor;"+
							"uniform highp mat4 uView;"+
							"uniform highp mat4 uCamera;"+
							"uniform highp mat4 uModel;"+
							"void main(void) "+
							"{"+
							"    gl_Position = uView*uCamera*uModel*vec4(aPos, 1.0);"+
							"    vTex = aTex;"+
							"    vColor = aColor;"+
							"}");
		gl.compileShader(vs);
		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
			console.log(gl.getShaderInfoLog(vs));

		var fs = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fs, "varying highp vec2 vTex;"+
							"varying highp vec4 vColor;"+
							"uniform highp sampler2D uSampler;"+
							"void main(void) {"+
							"    gl_FragColor = vColor*texture2D(uSampler, vTex);"+
							"    gl_FragColor *= vColor.a;"+ //premultiply
							"}");
		gl.compileShader(fs);
		if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
			console.log(gl.getShaderInfoLog(fs));

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vs);
		gl.attachShader(shaderProgram, fs);
		gl.linkProgram(shaderProgram);
		//console.log(gl.getProgramInfoLog(shaderProgram));

		var shader = this.shader = {};
		shader.program = shaderProgram;

		shader.aPos = gl.getAttribLocation(shaderProgram, "aPos");
		gl.enableVertexAttribArray(shader.aPos);
		shader.aColor = gl.getAttribLocation(shaderProgram, "aColor");
		gl.enableVertexAttribArray(shader.aColor);
		shader.aTex = gl.getAttribLocation(shaderProgram, "aTex");
		gl.enableVertexAttribArray(shader.aTex);
		shader.uView = gl.getUniformLocation(shaderProgram, "uView");
		shader.uCamera = gl.getUniformLocation(shaderProgram, "uCamera");
		shader.uModel = gl.getUniformLocation(shaderProgram, "uModel");
		shader.uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
	}

	instanceProto.createFramebuffer = function()
	{
		var gl = this.gl;

		//save
		var oldFb = gl.getParameter(gl.FRAMEBUFFER_BINDING);
		var oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
		var oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		//var oldRB = gl.getParameter(gl.RENDERBUFFER_BINDING);

		var mesh = {count:6};
		mesh.xyz = [-1,-1, 0, //tri 1
					 1,-1, 0,
					 1, 1, 0,
					-1,-1, 0, //tri 2
					 1, 1, 0,
					-1, 1, 0];
		mesh.uv = [	0, 0, //tri 1
					1, 0,
					1, 1,
					0, 0, //tri 2
					1, 1,
					0, 1];
		mesh.rgba = [1,1,1,1, //tri 1
					1,1,1,1,
					1,1,1,1,
					1,1,1,1, //tri 2
					1,1,1,1,
					1,1,1,1];

		var xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.xyz), gl.STATIC_DRAW);
		mesh.xyz_buffer = xyz_buffer;

		var uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uv), gl.STATIC_DRAW);
		mesh.uv_buffer = uv_buffer;

		var rgba_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, rgba_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.rgba), gl.STATIC_DRAW);
		mesh.rgba_buffer = rgba_buffer;

		this.fbMesh = mesh;

		//framebuffer
		var fbTex = gl.createTexture();
		this.fbTex = fbTex;
		gl.bindTexture(gl.TEXTURE_2D, fbTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		var fb = gl.createFramebuffer();
		this.fb = fb;
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTex, 0);

		//add depth
		var depthbuf = this.depthbuf = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuf);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuf);

		//matrix
		this.fbMat = mat4.create();
		mat4.identity(this.fbMat);

		//restore state
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		gl.bindFramebuffer(gl.FRAMEBUFFER, oldFb);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);
		//gl.bindRenderbuffer(gl.RENDERBUFFER, oldRB);
	}

	function errorcheck()
	{
		var gl = rojo.gl;
		var err = gl.getError();
		if(err)
			console.log(err);
	}

	instanceProto.onDestroy = function ()
	{
		// todo: cleanup
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
		}
	};

	instanceProto.draw = function(ctx){};
	instanceProto.drawGL = function(glw)
	{
		glw.endBatch();
		var gl=glw.gl;

		//save old renderer state
		var oldProgram = gl.getParameter(gl.CURRENT_PROGRAM);
		var oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
		var oldTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
		var oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		var oldFb = gl.getParameter(gl.FRAMEBUFFER_BINDING);
		var oldViewport = gl.getParameter(gl.VIEWPORT);

		//gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		//gl.clearDepth(0);
		gl.depthFunc(gl.LEQUAL);

		var shader = this.shader;
		gl.useProgram(shader.program);

		// draw to framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

		//update fbTex and depth buffer size as needed.
		if(this.drawWidth !== glw.width && this.drawHeight !== glw.height)
		{
			//console.log("resizing...");
			this.drawWidth = glw.width;
			this.drawHeight = glw.height;
			gl.bindTexture(gl.TEXTURE_2D, this.fbTex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.drawWidth, this.drawHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbuf);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.drawWidth, this.drawHeight);
		}

		gl.viewport(0, 0, this.drawWidth, this.drawHeight);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.activeTexture(gl.TEXTURE0);

		// veiw matrix
		var l = this.runtime.running_layout;
		this.transform(this.cameraMat, this.camera);
		mat4.translate(this.cameraMat, this.vec3(-l.scrollX, l.scrollY, -this.camz)); // apply scroll

		gl.uniformMatrix4fv(shader.uView, false,  this.viewMat);
		gl.uniformMatrix4fv(shader.uCamera, false, this.cameraMat);

		var batch;
		for(var i in this.toDraw)
		{
			batch = this.toDraw[i];
			// set texture
			gl.bindTexture(gl.TEXTURE_2D, batch.texture);

			//todo: incorperate batch.color as uniform.  Need to be added to shader.

			//select buffers from batch and draw triangles
			gl.bindBuffer(gl.ARRAY_BUFFER, batch.xyz_buffer);
			gl.vertexAttribPointer(shader.aPos, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, batch.rgba_buffer);
			gl.vertexAttribPointer(shader.aColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, batch.uv_buffer);
			gl.vertexAttribPointer(shader.aTex, 2, gl.FLOAT, false, 0, 0);

			gl.uniformMatrix4fv(shader.uModel, false, batch.mat);
			gl.drawArrays(gl.TRIANGLES, 0, batch.count);

			if(batch.temp)
			{
				gl.deleteBuffer(batch.xyz_buffer);
				gl.deleteBuffer(batch.uv_buffer);
				gl.deleteBuffer(batch.rgba_buffer);
			}
		}
		this.toDraw.length = 0;

		// draw fbtex to screen
		gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
		gl.bindFramebuffer(gl.FRAMEBUFFER, oldFb);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.fbTex);

		var mesh = this.fbMesh;
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
		gl.vertexAttribPointer(shader.aPos, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.rgba_buffer);
		gl.vertexAttribPointer(shader.aColor, 4, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
		gl.vertexAttribPointer(shader.aTex, 2, gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(shader.uView, false,  this.fbMat);
		gl.uniformMatrix4fv(shader.uCamera, false, this.fbMat);
		gl.uniformMatrix4fv(shader.uModel, false, this.fbMat);
		gl.drawArrays(gl.TRIANGLES, 0, mesh.count);

		//restore renderer state
		gl.useProgram(oldProgram);
		gl.activeTexture(oldActive);
		gl.bindTexture(gl.TEXTURE_2D, oldTex);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);
		//gl.disable(gl.CULL_FACE);
		gl.disable(gl.DEPTH_TEST);
	};

	function Cnds() {};
	function Acts() {};
	function Exps() {};

	//////// Conditions ////////

	// Cnds.prototype.bar = function ()
	// {
		// return true;
	// };

	//////// Actions ////////
	Acts.prototype.setPosition = function (x,y,z)
	{
		var m = this.model;
		m.x=x; m.y=y; m.z=z;
	};
	Acts.prototype.setScale = function (x,y,z)
	{
		var m = this.model;
		m.sx=x; m.sy=y; m.sz=z;
	};
	Acts.prototype.setRotation = function (x,y,z)
	{
		var m = this.model;
		var rad = Math.PI/180;
		m.rx=x*rad; m.ry=y*rad; m.rz=z*rad;
	};
	Acts.prototype.resetMatrix = function ()
	{
		var m = this.model;
		m.x=0; m.y=0; m.z=0;
		m.sx=1; m.sy=1; m.sz=1;
		m.rx=0; m.ry=0; m.rz=0;
	};

	Acts.prototype.setupCamera = function (mode, fov, far)
	{
		this.setupView(mode, fov, far);
		this.runtime.redraw = true;
	};

	Acts.prototype.setCameraPosition = function (x,y,z)
	{
		var m = this.camera;
		m.x=-x; m.y=-y; m.z=-z;
		this.runtime.redraw = true;
	};
	Acts.prototype.setCameraScale = function (x,y,z)
	{
		var m = this.camera;
		m.sx=x; m.sy=y; m.sz=z;
		this.runtime.redraw = true;
	};
	Acts.prototype.setCameraRotation = function (x,y,z)
	{
		var m = this.camera;
		var rad = Math.PI/180;
		m.rx=-x*rad; m.ry=-y*rad; m.rz=-z*rad;
		this.runtime.redraw = true;
	};
	Acts.prototype.resetCameraMatrix = function ()
	{
		var m = this.camera;
		m.x =0; m.y =0; m.z =0;
		m.sx=1; m.sy=1; m.sz=1;
		m.rx=0; m.ry=0; m.rz=0;
		this.runtime.redraw = true;
	};

	instanceProto.parseObjFile = function (data, tag)
	{
		var v=[], vt=[];
		var xyz=[], uv=[], rgba=[], count=0;

		var lines = data.split('\n');
		var indexes, tri = [1,2,3], quad = [1,2,3,1,3,4];
		for(var n=0; n<lines.length; ++n)
		{
			var tokens = lines[n].split(" ");
			switch(tokens[0])
			{
				case "v":
					v.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
					break;
				case "vt":
					vt.push([parseFloat(tokens[1]), 1-parseFloat(tokens[2])]);
					break;
				case "f":
					indexes = (tokens.length==4)?tri:quad;
					for(var i=0; i<indexes.length; ++i)
					{
						var elem = tokens[indexes[i]].split('/');
						var i0 = parseInt(elem[0])-1; //vert
						var i1 = parseInt(elem[1])-1; //tex
						xyz.push(v[i0][0], v[i0][1], v[i0][2]);
						uv.push(vt[i1][0], vt[i1][1]);
						count++;
					}
					break;
				default:
					continue;
			}
		}

		var mesh ={};
		mesh.count = count;

		var gl = this.gl;
		var oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		mesh.xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(xyz), gl.STATIC_DRAW);

		mesh.rgba_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.rgba_buffer);
		var arr = new Float32Array(count*4);
		for(var i=0; i<arr.length; i++)
			arr[i]=1;
		gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

		mesh.uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);

		//todo: maybe unload first if tag already used?
		if(tag in this.meshBank)
			console.log("warning: mesh tag '"+tag+"' already used");
		this.meshBank[tag] = mesh;
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

	Acts.prototype.saveMesh = function (tag)
	{
		var gl = this.gl;
		var data = this.meshData;

		var mesh = {};
		mesh.count = data.count;

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
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);

		//reset data
		data.count=0;
		data.xyz.length=0;
		data.uv.length=0;
		data.rgba.length=0;

		//todo: maybe unload first if tag already used?
		if(tag in this.meshBank)
			console.log("warning: mesh tag '"+tag+"' already used");
		this.meshBank[tag] = mesh;
	};

	Acts.prototype.addVertex = function (x,y,z,u,v)
	{
		this.vertex(x, y, z, u, v);
	};

	Acts.prototype.setColor = function (r,g,b,a)
	{
		var c = this.color;
		c[0]=r; c[1]=g; c[2]=b; c[3]=a;
	};

	/*to remove*/	Acts.prototype.setTexture = function (textag) {};

	instanceProto.texFromTag = function (tag)
	{
		if(tag in this.textureBank)
			return this.textureBank[tag];
		console.log("Unknown texture tag '"+tag+"'.");
		return this.textureBank[""];  //use default
	};

	instanceProto.transform = function (m, t)
	{
		mat4.identity(m);
		mat4.translate(m, this.vec3(t.x, -t.y, -t.z));
		mat4.rotateX(m, t.rx);
		mat4.rotateY(m, t.ry);
		mat4.rotateZ(m, -t.rz);
		mat4.scale(m, this.vec3(t.sx, t.sy, t.sz));
		return m;
	};

	Acts.prototype.drawTriangles = function (textag)
	{
		var gl = this.gl;
		var data = this.meshData;

		if(data.count == 0)
			return;

		var batch = {};
		batch.temp = true;
		batch.count = data.count;
		batch.texture = this.texFromTag(textag);
		batch.color = [1,1,1,1];
		batch.mat = this.transform(mat4.create(), this.model);

		var oldBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
		batch.xyz_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, batch.xyz_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.xyz), gl.DYNAMIC_DRAW);

		batch.rgba_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, batch.rgba_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.rgba), gl.DYNAMIC_DRAW);

		batch.uv_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, batch.uv_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.uv), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, oldBinding);

		//reset data
		data.count=0;
		data.xyz.length=0;
		data.uv.length=0;
		data.rgba.length=0;

		this.toDraw.push(batch);
		this.runtime.redraw = true;
	};

	Acts.prototype.drawMesh = function (meshtag, textag)
	{
		var mesh;
		if(meshtag in this.meshBank)
			mesh = this.meshBank[meshtag];
		else{
			//console.log("Unknown mesh tag used with 'draw mesh'.");
			return;
		}

		if(mesh.count ==0)
			return;

		var batch = {};
		batch.temp = false;
		batch.count = mesh.count;
		batch.xyz_buffer = mesh.xyz_buffer;
		batch.rgba_buffer = mesh.rgba_buffer;
		batch.uv_buffer = mesh.uv_buffer;
		batch.texture = this.texFromTag(textag);
		batch.color = this.color.slice(); //copy
		batch.mat = this.transform(mat4.create(), this.model);

		this.toDraw.push(batch);
		this.runtime.redraw = true;
	};

	Acts.prototype.loadTextureFile = function (url, texTag)
	{
		if(texTag == "")
			console.log("Need to set a tag when loading a texture.");
		else
		{
			var tex = this.loadTexture(url);
			var bank = this.textureBank;
			if(texTag in bank)
			{
				this.gl.deleteTexture(bank[texTag]);
				delete bank[texTag];
			}
			this.textureBank[texTag]= tex;
		}
	};

	Acts.prototype.unloadTexture = function (texTag)
	{
		var bank = this.textureBank;
		if(texTag == "" && texTag in bank)
		{
			this.gl.deleteTexture(bank[textag]);
			delete bank[textag];
		}
		else
			console.log("Can't unload '" +texTag+ "' texture");
	};

	Acts.prototype.calcAxisFromRot = function (rx,ry,rz)
	{
		var m = this.calcMat || (this.calcMat=mat4.create());
		var rad = Math.PI/180;
		mat4.identity(m);
		mat4.rotateX(m, rx);	//todo: maybe skip if angle is 0?
		mat4.rotateY(m, ry);
		mat4.rotateZ(m, -rz);
		//mat4.multiplyVec3(m, this.tmpVec3);
	};

	//////// Expressions ////////

	Exps.prototype.vecX = function (ret, index)
	{
		if(index<0 || index>2)
			ret.set_float(0);
		else
			ret.set_float(this.calcMat[index*4+0]);
	};
	Exps.prototype.vecY = function (ret, index)
	{
		if(index<0 || index>2)
			ret.set_float(0);
		else
			ret.set_float(this.calcMat[index*4+1]);
	};
	Exps.prototype.vecZ = function (ret, index)
	{
		if(index<0 || index>2)
			ret.set_float(0);
		else
			ret.set_float(this.calcMat[index*4+2]);
	};

	Exps.prototype.cameraZoffset = function (ret)
	{
		ret.set_float(-this.camz);
	};


	pluginProto.cnds = new Cnds();
	pluginProto.acts = new Acts();
	pluginProto.exps = new Exps();
}());