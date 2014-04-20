/**
 * @model Asset
 */

var options,
    AssetSchema,
    mongoose = require('mongoose'),
    Model = require('./Model'),
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;

options = {
    versionKey : false
};

AssetSchema = new Schema({
    id         : { type : ObjectId },
    url        : { type : String, unique: true },
    hash       : { type : String, unique: true },
    hits       : { type : Number, default: 0 },
    data       : { type : Schema.Types.Mixed },
    created_at : { type : Date, default: Date.now },
}, options);

module.exports = new Model(mongoose.model('Asset', AssetSchema));
