const express = require('express');

const shopProduct = require('../controller/shopController');

const router = express.Router()

 router.get('/', shopProduct.getIndex);

router.get('/index', shopProduct.getIndex);

router.get('/products/:productId', shopProduct.getProduct);

router.get('/products', shopProduct.getProductList);


// //get cart display carted data in url. but before that server has to what product is carted.so we have 1st create post request while pressing cart button. whereas post req doesnot required url because we are not displaying to user. we just updating to server database which is similar to admin-add-product
// router.get('/cart', shopProduct.getCart);

// /*post can sent data in req.body*/
// router.post('/cart', shopProduct.postCart);

// /*in cart page press order-now move everything to order page*/
// router.post('/create-order', shopProduct.postOrder);

// router.post('/cart-delete-item', shopProduct.postCartDeleteProduct)

// //router.get('/checkout', shopProduct.getCheckout); 

// router.get('/orders', shopProduct.getOrdersList);

/*(/product/:productId)in shop products list if we click details,it redirect to select product page using it ID in url......we have inform express router there is dynamic url ie a variable segment by adding colon and the name from which we can extract the value*/
/* if we write a route for eg delete ie router.get('/products/delete'), if this line present below :productId then delete line excute because : represent dynamic route so it will exeecute what ever comes after /products/: ,so order is important*/ 
/*to get product detail*/




module.exports = router;
