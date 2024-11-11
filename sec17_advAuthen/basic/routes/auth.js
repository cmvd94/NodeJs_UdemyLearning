const express = require('express')

const router = express.Router()

const authController = require('../controller/authcontroller')

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);


router.post('/reset', authController.postReset);

router.post('/login', authController.postLogin)

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout)

/*reset password get*/ //:token -> used to create newpassword check
router.get('/reset/:token',authController.newPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router