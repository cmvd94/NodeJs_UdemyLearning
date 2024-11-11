const ProductClass = require('../model/Product');
const CartClass = require('../model/cart');

//in .then( [ ] ) destructing data from database 

/*get all product list . list it in product page*/
exports.getProductList = (req, res, next) => {
    ProductClass.fetchall()
    .then( ([product]) => { 
        //since db output is nested array.we are destructuring
        //rows is 1st element of the nested array & arugument data
        res.render('shop/product-list', {
            prods: product,//sending data
            pageTitle: 'Shop',
            path: '/products'
            });
    })
    .catch(err => console.error(err))    
}

/*get all product list . list it in index page*/
exports.getIndex = (req, res, next) => { 
    ProductClass.fetchall()
    .then( ([product]) => { 
        res.render('shop/index', {
            prods: product,
            pageTitle: 'Shop',
            path: '/'
            });
    })
    .catch(err => console.error(err))  
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

/*get product details by its ID*/
exports.getProduct = (req, res, next) => {
    //so dynamic route data is stored in req.params
    //productId is thae name which we given in route.
    const prodId = req.params.productId;
    ProductClass.fetchId(prodId)
    .then( ([product]) => { 
        res.render('shop/product-detail',{
            path: '/products',
            product: product[0],
            //why row is not working because its also array of object,but we need only that obj
            pageTitle: product.pageTitle
        });
        
    })
}