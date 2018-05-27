/*
 Json Schema
 */
module.exports.jsonSchema = {
    "id": "/Expense",
    "type": "object",
    "properties": {
        note: { "type": "string"},
        amount: { "type": "number" },
        expense_category_id: { "type": "number"},
        user_id : { "type": "number"}
    }
};

module.exports.updatejsonSchema = {
"id": "/Expense",
    "type": "object",
    "properties": {
        note: { "type": "string"},
        amount: { "type": "number" },
        expense_category_id: { "type": "number"},
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
    "expense_category_id": "expense_category_id",
    "user_id": "user_id"
};


/**
 * mapping api to db attributes
 */

module.exports.dbMapping = {
    "id": "id",
    "note": "note",
    "amount": "amount",
    "expense_category_id": "expense_category_id",
    "user_id": "user_id"

};

module.exports.commonValidator = require('./common');
