const ProductModel = require('../model/Product');

/*get all product list ... index page*/
exports.getIndex = (req, res, next) => { 
    
    ProductModel.fetchAll()
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
    ProductModel.fetchAll()
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
    ProductModel.findById(prodId)
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
    //console.log(`getcart  req.user.cart ${req.user.cart}`)
    //console.log(`getcart  req.user ${req.user}`)
    req.user
    .getCart()
    .then( cart => {
        //console.log(`cart ${cart}`)
        return cart
            .getProducts()
            .then( products => {
                //console.log(`products -${products}`)
                res.render('shop/cart',{
                    path: '/cart',
                    pageTitle: '/your cart',
                    products: products
                })
            })
            .catch( err => console.log(err))
    })
    .catch(err => console.log(err))
    
}

/*POST request raised once cart is pressed...in this instance store it in db*/ 
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let newQuantity = 1;
    let fetchCart ;
    req.user
       .getCart()
       .then( cart => {
        //console.log(`1st then ${cart}`);
            fetchCart = cart;
            return cart.getProducts( {where: {id: prodId}})
       })
       .then( (arrayProduct) => {
        //console.log(`2nd then ${arrayProduct}`);
            let product ;
            //console.log(arrayProduct);
            if(arrayProduct.length > 0){
                product = arrayProduct[0]
            }
            if(product){
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product
            }
            return ProductModel.findByPk(prodId)
        })
        .then( product => {
            //console.log(`3rd then ${product}`);
            return fetchCart.addProduct(product, {through: {quantity: newQuantity}})
        })
        .then( () => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))          
    
};



/*POST deleting CART product*/
exports.postCartDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    req.user
    .getCart()
    .then( (cart) => {
        return cart.getProducts( {where: {id: prodId}})
    })
    .then(arrayProducts => {
        const product = arrayProducts[0];
        return product.cartItem.destroy();
        //dont want delete product ,just entry in cart_item
    })
    .then( () => {
            res.redirect('/cart');
    })
    .catch(err => console.log(err)) ;
};


/*"POST.   in cart page press order-now move everything to order page*/
exports.postOrder = (req, res, next) => {
    let fetchCart;
    req.user
    .getCart()
    .then(cart => {
        fetchCart = cart;
        return cart.getProducts()
    })
    .then( arrayProduct => {
        return req.user
        .createOrder()
        .then(order => {
            console.log(arrayProduct)
            order.addProducts(arrayProduct.map(product => {
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
            }))
        })
        .catch( err => console.log(err))
    })
    .then( () => {
        //destory product in cart
        return fetchCart.setProducts(null)
    }) 
    .then( ( ) => {
        res.redirect('/order')
    })
    .catch( err => console.log(err))
}

/* once product moved from cart. now its time to display order page*/
exports.getOrdersList= (req, res, next) => {
    req.user
    .getOrders( {include: ['products']} )
    .then( orders => {
        //console.log(orders)
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'orders',
            orders: orders
          })
    })
    .catch(err => console.log(err)) ;
};
    


