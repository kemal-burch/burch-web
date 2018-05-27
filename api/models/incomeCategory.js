'use strict'; 

/**
 * Module dependencies.
 */
var dbModel = require('./db_model');
var Common = new (require('../helpers/Common'))();
module.exports.collectionName = 'income_category';


/** income Schema **/
var incomeCategorySchema = {
    id : {type : Number},
    name : {type : String},
    crtd_on: {type: Number, default: Common.getTimestamp()},
    mod_on: {type: Number, default: Common.getTimestamp()},
    is_deleted : {type : Number, default:0}
};

exports.baseModel = new dbModel(module.exports.collectionName, incomeCategorySchema,true);

/**
 * Function to save income_category to database
 * @param mappedJson {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.addIncomeCategory = function(mappedJson, callback) {
    exports.baseModel.create(mappedJson, function(error, newUser){
        callback(error, newUser);
    });
};

/**
 * Function to update income_category data in database
 * @param userId {int} the user id
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.updateIncomeCategory = function(userId, obj, option, callback) {
    exports.baseModel.findOneAndUpdate(userId, obj, option, function(err,updatedUser){
        callback(err, updatedUser);
    });

};


/**
 * Function to fetch all income_category's details 
 */
module.exports.fetchAllIncomeCategory = function(conditions, selectparams, limit, sort, callback){    
    var results = exports.baseModel.find(conditions, selectparams, limit, sort, function(error, usersData){
        callback(error, usersData);
    })
}


module.exports.getIncomeCategory = function (condition, callback) {
    exports.baseModel.findOne(condition,'', function(err, doc) {
        callback(err, doc);
    });
};
