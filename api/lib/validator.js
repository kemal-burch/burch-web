/**
 * @module lib/validator
 * @type {exports.Validator|*}
 */
var dbConstants = require('./../config/db_constants');
var async = require('async');
var _ = require('underscore');
var _url = require("url");
var userModel = require('../models/users');
var Ajv = require('ajv');

/*
 class to validate JsonSchema and mapping DB attrubutes with api and vice versa
 */
exports.validate = function (req, res, callBack) {

    var url = req.path;
    /*
     * include the correponding validator from the validator folder, please ensure mapping is present in db_constants
     * file for new validator modules added
     */
    for (var key in dbConstants.moduleNames) {
        if (url.indexOf(dbConstants.moduleNames[key]) > -1) {
            var validatorObj = require('./../validator/'+key);
            break;
        }
    }

    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    var instance = req.body;
    var schema = validatorObj.jsonSchema;
    if (req.method === 'PUT') {
        //console.log('went into updateschema');
        schema = validatorObj.updatejsonSchema;
    }
    try{
    var validate = ajv.compile(schema);
    var valid = validate(instance);

    }catch(e){
            console.log("\r\n\n\n .e ", e)
    }
    var dbMapping = validatorObj.dbMapping;

    if (!valid) {
        console.log("\n\n error stack 2 ", JSON.stringify(validate.errors))
        showValidationErrorUpdated(validate.errors, req, res);
    } else {
        exports.mapping(instance, dbMapping, function (results) {
            if (results) {
                req.mappedJson = results;
                return callBack();
            }
        });
    }
};




/*
 class to validate params  (code)
 */
exports.validateParams = function (req, res, callBack) {

    var params = req.params;
    console.log("\n\n params",JSON.stringify(params));
    if (params && params.id && !isNumeric(params.id)){
        console.log("invalid user id");
        return res.status(400).json({
                code: 1017,
                msg: "invalid user id"
        });
    } else {
        return callBack();
    }
};


/*
 @param instance JSON  is a actual schema to be mapped
 @param mapping is array with mapping attributes
 @param multiple is a boolean val true/false, true means multiple JSON obj's are mapped, false means single object are mapped
 @param cb String Callback function

 */
exports.mapping = function (instance, mapping, cb) {
    if (instance && instance.length == undefined) {
        var mappedJson = {};
        for (var key in instance) {
            if (instance.hasOwnProperty(key)) {
                if (mapping[key] != undefined) {
                    if (typeof instance[key] == "object" && key != '_id' && instance[key] != null) {
                        if (instance[key] instanceof Date) {
                            //convert date obj to string
                            mappedJson[mapping[key]] = instance[key].toISOString();
                        } else if (instance[key] instanceof Array) {
                            if (instance[key].length > 0 && typeof instance[key][0] == "object") {
                                mappedJson[mapping[key]] = [];
                                for (var i = 0; i < instance[key].length; i++) {
                                    exports.mapping(instance[key][i], mapping, function (results) {
                                        if (results) {
                                            mappedJson[mapping[key]][i] = results;
                                        }
                                    });
                                }
                            } else {
                                mappedJson[mapping[key]] = new Array();
                                mappedJson[mapping[key]] = instance[key];
                            }
                        } else {
                            mappedJson[mapping[key]] = {};
                            exports.mapping(instance[key], mapping, function (results) {
                                if (results) {
                                    mappedJson[mapping[key]] = results;
                                }
                            });
                        }
                    } else if (typeof instance[key] == "Array" && key != '_id') {
                        //console.log(instance[key]);
                    } else {
                        if (((parseInt(instance[key]) === instance[key]) || (parseFloat(instance[key]) === instance[key])) || ((parseInt(instance[key]) != NaN) || (parseFloat(instance[key]) != NaN))) {
                            mappedJson[mapping[key]] = instance[key];
                        } else {
                            mappedJson[mapping[key]] = instance[key].trim();
                        }
                    }
                }

            }

        }
        cb(mappedJson);
    } else if (instance && instance.length >= 1) {
        var mappedJson = [];

        async.eachSeries(instance, function (val, objectCb1) {
            setTimeout(function () {
                exports.mapping(val, mapping, function (results) {
                    if (results) {
                        mappedJson = mappedJson.concat(results);
                        setImmediate(objectCb1);
                    }
                })
            }, 0);
        }, function (err) {
            //console.log("Api Mapping completed successfully");
            cb(mappedJson);
        });
    }

}

//export.jobStatsMapping

exports.changeLetterCase = function (letter, cb) {
    if (letter === parseInt(letter)) {
        var finalLetter = letter;
    } else {
        var lowerCase = letter.toLowerCase();
        var finalLetter = lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
    }
    cb(finalLetter);
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function showValidationErrorUpdated(Errors, req, res) {
    var url = req.path;
    if(_.findWhere(Errors, {"keyword":"oneOf"})) {
        
            return  res.status(400).send({
                code: 1001,
                msg: "invalid payload"
            });
       
    } else {
        var errors = new Array();
        _.each(Errors, function (item) {
            if(item && item["message"]) {
                var error = '';
                if(item["dataPath"]) {
                    var schemaKey = item["dataPath"];
                    if(item["dataPath"].indexOf('.') > -1) {
                        schemaKey = item["dataPath"].split('.')[1];
                    }
                    error += schemaKey + ' ';
                }

                error += item["message"];
                errors.push(error);
            }
        });
        errors = errors.join(", ");
        return  res.status(400).send({
            code: 1003,
            msg: "Errors are : "+errors
        });
    }


}

exports.validateCommonFields = function(req, res, callBack){

   
    return callBack();
          
}




// exports.ifOwnsTracker = function(req, res, callBack){
//     var userData = req.user.userData; // access from  HasRole middleware

//     var selectparams = {},
//             conditions = {
//                 id: parseInt(req.params.id)
//             };
//             userModel.getUserRecord(conditions, selectparams, function (err, results) {
//                 if (err) {
//                     return res.status(500).json({
//                         ps_buy_api_status_code: 9999,
//                         msg: "Unknown error"
//                     });
//                 } else if(results){
//                     if(results.cmp == userData.cmp ){
//                         req.locale = results.locale;
//                         return callBack();
//                     }else{
//                         return res.status(403).json({
//                         ps_buy_api_status_code: 1020,
//                         msg: buyer_config.NO_PERMISSION_FOR_SURVEY
//                     })
//                     }

//                 } else {
//                     return res.status(404).json({
//                         ps_buy_api_status_code: 1006,
//                         msg: "Survey not found"
//                     })
//                 }
//             })
// }

