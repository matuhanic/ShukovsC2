// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.customDraw = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.customDraw.prototype;
		
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

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.scrapDrawList = true;
		this.drawList=[];
		this.vertList = [];
		
		this.curTexture = null;
		this.curTexRect = null;
		this.pointSize=1;		
		this.subRect = new cr.rect(0,0,1,1);
		this.porder = [0,1,2,3];
		
		this.texUV=[];
		for (var i=0; i<4;i++)
			this.texUV.push({u:0,v:0});
		
		this.tmpVec3 = vec3.create();
		this.mat = mat4.create();
		mat4.identity(this.mat);
		this.matStack = [];
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
		this.curTexture=null;
		this.curTexRect=null;
		this.drawList=[];
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
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
		for (var i=0; i<this.drawList.length; i++)
		{
			var cmd = this.drawList[i];
			glw.setTexture(cmd.texture);
			glw.setOpacity(cmd.opacity);
			
			if (cmd.type == 0)
			{
				var quads=cmd.quads;
				for (var j=0; j<quads.length; j++)
				{
					var q=quads[j];
					glw.quadTexUV(q[0].x, q[0].y, q[1].x, q[1].y, q[2].x, q[2].y, q[3].x, q[3].y,
								  q[0].u, q[0].v, q[1].u, q[1].v, q[2].u, q[2].v, q[3].u, q[3].v);
				}
			}
			else
			{
				var verts=cmd.verts;
				for (var j=0; j<verts.length; j++)
				{
					var v=verts[j];
					glw.point(v.x, v.y, cmd.pointSize*this.layer.getScale(), cmd.opacity);
				}
			}
		}
		
		
		this.vertList.length = 0;
		this.scrapDrawList = true;
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.matIdent = function ()
	{
		mat4.identity(this.mat);
	};
	
	Acts.prototype.matTrans = function (x,y)
	{
		this.tmpVec3[0] = x;
		this.tmpVec3[1] = y;
		this.tmpVec3[2] = 0;
		mat4.translate(this.mat, this.tmpVec3);
	};
	
	Acts.prototype.matScale = function (x,y)
	{
		this.tmpVec3[0] = x;
		this.tmpVec3[1] = y;
		this.tmpVec3[2] = 1;
		mat4.scale(this.mat, this.tmpVec3);
	};
	
	Acts.prototype.matRotate = function (deg)
	{
		mat4.rotateZ(this.mat, deg*Math.PI/180);
	};
	
	Acts.prototype.matShear = function (x,y)
	{
		x=Math.tan(x*Math.PI/180);
		y=Math.tan(y*Math.PI/180);
		var a=this.mat;
		var d=a[0],e=a[1],g=a[2],f=a[3],
			h=a[4],i=a[5],j=a[6],k=a[7]; 
		a[0]+=y*h;
		a[1]+=y*i;
		a[2]+=y*j;
		a[3]+=y*k;
		a[4]+=x*d;
		a[5]+=x*e;
		a[6]+=x*g;
		a[7]+=x*f;
	};
	
	Acts.prototype.matPush = function ()
	{
		this.matStack.push(mat4.create(this.mat));
	};
	
	Acts.prototype.matPop = function ()
	{
		if (this.matStack.length>0)
		{
			this.mat = this.matStack.pop();
		}
		else
		{
			mat4.identity(this.mat);
			console.log("customDraw plugin: WARNING Matrix pop action used on empty stack.");
		}
	};
	
	Acts.prototype.matLoad = function (json_string)
	{
		try{
			var obj = JSON.parse(json_string);
			if (obj.length == 16)
				mat4.set(obj, this.mat);
			else
				throw true;
		}catch(e){
			console.log("customDraw plugin: ERROR Matrix load action fail.");
		}
	};
	
	function lerp(a, b, t)
	{
		return a*(t-1)+b*t;
	}
	
	Acts.prototype.setTexFromSprite = function (type)
	{
		var obj = type.getFirstPicked();
		if (obj.curWebGLTexture && obj.curFrame && obj.curFrame.sheetTex)
		{
			this.curTexture = obj.curWebGLTexture;

			this.curTexRect = obj.curFrame.sheetTex;
			this.subRect.copy(this.curTexRect);
		}
		else
			console.log("customDraw plugin: ERROR set texture from sprite action fail");
	};
	
	Acts.prototype.vertexXY = function (x,y)
	{
		var tmpVec3 = this.tmpVec3;
		tmpVec3[0] = x;
		tmpVec3[1] = y;
		tmpVec3[2] = 0;
		mat4.multiplyVec3(this.mat, tmpVec3);
		
		var u,v, rc=this.subRect;
		switch(this.porder[this.vertList.length%4])
		{
			case 0:
			u=rc.left; v=rc.top; break;
			case 1:
			u=rc.right; v=rc.top; break;
			case 2:
			u=rc.right; v=rc.bottom; break;
			case 3:
			u=rc.left; v=rc.bottom; break;
		}
		this.vertList.push({x:tmpVec3[0]+this.x, y:tmpVec3[1]+this.y, u:u, v:v});
	};
	
	// Acts.prototype.vertexUV = function (u,v)
	// {
		// if (this.vertList.length >0)
		// {
			// var vert = this.vertList[this.vertList.length-1];
			// vert.u = u;
			// vert.v = v;
		// }
		// else
			// console.log("customDraw plugin: ERROR vertex uv action used without any vertices.");
	// };
	
	Acts.prototype.vertexXYUV = function (x,y,u,v)
	{
		var tmpVec3 = this.tmpVec3;
		tmpVec3[0] = x;
		tmpVec3[1] = y;
		tmpVec3[2] = 0;
		var bnds = this.curTexRect;
		u = lerp(bnds.left, bnds.right, u);
		v = lerp(bnds.left, bnds.right, v);
		mat4.multiplyVec3(this.mat, tmpVec3);
		this.vertList.push({x:tmpVec3[0]+this.x, y:tmpVec3[1]+this.y, u:u, v:v});
	};
	
	Acts.prototype.addRect = function (left, top, right, bottom)
	{
		Acts.prototype.vertexXY.call(this, left, top);
		Acts.prototype.vertexXY.call(this, right, top);
		Acts.prototype.vertexXY.call(this, right, bottom);
		Acts.prototype.vertexXY.call(this, left, bottom);
	};
	
	Acts.prototype.setTexSubRect = function (x0, y0, x1, y1)
	{
		var rc = this.curTexRect;
		this.subRect.set(lerp(rc.left, rc.right, x0),
						 lerp(rc.top, rc.bottom, y0),
						 lerp(rc.left, rc.right, x1),
						 lerp(rc.top, rc.bottom, y1)
						);
	};
	
	Acts.prototype.setTexSubGrid = function (gx,gy,tile)
	{
		if(tile<0 || tile>gx*gy)
		{
			console.log("Custom draw: ERROR set sub-texture from grid action. Invalid tile");
			return;
		}
		var x = tile%gx;
		var y = Math.floor(tile/gx);
		var rc=this.curTexRect;
		this.subRect.set(lerp(rc.left, rc.right, x/gx),
						 lerp(rc.top, rc.bottom, y/gy),
						 lerp(rc.left, rc.right, (x+1)/gx),
						 lerp(rc.top, rc.bottom, (y+1)/gy)
						);
	};
	
	function setArray4(arr, a,b,c,d)
	{
		arr[0]=a;
		arr[1]=b;
		arr[2]=c;
		arr[3]=d;
	}
	
	Acts.prototype.setTexSubOrient = function (mirror, flip, rot)
	{
		if(rot<0)
			rot=0;
		if(rot>3)
			rot=3;
		
		var combo = 0;
		if (!mirror && !flip)
			combo=rot;
		else if(!mirror && flip)
			combo=rot+4;
		else if(mirror && !flip)
			combo=(rot+2)%4+4;
		else //if(mirror && flip)
			combo=(rot+2)%4;
		switch(combo)
		{
			case 0:	setArray4(this.porder, 0,1,2,3); break;
			case 1:	setArray4(this.porder, 3,0,1,2); break;
			case 2:	setArray4(this.porder, 2,3,0,1); break;
			case 3:	setArray4(this.porder, 1,2,3,0); break;
			case 4:	setArray4(this.porder, 3,2,1,0); break;
			case 5:	setArray4(this.porder, 2,1,0,3); break;
			case 6:	setArray4(this.porder, 1,0,3,2); break;
			case 7:	setArray4(this.porder, 0,3,2,1); break;
		}
	};
	
	Acts.prototype.setPointSize = function (size)
	{
		this.pointSize = size;
	};
	
	Acts.prototype.drawElements = function (type)
	{
		if(this.scrapDrawList)
		{
			this.scrapDrawList = false;
			this.drawList.length=0;
		}
		
		var vList=this.vertList, vCount=vList.length;
		
		if(type==0)
		{
			var quads = [];
			for(var i=0;i<vCount-3; i+=4)
			{
				quads.push([vList[i],vList[i+1],vList[i+2],vList[i+3]]);
			}
			this.drawList.push({type:0,texture:this.curTexture, opacity:this.opacity, quads:quads});
			this.vertList.length =0;
		}
		else
		{
			this.drawList.push({type:1,texture:this.curTexture, opacity:this.opacity, pointSize:this.pointSize, verts:vList});
			this.vertList = [];
		}
		
		this.runtime.redraw = true;
	};
	
	Acts.prototype.clearVertList = function ()
	{
		this.vertList.length = 0;
	};
	
	Acts.prototype.clearDrawing = function ()
	{
		this.drawList.length=0;
		this.runtime.redraw = true;
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.matrixAsJSON = function (ret)
	{
		ret.set_string(mat4.str(this.mat));
	};
	
	// probably should cache the result somehow.
	Exps.prototype.getTransformedX = function (ret, x, y)
	{
		var tmpVec3 = this.tmpVec3;
		tmpVec3[0] = x;
		tmpVec3[1] = y;
		tmpVec3[2] = 0;
		mat4.multiplyVec3(this.mat, tmpVec3);
		ret.set_float(tmpVec3[0]);
	};
	
	Exps.prototype.getTransformedY = function (ret, x, y)
	{
		var tmpVec3 = this.tmpVec3;
		tmpVec3[0] = x;
		tmpVec3[1] = y;
		tmpVec3[2] = 0;
		mat4.multiplyVec3(this.mat, tmpVec3);
		ret.set_float(tmpVec3[1]);
	};
	
	Exps.prototype.textureU = function (ret, index)
	{
		if(index<0 || index>3)
		{
			ret.set_float(0);
			return;
		}
		var rc=this.subRect;
		switch(this.porder[index])
		{
			case 0:
			case 3:
			ret.set_float(rc.left); break;
			case 1:
			case 2:
			ret.set_float(rc.right); break;
		}
	};
	
	Exps.prototype.textureV = function (ret, index)
	{
		if(index<0 || index>3)
		{
			ret.set_float(0);
			return;
		}
		var rc=this.subRect;
		switch(this.porder[index])
		{
			case 0:
			case 1:
			ret.set_float(rc.top); break;
			case 2:
			case 3:
			ret.set_float(rc.bottom); break;
		}
	};
	
	pluginProto.exps = new Exps();

}());