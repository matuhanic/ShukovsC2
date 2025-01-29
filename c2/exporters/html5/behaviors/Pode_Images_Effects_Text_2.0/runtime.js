// Copyright 2010 futomi  http://www.html5.jp/
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// perspective.js v0.0.2
// 2010-08-28
//from http://www.html5.jp/test/perspective_canvas/demo1_en.html
function perspective_create_canvas_context (w, h) {
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext('2d');
	return ctx;
};

function perspective_set_clipping_path(ctx, points) {
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for( var i=1; i<points.length; i++ ) {
		ctx.lineTo(points[i][0], points[i][1]);
	}
	ctx.closePath();
	ctx.clip();
};
function perspective(inst,_ctxd, image) {
	// check the arguments
	if( ! _ctxd || ! _ctxd.strokeStyle ) { return; }
	if( ! image || ! image.width || ! image.height ) { return; }
	// prepare a <canvas> for the image
	/*var */inst.cvso = document.createElement('canvas');
	inst.cvso.width = parseInt(image.width);
	inst.cvso.height = parseInt(image.height);
	/*var */inst.ctxo = inst.cvso.getContext('2d');
	inst.ctxo.drawImage(image, 0, 0, inst.cvso.width, inst.cvso.height);
	// prepare a <canvas> for the transformed image
	/*var */inst.cvst = document.createElement('canvas');
	inst.cvst.width = _ctxd.canvas.width;
	inst.cvst.height = _ctxd.canvas.height;
	/*var */inst.ctxt = inst.cvst.getContext('2d');
	// parameters
	/*this.p = {
		ctxd: ctxd,
		cvso: cvso,
		ctxo: ctxo,
		ctxt: ctxt
	}*/
	inst.ctxd = _ctxd;
	//jQuery("body").append(cvso);
	//jQuery("body").append(cvst);
};

