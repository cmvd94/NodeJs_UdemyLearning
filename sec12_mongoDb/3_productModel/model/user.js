const mongoDb = require('mongodb');
const { getDb } = require('../util/database');


class User{
    constructor(username, email){
        this.username = username;
        this.email = email;
    }
    //first user is created in mongoDb compass

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users')
        .findOne({_id: new mongoDb.ObjectId(userId)})
        //findOne will not return pointer ,it will return obj
    }
}

module.exports = User;