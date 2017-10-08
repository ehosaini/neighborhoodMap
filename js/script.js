// var defaultLocations = [
//   {name: "Smithsonian National Air and Space Museum" , lat: 38.88816010000001, lng: -77.01986789999999 },
//   {name: "George Washington University", lat: 38.8997145, lng: 77.0485992 },
//   {name: "Dupont Circle" , lat: 38.9096936, lng: -77.043339 },
//   {name: "The White House" , lat: 38.8976763, lng: -77.0365298 },
//   {name: "The Pentagon" , lat: 38.8718568, lng: -77.0562669 }
// ];

var defaultLocations = [
  {lat: 38.896945, lng: -77.0236171},
  {lat: 38.9076089, lng: -77.07225849999999},
  {lat: 38.8997145, lng: 77.0485992},
  {lat: 38.9096936, lng: -77.043339},
  {lat: 38.8976763, lng: -77.0365298},
  {lat: 38.8718568, lng: -77.0562669}
];


function initMap(){
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById("map"),{
    center: {lat: 38.8896198, lng: -77.0229772},
    zoom: 13
  }); //-- end of map variable


  // mark defaultLocations on the map
  defaultLocations.forEach(function(location){
    makeMaker(location, map);
  }); //-- end of defaultLocations.forEach

}; //-- end of initMap()


// create markers
function makeMaker(location, map){
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
};
