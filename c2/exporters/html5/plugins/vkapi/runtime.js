"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Плагин
cr.plugins_.ExtendedVkApi = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.ExtendedVkApi.prototype;
		
    /////////////////////////////////////
    // Типы объектов
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;
    
    var vkAppID = "";
    var vkRuntime = null;
    var vkInst = null;
    var vkOwnDataJsonArr = "";
    var vkLastName = "";
    var vkReady = false;
    var vkOnBlur = false;
    var vkOnFocus = false;
    
    var vkorderId = 0;
    var vkerrorCode = 0;
    
    var vkFriensDataJsonArr = "";
	var vkSearchingResultsDataJsonArr = "";
	var vkSubscriptionsResultsDataJsonArr = "";
	var vkGetStatusResult = "";
	var vkCountriesDataJsonArr = "";
	var vkRegionsDataJsonArr = "";
	var vkCountryInfoDataJsonArr = "";
	var vkCitiesListDataJsonArr = "";
	var vkCitiesInfoDataJsonArr = "";
	var vkAppFriendsDataJsonArr = "";
	var vkOnlineFriends = "";
	var vkGetResult = "";
	var vkUsersReturn = "";
    var vkAlbumDataJsonArr = "";
    var vkAlbumNewАid = 0;
	var vkIsAppUser = "";
    var vkServerUrl = "";
    var vkPhotoId = "";
	
    typeProto.onCreate = function()
    {
    };

    /////////////////////////////////////
    // Класс
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;
    };
	
    var instanceProto = pluginProto.Instance.prototype;
    
    
    ///Some func
    var QueryString = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
            // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
            // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        } 
        return query_string;
    } ();
    ///
    

    instanceProto.onCreate = function()
    {
        if (this.runtime.isDomFree)
        {
            cr.logexport("[Construct 2] ExtendedVkApi plugin not supported on this platform - the object will not be created");
            return;
        }
		
        vkAppID = this.properties[0];
        vkRuntime = this.runtime;
        vkInst = this;
        
        window.onload = function() {
            if(QueryString["viewer_id"])
            {
              
                VK.init(function() {
                    
                    VK.api('users.get',{
                        "uids" : QueryString["viewer_id"],
                        "fields" : "uid, first_name, last_name, sex, bdate, city, country, timezone, photo, photo_medium, photo_big"
                    },function(data) { 
                        if (data.response) {
                            vkOwnDataJsonArr = '';
                            var val = data.response[0];
                            var JsonAr2Constract = new Object();
                            var inner = [];
                            JsonAr2Constract["c2array"] = 1;

                            inner["0"] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["sex"]],[val["bdate"]],[val["city"]],[val["country"]],[val["timezone"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
           
                            JsonAr2Constract["data"] = inner;
                            JsonAr2Constract["size"] = ['1','12','1'];
                
                            vkOwnDataJsonArr = JSON.stringify(JsonAr2Constract);
                            vkReady = true;
                            vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnReady, vkInst);
                            console.log('Construct2-VK: OnReady trigger');
                        } 
                    }); 
                });
            }
        }   
    };
    
    
    VK["addCallback"]("onWindowBlur", onWindowBlur); 
    function onWindowBlur() { 
        vkOnBlur = true;
        vkOnFocus = false;
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnBlur, vkInst);
        console.log('Construct2-VK: Blur trigger');
    }
    
    VK["addCallback"]("onWindowFocus", onWindowFocus); 
    function onWindowFocus() { 
        vkOnFocus = true;
        vkOnBlur = false;
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnFocus, vkInst);
        console.log('Construct2-VK: Focus trigger');
    }
    
    VK["addCallback"]("onBalanceChanged", onBalanceChanged); 
    function onBalanceChanged(balance) { 
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnBalCh, vkInst);
        console.log('Construct2-VK: Balance changed added trigger sum:'+balance);
    }
    
    VK["addCallback"]("onOrderCancel", onOrderCancel); 
    function onOrderCancel() { 
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onOrdCan, vkInst);
        console.log('Construct2-VK: Order cancel');
    }
    
    VK["addCallback"]("onOrderSuccess", onOrderSuccess); 
    function onOrderSuccess(val) { 
        vkorderId = val;
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onOrdSuc, vkInst);
        console.log('Construct2-VK: Order Success order_id:'+vkorderId);
    }
    
    VK["addCallback"]("onOrderFail", onOrderFail); 
    function onOrderFail(val) { 
        vkerrorCode = val;
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onOrdFail, vkInst);
        console.log('Construct2-VK: Order Fail errcode:'+vkerrorCode);
    }
	
	VK["addCallback"]("onApplicationAdded"); 
    function onApplicationAdded() { 
        vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onApplicationAdded, vkInst);
        console.log('Construct2-VK: Application added');
    }	
	
    Acts.prototype.PublishToWall = function (owner_id_, message_, attachments_, lat_, long_, place_id_, services_,from_group_,signed_,friends_only_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var publish = {
            "message": message_
        };    
        if (owner_id_.length)
            publish["owner_id"] = owner_id_;
        if (attachments_.length)
            publish["attachments"] = attachments_;
        if (lat_.length)
            publish["lat"] = lat_;
        if (long_.length)
            publish["long"] = long_;
        if (place_id_.length)
            publish["place_id"] = place_id_;
        if (services_.length)
            publish["services"] = services_;
        if (from_group_.length)
            publish["from_group"] = from_group_;
        if (signed_.length)
            publish["signed"] = signed_;
        if (friends_only_.length)
            publish["friends_only"] = friends_only_;
           
        VK.init(function() {
            VK.api('wall.post',publish,function(data) { 
                
                if (data.response) {
                //ответ
                } 
            }); 
        });
    };
    
    Acts.prototype.GetAppsFriends = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
			"fields" : "id"
            };
        
           VK.init(function() {
            VK.api('friends.getAppUsers',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [["items"]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkAppFriendsDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnReadyAppFriends, vkInst);
                    console.log('Construct2-VK: Friends-in-app list loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.UsersGet = function(uids_)
	{
		if (this.runtime.isDomFree || !vkReady)
            return;
		
		VK.init(function() {
		
		VK.api('users.get',{
                        "uids" : uids_,
                        "fields" : "uid, first_name, last_name, photo_big"
                    },function(data) { 
                        if (data.response) {
                            vkUsersReturn = '';
                            var val = data.response[0];
                            var JsonAr2Constract = new Object();
                            var inner = [];
                            JsonAr2Constract["c2array"] = 1;

                            inner["0"] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["photo_big"]]];
           
                            JsonAr2Constract["data"] = inner;
                            JsonAr2Constract["size"] = ['1','12','1'];
                
                            vkUsersReturn = JSON.stringify(JsonAr2Constract);
                            vkReady = true;
                            vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.UserLoaded, vkInst);
                            console.log('Construct2-VK: UserLoaded trigger');
                        } 
                    });
        });
	};

	
    Acts.prototype.FriendsGet = function (name_case_, count_, offset_, order_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var cases = ["nom","gen","dat","acc","ins","ins","abl"];
        var orders = ["name","hints"];
        var getparam = {
            "fields": "uid, first_name, last_name, sex, bdate, city, country, timezone, photo, photo_medium, photo_big",
            "name_case": cases[name_case_]
            
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
        if (order_.length)
            getparam["order"] = orders[order_];
           
        VK.init(function() {
            VK.api('friends.get',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["sex"]],[val["bdate"]],[val["city"]],[val["country"]],[val["timezone"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,'12','1'];
                
                    vkFriensDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onFrLoad, vkInst);
                    console.log('Construct2-VK: Friends loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.usersearch = function (q_, sort_, offset_, count_, city_, country_, hometown_, sex_, status_, age_from_, age_to_, birth_year_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "q" : q_,
			"sort" : sort_,
			"offset" : offset_,
			"count" : count_,
			"city" : city_,
			"country" : country_,
			"hometown" : hometown_,
			"sex" : sex_,
			"status" : status_,
			"age_from" : age_from_,
			"age_to" : age_to_,
			"birth_year" : birth_year_,
            "fields": "uid, first_name, last_name, birth_year, sex, photo, photo_medium, photo_big"
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
        if (sort_.length)
            getparam["sort"] = sort_;
		if (q_.length)
            getparam["q"] = q_;
           
        VK.init(function() {
            VK.api('users.search',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["sex"]],[val["birth_year"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkSearchingResultsDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onSearchFinish, vkInst);
                    console.log('Construct2-VK: Users loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.userSubscriptions = function (user_id_, offset_, count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        var exs = ["0","1"];
        var getparam = {
            "user_id" : user_id_,
			"extended" : exs["1"],
			"offset" : offset_,
			"count" : count_,
            "fields" : "gid, name, screen_name, is_closed, is_admin, is_member, type, photo, photo_medium, photo_big",
			"version" : "3.0"
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
        if (user_id_.length)
            getparam["user_id"] = user_id_;
           
        VK.init(function() {
            VK.api('users.getSubscriptions',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["gid"]],[val["name"]],[val["screen_name"]],[val["is_closed"]],[val["is_admin"]],[val["is_member"]],[val["type"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkSubscriptionsResultsDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onGetSubscriptionFinish, vkInst);
                    console.log('Construct2-VK: Subscriptions loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.userStatusGet = function (user_id_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var getparam = {
            "user_id": user_id_
        };    
        if (user_id_.length)
            getparam["user_id"] = user_id_;
        
           VK.init(function() {
            VK.api('status.get', getparam, function(data) {
				if (data.response) {
					vkGetStatusResult = data.response["text"];
					vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnStatusGot, vkInst);
                    console.log('Construct2-VK: Status changed');
				}
			
			}); 
        });
        
    };
	
	Acts.prototype.getCountries = function (offset_, count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "need_all" : "1",
			"offset" : offset_,
			"count" : count_,
			"fields" : "cid, title"
            
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
           
        VK.init(function() {
            VK.api('database.getCountries',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["cid"]],[val["title"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkCountriesDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnCountriesGot, vkInst);
                    console.log('Construct2-VK: Friends loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.getRegions = function (country_id_, region_name_, offset_, count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "country_id" : country_id_,
			"q" : region_name_,
			"offset" : offset_,
			"count" : count_,
			"fields" : "region_id, title"
            
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
		if (country_id_.length)
            getparam["country_id"] = country_id_;
           
        VK.init(function() {
            VK.api('database.getRegions',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["region_id"]],[val["title"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkRegionsDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnRegionsGot, vkInst);
                    console.log('Construct2-VK: Friends loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.getCountryInfo = function (country_ids_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "country_ids" : country_ids_,
			"fields" : "cid, name"
            
        };
        
        
        if (country_ids_.length)
            getparam["country_ids"] = country_ids_;
           
        VK.init(function() {
            VK.api('database.getCountriesById',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["cid"]],[val["name"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkCountryInfoDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnCountryInfoGot, vkInst);
                    console.log('Construct2-VK: Country info loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.getCitiesList = function (country_id_, region_id_, search_, need_all_, offset_, count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "country_id" : country_id_,
			"region_id" : region_id_,
			"q" : search_,
			"need_all" : need_all_,
			"offset" : offset_,
			"count" : count_,
			"fields" : "cid, title"
            
        };
        
        
        if (country_id_.length)
            getparam["country_id"] = country_id_;
		if (region_id_.length)
            getparam["region_id"] = region_id_;
           
        VK.init(function() {
            VK.api('database.getCities',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["cid"]],[val["title"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkCitiesListDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnCitiesListGot, vkInst);
                    console.log('Construct2-VK: Cities list loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.getCitiesInfo = function (city_ids_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "city_ids" : city_ids_,
			"fields" : "cid, name"
            
        };
        
        
        if (city_ids_.length)
            getparam["city_ids"] = city_ids_;
           
        VK.init(function() {
            VK.api('database.getCitiesById',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["cid"]],[val["name"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkCitiesInfoDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnCitiesInfoLoaded, vkInst);
                    console.log('Construct2-VK: Cities info loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.wasInstalled = function (user_id_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var getparam = {
            "user_id": user_id_
        };    
        if (user_id_.length)
            getparam["user_id"] = user_id_;
        
           VK.init(function() {
            VK.api('users.isAppUser', getparam, function(data) {
				if (data.response) {
					vkIsAppUser = data.response[0];
					vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnUsersInstallationInfoGot, vkInst);
                    console.log('Construct2-VK: User inst. info loaded');
				}
			
			}); 
        });
        
    };
	
	Acts.prototype.getOnlineFriends = function (user_id_, online_mobile_, count_, offset_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var getparam = {
            "user_id" : user_id_,
			"online_mobile" : online_mobile_,
			"count" : count_,
			"offset" : offset_,
			"fields" : "online, online_mobile"
        };
           
        VK.init(function() {
            VK.api('friends.getOnline',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["online"]],[val["online_mobile"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,sizecounter,'1'];
                
                    vkOnlineFriends = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnOnlineFriendsGot, vkInst);
                    console.log('Construct2-VK: Online-friends list loaded');
                }
              
            }); 
        });
    };
	
	Acts.prototype.setStorage = function (key_, value_, user_id_, global_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var getparam = {
			"key" : key_,
			"value" : value_,
            "user_id": user_id_,
			"global" : global_
        };    
        if (user_id_.length)
            getparam["user_id"] = user_id_;
		if (key_.length)
            getparam["key"] = key_;
		if (value_.length)
            getparam["value"] = value_;
        
           VK.init(function() {
            VK.api('storage.set', getparam, function(data) {
				if (data.response) {
					
				}
			
			}); 
        });
        
    };
	
	Acts.prototype.getStorage = function (key_, user_id_, global_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var getparam = {
			"key" : key_,
            "user_id": user_id_,
			"global" : global_
        };    
        if (user_id_.length)
            getparam["user_id"] = user_id_;
		if (key_.length)
            getparam["key"] = key_;
        
           VK.init(function() {
            VK.api('storage.get', getparam, function(data) {
				if (data.response) {
					vkGetStorage = data.response;
					vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.OnStorageLoaded, vkInst);
                    console.log('Construct2-VK: Storage got');
				}
			
			}); 
        });
        
    };
	   
    Acts.prototype.ShowOrderBox = function (count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var elements = {
            "type": "item"
        };    
        if (count_.length)
            elements["item"] = count_;
        else
            elements["item"] = 1;
           
        
        VK.init(function() {
            VK["callMethod"]("showOrderBox", elements); 
        });
        
    };
    
    Acts.prototype.ShowInviteBox = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showInviteBox"); 
        });
        
    };
	
	Acts.prototype.setsize = function (width_, height_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("resizeWindow", width_, height_); 
        });
        
    };
	
	Acts.prototype.showInstallBox = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showInstallBox"); 
        });
        
    };
	
	Acts.prototype.showSettingsBox = function (permissions_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showSettingsBox", permissions_); 
        });
        
    };
    
	Acts.prototype.sendNotification = function (uid_, message_, requestKey_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showRequestBox", uid_, message_, requestKey_); 
        });
        
    };
	
	Acts.prototype.scrollWindow = function (top_, speed_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("scrollWindow", top_, speed_); 
        });
        
    };
	
	Acts.prototype.scrollWindow = function (top_, speed_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("scrollWindow", top_, speed_); 
        });
        
    };
	
    Acts.prototype.showProfilePhotoBox = function (photohash_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showProfilePhotoBox", photohash_);
        });
        
    };
    
    Acts.prototype.GetAlbums = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK.api('photos.getAlbums',function(data) { 
                
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["aid"]],[val["thumb_id"]],[val["owner_id"]],[val["title"]],[val["description"]],[val["created"]],[val["updated"]],[val["size"]],[val["privacy"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,'9','1'];
                    vkAlbumDataJsonArr = JSON.stringify(JsonAr2Constract);
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onAlbumLoaded, vkInst);
                    console.log('Construct2-VK: Albums list loaded');
                }
              
            }); 
        });
        
    };
    
    Acts.prototype.CreateAlbum = function (title_,privacy_,comment_privacy_,description_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var getparam = {
            "title": title_
        };
        
        if (privacy_.length)
            getparam["privacy"] = privacy_;
        if (comment_privacy_.length)
            getparam["comment_privacy"] = comment_privacy_;
        if (description_.length)
            getparam["description"] = description_;
        if (gid_.length)
            getparam["gid"] = gid_;

        VK.init(function() {
            VK.api('photos.createAlbum',getparam,function(data) { 
                 

                if (data.response) {
                    vkAlbumNewАid = data.response["aid"];
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onAlbumCreated, vkInst);
                    console.log('Construct2-VK: New Album created');
                    
                }
            }); 
        });
    };
    
    Acts.prototype.GetUpServer = function (aid_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var getparam = {
            "aid": aid_
        };
        
        if (gid_.length)
            getparam["gid"] = gid_;

        VK.init(function() {
            VK.api('photos.getUploadServer',getparam,function(data) { 
                 
                if (data.response) {
                    vkServerUrl = encodeURIComponent(data.response["upload_url"]);
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onGetUpServer, vkInst);
                    console.log('Construct2-VK: Url Up server detected');
                    
                }
            }); 
        });
    };
    
    Acts.prototype.SavePhoto = function (json_,caption_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var obj = jQuery.parseJSON(json_);
            
        var getparam = {
            "server": obj["server"],
            "photos_list": obj["photos_list"],
            "aid": obj["aid"],
            "hash": obj["hash"]
        };
        
        if (gid_.length)
            getparam["gid"] = gid_;
        if (caption_.length)
            getparam["caption"] = caption_;
        
        VK.init(function() {
            VK.api('photos.save',getparam,function(data) { 
                 
                if (data.response) {
                    
                    var obj = data.response[0];
                    vkPhotoId = obj["id"];
                    vkRuntime.trigger(cr.plugins_.ExtendedVkApi.prototype.cnds.onPhotoSaved, vkInst);
                    console.log('Construct2-VK: Photo saved');
                    
                }
            }); 
        });
    };
	
    //////////////////////////////////////
    // Conditions
    function Cnds() {};
	

    Cnds.prototype.IsBlur = function ()
    {
        return vkOnBlur;
    };
        
    Cnds.prototype.OnReady = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnReadyAppFriends = function ()
    {
        return true;
    };
	
	Cnds.prototype.UserLoaded = function ()
    {
        return true;
    };
	
	Cnds.prototype.onSearchFinish = function ()
    {
        return true;
    };
	
	Cnds.prototype.onApplicationAdded = function ()
    {
        return true;
    };
	
	Cnds.prototype.onGetSubscriptionFinish = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnStatusGot = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnCountriesGot = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnRegionsGot = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnCountryInfoGot = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnCitiesListGot = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnCitiesInfoLoaded = function ()
    {
        return true;
    };
	
	Cnds.prototype.OnUsersInstallationInfoGot = function () 
    {
        return true;
    };
	
	Cnds.prototype.OnOnlineFriendsGot = function () 
    {
        return true;
    };
	
	Cnds.prototype.OnStorageLoaded = function () 
    {
        return true;
    };
	
    Cnds.prototype.OnBlur = function ()
    {
        return true;
    };

    Cnds.prototype.OnFocus = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnBalCh = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdCan = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdSuc = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdFail = function ()
    {
        return true;
    };
        
    Cnds.prototype.onFrLoad = function ()
    {
        return true;
    };
    
    Cnds.prototype.onAlbumLoaded = function ()
    {
        return true;
    };
    
    Cnds.prototype.onAlbumCreated = function ()
    {
        return true;
    };
    
    Cnds.prototype.onGetUpServer = function ()
    {
        return true;
    };
    
    Cnds.prototype.onPhotoSaved = function ()
    {
        return true;
    };
        
    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};
	
   
	
    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};
    
	
    Exps.prototype.OwnDataJsonArr = function (ret)
    {
        ret.set_string(vkOwnDataJsonArr);
    };
	
    Exps.prototype.orderId = function (ret)
    {
        ret.set_string(vkorderId);
    };
    
    Exps.prototype.errorCode = function (ret)
    {
        ret.set_string(vkerrorCode);
    };
    
    Exps.prototype.FriensDataJsonArr = function (ret)
    {
        ret.set_string(vkFriensDataJsonArr);
    };
	
	Exps.prototype.SearchingResultsDataJsonArr = function (ret)
    {
        ret.set_string(vkSearchingResultsDataJsonArr);
    };
	
	Exps.prototype.SubscriptionsResultsDataJsonArr = function (ret)
    {
        ret.set_string(vkSubscriptionsResultsDataJsonArr);
    };
	
	Exps.prototype.GetStatusResult = function (ret)
    {
        ret.set_string(vkGetStatusResult);
    };
	
	Exps.prototype.CountriesDataJsonArr = function (ret) 
    {
        ret.set_string(vkCountriesDataJsonArr);
    };
	
	Exps.prototype.RegionsDataJsonArr = function (ret) 
    {
        ret.set_string(vkRegionsDataJsonArr);
    };
	
	Exps.prototype.CountryInfoDataJsonArr = function (ret) 
    {
        ret.set_string(vkCountryInfoDataJsonArr);
    };
	
	Exps.prototype.CitiesListDataJsonArr = function (ret) 
    {
        ret.set_string(vkCitiesListDataJsonArr);
    };
	
	Exps.prototype.CitiesInfoDataJsonArr = function (ret) 
    {
        ret.set_string(vkCitiesInfoDataJsonArr);
    };
	
	Exps.prototype.IsAppUser = function (ret) 
    {
        ret.set_string(vkIsAppUser);
    };
	
	Exps.prototype.GetStorage = function (ret) 
    {
        ret.set_string(vkGetStorage);
    };
	
	Exps.prototype.OnlineFriends = function (ret) 
    {
        ret.set_string(vkOnlineFriends);
    };
	
    Exps.prototype.AlbumsDataJsonArr = function (ret)
    {
        ret.set_string(vkAlbumDataJsonArr);
    };
    
    Exps.prototype.GetNewAlbumAid = function (ret)
    {
        ret.set_string(vkAlbumNewАid);
    };
    
    Exps.prototype.ServerUpUrl = function (ret)
    {
        ret.set_string(vkServerUrl);
    };
    
    Exps.prototype.GetPhotoId = function (ret)
    {
        ret.set_string(vkPhotoId);
    };
	
	Exps.prototype.AppFriendsDataJsonArr = function (ret)
    {
        ret.set_string(vkAppFriendsDataJsonArr);
    };
	
	Exps.prototype.UserArray = function(ret)
	{
		ret.set_string(vkUsersReturn);
	};




    pluginProto.exps = new Exps();

}());