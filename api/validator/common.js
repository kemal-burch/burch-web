
module.exports.statusSchema = {
    "id": "/Status",
    "type": "object",
    "properties": {
        status: { "type": "number", "required": true,"enum":[0,1] }
    }
};