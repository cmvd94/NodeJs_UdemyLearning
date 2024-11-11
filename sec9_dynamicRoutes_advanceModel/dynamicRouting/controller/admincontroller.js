const ProductClass = require('../model/Product');

exports.addProductAdmin = (req, res, next) => {
    res.render('admin/add-edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    }
  );
}

exports.postProductAdmin  = (req, res, next) => {
    //const name as based on navigation.ejs file
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const createEntry = new ProductClass(null, title, imageUrl, price, description);
    createEntry.save()
    res.redirect('/');
}

exports.editProductAdmin = (req, res, next) => {
     //query paramter in url ?edit=true  
    const editMode = req.query.edit;
    console.log("edit mode")
    console.log(editMode);
    if(!editMode){
        res.redirect('/');
    }else{
        const prodId = req.params.productId;
        ProductClass.fetchId(prodId, (product) => {
        if(!product){
            console.error("no product found")
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

exports.editPostProductAdmin = (req, res, next) => {
  const prodId = req.body.productId;
  const upadateTilte = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description

  const updatedProduct = new ProductClass(
    prodId, 
    upadateTilte, 
    updatedImageUrl, 
    updatedPrice, 
    updatedDescription );
    
  updatedProduct.save();
  res.redirect('/admin/products');

}

exports.getProductAdmin = (req, res, next) => {
    ProductClass.fetchall( (products) => {
    res.render('admin/products', {
    prods: products,
    pageTitle: 'admins products',
    path: '/admin/products'
    });
  })
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  ProductClass.deletById(prodId);
  res.redirect('/admin/products');
}