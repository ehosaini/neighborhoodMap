
// maps center on page load
var mapCenter = {
      center: {lat: 38.9096936, lng: -77.043339},
      zoom: 14
  };

// site constructor function
function Site(site, marker, infoWindow){
    this.name = site.name;
    this.location = site.location;
    this.ajaxUrl = site.ajaxUrl;
    this.siteMarker = marker;
    this.siteInfoWindow = infoWindow;
    this.visible = ko.observable(true);
  }

// Knockout view model object
function ViewModel(map, marker, infoWindow){
  // populate the sites observableArray upon page load
    self = this;
    self.sites = ko.observableArray([]),

    self.populateSites = function(){
      // var theViewModelObj = this;
      defaultLocations.forEach(function(site){
        self.sites.push(new Site(site, marker, infoWindow));
      });//-- end of forEach
    };

  // center the map on the marker of location that user click on it's name
  // on the list and open the infowindow
    self.zoomOnSite = function(site){
      map.setCenter(site.location);
      map.setZoom(16);
      // clear related DOM contents prior to making Ajax call
      $("#venueName, #venueAddress, #url").html("");

      var siteMarker = site.siteMarker(site.location, map);
      var siteInfoWindow = site.siteInfoWindow(site.name);
      siteInfoWindow.open(map, siteMarker);
      siteMarker.addListener('click', function(){

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
    };

  // filter a selected item and update the list when a site is selected
  // via the filter dropdown in the view
  self.filterSite = function(site){
    // clear related DOM contents prior to zooming on a different site marker
    $("#venueName, #venueAddress, #url").html("");
    self.zoomOnSite(site);
    self.sites().forEach(function(siteItem){
      if(siteItem.name != site.name){
        siteItem.visible(false);
      }
      else{
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

// the object properties of which are used in
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
       // open info window when user clicks on a marker
       marker.addListener('click', function(){
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
  var marker =  googleMapsObject.returnMarker();
  var infoWindow = googleMapsObject.returnInfoWindow();


//-------------------- initilize and bind Knockout view model --------------
  // make a Knockout view model object
  var controller = new ViewModel(map, marker, infoWindow);

  // populate the sites observableArray
  controller.populateSites();

  //initiate Knockout on page load
  ko.applyBindings(controller);
//-----------------------------------------------------------------------------

  // load initial map and set markers
  initializer.makeMakers(controller, map);
}//-- end of initMap callback
