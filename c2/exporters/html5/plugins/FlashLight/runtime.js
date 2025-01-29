// ECMAScript 5 strict mode
"use strict";

////////////////////////////
//earcut: https://github.com/mapbox/earcut

function earcut(a,c,b){b=b||2;var d=c&&c.length,e=d?c[0]*b:a.length,f=linkedList(a,0,e,b,!0),g=[];if(!f)return g;d&&(f=eliminateHoles(a,c,f,b));if(a.length>80*b){var h=c=a[0];var k=d=a[1];for(var l=b;l<e;l+=b){var m=a[l];var n=a[l+1];m<h&&(h=m);n<k&&(k=n);m>c&&(c=m);n>d&&(d=n)}m=Math.max(c-h,d-k);m=0!==m?1/m:0}earcutLinked(f,g,b,h,k,m);return g}
function linkedList(a,c,b,d,e){if(e===0<signedArea(a,c,b,d))for(e=c;e<b;e+=d)var f=insertNode(e,a[e],a[e+1],f);else for(e=b-d;e>=c;e-=d)f=insertNode(e,a[e],a[e+1],f);f&&equals(f,f.next)&&(removeNode(f),f=f.next);return f}function filterPoints(a,c){if(!a)return a;c||(c=a);var b=a;do{var d=!1;if(b.steiner||!equals(b,b.next)&&0!==area(b.prev,b,b.next))b=b.next;else{removeNode(b);b=c=b.prev;if(b===b.next)break;d=!0}}while(d||b!==c);return c}
function earcutLinked(a,c,b,d,e,f,g){if(a){!g&&f&&indexCurve(a,d,e,f);for(var h=a,k,l;a.prev!==a.next;)if(k=a.prev,l=a.next,f?isEarHashed(a,d,e,f):isEar(a))c.push(k.i/b),c.push(a.i/b),c.push(l.i/b),removeNode(a),h=a=l.next;else if(a=l,a===h){g?1===g?(a=cureLocalIntersections(a,c,b),earcutLinked(a,c,b,d,e,f,2)):2===g&&splitEarcut(a,c,b,d,e,f):earcutLinked(filterPoints(a),c,b,d,e,f,1);break}}}
function isEar(a){var c=a.prev,b=a.next;if(0<=area(c,a,b))return!1;for(var d=a.next.next;d!==a.prev;){if(pointInTriangle(c.x,c.y,a.x,a.y,b.x,b.y,d.x,d.y)&&0<=area(d.prev,d,d.next))return!1;d=d.next}return!0}
function isEarHashed(a,c,b,d){var e=a.prev,f=a.next;if(0<=area(e,a,f))return!1;var g=e.x>a.x?e.x>f.x?e.x:f.x:a.x>f.x?a.x:f.x,h=e.y>a.y?e.y>f.y?e.y:f.y:a.y>f.y?a.y:f.y,k=zOrder(e.x<a.x?e.x<f.x?e.x:f.x:a.x<f.x?a.x:f.x,e.y<a.y?e.y<f.y?e.y:f.y:a.y<f.y?a.y:f.y,c,b,d);c=zOrder(g,h,c,b,d);b=a.prevZ;for(d=a.nextZ;b&&b.z>=k&&d&&d.z<=c;){if(b!==a.prev&&b!==a.next&&pointInTriangle(e.x,e.y,a.x,a.y,f.x,f.y,b.x,b.y)&&0<=area(b.prev,b,b.next))return!1;b=b.prevZ;if(d!==a.prev&&d!==a.next&&pointInTriangle(e.x,e.y,
a.x,a.y,f.x,f.y,d.x,d.y)&&0<=area(d.prev,d,d.next))return!1;d=d.nextZ}for(;b&&b.z>=k;){if(b!==a.prev&&b!==a.next&&pointInTriangle(e.x,e.y,a.x,a.y,f.x,f.y,b.x,b.y)&&0<=area(b.prev,b,b.next))return!1;b=b.prevZ}for(;d&&d.z<=c;){if(d!==a.prev&&d!==a.next&&pointInTriangle(e.x,e.y,a.x,a.y,f.x,f.y,d.x,d.y)&&0<=area(d.prev,d,d.next))return!1;d=d.nextZ}return!0}
function cureLocalIntersections(a,c,b){var d=a;do{var e=d.prev,f=d.next.next;!equals(e,f)&&intersects(e,d,d.next,f)&&locallyInside(e,f)&&locallyInside(f,e)&&(c.push(e.i/b),c.push(d.i/b),c.push(f.i/b),removeNode(d),removeNode(d.next),d=a=f);d=d.next}while(d!==a);return d}
function splitEarcut(a,c,b,d,e,f){var g=a;do{for(var h=g.next.next;h!==g.prev;){if(g.i!==h.i&&isValidDiagonal(g,h)){a=splitPolygon(g,h);g=filterPoints(g,g.next);a=filterPoints(a,a.next);earcutLinked(g,c,b,d,e,f);earcutLinked(a,c,b,d,e,f);return}h=h.next}g=g.next}while(g!==a)}
function eliminateHoles(a,c,b,d){var e=[],f;var g=0;for(f=c.length;g<f;g++){var h=c[g]*d;var k=g<f-1?c[g+1]*d:a.length;h=linkedList(a,h,k,d,!1);h===h.next&&(h.steiner=!0);e.push(getLeftmost(h))}e.sort(compareX);for(g=0;g<e.length;g++)eliminateHole(e[g],b),b=filterPoints(b,b.next);return b}function compareX(a,c){return a.x-c.x}function eliminateHole(a,c){if(c=findHoleBridge(a,c)){var b=splitPolygon(c,a);filterPoints(b,b.next)}}
function findHoleBridge(a,c){var b=c,d=a.x,e=a.y,f=-Infinity;do{if(e<=b.y&&e>=b.next.y&&b.next.y!==b.y){var g=b.x+(e-b.y)*(b.next.x-b.x)/(b.next.y-b.y);if(g<=d&&g>f){f=g;if(g===d){if(e===b.y)return b;if(e===b.next.y)return b.next}var h=b.x<b.next.x?b:b.next}}b=b.next}while(b!==c);if(!h)return null;if(d===f)return h.prev;g=h;var k=h.x,l=h.y,m=Infinity;for(b=h.next;b!==g;){if(d>=b.x&&b.x>=k&&d!==b.x&&pointInTriangle(e<l?d:f,e,k,l,e<l?f:d,e,b.x,b.y)){var n=Math.abs(e-b.y)/(d-b.x);(n<m||n===m&&b.x>h.x)&&
locallyInside(b,a)&&(h=b,m=n)}b=b.next}return h}function indexCurve(a,c,b,d){var e=a;do null===e.z&&(e.z=zOrder(e.x,e.y,c,b,d)),e.prevZ=e.prev,e=e.nextZ=e.next;while(e!==a);e.prevZ.nextZ=null;e.prevZ=null;sortLinked(e)}
function sortLinked(a){var c,b,d,e,f=1;do{var g=a;var h=a=null;for(b=0;g;){b++;var k=g;for(c=d=0;c<f&&(d++,k=k.nextZ,k);c++);for(e=f;0<d||0<e&&k;)0!==d&&(0===e||!k||g.z<=k.z)?(c=g,g=g.nextZ,d--):(c=k,k=k.nextZ,e--),h?h.nextZ=c:a=c,c.prevZ=h,h=c;g=k}h.nextZ=null;f*=2}while(1<b);return a}
function zOrder(a,c,b,d,e){a=32767*(a-b)*e;c=32767*(c-d)*e;a=(a|a<<8)&16711935;a=(a|a<<4)&252645135;a=(a|a<<2)&858993459;c=(c|c<<8)&16711935;c=(c|c<<4)&252645135;c=(c|c<<2)&858993459;return(a|a<<1)&1431655765|((c|c<<1)&1431655765)<<1}function getLeftmost(a){var c=a,b=a;do c.x<b.x&&(b=c),c=c.next;while(c!==a);return b}function pointInTriangle(a,c,b,d,e,f,g,h){return 0<=(e-g)*(c-h)-(a-g)*(f-h)&&0<=(a-g)*(d-h)-(b-g)*(c-h)&&0<=(b-g)*(f-h)-(e-g)*(d-h)}
function isValidDiagonal(a,c){return a.next.i!==c.i&&a.prev.i!==c.i&&!intersectsPolygon(a,c)&&locallyInside(a,c)&&locallyInside(c,a)&&middleInside(a,c)}function area(a,c,b){return(c.y-a.y)*(b.x-c.x)-(c.x-a.x)*(b.y-c.y)}function equals(a,c){return a.x===c.x&&a.y===c.y}function intersects(a,c,b,d){return equals(a,c)&&equals(b,d)||equals(a,d)&&equals(b,c)?!0:0<area(a,c,b)!==0<area(a,c,d)&&0<area(b,d,a)!==0<area(b,d,c)}
function intersectsPolygon(a,c){var b=a;do{if(b.i!==a.i&&b.next.i!==a.i&&b.i!==c.i&&b.next.i!==c.i&&intersects(b,b.next,a,c))return!0;b=b.next}while(b!==a);return!1}function locallyInside(a,c){return 0>area(a.prev,a,a.next)?0<=area(a,c,a.next)&&0<=area(a,a.prev,c):0>area(a,c,a.prev)||0>area(a,a.next,c)}function middleInside(a,c){var b=a,d=!1,e=(a.x+c.x)/2,f=(a.y+c.y)/2;do b.y>f!==b.next.y>f&&b.next.y!==b.y&&e<(b.next.x-b.x)*(f-b.y)/(b.next.y-b.y)+b.x&&(d=!d),b=b.next;while(b!==a);return d}
function splitPolygon(a,c){var b=new Node(a.i,a.x,a.y),d=new Node(c.i,c.x,c.y),e=a.next,f=c.prev;a.next=c;c.prev=a;b.next=e;e.prev=b;d.next=b;b.prev=d;f.next=d;d.prev=f;return d}function insertNode(a,c,b,d){a=new Node(a,c,b);d?(a.next=d.next,a.prev=d,d.next.prev=a,d.next=a):(a.prev=a,a.next=a);return a}function removeNode(a){a.next.prev=a.prev;a.prev.next=a.next;a.prevZ&&(a.prevZ.nextZ=a.nextZ);a.nextZ&&(a.nextZ.prevZ=a.prevZ)}
function Node(a,c,b){this.i=a;this.x=c;this.y=b;this.nextZ=this.prevZ=this.z=this.next=this.prev=null;this.steiner=!1}earcut.deviation=function(a,c,b,d){var e=c&&c.length,f=Math.abs(signedArea(a,0,e?c[0]*b:a.length,b));if(e){e=0;for(var g=c.length;e<g;e++)f-=Math.abs(signedArea(a,c[e]*b,e<g-1?c[e+1]*b:a.length,b))}for(e=c=0;e<d.length;e+=3){g=d[e]*b;var h=d[e+1]*b,k=d[e+2]*b;c+=Math.abs((a[g]-a[k])*(a[h+1]-a[g+1])-(a[g]-a[h])*(a[k+1]-a[g+1]))}return 0===f&&0===c?0:Math.abs((c-f)/f)};
function signedArea(a,c,b,d){for(var e=0,f=b-d;c<b;c+=d)e+=(a[f]-a[c])*(a[c+1]+a[f+1]),f=c;return e}earcut.flatten=function(a){for(var c=a[0][0].length,b={vertices:[],holes:[],dimensions:c},d=0,e=0;e<a.length;e++){for(var f=0;f<a[e].length;f++)for(var g=0;g<c;g++)b.vertices.push(a[e][f][g]);0<e&&(d+=a[e-1].length,b.holes.push(d))}return b};
//end of earcut

