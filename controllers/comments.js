const Campground = require('../models/campground');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const comment = new Comment();
    comment.body.unshift(req.body.comment.body); 
    comment.author = req.user._id;
    comment.author_name = req.user.username;
    comment.campground = req.params.id; 
    campground.comments.push(comment);
    await comment.save();
    await campground.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/campgrounds/${campground._id}`);
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
    comment.body.unshift(`${req.body.comment.body} \n\n\n (Last edited on: ${Date().toString().substring(0,10)} 
    ${Date().toString().substring(15,21)})`); 
    await comment.save();
    req.flash('success', 'Comment Saved!');
    res.redirect(`/campgrounds/${campgroundId}`);

}


module.exports.unArchive =  async (req, res) => {
    const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId).where('archivedAt').exists();
        comment.restore();
        req.flash('success', 'The comment is back to be active' );
        res.redirect(`/campgrounds/${id}`);
    }
    
module.exports.archive =  async (req, res) => {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        comment.archive();
        req.flash('success', 'Comment archived!' );
        res.redirect('/campgrounds');
    }
    



module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/campgrounds/${id}`);
}

