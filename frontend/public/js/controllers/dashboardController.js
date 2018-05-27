angular.module("myApp").controller("dashCtrl", [
  "$scope",
  "$http",
  "$state",
  "notify",
  "userService",
  "authenticationService",
  "localStorageService",
  "$rootScope",
  "$stateParams",
  "expenseService",
  "incomeService",
  "$timeout",
  function(
    $scope,
    $http,
    $state,
    notify,
    userService,
    authenticationService,
    localStorageService,
    $rootScope,
    $stateParams,
    expenseService,
    incomeService,
    $timeout
  ) {
    $scope.dashObj = {};
    $scope.active = { tab: "expense" };
    $scope.selectedItem;
    $scope.expenseCategories;
    $scope.incomeCategories;
    $scope.dashboardExpenses;
    $scope.dashboardIncomes;
    $scope.dashboardExpenseTotal;
    $scope.dashboardIncomeTotal;

    var userData = localStorageService.get("logedInUser");
    if (userData) {
      showDataOnDashboard();
      $rootScope.first_name = userData.first_name;
      $rootScope.email = userData.email;
    }

    //logout function function
    $rootScope.logout = function() {
      userService
        .logoutUser(userData.id)
        .success(function(data) {
          localStorageService.clearAll();
          sessionStorage.removeItem("token");
          authenticationService.revokeAuthentication();
          $state.go("login", { reload: true });
          //window.location.reload();
        })
        .error(function(err) {
          notify({
            message: "Error in logout",
            classes: "alert-danger",
            duration: 2000
          });
        });
    };

    $scope.isSet = function(tabNum) {
      return $scope.active.tab === tabNum;
    };

    $scope.setTab = function(newTab) {
      $scope.active.tab = newTab;
    };

    function showDataOnDashboard() {
      var userData = localStorageService.get("logedInUser");
      $scope.showData = true;
      $rootScope.first_name = userData.first_name;
      $rootScope.email = userData.email;
      expenseService
        .getCategoryWiseSum()
        .success(function(data) {
          $scope.dashboardExpenses = (data || {}).data;
          $scope.dashboardExpenseTotal = (data || {}).total;
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    }
    $scope.getCategoryWiseSum = function() {
      incomeService
        .getCategoryWiseSum()
        .success(function(data) {
          $scope.dashboardIncomes = (data || {}).data;
          $scope.dashboardIncomeTotal = (data || {}).total;
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.select = function(data) {
      if ($scope.active.tab == "expense") {
        $scope.dashObj.expense_category_id = data.id;
      } else {
        $scope.dashObj.income_category_id = data.id;
      }
    };

    $scope.getSelectedText = function() {
      if ($scope.selectedItem !== undefined) {
        return "You have selected: Item " + $scope.selectedItem;
      } else {
        return "Please select an item";
      }
    };

    $scope.fetchExpenseCategories = function() {
      expenseService
        .getExpenseCategories()
        .success(function(data) {
          $scope.expenseCategories = (data || {}).categories;
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.fetchIncomeCategories = function() {
      incomeService
        .fetchIncomeCategories()
        .success(function(data) {
          $scope.incomeCategories = (data || {}).categories;
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.saveExpCategory = function() {
      if ($scope.dashObj.expense_category) {
        expenseService
          .saveExpCategory({ name: $scope.dashObj.expense_category })
          .success(function(data) {
            $scope.dashObj.expense_category_id = (data.categories || {}).id;
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      }
    };

    $scope.saveIncCategory = function() {
      if ($scope.dashObj.income_category) {
        incomeService
          .saveIncCategory({ name: $scope.dashObj.income_category })
          .success(function(data) {
            $scope.dashObj.income_category_id = (data.categories || {}).id;
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      }
    };

    $scope.saveExpense = function() {
      if (!$scope.dashObj.amount) {
        notify({
          message: "Please Enter Amount",
          classes: "alert-danger",
          duration: 3000
        });
        return false;
      }

      if (!$scope.dashObj.expense_category_id) {
        notify({
          message: "Please select expense category id",
          classes: "alert-danger",
          duration: 3000
        });
        return false;
      }

      let obj = {
        note: $scope.dashObj.note,
        amount: parseInt($scope.dashObj.amount),
        expense_category_id: $scope.dashObj.expense_category_id
      };
      expenseService
        .saveExpense(obj)
        .success(function(data) {
          showDataOnDashboard();
          $scope.dashObj = {};

          notify({
            message: data.msg,
            classes: "alert-success",
            duration: 3000
          });
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });

      //For clearing modal fields
      $timeout(function() {
        angular.element("#expenseModal button.expenseClose").trigger("click");
      }, 0);
    };

    $scope.saveIncome = function() {
      "\r\n\n $scope.dashObj. ", $scope.dashObj;
      if (!$scope.dashObj.amount) {
        notify({
          message: "Please Enter Amount",
          classes: "alert-danger",
          duration: 3000
        });
        return false;
      }

      if (!$scope.dashObj.income_category_id) {
        notify({
          message: "Please select income category id",
          classes: "alert-danger",
          duration: 3000
        });
        return false;
      }
      let obj = {
        note: $scope.dashObj.note,
        amount: parseInt($scope.dashObj.amount),
        income_category_id: $scope.dashObj.income_category_id
      };
      incomeService
        .saveIncome(obj)
        .success(function(data) {
          $scope.getCategoryWiseSum();
          $scope.dashObj = {};

          notify({
            message: data.msg,
            classes: "alert-success",
            duration: 3000
          });
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });

      $timeout(function() {
        angular.element("#incomeModal button.incomeClose").trigger("click");
      }, 0);
    };

    $scope.showDetails = false;

    $scope.openExpenseDetails = function(detail, itemIndex) {
      angular.element("body").addClass("manageSurvey");
      $scope.showDetails = true;
      $scope.catDetails = detail;
      if ($scope.active.tab == "expense") {
        expenseService
          .getExpenseDetail(detail._id)
          .success(function(data) {
            $scope.trackerDetails = (data || {}).results;
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      } else {
        incomeService
          .getIncomeDetail(detail._id)
          .success(function(data) {
            $scope.trackerDetails = (data || {}).results;
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      }
    };

    $scope.editExpCat = function(detail, itemIndex) {
      $scope.dashObj.expense_category = detail.name;
      $scope.dashObj.expense_category_id = detail.id;
    };

    $scope.updateExpenseCat = function() {
      expenseService
        .updateExpCategory($scope.dashObj.expense_category_id, {
          name: $scope.dashObj.expense_category
        })
        .success(function(data) {
          $scope.fetchExpenseCategories();
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.deleteExpCat = function(detail, itemIndex) {
      if (confirm("Are you sure?")) {
        expenseService
          .deleteExpCategory(detail.id)
          .success(function(data) {
            $scope.fetchExpenseCategories();
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      }
    };

    $scope.editIncomeCat = function(detail, itemIndex) {
      $scope.dashObj.income_category = detail.name;
      $scope.dashObj.income_category_id = detail.id;
    };

    $scope.updateIncomeCat = function() {
      incomeService
        .updateIncCategory($scope.dashObj.income_category_id, {
          name: $scope.dashObj.income_category
        })
        .success(function(data) {
          $scope.fetchIncomeCategories();
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.deleteIncomeCat = function(detail, itemIndex) {
      incomeService
        .deleteIncCategory(detail.id)
        .success(function(data) {
          $scope.fetchIncomeCategories();
        })
        .error(function(err) {
          notify({ message: err.msg, classes: "alert-danger", duration: 2000 });
        });
    };

    $scope.closeTrackerDetails = function(surveyType) {
      angular.element("body").removeClass("manageSurvey");
      $scope.showDetails = false;
      showDataOnDashboard();
      $scope.getCategoryWiseSum();
      $state.go("home");
    };

    $scope.editDetail = function(tracker, itemIndex) {
      $scope.expense_category = $scope.catDetails.name;
      $scope.dashObj = tracker;
    };

    $scope.updateDetail = function() {
      $scope.dashObj.amount = parseInt($scope.dashObj.amount);
      if ($scope.active.tab == "expense") {
        expenseService
          .updateExpenseDetail($scope.dashObj.id, $scope.dashObj)
          .success(function(data) {
            $scope.dashObj = {};
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      } else {
        incomeService
          .updateIncomeDetail($scope.dashObj.id, $scope.dashObj)
          .success(function(data) {
            $scope.dashObj = {};
          })
          .error(function(err) {
            notify({
              message: err.msg,
              classes: "alert-danger",
              duration: 2000
            });
          });
      }
    };

    $scope.deleteDetail = function(tracker, index) {
      if (confirm("Are you sure?")) {
        if ($scope.active.tab == "expense") {
          expenseService
            .deleteExpenseDetail(tracker.id)
            .success(function(data) {
              $scope.trackerDetails.splice(index, 1);
            })
            .error(function(err) {
              notify({
                message: err.msg,
                classes: "alert-danger",
                duration: 2000
              });
            });
        } else {
          incomeService
            .deleteIncomeDetail(tracker.id)
            .success(function(data) {
              $scope.trackerDetails.splice(index, 1);
            })
            .error(function(err) {
              notify({
                message: err.msg,
                classes: "alert-danger",
                duration: 2000
              });
            });
        }
      }
    };
  }
]);
