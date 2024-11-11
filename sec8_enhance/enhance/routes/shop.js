const express = require('express');

const shopProduct = require('../controller/shopController');

const router = express.Router();

router.get('/', shopProduct.getIndex);

router.get('/index', shopProduct.getIndex);

router.get('/products', shopProduct.getProductList);

/*
router.get('/product-details', shopProduct.getProductList);
*/
router.get('/cart', shopProduct.getCart);

router.get('/checkout', shopProduct.getCheckout); 

router.get('/orders', shopProduct.getOrdersList);

module.exports = router;
