const { validationResult } = require('express-validator');
const ProductModel = require('../model/Product');

/*load add-product or edit page, in html code it redirect to POST */
exports.addProductAdmin = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
      //isAuthenticated: req.session.isLoggedIn
    }
  );
}


/*POST add-product by admin*/
exports.postProductAdmin  = (req, res, next) => {
    //const name as based on navigation.ejs file
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const error = validationResult(req);

    /*input value validate , it check is error here, if so we redirect to same page with same user input 
    instead of only redirecting*/ 
    if(!error.isEmpty()){
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'add Product',
        path: '/admin/edit-product',
        editing: false,//if product edit mode
        hasError: true,//used for validation. if any input value wrong then this is set
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description
        },
        errorMessage: error.array()[0].msg,//used to display incorerect error message
        validationErrors: error.array()//used to highligh the specific field which user input is not passed validation
        //isAuthenticated: req.session.isLoggedIn
        
      });
      
    } else {
      
      const product = new ProductModel({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // userId: req.session.user._id //both method are correct
        userId: req.user// we can assign obj, but mongoose will pick id from the object
        
      });
    product
    .save()//in mongodb we created save method. but in this it is mongoose predefined
      .then( (result) => {
          console.log("product created")
          res.redirect('/admin/products');
        })
      .catch( err => console.log(err));    
    }
    
  }



/*list of product in admin menu*/
exports.getProductAdmin = (req, res, next) => {   
    ProductModel
    .find( {userId: req.user._id})//will display only product which these user created
    //.select('title')
    //.populate('userId')
    .then( (product) => {
        console.log(product);
        res.render('admin/products', {
        prods: product,
        pageTitle: 'admins products',
        path: '/admin/products',
        //isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.error(err))
}


/*edit-page when admin press edit*/
exports.editProductAdmin = (req, res, next) => {
     //query paramter in url ?edit=true  
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }else{
        const prodId = req.params.productId;
        ProductModel.findById( prodId )
        .then( (product) => {
          if(!product){
            //if no product
            return res.redirect('/')
          }
            res.render('admin/edit-product', {
            pageTitle: 'EDIT Product',
            path: '/admin/edit-product',//if add-product it highlights add-ptoduct sec in navigation,no
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
            //isAuthenticated: req.session.isLoggedIn

            });
          
        })
    }   
}


/* "POST" update detail after edit by admin*/
exports.editPostProductAdmin = (req, res, next) => {
  const prodId = req.body.productId;
  const upadateTilte = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description

  const error = validationResult(req);
  if(!error.isEmpty()){
    res.status(422).render('admin/edit-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: upadateTilte,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array()
      //isAuthenticated: req.session.isLoggedIn

    });
    
  } else { 

    
    ProductModel.findById(prodId)
    .then(product => {//mongoose special
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title =  upadateTilte;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save()
      .then( () => {
        console.log("UPDATED")
        res.redirect('/admin/products');
      })
    })
    .catch(err => console.error(err))
  }
  

}


/* POST delete product by admin*/
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //ProductModel.findByIdAndDelete(prodId)
  ProductModel.deleteOne({_id: prodId, userId: req.user._id})
  .then( () => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err))
}