//http://paulbourke.net/geometry/pointlineplane/javascript.txt
function getIntersect(c,d,f,g,a,e,b,h){if(c===f&&d===g||a===b&&e===h)return!1;var k=(h-e)*(f-c)-(b-a)*(g-d);if(0===k)return!1;b=((b-a)*(d-e)-(h-e)*(c-a))/k;a=((f-c)*(d-e)-(g-d)*(c-a))/k;return 0>b||1<b||0>a||1<a?!1:[c+b*(f-c),d+b*(g-d)]};

////////////////////////////
// distance to line https://jsfiddle.net/beentaken/9k1sf6p2/
function distSqr(b){return b*b}function distDist2(b,a){return distSqr(b.x-a.x)+distSqr(b.y-a.y)}function distToSegmentSquared(b,a,c){var d=distDist2(a,c);if(0==d)return distDist2(b,a);d=((b.x-a.x)*(c.x-a.x)+(b.y-a.y)*(c.y-a.y))/d;return 0>d?distDist2(b,a):1<d?distDist2(b,c):distDist2(b,{x:a.x+d*(c.x-a.x),y:a.y+d*(c.y-a.y)})}function distToSegment(b,a,c){return Math.sqrt(distToSegmentSquared(b,a,c))};

///////////////////

//////////////////
//point inside polygon
//https://github.com/substack/point-in-polygon
function pointInPolygon(h,b){var k=h[0],d=h[1],a,e=!1,c=0;for(a=b.length-1;c<b.length;a=c++){var f=b[c][0];var g=b[c][1];var l=b[a][0];a=b[a][1];(f=g>d!=a>d&&k<(l-f)*(d-g)/(a-g)+f)&&(e=!e)}return e};


//http://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
function earclip(l,c){var h=function(b){return(e[0]-d[0])*(b[1]-d[1])>(e[1]-d[1])*(b[0]-d[0])},k=function(){var a=[d[0]-e[0],d[1]-e[1]],c=[b[0]-f[0],b[1]-f[1]],g=d[0]*e[1]-d[1]*e[0],h=b[0]*f[1]-b[1]*f[0],k=1/(a[0]*c[1]-a[1]*c[0]);return[(g*c[0]-h*a[0])*k,(g*c[1]-h*a[1])*k]},a=l;var d=c[c.length-1];for(j in c){var e=c[j];var g=a;a=[];var b=g[g.length-1];for(i in g){var f=g[i];h(f)?(h(b)||a.push(k()),a.push(f)):h(b)&&a.push(k());b=f}d=e}return a};

var solidEnabled = "solidEnabled",
	jumpthruEnabled = "jumpthruEnabled",
	shadowEnabled = "shadowEnabled",
	objHeight = "objHeight",
	overrideRadius = "overrideRadius",
	lightOverlap = "lightOverlap",
	isShadowFlashlight = "isShadowFlashlight";


assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.FlashLight = function(runtime)
{
	this.runtime = runtime;
};

