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


const rootDir = require('../util/path');
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
    constructor(title, imageUrl, description, price ) {
        this.title  = title,
        this.imageUrl = imageUrl,
        this.price = price,
        this.description = description
       
    }
    save(){
        
        getAllReadData( (products) => {
            products.push(this);
            fs.writeFile(dataDir, JSON.stringify(products), err => {
            console.log(err);
            })
        });
       
    }

    // static allows to access function with creating obj using class
    static fetchall( callBack ){
        getAllReadData(callBack);          
    }

}