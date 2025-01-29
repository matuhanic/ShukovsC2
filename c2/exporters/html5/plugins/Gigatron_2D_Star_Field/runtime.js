// ECMAScript 5 strict mode
"use strict";



assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

// global var please !!!	

var x_speed=0;
var y_speed=0;
 
var my2dstarfield;
var st_basecol,nbrs;
/////////////////////////////////////
// Plugin class
cr.plugins_.c2dstarfield = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.c2dstarfield.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

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

	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];

	instanceProto.effectToCompositeOp = function(effect)
	{
		// (none) = source-over
		if (effect <= 0 || effect >= 11)
			return "source-over";
			
		// (none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	
	instanceProto.updateBlend = function(effect)
	{
		var gl = this.runtime.gl;
		
		if (!gl)
			return;
			
		// default alpha blend
		this.srcBlend = gl.ONE;
		this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		
		switch (effect) {
		case 1:		// lighter (additive)
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.SRC_ALPHA;
			break;
		}	
	};


	
	instanceProto.onCreate=function(){function b(c,a){c=String(c).replace(/[^0-9a-f]/gi,"");6>c.length&&(c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2]);a=a||0;var b="#",d,e;for(e=0;3>e;e++)d=parseInt(c.substr(2*e,2),16),d=Math.round(Math.min(Math.max(0,d+d*a),255)).toString(16),b+=("00"+d).substr(d.length);return b}this.visible=0===this.properties[5];this.compositeOp=this.effectToCompositeOp(this.properties[1]);this.updateBlend(this.properties[0]);this.mycan=new canvas(0,0,"c2canvas");this.canvas=this.mycan.canvas;
this.canvas.width=this.width;this.canvas.height=this.height;this.ctx=this.mycan.canvas.getContext("2d");x_speed=this.properties[1];y_speed=this.properties[2];nbrs=this.properties[3];st_basecol=this.properties[4];var a=st_basecol.split("(")[1].split(")")[0],a=a.split(","),a=a.map(function(a){a=parseInt(a).toString(16);return 1==a.length?"0"+a:a}),a="#"+a.join(""),a=[{nb:.05*nbrs,speedy:1.5,speedx:1.5,color:b(a,0),size:2},{nb:.1*nbrs,speedy:1.2,speedx:1.2,color:b(a,-.2),size:2},{nb:.2*nbrs,speedy:1,
speedx:1,color:b(a,-.3),size:2},{nb:.3*nbrs,speedy:.9,speedx:.9,color:b(a,-.4),size:2},{nb:.4*nbrs,speedy:.7,speedx:.7,color:b(a,-.5),size:2},{nb:.5*nbrs,speedy:.5,speedx:.5,color:b(a,-.7),size:2},{nb:.6*nbrs,speedy:.3,speedx:.3,color:b(a,-.8),size:2},{nb:.8*nbrs,speedy:.1,speedx:.1,color:b(a,-.95),size:2}];my2dstarfield=new starfield2D_dot(this.mycan,a);this.runtime.tickMe(this)};

