const express = require('express');

const shopProduct = require('../controller/productController');

const router = express.Router();

router.get('/', shopProduct.getProductList);

module.exports = router;
