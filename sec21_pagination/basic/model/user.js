const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
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
