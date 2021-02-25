const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const mapToken = mapBoxToken;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('popupText');
    res.render('campgrounds/index', { campgrounds, mapToken })
}

module.exports.map = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('popupText');
    res.render('campgrounds/map', { campgrounds, mapToken })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
        const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
const reqbody = req.body.campground; 
reqbody.contact = req.body.contact;

    const campground = new Campground(reqbody);
    if ((req.body.coordinatesN) && (req.body.coordinatesE) )
    {
        campground.geometry = { type: 'Point', coordinates: [req.body.coordinatesE, req.body.coordinatesN] };
    }
    else {
        const geometryData = {geometry: geoData.body.features[0] || 0 };
        if (geoData.body.features[0]) { 
           campground.geometry = geometryData.geometry.geometry;
    }}
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new location!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that location!');
        return res.redirect('/campgrounds');
    }
    const foundArchived = await Campground.findById(req.params.id).populate({
        path: 'comments',
        match: {archivedAt: {$exists: true }}});
        
        const commentsArchived = foundArchived.comments;
                     
        res.render('campgrounds/show', { campground, commentsArchived });



}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that location!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const reqbody = {campground: req.body.campground}; 
    reqbody.campground.contact = req.body.contact;
    const campground = await Campground.findByIdAndUpdate(id, { ...reqbody.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/campgrounds');
}