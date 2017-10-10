// site constructor function
function Site(site){
  this.name = site.name;
  this.location = site.location;
};


function ViewModel(){
  var self = this;
  self.sites = ko.observableArray([])

  // populate the sites observableArray upon page load
  defaultLocations.forEach(function(site){
    self.sites.push(new Site(site));
  });//-- end of forEach

};

ko.applyBindings(new ViewModel());
