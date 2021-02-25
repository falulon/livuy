const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userLanguage: {
        type: String,
        enum: ['ENG', 'HEB', 'ARB'],
        default: 'HEB',
        required: true},
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    isAdmin: {
        type: Boolean,
        default: false}, 
    isApproved: {
            type: Boolean,
            default: false}, 
});

UserSchema.virtual('notUserLanguage').get(function () {
    let arr = ['ENG', 'HEB', 'ARB'];
arr = arr.filter(e => e !== this.userLanguage);
    return arr
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);