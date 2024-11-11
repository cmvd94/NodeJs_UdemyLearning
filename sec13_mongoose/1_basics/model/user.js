

module.exports = mongoose.model('User', userSchema);
// //user model used to identify which user created the product.
// //so we're creating relation btw 2 model.
// //inserting userId for all created product in its object.

// //every user have only one cart. so cart is embedded in user.
// const mongoDb = require('mongodb');
// const { getDb } = require('../util/database');


// class User{
//     constructor(username, email, cart, id){
//         this.username = username;
//         this.email = email;
//         this.cart = cart; //{items: [ { } ]}
//         this._id = id 
//     }
//     //first user is created in mongoDb compass

//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart( product ){
        
//         let newQuantity = 1;
//         const updatedCartItem = [...this.cart.items];
//         const cartProductIndex = this.cart.items.findIndex( cp => {
//             //console.log(`cp.productId --${cp.productId}\n product._id --${product._id}`);
//             return cp.productId.toString() === product._id.toString();
//         })
//         //console.log(`cartProductIndex: ${cartProductIndex}`);
//         if(cartProductIndex >= 0 ){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItem[cartProductIndex].quantity = newQuantity;
//         }else{
//                 updatedCartItem.push({
//                 productId: new mongoDb.ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = {
//             items: updatedCartItem
//             //items: [{...product, quantity: 1}]
//         };
//         //console.log(updatedCart);
//         const db = getDb();
//         //pull all product value and add quantity field ,then stored
//         return db.collection('users')
//                 .updateOne(
//                     {_id: new mongoDb.ObjectId(this._id) },
//                     {$set: {cart: updatedCart}});

//     }

//     /*cart page . todisplay*/
//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map( prod => {
//             return prod.productId;//extracting productid from cart
//         })
//         //console.log(productIds);
//         return db
//           .collection('products')
//           .find( {_id: {$in: productIds}})//check array instead of a single variable.
//           .toArray()//find will send pointer . so toarray will create array with found product
//           .then( productArray => {
//             return productArray.map( product => {
//                 return {...product,
//                     quantity: this.cart.items.find( prod => {
//                         return prod.productId.toString() === product._id.toString();
//                     }).quantity
//                 }
//             })
//           } )
//     }

//     deleteItemFromCart( prodId){
//         const db = getDb();
//         const updatedCartItem = this.cart.items.filter(item => {
//             return item.productId.toString() !== prodId.toString() //filter will return item when condition is true
        
//         })
//         return db.collection('users')
//         .updateOne(
//             {_id: new mongoDb.ObjectId(this._id) },
//             {$set: {cart: {items :updatedCartItem}  } }
//         );

//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart()//return cart product detail with quantity
//             .then(productArray => {
//                 /*creating order collecion  with embedded data*/
//                 const order = {
//                     items: productArray,
//                     user: {
//                         _id: new mongoDb.ObjectId(this._id),
//                         username: this.username
//                     }
//                 }
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(result => {
//                 this.cart = {items: []};//after creating order. we're deleting cart
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         {_id: new mongoDb.ObjectId(this._id)},
//                         {$set: {cart: {items: [] }}}
//                     );
//             });
//     }

//     getOrder(){
//         const db = getDb()
//         return db.collection('orders')
//             .find( {'user._id': new mongoDb.ObjectId(this._id) } )//we can define path. ie inside user _id is defined
//             .toArray();
//     }
//     static findById(userId){
//         const db = getDb();
//         return db.collection('users')
//         .findOne({_id: new mongoDb.ObjectId(userId)})
//         //findOne will not return pointer ,it will return obj
//     }
// }

// module.exports = User;