const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseArchive = require('mongoose-archive');


const opts = { toJSON: { virtuals: true } };

const DictionarySchema = new Schema({
    titleENG: String,
    titleHEB: {
        type: String, 
        required: true}, 
    titleARB: String,
    link: String, 
    date: {
        type: Date,
        default: Date() 
    },
    importantInfo: {
        type: Boolean, 
        default: false},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    author_name: {
        type: String
        }
    
}, opts);


DictionarySchema.plugin(mongooseArchive);

module.exports = mongoose.model('Dictionary', DictionarySchema);