// register
angular.module('fancy-places-autocomplete', []);

// tooltip directive
(function () {
  'restrict';

  // tooltip directive integrate with tooltipster
  function Tooltip () {
    var self = this;

    self.controller = function ($scope) {
      self.$scope = $scope;
    };

    self.link = function (scope, elem, attr) {
      var $elem = $(elem);
      $elem.addClass('tooltip fancy-tooltip');
      $elem.tooltipster({
        animation: 'grow',
        delay: 200,
        theme: 'tooltipster-default',
        touchDevices: false,
        trigger: 'hover'
      });
    };

    return self;
  };

  // regist tooltip directive
  angular.module('fancy-places-autocomplete').directive('tooltip', Tooltip);
})();

// places autocomplete directive
(function () {
  'restrict';

  function GoogleAutocompleteService (elem) {
    var self = this;
    var autocomplete = new google.maps.places.Autocomplete(elem[0]);
    var placesService = new google.maps.places.PlacesService(elem[0]);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      placesService.getDetails({reference: place.reference}, function (placeResult) {
        self.onSearchComplete(placeBuilder(placeResult));
      });
    });

    var placeBuilder = function (placeResult) {
      var place = {};
      place.formatted_address = place.formatted_address;
      place.location = {lat: place.geometry.location.G, lon: place.geometry.location.K};
      return place;
    };
  };

  function BaiduAutocompleteService (elem, city) {
    var self = this;
    var autocomplete = new BMap.Autocomplete({input: elem[0], location: city});
    var $elem = elem[0];

    autocomplete.addEventListener('onconfirm', function(selectedPlace) {
      var val = $elem.value;
      var search = new BMap.LocalSearch(val, {onSearchComplete: function (placeResult) {
        self.onSearchComplete(placeBuilder(placeResult, selectedPlace));
      }});

      search.search(val);
    });

    var placeBuilder = function (placeResult, selectedPlace) {
      var place = {};
      place.formatted_address = [selectedPlace.item.value.city, selectedPlace.item.value.district].join();
      place.location = {lat: placeResult.getPoi(0).point.lat, lon: placeResult.getPoi(0).point.lng};
      return place;
    };
  };

  // places autocomplete directive
  function PlacesAutocomplete () {
    var self = {};

    var serviceProvider = {
      google: GoogleAutocompleteService,
      baidu: BaiduAutocompleteService
    };

    self.scope = {
      city: '=?',
      service: '=?',
      ngModel: '='
    };

    self.onSearchComplete = function (processedPlace) {
      self.$scope.$apply(function() {
        self.$scope.ngModel = processedPlace;
        self.$scope.$emit('places-autocomplete:select', processedPlace);
      });
    };

    self.controller = function ($scope) {
      self.$scope = $scope;
    };

    self.link = function (scope, elem, attr) {
      console.log(scope.service);
      scope.$watch('city', function(oldVal, newVal) {
        self.provider = serviceProvider[scope.service];
        switch (scope.service) {
          case 'google':
            self.provider.call(self, elem);
            break;
          case 'baidu':
            self.provider.call(self, elem, scope.city);
            break
        }
      })
    };

    return self;
  }

  // regist places autocomplete directive
  angular.module('fancy-places-autocomplete').directive('placesAutocomplete', PlacesAutocomplete);
})();
