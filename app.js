(function() {
  app = angular.module('ngApp', [
    'ng-places-autocomplete'
  ]);

  function AppCtrl ($scope) {
    $scope.$on("places-autocomplete:select", function(event, res) {
      $scope.location = res;
      console.log('AppCtrl', res);
    });
  }

  app.controller('AppCtrl', AppCtrl);
})();
