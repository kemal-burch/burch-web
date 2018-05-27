

angular.module('myApp')
    .factory('incomeService',['$http', function($http) {
        var base_url = 'http://localhost:3000';
        return {
            fetchIncomeCategories: function () {
                return $http.get(base_url + '/income_category');
            },
            getCategoryWiseSum: function () {
                return $http.get(base_url + '/income');
            },

            getIncomeDetail: function (category_id) {
                return $http.get(base_url + '/income/all/'+category_id);
            },

            deleteIncomeDetail: function (id) {
                return $http.delete(base_url + '/income/'+id);
            },

            updateIncomeDetail : function(id, data){
                return $http.put(base_url + '/income/'+id, data);
            },

            saveIncCategory : function(name){
                return $http.post(base_url + '/income_category', name);
            },

            saveIncome : function(data){
                return $http.post(base_url + '/income', data);
            },


             updateIncCategory : function(id, data){
                return $http.put(base_url + '/income_category/'+id, data);
            },

            deleteIncCategory : function(id){
                return $http.delete(base_url + '/income_category/'+id);
            },

        }
    }]);
