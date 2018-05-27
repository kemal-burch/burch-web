"use strict";

var userModel = require("../models/users");
var authModel = require("../models/auth");
var async = require("async");
var db_constants = require("../config/db_constants");
var authTokenLib = require("../lib/tokenauth");
var validatorObj = require("./../validator/user");
var validatorLib = require("./../lib/validator");
var paramsToAvoid = ["mod_on", "crtd_on", "schema", "passwrd", "__v"];
var lib = require("./../lib/commonFunc");
var config = require("../config/config");
var companyModel = require("../models/company");
var crypto = require("crypto");
var async = require("async");
var Common = new (require("../helpers/Common"))();
var _ = require("underscore");
var expenseCategoryModel = require("../models/expenseCategory");

exports.createExpenseCategory = function(req, res) {
  var reqData = req.body;

  expenseCategoryModel.addExpenseCategory(reqData, function(err, data) {
    if (err || data == null) {
      res.status(400).json({
        apiStatus: "Failure",
        msg: "Error while adding the Expense category"
      });
    } else {
      lib.cleanJson(data, paramsToAvoid, function(data) {
        res.json({
          apiStatus: "success",
          categories: data,
          msg: "Expense category is successfully added"
        });
      });
    }
  });
};

exports.updateExpenseCategory = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: parseInt(req.params.id)
  };
  var selectparams = "";
  expenseCategoryModel.updateExpenseCategory(
    condition,
    {
      $set: {
        name: req.body.name
      }
    },
    selectparams,
    function(err, expense) {
      if (err) {
        res.status(400).json({
          apiStatus: "Failure",
          msg: "Error while updating the expense category"
        });
      } else {
        res.json({
          apiStatus: "success",
          data: expense,
          msg: "Expense category has been successfully updated"
        });
      }
    }
  );
};

exports.getAllExpenseCategory = function(req, res, next) {
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
        res.status(400).json({
          apiStatus: "Failure",
          msg: "Error fetching Expense Category list"
        });
      } else {
        if (data.length > 0) {
          res.json({ apiStatus: "success", categories: data });
        } else {
          res.json({ msg: "No Records Found" });
        }
      }
    }
  );
};

exports.deleteExpenseCategory = function(req, res, next) {
  var userData = req.user;

  var condition = {
    id: parseInt(req.params.id)
  };
  var selectparams = "";
  expenseCategoryModel.updateExpenseCategory(
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
          msg: "Error while deleting the expense category"
        });
      } else {
        res.json({
          apiStatus: "success",
          data: expense,
          msg: "Expense category has been successfully deleted"
        });
      }
    }
  );
};
