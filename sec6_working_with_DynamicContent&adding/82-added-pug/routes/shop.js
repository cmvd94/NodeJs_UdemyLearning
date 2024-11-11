const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  //dynamic template call. dont want to call shop.html instead called shop.pug
  res.render('shop');
});

module.exports = router;
