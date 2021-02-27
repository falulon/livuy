const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');
const users = require('../controllers/users');
const { isAdmin, isLoggedIn } = require('../middleware');
const forgotPass = require('../controllers/forgotPassword');


router.route('/')
    .get(users.home)


router.route('/home')
    .get(users.home)


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.route('/users/all')
    .get(isLoggedIn, isAdmin,  users.all)
    
router.route('/users/:id/a')
    .post(isLoggedIn, isAdmin, users.approve)
    .put(isLoggedIn, isAdmin, users.lock)

router.route('/forgot')
    .get( users.forgot)
    .post( forgotPass.assignToken, forgotPass.emailToken, forgotPass.tokenSent ) 
  
  router.route('/reset/:token')
    .get(forgotPass.checkToken, users.showReset)
    .post(forgotPass.checkToken, forgotPass.resetPass)
  
module.exports = router;