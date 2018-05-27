'use strict'; 

/**
 * Module dependencies.
 */
var dbModel = require('./db_model');
var Common = new (require('../helpers/Common'))();
module.exports.collectionName = 'income';


/** income Schema **/
var incomeSchema = {
	id : {type : Number},
    note : {type : String},
    amount : {type : Number},
	income_category_id : {type : Number},
	user_id : {type : Number},
    crtd_on : {type: Number, default: Common.getTimestamp()},
    mod_on : {type: Number, default: Common.getTimestamp()},
    is_deleted : {type : Number, default:0}
};

exports.baseModel = new dbModel(module.exports.collectionName, incomeSchema,true);

/**
 * Function to save income to database
 * @param mappedJson {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.addIncome = function(mappedJson, callback) {
    exports.baseModel.create(mappedJson, function(error, newUser){
        callback(error, newUser);
    });
};

/**
 * Function to update income data in database
 * @param condition {String} the condition
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.updateIncome = function(condition, obj, option, callback) {
    exports.baseModel.update(condition, obj, option, function(err,updatedUser){
        callback(err, updatedUser);
    });

};


/**
 * Function to fetch all income's details 
 */
module.exports.fetchAllIncome = function(conditions, selectparams, limit, sort, callback){    
    var results = exports.baseModel.find(conditions, selectparams, limit, sort, function(error, usersData){
        callback(error, usersData);
    })
}


module.exports.getIncome = function (condition, callback) {
    exports.baseModel.findOne(condition,'', function(err, doc) {
        callback(err, doc);
    });
};


module.exports.getCategoryWiseSum = function(condition, group, callback) {
    exports.baseModel.fields_aggregate(condition, group, function(error, count) {
        callback(error, count)
    });
};
