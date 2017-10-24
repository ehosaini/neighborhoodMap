
// maps center on page load
var mapCenter = {
      center: {lat: 38.9096936, lng: -77.043339},
      zoom: 14
  };

// site constructor function that populates Konckout observableArray
function Site(site){
    this.name = site.name;
    this.location = site.location;
    this.category = site.category;
    this.ajaxUrl = site.ajaxUrl;
    this.siteMarker = "";
    this.siteInfoWindow = "";
    this.visible = ko.observable(true);
  }

// Knockout view model object
function ViewModel(map){
    var self = this;

    // site data for populating list and markers
    self.sites = ko.observableArray([]);


    // category types used in the filter feature
    self.siteCategories = ko.observableArray([]);// end of siteCategories

    // select unique categories for stored sites
    self.findCategories = function findCategories(){
                        var sitesObject = self.sites();
                        var flags = [], output = [], l = sitesObject.length, i ;
                        for(i=0; i<l; i++){
                          if(flags[sitesObject[i].category]) continue;
                          flags[sitesObject[i].category] = true;
                          output.push(sitesObject[i].category);
                        }
                        return output;
                      };

    // populates the sites & siteCategories observableArrays on page load
    self.populateSites = function(){
      defaultLocations.forEach(function(site){
        self.sites.push(new Site(site));
      });//-- end of forEach
      self.findCategories().forEach(function(category){
        self.siteCategories.push(category);
      });// end of forEach
    };

    // make ajax call to Foursquare api
    self.makeAjaxCall = function(site){
      $.ajax({
            url: site.ajaxUrl,
            method: 'GET',
            dataType : "json",
            }).done(function(result) {
              var data = result.response.venues;
              foursquareData = {};
              foursquareData.venueName = data[0].name;
              foursquareData.venueAddress = data[0].location.formattedAddress;
              foursquareData.category = data[0].categories[0].name;
              foursquareData.url = data[0].url;

             var address = foursquareData.venueAddress;
             // alter DOM element html with data recieved from ajax call
             $("#venueName").html(foursquareData.venueName);
             $("#venueAddress").html(address[0] + ", " + address[1], + address [2]);
             // show url if ajax response has url link
             if(foursquareData.url !== undefined){
               $("#url").css("display", "block");
               $("#url").html("Website");
               $("#url").attr({
                 href: foursquareData.url,
                 target: "_blank"
               });
             }// end of if

            }).fail(function(err) {
              var errorMessage = "Sorry foursquare couldn't find a match :(";
              $("#venueName").html(errorMessage);
            });
    };

  // center the map on the marker of location that user click on it's name
  // an animate the marker, and make ajax call to Foursquare API
    self.zoomOnSite = function(site){
      map.setCenter(site.location);
      map.setZoom(16);

      // clear related DOM contents prior to making Ajax call
      $("#venueName, #venueAddress, #url").html("");

      // make marker bounce when user clicks on a site name on the list
      var marker = site.siteMarker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.addListener('click', toggleBounce);
      // toggle bounce when user clicks on the marker
      function toggleBounce() {
        sit.esiteInfoWindow.open(map, marker);
          if (siteMarker.getAnimation() !== null) {
            siteMarker.setAnimation(null);
          } else {
            siteMarker.setAnimation(google.maps.Animation.BOUNCE);
          }
        }
      self.makeAjaxCall(site);
    };

  // filter sites based on category they belong to via the filter dropdown
  // in the view
  self.filterSite = function(category){
    // clear related DOM contents prior to zooming on a different site marker
    // this make sures the wrong content won't be displayed if ajax response
    // returned for a site contains blank fields
    $("#venueName, #venueAddress, #url").html("");

    self.sites().forEach(function(siteItem){
      if(siteItem.category != category){
        siteItem.visible(false);
      }
      else {
        siteItem.visible(true);
      }
    });//-- end of forEach function
  };

  // show all sites when the related button in the view is clicked on
  self.showAllSites = function(){
    $("#venueName, #venueAddress, #url").html("");
    self.sites().forEach(function(site){
      site.visible(true);
    });//-- end of forEach function
    map.setZoom(14);
    map.setCenter(mapCenter.center);
  };

}//-- end of ViewModel

