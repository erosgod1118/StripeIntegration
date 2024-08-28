const { MongoClient } = require("mongodb");

let _db;

const client = new MongoClient(process.env.MONGODB_CONNECTION_URL);

function initDB(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null);
    }
    
    client.connect(process.env.MONGODB_CONNECTION_URL)
        .then(() => {
            _db = client.db(process.env.MONGODB_DBNAME);
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