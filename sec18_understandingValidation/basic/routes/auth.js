const express = require('express')
//const expValidator = require('express-validator');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const UserModel = require('../model/user');

const authController = require('../controller/authcontroller');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin)

router.get('/reset', authController.getReset);

/*reset password get*/ //:token -> used to create newpassword check
router.get('/reset/:token',authController.newPassword);


router.post('/signup',
     [  //here check email will find whereever email params is passed in req.(ie in header,body etc)
        //we can also use body here..if we body('password'), then validator only take value from body of password variable
        check('email')
        .isEmail()//here with message will send error for only is email
        .normalizeEmail()//sanitize=> trim extra white space & all to lower case
        .custom( (value, {req}) => {
            return UserModel.findOne({email: value})
            .then( user => {
                if(user){
                   //return Promise.reject('email already in use')
                   throw new Error('email already in use');
                   //promise buildin js obj
                   //throw an error inside of promise & reject with this error message
                }else{
                    return true
                }
            })
        }),
        
        //but here is if we want same error message for all validator then this is the method
        body('password', 'please enter a password with only number & alphabets and atleast 5 characters')
        .isLength({min: 5})
        .isAlphanumeric(),
        //.trim(),//sanitize. remove excess white space

        body('confirmPassword')
        //.trim()
        .custom( (value, {req}) => {
            if(value !== req.body.password){
                throw new Error('confirm password and password are not equal');
            }
            return true;
        })

     ],
      authController.postSignup);
 
router.post('/login', 
    [
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email address.')
          .normalizeEmail(),
        body('password', 'Password has to be valid.')
          .isLength({ min: 5 })
          .isAlphanumeric()
    ], authController.postLogin)

router.post('/logout', authController.postLogout)

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router