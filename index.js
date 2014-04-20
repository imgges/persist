var persist = require('./lib/persist');

/**
 * @param String db MongoDB connection string
 * @param Array data
 * @return promise
 * This module's use of promises conforms to the Promises/A+ standard.
 * Operate on the singular result argument passed to a `then` callback, as follows:
 *
 * persist(db, data).then(function (result) {
 *   // Operate on the mongodb documents
 * }, function (error) {
 *   // Handle errors
 * })
 */
module.exports = persist;
