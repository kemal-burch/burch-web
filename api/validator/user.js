/*
 Json Schema
 */
module.exports.jsonSchema = {
    "id": "/User",
    "type": "object",
    "properties": {
        username: { "type": "string"},
        first_name: { "type": "string" },
        surname: { "type": "string"},
        email : { "type": "string","maxLength":100},
        password : { "type": "string"},
        address: { "type": "string" },
        phone: { "type": "string" },
        status: { "type": "number", "enum":[0,1,2,3] },//{0:New, 1:Active, 2:Paused, 3:Deleted}
        lastLogin: { "type": "number"  }
    }
};

module.exports.updatejsonSchema = {
"id": "/User",
    "type": "object",
    "properties": {
        username: { "type": "string"},
        first_name: { "type": "string" },
        surname: { "type": "string" },
        email : { "type": "string" ,"maxLength":100},
        address: { "type": "string" },
        phone: { "type": "string" },
        status: { "type": "number", "enum":[0,1,2,3] },//{0:New, 1:Active, 2:Paused, 3:Deleted}
        lastLogin: { "type": "number"  }       
    }
};


/**
 * mapping db to api attributes
 */

module.exports.apiMapping = {
    "id": "id",
    "username": "username",
    "first_name": "first_name",
    "surname": "surname",
    "email": "email",
    "password": "password",
    "phone": "phone",
    "status": "status",
    "lastLogin": "lastLogin",
    "token": "token"
};


/**
 * mapping api to db attributes
 */

module.exports.dbMapping = {
     "id": "id",
    "username": "username",
    "first_name": "first_name",
    "surname": "surname",
    "email": "email",
    "password": "password",
    "phone": "phone",
    "status": "status",
    "lastLogin": "lastLogin",
    "token": "token"
};

module.exports.commonValidator = require('./common');
