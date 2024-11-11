const ProductClass = require('../model/Product');


exports.getProductList = (req, res, next) => {
    //calling fetch directly using class name
   // const products = Product.fetchall( );
   
   //make it as call back function because inside fetch there is read & write operation which work asycn.
   ProductClass.fetchall( (products) => {
        res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products'
        });
    })
}

exports.getIndex = (req, res, next) => { 

    ProductClass.fetchall( (products) => {
        res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
        });
    })
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart',{
        path: '/cart',
        pageTitle: '/your cart'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout',{
      path: '/checkout',
      pageTitle: 'checkout'  
    })
}
exports.getOrdersList= (req, res, next) => {
    res.render('shop/orders',{
      path: '/orders',
      pageTitle: 'orders'  
    })
}