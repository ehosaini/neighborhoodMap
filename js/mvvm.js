
// maps center on page load
var mapCenter = {
      center: {lat: 38.8718568, lng: -77.0562669},
      zoom: 13
  };


// site constructor function
function Site(site){
    this.name = site.name;
    this.location = site.location;
  };

// Knockout view model object
function ViewModel(map){
  // populate the sites observableArray upon page load
    self = this;
    self.sites = ko.observableArray([]),

    self.populateSites = function(){
      // var theViewModelObj = this;
      defaultLocations.forEach(function(site){
        self.sites.push(new Site(site));
      });//-- end of forEach
    };

  // center the map on the location
  // that user click on it's name on the list
    self.zoomOnSite = function(site){
      map.setCenter(site.location);
    };
};

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
    // Create a marker for each location
    var initializerObject = this;
    // map = this.mapMaker();
    knockout.sites().forEach(function(site){
       var infoWindow = initializerObject.mapsObject.makeInfoWindow(site.name);
       var marker = initializerObject.mapsObject.makeMaker(site.location, map);
       // open info window when user clicks on a marker
       marker.addListener('click', function(){
         infoWindow.open(map, marker);
        });
    })//-- end of forEach function
  }//-- end of markerMaker property
};


// callback for googlemaps JS api
function initMap(){

  // google maps object constructors
  var googleMapsObject = {
    makeMap: function(){
      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById("map"), mapCenter);
      return map;
    },

    makeMaker: function(site,map) {
      var marker = new google.maps.Marker({
        position: site,
        map: map,
      });
      return marker;
    },

    makeInfoWindow: function(content){
      var infoWindow = new google.maps.InfoWindow({
        content: content
      })
      return infoWindow;
    }
  };


  //draw maps and markers
  initializer.init(googleMapsObject);
  var map = initializer.mapMaker();

//--------------------
  // make a Knockout view model object
  var controller = new ViewModel(map);

  // populate the sites observableArray
  controller.populateSites();

  //initiate Knockout on page load
  ko.applyBindings(controller);
//--------------------

  // zoomPoint.push(map);
  initializer.makeMakers(controller, map);

};

// console.log(zoomPoint);
