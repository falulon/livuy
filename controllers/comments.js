const Campground = require('../models/campground');
const Comment = require('../models/comment');
const { cloudinary } = require("../cloudinary");

module.exports.createComment = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const comment = new Comment();
    comment.body.unshift(req.body.comment.body); 
    comment.author = req.user._id;
    comment.author_name = req.user.username;
    comment.campground = req.params.id; 
    comment.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.comments.push(comment);
    await comment.save();
    await campground.save();
    req.app.locals.updatedPage = true;
    req.flash('success', 'Created new comment!');
    res.redirect(`/campgrounds/${campground._id}?updated`);
}


module.exports.editComment = async (req, res) => {
    const { id, commentId } = req.params;
    campgroundId = id; 
    const comment = await Comment.findById(commentId)
    if (!comment) {
        req.flash('error', 'Cannot find that Update Text!');
        return res.redirect('/campgrounds');
    }
    res.render('comments/edit', { campgroundId, comment });
}



module.exports.updateComment = async (req, res) => {
    const { id, commentId } = req.params;
    campgroundId = id;     
    const comment = await Comment.findById(commentId);
    comment.body.unshift(`${req.body.comment.body} \n\n\n (✏ ${Date().toString().substring(3,15)})`); 
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        comment.images.push(...imgs);
}
    await comment.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await comment.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.app.locals.updatedPage = true;
    req.flash('success', 'Comment Saved!');
    res.redirect(`/campgrounds/${campgroundId}?updated`);

}


module.exports.unArchive =  async (req, res) => {
    const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId).where('archivedAt').exists();
        comment.restore();
        req.app.locals.updatedPage = true;
        req.flash('success', 'The comment is back to be active' );
        res.redirect(`/campgrounds/${id}?updated`);
    }
    
module.exports.archive =  async (req, res) => {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        comment.archive();
        req.app.locals.updatedPage = true;
        req.flash('success', 'Comment archived!' );
        res.redirect('/campgrounds?updated');
    }
    



module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    let comment = await Comment.findById(commentId);
    if (!comment) comment = await Comment.findById(commentId).where('archivedAt').exists();
    if (comment.images.length > 0) { 
        console.log("deleting images");
        for (let img of comment.images) {
            console.log(img.filename); 
            await cloudinary.uploader.destroy(img.filename, {type: 'upload'}, function(error,result) {
                console.log(result, error) });
        }}; 
    await Campground.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await comment.deleteOne();
    // await Comment.findByIdAndDelete(commentId);
    req.app.locals.updatedPage = true;
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/campgrounds/${id}?updated`);
}

