const express = require('express');

const error = require('../controller/Errorcontroller');

const router = express.Router();

router.get('/500', error.get500);

router.get('/400', error.get404);


module.exports = router;