instanceProto.tick=function(){this.mycan.clear();my2dstarfield.draw();this.update_tex=this.runtime.redraw=!0};

  
    // called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
    
    // called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
            "canvas_w":this.canvas.width,
            "canvas_h":this.canvas.height,
            "image":this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
        var canvasWidth = this.canvas.width = o["canvas_w"];
        var canvasHeight = this.canvas.height = o["canvas_h"];
        var data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
        for (var y = 0; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                var index = (y * canvasWidth + x)*4;
                for (var c = 0; c < 4; ++c)
                data[index+c] = o["image"][index+c];
            }
        }
	 
	};
	
	
	instanceProto.draw_instances = function (instances, ctx)
    {
        for(var x in instances)
        {
            if(instances[x].visible==false && this.runtime.testOverlap(this, instances[x])== false)
                continue;
            
            ctx.save();
            ctx.scale(this.canvas.width/this.width, this.canvas.height/this.height);
            ctx.rotate(-this.angle);
            ctx.translate(-this.bquad.tlx, -this.bquad.tly);
            ctx.globalCompositeOperation = instances[x].compositeOp;//rojo

            if (instances[x].type.pattern !== undefined && instances[x].type.texture_img !== undefined) {
                instances[x].pattern = ctx.createPattern(instances[x].type.texture_img, "repeat");                
            }

            instances[x].draw(ctx);
            ctx.restore();
        }
    };
	
	instanceProto.draw = function(ctx)
	{	
		ctx.save();
		
		ctx.globalAlpha = this.opacity;
		ctx.globalCompositeOperation = this.compositeOp;
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
				
		ctx.drawImage(this.canvas,
						  0 - (this.hotspotX * this.width),
						  0 - (this.hotspotY * this.height),
						  this.width,
						  this.height);
		
		
		ctx.restore();
		
		
	};

	instanceProto.drawGL = function(glw)
	{
		
		glw.setBlend(this.srcBlend, this.destBlend);
        if (this.update_tex)
        {
            if (this.tex)
                glw.deleteTexture(this.tex);
            this.tex=glw.loadTexture(this.canvas, false, this.runtime.linearSampling);
            this.update_tex = false;
        }
		glw.setTexture(this.tex);
		glw.setOpacity(this.opacity);

		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			
			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
				
	};




	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
	 Acts.prototype.SetEffect = function (effect)
	 {	
		 this.compositeOp = this.effectToCompositeOp(effect);
		 this.runtime.redraw = true;
         this.update_tex = true;
	 };
		
	 
	Acts.prototype.SetSpeed = function (spd)
	{
	x_speed=spd;
		
	};
	Acts.prototype.SetYSpeed = function (spd)
	{
	y_speed=spd;
		
	};
 
	
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
		
    
    exps.AsJSON = function(ret)
    {
        ret.set_string( JSON.stringify({
			"c2array": true,
			"size": [1, 1, this.canvas.width * this.canvas.height * 4],
			"data": [[this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data]]
		}));
    };

}());

 