/* -------------------------------------------------------------------
* public methods
* ----------------------------------------------------------------- */
function perspective_draw (inst,points) {
	var d0x = points[0][0];
	var d0y = points[0][1];
	var d1x = points[1][0];
	var d1y = points[1][1];
	var d2x = points[2][0];
	var d2y = points[2][1];
	var d3x = points[3][0];
	var d3y = points[3][1];
	// compute the dimension of each side
	var dims = [
		Math.sqrt( Math.pow(d0x-d1x, 2) + Math.pow(d0y-d1y, 2) ), // top side
		Math.sqrt( Math.pow(d1x-d2x, 2) + Math.pow(d1y-d2y, 2) ), // right side
		Math.sqrt( Math.pow(d2x-d3x, 2) + Math.pow(d2y-d3y, 2) ), // bottom side
		Math.sqrt( Math.pow(d3x-d0x, 2) + Math.pow(d3y-d0y, 2) )  // left side
	];
	//
	var ow =/* this.p.*/inst.cvso.width;
	var oh = /*this.p.*/inst.cvso.height;
	// specify the index of which dimension is longest
	var base_index = 0;
	var max_scale_rate = 0;
	var zero_num = 0;
	for( var i=0; i<4; i++ ) {
		var rate = 0;
		if( i % 2 ) {
			rate = dims[i] / ow;
		} else {
			rate = dims[i] / oh;
		}
		if( rate > max_scale_rate ) {
			base_index = i;
			max_scale_rate = rate;
		}
		if( dims[i] == 0 ) {
			zero_num ++;
		}
	}
	if(zero_num > 1) { return; }
	//
	var step = 2;
	var cover_step = step * 5;
	//
	/*var ctxo = this.p.ctxo;
	var ctxt = this.p.ctxt;*/
	inst.ctxt.clearRect(0, 0, inst.ctxt.canvas.width, inst.ctxt.canvas.height);
	if(base_index % 2 == 0) { // top or bottom side
		var ctxl = perspective_create_canvas_context(ow, cover_step);
		var cvsl = ctxl.canvas;
		for( var y=0; y<oh; y+=step ) {
			var r = y / oh;
			var sx = d0x + (d3x-d0x) * r;
			var sy = d0y + (d3y-d0y) * r;
			var ex = d1x + (d2x-d1x) * r;
			var ey = d1y + (d2y-d1y) * r;
			var ag = Math.atan( (ey-sy) / (ex-sx) );
			var sc = Math.sqrt( Math.pow(ex-sx, 2) + Math.pow(ey-sy, 2) ) / ow;
			ctxl.setTransform(1, 0, 0, 1, 0, -y);
			ctxl.drawImage(inst.ctxo.canvas, 0, 0);
			//
			inst.ctxt.translate(sx, sy);
			inst.ctxt.rotate(ag);
			inst.ctxt.scale(sc, sc);
			inst.ctxt.drawImage(cvsl, 0, 0);
			//
			inst.ctxt.setTransform(1, 0, 0, 1, 0, 0);
		}
	} else if(base_index % 2 == 1) { // right or left side
		var ctxl = perspective_create_canvas_context(cover_step, oh);
		var cvsl = ctxl.canvas;
		for( var x=0; x<ow; x+=step ) {
			var r =  x / ow;
			var sx = d0x + (d1x-d0x) * r;
			var sy = d0y + (d1y-d0y) * r;
			var ex = d3x + (d2x-d3x) * r;
			var ey = d3y + (d2y-d3y) * r;
			var ag = Math.atan( (sx-ex) / (ey-sy) );
			var sc = Math.sqrt( Math.pow(ex-sx, 2) + Math.pow(ey-sy, 2) ) / oh;
			ctxl.setTransform(1, 0, 0, 1, -x, 0);
			ctxl.drawImage(inst.ctxo.canvas, 0, 0);
			//
			inst.ctxt.translate(sx, sy);
			inst.ctxt.rotate(ag);
			inst.ctxt.scale(sc, sc);
			inst.ctxt.drawImage(cvsl, 0, 0);
			//
			inst.ctxt.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
	// set a clipping path and draw the transformed image on the destination canvas.
	/*this.p.*/inst.ctxd.save();
	perspective_set_clipping_path(/*this.p.*/inst.ctxd, [[d0x, d0y], [d1x, d1y], [d2x, d2y], [d3x, d3y]]);
	/*this.p.*/inst.ctxd.drawImage(inst.ctxt.canvas, 0, 0);
	/*this.p.*/inst.ctxd.restore();
}

// ECMAScript 5 strict mode
"use strict";

////////////////////////////////////////////////////////////////////////
/*var Mapper = function(width,height,filter) {
    
    var map = [];
    
    this.flower = function(px,py) {
        var x = px-width/2;
        var y = py-height/2;
        var r = Math.sqrt(x*x+y*y);
        var maxr = width/2;
        var a = Math.atan2(y,x);
        var d = r*Math.sin(a*7);
        // if (d>0) return {'x':px,'y':py}
        return {
            'x': px+Math.cos(a)*d*0.4,
            'y': py+Math.sin(a)*d*0.4
        }
    }
    
    this.pyramid = function(px,py) {
        px = px - height/2;
        py = py - height/2;
        var distance = Math.max(Math.abs(px),Math.abs(py));
        px *= distance/width*2;
        py *= distance/height*2;
        return {
            'x': px+width/2,
            'y': py+height/2
        }
    }
    
    this.zoom = function(px,py) {
        return {
            'x': (px+width/2)*0.5,
            'y': (py+height/2)*0.5
        }
    }
    

    this.reflect = function(px,py) {
        if (py<height/2) return {
            'x': px,
            'y': py
        }
        var dx = (py-height/2)*(-px+width/2)/width;
        return {
            'x': px+dx,
            'y': height-py
        }
    }
    
    this.twirl = function(px,py) {
        var x = px-width/2;
        var y = py-height/2;
        var r = Math.sqrt(x*x+y*y);
        var maxr = width/2;
        if (r>maxr) return {'x':px,'y':py}
        var a = Math.atan2(y,x);
        a += 1-r/maxr;
        var dx = Math.cos(a)*r;
        var dy = Math.sin(a)*r;
        return {
            'x': dx+width/2,
            'y': dy+height/2
        }
    }
    
    this.spherize = function(px,py) {
        var x = px-width/2;
        var y = py-height/2;
        var r = Math.sqrt(x*x+y*y);
        var maxr = width/2;
        if (r>maxr) return {'x':px,'y':py}
        var a = Math.atan2(y,x);
        var k = (r/maxr)*(r/maxr)*0.5+0.5;
        var dx = Math.cos(a)*r*k;
        var dy = Math.sin(a)*r*k;
        return {
            'x': dx+width/2,
            'y': dy+height/2
        }
    }
    

    this.exec = function(bitmap, texture) {
        var height = bitmap.height;
        var width = bitmap.width;
        var colorat = function(x,y,channel) {
            return texture.data[(x+y*height)*4+channel];
        }
        for (var j=0; j<height; j++) {
            for (var i=0; i<width; i++) {
                var u = map[(i+j*height)*2];
                var v = map[(i+j*height)*2+1];
                var x = Math.floor(u);
                var y = Math.floor(v);
                var kx = u-x;
                var ky = v-y;
                for (var c=0; c<4; c++) {
                    bitmap.data[(i+j*height)*4+c] =
                        (colorat(x,y  ,c)*(1-kx) + colorat(x+1,y  ,c)*kx) * (1-ky) +
                        (colorat(x,y+1,c)*(1-kx) + colorat(x+1,y+1,c)*kx) * (ky);
                }
            }
        }
    };
    
    this.setTranslate = function(translator) {
        if (typeof translator === 'string') translator = this[translator];
        for (var y=0; y<height; y++) {
            for (var x=0; x<width; x++) {
                var t = translator(x,y);
                map[(x+y*height)*2+0] = Math.max(Math.min(t.x,width-1),0);
                map[(x+y*height)*2+1] = Math.max(Math.min(t.y,height-1),0);
            }
        }
    }
    
    this.setTranslate(filter);
}*/
////////////////////////////////////////////////////////////////////////



assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.TextOnSprite = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.TextOnSprite.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.myProperty = this.properties[0];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
		this.cvs = document.createElement("canvas");
		this.ctx = this.cvs.getContext('2d');
		//jQuery('body').append(this.cvs);
		this.tmpImg = new Image();
		
		/*this.runtime.wait_for_textures.push(this.inst.type.animations[0].frames[0].texture_img);*/
		//this.inst.type.plugin.__proto__.acts.SetVisible(false);
		//this.inst.type.plugin.__proto__.acts.SetVisible(true);
		//this.base64String = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
		
		//this.base64String = "data:image/gif;base64,";
		this.base64String = "";
		
		this.fillStyle    = '#000';
		this.font         = '30px sans-serif';
		this.textBaseline = 'top';
		this.textX = 0;
		this.textY = 0;
		
		this.savedImage = ''; //representing the initial image, saved before any effect has been applied
		
		this.lastEffect = '';
		//////
		// SEPIA EFFECT
		/////
		// set of sepia colors
		this.sepiaR = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];
		this.sepiaG = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255];
		this.sepiaB = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

		// noise value
		this.sepiaNoise = 20;
		
		//////
		// BLUR EFFECT
		/////
		this.blurAmount = 3;
		
		//////
		// COLOR TINT EFFECT
		/////
		this.Rcorrection = 0.3;
		this.Gcorrection = 0.3;
		this.Bcorrection = 0.3;
		
		//water
		//this.frame = 0;
		
		//perspective
		this.ctxd = null;
		this.cvso = null;
		this.cvst = null;
		this.ctxo = null;
		this.ctxt = null;
		
		//split RGB
		this.channelbase64 = "";
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	// the example condition
	cnds.OnEffectDone = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};

	cnds.OnCurrentSaved = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};
	cnds.OnRGBASplitted = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};
	
	
	/*cnds.OnTextWritten = function (foo)
	{
		//alert(foo);
		//this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src = this.base64string;
		return true;
	};*/
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// the example action
	//acts.writeText = function (color,font,baseline,X,Y,str)
	Acts.prototype.writeText = function (color,font,baseline,X,Y,str)
	{

		this.fillStyle    = color;
		this.font         = font;
		this.textBaseline = baseline;
		this.textX = X;
		this.textY = Y;
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		
		var fillStyle    = this.fillStyle;
		var font         = this.font;
		var textBaseline = this.textBaseline;
		var textX = this.textX;
		var textY = this.textY;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			ctx.fillStyle    = fillStyle;
			ctx.font         = font;
			ctx.textBaseline = textBaseline;
			ctx.fillText  (str, textX, textY);
					
			base64str = cvs.toDataURL("image/png");
					
			img.onload = (function(self) {
				return function() {
					inst.set_bbox_changed();
					cr.runtime.redraw = true;
				};
			})(this);
			
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};

	//acts.grayscale = function ()
	Acts.prototype.grayscale = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
					//var grayscale = (data[i]*0.33 + data[i+1]*0.33 + data[i+2]*0.33);
					//here's a better grayscale approximation :
					grayscale = (rPix * 0.21) + (gPix * 0.71) + (bPix * 0.07);
					data[i]    = grayscale; // red
					data[i+1]  = grayscale; // green
					data[i+2]  = grayscale; // blue					
				}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//acts.simpleblur = function ()
	Acts.prototype.simpleblur = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;				

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var iBlurRate = vars.blurAmount;
			var iW = img.width;
			var iMW;
			var iSumOpacity,iSumRed,iSumGreen,iSumBlue,iCnt,aCloseData;
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			
			var data = imageData.data; //speed up the var access
			
			for (var br = 0; br < iBlurRate; br += 1) {
				for (var i = 0, n = data.length; i < n; i += 4) {
		 
					iMW = 4 * iW;
					iSumOpacity = iSumRed = iSumGreen = iSumBlue = 0;
					iCnt = 0;
		 
					// data of close pixels (from all 8 surrounding pixels)
					aCloseData = [
						i - iMW - 4, i - iMW, i - iMW + 4, // top pixels
						i - 4, i + 4, // middle pixels
						i + iMW - 4, i + iMW, i + iMW + 4 // bottom pixels
					];
		 
					// calculating Sum value of all close pixels
					for (var e = 0; e < aCloseData.length; e += 1) {
						if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
							iSumOpacity += data[aCloseData[e]];
							iSumRed += data[aCloseData[e] + 1];
							iSumGreen += data[aCloseData[e] + 2];
							iSumBlue += data[aCloseData[e] + 3];
							iCnt += 1;
						}
					}
		 
					// apply average values
					data[i] = (iSumOpacity / iCnt);
					data[i+1] = (iSumRed / iCnt);
					data[i+2] = (iSumGreen / iCnt);
					data[i+3] = (iSumBlue / iCnt);
				}
			}
			
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
//check existence of Uint32Array -> faster
//if (typeof Uint32Array === 'undefined'){
/*}else{
	var buf = new ArrayBuffer(imageData.data.length);
	//var data32 = new Uint32Array(imageData.data);
	var data32 = new Int32Array(buf,0,8);
	
	// Determine whether Uint32 is little- or big-endian.
		data32[1] = 0x0a0b0c0d;
			
		var isLittleEndian = true;
		if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
			buf[7] === 0x0d) {
			isLittleEndian = false;
		}

		if (isLittleEndian) {
			for (var y = 0; y < cvs.height; ++y) {
				for (var x = 0; x < cvs.width; ++x) {
					
					var pix = data32[y * cvs.width + x];
					aPix = (pix >> 24) & 0xff;
					bPix = (pix >> 16) & 0xff;
					gPix = (pix >> 8) & 0xff;
					rPix = (pix) & 0xff;
					if( !(rPix == 255 && gPix == 255 && bPix == 255)){
						rPix = rPix * vars.Rcorrection; // red
						gPix = gPix * vars.Gcorrection; // green
						bPix = bPix * vars.Bcorrection; // blue
					}

					data[y * cvs.width + x] =
						(aPix << 24) |    // alpha
						(bPix << 16) |    // blue
						(gPix <<  8) |    // green
						 rPix;            // red
				}
			}
		} else {
			for (y = 0; y < cvs.height; ++y) {
				for (x = 0; x < cvs.width; ++x) {
					//value = x * y & 0xff;
					var pix = data32[y * cvs.width + x];
					rPix = (pix >> 24) & 0xff;
					gPix = (pix >> 16) & 0xff;
					bPix = (pix >> 8) & 0xff;
					aPix = (pix) & 0xff;
					
					if( !(rPix == 255 && gPix == 255 && bPix == 255)){
						rPix = rPix * vars.Rcorrection; // red
						gPix = gPix * vars.Gcorrection; // green
						bPix = bPix * vars.Bcorrection; // blue
					}								
					
					data[y * cvs.width + x] =
						(rPix << 24) |    // red
						(gPix << 16) |    // green
						(bPix <<  8) |    // blue
						 aPix;              // alpha
				}
			}
		}
}*/	
	//acts.recolor = function (Rcorrection,Gcorrection,Bcorrection,white)
	Acts.prototype.recolor = function (Rcorrection,Gcorrection,Bcorrection,white)
	{
		this.Rcorrection = Rcorrection;
		this.Gcorrection = Gcorrection;
		this.Bcorrection = Bcorrection;
		
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			//debug		
			//var tt = document.createElement("img");
			//tt.src = tmpImg.src;
			//jQuery("body").append(tt);
			//once the temp image is loaded, we draw it on a canvas, to retrieve the pixels as an array
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var rPix,gPix,bPix,aPix;
			
			var data = imageData.data; //speed up the var access

			for (var i=0; i < data.length; i+=4) {
				rPix = data[i];
				gPix = data[i+1];
				bPix = data[i+2];
				//don't colorize white pixels
				if( !(rPix == 255 && gPix == 255 && bPix == 255) && white == 0){//don't colorize white pixels
					data[i]   = rPix * vars.Rcorrection; // red
					data[i+1] = gPix * vars.Gcorrection; // green
					data[i+2] = bPix * vars.Bcorrection; // blue					
				}
				if(white == 1){//colorize everything, even white
					data[i]   = rPix * vars.Rcorrection; // red
					data[i+1] = gPix * vars.Gcorrection; // green
					data[i+2] = bPix * vars.Bcorrection; // blue				
				}
			}

			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		//this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
		this.tmpImg.src = img.src;
	};

	//acts.changeRGB = function (oldR,oldG,oldB,newR,newG,newB,tolerance)
	Acts.prototype.changeRGB = function (oldR,oldG,oldB,newR,newG,newB,tolerance)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			//debug		
			//var tt = document.createElement("img");
			//tt.src = tmpImg.src;
			//jQuery("body").append(tt);
			//once the temp image is loaded, we draw it on a canvas, to retrieve the pixels as an array
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var rPix,gPix,bPix,aPix;
			
			var data = imageData.data; //speed up the var access

			for (var i=0; i < data.length; i+=4) {
				rPix = data[i];
				gPix = data[i+1];
				bPix = data[i+2];
				//don't colorize white pixels
				if	(  	(		oldR >= (rPix - tolerance) && oldR <= (rPix + tolerance)
							&& 	oldG >= (gPix - tolerance) && oldG <= (gPix + tolerance)
							&& 	oldB >= (bPix - tolerance) && oldB <= (bPix + tolerance)
						) 
					)
						{
					data[i]   = newR; // red
					data[i+1] = newG; // green
					data[i+2] = newB; // blue
					}
			}

			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		//this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
		this.tmpImg.src = img.src;
	};
	
	//acts.sepia = function (noise,white)
	Acts.prototype.sepia = function (noise,white)
	{
		this.sepiaNoise = noise
	
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];  //POTENTIAL SOURCE OF BUGS HERE !!
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			
			for (var i=0; i < data.length; i+=4) {

				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				//if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
					// change image colors
				//	data[i] = vars.sepiaR[data[i]];
				//	data[i+1] = vars.sepiaG[data[i+1]];
				//	data[i+2] = vars.sepiaB[data[i+2]];

					// apply noise
				//	if (vars.noise > 0) {
				//		vars.noise = Math.round(vars.noise - Math.random() * vars.noise);

				//		for(var j=0; j<3; j++){
				//			var iPN = vars.noise + data[i+j];
				//			data[i+j] = (iPN > 255) ? 255 : iPN;
				//		}
				//	}
				//}
					if( !(rPix == 255 && gPix == 255 && bPix == 255) && white == 0){//don't colorize white pixels
						// change image colors
						data[i] = vars.sepiaR[data[i]];
						data[i+1] = vars.sepiaG[data[i+1]];
						data[i+2] = vars.sepiaB[data[i+2]];			
						// apply noise
						if (vars.sepiaNoise > 0) {
							vars.sepiaNoise = Math.round(vars.sepiaNoise - Math.random() * vars.sepiaNoise);

							for(var j=0; j<3; j++){
								var iPN = vars.sepiaNoise + data[i+j];
								data[i+j] = (iPN > 255) ? 255 : iPN;
							}
						}						
					}
					if(white == 1){//colorize everything, even white
						// change image colors
						data[i] = vars.sepiaR[data[i]];
						data[i+1] = vars.sepiaG[data[i+1]];
						data[i+2] = vars.sepiaB[data[i+2]];			
						// apply noise
						if (vars.sepiaNoise > 0) {
							vars.sepiaNoise = Math.round(vars.sepiaNoise - Math.random() * vars.sepiaNoise);

							for(var j=0; j<3; j++){
								var iPN = vars.sepiaNoise + data[i+j];
								data[i+j] = (iPN > 255) ? 255 : iPN;
							}
						}			
					}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//acts.negative = function (white)
	Acts.prototype.negative = function (white)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				if( !(rPix == 255 && gPix == 255 && bPix == 255) && white == 0){//don't colorize white pixels
					data[i]    = 255 - rPix; // red
					data[i+1]  = 255 - gPix; // green
					data[i+2]  = 255 - bPix; // blue					
				}
				if(white == 1){//colorize everything, even white
					data[i]    = 255 - rPix; // red
					data[i+1]  = 255 - gPix; // green
					data[i+2]  = 255 - bPix; // blue					
				}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//acts.noise = function (amount,white)
	Acts.prototype.noise = function (amount,white)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				var rand =  (0.5 - Math.random()) * amount;
				//if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
				//	data[i]    = rPix + rand; // red
				//	data[i+1]  = gPix + rand; // green
				//	data[i+2]  = bPix + rand; // blue					
				//}
									//don't colorize white pixels
					if( !(rPix == 255 && gPix == 255 && bPix == 255) && white == 0){//don't colorize white pixels
						data[i]    = rPix + rand; // red
						data[i+1]  = gPix + rand; // green
						data[i+2]  = bPix + rand; // blue					
					}
					if(white == 1){//colorize everything, even white
						data[i]    = rPix + rand; // red
						data[i+1]  = gPix + rand; // green
						data[i+2]  = bPix + rand; // blue				
					}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	//acts.rgb2bgr = function ()
	Acts.prototype.rgb2bgr = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				//if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
					data[i]    = bPix; // red
					data[i+1]  = gPix; // green
					data[i+2]  = rPix; // blue					
				//}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//acts.rotateColLeft = function ()
	Acts.prototype.rotateColLeft = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				//if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
					data[i]    = gPix; // red
					data[i+1]  = bPix; // green
					data[i+2]  = rPix; // blue					
				//}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//acts.rotateColRight = function ()
	Acts.prototype.rotateColRight = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				//if( !(rPix == 255 && gPix == 255 && bPix == 255)){//don't colorize white pixels
					data[i]    = bPix; // red
					data[i+1]  = rPix; // green
					data[i+2]  = gPix; // blue					
				//}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	Acts.prototype.whiten = function (_R,_G,_B)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				if( !(rPix >= _R && gPix >= _G && bPix >= _B)){//whiten everything above that RGB
					data[i]    = 255; // red
					data[i+1]  = 255; // green
					data[i+2]  = 255; // blue					
				}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	Acts.prototype.darken = function (_R,_G,_B)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				if( !(rPix <= _R && gPix <= _G && bPix <= _B)){//whiten everything above that RGB
					data[i]    = 0; // red
					data[i+1]  = 0; // green
					data[i+2]  = 0; // blue					
				}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	/*acts.pixelate = function (blocksize)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access

			//apply pixelate algorithm
			for(var x = 1; x < cvs.width; x += blocksize)
			{
				for(var y = 1; y < cvs.height; y += blocksize)
				{
					var pixel = ctx.getImageData(x, y, 1, 1);
					ctx.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
					ctx.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
				}
			}
			//write back the pixels
			//ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};*/
