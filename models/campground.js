const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const userLanguage = 'ENG';

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    contact: {
        name: String,
        phone: String, 
    },
    titleHEB: String,
    titleARB: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    description: String,
    descriptionHEB: String,
    descriptionARB: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


CampgroundSchema.virtual('wazeLink').get(function () {
    const coordinateY = this.geometry.coordinates[0];
    const coordinateX = this.geometry.coordinates[1];
    if (coordinateX == coordinateY) return "";
    // return `https://www.waze.com/live-map/directions?navigate=yes&to=ll.${coordinateX}%2C${coordinateY}`
    return `waze://?ll=${coordinateX},${coordinateY}&n=T`
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);