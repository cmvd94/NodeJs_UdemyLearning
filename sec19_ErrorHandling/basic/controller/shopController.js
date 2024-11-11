const ProductModel = require('../model/Product');
const OrderModel = require('../model/order')

/*get all product list ... index page*/
exports.getIndex = (req, res, next) => { 
    
    /*ProductModel.find().cursor().next() // when we want pointer in mongoose then we should do this*/
    ProductModel.find()//in mongoose it wont gives us pointer instead gives as data
    .then( (product) => {
        res.render('shop/index', {
            prods: product,
            pageTitle: 'Shop',
            path: '/',
            //isAuthenticated: req.session.isLoggedIn
            /* //isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken()//this method is provided by csrf middleware
            //is added to html with name _csrf because package will check for this name */
            });
    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
}

/*get all product list ...product page*/
exports.getProductList = (req, res, next) => {
    /*ProductModel.find().cursor().next() // when we want pointer in mongoose then we should do this*/
    ProductModel.find()//in mongoose it wont gives us pointer instead gives as data array
    .then( (product) => {
        res.render('shop/product-list', {
            prods: product,//sending data
            pageTitle: 'Shop',
            path: '/products',
            //isAuthenticated: req.session.isLoggedIn
            });

    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });   
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
            pageTitle: product.pageTitle,
            //isAuthenticated: req.session.isLoggedIn
        });
        
    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
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
            products: products,
            //isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });   
}

/*POST request raised once cart is pressed...in this instance store it in db*/ 
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(`req.user : ${req.user}`);
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
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
};


/*"POST.   in cart page press order-now move everything to order page*/
exports.postOrder = (req, res, next) => {
    
    req.user
    .populate('cart.items.productId')
    .then( user => {
        const productArray = user.cart.items.map(i => {
            // return {product: i.productId, quantity: i.quantity}
            return {product: i.productId._doc, quantity: i.quantity}
        });/****************************._doc**************** */
        console.log(productArray);
        const order = new OrderModel({
            user: {
                name: req.user.email,
                userId: req.user
            },
            products: productArray
        });
        return order.save();
    })
    .then( () => {
        req.user.cart.items = []
        req.user.save();
    })
    .then( (result) => {
        res.redirect('/orders')
    })    
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
}

/* once product moved from cart. now its time to display order page*/
exports.getOrdersList= (req, res, next) => {
    OrderModel.find( {'user.userId': req.user._id} )
    .then( orderArray => {
        //console.log(orders)
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'orders',
            orders: orderArray,
            //isAuthenticated: req.session.isLoggedIn
          })
    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
};