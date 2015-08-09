(function() {
  app = angular.module('ngApp', [
    'fancy-places-autocomplete'
  ]);

  function AppCtrl ($scope) {
    $scope.address = "";
    $scope.$on("places-autocomplete:select", function(event, res) {
      console.log('AppCtrl', res);
    });
  }

  app.controller('AppCtrl', AppCtrl);
})();
