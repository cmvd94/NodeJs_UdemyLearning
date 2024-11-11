const ProductClass = require('../model/Product');
const CartClass = require('../model/cart');

exports.getProductList = (req, res, next) => {
    //calling fetch directly using class name
   // const products = Product.fetchall( );
   
   //make it as call back function because inside fetch there is read & write operation which work asycn.
   ProductClass.fetchall( (products) => {
        res.render('shop/product-list', {
        prods: products,//sending data
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
    CartClass.getCart( cartList => {
        ProductClass.fetchall( products =>{
            const cartProduct = []; 
            for(product of products){
                const cartProductData = cartList.products.find(prod => prod.id === product.id)
                if(cartProductData){
                    cartProduct.push({productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: '/your cart',
                products: cartProduct
            })
        })
        
    })
    
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    ProductClass.fetchId(prodId , (product) =>{
        CartClass.addProduct(product)            
    })
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    ProductClass.fetchId(prodId , (product) =>{
        CartClass.deleteProduct(prodId, product.price);
        res.redirect('/cart')
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

exports.getProduct = (req, res, next) => {
    
    //so dynamic route data is stored in req.params... productId is thae name which we given in route.
    const prodId = req.params.productId;
    ProductClass.fetchId(prodId, (productDetail) => {
        res.render('shop/product-detail',{
            path: '/products',
            product: productDetail,
            pageTitle: productDetail.pageTitle
        });   
    })  
}