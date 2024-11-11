const express = require('express');

const adminData = require('../controller/admincontroller');

const router = express.Router();


///admin/add-product => GET
router.get('/add-product', adminData.addProductAdmin);
//get add product redirects to post add-product to store data in database 


// //query parameter ?edit=true.so path that will reach upto ? eg.localhost//:3000/admin/edit-product/_productID_?queryparamter
// //wecan checkits value in controller
router.get('/edit-product/:productId', adminData.editProductAdmin);

router.post('/edit-product', adminData.editPostProductAdmin);


router.get('/products', adminData.getProductAdmin);

// /admin/add-product => POST
router.post('/add-product', adminData.postProductAdmin);
/*post can sent data in req.body*/ 

router.post('/delete-product', adminData.deleteProduct)

module.exports = router;