// initializer object properties of which are used in
// initMap() call back
var initializer = {
  init: function(object){
    // set the mapsObject property
    this.mapsObject= object;
  },

  mapMaker: function(){
    // Create and render map
    var map = this.mapsObject.makeMap();
    return map;
  },
  // Create a marker for each location given data from
  // Knockout observableArray data
  makeMakers: function(knockout, map){
    var initializerObject = this;
    // Create a marker for each location in Konckout observableArray
    knockout.sites().forEach(function(site){
       var infoWindow = initializerObject.mapsObject.makeInfoWindow(site.name);
       var marker = initializerObject.mapsObject.makeMaker(site.location, map);
       site.siteMarker = marker;
       site.siteInfoWindow = infoWindow;
       // animate marker and open info window when user clicks on a marker
       // and make ajax call to fourSquare api
       marker.addListener('click', function(){
         // animate marker when clicked on
         if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
          // open infoWindow
          infoWindow.open(map, marker);

         // make Ajax call to foursquare api
           $.ajax({
                 url: site.ajaxUrl,
                 method: 'GET',
                 dataType : "json",
                 }).done(function(result) {
                   var data = result.response.venues;
                   foursquareData = {};
                   foursquareData.venueName = data[0].name;
                   foursquareData.venueAddress = data[0].location.formattedAddress;
                   foursquareData.category = data[0].categories[0].name;
                   foursquareData.url = data[0].url;

                  var address = foursquareData.venueAddress;
                  $("#venueName").html(foursquareData.venueName);
                  $("#venueAddress").html(address[0] + ", " + address[1], + address [2]);

                  if(foursquareData.url !== undefined){
                    $("#url").css("display", "block");
                    $("#url").html("Website");
                    $("#url").attr({
                      href: foursquareData.url,
                      target: "_blank"
                    });
                  }// end of if

                 }).fail(function(err) {
                   var errorMessage = "Sorry foursquare couldn't find a match :(";
                   $("#venueName").html(errorMessage);
                 });
       });//-- end of addListener
    });//-- end of forEach function
  }//-- end of markerMaker property
};


//------------------------ callback for googlemaps JS api ---------------------
function initMap(){

  // google maps objects constructor
  var googleMapsObject = {
    makeMap: function(){
      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById("map"), mapCenter);
      return map;
    },

    makeMaker: function(site,map) {
      var marker = new google.maps.Marker({
        position: site,
        map: map
      });
      return marker;
    },

    // returned value used in Site constructor which stores the value
    // in the Knockout observableArray
    returnMarker: function(){
      function returnMarker(site, map){
        var marker = new google.maps.Marker({
          position: site,
          map: map,
        });
        return marker;
      }//-- end of inner function
      return returnMarker;
    },

    // returned value is used in eventlistner when the map renders on page laod
    makeInfoWindow: function(content){
      var infoWindow = new google.maps.InfoWindow({
        content: content
      });
      return infoWindow;
    },

    // returned value used in Site constructor which stores the value
    // in the Knockout observableArray
    returnInfoWindow: function(){
      function returnInfoWindow(content){
        var infoWindow = new google.maps.InfoWindow({
          content: content
        });//-- end of inner function
        return infoWindow;
      }

      return returnInfoWindow;
    }
  };

  //draw maps and markers
  initializer.init(googleMapsObject);

  // objects passed into Knockout viewmodel
  var map = initializer.mapMaker();


//-------------------- initilize and bind Knockout view model on page load ----
  // make a Knockout view model object
  var controller = new ViewModel(map);

  // populate the sites observableArray
  controller.populateSites();

  //initiate Knockout on page load
  ko.applyBindings(controller);
//-----------------------------------------------------------------------------

  // load initial map and set markers
  initializer.makeMakers(controller, map);
}//-- end of initMap callback
