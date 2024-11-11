const express = require('express');

const error404 = require('../controller/404controller');

const router = express.Router();


router.get('*',error404.pageNotfound);

module.exports = router;