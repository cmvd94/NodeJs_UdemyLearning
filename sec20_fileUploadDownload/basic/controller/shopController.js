const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');//constructor

const rootPath = require('../util/path');
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    OrderModel.findById(orderId)
    .then(order => {
        if(!order){
            next(new Error('No order found'))
        }else if(order.user.userId.toString() !== req.user._id.toString()){
            next(new Error('unAuthorised invoice access'))
            
        }
        const invoiceName = 'invoice-'+ orderId+ '.pdf';
        const invoicePath = path.join(rootPath, 'data', 'invoice', invoiceName);
        
        /*creating pdf*/
        let totalPrice = 0;
        const pdfDoc = new PDFDocument();
        res.setHeader( 'Content-Type', 'application/pdf' );
        res.setHeader('Content-Disposition',' inline; filename=" ' + invoiceName +' " ')

        pdfDoc.pipe( fs.createWriteStream(invoicePath));//save a file in server
        pdfDoc.pipe(res);//send to res

        pdfDoc.fontSize(30).text('Invoice', {
            underline: true
        });
        pdfDoc.text('----------------------------')
        order.products.forEach( prod => {
            totalPrice += (prod.quantity * prod.product.price)
            pdfDoc
            .fontSize(20)
            .text(prod.product.title +'-' + prod.quantity + '*' + prod.product.price + '=' + (prod.quantity * prod.product.price) )
            
        })
        pdfDoc.text('----------------------------')
        pdfDoc.text('total          = '+ totalPrice)
        pdfDoc.end()//pdf ends

        /* fs.readFile(invoicePath, (err, data) => {
            if(err){
                next(err);
            }else{
                res.setHeader( 'Content-Type', 'application/pdf' );
                //res.setHeader('Content-Disposition','attachment; filename="' + invoiceName +'"')//download attachment with proper extension
                res.setHeader('Content-Disposition',' inline; filename=" ' + invoiceName +' " ')
                //set how the content should be servered to client 
                //'inline; filename="' + invoiceName +'"'
                res.send(data);
            }
        }) //if we read like this node will acces the file and read entire content into memory and then return it to response. for bigger file this will take very long before response and memory on server might overflow for multiple incoming request
        */
       /*
        const file = fs.createReadStream(invoicePath) ;
        //read file by chuck of data and send
        res.setHeader( 'Content-Type', 'application/pdf' );
        res.setHeader('Content-Disposition',' inline; filename=" ' + invoiceName +' " ')
        file.pipe(res);//res is a writable stream*/
    })
    .catch(err => {
        next(err)
    })
}