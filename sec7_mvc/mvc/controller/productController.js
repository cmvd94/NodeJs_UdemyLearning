const Product = require('../model/Product');
const productClass = require('../model/Product');

exports.getProductAdmin = (req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
}

exports.postProductAdmin  = (req, res, next) => {
    console.log("inside post")
    const createEntry = new productClass(req.body.title);
    console.log("inside post after class")
    if(createEntry.save()){
        console.log("error ---")
    }else{
        console.log("---error---")
    }
    res.redirect('/');
  }

exports.getProductList = (req, res, next) => {
    //calling fetch directly using class name
   // const products = Product.fetchall( );
   console.log("inside fetch");
   //make it as call back function because inside fetch there is read & write operation which work asycn.
   Product.fetchall( (products) => {
        res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
        });
    })
}
