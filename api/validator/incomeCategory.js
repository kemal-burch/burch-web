/*
 Json Schema
 */
module.exports.jsonSchema = {
    "id": "/IncomeCategory",
    "type": "object",
    "properties": {
        name: { "type": "string"}
    }
};

module.exports.updatejsonSchema = {
"id": "/IncomeCategory",
    "type": "object",
    "properties": {
        name: { "type": "string"}
    }
};


/**
 * mapping db to api attributes
 */

module.exports.apiMapping = {
    "id": "id",
    "name": "name"
};


/**
 * mapping api to db attributes
 */

module.exports.dbMapping = {
    "id": "id",
    "name": "name"

};

module.exports.commonValidator = require('./common');
