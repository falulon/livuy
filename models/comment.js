const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseArchive = require('mongoose-archive');

const commentSchema = new Schema({
    body: [String],  
    date: {
        type: Date,
        default: Date() 
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    author_name: {
        type: String
        }, 
    campground: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Campground'
        }
    
});

commentSchema.plugin(mongooseArchive);

module.exports = mongoose.model("Comment", commentSchema);

