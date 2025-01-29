// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Mazenav = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Mazenav.prototype;
		
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
                this.inst.x = (Math.floor(this.inst.x/this.properties[4])*this.properties[4]) + (this.properties[4]/2);
                this.inst.y = (Math.floor(this.inst.y/this.properties[4])*this.properties[4]) + (this.properties[4]/2);
                
                this.Mazenavtoggle = this.properties[0];
                this.Mazenavsteps = this.properties[1];
                this.Mazenavspeed = this.properties[2];
                if ( this.properties[3] == 0 )
                {
                    this.Mazenavdirection = 8;
                }
                else if ( this.properties[3] == 1 )
                {
                    this.Mazenavdirection = 2;
                }
                else if ( this.properties[3] == 2 )
                {
                    this.Mazenavdirection = 1;
                }
                else if ( this.properties[3] == 3 )
                {
                    this.Mazenavdirection = 4;
                }
                this.Mazenavdistance = this.properties[4]; 
                this.nextx = this.inst.x;
                this.nexty = this.inst.y;
                this.prevx = this.inst.x;
                this.prevy = this.inst.y;
                this.destr = 0;
                this.destc = 0; 
                this.dtcnt = 0;
                this.steps = 0;
                this.myflag = 0;
                this.stepcnt = 0;
                this.steptime = this.Mazenavspeed/this.Mazenavsteps;
                this.stepdistance = this.Mazenavdistance/this.Mazenavsteps;
                this.done = 0;
                this.cols = this.properties[6];
                this.rows = this.properties[7];
                this.r = Math.floor(this.inst.y/this.Mazenavdistance);
                this.c = Math.floor(this.inst.x/this.Mazenavdistance);
                this.f = new Array(8);
                this.pushback = this.properties[5];
                this.mazeoriginx = this.properties[8];
                this.mazeoriginy = this.properties[9];
                this.dvalue = this.properties[10];

                this.grid = new Array(this.rows); 
                for (var r=0; r<this.rows; r++ )
                {
                    this.grid[r] = new Array(this.cols);
                    for (var c=0; c<this.cols; c++ )
                    {
                        this.grid[r][c] = 0;            
                    }    
                } 
	};

        Array.prototype.min = function () 
        {
            return Math.min.apply(Math, this);
        };  
     
	behinstProto.tick = function ()
	{
            if ( this.Mazenavtoggle == 1  && this.runtime.timescale > 0 )
            {
                this.dtcnt += (this.runtime.getDt(this.inst) * this.runtime.timescale);
                
                if ( this.dtcnt >= this.steptime )
                {
                    this.dtcnt = 0;

                    if ( this.done == 0 )
                    {
                        if ( this.stepcnt == 0 )
                        {    
                            for (var f=0; f<8; f++ )
                            {
                                this.f[f] = 0;
                            }

                            this.r--;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[0] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[0] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            }
                            this.c++;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[1] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2; 
                                } 
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[1] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            }
                            this.r++;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[2] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[2] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            }
                            this.r++;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[3] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                } 
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[3] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            }
                            this.c--;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[4] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[4] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            }
                            this.c--;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[5] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[5] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            } 
                            this.r--;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[6] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[6] = 10 + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            } 
                            this.r--;
                            if ( this.r >= 0 && this.r < this.rows && this.c >= 0 && this.c < this.cols )
                            {
                                if ( this.grid[this.r][this.c] == 0 )
                                {
                                    this.f[7] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10;
                                    this.grid[this.r][this.c] = 2;
                                }
                                else if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.f[7] = this.dvalue + Math.abs(this.r-this.destr)*10 + Math.abs(this.c-this.destc)*10 + (this.grid[this.r][this.c]*this.pushback);
                                }
                            } 

                            this.r++;
                            this.c++;   

                            for (var f=0; f<8; f++ )
                            {
                                if ( this.f[f] == 0 )
                                {
                                    this.f[f] = 900000;
                                }
                            } 

                            var min = this.f.min();
                            var pos = -1; 

                            for (var f=0; f<8; f++ )
                            {
                                if ( this.f[f] == min )
                                {
                                    pos = f;
                                }
                            } 
                              
                            if ( pos == 0 )
                            {
                                this.Mazenavdirection = 1;
                            }
                            else if ( pos == 2 )
                            {
                                this.Mazenavdirection = 2;
                            }
                            else if ( pos == 4 )
                            {
                                this.Mazenavdirection = 4;
                            }
                            else if ( pos == 6 )
                            {
                                this.Mazenavdirection = 8;
                            }  
                            else if ( pos == 1 )
                            {
                                this.Mazenavdirection = 3;
                            }  
                            else if ( pos == 3 )
                            {
                                this.Mazenavdirection = 6;
                            } 
                            else if ( pos == 5 )
                            {
                                this.Mazenavdirection = 12;
                            }  
                            else if ( pos == 7 )
                            {
                                this.Mazenavdirection = 9;
                            }              
                        }

                        if ( this.Mazenavdirection > 0 )
                        { 
                            if ( this.stepcnt == 0 )
                            {
                                if ( this.Mazenavdirection == 8 )
                                {
                                    this.c--; 
                                }
                                else if ( this.Mazenavdirection == 2 )
                                {
                                    this.c++; 
                                }
                                else if ( this.Mazenavdirection == 1 )
                                {
                                    this.r--; 
                                }
                                else if ( this.Mazenavdirection == 4 )
                                {
                                    this.r++; 
                                }
                                else if ( this.Mazenavdirection == 3 )
                                {
                                    this.c++; 
                                    this.r--; 
                                }
                                else if ( this.Mazenavdirection == 6 )
                                {
                                    this.c++; 
                                    this.r++; 
                                }
                                else if ( this.Mazenavdirection == 12 )
                                {
                                    this.c--; 
                                    this.r++; 
                                }
                                else if ( this.Mazenavdirection == 9 )
                                {
                                    this.c--; 
                                    this.r--; 
                                }
                                switch(this.Mazenavdirection)
                                {
                                    case 8:
                                        this.nexty = this.inst.y;
                                        this.nextx = this.inst.x - this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(180);
                                        break;
                                    case 2:
                                        this.nexty = this.inst.y;
                                        this.nextx = this.inst.x + this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(0);
                                        break;
                                    case 1:
                                        this.nextx = this.inst.x;
                                        this.nexty = this.inst.y - this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(270); 
                                        break;
                                    case 4:
                                        this.nextx = this.inst.x;
                                        this.nexty = this.inst.y + this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(90);
                                        break;
                                    case 3:
                                        this.nexty = this.inst.y - this.Mazenavdistance;
                                        this.nextx = this.inst.x + this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(315);
                                        break;
                                    case 6:
                                        this.nexty = this.inst.y + this.Mazenavdistance;
                                        this.nextx = this.inst.x + this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(45);
                                        break;
                                    case 12:
                                        this.nextx = this.inst.x - this.Mazenavdistance;
                                        this.nexty = this.inst.y + this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(135); 
                                        break;
                                    case 9:
                                        this.nextx = this.inst.x - this.Mazenavdistance;
                                        this.nexty = this.inst.y - this.Mazenavdistance;
                                        this.inst.angle = cr.to_radians(225);
                                        break; 
                                }
                            
                                this.prevx = this.inst.x;
                                this.prevy = this.inst.y;
                            }

                            if ( this.grid[this.r][this.c] == 1 )
                            { 
                                this.stepcnt = 0;
                                this.inst.x = this.prevx;
                                this.inst.y = this.prevy;
                                if ( this.Mazenavdirection == 8 )
                                {
                                    this.c++; 
                                }
                                else if ( this.Mazenavdirection == 2 )
                                {
                                    this.c--; 
                                }
                                else if ( this.Mazenavdirection == 1 )
                                {
                                    this.r++; 
                                }
                                else if ( this.Mazenavdirection == 4 )
                                {
                                    this.r--; 
                                }
                                else if ( this.Mazenavdirection == 3 )
                                {
                                    this.c--; 
                                    this.r++; 
                                }
                                else if ( this.Mazenavdirection == 6 )
                                {
                                    this.c--; 
                                    this.r--; 
                                }
                                else if ( this.Mazenavdirection == 12 )
                                {
                                    this.c++; 
                                    this.r--; 
                                }
                                else if ( this.Mazenavdirection == 9 )
                                {
                                    this.c++; 
                                    this.r++; 
                                }
                                this.inst.set_bbox_changed();
                            }
                            else
                            { 
                                this.stepcnt++;

                                switch(this.Mazenavdirection)
                                {
                                    case 8:
                                        this.inst.x -= this.stepdistance;
                                        break;
                                    case 2:
                                        this.inst.x += this.stepdistance;
                                        break;
                                    case 1:
                                        this.inst.y -= this.stepdistance;
                                        break;
                                    case 4:
                                        this.inst.y += this.stepdistance;
                                        break;
                                    case 3:
                                        this.inst.x += this.stepdistance;
                                        this.inst.y -= this.stepdistance;
                                        break;
                                    case 6:
                                        this.inst.x += this.stepdistance;
                                        this.inst.y += this.stepdistance;
                                        break;
                                    case 12:
                                        this.inst.x -= this.stepdistance; 
                                        this.inst.y += this.stepdistance;
                                        break;
                                    case 9:
                                        this.inst.x -= this.stepdistance;
                                        this.inst.y -= this.stepdistance;
                                        break;
                                }

                                if ( this.stepcnt == this.Mazenavsteps )
                                {
                                    this.steptime = this.Mazenavspeed/this.Mazenavsteps;
                                    this.stepdistance = this.Mazenavdistance/this.Mazenavsteps;
                                    this.stepcnt = 0;
                                    this.inst.x = this.nextx;
                                    this.inst.y = this.nexty;
                                }
                                if ( this.grid[this.r][this.c] >= 2 )
                                {
                                    this.grid[this.r][this.c]++;
                                }  
                                this.inst.set_bbox_changed();
                            }
                        }                      
                    }
                }   
            }
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetMazenavToggle = function (s)
	{
		this.Mazenavtoggle = s;
	};
	
	Acts.prototype.SetMazenavSteps = function (a)
	{
		this.Mazenavsteps = a;
	};

        Acts.prototype.SetMazenavSpeed = function (a)
	{
		this.Mazenavspeed = a;
	};

        Acts.prototype.SetMazenavDirection = function (a)
	{
		this.Mazenavdirection = a;
	};

        Acts.prototype.SetMazenavDestination = function (a,b)
	{
		this.destc = Math.floor(a/this.Mazenavdistance);
                this.destr = Math.floor(b/this.Mazenavdistance);
	};
         
        Acts.prototype.SetMazenavOrigin = function (a,b)
	{
                this.mazeoriginx = a;
                this.mazeoriginy = b;
        };

        Acts.prototype.SetMazenavDimension = function (a,b)
	{
                this.cols = a;
                this.rows = b;
        };

        Acts.prototype.SetMazenavPushback = function (a)
	{
		this.pushback = a;
	};

        Acts.prototype.SetMazenavDvalue = function (a)
	{
		this.dvalue = a;
	};

        Acts.prototype.SetMazenavClear = function ()
	{
		this.Mazenavtoggle = 0;
                for ( var y=0; y<this.rows; y++ ) 
                {
                    for ( var x=0; x<this.cols; x++ ) 
                    { 
                        if ( this.grid[y][x] != 1 )
                        {
                            this.grid[y][x] = 0;
                        }
                    } 
                }
                this.Mazenavtoggle = 1;
	};

        Acts.prototype.SetMazenavScan = function ()
	{
		this.Mazenavtoggle = 0;
                for ( var y=0; y<this.rows; y++ ) 
                {
                    for ( var x=0; x<this.cols; x++ ) 
                    { 
                        this.inst.x = this.mazeoriginx + (x*this.Mazenavdistance);
                        this.inst.y = this.mazeoriginy + (y*this.Mazenavdistance);
                        this.inst.set_bbox_changed();
                        var collobj = this.runtime.testOverlapSolid(this.inst);
                        if ( collobj )
                        {
                            this.grid[y][x] = 1;
                        }
                        else
                        {
                            this.grid[y][x] = 0;
                        }
                    } 
                }
                this.inst.x = this.prevx;
                this.inst.y = this.prevy;
                this.inst.set_bbox_changed();
                this.Mazenavtoggle = 1;
	};

        behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

        Exps.prototype.MazenavActive = function (ret)
	{
                ret.set_int(this.Mazenavtoggle);
	};

        Exps.prototype.MazenavDestValue = function (ret)
	{
                ret.set_float(this.grid[this.destr][this.destc]);
	};


        behaviorProto.exps = new Exps();
	
}());