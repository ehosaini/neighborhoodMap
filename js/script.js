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
