const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const { fileLoader } = require('ejs');
const { json } = require('express');

const dataDir = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    /*//the problem we have is the cart is not really an object that we wil constantly recreate,not for evey new product that we want to have a new cart. instead there always be a cat in our application and we just to manage the product(ie obj) in there ,so this approach will not suit
    constructor(){
        this.products = [];//contain object which have id and quantity of this product
        this.totalPrice = 0;
        //we need to add, increment & delete cart item
    }*/
    static addProduct(productDetail) {
        //fetch the previews cart
        //analyze the cart => find existing product
        //add new product/ increase quantity
        //add we are just adding product id , quantity and total price
        fs.readFile(dataDir, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            let existingProductIndex;
            let existingProduct;
            let updateProduct;
            const id = productDetail.id
            if(err){
                console.error(err.message)
            }else if(fileContent.length !== 0){
                cart = JSON.parse(fileContent);
                existingProductIndex = cart.products.findIndex( prod => prod.id === productDetail.id)
                existingProduct = cart.products[existingProductIndex];
            }    
            //increase qty or add product
            if(existingProduct){
                updateProduct = {...existingProduct};
                updateProduct.qty = updateProduct.qty + 1;
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updateProduct;
            }else{
                updateProduct = { id: productDetail.id, qty: 1}
                cart.products = [...cart.products, updateProduct];
            } 
            cart.totalPrice = cart.totalPrice +  +productDetail.price;//+infront onvets string to number
            fs.writeFile(dataDir, JSON.stringify(cart), err => {
                console.error(err);
            })
        
        }) 

    }

    static deleteProduct(id, productPrice){
        fs.readFile(dataDir, (err, fileContent) => {
            if(err){
                 return console.error(err.message);
            }
            let cart = JSON.parse(fileContent)
            const updatedCart ={...cart}
            const product = updatedCart.products.find(prods => prods.id === id)
            if(!product){
                return;
            }
            updatedCart.products = updatedCart.products.filter( 
                prods =>  prods.id !== id
                
            )
            updatedCart.totalPrice = updatedCart.totalPrice- (productPrice * product.qty)
            fs.writeFile(dataDir, JSON.stringify(updatedCart), err => {
            console.error(err);
            })

        })

    }

    static getCart( callback ){
        fs.readFile(dataDir, (err, fileContent) => { 
            if(err){
                console.log("no cart item")
            }else{
                const cart = JSON.parse(fileContent)
                callback( cart)
            }
        })
    }
}