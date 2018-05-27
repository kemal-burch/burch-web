var config = require("./../config/config");
var request = require("request");
var http = require("http");
var moment = require("moment");
var momentTimeZone = require("moment-timezone");
var _ = require("underscore");

function Common() {}

Common.prototype.httpRequest = function(
  host,
  port,
  path,
  formData,
  headers,
  method,
  cb
) {
  console.log("\n\n\n httpRequest called ", path);
  // Build the post string from an object
  var post_data = formData;
  if (formData && "string" !== typeof formData) {
    post_data = JSON.stringify(formData);
  }

  if (headers && !headers.hasOwnProperty("Content-Type")) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  if (headers && !headers.hasOwnProperty("Content-Length") && post_data) {
    headers["Content-Length"] = Buffer.byteLength(post_data);
  }

  if (!method) {
    method = "POST";
  }
  console.log("headers ", headers);
  var responseData = "";
  // An object of options to indicate where to post to
  var post_options = {
    host: host,
    port: port.toString(),
    path: path,
    method: method,
    headers: headers
  };
  // Set up the request
  var post_req = http.request(post_options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(data) {
      responseData += data;
    });

    res.on("end", function() {
      console.log("\n\n responseData ", path);
      //console.log(responseData);
      //console.log(typeof responseData);
      if (typeof responseData == "string") {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          return cb(e);
        }
      }
      cb(null, responseData);
    });

    res.on("error", function(error) {
      console.log("error in postRequest", error);
      cb(error);
    });
  });

  // post the data
  post_req.end(post_data);
};

/*
 * function to call get api using request npm module
 * param: @api_path here to call api 
 * @return cb {Obj} callback function for async function(error, hostInfo)
 */
Common.prototype.getRequest = function(path, headers, callback) {
  http.get(
    {
      host: "localhost",
      port: config.APP_PORT.toString(),
      path: path,
      headers: headers
    },
    function(response) {
      // Continuously update stream with data
      var body = "";
      response.on("data", function(d) {
        body += d;
      });
      response.on("end", function() {
        if (typeof body === "string") {
          body = JSON.parse(body);
        }
        // Data reception is done, do whatever with it!
        callback(null, body);
      });
      response.on("error", function(error) {
        console.log("error in getRequest", JSON.stringify(error));
        callback(error);
      });
    }
  );
};

/*
 * function to call POST/PUT api request
 * param: @api_path here to call api 
 * param: @formData {Obj} post data payload
 * param: @headers {Obj} header containing access token etc.
 * @return cb {Obj} callback function for async function(error, hostInfo)
 */
Common.prototype.postRequest = function(path, formData, headers, method, cb) {
  // Build the post string from an object
  var post_data = formData;
  if (formData && "string" !== typeof formData) {
    post_data = JSON.stringify(formData);
  }

  if (headers && !headers.hasOwnProperty("Content-Type")) {
    headers["Content-Type"] = "application/json";
  }
  if (headers && !headers.hasOwnProperty("Content-Length") && post_data) {
    headers["Content-Length"] = Buffer.byteLength(post_data);
  }

  if (!method) {
    method = "POST";
  }

  var responseData = "";
  // An object of options to indicate where to post to
  var post_options = {
    host: "localhost",
    port: config.APP_PORT.toString(),
    path: path,
    method: method,
    headers: headers
  };
  // Set up the request
  var post_req = http.request(post_options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(data) {
      responseData += data;
    });

    res.on("end", function() {
      console.log("\n\n responseData typeof ", typeof responseData);
      //console.log(responseData);
      if (typeof responseData === "string") {
        //responseData = JSON.parse(responseData);
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          return cb(e);
        }
      }
      cb(null, responseData);
    });

    res.on("error", function(error) {
      console.log("error in postRequest", JSON.stringify(error));
      cb(error);
    });
  });

  // post the data
  post_req.end(post_data);
};

/** function to get Timestamp from timezone and timestamp params
 * * @param timezone String (optional), timestamp Number (optional)
 * * @return timestamp
 * */
Common.prototype.getTimestamp = function(timestamp, timezone) {
  var ts = moment.utc().format("x");
  if (
    (timezone == undefined || timezone == null) &&
    (timestamp != undefined && timestamp != null)
  )
    ts = moment(timestamp)
      .utc()
      .format("x");
  if (
    timezone != undefined &&
    timezone != null &&
    (timestamp == undefined || timestamp == null)
  )
    ts = moment()
      .tz(timezone)
      .format("x");
  if (
    timezone != undefined &&
    timezone != null &&
    (timestamp != undefined && timestamp != null)
  )
    ts = moment(timestamp)
      .tz(timezone)
      .format("x");
  return parseInt(ts);
};

/*
*function to get timestam from date parameter
*@param date String
*@return timestamp
*/
Common.prototype.dateToTimestamp = function(dateStr) {
  var ts = moment().valueOf();
  if (dateStr != undefined || dateStr != null) {
    ts = moment(dateStr).valueOf();
  }
  return ts;
};

/**
 * Simple function to log messages to console
 * Common.log('Everything started properly.', 'INFO');
 * Common.log('Running out of memory...','WARN');
 * Common.log({ error: 'Something Broke'},'ERROR');
 */

Common.prototype.log = function(message, level) {
  var levels = ["ERROR", "WARN", "INFO"];
  var level = level ? level : "INFO";
  if (levels.indexOf(level) !== -1) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }
    console.log(level + ": " + message);
  }
};

String.prototype.trimSpace =
  String.prototype.trimSpace ||
  function() {
    var reg = new RegExp(" ", "g"); //<< just look for a space.
    return this.replace(reg, "").toUpperCase();
  };

Number.prototype.between = function(a, b, inclusive) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};

/*
 *function to send the api response.
 *@param err {Object} error data.
 *@param res {Object} send the data to a request.
 *@param result {Object} send to be send into response.
 */
Common.prototype.apiResponse = function(err, res, result) {
  if (err) {
    res.status(err.apiSt).json({ apiStatus: err.apiStatus, msg: err.msg });
  } else {
    res
      .status(result.apiSt)
      .json({ apiStatus: result.apiSt, result: result.data });
  }
};

Common.prototype.validJson = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

Common.prototype.getProtocol = function(req) {
  var proto = req.connection.encrypted ? "https" : "http";
  // only do this if you trust the proxy
  proto = req.headers["x-forwarded-proto"] || proto;
  return proto.split(/\s*,\s*/)[0];
};

Common.prototype.chunk = function(array, size) {
  size = Math.max(size, 0);
  var length = array === null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0;
  var resIndex = 0;
  var result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = this.slice(array, index, (index += size));
  }
  return result;
};

Common.prototype.slice = function slice(array, start, end) {
  var length = array === null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start === null ? 0 : start;
  end = end === undefined ? length : end;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : (end - start) >>> 0;
  start >>>= 0;

  var index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
};

module.exports = Common;
