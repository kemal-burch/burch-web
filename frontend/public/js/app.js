var app = angular.module("myApp", [
  "ui.router",
  "ngCookies",
  "cgNotify",
  "LocalStorageModule",
  "ngAnimate",
  "ngMaterial"
]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  "$httpProvider",
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push("TokenInterceptor");
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "login.html",
        access: { requiredAuthentication: false },
        data: { pageTitle: "Budget Tracker | Login" }
      })
      .state("home", {
        url: "/dashboard",
        templateUrl: "home.html",
        access: { requiredAuthentication: true },
        data: { pageTitle: "Budget Tracker | Home" }
      })
      .state("signup", {
        url: "/signup",
        templateUrl: "signup.html"
      })
      .state("/", {
        url: "/",
        controller: "indexController"
      })

      .state("dynstate", {
        url: "/{id}?{locale}&{survey_id}",
        templateUrl: function(stateParams) {
          return stateParams.id + ".html";
        }
      })
      .state("404", {
        url: "/404",
        templateUrl: "404.html"
      });
  }
]);

app.run([
  "$rootScope",
  "$location",
  "$state",
  "$window",
  "authenticationService",
  "localStorageService",
  "$cookies",
  "userService",
  "notify",
  "$timeout",
  function(
    $rootScope,
    $location,
    $state,
    $window,
    authenticationService,
    localStorageService,
    $cookies,
    userService,
    notify,
    $timeout
  ) {
    $rootScope.$on("$stateChangeStart", function(
      event,
      toState,
      toParams,
      fromState,
      fromParams
    ) {
      var userData = localStorageService.get("logedInUser");
      if (userData && $window.FS) {
        $window.FS.identify(userData.eml, {
          displayName: userData.usrName,
          email: userData.eml
        });
      }

      //limit notifications to only one at a time
      notify.config({ maximumOpen: 1 });

      $rootScope.$state = $state;
      var localtoken = localStorageService.get("localStorageToken");
      if (
        toState != null &&
        toState.access != null &&
        toState.access.requiredAuthentication &&
        !authenticationService.isAuthenticated &&
        !localtoken
      ) {
        event.preventDefault();
        $state.go("login");
      }
      if (
        toState != null &&
        toState.url != null &&
        (toState.url == "/" || toState.url == "") &&
        (authenticationService.isAuthenticated || $cookies.token || localtoken)
      ) {
        $rootScope.loggedInUser = authenticationService.loggedInUser;
        event.preventDefault();
        $state.go("home");
      }
      if (
        toState.url == "/login" &&
        (authenticationService.isAuthenticated || $cookies.token || localtoken)
      ) {
        $window.location.href = "/#/";
      }
    });
  }
]);
