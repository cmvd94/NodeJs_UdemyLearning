/* const fs = require('fs')
const path = require('path')


const rootDir = require('../util/path');
const dataDir = path.join(rootDir, 'data', 'products.json');
//console.log(dataDir)

module.exports = class Product {
    constructor( name ) {
        this.title  = name
    }
    save(){
        let products = [];
        console.log(dataDir)
        fs.readFile(dataDir, (err, filecontent) => {
            if(!err){
               products = JSON.parse(filecontent);
            }
            console.log(`save---push before ${products}`)
            products.push(this);
            console.log(`save---push after ${Object.values(products)}`)
            fs.writeFile(dataDir, JSON.stringify(products), err => {
            console.log(err);
            })
        });
       
    }

    // static allows to access function with creating obj using class
    static fetchall( callBack ){
        fs.readFile(dataDir, (err, filecontent) => {
            if(err){
                console.log("inside if")
                callBack([]);
            }else if(filecontent.length === 0){
                console.log("inside 00000000000000000")
                callBack([]);
            }else{
                console.log("have file")
                callBack(JSON.parse(filecontent))
            }
        });           
    }

} */
///////////////////////////////////alternate/////////////////////////////////////////////
const fs = require('fs')
const path = require('path')
const {v4 : uuid} = require('uuid')

const rootDir = require('../util/path');
const CartClass = require('./cart')
const dataDir = path.join(rootDir, 'data', 'products.json');
//console.log(dataDir)

//while function has callback function we should not just return value.instead we should call with that value
const getAllReadData = (callBack) => {
    fs.readFile(dataDir, (err, filecontent) => {
        if(err){
            console.error(err.message)
        }else if(filecontent.length === 0){
            callBack( [ ] );
        }else{
            callBack(JSON.parse(filecontent))
        }
    });

}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description ) {
        this.id = id,
        this.title  = title,
        this.imageUrl = imageUrl,
        this.price = price,
        this.description = description
       
    }
    save(){
        
        getAllReadData( (products) => {
            if(this.id) {
                //update
                const existingProductIndex = products.findIndex(prod => prod.id == this.id);
                const updateProduct = [...products];
                updateProduct[existingProductIndex] = this;
                fs.writeFile(dataDir, JSON.stringify(updateProduct), err => {
                    console.log(err);
                })
            }else{
                this.id = uuid();
                products.push(this);
                fs.writeFile(dataDir, JSON.stringify(products), err => {
                console.log(err);
                })  
            }
        });
       
    }

    // static allows to access function with creating obj using class
    static fetchall( callBack ){
        getAllReadData(callBack);          
    }

    static fetchId(id, callback){
        getAllReadData( dataList => {
            const productDetail = dataList.find( obj => obj.id === id)
            callback(productDetail);
        })
    }

    static deletById(id){

        getAllReadData( dataList => {
            //console.log(dataList);
            const product = dataList.find(prod => prod.id === id)
            const updatedProduct = dataList.filter( obj => obj.id !== id)
            fs.writeFile(dataDir, JSON.stringify(updatedProduct), err=> {
                if(!err){
                    CartClass.deleteProduct(id, product.price)
                }
            })
        })
    }
}