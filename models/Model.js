/**
 * @list dependencies
 */

var Promise = require('bluebird');

/**
 * @description wrapper for models to return promises versus executing immediately
 */

var Model = function(mongooseModel) {
  this.baseModel = mongooseModel;
};

/**
 * @method find
 * @description wraps mongodb find with a promise
 */

Model.prototype.find = function(query, fields, options) {
  return new Promise(function (resolve, reject) {
    this.baseModel.find(query, fields, options, function(error, result) {
      if (error) {
        reject(error, true);
      } else {
        resolve(result);
      };
    });
  }.bind(this));
};

/**
 * @method findOne
 * @description wraps mongodb findOne with a promise
 */

Model.prototype.findOne = function(query, fields, options) {
  return new Promise(function (resolve, reject) {
    this.baseModel.findOne(query, fields, options, function(error, result) {
      if (error) {
        reject(error, true);
      } else {
        resolve(result);
      };
    });
  }.bind(this));
};

/**
 * @method update
 * @description wraps mongodb update with a promise
 */

Model.prototype.update = function(query, document, options) {
  return new Promise(function (resolve, reject) {
    this.baseModel.update(query, document, options, function(error, affected) {
      if (error) {
        reject(error, true);
      } else {
        if (affected === 0) {
          reject(new Error('MongoDB - Cannot find Document'), true);
        } else {
          resolve();
        };
      };
    });
  }.bind(this));
};

/**
 * @method create
 * @description wraps mongodb create with a promise
 */

Model.prototype.create = function(data) {
  return new Promise(function (resolve, reject) {
    this.baseModel.create(data, function(error, result) {
      if (error) {
        if (error.message && error.message.match(/E11000/i)) {
          reject(new Error('Duplicate Key Error'), true);
        } else {
          reject(error, true)
        };
      } else {
        resolve(result);
      };
    });
  }.bind(this));
};

/**
 * @method findOrCreate
 * @description searches for a document, otherwise creates it.
 */

Model.prototype.findOrCreate = function(query, document, options) {
  return new Promise(function (resolve, reject) {
    var baseModel = this;
    baseModel.findOne(query, function(error, result) {
      if (error) {
        if (error.message && error.message.match(/E11000/i)) {
          reject(new Error('Duplicate Key Error'), true);
        } else {
          reject(error, true);
        };
      } else {
        if (result && result !== null) {
          resolve(result);
        } else {
          var createPromise = baseModel.create(document);
          createPromise.then(function(result) {
            resolve(result);
          }, function(error) {
            reject(error, true);
          });
        }
      };
    });
  }.bind(this));
};

module.exports = Model;
