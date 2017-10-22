
// locations data
var defaultLocations = [
  { name:"Dolcezza Gelato Dupont",
    category: "coffee shop",
    location: {lat: 38.91419768029149, lng: -77.04425211970849}
  },
  { name:"Georgetown University",
    category: "educationl institute",
    location: {lat: 38.9076089, lng: -77.072258}
  },
  { name:"George Washington University",
    category: "educationl institute",
    location: {lat: 38.8997145, lng: -77.0485992}
  },
  { name:"Dupont Circle",
    category: "park",
    location: {lat: 38.9096936, lng: -77.043339}
  },
  { name:"Museum of African American History and Culture",
    category: "muesuem",
    location: {lat: 38.8910545, lng: -77.03270359999999}
  },
  { name:"Barcode",
    category: "restaurant",
    location: {lat: 38.9039407, lng: -77.0380103}
  },
];

// build url for each location to make ajax call to Foursquare api
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
