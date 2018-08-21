(function(){
    'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MatchSearchService',MatchSearchService)
    .directive('menuDirective',menuDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");



function menuDirective(){
  var ddo = {
    template: '<button ng-click = "menu.removeItem($index);">Dont want this one!</button>'
  };
  return ddo;
};

 NarrowItDownController.$inject = ['MatchSearchService'];
function NarrowItDownController(MatchSearchService) {
    var menu = this;
    var items = this;
    var check = [];
    var c = [];
    menu.desc = "";
    menu.getSearchedMenuItems = function(desc)
    {
      
          var promise = MatchSearchService.getMenuItems(desc); 
        //array of values
      promise.then(function (success) 
      {
        menu.check = success;
        console.log("menu:",menu.check); //its an array  
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
         menu.errorMessage = error.message;
      });         
   }

   menu.removeItem = function(itemindex)
   {
        MatchSearchService.removeItem(itemindex);
   };    
}

MatchSearchService.$inject = ['$http', 'ApiBasePath'];
function MatchSearchService($http, ApiBasePath)
{
    var service = this;
    var items = [];
    var found = [];
    
   // var desc = this;
    service.getMenuItems = function (desc) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")       
    });
    var d = desc;
    console.log("descr:",d);  
    return response.then(function(success)
    {
      //returning multiple value
      items = success.data.menu_items;
      var j = 0;
      console.log("Length:",items.length);
      console.log("desc list:",items[0].description);
      found = [];
      found.length = 0;
      if(desc.length!=0)
      {
        for(var i=0;i<items.length;i++)
        {
          if(items[i].description.search(desc)!=-1)
          {
            found[j] = items[i];       
            j++;
          }
        }
      } 
     
      console.log("found",found); 
      if(found.length == 0)
      {
        throw new Error("Nothing found.");
      } 
      else{
         return found; //sending the matched items
      }          
     
    }); 
   
  };

  service.removeItem = function(itemindex)
  {
      found.splice(itemindex,1);
  };

}
})();