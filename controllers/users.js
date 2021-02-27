const User = require('../models/user');

module.exports.home = (req, res) => {
    res.render('home');
};

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'נרשמת בהצלחה. עכשיו צרו קשר כדי שנאשר את פרטי הגישה ! ');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    let redirectUrl = req.session.returnTo || '/campgrounds';
    redirectUrl += '?updated';
    delete req.session.returnTo;
    req.app.locals.updatedPage = true;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/home?updated');
}



module.exports.forgot = 
(req, res) => {
  res.render('users/forgot', {
    user: req.user
  });
}


module.exports.showReset =
 (req, res) =>{
  res.render('users/reset', {token: req.params.token}); 
 }
 

module.exports.all = async (req, res) => {
    const users = await User.find({});
    res.render('users/all', {users})
}

module.exports.approve = async (req, res) => { 
    const {id} = (req.params); 
    const user = await User.findById(id);
    user.isApproved = true; 
    user.save();
    req.flash('success', "Approved!");
    res.redirect('/users/all?updated');
}

module.exports.lock = async (req, res) => { 
    const {id} = (req.params); 
    const user = await User.findById(id);
    user.isApproved = false; 
    user.save();
    req.flash('success', "User locked!");
    res.redirect('/users/all?updated');
}
