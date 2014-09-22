/**
 * @list dependencies
 */

var extend = require('extend'),
    shortID = require('shortid'),
    mongoose = require('mongoose'),
    Promise = require('native-or-bluebird'),
    Asset = require('../models/Asset');

/**
 * @configure shortID for Murica
 */

shortID.seed(74.1776);


/**
 * @method connect
 * @param {String} mongdb Mongo DB String to connect to
 */

exports.connect = function(mongodb) {
    mongoose.connect(mongodb);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        // console.log('Mongoose default connection open to ' + mongodb);
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {
        console.error('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        // console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            // console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    exports.connection = mongoose.connection;
};

/**
 * @method generate
 * @param {Object} options Must at least include a `url` attribute
 */

exports.generate = function(document) {
    return new Promise(function (resolve, reject) {
        var generatePromise,
            generatedHash = shortID.generate(),
            query = { url : document.url };
        document['hash'] = generatedHash;
        document['data'] = (document.data) ? document.data : null;
        generatePromise = Asset.findOrCreate(query, document, {});
        generatePromise.then(function (AssetObject) {
            resolve(AssetObject);
        }, function (error) {
            reject(error, true);
        });
    });
};

/**
 * @method retrieve
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.retrieve = function(hash) {
    return new Promise(function (resolve, reject) {
        var query = { hash : hash },
            update = { $inc: { hits: 1 } },
            options = { multi: true };
        var retrievePromise = Asset.findOne(query);
        Asset.update( query, update , options , function (){ } );
        retrievePromise.then(function (AssetObject) {
            if (AssetObject && AssetObject !== null) {
                resolve(AssetObject);
            } else {
                reject(new Error('Could not find document matching hash ' + hash), true);
            };
        }, function (error) {
            reject(error, true);
        });
    });
};

/**
 * @method hits
 * @param {Object} options Must at least include a `hash` attribute
 */

exports.hits = function(hash) {
    return new Promise(function (resolve, reject) {
        var query = { hash : hash },
            options = { multi: true };
        var retrievePromise = Asset.findOne(query);
        Asset.update(query, update, options, function () {});
        retrievePromise.then(function (AssetObject) {
            if (AssetObject && AssetObject !== null) {
                resolve(AssetObject.hits);
            } else {
                reject(new Error('Could not find document matching hash ' + hash), true);
            };
        }, function (error) {
            reject(error, true);
        });
    });
};

/**
 * @method list
 * @description List all Assets
 * @param {Object} options Should include `page` and `size` properties
 */

exports.list = function(options) {
    return new Promise(function (resolve, reject) {
        var query = {};
        var projection = null;
        var defaultOpts = {
            limit: 20,
            skip: 0,
            sort: { 'data.name': 1 }
        };
        var opts;
        if (options && options.page && options.size) {
            opts = extend(defaultOpts, {
                limit: options.size,
                skip: (options.page - 1) * options.size
            });
        }
        var listPromise = Asset.find(query, projection, opts);
        listPromise.then(function (AssetObjects) {
            resolve(AssetObjects);
        }, function (error) {
            reject(error, true);
        });
    });
};
