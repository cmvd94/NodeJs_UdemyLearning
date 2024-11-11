const UserModel = require('../model/user');

/*login page*/
exports.getLogin = ( req, res, next ) => {
    console.log(req.session.isLoggedIn)
    console.log(req.session)

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
        });
}

/*POST after pressing login store in db*/
exports.postLogin = ( req, res, next ) => {
    //req.session created by session middleware
    UserModel.findById('66b2fc6fd7174398e8f021ab')
    .then( user => {
        //req.session.userId = user;// since it is mongoose model. no need to create obj again
        //storing usermodel in session it wil store as pure obj. rare than schema which we defined
        req.session.userId = user._id;
        req.session.isLoggedIn = true
        req.session.save(err => {
            if(err) console.log(err);
            res.redirect('/');
        })
    })
    .catch(err => console.error(err));

}

/*logout will delete session in db */
exports.postLogout =  ( req, res, next ) => {
    //req.session created by session middleware
    req.session.destroy( (err) => {
        console.log(err);
        res.redirect('/');
    });
}
