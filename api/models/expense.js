'use strict'; 

/**
 * Module dependencies.
 */
var dbModel = require('./db_model');
var Common = new (require('../helpers/Common'))();
module.exports.collectionName = 'expense';


/** expense Schema **/
var expenseSchema = {
    id : {type : Number},
    note : {type : String},
    amount : {type : Number},
    expense_category_id : {type : Number},
    user_id : {type : Number},
    crtd_on: {type: Number, default: Common.getTimestamp()},
    mod_on: {type: Number, default: Common.getTimestamp()},
    is_deleted : {type : Number, default:0}
};

exports.baseModel = new dbModel(module.exports.collectionName, expenseSchema,true);

/**
 * Function to save expense to database
 * @param mappedJson {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.addExpense = function(mappedJson, callback) {
    exports.baseModel.create(mappedJson, function(error, newUser){
        callback(error, newUser);
    });
};

/**
 * Function to update Expense data in database
 * @param userId {int} the user id
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.updateExpense = function(userId, obj, option, callback) {
    exports.baseModel.update(userId, obj, option, function(err,updatedUser){
        callback(err, updatedUser);
    });

};


/**
 * Function to fetch all Expense's details 
 */
module.exports.fetchAllExpense = function(conditions, selectparams, limit, sort, callback){    
    var results = exports.baseModel.find(conditions, selectparams, limit, sort, function(error, usersData){
        callback(error, usersData);
    })
}


module.exports.getExpense = function (condition, callback) {
    exports.baseModel.findOne(condition,'', function(err, doc) {
        callback(err, doc);
    });
};


module.exports.getCategoryWiseSum = function(condition, group, callback) {
    exports.baseModel.fields_aggregate(condition, group, function(error, count) {
        callback(error, count)
    });
};
