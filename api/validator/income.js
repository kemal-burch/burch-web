/*
 Json Schema
 */
module.exports.jsonSchema = {
    "id": "/Income",
    "type": "object",
    "properties": {
        note: { "type": "string"},
        amount: { "type": "number" },
        income_category_id: { "type": "number"},
        user_id : { "type": "number"}
    }
};

module.exports.updatejsonSchema = {
"id": "/Income",
    "type": "object",
    "properties": {
        note: { "type": "string"},
        amount: { "type": "number" },
        income_category_id: { "type": "number"},
        user_id : { "type": "number"}
    }
};


/**
 * mapping db to api attributes
 */

module.exports.apiMapping = {
    "id": "id",
    "note": "note",
    "amount": "amount",
    "income_category_id": "income_category_id",
    "user_id": "user_id"
};


/**
 * mapping api to db attributes
 */

module.exports.dbMapping = {
    "id": "id",
    "note": "note",
    "amount": "amount",
    "income_category_id": "income_category_id",
    "user_id": "user_id"

};

module.exports.commonValidator = require('./common');
