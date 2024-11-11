const { where } = require('sequelize');
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
    ProductModel.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then( () => {
      res.redirect('/admin/products');
    })
    .catch( err => console.log(err));    
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
        ProductModel.findByPk( prodId )
        .then( (product) => {
        if(!product){
            //if no product
            return res.redirect('/')
        }else{
            console.log(product)
            res.render('admin/add-edit-product', {
            pageTitle: 'EDIT Product',
            path: '/admin/edit-product',//if add-product it highlights add-ptoduct sec in navigation,no
            editing: editMode,
            product: product
            });
          }
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

  ProductModel.findByPk(prodId)
  .then( (product) => {
    product.title = upadateTilte;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = updatedImageUrl
    return product.save()
  })
  .then( () => {
    res.redirect('/admin/products');
  })
  .catch(err => console.error(err))
  

}

/*list of product in admin menu*/
exports.getProductAdmin = (req, res, next) => {   
    ProductModel.findAll()
    .then( (product) => {
        res.render('admin/products', {
        prods: product,
        pageTitle: 'admins products',
        path: '/admin/products'
        });
    })
    .catch(err => console.error(err))
}

/* POST delete product by admin*/
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  
  ProductModel.destroy({where: {id : prodId}})
  .then( () => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err))

  /* ProductModel.findByPk(prodId)
  .then( (product) => {
    return product.destroy()
  })
  .then( () => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err)) */


}