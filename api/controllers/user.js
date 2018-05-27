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

exports.createUser = function(req, res) {
  var reqData = req.body;

  if (reqData.email) {
    reqData.email = reqData.email.toLowerCase();
  }

  var emailRegex = /^(([a-zA-Z0-9]+)|(([a-zA-Z0-9]+[._-])+[a-zA-Z0-9]+))[@](([a-zA-Z0-9]+)|(([a-zA-Z0-9]+[.-])+[a-zA-Z0-9]))+[.][a-zA-Z]{2,}([.][a-zA-Z]{2,})*?$/;
  if (emailRegex.test(reqData.email) == false) {
    return res
      .status(422)
      .json({ apiStatus: "failure", msg: "Invalid Email Format" });
  } else {
    userModel.addUser(reqData, function(err, data) {
      if (err || data == null) {
        if (err.errmsg.indexOf("duplicate key") > -1) {
          res.status(400).json({
            apiStatus: "Failure",
            msg: "User with the specified email address already exists."
          });
        } else {
          res
            .status(400)
            .json({ apiStatus: "Failure", msg: "Error while adding the User" });
        }
      } else {
        lib.cleanJson(data, paramsToAvoid, function(data) {
          validatorLib.mapping(data, validatorObj.apiMapping, function(
            results
          ) {
            res.json({
              apiStatus: "success",
              User: results,
              msg: "User is successfully added"
            });
          });
        });
      }
    });
  }
};

exports.updateUser = function(req, res, next) {
  var condition = {
    id: req.params.id
  };
  var option = "";
  var reqData = req.mappedJson;
  if (!_.isUndefined(req.body["apiUserStatus"])) {
    reqData.isApiUser = req.body["apiUserStatus"];
    if (!req.body["apiUserStatus"] && !_.isUndefined(reqData["token"])) {
      delete reqData["token"];
      reqData["$unset"] = { token: "" };
    }
  }
  userModel.updateUser(condition, reqData, option, function(err, updatedUser) {
    if (updatedUser == null || err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while updating the user" });
    } else {
      res.json({ apiStatus: "success", msg: "User is successfully updated" });
    }
  });
};

exports.deleteUser = function(req, res, next) {
  var condition = {
    id: req.params.id
  };
  var selectparams = "";
  userModel.updateUser(
    condition,
    {
      $set: {
        st: 3
      }
    },
    selectparams,
    function(err, user) {
      if (err) {
        res
          .status(400)
          .json({ apiStatus: "Failure", msg: "Error while deleting the user" });
      } else {
        res.json({
          apiStatus: "success",
          msg: "User has been successfully deleted"
        });
      }
    }
  );
};

exports.userLogin = function(req, res, next) {
  if (req.body.username && req.body.password) {
    async.waterfall([
      function(cb) {
        userModel.getUserByEmail(req.body.username, function(err, userDetails) {
          if (err || userDetails == null) {
            res
              .status(403)
              .json({ apiStatus: "Failure", msg: "Invalid credentials" });
          } else {
            cb(null, userDetails);
          }
        });
      },
      function(userDetails, cb) {
        userModel.comparePassword(
          req.body.password,
          userDetails.password,
          function(err) {
            if (err) {
              res
                .status(403)
                .json({ apiStatus: "Failure", msg: "Invalid credentials" });
            } else {
              cb(null, userDetails);
            }
          }
        );
      },
      function(userDetails, cb) {
        userModel.checkUserStatus(userDetails.status, function(err) {
          if (err) {
            res.status(403).json({
              apiStatus: "Failure",
              msg:
                "Your account is inactive. Please contact support@purespectrum.com"
            });
          } else {
            cb(null, userDetails);
          }
        });
      },

      function(userDetails, cb) {
        var auth = { usr_id: userDetails._id };
        authModel.authenticateDecodedToken(userDetails.id, function(err, user) {
          if (err) {
            res.status(400).json({
              apiStatus: "Failure",
              msg: "Auth token could not be generated. Please try again."
            });
          } else {
            if (user != null) {
              authTokenLib.getToken(user, function(token) {
                if (token == null) {
                  res
                    .status(403)
                    .json({ apiStatus: "Failure", msg: "Invalid credentials" });
                } else {
                  userDetails.token = token;
                  cb(null, userDetails);
                }
              });
            } else {
              authModel.addAuth(userDetails.id, function(err, auth) {
                if (auth == null) {
                  res
                    .status(403)
                    .json({ apiStatus: "Failure", msg: "Invalid credentials" });
                } else {
                  //get token from lib/tokenauth.js
                  authTokenLib.getToken(auth, function(token) {
                    if (token == null) {
                      res.status(403).json({
                        apiStatus: "Failure",
                        msg: "Invalid credentials"
                      });
                    } else {
                      userDetails.token = token;
                      cb(null, userDetails);
                    }
                  });
                }
              });
            }
          }
        });
      },
      function(userDetails, cb) {
        var condition = {
          id: userDetails.id
        };
        var option = "";
        var update_json = {
          mod_on: Common.getTimestamp(),
          lastLogin: Common.getTimestamp()
        };
        userModel.updateUser(condition, update_json, option, function(
          err,
          updatedUser
        ) {
          if (updatedUser == null || err) {
            res.status(400).json({
              apiStatus: "Failure",
              msg: "Error " + err + " while updating last login time for user."
            });
          } else {
            res.status(200).json({
              apiStatus: "success",
              token: userDetails.token,
              user: userDetails
            });
          }
        });
      }
    ]);
  } else {
    res.status(403).json({ apiStatus: "Failure", msg: "Invalid credentials" });
  }
};

