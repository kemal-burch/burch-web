"use strict";

var incomeModel = require("../models/income");
var authModel = require("../models/auth");
var async = require("async");
var db_constants = require("../config/db_constants");
var authTokenLib = require("../lib/tokenauth");
var validatorObj = require("./../validator/user");
var validatorLib = require("./../lib/validator");
var paramsToAvoid = ["mod_on", "crtd_on", "schema", "passwrd", "__v"];
var lib = require("./../lib/commonFunc");
var config = require("../config/config");
var async = require("async");
var Common = new (require("../helpers/Common"))();
var _ = require("underscore");
var incomeCategoryModel = require("../models/incomeCategory");

exports.createIncome = function(req, res) {
  var reqData = req.mappedJson;
  var userData = req.user;
  reqData.user_id = parseInt(userData.usr_id);

  incomeModel.addIncome(reqData, function(err, data) {
    if (err || data == null) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while adding the Income" });
    } else {
      lib.cleanJson(data, paramsToAvoid, function(data) {
        validatorLib.mapping(data, validatorObj.apiMapping, function(results) {
          res.json({
            apiStatus: "success",
            income: results,
            msg: "Income is successfully added"
          });
        });
      });
    }
  });
};

exports.updateIncome = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: req.params.id,
    user_id: parseInt(userData.usr_id)
  };
  var option = "";
  var reqData = req.mappedJson;

  incomeModel.updateIncome(condition, reqData, option, function(
    err,
    updatedUser
  ) {
    if (updatedUser == null || err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while updating the user" });
    } else {
      res.json({ apiStatus: "success", msg: "User is successfully updated" });
    }
  });
};

exports.getCategoryWiseSum = function(req, res, next) {
  var userData = req.user;

  async.parallel(
    {
      getIncomeCategory: function(cb) {
        var conditions = {
          is_deleted: 0
        };
        incomeCategoryModel.fetchAllIncomeCategory(
          conditions,
          { id: 1, name: 1, _id: 0 },
          "",
          "",
          function(err, data) {
            if (err) {
              cb(null, {
                apiStatus: "Failure",
                msg: "Error fetching income Category list"
              });
            } else {
              cb(null, data);
            }
          }
        );
      },
      getCategoryWiseSum: function(cb) {
        var match = {
          user_id: parseInt(userData.usr_id),
          is_deleted: 0
        };

        var group = {
          _id: "$income_category_id",
          total: {
            $sum: "$amount"
          }
        };

        incomeModel.getCategoryWiseSum(match, group, function(err, data) {
          if (err) {
            console.log("\r\n\n\n err ", err);
            cb(null, {
              apiStatus: "Failure",
              msg: "Error fetching income's list"
            });
          } else {
            cb(null, data);
          }
        });
      }
    },
    function(err, result) {
      if (err) {
        res.status(400).json(err);
      } else {
        let total = 0;
        result.getCategoryWiseSum.forEach(function(element) {
          total += element.total;
          let category = _.findWhere(result.getIncomeCategory, {
            id: element._id
          });
          if (category) {
            element.name = category.name;
          }
        });
        res.json({
          msg: "success",
          data: result.getCategoryWiseSum,
          total: total
        });
      }
    }
  );
};

exports.deleteIncome = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: req.params.id,
    user_id: parseInt(userData.usr_id)
  };
  var selectparams = "";
  incomeModel.updateIncome(
    condition,
    {
      $set: {
        is_deleted: 1
      }
    },
    selectparams,
    function(err, user) {
      if (err) {
        res.status(400).json({
          apiStatus: "Failure",
          msg: "Error while deleting the Income"
        });
      } else {
        res.json({
          apiStatus: "success",
          msg: "Income has been successfully deleted"
        });
      }
    }
  );
};

exports.getAllIncome = function(req, res, next) {
  var userData = req.user;

  var conditions = {
    is_deleted: 0,
    user_id: parseInt(userData.usr_id),
    income_category_id: parseInt(req.params.id)
  };
  incomeModel.fetchAllIncome(conditions, "", "", "", function(err, data) {
    if (err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error fetching Income's list" });
    } else {
      res.json({ apiStatus: "success", results: data });
    }
  });
};
