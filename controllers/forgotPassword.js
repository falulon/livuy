const express = require('express');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const sgMail = require('@sendgrid/mail'); 




  const assignToken = 
  catchAsync ( 
      async (req, res, next) => { 
    const {email} = req.body;
    const token = email.slice(0,2) + 'ROYIM' + Math.floor(Math.random()*Date.now()) + "Livuy" + email.slice(3,5);
    const user = await User.findOne({ email}) ; 
      if (!user) {
        req.flash('error', 'No account with that email address exists.');
        return res.redirect('/forgot');
      }
    
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      console.log(user);
      await user.save();
      req.user ={ email,  token};
      next();    

    }
  )

  const emailToken = catchAsync (async (req,res, next) => {
   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: (req.user.email), // Change to your recipient
    cc: 'faluli@gmail.com',
    from: (process.env.SENDGRID_VERIFIED_EMAIL), // Change to your verified sender
    subject: 'Your LivuyR password is...',
    text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        (process.env.hostURL)+"/reset/" + req.user.token + "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n "  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
      next();
    })
    .catch((error) => {
      console.error(error);
    })
})


const checkToken = 
catchAsync(
async (req, res, next) => {
  const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}) ;
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    res.redirect('/forgot');
  }
  req.user = user; 
  next();
})

const resetPass =
  async (req,res) => {
    user = req.user;
    Object.assign(user, 
    { 
      password: req.body.password,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined});
      await user.setPassword(user.password);
      await user.save();
      req.flash('success', 'Your new password is set! Try not to forget it this time ;-) Here is a practice:');
      res.redirect('/login');
    }

const tokenSent = 
  async (req, res) =>{
    req.flash('success', 'Please check your email for the password reset link');
   res.redirect('/login');
    }


module.exports = {
    assignToken,
    emailToken,
    tokenSent,
    checkToken,
    resetPass
 }