function canvas(l,m,p){this.width=l;this.height=m;this.canvas;this.contex;this.canvas=document.createElement("canvas");p&&document.getElementById(p).appendChild(this.canvas);this.canvas.setAttribute("width",l);this.canvas.setAttribute("height",m);this.contex=this.canvas.getContext("2d");this.handley=this.handlex=0;this.midhandled=!1;this.tilestart=this.tileh=this.tilew=0;this.fill=function(a){var b=this.contex.fillStyle,c=this.contex.globalAlpha;this.contex.globalAlpha=1;this.contex.fillStyle=a;this.contex.fillRect(0,
0,this.canvas.width,this.canvas.height);this.contex.fillStyle=b;this.contex.globalAlpha=c};this.clear=function(){this.contex.clearRect(0,0,this.canvas.width,this.canvas.height)};this.plot=function(a,b,c,e){var d=this.contex.fillStyle;this.contex.fillStyle=e;this.contex.fillRect(a,b,c,c);this.contex.fillStyle=d};this.line=function(a,b,c,e,d,g){var f=this.contex.strokeStyle;this.contex.strokeStyle=g;this.contex.lineWidth=d;this.contex.beginPath();this.contex.moveTo(a,b);this.contex.lineTo(c,e);this.contex.stroke();
this.contex.closePath();this.contex.strokeStyle=f};this.triangle=function(a,b,c,e,d,g,f){this.contex.beginPath();this.contex.moveTo(a,b);this.contex.lineTo(c,e);this.contex.lineTo(d,g);this.contex.closePath();this.contex.fillStyle=f;this.contex.fill()};this.quad=function(a,b,c,e,d,g,f,k,h){var n=this.contex.fillStyle;5==arguments.length?(this.contex.fillStyle=d,this.contex.fillRect(a,b,c,e)):(this.contex.beginPath(),this.contex.moveTo(a,b),this.contex.lineTo(c,e),this.contex.lineTo(d,g),this.contex.lineTo(f,
k),this.contex.closePath(),this.contex.fillStyle=h,this.contex.fill());this.contex.fillStyle=n};this.initTile=function(a,b,c){this.tileh=b;this.tilew=a;"undefined"!=typeof c&&(this.tilestart=c)};this.draw=function(a,b,c,e,d,g,f){var k=a.contex.globalAlpha;"undefined"==typeof e&&(e=1);a.contex.globalAlpha=e;3==arguments.length||4==arguments.length?a.contex.drawImage(this.canvas,b-this.handlex,c-this.handley):(5==arguments.length?(a.contex.translate(b,c),a.contex.rotate(d*Math.PI/180)):(a.contex.translate(b,
c),a.contex.rotate(d*Math.PI/180),a.contex.scale(g,f)),a.contex.translate(-this.handlex,-this.handley),a.contex.drawImage(this.canvas,0,0),a.contex.setTransform(1,0,0,1,0,0));a.contex.globalAlpha=k};this.drawTile=function(a,b,c,e,d,g,f,k){var h=a.contex.globalAlpha;"undefined"==typeof d&&(d=1);a.contex.globalAlpha=d;this.drawPart(a,c,e,Math.floor(b%(this.canvas.width/this.tilew))*this.tilew,Math.floor(b/(this.canvas.width/this.tilew))*this.tileh,this.tilew,this.tileh,d,g,f,k);a.contex.globalAlpha=
h};this.drawPart=function(a,b,c,e,d,g,f,k,h,n,l){if(!(0>=g||0>=f)){var m=a.contex.globalAlpha;"undefined"==typeof k&&(k=1);a.contex.globalAlpha=k;7==arguments.length||8==arguments.length?a.contex.translate(b,c):9==arguments.length?(a.contex.translate(b,c),a.contex.rotate(h*Math.PI/180)):(a.contex.translate(b,c),a.contex.rotate(h*Math.PI/180),a.contex.scale(n,l));1==this.midhandled?a.contex.translate(-g/2,-f/2):a.contex.translate(-this.handlex,-this.handley);a.contex.drawImage(this.canvas,e,d,g,f,
0,0,g,f);a.contex.setTransform(1,0,0,1,0,0);a.contex.globalAlpha=m}};this.setmidhandle=function(){this.handlex=parseInt(this.canvas.width/2);this.handley=parseInt(this.canvas.height/2);this.midhandled=!0};this.sethandle=function(a,b){this.handlex=a;this.handley=b;this.midhandled=!1};this.print=function(a,b,c,e,d,g,f,k){for(var h=0;h<b.length;h++)"undefined"!=typeof f?this.drawTile(a,b[h].charCodeAt(0)-this.tilestart,c+h*this.tilew*f,e,d,g,f,k):this.drawTile(a,b[h].charCodeAt(0)-this.tilestart,c+h*
this.tilew,e,d,g,f,k)};return this};
function starfield2D_dot(f,c){this.dst=f;this.stars=[];for(var d=0,b=0;b<c.length;b++)for(var e=0;e<c[b].nb;e++)this.stars[d]={x:Math.random()*this.dst.canvas.width,y:Math.random()*this.dst.canvas.height,speedx:c[b].speedx,speedy:c[b].speedy,color:c[b].color,size:c[b].size},d++;this.draw=function(){for(var a=0;a<this.stars.length;a++)this.dst.plot(this.stars[a].x,this.stars[a].y,this.stars[a].size,this.stars[a].color),this.stars[a].x+=this.stars[a].speedx*x_speed,this.stars[a].y+=this.stars[a].speedy*
y_speed,this.stars[a].x>this.dst.canvas.width&&(this.stars[a].x=0),0>this.stars[a].x&&(this.stars[a].x=this.dst.canvas.width),this.stars[a].y>this.dst.canvas.height&&(this.stars[a].y=0),0>this.stars[a].y&&(this.stars[a].y=this.dst.canvas.height)}};

