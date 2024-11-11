const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sendGridTransport = require("nodemailer-sendgrid-transport");


const UserModel = require('../model/user');

/*return configuration that nodemailer can use sendgrid*/
// const transporter = nodemailer.createTransport(sendGridTransport( {
//     auth:{
//         api_key: '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'
//         //api-key generated from sendgrid website
//     }
// }));

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      message: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    /*at present we're not checking for valid email. bcz we will learn in adv authentication module & VALIDATION later*/
    UserModel.findOne( {email: email})
        .then( userDoc => {
            if(userDoc){
                req.flash('error', 'email already in use');
                return res.redirect('/signup')
            }else{
                //encrypt password
                return bcrypt
                .hash(password, 12)
                .then( hashPassword => {
                  const user = new UserModel( {
                      email: email,
                      password: hashPassword,
                      cart: {
                          items: []
                      }
                  })
                  return user.save();
                })
                .then( () => {
                    console.log(`email -${email}`)
                    /*sending mail*/
                  /*  transporter.sendMail( {
                        to: email,
                        from: 'vishnudassonyz2@gmail.com',
                        subject: 'sending email',
                        html: '<h1> you successfully signed up!!!</h1>'
                    })*/
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })

};  

/*login page*/
exports.getLogin = ( req, res, next ) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    console.log('inside login')
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        message: message
        //isAuthenticated: req.session.isLoggedIn
        });
}

/*POST after pressing login store in db*/
exports.postLogin = ( req, res, next ) => {
    //req.session created by session middleware
    const email = req.body.email;
    const password = req.body.password;

    UserModel.findOne({email: email})
    .then( user => {
        if( user ){
            bcrypt.compare(password, user.password)//compare return true if passwod is correct
            .then( boolean => {
                if(boolean){
                    //req.session.userId = user;// since it is mongoose model. no need to create obj again
                    //storing usermodel in session it wil store as pure obj. rare than schema which we defined
                    console.log('You loggedIn');
                    req.session.userId = user._id;
                    req.session.isLoggedIn = true
                    return req.session.save(err => {
                        if(err) console.log(err);
                        console.log('created')
                        res.redirect('/');
                    })  
                }else{
                    req.flash('error', 'Invalid password');
                    res.redirect('/login');
                } 
            })
            .catch(err => {
                res.redirect('/login');
            })

        }else{
            req.flash('error', 'Invalid email');
            res.redirect('/login')
        }
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
