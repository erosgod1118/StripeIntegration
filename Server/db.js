const { MongoClient } = require("mongodb");
require('dotenv').config();

let _db;

const client = new MongoClient(process.env.mongoDBConnectionURL);

function initDB(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null);
    }
    
    client.connect(process.env.mongoDBConnectionURL)
        .then(() => {
            _db = client.db(process.env.mongoDBName);
            return callback(null);
        })
        .catch(err => {
            console.error("An error occured connecting to MongoDB: ", err);
            return callback(err);
        });
}

function getDB() {
    return _db;
}

module.exports = {
    getDB,
    initDB
}