angular
  .module("myApp")

  .controller("mainCtrl", [
    "$scope",
    "localStorageService",
    "$state",
    "$rootScope",
    function($scope, localStorageService, $state, $rootScope) {
      $scope.app = {
        name: "myApp",
        version: "1.0.0"
      };
      $scope.$state = $state;

      $rootScope.$on("$stateChangeStart", function(
        event,
        toState,
        toParams,
        fromState,
        fromParams,
        options
      ) {
        if (toState.name == "home") {
          $scope.fotrHide = true;
          $scope.hdrHide = true;
        } else {
          $scope.fotrHide = false;
          $scope.hdrHide = false;
        }
      });
    }
  ]);
