/*connect to mongodb*/
const mongodb = require('mongodb')

/*extract mongoclient constructor*/
const MongoClient = mongodb.MongoClient;
let _db;
/* _ is used to signal this variable will be used only in this file*/
const mongoConnect = ( callback ) => {

    MongoClient.connect('mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        console.log('CONNECTED TO DATABASE!!');
        
        _db = client.db();//giving access to database.
        //client.db("shop")// can give db name inside or
        //from above connect /*:Nodejspassword@cluster0.rj3wp52.mongodb.net/<"database name to connect">?etryWrites=tr*/
        
        callback()
    })
    .catch(err => {
        console.error(err);
        throw err;
    });
}

const getDb = ( ) => {
    if(_db){
        return _db;
    }
    throw 'no DataBase found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;