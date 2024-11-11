const ProductModel = require('../model/Product');
const CartClass = require('../model/cart');

//in .then( [ ] ) destructing data from database 

/*get all product list ...product page*/
exports.getProductList = (req, res, next) => {
    /*in findall we can configure with some option. where condition,
     so we can select specific set of data*/
    ProductModel.findAll()
    .then( (product) => {
        res.render('shop/product-list', {
            prods: product,//sending data
            pageTitle: 'Shop',
            path: '/products'
            });

    })
    .catch(err => console.error(err))    
}

/*get all product list ... index page*/
exports.getIndex = (req, res, next) => { 
    
    ProductModel.findAll()
    .then( (product) => {
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
        ProductModel.fetchall( products =>{
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
    ProductModel.fetchId(prodId , (product) =>{
        CartClass.addProduct(product)            
    })
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    ProductModel.fetchId(prodId , (product) =>{
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
    
    ProductModel.findByPk(prodId)
    .then( (product) => { 
        res.render('shop/product-detail',{
            path: '/products',
            product: product,
            pageTitle: product.pageTitle
        });
        
    })
    .catch(err => console.error(err))
    
    /* ProductModel.findAll( {where: {id: prodId} } )
    //findall return object in an array even if its a one element
    .then( (product) => { 
        res.render('shop/product-detail',{
                path: '/products',
                product: product[0],
                pageTitle: product[0].pageTitle
        });
          
    })
    .catch(err => console.error(err)) */


}