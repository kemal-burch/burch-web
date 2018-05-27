/**
 * Model gives common functions that are used in other models.The auditing of database operations are performed in this module
 * @module models/db_model
 * @type {connectionInstance|exports}
 */
var dbObj = require('./../lib/mongoconnection');
var dbConstants = require('./../config/db_constants');
var Hashids = require("hashids");
 hashids = new Hashids("purespectrum",6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');
var Common         = new (require('../helpers/Common'))();

var pagination = require('mongoose-paginate');
var mongoose = require('mongoose');

var counterSchema = {
    _id: { type: String, required: true },
    seq: { type: Number, required: true }
};
var auditSchema = {
    action: { type: String, required: true },
    data: { type: Object, required: false },
    coln: { type: String, required: true },
    cond: { type: Object, required: false},
    userId: { type: Number, required: true },
    userType: { type: String, required: true },
    crtd_on: {type: Date, default: Date.now}
};
//auto increment counter
var counterSchemaObj = mongoose.Schema(counterSchema,{collection:"counters"});
var counterObj = mongoose.model("counters", counterSchemaObj);
//audit
var auditSchemaObj = mongoose.Schema(auditSchema,{collection:"audit"});
var auditObj = mongoose.model("audit", auditSchemaObj);

/**
 * Function to creates an object of the collection
 * @param collection {String} the collection name
 * @param DBSchema {JSON_obj} the schema definition
 * @param counter {int} the counter for index
 * @param writeConcern {int} the write concern
 */
module.exports = function(collection, DBSchema, counter,writeConcern, strict){
    var options = {collection:collection};

    if(strict == false){
        options.strict = strict;
    }
    /*if(writeConcern == true){
        var safe = { w: "majority", wtimeout: 5000 };
        options.safe = safe;
    }*/
    
    this.accessSchema = mongoose.Schema(DBSchema,options);
    this.accessSchema.plugin(pagination);
    this.collectionObj = dbObj.model(collection, this.accessSchema);
    this.collectionName = collection;
    this.accessSchema.pre('save', function preSave(next){
        var recordObj= this;
        recordObj.mod_on=Common.getTimestamp();
        next();
    });


    /**
     * Function returns all the documents of the collection
     * @param selectParams {JSON_obj} list of fields to be returned. If blank, all fields will be passed.
     * @param cb {String} the callback function
     */
    this.getAll = function(selectParams, cb) {
        var query = this.collectionObj.find();
        if(selectParams) {
            query.select(selectParams);
        }
        query.lean().exec(function (err, docs) {
            cb(err, docs)
        })
    };

    /**
     * Function finds a list using group by
     * @param conditions {JSON_obj} the condition to be passed for grouping and where conditions
     * @param cb {String} the callback function
     */
    this.getAggregate = function(conditions, cb) {
        //console.log("\n\n getAggregate ")
        //console.log("\n\n consditions ", JSON.stringify(conditions));
        var aggregation = this.collectionObj.aggregate(conditions);
        aggregation.options = { allowDiskUse: true };
        // if(readPreference) {
        //     aggregation.read("secondary");
        // }
        aggregation.exec(function(err, docs) {
            //console.log('\n\n\n error', JSON.stringify(err));
            //console.log('\n\n\n docs', JSON.stringify(docs));
            cb(err, docs)
        });
    };

    /**
     * Function finds a document in the collection using its id
     * @param objId {String} object id of the document to fetch
     * @param cb {String} the callback function
     */
    this.findById = function(objid, selectparams, cb) {
        var query = this.collectionObj.findById(objid);
        if(selectparams) {
            query.select(selectparams);
        }
        query.lean().exec(function (err, docs) {
                cb(err, docs)
            }
        )
    };

    /**
     * Function finds a document in the collection using its auto increment id
     * @param id {int} id of the document to fetch
     * @param cb {String} the callback function
     */
    this.findByAutoId = function(id,selectparams,cb){
        var conditions = {id:id};
        var query = this.collectionObj.findOne(conditions);
        if(selectparams) {
            query.select(selectparams);
        }
        query.lean().exec(function (err, docs) {
                cb(err, docs);
            }
        )
    };

    /**
     * Finds a single document in the collection using criteria passed
     * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
     * @param selectparams {string} the select parameters 'usr_id email'
     * @param cb {String} the callback function
     */
    this.findOne = function(conditions, selectparams, cb, pref) {
        var query = this.collectionObj.findOne(conditions);
        
        if(pref != undefined && pref != null && pref.sp) {
            query = query.read('sp');
        }

        if(selectparams) {
            query.select(selectparams);
        }
        query.lean().exec(function (err, docs) {
                cb(err, docs);
            }
        )
    };

    /**
     * Finds  document by the criteria passed and the limit from the database
     * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
     * @param selectparams {String} the select parameters 'usr_id email'
     * @param limit {int} the limit to decide row count, default
     * @param sort {JSON_obj} the sorting attributes
     * @param cb {String} the callback function
     */
    this.find = function(conditions, selectparams, limit, sort, cb, pref, hint) {
        var query = this.collectionObj.find(conditions);
        if(pref && pref != undefined && pref != null && pref.sp) {
            query = query.read('sp');
        }

        if(limit){
            query.limit(limit);
        }
        if(sort) {
            query.sort(sort);
        }
        if(selectparams) {
            query.select(selectparams);
        }
        if(hint) {
            query.hint(hint);
        }
        query.lean().exec(function (err, docs) {
                cb(err, docs);
            }
        )
    };

  /**
     * Finds  document by the criteria passed and the limit from the database
     * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
     * @param selectparams {String} the select parameters 'usr_id email'
     * @param limit {int} the limit to decide row count, default
     * @param skip {int} the skip to skip number of result 
     * @param sort {JSON_obj} the sorting attributes
     * @param cb {String} the callback function
     */
    this.findWithSkip = function(conditions, selectparams, limit, sort, skip, cb, pref) {
        var query = this.collectionObj.find(conditions);
        if(pref != undefined && pref != null && pref.sp) {
            query = query.read('sp');
        }
        if(limit){
            query.limit(limit);
        }
        if(sort) {
            query.sort(sort);
        }
        if(skip) {
            query.skip(( skip-1 ) * limit);
        }
        if(selectparams) {
            query.select(selectparams);
        }
        query.lean().exec(function (err, docs) {
                cb(err, docs);
            }
        )
    };



    /**
     * Function to get records for paginations using the from and to fields
     * @param obj {JSON_obj} the condition for select
     * @param newObj {JSON_obj} the fields to select
     * @param sort {JSON_obj} the sort parameters
     * @param from {String} the field to find from
     * @param to {String} the fielld to find till
     * @param cb {String} the callback function
     */
    this.findLimited = function(condition, selectparams, limit, sort, page,cb, pref){
        var query = this.collectionObj.find(condition);

        /*if(sort) {
            query.sort(sort);
        }
        if(selectparams) {
            query.select(selectparams);
        }
         */
        if(pref != undefined && pref != null && pref.sp) {
            query = query.read('sp');
        }

        this.collectionObj.paginate(query, {select : selectparams , sort : sort, lean : true, offset : page, limit: limit }, function(err, docs, total) {
            //console.log('total: ', total, 'docs: ', docs)
            cb(err,total,docs);
        });
    };

    /**
     * Function to get records by criteria from collection
     * @param obj {JSON_obj} the condition for select
     * @param newObj {JSON_obj} the fields to select
     * @param sort {JSON_obj} the sort parameters
     * @param cb {String} the callback function
     */
    this.findLimited1 = function(obj, newObj, limit, sort, cb){
        var condition1 = "", condition = "";
        if(newObj.sortValue && newObj.sortValueId) {
            var a = newObj.sortBy;
            var b = {};
            var c = {};
            c[a] = newObj.sortValue;

            var selParams = newObj.selectParams;
            if(sort[a] == -1) {
                b[a] = {$lt: newObj.sortValue};
                condition1 = {$or: [b, selParams, {$and: [c, {"id": {$lt: newObj.sortValueId}}]}]}, selParams;
            } else {
                b[a] = {$gt: newObj.sortValue};
                condition1 = {$or: [b, selParams, {$and: [c, {"id": {$gt: newObj.sortValueId}}]}]}, selParams;
            }
            condition = {$and: [condition1, obj]};
        } else {
            condition = obj;
        }
        var query = this.collectionObj.find(condition);
        //obj = {$or:[sortBy:{$gt:sortValue}}, {selectParams},{$and:[{sortBy:sortValue},{"id":{$gt:sortValueId}}]}]},{selectParams})};
        //db.jobs.find({$or:[{"nm":{$gt:"Coke Study 1"}}, {"id":1,"nm":1},{$and:[{"nm":"Coke Study 1"},{"id":{$gt:41}}]}]},{"id":1,"nm":1}).sort({"nm":1, "id":1}).limit(2)

        if(sort) {
            query.sort(sort);
        }
		if(limit){
            query.limit(limit);
        }
        if(newObj.selectParams) {
            query.select(newObj.selectParams);
        }
        query.lean().exec(function (err, docs) {
            var total = 0;
            if(err) {
                err.message = "No matching records";
            }
            if(docs.length > 0) {
                total = docs.length;
            }
            console.log('total: ', total, 'docs: ', docs);
            cb(err, total, docs);
        });
    };

    /**
     * Function to get total search count
     * @param condition {JSON_obj} the search condition
     * @param selectParams {JSON_obj} the selected parameters
     * @param cb {String} the callback function
     */
    this.findSearchCount = function(condition, selectParams, cb) {

        var query = this.collectionObj.find(condition);
        if(selectParams) {
            query.select(selectParams);
        }
        query.lean().exec(function (err, docs) {
            var total = 0;
            if(err) {
                err.message = "No matching records";
            }
            if(docs.length > 0) {
                total = docs.length;
            }
            console.log('total: ', total, 'docs: ', docs);
            cb(err, total, docs);
        });
    };

    /**
     * Function creates a document, inserts a document in the collection with autoincrement id
     * @param data {JSON_obj} the object data to be inserted
     * @param cb {String} the callback function
     */
    this.create = function(data, cb) {
        var conn = this.collectionObj;
        var colnName = this.collectionName;
        if(counter == true) {
            this.getNextSequence(this.collectionName, function (err2, output) {
                data.id = output.seq;
                if(colnName =='surveys'){
                    data.encrypt_id = hashids.encode(data.id);

                }
                insertRec(conn, data, function (err, obj) {
                    if(obj){
                        // addAudit(colnName, data, "", dbConstants.action.insert, function(e, o) {
                        //     if(o){
                        //        // console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                        //     } else {
                        //        // console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                        //     }
                        // });
                    }
                    cb(err, obj);
                });
            });
        }
        else{
            insertRec(conn, data, function (err, obj) {
                if(obj){
                    // addAudit(colnName, data, "", dbConstants.action.insert, function(e, o) {
                    //     if(o){
                    //        // console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    //     } else {
                    //        // console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    //     }
                    // });
                }
                cb(err, obj);
            });
        }
    };

    /**
     * Function to creates a document, inserts a document in the collection
     * @param conn {JSON_obj} the collection object
     * @param data {JSON_obj} the object data to be inserted
     * @param cb {String} the callback function
     */
    insertRec = function(conn,data,cb){
        var newRecord =   conn(data);
        newRecord.save(function (err, obj) {
            if(obj){
                var leanObject = obj.toObject();
                leanObject.schema = null;
            }
            cb(err, leanObject);
        });
    }

    /**
     * Function to get a particular document
     * @param req {Object} the request parameters
     * @param res {Object} the response parameter
     */
    this.get = function(req, res) {

    };

    /**
     * Function to updates a document
     * @param conditions {JSON_obj} containing the where clause
     * @param update {JSON_obj} contains the values to be set
     * @param options {JSON_obj} can contain such as {upsert:true}
     * @param cb {String} the callback function
     */
    this.update = function(conditions, update, options, cb) {
        var colnName = this.collectionName;
        if(!update.mod_on) {
             update.mod_on = Common.getTimestamp();
        }
        this.collectionObj.update(conditions, update, options, function(err, docs){
            if(docs){
                // addAudit(colnName, update, conditions, dbConstants.action.update, function(e, o) {
                //     if(o){
                //        // console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                //     } else {
                //        // console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                //     }
                // });
            }
            cb(err, docs);
        });
    };

    /**
     * Function to delete a document
     * @param conditions {JSON_obj}containing where clause
     * @param cb {String} the callback function
     */
    this.delete = function(conditions, cb) {
        var colnName = this.collectionName;
        this.collectionObj.remove(conditions, function (err, resp) {
            if(resp) {
               
            }
            cb(err, resp);
        });
    };

    /**
     * Function to soft delete a document by changing status
     * @param conditions {JSON_obj} containing where clause
     * @param cb {String} the callback function
     */
    this.softDelete = function(conditions, cb) {
        var update = {st:dbConstants.status.Deleted}; update.mod_on = Common.getTimestamp();
        this.collectionObj.update(conditions,update,'', function (err, resp) {
            cb(err, resp);
        });
    };

    /**
     * Function to soft delete a document by changing status by using Id
     * @param Id {String} containing object Id
     * @param cb {String} the callback function
     */
    this.softDeleteById = function(Id, cb) {
        var update = {st:dbConstants.status.Deleted}; update.mod_on = Common.getTimestamp();
        this.collectionObj.findByIdAndUpdate(Id, update, function (err, resp) {
            cb(err, resp);
        });
    };

    /**
     * Function to soft delete a document by changing status by using auto increment Id
     * @param Id {String} containing auto increment Id
     * @param cb {String} the callback function
     */
    this.softDeleteByAutoId = function(Id, cb) {
        var update = {st:dbConstants.status.Deleted}; update.mod_on = Common.getTimestamp();
        var condition = {id : Id};
        this.collectionObj.findOneAndUpdate(condition, update, function (err, resp) {
            cb(err, resp);
        });
    };

    /**
     * Function finds document by id and updates doc
     * @param Id {String} containing object Id
     * @param update {JSON_obj} contains the set parameters
     * @param {JSON_obj} options include:
     * new: bool - true to return the modified document rather than the original. defaults to true
     * upsert: bool - creates the object if it doesn't exist. defaults to false.
     * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
     * select: sets the document fields to return
     * @param cb {String} the callback function
     */
    this.findByIdAndUpdate = function(Id, update, options, cb){
        var colnName = this.collectionName; update.mod_on = Common.getTimestamp();
        this.collectionObj.findByIdAndUpdate(Id, update, options, function (err, resp) {
            if(resp){
                var leanObject = resp.toObject();
                leanObject.schema = null;

                addAudit(colnName, update, {"_id":Id}, dbConstants.action.update, function(e, o) {
                    if(o){
                      //  console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    } else {
                      //  console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    }
                });
            }
            cb(err, leanObject);
        });
    };

    /**
     * Function finds document by Id and updates doc
     * @param Id {String} containing object Id
     * @param update {JSON_obj} contains the set parameters
     * @param {JSON_obj} options include:
     * new: bool - true to return the modified document rather than the original. defaults to true
     * upsert: bool - creates the object if it doesn't exist. defaults to false.
     * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
     * select: sets the document fields to return
     * @param cb {String} the callback function
     */
    this.findByAutoIdAndUpdate = function(Id, update, options, cb){
        var conditions = {id:Id};  update.mod_on = Common.getTimestamp();
        var colnName = this.collectionName;
        this.collectionObj.findOneAndUpdate(conditions, update, options, function(err, resp){
            if(resp){
                var leanObject = resp.toObject();
                leanObject.schema = null;

                addAudit(colnName, update, conditions, dbConstants.action.update, function(e, o) {
                    if(o){
                      //  console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    } else {
                      //  console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                    }
                });
            }
            cb(err, leanObject);

        });
    };

    /**
     * Function finds document by id and updates document
     * @param conditions {JSON_obj} the condition for selection criteria
     * @param update {JSON_obj} contains the set parameters
     * @param options {JSON_obj}  include:
     * new: bool - true to return the modified document rather than the original. defaults to true
     * upsert: bool - creates the object if it doesn't exist. defaults to false.
     * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
     * select: sets the document fields to return
     * @param cb {String} the callback function
     */
    this.findOneAndUpdate = function(conditions, update, options, cb){
        var colnName = this.collectionName;  update.mod_on = Common.getTimestamp();
        this.collectionObj.findOneAndUpdate(conditions, update, options, function(err, resp){
            if(resp){
                var leanObject = resp.toObject();
                leanObject.schema = null;
            }
            cb(err, leanObject);
        });
    };

    /**
     * get next sequence gets the next sequence id from counter collection
     * @param collection {String} name of the collection
     * @param callback {String} the callback function
     */

    this.getNextSequence = function(collection,callback){
        counterObj.findOneAndUpdate({ _id: collection }, { $inc: { seq: 1 } }, {new: true, upsert: true}, function (err, docs) {
            if (err) throw err;
            callback(err, docs)
        });
    };
    /**
     * Function to audit the action
     * @param coln {String} Collection updated
     * @param data {JSON_obj} Data sent in request
     * @param cond {JSON_obj} condition (for update/delete)
     * @param action {String} Action performed (Insert/update/delete)
     * @param cb {String} the callback function
     */
    addAudit = function(coln, data, cond, action, cb){
        //create the object to add
        var body = {};
        body.coln = coln;
        body.data = data;
        body.cond = cond;
        body.action = action;
        if(global.objectOfRequest) {
            body.userId = global.objectOfRequest.usr_id;
            body.userType = global.objectOfRequest.usr_type;
        }
        insertRec(auditObj, body, function (err, obj) {
            cb(err, obj);
        });
    };
    /**
     * to get the sub document of a clollection
     * @param1 match {JSON_obj} eliminates parents with no children
     * @param2 unwind {String} considers useful documents
     * @param3 match2 {JSON_obj} removes $unwind output that doesn't match,
     * @param callback {String} the callback function
     */
    this.aggregate = function(match,unwind,match2,callback){
        this.collectionObj.aggregate(
            { $match: match },
            { $unwind :unwind},
            { $match: match2 },function (err, docs) {
                if (err) throw err;
                callback(err, docs)
            });
    };
    
    this.fields_aggregate = function(match,group,callback){
        this.collectionObj.aggregate(
            [{ $match: match },
            { $group :group}],function (err, docs) {
                if (err) throw err;
                callback(err, docs)
            });
    };

    /**
     * get count
     * @param condition {JSON_obj} where conditions
     * @param callback {String} the callback function
     */
    this.getCount = function(condition, callback, pref){
        var query = this.collectionObj.count(condition);
        if(pref != undefined && pref != null && pref.sp) {
            query = query.read('sp');
        }
        query.lean(true).exec(function (err, count) {
                if (err) throw err;
                callback(err, count);
            }
        );
        /*this.collectionObj.count(condition,function(err,count){
            if (err) throw err;
            callback(err, count);
        });*/
    };

    this.findStream = function(conditions, selectparams, limit, sort, cb) {
        var query = this.collectionObj.find(conditions);
        if(limit){
            query.limit(limit);
        }
        if(sort) {
            query.sort(sort);
        }
        if(selectparams) {
            query.select(selectparams);
        }
        query.lean(true);

        var modelStream = query.cursor();
        cb(false,modelStream);
    };

    /**
     * Function to insert multiple document
     * @param data {Array} contains values to be insert
     * @param cb {String} the callback function
     */
    this.insertMany = function(data, cb) {
        var colnName = this.collectionName;

        this.collectionObj.insertMany(data, function(err, docs){
            if(docs){
                addAudit(colnName, data, "", dbConstants.action.insert, function(e, o) {
                        if(o){
                           // console.log("Audit done for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                        } else {
                           // console.log("Audit failed for "+ colnName + " by " + global.objectOfRequest.usr_id + "("+ global.objectOfRequest.usr_type + ")");
                        }
                    });
            }
            cb(err, docs);
        });
    };

    /**
     * Function to get distinct values
     * @param field key to be distinct
     * @param conditions
     * @param cb
     */
    this.distinct = function (field, conditions, cb) {
        var query = this.collectionObj.distinct(field, conditions);

        query.lean().exec(function (err, docs) {
            cb(err, docs);
        });
    };
};



