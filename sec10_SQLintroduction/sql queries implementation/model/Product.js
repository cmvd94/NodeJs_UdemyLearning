const db = require('../util/database');

module.exports = class Product {
    /*form input structure*/
    constructor(id, title, imageUrl, price, description ) {
        this.id = id,
        this.title  = title,
        this.imageUrl = imageUrl,
        this.price = price,
        this.description = description
       
    }

    /*saving data in sql-DB*/
    save(){
        //VALUES(?, ?, ?, ?) SAFELY insert the value and not to face issue od SQL injection
        // which is a attack pattern where user can insert special data in our input field in webpage 
        //that runs sql as query
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES(?, ?, ?, ?)',[this.title, this.price, this.imageUrl, this.description])
       
    }

    /*fetch all product detail*/
    static fetchall(){
        return db.execute('SELECT * FROM products');     
    }


    /*fetch product detail by id*/
    static fetchId(id){
        return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
    }

    /*delete product by its ID*/
    static deletById(id){

    }

}