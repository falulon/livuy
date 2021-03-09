const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseArchive = require('mongoose-archive');


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


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
        },
     images: [ImageSchema]

    
});

commentSchema.plugin(mongooseArchive);

module.exports = mongoose.model("Comment", commentSchema);

