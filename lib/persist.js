var assetModel = require('./assetModel'),
    Promise = require('bluebird');

module.exports = function (db, data) {
    return new Promise(function (resolve, reject) {
        var images = data.images;

        console.log('>> connecting to ' + db);

        // connect to mongodb
        assetModel.connect(db);

        assetModel.connection.on('error', function(error) {
            throw new Error(error);
        });

        var assetLoadPromises = [];

        images.forEach(function (image) {
            // promise to generate a shortened URL.
            var assetPromise = assetModel.generate(image);

            assetLoadPromises.push(assetPromise);

            // gets back the short url document, and then retrieves it
            assetPromise.then(function(mongodbDoc) {
                // console.log('>> created short URL: %s', mongodbDoc.hash);
                // assetModel.retrieve(mongodbDoc.hash).then(function(result) {
                //     console.log('>> retrieve result:');
                //     console.log(result);
                //     process.exit(0);
                // }, function(error) {
                //     if (error) {
                //         throw new Error(error);
                //     }
                // });
            }, function (error) {
                if (error) {
                    throw new Error(error);
                }
            });
        });

        // resolves after all promises have been resolved - if one fails, they all do
        Promise.all(assetLoadPromises).then(
            function (result) {
                assetModel.connection.close();
                resolve(result);
            },
            function (error) {
                if (error) {
                    throw new Error(error);
                }
            }
        );
    });
};
