/**
 * Created by studor on 4/3/14.
 */
var should = require('should'),
    db = 'localhost:27017/imgges-test',
    assetModel = require('../lib/assetModel'),
    Promise = require('node-promise').Promise;

describe('MongoDB', function () {
    it('should be online', function(done) {
        assetModel.connect(db);

        assetModel.connection.on('connected', function () {
            // connected
            assetModel.connection.readyState.should.equal(1);
            done();

            assetModel.connection.close(function () {
                // console.log('Mongoose test connection disconnected');
            });
        });

    });

    describe('performs CRUD operations', function () {
        beforeEach(function () {
            assetModel.connect(mongodb);
        });

        afterEach(function () {
            assetModel.connection.close(function () {
                // console.log('Mongoose test connection disconnected');
            });
        })
    });
});

