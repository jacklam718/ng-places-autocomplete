// places autocomplete directive
(function () {
  'restrict';

  // regist module
  angular.module('fancy-places-autocomplete', []);

  function constructQueryData(data) {
    var query = [];
    for (var d in data)
      query.push(d + '=' + data[d])
    return query.join('&');
  }

  // base class of map service
  function BaseMapService () {};

  function getStaticMapQueryUrl (query) {
    if (this.staticMapApiUrl === undefined) {
      throw('without static map apt url');
      return;
    }

    var defaultQuery = {
      zoom: 16,
      maptype: 'roadmap'
    };

    return this.staticMapApiUrl + '?' + constructQueryData(angular.extend({}, defaultQuery, query));
  }

  // ****************
  // Google
  // ****************
  function GoogleMapService () {
    var self = this;
    self.staticMapApiUrl = 'https://maps.googleapis.com/maps/api/staticmap';

    self.init = function (elem, onSearchComplete) {
      self.elem = elem;
      self.onSearchComplete = onSearchComplete;
      self.autocomplete = new google.maps.places.Autocomplete(elem[0]);
      self.placesService = new google.maps.places.PlacesService(elem[0]);

      self.initAutocomplete();
    }

    self.initAutocomplete = function () {
      google.maps.event.addListener(self.autocomplete, 'place_changed', function() {
        var place = self.autocomplete.getPlace();
        self.placesService.getDetails({reference: place.reference}, function (placeResult) {
          self.onSearchComplete(self.placeBuilder(placeResult));
        });
      });
    };

    self.placeBuilder = function (placeResult) {
      var place = {};
      place.formatted_address = placeResult.formatted_address;
      place.location = {lat: placeResult.geometry.location.G, lon: placeResult.geometry.location.K};
      return place;
    };

    self.getStaticMapQueryUrl = function (query) {
      var defaultOpts = {size: '400x400'};
      return getStaticMapQueryUrl.call(this, angular.extend({}, defaultOpts, query));
    };

    return self;
  };

  // ****************
  // Baidu
  // ****************
  function BaiduMapService () {
    var self = this;
    self.staticMapApiUrl = 'http://api.map.baidu.com/staticimage';

    self.init = function (elem, city, onSearchComplete) {
      self.elem = elem;
      self.city = city;
      self.onSearchComplete = onSearchComplete;
      self.autocomplete = new BMap.Autocomplete({input: elem[0], location: city});
      console.log(self.elem)
      self.initAutocomplete();
    }

    self.initAutocomplete = function () {
      self.autocomplete.addEventListener('onconfirm', function(selectedPlace) {
        console.log(self.elem.value)
        var val = self.elem.value;
        var search = new BMap.LocalSearch(val, {onSearchComplete: function (placeResult) {
          self.onSearchComplete(self.placeBuilder(placeResult, selectedPlace));
        }});

        search.search(val);
      });
    }

    self.placeBuilder = function (placeResult, selectedPlace) {
      var place = {};
      place.formatted_address = [selectedPlace.item.value.city, selectedPlace.item.value.district].join();
      place.location = {lat: placeResult.getPoi(0).point.lat, lon: placeResult.getPoi(0).point.lng};
      return place;
    };

    self.getStaticMapQueryUrl = function (query) {
      var defaultOpts = {width: 400, height: 400};
      return getStaticMapQueryUrl.call(this, angular.extend({}, defaultOpts, query));
    };

    return self;
  };

  // places autocomplete directive
  function PlacesAutocomplete (GoogleMapService, BaiduMapService) {
    var self = {};
    var serviceProvider = {
      google: GoogleMapService,
      baidu: BaiduMapService
    };

    self.require = 'ngModel';
    self.scope = {
      city: '=?',
      service: '=?',
      mapPopup: '=?',
      mapPopupConfig: '=?',
      ngModel: '='
    };

    self.onSearchComplete = function (processedPlace) {
      self.$scope.$apply(function () {
        self.scope.ngModel = processedPlace;
        self.$scope.$emit('places-autocomplete:select', processedPlace);
      });
    };

    self.getStaticMap = function (origin, content) {
      if (typeof self.scope.ngModel === 'object' && self.scope.ngModel.location.lat && self.scope.ngModel.location.lon) {
        var lat = self.scope.ngModel.location.lat, lon = self.scope.ngModel.location.lon;
        var latLon = [lat, lon].join(',');
        var url = self.provider.getStaticMapQueryUrl({center: latLon});
        var $imageElement = angular.element('<img>');

        $imageElement.attr({src: url});
        origin.tooltipster('content', $imageElement);
      }
      content();
    };

    self.controller = function ($scope) {
      self.$scope = $scope;
    };

    self.link = function (scope, elem, attr) {
      self.provider = serviceProvider[scope.service];

      // popup map
      if (scope.mapPopup || elem.attr('map-popup') !== undefined) {
        var $elem = $(elem);
        var popMapDefaultConfig = {animation: 'grow', delay: 200, theme: 'tooltipster-light', touchDevices: false, trigger: 'hover', functionBefore: self.getStaticMap};
        $elem.addClass('tooltip fancy-tooltip');
        $elem.tooltipster(angular.extend({}, popMapDefaultConfig, scope.mapPopupConfig));
      }

      // watch
      scope.$watch('city', function (oldVal, newVal) {
        switch (scope.service) {
          case 'google':
            self.provider.init(elem, self.onSearchComplete);
            break;
          case 'baidu':
            self.provider.init(elem, scope.city, self.onSearchComplete);
            break
        }
      });
    };

    return self;
  }

  // regist places autocomplete directive
  angular.module('fancy-places-autocomplete').directive('placesAutocomplete', PlacesAutocomplete);
  angular.module('fancy-places-autocomplete').factory('GoogleMapService', GoogleMapService);
  angular.module('fancy-places-autocomplete').factory('BaiduMapService', BaiduMapService);
})();
