

angular.module('myApp')
    .factory('expenseService',['$http', function($http) {
        var base_url = 'http://localhost:3000';
        return {
            getExpenseCategories: function () {
                return $http.get(base_url + '/expense_category');
            },
            getCategoryWiseSum: function () {
                return $http.get(base_url + '/expense');
            },

            getExpenseDetail: function (category_id) {
                return $http.get(base_url + '/expense/all/'+category_id);
            },

            deleteExpenseDetail: function (id) {
                return $http.delete(base_url + '/expense/'+id);
            },

            updateExpenseDetail : function(id, data){
                return $http.put(base_url + '/expense/'+id, data);
            },

            saveExpCategory : function(name){
                return $http.post(base_url + '/expense_category', name);
            },

             updateExpCategory : function(id, data){
                return $http.put(base_url + '/expense_category/'+id, data);
            },

            deleteExpCategory : function(id){
                return $http.delete(base_url + '/expense_category/'+id);
            },


            saveExpense : function(data){
                return $http.post(base_url + '/expense', data);
            },

        }
    }]);
