//const getDb = require('../util/database').getDb;
const mongodb = require('mongodb')
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, id){
        this.title = title,
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        //this._id = id;//for new product we dont set , mongodb will automatically sets.
        //this is define for handling update;
        this._id = id ? new mongodb.ObjectId(this._id) : null;//since while accessing id we're repeatedly using this.so defined mongodb command in constructor
    }    

    save(){
        const db = getDb();
        let dbOp ;
        if(this._id){
            //update product
            console.log(`update--this._id ${this._id}`)
            dbOp = db
            .collection('products')
            //.updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
            .updateOne({_id: this._id}, {$set: this});
        }else{
            //creating product or add-product
            dbOp = db
            //regarding: collection-> if doesnt exist . it will create once data is entered
            .collection('products')
            .insertOne(this)
        }
        return dbOp
            .then( result => {
                console.log(result);
            })
            .catch( err => console.log(err))
        //by returing will treat overall as a promise
    }

    static fetchAll() {
        const db = getDb();
        return (db.collection('products')
            .find()//find will return pointer, Does do return data. because of 100of data available in db. so use .toarray to send data 
            .toArray()
            .then( products => {
               // console.log(`inside fetchall ${products}`);
                return products
            })
            .catch( err => console.log(err))
        )
    }

    static findById(prodid){
        // how get request is GET /products/66ac96c77f3d69ae87fb76b9
        //mongodb stored data in bson format.
        // mongodb can store special type of data (ie like id which is generated).
        //_id: ObjectId("66ac96c77f3d69ae87fb76b9"); this is not javascriptType. 
        //ObjectId is a object provide by mongoDb
        const db = getDb();
        const id = new mongodb.ObjectId(prodid)
        return (db.collection('products')//.find({_id: prodid})//here prodid is just a string. but if we check database. id is ObjectId
            .find({_id: id })//creating ObjectId.
            .next()//find will give only cursor, that mongodb doesnt know i will get only one data./so next , in this the last document that was returned by find 
            //.toArray()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch( err => console.log(`err--${err}`))
        )
    }

    static deleteById(prodId){
        const db = getDb();
        return db
          .collection('products')
          .deleteOne({_id: new mongodb.ObjectId(prodId)})
          .then( result => {
            console.log('DELETED');
          })
          .catch( err => console.log(`err--${err}`));
    }
}


module.exports = Product;