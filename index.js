var persist = require('./lib/persist');

/**
 * @param String db MongoDB connection string
 * @param Array data
 * @return promise
 * This module makes use of the node-promise API.
 * Operate on the singular result argument passed to a `then` callback, as follows:
 *
 * persist(db, data).then(function (result) {
 *   // Operate on the mongodb documents
 * }, function (error) {
 *   // Handle errors
 * })
 */
module.exports = persist;
