const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            { 
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            } 
        ]
    }
});

//findById, save etc are built-in instance method
//define own instance method..check mongoose document->schema->instance

userSchema.methods.addToCart = function( product ){   
            let newQuantity = 1; 
            const updatedCartItem = [...this.cart.items];
            const cartProductIndex = this.cart.items.findIndex( cp => {
                //console.log(`cp.productId --${cp.productId}\n product._id --${product._id}`);
                return cp.productId.toString() === product._id.toString();
            })
            //console.log(`cartProductIndex: ${cartProductIndex}`);
            if(cartProductIndex >= 0 ){
                newQuantity = this.cart.items[cartProductIndex].quantity + 1;
                updatedCartItem[cartProductIndex].quantity = newQuantity;
            }else{
                    updatedCartItem.push({
                    productId: product._id,
                    quantity: newQuantity
                })
            }
            const updatedCart = {
                items: updatedCartItem
            };
            this.cart = updatedCart;
            return this.save();
}

userSchema.methods.deleteItemFromCart = function( prodId ){
    const updatedCartItem = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString() //filter will return item when condition is true
    })
    this.cart.items = updatedCartItem;
    return this.save()
}
module.exports = mongoose.model('User', userSchema);

// class User{
//     constructor(username, email, cart, id){
//         this.username = username;
//         this.email = email;
//         this.cart = cart; //{items: [ { } ]}
//         this._id = id 
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