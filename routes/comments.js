const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
// const Campground = require('../models/campground');
// const Comment = require('../models/comment');
const comments = require('../controllers/comments');
// const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.post('/', isLoggedIn, upload.array('image'), validateComment, catchAsync(comments.createComment))

router.get('/:commentId/edit', isLoggedIn, isCommentAuthor, catchAsync(comments.editComment))
router.put('/:commentId/edit', isLoggedIn, isCommentAuthor, upload.array('image'), catchAsync(comments.updateComment))
router.put('/:commentId/makeActive',  isLoggedIn, catchAsync (comments.unArchive))
router.put('/:commentId/archive',  isLoggedIn, catchAsync (comments.archive))

router.delete('/:commentId', isLoggedIn, catchAsync(comments.deleteComment))

module.exports = router;