const ProductModel = require('../model/Product');

/*load add-product page, in html code it redirect to POST */
exports.addProductAdmin = (req, res, next) => {
    res.render('admin/add-edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
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
    const product = new ProductModel(title, price, description, imageUrl, null)
    product
      .save()
      .then( (result) => {
          console.log("product created")
          res.redirect('/admin/products');
      })
      .catch( err => console.log(err));    
}



/*list of product in admin menu*/
exports.getProductAdmin = (req, res, next) => {   
    ProductModel
    .fetchAll()
    .then( (product) => {
        res.render('admin/products', {
        prods: product,
        pageTitle: 'admins products',
        path: '/admin/products'
        });
    })
    .catch(err => console.error(err))
}


/*edit-page when admin press edit*/
exports.editProductAdmin = (req, res, next) => {
     //query paramter in url ?edit=true  
    const editMode = req.query.edit;
    console.log("edit mode")
    console.log(editMode);
    if(!editMode){
        res.redirect('/');
    }else{
        const prodId = req.params.productId;
        //.getProduct squelize magic..Because we didnt define . getSchemaname asper table
        ProductModel.findById( prodId )
        .then( (product) => {
          if(!product){
            //if no product
            return res.redirect('/')
          }
            res.render('admin/add-edit-product', {
            pageTitle: 'EDIT Product',
            path: '/admin/edit-product',//if add-product it highlights add-ptoduct sec in navigation,no
            editing: editMode,
            product: product
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
  
  console.log(`update ---${prodId}`)
  const product = new ProductModel(
    upadateTilte,
    updatedPrice,
    updatedDescription,
    updatedImageUrl,
    //new mongoDb.ObjectId(prodId)//while sending also we have sent as ID ObjectStructure
    prodId//added new mongoDb.ObjectId(prodId) in constructor
  );
  product
    .save()
    .then( () => {
      console.log("UPDATED")
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err))
  

}


/* POST delete product by admin*/
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  ProductModel.deleteById(prodId)
  .then( () => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err))
}
