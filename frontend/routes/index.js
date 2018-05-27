var indexController = require("./../controllers/index");

module.exports.set = function(appObj) {
  appObj.get("/", indexController.index);
};
