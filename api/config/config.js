var path = require("path");

exports.ENV = process.env.NODE_ENV || "development";

exports.MONGO_HOST ="burch:burch123@ds237610.mlab.com:37610"
exports.MONGO_PORT = process.env.NODE_MONGO_PORT || 27017;
exports.MONGO_DBNAME = "burch-web"
exports.MONGO_USERNAME = "";
exports.MONGO_PASSWORD = "";
exports.MONGO_LOG_VERBOSE = true;
exports.FRONTEND_APP_PORT = process.env.NODE_FRONTEND_APP_PORT || 8000;
exports.FRONTEND_BASE_URL =
  process.env.NODE_ENV == "production"
    ? process.env.NODE_FRONTEND_APP_HOST
    : (process.env.NODE_FRONTEND_APP_HOST || "http://localhost") +
      ":" +
      (process.env.NODE_FRONTEND_APP_PORT || "8000");
exports.APP_PORT = process.env.NODE_APP_PORT || 3000;
exports.APP_HOST = process.env.NODE_APP_HOST || "http://localhost";
exports.APP_BASE_URL =
  process.env.NODE_ENV == "production"
    ? process.env.NODE_APP_HOST
    : (process.env.NODE_APP_HOST || "http://localhost") +
      ":" +
      (process.env.NODE_APP_PORT || 3000);
exports.LOGDB_MONGO_HOST = "localhost";
exports.LOGDB_MONGO_PORT = 28000;
exports.LOGDB_MONGO_DBNAME = "expense_tracker_log";
exports.LOGDB_MONGO_USERNAME = "";
exports.LOGDB_MONGO_PASSWORD = "";
exports.LOGDB_MONGO_ACCESSLOG = "accessLog";
exports.LOGDB_MONGO_ERRORLOG = "errorLog";

//Define level of error (values: debug,info,error,warn)
exports.ERROR_LEVEL_DEBUG = "debug";
exports.ERROR_LEVEL_INFO = "info";
exports.ERROR_LEVEL_ERROR = "error";
exports.ERROR_LEVEL_WARN = "warn";
exports.ERROR_TRANSPORT = ["file", "mongodb", "console"];
exports.ERROR_TRANSPORT_LOG_FILE_PATH = "app.log";

exports.SECRETTOKEN = process.env.NODE_ENV || "production";
exports.USER = process.env.NODE_USER || "user";

exports.EMAIL_ENABLED = process.env.NODE_EMAIL_ENABLED || false;

exports.DISPLAY_TZ = "America/Los_Angeles";
