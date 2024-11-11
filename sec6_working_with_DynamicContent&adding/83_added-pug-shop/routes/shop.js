const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  //render can pass data to template. which should have key and value
  //title of page is changed using docTitle
  res.render('shop', {prods: products, docTitle: 'Shop'});
});


module.exports = router;
