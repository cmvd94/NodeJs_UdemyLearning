const ProductModel = require('../model/Product');
const UserModel = require('../model/user')

/*get all product list ... index page*/
exports.getIndex = (req, res, next) => { 
    
    /*ProductModel.find().cursor().next() // when we want pointer in mongoose then we should do this*/
    ProductModel.find()//in mongoose it wont gives us pointer instead gives as data
    .then( (product) => {
        res.render('shop/index', {
            prods: product,
            pageTitle: 'Shop',
            path: '/'
            });
    })
    .catch(err => console.error(err))  
}

/*get all product list ...product page*/
exports.getProductList = (req, res, next) => {
    /*ProductModel.find().cursor().next() // when we want pointer in mongoose then we should do this*/
    ProductModel.find()//in mongoose it wont gives us pointer instead gives as data array
    .then( (product) => {
        res.render('shop/product-list', {
            prods: product,//sending data
            pageTitle: 'Shop',
            path: '/products'
            });

    })
    .catch(err => console.error(err))    
}


/* sent product details by its ID*/
exports.getProduct = (req, res, next) => {
    //so dynamic route data is stored in req.params
    //productId is the name which we given in route.
    const prodId = req.params.productId;  
    ProductModel.findById(prodId)//mongoose findbyid. its also convert id string to mongodb.ObjectId
    .then( (product) => { 
        res.render('shop/product-detail',{
            path: '/products',
            product: product,
            pageTitle: product.pageTitle
        });
        
    })
    .catch(err => console.error(err))
}



/*diplay carted products.... in cart page*/
exports.getCart = (req, res, next) => {
    //console.log(req.user.cart.items);
    req.user
    .populate('cart.items.productId')//now polpulate return with promise
    //.execPopulate()//in ver6 of mongoose using execPopulate it will return promise
    .then( user => {
        //console.log(user.cart.items);
        const products = user.cart.items
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: '/your cart',
            products: products
        })
    })
    .catch(err => console.log(err))    
}

/*POST request raised once cart is pressed...in this instance store it in db*/ 
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    ProductModel.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })  
};


/*POST deleting CART product*/
exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    req.user
    .deleteItemFromCart( prodId ) 
    .then( () => {
            res.redirect('/cart');
    })
    .catch(err => console.log(err)) ;
};


/*"POST.   in cart page press order-now move everything to order page*/
exports.postOrder = (req, res, next) => {
    req.user
    .addOrder()
    .then( (result) => {
        res.redirect('/orders')
    })    
    .catch( err => console.log(err))
}

/* once product moved from cart. now its time to display order page*/
exports.getOrdersList= (req, res, next) => {
    req.user
    .getOrder(  )
    .then( orderArray => {
        //console.log(orders)
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'orders',
            orders: orderArray
          })
    })
    .catch(err => console.log(err)) ;
};
    


