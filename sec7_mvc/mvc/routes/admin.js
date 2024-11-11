const express = require('express');

const adminData = require('../controller/productController');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminData.getProductAdmin );

// /admin/add-product => POST
router.post('/add-product', adminData.postProductAdmin);

module.exports = router;
