// build url for each location to make ajax call to Foursquare api
defaultLocations.forEach(function(loc) {
  function urlBuilder() {
    var url = 'https://api.foursquare.com/v2/venues/search';
    url += '?' + $.param({
      'v': 20131016,
      'll': loc.location.lat + ',' + loc.location.lng,
      'query': loc.name,
      'limit': 1,
      'intent': "match",
      'radius': 50,
      'client_id': 'PNNRUPFB2GB3X0XNRFUM4KW4SATAROSHCR14TY55E3N51YYQ',
      'client_secret': 'HNBCAFDWFSCPX1JKXQPA333V5TCYIVES1OEIJBEPKHLKIBT4'
    });
    return url;
  }
  loc.ajaxUrl = urlBuilder();
}); //--end of foreach

// callback for the onerror attribute of google api
function googleError() {
  $("#map").html("Sorry we couldn't load the map, try again!")
}

// maps center on page load
var mapCenter = {
  center: {
    lat: 38.9096936,
    lng: -77.043339
  },
  zoom: 12
};

// site constructor function that populates Konckout observableArray
function Site(site) {
  this.name = site.name;
  this.location = site.location;
  this.category = site.category;
  this.ajaxUrl = site.ajaxUrl;
  this.siteMarker = "";
  this.siteInfoWindow = "";
  this.visible = ko.observable(true);
}

// initializer object properties of which are used in
// initMap() call back
var initializer = {
  init: function(object) {
    // set the mapsObject property
    this.mapsObject = object;
  },

  mapMaker: function() {
    // Create and render map
    var map = this.mapsObject.makeMap();
    return map;
  },
  // Create a marker for each location given data from
  // Knockout observableArray data
  makeMakers: function(knockout, map) {
    var initializerObject = this;
    // Create a marker for each location in Konckout observableArray
    var mvvmOjbect = knockout;
    knockout.sites().forEach(function(site) {
      var infoWindow = initializerObject.mapsObject.makeInfoWindow(site.name);
      var marker = initializerObject.mapsObject.makeMaker(site.location, map);
      site.siteMarker = marker;
      site.siteInfoWindow = infoWindow;
      // animate marker and open info window when user clicks on a marker
      // and make ajax call to fourSquare api
      marker.addListener('click', function() {
        // animate marker when clicked on
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        // open infoWindow
        infoWindow.open(map, marker);

        // make Ajax call to foursquare api
        mvvmOjbect.makeAjaxCall(site);
        
      }); //-- end of addListener
    }); //-- end of forEach function
  } //-- end of markerMaker property
};


//------------------------ callback for googlemaps JS api ---------------------
function initMap() {

  // google maps objects constructor
  var googleMapsObject = {
    makeMap: function() {
      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById("map"), mapCenter);
      return map;
    },

    makeMaker: function(site, map) {
      var marker = new google.maps.Marker({
        position: site,
        map: map
      });
      return marker;
    },

    // returned value used in Site constructor which stores the value
    // in the Knockout observableArray
    returnMarker: function() {
      function returnMarker(site, map) {
        var marker = new google.maps.Marker({
          position: site,
          map: map,
        });
        return marker;
      } //-- end of inner function
      return returnMarker;
    },

    // returned value is used in eventlistner when the map renders on page laod
    makeInfoWindow: function(content) {
      var infoWindow = new google.maps.InfoWindow({
        content: content
      });
      return infoWindow;
    },

    // returned value used in Site constructor which stores the value
    // in the Knockout observableArray
    returnInfoWindow: function() {
      function returnInfoWindow(content) {
        var infoWindow = new google.maps.InfoWindow({
          content: content
        }); //-- end of inner function
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
} //-- end of initMap callback
