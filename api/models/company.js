'use strict'; 

/**
 * Module dependencies.
 */
var dbModel = require('./db_model');
var Common = new (require('../helpers/Common'))();
module.exports.collectionName = 'companies';

/** company Schema **/
var companySchema = {
	id:{type: Number},
	nm : {type: String},
	addr: {type: String},
	phn: {type: String},
	priLsn: {type: String},
	secLsn: {type:String},
	isBuyr: { type: Boolean, default:false},
	isSpplr: { type: Boolean, default:false},
	isOprtr: { type: Boolean, default: false},
	st: {type: Number, default:1},
	sup_url: {type : String},
	crtd_on: {type: Number, default: Common.getTimestamp()},
    mod_on: {type: Number, default: Common.getTimestamp()},
    fx: {type: Number},
};

exports.baseModel = new dbModel(module.exports.collectionName, companySchema,true);

/**
 * Function to fetch all companies details 
 */
module.exports.fetchAllCompanies = function(conditions, selectparams, limit, sort, callback){    
    var results = exports.baseModel.find(conditions, selectparams, limit, sort, function(error, docs){
        callback(error, docs);
    });
}

/**
 * Function to save company to database
 * @param obj {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.add = function(obj,callback) {
    exports.baseModel.create(obj, function(error, newCompany){
        callback(error, newCompany);
    });

};

/**
 * Function to update company's details
 * @param Json {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.updateCompany = function(companyId, Json, option, callback) {
   exports.baseModel.update(companyId, Json, option, function(err,updatedCompany){
        callback(err, updatedCompany);
    });
};

module.exports.getCompany = function(conditions, selectparams, limit, sort, callback){
	exports.baseModel.find(conditions, selectparams, limit, sort, function(error, docs){
		callback(error, docs);
	});
}
// to get the single record 
module.exports.getCompanyRecord = function(conditions, selectparams, callback){
    exports.baseModel.findOne(conditions, selectparams, function(error, docs){
        callback(error, docs);
    });
}