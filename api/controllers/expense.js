"use strict";

var expenseModel = require("../models/expense");
var authModel = require("../models/auth");
var db_constants = require("../config/db_constants");
var authTokenLib = require("../lib/tokenauth");
var validatorObj = require("./../validator/expense");
var validatorLib = require("./../lib/validator");
var paramsToAvoid = ["mod_on", "crtd_on", "schema", "passwrd", "__v"];
var lib = require("./../lib/commonFunc");
var config = require("../config/config");

var async = require("async");
var Common = new (require("../helpers/Common"))();
var _ = require("underscore");
var expenseCategoryModel = require("../models/expenseCategory");
var _ = require("underscore");

exports.createExpense = function(req, res) {
  var reqData = req.mappedJson;
  var userData = req.user;
  reqData.user_id = parseInt(userData.usr_id);
  expenseModel.addExpense(reqData, function(err, data) {
    if (err || data == null) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while adding the Expense" });
    } else {
      lib.cleanJson(data, paramsToAvoid, function(data) {
        validatorLib.mapping(data, validatorObj.apiMapping, function(results) {
          res.json({
            apiStatus: "success",
            Expense: results,
            msg: "Expense is successfully added"
          });
        });
      });
    }
  });
};

exports.updateExpense = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: parseInt(req.params.id),
    user_id: parseInt(userData.usr_id)
  };
  var option = "";
  var reqData = req.mappedJson;
  expenseModel.updateExpense(condition, reqData, option, function(
    err,
    updatedExpense
  ) {
    if (updatedExpense == null || err) {
      res.status(400).json({
        apiStatus: "Failure",
        msg: "Error while updating the expense"
      });
    } else {
      res.json({
        apiStatus: "success",
        msg: "Expense is successfully updated"
      });
    }
  });
};

exports.getCategoryWiseSum = function(req, res, next) {
  var userData = req.user;
  async.parallel(
    {
      getExpenseCategory: function(cb) {
        var conditions = {
          is_deleted: 0
        };
        expenseCategoryModel.fetchAllExpenseCategory(
          conditions,
          { id: 1, name: 1, _id: 0 },
          "",
          "",
          function(err, data) {
            if (err) {
              cb(null, {
                apiStatus: "Failure",
                msg: "Error fetching Expense Category list"
              });
              //res.status(400).json({ apiStatus: "Failure", msg: "Error fetching Expense Category list"});
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
          _id: "$expense_category_id",
          total: {
            $sum: "$amount"
          }
        };

        expenseModel.getCategoryWiseSum(match, group, function(err, data) {
          if (err) {
            cb(null, {
              apiStatus: "Failure",
              msg: "Error fetching expense's list"
            });
            // res.status(400).json({ apiStatus: "Failure", msg: "Error fetching expense's list"});
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
          let category = _.findWhere(result.getExpenseCategory, {
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

exports.deleteExpense = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: parseInt(req.params.id),
    user_id: parseInt(userData.usr_id)
  };
  var selectparams = "";
  expenseModel.updateExpense(
    condition,
    {
      $set: {
        is_deleted: 1
      }
    },
    selectparams,
    function(err, expense) {
      if (err) {
        res.status(400).json({
          apiStatus: "Failure",
          msg: "Error while deleting the expense"
        });
      } else {
        res.json({
          apiStatus: "success",
          msg: "Expense has been successfully deleted"
        });
      }
    }
  );
};

exports.getAllExpense = function(req, res, next) {
  var userData = req.user;

  var conditions = {
    is_deleted: 0,
    user_id: parseInt(userData.usr_id),
    expense_category_id: parseInt(req.params.id)
  };
  expenseModel.fetchAllExpense(conditions, "", "", "", function(err, data) {
    if (err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error fetching expense's list" });
    } else {
      res.json({ apiStatus: "success", results: data });
    }
  });
};
