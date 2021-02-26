const { campgroundSchema, commentSchema, dictionarySchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Dictionary = require('./models/dictionary');
const Campground = require('./models/campground');
const Comment = require('./models/comment');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated() || (req.user.isApproved == false)) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first! If it is your first login, contact support to unlock your username ');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)  && (!req.user.isAdmin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)  && (!req.user.isAdmin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateDictionary = (req, res, next) => {
    const { error } = dictionarySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isValueAuthor = async (req, res, next) => {
    const { valueId } = req.params;
    const value  = await Dictionary.findById(valueId);
    if (!value.author.equals(req.user._id)  && (!req.user.isAdmin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/dictionary`);
    }
    next();
}


module.exports.isAdmin = async (req,res, next) => {
    if (!req.user.isAdmin) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/`);
    }
    next();
}