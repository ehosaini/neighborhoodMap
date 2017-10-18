
// locations data
var defaultLocations = [
  { name:"Dolcezza Gelato Dupont",
    location: {lat: 38.91419768029149, lng: -77.04425211970849}
  },
  { name:"Georgetown University",
    location: {lat: 38.9076089, lng: -77.072258}
  },
  { name:"George Washington University",
    location: {lat: 38.8997145, lng: -77.0485992}
  },
  { name:"Dupont Circle",
    location: {lat: 38.9096936, lng: -77.043339}
  },
  { name:"Museum of African American History and Culture",
    location: {lat: 38.8910545, lng: -77.03270359999999}
  },
  { name:"Barcode",
    location: {lat: 38.9039407, lng: -77.0380103}
  },
];

// build url for each location to make ajax call too
defaultLocations.forEach(function(loc){
  function urlBuilder(){
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
  };
  loc.ajaxUrl = urlBuilder();
});//--end of foreach

// var url = "https://api.foursquare.com/v2/venues/search";
// url += '?' + $.param({
//   'v': 20131016,
//   'll': 38.8976763 + ',' + -77.0365298,
//   'query': "The White House",
//   'limit': 1,
//   'intent': "match",
//   'radius': 5000,
//   'client_id': 'PNNRUPFB2GB3X0XNRFUM4KW4SATAROSHCR14TY55E3N51YYQ',
//   'client_secret': 'HNBCAFDWFSCPX1JKXQPA333V5TCYIVES1OEIJBEPKHLKIBT4'
// });



results = [];
defaultLocations.forEach(function(location){
  $.ajax({
        url: location.ajaxUrl,
        method: 'GET',
        dataType : "json",
        }).done(function(result) {
          var response = result.response;
          // console.log(result);
          // console.log(response);
          results.push(result);
        }).fail(function(err) {
          var error = "Sorry foursquare couldn't find a match :("
          // console.log(error);
        });
});//end of forEach function

console.log(results);


// $.ajax({
//       url: url,
//       method: 'GET',
//       dataType : "json",
//       }).done(function(result) {
//         var response = result.response;
//         console.log(result);
//         console.log(response);
//       }).fail(function(err) {
//         var error = "Sorry NY Times does not have any articles related to"
//             error += " the location you entered."
//         console.log(error);
//       });
