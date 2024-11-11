const ProductClass = require('../model/Product');

exports.addProductAdmin = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product'
    }
  );
}

exports.postProductAdmin  = (req, res, next) => {
    //const name as based on navigation.ejs file
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const createEntry = new ProductClass(title, imageUrl, price, description);
    createEntry.save()
    res.redirect('/');
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