(function()
{
	var pluginProto = cr.plugins_.FlashLight.prototype;

	/////////////////////////////////////
	// Object type class
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
			// Get image as data URI
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
		var anim, frame, animObj, frameObj, wt, uv;

		this.all_frames = [];
		this.has_loaded_textures = false;

		var penumbra_img = this.penumbra_img = new Image();
		penumbra_img.cr_filesize = 20972;
		this.runtime.waitForImageLoad(this.penumbra_img, "flashlightPenumbra.png");
		this.umbraTex = null;

		// Load all animation frames
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animObj = {};
			animObj.name = anim[0];
			animObj.speed = anim[1];
			animObj.loop = anim[2];
			animObj.repeatcount = anim[3];
			animObj.repeatto = anim[4];
			animObj.pingpong = anim[5];
			animObj.sid = anim[6];
			animObj.frames = [];

			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameObj = {};
				frameObj.texture_file = frame[0];
				frameObj.texture_filesize = frame[1];
				frameObj.offx = frame[2];
				frameObj.offy = frame[3];
				frameObj.width = frame[4];
				frameObj.height = frame[5];
				frameObj.duration = frame[6];
				frameObj.hotspotX = frame[7];
				frameObj.hotspotY = frame[8];
				frameObj.image_points = frame[9];
				frameObj.poly_pts = frame[10];
				frameObj.pixelformat = frame[11];
				frameObj.spritesheeted = (frameObj.width !== 0);
				frameObj.datauri = ""; // generated on demand and cached
				frameObj.getDataUri = frame_getDataUri;

				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameObj.sheetTex = uv;

				frameObj.webGL_texture = null;

				// Sprite sheets may mean multiple frames reference one image
				// Ensure image is not created in duplicate
				wt = this.runtime.findWaitingTexture(frame[0]);

				if (wt)
				{
					frameObj.texture_img = wt;
				}
				else
				{
					frameObj.texture_img = new Image();
					frameObj.texture_img.cr_src = frame[0];
					frameObj.texture_img.cr_filesize = frame[1];
					frameObj.texture_img.c2webGL_texture = null;

					// Tell runtime to wait on this texture
					this.runtime.waitForImageLoad(frameObj.texture_img, frame[0]);
				}

				//cr.seal(frameObj);
				animObj.frames.push(frameObj);
				this.all_frames.push(frameObj);
			}

			//cr.seal(animObj);
			this.animations[i] = animObj; // swap array data for object
		}
		
	};

	typeProto.updateAllCurrentTexture = function()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};

	typeProto.onLostWebGLContext = function()
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
	};

	typeProto.onRestoreWebGLContext = function()
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
	};

	typeProto.loadTextures = function()
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

		var canvas = this.canvas = document.createElement("canvas");
		canvas.width = this.penumbra_img.width;
		canvas.height = this.penumbra_img.height;
		var ctx = this.ctx = canvas.getContext("2d");
		ctx.drawImage(this.penumbra_img, 0, 0, this.penumbra_img.width, this.penumbra_img.height);

		this.umbraTex = this.runtime.glwrap.createEmptyTexture(128, 128, this.runtime.linearSampling, false, false);
		this.runtime.glwrap.videoToTexture(this.canvas, this.umbraTex);
	};

	typeProto.unloadTextures = function()
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
	};

	var already_drawn_images = [];

	typeProto.preloadCanvas2D = function(ctx)
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
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

		// Physics needs to see the collision poly before onCreate
		var poly_pts = this.type.animations[0].frames[0].poly_pts;

		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		this.visible = this.properties[2] === 1;
		this.lightHeight = this.properties[4];
		this.radius = this.lightHeight === 0 ? this.properties[5] : 0;
		this.texScale = 1;
		this.desTexScale = this.properties[6];
		
		this.shadowCasters = [];
		this.ignoreTypeList = [];
		this.ignoreInstList = [];
		this.castGroupMode = this.properties[3]; //0=solids, 1=shadow beh, 2 = selected		
		this.shadowInfo = []; //shadow shape data
		//this.tempShadowPoly = new cr.CollisionPoly();

		this.inAnimTrigger = false;
		this.collisionsEnabled = true; //TODO check this
		this.cur_animation = this.getAnimationByName(this.properties[0]) || this.type.animations[0];
		this.cur_frame = this.properties[1];

		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;

		// Update poly and hotspot for the starting frame.
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;

		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;

		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();

		this.frameStart = this.animTimer.sum;
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";

		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;

		// Ensure type has textures loaded
		this.type.loadTextures();

		// Iterate all animations and frames ensuring WebGL textures are loaded and sizes are set
		var i, leni, j, lenj;
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
		}
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.enabled = true;
		this.invisibleOneTick = false;
		this.posBufferWidth = 4;
		this.isBlankOverlap = false;
		this.runtime.tick2Me(this);
		this.runtime.untickMe(this);
		this.candidateList = [];
		this.cutOutShapes = [];
		this.fullImageDrawCount = 0;
		this.updateShadows = false;
		this.last_x = this.x;
		this.last_y = this.y;
		this.last_a = this.angle;
		this.last_w = this.width;
		this.last_h = this.height;
		this.last_animation = "";
		this.last_frame = -1;
		
		var glw = this.runtime.glwrap;

		if (glw)
		{
			this.tempBlend = new Object();
			this.tempBlend.srcBlend = glw.gl.ONE;
			this.tempBlend.destBlend = glw.gl.ONE_MINUS_SRC_ALPHA;
			this.myWebGL_tex = glw.createEmptyTexture(this.curFrame.width*this.texScale, this.curFrame.height*this.texScale, this.runtime.linearSampling, false);
			this.blackWebGL_tex = glw.createEmptyTexture(16, 16, this.runtime.linearSampling, false);
			glw.setRenderingToTexture(this.blackWebGL_tex);
			glw.clear(0, 0, 0, 1); //set the texture to black...
			glw.setRenderingToTexture(null);
		}
		else
		{
			this.canvas = document.createElement('canvas');
			this.canvas.width = cr.abs(this.curFrame.width);
			this.canvas.height = cr.abs(this.curFrame.height);
			this.ctx = this.canvas.getContext('2d');
			this.fill = "rgba(0,0,0,1)";
		}
		
		this.SetTexScale();
	};

	instanceProto.onDestroy = function()
	{
		if (this.runtime.glwrap)
		{
			this.runtime.glwrap.deleteTexture(this.myWebGL_tex);
			this.runtime.glwrap.deleteTexture(this.blackWebGL_tex);
			this.myWebGL_tex = null;
			this.blackWebGL_tex = null;
		}

	};

	instanceProto.saveToJSON = function()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto
		};

		if (!this.animPlaying)
			o["ap"] = this.animPlaying;

		if (!this.animForwards)
			o["af"] = this.animForwards;

		return o;
	};

	instanceProto.loadFromJSON = function(o)
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
		this.SetTexScale();
	};

	instanceProto.animationFinish = function(reverse)
	{
		// stop
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;

		// trigger finish events
		this.animTriggerName = this.cur_animation.name;

		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.FlashLight.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.FlashLight.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;

		this.animRepeats = 0;
	};


	instanceProto.fillBorderPoints = function(edges, leftSideNo, rightSideNo, mybbox)
	{
		if (leftSideNo === rightSideNo)
			return;

		for (var i = 0; i < 4; i++)
		{
			var sideV = (leftSideNo + i + 1) % 4; // +1 to get the next vertex index

			edges.push([mybbox[sideV][0], mybbox[sideV][1]]);

			if (sideV === rightSideNo)
			{
				return;
			}
		}
	};

	instanceProto.getBorderIntersection = function(x0, y0, x1, y1)
	{
		var mybbox = [];
		var bquad = this.bquad;
		mybbox.push([bquad.tlx, bquad.tly]);
		mybbox.push([bquad.trx, bquad.try_]);
		mybbox.push([bquad.brx, bquad.bry]);
		mybbox.push([bquad.blx, bquad.bly]);

		var hitx, hity, sideNo, hit = false,
			ret = [];

		for (var i = 0; i < 4; i++)
		{
			var i1 = (i + 1) % 4;
			var intersect = getIntersect(x0, y0, x1, y1, mybbox[i][0], mybbox[i][1], mybbox[i1][0], mybbox[i1][1]);
			if (intersect)
			{
				hitx = intersect[0];
				hity = intersect[1];
				sideNo = i;
				hit = true;
				ret.push([hitx, hity, sideNo]);
			}
		}

		if (hit)
		{
			return ret;
		}
		else
		{
			return false;
		}

	};

	instanceProto.getAnimationByName = function(name_)
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

	instanceProto.getAnimationBySid = function(sid_)
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

	instanceProto.doChangeAnim = function()
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
		this.cur_anim_repeatto = anim.repeatto;

		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;

		// from beginning
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;

		this.animPlaying = true;
		this.frameStart = this.animTimer.sum;
		this.animForwards = true;

		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);

		this.runtime.redraw = true;
	};

	instanceProto.doChangeAnimFrame = function()
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
			this.frameStart = this.animTimer.sum;
			this.runtime.redraw = true;
		}

		this.changeAnimFrame = -1;
	};

	instanceProto.OnFrameChanged = function(prev_frame, next_frame)
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
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();

		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;

		this.SetTexScale();

		// Notify behaviors
		//TODO what are behavior_insts for?  Delete?

		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];

			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}

		// Trigger 'on frame changed'
		this.runtime.trigger(cr.plugins_.FlashLight.prototype.cnds.OnFrameChanged, this);
	};

	instanceProto.getImagePointIndexByName = function(name_)
	{
		var cur_frame = this.curFrame;

		var i, len;
		for (i = 0, len = cur_frame.image_points.length; i < len; i++)
		{
			if (cr.equals_nocase(name_, cur_frame.image_points[i][0]))
				return i;
		}

		return -1;
	};

	instanceProto.getImagePoint = function(imgpt, getX)
	{
		var cur_frame = this.curFrame;
		var image_points = cur_frame.image_points;
		var index;

		if (cr.is_string(imgpt))
			index = this.getImagePointIndexByName(imgpt);
		else
			index = imgpt - 1; // 0 is origin

		index = cr.floor(index);
		if (index < 0 || index >= image_points.length)
			return getX ? this.x : this.y; // return origin

		// get position scaled and relative to origin in pixels
		var x = (image_points[index][1] - cur_frame.hotspotX) * this.width;
		var y = image_points[index][2];

		y = (y - cur_frame.hotspotY) * this.height;

		// rotate by object angle
		var cosa = Math.cos(this.angle);
		var sina = Math.sin(this.angle);
		var x_temp = (x * cosa) - (y * sina);
		y = (y * cosa) + (x * sina);
		x = x_temp;
		x += this.x;
		y += this.y;
		return getX ? x : y;
	};

	instanceProto.tick2 = function()
	{
		this.animTimer.add(this.runtime.getDt(this));

		if (!this.visible)
		{
			return;
		}

		this.update_bbox();

		// Change any animation or frame that was queued
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();

		var now = this.animTimer.sum;
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;

		if (this.enabled && this.animPlaying && now >= this.frameStart + cur_frame_time)
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
					this.cur_frame = this.cur_anim_repeatto;
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
						this.cur_frame = this.cur_anim_repeatto;
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
						this.cur_frame = this.cur_anim_repeatto;
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
							this.cur_frame = this.cur_anim_repeatto;
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

			this.runtime.redraw = true;
		}

		this.doGeometry();
	};

	instanceProto.doGeometry = function()
	{
		if (!this.isOnScreen() || !this.visible || !this.enabled)
		{
			return;
		}

		this.isBlankOverlap = false;
		this.invisibleOneTick = false;
		this.updateShadows = false;

		if (this.x !== this.last_x || this.y !== this.last_y || this.angle !== this.last_a || this.width !== this.last_w || this.height !== this.last_h || this.curFrame !== this.last_frame || this.animation !== this.last_anim)
		{
			this.last_x = this.x;
			this.last_y = this.y;
			this.last_a = this.angle;
			this.last_w = this.width;
			this.last_h = this.height;
			this.last_animation = this.animation;
			this.last_frame = this.curFrame;
			this.updateShadows = true;
		}

		this.candidateList.length = 0;
		this.cutOutShapes.length = 0;
		this.shadowInfo.length = 0;
		var obst;

		if (this.castGroupMode === 0)
		{
			this.runtime.getSolidCollisionCandidates(this.layer, this.bbox, this.candidateList);

			for (var i = 0; i < this.candidateList.length; i++)
			{
				obst = this.candidateList[i];

				if (!obst.extra[solidEnabled])
				{
					this.candidateList.splice(i, 1);
					i--;
				}
			}

			var jumpthru = [];

			this.runtime.getJumpthruCollisionCandidates(this.layer, this.bbox, jumpthru);

			for (var i = 0; i < jumpthru.length; i++)
			{
				obst = jumpthru[i];

				if (!obst.extra[jumpthruEnabled])
				{
					jumpthru.splice(i, 1);
					i--;
				}
			}

			if (jumpthru.length > 0)
			{
				this.candidateList = this.candidateList.concat(jumpthru);
			}

		}

		if (cr.behaviors.FlashShadow && this.castGroupMode === 1)
		{
			var index = -1;

			for (i = 0; i < this.runtime.behaviors.length; i++)
			{
				if (this.runtime.behaviors[i] instanceof cr.behaviors.FlashShadow)
				{
					index = i;
				}
			}

			var shadowbehinsts = [];

			if (index !== -1)
			{
				var types = this.runtime.behaviors[index].my_types;

				this.runtime.getTypesCollisionCandidates(this.layer, types, this.bbox, shadowbehinsts);
			}

			for (var i = 0; i < shadowbehinsts.length; i++)
			{
				if (shadowbehinsts[i].extra && !shadowbehinsts[i].extra[shadowEnabled])
				{
					shadowbehinsts.splice(i, 1);
					i--;
				}
			}

			if (shadowbehinsts.length > 0)
			{
				this.candidateList = this.candidateList.concat(shadowbehinsts);
			}
		}

		var bespokeshadow = [];

		if (this.shadowCasters.length > 0)
		{
			for (var i = 0; i < this.shadowCasters.length; i++)
			{
				this.runtime.getCollisionCandidates(this.layer, this.shadowCasters[i], this.bbox, bespokeshadow);
			}

			for (var i = 0; i < bespokeshadow.length; i++)
			{
				if (bespokeshadow[i].extra && bespokeshadow[i].extra[isShadowFlashlight] && !bespokeshadow[i].extra[shadowEnabled])
				{
					bespokeshadow.splice(i, 1);
					i--;
				}
			}

			if (bespokeshadow.length > 0)
			{
				this.candidateList = this.candidateList.concat(bespokeshadow);
			}
		}

		cr.removeArrayDuplicates(this.candidateList);

		for (var i = 0; i < this.candidateList.length; i++)
		{
			obst = this.candidateList[i];

			if (this.ignoreTypeList.indexOf(obst.type) > -1 || this.ignoreInstList.indexOf(obst) > -1)
			{
				this.candidateList.splice(i, 1);
				i--;
			}
		}

		for (var i = 0; i < this.candidateList.length; i++)
		{
			obst = this.candidateList[i];

			if (!this.runtime.testOverlap(this, obst))
			{
				this.candidateList.splice(i, 1);
				i--;
				continue;
			}
			else
			{
				this.updateShadows = true;
			}

		}

		if (!this.updateShadows && this.fullImageDrawCount < 20)
		{
			this.drawFullImage();
			this.runtime.redraw = true;
			this.fullImageDrawCount++; //I have no idea why the glwrap needs >14 draw commands to remember the texture...
		}

		if (this.updateShadows)
		{
			this.drawFullImage();
			this.runtime.redraw = true;

			for (var i = 0; i < this.candidateList.length; i++)
			{
				this.fullImageDrawCount = 0;

				if (this.invisibleOneTick)
				{
					return;
				}

				obst = this.candidateList[i];
				var inputShape = [];

				//for added objects, this forces a shadow from the facing edges
				var lightHeight = 0;
				var objectHeight = 0;
				var r = this.radius;

				if (obst.extra && obst.extra[shadowEnabled])
				{
					if (obst.extra[objHeight])
					{
						lightHeight = this.lightHeight;
						objectHeight = obst.extra[objHeight];
					}

					if (obst.extra[overrideRadius] && obst.extra[overrideRadius] > -1)
					{
						r = obst.extra[overrideRadius];
					}
				}

				if (lightHeight === 0 || lightHeight <= objectHeight && lightHeight > 0)
				{
					if (obst.contains_pt(this.x, this.y))
					{
						this.isBlankOverlap = true;
						this.invisibleOneTick = true;
						//TODO test for tilemap - overlap check?

						if (obst.extra && obst.extra[shadowEnabled] && obst.extra[lightOverlap])
						{
							obst.extra[lightOverlap] = true;
						}
					}
				}

				if (!this.invisibleOneTick)
				{
					inputShape = this.getShapePoly(obst);
					var isMirrored = obst.width < 0;
					var isFlipped = obst.height < 0;
					var reversed = isFlipped !== isMirrored;

					if (inputShape[0] && inputShape[0].shape.length > 0)
					{
						var len = inputShape.length,
							uid = obst.uid;

						for (var q = 0; q < len; q++)
						{
							var shape = inputShape[q].shape;
							
							if (reversed)
								shape.reverse();
							
							var lenq = shape.length;
							
							if (lenq > 0)
							{
								this.drawShadowShapes(uid, shape, lightHeight, objectHeight, r);
							}
						}
					}
				}
			}
		}
	};

	instanceProto.drawShadowShapes = function(uid, shape, lightHeight, objectHeight, r)
	{
		var edges = [],
			deg90rad = 0.5 * Math.PI,
			shadowType,
			index, vertexR = -1,
			vertexL = -1,
			angMin = -10,
			angMax = -10,
			sLen = shape.length,
			x0, y0, x1, y1, here, line0, line1, dist, i0, i1, sideNos = [],
			norm, LtoV_min, LtoV_max, vToL_min, vToL_max, vToL, edgeA, vertexAngleData = [],
			umEdgeAngles = [],
			shadowLenMax = 1.4 * Math.max(Math.abs(this.width), Math.abs(this.height)),
			mybbox = [],
			bquad = this.bquad;

		mybbox.push([bquad.tlx, bquad.tly]);
		mybbox.push([bquad.trx, bquad.try_]);
		mybbox.push([bquad.brx, bquad.bry]);
		mybbox.push([bquad.blx, bquad.bly]);

		if (lightHeight === 0 || lightHeight <= objectHeight)
		{
			shadowType = 0; //throw shadows from front edge ob obj to edge of light
		}
		else
		{
			shadowType = 1; //throw shadows from back edge or, if inside, from all edges.  Length depends on distance to vertices and relative heights
		}

		function getAngles(myx, myy, myr, x0, y0)
		{
			var upper, lower, edgeAngle, normVL, newxR, newyR, newxL, newyL, LtoV0;

			LtoV0 = cr.angleTo(myx, myy, shape[i][0], shape[i][1]);
			normVL = LtoV0 + deg90rad;
			newxR = myx + myr * Math.cos(normVL);
			newyR = myy + myr * Math.sin(normVL);
			newxL = myx - myr * Math.cos(normVL);
			newyL = myy - myr * Math.sin(normVL);
			lower = cr.angleTo(newxR, newyR, shape[i][0], shape[i][1]); //ret
			upper = cr.angleTo(newxL, newyL, shape[i][0], shape[i][1]); //ret
			edgeAngle = cr.angleTo(shape[i][0], shape[i][1], shape[i1][0], shape[i1][1]); //ret

			return [LtoV0, lower, upper, edgeAngle];
		}

		for (var i = 0; i < sLen; i++)
		{
			i0 = i % sLen;
			i1 = (i + 1) % sLen;

			var angs = getAngles(this.x, this.y, r, shape[i][0], shape[i][1]);
			vertexAngleData.push(angs); //[LtoV0, lower, upper, edgeAngle]

			LtoV_min = angs[1];
			LtoV_max = angs[2];
			edgeA = angs[3];

			if (shadowType === 0) //infinite shadows from front faces
			{
				norm = edgeA - deg90rad;

				//check distance and dismiss algorithm if the shadowType = 0
				x0 = shape[i0][0];
				y0 = shape[i0][1];
				x1 = shape[i1][0];
				y1 = shape[i1][1];

				here = {
					"x": this.x,
					"y": this.y
				};
				line0 = {
					"x": x0,
					"y": y0
				};
				line1 = {
					"x": x1,
					"y": y1
				};
				dist = distToSegment(here, line0, line1);

				if (dist < Math.max(this.posBufferWidth, this.radius))
				{
					this.isBlankOverlap = true;
					this.invisibleOneTick = true;
					return false; //too close; cancel this shadow draw, turn the light off
				}
			}
			else //shadows of limited length from back faces
			{
				norm = edgeA + deg90rad;
			}

			if (shadowType === 0)
			{
				//find all edges that face the light
				vToL_min = LtoV_min + Math.PI;
				vToL_max = LtoV_max + Math.PI;

				if ((angMin === -10 || cr.angleClockwise(LtoV_min, angMin)) && cr.angleDiff(vToL_min, norm) < deg90rad)
				{
					angMin = LtoV_min;
					vertexR = i;
				}

				if ((angMax === -10 || !cr.angleClockwise(LtoV_max, angMax)) && cr.angleDiff(vToL_max, norm) < deg90rad)
				{
					angMax = LtoV_max;
					vertexL = i;
				}
			}
			else
			{
				vToL = angs[0] + Math.PI;

				//find the back edges
				//the order doesn't matter because each will simply draw a quad

				if (cr.angleDiff(vToL, norm) < deg90rad)
				{
					sideNos.push(i);
				}
			}
		}

		if (!this.invisibleOneTick)
		{
			if (shadowType === 0)
			{

				//generate edges array
				//it contains all of the edges that face the light, starting from the right hand side
				for (var i = 0; i < sLen; i++)
				{
					index = (vertexR + i) % sLen;

					edges.push(shape[index]);

					umEdgeAngles.push(vertexAngleData[index]);

					if (index === vertexL)
					{
						//edges contains vertex end coordinates for each edge, identified by the right hand side vertex number
						//so if the last vertex was at i, we need to push i + 1 in there as well
						var i1 = (index + 1) % sLen;
						edges.push(shape[i1]);
						umEdgeAngles.push(vertexAngleData[i1]);
						break;
					}
				}

				var insideCount = 0;
				var firstInsideNo = -1;
				var lastInsideNo = -1;
				var shadowLeft = false;
				var shadowRight = false;
				var leftSideNo, rightSideNo;

				for (var i = 0; i < edges.length; i++)
				{
					//find the first and last vertex in edges that are inside the bbox
					if (edges[i] !== undefined)
					{
						if (this.bquad.contains_pt(edges[i][0], edges[i][1]))
						{
							lastInsideNo = i;
							insideCount++;
	
							if (firstInsideNo === -1)
							{
								firstInsideNo = i;
							}
						}
						else
						{
							edges[i][2] = 1;
						}
					}
					else
					{
						//console.error("the edge array index " + i + " was undefined");
						return;
					}
					
				}

				if (insideCount === 0)
				{
					//find the two bbox edges that intersect the edge line, earclip it and get shape
					var borderInt;

					if (edges.length < 2)
					{
						//console.error("The edges array was too short:");
						//console.error(edges.length);
						return; 
					}

					for (var i = 0; i < edges.length; i++)
					{
						var i1 = (i + 1) % edges.length;

						borderInt = this.getBorderIntersection(edges[i][0], edges[i][1], edges[i1][0], edges[i1][1]);

						if (borderInt)
						{
							break;
						}
					}

					if (!borderInt)
					{
						//console.error("No overlapping edges for uid " + uid + " were found, which means the c2 collision system was at fault!");
						return;
					}
					if (borderInt.length !== 2)
					{
						//console.error("Did not find two overlap points.  See object uid " + uid);
						return;
					}

					edges.length = 0;
					umEdgeAngles.length = 0;

					var va = [borderInt[0][0], borderInt[0][1]];
					var vb = [borderInt[1][0], borderInt[1][1]];
					var ava = cr.angleTo(this.x, this.y, va[0], va[1]);
					var avb = cr.angleTo(this.x, this.y, vb[0], vb[1]);

					if (cr.angleClockwise(ava, avb)) //which end is which?
					{
						edges[0] = va;
						edges[1] = vb;
						rightSideNo = borderInt[0][2];
						leftSideNo = borderInt[1][2];
					}
					else
					{
						edges[0] = vb;
						edges[1] = va;
						rightSideNo = borderInt[1][2];
						leftSideNo = borderInt[0][2];
					}

					this.fillBorderPoints(edges, leftSideNo, rightSideNo, mybbox);

					this.drawShadow(edges);

					var info = [];
					info.uid = uid;
					info.shape = edges;
					this.shadowInfo.push(info);

				}
				else //if insideCount >= 1
				{
					var leftBorderInt, rightBorderInt, x0, y0, x1, y1;
					var maxA, minA, edgeA;
					var outerRx, outerRy, vertRx, vertRy;
					var outerLx, outerLy, vertLx, vertLy;

					var i_Rout = firstInsideNo - 1;

					if (i_Rout < 0)
					{
						// the firstInsideNo was also the first vertex on the first edge; reset to zero
						i_Rout = 0;
						shadowRight = true;
					}

					var i_Lout = lastInsideNo + 1;

					if (i_Lout > edges.length - 1)
					{
						//the lastInsideNo vertex was also the last vertex of the last edge edge; reset to lastInsideNo value
						i_Lout = lastInsideNo;
						shadowLeft = true;
					}

					//draw 2nd vertex penumbras first
					maxA = umEdgeAngles[1][2];
					minA = umEdgeAngles[1][1];
					edgeA = umEdgeAngles[0][3] + Math.PI;

					if (r > 0 && cr.angleClockwise(maxA, edgeA))
					{
						//draw penumbra from 2nd vertex if the edge angle is within the penumbra angles
						x0 = edges[1][0] + shadowLenMax * Math.cos(maxA);
						y0 = edges[1][1] + shadowLenMax * Math.sin(maxA);
						x1 = edges[1][0] + shadowLenMax * Math.cos(minA);
						y1 = edges[1][1] + shadowLenMax * Math.sin(minA);

						this.drawPenumbra(edges[1][0], edges[1][1], x0, y0, x1, y1);
					}

					if (shadowRight)
					{
						//cast a min angle shadow line to intersect the bbox
						minA = umEdgeAngles[i_Rout][1];
						vertRx = edges[i_Rout][0];
						vertRy = edges[i_Rout][1];
						outerRx = vertRx + shadowLenMax * Math.cos(minA);
						outerRy = vertRy + shadowLenMax * Math.sin(minA);

						if (r > 0)
						{
							maxA = umEdgeAngles[i_Rout][2];
							edgeA = umEdgeAngles[i_Rout][3] + Math.PI;

							if (cr.angleClockwise(maxA, edgeA))
							{
								maxA = edgeA;
							}

							x0 = vertRx + shadowLenMax * Math.cos(minA);
							y0 = vertRy + shadowLenMax * Math.sin(minA);
							x1 = vertRx + shadowLenMax * Math.cos(maxA);
							y1 = vertRy + shadowLenMax * Math.sin(maxA);

							this.drawPenumbra(edges[0][0], edges[0][1], x1, y1, x0, y0);
						}
					}
					else
					{
						//no shadow from the right
						//cut the first edge to where it intersects with the bbox
						outerRx = edges[i_Rout][0];
						outerRy = edges[i_Rout][1];
						vertRx = edges[i_Rout + 1][0];
						vertRy = edges[i_Rout + 1][1];
					}


					var end1 = i_Lout - 1;
					if (end1 < 0) end1 = 0;
					minA = umEdgeAngles[end1][1];
					maxA = umEdgeAngles[end1][2];
					edgeA = umEdgeAngles[end1][3];

					if (r > 0 && cr.angleClockwise(edgeA, minA))
					{
						//draw penumbra from 2nd vertex from left if the edge angle is appropriate
						var vx = edges[end1][0];
						var vy = edges[end1][1];
						x0 = vx + shadowLenMax * Math.cos(minA);
						y0 = vy + shadowLenMax * Math.sin(minA);
						x1 = vx + shadowLenMax * Math.cos(maxA);
						y1 = vy + shadowLenMax * Math.sin(maxA);

						this.drawPenumbra(vx, vy, x0, y0, x1, y1);
					}

					//get position of left hand shadow intersection with the border
					if (shadowLeft)
					{
						//cast a min angle shadow line to intersect the bbox
						maxA = umEdgeAngles[i_Lout][2];
						vertLx = edges[i_Lout][0];
						vertLy = edges[i_Lout][1];
						outerLx = vertLx + shadowLenMax * Math.cos(maxA);
						outerLy = vertLy + shadowLenMax * Math.sin(maxA);

						if (r > 0)
						{
							minA = umEdgeAngles[i_Lout][1];
							edgeA = umEdgeAngles[i_Lout - 1][3];

							if (!cr.angleClockwise(minA, edgeA))
							{
								minA = edgeA;
							}

							x0 = vertLx + shadowLenMax * Math.cos(minA);
							y0 = vertLy + shadowLenMax * Math.sin(minA);
							x1 = vertLx + shadowLenMax * Math.cos(maxA);
							y1 = vertLy + shadowLenMax * Math.sin(maxA);

							this.drawPenumbra(vertLx, vertLy, x0, y0, x1, y1);
						}
					}
					else
					{
						//no shadow from the left
						//cut the first edge to where it intersects with the bbox
						outerLx = edges[i_Lout][0];
						outerLy = edges[i_Lout][1];
						vertLx = edges[i_Lout - 1][0];
						vertLy = edges[i_Lout - 1][1];
					}

					rightBorderInt = this.getBorderIntersection(vertRx, vertRy, outerRx, outerRy);
					if (rightBorderInt)
					{
						rightSideNo = rightBorderInt[0][2];

						if (shadowRight) //vertex 0 was inside the bbox
						{
							//add the shadow line from vertex 0 to the bbox
							edges.unshift([rightBorderInt[0][0], rightBorderInt[0][1]]);
						}
						else
						{
							//change the first vertex position to the intersection
							edges[i_Rout][0] = rightBorderInt[0][0];
							edges[i_Rout][1] = rightBorderInt[0][1];
						}

					}
					else
					{
						//console.error("reporting no border intersection of right shadow to bbox");
						return;
					}

					leftBorderInt = this.getBorderIntersection(vertLx, vertLy, outerLx, outerLy);
					if (leftBorderInt)
					{
						leftSideNo = leftBorderInt[0][2];

						if (shadowLeft) //last vertex was inside the bbox
						{
							//add the shadow line from vertex 0 to the bbox
							edges.push([leftBorderInt[0][0], leftBorderInt[0][1]]);
						}
						else
						{
							//change the last vertex position to the intersection
							edges[edges.length - 1][0] = leftBorderInt[0][0];
							edges[edges.length - 1][1] = leftBorderInt[0][1];
						}

					}
					else
					{
						//console.error("reporting no border intersection of left shadow to bbox");
						return;
					}

					this.fillBorderPoints(edges, leftSideNo, rightSideNo, mybbox);

					this.drawShadow(edges);

					var info = [];
					info.uid = uid;
					info.shape = edges;
					this.shadowInfo.push(info);
				}

			}
			else
			{
				//shadowType === 1
				var sideNoLen = sideNos.length;
				var shapeLen = shape.length;
				var distToV0, distToV1, angToV0, angToV1, newx0, newy0, newx1, newy1, len0, len1, deltaH;
				var thisQuad;

				for (var i = 0; i < sideNoLen; i++)
				{
					i0 = sideNos[i];
					i1 = (i0 + 1) % shapeLen;

					
					deltaH = lightHeight - objectHeight;
					x0 = shape[i0][0];
					y0 = shape[i0][1];
					x1 = shape[i1][0];
					y1 = shape[i1][1];
					distToV0 = cr.distanceTo(this.x, this.y, x0, y0);
					distToV1 = cr.distanceTo(this.x, this.y, x1, y1);
					angToV0 = cr.angleTo(this.x, this.y, x0, y0);
					angToV1 = cr.angleTo(this.x, this.y, x1, y1);
					len0 = distToV0 * objectHeight / deltaH;
					len1 = distToV1 * objectHeight / deltaH;
					newx0 = x0 + len0 * Math.cos(angToV0);
					newy0 = y0 + len0 * Math.sin(angToV0);
					newx1 = x1 + len1 * Math.cos(angToV1);
					newy1 = y1 + len1 * Math.sin(angToV1);
					thisQuad = [
						[x0, y0],
						[newx0, newy0],
						[newx1, newy1],
						[x1, y1]];

					this.drawShadow(thisQuad);

					var info = [];
					info.uid = uid;
					info.shape = thisQuad;
					this.shadowInfo.push(info);
				}
			}
		}
	};
	
	instanceProto.drawPenumbra = function(x0, y0, x1, y1, x2, y2)
	{
		var glw = this.runtime.glwrap;

		if (glw)
		{
			var old_width = glw.width;
			var old_height = glw.height;
			var w = this.curFrame.width * this.texScale;
			var h = this.curFrame.height * this.texScale;
			glw.setRenderingToTexture(this.myWebGL_tex);
			glw.setSize(w, h);
			glw.resetModelView();
			var scalex = w / this.width;
			var scaley = h / this.height;
			glw.scale(scalex, -scaley);
			glw.setTexture(this.type.umbraTex);
			glw.setOpacity(1);
			cr.setGLBlend(this.tempBlend, 8, glw.gl);
			glw.setBlend(this.tempBlend.srcBlend, this.tempBlend.destBlend);
			glw.quadTexUV(x0, y0, x1, y1, x2, y2, x0, y0, 0, 0, 1, 0, 1, 1, 0, 0);
			glw.setRenderingToTexture(null);
			glw.setSize(old_width, old_height);
		}
	};

	instanceProto.drawShadow = function(poly)
	{
		var glw = this.runtime.glwrap;

		if (glw)
		{
			var old_width = glw.width;
			var old_height = glw.height;
			var w = this.curFrame.width * this.texScale;
			var h = this.curFrame.height * this.texScale;
			glw.setRenderingToTexture(this.myWebGL_tex);
			glw.setSize(w, h);
			glw.resetModelView();
			var scalex = w / this.width;
			var scaley = h / this.height;
			glw.scale(scalex, -scaley);
			glw.setTexture(this.blackWebGL_tex);
			glw.setOpacity(1);
			cr.setGLBlend(this.tempBlend, 8, glw.gl);
			glw.setBlend(this.tempBlend.srcBlend, this.tempBlend.destBlend);
			
			if (poly.length === 4)
			{
				glw.quad(poly[0][0], poly[0][1], poly[1][0], poly[1][1], poly[2][0], poly[2][1], poly[3][0], poly[3][1]);
			}
			else
			{
				//earcut it
				var p = [];

				for (var i = 0; i < poly.length; i++)
				{
					p.push(poly[i][0]);
					p.push(poly[i][1]);
				}

				var cut = earcut(p);

				for (var i = 0; i < cut.length; i += 3)
				{
					var i1 = cut[i];
					var i2 = cut[i + 1];
					var i3 = cut[i + 2];
					glw.quad(p[i1 * 2], p[i1 * 2 + 1], p[i2 * 2], p[i2 * 2 + 1], p[i3 * 2], p[i3 * 2 + 1], p[i3 * 2], p[i3 * 2 + 1]);
				}
			}

			glw.setRenderingToTexture(null);
			glw.setSize(old_width, old_height);
		}
		else
		{
			var ctx = this.ctx;
			ctx.save();
			var scalex = this.curFrame.width / this.width;
			var scaley = this.curFrame.height / this.height;
			ctx.scale(scalex, scaley);
			ctx.rotate(-this.angle);
			ctx.translate(-this.bquad.tlx, -this.bquad.tly);
			ctx.globalCompositeOperation = cr.effectToCompositeOp(8);
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(poly[0][0], poly[0][1]);

			for (var i = 1; i < poly.length; i++)
			{
				ctx.lineTo(poly[i][0], poly[i][1]);
			}

			ctx.closePath();
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}

		this.runtime.redraw = true;
	};

	instanceProto.isOnScreen = function()
	{
		var layer = this.layer;
		this.update_bbox();
		var bbox = this.bbox;
		var border = 10;

		return !(bbox.right < layer.viewLeft - border || bbox.bottom < layer.viewTop - border || bbox.left > layer.viewRight + border || bbox.top > layer.viewBottom + border);
	};

	instanceProto.drawFullImage = function()
	{
		var glw = this.runtime.glwrap;
		var cur_frame = this.curFrame;
		var cur_image = cur_frame.texture_img;

		if (glw)
		{
			glw.lastTexture0 = null;
			glw.setRenderingToTexture(this.myWebGL_tex);

			glw.clear(0, 0, 0, 0);
			glw.setOpacity(this.opacity);
			var old_width = glw.width;
			var old_height = glw.height;
			var w = this.curFrame.width * this.texScale;
			var h = this.curFrame.height * this.texScale;
			glw.setSize(w, h);
			glw.resetModelView();
			var scalex = w / this.width;
			var scaley = h / this.height;
			glw.scale(scalex, -scaley);
			glw.rotateZ(-this.angle);
			glw.translate((this.bbox.left + this.bbox.right) / -2, (this.bbox.top + this.bbox.bottom) / -2);
			glw.updateModelView();

			cr.setGLBlend(this.tempBlend, 0, glw.gl);
			glw.setBlend(this.tempBlend.srcBlend, this.tempBlend.destBlend);
			glw.setTexture(this.curFrame.webGL_texture);
			
			var q = this.bquad;

			if (this.runtime.pixel_rounding)
			{
				var ox = Math.round(this.x) - this.x;
				var oy = Math.round(this.y) - this.y;

				if (cur_frame.spritesheeted)
				{
					glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
				}
				else
				{
					glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
				}
			}
			else
			{
				if (cur_frame.spritesheeted)
				{
					glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
				}
				else
				{
					glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
				}
			}
			
			glw.setRenderingToTexture(null);
			glw.setSize(old_width, old_height);
		}
		else
		{
			var ctx = this.ctx;
			var cur_image = cur_frame.texture_img;

			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.globalAlpha = this.opacity;

			if (cur_frame.spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height, 0, 0, cur_frame.width, cur_frame.height);
			}
			else
			{
				ctx.drawImage(cur_image, 0, 0, cur_frame.width, cur_frame.height);
			}
		}

		this.runtime.redraw = true;
	};

	

	instanceProto.draw = function(ctx)
	{
		if (this.invisibleOneTick)
		{
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		else
		{
			ctx.globalAlpha = this.opacity;
			ctx.save();
			ctx.translate(this.x, this.y);

			var widthfactor = this.width > 0 ? 1 : -1;
			var heightfactor = this.height > 0 ? 1 : -1;
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);

			ctx.rotate(this.angle * widthfactor * heightfactor);

			ctx.drawImage(this.canvas,
				0 - cr.abs(this.hotspotX * this.width),
				0 - cr.abs(this.hotspotY * this.height),
				cr.abs(this.width),
				cr.abs(this.height));

			ctx.restore();
		}
	};

	instanceProto.drawGL = function(glw)
	{

		if (this.invisibleOneTick)
		{
			var q = this.bquad;
			glw.setTexture(this.myWebGL_tex);
			glw.setOpacity(0);
			glw.setBlend(this.srcBlend, this.destBlend);
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
		else
		{
			var q = this.bquad;
			glw.setTexture(this.myWebGL_tex);
			glw.setOpacity(this.opacity);
			glw.setBlend(this.srcBlend, this.destBlend);
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};

	instanceProto.getShapePoly = function(obst)
	{
		var pts_cache;
		var inputShape = [];


		if (obst.tilemap_exists)
		{
			var collrects = [];
			var overlaps = [];
			var offx = obst.x
			var offy = obst.y;

			obst.update_bbox();
			obst.getCollisionRectCandidates(this.bbox, collrects);

			for (var i = 0; i < collrects.length; i++)
			{
				var rc = collrects[i].rc;

				if (rc.intersects_rect(this.bbox))
				{
					overlaps.push(collrects[i]);
				}
			}

			for (var ti = 0; ti < overlaps.length; ti++)
			{
				var c = overlaps[ti];
				var rc = c.rc;
				var left = rc.left + obst.x;
				var top = rc.top + obst.y;
				var right = rc.right + obst.x;
				var bottom = rc.bottom + obst.y;

				if (c.poly)
				{
					pts_cache = c.poly.pts_cache;
					inputShape[ti] = [];
					inputShape[ti].uid = obst.uid;
					inputShape[ti].shape = [];

					for (var p = 0; p < pts_cache.length; p += 2)
					{
						inputShape[ti].shape.push([pts_cache[p] + left, pts_cache[p + 1] + top]);
					}
				}
				else
				{
					inputShape[ti] = [];
					inputShape[ti].uid = obst.uid;
					inputShape[ti].shape = [];
					inputShape[ti].shape.push([left, top]);
					inputShape[ti].shape.push([right, top]);
					inputShape[ti].shape.push([right, bottom]);
					inputShape[ti].shape.push([left, bottom]);
				}
			}
			collrects.length = 0;
			overlaps.length = 0;
		}
		else if (obst.collision_poly !== null && obst.collision_poly.is_empty() || !obst.collision_poly)
		{
			//tiled bg or sprite with no poly
			var q = obst.bquad;
			inputShape[0] = [];
			inputShape[0].uid = obst.uid;
			inputShape[0].shape = [];
			inputShape[0].shape.push([q.tlx, q.tly]);
			inputShape[0].shape.push([q.trx, q.try_]);
			inputShape[0].shape.push([q.brx, q.bry]);
			inputShape[0].shape.push([q.blx, q.bly]);
		}
		else
		{
			var obstw = Math.max(Math.abs(obst.width), 1);
			var obsth = Math.max(Math.abs(obst.height), 1);
			var ismirrored = obst.width < 0;
			var isflipped = obst.height < 0;
			obst.collision_poly.cache_poly(ismirrored ? -obstw : obstw, isflipped ? -obsth : obsth, obst.angle);
			pts_cache = obst.collision_poly.pts_cache;
			inputShape[0] = [];
			inputShape[0].uid = obst.uid;
			inputShape[0].shape = [];

			for (var p = 0; p < pts_cache.length; p += 2)
			{
				inputShape[0].shape.push([pts_cache[p] + obst.x, pts_cache[p + 1] + obst.y]);
			}
		}

		return inputShape;
	};

	///**BEGIN-PREVIEWONLY**/

	instanceProto.getDebuggerValues = function(propsections)
	{
		propsections.push(
		{
			"title": "Animation",
			"properties": [
			{
				"name": "Running animation",
				"value": this.cur_animation.name
			},
			{
				"name": "Frame number",
				"value": this.cur_frame
			},
			{
				"name": "Playing",
				"value": this.animPlaying
			},
			{
				"name": "Speed",
				"value": this.cur_anim_speed
			},
			{
				"name": "Repeats",
				"value": this.animRepeats
			}]
		});
	};

	instanceProto.onDebugValueEdited = function(header, name, value)
	{
		if (header === "Animation")
		{
			if (name === "Running animation")
			{
				this.changeAnimName = value;
				this.changeAnimFrom = 0; // from current frame

				// not in trigger: apply immediately
				if (!this.inAnimTrigger)
					this.doChangeAnim();
			}
			else if (name === "Frame Number")
			{
				this.changeAnimFrame = value;

				// not in trigger: apply immediately
				if (!this.inAnimTrigger)
					this.doChangeAnimFrame();
			}
			else if (name === "Playing")
			{
				this.animPlaying = value;

				if (this.animPlaying)
				{
					this.frameStart = this.animTimer.sum;


				}
			}
			else if (name === "Speed")
			{
				this.cur_anim_speed = cr.abs(value);
				this.animForwards = (value >= 0);

			}
			else if (name === "Repeats")
			{
				this.animRepeats = value;
			}
		}
	};

	///**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds()
	{};

	// For the collision memory in 'On collision'.
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
		// comma separated string with lowest value first
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
			// added already; just update tickcount
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

				// Referenced in either UID: must be removed
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

	Cnds.prototype.OnCollision = function(rtype)
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

			runtime.addDestroyCallback(function(inst)
			{
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}

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
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
			}
			else
				rinstances = rsol.getObjects();

			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];

				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));

					// objects are still touching so update the tickcount
					collmemory_add(collmemory, linst, rinst, tickcount);

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
							curlsol.instances.length = 2; // just use lsol, is same reference as rsol
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
					collmemory_remove(collmemory, linst, rinst);
				}
			}

			candidates1.length = 0;
		}

		// We've aleady run the event by now.
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
		var oldx, oldy, ret = false,
			r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;

		if (rsol.select_all)
		{
			this.update_bbox();

			// Make sure queried box is offset the same as the collision offset so we look in
			// the right cells
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			// Normally the instances to process are in the else_instances array. However if a parent normal block
			// already picked from rtype, it will have select_all off, no else_instances, and just some content
			// in 'instances'. Look for this case in the first condition only.
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

			// objects overlap: true for this instance, ensure both are picked
			// (if ltype and rtype are same, e.g. "Sprite overlaps Sprite", don't pick the other instance,
			// it will be picked when it gets iterated to itself)
			if (this.runtime.testOverlap(this, rinst))
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
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}

		candidates2.length = 0;
		return ret;
	};

	typeProto.finish = function(do_pick)
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
				cr.clearArray(sol.instances);

				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}

				// In OR blocks, else_instances must also be filled with objects not in topick
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

	Cnds.prototype.IsOverlapping = function(rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};

	Cnds.prototype.IsOverlappingOffset = function(rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};

	Cnds.prototype.IsAnimPlaying = function(animname)
	{
		// If awaiting a change of animation to really happen next tick, compare to that now
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};

	Cnds.prototype.CompareFrame = function(cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};

	Cnds.prototype.CompareAnimSpeed = function(cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};

	Cnds.prototype.OnAnimFinished = function(animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};

	Cnds.prototype.OnAnyAnimFinished = function()
	{
		return true;
	};

	Cnds.prototype.OnFrameChanged = function()
	{
		return true;
	};

	Cnds.prototype.IsMirrored = function()
	{
		return this.width < 0;
	};

	Cnds.prototype.IsFlipped = function()
	{
		return this.height < 0;
	};

	Cnds.prototype.OnURLLoaded = function()
	{
		return true;
	};

	Cnds.prototype.IsCollisionEnabled = function()
	{
		return this.collisionsEnabled;
	};

	Cnds.prototype.BlankedByObstacle = function()
	{
		return this.isBlankOverlap;
	};

	Cnds.prototype.IsEnabled = function()
	{
		return this.enabled;
	};

	Cnds.prototype.InstCastsShadow = function(rtype)
	{
		if (this.candidateList.length === 0)
		{
			return false;
		}

		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances = [];

		if (rsol.select_all)
		{
			this.update_bbox();
			this.runtime.getCollisionCandidates(this.layer, rtype, this.bbox, rinstances);
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

		if (rinstances[0].type === rtype)
		{
			return true;
		}

		return false;
	};

	Cnds.prototype.InstIsInIgnoreList = function(rtype)
	{
		if (this.ignoreInstList.length === 0)
		{
			return false;
		}

		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances = [];

		if (rsol.select_all)
		{
			this.update_bbox();
			this.runtime.getCollisionCandidates(this.layer, rtype, this.bbox, rinstances);
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

		if (rinstances[0].type === rtype)
		{
			return true;
		}

		return false;
	};

	Cnds.prototype.TypeInShadowList = function(rtype)
	{
		if (this.shadowCasters.length === 0)
		{
			return false;
		}

		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances = [];

		if (rsol.select_all)
		{
			this.update_bbox();
			this.runtime.getCollisionCandidates(this.layer, rtype, this.bbox, rinstances);
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

		var len = rinstances.length;

		for (var i = 0; i < len; i++)
		{
			if (rinstances[i].type === rtype)
			{
				return true;
			}
		}

		return false;
	};

	Cnds.prototype.TypeIsInIgnoreList = function(rtype)
	{
		if (this.ignoreTypeList.length === 0)
		{
			return false;
		}

		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances = [];

		if (rsol.select_all)
		{
			this.update_bbox();
			this.runtime.getCollisionCandidates(this.layer, rtype, this.bbox, rinstances);
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


		var len = rinstances.length;

		for (var i = 0; i < len; i++)
		{
			if (rinstances[i].type === rtype)
			{
				return true;
			}
		}

		return false;
	};

	Cnds.prototype.IsInShadow = function(rtype)
	{
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances = [];
		var instShape;

		if (rsol.select_all)
		{
			this.update_bbox();
			this.runtime.getCollisionCandidates(this.layer, rtype, this.bbox, rinstances);
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

		//for now, just pick the top instance
		//TODO update this and the sol?
		var inst = rinstances[0];

		//if (!inst.bquad.intersects_quad(this.bquad)) //TODO do more just a bbox overlap check first?
		//		return false;

		if (!this.runtime.testOverlap(this, inst))
		{
			return true;
		}

		//then do a collision check?  No...
		instShape = this.getShapePoly(inst);
		var noOfPoints = instShape[0].shape.length;
		var count = 0;

		//just test that each inst vertex is inside at least one shadow shape in this
		var shadowI = this.shadowInfo;

		//check each vertex in turn

		for (var i = 0; i < noOfPoints; i++)
		{
			var thispointin = false;

			var point = instShape[0].shape[i];

			for (var j = 0; j < shadowI.length; j++)
			{
				if (shadowI[j].uid === inst.uid)
					continue;

				var shadowShape = shadowI[j].shape;

				if (pointInPolygon(point, shadowShape))
				{
					thispointin = true;
				}
			}

			if (!thispointin)
			{
				return false;
			}
		}

		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts()
	{};

	Acts.prototype.Spawn = function(obj, layer, imgpt)
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

		// This action repeats for all picked instances.  We want to set the current
		// selection to all instances that are created by this action.  Therefore,
		// reset the SOL only for the first instance.  Determine this by the last tick count run.
		// HOWEVER loops and the 'on collision' event re-triggers events, re-running the action
		// with the same tickcount.  To get around this, triggers and re-triggering events increment
		// the 'execcount', so each execution of the action has a different execcount even if not
		// the same tickcount.
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;

		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}

		var sol;

		// Pick just this instance, as long as it's a different type (else the SOL instances array is
		// potentially modified while in use)
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

			// Siblings aren't in instance lists yet, pick them manually
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

	Acts.prototype.SetEffect = function(effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};

	Acts.prototype.StopAnim = function()
	{
		this.animPlaying = false;
		//log("Stopping animation");
	};

	Acts.prototype.StartAnim = function(from)
	{
		this.animPlaying = true;
		this.frameStart = this.animTimer.sum;
		//log("Starting animation");

		// from beginning
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;

			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}


	};

	Acts.prototype.SetAnim = function(animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;


		// not in trigger: apply immediately
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};

	Acts.prototype.SetAnimFrame = function(framenumber)
	{
		this.changeAnimFrame = framenumber;


		// not in trigger: apply immediately
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};

	Acts.prototype.SetAnimSpeed = function(s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);

		//this.frameStart = this.runtime.kahanTime.sum;

	};

	Acts.prototype.SetAnimRepeatToFrame = function(s)
	{
		s = Math.floor(s);

		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;

		this.cur_anim_repeatto = s;
	};

	Acts.prototype.SetMirrored = function(m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);

		if (this.width === neww)
			return;

		this.width = neww;
		this.set_bbox_changed();
	};

	Acts.prototype.SetFlipped = function(f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);

		if (this.height === newh)
			return;

		this.height = newh;
		this.set_bbox_changed();
	};

	Acts.prototype.SetScale = function(s)
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

	Acts.prototype.LoadURL = function(url_, resize_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;

		img.onload = function()
		{
			// If this action was used on multiple instances, they will each try to create a
			// separate image or texture, which is a waste of memory. So if the same image has
			// already been loaded, ignore this callback.
			if (curFrame_.texture_img.src === img.src)
			{
				// Still may need to switch to using the image's texture in WebGL renderer
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;

				// Still may need to update object size
				if (resize_ === 0) // resize to image size
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}

				// Still need to trigger 'On loaded'
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.FlashLight.prototype.cnds.OnURLLoaded, self);

				return;
			}

			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0; // reset to RGBA, since we don't know what type of image will have come in
			// and it could be different to what the exporter set for the original image

			// WebGL renderer: need to create texture (canvas2D just draws with img directly)
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);

				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);

				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;

				// Need to update other instance's curWebGLTexture
				self.type.updateAllCurrentTexture();
			}

			// Set size if necessary
			if (resize_ === 0) // resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}

			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.FlashLight.prototype.cnds.OnURLLoaded, self);
		};

		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img["crossOrigin"] = "anonymous";

		// use runtime function to work around WKWebView permissions
		this.runtime.setImageSrc(img, url_);
	};



	Acts.prototype.AddShadowObject = function(type) /////
	{
		if (this.shadowCasters.indexOf(type) === -1)
		{
			this.shadowCasters.push(type);
		}
	};

	Acts.prototype.RemoveShadowObject = function(type) /////
	{
		var i = this.shadowCasters.indexOf(type);
		if (i !== -1)
		{
			this.shadowCasters.splice(i, 1);
		}
	};

	Acts.prototype.ClearShadowList = function() /////
	{
		this.shadowCasters.length = 0;
	};

	Acts.prototype.SetShadowCastGroup = function(s) /////
	{
		this.castGroupMode = s;
	};

	Acts.prototype.SetLightHeight = function(s) /////
	{
		this.lightHeight = cr.clamp(s, 0, s);
	};

	instanceProto.CheckCollisionUpdate = function()
	{
		if (!this.collisionsEnabled && !this.enabled)
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);

			this.collcells.set(0, 0, -1, -1);
		}
		else
		{
			this.set_bbox_changed();
		}
	}

	Acts.prototype.SetCollisions = function(s)
	{
		if (this.collisionsEnabled === (s === 1))
			return;

		this.collisionsEnabled = s === 1;
		this.CheckCollisionUpdate();

	};

	Acts.prototype.ForceEarlyDraw = function()
	{
		this.doGeometry();
	};

	Acts.prototype.SetEnabled = function(s) /////
	{
		if (this.enabled === (s === 1))
			return;
		
		if (s === 0)
		{
			//draw once then freeze
			this.doGeometry();
		}
		this.enabled = s === 1;
		this.CheckCollisionUpdate();
	};

	Acts.prototype.DrawFullDisable = function(s) /////
	{
		this.drawFullImage();
		this.enabled = false;
	};

	Acts.prototype.IgnoreType = function(type)
	{
		if (this.ignoreTypeList.indexOf(type) === -1)
		{
			this.ignoreTypeList.push(type);
		}
	};

	Acts.prototype.RemoveIgnoreType = function(type)
	{
		var i = this.ignoreTypeList.indexOf(type);

		if (i > -1)
		{
			this.ignoreTypeList.splice(i, 1);
		}
	};

	Acts.prototype.ClearIgnoreType = function()
	{
		this.ignoreTypeList.length = 0;
	};

	Acts.prototype.IgnoreInst = function(type)
	{
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();

		if (instances.length === 0) return;

		for (var i = 0; i < instances.length; i++)
		{
			var inst = instances[i];

			if (this.ignoreInstList.indexOf(inst) === -1)
			{
				this.ignoreInstList.push(inst);
			}
		}
	};

	Acts.prototype.RemoveIgnoreInst = function(type)
	{

		var sol = type.getCurrentSol();
		var instances = sol.getObjects();

		if (instances.length === 0) return;

		for (var i = 0; i < instances.length; i++)
		{
			var inst = instances[i];

			var index = this.ignoreInstList.indexOf(inst);

			if (index > -1)
			{
				this.ignoreInstList.splice(index, 1);
			}
		}
	};

	Acts.prototype.ClearIgnoreInst = function()
	{
		this.ignoreInstList.length = 0;
	};

	Acts.prototype.SetLightRadius = function(s) /////
	{
		this.radius = this.lightHeight === 0 ? cr.clamp(s, 0, s) : 0;
	};

	Acts.prototype.SetTexScale = function(s) 
	{
		this.desTexScale = cr.clamp(s, 0.2, s);
		this.SetTexScale();
	};

	instanceProto.SetTexScale = function() 
	{
		var w = this.curFrame.width;
		var h = this.curFrame.height;
		var des = this.desTexScale;

		if (this.texScale !== des)
		{
			if (des * w > 2048)
			{
				des = 2048/w;
			}
	
			if (des * h > 2048)
			{
				des = 2048/h;
			}

			this.texScale = des;
		}

		var glw = this.runtime.glwrap;
			
		if (glw)
		{
			this.runtime.glwrap.deleteTexture(this.myWebGL_tex);
			this.myWebGL_tex = null;
			this.myWebGL_tex = this.runtime.glwrap.createEmptyTexture(this.curFrame.width*this.texScale, this.curFrame.height*this.texScale, this.runtime.linearSampling, false);
		}
		else
		{
			this.canvas.width = cr.abs(w);
			this.canvas.height = cr.abs(h);
		}

	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps()
	{};

	Exps.prototype.AnimationFrame = function(ret)
	{
		ret.set_int(this.cur_frame);
	};

	Exps.prototype.AnimationFrameCount = function(ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};

	Exps.prototype.AnimationName = function(ret)
	{
		ret.set_string(this.cur_animation.name);
	};

	Exps.prototype.AnimationSpeed = function(ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};

	Exps.prototype.ImagePointX = function(ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};

	Exps.prototype.ImagePointY = function(ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};

	Exps.prototype.ImagePointCount = function(ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};

	Exps.prototype.ImageWidth = function(ret)
	{
		ret.set_float(this.curFrame.width);
	};

	Exps.prototype.ImageHeight = function(ret)
	{
		ret.set_float(this.curFrame.height);
	};

	Exps.prototype.LightHeight = function(ret)
	{
		ret.set_float(this.lightHeight);
	};

	Exps.prototype.LightRadius = function(ret)
	{
		ret.set_float(this.radius);
	};

	Exps.prototype.TextureScale = function(ret)
	{
		ret.set_float(this.texScale);
	};

	Exps.prototype.ShadowNumber = function(ret)
	{
		ret.set_float(this.candidateList.length);
	};

	Exps.prototype.ShadowUID = function(ret, i)
	{
		var uid = -1;

		if (this.candidateList.length > 0 && i < this.candidateList.length & i > -1)
		{
			uid = this.candidateList[i];
		}
		ret.set_float(uid);
	};

	Exps.prototype.IgnoreListLen = function(ret)
	{
		ret.set_float(this.ignoreInstList.length);
	};

	Exps.prototype.IgnoreListAt = function(ret, i)
	{
		var uid = -1;

		if (this.ignoreInstList.length > 0 && i < this.ignoreInstList.length & i > -1)
		{
			uid = this.ignoreInstList[i];
		}
		ret.set_float(uid);
	};

	pluginProto.exps = new Exps();

}());




