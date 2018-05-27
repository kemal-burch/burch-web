angular.module("myApp").controller("userCtrl", [
  "$scope",
  "localStorageService",
  "$http",
  "$state",
  "userService",
  "authenticationService",
  "notify",
  function(
    $scope,
    localStorageService,
    $http,
    $state,
    userService,
    authenticationService,
    notify
  ) {
    $scope.userObj = {};
    $scope.login = function() {
      userService
        .logIn($scope.userObj)
        .success(function(data) {
          localStorageService.set("localStorageToken", data.token);
          localStorageService.set("logedInUser", data.user);
          $scope.app.token = localStorageService.get("localStorageToken");
          authenticationService.setAuthentication(
            true,
            data.token,
            $scope.userObj.rememberme
          );
          $state.go("home", { reload: true });
        })
        .error(function(err) {
          if (err.msg == "Invalid credentials")
            notify({
              message: err.msg + ". " + "Please check your email and password",
              classes: "alert-danger",
              duration: 3000
            });
          else
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 3000
            });
        });
    };

    $scope.signup = function() {
      userService
        .saveUserDetails($scope.userObj)
        .success(function(data) {
          $state.go("login", { reload: true });
        })
        .error(function(err) {
          if (err.msg == "Invalid credentials")
            notify({
              message: err.msg + ". " + "Please check your email and password",
              classes: "alert-danger",
              duration: 3000
            });
          else
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 3000
            });
        });
    };
  }
]);
