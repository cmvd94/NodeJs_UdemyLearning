const express = require('express')

const router = express.Router()

const authController = require('../controller/authcontroller')

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

module.exports = router