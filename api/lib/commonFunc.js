/**
 * File to hold all common library functions
 * @module lib/commonFunc
 */

var dbConstants = require("./../config/db_constants");
var utf8 = require("utf8");
var _ = require("underscore");
var crypto = require("crypto");
var config = require("../config/config");

/**
 * Function to generate encrypted id
 * @param txtToEncrypt {String} the text to be encrypted
 * @param callback {String} the callback function
 */
module.exports.getEncrypted = function(txtToEncrypt, callback) {
  //Generate secret token
  var crypted = hashids.encode(parseInt(txtToEncrypt));
  return callback(crypted);
};

/**
 * Function to generate decrypted id
 * @param txtToDecrypt {String} the encrypted string
 * @param callback {String} the callback function
 * @returns {*} the decrypted string
 */
module.exports.getDecrypted = function(txtToDecrypt, callback) {
  //Generate secret token
  var numbers = hashids.decode(txtToDecrypt);
  return callback(numbers);
};

/**
 * The function checks if an object is empty
 * @param obj {Object} the object to check
 * @returns {boolean} returns true if empty, else returns false
 */
exports.isEmpty = function(obj) {
  // null and undefined are "empty"
  if (obj == null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length && obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and toValue enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
};

/**
 * Function to delete json
 * @param obj {Object} the json object to be modified
 * @param paramToAvoid {JSON_obj} the parameters of object to delete
 * @param cb {String} the callback function
 */
exports.cleanJson = function(obj, paramToAvoid, cb) {
  for (var key in paramToAvoid) {
    delete obj[paramToAvoid[key]];
  }
  cb(obj);
};

/**
 * Function to modify string
 * @param str {String} the string to be replaced
 * @returns {*|XML|string|void}
 */
exports.escapeRegex = function(str) {
  return str.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, "\\$&");
};

/**
 * Function to flip the array elements
 * @param origArr {JSON_array} the original json array
 * @returns {{}}
 */
exports.array_flip = function(origArr) {
  var key,
    tmp_ar = {};
  for (key in origArr) {
    if (origArr.hasOwnProperty(key)) {
      tmp_ar[origArr[key]] = key;
    }
  }
  return tmp_ar;
};

//incase-sensitive sorting of string array
exports.sortedKeys = function(myObj) {
  var keys = [];
  var objString = "";
  _.each(myObj, function(value, key) {
    if (key) {
      keys.push(key);
    }
  });

  var sortedKeys = keys.sort();

  sortedKeys.filter(function(item) {
    if (myObj[item]) {
      objString += item + "=" + myObj[item] + ":";
    }
  });

  objString = objString.slice(0, -1);
  return objString;
};

// generate the signature
exports.getSignature = function(secretKey, objString) {
  var utf8String = utf8.encode(secretKey + ":" + objString);
  var sha256 = crypto.createHash("sha256");
  sha256.update(utf8String); //utf8 here
  var result = sha256.digest("base64");
  var finalString = result
    .replace(/[+]/g, "-")
    .replace(/[/]/g, "_")
    .replace(/[=]/g, "");

  return finalString;
};

//convert snake case string to Capitalize string
exports.capitalize = function(str) {
  var frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
};

//convert snake case string to Capitalize string
exports.snakecase = function(str) {
  var frags = str.split(" ");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toLowerCase() + frags[i].slice(1);
  }
  return frags.join("_");
};
