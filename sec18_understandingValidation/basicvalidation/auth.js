const express = require('express')
//const expValidator = require('express-validator');

const router = express.Router()

const authController = require('../controller/authcontroller');
//const { check } = require('express-validator');
const { check } = require('express-validator');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin)

router.get('/reset', authController.getReset);

/*reset password get*/ //:token -> used to create newpassword check
router.get('/reset/:token',authController.newPassword);


router.post('/signup', check('email').isEmail().withMessage('please enter valid email'), authController.postSignup);

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router