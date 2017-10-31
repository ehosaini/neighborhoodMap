// Knockout view model object
function ViewModel(map) {
  var self = this;

  // site data for populating list and markers
  self.sites = ko.observableArray([]);


  // category types used in the filter feature
  self.siteCategories = ko.observableArray([]); // end of siteCategories

  // Ko Observable for storing data returned by Ajax calls
  self.ajaxData = ko.observable();

  // select unique categories for stored sites
  self.findCategories = function findCategories() {
    var sitesObject = self.sites();
    var flags = [],
      output = [],
      l = sitesObject.length,
      i;
    for (i = 0; i < l; i++) {
      if (flags[sitesObject[i].category]) continue;
      flags[sitesObject[i].category] = true;
      output.push(sitesObject[i].category);
    }
    return output;
  };

  // populates the sites & siteCategories observableArrays on page load
  self.populateSites = function() {
    defaultLocations.forEach(function(site) {
      self.sites.push(new Site(site));
    }); //-- end of forEach
    self.findCategories().forEach(function(category) {
      self.siteCategories.push(category);
    }); // end of forEach
  };

  // make ajax call to Foursquare api
  self.makeAjaxCall = function(site) {
    $.ajax({
      url: site.ajaxUrl,
      method: 'GET',
      dataType: "json",
    }).done(function(result) {
      var data = result.response.venues;
      self.ajaxData(data[0]);
    }).fail(function(err) {
      var errorMessage = "Sorry foursquare couldn't find a match :(";
      self.ajaxData(errorMessage);
    });
  };

  // center the map on the marker of location that user click on it's name
  // an animate the marker, and make ajax call to Foursquare API
  self.zoomOnSite = function(site) {
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
      site.siteInfoWindow.open(map, marker);
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
  self.filterSite = function(category) {
    // clear related DOM contents prior to zooming on a different site marker
    // this make sures the wrong content won't be displayed if ajax response
    // returned for a site contains blank fields
    $("#venueName, #venueAddress, #url").html("");

    self.sites().forEach(function(siteItem) {
      if (siteItem.category != category) {
        siteItem.visible(false);
      } else {
        siteItem.visible(true);
      }
    }); //-- end of forEach function
  };

  // show all sites when the related button in the view is clicked on
  self.showAllSites = function() {
    $("#venueName, #venueAddress, #url").html("");
    self.sites().forEach(function(site) {
      site.visible(true);
    }); //-- end of forEach function
    map.setZoom(12);
    map.setCenter(mapCenter.center);
  };

} //-- end of ViewModel