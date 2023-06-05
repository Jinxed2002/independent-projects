const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
let database;
async function connect() {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017")
    database = client.db("ajinkya")
}

function getDB() {
    if(!database) {
        throw { message: "database not obtained"}
    }
    return database
}

module.exports = {
    connectToDB: connect,
    getDB: getDB
}