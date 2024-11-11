/*connect to mongodb*/
const mongodb = require('mongodb')

/*extract mongoclient constructor*/
const MongoClient = mongodb.MongoClient

const mongoConnect = ( callback ) => {

    MongoClient.connect('mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        console.log('CONNECTED TO DATABASE!!')
        callback(client);
    })
    .catch(err => console.error(err));
}
/*we connect mongodb for every operation we do.*/
/*this is not effecient way*/

module.exports = mongoConnect;
