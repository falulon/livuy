const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateDictionary, isLoggedIn, isValueAuthor, doubleRefresh} = require('../middleware');
// const Dictionary = require('../models/dictionary');
const dictionary = require('../controllers/dictionary');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.get('/', isLoggedIn, doubleRefresh, dictionary.show)
router.post('/', isLoggedIn, validateDictionary, catchAsync(dictionary.add))

router.get('/index_archived', dictionary.showArchive)

router.get('/:valueId/edit', isLoggedIn, isValueAuthor, catchAsync(dictionary.edit))
router.put('/:valueId/edit', isLoggedIn, isValueAuthor, catchAsync(dictionary.update))
router.put('/:valueId/makeActive',  isLoggedIn, catchAsync (dictionary.unArchive))
router.put('/:valueId/archive',  isLoggedIn, catchAsync (dictionary.archive))

router.delete('/:valueId', isLoggedIn, catchAsync(dictionary.deleteValue))

module.exports = router;