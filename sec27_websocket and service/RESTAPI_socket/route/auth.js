const express = require('express');
const { body } = require('express-validator');

const authController = require('../controller/authController');
const UserModel = require('../model/user');
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.put('/signup',
    [
        body('email')
          .isEmail()
          .withMessage('Please enter valid email')
          .custom( (value, {req}) => {
            return UserModel.findOne( {email: value})
                .then(user => {
                    if(user){
                        return Promise.reject('email already exists')
                    }
                })
          })
          .normalizeEmail(),

        body('password', 'your password should contain min 5 letters')
          .isLength( {min:5}),
        
        body('name','enter name correctly')
          .trim()
          .not()
          .isEmpty()
    ],
    authController.signup
);

router.post('/login', authController.login)

/*display current status of user*/
router.get('/status', isAuth, authController.getUserStatus)

/*update status of user*/
router.patch('/status', isAuth, authController.patchUpdateStatus);

module.exports = router