//from http://www.codediesel.com/demos/pixel/
function renderClosePixels( ctx, renderOptions, w, h ) {
  var PI2 = Math.PI*2, 
      PI1_4 = Math.PI/4,
      imgData = ctx.getImageData(0, 0, w, h).data, 
      isArray = function ( o ){ return Object.prototype.toString.call( o ) === "[object Array]"; },
      isObject = function ( o ){ return Object.prototype.toString.call( o ) === "[object Object]"; };

  ctx.clearRect( 0, 0, w, h);

  //for (var i=0, len = renderOptions.length; i < len; i++) {
    var opts = renderOptions/*[i]*/,
        res = opts.resolution,
        // option defaults
        size = opts.size || res,
        alpha = /*opts.alpha || */1,
        offset = /*opts.offset ||*/ 0,
        offsetX = 0, 
        offsetY = 0,
        cols = w / res + 1,
        rows = h / res + 1,
        halfSize = size / 2,
        diamondSize = size / Math.SQRT2,
        halfDiamondSize = diamondSize / 2;

    if ( isObject( offset ) ){ 
      offsetX = offset.x || 0;
      offsetY = offset.y || 0;
    } else if ( isArray( offset) ){
      offsetX = offset[0] || 0;
      offsetY = offset[1] || 0;
    } else {
      offsetX = offsetY = offset;
    }

    for ( var row = 0; row < rows; row++ ) {
      var y = ( row - 0.5 ) * res + offsetY,
        // normalize y so shapes around edges get color
        pixelY = Math.max( Math.min( y, h-1), 0);

      for ( var col = 0; col < cols; col++ ) {
        var x = ( col - 0.5 ) * res + offsetX,
            // normalize y so shapes around edges get color
            pixelX = Math.max( Math.min( x, w-1), 0),
            pixelIndex = ( pixelX + pixelY * w ) * 4,
            red = imgData[ pixelIndex + 0 ],
            green = imgData[ pixelIndex + 1 ],
            blue = imgData[ pixelIndex + 2 ];

            alpha *= (imgData[ pixelIndex + 3 ] / 255);
            ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ alpha + ')';

        switch ( opts.shape ) {
          case 'circle' :
            ctx.beginPath();
              ctx.arc ( x, y, halfSize, 0, PI2, true );
              ctx.fill();
            ctx.closePath();
            break;
          case 'diamond' :
            ctx.save();
              ctx.translate( x, y );
              ctx.rotate( PI1_4 );
              ctx.fillRect( -halfDiamondSize, -halfDiamondSize, diamondSize, diamondSize );
            ctx.restore();
            break;
          default :  
            // square
            ctx.fillRect( x - halfSize, y - halfSize, size, size );
        } // switch
      } // col
    } // row
  //} // options

};
	//acts.pixelate = function (_shape,_resolution,_size,_offset,_alpha)
	Acts.prototype.pixelate = function (_shape,_resolution,_size,_offset,_alpha)
	{
		var blocksize = 3;
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;				

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			//var iBlurRate = vars.blurAmount;
			//var imgWidth = img.width;
			//var iMW;
			var /*iSumOpacity,*/iSumRed,iSumGreen,iSumBlue,iCnt,aCloseData;
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			
			var data = imageData.data; //speed up the var access
			/*var opts = {
      	    { shape : 'diamond', resolution : 48, size: 50 },
	    { shape : 'diamond', resolution : 48, offset : 24 },
	    { shape : 'circle', resolution : 8, size: 6 }
	  }*/
	  var opts ={shape : _shape, resolution : _resolution, size: _size, offset: _offset, alpha: _alpha};
			renderClosePixels(ctx,opts,cvs.width,cvs.height);
			/*var tt = document.createElement("img");
			tt.src = tmpImg.src;
			jQuery("body").append(cvs);*/
			/*for (var i = 0, n = data.length; i < n; i += 4*3) {
	 
				iMW = 4 * imgWidth;
				iSumRed = iSumGreen = iSumBlue = 0;
				iCnt = 0;
	 
				// data of close pixels (from all 8 surrounding pixels)
				aCloseData = [
					i - iMW - 4, i - iMW, i - iMW + 4, // top pixels
					i - 4, i + 4, // middle pixels
					i + iMW - 4, i + iMW, i + iMW + 4 // bottom pixels
				];
	 
				// calculating Sum value of all close pixels
				for (var e = 0; e < aCloseData.length; e += 1) {
					if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
						//iSumOpacity += data[aCloseData[e]];
						iSumRed += data[aCloseData[e] + 1];
						iSumGreen += data[aCloseData[e] + 2];
						iSumBlue += data[aCloseData[e] + 3];
						iCnt += 1;
					}
				}
	 

				for (var e = 0; e < aCloseData.length; e += 1) {
					if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
						data[aCloseData[e] + 0] = iSumRed/9;
						data[aCloseData[e] + 1] = iSumBlue/9;
						data[aCloseData[e] + 2] = iSumGreen/9;
					}
				}
			}*/
			/*for(var y = 1; y < cvs.height; y += blocksize)
			{
				for(var x = 1; x < cvs.width; x += blocksize)
				{
						//var pixel = ctx.getImageData(x, y, 1, 1);
						//input->imageData[input->widthStep*j + i*input->nChannels]
						//var pixel = data[y*4+x];
						//ctx.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
						var style = "rgb("+data[y*cvs.width*4+(x*4)]+","+data[y*cvs.width*4+(x*4)+1]+","+data[y*cvs.width*4+(x*4)+2]+")";
						ctx.fillStyle = style;
						ctx.fillRect(x-1, y-1, x + 25, y + 25);
				}
			}*/
			    //apply pixalate algorithm
			/*for(var x = 1; x <cvs.width; x += blocksize)
			{
				for(var y = 1; y < cvs.height; y += blocksize)
				{
					var pixel = ctx.getImageData(x, y, 1, 1);
					ctx.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
					ctx.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
				}
			}*/
			/*ctx.save();
			ctx.fillStyle = "rgb("+255+","+0+","+0+")";
			ctx.fillRect(10, 10, 100, 100);
			ctx.restore();*/

			/*var row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha
			var cols = w / res + 1;
			var rows = h / res + 1;
			var w = this.width;
			var h = this.height;
			  // option defaults
			//var res = opts.resolution || 16;
			var res = 32;
			//var size = opts.size || res;
			var size = 16;
			//var alpha = opts.alpha || 1;
			var alpha = 1;
			//var offset = opts.offset || 0;
			var offset = 0;
			var offsetX = 0;
			var offsetY = 0;
			var cols = w / res + 1;
			var rows = h / res + 1;
			var halfSize = size / 2;
			var diamondSize = size / Math.SQRT2;
			var halfDiamondSize = diamondSize / 2;
			  for ( row = 0; row < rows; row++ ) {
				y = ( row - 0.5 ) * res + offsetY
				// normalize y so shapes around edges get color
				pixelY = Math.max( Math.min( y, h-1), 0)

				for ( col = 0; col < cols; col++ ) {
				  x = ( col - 0.5 ) * res + offsetX
				  // normalize y so shapes around edges get color
				  pixelX = Math.max( Math.min( x, w-1), 0)
				  pixelIndex = ( pixelX + pixelY * w ) * 4
				  red = data[ pixelIndex + 0 ]
				  green = data[ pixelIndex + 1 ]
				  blue = data[ pixelIndex + 2 ]
				  pixelAlpha = alpha * ( data[ pixelIndex + 3 ] / 255)

				  ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')'

				 // switch ( opts.shape ) {
					// case 'circle' :
					  // ctx.beginPath()
						// ctx.arc ( x, y, halfSize, 0, TWO_PI, true )
						// ctx.fill()
					  // ctx.closePath()
					  // break
					// case 'diamond' :
					  // ctx.save()
						// ctx.translate( x, y )
						// ctx.rotate( QUARTER_PI )
						// ctx.fillRect( -halfDiamondSize, -halfDiamondSize, diamondSize, diamondSize )
					  // ctx.restore()
					  // break
					// default :
					  // square
					  ctx.fillRect( x - halfSize, y - halfSize, size, size )
				  //} // switch
				} // col
			  } // row*/
			
			//write back the pixels
			//ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	//from http://ariya.ofilabs.com/2012/03/underwater-effect-with-html5-canvas.html
	/*acts.distort = function (amplitude)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var src;var dest; var xs;var ys;
			var stride = cvs.width * 4;
			var width = cvs.width;
			var height = cvs.height;
			var T = this.frame * 1000 / 60 * 0.6 / 1000;
			//var T = 1 * 1 * 60 / 1000;
			for (var x = amplitude; x < width - amplitude; ++x) {
				for (var y = amplitude; y < height - amplitude; ++y) {
					xs = amplitude * Math.sin(2 * Math.PI * (3 * y / height + T));
					ys = amplitude * Math.cos(2 * Math.PI * (3 * x / width + T));
					xs = Math.round(xs);
					ys = Math.round(ys);
					dest = y * stride + x * 4;
					src = (y + ys) * stride + (x + xs) * 4;
					data[dest] = data[src];
					data[dest + 1] = data[src + 1];
					data[dest + 2] = data[src + 2];
				}
			}
			this.frame++;
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};*/

//from http://www.script-tutorials.com/html5-image-effects-emboss/
// normalize matrix
function normalizeMatrix(m) {
    var j = 0;
    for (var i = 0; i < m.length; i++) {
        j += m[i];
    }
    for (var i = 0; i < m.length; i++) {
        m[i] /= j;
    }
    return m;
}

// convert x-y coordinates into pixel position
function convertCoordinates(x, y, w) {
    return x + (y * w);
}

// find a specified distance between two colours
function findColorDiff(dif, dest, src) {
    return dif * dest + (1 - dif) * src;
}

// transform matrix
function transformMatrix(img, pixels,canvas,strength,matrix) {

    // create a second canvas and context to keep temp results
    var canvas2 = document.createElement('canvas');
    var ctx2 = canvas2.getContext('2d');
    ctx2.width = canvas2.width = img.width;
    ctx2.height = canvas2.height = img.height;

    // draw image
    ctx2.drawImage(img, 0, 0, img.width , img.height);
    var buffImageData = ctx2.getImageData(0, 0, canvas.width, canvas.height);

    var data = pixels.data;
    var bufferedData = buffImageData.data;

    // normalize matrix
    matrix = normalizeMatrix(matrix);
    var mSize = Math.sqrt(matrix.length);

    for (var i = 1; i < img.width - 1; i++) {
        for (var j = 1; j < img.height - 1; j++) {

            var sumR = 0;
			var sumG = 0;
			var sumB = 0;

            // loop through the matrix
            for (var h = 0; h < mSize; h++) {
                for (var w = 0; w < mSize; w++) {
                    var r = convertCoordinates(i + h - 1, j + w - 1, img.width) << 2;

                    // RGB for current pixel
                    var currentPixel = {
                        r: bufferedData[r],
                        g: bufferedData[r + 1],
                        b: bufferedData[r + 2]
                    };

                    sumR += currentPixel.r * matrix[w + h * mSize];
                    sumG += currentPixel.g * matrix[w + h * mSize];
                    sumB += currentPixel.b * matrix[w + h * mSize];
                }
            }

            var rf = convertCoordinates(i, j, img.width) << 2;
            data[rf] = findColorDiff(strength, sumR, data[rf]);
            data[rf + 1] = findColorDiff(strength, sumG, data[rf + 1]);
            data[rf + 2] = findColorDiff(strength, sumB, data[rf + 2]);
        }
    }
    return pixels;
}
	//from http://www.script-tutorials.com/html5-image-effects-emboss/
	//acts.emboss = function (strength)
	Acts.prototype.emboss = function (strength)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			//var data = imageData.data; //speed up the var access
			//for (var i=0; i < data.length; i+=4) {
			//	var rPix = data[i];
			//	var gPix = data[i+1];
			//	var bPix = data[i+2];
			//		data[i]    = bPix; // red
			//		data[i+1]  = gPix; // green
			//		data[i+2]  = rPix; // blue					
				//}
			//}
			// shifting matrix
			var embossMat = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
			imageData = transformMatrix(tmpImg, imageData, cvs,strength,embossMat);

			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	//acts.sharpen = function (strength)
	Acts.prototype.sharpen = function (strength)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			//var data = imageData.data; //speed up the var access
			//for (var i=0; i < data.length; i+=4) {
			//	var rPix = data[i];
			//	var gPix = data[i+1];
			//	var bPix = data[i+2];
			//		data[i]    = bPix; // red
			//		data[i+1]  = gPix; // green
			//		data[i+2]  = rPix; // blue					
				//}
			//}
			var sharpenMat = [0, -1, 0, -1, 5, -1, 0, -1, 0];
			imageData = transformMatrix(tmpImg, imageData, cvs,strength,sharpenMat);

			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	//acts.edges = function ()
	Acts.prototype.edges = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			//var data = imageData.data; //speed up the var access
			//for (var i=0; i < data.length; i+=4) {
			//	var rPix = data[i];
			//	var gPix = data[i+1];
			//	var bPix = data[i+2];
			//		data[i]    = bPix; // red
			//		data[i+1]  = gPix; // green
			//		data[i+2]  = rPix; // blue					
				//}
			//}
			//should be [0, 1, 0, 1, -4, 1, 0, 1, 0];
			//var edgesMat = [0, 1, 0, 1, -3, 1, 0, 1, 0];
			var edgesMat = [1, 1, 1, 1, -7, 1, 1, 1, 1];
			imageData = transformMatrix(tmpImg, imageData, cvs,1,edgesMat);

			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	/*Acts.prototype.sobel = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageDataH = ctx.getImageData(0,0,cvs.width,cvs.height);
			var imageDataV = ctx.getImageData(0,0,cvs.width,cvs.height);
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			//var data = imageData.data; //speed up the var access
			//for (var i=0; i < data.length; i+=4) {
			//	var rPix = data[i];
			//	var gPix = data[i+1];
			//	var bPix = data[i+2];
			//		data[i]    = bPix; // red
			//		data[i+1]  = gPix; // green
			//		data[i+2]  = rPix; // blue					
				//}
			//}
			//should be [0, 1, 0, 1, -4, 1, 0, 1, 0];
			//var edgesMat = [0, 1, 0, 1, -3, 1, 0, 1, 0];
			//sobel : one vertical and one horizontal pass
			// make the vertical gradient red
			// make the horizontal gradient green
			// and mix in some blue for aesthetics
			var verticalMat  = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
			imageDataV = transformMatrix(tmpImg, imageDataV, cvs,1,verticalMat);
			var dataV = imageDataV.data; //speed up the var access
			var horizontalMat  = [-1, -2, -1, 0, 0, 0, 1, 2, 1]; 
			imageDataH = transformMatrix(tmpImg, imageDataH, cvs,1,horizontalMat);
			var dataH = imageDataH.data; //speed up the var access
			var data = imageData.data; //speed up the var access
			for (var i=0; i < data.length; i+=4) {
				var rH = dataH[i];
				var gH = dataH[i+1];
				var bH = dataH[i+2];
				var rV = dataV[i];
				var gV = dataV[i+1];
				var bV = dataV[i+2];
				data[i]    = rV; // red
				data[i+1]  = gH; // green
				data[i+2]  = (bH+bV)/4; // blue					
			}
			
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};*/
	//from http://www.splashnology.com/article/pixel-distortions-with-bilinear-filtration-in-html5-canvas/4739/
	/*acts.flower = function (strength,x,y)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			//imageData = transformMatrix(tmpImg, imageData, cvs,strength);
			//tmp bitmap to draw
			var src = document.createElement("canvas");
			var dst = document.createElement("canvas");
			src.width = cvs.width;
			src.height = cvs.height;
			dst.width = strength;
			dst.height = strength;
			
			var input = src.getContext('2d');
			input.putImageData(imageData, 0, 0);
			var output = dst.getContext('2d');

			var bitmap = output.getImageData(0,0,cvs.width,cvs.height); 
			var mapper = new Mapper(bitmap.width,bitmap.height,'flower');
			//var texture = input.getImageData(e.clientX-Math.ceil(bitmap.width/2),e.clientY-Math.ceil(bitmap.height/2),bitmap.width,bitmap.height+1);
			var texture = input.getImageData(x-Math.ceil(bitmap.width/2),y-Math.ceil(bitmap.height/2),bitmap.width,bitmap.height+1);
					
			mapper.exec(bitmap,texture);
			
			var debug = document.createElement("canvas");
			debug.width = strength;
			debug.height = strength;
			var debugOutput = debug.getContext('2d');
			debugOutput.putImageData(texture, 0, 0);
			jQuery("body").append(debug);
			jQuery("body").append(src);
			jQuery("body").append(dst);

			output.putImageData(bitmap,0,0);

			//write back the pixels
			//ctx.putImageData(imageData, 0, 0);
			ctx.putImageData(output.getImageData(0,0,strength,strength), x-Math.floor(strength/2),y-(Math.floor(strength/2)));
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};*/
	/*Acts.prototype.htmlString = function (htmlString)
	{
		var dataToDisplay = "data:image/svg+xml," +
			//"<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
			"<svg xmlns='http://www.w3.org/2000/svg' width='"+this.width+"' height='"+this.height+"'>" +
				"<foreignObject width='100%' height='100%'>" +
				"<div xmlns='http://www.w3.org/1999/xhtml'>" +
					htmlString +
				"</div>" +
			"</foreignObject>" +
		"</svg>";
	
		var imgDataToDisplay = new Image();
		
		// Create a new canvas
		var canvasHTML = document.createElement('canvas');
		var ctxHTML = canvasHTML.getContext('2d');
		
		imgDataToDisplay.onload = function(){
			//ctxHTML.drawImage(imgDataToDisplay, 0, 0);
		}
		
		imgDataToDisplay.src = dataToDisplay;
		
	
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			//var imageDataHTML = ctxHTML.getImageData(0,0,cvs.width,cvs.height);
			//var imageDataHTML = canvasHTML.toDataURL();
			//var data = imageData.data; //speed up the var access
			//for (var i=0; i < data.length; i+=4) {
			//	var rPix = data[i];
			//	var gPix = data[i+1];
			//	var bPix = data[i+2];
			//		data[i]    = bPix; // red
			//		data[i+1]  = gPix; // green
			//		data[i+2]  = rPix; // blue					
				//}
			//}
			

			//write back the pixels
			//ctx.putImageData(imageDataHTML, 0, 0);
			ctx.drawImage(imgDataToDisplay, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};*/
	
	//from http://albertogasparin.it/articles/2011/05/html5-multiply-filter-canvas/
	Acts.prototype.blendColor = function (_R,_G,_B,_mode)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			
			if(_mode.toLowerCase() == "multiply"){
			
				for (var i=0; i < data.length; i+=4) {
					var rPix = data[i];
					var gPix = data[i+1];
					var bPix = data[i+2];

					data[i]    = rPix/255*_R; // red
					data[i+1]  = gPix/255*_G; // green
					data[i+2]  = bPix/255*_B; // blue				
					
				}
			
			}
						
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
//from https://github.com/Phrogz/context-blender/blob/master/context_blender.js
function blendFrom(srcContext,destContext,blendMode,offsetOptions){
//srcContext = otherContext, destContext = me
	var offsets={};
	offsets.destX = offsetOptions.destX;
	offsets.destY = offsetOptions.destY;
	offsets.sourceX = offsetOptions.sourceX;
	offsets.sourceY = offsetOptions.sourceY;
	offsets.width = offsetOptions.width;
	offsets.height = offsetOptions.height;
	//for (var key in defaultOffsets){
	/*for (var key = 0; key < 6;key++){
		//if (defaultOffsets.hasOwnProperty(key)){
			offsets[key] = (offsetOptions && offsetOptions[key]) || defaultOffsets[key];
		//}
	}*/
	if (offsets.width =='auto') offsets.width =destContext.canvas.width;
	if (offsets.height=='auto') offsets.height=destContext.canvas.height;
	offsets.width  = Math.min(offsets.width, srcContext.canvas.width-offsets.sourceX, destContext.canvas.width-offsets.destX );
	offsets.height = Math.min(offsets.height,srcContext.canvas.height-offsets.sourceY,destContext.canvas.height-offsets.destY);
	
	//var srcD = this.getImageData(offsets.sourceX,offsets.sourceY,offsets.width,offsets.height);
	var srcD = srcContext.getImageData(offsets.sourceX,offsets.sourceY,offsets.width,offsets.height);
	//var dstD = destContext.getImageData(offsets.destX,offsets.destY,offsets.width,offsets.height);
	var dstD = destContext.getImageData(offsets.destX,offsets.destY,offsets.width,offsets.height);
	var src  = srcD.data;
	var dst  = dstD.data;
	var sA, dA, len=dst.length;
	var sRA, sGA, sBA, dRA, dGA, dBA, dA2;
	var demultiply;

	for (var px=0;px<len;px+=4){
		sA  = src[px+3]/255;
		dA  = dst[px+3]/255;
		dA2 = (sA + dA - sA*dA);
		dst[px+3] = dA2*255;

		sRA = src[px  ]/255*sA;
		dRA = dst[px  ]/255*dA;
		sGA = src[px+1]/255*sA;
		dGA = dst[px+1]/255*dA;
		sBA = src[px+2]/255*sA;
		dBA = dst[px+2]/255*dA;
		
		demultiply = 255 / dA2;
	
		switch(blendMode){
			// ******* Very close match to Photoshop
			case 'normal':
			case 'src-over':
				dst[px  ] = (sRA + dRA - dRA*sA) * demultiply;
				dst[px+1] = (sGA + dGA - dGA*sA) * demultiply;
				dst[px+2] = (sBA + dBA - dBA*sA) * demultiply;
			break;

			case 'screen':
				dst[px  ] = (sRA + dRA - sRA*dRA) * demultiply;
				dst[px+1] = (sGA + dGA - sGA*dGA) * demultiply;
				dst[px+2] = (sBA + dBA - sBA*dBA) * demultiply;
			break;

			case 'multiply':
				dst[px  ] = (sRA*dRA + sRA*(1-dA) + dRA*(1-sA)) * demultiply;
				dst[px+1] = (sGA*dGA + sGA*(1-dA) + dGA*(1-sA)) * demultiply;
				dst[px+2] = (sBA*dBA + sBA*(1-dA) + dBA*(1-sA)) * demultiply;
			break;

			case 'difference':
				dst[px  ] = (sRA + dRA - 2 * Math.min( sRA*dA, dRA*sA )) * demultiply;
				dst[px+1] = (sGA + dGA - 2 * Math.min( sGA*dA, dGA*sA )) * demultiply;
				dst[px+2] = (sBA + dBA - 2 * Math.min( sBA*dA, dBA*sA )) * demultiply;
			break;

			// ******* Slightly different from Photoshop, where alpha is concerned
			case 'src-in':
				// Only differs from Photoshop in low-opacity areas
				dA2 = sA*dA;
				demultiply = 255 / dA2;
				dst[px+3] = dA2*255;
				dst[px  ] = sRA*dA * demultiply;
				dst[px+1] = sGA*dA * demultiply;
				dst[px+2] = sBA*dA * demultiply;
			break;

			case 'plus':
			case 'add':
				// Photoshop doesn't simply add the alpha channels; this might be correct wrt SVG 1.2
				dA2 = Math.min(1,sA+dA);
				dst[px+3] = dA2*255;
				demultiply = 255 / dA2;
				dst[px  ] = Math.min(sRA + dRA,1) * demultiply;
				dst[px+1] = Math.min(sGA + dGA,1) * demultiply;
				dst[px+2] = Math.min(sBA + dBA,1) * demultiply;
			break;

			case 'overlay':
				// Correct for 100% opacity case; colors get clipped as opacity falls
				dst[px  ] = (dRA<=0.5) ? (2*src[px  ]*dRA/dA) : 255 - (2 - 2*dRA/dA) * (255-src[px  ]);
				dst[px+1] = (dGA<=0.5) ? (2*src[px+1]*dGA/dA) : 255 - (2 - 2*dGA/dA) * (255-src[px+1]);
				dst[px+2] = (dBA<=0.5) ? (2*src[px+2]*dBA/dA) : 255 - (2 - 2*dBA/dA) * (255-src[px+2]);

				// http://dunnbypaul.net/blends/
				// dst[px  ] = ( (dRA<=0.5) ? (2*sRA*dRA) : 1 - (1 - 2*(dRA-0.5)) * (1-sRA) ) * demultiply;
				// dst[px+1] = ( (dGA<=0.5) ? (2*sGA*dGA) : 1 - (1 - 2*(dGA-0.5)) * (1-sGA) ) * demultiply;
				// dst[px+2] = ( (dBA<=0.5) ? (2*sBA*dBA) : 1 - (1 - 2*(dBA-0.5)) * (1-sBA) ) * demultiply;

				// http://www.barbato.us/2010/12/01/blimageblending-emulating-photoshops-blending-modes-opencv/#toc-blendoverlay
				// dst[px  ] = ( (sRA<=0.5) ? (sRA*dRA + sRA*(1-dA) + dRA*(1-sA)) : (sRA + dRA - sRA*dRA) ) * demultiply;
				// dst[px+1] = ( (sGA<=0.5) ? (sGA*dGA + sGA*(1-dA) + dGA*(1-sA)) : (sGA + dGA - sGA*dGA) ) * demultiply;
				// dst[px+2] = ( (sBA<=0.5) ? (sBA*dBA + sBA*(1-dA) + dBA*(1-sA)) : (sBA + dBA - sBA*dBA) ) * demultiply;

				// http://www.nathanm.com/photoshop-blending-math/
				// dst[px  ] = ( (sRA < 0.5) ? (2 * dRA * sRA) : (1 - 2 * (1 - sRA) * (1 - dRA)) ) * demultiply;
				// dst[px+1] = ( (sGA < 0.5) ? (2 * dGA * sGA) : (1 - 2 * (1 - sGA) * (1 - dGA)) ) * demultiply;
				// dst[px+2] = ( (sBA < 0.5) ? (2 * dBA * sBA) : (1 - 2 * (1 - sBA) * (1 - dBA)) ) * demultiply;
			break;

			case 'hardlight':
				dst[px  ] = (sRA<=0.5) ? (2*dst[px  ]*sRA/dA) : 255 - (2 - 2*sRA/sA) * (255-dst[px  ]);
				dst[px+1] = (sGA<=0.5) ? (2*dst[px+1]*sGA/dA) : 255 - (2 - 2*sGA/sA) * (255-dst[px+1]);
				dst[px+2] = (sBA<=0.5) ? (2*dst[px+2]*sBA/dA) : 255 - (2 - 2*sBA/sA) * (255-dst[px+2]);
			break;
			
			case 'colordodge':
			case 'dodge':
				if ( src[px  ] == 255 && dRA==0) dst[px  ] = 255;
				else dst[px  ] = Math.min(255, dst[px  ]/(255 - src[px  ])) * demultiply;

				if ( src[px+1] == 255 && dGA==0) dst[px+1] = 255;
				else dst[px+1] = Math.min(255, dst[px+1]/(255 - src[px+1])) * demultiply;

				if ( src[px+2] == 255 && dBA==0) dst[px+2] = 255;
				else dst[px+2] = Math.min(255, dst[px+2]/(255 - src[px+2])) * demultiply;
			break;
			
			case 'colorburn':
			case 'burn':
				if ( src[px  ] == 0 && dRA==0) dst[px  ] = 0;
				else dst[px  ] = (1 - Math.min(1, (1 - dRA)/sRA)) * demultiply;

				if ( src[px+1] == 0 && dGA==0) dst[px+1] = 0;
				else dst[px+1] = (1 - Math.min(1, (1 - dGA)/sGA)) * demultiply;

				if ( src[px+2] == 0 && dBA==0) dst[px+2] = 0;
				else dst[px+2] = (1 - Math.min(1, (1 - dBA)/sBA)) * demultiply;
			break;
			
			case 'darken':
			case 'darker':
				dst[px  ] = (sRA>dRA ? dRA : sRA) * demultiply;
				dst[px+1] = (sGA>dGA ? dGA : sGA) * demultiply;
				dst[px+2] = (sBA>dBA ? dBA : sBA) * demultiply;
			break;
			
			case 'lighten':
			case 'lighter':
				dst[px  ] = (sRA<dRA ? dRA : sRA) * demultiply;
				dst[px+1] = (sGA<dGA ? dGA : sGA) * demultiply;
				dst[px+2] = (sBA<dBA ? dBA : sBA) * demultiply;
			break;

			case 'exclusion':
				dst[px  ] = (dRA+sRA - 2*dRA*sRA) * demultiply;
				dst[px+1] = (dGA+sGA - 2*dGA*sGA) * demultiply;
				dst[px+2] = (dBA+sBA - 2*dBA*sBA) * demultiply;
			break;

			// ******* UNSUPPORTED
			default:
				dst[px] = dst[px+3] = 255;
				dst[px+1] = px%8==0 ? 255 : 0;
				dst[px+2] = px%8==0 ? 0 : 255;
		}
	}
	//destContext.putImageData(dstD,offsets.destX,offsets.destY);
	destContext.putImageData(dstD,offsets.destX,offsets.destY);
};
	
	Acts.prototype.blendSprite = function (_sprite,_mode,_destX,_destY,_sourceX,_sourceY,_width,_height)
	{
	
		var modeStr ="";
		switch(_mode){
			case 0:
				modeStr = "src-over";
			break;
			case 1:
				modeStr = "screen";
			break;
			case 2:
				modeStr = "multiply";
			break;
			case 3:
				modeStr = "difference";
			break;
			case 4:
				modeStr = "exclusion";
			break;
			case 5:
				modeStr = "src-in";
			break;			
			case 6:
				modeStr = "add";
			break;	
			case 7:
				modeStr = "lighten";
			break;	
			case 8:
				modeStr = "darken";
			break;	
			case 9:
				modeStr = "overlay";
			break;	
			case 10:
				modeStr = "hardlight";
			break;	
			case 11:
				modeStr = "colordodge";
			break;	
			case 12:
				modeStr = "colorburn";
			break;					
		}
		
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
	
		//build canvas on image from the _sprite
		var imgOther = _sprite.animations[0].frames[this.inst.cur_frame].texture_img;
		var otherImg = new Image();
		var otherCvs = document.createElement("canvas");
		var otherCtx = otherCvs.getContext('2d');
		
		otherImg.onload = function(){
			otherCtx.drawImage(imgOther,0,0);
			
			tmpImg.onload = function(){
				ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);

				//ctx["blendFrom"](otherCtx,modeStr,{destX:_destX,destY:_destY,sourceX:_sourceX,sourceY:_sourceY,width:_width,height:_height});
				blendFrom(otherCtx,ctx,modeStr,{destX:_destX,destY:_destY,sourceX:_sourceX,sourceY:_sourceY,width:_width,height:_height});
				
				base64str = cvs.toDataURL("image/png");

				img.onload = (function(self) {
					return function() {
						inst.set_bbox_changed();
						cr.runtime.redraw = true;
						inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst);						
					};
				})(this);
				
				img.src = base64str;
			};

			tmpImg.src = inst.type.animations[0].frames[inst.cur_frame].texture_img.src;	
		}
		otherImg.src = imgOther.src;
		//jQuery('body').append(otherCvs);
	

	}
	
	Acts.prototype.blendBase64 = function (base64str,_mode)
	{
	}
	
	//from http://www.html5.jp/test/perspective_canvas/demo1_en.html
	Acts.prototype.perspective = function (_X1,_Y1,_X2,_Y2,_X3,_Y3,_X4,_Y4)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		var op = null;
		var points = [[_X1, _Y1], [_X2, _Y2], [_X3, _Y3], [_X4, _Y4]];
		
		//jQuery("body").append(cvs);
		
		this.tmpImg.onload = function(){
			//ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			/*for (var i=0; i < data.length; i+=4) {
				var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				if( !(rPix <= _R && gPix <= _G && bPix <= _B)){//whiten everything above that RGB
					data[i]    = 0; // red
					data[i+1]  = 0; // green
					data[i+2]  = 0; // blue					
				}
			}*/
			perspective(inst,ctx, tmpImg);
			perspective_draw(inst,points);
			
			//write back the pixels
			/*var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			ctx.putImageData(imageData, 0, 0);*/
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, inst.inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	Acts.prototype.keepRGBA = function (channel)
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].height;			

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
			
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			
			for (var i=0; i < data.length; i+=4) {
				/*var rPix = data[i];
				var gPix = data[i+1];
				var bPix = data[i+2];
				var aPix = data[i+3];*/

				switch(channel){
					case 0 :
						//data[i]    	= rPix; // red
						data[i+1]  = 0; // green
						data[i+2]  = 0; // blue
						//data[i+3]  = 0; // alpha
					break;
					case 1 :
						data[i]    	= 0; // red
						//data[i+1]   = gPix; // red
						data[i+2]  = 0; // blue
						//data[i+3]  = 0; // alpha
					break;
					case 2 :
						data[i]    	= 0; // red
						data[i+1]   = 0; // red					
						//data[i+2]   = bPix; // red
						//data[i+3]  = 0; // alpha						
					break;
					case 3 :
						data[i]    	= 0; // red
						data[i+1]   = 0; // red					
						data[i+2]   = 0; // red					
						//data[i+3]   = aPix; // alpha
					break;
				}
			}
								
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					//inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnRGBSplitted, inst);					
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnRGBASplitted, inst);					
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	//acts.reset = function ()
	Acts.prototype.reset = function ()
	{		
		this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src = this.savedImage;
		this.inst.set_bbox_changed();
		this.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnEffectDone, this.inst);
		cr.runtime.redraw = true;
	};
	
	//acts.saveCurrentImage = function ()
	Acts.prototype.saveCurrentImage = function ()
	{
		var inst = this.inst;
		this.savedImage.onload = (function(self) {
				return function() {
					//inst.visible = true;
					//inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.TextOnSprite.prototype.cnds.OnCurrentSaved, inst);
					//cr.runtime.redraw = true;
				};
			})(this);	
	
		this.savedImage = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	/*behaviorProto.acts = {};
	var acts = behaviorProto.acts;*/
	behaviorProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	exps.savedImageAsBase64String = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(this.savedImage);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	exps.currentImage = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var base64str = this.cvs.toDataURL("image/png");
		ret.set_string(base64str);		// for ef_return_string
	};
	
	/*exps.RedChannel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.Rbase64);		// for ef_return_string
	};
	exps.BlueChannel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.Bbase64);		// for ef_return_string
	};
	exps.GreenChannel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.Gbase64);		// for ef_return_string
	};	*/
	
}());