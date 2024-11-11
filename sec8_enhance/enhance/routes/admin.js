const express = require('express');

const adminData = require('../controller/admincontroller');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminData.addProductAdmin);

router.get('/products', adminData.getProductAdmin);
/*
router.get('/edit-products', shopProduct); */

// /admin/add-product => POST
router.post('/add-product', adminData.postProductAdmin);

module.exports = router;
