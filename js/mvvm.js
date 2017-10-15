
// maps center on page load
var mapCenter = {
      center: {lat: 38.8718568, lng: -77.0562669},
      zoom: 12
  };


// site constructor function
function Site(site, marker, infoWindow){
    this.name = site.name;
    this.location = site.location;
    this.siteMarker = marker;
    this.siteInfoWindow = infoWindow;
  };

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
  //on the list and open the infowindow
    self.zoomOnSite = function(site){
      map.setCenter(site.location);
      map.setZoom(16);
      var siteMarker = site.siteMarker(site.location, map);
      var siteInfoWindow = site.siteInfoWindow(site.name);
      // siteInfoWindow.setPosition(site.location);
      siteInfoWindow.open(map, siteMarker);
      // console.log(siteInfoWindow);
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

    var initializerObject = this;
    // Create a marker for each location in Konckout observableArray
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

    returnMarker: function(){
      function returnMarker(site, map){
        var marker = new google.maps.Marker({
          position: site,
          map: map,
        });
        return marker;
      };//-- end of inner function
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
      };

      return returnInfoWindow;
    }
  };


  //draw maps and markers
  initializer.init(googleMapsObject);

  // objects passed into Knockout viewmodel
  var map = initializer.mapMaker();
  var marker =  googleMapsObject.returnMarker();
  var infoWindow = googleMapsObject.returnInfoWindow();


//-------------------- initilize and bind Knokout view model --------------
  // make a Knockout view model object
  var controller = new ViewModel(map, marker, infoWindow);

  // populate the sites observableArray
  controller.populateSites();

  //initiate Knockout on page load
  ko.applyBindings(controller);
//--------------------

  // load initial map and set markers
  initializer.makeMakers(controller, map);
};
