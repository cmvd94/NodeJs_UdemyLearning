/* 
import { MongoClient, Database } from "https://deno.land/x/mongo@v0.33.0/mod.ts";


let DB: Database;//define db as database type
// Connecting to a Local Database
export async function connect(){

    const client = new MongoClient();
    //await client.connect("mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
   //await client.connect("mongodb+srv://Nodejs:Nodejspassword@<cluster-id>.mongodb.net/deno?retryWrites=true&authSource=admin");
    await client.connect(
        'mongodb://127.0.0.1:27017/test?retryWrites=true&authSource=admin ');
    
    
    DB = client.database("todo-app");
    console.log('waiting for DB connection')
    console.log(DB)
}

export function getDb(){
    if (!DB) {
        throw new Error('DB not initialized!');
    }
    return DB;
}
 */
import {
    Database,
    MongoClient,
} from 'https://deno.land/x/mongo@v0.33.0/mod.ts';

let db: Database;

export async function connect() {
    const client = new MongoClient();
    /**
     *  REPLACE CONNECTION STRING IF USING ATLAS
     *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
     *  ==================
     *  AWAIT connect TO DATABASEE
     */
    await client.connect(
        'mongodb://127.0.0.1:27017/test?retryWrites=true&authSource=admin'
    );

    db = client.database('todos-app');
}

export function getDb(): Database {
    if (!db) {
        throw new Error('DB not initialized!');
    }
    return db;
}