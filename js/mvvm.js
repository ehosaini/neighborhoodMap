// maps center on page load
var mapCenter = {
      center: {lat: 38.8896198, lng: -77.0229772},
      zoom: 13
  };

// google maps object constructors
var googleMapObject = {
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


// site constructor function
function Site(site){
    this.name = site.name;
    this.location = site.location;
  };

// knockout view model object
var ViewModel = {
  // populate the sites observableArray upon page load
  sites: ko.observableArray([]),

  populateSites: function(){
    var theViewModelObj = this;
    defaultLocations.forEach(function(site){
      theViewModelObj.sites.push(new Site(site));
    });//-- end of forEach
  },
  zoomOnSite: function(){
    console.log(this);
  }

};

//initiate Knockout on page load
ko.applyBindings(ViewModel);
ViewModel.populateSites();

// callback for googlemaps api
function initMap(){
  // Create a map object and specify the DOM element for display.
  var map = googleMapObject.makeMap();
  // Create a marker for each location
  ViewModel.sites().forEach(function(site){
     var infoWindow = googleMapObject.makeInfoWindow(site.name);
     var marker = googleMapObject.makeMaker(site.location, map);
     marker.addListener('click', function(){
       infoWindow.open(map, marker);
      });
    });//-- end of forEach
  };
