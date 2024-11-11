const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//mongoose work on model, to connect schema/blueprint with name Product
module.exports = mongoose.model('Product', productSchema);
//'Product' mongoose automatically make all letter to lowercase and save in plural. as products