const express = require('express');

const adminData = require('../controller/admincontroller');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

///admin/add-product => GET
router.get('/add-product', isAuth, adminData.addProductAdmin);
//get add product redirects to post add-product to store data in database 

// //query parameter ?edit=true.so path that will reach upto ? eg.localhost//:3000/admin/edit-product/_productID_?queryparamter
// //wecan checkits value in controller
router.get('/edit-product/:productId', isAuth, adminData.editProductAdmin);


router.get('/products', isAuth, adminData.getProductAdmin);

// /admin/add-product => POST
/*post can sent data in req.body*/ 
router.post('/add-product', 
    [
        body('title')
        //.isAlphanumeric()
        .isLength({min: 3})
        .trim(),

        body('price').isFloat(),

        body('description')
        .isLength({min: 3, max: 400})
        .trim()
    ], 
    isAuth, adminData.postProductAdmin);

router.post('/edit-product',
    [
        body('title')
        //.isAlphanumeric()
        .isLength({min: 3})
        .trim(),
        
        body('price').isFloat(),

        body('description')
        .isLength({min: 3, max: 400})
        .trim()
    ],
     isAuth, adminData.editPostProductAdmin);


router.post('/delete-product', isAuth, adminData.deleteProduct)

module.exports = router;