exports.logoutUser = function(req, res, next) {
  var userId = req.params.id;
  authModel.deleteAuth(userId, function(err, doc) {
    if (doc == null || err) {
      res.status(400).json({
        apiStatus: "Failure",
        msg: "Error while deleting the user from auth_infos collection"
      });
    } else {
      res.json({
        apiStatus: "success",
        msg: "User has been successfully deleted"
      });
    }
  });
};

exports.resetUser = function(req, res, next) {
  var condition = {
    id: req.params.id
  };
  var option = "";
  var userBasics = {
    passwrd: req.body.newpass
  };

  userModel.updateUser(condition, userBasics, option, function(
    err,
    updatedUser
  ) {
    if (updatedUser == null || err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while updating the user" });
    } else {
      res.json({
        apiStatus: "success",
        msg: "User has been successfully updated"
      });
    }
  });
};

exports.userDataFromResetToken = function(req, res) {
  console.log("token value is:::", req.params.resettoken);
  userModel.getUserByResetToken(req.params.resettoken, function(err, data) {
    if (data == null || err) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Invalid Reset Token" });
    } else {
      res.json({
        apiStatus: "success",
        msg: "Success! Please Check Your Email For Reset Instructions",
        result: data
      });
    }
  });
};

exports.getUserToken = (req, res) => {
  var userId = req.params.id;
  userModel.getUserById(userId, (error, user) => {
    if (error) {
      res
        .status(400)
        .json({ apiStatus: "Failure", msg: "Error while getting the user" });
    } else if (user) {
      if (!_.isUndefined(user["token"])) {
        res.status(200).json({ token: user["token"] });
      } else {
        authModel.addAuth(user.id, function(err, auth) {
          if (auth == null) {
            res
              .status(403)
              .json({ apiStatus: "Failure", msg: "Invalid credentials" });
          } else {
            authTokenLib.getToken(auth, function(token) {
              if (token == null) {
                res
                  .status(403)
                  .json({ apiStatus: "Failure", msg: "Invalid credentials" });
              } else {
                updateUserWithToken(token, user, res);
              }
            });
          }
        });
      }
    } else {
      res.status(400).json({ apiStatus: "Failure", msg: "No user found" });
    }
  });
};

const updateUserWithToken = (token, user, res) => {
  let condition = { id: user.id };
  let option = "";
  let update_json = {
    mod_on: Common.getTimestamp(),
    token: token
  };
  userModel.updateUser(condition, update_json, option, function(
    err,
    updatedUser
  ) {
    if (err) {
      res.status(200).json({
        apiStatus: "Failure",
        msg: "Error while updating user with token"
      });
    } else {
      res.status(200).json({ token: token });
    }
  });
};
